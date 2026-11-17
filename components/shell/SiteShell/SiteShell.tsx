'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { IconBrandDiscord, IconBrandGithub } from '@tabler/icons-react';
import { ActionIcon, AppShell, Group, NavLink, ScrollArea, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import config from '@/config';
import { isDocsRoute, normalizeRoute } from '@/lib/docs/routes';
import { isMenu, type DocsNode, type TopNavEntry } from '@/lib/docs/types';
import { ColorSchemeControl } from '../../ColorSchemeControl/ColorSchemeControl';
import { MantineFooter } from '../../MantineFooter/MantineFooter';
import { MantineNavBar } from '../../MantineNavBar/MantineNavBar';
import { SidebarTree } from '../SidebarTree/SidebarTree';
import classes from './SiteShell.module.css';

export interface SiteShellProps {
  tree: DocsNode[];
  nav: TopNavEntry[];
  banner?: React.ReactNode;
  children: React.ReactNode;
}

/** The header links, stacked, at the top of the mobile navigation. */
function MobileNav({ nav }: { nav: TopNavEntry[] }) {
  return (
    <>
      {nav.flatMap((entry) =>
        isMenu(entry)
          ? [
              <NavLink key={entry.key} label={entry.title} component="button" childrenOffset="sm">
                {entry.items.map((item) => (
                  <NavLink
                    key={item.key}
                    label={item.title}
                    href={item.href}
                    target={item.newWindow ? '_blank' : undefined}
                    rel={item.newWindow ? 'noopener noreferrer' : undefined}
                  />
                ))}
              </NavLink>,
            ]
          : [
              <NavLink
                key={entry.key}
                label={entry.title}
                href={entry.href}
                target={entry.newWindow ? '_blank' : undefined}
                rel={entry.newWindow ? 'noopener noreferrer' : undefined}
              />,
            ]
      )}
    </>
  );
}

/**
 * The page frame, on Mantine's `AppShell`:
 * - the header on every page;
 * - the docs sidebar on `/docs` routes (on a phone, behind the header's menu button, on every page).
 *
 * The table of contents is not an `AppShell.Aside`: it lives in the docs page, as a sticky column,
 * so the footer can run the whole width right of the sidebar, as on mantine.dev.
 */
export function SiteShell({ tree, nav, banner, children }: SiteShellProps) {
  const pathname = usePathname();
  const route = normalizeRoute(pathname);
  const isDocs = isDocsRoute(route);

  const [opened, { toggle, close }] = useDisclosure(false);
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !opened, desktop: !isDocs },
      }}
      classNames={{ header: classes.header }}
    >
      <AppShell.Header>
        <MantineNavBar nav={nav} burgerOpened={opened} onBurgerClick={toggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppShell.Section hiddenFrom="md" className={classes.mobileNav}>
          <MobileNav nav={nav} />
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} type="hover" className={classes.tree}>
          <SidebarTree
            tree={tree}
            defaultMenuCollapseLevel={config.docs.sidebar.defaultMenuCollapseLevel}
          />
        </AppShell.Section>
        <AppShell.Section className={classes.navbarFooter}>
          <Group justify="space-between">
            <Group gap={4}>
              <Tooltip label="GitHub">
                <ActionIcon
                  component="a"
                  href={`https://github.com/${config.gitHub.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="subtle"
                  color="gray"
                  size="sm"
                  aria-label="GitHub repository"
                >
                  <IconBrandGithub size={16} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Discord">
                <ActionIcon
                  component="a"
                  href="https://discord.com/invite/wbH82zuWMN"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="subtle"
                  color="gray"
                  size="sm"
                  aria-label="Mantine Discord server"
                >
                  <IconBrandDiscord size={16} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <ColorSchemeControl />
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        {banner}
        {children}
        <MantineFooter />
      </AppShell.Main>
    </AppShell>
  );
}
