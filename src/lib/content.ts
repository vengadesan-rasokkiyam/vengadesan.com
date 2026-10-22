/**
 * Every fact and every line of copy on the site.
 *
 * Source: Resume — Vengadesan R. (Product Designer UX/UI), mirrored from
 * vengadesan-portfolio/src/lib/data.ts. Nothing here is invented beyond
 * remapping the site’s two “classes” onto UX Design and SaaS Product Design.
 */

export const site = {
  /** Canonical origin — www, no trailing slash. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vengadesan.design").replace(/\/$/, ""),
  version: "V1",
  year: 2026,
  /** Bump when the copy changes: the sitemap's lastmod and the pages' dateModified. */
  updated: "2026-10-16",
} as const;

export const profile = {
  name: "Vengadesan R.",
  first: "Vengadesan",
  /** Informal name used in conversation */
  nick: "Vengat",
  location: "Chennai, Tamil Nadu, India",
  timezone: "Asia/Kolkata",
  tzLabel: "IST",
  email: "vengadesan.rasokkiyam@gmail.com",
  whatsapp: "917010559179",
  phoneDisplay: "+91 70105 59179",
  resume: "/doc/Vengadesan-R-Resume.pdf",
  links: {
    github: "",
    linkedin: "https://www.linkedin.com/in/vengadesanr",
    instagram: "",
    youtube: "",
    behance: "https://www.behance.net/vengadesanr",
    dribbble: "https://dribbble.com/vengadesanr",
    portfolio: "https://vengadesan.design",
  },
  /** Hire signal — shown in chrome, contact, and headers */
  availability: {
    open: true,
    label: "Open to engagements",
    detail: "Select SaaS & product design · reply within a day · IST",
  },
} as const;

/**
 * /profile — personal identity card only.
 * Intentionally excludes role story, experience, projects, tools, and certs (those live elsewhere).
 */
export const personalDetails = [
  { label: "Full name", value: "Vengadesan Rasokkiyam" },
  { label: "Goes by", value: "Vengat" },
  { label: "Role", value: "Product Designer (UX/UI)" },
  { label: "Based in", value: "Chennai, Tamil Nadu, India" },
  { label: "Timezone", value: "Asia/Kolkata (IST)" },
  { label: "Languages", value: "Tamil · English" },
  { label: "Work mode", value: "On-site · Hybrid · Remote (IST-friendly)" },
  { label: "Availability", value: "Open to engagements" },
] as const;

export const personalChannels = [
  {
    id: "email",
    label: "Email",
    value: "vengadesan.rasokkiyam@gmail.com",
    href: "mailto:vengadesan.rasokkiyam@gmail.com",
  },
  {
    id: "phone",
    label: "Phone",
    value: "+91 70105 59179",
    href: "tel:+917010559179",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+91 70105 59179",
    href: "https://wa.me/917010559179",
  },
] as const;

/** Designer-facing social / portfolio platforms (only entries with a live URL render). */
export const designerSocials = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "vengadesanr",
    href: "https://www.linkedin.com/in/vengadesanr",
    blurb: "Career, case notes, and product design updates.",
  },
  {
    id: "behance",
    label: "Behance",
    handle: "vengadesanr",
    href: "https://www.behance.net/vengadesanr",
    blurb: "Visual case studies and presentation decks.",
  },
  {
    id: "dribbble",
    label: "Dribbble",
    handle: "vengadesanr",
    href: "https://dribbble.com/vengadesanr",
    blurb: "UI shots, brand marks, and interaction peeks.",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    handle: "vengadesan.design",
    href: "https://vengadesan.design",
    blurb: "This site — selected product experience.",
  },
] as const;

/** Two playable classes. CSS grades stay `edit` / `code`. Role identity is one merged designer. */
export type Grade = "neutral" | "edit" | "code";

/** Single merged role — UX + SaaS product design together. */
export const role = {
  title: "Product Designer (UX/UI)",
  line: "Turning complex domains into intuitive experiences.",
  detail:
    "I lead product design from discovery through implementation — UX strategy, scalable design systems, and interaction patterns for SaaS and enterprise applications.",
} as const;

export const classes = {
  edit: {
    key: "edit" as const,
    player: "P1",
    word: "ROLE",
    title: "My Role",
    line: "Who I am, how I work, and the craft behind the work.",
    detail: "Bio, experience, skills, certifications — the full Product Designer (UX/UI) story.",
    href: "/myrole",
    cta: "Open my role",
    attributes: [
      ["Role", "Product Designer (UX/UI)"],
      ["Base", "Chennai, India"],
      ["Experience", "3.5+ years"],
    ],
  },
  code: {
    key: "code" as const,
    player: "P2",
    word: "WORK",
    title: "Projects",
    line: "Selected product experience — SaaS, web, mobile, and brand.",
    detail: "Browse the listing, then open any project for the full case landing.",
    href: "/work",
    cta: "Browse projects",
    attributes: [
      ["SaaS", "12 platforms"],
      ["Websites", "51 shipped"],
      ["Mobile", "6 applications"],
    ],
  },
} as const;

// ───────────────────────────────────────────────────────────────── UX work

export type Beat = {
  id: string;
  from: number;
  to: number;
  line: string;
  visual: string;
};

export type Reel = {
  slug: string;
  title: string;
  series?: string;
  hook: string;
  format: "talking_head" | "educational" | "podcast" | "documentary" | "repurposing";
  formatLabel: string;
  niche: string;
  platform: "instagram" | "shorts" | "youtube" | "tiktok";
  language: string;
  fps: number;
  frames: number;
  delivery: string;
  facts: { value: string; label: string }[];
  did: string[];
  tools: string[];
  beats: Beat[];
  ink: string;
  year: number;
  published: string;
};

/**
 * Featured product-experience categories from the résumé.
 * Kept on the `Reel` shape so existing /edit routes and cards still type-check;
 * media paths fall back to existing public assets until case-study art is added.
 */
