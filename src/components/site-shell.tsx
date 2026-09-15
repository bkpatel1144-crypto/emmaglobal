import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Linkedin, Menu, Twitter, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { contact, contactChannels, services } from "../lib/site-data";

const nav = [
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Regions", to: "/regions" },
  { label: "Why Us", to: "/why-us" },
  { label: "Case Studies", to: "/case-studies" },
] as const;

export function BrandLockup() {
  return (
    <Link to="/" className="nav-brand" aria-label="Emma Global — home">
      <span className="nav-globe">
        <img src="/media/emma-logo-source.jpg" alt="" width={40} height={40} />
      </span>
      <span className="nav-brand-text">
        <span className="brand-script">emma</span>
        <span className="brand-sub">GLOBAL</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close the mobile panel whenever navigation happens.
  useEffect(() => setOpen(false), [pathname]);

  // Past the first few pixels the bar detaches into a floating glass capsule.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scrolling while the panel covers the page.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <div className={`nav-shell${scrolled || open ? " is-scrolled" : ""}`}>
      <nav className="site-nav" aria-label="Main">
        <BrandLockup />
        <ul className="nav-links">
          {nav.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className={isActive(item.to) ? "is-active" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/contact" className="nav-cta">
              Contact Us
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="nav-panel" id="mobile-nav">
          <ul>
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={isActive(item.to) ? "is-active" : undefined}>
                  {item.label}
                  <ChevronRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/contact" className="nav-cta">
            Contact Us
          </Link>
        </div>
      )}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="f-brand">
          <div className="logo">
            <span className="logo-icon">
              <img src="/media/emma-logo-source.jpg" alt="" width={38} height={38} />
            </span>
            Emma Global
          </div>
          <p>
            Empowering Workforce, Sustainability &amp; Digital Transformation. Integrated solutions
            that help businesses scale efficiently and sustainably across four regional hubs.
          </p>
          <div className="f-social">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Emma Global on LinkedIn"
            >
              <Linkedin aria-hidden="true" />
            </a>
            <a
              href={contact.twitter}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Emma Global on X"
            >
              <Twitter aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="f-col">
          <h2>Services</h2>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>
                <Link to="/services/$service" params={{ service: service.slug }}>
                  {service.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="f-col">
          <h2>Company</h2>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/regions">Regions We Serve</Link>
            </li>
            <li>
              <Link to="/team">Our Team</Link>
            </li>
            <li>
              <Link to="/case-studies">Case Studies</Link>
            </li>
            <li>
              <Link to="/careers">Careers</Link>
            </li>
          </ul>
        </div>
        <div className="f-col">
          <h2>Connect</h2>
          <ul>
            <li>
              <a href={contact.linkedin} target="_blank" rel="noreferrer noopener">
                LinkedIn
              </a>
            </li>
            {contact.emails.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            ))}
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Use</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Emma Global. All rights reserved.</span>
        <span>Empowering Workforce, Sustainability &amp; Digital Transformation</span>
      </div>
    </footer>
  );
}

/** Shared hero for every page below the home page, including /regions. */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  crumbs,
  stats,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  crumbs?: { label: string; to?: string }[];
  stats?: readonly { value: string; label: string }[];
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        {crumbs && crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {crumbs.map((crumb) => (
              <span key={crumb.label}>
                <span aria-hidden="true">/</span>{" "}
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {title}
          {accent && (
            <>
              {" "}
              <span className="accent">{accent}</span>
            </>
          )}
        </h1>
        <p>{description}</p>
      </div>
      {stats && stats.length > 0 && (
        <div className="page-hero-stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Status pill for capabilities that are announced but not yet live. */
export function ComingSoonBadge() {
  return <span className="soon-badge">Coming soon</span>;
}

/** Renders the contact rows from `contactChannels` — used on home and /contact. */
export function ContactChannels() {
  return (
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
              {channel.values.map((value) =>
                channel.hrefPrefix ? (
                  <a key={value} href={`${channel.hrefPrefix}${value}`}>
                    {value}
                  </a>
                ) : (
                  <span className="c-item-value" key={value}>
                    {value}
                  </span>
                ),
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-hdr">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function CtaBand({
  title = "Ready to Transform Your Business?",
  text = "Let's discuss how Emma Global can help you scale smarter, operate sustainably, and lead with confidence.",
  action = "Schedule a Free Consultation",
}: {
  title?: string;
  text?: string;
  action?: string;
}) {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <h2>{title}</h2>
        <p>{text}</p>
        <Link to="/contact" className="btn-white">
          {action}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function Section({
  tone = "light",
  children,
  id,
}: {
  tone?: "light" | "off" | "dark";
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`section section-${tone}`}>
      {children}
    </section>
  );
}
