import { useRef, useState } from "react";
import { FileText, Globe, Mail, MapPin, Moon, Shuffle, Sun } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { Container, DotBand, Hr } from "../ui/Layout";
import GitHubGraph from "./GitHubGraph";
import RotatingRole from "../ui/RotatingRole";
import { playGlitchSound, playToggleSound } from "../../lib/sound";
import { ANCHORA_URL, EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "../../data/links";

// The shuffle button (or a click on the avatar) swaps between these.
const photos = [
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
  "relative z-10 w-fit cursor-pointer rounded-[6px] border border-transparent p-1.5 text-muted transition-colors duration-300 hover:border-border hover:bg-muted-bg hover:text-muted-foreground";

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
    <button type="button" onClick={toggle} aria-label="Toggle theme" className={iconButton}>
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

export default function Hero() {
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
              <div className="flex h-full select-none flex-col justify-between py-1">
                <button
                  type="button"
                  onClick={shuffle}
                  aria-label="Shuffle photo"
                  title="Shuffle photo"
                  className={`${iconButton} -ml-1.5 -mt-1`}
                >
                  <Shuffle className="size-4" />
                </button>
                <div>
                  <h1 className="text-[1.55rem] font-bold leading-[1.08] text-title">Ajinkya Kale</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <RotatingRole roles={["Backend Engineer", "Co-Founder, Anchora"]} />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <ThemeToggle />
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
        <Container>
          <div className="flex flex-col gap-2 leading-[1.6]">
            <p>
              Hey, I’m Ajinkya, a backend engineer at Fleetx, where I build the real-time pipelines that take in 20B+
              sensor readings a day from 350K+ vehicles, with Netty servers, Kafka and Spark streams, and Spring Boot
              services.
            </p>
            <p>
              I’m also the co-founder of Anchora, a study-abroad planner for students in India, which I’m building end
              to end, from the Postgres schema to its AI guide.
            </p>
          </div>

          <div className="flex select-none gap-2 pt-4.5">
            <a
              href={`mailto:${EMAIL}`}
              className="flex w-fit items-center gap-1.5 overflow-hidden rounded-[9px] bg-non-hover px-2.5 py-[7px] text-sm font-medium text-background transition-colors duration-300 hover:bg-hover sm:py-1.5"
            >
              <Mail aria-hidden="true" className="size-4" />
              Send an email
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-1.5 overflow-hidden rounded-[9px] border border-border bg-muted-bg px-2.5 py-[7px] text-sm font-medium text-foreground transition-colors duration-300 hover:bg-muted-bg-hover sm:py-1.5"
            >
              <FileText aria-hidden="true" className="size-4" />
              View résumé
            </a>
          </div>

          <div className="flex flex-col gap-2 py-4.5">
            <p>
              Here are my <span className="font-medium text-strong">socials</span>
            </p>
            <div className="flex flex-wrap items-center gap-[7px]">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex select-none items-center rounded-[6px] bg-muted-bg px-2 py-1 transition-colors duration-200 hover:bg-muted-bg-hover"
                >
                  <Icon aria-hidden="true" className="size-4 text-foreground" />
                  <span className="ml-1.5 text-sm font-medium text-foreground">{label}</span>
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
