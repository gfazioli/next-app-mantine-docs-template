import { render, screen, userEvent, within } from '@/test-utils';
import type { DocsNode, TopNavEntry } from '@/lib/docs/types';
import { SiteShell } from './SiteShell';

jest.mock('next/navigation', () => ({
  usePathname: () => '/docs',
  useRouter: () => ({ push: jest.fn() }),
}));

const tree: DocsNode[] = [{ kind: 'page', key: 'index', title: 'Introduction', route: '/docs' }];

// A same-page link, as a site's "Support → Sponsor" pointing at its footer's sponsors section
const nav: TopNavEntry[] = [
  {
    key: 'support',
    title: 'Support',
    items: [{ key: 'sponsor', title: 'Sponsor', href: '#sponsors', newWindow: false }],
  },
];

function renderShell() {
  render(
    <SiteShell tree={tree} nav={nav} docsFooter={<footer>Docs</footer>} siteFooter={<footer />}>
      <p>Page</p>
    </SiteShell>
  );
  return document.querySelector<HTMLElement>('.mantine-AppShell-navbar')!;
}

describe('SiteShell', () => {
  it('opens on a skip link to the main landmark', () => {
    renderShell();
    const focusable = document.querySelectorAll('a[href], button');
    expect(focusable[0]).toHaveAttribute('href', '#main-content');
    expect(document.querySelector('main')).toHaveAttribute('id', 'main-content');
  });

  it('closes the phone navbar when a link in it is followed, even to the same page', async () => {
    const navbar = renderShell();
    expect(navbar).toHaveAttribute('data-mobile-collapsed');

    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(navbar).not.toHaveAttribute('data-mobile-collapsed');

    // A menu group is a button: it opens in place and keeps the navbar open
    await userEvent.click(within(navbar).getByRole('button', { name: /Support/ }));
    expect(navbar).not.toHaveAttribute('data-mobile-collapsed');

    // `hidden`: jsdom never ends Collapse's transition, so the group stays display: none here
    await userEvent.click(within(navbar).getByRole('link', { name: 'Sponsor', hidden: true }));
    expect(navbar).toHaveAttribute('data-mobile-collapsed');
  });
});
