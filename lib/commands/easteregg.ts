import type { CommandDef } from "@/lib/shell/types";

const EGGS = [
  "Easter egg: the Konami code gives a random surprise.",
  "Easter egg: hidden commands don't show up in `help` (unless you use --hidden).",
  "Easter egg: `matrix` to follow the white rabbit.",
  "Easter egg: `sl` still rides the rails here.",
  "Easter egg: `fortune` favors the persistent.",
  "Easter egg: `chai` is always brewing.",
];

export const eastereggCmd: CommandDef = {
  name: "easteregg",
  aliases: ["egg"],
  category: "fun",
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
