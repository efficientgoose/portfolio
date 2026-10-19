import { ArrowUpRight, Star } from "lucide-react";
import { Container, Hr, SectionHeader, ViewAll } from "../ui/Layout";
import { projects } from "../../data/projects";
import { GITHUB_URL } from "../../data/links";

// Hover backdrop, modelled on rinkitadhana.com: a few wide rays fanning out from below the screenshot,
// each bowing gently outward, over a faint paper grain, in the project's own colours.
const RAY_COUNT = 18;
const RAY_START = 160; // degrees; the fan runs from just below the left horizon...
const RAY_SPAN = 220; // ...round to just below the right one, so the bottom corners stay covered
const ORIGIN = { x: 200, y: 290 }; // below the card, behind the screenshot
const REACH = 520;
const BEND = 0.22; // how far each edge bows outward; 0 is straight

const point = (r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return `${(ORIGIN.x + r * Math.cos(rad)).toFixed(1)} ${(ORIGIN.y + r * Math.sin(rad)).toFixed(1)}`;
};

// The control point leans toward straight up (270deg), so each edge rises steeply, then eases outward.
const edge = (deg) => ({ control: point(REACH * 0.5, deg - (deg - 270) * BEND), end: point(REACH, deg) });

const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => {
  const step = RAY_SPAN / RAY_COUNT;
  const a = edge(RAY_START + i * step);
  const b = edge(RAY_START + (i + 1) * step);
  const o = `${ORIGIN.x} ${ORIGIN.y}`;
  return `M${o} Q${a.control} ${a.end} L${b.end} Q${b.control} ${o}Z`;
});

function Sunburst({ palette }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <filter id="paper-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
      </filter>
      <rect width="400" height="240" fill={palette[0]} />
      {RAYS.map((d, i) => (
        <path key={i} d={d} fill={palette[i % palette.length]} />
      ))}
      <rect width="400" height="240" filter="url(#paper-grain)" />
    </svg>
  );
}

function StatusDot({ status }) {
  const live = status === "Live";
  return (
    <div className="flex select-none items-center gap-1">
      <span className="relative flex size-2.5 items-center justify-center">
        {live && (
          <span className="absolute size-2.5 animate-ping rounded-full bg-green-500 opacity-40 group-hover:hidden" />
        )}
        <span
          className={`size-2 rounded-full ${live ? "bg-green-500" : status === "Building" ? "bg-yellow-400" : "bg-muted"}`}
        />
      </span>
      <p className="text-sm font-medium text-muted-foreground">{status}</p>
    </div>
  );
}

function ProjectCard({ project, wide }) {
  return (
    <div className="relative z-10 p-4 sm:p-5">
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full cursor-pointer flex-col gap-3"
      >
        <div className="rounded-[10px] border border-border p-[4px]">
          <div
            className={`relative w-full select-none overflow-hidden rounded-[6px] border border-border bg-muted-bg ${
              wide ? "h-[200px] sm:h-[280px] md:h-[320px]" : "h-[170px] md:h-[200px]"
            }`}
          >
            <Sunburst palette={project.palette} />
            <span className="absolute left-2 top-2 text-xs font-medium text-muted-foreground transition-all duration-300 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:text-black">
              {project.label}
            </span>
            <div className="absolute bottom-0 left-1/2 h-[75%] w-[80%] -translate-x-1/2 rounded-t-[6px] bg-background p-[2px] pb-0 transition-all duration-300 group-hover:h-[70%]">
              <div className="h-full w-full overflow-hidden rounded-t-[4px]">
                <img
                  src={project.image}
                  alt={`${project.name} screenshot`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
            {project.pinned && (
              <div className="absolute right-1 top-1 rounded-[8px] border border-border bg-background p-1.5 text-title">
                <Star aria-label="Featured" className="size-4 fill-[color:var(--spot)] text-[color:var(--spot)]" />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 px-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[1.10rem] font-bold leading-[1.10] text-title">{project.name}</h3>
            <StatusDot status={project.status} />
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <div className="flex select-none items-center gap-1 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-spot">
            View Project
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </div>
        </div>
      </a>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-12">
      <SectionHeader id="projects-title">Projects</SectionHeader>
      <Container className="p-0">
        {/* The pinned project takes the whole first row; the rest pair up below it, split by a dashed rule. */}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {projects.map((project, i) => (
            <div key={project.name} className={project.pinned ? "sm:col-span-2" : "relative"}>
              <ProjectCard project={project} wide={project.pinned} />
              {!project.pinned && i % 2 === 1 && (
                <div aria-hidden="true" className="dash-y absolute right-0 top-0 hidden h-full w-px sm:block" />
              )}
              {(project.pinned || i < projects.length - 1) && (
                <div className={project.pinned ? "" : "sm:hidden"}>
                  <Hr />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
      <Hr />
      <ViewAll href={GITHUB_URL} />
    </section>
  );
}
