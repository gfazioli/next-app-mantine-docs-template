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

- **`SiteShell`**: Mantine `AppShell`: header (`MantineNavBar`, links from `app/_meta.tsx`), navbar with the `SidebarTree` (`NavLink`) on `/docs` routes and, on phones, everywhere behind the burger. Docs pages get the compact `DocsFooter` (a server component; its Docs column is the sidebar's top level, its Templates column the three siblings), every other page the full `MantineFooter`: the root layout renders both and the shell picks one. Its first element is a "Skip to content" link, on screen only while focused, to `#main-content`, the id on `AppShell.Main`. The phone's navbar closes on any link followed in it, same-page `#` anchors included (menus and folders are buttons and stay open), and once closed it is `visibility: hidden`, out of the tab order (`data-mobile-collapsed`); `SiteShell.behaviour.test.tsx` covers the skip link and the closing; the hidden state is CSS (`SiteShell.module.css`), checked in a browser.
- **Release banner**: inside the fixed `AppShell.Header`, above the 60px navigation row, so it stays in view (Nextra's is sticky only on phones). A `:has([data-site-banner])` rule in `SiteShell.module.css` adds its height to `--app-shell-header-height`/`-offset`; a dismissed banner is hidden before the first paint by its own script, so the header is 60px from the start. Its background is `--site-banner-background` (the blue to violet gradient by default): a site with other colours sets that variable instead of editing `Banner.module.css`.
- **Sidebar collapse** (desktop): the header button or ⌘B / Ctrl+B sets `collapsed.desktop`, kept in `localStorage`; a collapsed navbar is also `visibility: hidden`, out of the tab order. No flash on reload: see `lib/docs/sidebar.ts`. The pre-paint CSS copies the variables AppShell sets for a collapsed navbar; `SiteShell.test.tsx` fails if Mantine changes them.
- **`DocsPage`**: breadcrumbs, the `<article data-docs-article data-pagefind-body>`, previous/next, and the table of contents in a sticky column (not an `AppShell.Aside`, so the footer runs the full width right of the sidebar).
- **`DocsToc`**: Mantine `TableOfContents` over the rendered headings (`use-scroll-spy`); an element with `data-toc-entry` / `data-toc-depth` / `data-toc-value` joins it, and `window.dispatchEvent(new Event('docs:toc-refresh'))` re-reads the page (the release notes do both).
- **Code blocks**: `components/docs/CodeBlock` highlights with Shiki **on the server at build time** (dual theme, `--shiki-light` / `--shiki-dark`, picked by `data-mantine-color-scheme` in CSS) and hands the HTML to Mantine's `CodeHighlight` / `CodeHighlightTabs` through a synchronous per-block adapter: no highlighter ships to the browser. `shiki` is in Next's default server externals.
- **Search**: `DocsSearch` is Mantine `Spotlight` over Pagefind, loaded in the browser from `${basePath}/_pagefind/pagefind.js` on the first search. `/api/search` is the same index on the server. Enter with nothing selected opens the first result (`select-first-on-enter.ts`): Spotlight selects the first action when the query changes, before Pagefind's results arrive.
- **Colours and labels a site changes without editing the engine**: the TOC and highlighted code lines follow `theme.primaryColor`; the banner reads `--site-banner-background`; the Discord link's label is `config.links.discordLabel`. A docs page sets `description` only when it has one, so pages without front matter (Nextra content, often) inherit the site's.
- **`components/docs/index.ts`** is what pages import: `Callout`, `Cards`, `FileTree`, `Steps`, `Tabs`, `ImageZoom`, with Nextra's props.
- **RSC rule**: a server component passing `component={Link}` must use `@/components/Link/Link` (a client re-export of `next/link`), and must import Mantine sub-components by name (`TabsList`, not `Tabs.List`): statics of a client component do not cross the boundary.

### The home page and the site footer (shared with the sibling templates)

- **The same files in the three templates** (`next-app-mantine-docs-template`, `next-app-nextra-template`, `next-app-fumadocs-template`): `components/Home/`, `components/Motion/`, `components/Sponsors/`, `components/MantineFooter/`, `components/Link/`, `config/templates.ts` and `theme/site.css`. Change them in all three together and compare with `diff -r`. `config/site.ts` is the one line that says which template a repository is; everything that differs (engine name, its colours, repository and demo links, the features) is read from it.
- **`HomePage`** is a server component and renders no `<main>`: `app/page.tsx` or the engine's layout provides it. Its sections: `Hero` (with `DocsWindow`, a docs page drawn in CSS), `Stack`, `Features`, `Templates`, `Extensions`, `Sponsors`, `FinalCta`. The look is a blueprint: graph paper at the top of the page (fine lines, a heavier one every fifth; `.page::before`, whole through the hero and the stack, then covered little by little by a gradient of the paper's own colour until the page is plain), a registration mark at each corner of every drawing (`home.marks`: the hero's sheet, the stack, a group of cards, the closing call), labels in monospace capitals, dimension lines on the hero's window and line drawings in the cards (`Sketch`, inline SVG) — all CSS or inline SVG, painted once. Colours come from `theme/site.css` (`--site-*`, on `body` because of `light-dark()`); `data-site-paper` on the page's root element switches the whole document to paper through `:root:has()` (a pale paper in light, a deep one in dark: `--mantine-color-body`, the dark default-variant colours and the `--site-*` tokens), so the header and the footer follow and every other page keeps Mantine's colours. The attribute's value is which paper, and it is what tells the three templates apart: `paper` in `config/templates.ts` (`blue` here, `violet` for Nextra, `orange` for Fumadocs), each a set of the same tokens in `theme/site.css` (paper, ink, `--site-fill` for filled buttons and tags, `--site-tint`, the heading gradient); `beam` there is the two colours of the light on a rim. Same layout on all three. `Sponsors` and `MantineFooter` are client components on purpose: as server components their links and icon paths were sent twice in every document, as markup and again in the RSC payload (7 KiB gzipped on the home page, 5 on every docs page).
- **Live numbers** (`components/Home/stats.ts`): each template card shows its repository's GitHub stars, the hero a "Star" link to this template's own repository with the same count (`stats.stars[site.key]`: no second request; without a count the link stays, with no figure), the Extensions section the npm downloads of the last month summed over the listed `@gfazioli/mantine-*` packages (one request per package: npm's bulk endpoint refuses scoped names). `getHomeStats()` runs on the server with `next: { revalidate: 3600 }` and an 8 s timeout, with `GITHUB_TOKEN` when it is set and again without it when GitHub refuses the token (as `/api/github-releases` does); the page component (`app/page.tsx`) awaits it and passes `stats` to `HomePage`, which stays synchronous, so tests and stories never reach the network. A number that could not be fetched is left out, never shown as zero; a static export keeps the build's numbers.
- **`Stack` is the versions block**: every number is read from `package.json` at build time, never typed. Six packages get a figure (`RollingNumber`, an odometer), the other dependencies a tag with the declared range.
- **Motion rules**: only `transform` and `opacity` move. A hover's colour fade (background, border or text colour, 200 ms at most, on hover only) is not motion and stays, with or without Reduce Motion. The hero's `h1` is the page's largest paint: it has no entrance, and nothing in its column does. Scroll reveals (`components/Motion`) hide nothing in the served HTML: a scope is armed by script only when it is off screen, then revealed once, both by an IntersectionObserver (`useReveal` never measures an element, which would force the layout of skipped sections). Everything stands still under `prefers-reduced-motion`.
- **First render**: the sections under the stack carry `RENDER_LATER` and are `content-visibility: auto` until `RenderLater` hands them back, one per idle period after the load. The first paint skips their style and layout (about 80 ms on a throttled phone), and a full-page capture taken after the load still shows them.
- **Text contrast**: `--site-text` and `--site-accent` hold 4.5:1 on the page, a card and the footer in both schemes; filled buttons use `blue.8` / `red.8` (white on Mantine's default `blue.6` is 3.5:1).
- **BorderAnimate** (the rim of the hero window and of the current template's card) uses `beamMode="wedge"` with `colorStops`, the one beam that animates a rotation and not a custom property. `trigger="inView"` shows and runs it only while it is on screen (3.0.13 or later: up to 3.0.12 the border stayed at opacity 0, and these templates forced it with `--border-animate-active: 1 !important` on `.beam`). It ignores Reduce Motion unless the theme sets `respectReducedMotion`, hence the media query on `.beam`: no animation and no fade, as the extension does with that flag.

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
