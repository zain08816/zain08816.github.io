import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { getAllProjects } from "@/lib/projects/loadProjects";
import { TOOLS } from "@/lib/tools/catalog";
import { TOOLS_INDEX_PATH, toolPath } from "@/lib/tools/paths";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}${TOOLS_INDEX_PATH}`, lastModified: new Date() },
    ...TOOLS.map((tool) => ({
      url: `${base}${toolPath(tool.id)}`,
      lastModified: new Date(),
    })),
    { url: `${base}/projects/`, lastModified: new Date() },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}/`,
      lastModified: new Date(),
    })),
  ];

  return entries;
}
