import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Accordion } from "../components/accordion";
import { CtaBand, PageHero, SectionHeader } from "../components/site-shell";
import { seo } from "../lib/seo";
import { availableServices, faqs, groupStats, processSteps } from "../lib/site-data";

export const Route = createFileRoute("/services")({
  head: () => {
    const { meta, links } = seo({
      title: "Our Services",
      description:
        "Integrated services from Emma Global: HR solutions, administration services, and digital and AI solutions.",
      path: "/services",
    });
    return { meta, links };
  },
  component: ServicesLayout,
});

/**
 * `/services` renders the overview; `/services/<slug>` renders through the
 * outlet, so the child route owns the page when one is matched.
 */
function ServicesLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/services/$service");
  return isChild ? <Outlet /> : <ServicesIndex />;
}

function ServicesIndex() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services" }]}
        eyebrow="What We Offer"
        title="Our Core"
        accent="Services"
        description="Comprehensive, integrated solutions designed to drive efficiency, compliance, and sustainable growth. Take a single service, or connect them all under one accountable partner."
        stats={groupStats}
      />

      <section className="section section-light">
        <div className="card-grid cols-2">
          {availableServices.map((service) => {
            const Icon = service.icon;
            return (
              <div className="card" key={service.slug}>
                <span className="card-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ul className="card-tags">
                  {service.items.slice(0, 4).map((item) => (
                    <li key={item.label}>{item.label}</li>
                  ))}
                </ul>
                <Link
                  to="/services/$service"
                  params={{ service: service.slug }}
                  className="card-link"
                >
                  Explore {service.shortTitle}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section-dark">
        <SectionHeader
          eyebrow="How engagements run"
          title="A predictable way of working"
          text="Whichever service you start with, the sequence and the reporting rhythm stay the same."
        />
        <div className="steps">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div className="step" key={step.n}>
                <div className="step-head">
                  <span className="step-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="n">{step.n}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section-off">
        <div className="narrow">
          <SectionHeader eyebrow="Common questions" title="What clients ask before starting" />
          <Accordion items={faqs} />
        </div>
      </section>

      <CtaBand
        title="Not sure which service you need?"
        text="Describe the problem rather than the category. We'll tell you which of the four — or which combination — actually addresses it."
        action="Schedule a Free Consultation"
      />
    </>
  );
}
