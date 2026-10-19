import { Container, Hr, SectionHeader } from "../ui/Layout";
import { skills } from "../../data/techStack";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-12">
      <SectionHeader id="skills-title">Skills &amp; Technologies</SectionHeader>
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-[8px]">
          {skills.map(({ name, icon: Icon }) => (
            <li
              key={name}
              className="group relative flex min-w-fit flex-1 select-none items-center justify-center gap-2 overflow-hidden rounded-[8px] border border-border px-2 py-1 transition-[background-color,border-color,transform] duration-300 ease-out hover:z-10 hover:scale-[1.04] hover:border-muted-foreground hover:bg-bg-hover-fg"
            >
              <Icon aria-hidden="true" className="size-[14px] text-muted-foreground transition-colors group-hover:text-foreground" />
              <span className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </Container>
      <Hr />
    </section>
  );
}