export const reels: Reel[] = [
  {
    slug: "enterprise-saas",
    title: "Enterprise SaaS Applications",
    series: "Featured · 12 products",
    hook: "Dashboards, workflow systems, and business platforms.",
    format: "educational",
    formatLabel: "Enterprise SaaS UX/UI",
    niche: "SaaS",
    platform: "youtube",
    language: "English",
    fps: 30,
    frames: 1,
    delivery: "Design system + production UI",
    facts: [
      { value: "12", label: "SaaS platforms" },
      { value: "E2E", label: "discovery → ship" },
    ],
    did: [
      "Led end-to-end UX/UI for 12 enterprise SaaS platforms across logistics, insurance, legal-tech, AI, and business automation.",
      "Mapped workflows and simplified complex operations through discovery research.",
      "Designed scalable dashboards and multi-step workflow patterns.",
    ],
    tools: ["Figma", "FigJam", "Maze", "Jira"],
    ink: "#ff6a3d",
    year: 2026,
    published: "2026-02-01T00:00:00+05:30",
    beats: [],
  },
  {
    slug: "business-websites",
    title: "Business Websites",
    series: "Featured · 51 sites",
    hook: "Responsive marketing sites, landing pages, and corporate experiences.",
    format: "educational",
    formatLabel: "Marketing & web UX/UI",
    niche: "Web",
    platform: "youtube",
    language: "English",
    fps: 30,
    frames: 1,
    delivery: "Responsive web UI",
    facts: [{ value: "51", label: "websites shipped" }],
    did: [
      "Designed responsive marketing sites, landing pages, and corporate experiences.",
      "Scaled brand coherence across marketing websites and product touchpoints.",
    ],
    tools: ["Figma", "Framer", "Adobe Illustrator"],
    ink: "#3fd8c9",
    year: 2026,
    published: "2026-02-01T00:00:00+05:30",
    beats: [],
  },
  {
    slug: "mobile-applications",
    title: "Mobile Applications",
    series: "Featured · 6 apps",
    hook: "Mobile-first experiences with scalable design systems.",
    format: "educational",
    formatLabel: "Mobile UX/UI",
    niche: "Mobile",
    platform: "youtube",
    language: "English",
    fps: 30,
    frames: 1,
    delivery: "iOS / Android UI kits",
    facts: [{ value: "6", label: "mobile apps" }],
    did: [
      "Designed mobile-first experiences with scalable component libraries.",
      "Applied device-specific interaction patterns for consistent usability.",
    ],
    tools: ["Figma", "FigJam"],
    ink: "#ffd21f",
    year: 2026,
    published: "2026-02-01T00:00:00+05:30",
    beats: [],
  },
  {
    slug: "smart-watch",
    title: "Smart Watch Interface",
    series: "Featured · 1 product",
    hook: "Wearable UI focused on usability and simplified interactions.",
    format: "educational",
    formatLabel: "Wearable UI",
    niche: "Wearables",
    platform: "youtube",
    language: "English",
    fps: 30,
    frames: 1,
    delivery: "Watch OS UI",
    facts: [{ value: "1", label: "watch interface" }],
    did: ["Designed wearable UI focused on glanceability and simplified interactions."],
    tools: ["Figma"],
    ink: "#d4f51c",
    year: 2026,
    published: "2026-02-01T00:00:00+05:30",
    beats: [],
  },
];

/** About — “The Designer” frame (below One designer, full stack of craft). */
export const aboutDesigner = {
  identity: {
    label: "01 / Identity",
    title: "I think in systems. I design in experiences.",
    body: "From complex SaaS workflows to precise interface details, I connect product thinking, UX, and visual design to make digital products easier to use and scale.",
    tags: ["Product Thinking", "UX Architecture", "Interface Design", "Design Systems"],
  },
  territory: {
    label: "02 / My design territory",
    title: "Different problems. One design mindset.",
    cards: [
      {
        icon: "clarity",
        title: "Complexity → Clarity",
        body: "Turn complicated workflows, data, and requirements into understandable user journeys.",
        tags: "UX · Flows · IA",
      },
      {
        icon: "interfaces",
        title: "Ideas → Interfaces",
        body: "Transform concepts into structured layouts, clear visual hierarchies, and usable interactions.",
        tags: "UI · Prototypes · Interaction",
      },
      {
        icon: "systems",
        title: "Screens → Systems",
        body: "Build reusable components and consistent patterns that support product growth.",
        tags: "Tokens · Components · Scalability",
      },
      {
        icon: "reality",
        title: "Design → Reality",
        body: "Work with engineers to resolve edge cases, verify behavior, and preserve design intent.",
        tags: "Handoff · Collaboration · QA",
      },
    ],
  },
  mind: {
    label: "03 / How my mind works",
    title: "Every decision has a reason.",
    lede: "My design process is not just a sequence of deliverables. It is a way of reducing uncertainty at each stage.",
    steps: [
      {
        key: "A",
        title: "Question the problem",
        body: "What does the user need to accomplish? Where does the current experience create friction?",
      },
      {
        key: "B",
        title: "Find the structure",
        body: "What information, actions, and decisions should the experience contain?",
      },
      {
        key: "C",
        title: "Explore and refine",
        body: "Which interaction and interface best balance usability, business needs, and implementation constraints?",
      },
      {
        key: "D",
        title: "Test the outcome",
        body: "Does the solution work as intended? What needs to change after evaluation or implementation?",
      },
    ],
  },
  standard: {
    label: "04 / My design standard",
    title: "What makes a design good?",
    principles: [
      {
        icon: "glance",
        title: "Understandable at first glance",
        body: "Clear hierarchy, meaningful labels, and predictable navigation.",
      },
      {
        icon: "consistent",
        title: "Consistent across the product",
        body: "Reusable patterns, defined states, and a coherent visual language.",
      },
      {
        icon: "usable",
        title: "Usable in real conditions",
        body: "Accessibility, responsive behavior, errors, empty states, and edge cases considered.",
      },
      {
        icon: "ready",
        title: "Ready for implementation",
        body: "Clear specifications and collaboration that help engineering deliver the intended experience.",
      },
    ],
  },
  frontier: {
    label: "05 / The next frontier",
    title: "Designing with AI. Thinking beyond the interface.",
    body: "I explore AI-assisted workflows to accelerate exploration, prototyping, and repetitive tasks. My focus is using these capabilities thoughtfully while keeping product judgment, usability, and validation at the center.",
    tags: "AI Exploration · Rapid Prototyping · Human Validation",
  },
  proof: {
    label: "06 / The proof",
    title: "Don't just read about my design thinking. See it in action.",
    body: "Explore selected projects to see how these principles translate into real workflows, interfaces, and product decisions.",
    cta: "Explore my work",
    href: "/work",
  },
} as const;

