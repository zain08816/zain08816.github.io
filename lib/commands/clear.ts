import type { CommandDef } from "@/lib/shell/types";

export const clearCmd: CommandDef = {
  name: "clear",
  aliases: ["cls"],
  category: "session",
  summary: "Clear terminal scrollback",
  usage: "clear",
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: ["usage: clear"],
        stderr: [],
        exitCode: 0,
      };
    }
    return {
      stdout: [],
      stderr: [],
      exitCode: 0,
      action: "clear",
    };
  },
};
