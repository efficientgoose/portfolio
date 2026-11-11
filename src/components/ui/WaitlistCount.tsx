import { useEffect, useRef, useState } from "react";
import LinkPreview from "./LinkPreview";
import CountUp from "./CountUp";
import { formatCount, useWaitlistCount } from "../../lib/waitlist";
import { ANCHORA_WAITLIST_URL, WAITLIST_FALLBACK } from "../../data/links";

// A green dot with a soft pulse, always next to a text label.
function LiveDot({ small }: { small?: boolean }) {
  const size = small ? "size-1.5" : "size-2";
  return (
    <span className={`relative flex shrink-0 ${size}`}>
      <span className={`absolute animate-ping rounded-full bg-green-500 opacity-40 ${size}`} />
      <span className={`rounded-full bg-green-500 ${size}`} />
    </span>
  );
}

// The figure in the intro sentence: the live count rounded down to the nearest ten ("2,270+").
// Until the count loads, if it can't, and in the build-time HTML, it shows the last figure set by hand.
export function WaitlistFigure() {
  const count = useWaitlistCount();
  const figure = typeof count === "number" ? Math.floor(count / 10) * 10 : WAITLIST_FALLBACK;
  return <span className="tabular-nums">{formatCount(figure)}+</span>;
}

// True once the element has been on screen with the first-load curtain out of the way.
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    let curtain: MutationObserver | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!document.getElementById("loader")) return setSeen(true);
      curtain = new MutationObserver(() => {
        if (document.getElementById("loader")) return;
        curtain?.disconnect();
        setSeen(true);
      });
      curtain.observe(document.body, { childList: true });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      curtain?.disconnect();
    };
  }, [seen]);

  return [ref, seen] as const;
}

// "Grab a spot on the waitlist", with the live count beside it. Where there is a cursor, hovering or
// focusing the link floats a card with the number, which runs up from 0 each time. Phones and touch
// screens have no hover, so they get a small pill after the link instead; it counts up once, the
// first time it is seen. If the count can't be loaded, this is just the link.
export function WaitlistLink() {
  const count = useWaitlistCount();
  const [pillRef, seen] = useSeen<HTMLSpanElement>();
  const live = typeof count === "number";

  return (
    <>
      <LinkPreview
        href={ANCHORA_WAITLIST_URL}
        label="tryanchora.com"
        linkClassName="group whitespace-nowrap font-medium"
        card={
          live
            ? (open) => (
                <span className="flex flex-col gap-2.5 rounded-[8px] bg-muted-bg px-3 pb-[13px] pt-3">
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium leading-none text-muted-foreground">
                      <LiveDot />
                      Live
                    </span>
                    <img
                      src="/logos/anchora.webp"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="size-[22px] select-none rounded-[6px] bg-white p-[2px]"
                    />
                  </span>
                  <CountUp
                    value={count}
                    run={open}
                    className="text-[2.1rem] font-bold leading-none tracking-[-0.01em] text-title tabular-nums"
                  />
                  <span className="text-[13.5px] leading-[1.2] text-muted-foreground">people on the waitlist</span>
                </span>
              )
            : undefined
        }
      >
        Grab a spot on the waitlist
        <span
          aria-hidden="true"
          className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
        >
          →
        </span>
      </LinkPreview>

      {/* Shown exactly where the card is not. While the count is loading the pill holds its place
          unseen, so the line doesn't shift when the number arrives. */}
      {count !== null && (
        <span
          ref={pillRef}
          className={`ml-1.5 inline-flex select-none items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-muted-bg py-1 pl-[7px] pr-2 align-[2px] text-xs font-medium leading-none text-muted-foreground sm:[@media(hover:hover)]:hidden ${
            live ? "" : "invisible"
          }`}
        >
          <LiveDot small />
          <CountUp value={live ? count : WAITLIST_FALLBACK} run={live && seen} className="tabular-nums" />
          <span className="sr-only"> people on the waitlist, live count</span>
        </span>
      )}
    </>
  );
}
