import type { CommandDef } from "@/lib/shell/types";

export const stackCmd: CommandDef = {
  name: "stack",
  category: "portfolio",
  summary: "Show this site's tech stack",
  usage: "stack",
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: ["usage: stack"],
        stderr: [],
        exitCode: 0,
      };
    }

    return {
      stdout: [
        "Stack used by this site:",
        "",
        "  Framework  Next.js (App Router) + React",
        "  Language   TypeScript",
        "  UI         CSS Modules + global theme styles",
        "  Terminal   Custom shell parser, command registry, tab completion",
        "  Themes     win95, system7, macos",
      ],
      stderr: [],
      exitCode: 0,
    };
  },
};
