# zain08816.github.io — desktop portfolio

A static [Next.js](https://nextjs.org/) personal site styled as a tiny desktop environment. Draggable windows for a **Terminal**, **Projects**, and **About**, a macOS-style menu bar, three swappable chrome themes, and Markdown-powered project pages. Deploys to [GitHub Pages](https://pages.github.com/) via `.github/workflows/deploy.yml`.

## Highlights

- **Desktop shell** — open/close/minimize/maximize, drag windows, focus stacking (`components/DesktopEnvironment.tsx`).
- **Themes** — Windows 95, Mac System 7, macOS (light/dark). Picked at build time via `siteConfig.defaultTheme` and switchable at runtime through the `theme` command or menu bar.
- **Terminal** — history, tab completion, piping/chaining handled in `lib/shell/`. Commands live in `lib/commands/` and are registered in `lib/shell/registry.ts`. Commands can be marked `hidden` to keep them out of `help` / welcome / tab completion until surfaced with `help --hidden`.
- **Markdown projects** — one file per project in `content/projects/*.md` (frontmatter + body). Slugs drive `/projects/[slug]/`.
- **Easter eggs** — joke commands (`sl`, `chai`, `fortune`, `easteregg`) plus hidden ones (`matrix`, `konami`). The Konami code (or the hidden `konami` command) rolls a random effect from a pool of 10: confetti, matrix rain, retro lives-up, CRT glitch, gravity flip, color invert, boot rewind, cursor multiplier, starfield warp, and sprite walk (`lib/konami/effects.ts`, `components/KonamiEffects.tsx`). `easteregg` drops a random hint toward any of them.
- **Matrix rain overlay** — `components/MatrixRain.tsx` renders a full-screen katakana/binary rain with red/blue/green variants, used by both `matrix --redpill|--bluepill` and the Konami `matrix-rain` effect.
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

Change the first-paint theme via `defaultTheme` in `site.config.ts`. `macos` additionally honors `defaultMacAppearance` (`"light"` | `"dark"`). Users can switch themes from the menu bar or via the terminal; the choice is persisted to `localStorage`.

In the terminal:

```bash
theme                     # show current theme + available ids
theme list                # pretty-print ids and labels
theme win95               # switch theme
theme macos dark          # switch to macOS + set appearance in one go
theme appearance light    # update macOS appearance preference only
```

## Terminal commands

Default registry (see `lib/shell/registry.ts`):

| Command     | Aliases | Purpose                              |
| ----------- | ------- | ------------------------------------ |
| `about`     |         | Short bio + skills                   |
| `stack`     |         | Tech stack summary                   |
| `theme`     |         | View / switch theme + macOS appearance |
| `clear`     |         | Clear the screen (also `Ctrl+L`)     |
| `welcome`   |         | Reprint the welcome banner           |
| `help`      | `man`   | List commands with summaries (`--hidden` to include hidden) |
| `sl`        |         | Steam locomotive                     |
| `chai`      |         | `¯\_(ツ)_/¯`                         |
| `fortune`   |         | Random fortune line                  |
| `easteregg` | `egg`   | Random hint toward a hidden command  |

Hidden commands (omitted from `help`, the welcome banner, and tab completion — run `help --hidden` to reveal them):

| Command   | Aliases | Purpose                                       |
| --------- | ------- | --------------------------------------------- |
| `matrix`  |         | Matrix rain overlay; `--redpill` / `--bluepill` branches |
| `konami`  | `kc`    | Manually trigger a Konami effect (`konami --list`, `konami <id>`, `konami --random`) |

Shortcuts: **Tab** completes command names · **↑/↓** history · **Ctrl+L** clears the screen. Multi-line clipboard pastes use only the **first line**.

### Konami effects

The Konami code (↑ ↑ ↓ ↓ ← → ← → B A) picks one of the effects in `lib/konami/effects.ts` at random. The hidden `konami` command exposes the same pool for manual testing:

```bash
konami --list           # show all effect ids
konami crt-glitch       # trigger a specific effect
konami --random         # or just `konami` — roll a random one
```

Current pool: `confetti`, `matrix-rain`, `lives-up`, `crt-glitch`, `gravity-flip`, `invert`, `boot-rewind`, `cursor-multiplier`, `starfield-warp`, `sprite-walk`.

## Adding a command

1. Create `lib/commands/mycommand.ts`:

```typescript
import type { CommandDef } from "@/lib/shell/types";

export const mycommand: CommandDef = {
  name: "mycommand",
  aliases: ["mc"],
  category: "fun",
  summary: "Does something",
  usage: "mycommand [--help]",
  // hidden: true,           // omit from help / welcome / completion
  // args: [["--foo", "--bar"]], // per-position completion candidates
  run(_argv, opts, _ctx) {
    if (opts.help) {
      return { stdout: ["usage: mycommand"], stderr: [], exitCode: 0 };
    }
    return { stdout: ["ok"], stderr: [], exitCode: 0 };
  },
};
```

2. Register it in `lib/shell/registry.ts` by importing and pushing it into the `cmds` array **before** the `help` line (so `help` sees it).

If your command needs cwd / history / site config, export a factory `(deps: RegistryDeps) => CommandDef` and invoke it in `createShellRegistry`. See `CommandDef` in `lib/shell/types.ts` for the full shape (aliases, `hidden`, `args` for tab completion, or a fully custom `complete()`).

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
components/         DesktopEnvironment, AppWindow, Terminal, MenuBar,
                    KonamiEffects, MatrixRain, …
content/            ascii-banner.txt, projects/*.md
lib/
  commands/         Terminal command implementations
  desktop/          Desktop apps + icons
  konami/           Konami effect ids + event types
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
