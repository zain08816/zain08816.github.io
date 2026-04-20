import type { CommandDef } from "@/lib/shell/types";
import {
  isCommandVisibleInCatalog,
  renderCommandTable,
} from "@/lib/shell/formatCommandList";

const USAGE = "help [--hidden] [COMMAND]";

export function buildHelpCommand(
  getAllCommands: () => CommandDef[]
): CommandDef {
  return {
    name: "help",
    aliases: ["man"],
    category: "session",
    summary: "Print command catalog",
    usage: USAGE,
    complete(argv) {
      const partial = argv[argv.length - 1] ?? "";
      const prior = argv.slice(1, -1);
      const includeHidden = prior.some(
        (a) => a === "--hidden" || a === "--all" || a === "-a"
      );
      const cmds = getAllCommands();
      const visible = includeHidden
        ? cmds
        : cmds.filter(isCommandVisibleInCatalog);

      if (partial.startsWith("-")) {
        return ["--hidden", "--all", "--help", "-h"];
      }

      // Only one command name makes sense; if the user already typed one,
      // offer nothing further.
      const alreadyNamed = prior.some((a) =>
        visible.some((c) => c.name === a || c.aliases?.includes(a))
      );
      return alreadyNamed ? [] : visible.map((c) => c.name);
    },
    run(_argv, opts) {
      if (opts.help) {
        return {
          stdout: [`usage: ${USAGE}`],
          stderr: [],
          exitCode: 0,
        };
      }

      const includeHidden =
        opts.flags.has("--hidden") ||
        opts.flags.has("--all") ||
        opts.flags.has("-a");

      const allCommands = getAllCommands();
      const catalog = includeHidden
        ? allCommands
        : allCommands.filter(isCommandVisibleInCatalog);

      const target = opts.positional[0];
      if (target) {
        const cmd = catalog.find(
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

      const header = includeHidden
        ? "Available commands (including hidden):"
        : "Available commands:";

      return {
        stdout: [
          header,
          "",
          ...renderCommandTable(catalog, { includeHidden }),
        ],
        stderr: [],
        exitCode: 0,
      };
    },
  };
}
