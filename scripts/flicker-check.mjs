/**
 * Hover-flicker regression check.
 *
 * A control that hides or moves itself on hover fires `mouseleave` the moment
 * it reacts, which restores the original state, which puts the control back
 * under the pointer — an infinite loop that reads as a strobing panel. It is
 * invisible to unit tests and to synthetic `dispatchEvent`, because only a real
 * pointer produces the enter/leave pair.
 *
 * So this parks a REAL pointer (CDP `Input.dispatchMouseEvent`) on every
 * hoverable control and counts how many times the visible panel changes while
 * the pointer never moves again. Stable UI: 0. A loop: dozens.
 *
 * Usage:
 *   npm run dev
 *   node scripts/flicker-check.mjs [url]
 *
 * Needs Chrome listening on 9222:
 *   chrome --headless --remote-debugging-port=9222 --user-data-dir=/tmp/cdp
 */

const CDP = "http://127.0.0.1:9222";
const URL_UNDER_TEST = process.argv[2] ?? "http://localhost:8080/regions";
/** Controls to test, and the selector whose visible member we watch for churn. */
const CONTROLS = [".ov", ".chip"];
const WATCH = ".pane";
/** Allows one settle change; anything more is a loop, not a transition. */
const MAX_CHANGES = 2;
const DWELL_MS = 2000;

let ws;
let nextId = 0;
const pending = new Map();
let loaded = false;

const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

/** Evaluates an expression that must return a JSON string. */
const evalJson = async (expression) => {
  const res = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    timeout: 60_000,
  });
  const value = res.result?.result?.value;
  if (value === undefined) throw new Error(`evaluate failed: ${JSON.stringify(res.result)}`);
  return JSON.parse(value);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let target;
  try {
    target = await (await fetch(`${CDP}/json/new?about:blank`, { method: "PUT" })).json();
  } catch {
    console.error(
      `Could not reach Chrome on ${CDP}.\n` +
        "Start it with:\n" +
        "  chrome --headless --remote-debugging-port=9222 --user-data-dir=/tmp/cdp",
    );
    process.exit(2);
  }

  ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
      return;
    }
    if (msg.method === "Page.loadEventFired") loaded = true;
  });
  await new Promise((r) => ws.addEventListener("open", r));

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: URL_UNDER_TEST });
  for (let i = 0; i < 160 && !loaded; i++) await sleep(250);
  if (!loaded) {
    console.error(`${URL_UNDER_TEST} did not load. Is the dev server running?`);
    process.exit(2);
  }
  await sleep(4000); // let hydration finish attaching listeners

  const targets = await evalJson(`JSON.stringify((() => {
    document.documentElement.style.scrollBehavior = "auto";
    const out = [];
    for (const sel of ${JSON.stringify(CONTROLS)}) {
      document.querySelectorAll(sel).forEach((el) => {
        el.scrollIntoView({ block: "center" });
        const r = el.getBoundingClientRect();
        if (r.width && r.height && r.top > 0 && r.bottom < innerHeight) {
          out.push({
            sel,
            label: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 24),
            x: Math.round(r.left + r.width / 2),
            y: Math.round(r.top + r.height / 2),
            scroll: Math.round(scrollY),
          });
        }
      });
    }
    return out;
  })())`);

  if (targets.length === 0) {
    console.error(`No controls matched ${CONTROLS.join(", ")} — did the page render?`);
    process.exit(2);
  }

  console.log(`${URL_UNDER_TEST}\nParking a real pointer on ${targets.length} controls.\n`);

  let worst = 0;
  for (const t of targets) {
    await evalJson(`(() => { scrollTo(0, ${t.scroll}); return "null"; })()`);
    // Start from somewhere neutral so entering the control is a real transition.
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5, buttons: 0 });
    await sleep(250);
    await evalJson(`(() => {
      window.__fl = { count: 0, last: null };
      window.__flTimer = setInterval(() => {
        const el = document.querySelector("${WATCH}.on");
        const key = el ? el.getAttribute("data-r") || "(default)" : "(none)";
        if (window.__fl.last !== null && key !== window.__fl.last) window.__fl.count++;
        window.__fl.last = key;
      }, 25);
      return "null";
    })()`);

    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: t.x, y: t.y, buttons: 0 });
    await sleep(DWELL_MS); // the pointer never moves again

    const changes = await evalJson(
      `(() => { clearInterval(window.__flTimer); return JSON.stringify(window.__fl.count); })()`,
    );
    worst = Math.max(worst, changes);
    const verdict = changes > MAX_CHANGES ? "<-- FLICKER" : "ok";
    console.log(
      `  ${t.sel.padEnd(7)} ${t.label.padEnd(26)} ${String(changes).padStart(3)} changes  ${verdict}`,
    );
  }

  const failed = worst > MAX_CHANGES;
  console.log(
    `\nworst: ${worst} changes while stationary — ${failed ? "FLICKER PRESENT" : "STABLE"}`,
  );
  process.exit(failed ? 1 : 0);
}

await main();