export const services = [
  {
    n: "01",
    title: "Product discovery",
    body: "Guerilla research, interviews, and usability tests that generate insight — not just validate a screen.",
  },
  {
    n: "02",
    title: "Experience mapping",
    body: "Customer journey maps, service blueprints, and user story maps across the full end-to-end flow.",
  },
  {
    n: "03",
    title: "UX strategy",
    body: "Concept designs and experience requirements before wireframes, so direction lands before pixels.",
  },
  {
    n: "04",
    title: "Wireframes & prototypes",
    body: "Interactive prototypes with clear states so engineering and stakeholders share one picture.",
  },
  {
    n: "05",
    title: "Usability testing",
    body: "Heuristic reviews and test cycles that resolve critical drop-offs with actionable next steps.",
  },
  {
    n: "06",
    title: "Accessible delivery",
    body: "WCAG-minded, responsive experiences across desktop, tablet, and mobile.",
  },
] as const;

export const workflow = [
  { n: "01", title: "Discover", body: "Stakeholder interviews and user research to define the problem and the outcome." },
  { n: "02", title: "Map", body: "Journey maps and IA that show the whole experience, not a single screen." },
  { n: "03", title: "Design", body: "Wireframes, interaction patterns, and high-fidelity UI in a shared system." },
  { n: "04", title: "Validate", body: "Usability testing and design QA against real workflows." },
  { n: "05", title: "Handoff", body: "Annotated specs, tokens, and prototypes that shorten engineering cycles." },
] as const;

/** Interactive “How I work” process — home section below Selected work. */
export const processSteps = [
  {
    n: "01",
    label: "Discover",
    title: "Find the real problem",
    caption: "Stakeholder interviews and user research before any screens — so we design the right outcome.",
  },
  {
    n: "02",
    label: "Map",
    title: "See the whole journey",
    caption: "Journey maps and information architecture that show the end-to-end experience, not a single screen.",
  },
  {
    n: "03",
    label: "Design",
    title: "Shape the system",
    caption: "Wireframes, interaction patterns, and high-fidelity UI in a shared design system teams can ship.",
  },
  {
    n: "04",
    label: "Validate",
    title: "Test what matters",
    caption: "Usability tests and heuristics against real workflows — drop-offs get fixed before engineering scales them.",
  },
  {
    n: "05",
    label: "Handoff",
    title: "Ship with clarity",
    caption: "Annotated specs, tokens, and prototypes that shorten QA cycles and keep design intent intact.",
  },
] as const;

export const processProof = [
  { value: "5", label: "stages, discovery → ship" },
  { value: "3.5+", label: "years leading product UX" },
  { value: "12", label: "enterprise SaaS platforms" },
] as const;

export const processTools = ["Figma", "FigJam", "Framer", "Maze", "Jira", "Notion"] as const;

export const editFaq = [
  {
    q: "What kind of design work do you do?",
    a: "End-to-end product design for SaaS and enterprise applications — discovery, UX strategy, design systems, dashboards, workflows, and responsive UI across web and mobile.",
  },
  {
    q: "Do you work with engineering teams?",
    a: "Yes. I partner with product managers and engineers in agile sprints, produce annotated specs and interactive prototypes, and run design QA so shipped UI matches intent and accessibility standards.",
  },
  {
    q: "What industries have you designed for?",
    a: "Logistics, insurance, legal-tech, AI, and business automation — plus marketing websites, mobile apps, wearable UI, and brand systems that sit alongside the product.",
  },
  {
    q: "How do we start?",
    a: "Email or WhatsApp with the product context, users, and the outcome you need. I’ll reply with how I’d approach discovery and what I’d need next.",
  },
  {
    q: "Where are you based?",
    a: "Chennai, Tamil Nadu, India (IST), working with teams remotely worldwide.",
  },
] as const;

export const editToolkit = [
  { name: "Figma", use: "UI, prototypes, design systems" },
  { name: "FigJam", use: "Workshops, journey maps, IA" },
  { name: "Framer", use: "High-fidelity interactive prototypes" },
  { name: "Miro", use: "Collaborative discovery boards" },
  { name: "Maze", use: "Usability testing" },
  { name: "Hotjar", use: "Behavioural insight" },
  { name: "Jira", use: "Agile delivery with engineering" },
  { name: "Notion", use: "Specs, research notes, handoff" },
] as const;

export const breakdown = {
  reel: "Enterprise SaaS",
  frame: 1,
  layers: [
    { file: "plate", track: "V1", name: "Research", note: "Discovery interviews, journey maps, and problem framing." },
    { file: "panel", track: "V2", name: "Structure", note: "Information architecture and workflow restructuring." },
    { file: "popout", track: "V3", name: "System", note: "Tokens, components, and shared patterns across teams." },
    { file: "fx", track: "V4", name: "Interface", note: "Dashboards and multi-step flows tuned for operators." },
    { file: "captions", track: "V5", name: "Handoff", note: "Annotated specs and design QA with engineering." },
  ],
} as const;

// ─────────────────────────────────────────────────────────────── product design

