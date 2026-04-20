import type { CommandDef } from "@/lib/shell/types";

export function buildWelcomeCommand(): CommandDef {
  return {
    name: "welcome",
    aliases: ["motd", "intro"],
    category: "session",
    summary: "Reprint intro banner and MOTD",
    usage: "welcome",
    run(_argv, opts) {
      if (opts.help) {
        return {
          stdout: ["usage: welcome"],
          stderr: [],
          exitCode: 0,
        };
      }

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        action: "welcome",
      };
    },
  };
}
