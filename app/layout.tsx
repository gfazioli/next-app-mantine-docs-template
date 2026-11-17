import '@mantine/core/styles.css';
// !! The order of these imports is important !!
import '@mantine/code-highlight/styles.css';
import '@mantine/spotlight/styles.css';
import '@gfazioli/mantine-border-animate/styles.css';
import '@gfazioli/mantine-marquee/styles.css';
import '@gfazioli/mantine-text-animate/styles.css';
// Mantine theme overrides (page background, heading font)
import '@/theme/global.css';

import { Analytics } from '@vercel/analytics/react';
import { Outfit } from 'next/font/google';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
// !! End of important imports !!

import { Link } from '@/components/Link/Link';
import { Banner } from '@/components/shell/Banner/Banner';
import { DocsSearch } from '@/components/shell/DocsSearch/DocsSearch';
import { SiteShell } from '@/components/shell/SiteShell/SiteShell';
import config from '@/config';
import { getDocs } from '@/lib/docs/content';
import { getTopNav } from '@/lib/docs/top-nav';
import pack from '../package.json';
import { theme } from '../theme';

export const metadata = config.metadata;

// The type of mantine.dev: Outfit for headings (self-hosted by Next), the system stack for
// everything else, which is Mantine's default and costs no download at all.
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  // Not preloaded: on a throttled phone the preload competed with the render-blocking CSS and
  // moved the first paint by about 0.18 s. Headings paint in the size-adjusted fallback and swap.
  preload: false,
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { tree } = await getDocs();
  const { head } = config;

  return (
    <html lang="en" dir="ltr" className={outfit.variable} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript
          nonce={head.mantine.nonce}
          defaultColorScheme={head.mantine.defaultColorScheme}
        />
        <link rel="shortcut icon" href={`${basePath}/favicon.svg`} />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme={head.mantine.defaultColorScheme}>
          <SiteShell
            tree={tree}
            nav={getTopNav()}
            banner={
              <Banner storageKey={`release-notes-${pack.version}`}>
                ✨ v{pack.version} Released -{' '}
                <Link href="/docs/release-notes">See the release notes</Link>
              </Banner>
            }
          >
            {children}
          </SiteShell>
          <DocsSearch />
        </MantineProvider>
        <Analytics />
      </body>
    </html>
  );
}
