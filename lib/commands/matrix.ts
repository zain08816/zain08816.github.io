import type { CommandDef } from "@/lib/shell/types";

export const matrixCmd: CommandDef = {
  name: "matrix",
  category: "fun",
  hidden: true,
  summary: "Enter the matrix stream",
  usage: "matrix [--redpill|--bluepill]",
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: ["usage: matrix [--redpill|--bluepill]"],
        stderr: [],
        exitCode: 0,
      };
    }

    const red = opts.flags.has("--redpill");
    const blue = opts.flags.has("--bluepill");
    if (red && blue) {
      return {
        stdout: [],
        stderr: ["matrix: choose one path: --redpill or --bluepill."],
        exitCode: 1,
      };
    }

    const ending = red
      ? "Welcome to the real world."
      : blue
        ? "Ignorance is bliss. See you tomorrow."
        : "Wake up, guest.";

    return {
      stdout: [
        "[OK] establishing neural link...",
        "[OK] syncing operator channels...",
        "[OK] decrypting green rain stream...",
        ending,
      ],
      stderr: [],
      exitCode: 0,
    };
  },
};
