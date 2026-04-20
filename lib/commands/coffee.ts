import type { CommandDef } from "@/lib/shell/types";

const FINISHERS = [
  "Brew complete. Productivity +15%.",
  "Cup served. Time to ship.",
  "Beans optimized. Compiler satisfied.",
];

export const coffeeCmd: CommandDef = {
  name: "coffee",
  aliases: ["brew"],
  category: "fun",
  hidden: true,
  summary: "Brew virtual coffee",
  usage: "coffee",
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: ["usage: coffee"],
        stderr: [],
        exitCode: 0,
      };
    }

    const finisher = FINISHERS[Math.floor(Math.random() * FINISHERS.length)];
    return {
      stdout: [
        "[#....] Grinding beans...",
        "[##...] Heating water...",
        "[###..] Pour-over in progress...",
        "[####.] Debugging while steeping...",
        "[#####] " + finisher,
      ],
      stderr: [],
      exitCode: 0,
    };
  },
};
