/**
 * Generates src/styles/regions.css from design-reference/regions-source.html.
 *
 * The Regions page reproduces an approved standalone design, so its stylesheet
 * is derived from that file rather than hand-maintained. Every selector is
 * scoped to `.regions-root` so the design's palette and element styles cannot
 * leak into the rest of the site.
 *
 * Run with: npm run build:regions-css
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "design-reference/regions-source.html");
const OUT = path.join(root, "src/styles/regions.css");
const ROOT = ".regions-root";

const html = fs.readFileSync(SRC, "utf8");
let css = html.slice(html.indexOf("<style>") + 7, html.indexOf("</style>"));

// The page renders inside the site's light-themed layout, so the two dark
// overrides are dropped and the light palette on :root becomes the scope root.
css = css.replace(
  /@media \(prefers-color-scheme: dark\)\{ :root:not\(\[data-theme="light"\]\)\{[\s\S]*?\}\}\n/,
  "",
);
css = css.replace(/:root\[data-theme="dark"\]\{[\s\S]*?\n\}\n/, "");
css = css.replace(/\/\*[\s\S]*?\*\//g, "");

// `ping` is generic enough to collide with another stylesheet later on.
css = css
  .replace(/@keyframes ping\b/, "@keyframes regions-ping")
  .replace(/animation:ping\b/, "animation:regions-ping");

// --- Fixes applied to the source design ------------------------------------

// The industry cards lifted themselves on hover. Translating the element that
// owns the :hover moves it out from under the pointer at the edges, so :hover
// flips off, the card drops back, and it strobes. Lift with shadow instead.
css = css.replace(
  ".ind:hover{border-color:var(--brand);transform:translateY(-2px)}",
  ".ind:hover{border-color:var(--brand);box-shadow:0 10px 28px rgba(21,16,12,.10)}",
);

// Only the `.hit` circle is meant to be the hub's pointer target. The pulse
// ring animates its radius out to 24px — well past `.hit` — so leaving it
// hit-testable lets it sweep across the cursor and retrigger hover.
css = css.replace(".hub .pulse{fill:none;", ".hub .pulse{pointer-events:none;fill:none;");
css = css.replace(".hub .core{fill:var(--c);", ".hub .core{pointer-events:none;fill:var(--c);");

const scopeSelector = (sel) => {
  const s = sel.trim().replace(/\s+/g, " ");
  if (!s) return s;
  if (s === ":root" || s === "body") return ROOT; // palette + page frame land on the wrapper
  if (s === "*") return `${ROOT}, ${ROOT} *`; // box-sizing reset
  if (s.startsWith(":root")) return ROOT + s.slice(5);
  return `${ROOT} ${s}`;
};

// Walk the stylesheet, prefixing every rule's selector at any nesting depth.
let out = "";
let buf = "";
let depth = 0;
let inKeyframes = false;
const indent = () => "  ".repeat(depth);
for (const ch of css) {
  if (ch === "{") {
    const raw = buf.trim().replace(/\s+/g, " ");
    buf = "";
    if (raw.startsWith("@")) {
      inKeyframes = raw.startsWith("@keyframes");
      out += `\n${indent()}${raw} {`;
      depth++;
      continue;
    }
    const scoped = inKeyframes
      ? raw
      : raw
          .split(",")
          .map(scopeSelector)
          .join(",\n" + indent());
    out += `\n${indent()}${scoped} {`;
    depth++;
    continue;
  }
  if (ch === "}") {
    const body = buf.trim().replace(/\s*\n\s*/g, "\n" + indent());
    buf = "";
    depth--;
    out += body ? `\n${"  ".repeat(depth + 1)}${body}\n${indent()}}` : `\n${indent()}}`;
    if (depth === 0) inKeyframes = false;
    continue;
  }
  buf += ch;
}

fs.writeFileSync(
  OUT,
  `/* ============================================================================
   Regions page — GENERATED FILE, do not edit by hand.

   Derived from design-reference/regions-source.html by
   scripts/build-regions-css.mjs, which scopes every selector to ${ROOT} so the
   design renders exactly as approved while its palette and element styles stay
   out of the rest of the site.

   Regenerate with: npm run build:regions-css
   ========================================================================== */
${out.replace(/\n{3,}/g, "\n\n").trim()}\n`,
);
console.log("regions.css regenerated from design-reference/regions-source.html");
