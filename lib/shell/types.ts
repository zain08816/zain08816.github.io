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

export interface CommandDef {
  name: string;
  aliases?: string[];
  /** Omits command from welcome/help catalogs and first-token completion. */
  hidden?: boolean;
  category: CommandCategory;
  summary: string;
  usage: string;
  run: RunHandler;
  /** Optional completion for argv after command name */
  complete?: (argv: string[], ctx: ShellContext) => string[];
}
