import { useEffect, useMemo, useRef, type MouseEvent } from "react";

// Vocabulary from the work: the stack, the systems and the products.
const WORDS = [
  "java",
  "spring-boot",
  "netty",
  "kafka",
  "spark",
  "redis",
  "postgres",
  "cassandra",
  "scylladb",
  "docker",
  "kubernetes",
  "aws",
  "linux",
  "rest",
  "graphql",
  "microservices",
  "streaming",
  "pipelines",
  "telemetry",
  "iot",
  "anchora",
  "atlas",
  "supabase",
  "nextjs",
  "typescript",
  "python",
  "langchain",
  "vercel",
  "git",
  "jenkins",
  "maven",
  "gradle",
  "junit",
  "elasticsearch",
  "rabbitmq",
  "mysql",
  "mongodb",
  "fleetx",
  "backend",
  "realtime",
  "latency",
  "throughput",
  "partitions",
  "consumers",
  "producers",
  "schemas",
  "migrations",
  "rls",
  "webhooks",
  "cron",
  "queues",
  "caching",
  "sharding",
  "replicas",
  "observability",
  "markiniser",
  "serene",
  "ajkale",
];

const ROWS = 9;
const MOBILE_ROWS = 5;
const PER_ROW = 28; // enough that one copy spans even very wide screens, so the loop never shows a gap

// Small seeded shuffle so each band gets its own stable arrangement.
type Row = { duration: number; words: string[] };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function useRows(seed: number): Row[] {
  return useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: ROWS }, () => ({
      // Every row drifts the same way; a slightly different pace keeps the field from looking like one sheet.
      duration: 60 + Math.floor(rand() * 40),
      words: Array.from({ length: PER_ROW }, () => WORDS[Math.floor(rand() * WORDS.length)]),
    }));
  }, [seed]);
}