export type Stage = { label: string; caption: string; src: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  body: string;
  stack: string[];
  year: string;
  status?: string;
  live?: boolean;
  repo?: string;
  demo?: string;
  demoLabel?: string;
  featured?: boolean;
  /** Confidential client work — limited public UI */
  nda?: boolean;
  ndaNote?: string;
  shot?: { src: string; w: number; h: number; alt: string };
  stages?: Stage[];
  proof?: { value: string; label: string }[];
  /** Case-study landing copy */
  overview: string;
  problem: string;
  approach: string[];
  outcome: string;
  /** Discovery / research depth */
  research?: { summary: string; findings: string[] };
  /** Process artifacts — wireframes, flows, maps */
  artifacts?: { label: string; caption: string; src: string }[];
  /** Before → after narrative */
  beforeAfter?: { before: string; after: string };
  coverAccent: string;
  /** Listing filter category */
  category: "saas" | "web" | "mobile" | "brand";
  /** Listing / home thumbnail */
  thumb: string;
  /** One-line visual caption under the listing thumb */
  caption?: string;
  /** Full-bleed showcase video (path without extension for Sources) */
  video?: { base: string; poster: string };
  /** Gallery frames on the case page */
  gallery: string[];
};

export const projectCategories = [
  { id: "all", label: "All" },
  { id: "saas", label: "SaaS" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "brand", label: "Brand" },
] as const;

export type ProjectCategoryId = (typeof projectCategories)[number]["id"];

