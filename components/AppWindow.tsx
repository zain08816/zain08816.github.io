"use client";

import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { ThemeId } from "@/lib/themes/types";
import type { WindowLayoutMode } from "@/lib/desktop/apps";
import styles from "./AppWindow.module.css";

export type AppBodyVariant = "terminal" | "panel";

export function AppWindow({
  title,
  titleId,
  theme,
  bodyVariant = "terminal",
  layoutMode = "normal",
  onClose,
  onFocusWindow,
  onMinimize,
  onToggleMaximize,
  dragEnabled,
  onDrag,
  children,
  className,
}: {
  title: string;
  titleId: string;
  theme: ThemeId;
  bodyVariant?: AppBodyVariant;
  layoutMode?: WindowLayoutMode;
  onClose?: () => void;
  onFocusWindow?: () => void;
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  /** When true, dragging the title bar calls `onDrag` with pointer deltas. */
  dragEnabled?: boolean;
  onDrag?: (dx: number, dy: number) => void;
  children: ReactNode;
  className?: string;
}) {
  const isMac = theme === "macos";
  const isSystem7 = theme === "system7";
  const minimized = layoutMode === "minimized";
  const maximized = layoutMode === "maximized";
  const draggingRef = useRef(false);
  const dragLastRef = useRef<{ x: number; y: number } | null>(null);
  const [draggingUi, setDraggingUi] = useState(false);

  const endDrag = useCallback(() => {
    draggingRef.current = false;
    dragLastRef.current = null;
    setDraggingUi(false);
  }, []);

  const handleTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!dragEnabled || e.button !== 0) return;
      /* pointerdown bubbles before mousedown; buttons only stopped mousedown */
      const n = e.target as Node;
      const el =
        n.nodeType === Node.ELEMENT_NODE ? (n as Element) : n.parentElement;
      if (el?.closest("button")) return;
      draggingRef.current = true;
      dragLastRef.current = { x: e.clientX, y: e.clientY };
      setDraggingUi(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      onFocusWindow?.();
    },
    [dragEnabled, onFocusWindow]
  );

  const handleTitlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current || !onDrag || !dragLastRef.current) return;
      const last = dragLastRef.current;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      dragLastRef.current = { x: e.clientX, y: e.clientY };
      if (dx !== 0 || dy !== 0) onDrag(dx, dy);
    },
    [onDrag]
  );

  const handleTitlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      endDrag();
    },
    [endDrag]
  );

  const handleTitleLostCapture = useCallback(() => {
    endDrag();
  }, [endDrag]);

  return (
    <div
      className={`${styles.window} ${minimized ? styles.windowMinimized : ""} ${className ?? ""}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      data-layout={layoutMode}
    >
      <div
        className={`${styles.titleBar} ${theme === "win95" ? styles.titleBarWin95 : ""} ${isSystem7 ? styles.titleBarSystem7 : ""} ${dragEnabled ? styles.titleBarDraggable : ""} ${draggingUi ? styles.titleBarDragging : ""}`}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onPointerCancel={handleTitlePointerUp}
        onLostPointerCapture={handleTitleLostCapture}
      >
        {isMac ? (
          <>
            <span className={styles.traffic}>
              <button
                type="button"
                className={`${styles.dot} ${styles.dotClose}`}
                aria-label="Close window"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
              />
              <button
                type="button"
                className={`${styles.dot} ${styles.dotYellow}`}
                aria-label="Minimize window"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize?.();
                }}
              />
              <button
                type="button"
                className={`${styles.dot} ${styles.dotGreen}`}
                aria-label={
                  maximized ? "Restore window size" : "Zoom window"
                }
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMaximize?.();
                }}
              />
            </span>
            <span className={styles.title} id={titleId}>
              {title}
            </span>
            <span className={styles.spacerMacos} aria-hidden />
          </>
        ) : isSystem7 ? (
          <>
            <span className={styles.system7ControlsLeft} aria-hidden>
              <button
                type="button"
                className={`${styles.system7Btn} ${styles.system7BtnClose}`}
                aria-label="Close window"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
              >
                <span className={styles.system7CloseGlyph} aria-hidden>
                  x
                </span>
              </button>
            </span>
            <span className={styles.title} id={titleId}>
              {title}
            </span>
            <span className={styles.system7ControlsRight}>
              <button
                type="button"
                className={`${styles.system7Btn} ${styles.system7BtnShade}`}
                aria-label="Window shade"
                title="Window shade"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize?.();
                }}
              >
                <span className={styles.system7ShadeGlyph} aria-hidden />
              </button>
              <button
                type="button"
                className={`${styles.system7Btn} ${styles.system7BtnZoom} ${maximized ? styles.system7BtnToggled : ""}`}
                aria-label={maximized ? "Restore window size" : "Zoom window"}
                title={maximized ? "Restore" : "Zoom"}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMaximize?.();
                }}
              >
                <span className={styles.system7ZoomGlyph} aria-hidden />
              </button>
            </span>
          </>
        ) : (
          <>
            <span className={styles.title} id={titleId}>
              <span className={styles.titleWin95}>{title}</span>
            </span>
            <span className={styles.win95Controls}>
              <button
                type="button"
                className={styles.win95Btn}
                aria-label="Minimize"
                title="Minimize"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize?.();
                }}
              >
                _
              </button>
              <button
                type="button"
                className={`${styles.win95Btn} ${maximized ? styles.win95BtnToggled : ""}`}
                aria-label={maximized ? "Restore" : "Maximize"}
                title={maximized ? "Restore" : "Maximize"}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMaximize?.();
                }}
              >
                {maximized ? "❐" : "□"}
              </button>
              <button
                type="button"
                className={styles.win95Btn}
                aria-label="Close"
                title="Close"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
              >
                ×
              </button>
            </span>
          </>
        )}
      </div>
      {!minimized && (
        <div
          className={`${styles.body} ${bodyVariant === "panel" ? styles.bodyPanel : styles.bodyTerminal}`}
        >
          {bodyVariant === "terminal" ? (
            children
          ) : (
            <div className={styles.scrollInner}>{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
