import { aboutHighlights, certifications, education, experience, nav, personalDetails, processSteps, processTools, profile, projects, quote, resumeSummary, role, services } from "@/lib/content";

export type KeniMood = "success" | "curious";

export type KeniAnswer = {
  text: string;
  href?: string;
  label?: string;
  mood: KeniMood;
};

const featured = projects.filter((p) => p.featured).slice(0, 3);

const workBlurb = featured
  .map((p) => `${p.name} — ${p.tagline}`)
  .join(" ");

const OFF =
  "I'm Leni, Vengat's portfolio guide. I can help you explore his work, experience, skills, and the sections on this site. What would you like to know?";
const UNKNOWN =
  "I couldn't find that information in Vengat's portfolio. You can explore his work or contact him for more details.";

const sections: { test: RegExp; href: string; label: string; text: string }[] = [
  {
    test: /dashboard/,
    href: "/dashboard",
    label: "Open dashboard",
    text: "The dashboard is the overview of this portfolio — profile, resume, and the main paths through the work.",
  },
  {
    test: /my role|\brole\b/,
    href: "/myrole",
    label: "Open my role",
    text: `${role.title}. ${role.line} ${role.detail}`,
  },
  {
    test: /process|how (he|vengat|i|you) work|approach|method|workflow/,
    href: "/#process",
    label: "Open process",
    text: `Vengat's process on this site: ${processSteps.map((s) => `${s.label} — ${s.title}`).join("; ")}.`,
  },
  {
    test: /skill|tool|stack|figma|software/,
    href: "/#tools",
    label: "Open stack",
    text: `${role.title}. Daily tools listed on the site: ${processTools.join(", ")}.`,
  },
  {
    test: /edu|study|college|school|degree/,
    href: "/#education",
    label: "Open education",
    text: education.map((e) => `${e.degree} at ${e.school} (${e.period})`).join(". ") + ".",
  },
  {
    test: /cert|learn|course|achieve/,
    href: "/#learning",
    label: "Open learning",
    text: `Certificates on this site: ${certifications.map((c) => `${c.title} (${c.issuer}, ${c.period})`).join("; ")}.`,
  },
  {
    test: /experience|years|how long|background|job|company|vyssr/,
    href: "/#experience",
    label: "Open experience",
    text: experienceText(),
  },
  {
    test: /contact|hire|email|phone|whatsapp|chennai|available|location|based|reach|in touch/,
    href: "/#contact",
    label: "Open contact",
    text: contactText(),
  },
  {
    test: /about|who|bio|hello|hi\b|vengat/,
    href: "/#both",
    label: "Open about",
    text: aboutText(),
  },
  {
    test: /project|work|case|selected|portfolio|saas|website|section|page|navigate|menu/,
    href: "/#projects",
    label: "Open projects",
    text: siteMapText(),
  },
];

function experienceText() {
  const years = aboutHighlights.map((h) => `${h.value} ${h.label}`).join(", ");
  const roles = experience.map((e) => `${e.title} at ${e.company} (${e.from} — ${e.to})`).join(". ");
  return `${role.title}. ${years}. ${roles}.`;
}

function contactText() {
  return `${profile.name} is based in ${profile.location} (${profile.tzLabel}) and is ${profile.availability.label.toLowerCase()}. ${profile.availability.detail}. Email ${profile.email} or WhatsApp ${profile.phoneDisplay}.`;
}

function aboutText() {
  const languages = personalDetails.find((d) => d.label === "Languages")?.value;
  return `${profile.name} — ${role.title}, based in ${profile.location}. ${quote} ${role.detail}${languages ? ` Languages: ${languages}.` : ""}`;
}

function siteMapText() {
  const labels = nav.map((n) => n.label).join(", ");
  return `Selected work: ${workBlurb} Sections on this site: ${labels}, plus the design process and contact.`;
}

/** Local answers from portfolio facts. This is not a live model. */
export function replyTo(raw: string): KeniAnswer {
  const q = raw.toLowerCase();

  if (/api key|password|secret|\benv\b|token|private/.test(q)) {
    return { mood: "curious", text: "I only share what's published on this portfolio." };
  }

  if (/thank|awesome|love your work/.test(q)) {
    return {
      mood: "success",
      text: "Glad that helped. I can walk you through the work, the experience, or how to get in touch.",
    };
  }

  if (/resume|\bcv\b/.test(q)) {
    return {
      mood: "success",
      href: profile.resume,
      label: "Open resume",
      text: `The resume is on the site as a PDF. ${resumeSummary}`,
    };
  }

  if (/salary|age|married|boyfriend|girlfriend|revenue|net worth/.test(q)) {
    return { mood: "curious", text: UNKNOWN };
  }

  const named = projects.find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.slug));
  if (named) {
    return {
      mood: "success",
      href: `/work/${named.slug}`,
      label: `Open ${named.name}`,
      text: `${named.name} — ${named.tagline}. ${named.body}`,
    };
  }

  if (/service|what (does|can) he|speciali[sz]e|offer/.test(q)) {
    return {
      mood: "success",
      href: "/myrole",
      label: "Open my role",
      text: `${role.title}. ${role.detail} On this site that shows up as ${services.map((s) => s.title.toLowerCase()).join(", ")}.`,
    };
  }

  const section = sections.find((s) => s.test.test(q));
  if (section) {
    return { mood: "success", href: section.href, label: section.label, text: section.text };
  }

  const scored = bestOverlap(q);
  if (scored) return scored;

  if (/vengat|portfolio|website|this site|section|page/.test(q)) {
    return { mood: "success", href: "/#projects", label: "Open projects", text: siteMapText() };
  }

  return { mood: "curious", text: OFF };
}

const SKIP = new Set([
  "the", "and", "for", "you", "your", "his", "him", "her", "she", "what", "who", "how", "can", "does", "did",
  "are", "was", "with", "this", "that", "from", "about", "have", "has", "where", "when", "which", "into",
  "show", "tell", "please", "keni", "leni", "want", "need", "like", "just", "any", "there", "here", "would", "could",
]);

function words(value: string) {
  return value.toLowerCase().split(/[^a-z0-9+]+/).filter((word) => word.length > 2 && !SKIP.has(word));
}

function overlap(question: string, haystack: string) {
  const bag = new Set(words(haystack));
  let count = 0;
  for (const word of words(question)) if (bag.has(word)) count += 1;
  return count;
}

/** Match a natural question to a real section or project when the keyword rules miss. */
function bestOverlap(question: string): KeniAnswer | null {
  const sectionHits = sections
    .map((section) => ({ section, score: overlap(question, `${section.label} ${section.text}`) }))
    .sort((a, b) => b.score - a.score);
  const projectHits = projects
    .map((project) => ({ project, score: overlap(question, `${project.name} ${project.tagline} ${project.body}`) }))
    .sort((a, b) => b.score - a.score);
  const sectionBest = sectionHits[0];
  const projectBest = projectHits[0];
  const sectionNext = sectionHits[1]?.score ?? 0;
  const projectNext = projectHits[1]?.score ?? 0;

  if (projectBest && projectBest.score >= 2 && projectBest.score > projectNext && projectBest.score >= (sectionBest?.score ?? 0)) {
    const project = projectBest.project;
    return {
      mood: "success",
      href: `/work/${project.slug}`,
      label: `Open ${project.name}`,
      text: `${project.name} — ${project.tagline}. ${project.body}`,
    };
  }
  if (sectionBest && sectionBest.score >= 2 && sectionBest.score > sectionNext) {
    return { mood: "success", href: sectionBest.section.href, label: sectionBest.section.label, text: sectionBest.section.text };
  }
  return null;
}