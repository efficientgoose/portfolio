import { useEffect, useRef, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import { CalendarDays, Globe, Mail, MapPin, Moon, Shuffle, Sun } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { Container, DotBand, Hr } from "../ui/Layout";
import GitHubGraph from "./GitHubGraph";
import RotatingRole from "../ui/RotatingRole";
import { playGlitchSound, playToggleSound } from "../../lib/sound";
import { ANCHORA_URL, CAL_LINK, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../../data/links";

// The shuffle button (or a click on the avatar) swaps between these.
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

function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    playToggleSound(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
    setTheme(next);
  };

  return (
    <button type="button" onClick={toggle} aria-label="Toggle theme" data-own-sound className={iconButton}>
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
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
  const timers = useRef([]);

  // Glitch for ~300ms in sound and picture, swapping to a different random photo partway through.
  const shuffle = () => {
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
                  className={`relative block size-[90px] overflow-hidden rounded-[8px] ${glitching ? "is-glitching" : ""}`}
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
                  <h1 className="text-[1.55rem] font-bold leading-[1.08] text-title">Ajinkya Kale</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <RotatingRole roles={["Backend Engineer", "Co-Founder, Anchora"]} />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              {/* Small icon buttons grouped in the top-right corner, as on the reference. */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={shuffle}
                  data-own-sound
                  aria-label="Shuffle photo"
                  title="Shuffle photo"
                  className={iconButton}
                >
                  <Shuffle className="size-[18px]" />
                </button>
                <ThemeToggle />
              </div>
              <div className="hidden select-none items-center gap-1.5 font-medium text-muted sm:flex">
                <MapPin aria-hidden="true" className="size-4" />
                <span className="text-xs sm:text-sm">Gurgaon, India</span>
              </div>
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
              Hey, I'm Ajinkya!
            </p>
            <p>
              I'm a backend engineer at <strong>Fleetx</strong>, building and scaling real-time systems that process{" "}
              <strong>1B+ sensor readings daily from 350K+ vehicles</strong>. My work spans Netty-based TCP servers,
              Kafka pipelines, Spark streaming, and Spring Boot services.
            </p>
            <p>
              I also co-founded <strong>Anchora</strong>, an AI-powered study-abroad platform that simplifies the
              journey for students in India. I'm building it end-to-end, from its PostgreSQL architecture and backend
              systems to its AI assistant.
            </p>
            <p>
              I enjoy solving complex engineering problems, building products from scratch, and turning ideas into
              things people can use.
            </p>
          </div>

          <div className="flex flex-wrap select-none justify-center gap-3 pt-8 sm:pt-10">
            {/* Opens the Cal.com booking page as a pop-up over the site (wired in useCalPopup). */}
            <button
              type="button"
              data-cal-namespace="coffee"
              data-cal-link={CAL_LINK}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="flex w-fit items-center gap-1.5 overflow-hidden rounded-[9px] bg-strong px-4 py-2.5 text-sm font-medium text-background transition-opacity duration-300 hover:opacity-80"
            >
              <CalendarDays aria-hidden="true" className="size-4" />
              Grab a Coffee
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="flex w-fit items-center gap-1.5 overflow-hidden rounded-[9px] border border-border bg-muted-bg px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-muted-bg-hover"
            >
              <Mail aria-hidden="true" className="size-4" />
              Send an email
            </a>
          </div>

          <div className="flex flex-col gap-3 pb-8 pt-8 sm:pb-10 sm:pt-10">
            <p>
              Here are my <span className="font-medium text-strong">socials</span>
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

          <GitHubGraph />
        </Container>
        <Hr />
      </div>
    </header>
  );
}
