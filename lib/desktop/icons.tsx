import type { ComponentType, SVGProps } from "react";
import type { DesktopAppId } from "./apps";
import type { ThemeId } from "@/lib/themes/types";

export type DesktopIconGlyph = ComponentType<SVGProps<SVGSVGElement>>;

export interface DesktopIconDef {
  /** Stable id for keys + tests */
  id: string;
  /** App window to open when activated */
  appId: DesktopAppId;
  /** Visible label under the icon */
  label: string;
  /** Default glyph — used when no theme-specific override is provided */
  Glyph: DesktopIconGlyph;
  /** Optional per-theme glyph overrides (falls back to `Glyph`) */
  glyphByTheme?: Partial<Record<ThemeId, DesktopIconGlyph>>;
}

function MacosTerminalGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="2.5"
        y="5.5"
        width="27"
        height="21"
        rx="3"
        fill="rgba(20, 20, 22, 0.92)"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <path
        d="M2.5 9.5h27"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="5.5" cy="7.5" r="0.9" fill="#ff5f57" />
      <circle cx="8.4" cy="7.5" r="0.9" fill="#febc2e" />
      <circle cx="11.3" cy="7.5" r="0.9" fill="#28c840" />
      <path
        d="M7 14l4 3.4L7 21"
        fill="none"
        stroke="#7CFFB2"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 22h9"
        stroke="#7CFFB2"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Win95 "MS-DOS Prompt" style glyph: silver 3D-beveled window with a navy
 * title bar and a black "CRT" screen showing a white `C:\>` prompt and a
 * blinking-style cursor block. Drawn with `crispEdges` so the pixel-art
 * bezel stays sharp at any size.
 */
function Win95TerminalGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role="img"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="3" width="28" height="26" fill="#c0c0c0" />
      <path d="M2 3h28v1H2z M2 3h1v25H2z" fill="#ffffff" />
      <path d="M2 28h28v1H2z M29 3h1v26h-1z" fill="#000000" />
      <path d="M3 4h26v1H3z M3 4h1v23H3z" fill="#dfdfdf" />
      <path d="M3 27h26v1H3z M28 4h1v24h-1z" fill="#808080" />

      <rect x="4" y="5" width="24" height="4" fill="#000080" />
      <rect x="4" y="5" width="2" height="2" fill="#c0c0c0" />
      <rect x="22" y="6" width="2" height="2" fill="#c0c0c0" />
      <rect x="25" y="6" width="2" height="2" fill="#c0c0c0" />

      <rect x="4" y="10" width="24" height="17" fill="#000000" />

      {/* C */}
      <rect x="6" y="16" width="1" height="5" fill="#ffffff" />
      <rect x="7" y="16" width="1" height="1" fill="#ffffff" />
      <rect x="7" y="20" width="1" height="1" fill="#ffffff" />
      {/* : */}
      <rect x="10" y="17" width="1" height="1" fill="#ffffff" />
      <rect x="10" y="19" width="1" height="1" fill="#ffffff" />
      {/* \ */}
      <rect x="12" y="16" width="1" height="2" fill="#ffffff" />
      <rect x="13" y="18" width="1" height="1" fill="#ffffff" />
      <rect x="14" y="19" width="1" height="2" fill="#ffffff" />
      {/* > */}
      <rect x="16" y="16" width="1" height="1" fill="#ffffff" />
      <rect x="17" y="17" width="1" height="1" fill="#ffffff" />
      <rect x="18" y="18" width="1" height="1" fill="#ffffff" />
      <rect x="17" y="19" width="1" height="1" fill="#ffffff" />
      <rect x="16" y="20" width="1" height="1" fill="#ffffff" />
      {/* cursor block */}
      <rect x="20" y="16" width="3" height="5" fill="#ffffff" />
    </svg>
  );
}

/** System 7 "Terminal": monochrome CRT in classic Mac window frame. */
function System7TerminalGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role="img"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="4" width="26" height="23" fill="#c6c6c6" />
      <rect x="3" y="4" width="26" height="1" fill="#ffffff" />
      <rect x="3" y="4" width="1" height="23" fill="#ffffff" />
      <rect x="3" y="26" width="26" height="1" fill="#000000" />
      <rect x="28" y="4" width="1" height="23" fill="#000000" />
      <rect x="5" y="7" width="22" height="17" fill="#111611" />
      <rect x="6" y="8" width="20" height="1" fill="#1f2b1f" />
      <rect x="7" y="13" width="5" height="1" fill="#8be18b" />
      <rect x="12" y="14" width="1" height="1" fill="#8be18b" />
      <rect x="13" y="15" width="1" height="1" fill="#8be18b" />
      <rect x="12" y="16" width="1" height="1" fill="#8be18b" />
      <rect x="16" y="13" width="6" height="1" fill="#8be18b" />
    </svg>
  );
}

