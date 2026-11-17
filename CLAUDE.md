# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A **Next.js 16 + Mantine 9** template for MDX documentation sites, with no documentation framework: the pages are compiled by `@next/mdx` and every piece of the interface is a Mantine component. It replaces the Nextra template for the Mantine Extensions sites, and reads Nextra's content layout unchanged (`content/`, `_meta` files, the same component names and props).

## Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | Next.js dev server (Turbopack) |
| `yarn build` | Production build, then the Pagefind index (`build:pagefind`) |
| `yarn build:static` | Static export to `out/` (GitHub Pages), with its Pagefind index |
| `yarn test` | Full suite: typegen, oxfmt, oxlint + stylelint, typecheck, jest |
| `yarn jest` | Jest only |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn format:write` | oxfmt on every TS/TSX/CSS file |
| `yarn storybook` | Storybook on port 6006 |
| `yarn analyze` | Bundle analysis |

## Architecture

### The docs engine (`lib/docs/`, `lib/mdx/`, `next.config.mjs`)

- **`@next/mdx`** compiles `content/**/*.mdx`. Under Turbopack every remark/rehype plugin is a **string** (a package name, or an absolute path for a local plugin: `@next/mdx` resolves names from its own folder, so a relative path fails): `remark-gfm`, `remark-frontmatter` + `remark-mdx-frontmatter` (the `frontmatter` export), `rehype-slug`, and the local `lib/mdx/rehype-code-meta.mjs` (keeps the fence meta on the `<pre>` as `data-meta`).
- **`lib/docs/content.ts`** (server, build time) reads `content/` and the `_meta` files into the sidebar tree and the page list. `_meta` files are imported by their real file name (`@/content/${dir}${file}`): a dynamic import without the extension matched nothing under Turbopack. Pages are `.mdx` only: a dynamic import whose pattern matches no file is a build error.
- **`app/docs/[[...slug]]/page.tsx`** imports the page with `import(\`@/content/${path}.mdx\`)` and `dynamicParams = false`: every page is prerendered, anything else is a 404.
- **`lib/docs/routes.ts`** is shared by server and client (no `node:fs`): keep it that way.

### The interface (`components/shell/`, `components/docs/`)

- **`SiteShell`**: Mantine `AppShell`: header (`MantineNavBar`, links from `app/_meta.tsx`), navbar with the `SidebarTree` (`NavLink`) on `/docs` routes and, on phones, everywhere behind the burger. Docs pages get the compact `DocsFooter` (a server component; its Docs column is the sidebar's top level), every other page the full `MantineFooter`: the root layout renders both and the shell picks one.
- **Release banner**: inside the fixed `AppShell.Header`, above the 60px navigation row, so it stays in view (Nextra's is sticky only on phones). A `:has([data-site-banner])` rule in `SiteShell.module.css` adds its height to `--app-shell-header-height`/`-offset`; a dismissed banner is hidden before the first paint by its own script, so the header is 60px from the start.
- **Sidebar collapse** (desktop): the header button or ⌘B / Ctrl+B sets `collapsed.desktop`, kept in `localStorage`; a collapsed navbar is also `visibility: hidden`, out of the tab order. No flash on reload: see `lib/docs/sidebar.ts`. The pre-paint CSS copies the variables AppShell sets for a collapsed navbar; `SiteShell.test.tsx` fails if Mantine changes them.
- **`DocsPage`**: breadcrumbs, the `<article data-docs-article data-pagefind-body>`, previous/next, and the table of contents in a sticky column (not an `AppShell.Aside`, so the footer runs the full width right of the sidebar).
- **`DocsToc`**: Mantine `TableOfContents` over the rendered headings (`use-scroll-spy`); an element with `data-toc-entry` / `data-toc-depth` / `data-toc-value` joins it, and `window.dispatchEvent(new Event('docs:toc-refresh'))` re-reads the page (the release notes do both).
- **Code blocks**: `components/docs/CodeBlock` highlights with Shiki **on the server at build time** (dual theme, `--shiki-light` / `--shiki-dark`, picked by `data-mantine-color-scheme` in CSS) and hands the HTML to Mantine's `CodeHighlight` / `CodeHighlightTabs` through a synchronous per-block adapter: no highlighter ships to the browser. `shiki` is in Next's default server externals.
- **Search**: `DocsSearch` is Mantine `Spotlight` over Pagefind, loaded in the browser from `${basePath}/_pagefind/pagefind.js` on the first search. `/api/search` is the same index on the server.
- **`components/docs/index.ts`** is what pages import: `Callout`, `Cards`, `FileTree`, `Steps`, `Tabs`, `ImageZoom`, with Nextra's props.
- **RSC rule**: a server component passing `component={Link}` must use `@/components/Link/Link` (a client re-export of `next/link`), and must import Mantine sub-components by name (`TabsList`, not `Tabs.List`): statics of a client component do not cross the boundary.

### Two deploy modes

- Server build (Vercel): the default.
- `NEXT_PUBLIC_STATIC_EXPORT=1` (`yarn build:static`): `output: 'export'`, `trailingSlash`, optional `NEXT_PUBLIC_BASE_PATH`, and `NEXT_PUBLIC_SITE_URL` for `metadataBase` (canonical, og:url, sitemap). The API routes are named `route.server.ts`: the server build lists `server.ts` among the page extensions, the static export does not, so they drop out of the export without touching any file.

### Theme

- One colour scheme system, Mantine's (`config.head.mantine.defaultColorScheme`). No next-themes.
- `cursorType: 'pointer'` in `theme.ts`: Mantine's default (`'default'`) gives its interactive components, links rendered by them included (`NavLink`, `Anchor`, the table of contents), the arrow cursor.
- The mantine.dev look: Outfit for headings through `next/font` (`--font-outfit`), the system stack for text, Mantine's body colours.

### CSS import order

In `app/layout.tsx`: `@mantine/core/styles.css`, then `@mantine/code-highlight` and `@mantine/spotlight`, then the extensions' styles, then `theme/global.css`.

## Tooling

- **Formatter**: oxfmt (`.oxfmtrc.json`). **Linter**: oxlint (ignores the generated `public/_pagefind/`) + stylelint
- **TypeScript**: 6.x. **Package manager**: Yarn 4. Do not use npm or pnpm.
- Never put `{` or `}` in a CSS comment.
