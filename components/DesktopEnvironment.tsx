"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { SiteConfig } from "@/site.config";
import type { Project } from "@/lib/projects/types";
import type { WelcomeSegment } from "@/lib/shell/welcome";
import {
  DESKTOP_APPS,
  type DesktopAppId,
  type WindowLayoutMode,
} from "@/lib/desktop/apps";
import { useTheme } from "@/components/ThemeProvider";
import { MenuBar } from "./MenuBar";
import { AppWindow } from "./AppWindow";
import { Terminal } from "./Terminal";
import { AboutContent } from "./about/AboutContent";
import { ProjectsListContent } from "./projects/ProjectsListContent";
import { DesktopIcons } from "./DesktopIcons";
import styles from "./DesktopShell.module.css";

function minimizedSlotLeft(
  id: DesktopAppId,
  open: Set<DesktopAppId>,
  layoutMode: Record<DesktopAppId, WindowLayoutMode>
): string | undefined {
  if (layoutMode[id] !== "minimized") return undefined;
  const mins = DESKTOP_APPS.filter(
    (k) => open.has(k) && layoutMode[k] === "minimized"
  );
  const idx = mins.indexOf(id);
  return `calc(${idx} * min(228px, 46vw) + 0.5rem)`;
}

/** Drag delta applied via transform; merges with centered About window on wide layouts. */
function dragStyle(
  id: DesktopAppId,
  offset: { x: number; y: number },
  aboutCenteredWide: boolean
): CSSProperties | undefined {
  if (offset.x === 0 && offset.y === 0) return undefined;
  if (id === "about" && aboutCenteredWide) {
    return {
      transform: `translate(calc(-50% + ${offset.x}px), ${offset.y}px)`,
    };
  }
  return {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
  };
}

