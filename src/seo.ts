import { experiences } from "./data/timeline";
import { projects } from "./data/projects";
import { skills } from "./data/techStack";
import { ANCHORA_URL, EMAIL, GITHUB_URL, LINKEDIN_URL } from "./data/links";

// Machine-readable descriptions of the site for search engines and AI tools, built from the same
// data as the page so they never drift. Written into the static build by scripts/prerender.js.

export const SITE_URL = "https://ajkale.com";
const NAME = "Ajinkya Kale";
const SUMMARY =
  "Backend engineer at Fleetx working on real-time telematics pipelines, and co-founder of Anchora, a study-abroad planner for students in India.";

const current = experiences.filter((job) => job.period.endsWith("Present") && job.type !== "Education");
const education = experiences.filter((job) => job.type === "Education");

// schema.org Person, read by Google for rich results and knowledge panels.
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: NAME,
    url: SITE_URL,
    image: `${SITE_URL}/Profile.webp`,
    email: `mailto:${EMAIL}`,
    description: SUMMARY,
    jobTitle: ["Backend Engineer", "Co-Founder, Anchora"],
    worksFor: current.map((job) => ({ "@type": "Organization", name: job.company, url: job.href })),
    alumniOf: education.map((job) => ({ "@type": "CollegeOrUniversity", name: job.company })),
    address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
    knowsAbout: skills.map((skill) => skill.name),
    sameAs: [GITHUB_URL, LINKEDIN_URL],
  };
}

// A plain Markdown summary for LLMs, following the llms.txt convention (https://llmstxt.org).
export function llmsTxt() {
  const lines = [
    `# ${NAME}`,
    "",
    `> ${SUMMARY}`,
    "",
    "## Experience",
    "",
    ...experiences.flatMap((job) => [
      `### ${job.company}: ${job.role} (${job.period})`,
      "",
      ...job.highlights.map((point) => `- ${point}`),
      ...(job.stack.length ? [`- Stack: ${job.stack.join(", ")}`] : []),
      "",
    ]),
    "## Projects",
    "",
    ...projects.map((project) => `- [${project.name}](${project.href}) (${project.status}): ${project.description}`),
    "",
    "## Skills",
    "",
    skills.map((skill) => skill.name).join(", "),
    "",
    "## Links",
    "",
    `- [Website](${SITE_URL})`,
    `- [GitHub](${GITHUB_URL})`,
    `- [LinkedIn](${LINKEDIN_URL})`,
    `- [Anchora](${ANCHORA_URL})`,
    `- Email: ${EMAIL}`,
    "",
  ];
  return lines.join("\n");
}
