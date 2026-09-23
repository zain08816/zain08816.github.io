import { unescapeHtml } from "./encodeTools";

function withLines(
  input: string,
  transform: (lines: string[]) => string[]
): string {
  const trailing = input.endsWith("\n");
  const lines = input.split(/\r?\n/);
  if (trailing && lines[lines.length - 1] === "") lines.pop();
  const next = transform(lines);
  return next.join("\n") + (trailing ? "\n" : "");
}

export function toUpper(input: string): string {
  return input.toUpperCase();
}

export function toLower(input: string): string {
  return input.toLowerCase();
}

export function trimLines(input: string): string {
  return withLines(input, (lines) => lines.map((line) => line.trim()));
}

export function sortLines(input: string): string {
  return withLines(input, (lines) =>
    [...lines].sort((a, b) => a.localeCompare(b))
  );
}

export function uniqueLines(input: string): string {
  return withLines(input, (lines) => {
    const seen = new Set<string>();
    const next: string[] = [];
    for (const line of lines) {
      if (seen.has(line)) continue;
      seen.add(line);
      next.push(line);
    }
    return next;
  });
}

export function countText(input: string): string {
  const lines = input.length === 0 ? 0 : input.split(/\r?\n/).length;
  const words =
    input.trim().length === 0 ? 0 : input.trim().split(/\s+/).length;
  return [
    `Characters: ${input.length}`,
    `Characters without whitespace: ${input.replace(/\s/g, "").length}`,
    `Words: ${words}`,
    `Lines: ${lines}`,
  ].join("\n");
}

export function stripHtml(input: string): string {
  const withoutTags = input
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "");
  return unescapeHtml(withoutTags);
}
