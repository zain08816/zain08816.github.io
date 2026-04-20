import type { CommandDef } from "@/lib/shell/types";

const FORTUNES = [
  "First, make it work. Then make it fast. Then make it pretty.",
  "The bug is where you least expect, and exactly where you left it.",
  "Small commits, clear intent, calm deploys.",
  "Future you thanks present you for writing the test.",
  "Luck is just prepared code meeting real traffic.",
];

export const fortuneCmd: CommandDef = {
  name: "fortune",
  category: "fun",
  hidden: true,
  summary: "Print a random coding fortune",
  usage: "fortune",
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: ["usage: fortune"],
        stderr: [],
        exitCode: 0,
      };
    }

    const line = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    return {
      stdout: [line],
      stderr: [],
      exitCode: 0,
    };
  },
};
