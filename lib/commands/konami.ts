import type { CommandDef } from "@/lib/shell/types";
import {
  KONAMI_EFFECT_IDS,
  type KonamiTriggerDetail,
} from "@/lib/konami/effects";

const USAGE = "konami [effect|--list|--random]";

function dispatch(detail: KonamiTriggerDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<KonamiTriggerDetail>("konami:trigger", { detail })
  );
}

export const konamiCmd: CommandDef = {
  name: "konami",
  aliases: ["kc"],
  category: "fun",
  hidden: true,
  summary: "Trigger a Konami code effect",
  usage: USAGE,
  args: [[...KONAMI_EFFECT_IDS, "--list", "--random"]],
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: [
          `usage: ${USAGE}`,
          "",
          "Manually trigger an effect from the Konami code pool without",
          "typing the full up-up-down-down-left-right-left-right-B-A sequence.",
          "",
          "Options:",
          "  -h, --help   Show this message.",
          "  --list       List available effects and exit.",
          "  --random     Trigger a random effect (default when no effect given).",
          "",
          "Effects:",
          ...KONAMI_EFFECT_IDS.map((id) => `  ${id}`),
          "",
          "Examples:",
          "  konami                 # roll a random effect",
          "  konami crt-glitch      # trigger a specific effect",
          "  konami --list          # show effect ids",
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    if (opts.flags.has("--list")) {
      return {
        stdout: [
          "Available effects:",
          ...KONAMI_EFFECT_IDS.map((id) => `  ${id}`),
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    const requested = opts.positional[0];

    if (requested && opts.positional.length > 1) {
      return {
        stdout: [],
        stderr: [`konami: unexpected extra arguments`, `usage: ${USAGE}`],
        exitCode: 1,
      };
    }

    if (!requested || opts.flags.has("--random")) {
      dispatch({});
      return {
        stdout: ["[konami] rolling a random effect..."],
        stderr: [],
        exitCode: 0,
      };
    }

    const allowed = KONAMI_EFFECT_IDS as readonly string[];
    if (!allowed.includes(requested)) {
      return {
        stdout: [],
        stderr: [
          `konami: unknown effect '${requested}'`,
          `konami: try \`konami --list\``,
        ],
        exitCode: 1,
      };
    }

    dispatch({ effectId: requested });
    return {
      stdout: [`[konami] triggering: ${requested}`],
      stderr: [],
      exitCode: 0,
    };
  },
};
