import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/cn";
import WordField from "./WordField";

// The 690px column with dashed rails on both sides.
export function Container({ children, className, ...props }) {
  return (
    <div className={cn("rails relative mx-2 max-w-[690px] p-3 sm:mx-8 md:mx-auto", className)} {...props}>
      {children}
    </div>
  );
}

// A full-width dashed rule.
export function Hr() {
  return <div aria-hidden="true" className="dash-x h-px w-full" />;
}

export function SectionHeader({ id, children }) {
  return (
    <>
      {/* Extra room above each title separates sections without adding more rules. */}
      <Container className="px-3 pb-4 pt-10 sm:pt-14">
        <h2 id={id} className="text-[1.15rem] font-bold leading-tight text-title">
          {children}
        </h2>
      </Container>
      <Hr />
    </>
  );
}

// Decorative band of drifting words, running edge to edge with no rails around it.
export function DotBand({ seed }) {
  return (
    <div className="py-3">
      <WordField seed={seed} />
    </div>
  );
}

// The light, double-bordered pill used for "View all" and similar actions.
export function FramedButton({ href, children, external = true, icon: Icon = ArrowUpRight, className }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("group w-fit select-none rounded-[10px] border border-border p-[2px]", className)}
    >
      <span className="flex h-full w-full items-center justify-center gap-1 rounded-[8px] border border-border bg-[color:var(--accent-tint)] px-2.5 py-1 text-spot transition duration-300 group-hover:bg-[color:var(--accent-tint-hover)]">
        <span className="text-[0.95rem] font-medium">{children}</span>
        {Icon && <Icon aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:scale-125" />}
      </span>
    </a>
  );
}

export function ViewAll({ href }) {
  return (
    <>
      <Container className="px-2 py-5">
        <div className="flex items-center justify-center">
          <FramedButton href={href}>View All</FramedButton>
        </div>
      </Container>
      <Hr />
    </>
  );
}
