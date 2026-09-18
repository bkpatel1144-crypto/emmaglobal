import { createFileRoute } from "@tanstack/react-router";

import { Accordion } from "../components/accordion";
import { ComingSoonBadge, CtaBand, PageHero, SectionHeader } from "../components/site-shell";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, seo } from "../lib/seo";
import { advantages, faqs, groupStats, processSteps } from "../lib/site-data";

export const Route = createFileRoute("/why-us")({
  head: () => {
    const { meta, links } = seo({
      title: "Why Choose Us",
      description:
        "We don't offer isolated solutions — we deliver a connected ecosystem across HR, administration, ESG and digital that works together to drive real, measurable outcomes.",
      path: "/why-us",
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(breadcrumbJsonLd([{ name: "Why Us", path: "/why-us" }])),
        jsonLd(faqJsonLd(faqs)),
      ],
    };
  },
  component: WhyUsPage,
});

function WhyUsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Why Us" }]}
        eyebrow="Why Choose Emma Global"
        title="Your Integrated"
        accent="Growth Partner"
        description="We don't offer isolated solutions — we deliver a connected ecosystem that works together to drive real, measurable outcomes across people, operations, responsibility and technology."
        stats={groupStats}
      />

      <section className="section section-dark">
        <SectionHeader
          eyebrow="What sets us apart"
          title="Six reasons clients consolidate with us"
          text="Each one is a practical consequence of running four domains under a single relationship."
        />
        <div className="why-grid">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;
            return (
              <div
                className={`why-card${advantage.comingSoon ? " is-soon" : ""}`}
                key={advantage.title}
              >
                {advantage.comingSoon && <ComingSoonBadge />}
                <span className="why-card-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{advantage.title}</h3>
                <p>{advantage.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section-light">
        <div className="split-2">
          <div>
            <p className="eyebrow">The difference in practice</p>
            <h2>What an integrated partner actually changes.</h2>
            <p className="lede">
              The benefit is not a longer supplier list with one name on it. It is the removal of
              the gaps between them.
            </p>
          </div>
          <div className="prose">
            <h3 style={{ marginTop: 0 }}>One view of the organisation</h3>
            <p>
              Workforce data, operational records and ESG evidence stop living in separate systems
              maintained by separate suppliers. When an auditor, a customer or a board member asks a
              question, the answer comes from one place.
            </p>
            <h3>Decisions that account for each other</h3>
            <p>
              A restructuring plan carries its compliance implications with it. An automation
              programme is assessed for its effect on roles before it goes ahead. Nothing arrives as
              a surprise from an adjacent function.
            </p>
            <h3>No gaps between contracts</h3>
            <p>
              The space between suppliers is where work goes missing. With one accountable
              relationship there is no such space, and no debate about whose responsibility
              something was.
            </p>
            <h3>Capability that stays</h3>
            <p>
              We transfer what we build. The measure of an engagement is whether it still works when
              we step back, not how long we remain necessary.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-off">
        <SectionHeader
          eyebrow="How we engage"
          title="The same sequence, every time"
          text="You always know which stage you're in and what comes next."
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

      <section className="section section-light">
        <div className="narrow">
          <SectionHeader eyebrow="Common questions" title="What clients usually ask first" />
          <Accordion items={faqs} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
