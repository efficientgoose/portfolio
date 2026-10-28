import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        title: "var(--title)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        strong: "var(--strong)",
        "muted-bg": "var(--muted-bg)",
        "muted-bg-hover": "var(--muted-bg-hover)",
        "bg-hover": "var(--bg-hover)",
        "bg-hover-fg": "var(--bg-hover-fg)",
        spot: "var(--spot)",
      },
      fontFamily: {
        sans: ['"Figtree"', '"Segoe UI"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      spacing: {
        4.5: "1.125rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
