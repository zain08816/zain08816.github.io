import type { ThemeId } from "./types";

/** localStorage key for persisted UI theme */
export const THEME_STORAGE_KEY = "portfolio-theme";

/** localStorage key for macOS light/dark (only used while macOS theme is selected) */
export const MAC_APPEARANCE_STORAGE_KEY = "portfolio-macos-appearance";

export const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
  { id: "win95", label: "Windows 95" },
  { id: "system7", label: "Mac System 7" },
  { id: "macos", label: "macOS" },
];
