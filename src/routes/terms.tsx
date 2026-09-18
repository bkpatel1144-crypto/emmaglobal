import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "../components/site-shell";
import { breadcrumbJsonLd, jsonLd, seo } from "../lib/seo";
import { primaryEmail, site } from "../lib/site-data";

/**
 * Draft website terms. These cover use of this site only — they are not the
 * terms of any service engagement. Review with Emma Global's legal adviser and
 * set the governing jurisdiction before launch.
 */
export const Route = createFileRoute("/terms")({
  head: () => {
    const { meta, links } = seo({
      title: "Terms of Use",
      description: `The terms that apply to your use of the ${site.name} website.`,
      path: "/terms",
    });
    return {
      meta,
      links,
      scripts: [jsonLd(breadcrumbJsonLd([{ name: "Terms of Use", path: "/terms" }]))],
    };
  },
  component: TermsPage,
});

const UPDATED = "13 September 2026";

function TermsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Terms of Use" }]}
        eyebrow="Legal"
        title="Terms of"
        accent="Use"
        description="The terms that apply when you use this website. They do not govern any services we provide under a separate agreement."
      />

      <section className="section section-light">
        <div className="narrow prose">
          <p className="legal-meta">Last updated: {UPDATED}</p>

          <h2>Acceptance</h2>
          <p>
            By accessing or using this website you agree to these terms. If you do not agree with
            them, please do not use the site.
          </p>

          <h2>These terms are not a services agreement</h2>
          <p>
            Services provided by {site.name} are governed by a separate written agreement between us
            and the client. Nothing on this website forms part of that agreement, and nothing here
            constitutes an offer capable of acceptance.
          </p>

          <h2>Information on this site</h2>
          <p>
            The content of this website is provided for general information about our services. It
            is not professional advice — legal, financial, regulatory, employment or otherwise — and
            should not be relied on as a substitute for advice about your own circumstances. We take
            care to keep the site accurate and current but make no warranty that it is complete or
            free from error.
          </p>
          <p>
            Case studies describe representative engagements. They illustrate the shape of our work
            rather than guarantee a particular result, and outcomes vary with each organisation's
            circumstances.
          </p>

          <h2>Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the site for any unlawful purpose or in breach of these terms.</li>
            <li>
              Attempt to gain unauthorised access to the site, its server or any connected system.
            </li>
            <li>
              Introduce malicious code, or interfere with the site's operation or availability.
            </li>
            <li>
              Scrape, harvest or systematically extract content except as permitted by our robots
              directives.
            </li>
            <li>Submit false information or another person's details through our forms.</li>
          </ul>

          <h2>Intellectual property</h2>
          <p>
            The content, design, logos, graphics and code on this website are owned by {site.name}{" "}
            or used under licence, and are protected by intellectual property law. You may view and
            print pages for your own business use. Any other reproduction, distribution or
            adaptation requires our written permission.
          </p>

          <h2>Links to other sites</h2>
          <p>
            Where we link to third-party websites we do so for convenience. We do not control those
            sites and are not responsible for their content, availability or privacy practices.
          </p>

          <h2>Availability</h2>
          <p>
            We aim to keep the site available but do not guarantee uninterrupted access. We may
            change, suspend or withdraw any part of the site without notice.
          </p>

          <h2>Liability</h2>
          <p>
            To the fullest extent permitted by law, {site.name} is not liable for any indirect or
            consequential loss, or for loss of profit, revenue, data or goodwill, arising from your
            use of or inability to use this website. Nothing in these terms excludes liability that
            cannot lawfully be excluded.
          </p>

          <h2>Privacy</h2>
          <p>
            Our <a href="/privacy">Privacy Policy</a> explains how we handle personal information
            submitted through this site and forms part of these terms.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. The version published on this page at the
            time you use the site is the version that applies.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws applicable at {site.name}'s principal place of
            business, and the courts of that jurisdiction have exclusive jurisdiction over any
            dispute arising from them.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
