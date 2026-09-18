import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Video } from "lucide-react";

import { Accordion } from "../components/accordion";
import { CtaBand, PageHero, SectionHeader } from "../components/site-shell";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, seo, serviceJsonLd } from "../lib/seo";
import { availableServices, processSteps, serviceBySlug } from "../lib/site-data";

export const Route = createFileRoute("/services/$service")({
  // Only the slug crosses the server/client boundary. The service objects hold
  // lucide icon *components*, which have no serialisable form — returning one
  // from the loader breaks the hydration payload.
  loader: ({ params }) => {
    const service = serviceBySlug(params.service);
    // A service that has not launched has no public page yet.
    if (!service || service.comingSoon) throw notFound();
    return { slug: params.service };
  },
  head: ({ loaderData }) => {
    const service = loaderData ? serviceBySlug(loaderData.slug) : undefined;
    if (!service) return {};
    const { meta, links } = seo({
      title: service.title,
      description: service.summary,
      path: `/services/${service.slug}`,
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbJsonLd([
            { name: "Services", path: "/services" },
            { name: service.shortTitle, path: `/services/${service.slug}` },
          ]),
        ),
        jsonLd(serviceJsonLd(service)),
        jsonLd(faqJsonLd(service.faqs)),
      ],
    };
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useLoaderData();
  const service = serviceBySlug(slug);
  if (!service) throw notFound();
  const clips = service.items.filter((item) => item.video);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", to: "/services" }, { label: service.shortTitle }]}
        eyebrow={service.eyebrow}
        title={service.title}
        description={service.intro}
        stats={service.outcomes}
      />

      <section className="section section-light">
        <div className="split-sidebar">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>What this covers</h2>
            {service.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <aside className="side-card">
            <h2>All services</h2>
            <ul>
              {availableServices.map((other) => {
                const Icon = other.icon;
                return (
                  <li key={other.slug}>
                    <Link
                      to="/services/$service"
                      params={{ service: other.slug }}
                      className={other.slug === service.slug ? "is-active" : undefined}
                    >
                      <Icon aria-hidden="true" />
                      {other.shortTitle}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link to="/contact" className="btn-primary">
              Discuss this service
              <ArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      {/* What you get */}
      <section className="section section-off">
        <SectionHeader
          eyebrow="Scope of work"
          title="What you get"
          text="Engagements are scoped to the areas you need rather than sold as a fixed bundle."
        />
        <div className="card-grid cols-3">
          {service.deliverables.map((deliverable) => {
            const Icon = deliverable.icon;
            return (
              <div className="card" key={deliverable.title}>
                <span className="card-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{deliverable.title}</h3>
                <p>{deliverable.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detailed item list */}
      <section className="section section-light">
        <div className="split-2">
          <div>
            <p className="eyebrow">Included in the service</p>
            <h2>Everything under {service.shortTitle}</h2>
            <p className="lede">
              Each line below is a distinct piece of work with its own owner, scope and reporting.
            </p>
          </div>
          <ul className="check-list">
            {service.items.map((item) => (
              <li key={item.label}>
                {item.video ? <Video aria-hidden="true" /> : <Check aria-hidden="true" />}
                <span>
                  <strong style={{ display: "block", color: "var(--ink)", fontWeight: 600 }}>
                    {item.label}
                  </strong>
                  <span style={{ color: "var(--ink-muted)", fontSize: "0.88rem" }}>
                    {item.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Clips, where the client has supplied them */}
      {clips.length > 0 && (
        <section className="section section-off">
          <SectionHeader
            eyebrow="See it in practice"
            title="Short walkthroughs"
            text="Brief clips covering how these parts of the service actually run."
          />
          <div className="card-grid cols-2">
            {clips.map((clip) => (
              <div className="card" key={clip.label} style={{ padding: 0, overflow: "hidden" }}>
                <div className="svc-video-box" style={{ margin: 0, borderRadius: 0 }}>
                  <video controls playsInline preload="none" src={clip.video} />
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <h3 style={{ marginBottom: "8px" }}>{clip.label}</h3>
                  <p>{clip.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it runs */}
      <section className="section section-dark">
        <SectionHeader
          eyebrow="How it runs"
          title="The same four stages"
          text="However the scope is shaped, the sequence and reporting rhythm stay the same."
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
          <SectionHeader eyebrow="Questions" title={`About ${service.shortTitle}`} />
          <Accordion items={service.faqs} />
        </div>
      </section>

      <CtaBand
        title={`Ready to talk about ${service.shortTitle}?`}
        text="Tell us what's in scope and what's causing friction today. We'll come back with a practical way forward."
        action="Schedule a Free Consultation"
      />
    </>
  );
}
