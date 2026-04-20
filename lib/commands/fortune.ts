import type { CommandDef } from "@/lib/shell/types";

const FORTUNES = [
  "First, make it work. Then make it fast. Then make it pretty.",
  "The bug is where you least expect, and exactly where you left it.",
  "Small commits, clear intent, calm deploys.",
  "Future you thanks present you for writing the test.",
  "Luck is just prepared code meeting real traffic.",
  "It works on my machine. Ship my machine.",
  "There are two hard things in CS: cache invalidation, naming things, and off-by-one errors.",
  "Any fool can write code a computer understands. Good luck understanding it yourself in six months.",
  "git blame: the original social network.",
  "console.log is still a valid debugging strategy.",
  "The fastest code is the code that never runs.",
  "Always code as if the next person to maintain it knows where you live.",
  "Weeks of coding save hours of planning.",
  "A passing test suite is not proof of correctness. It is proof of imagination.",
  "When in doubt, rebase. When certain, still double-check.",
  "The best feature is the one you don't have to build.",
  "Naming a variable 'temp' is just lying to yourself.",
  "Ship it. Then apologize to future you.",
  "Every great developer you know got there by solving problems they were unqualified to solve.",
  "Sleep is the best debugger.",
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