export const projects: Project[] = [
  {
    slug: "educraft",
    name: "Educraft",
    tagline: "Learning dashboard for courses, progress, and study hours",
    body: "Education SaaS dashboard — course stats, calendars, and purchased-course progress in one student home.",
    stack: ["Figma", "Dashboard UI", "Data viz", "Design systems"],
    year: "2024",
    status: "SaaS · Dashboard",
    featured: true,
    proof: [
      { value: "3.4×", label: "faster “what’s next” find in tests" },
      { value: "14", label: "courses in one home" },
      { value: "−42%", label: "scroll to reach calendar" },
    ],
    overview:
      "Educraft is a student-facing learning platform dashboard — greeting, course metrics, progress charts, calendar, and purchased courses — designed for clarity over chrome.",
    problem:
      "Learning tools scatter progress, schedules, and course lists across dense screens, so students lose track of what to do next.",
    approach: [
      "Centered the home on a personal greeting and today’s date to set context fast.",
      "Paired KPI cards with course statistics and progress charts for scannable insight.",
      "Grouped calendar, learning hours, and purchased courses so planning and progress sit side by side.",
    ],
    beforeAfter: {
      before: "Metrics, courses, and calendar competed in one dense fold — next action was unclear.",
      after: "Greeting → KPIs → progress → calendar/courses; students found “what’s next” in moderated tests.",
    },
    outcome:
      "A structured student home that made courses, hours, and next steps obvious — used as a reference pattern for later SaaS dashboards.",
    coverAccent: "#4f7cff",
    category: "saas",
    thumb: "/work/educraft.jpg",
    caption: "Laptop showcase — Educraft student dashboard.",
    gallery: ["/work/educraft.jpg", "/work/educraft-billboard.jpg"],
  },
  {
    slug: "kenso",
    name: "Kenso",
    tagline: "Motorcycle brand site with model hero and live specs",
    body: "A dark, high-energy product landing for Kenso — model hero, retail price, and torque-to-ABS specs in one scroll.",
    stack: ["Figma", "Marketing UI", "Responsive web", "Brand"],
    year: "2024",
    status: "Web · Product",
    featured: true,
    proof: [
      { value: "1", label: "flagship model hero" },
      { value: "4", label: "spec callouts above fold" },
      { value: "2", label: "primary CTAs · book / ride" },
    ],
    overview:
      "Kenso is a motorcycle brand experience built around the Kanso VS 007 — neon accents, full-bleed bike photography, and clear Book Now / Test Ride paths.",
    problem:
      "Vehicle brand sites often bury price and key specs under generic lifestyle layouts, slowing the path to book or test ride.",
    approach: [
      "Put the bike and model name at the center of the first viewport with price and CTAs adjacent.",
      "Surfaced torque, transmission, cooling, and ABS as glanceable spec chips under the hero.",
      "Used a dark canvas and neon green accents to match the sport-bike energy without cluttering navigation.",
    ],
    beforeAfter: {
      before: "Lifestyle-first layout; price and book action required deep scroll.",
      after: "Model, price, specs, and CTAs share the first composition.",
    },
    outcome: "A product-first landing that sells the model, price, and next action in one composition.",
    coverAccent: "#39ff14",
    category: "web",
    thumb: "/work/kenso.jpg",
    caption: "iPad mockup — Kenso bike product landing.",
    gallery: ["/work/kenso.jpg"],
  },
  {
    slug: "fresh-market",
    name: "Fresh Market",
    tagline: "Grocery app — browse, product detail, and buy now",
    body: "A mobile grocery experience with category browse, product detail, seller context, and a clear Buy Now path.",
    stack: ["Figma", "Mobile UI", "E-commerce"],
    year: "2024",
    status: "Mobile · Retail",
    featured: true,
    proof: [
      { value: "2", label: "core screens · home + detail" },
      { value: "5", label: "category shortcuts" },
      { value: "1", label: "persistent Buy Now" },
    ],
    overview:
      "Fresh Market is a grocery shopping app — home with promos and categories, and a tomato product detail with price, seller, and Buy Now.",
    problem:
      "Grocery apps can feel crowded; product truth (price, freshness, seller) gets buried under banners and menus.",
    approach: [
      "Kept home focused on promo, categories, and product cards with quick add.",
      "Designed detail around product photography, ₹/kg pricing, and seller trust.",
      "Anchored purchase with a persistent Buy Now action on the detail screen.",
    ],
    beforeAfter: {
      before: "Banners and menus competed with price and seller trust.",
      after: "Browse → detail → Buy Now without extra hops.",
    },
    outcome: "A warm, green-led mobile flow from browse to buy without extra steps.",
    coverAccent: "#2db84d",
    category: "mobile",
    thumb: "/work/fresh-market.jpg",
    caption: "Dual-phone mockup — grocery home and detail.",
    gallery: ["/work/fresh-market.jpg"],
  },
  {
    slug: "job-finder",
    name: "Job Finder",
    tagline: "Applied jobs list with filters and field-ready cards",
    body: "A jobs mobile UI for Applied / Shortlist / Saved — company cards with pay, hours, and shift at a glance.",
    stack: ["Figma", "Mobile UI", "Marketplace"],
    year: "2024",
    status: "Mobile · Jobs",
    featured: true,
    proof: [
      { value: "3", label: "status filters" },
      { value: "4", label: "job card patterns" },
    ],
    overview:
      "Job Finder helps field and store candidates track Applied roles — with salary, duration, and shift on every card.",
    problem:
      "Job seekers lose track of which roles they’ve applied to when lists lack status, pay, and shift clarity.",
    approach: [
      "Segmented the list with Applied / Shortlist / Saved pills.",
      "Standardized cards: logo, title, location mode, urgency, and key facts.",
      "Highlighted urgently hiring roles without cluttering the scan path.",
    ],
    outcome: "A crisp applied-jobs screen that makes status and shift decisions instant.",
    coverAccent: "#3b82f6",
    category: "mobile",
    thumb: "/work/job-finder.jpg",
    caption: "Phone mockup — applied jobs listing.",
    gallery: ["/work/job-finder.jpg"],
  },
  {
    slug: "poster-culture",
    name: "Poster Culture",
    tagline: "Poster shop brand — mailer pack and dark storefront",
    body: "E-commerce brand system for Poster Culture — metallic mailer identity and a dark hero storefront for wall art.",
    stack: ["Illustrator", "Brand identity", "E-commerce UI"],
    year: "2024",
    status: "Brand · Web",
    featured: true,
    proof: [
      { value: "1", label: "mailer lockup" },
      { value: "1", label: "storefront hero" },
    ],
    overview:
      "Poster Culture is a poster marketplace brand — bold block type on metallic mailers, carried through a dark web storefront with collage hero art.",
    problem:
      "Poster shops often look generic online and unbranded in the box, so the unboxing and the site feel like two different brands.",
    approach: [
      "Built a high-contrast POSTER / CULTURE lockup for physical mailers.",
      "Mirrored the energy on a dark storefront with a clear Explore CTA.",
      "Kept type blocky and loud so the brand reads on purple pack and black web alike.",
    ],
    outcome: "A cohesive poster brand from packing slip to first click.",
    coverAccent: "#e11d48",
    category: "brand",
    thumb: "/work/poster-culture.jpg",
    caption: "Metallic mailer — Poster Culture pack.",
    gallery: ["/work/poster-culture.jpg", "/work/poster-culture-web.jpg"],
  },
  {
    slug: "portfolio-site",
    name: "Developer Portfolio Site",
    tagline: "Dark personal brand site with glow and clear CTAs",
    body: "A frontend-developer portfolio landing — identity, experience line, and View CV / Let’s Talk actions.",
    stack: ["Figma", "Landing page", "Personal brand"],
    year: "2024",
    status: "Web · Portfolio",
    featured: true,
    proof: [
      { value: "2", label: "primary CTAs" },
      { value: "1", label: "identity lockup" },
    ],
    overview:
      "A personal portfolio site for a frontend developer — monogram nav, lightning motif, profile lockup, and dual CTAs for CV and contact.",
    problem:
      "Developer portfolios often feel template-flat or over-animated, so the person and the ask get lost.",
    approach: [
      "Led with name and a single experience sentence so identity reads in one beat.",
      "Paired View CV and Let’s Talk as equal primary actions.",
      "Extended the AK monogram to physical signage for a complete personal brand.",
    ],
    outcome: "A memorable personal landing that makes the next conversation easy to start.",
    coverAccent: "#3b82f6",
    category: "web",
    thumb: "/work/portfolio-site.jpg",
    caption: "Laptop mockup — personal brand portfolio.",
    gallery: ["/work/portfolio-site.jpg", "/work/portfolio-mark.jpg"],
  },
  {
    slug: "pulse-watch",
    name: "Pulse Watch",
    tagline: "Fitness watch face — time, rings, and energy at a glance",
    body: "Wearable UI for an activity watch — clean white face, concentric rings, and a single energy readout.",
    stack: ["Figma", "Wearable UI", "Motion"],
    year: "2024",
    status: "Mobile · Wearable",
    featured: false,
    proof: [
      { value: "3", label: "activity rings" },
      { value: "1", label: "energy metric" },
    ],
    overview:
      "Pulse Watch is a fitness watch face focused on glanceability — time, date, three activity rings, and an energy count on a bright face.",
    problem:
      "Busy watch faces bury today’s progress under complications users never check.",
    approach: [
      "Kept time dominant and rings secondary so progress reads in one look.",
      "Used a white face for outdoor legibility against the orange alpine band.",
      "Reduced chrome so only energy and rings compete for attention.",
    ],
    outcome: "A calm fitness face that makes today’s rings the second thing you see after the time.",
    coverAccent: "#f97316",
    category: "mobile",
    thumb: "/work/pulse-watch.jpg",
    caption: "Watch mockup — activity rings face.",
    gallery: ["/work/pulse-watch.jpg"],
  },
  {
    slug: "the-stay",
    name: "The Stay",
    tagline: "Hospitality brand mark — home away from home",
    body: "Lightbox brand identity for The Stay — house-in-S monogram, navy and gold, and a clear hospitality line.",
    stack: ["Illustrator", "Brand identity", "Signage"],
    year: "2024",
    status: "Brand · Identity",
    featured: false,
    proof: [
      { value: "1", label: "lockup system" },
      { value: "2", label: "core brand colors" },
    ],
    overview:
      "The Stay is a hospitality brand identity — an S monogram with a house window, navy and gold palette, and the line Home Away From Home on illuminated signage.",
    problem:
      "Stay brands need to feel warm and trustworthy in physical space without looking like generic hotel clip art.",
    approach: [
      "Built an S mark that hides a house silhouette for instant “stay” meaning.",
      "Paired navy with gold accents for premium-but-welcoming contrast.",
      "Tested the lockup on lightbox signage so it reads from the street.",
    ],
    outcome: "A signage-ready identity that says hospitality before you read a word.",
    coverAccent: "#c4a574",
    category: "brand",
    thumb: "/work/the-stay.jpg",
    caption: "Lightbox mockup — The Stay brand mark.",
    gallery: ["/work/the-stay.jpg"],
  },
  {
    slug: "jobber",
    name: "Jobber",
    tagline: "Jobs brand mark on concrete — figure and tie",
    body: "Identity for Jobber — a simple figure-and-tie mark on a white paper bag against industrial concrete.",
    stack: ["Illustrator", "Brand identity", "Packaging"],
    year: "2024",
    status: "Brand · Identity",
    featured: false,
    proof: [
      { value: "1", label: "icon lockup" },
      { value: "1", label: "wordmark" },
    ],
    overview:
      "Jobber is a jobs / hiring brand mark — a purple figure with a white tie cutout, set on tactile packaging in a concrete environment.",
    problem:
      "Hiring brands often feel corporate or clip-art; Jobber needed something human and memorable in physical space.",
    approach: [
      "Reduced the mark to figure + tie so “work” reads instantly.",
      "Used soft purple against white paper for approachable contrast.",
      "Shot the bag in hard light so the brand holds up off-screen.",
    ],
    outcome: "A portable hiring identity that feels human on the street, not stuck in a spreadsheet.",
    coverAccent: "#8b5cf6",
    category: "brand",
    thumb: "/work/jobber.jpg",
    caption: "Paper bag mockup — Jobber mark.",
    gallery: ["/work/jobber.jpg"],
  },
  {
    slug: "miton",
    name: "Miton",
    tagline: "Retail bag identity — Miton The Rich",
    body: "Bold yellow M lockup for Miton The Rich on a white tote against a saturated orange field.",
    stack: ["Illustrator", "Brand identity", "Packaging"],
    year: "2024",
    status: "Brand · Identity",
    featured: false,
    proof: [
      { value: "1", label: "M monogram" },
      { value: "1", label: "bag application" },
    ],
    overview:
      "Miton is a retail brand system — a shield-nested M monogram and THE RICH line, proven on a hand-held tote.",
    problem:
      "Fashion retail bags need to read from across the street without looking like every other logo tote.",
    approach: [
      "Built a geometric M with a nested chevron for a shield feel.",
      "Locked yellow type on white against orange for maximum walk-by contrast.",
      "Kept secondary type quiet so the monogram owns the bag.",
    ],
    outcome: "A loud, walkable retail mark that owns the sidewalk before the storefront does.",
    coverAccent: "#f59e0b",
    category: "brand",
    thumb: "/work/miton.jpg",
    caption: "Tote mockup — Miton The Rich.",
    gallery: ["/work/miton.jpg"],
  },
  {
    slug: "stykker",
    name: "Stykker",
    tagline: "Outfits bag brand — tee mark and thumbs-up",
    body: "Streetwear packaging for Stykker Outfits — gradient tee icon, lightning S, and a playful thumbs-up on a white bag.",
    stack: ["Illustrator", "Brand identity", "Packaging"],
    year: "2024",
    status: "Brand · Identity",
    featured: false,
    proof: [
      { value: "1", label: "tee icon" },
      { value: "1", label: "bag application" },
    ],
    overview:
      "Stykker Outfits is a streetwear brand mark — orange tee with a lightning S and a cartoon thumbs-up — shown on a suit-held shopping bag.",
    problem:
      "Outfit brands need personality in the bag, not just a wordmark that disappears in black.",
    approach: [
      "Led with a tee silhouette so the category is obvious before the name.",
      "Added a thumbs-up arm for attitude without cluttering type.",
      "Kept the bag white so the gradient icon pops against dark clothing.",
    ],
    outcome: "A bag that sells the vibe before the hangtag does.",
    coverAccent: "#ea580c",
    category: "brand",
    thumb: "/work/stykker.jpg",
    caption: "Shopping bag — Stykker Outfits.",
    gallery: ["/work/stykker.jpg"],
  },
  {
    slug: "hara",
    name: "Hara Jewellery",
    tagline: "2025 New Year print set — gold marquee and deer mark",
    body: "Seasonal print system for Hara Jewellery — gold 2025 marquee type, deer emblem, and premium planner covers.",
    stack: ["Illustrator", "Print", "Brand identity"],
    year: "2024",
    status: "Brand · Print",
    featured: false,
    proof: [
      { value: "3", label: "cover applications" },
      { value: "1", label: "seasonal lockup" },
    ],
    overview:
      "Hara Jewellery’s 2025 New Year print set — cream covers, gold bulb numerals, deer brand mark, and Happy New Year script.",
    problem:
      "Jewellery brands need seasonal print that feels precious without looking like generic greeting-card stock.",
    approach: [
      "Built 2025 as marquee lights for celebration without clutter.",
      "Kept the deer emblem and teal wordmark consistent across covers.",
      "Shot the set in a white architectural space so gold reads premium.",
    ],
    outcome: "A seasonal print system that feels like the jewellery, not a party flyer.",
    coverAccent: "#0d9488",
    category: "brand",
    thumb: "/work/hara.jpg",
    caption: "Print mockup — Hara 2025 covers.",
    gallery: ["/work/hara.jpg"],
  },
  {
    slug: "zenith",
    name: "Zenith Creative",
    tagline: "Z mark system — purple-to-teal identity on cards",
    body: "Brand identity for Zenith Creative Solutions — geometric Z in purple and teal on white and charcoal business cards.",
    stack: ["Illustrator", "Brand identity", "Stationery"],
    year: "2024",
    status: "Brand · Identity",
    featured: false,
    proof: [
      { value: "2", label: "card treatments" },
      { value: "1", label: "Z monogram" },
    ],
    overview:
      "Zenith Creative Solutions — interlocking purple and teal Z, wordmark, and CREATIVE SOLUTIONS line on dual business cards against concrete.",
    problem:
      "Creative agencies need a mark that reads as modern without defaulting to another purple gradient logo.",
    approach: [
      "Built a geometric Z from two interlocking shapes for depth.",
      "Paired full lockup on white with icon-only on charcoal for hierarchy.",
      "Tested on concrete so color holds against industrial texture.",
    ],
    outcome: "A tight identity kit that works full-bleed or icon-only.",
    coverAccent: "#7c3aed",
    category: "brand",
    thumb: "/work/zenith.jpg",
    caption: "Business cards — Zenith Creative.",
    gallery: ["/work/zenith.jpg"],
  },
  {
    slug: "agri-go",
    name: "Agri Go",
    tagline: "Organic bottle mark — sprout in the A",
    body: "Packaging identity for Agri Go — navy A with a green sprout, white label, amber bottle on driftwood.",
    stack: ["Illustrator", "Packaging", "Brand identity"],
    year: "2024",
    status: "Brand · Packaging",
    featured: false,
    proof: [
      { value: "1", label: "A + sprout mark" },
      { value: "1", label: "bottle application" },
    ],
    overview:
      "Agri Go is an organic / agri brand on glass — a capital A with a three-leaf sprout, green wordmark, and natural still-life staging.",
    problem:
      "Agri packaging often looks either clinical or overly rustic; Agri Go needed clean and living.",
    approach: [
      "Hid a sprout inside the A so growth is the logo, not a sticker.",
      "Kept the label white and sparse so amber liquid and wood do the warmth.",
      "Used soft light so glass and leaf green stay honest.",
    ],
    outcome: "A bottle that reads organic before you read a word.",
    coverAccent: "#22c55e",
    category: "brand",
    thumb: "/work/agri-go.jpg",
    caption: "Bottle mockup — Agri Go label.",
    gallery: ["/work/agri-go.jpg"],
  },
  {
    slug: "flair-fusion",
    name: "Flair Fusion",
    tagline: "Dance studio facade — peacock wings and script",
    body: "Building-scale identity for Flair Fusion Dance Studio & Art Club — dancer silhouette with peacock wings on a modern facade.",
    stack: ["Illustrator", "Brand identity", "Environmental"],
    year: "2024",
    status: "Brand · Environmental",
    featured: false,
    proof: [
      { value: "1", label: "facade lockup" },
      { value: "1", label: "script + caps pair" },
    ],
    overview:
      "Flair Fusion Dance Studio & Art Club — a dancer with peacock wings and paintbrush, script wordmark, and magenta ampersand on a building exterior.",
    problem:
      "Dance studios need environmental graphics that feel alive from the street, not a flat vinyl logo.",
    approach: [
      "Combined dancer, wings, and brush so dance + art read as one mark.",
      "Paired script Flair Fusion with caps subtitle for hierarchy at facade scale.",
      "Shot upward against blue sky so color and silhouette punch.",
    ],
    outcome: "A facade mark that announces the studio before the door does.",
    coverAccent: "#db2777",
    category: "brand",
    thumb: "/work/flair-fusion.jpg",
    caption: "Building mockup — Flair Fusion mark.",
    gallery: ["/work/flair-fusion.jpg"],
  },
];

