import type { SiteConfig } from "@/site.config";
import type { Project } from "@/lib/projects/types";
import type { MacAppearance, ThemeId } from "@/lib/themes/types";

export type CommandCategory =
  | "navigation"
  | "portfolio"
  | "links"
  | "session"
  | "system"
  | "fun";

export interface ParsedOpts {
  flags: Set<string>;
  /** First non-flag after command name */
  positional: string[];
  help: boolean;
  version: boolean;
}

export interface CommandResult {
  stdout: string[];
  stderr: string[];
  exitCode: number;
  /** Side effects handled by the terminal UI */
  action?: "clear" | "welcome";
}

export interface ShellContext {
  site: SiteConfig;
  projects: Project[];
  openUrl: (url: string, sameTab?: boolean) => void;
  theme: ThemeId;
  macAppearance: MacAppearance;
  setTheme: (theme: ThemeId) => void;
  setMacAppearance: (appearance: MacAppearance) => void;
}

export type RunHandler = (
  argv: string[],
  opts: ParsedOpts,
  ctx: ShellContext
) => CommandResult;

/**
 * Declarative completion candidates for a single argv position (0 == first
 * arg after the command name). Either a static list, or a function that can
 * read the already-typed argv/context (e.g. "the second arg depends on the
 * first"). Return flags (`--foo`) and positionals mixed — the completer
 * filters them based on what the user has typed so far.
 */
export type ArgSpec =
  | readonly string[]
  | ((argv: string[], ctx: ShellContext) => string[]);

export interface CommandDef {
  name: string;
  aliases?: string[];
  /** Omits command from welcome/help catalogs and first-token completion. */
  hidden?: boolean;
  category: CommandCategory;
  summary: string;
  usage: string;
  run: RunHandler;
  /**
   * Per-position completion candidates. Index 0 is the first arg after the
   * command name. `--help` / `-h` are always offered automatically when the
   * user is completing a flag.
   */
  args?: readonly ArgSpec[];
  /**
   * Fully custom completer. When defined, it overrides `args` entirely.
   * Use this only for completions that can't be expressed as "per-position
   * list" (e.g. multi-token subcommand trees).
   */
  complete?: (argv: string[], ctx: ShellContext) => string[];
}
