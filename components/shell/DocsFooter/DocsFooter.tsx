import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandMantine,
  IconBrandX,
  IconCoffee,
  IconHeartFilled,
} from '@tabler/icons-react';
import { ActionIcon, Anchor, Box, Button, Group, Stack, Text, Tooltip } from '@mantine/core';
import { EngravedDivider } from '@/components/EngravedDivider/EngravedDivider';
import { Link } from '@/components/Link/Link';
import config from '@/config';
import { site } from '@/config/site';
import { HUB_URL } from '@/config/templates';
import type { DocsNode } from '@/lib/docs/types';
import packageJson from '../../../package.json';
import { resources, templateLinks } from '../../MantineFooter/links';
import classes from './DocsFooter.module.css';

interface FooterLink {
  key: string;
  title: React.ReactNode;
  href: string;
  /** This very site, among its siblings */
  current?: boolean;
}

/** The three sibling templates at their live demos, then the Hub: as in the site footer. */
const TEMPLATES: FooterLink[] = [
  ...templateLinks,
  { key: 'hub', title: 'Mantine Extensions Hub', href: HUB_URL },
];

/** The first page under a node: where a top-level folder of the sidebar leads. */
function firstRoute(node: DocsNode): string | undefined {
  if (node.kind === 'page') {
    return node.route;
  }
  if (node.kind === 'folder') {
    for (const child of node.children) {
      const route = firstRoute(child);
      if (route) {
        return route;
      }
    }
  }
  return undefined;
}

/** The top level of the sidebar, so every site's footer lists its own docs. */
function docsLinks(tree: DocsNode[], limit = 5): FooterLink[] {
  return tree
    .map((node) => ({ key: node.key, title: node.title, href: firstRoute(node) ?? '' }))
    .filter((link) => link.href !== '')
    .slice(0, limit);
}

function Column({
  title,
  links,
  external,
}: {
  title: string;
  links: FooterLink[];
  external?: boolean;
}) {
  return (
    <Stack gap={8} component="nav" aria-label={title}>
      <Text className={classes.columnTitle}>{title}</Text>
      {links.map((link) => (
        <Group key={link.key} gap={8} wrap="nowrap">
          <Anchor
            href={link.href}
            className={classes.link}
            aria-current={link.current ? 'page' : undefined}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { component: Link })}
          >
            {link.title}
          </Anchor>
          {link.current && <span className={classes.current}>This site</span>}
        </Group>
      ))}
    </Stack>
  );
}

const SOCIAL = [
  {
    label: 'GitHub repository',
    href: `https://github.com/${config.gitHub.repo}`,
    icon: <IconBrandGithub size={18} stroke={1.5} />,
  },
  {
    label: 'Mantine Discord server',
    href: config.links.discord,
    icon: <IconBrandDiscord size={18} stroke={1.5} />,
  },
  {
    label: 'X (Twitter)',
    href: config.links.twitter,
    icon: <IconBrandX size={18} stroke={1.5} />,
  },
];

/**
 * The footer under docs pages: compact, so the page stays the subject. The project, three short
 * columns (the docs' own sections, the three sibling templates, Mantine) and the sponsor links;
 * the full site footer, with every Mantine extension, stays on the other pages. Drawn with the
 * same tokens as that one (theme/site.css). A server component: the root layout renders it and
 * hands it to the shell.
 */
export function DocsFooter({ tree }: { tree: DocsNode[] }) {
  return (
    <Box component="footer" className={classes.root}>
      <Box className={classes.inner}>
        <div className={classes.top}>
          <Stack gap="sm" className={classes.brand}>
            <Group gap="xs" wrap="nowrap">
              <span className={classes.logo} aria-hidden="true">
                <IconBrandMantine size={20} stroke={1.6} />
              </span>
              <Text fw={600} ff="heading" size="lg" className={classes.name}>
                {site.name}
              </Text>
            </Group>
            <Text size="sm" c="dimmed" className={classes.tagline}>
              {site.tagline}
            </Text>
            <Group gap={4}>
              {SOCIAL.map((item) => (
                <Tooltip key={item.href} label={item.label}>
                  <ActionIcon
                    component="a"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="subtle"
                    color="gray"
                    size="lg"
                    aria-label={item.label}
                  >
                    {item.icon}
                  </ActionIcon>
                </Tooltip>
              ))}
            </Group>
          </Stack>

          <Column title="Docs" links={docsLinks(tree)} />
          <Column title="Templates" links={TEMPLATES} external />
          <Column title="Mantine" links={resources} external />
        </div>

        <EngravedDivider my="lg" />

        <Group justify="space-between" gap="sm" className={classes.bottom}>
          <Text size="xs" c="dimmed">
            Made with ❤️ by{' '}
            <Anchor href={config.links.author} size="xs" inherit className={classes.credit}>
              Undolog
            </Anchor>{' '}
            · Built with{' '}
            <Anchor href="https://mantine.dev/" size="xs" inherit className={classes.credit}>
              Mantine v{packageJson.dependencies['@mantine/core']}
            </Anchor>
          </Text>
          <Group gap="xs">
            <Button
              component={Link}
              href="/#sponsors"
              size="compact-sm"
              variant="default"
              leftSection={<IconHeartFilled size={14} color="var(--mantine-color-red-6)" />}
            >
              Sponsor
            </Button>
            <Button
              component="a"
              href={config.links.coffee}
              target="_blank"
              rel="noopener noreferrer"
              size="compact-sm"
              variant="default"
              leftSection={<IconCoffee size={14} color="var(--mantine-color-orange-6)" />}
            >
              Buy me a coffee
            </Button>
          </Group>
        </Group>
      </Box>
    </Box>
  );
}
