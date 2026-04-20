import type { SiteConfig } from "@/site.config";
import type { CommandDef } from "./types";
import { formatCommandList } from "./formatCommandList";

/** Serializable welcome segments for SSR → Terminal hydration */
export type WelcomeSegment =
  | { kind: "plain"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "row"; command: string; summary: string };

export function buildWelcomeSegments(
  site: SiteConfig,
  commands: CommandDef[]
): WelcomeSegment[] {
  const segments: WelcomeSegment[] = [];

  const showAscii =
    site.welcomeShowAsciiBanner !== false &&
    Boolean(site.asciiBanner?.trim());

  if (showAscii && site.asciiBanner?.trim()) {
    segments.push({ kind: "plain", text: site.asciiBanner });
    /* Blank `<pre>` lines between banner and MOTD */
    segments.push({ kind: "plain", text: "\n\n" });
  }

  for (const line of site.motdLines) {
    segments.push({ kind: "plain", text: line });
  }
  segments.push({ kind: "plain", text: "" });

  const showCatalog =
    site.welcomeMode !== "compact" &&
    site.welcomeShowCommandCatalog !== false;

  if (!showCatalog) {
    return segments;
  }

  const catalogIntro =
    site.welcomeCatalogIntro ??
    "Available commands (also try `help`):";
  segments.push({ kind: "plain", text: catalogIntro });
  segments.push({ kind: "plain", text: "" });

  for (const row of formatCommandList(commands)) {
    if (row.kind === "heading") {
      segments.push({ kind: "heading", text: row.text });
    } else {
      segments.push({
        kind: "row",
        command: row.text,
        summary: row.summary ?? "",
      });
    }
  }

  return segments;
}
