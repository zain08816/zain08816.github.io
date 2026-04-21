import type { CommandDef } from "@/lib/shell/types";

const FINISHERS = [
  "Chai complete. Productivity +15%.",
  "Cup served. Time to ship.",
  "Spices optimized. Compiler satisfied.",
];

export const chaiCmd: CommandDef = {
  name: "chai",
  aliases: ["brew"],
  category: "fun",
  hidden: true,
  summary: "Brew virtual chai",
  usage: "chai",
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: ["usage: chai"],
        stderr: [],
        exitCode: 0,
      };
    }

    const finisher = FINISHERS[Math.floor(Math.random() * FINISHERS.length)];
    return {
      stdout: [
        "[#....] Crushing cardamom...",
        "[##...] Simmering milk...",
        "[###..] Steeping black tea...",
        "[####.] Debugging while stirring...",
        "[#####] " + finisher,
      ],
      stderr: [],
      exitCode: 0,
    };
  },
};
