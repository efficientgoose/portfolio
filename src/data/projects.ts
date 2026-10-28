export type Project = {
  name: string;
  label: string;
  href: string;
  image: string;
  status: "Live" | "Building";
  pinned?: boolean;
  // Four colours for the hover sunburst.
  palette: string[];
  description: string;
};

export const projects: Project[] = [
  {
    name: "Anchora",
    label: "Landing Page",
    href: "https://tryanchora.com",
    image: "/projects/anchora.webp",
    status: "Building",
    pinned: true,
    // Hover sunburst in Anchora's golds.
    palette: ["#fbefcf", "#d9aa50", "#f7e2a6", "#b9862c"],
    description: "A study-abroad planner for students in India, with Atlas, an AI guide that cites its sources.",
  },
  {
    name: "Markiniser",
    label: "Editor",
    href: "https://github.com/efficientgoose/markiniser",
    image: "/projects/markiniser.webp",
    status: "Live",
    // Hover sunburst in Markiniser's lavender and pink.
    palette: ["#ece8ff", "#a99cf5", "#f3c4ea", "#7d6fe0"],
    description: "A Markdown workspace that runs on your machine, with live preview and ⌘K search.",
  },
  {
    name: "Serene",
    label: "Dashboard",
    href: "https://serene-journal.vercel.app",
    image: "/projects/serene.webp",
    status: "Live",
    // Hover sunburst in Serene's cream, sage and leaf orange.
    palette: ["#f3efe6", "#c9d4b8", "#e9a873", "#8fa77f"],
    description: "A calm journal and tracker for mood, anxiety, habits and weekly reviews.",
  },
];