export function DesktopEnvironment({
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
  const { theme } = useTheme();
  const terminalTitle = `${site.shellUser}@${site.hostname}: ~`;

  const [open, setOpen] = useState<Set<DesktopAppId>>(
    () => new Set(["terminal"])
  );
  const [focusedApp, setFocusedApp] = useState<DesktopAppId>("terminal");
  const [layoutMode, setLayoutMode] = useState<
    Record<DesktopAppId, WindowLayoutMode>
  >({
    terminal: "normal",
    projects: "normal",
    about: "normal",
  });
  const [zMap, setZMap] = useState<Record<DesktopAppId, number>>({
    terminal: 100,
    projects: 90,
    about: 91,
  });
  const [windowOffset, setWindowOffset] = useState<
    Record<DesktopAppId, { x: number; y: number }>
  >({
    terminal: { x: 0, y: 0 },
    projects: { x: 0, y: 0 },
    about: { x: 0, y: 0 },
  });
  const [aboutLayoutWide, setAboutLayoutWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 721px)");
    const apply = () => setAboutLayoutWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const moveWindow = useCallback((id: DesktopAppId, dx: number, dy: number) => {
    setWindowOffset((prev) => ({
      ...prev,
      [id]: { x: prev[id].x + dx, y: prev[id].y + dy },
    }));
  }, []);

  const bringToFront = useCallback((id: DesktopAppId) => {
    setFocusedApp(id);
    setZMap((prev) => {
      const next = { ...prev };
      const max = Math.max(...Object.values(next));
      next[id] = max + 1;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open.has(focusedApp)) {
      const remaining = [...open];
      if (remaining.length === 0) return;
      const top = remaining.reduce((a, b) =>
        zMap[a] >= zMap[b] ? a : b
      );
      setFocusedApp(top);
    }
  }, [open, focusedApp, zMap]);

  const minimizeApp = useCallback(
    (id: DesktopAppId) => {
      setLayoutMode((prev) => ({ ...prev, [id]: "minimized" }));
      bringToFront(id);
    },
    [bringToFront]
  );

  const toggleMaximize = useCallback(
    (id: DesktopAppId) => {
      setLayoutMode((prev) => {
        const cur = prev[id];
        const next = { ...prev };
        if (cur === "maximized") {
          next[id] = "normal";
          return next;
        }
        next[id] = "maximized";
        for (const k of DESKTOP_APPS) {
          if (k !== id && next[k] === "maximized") {
            next[k] = "normal";
          }
        }
        return next;
      });
      bringToFront(id);
    },
    [bringToFront]
  );

  const shellMouseDown = useCallback(
    (id: DesktopAppId) => {
      setLayoutMode((prev) => {
        if (prev[id] !== "minimized") return prev;
        return { ...prev, [id]: "normal" };
      });
      bringToFront(id);
    },
    [bringToFront]
  );

  const openApp = useCallback(
    (id: DesktopAppId) => {
      setOpen((prev) => new Set(prev).add(id));
      setLayoutMode((prev) => ({ ...prev, [id]: "normal" }));
      setWindowOffset((prev) => ({ ...prev, [id]: { x: 0, y: 0 } }));
      bringToFront(id);
    },
    [bringToFront]
  );

  const closeApp = useCallback((id: DesktopAppId) => {
    setOpen((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }, []);

  const desktopNav = useMemo(
    () => ({
      openApp,
      enabled: true as const,
    }),
    [openApp]
  );

  const menuBarForegroundTitle = useMemo(() => {
    const labels: Record<DesktopAppId, string> = {
      terminal: site.menuAppName,
      projects: "Projects",
      about: "About",
    };
    if (open.size === 0) {
      return site.hostname;
    }
    return labels[focusedApp];
  }, [open, focusedApp, site.menuAppName, site.hostname]);

  const winShellClass = (base: string, id: DesktopAppId) => {
    const m = layoutMode[id];
    return [
      base,
      m === "maximized" ? styles.winMaximized : "",
      m === "minimized" ? styles.winMinimized : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  /**
   * Single z-stack from `zMap` so any window can be brought above a maximized one.
   * Minimized strips use a higher band so they stay clickable above everything else.
   */
  const winZ = (id: DesktopAppId) => {
    if (layoutMode[id] === "minimized") {
      const mins = DESKTOP_APPS.filter(
        (k) => open.has(k) && layoutMode[k] === "minimized"
      );
      const idx = mins.indexOf(id);
      return 50000 + Math.max(0, idx);
    }
    return zMap[id];
  };

  return (
    <div className={styles.desktop}>
      <MenuBar
        site={site}
        desktopNav={desktopNav}
        foregroundTitle={menuBarForegroundTitle}
      />
      <main className={styles.main}>
        <div className={styles.surface} aria-label="Desktop">
          <DesktopIcons onOpen={openApp} />

          {open.has("terminal") && (
            <div
              className={winShellClass(styles.winTerminal, "terminal")}
              style={{
                zIndex: winZ("terminal"),
                left: minimizedSlotLeft("terminal", open, layoutMode),
                ...dragStyle("terminal", windowOffset.terminal, aboutLayoutWide),
              }}
              onMouseDown={() => shellMouseDown("terminal")}
            >
              <AppWindow
                className={styles.appWindowFill}
                title={terminalTitle}
                titleId="win-terminal-title"
                theme={theme}
                bodyVariant="terminal"
                layoutMode={layoutMode.terminal}
                dragEnabled={layoutMode.terminal === "normal"}
                onDrag={(dx, dy) => moveWindow("terminal", dx, dy)}
                onClose={() => closeApp("terminal")}
                onFocusWindow={() => bringToFront("terminal")}
                onMinimize={() => minimizeApp("terminal")}
                onToggleMaximize={() => toggleMaximize("terminal")}
              >
                <Terminal
                  site={site}
                  projects={projects}
                  welcomeSegments={welcomeSegments}
                  welcomeCommandColumnWidth={welcomeCommandColumnWidth}
                />
              </AppWindow>
            </div>
          )}

          {open.has("projects") && (
            <div
              className={winShellClass(styles.winProjects, "projects")}
              style={{
                zIndex: winZ("projects"),
                left: minimizedSlotLeft("projects", open, layoutMode),
                ...dragStyle("projects", windowOffset.projects, aboutLayoutWide),
              }}
              onMouseDown={() => shellMouseDown("projects")}
            >
              <AppWindow
                className={styles.appWindowFill}
                title="Projects"
                titleId="win-projects-title"
                theme={theme}
                bodyVariant="panel"
                layoutMode={layoutMode.projects}
                dragEnabled={layoutMode.projects === "normal"}
                onDrag={(dx, dy) => moveWindow("projects", dx, dy)}
                onClose={() => closeApp("projects")}
                onFocusWindow={() => bringToFront("projects")}
                onMinimize={() => minimizeApp("projects")}
                onToggleMaximize={() => toggleMaximize("projects")}
              >
                <div className={styles.panelPad}>
                  <ProjectsListContent projects={projects} showNav={false} />
                </div>
              </AppWindow>
            </div>
          )}

          {open.has("about") && (
            <div
              className={winShellClass(styles.winAbout, "about")}
              style={{
                zIndex: winZ("about"),
                left: minimizedSlotLeft("about", open, layoutMode),
                ...dragStyle("about", windowOffset.about, aboutLayoutWide),
              }}
              onMouseDown={() => shellMouseDown("about")}
            >
              <AppWindow
                className={styles.appWindowFill}
                title="About"
                titleId="win-about-title"
                theme={theme}
                bodyVariant="panel"
                layoutMode={layoutMode.about}
                dragEnabled={layoutMode.about === "normal"}
                onDrag={(dx, dy) => moveWindow("about", dx, dy)}
                onClose={() => closeApp("about")}
                onFocusWindow={() => bringToFront("about")}
                onMinimize={() => minimizeApp("about")}
                onToggleMaximize={() => toggleMaximize("about")}
              >
                <div className={styles.panelPad}>
                  <AboutContent site={site} />
                </div>
              </AppWindow>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
