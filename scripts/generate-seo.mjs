/**
 * Generates every static SEO file from the site's own content:
 *
 *   public/sitemap.xml     — the pages that actually exist and are indexable
 *   public/robots.txt      — crawl policy + sitemap pointer
 *   public/llms.txt        — concise site map for AI assistants (llmstxt.org)
 *   public/llms-full.txt   — the full text an assistant needs to answer well
 *
 * Runs as part of `npm run build`, so none of them can drift from the routes
 * and copy in src/lib/site-data.ts. A service flagged `comingSoon` is excluded
 * everywhere automatically.
 *
 * Set SITE_URL to override the production origin.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Node strips the types; this gives the generator the real, typed content
// rather than a regex guess at it.
const data = await import("../src/lib/site-data.ts");
const {
  availableServices,
  contact,
  addressOneLine,
  faqs,
  groupStats,
  regions,
  sectors,
  site,
  advantages,
  pillars,
  processSteps,
} = data;

// Summing the per-region counts double-counts the two shared markets (China is
// served from Delhi and Singapore, Brazil from the UK and Dubai), so the global
// figure comes from groupStats rather than a sum.
const marketsServed = groupStats.find((s) => s.label === "Markets served")?.value ?? "30";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = (process.env.SITE_URL || site.url).replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);
const write = (file, body) => {
  fs.writeFileSync(path.join(root, "public", file), body);
  console.log(`  ${file.padEnd(16)} ${(body.length / 1024).toFixed(1)}kb`);
};

/* ── Page inventory ──────────────────────────────────────────────────────── */

const pages = [
  { path: "/", title: "Home", priority: "1.0", changefreq: "monthly" },
  { path: "/about", title: "About Us", priority: "0.9", changefreq: "monthly" },
  { path: "/services", title: "Our Services", priority: "0.9", changefreq: "monthly" },
  ...availableServices.map((s) => ({
    path: `/services/${s.slug}`,
    title: s.title,
    priority: "0.8",
    changefreq: "monthly",
  })),
  { path: "/regions", title: "Regions We Serve", priority: "0.8", changefreq: "monthly" },
  { path: "/why-us", title: "Why Choose Us", priority: "0.8", changefreq: "monthly" },
  { path: "/case-studies", title: "Case Studies", priority: "0.7", changefreq: "monthly" },
  { path: "/team", title: "Our Team", priority: "0.6", changefreq: "yearly" },
  { path: "/careers", title: "Careers", priority: "0.6", changefreq: "weekly" },
  { path: "/contact", title: "Contact Us", priority: "0.8", changefreq: "yearly" },
  { path: "/privacy", title: "Privacy Policy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", title: "Terms of Use", priority: "0.3", changefreq: "yearly" },
];

const url = (p) => `${origin}${p === "/" ? "/" : p}`;

/* ── sitemap.xml ─────────────────────────────────────────────────────────── */

write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${url(p.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);

/* ── robots.txt ──────────────────────────────────────────────────────────── */

write(
  "robots.txt",
  `# ${site.name} — ${origin}

User-agent: *
Allow: /

# Build output and asset internals are useless to crawlers.
Disallow: /_build/
Disallow: /__l5e/

# AI assistants: the site is open to you. /llms.txt is a concise map of it and
# /llms-full.txt carries the full text, both kept in sync with the site.
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

Sitemap: ${origin}/sitemap.xml
`,
);

/* ── llms.txt ────────────────────────────────────────────────────────────── */

const serviceLine = (s) => `- [${s.title}](${url(`/services/${s.slug}`)}): ${s.summary}`;
const pageLine = (p) => `- [${p.title}](${url(p.path)})`;

write(
  "llms.txt",
  `# ${site.name}

> ${site.description}

${site.name} is an integrated business services firm operating from four regional hubs —
${regions.map((r) => `${r.hub} (${r.name})`).join(", ")} — covering ${marketsServed} markets.
Rather than supplying one function, it runs workforce, administration, sustainability and
digital work under a single accountable relationship.

Office: ${addressOneLine}. Contact: ${contact.emails.join(", ")}.

## Services

${availableServices.map(serviceLine).join("\n")}

## Company

${pages
  .filter((p) =>
    ["/", "/about", "/regions", "/why-us", "/case-studies", "/team", "/careers"].includes(p.path),
  )
  .map(pageLine)
  .join("\n")}

## Contact and legal

${pages
  .filter((p) => ["/contact", "/privacy", "/terms"].includes(p.path))
  .map(pageLine)
  .join("\n")}

## Optional

- [Full site text](${origin}/llms-full.txt): every page's substantive copy in one file.
`,
);

/* ── llms-full.txt ───────────────────────────────────────────────────────── */

const section = (heading, body) => `\n## ${heading}\n\n${body}\n`;

write(
  "llms-full.txt",
  `# ${site.name} — full site text

> ${site.description}

Source: ${origin} · Generated ${today}
This file is produced from the site's own content, so it always matches what is published.
${section(
  "Overview",
  `${site.name} delivers integrated solutions across workforce management, administration,
sustainability and digital innovation. The proposition is that these four areas interact —
a hiring decision changes a compliance obligation, an automation decision changes a job —
and handling them under one relationship removes the gaps that appear between separate
suppliers.

Tagline: ${site.tagline}
Office: ${addressOneLine}
Email: ${contact.emails.join(", ")}
Hours: ${contact.hours}${contact.phone ? `\nPhone: ${contact.phone}` : ""}`,
)}${section(
    "Domains",
    pillars
      .map((p) => `### ${p.title}${p.comingSoon ? " (coming soon)" : ""}\n${p.text}`)
      .join("\n\n"),
  )}${section(
    "Services",
    availableServices
      .map((s) =>
        [
          `### ${s.title}`,
          `URL: ${url(`/services/${s.slug}`)}`,
          "",
          s.summary,
          "",
          s.body.join("\n\n"),
          "",
          "Scope of work:",
          s.deliverables.map((d) => `- ${d.title}: ${d.text}`).join("\n"),
          "",
          "Included:",
          s.items.map((i) => `- ${i.label}: ${i.detail}`).join("\n"),
          "",
          "Questions:",
          s.faqs.map((f) => `- ${f.q}\n  ${f.a}`).join("\n"),
        ].join("\n"),
      )
      .join("\n\n"),
  )}${section(
    "Regions",
    regions
      .map(
        (r) =>
          `### ${r.name}\nHub: ${r.hub} · ${r.markets} markets · ${r.economy} · ${r.people} people\n${r.note}`,
      )
      .join("\n\n"),
  )}${section("Industries served", sectors.map((s) => `- ${s.name}`).join("\n"))}${section(
    "Why clients consolidate",
    advantages
      .map((a) => `### ${a.title}${a.comingSoon ? " (coming soon)" : ""}\n${a.text}`)
      .join("\n\n"),
  )}${section(
    "How engagements run",
    processSteps.map((s) => `${s.n}. ${s.title} — ${s.text}`).join("\n"),
  )}${section("Frequently asked questions", faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n"))}`,
);

console.log(`SEO files generated for ${origin} — ${pages.length} indexable pages`);
