import type { CommandDef, ShellContext } from "./types";
import { splitArgv } from "./parser";

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
 * Returns updated input after Tab, or null if nothing to apply.
 */
export function tabCompleteLine(
  input: string,
  primaryNames: string[],
  byName: Map<string, CommandDef>,
  ctx: ShellContext
): string | null {
  const parts = splitForCompletion(input);
  if (!parts.length) return null;

  if (parts.length === 1) {
    const partial = parts[0];
    if (partial === "") return null;
    const pl = partial.toLowerCase();
    const matches = primaryNames.filter((n) => n.startsWith(pl));
    if (matches.length === 1) return `${matches[0]} `;
    if (matches.length > 1) return longestCommonPrefix(matches);
    return null;
  }

  const cmdName = parts[0].toLowerCase();
  const cmdDef = byName.get(cmdName);
  if (!cmdDef?.complete) return null;

  const candidates = cmdDef.complete(parts, ctx);
  const partial = parts[parts.length - 1];
  const matches = candidates.filter((c) => c.startsWith(partial));

  if (matches.length === 1) {
    const next = [...parts.slice(0, -1), matches[0]];
    return next.join(" ");
  }
  if (matches.length > 1) {
    const pref = longestCommonPrefix(matches);
    const next = [...parts.slice(0, -1), pref];
    return next.join(" ");
  }
  return null;
}
