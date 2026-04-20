"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteConfig } from "@/site.config";
import type { DesktopAppId } from "@/lib/desktop/apps";
import { useTheme } from "@/components/ThemeProvider";
import { isThemeId } from "@/lib/themes/types";
import styles from "./MenuBar.module.css";

function formatClock(d: Date): string {
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `${date}  ${time}`;
}

function focusTerminalInput(openTerminal?: () => void) {
  openTerminal?.();
  if (typeof document === "undefined") return;
  queueMicrotask(() => {
    const el = document.getElementById("shell-input") as HTMLInputElement | null;
    if (!el) return;
    el.focus();
    el.scrollIntoView({ block: "nearest" });
  });
}

export function MenuBar({
  site,
  desktopNav,
  foregroundTitle,
}: {
  site: SiteConfig;
  /** When set (desktop shell), reflects the focused app; falls back to `menuAppName` */
  foregroundTitle?: string;
  desktopNav?: {
    enabled: boolean;
    openApp: (id: DesktopAppId) => void;
  };
}) {
  const {
    theme,
    setTheme,
    macAppearance,
    setMacAppearance,
    options: themeOptions,
  } = useTheme();
  const [open, setOpen] = useState<string | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onClick = () => setOpen(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function desktopProjectAction(
    href: string | undefined
  ): DesktopAppId | undefined {
    if (!href || desktopNav?.enabled !== true) return undefined;
    if (href === "/") return "terminal";
    if (
      href === "/projects/" ||
      href.endsWith("/projects/")
    )
      return "projects";
    return undefined;
  }

  return (
    <header className={styles.bar} role="banner" data-menu-theme={theme}>
      <div className={styles.left}>
        <span className={styles.logo} aria-hidden="true">
          {theme === "win95" ? "◇" : theme === "system7" ? "▤" : "⌘"}
        </span>
        <span
          className={styles.app}
          title="Foreground app"
          aria-live="polite"
        >
          {foregroundTitle ?? site.menuAppName}
        </span>
        <nav className={styles.desktopNav} aria-label="Main">
          {site.menus.map((menu) => {
            if (menu.href) {
              const useDesktopAbout =
                desktopNav?.enabled &&
                menu.id === "about" &&
                !menu.external;

              if (useDesktopAbout) {
                return (
                  <div key={menu.id} className={styles.menuWrap}>
                    <button
                      type="button"
                      className={`${styles.menuBtn} ${styles.menuLink}`}
                      onClick={() => desktopNav?.openApp("about")}
                    >
                      {menu.label}
                    </button>
                  </div>
                );
              }

              return (
                <div key={menu.id} className={styles.menuWrap}>
                  {menu.external ? (
                    <a
                      className={`${styles.menuBtn} ${styles.menuLink}`}
                      href={menu.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {menu.label}
                    </a>
                  ) : (
                    <Link
                      className={`${styles.menuBtn} ${styles.menuLink}`}
                      href={menu.href}
                    >
                      {menu.label}
                    </Link>
                  )}
                </div>
              );
            }

            const isOpen = open === menu.id;
            return (
              <div key={menu.id} className={styles.menuWrap}>
                <button
                  type="button"
                  className={`${styles.menuBtn} ${isOpen ? styles.menuBtnOpen : ""}`}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(isOpen ? null : menu.id);
                  }}
                  onMouseEnter={() => {
                    if (open && open !== menu.id) setOpen(menu.id);
                  }}
                >
                  {menu.label}
                </button>
                {isOpen && (
                  <ul
                    className={styles.dropdown}
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {menu.items.map((item) => {
                      const desktopId =
                        menu.id === "projects" && desktopNav?.enabled
                          ? desktopProjectAction(item.href)
                          : undefined;

                      if (desktopId) {
                        return (
                          <li key={item.label} role="none">
                            <button
                              type="button"
                              role="menuitem"
                              className={styles.dropdownBtn}
                              onClick={() => {
                                setOpen(null);
                                desktopNav?.openApp(desktopId);
                              }}
                            >
                              {item.label}
                            </button>
                          </li>
                        );
                      }

                      return (
                        <li key={item.label} role="none">
                          {item.href ? (
                            item.external ? (
                              <a
                                role="menuitem"
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpen(null)}
                              >
                                {item.label}
                              </a>
                            ) : (
                              <Link
                                role="menuitem"
                                href={item.href}
                                onClick={() => setOpen(null)}
                              >
                                {item.label}
                              </Link>
                            )
                          ) : (
                            <span className={styles.disabled}>{item.label}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className={styles.right}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() =>
            focusTerminalInput(() =>
              desktopNav?.enabled
                ? desktopNav?.openApp("terminal")
                : undefined
            )
          }
          aria-label="Focus terminal"
          title="Focus terminal"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
        </button>
        <label className={styles.themeLabel}>
          <span className="visually-hidden">Theme</span>
          <select
            className={styles.themeSelect}
            value={theme}
            onChange={(e) => {
              const v = e.target.value;
              if (isThemeId(v)) setTheme(v);
            }}
            aria-label="Theme"
            title="Theme"
          >
            {themeOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {theme === "macos" ? (
          <label className={styles.themeLabel}>
            <span className="visually-hidden">Appearance</span>
            <select
              className={styles.themeSelect}
              value={macAppearance}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "light" || v === "dark") setMacAppearance(v);
              }}
              aria-label="macOS appearance"
              title="Light or dark (macOS only)"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        ) : null}
        <span
          className={styles.clock}
          aria-live="polite"
          suppressHydrationWarning
        >
          {clock || "\u00A0"}
        </span>
      </div>

      <details className={styles.mobile}>
        <summary className={styles.summary} aria-label="Open menu">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
        </summary>
        <div className={styles.mobileSheet}>
          {site.menus.flatMap((m) => {
            if (m.href) {
              const useDesktopAbout =
                desktopNav?.enabled &&
                m.id === "about" &&
                !m.external;

              if (useDesktopAbout) {
                return [
                  <button
                    key={m.id}
                    type="button"
                    className={styles.mobileSheetBtn}
                    onClick={() => desktopNav?.openApp("about")}
                  >
                    {m.label}
                  </button>,
                ];
              }

              return [
                m.external ? (
                  <a
                    key={m.id}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {m.label}
                  </a>
                ) : (
                  <Link key={m.id} href={m.href}>
                    {m.label}
                  </Link>
                ),
              ];
            }
            return m.items
              .filter((i) => i.href)
              .map((item) => {
                const desktopId =
                  m.id === "projects" && desktopNav?.enabled
                    ? desktopProjectAction(item.href)
                    : undefined;

                if (desktopId) {
                  return (
                    <button
                      key={`${m.id}-${item.label}`}
                      type="button"
                      className={styles.mobileSheetBtn}
                      onClick={() => desktopNav?.openApp(desktopId)}
                    >
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={`${m.id}-${item.label}`}
                    href={item.href!}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                  </Link>
                );
              });
          })}
          <div className={styles.mobileThemeRow}>
            <span className={styles.mobileThemeLabel} id="mobile-theme-label">
              Theme
            </span>
            <select
              className={styles.themeSelect}
              value={theme}
              aria-labelledby="mobile-theme-label"
              onChange={(e) => {
                const v = e.target.value;
                if (isThemeId(v)) setTheme(v);
              }}
            >
              {themeOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {theme === "macos" ? (
            <div className={styles.mobileThemeRow}>
              <span
                className={styles.mobileThemeLabel}
                id="mobile-appearance-label"
              >
                Appearance
              </span>
              <select
                className={styles.themeSelect}
                value={macAppearance}
                aria-labelledby="mobile-appearance-label"
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "light" || v === "dark") setMacAppearance(v);
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          ) : null}
        </div>
      </details>
    </header>
  );
}