/**
 * macOS "Projects" glyph: a two-tone blue Finder folder with a tab,
 * subtle gradients, and a thin highlight along the front edge — mirroring
 * the modern macOS Finder folder icon family.
 */
function MacosProjectsGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="macFolderBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ec0f4" />
          <stop offset="1" stopColor="#4a8bd6" />
        </linearGradient>
        <linearGradient id="macFolderFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b4d6f8" />
          <stop offset="1" stopColor="#5fa0de" />
        </linearGradient>
      </defs>
      <path
        d="M4 9.5a2 2 0 0 1 2 -2h6.2l2 2h11.8a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-20a2 2 0 0 1 -2 -2z"
        fill="url(#macFolderBack)"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="0.6"
      />
      <path
        d="M4 13.5h24v10a2 2 0 0 1 -2 2h-20a2 2 0 0 1 -2 -2z"
        fill="url(#macFolderFront)"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.5"
      />
      <path
        d="M5 14.4h22"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Win95 "Projects" glyph: a pixel-art manila folder with a tab on the
 * left, two-layer body for depth, classic 3D highlight/shadow bevel, and
 * a black 1px outline. Drawn with `crispEdges` so it stays sharp.
 */
function Win95ProjectsGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role="img"
      aria-hidden="true"
      {...props}
    >
      {/* tab */}
      <rect x="4" y="8" width="11" height="4" fill="#d2a647" />
      <rect x="4" y="9" width="10" height="1" fill="#f0d177" />
      <rect x="4" y="8" width="11" height="1" fill="#000000" />
      <rect x="4" y="8" width="1" height="4" fill="#000000" />
      <rect x="14" y="9" width="1" height="3" fill="#000000" />

      {/* back layer (darker) for depth */}
      <rect x="3" y="11" width="26" height="15" fill="#a8841f" />
      <rect x="3" y="11" width="26" height="1" fill="#000000" />

      {/* front flap */}
      <rect x="3" y="13" width="26" height="13" fill="#e8b94a" />
      {/* highlights (top + left) */}
      <rect x="4" y="13" width="24" height="1" fill="#fcdc7b" />
      <rect x="4" y="14" width="1" height="11" fill="#fcdc7b" />
      {/* shadows (bottom + right) */}
      <rect x="4" y="24" width="24" height="1" fill="#7a5410" />
      <rect x="27" y="14" width="1" height="11" fill="#7a5410" />
      {/* outline */}
      <rect x="3" y="13" width="26" height="1" fill="#000000" />
      <rect x="3" y="13" width="1" height="13" fill="#000000" />
      <rect x="28" y="13" width="1" height="13" fill="#000000" />
      <rect x="3" y="25" width="26" height="1" fill="#000000" />
    </svg>
  );
}

/** System 7 "Projects": plain folder with black outline and subtle tab. */
function System7ProjectsGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role="img"
      aria-hidden="true"
      {...props}
    >
      <rect x="5" y="9" width="9" height="3" fill="#dad3a7" />
      <rect x="4" y="11" width="24" height="14" fill="#f1e7b6" />
      <rect x="4" y="11" width="24" height="1" fill="#000000" />
      <rect x="4" y="11" width="1" height="14" fill="#000000" />
      <rect x="27" y="11" width="1" height="14" fill="#000000" />
      <rect x="4" y="24" width="24" height="1" fill="#000000" />
      <rect x="5" y="12" width="22" height="1" fill="#fff8d6" />
      <rect x="5" y="13" width="1" height="11" fill="#fff8d6" />
      <rect x="6" y="23" width="21" height="1" fill="#baa85f" />
      <rect x="26" y="14" width="1" height="9" fill="#baa85f" />
    </svg>
  );
}

/**
 * macOS "About" glyph: a Contacts-style ID card — soft gradient body,
 * blue header band, person silhouette on the left, and three text lines
 * on the right. Echoes macOS Contacts / "Get Info" card iconography.
 */
function MacosAboutGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="macAboutCard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6e8ed" />
        </linearGradient>
        <linearGradient id="macAboutBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5aa9ff" />
          <stop offset="1" stopColor="#2f7fe0" />
        </linearGradient>
      </defs>
      <rect
        x="3.5"
        y="5.5"
        width="25"
        height="21"
        rx="3.5"
        fill="url(#macAboutCard)"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.6"
      />
      {/* top blue band */}
      <path
        d="M3.5 9a3.5 3.5 0 0 1 3.5 -3.5h18a3.5 3.5 0 0 1 3.5 3.5v2.5h-25z"
        fill="url(#macAboutBand)"
      />
      {/* avatar */}
      <circle
        cx="10.5"
        cy="15.5"
        r="3"
        fill="#cdd3dc"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.5"
      />
      <path
        d="M6 23.5c0-2.4 2-3.6 4.5-3.6s4.5 1.2 4.5 3.6v.5h-9z"
        fill="#cdd3dc"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.5"
      />
      {/* text lines */}
      <rect x="16" y="14.2" width="9" height="1.4" rx="0.6" fill="#8a909a" />
      <rect x="16" y="17.2" width="7" height="1.2" rx="0.5" fill="#b8bdc6" />
      <rect x="16" y="19.7" width="8" height="1.2" rx="0.5" fill="#b8bdc6" />
    </svg>
  );
}

