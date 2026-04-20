"use client";

import type { DesktopAppId } from "@/lib/desktop/apps";
import { DESKTOP_ICONS } from "@/lib/desktop/icons";
import { useTheme } from "./ThemeProvider";
import styles from "./DesktopIcons.module.css";

export function DesktopIcons({
  onOpen,
}: {
  onOpen: (id: DesktopAppId) => void;
}) {
  const { theme } = useTheme();
  return (
    <div className={styles.iconLayer} aria-hidden="false">
      <ul className={styles.row} role="list" aria-label="Desktop shortcuts">
        {DESKTOP_ICONS.map(({ id, appId, label, Glyph, glyphByTheme }) => {
          const ResolvedGlyph = glyphByTheme?.[theme] ?? Glyph;
          return (
            <li key={id}>
              <button
                type="button"
                className={styles.icon}
                onDoubleClick={() => onOpen(appId)}
                onClick={() => onOpen(appId)}
                aria-label={`Open ${label}`}
                title={`Open ${label}`}
              >
                <ResolvedGlyph className={styles.glyph} />
                <span className={styles.label}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
