/**
 * Writes public/sitemap.xml from the site's route list.
 *
 * Runs as part of `npm run build` so the sitemap can never drift from the
 * routes that actually exist. Set SITE_URL in the deploy environment to
 * override the production origin.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = (process.env.SITE_URL ?? "https://emmaglobal.com").replace(/\/$/, "");

// Read the service slugs straight from the content file so a new service appears
// in the sitemap without anyone remembering to update this script.
//
// The match is bounded to the `services` declaration. Scanning the whole file
// would also pick up the `slug` fields on `regions`, which are not routes under
// /services — and how those happen to be line-wrapped must not change the output.
const siteData = fs.readFileSync(path.join(root, "src/lib/site-data.ts"), "utf8");
const start = siteData.indexOf("export const services");
if (start === -1)
  throw new Error("generate-sitemap: `export const services` not found in site-data.ts");
const end = siteData.indexOf("\nexport const ", start + 1);
const servicesBlock = siteData.slice(start, end === -1 ? undefined : end);

// Split the block per service object so a `comingSoon` flag can be read against
// the service it belongs to. Unlaunched services have no public page, so they
// must not appear in the sitemap.
const serviceSlugs = servicesBlock
  .split(/\n  \{\n/)
  .map((chunk) => {
    const slug = chunk.match(/\bslug:\s*"([a-z0-9-]+)"/);
    if (!slug) return null;
    return /\bcomingSoon:\s*true\b/.test(chunk) ? null : slug[1];
  })
  .filter((slug) => slug !== null);

if (serviceSlugs.length === 0)
  throw new Error("generate-sitemap: no published service slugs found in the `services` block");

const pages = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  ...serviceSlugs.map((slug) => ({
    path: `/services/${slug}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  { path: "/regions", priority: "0.8", changefreq: "monthly" },
  { path: "/why-us", priority: "0.8", changefreq: "monthly" },
  { path: "/case-studies", priority: "0.7", changefreq: "monthly" },
  { path: "/team", priority: "0.6", changefreq: "yearly" },
  { path: "/careers", priority: "0.6", changefreq: "weekly" },
  { path: "/contact", priority: "0.8", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

const lastmod = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${origin}${page.path === "/" ? "/" : page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml written — ${pages.length} URLs at ${origin}`);
