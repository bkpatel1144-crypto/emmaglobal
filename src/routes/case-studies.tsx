import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { CtaBand, PageHero, SectionHeader } from "../components/site-shell";
import { seo } from "../lib/seo";
import { caseStudies, processSteps } from "../lib/site-data";

export const Route = createFileRoute("/case-studies")({
  head: () => {
    const { meta, links } = seo({
      title: "Case Studies",
      description:
        "Representative examples of Emma Global engagements across manufacturing, textiles, professional services and hospitality — the problem, the approach and what changed.",
      path: "/case-studies",
    });
    return { meta, links };
  },
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Case Studies" }]}
        eyebrow="Work in practice"
        title="What integrated delivery"
        accent="looks like"
        description="Four representative engagements across different sectors and regions — the situation we were brought into, the approach we took, and what changed as a result."
        stats={[
          { value: "4", label: "Sectors" },
          { value: "3", label: "Regions" },
          { value: "4", label: "Services applied" },
        ]}
      />

      <section className="section section-light">
        {/* These illustrate the shape of typical engagements. Client names and
            figures are withheld; replace with published references as they
            become available. */}
        <p className="legal-meta" style={{ maxWidth: "760px", margin: "0 auto 44px" }}>
          These are representative engagement examples used to illustrate how we work. Client names
          and commercial details are not published. Named references can be provided on request
          during a procurement process.
        </p>
        <div style={{ display: "grid", gap: "22px" }}>
          {caseStudies.map((study) => {
            const Icon = study.icon;
            return (
              <article className="case-card" key={study.title}>
                <div className="case-meta">
                  <span className="case-meta-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="sector">{study.sector}</span>
                  <span className="region">{study.region}</span>
                </div>
                <div>
                  <h3>{study.title}</h3>
                  <p>
                    <strong style={{ color: "var(--ink)" }}>The situation. </strong>
                    {study.challenge}
                  </p>
                  <p>
                    <strong style={{ color: "var(--ink)" }}>Our approach. </strong>
                    {study.approach}
                  </p>
                  <div className="case-outcomes">
                    {study.outcomes.map((outcome) => (
                      <span key={outcome}>
                        <Check aria-hidden="true" />
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section section-dark">
        <SectionHeader
          eyebrow="How they all ran"
          title="Different problems, one method"
          text="Every engagement above followed the same four stages, whatever the sector or the service mix."
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

      <CtaBand
        title="Recognise any of these?"
        text="If one of these situations sounds familiar, a short conversation will tell you quickly whether we're the right fit."
        action="Schedule a Free Consultation"
      />
    </>
  );
}
