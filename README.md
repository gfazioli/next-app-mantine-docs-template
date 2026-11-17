# Mantine Next.js docs template

<div align="center">

[<kbd> <br/> ❤️ If this template has been useful to you or your team, please consider becoming a sponsor <br/> </kbd>](https://github.com/sponsors/gfazioli?o=esc)

</div>

<div align="center">
  <p><img src="https://raw.githubusercontent.com/gfazioli/gfazioli/master/glancecard/next-app-mantine-docs-template.svg" width="880" alt="next-app-mantine-docs-template at a glance, refreshed daily: commits, releases, stars, issues and pull requests, a year of commit activity, the weekly rhythm, languages, latest commits and releases, contributors" /><br>
  <sub>Made with <a href="https://github.com/gfazioli/glancecard">glancecard</a> · refreshed daily</sub></p>
</div>

A [Next.js](https://nextjs.org/) App Router template for MDX documentation sites, built entirely on [Mantine](https://mantine.dev/): no documentation framework in between. The pages are compiled by [`@next/mdx`](https://nextjs.org/docs/app/guides/mdx), the MDX loader Next.js maintains itself, and every piece of the interface is a Mantine component.

## Features

- **Mantine all the way**: `AppShell` for the frame, `NavLink` for the sidebar, `TableOfContents` for the table of contents, `Spotlight` for search, `CodeHighlight` for code, `EmptyState` for the 404 page
- **Code highlighted at build time** with [Shiki](https://shiki.style/), light and dark, shown by Mantine's `CodeHighlight`: no highlighter is downloaded by the browser
- **Search** with [Pagefind](https://pagefind.app/) over the prerendered pages, plus a server search API
- **Nextra-compatible content**: the same `content/` folder and `_meta` files, and `Callout`, `Cards`, `FileTree`, `Steps`, `Tabs`, `ImageZoom` with Nextra's props, imported from `@/components/docs`
- **Two deploy modes**: a server build (Vercel, any Node host) or a static export (GitHub Pages) with an optional base path
- Release notes from GitHub releases, one table-of-contents entry per release
- TypeScript, Storybook, Jest with React Testing Library, oxlint, oxfmt, Stylelint

## Folder structure

- `app` – the App Router: the layout, the home page, `docs/[[...slug]]` for every docs page, the API routes, `_meta.tsx` for the header links
- `content` – the docs: `.mdx` pages and `_meta.ts` files
- `components/docs` – the components pages import
- `components/shell` – header, sidebar, table of contents, search
- `lib` – the docs engine (content loader, page tree, build-time highlighting)
- `config` – the site's settings

## Moving from Nextra

Copy `content/` and `app/_meta.tsx`, and change `from 'nextra/components'` to `from '@/components/docs'`. The URLs stay the same. See the *Moving from Nextra* page of the docs.

## Scripts

- `dev` – the dev server
- `build` – the production build, then the Pagefind index
- `build:static` – a static export to `out/` (set `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` for a GitHub project page)
- `analyze` – bundle analysis with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- `test` – typegen, formatting, lint, types and Jest
- `typecheck`, `lint`, `jest`, `format:write`
- `storybook`, `storybook:build`

## Sponsor

<div align="center">

[<kbd> <br/> ❤️ If this template has been useful to you or your team, please consider becoming a sponsor <br/> </kbd>](https://github.com/sponsors/gfazioli?o=esc)

</div>

Your support helps me:

- Keep the project actively maintained with timely bug fixes and security updates
- Add new features, improve performance, and refine the developer experience
- Expand test coverage and documentation for smoother adoption
- Ensure long‑term sustainability without relying on ad hoc free time
- Prioritize community requests and roadmap items that matter most

Open source thrives when those who benefit can give back—even a small monthly contribution makes a real difference. Sponsorships help cover maintenance time, infrastructure, and the countless invisible tasks that keep a project healthy.

Your help truly matters.

💚 [Become a sponsor](https://github.com/sponsors/gfazioli?o=esc) today and help me keep this project reliable, up‑to‑date, and growing for everyone.
