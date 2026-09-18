import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";

import { CtaBand, PageHero, SectionHeader } from "../components/site-shell";
import { breadcrumbJsonLd, jsonLd, seo } from "../lib/seo";
import { benefits, primaryEmail, processSteps, roles } from "../lib/site-data";

export const Route = createFileRoute("/careers")({
  head: () => {
    const { meta, links } = seo({
      title: "Careers",
      description:
        "Join Emma Global. Open roles across HR, ESG advisory, administration and digital, based in Delhi, Singapore, Dubai and the United Kingdom.",
      path: "/careers",
    });
    return {
      meta,
      links,
      scripts: [jsonLd(breadcrumbJsonLd([{ name: "Careers", path: "/careers" }]))],
    };
  },
  component: CareersPage,
});

function CareersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Careers" }]}
        eyebrow="Careers at Emma Global"
        title="Work across problems,"
        accent="not tickets"
        description="Our consultants work on the whole picture — people, operations, sustainability and technology — rather than one narrow slice of it. If that's the kind of work you want, we'd like to hear from you."
        stats={[
          { value: `${roles.length}`, label: "Open roles" },
          { value: "4", label: "Regional hubs" },
          { value: "4", label: "Practices" },
        ]}
      />

      <section className="section section-light">
        <div className="split-2">
          <div>
            <p className="eyebrow">Why join us</p>
            <h2>Breadth that actually builds a career.</h2>
            <p className="lede">
              We hire for judgement and clarity of thinking. Technical depth matters, but so does
              explaining a recommendation to someone who does not share your specialism.
            </p>
          </div>
          <div className="prose">
            <p>
              Because we work across four domains, our consultants see how decisions connect. An ESG
              specialist here understands what a reporting requirement does to a workforce plan. A
              digital consultant understands what automation does to a job description.
            </p>
            <p>
              Engagements run to a defined sequence with named ownership, so you know what you are
              responsible for. Capability transfer is part of the job, which means you spend your
              time teaching as well as delivering.
            </p>
            <p>
              The work is demanding and the standards are high. In return you get real breadth,
              international exposure, and a say in how the engagement is shaped.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-off">
        <SectionHeader
          eyebrow="What you get"
          title="Why people stay"
          text="Four things our consultants consistently say they could not get elsewhere."
        />
        <div className="card-grid cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div className="card" key={benefit.title}>
                <span className="card-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section-light">
        <SectionHeader
          eyebrow="Open roles"
          title="Where we're hiring"
          text="Roles are listed by the hub they are based in. Hybrid arrangements are agreed per role."
        />
        <div className="narrow">
          <div style={{ borderTop: "1px solid var(--line)" }}>
            {roles.map((role) => (
              <div className="role-row" key={role.title}>
                <span className="role-icon">
                  <Briefcase aria-hidden="true" />
                </span>
                <div>
                  <h3>{role.title}</h3>
                  <p className="role-meta">
                    <span>
                      <MapPin
                        aria-hidden="true"
                        style={{ width: 14, height: 14, verticalAlign: "-2px", marginRight: 5 }}
                      />
                      {role.location}
                    </span>
                    <span>{role.type}</span>
                    <span>{role.practice}</span>
                  </p>
                </div>
                <a
                  className="btn-outline"
                  href={`mailto:${primaryEmail}?subject=${encodeURIComponent(`Application — ${role.title}`)}`}
                >
                  Apply
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
          <p className="legal-meta" style={{ marginTop: "36px" }}>
            Don't see your role? Send your CV and a short note about the work you want to do to{" "}
            <a href={`mailto:${primaryEmail}`} style={{ color: "var(--sky)", fontWeight: 600 }}>
              {primaryEmail}
            </a>
            . We review speculative applications every month.
          </p>
        </div>
      </section>

      <section className="section section-dark">
        <SectionHeader
          eyebrow="How we hire"
          title="A process that respects your time"
          text="Four stages, each with a clear purpose, and a decision at the end of every one."
        />
        <div className="steps">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const hiring = [
              "We read every application ourselves and reply either way.",
              "A conversation about the work you have actually done and want to do next.",
              "A practical exercise drawn from a real engagement, discussed rather than graded.",
              "Offer, start date and the first engagement agreed together.",
            ];
            return (
              <div className="step" key={step.n}>
                <div className="step-head">
                  <span className="step-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="n">{step.n}</span>
                </div>
                <h3>{["Apply", "Conversation", "Practical", "Offer"][index]}</h3>
                <p>{hiring[index]}</p>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Interested in joining Emma Global?"
        text="Send us your CV and tell us which of our four practices you see yourself in."
        action="Get in touch"
      />
    </>
  );
}