/** About highlight counts — home `#highlights` + dashboard. */
export const aboutHighlights = [
  { value: "3.5+", label: "years in product design" },
  { value: "12", label: "enterprise SaaS platforms" },
  { value: "51", label: "business websites" },
  { value: "6", label: "mobile applications" },
] as const;

export const engineerStats = aboutHighlights.slice(0, 3);

export type Role = { title: string; company: string; from: string; to: string; points: string[] };

export const experience: Role[] = [
  {
    title: "Product Designer (UX/UI)",
    company: "Vyssr Solutions Pvt Ltd, Chennai",
    from: "Feb 2023",
    to: "Present",
    points: [
      "Led end-to-end UX/UI for 12 enterprise SaaS platforms by conducting discovery research and mapping workflows, simplifying complex operations across logistics, insurance, and legal-tech.",
      "Designed scalable dashboards and workflow systems by restructuring multi-step processes into streamlined patterns, reducing operational friction and data-entry errors for enterprise users.",
      "Established a unified design system with reusable components and tokens, enabling three teams to ship cohesive UI and accelerating design-to-development handoff.",
      "Collaborated with product managers and engineers in agile sprints, translating strategic goals into prioritized features that aligned user needs with business objectives.",
      "Optimized user journeys by conducting usability testing, heuristic evaluations, and journey mapping — resolving critical drop-off points through actionable wireframes and prototypes.",
      "Delivered accessible, responsive experiences across desktop, tablet, and mobile by applying WCAG guidelines and device-specific interaction patterns.",
      "Improved developer confidence by producing annotated specifications and interactive prototypes with clear interaction states, reducing ambiguity and shortening QA cycles.",
      "Scaled brand coherence across marketing websites, landing pages, and product interfaces with a shared visual language.",
    ],
  },
  {
    title: "Freelance UX/UI Designer",
    company: "Independent · Chennai",
    from: "Jul 2022",
    to: "Jan 2023",
    points: [
      "Designed responsive marketing websites and landing pages for local businesses, focusing on clear hierarchy, mobile-first layouts, and conversion-minded CTAs.",
      "Built brand and UI kits in Figma — type, color, and component starters that kept client projects consistent from pitch to handoff.",
      "Ran lightweight discovery (competitor scans, stakeholder interviews) before wireframes so each engagement started from a defined problem.",
      "Delivered annotated designs and interactive prototypes for developer handoff, reducing revision cycles on first-build launches.",
    ],
  },
];

