import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { CtaBand, PageHero } from "../components/site-shell";
import regionsBody from "../content/regions-body.html?raw";
import { breadcrumbJsonLd, jsonLd, seo } from "../lib/seo";

const META: Record<string, { hub: string; region: string; count: number; tone: string }> = {
  "south-asia": { hub: "Delhi", region: "South Asia", count: 7, tone: "r1" },
  "asia-pacific": { hub: "Singapore", region: "Asia-Pacific", count: 8, tone: "r2" },
  europe: { hub: "United Kingdom", region: "UK and Europe", count: 8, tone: "r3" },
  mea: { hub: "Dubai", region: "Middle East and Africa", count: 9, tone: "r4" },
};

const SHARED: Record<string, string> = {
  China: "Delhi and Singapore",
  Brazil: "United Kingdom and Dubai",
};

export const Route = createFileRoute("/regions")({
  head: () => {
    const { meta, links } = seo({
      title: "Regions We Serve",
      description:
        "Emma Global supports organisations across four connected regions — South Asia, Asia-Pacific, UK and Europe, and the Middle East and Africa — through operational teams in Delhi, Singapore, the United Kingdom and Dubai.",
      path: "/regions",
    });
    return {
      meta,
      scripts: [jsonLd(breadcrumbJsonLd([{ name: "Regions", path: "/regions" }]))],
      links: [
        ...links,
        // These three families are used only by this page's design.
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:wght@400;500;600&display=swap",
        },
      ],
    };
  },
  component: RegionsPage,
});

function RegionsPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  /**
   * Interaction logic ported from the approved "EMMA Global Regions" design.
   * The markup is injected verbatim, so the behaviour is driven against the
   * mounted DOM exactly as the original script did — scoped to this container.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tip = root.querySelector<HTMLElement>("#regions-tip");
    const mapSvg = root.querySelector<SVGSVGElement>("svg.map");
    const cleanups: (() => void)[] = [];

    let locked: string | null = null;
    let hover: string | null = null;
    const eff = () => hover ?? locked;

    const qsa = <T extends Element>(selector: string) =>
      Array.from(root.querySelectorAll<T>(selector));
    /** `data-*` reader — the markup is injected, so read it straight off the element. */
    const attr = (el: Element, name: string) => el.getAttribute(`data-${name}`) ?? "";
    const meta = (key: string) => META[key] ?? { hub: "", region: "", count: 0, tone: "r1" };

    function apply() {
      const on = eff();
      qsa(".chip").forEach((c) =>
        c.setAttribute("aria-pressed", String((attr(c, "region") || null) === on)),
      );
      qsa<SVGElement>(".zone, .ring, .pt, .hub").forEach((el) => {
        const mine = !!on && attr(el, "rs").split(" ").includes(on);
        const pair = attr(el, "pair");
        if (pair) el.style.fill = `url(#hx-${pair}${mine ? "-hot" : ""})`;
        el.classList.toggle("faded", !!on && !mine);
        el.classList.toggle("hot", mine);
      });
      qsa(".pane").forEach((p) =>
        p.classList.toggle("on", (attr(p, "r") || null) === (on || null)),
      );
      qsa(".pin").forEach((b) => {
        const pane = b.closest(".pane");
        b.textContent =
          locked && pane && locked === attr(pane, "r")
            ? "Pinned — click to release"
            : "Click the map to pin";
      });
    }

    const setHover = (k: string | null) => {
      if (hover !== k) {
        hover = k;
        apply();
      }
    };
    const toggle = (k: string) => {
      locked = locked === k ? null : k;
      hover = null;
      apply();
    };

    function showTip(e: MouseEvent, title: string, sub: string, r: string) {
      if (!tip?.parentElement) return;
      const panel = tip.parentElement.getBoundingClientRect();
      tip.style.left = `${e.clientX - panel.left}px`;
      tip.style.top = `${e.clientY - panel.top}px`;
      tip.style.setProperty("--c", `var(--${meta(r).tone})`);
      tip.innerHTML = `<span class="t2">${sub}</span>${title}`;
      tip.classList.add("on");
    }
    const hideTip = () => tip?.classList.remove("on");

    /** Registers a listener and queues its removal for unmount. */
    const on = <K extends keyof HTMLElementEventMap>(
      el: Element,
      type: K | string,
      fn: EventListenerOrEventListenerObject,
    ) => {
      el.addEventListener(type, fn);
      cleanups.push(() => el.removeEventListener(type, fn));
    };

    qsa<SVGGElement>(".hub").forEach((g) => {
      const k = attr(g, "r");
      on(g, "mouseenter", () => setHover(k));
      on(g, "mousemove", (e) =>
        showTip(
          e as MouseEvent,
          `${meta(k).hub} — ${meta(k).region}`,
          `${meta(k).count} markets`,
          k,
        ),
      );
      on(g, "mouseleave", () => {
        setHover(null);
        hideTip();
      });
      on(g, "focus", () => setHover(k));
      on(g, "blur", () => setHover(null));
      on(g, "click", () => toggle(k));
      on(g, "keydown", (e) => {
        const key = (e as KeyboardEvent).key;
        if (key === "Enter" || key === " ") {
          e.preventDefault();
          toggle(k);
        }
      });
    });

    qsa<SVGElement>(".zone, .pt").forEach((el) => {
      const rs = attr(el, "rs").split(" ");
      const country = attr(el, "country");
      const pick = (): string => (locked && rs.includes(locked) ? locked : (rs[0] ?? ""));
      on(el, "mouseenter", () => setHover(pick()));
      on(el, "mousemove", (e) => {
        const shared = SHARED[country];
        showTip(
          e as MouseEvent,
          country,
          shared ? `shared cover: ${shared}` : `served from ${meta(pick()).hub}`,
          pick(),
        );
      });
      on(el, "mouseleave", () => {
        setHover(null);
        hideTip();
      });
      on(el, "click", () => toggle(pick()));
    });

    if (mapSvg) {
      on(mapSvg, "mouseleave", () => {
        setHover(null);
        hideTip();
      });
    }

    qsa<HTMLButtonElement>(".chip").forEach((c) => {
      const k = attr(c, "region") || null;
      on(c, "click", () => {
        locked = k;
        hover = null;
        apply();
      });
      on(c, "mouseenter", () => setHover(k));
      on(c, "mouseleave", () => setHover(null));
      on(c, "focus", () => setHover(k));
      on(c, "blur", () => setHover(null));
    });

    qsa<HTMLButtonElement>(".ov").forEach((b) => {
      const k = attr(b, "go");
      on(b, "click", () => {
        locked = k;
        hover = null;
        apply();
      });
      on(b, "mouseenter", () => setHover(k));
      on(b, "mouseleave", () => setHover(null));
    });

    qsa<HTMLButtonElement>(".pin").forEach((b) =>
      on(b, "click", () => {
        const pane = b.closest(".pane");
        const key = pane ? attr(pane, "r") : "";
        if (key) toggle(key);
      }),
    );

    apply();
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Regions" }]}
        eyebrow="Global reach, regional understanding"
        title="Regions"
        accent="We Serve"
        description="Emma Global supports organisations across four strategically connected regions through our operational teams, international business locations and network of qualified local professionals."
        stats={[
          { value: "USD 60T+", label: "Economic activity" },
          { value: "4.9 bn", label: "People within reach" },
          { value: "4", label: "Regional hubs" },
          { value: "30", label: "Markets served" },
        ]}
      />
      <div
        className="regions-root"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: regionsBody }}
      />
      <CtaBand
        title="Operating across one of these regions?"
        text="Tell us where your teams, suppliers and obligations sit, and we'll set out how Emma Global would support them."
        action="Start a conversation"
      />
    </>
  );
}
