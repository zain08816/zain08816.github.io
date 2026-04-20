import type { SiteConfig } from "@/site.config";
import type { Project } from "@/lib/projects/types";
import type { CommandDef } from "./types";
import { buildHelpCommand } from "@/lib/commands/help";
import { clearCmd } from "@/lib/commands/clear";
import { about } from "@/lib/commands/about";
import { buildWelcomeCommand } from "@/lib/commands/welcome";
import { themeCmd } from "@/lib/commands/theme";
import { stackCmd } from "@/lib/commands/stack";
import { slCmd } from "@/lib/commands/sl";
import { coffeeCmd } from "@/lib/commands/coffee";
import { eastereggCmd } from "@/lib/commands/easteregg";
import { fortuneCmd } from "@/lib/commands/fortune";
import { matrixCmd } from "@/lib/commands/matrix";
import { konamiCmd } from "@/lib/commands/konami";

export interface RegistryDeps {
  site: SiteConfig;
  projects: Project[];
  getCwd: () => string;
  setCwd: (path: string) => number;
  getHistory: () => string[];
}

/**
 * Build ordered command list; `help` closes over the full list (last).
 *
 * To add a command: create `lib/commands/<name>.ts` exporting a `CommandDef`
 * (or a factory `(deps) => CommandDef` if it needs cwd/history/etc.), import
 * it here, and push it into `cmds` before the `help` line.
 */
export function createShellRegistry(deps: RegistryDeps): CommandDef[] {
  void deps;
  const cmds: CommandDef[] = [
    about,
    stackCmd,
    themeCmd,
    clearCmd,
    slCmd,
    coffeeCmd,
    eastereggCmd,
    fortuneCmd,
    matrixCmd,
    konamiCmd,
    buildWelcomeCommand(),
  ];

  cmds.push(buildHelpCommand(() => cmds));
  return cmds;
}

export function indexCommands(commands: CommandDef[]): Map<string, CommandDef> {
  const map = new Map<string, CommandDef>();
  for (const cmd of commands) {
    map.set(cmd.name, cmd);
    for (const a of cmd.aliases ?? []) {
      map.set(a, cmd);
    }
  }
  return map;
}
