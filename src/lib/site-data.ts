/* ============================================================================
   Emma Global — site content
   Single source of truth for copy that appears on more than one page. Service
   names, descriptions and feature lists are reproduced exactly as approved in
   the reference design.

   Icons are lucide-react components, never emoji — emoji render differently on
   every operating system and read as decoration rather than interface.
   ========================================================================== */

import {
  BadgeCheck,
  Banknote,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  ClipboardCheck,
  Clock,
  Compass,
  Cpu,
  Factory,
  FileBarChart,
  GaugeCircle,
  Globe2,
  GraduationCap,
  Handshake,
  HardHat,
  HeartPulse,
  Landmark,
  Layers,
  Leaf,
  LifeBuoy,
  Mail,
  MapPin,
  Network,
  Package,
  Phone,
  Recycle,
  ScrollText,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Truck,
  UserPlus,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Contact details — the single source every page reads from.
 *
 * The office address and both email addresses are the real values supplied by
 * Emma Global. Only the phone number is still outstanding; see the note on it.
 */
export const contact = {
  /** Registered office, one entry per rendered line. */
  addressLines: ["12-B North Parade", "Mollison Way", "Edgware, Harrow", "Middlesex", "HA8 5QH"],
  /**
   * No number supplied yet. The contact rows are rendered from this value, so
   * leaving it empty simply omits the phone line rather than publishing a
   * placeholder. Set it and the row reappears everywhere.
   */
  phone: "", // TODO: add the office number
  phoneHref: "", // set alongside `phone`, e.g. "+442080001234"
  /** First entry is the primary address used for form delivery and mailto links. */
  emails: ["Puwar.R@emma-global.com", "patel.a@emma-global.com"],
  hours: "Mon – Fri: 9:00 AM – 6:00 PM",
  linkedin: "https://www.linkedin.com/company/emma-global",
  twitter: "https://twitter.com/emmaglobal",
} as const;

/** Primary inbox — used for mailto links and as the contact-form fallback. */
export const primaryEmail = contact.emails[0];

/** Single-line form of the office address, for prose and structured data. */
export const addressOneLine = contact.addressLines.join(", ");

/**
 * Production origin, no trailing slash.
 *
 * Every canonical URL, Open Graph tag, sitemap entry, robots directive and
 * piece of structured data is built from this one value. Override it without
 * touching code by setting `VITE_SITE_URL` (Vercel) — `SITE_URL` is the
 * equivalent for the SEO generator, which runs in plain Node.
 */
function resolveSiteUrl(): string {
  const fromVite = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.[
    "VITE_SITE_URL"
  ];
  const fromNode =
    typeof process !== "undefined"
      ? (process.env as Record<string, string | undefined>)?.["SITE_URL"]
      : undefined;
  return (fromVite || fromNode || "https://emma-global.com").replace(/\/+$/, "");
}

export const site = {
  name: "Emma Global",
  legalName: "Emma Global",
  tagline: "Empowering Workforce, Sustainability & Digital Transformation",
  description:
    "Emma Global delivers integrated solutions across workforce management, administration, ESG, and digital innovation — helping businesses scale efficiently and sustainably.",
  url: resolveSiteUrl(),
  ogImage: "/og-image.png",
  locale: "en_GB",
} as const;

export type ContactChannel = {
  icon: LucideIcon;
  label: string;
  /** One rendered line per entry. */
  values: readonly string[];
  /** When set, each value is rendered as a link with this prefix. */
  hrefPrefix?: string;
};

export const contactChannels: ContactChannel[] = [
  { icon: MapPin, label: "Office", values: contact.addressLines },
  // Omitted entirely until a real number is supplied.
  ...(contact.phone ? [{ icon: Phone, label: "Phone", values: [contact.phone] }] : []),
  { icon: Mail, label: "Email", values: contact.emails, hrefPrefix: "mailto:" },
  { icon: Clock, label: "Hours", values: [contact.hours] },
];

/* ── SERVICES ─────────────────────────────────────────────────────────────
   `items` drive the expandable list on the home page. An item with a `video`
   plays the clip supplied by the client. Items without one are plain list
   entries — no placeholder panel, and no clip is ever reused across items.
   ------------------------------------------------------------------------ */

export type ServiceItem = { label: string; video?: string; detail: string };

export type Service = {
  slug: string;
  /** Card + home page title, verbatim from the reference. */
  title: string;
  /** Shorter label for navigation and cross-links. */
  shortTitle: string;
  icon: LucideIcon;
  /** Background class for the icon tile: svc-hr | svc-admin | svc-esg | svc-dig */
  tone: string;
  /** Bullet colour class: dot-sky | dot-amber | dot-teal | dot-purple */
  dot: string;
  summary: string;
  items: ServiceItem[];
  /** Detail-page content. */
  eyebrow: string;
  intro: string;
  body: string[];
  deliverables: { icon: LucideIcon; title: string; text: string }[];
  outcomes: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  /**
   * Not launched yet. The service is hidden from the site entirely — the cards,
   * the /services listing, the footer, the sidebar and the sitemap — and its
   * detail page returns 404. Remove this flag to bring it back; all of the copy
   * below is kept intact and ready.
   */
  comingSoon?: boolean;
};

export const services: Service[] = [
  {
    slug: "hr-solutions",
    title: "Human Resources (HR Solutions)",
    shortTitle: "HR Solutions",
    icon: Users,
    tone: "svc-hr",
    dot: "dot-sky",
    summary:
      "Comprehensive talent acquisition and workforce management solutions across skilled and professional roles, tailored to meet your business needs.",
    items: [
      {
        label: "Comprehensive Talent Acquisition for Skilled & Professional Workforce",
        video: "/media/hr-talent-acquisition.mp4",
        detail:
          "Sourcing, assessment and onboarding for technical, skilled and professional roles, run against a defined workforce plan rather than a stream of one-off vacancies.",
      },
      {
        label: "Payroll management",
        video: "/media/hr-payroll-management.mp4",
        detail:
          "End-to-end payroll processing, statutory deductions and filings, with records kept in a state where an audit needs no reconstruction.",
      },
      {
        label: "Employee engagement",
        video: "/media/hr-employee-engagement.mp4",
        detail:
          "Engagement programmes built on what the workforce data actually shows, with follow-through tracked rather than announced once and forgotten.",
      },
      {
        label: "Compliance & policies",
        video: "/media/hr-compliance-policies.mp4",
        detail:
          "Employment policy frameworks kept current with the law and, just as importantly, with what happens on site.",
      },
      {
        label: "Training & development",
        detail:
          "Training needs analysis, programme design and delivery, aimed at the capability gaps that limit the business today.",
      },
      {
        label: "Employee Workplace Survey",
        detail:
          "Structured surveys with honest reporting and a defined action cycle, so results lead somewhere.",
      },
      {
        label: "Organization development",
        detail:
          "Structure, role design and change support for teams that have outgrown the way they were originally set up.",
      },
    ],
    eyebrow: "People & performance",
    intro:
      "From finding specialised talent to developing engaged, compliant teams, Emma Global connects the complete employee journey under one accountable partner.",
    body: [
      "Hiring, paying, developing and retaining people are usually handled by separate systems and separate suppliers. The result is duplicated effort, inconsistent data and policies that drift apart from day-to-day practice.",
      "We bring the employee lifecycle together. Talent acquisition is run against a clear role definition and workforce plan. Payroll, compliance and policy work operate from the same records. Engagement and development programmes are designed around what the workforce data is actually telling you.",
      "That connected view means fewer gaps at handover points, faster time-to-productivity for new joiners, and an HR function that leadership can plan around with confidence.",
    ],
    deliverables: [
      {
        icon: UserPlus,
        title: "Talent acquisition",
        text: "Skilled, technical and professional hiring run against a workforce plan, with structured assessment at each stage.",
      },
      {
        icon: Banknote,
        title: "Payroll operations",
        text: "Processing, statutory filings and records management, delivered to a fixed monthly calendar.",
      },
      {
        icon: ScrollText,
        title: "Policy & compliance",
        text: "Employment policy frameworks, statutory compliance reviews and documentation that survives an audit.",
      },
      {
        icon: GaugeCircle,
        title: "Engagement & surveys",
        text: "Workplace surveys with honest analysis and an action cycle that is tracked to completion.",
      },
      {
        icon: GraduationCap,
        title: "Training & development",
        text: "Needs analysis, programme design and delivery focused on the capability gaps that constrain the business.",
      },
      {
        icon: Layers,
        title: "Organisation development",
        text: "Structure, role design, restructuring and the change support that makes any of it stick.",
      },
    ],
    outcomes: [
      { value: "Single", label: "Accountable partner" },
      { value: "End-to-end", label: "Employee lifecycle" },
      { value: "Audit-ready", label: "Payroll & compliance" },
      { value: "Measured", label: "Engagement outcomes" },
    ],
    faqs: [
      {
        q: "Can you take on payroll for an existing workforce?",
        a: "Yes. Payroll transitions run to an agreed plan — we run a parallel cycle before cutover so nothing depends on a single switchover date.",
      },
      {
        q: "Do you replace our internal HR team?",
        a: "Almost never. We usually take the operational load — payroll, compliance, sourcing — so the internal team can focus on the work that needs to sit inside the business.",
      },
      {
        q: "How do you handle high-volume skilled hiring?",
        a: "Against a workforce plan rather than a vacancy list, with a defined assessment process and a single pipeline view, so quality does not fall away as volume rises.",
      },
    ],
  },
  {
    slug: "administration-services",
    title: "Administration Services",
    shortTitle: "Administration",
    icon: Building2,
    tone: "svc-admin",
    dot: "dot-amber",
    summary:
      "Streamlined administrative and operational support to enhance efficiency, ensure compliance, and improve day-to-day business performance.",
    items: [
      {
        label: "Office & facility management",
        detail:
          "Day-to-day management of offices and facilities across single or multiple sites, with named ownership for every recurring task.",
      },
      {
        label: "Vendor coordination",
        detail:
          "Vendor selection, contracting and performance monitoring against agreed service levels rather than goodwill.",
      },
      {
        label: "Documentation & compliance",
        detail:
          "Document control, renewal calendars and compliance registers kept current, so nothing lapses unnoticed.",
      },
      {
        label: "Operational support",
        detail:
          "The recurring administrative work that otherwise consumes senior people's time, handled to a defined calendar.",
      },
      {
        label: "Catering service",
        detail:
          "Workplace catering managed as a measured service, with quality and cost both visible.",
      },
      {
        label: "Cab service",
        detail:
          "Employee transport coordination covering routing, safety compliance and cost tracking.",
      },
    ],
    eyebrow: "Operational excellence",
    intro:
      "Coordinated administrative support that keeps facilities, vendors, documentation and daily operations moving without pulling your teams off their own work.",
    body: [
      "Administration is the work that becomes visible only when it fails. A missed renewal, an unmanaged vendor, a facility issue that nobody owns — each one pulls senior people away from the work they were hired to do.",
      "Emma Global takes operational responsibility for that layer. We manage offices and facilities, coordinate vendors against agreed service levels, keep documentation current and audit-ready, and run the employee services — catering and transport among them — that shape daily experience.",
      "Everything runs to a defined calendar with named owners and reporting, so you can see what is on track and what needs a decision.",
    ],
    deliverables: [
      {
        icon: Building2,
        title: "Facility management",
        text: "Offices and facilities across single or multiple sites, run to a maintenance and inspection calendar.",
      },
      {
        icon: Handshake,
        title: "Vendor management",
        text: "Selection, contracting and service-level monitoring, with performance reviewed on a fixed cycle.",
      },
      {
        icon: ClipboardCheck,
        title: "Documentation control",
        text: "Registers, renewals and compliance records maintained so nothing lapses without warning.",
      },
      {
        icon: LifeBuoy,
        title: "Operational support",
        text: "The recurring administrative workload, absorbed and reported rather than left to absorb your team.",
      },
      {
        icon: Truck,
        title: "Employee services",
        text: "Catering and transport coordination delivered against measured service levels.",
      },
      {
        icon: FileBarChart,
        title: "Cost & performance reporting",
        text: "Periodic reporting on spend, service levels and exceptions, in a format leadership can act on.",
      },
    ],
    outcomes: [
      { value: "Named", label: "Ownership per task" },
      { value: "Tracked", label: "Vendor performance" },
      { value: "Current", label: "Documentation" },
      { value: "Lower", label: "Admin load on teams" },
    ],
    faqs: [
      {
        q: "Can you manage sites in more than one city?",
        a: "Yes. Multi-site administration is the common case — one operating standard, one reporting pack, local delivery at each site.",
      },
      {
        q: "Do you take over existing vendor contracts?",
        a: "Where it helps. We review what is in place, keep what performs, and renegotiate or replace what does not.",
      },
      {
        q: "How is performance measured?",
        a: "Against service levels agreed at the start, reported on a fixed cycle, with exceptions raised as they happen rather than at review time.",
      },
    ],
  },
  {
    slug: "esg-advisory-audits",
    // Launching later — hidden site-wide until then. Delete this line to publish.
    comingSoon: true,
    title: "ESG advisory and Audits",
    shortTitle: "ESG Advisory",
    icon: Leaf,
    tone: "svc-esg",
    dot: "dot-teal",
    summary:
      "Strategic ESG solutions to help organizations achieve sustainability goals, ensure compliance, and build responsible business practices.",
    items: [
      {
        label: "ESG strategy & consulting",
        detail:
          "Materiality assessment first, then targets that the business can actually reach on a stated timeline.",
      },
      {
        label: "Sustainability reporting",
        detail:
          "Reporting aligned to recognised frameworks and supported by evidence, not assertion.",
      },
      {
        label: "Compliance & audits",
        detail:
          "Internal audits, supplier assessments and compliance reviews that test practice against policy.",
      },
      {
        label: "CSR (Corporate Social Responsibilities) initiatives",
        detail:
          "CSR programmes designed, delivered and measured as part of the business rather than alongside it.",
      },
      {
        label: "Annual report",
        detail:
          "Annual report content, data assurance and narrative support for the sustainability sections.",
      },
    ],
    eyebrow: "Responsible progress",
    intro:
      "Practical sustainability strategy, reporting and governance that turn stated commitments into evidence you can put in front of a regulator, an investor or a customer.",
    body: [
      "ESG expectations now arrive from several directions at once — regulators, listed customers, lenders and prospective employees. Each asks for something slightly different, and most organisations end up answering them one at a time.",
      "We start by establishing what actually applies to your business, then build the underlying data and governance once so it can serve every disclosure you need. Assessments identify the material issues; strategy sets targets that are achievable; audits and compliance reviews test whether the practice matches the policy.",
      "The result is reporting supported by evidence rather than assertion, and a CSR programme connected to the business rather than run alongside it.",
    ],
    deliverables: [
      {
        icon: Target,
        title: "Materiality & strategy",
        text: "Establish what genuinely applies to your business, then set targets that are achievable and dated.",
      },
      {
        icon: FileBarChart,
        title: "Sustainability reporting",
        text: "Disclosures aligned to recognised frameworks, built on a data set that serves every request.",
      },
      {
        icon: BadgeCheck,
        title: "Audits & assurance",
        text: "Internal audits and readiness reviews that test whether practice matches published policy.",
      },
      {
        icon: Network,
        title: "Supplier assessment",
        text: "Supply-chain ESG assessment and remediation planning for export-facing and regulated businesses.",
      },
      {
        icon: Recycle,
        title: "CSR programmes",
        text: "Design, delivery and impact measurement for CSR commitments, tied back to the business.",
      },
      {
        icon: ShieldCheck,
        title: "Board briefings",
        text: "Plain briefings for leadership on what is required, what is exposed, and what to decide next.",
      },
    ],
    outcomes: [
      { value: "Material", label: "Issues identified" },
      { value: "Evidenced", label: "Disclosures" },
      { value: "Framework", label: "Aligned reporting" },
      { value: "Governed", label: "CSR programmes" },
    ],
    faqs: [
      {
        q: "A customer has sent us an ESG assessment. Can you help?",
        a: "Yes, and it is a common starting point. We close the gap between existing policy and site practice, then build the evidence base so the next assessment is routine rather than a project.",
      },
      {
        q: "Which reporting frameworks do you work to?",
        a: "Whichever applies to your market, customers and lenders. The underlying data is built once so it can serve more than one disclosure.",
      },
      {
        q: "Is this only for listed companies?",
        a: "No. Most of our ESG work is for private businesses that supply listed customers, export to regulated markets, or borrow from lenders with their own requirements.",
      },
    ],
  },
  {
    slug: "digital-ai-solutions",
    title: "Digital & AI Solutions",
    shortTitle: "Digital & AI",
    icon: Bot,
    tone: "svc-dig",
    dot: "dot-purple",
    summary:
      "Leveraging technology, automation, and AI-driven insights to optimize processes and accelerate digital transformation.",
    items: [
      {
        label: "Process automation",
        detail:
          "Processes mapped and simplified before anything is automated, so the inefficiency is removed rather than accelerated.",
      },
      {
        label: "AI-powered analytics",
        detail:
          "Reporting built around the decisions that need better information, instead of dashboards nobody opens.",
      },
      {
        label: "Digital transformation",
        detail:
          "Phased roadmaps with each stage delivering something usable, rather than a single distant cutover.",
      },
      {
        label: "Workflow optimization",
        detail:
          "Handoffs, approvals and duplicated data entry removed across functions and systems.",
      },
    ],
    eyebrow: "Intelligent transformation",
    intro:
      "Focused automation, analytics and digital programmes that simplify work and speed up decisions — applied where they earn their place, not everywhere at once.",
    body: [
      "Most automation disappoints for the same reason: it is applied to a process that was never redesigned. The inefficiency is preserved, only faster and harder to see.",
      "We map the process first, remove what is unnecessary, and then automate what remains. Analytics work follows the same discipline — we identify the decisions that need better information, and build reporting for those rather than assembling dashboards nobody opens.",
      "Where AI is the right tool we apply it with governance attached: defined use cases, human review where it matters, and clear rules about what data may be used. Adoption support is part of the work, because a system nobody trusts delivers nothing.",
    ],
    deliverables: [
      {
        icon: Workflow,
        title: "Process mapping",
        text: "The current process documented as it actually runs, with duplication and dead steps identified.",
      },
      {
        icon: Cpu,
        title: "Automation delivery",
        text: "Automation applied to the simplified process, scoped to what measurably pays back.",
      },
      {
        icon: TrendingUp,
        title: "Analytics & reporting",
        text: "Reporting built around specific decisions, with the data lineage behind each number.",
      },
      {
        icon: ShieldCheck,
        title: "AI governance",
        text: "Defined use cases, permitted data, and human review where the stakes require it.",
      },
      {
        icon: Sparkles,
        title: "Digital roadmap",
        text: "A phased plan where each stage ships something usable rather than deferring all value to the end.",
      },
      {
        icon: GraduationCap,
        title: "Adoption support",
        text: "Training and hand-holding through the change, because an untrusted system delivers nothing.",
      },
    ],
    outcomes: [
      { value: "Mapped", label: "Before automated" },
      { value: "Governed", label: "AI adoption" },
      { value: "Fewer", label: "Manual handoffs" },
      { value: "Faster", label: "Decision cycles" },
    ],
    faqs: [
      {
        q: "We automated a process and saw no benefit. What went wrong?",
        a: "Usually the process was automated as-is. If duplicated approvals and multiple data-entry points remain in the flow, automation just makes them run faster. We map and simplify first.",
      },
      {
        q: "How do you govern AI use?",
        a: "Use cases are defined before a tool goes into service, permitted data is stated in writing, and human review is required wherever an error would carry real consequences.",
      },
      {
        q: "Do you replace our existing systems?",
        a: "Rarely. Most value comes from removing steps and connecting what is already in place, not from another migration.",
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/**
 * The services actually offered today. Everything that lists or links services —
 * the home grid, /services, the footer, the detail sidebar and the sitemap —
 * reads from this, so clearing a `comingSoon` flag publishes the service
 * everywhere at once.
 */
export const availableServices = services.filter((s) => !s.comingSoon);

/* ── HOME PAGE SECTIONS (verbatim from the reference) ─────────────────────── */

export type Pillar = {
  icon: LucideIcon;
  title: string;
  text: string;
  /** Renders a COMING SOON badge and holds the card back visually. */
  comingSoon?: boolean;
};

export const pillars: Pillar[] = [
  {
    icon: Users,
    title: "Workforce",
    text: "End-to-end HR and talent management solutions for modern organizations.",
  },
  {
    icon: Building2,
    title: "Administration",
    text: "Streamlined operations and facility management for peak performance.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    text: "ESG, EHS & sustainability solutions are coming soon.",
    comingSoon: true,
  },
  {
    icon: Bot,
    title: "Digital & AI",
    text: "Technology and automation solutions that accelerate transformation.",
  },
];

export type Advantage = {
  icon: LucideIcon;
  title: string;
  text: string;
  /** Renders a COMING SOON badge and holds the card back visually. */
  comingSoon?: boolean;
};

export const advantages: Advantage[] = [
  {
    icon: Network,
    title: "Fully Integrated Approach",
    text: "HR, admin, ESG, and digital services work in harmony — no silos, no gaps, just seamless operations across your entire business.",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance-First Mindset",
    text: "Every solution is built with compliance and governance at its core, ensuring your business meets all regulatory standards.",
  },
  {
    icon: Globe2,
    title: "Global Expertise, Local Understanding",
    text: "We bring international best practices combined with deep knowledge of local business environments and requirements.",
  },
  {
    icon: Leaf,
    title: "Sustainability at the Core",
    text: "ESG, EHS and sustainability will be woven through everything we do — helping you build a business that's profitable and responsible.",
    comingSoon: true,
  },
  {
    icon: Sparkles,
    title: "AI-Powered Efficiency",
    text: "We leverage the latest in automation and AI to streamline your workflows and deliver faster, smarter results.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    text: "We invest in understanding your goals deeply and grow with you, providing ongoing support as your business evolves.",
  },
];

export const sectors = [
  { icon: Factory, name: "Manufacturing" },
  { icon: Cpu, name: "Technology" },
  { icon: HeartPulse, name: "Healthcare" },
  { icon: Landmark, name: "Banking & Finance" },
  { icon: ShoppingBag, name: "Retail" },
  { icon: HardHat, name: "Infrastructure" },
  { icon: Package, name: "Logistics" },
  { icon: Zap, name: "Energy" },
  { icon: GraduationCap, name: "Education" },
  { icon: Briefcase, name: "Professional Services" },
] as const;

export const serviceOptions = [
  "Human Resources (HR Solutions)",
  "Administration Services",
  "ESG advisory and Audits",
  "Digital & AI Solutions",
  "Multiple Services",
] as const;

/* ── SHARED ACROSS INNER PAGES ────────────────────────────────────────────── */

export const processSteps = [
  {
    n: "01",
    icon: Search,
    title: "Discover",
    text: "We map the current position — people, processes, obligations and systems — and agree what success needs to look like.",
  },
  {
    n: "02",
    icon: Compass,
    title: "Design",
    text: "We build a connected plan across the functions involved, with named owners, sequencing and practical milestones.",
  },
  {
    n: "03",
    icon: Workflow,
    title: "Deliver",
    text: "We implement alongside your teams, coordinating the moving parts and reporting progress against the plan.",
  },
  {
    n: "04",
    icon: TrendingUp,
    title: "Improve",
    text: "We review outcomes, strengthen adoption and adjust the approach as the organisation and its obligations evolve.",
  },
] as const;

export const principles = [
  {
    icon: Compass,
    title: "Clarity before complexity",
    text: "We make priorities understandable first. A plan that a team can explain to itself is a plan that gets delivered.",
  },
  {
    icon: ShieldCheck,
    title: "Responsibility by design",
    text: "Compliance, people and environmental impact are considered from the first design session, not bolted on before an audit.",
  },
  {
    icon: Handshake,
    title: "Partnership in practice",
    text: "We work inside your teams, transfer capability as we go, and measure ourselves on what still works after we step back.",
  },
] as const;

export const regions = [
  {
    slug: "south-asia",
    name: "South Asia",
    hub: "Delhi",
    markets: 7,
    economy: "USD 27.9T",
    people: "3.2 bn",
    note: "India, Nepal, Bangladesh, Sri Lanka, China, Maldives and Russia, served from Delhi.",
  },
  {
    slug: "asia-pacific",
    name: "Asia-Pacific",
    hub: "Singapore",
    markets: 8,
    economy: "USD 29.9T",
    people: "2 bn+",
    note: "Singapore, Indonesia, Thailand, Vietnam, China, Australia, South Korea and Japan.",
  },
  {
    slug: "europe",
    name: "UK and Europe",
    hub: "United Kingdom",
    markets: 8,
    economy: "USD 20.0T",
    people: "640 mn",
    note: "The UK, Germany, France, Spain, Italy, Romania, Turkey and Brazil.",
  },
  {
    slug: "mea",
    name: "Middle East and Africa",
    hub: "Dubai",
    markets: 9,
    economy: "USD 5.8T",
    people: "410 mn",
    note: "UAE, Qatar, Bahrain, Oman, Saudi Arabia, Israel, Tanzania, South Africa and Brazil.",
  },
] as const;

export const groupStats = [
  { value: "4", label: "Service domains" },
  { value: "4", label: "Regional hubs" },
  { value: "30", label: "Markets served" },
  { value: "USD 60T+", label: "Economic reach" },
] as const;

export const caseStudies = [
  {
    icon: Factory,
    sector: "Automotive components",
    region: "South Asia",
    title: "One partner replaces four suppliers across a nine-plant manufacturing group",
    challenge:
      "Recruitment, payroll, facility management and compliance reporting were split across four suppliers and nine sites. Group HR had no consistent workforce data and every audit cycle required manual reconciliation.",
    approach:
      "Emma Global consolidated the four functions under a single operating model, standardised records across all nine plants, and put one reporting calendar in place for both workforce and compliance data.",
    outcomes: [
      "Single monthly reporting pack",
      "Consistent records across 9 plants",
      "Audit preparation reduced to days",
    ],
  },
  {
    icon: Leaf,
    sector: "Textiles & apparel",
    region: "South Asia",
    title: "ESG evidence rebuilt ahead of a listed customer's supplier assessment",
    challenge:
      "A major export customer introduced supplier ESG assessments covering labour standards, workplace safety and environmental performance. The existing policies were sound but the supporting evidence was incomplete.",
    approach:
      "We ran a materiality assessment, closed the gaps between written policy and site practice, and built the data collection needed to support recurring disclosure rather than one-off responses.",
    outcomes: [
      "Assessment passed at first submission",
      "Repeatable evidence base",
      "Supplier audits now routine",
    ],
  },
  {
    icon: Workflow,
    sector: "Professional services",
    region: "UK and Europe",
    title: "Process redesign before automation cuts a client onboarding cycle",
    challenge:
      "A professional services firm had automated its client onboarding workflow and seen little benefit. The underlying process still carried duplicated approvals and three separate data entry points.",
    approach:
      "We mapped the process end to end, removed the duplicated steps, consolidated data capture, and only then rebuilt the automation — with governance defined for the AI-assisted checks.",
    outcomes: ["Handoffs reduced", "Single point of data capture", "Governed AI review step"],
  },
  {
    icon: Building2,
    sector: "Hospitality",
    region: "Middle East and Africa",
    title: "Seasonal recruitment and employee services brought under one calendar",
    challenge:
      "A multi-property hospitality operator managed seasonal recruitment, transport and catering through separate local arrangements at each property, with uneven service and unpredictable cost.",
    approach:
      "Emma Global standardised the recruitment cycle across properties and took operational responsibility for transport and catering under measured service levels.",
    outcomes: ["One recruitment calendar", "Service levels measured", "Predictable operating cost"],
  },
] as const;

export const leadership = [
  {
    icon: Compass,
    initials: "EG",
    name: "Group Leadership",
    role: "Executive team",
    bio: "Sets the integrated operating model across HR, administration, ESG and digital, and holds accountability for delivery in every region.",
  },
  {
    icon: Users,
    initials: "HR",
    name: "Workforce Practice",
    role: "HR solutions",
    bio: "Specialists in talent acquisition, payroll, employment compliance, engagement and organisation development across skilled and professional roles.",
  },
  {
    icon: Building2,
    initials: "OP",
    name: "Operations Practice",
    role: "Administration services",
    bio: "Facility, vendor and documentation management, plus the employee services that shape daily working experience across sites.",
  },
  {
    icon: Leaf,
    initials: "ES",
    name: "Sustainability Practice",
    role: "ESG advisory & audits",
    bio: "ESG strategy, materiality assessment, reporting, audit readiness and CSR programme delivery for regulated and export-facing businesses.",
  },
  {
    icon: Bot,
    initials: "AI",
    name: "Digital Practice",
    role: "Digital & AI solutions",
    bio: "Process mapping, automation, analytics and responsible AI governance, with adoption support built into every engagement.",
  },
  {
    icon: Globe2,
    initials: "RG",
    name: "Regional Network",
    role: "Four regional hubs",
    bio: "Operational teams in Delhi, Singapore, the United Kingdom and Dubai, supported by qualified local professionals across 30 markets.",
  },
] as const;

export const roles = [
  {
    title: "Senior Consultant — ESG Advisory",
    location: "Delhi, India",
    type: "Full time",
    practice: "ESG Advisory",
  },
  {
    title: "Talent Acquisition Specialist",
    location: "Delhi, India",
    type: "Full time",
    practice: "HR Solutions",
  },
  {
    title: "Payroll & Compliance Analyst",
    location: "Delhi, India",
    type: "Full time",
    practice: "HR Solutions",
  },
  {
    title: "Business Process Automation Lead",
    location: "Singapore",
    type: "Full time",
    practice: "Digital & AI",
  },
  {
    title: "Facility Operations Manager",
    location: "Dubai, UAE",
    type: "Full time",
    practice: "Administration",
  },
  {
    title: "Client Partner — UK and Europe",
    location: "United Kingdom",
    type: "Full time",
    practice: "Group",
  },
] as const;

export const benefits = [
  {
    icon: Layers,
    title: "Work across four domains",
    text: "Our consultants see how a workforce decision changes a compliance obligation. That breadth is hard to get anywhere else.",
  },
  {
    icon: Globe2,
    title: "International exposure",
    text: "Engagements run across 30 markets and four regional hubs, with real cross-border work rather than a head-office view of it.",
  },
  {
    icon: GraduationCap,
    title: "Capability transfer as the job",
    text: "You will spend part of every engagement teaching, because we measure success by what still works after we step back.",
  },
  {
    icon: Calendar,
    title: "Structured engagements",
    text: "Defined scope, named ownership and a fixed reporting rhythm — so the work is demanding without being chaotic.",
  },
] as const;

export const faqs = [
  {
    q: "Do we have to take every service?",
    a: "No. Most engagements begin with one service. The advantage of the integrated model is that when a second area comes into scope, it connects to work already in place rather than starting again with a new supplier.",
  },
  {
    q: "How do you work alongside an existing internal team?",
    a: "We work inside your structure rather than around it. Responsibilities are agreed in writing at the start, we report into your named owner, and we transfer capability as we go so the arrangement is not dependent on us indefinitely.",
  },
  {
    q: "Which regions can you support?",
    a: "We operate through four regional hubs — Delhi, Singapore, the United Kingdom and Dubai — covering 30 markets. Two markets, China and Brazil, are served jointly by two hubs. The regions page sets out the detail.",
  },
  {
    q: "How is an engagement priced?",
    a: "Pricing follows the shape of the work: retained for ongoing operational responsibility such as payroll or facility management, and project-based for defined pieces such as an ESG assessment or a process automation programme.",
  },
  {
    q: "How quickly can work start?",
    a: "A scoping conversation can usually happen within a few days. Time to start delivery depends on the service — an assessment can begin quickly, while taking over payroll or facility operations follows an agreed transition plan.",
  },
  {
    q: "What happens to our data?",
    a: "Data is handled under the terms agreed in your contract, used only for delivering the service, and returned or deleted on request. Where AI tools are used, the permitted data and the review steps are defined before the tool goes into use.",
  },
] as const;
