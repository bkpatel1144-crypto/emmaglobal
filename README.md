# Emma Global — website

Marketing site for Emma Global: integrated HR, administration, ESG advisory and
digital/AI services across four regional hubs.

Built with **TanStack Start** (React 19 + Vite 8, server-rendered), **Tailwind CSS v4**
for the utility layer and a hand-written stylesheet that reproduces the approved
brand design. Deploys to **Vercel**.

---

## Quick start

```bash
bun install          # or: npm install
bun run dev          # http://localhost:8080 (falls back to the next free port)
bun run build        # production build -> .vercel/output
bun run preview      # serve the production build locally
bun run lint         # eslint
npx tsc --noEmit     # typecheck
```

## Deploying to Vercel

The build emits the [Build Output API v3](https://vercel.com/docs/build-output-api/v3)
layout into `.vercel/output`, so Vercel needs no framework preset.

1. Import the repository in Vercel.
2. Leave the framework as **Other** — `vercel.json` already sets the install and
   build commands.
3. Deploy. Nothing else is required for the site to work.

`vercel.json` also sets security headers (HSTS, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`) and long-lived immutable caching for
hashed assets and media.

To build for a different platform, set `NITRO_PRESET` (e.g. `NITRO_PRESET=cloudflare-module`);
it overrides the Vercel default pinned in `vite.config.ts`.

### Environment variables (optional)

| Variable             | Purpose                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | Enables server-side delivery of contact-form enquiries via [Resend](https://resend.com). |
| `CONTACT_TO_EMAIL`   | Inbox that receives enquiries. Defaults to the address in `src/lib/site-data.ts`.        |
| `CONTACT_FROM_EMAIL` | Verified sender for your Resend domain.                                                  |
| `SITE_URL`           | Origin used when generating `sitemap.xml`. Defaults to `https://emmaglobal.com`.         |

**The form works without any of these.** With no `RESEND_API_KEY`, `submitEnquiry`
returns `unconfigured` and the form opens the visitor's own mail client with the
enquiry pre-filled, so a missing secret can never break the site. See `.env.example`.

---

## Before go-live

These are the only items that still need real values from Emma Global:

1. **Contact details** — `src/lib/site-data.ts` → `contact`. The postal address and
   phone number are the `XXXXX` placeholders carried over from the approved design.
   Both are marked `TODO`; every page reads from this one object.
2. **Production domain** — `site.url` in `src/lib/site-data.ts`, the `Sitemap:` line
   in `public/robots.txt`, and `SITE_URL` if it differs from `emmaglobal.com`.
3. **Social profiles** — `contact.linkedin` and `contact.twitter` are best guesses.
4. **Legal pages** — `/privacy` and `/terms` are drafts written against what this
   site actually does. They need review by Emma Global's legal adviser, and the
   governing jurisdiction in `terms.tsx` needs to be named.
5. **Case studies** — `caseStudies` in `src/lib/site-data.ts` are representative
   examples, labelled as such on the page. Replace them with published references
   when they are available.
6. **Contact form delivery** — set `RESEND_API_KEY` (see above), otherwise the form
   falls back to the visitor's mail client.

---

## Project layout

```
design-reference/         Approved source designs (not shipped)
  home-source.html          Home page reference
  regions-source.html       "EMMA Global Regions" reference
public/
  media/                    Client-supplied videos, world map, logotype
  favicon.*, icon-*.png     Generated icon set
  og-image.png              Social share card
  sitemap.xml               Generated at build time
scripts/
  generate-sitemap.mjs      Runs as part of `build`
src/
  components/               Shell, forms, service cards, icons
  content/
    regions-body.html       Regions markup, injected verbatim
  lib/
    site-data.ts            All shared copy — the file to edit for content changes
    enquiry.ts              Contact-form server function
    seo.ts                  Per-route meta + structured data
  routes/                   File-based routes
  styles/
    brand.css               Tokens, nav, footer, buttons
    home.css                Home page sections (ported from the reference)
    pages.css               Forms and inner-page components
    regions.css             Generated — see below
```

### Content changes

Almost all copy lives in `src/lib/site-data.ts`. Services, their feature lists and
the videos attached to them, industries, advantages, FAQs, roles and case studies
are all defined there and consumed by every page that needs them.

### The Regions page

`/regions` reproduces the approved "EMMA Global Regions" design exactly. Its markup
(including the Equal Earth projection world map) is injected verbatim from
`src/content/regions-body.html`, and the original interaction script is ported to a
React effect in `src/routes/regions.tsx`.

`src/styles/regions.css` is **generated** — every selector from the design's
stylesheet is scoped to `.regions-root` so its palette and element styles stay off
the rest of the site. Edit `design-reference/regions-source.html` and re-run the
scoping step rather than editing `regions.css` directly.

### Brand tokens

`brand.css` defines the palette on `:root` as `--ink`, `--sky`, `--ink-muted`,
`--line` and friends. Note that `--muted` and `--border` are **not** available for
brand use — the shadcn/ui token block later in `styles.css` owns those names, which
is why the brand equivalents are `--ink-muted` and `--line`.

### Icons and branding

Interface icons come from `lucide-react` — never emoji, which render differently
on every operating system and read as decoration rather than interface. Each
content item in `site-data.ts` carries its own `LucideIcon`.

The Emma Global logotype (`public/media/emma-logo-source.jpg`) is the brand mark
everywhere: header, footer, social card, and the whole favicon/app-icon set,
which is generated from it.

### Service videos

Four clips were supplied by the client and are mapped to four specific items
under HR Solutions in `site-data.ts`. Only items with a `video` are expandable;
the rest are plain rows. There are no "coming soon" placeholders anywhere, and
no clip is reused across items — to add one, drop the file in `public/media/`
and set `video` on that item.

### Header behaviour

The header is a glass bar that sits flush at the top of the page and detaches
into a floating, fully-padded capsule once scrolled past 12px. `SiteHeader`
toggles `.is-scrolled` on `.nav-shell`; the visual change is entirely CSS.

### Hover states

Hover never translates the element that owns the `:hover` — moving a card out
from under the pointer makes `:hover` flip on and off, which reads as
flickering. Cards lift with shadow and border; only descendants (icons, arrows)
transform.
# emmaglobal
