import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MacAppearance, ThemeId } from "@/lib/themes/types";

export type WelcomeMode = "full" | "compact";

/** Terminal welcome banner: edit `content/ascii-banner.txt` (omit or empty file for no banner). */
function loadAsciiBannerFromFile(): string | undefined {
  try {
    const raw = readFileSync(
      join(process.cwd(), "content", "ascii-banner.txt"),
      "utf-8"
    ).trim();
    return raw.length > 0 ? raw : undefined;
  } catch {
    return undefined;
  }
}

export interface MenuItem {
  label: string;
  href?: string;
  external?: boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  /** When set, appears as one top-level bar item that navigates directly (no dropdown). */
  href?: string;
  external?: boolean;
  /** Dropdown rows; omit or use [] when `href` is set. */
  items: MenuItem[];
}

export interface SiteConfig {
  /** Visual theme for window chrome, menu bar, and desktop tokens */
  defaultTheme: ThemeId;
  /** Used only when `defaultTheme` is macOS (SSR + first paint); ignored for other themes */
  defaultMacAppearance: MacAppearance;
  siteTitle: string;
  menuAppName: string;
  hostname: string;
  shellUser: string;
  tagline: string;
  canonicalUrl: string;
  welcomeMode: WelcomeMode;
  /** When false, ASCII banner from `ascii-banner.txt` is omitted (default true). */
  welcomeShowAsciiBanner?: boolean;
  /** When false, interactive command catalog is omitted in full mode (default true). Ignored when `welcomeMode` is `compact`. */
  welcomeShowCommandCatalog?: boolean;
  /** Line shown above the command list (default: “Available commands…”). */
  welcomeCatalogIntro?: string;
  /** One-line MOTD lines shown above the command catalog */
  motdLines: string[];
  /** Set by `content/ascii-banner.txt` at build time; optional; very wide art may scroll on small screens */
  asciiBanner?: string;
  bio: string;
  skills: string[];
  menus: MenuCategory[];
  links: {
    github: string;
    linkedin: string;
    email?: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const siteConfig: SiteConfig = {
  defaultTheme: "win95",
  defaultMacAppearance: "dark",
  siteTitle: "Zain Ali",
  menuAppName: "Terminal",
  hostname: "zainali.me",
  shellUser: "guest",
  tagline: "Personal site",
  canonicalUrl: "https://zainali.me",
  welcomeMode: "full",
  welcomeShowAsciiBanner: true,
  welcomeShowCommandCatalog: true,
  welcomeCatalogIntro: "Available commands (also try `help`):",
  motdLines: [
    "Welcome. Type `help` for available commands.",
    "Tip: Tab completes command names · ↑/↓ history · Ctrl+L clears screen",
  ],
  asciiBanner: loadAsciiBannerFromFile(),
  bio: "Software Engineer",
  skills: [
    "Java",
    "Spring Boot",
    "Microservices",
    "Distributed systems",
    "Kafka",
    "Kubernetes",
    "PCF",
    "Oracle",
    "Cosmos DB",
    "Postman",
    "React",
    "TypeScript",
    "Python",
  ],
  menus: [
    {
      id: "projects",
      label: "Projects",
      items: [
        { label: "Desktop", href: "/" },
        { label: "Projects", href: "/projects/" },
      ],
    },
    {
      id: "about",
      label: "About",
      href: "/about/",
      items: [],
    },
    {
      id: "links",
      label: "Links",
      items: [
        {
          label: "GitHub",
          href: "https://github.com/zain08816",
          external: true,
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/zain08816/",
          external: true,
        },
      ],
    },
  ],
  links: {
    github: "https://github.com/zain08816",
    linkedin: "https://www.linkedin.com/in/zain08816/",
  },
  seo: {
    title: "Hi, I'm Zain",
    description:
      "Zain Ali — Software Engineer. An interactive desktop portfolio with a terminal, themed windows, and a few easter eggs.",
  },
};
