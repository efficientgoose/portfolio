import { Container, Hr, SectionHeader } from "../ui/Layout";
import { skillGroups } from "../../data/techStack";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-12">
      <SectionHeader id="skills-title">Skills &amp; Technologies</SectionHeader>
      <Container className="py-6">
        {/* One row per group: the label sits beside its skills on desktop and above them on phones.
            Pills are sized to their content so no skill looks more important than another. */}
        <div className="flex flex-col gap-5">
          {skillGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
              <h3 className="shrink-0 text-sm font-medium text-title sm:w-[140px] sm:pt-1">{group.title}</h3>
              <ul className="flex flex-wrap items-center gap-[8px]">
                {group.skills.map(({ name, icon: Icon, color }) => (
                  <li
                    key={name}
                    style={color ? { "--brand": color } : undefined}
                    className="group relative flex select-none items-center justify-center gap-2 overflow-hidden rounded-[8px] border border-border px-2 py-1 transition-[background-color,border-color,transform] duration-300 ease-out hover:z-10 hover:scale-[1.04] hover:border-muted-foreground hover:bg-bg-hover-fg"
                  >
                    {/* Muted at rest; the brand colour on hover. */}
                    <Icon
                      aria-hidden="true"
                      className="size-[14px] text-muted-foreground transition-colors group-hover:text-[color:var(--brand,var(--foreground))]"
                    />
                    {/* Names a touch brighter than the icons, so they read first. */}
                    <span className="whitespace-nowrap text-sm font-medium text-[color:color-mix(in_srgb,var(--muted-foreground),var(--foreground)_30%)] transition-colors group-hover:text-foreground">
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Hr />
    </section>
  );
}
