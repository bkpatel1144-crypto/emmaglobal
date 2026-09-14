import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CtaBand, PageHero, SectionHeader } from "../components/site-shell";
import { seo } from "../lib/seo";
import { groupStats, pillars, principles, processSteps, regions } from "../lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => {
    const { meta, links } = seo({
      title: "About Us",
      description:
        "Emma Global connects workforce, administration, ESG and digital work under one accountable partner, so organisations can move on all four fronts at once.",
      path: "/about",
    });
    return { meta, links };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About" }]}
        eyebrow="About Emma Global"
        title="Progress is stronger when everything"
        accent="connects."
        description="Organisations are being asked to do several difficult things at once — attract capable people, run dependable operations, meet rising sustainability expectations and adopt new technology responsibly. Emma Global brings those priorities into one plan."
        stats={groupStats}
      />

      {/* Perspective */}
      <section className="section section-light">
        <div className="split-2">
          <div>
            <p className="eyebrow">Our perspective</p>
            <h2>A unified approach for a changing world.</h2>
            <p className="lede">
              Four separate suppliers produce four separate views of the same organisation. We were
              built to remove that gap.
            </p>
          </div>
          <div className="prose">
            <p>
              Most businesses do not have a workforce problem, an administration problem, an ESG
              problem and a technology problem. They have one organisation in which all four
              interact — where a hiring decision changes a compliance obligation, and an automation
              decision changes a job.
            </p>
            <p>
              Handled separately, those connections are where things fall down. Work gets
              duplicated, data stops agreeing with itself, and nobody owns the space between the
              contracts.
            </p>
            <p>
              Emma Global operates across all four domains under a single accountable relationship.
              We establish what matters, agree a sequence, and coordinate delivery so decisions in
              one area account for their effect on the others.
            </p>
            <p>
              That integrated view is what lets leaders decide with confidence, teams work without
              guessing, and organisations build something that still stands after the project
              closes.
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="section section-off">
        <SectionHeader
          eyebrow="What we do"
          title="Four domains, one operating model"
          text="Each capability stands on its own. Together they cover the operational backbone of a modern organisation."
        />
        <div className="card-grid cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div className="card" key={pillar.title}>
                <span className="card-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            );
          })}
        </div>
        <div className="center">
          <Link to="/services" className="btn-primary">
            Explore our services
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Principles */}
      <section className="section section-light">
        <SectionHeader
          eyebrow="Our principles"
          title="How we choose to work"
          text="Three commitments that shape every engagement, from the first scoping call to the final review."
        />
        <div className="card-grid cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div className="card" key={principle.title}>
                <span className="card-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="section section-dark">
        <SectionHeader
          eyebrow="Our way of working"
          title="Discover, design, deliver, improve"
          text="A deliberately plain sequence. Every engagement follows it, whatever its size."
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

      {/* Reach */}
      <section className="section section-light">
        <SectionHeader
          eyebrow="Global reach, regional understanding"
          title="Four connected regions"
          text="Operational teams, international business locations and a network of qualified local professionals across 30 markets."
        />
        <div className="card-grid cols-4">
          {regions.map((region) => (
            <div className="card" key={region.slug}>
              <h3>{region.name}</h3>
              <p>{region.note}</p>
              <ul className="card-tags">
                <li>{region.hub}</li>
                <li>{region.markets} markets</li>
                <li>{region.economy}</li>
              </ul>
            </div>
          ))}
        </div>
        <div className="center">
          <Link to="/regions" className="btn-outline">
            See the regions we serve
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CtaBand
        title="Let's talk about where you are now"
        text="Bring us the priority that's hardest to move. We'll set out how an integrated approach would tackle it."
        action="Schedule a Free Consultation"
      />
    </>
  );
}
