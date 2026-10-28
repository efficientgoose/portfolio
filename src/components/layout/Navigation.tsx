import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { Container, Hr } from "../ui/Layout";

type NavLink = { href: string; label: string; external?: boolean };

const links: NavLink[] = [
  { href: "#about", label: "about" },
  { href: "#projects", label: "projects" },
  { href: "#experience", label: "experience" },
  { href: "#contact", label: "contact" },
];

// Highlights the section currently in view.
function useActiveSection() {
  const [active, setActive] = useState("about");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    links
      .filter((l) => !l.external)
      .forEach((l) => {
        const el = document.getElementById(l.href.slice(1));
        if (el) observer.observe(el);
      });
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function Navigation() {
  const active = useActiveSection();

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 bg-[color-mix(in_srgb,var(--background)_70%,transparent)] backdrop-blur-md backdrop-saturate-150"
    >
      <Container className="flex h-12 items-center justify-center py-0 sm:static">
        {/* The logo mark, drawn as a CSS mask so it follows the theme's text colour. Hidden on phones;
            from sm up it's pinned to the page's far left (the Container is made static so the sticky nav
            is the positioning parent) and the links stay centred. */}
        <a
          href="#about"
          aria-label="Ajinkya Kale, back to top"
          className="group absolute left-5 top-6 hidden -translate-y-1/2 rounded-[6px] p-1 sm:block"
        >
          <span
            aria-hidden="true"
            className="block size-[22px] bg-title transition-colors duration-300 [mask:url(/logo-mark.png)_center/contain_no-repeat] group-hover:bg-spot"
          />
        </a>
        <div className="flex max-w-full items-center gap-0.5 overflow-x-auto [scrollbar-width:none]">
          {links.map((link) => {
            const isActive = !link.external && active === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "shrink-0 rounded-[6px] px-2 py-1 font-mono text-[13px] leading-5 transition-colors duration-300",
                  isActive ? "bg-muted-bg text-spot" : "text-muted-foreground hover:text-spot",
                )}
              >
                /{link.label}
              </a>
            );
          })}
        </div>
      </Container>
      <Hr />
    </nav>
  );
}
