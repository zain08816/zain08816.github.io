import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
