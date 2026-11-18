import { HomePage } from '@/components/Home/HomePage';
import { getHomeStats } from '@/components/Home/stats';

// The shell's AppShell.Main is the page's <main>. The live numbers (GitHub stars, npm downloads)
// are fetched here, on the server, and cached for an hour: a server build regenerates the page
// with them, a static export keeps the build's.
export default async function Page() {
  return <HomePage stats={await getHomeStats()} />;
}