export type Tool = { name: string; where: string; key?: boolean; icon?: string };

/** Soft skills — categorized craft (reference: languages/frontend list rows). */
export const softSkills: { label: string; items: Tool[] }[] = [
  {
    label: "Product & UX",
    items: [
      { name: "Product Design", where: "Core competency · SaaS & enterprise" },
      { name: "UX Design & Strategy", where: "Discovery → experience requirements" },
      { name: "Product Discovery", where: "Research · interviews · problem framing" },
      { name: "User Research", where: "Guerilla tests · usability studies" },
      { name: "Information Architecture", where: "SaaS & enterprise flows" },
      { name: "User Journey Mapping", where: "End-to-end experience" },
    ],
  },
  {
    label: "UI & Systems",
    items: [
      { name: "UI Design", where: "SaaS product surfaces" },
      { name: "Design Systems & Tokens", where: "3 teams · shared UI language" },
      { name: "Component Libraries", where: "Reusable product UI" },
      { name: "Wireframing & Prototyping", where: "Figma · Framer" },
      { name: "Interaction Design", where: "Enterprise workflows" },
      { name: "Accessibility (WCAG)", where: "Inclusive · responsive delivery" },
    ],
  },
  {
    label: "Delivery",
    items: [
      { name: "Design QA & Handoff", where: "Annotated specs → engineering" },
      { name: "Agile & Product Thinking", where: "Sprint delivery with PMs/eng" },
      { name: "Stakeholder Management", where: "Product & business alignment" },
      { name: "AI-assisted Product Design", where: "ChatGPT · Claude · Cursor" },
    ],
  },
  {
    label: "Domains",
    items: [
      { name: "SaaS & Enterprise Design", where: "12 platforms shipped" },
      { name: "Responsive Design", where: "Desktop · tablet · mobile" },
      { name: "Brand coherence", where: "Product + marketing touchpoints" },
    ],
  },
];

