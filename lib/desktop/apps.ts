export type DesktopAppId =
  | "terminal"
  | "projects"
  | "essays"
  | "inspirations"
  | "about"
  | "tools";

export const DESKTOP_APPS: DesktopAppId[] = [
  "terminal",
  "projects",
  "essays",
  "inspirations",
  "about",
  "tools",
];

export type WindowLayoutMode = "normal" | "minimized" | "maximized";
