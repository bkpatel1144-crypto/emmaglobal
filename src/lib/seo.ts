import { contact, primaryEmail, site } from "./site-data";

type MetaTag = Record<string, string>;

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
  const url = `${site.url}${path === "/" ? "" : path}`;
  const imageUrl = image.startsWith("http") ? image : `${site.url}${image}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: "en" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/** Organisation structured data, emitted once from the root route. */
export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon-512.png`,
    image: `${site.url}${site.ogImage}`,
    description: site.description,
    slogan: site.tagline,
    email: primaryEmail,
    address: {
      "@type": "PostalAddress",
      // The country is not stated in the supplied address, but HA8 5QH /
      // Edgware / Harrow / Middlesex is unambiguously United Kingdom.
      streetAddress: contact.addressLines.slice(0, 2).join(", "),
      addressLocality: "Edgware, Harrow",
      addressRegion: "Middlesex",
      postalCode: "HA8 5QH",
      addressCountry: "GB",
    },
    areaServed: [
      "South Asia",
      "Asia-Pacific",
      "United Kingdom and Europe",
      "Middle East and Africa",
    ],
  };
}
