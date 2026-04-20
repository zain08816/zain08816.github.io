"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  MAC_APPEARANCE_STORAGE_KEY,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "@/lib/themes/constants";
import {
  isMacAppearance,
  isThemeId,
  type MacAppearance,
  type ThemeId,
} from "@/lib/themes/types";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  options: typeof THEME_OPTIONS;
  /** macOS light/dark; only affects styling when `theme === "macos"` */
  macAppearance: MacAppearance;
  setMacAppearance: (appearance: MacAppearance) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function syncMacAppearanceDom(theme: ThemeId, appearance: MacAppearance) {
  if (theme === "macos") {
    document.documentElement.setAttribute("data-appearance", appearance);
  } else {
    document.documentElement.removeAttribute("data-appearance");
  }
}

export function ThemeProvider({
  children,
  defaultTheme,
  defaultMacAppearance,
}: {
  children: React.ReactNode;
  defaultTheme: ThemeId;
  defaultMacAppearance: MacAppearance;
}) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [macAppearance, setMacAppearanceState] =
    useState<MacAppearance>(defaultMacAppearance);

  useLayoutEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const resolvedTheme =
        storedTheme && isThemeId(storedTheme) ? storedTheme : defaultTheme;
      setThemeState(resolvedTheme);

      const storedMac = localStorage.getItem(MAC_APPEARANCE_STORAGE_KEY);
      const resolvedMac =
        storedMac && isMacAppearance(storedMac)
          ? storedMac
          : defaultMacAppearance;
      setMacAppearanceState(resolvedMac);

      document.documentElement.setAttribute("data-theme", resolvedTheme);
      syncMacAppearanceDom(resolvedTheme, resolvedMac);
    } catch {
      document.documentElement.setAttribute("data-theme", defaultTheme);
      syncMacAppearanceDom(defaultTheme, defaultMacAppearance);
    }
  }, [defaultTheme, defaultMacAppearance]);

  const setTheme = useCallback(
    (next: ThemeId) => {
      setThemeState(next);
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      syncMacAppearanceDom(next, macAppearance);
    },
    [macAppearance]
  );

  const setMacAppearance = useCallback((appearance: MacAppearance) => {
    setMacAppearanceState(appearance);
    try {
      localStorage.setItem(MAC_APPEARANCE_STORAGE_KEY, appearance);
    } catch {
      /* ignore */
    }
    setThemeState((currentTheme) => {
      if (currentTheme === "macos") {
        syncMacAppearanceDom("macos", appearance);
      }
      return currentTheme;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      options: THEME_OPTIONS,
      macAppearance,
      setMacAppearance,
    }),
    [theme, setTheme, macAppearance, setMacAppearance]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
