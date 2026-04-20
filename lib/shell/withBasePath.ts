/**
 * Prefix paths for GitHub Pages project-site deploys. User-site apex deploy uses "".
 */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${p}`;
}
