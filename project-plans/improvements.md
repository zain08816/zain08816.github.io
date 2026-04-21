# Improvement plan — `zain08816.github.io`

**Date:** 2026-04-20
**Scope:** the Next.js 16 static-export portfolio at the repo root.
**Status:** proposal — none of these are blocking; the codebase is healthy today (strict TS, clean lint, clean `npm audit`, clean `SECURITY_AUDIT.md`).

This is a backlog of polish/quality work, ranked roughly by **value ÷ effort**. Each item names the concrete files involved so it can be picked up independently.

---

## High value, low effort

### 1. Add a tiny test suite

There are zero tests today. The repo is full of pure functions that would be cheap to lock down with Vitest:

- `splitArgv`, `parseOpts` — `lib/shell/parser.ts`
- `resolvePath`, `resolveCd`, `listEntries` — `lib/shell/vfs.ts`
- `tabCompleteLine`, `longestCommonPrefix`, `splitForCompletion` — `lib/shell/tabCompletion.ts`
- `parseLinks`, `markdownToHtml` — `lib/projects/loadProjects.ts`
- `isThemeId`, `isMacAppearance` — `lib/themes/types.ts`

A dozen tests would also pin the markdown sanitiser behaviour (`SECURITY_AUDIT.md` §3.2 explicitly recommends this).

**Effort:** ~1 hour. Add `vitest` + `@vitest/coverage-v8` as dev deps; one `vitest.config.ts`; one `*.test.ts` per module above.

---

### 2. Add a PR-validation workflow

`.github/workflows/deploy.yml` only runs on `push: main`. PRs get no signal.

**Action:** add a second workflow (or a `pull_request` trigger on the existing one) that runs:

```yaml
- run: npm ci
- run: npm run lint
- run: npx tsc --noEmit
- run: npm test       # once #1 is in
- run: npm run build
```

**Effort:** ~15 min.

---

### 3. Action the four open security-audit items

From `SECURITY_AUDIT.md` §5 — none of them appear applied yet:

1. **URL allow-list in `parseLinks`** (`lib/projects/loadProjects.ts`, ~10 lines):

   ```ts
   const ALLOWED = /^(https?:|mailto:|\/)/i;
   .filter((l) => ALLOWED.test(l.href));
   ```
2. **`// SECURITY:` comment + test on `markdownToHtml`** to lock in the default `sanitize: true`.
3. **Pin GitHub Actions to commit SHAs** (`actions/checkout`, `actions/setup-node`, `actions/upload-pages-artifact`, `actions/deploy-pages`) and enable Dependabot for `github-actions` + `npm`.
4. **(Optional, ~1 h)** Move the deploy behind Cloudflare Pages / Netlify so a real CSP and `Referrer-Policy`/`Permissions-Policy`/`X-Frame-Options` can be set.

**Effort:** ~40 min for items 1–3.

---

### 4. README contradicts the code

`README.md` claims:

> The default registry only ships `about`, `clear`, and `help`.

But `lib/shell/registry.ts` actually wires:

```
about, stackCmd, themeCmd, clearCmd, slCmd, chaiCmd,
eastereggCmd, fortuneCmd, matrixCmd, welcome, help
```

**Action:** either
- update the README to match reality, or
- actually trim the default registry and move the joke commands into the `lib/commands/easter/` subfolder the README already describes (better for forks).

**Effort:** ~15 min either way.

---

### 5. Wire up the unused VFS so the fake shell answers Linux commands

`Terminal.tsx` builds `setCwdCmd`, threads `getCwd` / `setCwd` / `getHistory` into `RegistryDeps`, and renders a real `~`/`/home/guest` prompt — but `lib/shell/registry.ts` registers **no `cd`, `ls`, `pwd`, `cat`, `whoami`, `echo`, or `history` command.** A visitor who types `ls` in a terminal-themed site gets `command not found`, which is the only real "feels unfinished" moment.

The helpers and even the directory contents already exist in `lib/shell/vfs.ts` (`listEntries(HOME)` returns `["projects", "README"]`, etc.).

**Recommended commands to add** (one file each in `lib/commands/`, then push into `cmds` in `createShellRegistry`):

