import type { Metadata } from "next";
import {
  TOOLS_INDEX_DESCRIPTION,
  TOOLS_INDEX_TITLE,
  ToolsScreen,
} from "@/components/tools/ToolsScreen";
import { TOOLS_INDEX_PATH } from "@/lib/tools/paths";
import { siteConfig } from "@/site.config";

const title = `${TOOLS_INDEX_TITLE} — ${siteConfig.siteTitle}`;

export const metadata: Metadata = {
  title,
  description: TOOLS_INDEX_DESCRIPTION,
  alternates: { canonical: TOOLS_INDEX_PATH },
  openGraph: {
    title,
    description: TOOLS_INDEX_DESCRIPTION,
    url: TOOLS_INDEX_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: TOOLS_INDEX_DESCRIPTION,
  },
};

export default function ToolsIndexPage() {
  return <ToolsScreen />;
}
