import type { MetadataRoute } from 'next';
import config from '@/config';
import { getDocs } from '@/lib/docs/content';

// Static, so a static export writes it to out/sitemap.xml.
export const dynamic = 'force-static';

const SITE_URL = config.metadata.metadataBase.href;
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

// Resolved relative to metadataBase ("./docs/…"), which keeps a base path in it: an absolute
// "/docs/…" would drop it. A static export serves every page with a trailing slash.
const toUrl = (route: string) => {
  const path = isStaticExport && route !== '/' ? `${route}/` : route;
  return new URL(`.${path}`, SITE_URL).href;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages } = await getDocs();
  return ['/', ...pages.map((page) => page.route)].map((route) => ({ url: toUrl(route) }));
}
