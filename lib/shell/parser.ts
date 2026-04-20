import type { ParsedOpts } from "./types";

/** Split input like a POSIX shell (basic): supports ' and " quotes */
export function splitArgv(input: string): string[] {
  const result: string[] = [];
  let cur = "";
  let quote: "'" | '"' | null = null;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quote) {
      if (c === quote) {
        quote = null;
      } else {
        cur += c;
      }
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      continue;
    }
    if (c === "\\" && i + 1 < input.length && input[i + 1] === " ") {
      cur += " ";
      i++;
      continue;
    }
    if (c === " " || c === "\t" || c === "\n") {
      if (cur.length) {
        result.push(cur);
        cur = "";
      }
      continue;
    }
    cur += c;
  }
  if (cur.length) result.push(cur);
  return result;
}

/**
 * GNU-ish option parse: after command name, collects -abc, --long, and positionals.
 * Supports `--` to end options.
 */
export function parseOpts(argv: string[]): ParsedOpts {
  const flags = new Set<string>();
  const positional: string[] = [];
  let i = 0;
  let help = false;
  let version = false;

  const setLong = (name: string) => {
    if (name === "help") help = true;
    if (name === "version") version = true;
    flags.add(`--${name}`);
  };

  loop: while (i < argv.length) {
    const arg = argv[i];
    if (arg === "--") {
      i++;
      break;
    }
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=", 2);
      if (eq !== -1) {
        const name = arg.slice(2, eq);
        setLong(name);
        positional.push(arg.slice(eq + 1));
        i++;
        continue;
      }
      setLong(arg.slice(2));
      i++;
      continue;
    }
    if (arg.startsWith("-") && arg !== "-") {
      const rest = arg.slice(1);
      if (rest.length === 0) {
        positional.push(arg);
        i++;
        continue;
      }
      for (const ch of rest) {
        if (ch === "h") {
          help = true;
          flags.add("-h");
        } else if (ch === "v") {
          version = true;
          flags.add("-v");
        } else {
          flags.add(`-${ch}`);
        }
      }
      i++;
      continue;
    }
    break loop;
  }

  while (i < argv.length) {
    positional.push(argv[i]);
    i++;
  }

  return { flags, positional, help, version };
}

export function unknownOptionMessage(arg: string, short: boolean): string {
  if (short) {
    return `invalid option -- '${arg}'`;
  }
  return `unrecognized option '${arg}'`;
}
