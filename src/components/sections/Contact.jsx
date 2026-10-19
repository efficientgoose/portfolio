import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { Container, DotBand, Hr, SectionHeader } from "../ui/Layout";
import { EMAIL } from "../../data/links";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the mail button still works.
    }
  };

  return (
    <div className="flex w-full flex-1 items-center rounded-[10px] border border-border bg-background p-[2px]">
      <div className="flex w-full items-center justify-between gap-2 rounded-[8px] border border-border bg-background py-[3px] pl-2.5 pr-1">
        <span className="truncate text-foreground">{EMAIL}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Email copied" : "Copy email"}
          className="flex shrink-0 items-center gap-1 rounded-[6px] px-2 py-1 text-sm text-muted-foreground transition-colors duration-300 hover:bg-muted-bg hover:text-spot"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-12">
      <SectionHeader id="contact-title">Get in touch</SectionHeader>
      <Container className="p-0">
        <div className="bg-striped flex flex-col gap-3 p-4 sm:flex-row sm:items-stretch sm:p-6">
          <CopyEmail />
          <a href={`mailto:${EMAIL}`} className="group w-full shrink-0 select-none rounded-[10px] border border-border bg-background p-[2px] sm:w-[140px]">
            <span className="flex h-full w-full items-center justify-center gap-1.5 rounded-[8px] border border-border bg-[color:var(--accent-tint)] px-4 py-1.5 text-spot transition duration-300 group-hover:bg-[color:var(--accent-tint-hover)] sm:py-0">
              <Mail aria-hidden="true" className="size-4" />
              <span className="text-[0.95rem] font-medium">Send email</span>
            </span>
          </a>
        </div>
      </Container>
      <Hr />

      <Container>
        <figure className="flex flex-col items-center py-4 text-center sm:py-6">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-10 fill-muted sm:size-12">
            <path d="M3 21v-7.2c0-3.6 1.6-6.6 4.8-8.8l1.4 1.8C7.3 8.3 6.3 10 6.1 12H9.5v9H3zm11.5 0v-7.2c0-3.6 1.6-6.6 4.8-8.8l1.4 1.8c-1.9 1.5-2.9 3.2-3.1 5.2H21v9h-6.5z" />
          </svg>
          <blockquote className="mt-4 max-w-2xl px-1 sm:px-4">
            <p className="text-xl font-bold italic leading-relaxed tracking-tight text-title sm:text-3xl">
              “Make it work, make it right, make it fast.”
            </p>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 sm:mt-8">
            <span className="h-px w-8 bg-muted" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted sm:text-sm">Kent Beck</span>
            <span className="h-px w-8 bg-muted" />
          </figcaption>
        </figure>
      </Container>
      <Hr />

      <DotBand seed={42} />
    </section>
  );
}
