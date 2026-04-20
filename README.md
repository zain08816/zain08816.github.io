# zain08816.github.io — desktop portfolio

A static [Next.js](https://nextjs.org/) personal site styled as a tiny desktop environment. Draggable windows for a **Terminal**, **Projects**, and **About**, a macOS-style menu bar, three swappable chrome themes, and Markdown-powered project pages. Deploys to [GitHub Pages](https://pages.github.com/) via `.github/workflows/deploy.yml`.

## Highlights

- **Desktop shell** — open/close/minimize/maximize, drag windows, focus stacking (`components/DesktopEnvironment.tsx`).
- **Themes** — Windows 95, Mac System 7, macOS (light/dark). Picked at build time via `siteConfig.defaultTheme` and switchable at runtime through the `theme` command or menu bar.
- **Terminal** — history, tab completion, piping/chaining handled in `lib/shell/`. Commands live in `lib/commands/` and are registered in `lib/shell/registry.ts`.
- **Markdown projects** — one file per project in `content/projects/*.md` (frontmatter + body). Slugs drive `/projects/[slug]/`.
- **Easter eggs** — joke/hidden commands (`sl`, `coffee`, `fortune`, `matrix`, `easteregg`) plus a classic Konami code effect (`components/KonamiEffects.tsx`). `easteregg` drops a random hint toward any of them.
- **Fully static** — `output: "export"` in `next.config.ts`; build produces `out/`.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # static export in out/
npm run lint
```

## Edit your content

1. **`site.config.ts`** — name, hostname, shell user, menu bar entries, social links, MOTD, bio, skills, SEO, default theme, welcome mode.
2. **`content/projects/*.md`** — one file per project (frontmatter + Markdown body). Slugs map to `/projects/[slug]/`.
3. **`content/ascii-banner.txt`** — optional ASCII art shown in the terminal welcome; delete the file or leave it empty to skip.
4. **`lib/commands/`** — add or remove shell commands (see **Adding a command**).

A starter `site.config.example.ts` is checked in as a reference.

## Themes

Three chrome themes are defined under `app/themes/` and registered in `lib/themes/constants.ts`:

| Id        | Label        |
| --------- | ------------ |
| `win95`   | Windows 95   |
| `system7` | Mac System 7 |
| `macos`   | macOS (light/dark) |

Change the first-paint theme via `defaultTheme` in `site.config.ts`. `macos` additionally honors `defaultMacAppearance` (`"light"` | `"dark"`). Users can switch themes from the menu bar or via `theme <id>` in the terminal; the choice is persisted to `localStorage`.

## Terminal commands

Default registry (see `lib/shell/registry.ts`):

| Command     | Purpose                              |
| ----------- | ------------------------------------ |
| `about`     | Short bio + skills                   |
| `stack`     | Tech stack summary                   |
| `theme`     | List / switch themes                 |
| `clear`     | Clear the screen (also `Ctrl+L`)     |
| `welcome`   | Reprint the welcome banner           |
| `help`      | List commands with summaries         |
| `sl`        | Steam locomotive                     |
| `coffee`    | `¯\_(ツ)_/¯`                         |
| `fortune`   | Random fortune line                  |
| `matrix`    | Short matrix rain                    |
| `easteregg` | Random hint toward a hidden command  |

Shortcuts: **Tab** completes command names · **↑/↓** history · **Ctrl+L** clears the screen. Multi-line clipboard pastes use only the **first line**.

## Adding a command

1. Create `lib/commands/mycommand.ts`:

```typescript
import type { CommandDef } from "@/lib/shell/types";

export const mycommand: CommandDef = {
  name: "mycommand",
  category: "fun",
  summary: "Does something",
  usage: "mycommand [--help]",
  run(_argv, opts, _ctx) {
    if (opts.help) {
      return { stdout: ["usage: mycommand"], stderr: [], exitCode: 0 };
    }
    return { stdout: ["ok"], stderr: [], exitCode: 0 };
  },
};
```

2. Register it in `lib/shell/registry.ts` by importing and pushing it into the `cmds` array **before** the `help` line (so `help` sees it).

If your command needs cwd / history / site config, export a factory `(deps: RegistryDeps) => CommandDef` and invoke it in `createShellRegistry`.

## GitHub Pages

- Repo should be **`<username>.github.io`** (user site) for apex hosting — this one is `zain08816.github.io`.
- **`public/CNAME`** contains `zainali.me`. In GitHub: **Settings → Pages → Custom domain**, then **Enforce HTTPS**.
- DNS: apex **A** records to GitHub Pages IPs (or **ALIAS** to `zain08816.github.io`); **www** **CNAME** to `zain08816.github.io`.

### Forking as a **project** site (`username.github.io/repo/`)

Set `basePath` and `assetPrefix` in `next.config.ts` to `/your-repo-name`. Use `withBasePath()` from `lib/shell/withBasePath.ts` for any raw `fetch` / `<img>` paths (Next `<Link>` handles the base path automatically).

## OG / social preview

Replace [`public/og.png`](public/og.png) with a **1200×630** PNG. The shipped image is a small placeholder.

## Project layout

```
app/                Next.js App Router (pages, themes, sitemap, 404)
components/         DesktopEnvironment, AppWindow, Terminal, MenuBar, …
content/            ascii-banner.txt, projects/*.md
lib/
  commands/         Terminal command implementations
  desktop/          Desktop apps + icons
  projects/         Markdown loader + types
  shell/            Parser, registry, vfs, tab completion, welcome
  themes/           Theme ids + storage keys
public/             Static assets (CNAME, og.png, fonts, icons)
site.config.ts      Site-wide config
```

## Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Development server       |
| `npm run build`   | Static export to `out/`  |
| `npm run start`   | Serve a built app        |
| `npm run lint`    | ESLint                   |

## License

MIT — see [LICENSE](./LICENSE).