/**
 * Win95 "About" glyph: pixel-art user silhouette in the spirit of the
 * classic Windows 95 "User Accounts" icon — round head, simple face,
 * blue shirt with white v-neck collar. Drawn with `crispEdges`.
 */
function Win95AboutGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role="img"
      aria-hidden="true"
      {...props}
    >
      {/* hair (top) */}
      <rect x="11" y="5" width="10" height="2" fill="#111111" />
      <rect x="10" y="7" width="12" height="2" fill="#111111" />
      <rect x="10" y="9" width="2" height="3" fill="#111111" />
      <rect x="20" y="9" width="2" height="3" fill="#111111" />

      {/* face */}
      <rect x="12" y="9" width="8" height="7" fill="#a97856" />
      <rect x="11" y="11" width="1" height="3" fill="#a97856" />
      <rect x="20" y="11" width="1" height="3" fill="#a97856" />

      {/* eyes */}
      <rect x="13" y="12" width="1" height="1" fill="#000000" />
      <rect x="18" y="12" width="1" height="1" fill="#000000" />
      {/* mouth */}
      <rect x="14" y="14" width="4" height="1" fill="#3f1f10" />

      {/* neck */}
      <rect x="14" y="16" width="4" height="2" fill="#a97856" />
      <rect x="13" y="17" width="6" height="1" fill="#7a5238" />

      {/* shirt body (blue) */}
      <rect x="8" y="18" width="16" height="8" fill="#3b6ec3" />
      <rect x="6" y="20" width="2" height="6" fill="#3b6ec3" />
      <rect x="24" y="20" width="2" height="6" fill="#3b6ec3" />
      {/* shirt outline / shadow */}
      <rect x="8" y="18" width="16" height="1" fill="#2a4d8c" />
      <rect x="6" y="25" width="20" height="1" fill="#2a4d8c" />

      {/* white v-neck */}
      <rect x="14" y="18" width="4" height="1" fill="#ffffff" />
      <rect x="15" y="19" width="2" height="1" fill="#ffffff" />
    </svg>
  );
}

/** System 7 "About": card-style info doc with simple avatar + lines. */
function System7AboutGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role="img"
      aria-hidden="true"
      {...props}
    >
      <rect x="5" y="5" width="22" height="22" fill="#f3f3f3" />
      <rect x="5" y="5" width="22" height="1" fill="#000000" />
      <rect x="5" y="5" width="1" height="22" fill="#000000" />
      <rect x="26" y="5" width="1" height="22" fill="#000000" />
      <rect x="5" y="26" width="22" height="1" fill="#000000" />
      <rect x="6" y="6" width="20" height="1" fill="#ffffff" />
      <rect x="6" y="7" width="1" height="19" fill="#ffffff" />
      <rect x="7" y="8" width="18" height="3" fill="#b5b5b5" />
      <rect x="9" y="14" width="4" height="4" fill="#8f8f8f" />
      <rect x="8" y="18" width="6" height="4" fill="#8f8f8f" />
      <rect x="16" y="14" width="7" height="1" fill="#4f4f4f" />
      <rect x="16" y="17" width="6" height="1" fill="#7a7a7a" />
      <rect x="16" y="20" width="6" height="1" fill="#7a7a7a" />
    </svg>
  );
}

/**
 * Add new desktop shortcuts here. Order = top-to-bottom in the icon column.
 * To add a new app shortcut: register the app in `lib/desktop/apps.ts`,
 * then push another entry below with its own glyph.
 */
export const DESKTOP_ICONS: DesktopIconDef[] = [
  {
    id: "terminal",
    appId: "terminal",
    label: "Terminal",
    Glyph: MacosTerminalGlyph,
    glyphByTheme: {
      win95: Win95TerminalGlyph,
      system7: System7TerminalGlyph,
    },
  },
  {
    id: "projects",
    appId: "projects",
    label: "Projects",
    Glyph: MacosProjectsGlyph,
    glyphByTheme: {
      win95: Win95ProjectsGlyph,
      system7: System7ProjectsGlyph,
    },
  },
  {
    id: "about",
    appId: "about",
    label: "About",
    Glyph: MacosAboutGlyph,
    glyphByTheme: {
      win95: Win95AboutGlyph,
      system7: System7AboutGlyph,
    },
  },
];
