import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "@/lib/projects/loadProjects";
import type { Essay } from "./types";

const essaysDir = path.join(process.cwd(), "content/essays");

export async function loadEssayFromFile(filePath: string): Promise<Essay> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const slug = String(
    data.slug ?? path.basename(filePath, path.extname(filePath))
  );
  const htmlBody = await markdownToHtml(content.trim());
  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    date: data.date ? String(data.date) : "",
    htmlBody,
    sourcePath: filePath,
  };
}

export async function getAllEssays(): Promise<Essay[]> {
  if (!fs.existsSync(essaysDir)) return [];
  const entries = fs.readdirSync(essaysDir);
  const files = entries.filter((f) => /\.mdx?$/.test(f));
  const essays = await Promise.all(
    files.map((f) => loadEssayFromFile(path.join(essaysDir, f)))
  );
  return essays.sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    return a.title.localeCompare(b.title);
  });
}
