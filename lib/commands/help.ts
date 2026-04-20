import type { CommandDef } from "@/lib/shell/types";
import {
  isCommandVisibleInCatalog,
  renderCommandTable,
} from "@/lib/shell/formatCommandList";

export function buildHelpCommand(
  getAllCommands: () => CommandDef[]
): CommandDef {
  return {
    name: "help",
    aliases: ["man"],
    category: "session",
    summary: "Print command catalog",
    usage: "help [COMMAND]",
    run(_argv, opts) {
      const allCommands = getAllCommands();
      const visibleCommands = allCommands.filter(isCommandVisibleInCatalog);
      if (opts.help) {
        return {
          stdout: ["usage: help [COMMAND]"],
          stderr: [],
          exitCode: 0,
        };
      }
      const target = opts.positional[0];
      if (target) {
        const cmd = visibleCommands.find(
          (c) => c.name === target || c.aliases?.includes(target)
        );
        if (!cmd) {
          return {
            stdout: [],
            stderr: [`help: no help topics match '${target}'. Try 'help'.`],
            exitCode: 1,
          };
        }
        return {
          stdout: [`${cmd.name} — ${cmd.summary}`, "", `usage: ${cmd.usage}`],
          stderr: [],
          exitCode: 0,
        };
      }

      return {
        stdout: [
          "Available commands:",
          "",
          ...renderCommandTable(visibleCommands),
        ],
        stderr: [],
        exitCode: 0,
      };
    },
  };
}
