import type { CommandDef } from "./types";

const HIDDEN_CATEGORY = "hidden";

const CATEGORY_LABEL: Record<string, string> = {
  navigation: "Navigation",
  portfolio: "Portfolio",
  links: "Links",
  session: "Session",
  system: "System",
  fun: "Fun",
  [HIDDEN_CATEGORY]: "Hidden",
};

const CATEGORY_ORDER = [
  "navigation",
  "portfolio",
  "links",
  "session",
  "system",
  "fun",
];

export interface FormatListOptions {
  /** When true, include hidden commands under a dedicated "Hidden" section. */
  includeHidden?: boolean;
}

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
export function formatCommandList(
  commands: CommandDef[],
  options: FormatListOptions = {}
): FormattedRow[] {
  const { includeHidden = false } = options;
  const byCat = new Map<string, CommandDef[]>();
  for (const cmd of commands) {
    const hidden = cmd.hidden === true;
    if (hidden && !includeHidden) continue;
    const cat = hidden ? HIDDEN_CATEGORY : cmd.category;
    const list = byCat.get(cat) ?? [];
    list.push(cmd);
    byCat.set(cat, list);
  }

  const order = includeHidden
    ? [...CATEGORY_ORDER, HIDDEN_CATEGORY]
    : CATEGORY_ORDER;

  const rows: FormattedRow[] = [];
  for (const cat of order) {
    const group = byCat.get(cat);
    if (!group?.length) continue;
    rows.push({ kind: "heading", text: CATEGORY_LABEL[cat] ?? cat });
    for (const cmd of group.sort((a, b) => a.name.localeCompare(b.name))) {
      rows.push({ kind: "command", text: cmd.name, summary: cmd.summary });
    }
  }
  return rows;
}

/** Padded command column width; matches `help` and welcome command rows. */
export function commandNameColumnWidth(
  commands: CommandDef[],
  options: FormatListOptions = {}
): number {
  const { includeHidden = false } = options;
  const pool = commands.filter(
    (c) => includeHidden || isCommandVisibleInCatalog(c)
  );
  if (pool.length === 0) return 12;
  return Math.min(Math.max(12, ...pool.map((c) => c.name.length)), 24);
}

/** Plain-text catalog (monospace aligned) for the `help` builtin. */
export function renderCommandTable(
  commands: CommandDef[],
  options: FormatListOptions = {}
): string[] {
  const rows = formatCommandList(commands, options);
  const maxLen = commandNameColumnWidth(commands, options);
  return rows.map((row) => {
    if (row.kind === "heading") return `[${row.text}]`;
    const pad = row.text.padEnd(maxLen);
    return `  ${pad}  ${row.summary ?? ""}`;
  });
}
