/* ============================================================================
   SEO — per-route meta and structured data.

   Every URL here is derived from `site.url`, which reads VITE_SITE_URL, so the
   production domain is set in one place and flows through canonicals, Open
   Graph, JSON-LD, the sitemap, robots.txt and llms.txt together.
   ========================================================================== */

import { addressOneLine, contact, primaryEmail, site, type Service } from "./site-data";

type MetaTag = Record<string, string>;
type ScriptTag = { type: string; children: string };

/** Absolute URL for a site-relative path. */
export const absolute = (path: string) => `${site.url}${path === "/" ? "" : path}`;

/** Wraps an object as a JSON-LD script descriptor for a route's `head()`. */
export const jsonLd = (data: unknown): ScriptTag => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});

/**
 * Builds the per-route meta tags. Titles are suffixed with the brand except on
 * the home page, which carries the full positioning line on its own.
 */
export function seo({
  title,
  description,
  path,
  image = site.ogImage,
  noSuffix = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noSuffix?: boolean;
}): { meta: MetaTag[]; links: MetaTag[] } {
  const fullTitle = noSuffix ? title : `${title} | ${site.name}`;
  const url = absolute(path);
  const imageUrl = image.startsWith("http") ? image : `${site.url}${image}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      // Explicit is better than relying on the default, and it documents intent.
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${site.name} — ${site.tagline}` },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: site.locale },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: `${site.name} — ${site.tagline}` },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

const postalAddress = {
  "@type": "PostalAddress",
  // The country is not stated in the supplied address, but HA8 5QH /
  // Edgware / Harrow / Middlesex is unambiguously United Kingdom.
  streetAddress: contact.addressLines.slice(0, 2).join(", "),
  addressLocality: "Edgware, Harrow",
  addressRegion: "Middlesex",
  postalCode: "HA8 5QH",
  addressCountry: "GB",
} as const;

/** The organisation itself. Emitted once, from the root route. */
export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organisation`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: { "@type": "ImageObject", url: `${site.url}/icon-512.png`, width: 512, height: 512 },
    image: `${site.url}${site.ogImage}`,
    description: site.description,
    slogan: site.tagline,
    email: primaryEmail,
    address: postalAddress,
    contactPoint: contact.emails.map((email) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      email,
      areaServed: ["GB", "IN", "SG", "AE"],
      availableLanguage: "English",
    })),
    sameAs: [contact.linkedin, contact.twitter],
    areaServed: [
      "South Asia",
      "Asia-Pacific",
      "United Kingdom and Europe",
      "Middle East and Africa",
    ],
  };
}

/**
 * The website entity. Distinct from the organisation and needed for Google to
 * associate the site name shown in results with the brand.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-GB",
    publisher: { "@id": `${site.url}/#organisation` },
  };
}

/**
 * Breadcrumb trail for a page.
 *
 * This is what gives Google the site hierarchy it uses to build sitelinks, and
 * it replaces the bare URL in the result with a readable path.
 */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

/** A single service offering, for the service detail pages. */
export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.shortTitle,
    description: service.summary,
    url: absolute(`/services/${service.slug}`),
    provider: { "@id": `${site.url}/#organisation` },
    areaServed: [
      "South Asia",
      "Asia-Pacific",
      "United Kingdom and Europe",
      "Middle East and Africa",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.shortTitle} — scope of work`,
      itemListElement: service.deliverables.map((d) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: d.title, description: d.text },
      })),
    },
  };
}

/** Q&A blocks, which can earn an expandable FAQ result. */
export function faqJsonLd(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/** Marks the contact page and exposes the office details to search engines. */
export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: absolute("/contact"),
    name: `Contact ${site.name}`,
    description: `Get in touch with ${site.name}. Office: ${addressOneLine}.`,
    mainEntity: { "@id": `${site.url}/#organisation` },
  };
}
