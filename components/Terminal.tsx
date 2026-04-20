"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SiteConfig } from "@/site.config";
import type { Project } from "@/lib/projects/types";
import { buildWelcomeSegments, type WelcomeSegment } from "@/lib/shell/welcome";
import { createShellRegistry, indexCommands } from "@/lib/shell/registry";
import type { ShellContext } from "@/lib/shell/types";
import { isCommandVisibleInCatalog } from "@/lib/shell/formatCommandList";
import { splitArgv, parseOpts } from "@/lib/shell/parser";
import { resolveCd } from "@/lib/shell/vfs";
import {
  computeCompletionSlot,
  type CompletionSlot,
} from "@/lib/shell/tabCompletion";
import { useTheme } from "@/components/ThemeProvider";
import { CommandChip } from "./CommandChip";
import styles from "./Terminal.module.css";

const HISTORY_KEY = "portfolio-terminal-history-v1";

type ScrollLine =
  | { kind: "welcome"; segments: WelcomeSegment[] }
  | { kind: "prompt"; text: string }
  | { kind: "stdout"; text: string }
  | { kind: "stderr"; text: string };

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function saveHistory(lines: string[]) {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(lines.slice(-200)));
  } catch {
    /* ignore */
  }
}

export function Terminal({
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
  const { theme, macAppearance, setTheme, setMacAppearance } = useTheme();
  const [cwd, setCwdState] = useState("/home/guest");

  const [historyLog, setHistoryLog] = useState<string[]>(() => loadHistory());

  const setCwdCmd = useCallback(
    (arg: string) => {
      const next = resolveCd(cwd, arg, projects);
      if (!next) return 1;
      setCwdState(next);
      return 0;
    },
    [cwd, projects]
  );

  const openUrl = useCallback((url: string) => {
    if (typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const registry = useMemo(
    () =>
      createShellRegistry({
        site,
        projects,
        getCwd: () => cwd,
        setCwd: setCwdCmd,
        getHistory: () => historyLog,
      }),
    [site, projects, cwd, historyLog, setCwdCmd]
  );

  const byName = useMemo(() => indexCommands(registry), [registry]);

  const completionCtx = useMemo<ShellContext>(
    () => ({
      site,
      projects,
      openUrl,
      theme,
      macAppearance,
      setTheme,
      setMacAppearance,
    }),
    [site, projects, openUrl, theme, macAppearance, setTheme, setMacAppearance]
  );

  const primaryNames = useMemo(
    () =>
      registry
        .filter(isCommandVisibleInCatalog)
        .map((c) => c.name)
        .sort(),
    [registry]
  );

  const [scrollLines, setScrollLines] = useState<ScrollLine[]>(() => [
    { kind: "welcome", segments: welcomeSegments },
  ]);

  const [input, setInput] = useState("");
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [lastExit, setLastExit] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Active tab-completion cycle, if any. Tracks the slot the completer
   * produced plus the current index so repeated Tab presses rotate through
   * the candidates. Cleared whenever the input changes by any means other
   * than the Tab key itself.
   */
  const cycleRef = useRef<
    | (CompletionSlot & { index: number; rendered: string })
    | null
  >(null);
  const resetCycle = useCallback(() => {
    cycleRef.current = null;
  }, []);
  const focusInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }, []);

  const handleWrapClickCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("input, button, a, textarea, select, [contenteditable='true']")) {
        return;
      }
      requestAnimationFrame(focusInput);
    },
    [focusInput]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [scrollLines]);

  const promptText = useMemo(() => {
    const path = cwd.replace(/^\/home\/guest/, "~") || "~";
    return `${site.shellUser}@${site.hostname}:${path}$ `;
  }, [cwd, site.shellUser, site.hostname]);

  const appendLines = useCallback((lines: ScrollLine[]) => {
    setScrollLines((prev) => [...prev, ...lines]);
  }, []);

  const pushHistory = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    setHistoryLog((prev) => {
      const next =
        prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed];
      saveHistory(next);
      return next;
    });
  }, []);

  const runParsed = useCallback(
    (rawLine: string) => {
      let line = rawLine.trim();
      if (!line) return;

      const bang = line.match(/^!(\d+)$/);
      if (bang) {
        const n = Number(bang[1]);
        const expanded = historyLog[n - 1];
        if (!expanded) {
          appendLines([
            {
              kind: "stderr",
              text: `sh: !${bang[1]}: event not found`,
            },
          ]);
          setLastExit(1);
          return;
        }
        line = expanded;
      }

      pushHistory(line);

      const argv = splitArgv(line);
      const cmdName = argv[0]?.toLowerCase();
      const rest = argv.slice(1);
      const opts = parseOpts(rest);

      const cmd = cmdName ? byName.get(cmdName) : undefined;

      appendLines([{ kind: "prompt", text: `${promptText}${line}` }]);

      if (!cmd) {
        appendLines([
          {
            kind: "stderr",
            text: `sh: ${cmdName}: command not found`,
          },
        ]);
        setLastExit(127);
        return;
      }

      const ctx = {
        site,
        projects,
        openUrl,
        theme,
        macAppearance,
        setTheme,
        setMacAppearance,
      };

      let result;
      try {
        result = cmd.run(argv, opts, ctx);
      } catch (e) {
        appendLines([
          {
            kind: "stderr",
            text: e instanceof Error ? e.message : String(e),
          },
        ]);
        setLastExit(1);
        return;
      }

      setLastExit(result.exitCode);

      if (result.action === "clear") {
        setScrollLines([]);
        return;
      }
      if (result.action === "welcome") {
        appendLines([
          {
            kind: "welcome",
            segments: buildWelcomeSegments(site, registry),
          },
        ]);
        return;
      }

      const body: ScrollLine[] = [];
      for (const t of result.stdout) {
        body.push({ kind: "stdout", text: t });
      }
      for (const t of result.stderr) {
        body.push({ kind: "stderr", text: t });
      }
      if (body.length) appendLines(body);
    },
    [
      appendLines,
      byName,
      historyLog,
      openUrl,
      theme,
      macAppearance,
      setTheme,
      setMacAppearance,
      projects,
      promptText,
      pushHistory,
      registry,
      site,
    ]
  );

  const runLine = useCallback(
    (raw: string) => {
      runParsed(raw);
      setInput("");
      setHistIdx(null);
    },
    [runParsed]
  );

  const runLineFromChip = useCallback(
    (cmd: string) => {
      runLine(cmd);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [runLine]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 720px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKonamiEffect = (event: Event) => {
      const custom = event as CustomEvent<{ effectId?: string }>;
      const effectId = custom.detail?.effectId ?? "unknown";
      appendLines([
        {
          kind: "stdout",
          text: "[easteregg] Konami code activated.",
        },
        {
          kind: "stdout",
          text: `[easteregg] Playing effect: ${effectId}.`,
        },
      ]);
    };
    window.addEventListener("konami:effect", onKonamiEffect as EventListener);
    return () => {
      window.removeEventListener(
        "konami:effect",
        onKonamiEffect as EventListener
      );
    };
  }, [appendLines]);

  /** Tab completion */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const forward = !e.shiftKey;

        const active = cycleRef.current;
        if (active && active.rendered === input) {
          const count = active.candidates.length;
          const nextIdx = forward
            ? (active.index + 1) % count
            : (active.index - 1 + count) % count;
          const rendered =
            active.stem + active.candidates[nextIdx] + active.suffix;
          cycleRef.current = { ...active, index: nextIdx, rendered };
          setInput(rendered);
          return;
        }

        const slot = computeCompletionSlot(
          input,
          primaryNames,
          byName,
          completionCtx
        );
        if (!slot) {
          cycleRef.current = null;
          return;
        }

        const startIdx = forward ? 0 : slot.candidates.length - 1;
        const rendered =
          slot.stem + slot.candidates[startIdx] + slot.suffix;
        cycleRef.current =
          slot.candidates.length > 1
            ? { ...slot, index: startIdx, rendered }
            : null;
        setInput(rendered);
        return;
      }

      resetCycle();

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const h = historyLog;
        if (!h.length) return;
        const nextIdx =
          histIdx === null ? h.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(nextIdx);
        setInput(h[nextIdx] ?? "");
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx === null) return;
        const nextIdx = histIdx + 1;
        if (nextIdx >= historyLog.length) {
          setHistIdx(null);
          setInput("");
          return;
        }
        setHistIdx(nextIdx);
        setInput(historyLog[nextIdx] ?? "");
        return;
      }

      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setScrollLines([]);
        return;
      }

      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        setInput("");
        setHistIdx(null);
        appendLines([
          { kind: "prompt", text: `${promptText}^C` },
        ]);
        return;
      }

      if (e.key === "u" && e.ctrlKey) {
        e.preventDefault();
        setInput("");
        return;
      }
    },
    [
      appendLines,
      byName,
      histIdx,
      historyLog,
      input,
      promptText,
      primaryNames,
      completionCtx,
      resetCycle,
    ]
  );

  return (
    <div className={styles.wrap} onClickCapture={handleWrapClickCapture}>
      <div
        ref={scrollRef}
        className={styles.scrollback}
        aria-live="polite"
        aria-label="Terminal output"
      >
        {scrollLines.map((line, i) => (
          <LineBlock
            key={`${i}-${line.kind}`}
            line={line}
            onChip={runLineFromChip}
            welcomeCommandColumnWidth={welcomeCommandColumnWidth}
          />
        ))}
      </div>
      <form
        className={styles.form}
        onSubmit={(ev) => {
          ev.preventDefault();
          runLine(input);
        }}
      >
        <label className={styles.promptLabel} htmlFor="shell-input">
          <span className={styles.prompt}>{promptText}</span>
        </label>
        <input
          ref={inputRef}
          id="shell-input"
          className={styles.input}
          autoComplete="off"
          spellCheck={false}
          value={input}
          onChange={(e) => {
            resetCycle();
            setInput(e.target.value);
          }}
          onKeyDown={onKeyDown}
          onPaste={(e) => {
            resetCycle();
            const t = e.clipboardData.getData("text");
            if (t.includes("\n")) {
              e.preventDefault();
              setInput(t.split(/\n/)[0]?.trimEnd() ?? "");
            }
          }}
          aria-describedby="shell-hint"
        />
      </form>
      <p id="shell-hint" className={styles.hint}>
        $? = {lastExit} · Tab completes · paste uses first line only
      </p>
    </div>
  );
}

