"use client";

import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { findTool, TOOLS } from "@/lib/tools/catalog";
import { toolPath } from "@/lib/tools/paths";
import { TOOL_CATEGORIES } from "@/lib/tools/types";
import styles from "./ToolsApp.module.css";

export function ToolsApp({
  initialToolId,
  linkTools = false,
  hideHeader = false,
}: {
  initialToolId?: string;
  /** Tool names link to /tools/[id]/ so each tool has its own URL. */
  linkTools?: boolean;
  hideHeader?: boolean;
}) {
  const [toolId, setToolId] = useState(() =>
    initialToolId && findTool(initialToolId)
      ? initialToolId
      : (TOOLS[0]?.id ?? "json-format")
  );
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const tool = findTool(toolId) ?? TOOLS[0];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.blurb.toLowerCase().includes(q) ||
        item.category.includes(q)
    );
  }, [query]);

  async function run() {
    if (!tool) return;
    setNotice(null);
    if (!tool.generates && input.length === 0) {
      setError("Enter some text first.");
      setOutput("");
      return;
    }
    setRunning(true);
    const result = await tool.run(input);
    setRunning(false);
    if (result.ok) {
      setOutput(result.output);
      setError(null);
    } else {
      setOutput("");
      setError(result.error);
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setNotice("Copied");
    } catch {
      outputRef.current?.focus();
      outputRef.current?.select();
      setNotice("Select the output and copy it manually");
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void run();
    }
  }

  if (!tool) return null;

  return (
    <div className={styles.root} onKeyDown={onKeyDown}>
      <aside className={styles.sidebar}>
        <label className={styles.filterLabel}>
          <span className="visually-hidden">Filter tools</span>
          <input
            className={styles.filter}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter tools"
            type="search"
          />
        </label>
        <div
          className={styles.list}
          role={linkTools ? undefined : "listbox"}
          aria-label="Tools"
        >
          {TOOL_CATEGORIES.map((category) => {
            const items = visible.filter((item) => item.category === category.id);
            if (items.length === 0) return null;
            return (
              <div key={category.id} className={styles.group}>
                <div className={styles.groupLabel}>{category.label}</div>
                {items.map((item) => {
                  const active = item.id === tool.id;
                  const className = active ? styles.toolBtnActive : styles.toolBtn;
                  if (linkTools) {
                    return (
                      <Link
                        key={item.id}
                        href={toolPath(item.id)}
                        className={className}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={className}
                      onClick={() => {
                        setToolId(item.id);
                        setOutput("");
                        setError(null);
                        setNotice(null);
                      }}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            );
          })}
          {visible.length === 0 && (
            <p className={styles.empty}>No tools match.</p>
          )}
        </div>
      </aside>

      <section className={styles.workspace} aria-label={tool.name}>
        {!hideHeader && (
          <header className={styles.header}>
            <h2 className={styles.title}>{tool.name}</h2>
            <p className={styles.blurb}>{tool.blurb}</p>
          </header>
        )}

        {!tool.generates && (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Input</span>
            <textarea
              className={styles.area}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={tool.placeholder}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </label>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => void run()}
            disabled={running}
          >
            {tool.actionLabel}
          </button>
          {tool.sample && (
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                setInput(tool.sample);
                setOutput("");
                setError(null);
                setNotice(null);
              }}
            >
              Sample
            </button>
          )}
          <button
            type="button"
            className={styles.btn}
            onClick={() => void copyOutput()}
            disabled={!output}
          >
            Copy
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setInput(output);
              setOutput("");
              setError(null);
              setNotice(null);
            }}
            disabled={!output || tool.generates}
          >
            Use as input
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setInput("");
              setOutput("");
              setError(null);
              setNotice(null);
            }}
          >
            Clear
          </button>
          <span className={styles.hint}>Ctrl/⌘ + Enter</span>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {notice && !error && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Output</span>
          <textarea
            ref={outputRef}
            className={styles.area}
            value={output}
            readOnly
            spellCheck={false}
            aria-label={`${tool.name} output`}
          />
        </label>
      </section>
    </div>
  );
}
