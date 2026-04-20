import Link from "next/link";
import { DesktopShell } from "@/components/DesktopShell";
import { siteConfig } from "@/site.config";
import { getAllProjects } from "@/lib/projects/loadProjects";
import { commandNameColumnWidth } from "@/lib/shell/formatCommandList";
import { createShellRegistry } from "@/lib/shell/registry";
import { buildWelcomeSegments } from "@/lib/shell/welcome";

export default async function Home() {
  const projects = await getAllProjects();
  const registry = createShellRegistry({
    site: siteConfig,
    projects,
    getCwd: () => "/home/guest",
    setCwd: () => 0,
    getHistory: () => [],
  });
  const welcomeSegments = buildWelcomeSegments(siteConfig, registry);
  const welcomeCommandColumnWidth = commandNameColumnWidth(registry);

  return (
    <>
      <h1 className="visually-hidden">{siteConfig.siteTitle}</h1>
      <noscript>
        <div
          style={{
            padding: "1rem",
            maxWidth: "40rem",
            margin: "0 auto",
            fontFamily: "system-ui",
          }}
        >
          <p>{siteConfig.tagline}</p>
          <p>
            <Link href="/projects/">Projects</Link> ·{" "}
            <Link href="/about/">About</Link> ·{" "}
            <a href={siteConfig.links.github}>GitHub</a> ·{" "}
            <a href={siteConfig.links.linkedin}>LinkedIn</a>
          </p>
        </div>
      </noscript>
      <DesktopShell
        site={siteConfig}
        projects={projects}
        welcomeSegments={welcomeSegments}
        welcomeCommandColumnWidth={welcomeCommandColumnWidth}
      />
    </>
  );
}
