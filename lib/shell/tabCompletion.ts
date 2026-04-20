import type { ArgSpec, CommandDef, ShellContext } from "./types";
import { splitArgv } from "./parser";

/** Universal flags the argv parser honors for every command. */
const UNIVERSAL_FLAGS = ["--help", "-h"] as const;

function resolveArgSpec(
  spec: ArgSpec | undefined,
  argv: string[],
  ctx: ShellContext
): string[] {
  if (!spec) return [];
  if (typeof spec === "function") return spec(argv, ctx);
  return [...spec];
}

/**
 * Derive completion candidates from a command's declarative `args`, with
 * sensible defaults: `--help` / `-h` are always offered when the user is
 * completing a flag, even for commands that declare no args at all.
 */
function deriveCandidates(
  cmd: CommandDef,
  argv: string[],
  ctx: ShellContext
): string[] {
  const partial = argv[argv.length - 1] ?? "";
  const argIdx = argv.length - 2;
  const declared = resolveArgSpec(cmd.args?.[argIdx], argv, ctx);

  if (partial.startsWith("-")) {
    const declaredFlags = declared.filter((c) => c.startsWith("-"));
    return Array.from(new Set([...declaredFlags, ...UNIVERSAL_FLAGS]));
  }

  // Empty partial → show everything declared at this position; otherwise
  // exclude flags since the user is clearly typing a positional value.
  return partial === ""
    ? declared
    : declared.filter((c) => !c.startsWith("-"));
}

/** If the line ends with whitespace, treat an empty arg as the final token (like bash completion). */
export function splitForCompletion(line: string): string[] {
  const ends = /\s$/.test(line);
  const base = splitArgv(line.trimEnd());
  if (ends) return [...base, ""];
  return base;
}

export function longestCommonPrefix(strs: string[]): string {
  if (!strs.length) return "";
  let pref = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(pref)) {
      pref = pref.slice(0, -1);
      if (!pref) return "";
    }
  }
  return pref;
}

/**
 * The "slot" that Tab is completing:
 *   <stem><candidate><suffix>
 *
 * `stem` is the text that stays put, `candidates` are the alternatives the
 * caller can cycle through, and `suffix` is appended after the chosen
 * candidate (e.g. a space after a command name).
 */
export interface CompletionSlot {
  stem: string;
  candidates: string[];
  suffix: string;
}

/**
 * Compute the completion slot for the current input, or null if nothing to do.
 *
 * The caller decides cycling UX — this function just returns the set of
 * candidates in a stable order and the stem/suffix needed to rebuild the line.
 */
export function computeCompletionSlot(
  input: string,
  primaryNames: string[],
  byName: Map<string, CommandDef>,
  ctx: ShellContext
): CompletionSlot | null {
  const parts = splitForCompletion(input);
  if (!parts.length) return null;

  if (parts.length === 1) {
    const partial = parts[0];
    if (partial === "") return null;
    const pl = partial.toLowerCase();
    const matches = primaryNames.filter((n) => n.startsWith(pl));
    if (!matches.length) return null;
    return { stem: "", candidates: matches, suffix: " " };
  }

  const cmdName = parts[0].toLowerCase();
  const cmdDef = byName.get(cmdName);
  if (!cmdDef) return null;

  const candidates = cmdDef.complete
    ? cmdDef.complete(parts, ctx)
    : deriveCandidates(cmdDef, parts, ctx);
  if (!candidates.length) return null;

  const partial = parts[parts.length - 1];
  const pl = partial.toLowerCase();
  const seen = new Set<string>();
  const matches: string[] = [];
  for (const c of candidates) {
    if (!c.toLowerCase().startsWith(pl)) continue;
    if (seen.has(c)) continue;
    seen.add(c);
    matches.push(c);
  }
  if (!matches.length) return null;

  const head = parts.slice(0, -1).join(" ");
  return { stem: `${head} `, candidates: matches, suffix: "" };
}
