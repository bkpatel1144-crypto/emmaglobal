import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "../components/site-shell";
import { seo } from "../lib/seo";
import { contact, site } from "../lib/site-data";

/**
 * Draft policy covering what this website actually does — the contact form,
 * the absence of analytics and advertising cookies, and how enquiries are
 * handled. It must be reviewed by Emma Global's legal adviser, and updated if
 * analytics or marketing tools are added later.
 */
export const Route = createFileRoute("/privacy")({
  head: () => {
    const { meta, links } = seo({
      title: "Privacy Policy",
      description: `How ${site.name} collects, uses and protects personal information submitted through this website.`,
      path: "/privacy",
    });
    return { meta, links };
  },
  component: PrivacyPage,
});

const UPDATED = "13 September 2026";

function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Privacy Policy" }]}
        eyebrow="Legal"
        title="Privacy"
        accent="Policy"
        description="How Emma Global collects, uses and protects the personal information you provide through this website."
      />

      <section className="section section-light">
        <div className="narrow prose">
          <p className="legal-meta">Last updated: {UPDATED}</p>

          <h2>Who we are</h2>
          <p>
            {site.name} ("we", "us") provides integrated workforce, administration, ESG and digital
            services. This policy covers personal information handled through this website.
            Information handled while delivering services to a client is governed by the agreement
            with that client.
          </p>

          <h2>What we collect</h2>
          <p>We collect only what you choose to send us:</p>
          <ul>
            <li>
              <strong>Enquiry details.</strong> Your name, email address, company name, the service
              you are interested in and the message you write in our contact form.
            </li>
            <li>
              <strong>Recruitment details.</strong> If you apply for a role, the CV and supporting
              information you send us by email.
            </li>
            <li>
              <strong>Technical records.</strong> Standard server logs kept by our hosting provider,
              including IP address and request details, used to keep the site secure and available.
            </li>
          </ul>

          <h2>Why we use it</h2>
          <ul>
            <li>To respond to your enquiry and discuss whether we can help.</li>
            <li>To assess applications for advertised or speculative roles.</li>
            <li>To maintain the security, availability and performance of this website.</li>
            <li>To meet legal, regulatory and record-keeping obligations that apply to us.</li>
          </ul>
          <p>
            We rely on your consent when you submit a form, and on our legitimate interest in
            responding to business enquiries and operating a secure website.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            This website does not set advertising or tracking cookies and does not build visitor
            profiles. Fonts are served by Google Fonts, which receives the request needed to deliver
            the font files. If we add analytics in future we will update this policy and describe
            what is collected before it is switched on.
          </p>

          <h2>Who we share it with</h2>
          <p>
            We do not sell personal information. We share it only with service providers who help us
            run the site and respond to enquiries — our hosting provider and our email provider —
            and only to the extent needed for those purposes. We also disclose information where the
            law requires it.
          </p>

          <h2>Where it is held</h2>
          <p>
            Because we operate across South Asia, Asia-Pacific, the UK and Europe, and the Middle
            East and Africa, your information may be handled in a country other than your own. Where
            information moves between countries we use appropriate safeguards for those transfers.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries are retained for up to 24 months from our last contact, unless they become
            part of a client relationship with its own retention terms. Recruitment information is
            retained for up to 12 months unless you ask us to keep it longer. Server logs are
            retained for a short period by our hosting provider.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to access the personal information
            we hold about you, correct it, ask us to delete it, object to or restrict how we use it,
            request a copy in a portable format, and withdraw consent. To exercise any of these
            rights, email <a href={`mailto:${contact.email}`}>{contact.email}</a>. We will respond
            within the period required by the applicable law. You may also complain to your local
            data protection authority.
          </p>

          <h2>Security</h2>
          <p>
            The site is served over HTTPS and we apply organisational and technical measures
            appropriate to the information we hold. No method of transmission over the internet is
            completely secure, so please do not send confidential information through the contact
            form.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top shows when it last
            changed. Material changes will be highlighted on this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy or about how we handle personal information can be sent to{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>, or by post to {contact.address}
            .
          </p>
        </div>
      </section>
    </>
  );
}
