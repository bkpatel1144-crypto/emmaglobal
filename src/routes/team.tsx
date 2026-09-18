import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CtaBand, PageHero, SectionHeader } from "../components/site-shell";
import { breadcrumbJsonLd, jsonLd, seo } from "../lib/seo";
import { groupStats, leadership, principles, regions } from "../lib/site-data";

export const Route = createFileRoute("/team")({
  head: () => {
    const { meta, links } = seo({
      title: "Our Team",
      description:
        "Emma Global brings together specialist practices in workforce, operations, sustainability and digital, supported by regional teams across four hubs.",
      path: "/team",
    });
    return {
      meta,
      links,
      scripts: [jsonLd(breadcrumbJsonLd([{ name: "Our Team", path: "/team" }]))],
    };
  },
  component: TeamPage,
});

function TeamPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Our Team" }]}
        eyebrow="The people behind the work"
        title="Specialist practices,"
        accent="one team"
        description="Emma Global is organised as four specialist practices working to a shared operating model, supported by regional teams and a network of qualified local professionals."
        stats={groupStats}
      />

      <section className="section section-light">
        <SectionHeader
          eyebrow="How we're organised"
          title="Practices, not departments"
          text="Each practice owns its domain expertise. Engagements draw on whichever combination the work actually needs."
        />
        <div className="card-grid cols-3">
          {leadership.map((person) => {
            const Icon = person.icon;
            return (
              <article className="person" key={person.name}>
                <span className="person-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{person.name}</h3>
                <p className="person-role">{person.role}</p>
                <p>{person.bio}</p>
              </article>
            );
          })}
        </div>
        <p className="legal-meta" style={{ maxWidth: "760px", margin: "48px auto 0" }}>
          Individual consultant profiles are shared during scoping, so you know exactly who will be
          working on your engagement before it begins.
        </p>
      </section>

      <section className="section section-off">
        <SectionHeader
          eyebrow="Where we operate"
          title="Four regional hubs"
          text="Delhi, Singapore, the United Kingdom and Dubai — covering 30 markets between them."
        />
        <div className="card-grid cols-4">
          {regions.map((region) => (
            <div className="card" key={region.slug}>
              <h3>{region.hub}</h3>
              <p className="person-role">{region.name}</p>
              <p>{region.note}</p>
              <ul className="card-tags">
                <li>{region.markets} markets</li>
                <li>{region.people} people</li>
              </ul>
            </div>
          ))}
        </div>
        <div className="center">
          <Link to="/regions" className="btn-outline">
            Explore the regions
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section section-light">
        <SectionHeader eyebrow="How we work together" title="What our teams hold themselves to" />
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

      <CtaBand
        title="Want to meet the team?"
        text="We'll introduce the practice leads relevant to your priorities and set out how an engagement would be staffed."
        action="Arrange an introduction"
      />
    </>
  );
}
