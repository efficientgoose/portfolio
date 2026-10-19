import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { GITHUB_URL, GITHUB_USER } from "../../data/links";

const API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;
// History starts on this date; the calendar runs from its week up to today.
const START_DATE = "2026-07-15";
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const PLACEHOLDER_WEEKS = 15; // shown while loading

const fmt = (date, opts) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC", ...opts });

// Days from START_DATE to today as Sunday-first week columns; days before the start date are left blank.
function weeksSinceStart(days) {
  const from = days.findIndex((d) => d.date >= START_DATE);
  if (from === -1) return [];
  const slice = days.slice(from);
  const leading = new Date(`${slice[0].date}T00:00:00Z`).getUTCDay();
  const cells = [...Array(leading).fill(null), ...slice];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function summarize(weeks) {
  const days = weeks.flat().filter(Boolean);
  let streak = 0;
  let longest = 0;
  for (const d of days) {
    streak = d.count > 0 ? streak + 1 : 0;
    longest = Math.max(longest, streak);
  }
  return {
    total: days.reduce((sum, d) => sum + d.count, 0),
    active: days.filter((d) => d.count > 0).length,
    longest,
  };
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col">
      <span className="text-[1.1rem] font-bold tabular-nums leading-tight text-title">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function GitHubGraph() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setData)
      .catch((err) => err?.name !== "AbortError" && setFailed(true));
    return () => controller.abort();
  }, []);

  const weeks = useMemo(() => weeksSinceStart(data?.contributions ?? []), [data]);
  const stats = useMemo(() => summarize(weeks), [weeks]);

  if (failed) return null;

  const loading = !weeks.length;
  const columns = loading ? Array.from({ length: PLACEHOLDER_WEEKS }, () => Array(7).fill(null)) : weeks;
  const months = columns.map((week, i) => {
    const first = week.find(Boolean);
    const prev = columns[i - 1]?.find(Boolean);
    if (!first) return "";
    const m = fmt(first.date, { month: "short" });
    return !prev || fmt(prev.date, { month: "short" }) !== m ? m : "";
  });
  // Drop a label that would collide with the next one.
  months.forEach((m, i) => {
    if (m && months.slice(i + 1, i + 3).some(Boolean)) months[i] = "";
  });

  const showTooltip = (day, el) => {
    const cell = el.getBoundingClientRect();
    const box = boxRef.current.getBoundingClientRect();
    setHover({ day, x: cell.left - box.left + cell.width / 2, y: cell.top - box.top });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Heading row, matching "Songs I have on repeat". */}
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2">
          <SiGithub aria-hidden="true" className="size-4 text-foreground" />
          <span>
            GitHub <span className="font-medium text-strong">contributions</span>
          </span>
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-spot"
        >
          View profile
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>

      {/* Calendar with the stats beside it on desktop (spanning its height, behind a hairline), below it on phones. */}
      <div className="flex select-none flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-8">
        <div ref={boxRef} className="relative w-fit text-xs" onMouseLeave={() => setHover(null)}>
          <div className="mb-1.5 ml-8 flex gap-[4px] text-muted-foreground">
            {months.map((m, i) => (
              <span key={i} className="w-[16px] whitespace-nowrap sm:w-[18px]">
                {m}
              </span>
            ))}
          </div>
          <div
            className="flex gap-[4px]"
            role="img"
            aria-label={
              loading ? "Loading GitHub contributions" : `${stats.total} GitHub contributions since 15 July 2026`
            }
          >
            <div className="mr-1 flex w-7 flex-col gap-[4px] text-muted-foreground">
              {DAY_LABELS.map((d, i) => (
                <span key={i} className="h-[16px] leading-[16px] sm:h-[18px] sm:leading-[18px]">
                  {d}
                </span>
              ))}
            </div>
            {columns.map((week, w) => (
              <div key={w} className="flex flex-col gap-[4px]">
                {week.map((day, d) => (
                  <div
                    key={day?.date ?? `${w}-${d}`}
                    onMouseEnter={day ? (e) => showTooltip(day, e.currentTarget) : undefined}
                    className={`size-[16px] rounded-[3px] sm:size-[18px] ${loading ? "animate-pulse" : ""}`}
                    style={{
                      background: day ? `var(--heat-${day.level})` : loading ? "var(--heat-0)" : "transparent",
                      outline: day && hover?.day === day ? "1px solid var(--muted-foreground)" : "none",
                      outlineOffset: 1,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {hover && (
            <div
              role="tooltip"
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[8px] border border-border bg-muted-bg px-2.5 py-1.5 text-[12.5px] text-foreground shadow-lg"
              style={{ left: hover.x, top: hover.y - 6 }}
            >
              <span className="font-semibold text-title">
                {hover.day.count === 0 ? "No" : hover.day.count} contribution{hover.day.count === 1 ? "" : "s"}
              </span>{" "}
              on {fmt(hover.day.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-[3px] pl-8 text-muted-foreground" aria-hidden="true">
            <span className="mr-1">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className="size-[11px] rounded-[2px]" style={{ background: `var(--heat-${level})` }} />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="grid grid-cols-3 gap-4 border-t border-border pt-4 sm:flex sm:flex-col sm:justify-between sm:border-l sm:border-t-0 sm:py-5 sm:pl-8 sm:pt-5"
        >
          <Stat value={loading ? "—" : stats.total.toLocaleString("en-IN")} label="contributions" />
          <Stat value={loading ? "—" : stats.active} label="active days" />
          <Stat value={loading ? "—" : `${stats.longest} days`} label="longest streak" />
        </a>
      </div>
    </div>
  );
}
