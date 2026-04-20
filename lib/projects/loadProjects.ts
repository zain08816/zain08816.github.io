import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Project, ProjectLink } from "./types";

const projectsDir = path.join(process.cwd(), "content/projects");

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml)
    .process(markdown);
  return String(file);
}

function parseLinks(raw: unknown): ProjectLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is { label: string; href: string } =>
      Boolean(x && typeof x === "object" && "href" in x && "label" in x)
    )
    .map((x) => ({ label: String(x.label), href: String(x.href) }));
}

export async function loadProjectFromFile(filePath: string): Promise<Project> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? path.basename(filePath, path.extname(filePath)));
  const htmlBody = await markdownToHtml(content.trim());
  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    links: parseLinks(data.links),
    htmlBody,
    sourcePath: filePath,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  if (!fs.existsSync(projectsDir)) return [];
  const entries = fs.readdirSync(projectsDir);
  const files = entries.filter((f) => /\.mdx?$/.test(f));
  const projects = await Promise.all(
    files.map((f) => loadProjectFromFile(path.join(projectsDir, f)))
  );
  return projects.sort((a, b) => a.title.localeCompare(b.title));
}

export function getProjectSlugs(projects: Project[]): string[] {
  return projects.map((p) => p.slug);
}
