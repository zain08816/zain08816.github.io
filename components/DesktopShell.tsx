import type { SiteConfig } from "@/site.config";
import type { Project } from "@/lib/projects/types";
import type { Essay } from "@/lib/essays/types";
import type { Inspiration } from "@/lib/inspirations/types";
import type { WelcomeSegment } from "@/lib/shell/welcome";
import { DesktopEnvironment } from "./DesktopEnvironment";

export function DesktopShell({
  site,
  projects,
  essays,
  inspirations,
  welcomeSegments,
  welcomeCommandColumnWidth,
}: {
  site: SiteConfig;
  projects: Project[];
  essays: Essay[];
  inspirations: Inspiration[];
  welcomeSegments: WelcomeSegment[];
  welcomeCommandColumnWidth: number;
}) {
  return (
    <DesktopEnvironment
      site={site}
      projects={projects}
      essays={essays}
      inspirations={inspirations}
      welcomeSegments={welcomeSegments}
      welcomeCommandColumnWidth={welcomeCommandColumnWidth}
    />
  );
}
