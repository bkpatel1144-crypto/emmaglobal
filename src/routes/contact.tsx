import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { ContactForm } from "../components/contact-form";
import { PageHero, SectionHeader } from "../components/site-shell";
import { seo } from "../lib/seo";
import { contactChannels, faqs, regions, services } from "../lib/site-data";
import { Accordion } from "../components/accordion";

export const Route = createFileRoute("/contact")({
  head: () => {
    const { meta, links } = seo({
      title: "Contact Us",
      description:
        "Get in touch with Emma Global to explore how our integrated HR, administration, ESG and digital solutions can be tailored to your business.",
      path: "/contact",
    });
    return { meta, links };
  },
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow="Get in Touch"
        title="Let's Build"
        accent="Something Together"
        description="Tell us what you're trying to move and where it's getting stuck. We'll come back with who you should speak to, what a first engagement looks like, and how quickly it can start."
        stats={[
          { value: "4", label: "Regional hubs" },
          { value: "30", label: "Markets served" },
          { value: "1 – 2 days", label: "Typical first reply" },
        ]}
      />

      <section className="contact-section">
        <div className="contact-inner">
          <div className="contact-info">
            <p className="eyebrow">Contact details</p>
            <h2>Talk to the team</h2>
            <p>
              Every enquiry reaches a practice lead rather than a queue. If your question spans more
              than one of our four services, say so — that is the case we are built for.
            </p>
            <div className="contact-items">
              {contactChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div className="c-item" key={channel.label}>
                    <span className="c-item-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="c-item-body">
                      <span className="c-item-label">{channel.label}</span>
                      {"href" in channel && channel.href ? (
                        <a href={channel.href}>{channel.value}</a>
                      ) : (
                        <span className="c-item-value">{channel.value}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <h3
              style={{
                fontFamily: "var(--serif)",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--ink)",
                margin: "36px 0 14px",
              }}
            >
              What we can help with
            </h3>
            <ul className="check-list">
              {services.map((service) => (
                <li key={service.slug}>
                  <Check aria-hidden="true" />
                  <span>{service.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="section section-off">
        <SectionHeader
          eyebrow="Regional hubs"
          title="Where your enquiry lands"
          text="Each hub runs its own operational team, supported by qualified local professionals across the markets it covers."
        />
        <div className="stat-band">
          {regions.map((region) => (
            <div key={region.slug}>
              <b>{region.hub}</b>
              <span>
                {region.name} · {region.markets} markets
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-light">
        <div className="narrow">
          <SectionHeader eyebrow="Before you write" title="Questions we're usually asked first" />
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  );
}
