import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Inspiration } from "./types";

const inspirationsDir = path.join(process.cwd(), "content/inspirations");

export async function loadInspirationFromFile(
  filePath: string
): Promise<Inspiration> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const slug = String(
    data.slug ?? path.basename(filePath, path.extname(filePath))
  );
  const bodyNote = content.trim();
  return {
    slug,
    title: String(data.title ?? slug),
    source: String(data.source ?? ""),
    href: String(data.href ?? ""),
    note: String(data.note ?? bodyNote),
    date: data.date ? String(data.date) : "",
    sourcePath: filePath,
  };
}

export async function getAllInspirations(): Promise<Inspiration[]> {
  if (!fs.existsSync(inspirationsDir)) return [];
  const entries = fs.readdirSync(inspirationsDir);
  const files = entries.filter((f) => /\.mdx?$/.test(f));
  const inspirations = await Promise.all(
    files.map((f) => loadInspirationFromFile(path.join(inspirationsDir, f)))
  );
  return inspirations.sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    return a.title.localeCompare(b.title);
  });
}
