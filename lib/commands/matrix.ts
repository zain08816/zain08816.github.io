import type { CommandDef } from "@/lib/shell/types";

type MatrixVariant = "default" | "red" | "blue";

interface MatrixMessage {
  title: string;
  sub?: string;
  choices?: { cmd: string; desc: string }[];
}

function triggerRain(
  variant: MatrixVariant,
  message?: MatrixMessage,
  durationMs?: number
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("matrix:rain", {
      detail: { variant, message, durationMs },
    })
  );
}

export const matrixCmd: CommandDef = {
  name: "matrix",
  category: "fun",
  hidden: true,
  summary: "Enter the matrix stream",
  usage: "matrix [--redpill|--bluepill]",
  args: [["--redpill", "--bluepill"]],
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: [
          "usage: matrix [--redpill|--bluepill]",
          "",
          "  --redpill   See how deep the rabbit hole goes.",
          "  --bluepill  Wake up and believe whatever you want.",
          "",
          "No flag? The system decides for you.",
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    const red = opts.flags.has("--redpill");
    const blue = opts.flags.has("--bluepill");

    if (red && blue) {
      return {
        stdout: [],
        stderr: ["matrix: you cannot take both pills. this isn't a buffet."],
        exitCode: 1,
      };
    }

    const boot = [
      "[ SYS ] initializing construct...",
      "[ SYS ] loading operator uplink...",
      "[ OK  ] neural handshake established",
      "[ OK  ] decrypting datastream",
      "",
      "",
    ];

    if (red) {
      triggerRain(
        "red",
        {
          title: "WELCOME TO THE REAL WORLD",
          sub: "It's not as clean as the simulation. But at least it's yours.",
        },
        12000
      );
      return {
        stdout: [
          ...boot,
          "[ !! ] pill accepted. unloading simulation layer...",
          "[ !! ] stripping consensus reality...",
          "[ !! ] WARNING: this cannot be undone",
          "",
          "You feel the world dissolve at the edges.",
          "The green rain slows. The characters resolve.",
          "Behind every surface: just code.",
          "",
          "Welcome to the real world.",
          "It's not as clean as the simulation.",
          "But at least it's yours.",
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    if (blue) {
      triggerRain(
        "blue",
        {
          title: "IGNORANCE IS BLISS",
          sub: "See you tomorrow. And the day after. And the day after that.",
        },
        10000
      );
      return {
        stdout: [
          ...boot,
          "[ OK ] pill accepted. restoring comfort layer...",
          "[ OK ] re-seeding pleasant memories...",
          "[ OK ] disabling curiosity subroutine...",
          "",
          "The rain fades. The hum of the simulation fills your ears.",
          "You feel warm. Safe. Uncurious.",
          "",
          "Ignorance is bliss.",
          "See you tomorrow. And the day after. And the day after that.",
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    triggerRain(
      "default",
      {
        title: "WAKE UP",
        sub: "Two pills. One choice.",
        choices: [
          {
            cmd: "matrix --redpill",
            desc: "See how deep the rabbit hole goes.",
          },
          {
            cmd: "matrix --bluepill",
            desc: "Wake up and believe whatever you want.",
          },
        ],
      },
      9000
    );
    return {
      stdout: [
        ...boot,
        "Two pills. One choice.",
        "",
        "  matrix --redpill    See how deep the rabbit hole goes.",
        "  matrix --bluepill   Wake up and believe whatever you want.",
        "",
        "The offer won't be on the table forever.",
      ],
      stderr: [],
      exitCode: 0,
    };
  },
};
