/** Themes with full styling. Future: "windows" | … */
export type ThemeId = "macos" | "win95" | "system7";

/** Only applies when `data-theme="macos"` (ignored for other themes). */
export type MacAppearance = "light" | "dark";

export const DEFAULT_THEME: ThemeId = "win95";

export function isThemeId(value: string): value is ThemeId {
  return value === "macos" || value === "win95" || value === "system7";
}

export function isMacAppearance(value: string): value is MacAppearance {
  return value === "light" || value === "dark";
}
