import type { SiteConfig } from "@/site.config";
import type { Project } from "@/lib/projects/types";
import type { WelcomeSegment } from "@/lib/shell/welcome";
import { DesktopEnvironment } from "./DesktopEnvironment";

export function DesktopShell({
  site,
  projects,
  welcomeSegments,
  welcomeCommandColumnWidth,
}: {
  site: SiteConfig;
  projects: Project[];
  welcomeSegments: WelcomeSegment[];
  welcomeCommandColumnWidth: number;
}) {
  return (
    <DesktopEnvironment
      site={site}
      projects={projects}
      welcomeSegments={welcomeSegments}
      welcomeCommandColumnWidth={welcomeCommandColumnWidth}
    />
  );
}