| Command | Backed by |
|---|---|
| `pwd` | `ctx.cwd` (after item #11) |
| `ls [path]` | `listEntries` |
| `cd [path]` | `setCwd` (already in `RegistryDeps`) |
| `cat README` / `cat README.md` | a constant string from `site.config.ts` |
| `whoami` | `site.shellUser` |
| `echo [args...]` | trivial |
| `history` | `getHistory()` |

Either add them, or strip the unused plumbing in `Terminal.tsx` / `RegistryDeps`.

**Effort:** ~1 hour for all seven.

---

## Medium value

### 6. Persistent terminal history

`HISTORY_KEY = "portfolio-terminal-history-v1"` lives in `sessionStorage` (`components/Terminal.tsx:23,34,45`), so it wipes on tab close. For a portfolio that visitors close and reopen, `localStorage` is friendlier — the audit already vetted size-bounded writes (`slice(-200)`).

**Effort:** ~5 min (one-line swap + bump key to `v2`).

---

### 7. Cache `getAllProjects()`

It's called from `app/page.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, and `app/sitemap.ts`. Each call re-reads + re-parses every Markdown file.

```ts
let cache: Promise<Project[]> | null = null;
export function getAllProjects() {
  return (cache ??= loadAll());
}
```

Cuts build time and avoids divergence if mtimes change mid-build.

**Effort:** ~5 min.

---

### 8. Tab completion is case-inconsistent

In `lib/shell/tabCompletion.ts`:

- First-token matching lowercases the partial (line 39).
- Argument completion uses raw `partial.startsWith(...)` (line 52).

**Action:** make both case-insensitive (or both not). Bonus: implement the conventional **double-Tab** behaviour to *list* candidates instead of just collapsing to the longest common prefix.

**Effort:** ~30 min.

---

### 9. Reduce `registry`/`byName` rebuild churn

In `components/Terminal.tsx` both `useMemo`s depend on `cwd` and `historyLog`, so they rebuild on every accepted command — even commands that don't read either.

**Action:** Move `cwd` / `setCwd` / `history` into `ShellContext` (alongside `theme`/`projects`) and drop them from `RegistryDeps`. Then the `registry` memo only depends on `site`/`projects` and the rebuild churn goes away. This composes well with item #11.

**Effort:** ~30 min.

---

### 10. `site.config.ts` does `readFileSync` at module init

`loadAsciiBannerFromFile()` runs whenever `siteConfig` is imported. Today every consumer is server-side or type-only, but it's a foot-gun: one accidental value import from a `"use client"` file and the bundler will choke trying to inline `node:fs`.

**Action:** lift the banner read into `app/page.tsx` (or `lib/shell/welcome.tsx`) and pass it to `Terminal` via props / `welcomeSegments`. Keep `site.config.ts` pure data.

**Effort:** ~20 min.

---

### 11. Add `cwd`/`history` to `ShellContext`

`ShellContext` (`lib/shell/types.ts`) currently exposes `site`, `projects`, `openUrl`, `theme`, `macAppearance`, `setTheme`, `setMacAppearance` — but not `cwd` or `history`. That's why `RegistryDeps` (`lib/shell/registry.ts`) has to thread `getCwd` / `setCwd` / `getHistory` through closures.

Putting them on `ShellContext` makes `lib/commands/*` self-contained and removes a layer. Prereq for items #5 (`pwd`, `cd`, `history`) and #9 (memo reduction).

**Effort:** ~15 min.

---

### 12. Strict-mode upgrade: `noUncheckedIndexedAccess`

`tsconfig.json` has `strict: true` but not `noUncheckedIndexedAccess`. Turning it on would correctly type:

- `historyLog[n - 1]` and `historyLog[nextIdx]` in `Terminal.tsx`
- `KONAMI_SEQUENCE[seqIndexRef.current]` in `KonamiEffects.tsx`
- `argv[0]?.toLowerCase()` patterns

…as `T | undefined` and force the safety checks you already mostly have. Likely 5-10 fixes across the repo.

**Effort:** ~30 min.

---

### 13. Replace the placeholder `og.png`

`README.md` literally calls it out: *"Replace `public/og.png` with a 1200×630 PNG for Open Graph previews (the default is a tiny placeholder)."* Easy LinkedIn/Twitter preview win.

**Effort:** design time, ~15 min once an image exists.

---

### 14. Syntax highlight code blocks in project pages

`lib/projects/loadProjects.ts` uses `remark-html` straight, so fenced code blocks render as plain `<pre><code>` with no colors.

**Action:** switch the pipeline to `remark-rehype` → `rehype-sanitize` → `rehype-pretty-code` (or `shiki`). All highlighting happens at build time, so still zero JS at runtime.

**Effort:** ~45 min including verifying `dangerouslySetInnerHTML` is still safe.

---

## Lower value, but nice

### 15. Defensive scheme allow-list on `openUrl`

`Terminal.tsx:77` opens any URL its callers hand it. Today only in-tree commands call it with constants, but `SECURITY_AUDIT.md` §3.3 flagged this exact reuse risk — guard with the same `^(https?:|mailto:|\/)/i` allow-list as item #3.1.

**Effort:** ~5 min.

---

### 16. Error boundary around `<Terminal>`

A throwing command currently crashes the whole desktop window (the `try/catch` around `cmd.run` covers thrown `Error`s during the call, but a render-time bug in `LineBlock` would unmount everything).

**Action:** small `class TerminalErrorBoundary` rendering a `[shell crashed — reload]` line keeps the rest of the desktop alive.

**Effort:** ~20 min.

---

### 17. `KonamiEffects` → terminal coupling is one-way

The terminal listens for `konami:effect` and prints two `[easteregg]` lines (`Terminal.tsx:311`), but if the terminal isn't open you get confetti with no log.

**Action:** either drop the log lines or make the effect always toast-style (a small overlay near the menu bar).

**Effort:** ~20 min.

---

### 18. Templating polish for forks

`siteConfig.canonicalUrl`, `metadataBase` (`app/layout.tsx`), `app/sitemap.ts`, and `public/CNAME` all hardcode `zainali.me`. `site.config.example.ts` exists but doesn't help until the rest of the chain reads from `siteConfig`.

**Action:** drive `metadataBase` / sitemap base from `siteConfig.canonicalUrl` (already done for sitemap; layout could use it too) and document the CNAME swap in the README's fork section.

**Effort:** ~20 min.

---

### 19. A11y: scope the focus-stealing `onClickCapture`

`Terminal.tsx:135` re-focuses the input on every desktop click that isn't on a known interactive element. That includes future additions like theme menus or window chrome that aren't `input/button/a/textarea/select/[contenteditable]`.

**Action:** scope it to clicks *inside* the terminal scrollback (`scrollRef.current?.contains(target)`) rather than the wrap.

**Effort:** ~10 min.

---

### 20. Docs cleanup

- `CLAUDE.md` is 11 bytes (essentially empty).
- `AGENTS.md` only carries the Next.js disclaimer.
- `SECURITY_AUDIT.md` and this file live at the repo root.

**Action:** create `docs/` and move `SECURITY_AUDIT.md` + this plan there. Keep root for things contributors will read first (`README.md`, `LICENSE`, `AGENTS.md`).

**Effort:** ~10 min.

---

## Suggested first slice

If picking up just one batch, the highest-leverage combo is:

1. **#4** — fix the README/registry mismatch (15 min).
2. **#11** — add `cwd`/`history` to `ShellContext` (15 min).
3. **#5** — wire up `pwd`, `ls`, `cd`, `cat`, `whoami`, `echo`, `history` (1 h).
4. **#1** — Vitest + a dozen tests covering parser/vfs/tabCompletion/parseLinks/markdownToHtml (1 h).
5. **#2** — PR validation workflow (15 min).

That's ~3 hours and removes the only "feels unfinished" bit a visitor would notice (Linux commands not working) while putting a safety net under the shell.

---

## Out of scope (for now)

- Pipes / redirection / env-var expansion in `lib/shell/parser.ts` — would be neat, but not portfolio-critical.
- Switching off GitHub Pages purely for CSP — only worth it if you hit a real headers requirement.
- Dynamic-import code-splitting for joke commands — bundle is already small.
