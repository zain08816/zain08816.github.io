import type { Project } from "@/lib/projects/types";

export const HOME = "/home/guest";
export const PROJ_ROOT = "/home/guest/projects";

/** Normalize "~" / relative segments against cwd. Does not validate existence. */
export function resolvePath(cwd: string, target: string): string {
  if (!target || target === "~") return HOME;
  if (target.startsWith("~/")) return resolvePath(HOME, target.slice(2));

  const base = target.startsWith("/") ? "" : cwd;
  const parts = `${base}/${target}`.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return `/${stack.join("/")}`;
}

/** Returns the absolute path for a `cd` target, or null if invalid. */
export function resolveCd(
  cwd: string,
  arg: string,
  projects: Project[]
): string | null {
  const target = (arg ?? "").trim();
  const next = resolvePath(cwd, target).replace(/\/+$/, "") || "/";

  if (next === "/" || next === HOME) return HOME;
  if (next === PROJ_ROOT) return PROJ_ROOT;

  if (next.startsWith(`${PROJ_ROOT}/`)) {
    const slug = next.slice(PROJ_ROOT.length + 1).split("/")[0];
    if (projects.some((p) => p.slug === slug)) return `${PROJ_ROOT}/${slug}`;
  }

  return null;
}

/** What `ls PATH` should show (entry names only, like real ls). */
export function listEntries(
  cwd: string,
  arg: string | undefined,
  projects: Project[]
): { entries: string[] } | { error: string } {
  const target = arg ? resolvePath(cwd, arg).replace(/\/+$/, "") || "/" : cwd;

  if (target === HOME) {
    return { entries: ["projects", "README"] };
  }
  if (target === PROJ_ROOT) {
    return { entries: projects.map((p) => p.slug) };
  }
  if (target.startsWith(`${PROJ_ROOT}/`)) {
    const slug = target.slice(PROJ_ROOT.length + 1).split("/")[0];
    if (projects.some((p) => p.slug === slug)) {
      return { entries: ["README.md"] };
    }
  }
  return { error: `ls: cannot access '${arg ?? target}': No such file or directory` };
}