// Rows sit at natural line spacing rather than being stretched to a fixed height,
// so they never crush together; phones show fewer rows in slightly smaller type.
function Rows({ rows }: { rows: Row[] }) {
  return (
    <div className="flex flex-col gap-[10px] py-2 font-mono text-[11px] leading-none sm:gap-3 sm:text-[12px]">
      {rows.map((row, r) => (
        <div key={r} className={`overflow-hidden ${r >= MOBILE_ROWS ? "hidden sm:block" : ""}`}>
          {/* Two copies back to back, so sliding by half the width loops seamlessly. */}
          <div className="word-drift flex w-max whitespace-nowrap" style={{ animationDuration: `${row.duration}s` }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-6 pr-6">
                {row.words.map((word, w) => (
                  <span key={w} className="field-word">
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const RADIUS = 80; // words within this distance of the cursor light up; the inner part is fully lit
const HOLD_MS = 300; // a lit word keeps its colour this long after the cursor moves on
const FADE_MS = 1000; // then eases back to dim; older parts of the path are always dimmer than newer ones
// Mobile twinkle, paced like stars: one word at a time glows up softly, lingers, then fades slowly.
const TWINKLE_MS = 900; // how often a new word starts to glow
const TWINKLE_COUNT = 1; // words started each time
const TWINKLE_RISE_MS = 800;
const TWINKLE_PEAK_MS = 600;
const TWINKLE_FADE_MS = 2500;
// Twinkle where there's no cursor to follow: touch devices, and narrow (phone-sized) windows.
const TWINKLE_QUERY = "(hover: none), (max-width: 640px)";

// A field of dim words drifting sideways, like the background on cloudflare.com/domains.
// Words near the cursor turn yellow in proportion to how close they are, then fade out,
// leaving a short trail that tapers off behind the cursor.
type Heat = { level: number; t: number };

export default function WordField({ seed = 7, className = "" }: { seed?: number; className?: string }) {
  const rows = useRows(seed);
  const boxRef = useRef<HTMLDivElement>(null);
  const heat = useRef(new Map<HTMLElement, Heat>()); // word element -> { level, t } at the moment it was last lit
  const frame = useRef(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const pending = useRef(new Set<ReturnType<typeof setTimeout>>()); // twinkle timeouts, cleared on unmount

  // How lit a word still is right now, after fading since it was last touched.
  const current = (entry: Heat | undefined, now: number) =>
    entry ? entry.level * Math.min(1, Math.max(0, 1 - (now - entry.t - HOLD_MS) / FADE_MS)) : 0;

  // Jump a word to `level` brightness, then on the next frame let it hold briefly and ease back to dim,
  // so the colour drains gradually instead of dropping at the end.
  const light = (el: HTMLElement, level: number, now: number) => {
    heat.current.set(el, { level, t: now });
    el.style.transition = "none";
    el.style.color = `color-mix(in srgb, var(--word-spot) ${Math.round(level * 100)}%, var(--muted))`;
    el.style.opacity = String(0.5 + 0.5 * level);
    requestAnimationFrame(() => {
      const fade = `${FADE_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${HOLD_MS}ms`;
      el.style.transition = `color ${fade}, opacity ${fade}`;
      el.style.color = "";
      el.style.opacity = "";
    });
  };

  // Desktop: words near the cursor light up. Checked once per frame at most, since the words keep moving.
  const lightNearby = () => {
    frame.current = 0;
    const p = pointer.current;
    if (!p) return;
    const now = performance.now();
    for (const el of boxRef.current!.querySelectorAll<HTMLElement>(".field-word")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      const distance = Math.hypot(r.left + r.width / 2 - p.x, r.top + r.height / 2 - p.y);
      if (distance > RADIUS) continue;
      const level = Math.min(1, (1 - distance / RADIUS) * 1.8);
      if (level > current(heat.current.get(el), now)) light(el, level, now);
    }
  };

  // A slow star-like glow: ease up to `level`, hold, then fade out gently. Unlike `light`, there's no instant jump.
  const twinkle = (el: HTMLElement, level: number) => {
    if (el.dataset.twinkling) return;
    el.dataset.twinkling = "1";
    const ease = "cubic-bezier(0.45, 0, 0.55, 1)";
    el.style.transition = `color ${TWINKLE_RISE_MS}ms ${ease}, opacity ${TWINKLE_RISE_MS}ms ${ease}`;
    el.style.color = `color-mix(in srgb, var(--word-spot) ${Math.round(level * 100)}%, var(--muted))`;
    el.style.opacity = String(0.5 + 0.5 * level);
    const timer = setTimeout(() => {
      el.style.transition = `color ${TWINKLE_FADE_MS}ms ${ease}, opacity ${TWINKLE_FADE_MS}ms ${ease}`;
      el.style.color = "";
      el.style.opacity = "";
      const done = setTimeout(() => delete el.dataset.twinkling, TWINKLE_FADE_MS);
      pending.current.add(done);
    }, TWINKLE_RISE_MS + TWINKLE_PEAK_MS);
    pending.current.add(timer);
  };

  // Where there's no hover, random visible words twinkle on their own instead.
  // Re-evaluated when the window crosses the breakpoint, so resizing switches modes.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const query = window.matchMedia(TWINKLE_QUERY);
    let timer = 0;
    const tick = () => {
      const box = boxRef.current?.getBoundingClientRect();
      if (!box || box.bottom < 0 || box.top > window.innerHeight) return; // skip while scrolled away
      const visible = [...boxRef.current!.querySelectorAll<HTMLElement>(".field-word")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > box.left && r.left < box.right;
      });
      for (let i = 0; i < TWINKLE_COUNT && visible.length; i++) {
        const el = visible.splice(Math.floor(Math.random() * visible.length), 1)[0];
        twinkle(el, 0.55 + Math.random() * 0.45);
      }
    };
    const sync = () => {
      clearInterval(timer);
      timer = query.matches ? setInterval(tick, TWINKLE_MS) : 0;
    };
    sync();
    query.addEventListener("change", sync);
    return () => {
      clearInterval(timer);
      query.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const timers = pending.current;
    return () => {
      cancelAnimationFrame(frame.current);
      timers.forEach(clearTimeout);
    };
  }, []);

  const onMove = (e: MouseEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY };
    if (!frame.current) frame.current = requestAnimationFrame(lightNearby);
  };

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      onMouseMove={onMove}
      onMouseLeave={() => (pointer.current = null)}
      className={`relative w-full select-none overflow-hidden ${className}`}
    >
      {/* Left out of the build-time HTML: a thousand repeated keywords would read as stuffing to crawlers. */}
      {typeof window !== "undefined" && <Rows rows={rows} />}
    </div>
  );
}
