export default {
  /**
   * Site metadata, merged into every page's own
   * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   */
  metadata: {
    title: {
      default: 'Mantine Next.js docs template',
      template: '%s | Mantine Next.js docs template',
    },
    description:
      'A Next.js App Router starter for MDX docs built entirely on Mantine 9: sidebar, table of contents, Pagefind search, code highlighting and release notes.',
    // Where the site is published, base path included: the canonical, og:url and sitemap URLs
    // are resolved against it. A static export for GitHub Pages sets NEXT_PUBLIC_SITE_URL (for
    // example https://<user>.github.io/<repo>/); a server build defaults to the Vercel URL.
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://next-app-mantine-docs-template.vercel.app/'
    ),
    keywords: [
      'Mantine',
      'Documentation',
      'Next.js',
      'React',
      'JavaScript',
      'MDX',
      'Markdown',
      'Static Site Generator',
    ],
    generator: 'Next.js',
    applicationName: 'Mantine',
    appleWebApp: {
      title: 'Mantine',
    },
    openGraph: {
      // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
      url: './',
      siteName: 'Mantine',
      locale: 'en_US',
      type: 'website',
    },
    other: {
      'msapplication-TileColor': '#fff',
    },
    twitter: {
      site: 'https://next-app-mantine-docs-template.vercel.app/',
    },
    alternates: {
      // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
      canonical: './',
    },
  },
  /**
   * Docs layout
   */
  docs: {
    /**
     * Base of each page's "Edit this page on GitHub" link: the page's path under `content/` is
     * appended. Set it to an empty string to hide the link.
     */
    editUrlBase: 'https://github.com/gfazioli/next-app-mantine-docs-template/edit/main/content/',
    sidebar: {
      /** Folders deeper than this open only when they hold the current page */
      defaultMenuCollapseLevel: 1,
    },
  },
  /**
   * Main Layout head configuration
   */
  head: {
    mantine: {
      defaultColorScheme: 'light',
      nonce: '8IBTHwOdqNKAWeKl7plt8g==',
    },
  },
  /**
   * Links shared by the header, the sidebar and the footers
   */
  links: {
    discord: 'https://discord.com/invite/wbH82zuWMN',
    /** The Discord link's tooltip and accessible name, in the header and the sidebar */
    discordLabel: 'Mantine Discord server',
    twitter: 'https://twitter.com/gfazioli',
    coffee: 'https://donate.stripe.com/fZu4gy4Tn3b1dgudGx0co00',
    author: 'https://gfazioli.github.io/',
  },

  /**
   * GitHub API configuration
   * @see https://docs.github.com/en/rest/reference/repos#releases
   *
   * The GitHub API token is optional for rate limiting.
   * If you want to use it, create a read-only token: a fine-grained token with
   * public repositories (read-only), or a classic token with no scopes.
   *
   * This information is used to fetch the releases from the GitHub API.
   */
  gitHub: {
    repo: 'gfazioli/next-app-mantine-docs-template',
    apiUrl: 'https://api.github.com',
    releasesUrl: 'https://api.github.com/repos/gfazioli/next-app-mantine-docs-template/releases',
  },

  /**
   * Release notes configuration
   * This is used to link the release notes in the app.
   */
  releaseNotes: {
    url: 'https://github.com/gfazioli/next-app-mantine-docs-template/releases',
    maxReleases: 10,
  },

  /**
   * Search configuration (for pagefind)
   * This is used to configure the search engine API.
   * @see /app/api/search/route.ts
   */
  search: {
    queryKeyword: 'q',
    minQueryLength: 3,
    limitKeyword: 'limit',
    defaultMaxResults: 5,
    excerptLengthKeyword: 'excerptLength',
    defaultExcerptLength: 30,
    defaultLanguage: 'en',
  },
} as const;
