import type { ComponentType } from "react";
import {
  SiApachekafka,
  SiApachespark,
  SiDocker,
  SiGit,
  SiJenkins,
  SiLinux,
  SiMysql,
  SiNextdotjs,
  SiOpenjdk,
  SiPostgresql,
  SiReact,
  SiRedis,
  SiScylladb,
  SiSpringboot,
  SiSupabase,
  SiTypescript,
} from "react-icons/si";
import { Cloud, Network } from "lucide-react";

// `color` is the brand colour each icon takes on hover. Kafka's and Next.js's logos are black and Netty
// has none, so those fall back to the text colour, which stays visible in both themes.
type Skill = { name: string; icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>; color?: string };

export const skillGroups: { title: string; skills: Skill[] }[] = [
  {
    title: "Backend",
    skills: [
      { name: "Java", icon: SiOpenjdk, color: "#ED8B00" },
      { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
      { name: "Netty", icon: Network },
      { name: "Kafka", icon: SiApachekafka },
      { name: "Spark", icon: SiApachespark, color: "#E25A1C" },
      { name: "Redis", icon: SiRedis, color: "#FF4438" },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "ScyllaDB", icon: SiScylladb, color: "#6CD5E7" },
    ],
  },
  {
    title: "Frontend & Product",
    skills: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
    ],
  },
  {
    title: "Infrastructure & Tools",
    skills: [
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "AWS", icon: Cloud, color: "#FF9900" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Jenkins", icon: SiJenkins, color: "#D24939" },
    ],
  },
];

export const skills = skillGroups.flatMap((group) => group.skills);
