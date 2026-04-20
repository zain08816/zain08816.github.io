import type { CommandDef } from "./types";

const CATEGORY_LABEL: Record<string, string> = {
  navigation: "Navigation",
  portfolio: "Portfolio",
  links: "Links",
  session: "Session",
  system: "System",
  fun: "Fun",
};

const CATEGORY_ORDER = [
  "navigation",
  "portfolio",
  "links",
  "session",
  "system",
  "fun",
];

export interface FormattedRow {
  kind: "heading" | "command";
  /** For headings: localized category label. For commands: command name. */
  text: string;
  summary?: string;
}

export function isCommandVisibleInCatalog(cmd: CommandDef): boolean {
  return cmd.hidden !== true;
}

/**
 * Source of truth for both the SSR welcome catalog and the runtime `help`
 * output. Returns structured rows so consumers can render or align them
 * however they like (no fragile re-parsing of pre-formatted text).
 */
export function formatCommandList(commands: CommandDef[]): FormattedRow[] {
  const byCat = new Map<string, CommandDef[]>();
  for (const cmd of commands) {
    if (!isCommandVisibleInCatalog(cmd)) continue;
    const list = byCat.get(cmd.category) ?? [];
    list.push(cmd);
    byCat.set(cmd.category, list);
  }

  const rows: FormattedRow[] = [];
  for (const cat of CATEGORY_ORDER) {
    const group = byCat.get(cat as CommandDef["category"]);
    if (!group?.length) continue;
    rows.push({ kind: "heading", text: CATEGORY_LABEL[cat] ?? cat });
    for (const cmd of group.sort((a, b) => a.name.localeCompare(b.name))) {
      rows.push({ kind: "command", text: cmd.name, summary: cmd.summary });
    }
  }
  return rows;
}

/** Padded command column width; matches `help` and welcome command rows. */
export function commandNameColumnWidth(commands: CommandDef[]): number {
  const visible = commands.filter(isCommandVisibleInCatalog);
  if (visible.length === 0) return 12;
  return Math.min(
    Math.max(12, ...visible.map((c) => c.name.length)),
    24
  );
}

/** Plain-text catalog (monospace aligned) for the `help` builtin. */
export function renderCommandTable(commands: CommandDef[]): string[] {
  const rows = formatCommandList(commands);
  const maxLen = commandNameColumnWidth(commands);
  return rows.map((row) => {
    if (row.kind === "heading") return `[${row.text}]`;
    const pad = row.text.padEnd(maxLen);
    return `  ${pad}  ${row.summary ?? ""}`;
  });
}