/** Tool skills — apps with icons. */
export const toolSkills: Tool[] = [
  { name: "Figma", where: "Primary UI tool", key: true, icon: "figma" },
  { name: "FigJam", where: "Workshops & mapping", key: true, icon: "figjam" },
  { name: "Framer", where: "Interactive prototypes", icon: "framer" },
  { name: "Photoshop", where: "Visual production", icon: "photoshop" },
  { name: "Illustrator", where: "Brand & marketing", icon: "illustrator" },
  { name: "Miro", where: "Collaborative discovery", icon: "miro" },
  { name: "Jira", where: "Agile tracking", icon: "jira" },
  { name: "Notion", where: "Specs & research", icon: "notion" },
  { name: "Maze", where: "Usability testing", icon: "maze" },
  { name: "Hotjar", where: "Behaviour analytics", icon: "hotjar" },
];

/** @deprecated Prefer softSkills + toolSkills */
export const stack = softSkills;

export const engineerServices = [
  {
    n: "01",
    title: "Enterprise SaaS UX/UI",
    body: "Dashboards, workflow systems, and business platforms designed for operators who live in the product every day.",
  },
  {
    n: "02",
    title: "Design systems",
    body: "Tokens, components, and documentation that keep multiple teams shipping one coherent product UI.",
  },
  {
    n: "03",
    title: "Accessible responsive UI",
    body: "WCAG-minded experiences that hold up on desktop, tablet, and mobile — including marketing sites beside the product.",
  },
] as const;

export const education = [
  {
    degree: "Graphic & UX/UI Designer",
    school: "Buff Creative College, Chennai",
    period: "Jul 2022 – Feb 2023",
  },
  { degree: "Bachelor of Commerce", school: "National College, Trichy", period: "Jul 2019 – Jun 2022" },
] as const;

export const certifications = [
  {
    title: "Google UX Design Professional Certificate",
    issuer: "Coursera",
    period: "May 2025",
    status: "Coursera · Certificate",
    thumb: "/media/certs/google-ux-coursera.jpg",
  },
  {
    title: "UX Design Toolkit Professional Certificate",
    issuer: "Coursera",
    period: "Jun 2025",
    status: "Coursera · Certificate",
    thumb: "/media/certs/ux-design-toolkit-coursera.jpg",
  },
] as const;

export const achievements = [
  {
    label: "Enterprise SaaS",
    text: "Designed UX/UI for multiple enterprise SaaS products spanning logistics, insurance, legal-tech, AI, and business automation — owning the full design lifecycle.",
  },
  {
    label: "Design Systems",
    text: "Established scalable design systems and component libraries that unified product UI across teams and improved design-to-development handoff.",
  },
  {
    label: "Workflow Design",
    text: "Simplified complex workflows through research-driven interaction design, reducing task friction and improving task completion in enterprise tools.",
  },
  {
    label: "Design QA",
    text: "Partnered with engineering throughout implementation — conducting design QA to ensure output matched design intent and accessibility standards.",
  },
  {
    label: "Responsive & Accessible",
    text: "Delivered responsive experiences optimized for accessibility, performance, and cross-device consistency across desktop, tablet, and mobile.",
  },
  {
    label: "AI-assisted craft",
    text: "Integrated AI-assisted workflows into discovery and delivery — faster exploration, clearer specs, and more time spent on the decisions that shape the product.",
  },
] as const;

export const resumeSummary =
  "Product Designer with 3.5+ years delivering end to end SaaS and enterprise applications. I lead product design from discovery through implementation defining UX strategy, building scalable design systems, and crafting interaction patterns that turn complex domains into intuitive experiences. Skilled at partnering across product, engineering, and stakeholder teams to align business goals while integrating AI-assisted workflows, accessibility compliance, and responsive design.";

export const quote = "Turning complex domains into intuitive experiences.";

// ─────────────────────────────────────────────────────────────────── shared

export const nav = [
  { href: "/dashboard", label: "Dashboard", grade: "edit" as Grade },
  { href: "/#both", label: "About Me", grade: "edit" as Grade },
  { href: "/#experience", label: "Experience", grade: "code" as Grade },
  { href: "/#education", label: "Education", grade: "edit" as Grade },
  { href: "/#projects", label: "Projects", grade: "code" as Grade },
  { href: "/myrole", label: "My Role", grade: "edit" as Grade },
  { href: "/#tools", label: "Stack", grade: "edit" as Grade },
  { href: "/#learning", label: "Learning", grade: "edit" as Grade },
] as const;

export const whatsappLink = (text: string) =>
  `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailLink = (subject: string, body = "") =>
  `mailto:${profile.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
