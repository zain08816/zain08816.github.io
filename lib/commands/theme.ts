import type { CommandDef } from "@/lib/shell/types";
import { THEME_OPTIONS } from "@/lib/themes/constants";
import { isMacAppearance, isThemeId } from "@/lib/themes/types";

const THEME_IDS = THEME_OPTIONS.map((t) => t.id).join(", ");

export const themeCmd: CommandDef = {
  name: "theme",
  category: "system",
  summary: "View or switch desktop theme",
  usage: "theme [list|<theme>|macos <light|dark>|appearance <light|dark>]",
  run(_argv, opts, ctx) {
    if (opts.help) {
      return {
        stdout: [
          "usage: theme [list|<theme>|macos <light|dark>|appearance <light|dark>]",
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    const [first, second, third] = opts.positional;

    if (!first) {
      const lines = [
        `Current theme: ${ctx.theme}`,
        `Themes: ${THEME_IDS}`,
      ];
      if (ctx.theme === "macos") {
        lines.push(`macOS appearance: ${ctx.macAppearance}`);
      }
      lines.push("Use `theme list` for labels.");
      return { stdout: lines, stderr: [], exitCode: 0 };
    }

    if (first === "list" && !second) {
      return {
        stdout: [
          "Available themes:",
          ...THEME_OPTIONS.map((opt) => `  ${opt.id.padEnd(8)} ${opt.label}`),
          "",
          "macos supports appearance: light | dark",
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    if (first === "appearance") {
      if (!second || third || !isMacAppearance(second)) {
        return {
          stdout: [],
          stderr: ["theme: appearance must be 'light' or 'dark'."],
          exitCode: 1,
        };
      }
      ctx.setMacAppearance(second);
      return {
        stdout: [
          `macOS appearance set to: ${second}`,
          ctx.theme === "macos"
            ? "Applied to active macOS theme."
            : "Preference saved. Switch to `macos` theme to see it.",
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    if (first === "macos" && second) {
      if (third || !isMacAppearance(second)) {
        return {
          stdout: [],
          stderr: ["theme: usage: theme macos <light|dark>"],
          exitCode: 1,
        };
      }
      ctx.setTheme("macos");
      ctx.setMacAppearance(second);
      return {
        stdout: [`Theme set to: macos (${second})`],
        stderr: [],
        exitCode: 0,
      };
    }

    if (isThemeId(first) && !second) {
      ctx.setTheme(first);
      return {
        stdout: [`Theme set to: ${first}`],
        stderr: [],
        exitCode: 0,
      };
    }

    return {
      stdout: [],
      stderr: [
        `theme: unknown option '${opts.positional.join(" ")}'.`,
        `theme: try one of: ${THEME_IDS}`,
      ],
      exitCode: 1,
    };
  },
};
