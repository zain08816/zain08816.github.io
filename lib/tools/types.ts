export type ToolCategoryId =
  | "json"
  | "encode"
  | "web"
  | "text"
  | "time"
  | "data";

export interface ToolCategory {
  id: ToolCategoryId;
  label: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: "json", label: "JSON" },
  { id: "encode", label: "Encode" },
  { id: "web", label: "Web" },
  { id: "text", label: "Text" },
  { id: "time", label: "Time" },
  { id: "data", label: "Data" },
];

export type ToolResult =
  | { ok: true; output: string }
  | { ok: false; error: string };

export interface ToolDef {
  id: string;
  name: string;
  category: ToolCategoryId;
  blurb: string;
  placeholder: string;
  sample: string;
  actionLabel: string;
  /** Produces output without reading the input box. */
  generates?: boolean;
  run: (input: string) => Promise<ToolResult>;
}

export function toolErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return "Could not run that tool";
}

export function runSync(fn: () => string): ToolResult {
  try {
    return { ok: true, output: fn() };
  } catch (err) {
    return { ok: false, error: toolErrorMessage(err) };
  }
}
