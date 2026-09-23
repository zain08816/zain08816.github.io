function describeJson(value: unknown): string {
  if (Array.isArray(value)) {
    const noun = value.length === 1 ? "item" : "items";
    return `array, ${value.length} ${noun}`;
  }
  if (value === null) return "null";
  switch (typeof value) {
    case "object": {
      const count = Object.keys(value).length;
      const noun = count === 1 ? "key" : "keys";
      return `object, ${count} ${noun}`;
    }
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "undefined":
    case "function":
    case "symbol":
    case "bigint":
      return typeof value;
  }
  return typeof value;
}

export function formatJson(input: string): string {
  return JSON.stringify(JSON.parse(input), null, 2);
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

/** Escape so the text can sit inside a JSON string. No surrounding quotes. */
export function escapeJson(input: string): string {
  return JSON.stringify(input).slice(1, -1);
}

/** Reverse of `escapeJson`. Also accepts a quoted JSON string. */
export function unescapeJson(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('"')) {
    const value: unknown = JSON.parse(trimmed);
    if (typeof value !== "string") {
      throw new Error("That JSON value is not a string");
    }
    return value;
  }
  try {
    const value: unknown = JSON.parse(`"${trimmed}"`);
    if (typeof value !== "string") {
      throw new Error("Could not unescape that text");
    }
    return value;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(
        "Could not unescape. Paste escaped text, or a quoted JSON string."
      );
    }
    throw err;
  }
}

/** `JSON.stringify` of the raw text, including surrounding quotes. */
export function stringifyJson(input: string): string {
  return JSON.stringify(input);
}

/**
 * `JSON.parse`. A JSON string is returned as raw text.
 * Objects and arrays are pretty-printed.
 */
export function parseJson(input: string): string {
  const value: unknown = JSON.parse(input);
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

export function validateJson(input: string): string {
  const value: unknown = JSON.parse(input);
  return `Valid JSON (${describeJson(value)}).`;
}
