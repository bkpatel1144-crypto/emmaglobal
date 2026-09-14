import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { ContactForm } from "../components/contact-form";
import { ServiceCards } from "../components/service-cards";
import { SectionHeader } from "../components/site-shell";
import { seo } from "../lib/seo";
import { advantages, contactChannels, pillars, sectors, services, site } from "../lib/site-data";

export const Route = createFileRoute("/")({
  head: () => {
    const { meta, links } = seo({
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      path: "/",
      noSuffix: true,
    });
    return { meta, links };
  },
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid-lines" />
        <div className="hero-globe-wrap">
          <img
            src="/media/hero-world-map.png"
            alt=""
            width={1200}
            height={700}
            fetchPriority="high"
          />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles aria-hidden="true" />
            Global Integrated Solutions
          </div>
          {/* The breaks are tuned for the desktop measure and are hidden below
              760px. Each is preceded by an explicit space so the words stay
              separate when it is — without it "Workforce,Sustainability" becomes
              one unbreakable token and forces the page wider than the screen. */}
          <h1>
            Empowering <span className="accent">Workforce,</span> <br className="hero-break" />
            Sustainability &amp; <span className="accent2">Digital</span>{" "}
            <br className="hero-break" />
            Transformation
          </h1>
          <p className="hero-sub">
            Emma Global delivers integrated solutions across workforce management, administration,
            ESG, and digital innovation — helping businesses scale efficiently and sustainably.
          </p>
          <div className="hero-actions">
            <a href="#services" className="btn-primary">
              Explore Services
              <ArrowRight aria-hidden="true" />
            </a>
            <Link to="/contact" className="btn-ghost">
              Get in Touch
            </Link>
          </div>
          <div className="hero-stats">
            <div className="h-stat">
              <div className="num">
                4<span>+</span>
              </div>
              <div className="lbl">Service Domains</div>
            </div>
            <div className="h-stat">
              <div className="num">
                100<span>%</span>
              </div>
              <div className="lbl">Compliance Focus</div>
            </div>
            <div className="h-stat">
              <div className="num">
                30<span>+</span>
              </div>
              <div className="lbl">Markets Served</div>
            </div>
            <div className="h-stat">
              <div className="num">ESG</div>
              <div className="lbl">Certified Consulting</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="intro-strip">
        <div className="intro-text">
          <p className="eyebrow">Who We Are</p>
          <h2>
            One Partner.
            <br />
            Four Powerful Domains.
          </h2>
          <p>
            From talent acquisition and payroll to ESG compliance and AI-driven automation — Emma
            Global brings everything together so your business can focus on what matters most:
            growth.
          </p>
        </div>
        <div className="intro-grid">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div className="intro-tile" key={pillar.title}>
                <span className="intro-tile-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about-section" id="about">
        <div className="about-inner">
          <div className="about-text">
            <p className="eyebrow">About Emma Global</p>
            <h2>Integrated Solutions for a Changing World</h2>
            <p>
              Emma Global delivers <strong>integrated solutions</strong> across workforce
              management, administration, sustainability, and digital innovation — helping
              businesses scale efficiently and sustainably.
            </p>
            <p>
              We understand that today's organizations face multiple complex challenges
              simultaneously. That's why we offer a unified approach that connects people,
              processes, and technology across every function.
            </p>
            <p style={{ marginTop: "1.6rem" }}>
              <Link to="/about" className="btn-outline">
                More about us
                <ArrowRight aria-hidden="true" />
              </Link>
            </p>
          </div>
          <div className="about-pillars">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div className="pillar" key={pillar.title}>
                  <span className="pillar-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services-section" id="services">
        <SectionHeader
          eyebrow="What We Offer"
          title="Our Four Core Services"
          text="Comprehensive, integrated solutions designed to drive efficiency, compliance, and sustainable growth across your organisation."
        />
        <ServiceCards services={services} />
      </section>

      {/* ── WHY EMMA ── */}
      <section className="why-section" id="why">
        <SectionHeader
          eyebrow="Why Choose Emma Global"
          title="Your Integrated Growth Partner"
          text="We don't offer isolated solutions — we deliver a connected ecosystem that works together to drive real, measurable outcomes."
        />
        <div className="why-grid">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;
            return (
              <div className="why-card" key={advantage.title}>
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

      {/* ── SECTORS ── */}
      <section className="sectors-section">
        <SectionHeader
          eyebrow="Industries We Serve"
          title="Across Every Sector"
          text="Emma Global's integrated solutions serve organisations of all sizes across a wide range of industries."
        />
        <div className="sectors-grid">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <span className="sector-tag" key={sector.name}>
                <Icon aria-hidden="true" />
                {sector.name}
              </span>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Transform Your Business?</h2>
          <p>
            Let's discuss how Emma Global can help you scale smarter, operate sustainably, and lead
            with confidence.
          </p>
          <a href="#contact" className="btn-white">
            Schedule a Free Consultation
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="contact-info">
            <p className="eyebrow">Get in Touch</p>
            <h2>Let's Build Something Together</h2>
            <p>
              Reach out to our team to explore how Emma Global's integrated solutions can be
              tailored to your unique business needs.
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
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
