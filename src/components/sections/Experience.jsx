import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, Hr, SectionHeader, ViewAll } from "../ui/Layout";
import { cn } from "../../lib/cn";
import { experiences } from "../../data/timeline";
import { LINKEDIN_URL } from "../../data/links";

function ExperienceRow({ job, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `exp-${job.company.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <div className="m-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex w-full cursor-pointer select-none flex-row justify-between gap-4 px-3 py-4 text-left transition-colors duration-300 hover:bg-bg-hover"
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-background p-[2px] sm:size-12">
            <img src={job.logo} alt="" draggable="false" className="h-full w-full rounded-[8px] border border-border bg-white object-contain p-1" />
          </span>
          <span className="flex min-w-0 flex-col items-start gap-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[1.05rem] font-semibold leading-[0.9] text-title sm:text-[1.20rem]">{job.company}</span>
              <span className="rounded-[4px] border border-border px-1.5 text-xs leading-5 text-muted-foreground">{job.type}</span>
            </span>
            <span className="text-xs text-muted-foreground sm:text-sm">{job.role}</span>
          </span>
        </span>
        <span className="flex items-start gap-3">
          <span className="flex flex-col items-end gap-1">
            <span className="whitespace-nowrap text-xs font-medium text-title sm:text-sm">{job.period}</span>
            {job.location && <span className="text-xs text-muted-foreground sm:text-sm">{job.location}</span>}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn("hidden size-4 text-muted-foreground transition-transform duration-300 sm:block", open && "rotate-180")}
          />
        </span>
      </button>

      <div id={panelId} className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="px-3 pb-6 pt-2">
            <ul className="flex flex-col gap-3 pl-1">
              {job.highlights.map((point) => (
                <li key={point} className="flex gap-3 text-[0.95rem] leading-[1.55] text-foreground">
                  <span aria-hidden="true" className="mt-[9px] size-[5px] shrink-0 rounded-full bg-muted" />
                  {point}
                </li>
              ))}
            </ul>
            {job.stack.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {job.stack.map((tech) => (
                  <span key={tech} className="rounded-[6px] border border-border bg-muted-bg px-2 py-0.5 text-sm text-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-12">
      <SectionHeader id="experience-title">Experiences</SectionHeader>
      <Container className="p-0">
        <div className="flex flex-col">
          {experiences.map((job, i) => (
            <div key={job.company}>
              <ExperienceRow job={job} defaultOpen={i === 0} />
              {i < experiences.length - 1 && <Hr />}
            </div>
          ))}
        </div>
      </Container>
      <Hr />
      <ViewAll href={LINKEDIN_URL} />
    </section>
  );
}
