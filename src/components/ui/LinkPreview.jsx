import { useLayoutEffect, useRef, useState } from "react";

const CARD_WIDTH = 248;
const EDGE = 16; // keep the card this far from the viewport edges
const NAV_CLEARANCE = 72; // flip below the link when the sticky nav would cover the card

// An inline link that, on hover or keyboard focus, floats a small framed screenshot of the site
// above it. Phones and touch screens skip the card and just follow the link.
export default function LinkPreview({ href, image, label, children }) {
  const linkRef = useRef(null);
  const cardRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState({ shift: 0, below: false });

  // Measure once the card is laid out, then nudge it sideways and flip it if it would be clipped.
  useLayoutEffect(() => {
    if (!open || !linkRef.current || !cardRef.current) return;
    const link = linkRef.current.getBoundingClientRect();
    const height = cardRef.current.offsetHeight;
    const centre = link.left + link.width / 2;
    const min = EDGE + CARD_WIDTH / 2;
    const max = window.innerWidth - EDGE - CARD_WIDTH / 2;
    setPlace({
      shift: Math.min(Math.max(centre, min), max) - centre,
      below: link.top - height - 10 < NAV_CLEARANCE,
    });
  }, [open]);

  return (
    <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="font-bold text-strong underline decoration-[color:var(--muted)] decoration-1 underline-offset-[5px] transition-colors duration-200 hover:text-spot hover:decoration-[color:var(--spot)] focus-visible:text-spot focus-visible:decoration-[color:var(--spot)]"
      >
        {children}
      </a>

      <span
        ref={cardRef}
        aria-hidden="true"
        data-open={open}
        data-below={place.below}
        style={{ width: CARD_WIDTH, "--shift": `${place.shift}px` }}
        className="link-preview pointer-events-none absolute left-1/2 z-40 hidden rounded-[11px] border border-border bg-background p-[3px] sm:[@media(hover:hover)]:block"
      >
        <img
          src={image}
          alt=""
          draggable="false"
          className="block aspect-video w-full select-none rounded-[8px] object-cover object-top"
        />
        <span className="block px-1.5 pb-[5px] pt-[6px] text-[11.5px] leading-none text-muted-foreground">{label}</span>
      </span>
    </span>
  );
}
