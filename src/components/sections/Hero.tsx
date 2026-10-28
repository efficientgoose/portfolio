import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { getCalApi } from "@calcom/embed-react";
import { CalendarDays, Github, Globe, Mail, MapPin, Moon, Sun, Volume2, VolumeOff } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { Container, DotBand, Hr } from "../ui/Layout";
import GitHubGraph from "./GitHubGraph";
import ViewCount from "../ui/ViewCount";
import SongsOnRepeat from "./SongsOnRepeat";
import RotatingRole from "../ui/RotatingRole";
import LinkPreview from "../ui/LinkPreview";
import { isMuted, playClickSound, playGlitchSound, setMuted, subscribeMuted } from "../../lib/sound";
import { ANCHORA_URL, ANCHORA_WAITLIST_URL, CAL_LINK, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../../data/links";

// A click on the avatar swaps between these.
const photos = [
  { src: "/Profile.webp", position: "50% 35%" }, // default
  { src: "/Bottom-Right.webp", position: "50% 26%" },
  { src: "/Main.webp", position: "50% 28%" },
  { src: "/Left.webp", position: "50% 30%" },
];

const socials = [
  { label: "GitHub", href: GITHUB_URL, icon: SiGithub },
  { label: "LinkedIn", href: LINKEDIN_URL, icon: FaLinkedinIn },
  { label: "Anchora", href: ANCHORA_URL, icon: Globe },
];

const iconButton =
  "relative z-10 w-fit cursor-pointer rounded-[6px] border border-transparent p-1.5 text-muted transition-colors duration-300 hover:border-border hover:bg-[color:var(--accent-tint)] hover:text-spot";

// Lucide's Mail, filled: the body is solid and the flap is cut out in the hovered button's colour.
function MailFilled({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" />
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" stroke="var(--muted-bg-hover)" />
    </svg>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() => (typeof document === "undefined" ? "dark" : document.documentElement.dataset.theme || "dark"));
  const switching = useRef(false);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }

    const apply = () => {
      document.documentElement.dataset.theme = next;
      flushSync(() => setTheme(next));
    };

    // Wipe the new theme down from the top, as on the reference; switch instantly where
    // view transitions are unsupported, motion is reduced, or a wipe is already running.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced || switching.current) {
      apply();
      return;
    }
    switching.current = true;
    document.startViewTransition(apply).finished.finally(() => {
      switching.current = false;
    });
  };

  return (
    <button type="button" onClick={toggle} aria-label="Toggle theme" className={iconButton}>
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

// Mutes every sound on the site and remembers the choice. Unmuting plays the click so you hear it
// come back; muting stays silent.
function MuteToggle() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);

  const toggle = () => {
    setMuted(!muted);
    if (muted) playClickSound();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-own-sound
      aria-label={muted ? "Turn sounds on" : "Mute sounds"}
      aria-pressed={muted}
      title={muted ? "Sounds off" : "Sounds on"}
      className={iconButton}
    >
      {muted ? <VolumeOff className="size-[18px]" /> : <Volume2 className="size-[18px]" />}
    </button>
  );
}

// Load Cal.com's embed once and style its pop-up to match the site (dark, gold accent).
function useCalPopup() {
  useEffect(() => {
    let cancelled = false;
    getCalApi({ namespace: "coffee" })
      .then((cal) => {
        if (cancelled) return;
        cal("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          layout: "month_view",
          cssVarsPerTheme: { dark: { "cal-brand": "#d9b562" }, light: { "cal-brand": "#b7791f" } },
        });
      })
      .catch(() => {
        // If the embed script can't load, the button simply does nothing; the email CTA still works.
      });
    return () => {
      cancelled = true;
    };
  }, []);
}

