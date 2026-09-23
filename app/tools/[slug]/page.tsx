import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolsScreen } from "@/components/tools/ToolsScreen";
import { findTool, TOOLS } from "@/lib/tools/catalog";
import { toolPath } from "@/lib/tools/paths";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) return {};
  const title = `${tool.name} — ${siteConfig.siteTitle}`;
  const description = `${tool.blurb} Runs locally in your browser.`;
  const path = toolPath(tool.id);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) notFound();
  return <ToolsScreen toolId={tool.id} />;
}
