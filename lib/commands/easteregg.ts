import type { CommandDef } from "@/lib/shell/types";

const EGGS = [
  "Easter egg: the Konami code gives a random surprise.",
  "Easter egg: hidden commands don't show up in `help`.",
  "Easter egg: try `matrix --redpill`.",
  "Easter egg: `sl` still rides the rails here.",
  "Easter egg: fortune favors the persistent.",
];

export const eastereggCmd: CommandDef = {
  name: "easteregg",
  aliases: ["egg"],
  category: "fun",
  hidden: true,
  summary: "Reveal a hidden hint",
  usage: "easteregg",
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: ["usage: easteregg"],
        stderr: [],
        exitCode: 0,
      };
    }

    const egg = EGGS[Math.floor(Math.random() * EGGS.length)];
    return {
      stdout: [egg],
      stderr: [],
      exitCode: 0,
    };
  },
};
