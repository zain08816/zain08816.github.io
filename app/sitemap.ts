import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { getAllProjects } from "@/lib/projects/loadProjects";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/projects/`, lastModified: new Date() },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}/`,
      lastModified: new Date(),
    })),
  ];

  return entries;
}