function LineBlock({
  line,
  onChip,
  welcomeCommandColumnWidth,
}: {
  line: ScrollLine;
  onChip: (cmd: string) => void;
  welcomeCommandColumnWidth: number;
}) {
  if (line.kind === "welcome") {
    return (
      <div className={styles.welcome}>
        {line.segments.map((seg, j) => {
          if (seg.kind === "plain") {
            return (
              <pre key={j} className={styles.pre}>
                {seg.text}
              </pre>
            );
          }
          if (seg.kind === "heading") {
            return (
              <div key={j} className={styles.subhead}>
                [{seg.text}]
              </div>
            );
          }
          return (
            <div key={j} className={styles.row}>
              <span className={styles.helpIndent} aria-hidden>
                {"  "}
              </span>
              <CommandChip
                command={seg.command}
                onRun={onChip}
                columnWidthCh={welcomeCommandColumnWidth}
              />
              <span className={styles.helpGap} aria-hidden>
                {"  "}
              </span>
              <span className={styles.summary}>{seg.summary}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (line.kind === "prompt") {
    return <pre className={styles.prePrompt}>{line.text}</pre>;
  }

  const cls =
    line.kind === "stderr" ? styles.stderr : styles.stdout;
  return (
    <pre className={`${styles.pre} ${cls}`}>{line.text}</pre>
  );
}

