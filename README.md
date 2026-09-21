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

### Environment variables

| Variable             | Purpose                                                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL`      | **Production origin.** Drives every canonical URL, Open Graph tag, JSON-LD entity, the sitemap, robots.txt and llms.txt. Defaults to `https://emma-global.com`. |
| `SITE_URL`           | The same value for the SEO generator, which runs in plain Node. Set both.                                                                                       |
| `SMTP_HOST`          | Mail host, e.g. `smtp.gmail.com`. **Enables contact-form delivery.**                                                                                            |
| `SMTP_PORT`          | `465` for implicit TLS, `587` for STARTTLS. Defaults to `587`.                                                                                                  |
| `SMTP_USER`          | SMTP username — usually the full mailbox address.                                                                                                               |
| `SMTP_PASS`          | SMTP password. For Gmail this is an **App Password**, not the account password.                                                                                 |
| `CONTACT_TO_EMAIL`   | Where enquiries land. Defaults to both addresses in `src/lib/site-data.ts`.                                                                                     |
| `CONTACT_FROM_EMAIL` | Envelope sender. Must be an address the SMTP account may send as.                                                                                               |

**The form works without any SMTP values.** With `SMTP_HOST`, `SMTP_USER` or
`SMTP_PASS` missing, `submitEnquiry` returns `unconfigured` and the form opens the
visitor's own mail client with the enquiry pre-filled, so a missing secret can never
break the site. See `.env.example`.

#### How the contact form sends mail

There is no separate backend. `src/lib/enquiry.ts` defines a TanStack Start
**server function** — its handler is compiled out of the client bundle entirely and
runs only on the server, so SMTP credentials never reach the browser. Nodemailer is
imported inside the handler so it stays out of the client build.

For Gmail or Google Workspace: enable 2-Step Verification, then create an
[App Password](https://myaccount.google.com/apppasswords) and use that as `SMTP_PASS`.
Google shows it as four groups of four characters; the spaces are display-only and
the handler strips them, so pasting it either way works.

`.env` and `.env.*` are gitignored. Never commit real credentials — `.env.example`
is the tracked template and contains no secrets.
-------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY` | Enables server-side delivery of contact-form enquiries via [Resend](https://resend.com). |
| `CONTACT_TO_EMAIL` | Inbox that receives enquiries. Defaults to the address in `src/lib/site-data.ts`. |
| `CONTACT_FROM_EMAIL` | Verified sender for your Resend domain. |
| `VITE_SITE_URL` | **Production origin.** Drives every canonical URL, Open Graph tag, JSON-LD entity, the sitemap, robots.txt and llms.txt. Defaults to `https://emma-global.com`. |
| `SITE_URL` | The same value for the SEO generator, which runs in plain Node. Set both to the same origin. |

**The form works without any of these.** With no `RESEND_API_KEY`, `submitEnquiry`
returns `unconfigured` and the form opens the visitor's own mail client with the
enquiry pre-filled, so a missing secret can never break the site. See `.env.example`.

---

## Before go-live

These are the only items that still need real values from Emma Global:

1. **Phone number** — `src/lib/site-data.ts` → `contact.phone` is empty, so the
   phone row is omitted everywhere rather than showing a placeholder. Set it and
   the row reappears on the home page, /contact and in structured data. The
   office address and both email addresses are the real values supplied by the
   client.
2. **Production domain** — set `VITE_SITE_URL` and `SITE_URL` in Vercel. Nothing is
   hardcoded; the default is `https://emma-global.com`.
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
  build-regions-css.mjs     Regenerates src/styles/regions.css
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

`src/styles/regions.css` is **generated — do not edit it by hand**. Run:

```bash
npm run build:regions-css
```

`scripts/build-regions-css.mjs` reads `design-reference/regions-source.html`,
scopes every selector to `.regions-root`, and applies two fixes to the source
design: the industry cards lift with shadow instead of `translateY` (a hover
transform on the hover target makes `:hover` strobe at the edges), and the hub
pulse ring is excluded from hit-testing so its expanding radius cannot retrigger
hover. Change the reference HTML or that script, never the CSS.

### SEO

Everything below is generated from `src/lib/site-data.ts` by
`scripts/generate-seo.mjs`, which runs as part of `npm run build`. None of these
files are edited by hand, so they cannot drift from the routes and the copy:

| File                   | Purpose                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `public/sitemap.xml`   | Indexable pages only. A service flagged `comingSoon` is excluded automatically.    |
| `public/robots.txt`    | Crawl policy, sitemap pointer, and an explicit allow for AI assistant crawlers.    |
| `public/llms.txt`      | Concise site map for AI assistants, per [llmstxt.org](https://llmstxt.org).        |
| `public/llms-full.txt` | Substantive copy from every page in one file, for assistants that want the detail. |

Structured data lives in `src/lib/seo.ts` and is attached per route:

- **Organization** and **WebSite** on every page, from the root route
- **BreadcrumbList** on every page below the home page. This is what gives Google
  the hierarchy it uses to build sitelinks, so keep it on any new page.
- **Service** and **OfferCatalog** on each service detail page
- **FAQPage** wherever an accordion is rendered
- **ContactPage** on /contact

A layout route must never define `head()`. Its head is merged into every child,
which is how `/services` came to emit a second, wrong canonical on each service
detail page. `services.tsx` is now a bare layout and `services.index.tsx` owns the
listing page metadata.

Also shipped: `public/.well-known/security.txt` (RFC 9116 — refresh its `Expires`
date before it lapses) and a www to apex redirect in `vercel.json`, so no page is
ever indexed under two hostnames.

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

Every HR (7) and Administration (6) item has a client-supplied clip in
`public/media/services/`, mapped in `site-data.ts`. Digital & AI has none, so its
items render as plain rows. There are no placeholders and no clip is reused.

**Every clip must be web-optimised before it goes in.** Exports from most video
tools put the MP4 index (`moov`) at the end of the file, so the browser has to
download the whole clip before the first frame appears. Remux losslessly with:

```bash
ffmpeg -i input.mp4 -c copy -movflags +faststart output.mp4
```

This changes nothing visible — it only moves the index to the front. The clips
also need to be H.264 + AAC; HEVC plays in Safari but fails in Chrome on many
devices. The supplied Catering and Cab clips ran at roughly twice the bitrate of
the rest, so those two were re-encoded to match (SSIM 0.988 / 0.991 against the
originals, i.e. visually identical).

All videos use `preload="none"`, so opening a page downloads no video at all —
a clip loads only when someone plays it. Give a replaced clip a **new filename**:
reusing a name risks browsers and the CDN serving the old cached copy.

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