export default function Hero() {
  useCalPopup();
  const [photo, setPhoto] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const preloaded = useRef<HTMLImageElement[]>([]);

  // Fetch and decode the other photos up front so the mid-glitch swap never lands on a blank frame.
  useEffect(() => {
    preloaded.current = photos.map(({ src }) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => {});
      return img;
    });
  }, []);

  // Glitch for ~300ms in sound and picture, swapping to a different random photo partway through.
  // Clicks during a glitch are ignored: the CSS animation can't restart mid-run, so a second swap would jump unanimated.
  const shuffle = () => {
    if (glitching) return;
    playGlitchSound();
    timers.current.forEach(clearTimeout);
    setGlitching(true);
    timers.current = [
      setTimeout(
        () =>
          setPhoto((p) => {
            const others = photos.map((_, i) => i).filter((i) => i !== p);
            return others[Math.floor(Math.random() * others.length)];
          }),
        110,
      ),
      setTimeout(() => setGlitching(false), 300),
    ];
  };

  return (
    <header id="about" className="scroll-mt-12">
      <div className="relative bg-background">
        <DotBand seed={7} />
        <Hr />
      </div>

      <div className="relative bg-background">
        <Container>
          <div className="flex items-stretch justify-between">
            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={shuffle}
                data-own-sound
                aria-label="Shuffle photo"
                className="cursor-pointer rounded-[12px] border border-border p-[4px] transition duration-300 hover:brightness-90"
              >
                <span
                  className={`relative block size-[90px] overflow-hidden max-[359px]:size-[68px] rounded-[8px] ${glitching ? "is-glitching" : ""}`}
                >
                  <img
                    src={photos[photo].src}
                    alt="Ajinkya Kale"
                    draggable="false"
                    className="glitch-base size-full select-none object-cover"
                    style={{ objectPosition: photos[photo].position }}
                  />
                  {glitching && (
                    <>
                      {/* Light and dark grey copies that tear sideways out of register. */}
                      {["glitch-light", "glitch-dark"].map((layer) => (
                        <img
                          key={layer}
                          src={photos[photo].src}
                          alt=""
                          aria-hidden="true"
                          draggable="false"
                          className={`${layer} pointer-events-none absolute inset-0 size-full select-none object-cover`}
                          style={{ objectPosition: photos[photo].position }}
                        />
                      ))}
                      <span aria-hidden="true" className="glitch-scanlines pointer-events-none absolute inset-0" />
                    </>
                  )}
                </span>
              </button>
              {/* Name and subtitle are centred on the photo's vertical middle. */}
              <div className="flex select-none flex-col justify-center self-stretch">
                <div>
                  <h1 className="whitespace-nowrap text-[1.55rem] font-bold leading-[1.08] text-title">Ajinkya Kale</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <RotatingRole roles={["Backend Engineer", "Co-Founder, Anchora"]} />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              {/* View count and small icon buttons grouped in the top-right corner, as on the reference. */}
              <div className="flex items-center">
                {/* On phones the view count moves to the bottom-right slot, so the name keeps room. */}
                <span className="hidden sm:flex">
                  <ViewCount />
                </span>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  title="GitHub"
                  className={iconButton}
                >
                  <Github className="size-[18px]" />
                </a>
                <MuteToggle />
                <ThemeToggle />
              </div>
              <div className="hidden select-none items-center gap-1.5 font-medium text-muted sm:flex">
                <MapPin aria-hidden="true" className="size-4" />
                <span className="text-xs sm:text-sm">New Delhi, India</span>
              </div>
              <span className="flex sm:hidden">
                <ViewCount />
              </span>
            </div>

            {/* Handwritten note in the left margin, as on the reference. Hovering wiggles the words,
                draws a scribble under them and nudges the arrow toward the photo. */}
            <a
              href={`mailto:${EMAIL}`}
              aria-label="Say hi by email"
              className="say-hi absolute -left-[5.5rem] top-1 hidden -rotate-12 select-none flex-col items-center outline-none lg:flex"
            >
              <span className="say-hi-text relative mr-6 inline-block font-hand text-lg text-muted">
                SAY HI
                <svg
                  aria-hidden="true"
                  viewBox="0 0 60 8"
                  fill="none"
                  className="say-hi-scribble absolute -bottom-1 left-0 h-2 w-full"
                >
                  <path
                    d="M2 5c8-3 14 2 22-1s14-2 20 0 10 1 14-2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    pathLength="1"
                  />
                </svg>
              </span>
              <svg
                aria-hidden="true"
                width="64"
                height="48"
                viewBox="0 0 64 48"
                fill="none"
                className="say-hi-arrow text-muted"
              >
                <path
                  d="M14 4c-2 14 4 30 44 38"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  pathLength="1"
                />
                <path
                  d="M8 10l6-7 5 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </Container>
        <Hr />
      </div>

      <div className="relative">
        <Container className="pb-8 pt-3 sm:pb-10 sm:pt-4">
          <div className="flex flex-col gap-3 leading-[1.6]">
            <p>
              Hey, I'm Ajinkya. I like building things from scratch and spending way too much time on the little
              details.
            </p>
            <p>
              I'm now going all in on{" "}
              <LinkPreview href={ANCHORA_URL} image="/projects/anchora.webp" label="tryanchora.com">
                Anchora
              </LinkPreview>
              , an AI-native platform I'm building with a friend to make studying abroad easier. I handle everything
              from product design to engineering. We're in closed beta, with{" "}
              <strong>1,000+ people already on the waitlist</strong>.
            </p>
            <p className="-mt-2 mb-3">
              Want in?{" "}
              <a
                href={ANCHORA_WAITLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group whitespace-nowrap font-medium text-strong underline decoration-[color:var(--muted)] decoration-1 underline-offset-[5px] transition-colors duration-200 hover:text-spot hover:decoration-[color:var(--spot)] focus-visible:text-spot focus-visible:decoration-[color:var(--spot)]"
              >
                Grab a spot on the waitlist
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </p>
            <p>
              I'm also a backend engineer at <strong>Fleetx</strong>, where I work on real-time systems processing{" "}
              <strong>over a billion sensor readings a day from 350,000+ vehicles</strong>. I build the servers,
              streaming pipelines and services behind vehicle tracking and analytics.
            </p>
          </div>

          <div className="flex flex-wrap select-none justify-center gap-3 pt-8 sm:pt-10">
            {/* Opens the Cal.com booking page as a pop-up over the site (wired in useCalPopup). */}
            <button
              type="button"
              data-cal-namespace="coffee"
              data-cal-link={CAL_LINK}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="group flex w-fit items-center gap-1.5 overflow-hidden rounded-[9px] bg-strong px-4 py-2.5 text-sm font-medium text-background"
            >
              {/* On hover the outline calendar drops out and a filled one drops in from above. */}
              <span aria-hidden="true" className="relative size-4 overflow-hidden">
                <CalendarDays className="absolute inset-0 size-4 transition-transform duration-300 ease-out group-hover:translate-y-full group-focus-visible:translate-y-full" />
                <CalendarDays className="calendar-filled absolute inset-0 size-4 -translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0" />
              </span>
              Grab a coffee
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="group flex w-fit items-center gap-1.5 overflow-hidden rounded-[9px] border border-border bg-muted-bg px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-muted-bg-hover"
            >
              {/* Same roll as the calendar: the outline envelope drops out, a filled one drops in. */}
              <span aria-hidden="true" className="relative size-4 overflow-hidden">
                <Mail className="absolute inset-0 size-4 transition-transform duration-300 ease-out group-hover:translate-y-full group-focus-visible:translate-y-full" />
                <MailFilled className="absolute inset-0 size-4 -translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0" />
              </span>
              Send an email
            </a>
          </div>

          <div className="flex flex-col gap-3 pb-8 pt-8 sm:pb-10 sm:pt-10">
            <p>
              Find me <span className="font-medium text-strong">elsewhere</span>
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex select-none items-center rounded-[6px] bg-muted-bg px-2 py-1 transition-colors duration-200 hover:bg-muted-bg-hover"
                >
                  <Icon aria-hidden="true" className="size-4 text-foreground transition-colors group-hover:text-spot" />
                  <span className="ml-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-spot">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <SongsOnRepeat />

          <GitHubGraph />
        </Container>
        <Hr />
      </div>
    </header>
  );
}
