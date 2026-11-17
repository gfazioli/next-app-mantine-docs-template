import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandMantine,
  IconBrandX,
  IconCoffee,
  IconHeartFilled,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { EngravedDivider } from '@/components/EngravedDivider/EngravedDivider';
import { Link } from '@/components/Link/Link';
import config from '@/config';
import type { DocsNode } from '@/lib/docs/types';
import packageJson from '../../../package.json';
import { highlights, resources } from '../../MantineFooter/links';
import classes from './DocsFooter.module.css';

interface FooterLink {
  key: string;
  title: React.ReactNode;
  href: string;
}

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
        <Anchor
          key={link.key}
          href={link.href}
          className={classes.link}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { component: Link })}
        >
          {link.title}
        </Anchor>
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
 * columns (the docs' own sections, Mantine, more templates) and the sponsor links; the full site
 * footer, with every Mantine extension, stays on the other pages. A server component: the root
 * layout renders it and hands it to the shell.
 */
export function DocsFooter({ tree }: { tree: DocsNode[] }) {
  return (
    <Box component="footer" className={classes.root}>
      <Box className={classes.inner}>
        <div className={classes.top}>
          <Stack gap="sm" className={classes.brand}>
            <Group gap="xs" wrap="nowrap">
              <ThemeIcon
                size={32}
                radius="md"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
              >
                <IconBrandMantine size={20} />
              </ThemeIcon>
              <Text fw={600} ff="heading" size="lg">
                Mantine docs template
              </Text>
            </Group>
            <Text size="sm" c="dimmed" className={classes.tagline}>
              Documentation sites on Next.js and MDX, with every piece of the interface made of
              Mantine components.
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
          <Column title="Mantine" links={resources} external />
          <Column title="More" links={highlights} external />
        </div>

        <EngravedDivider my="lg" />

        <Group justify="space-between" gap="sm" className={classes.bottom}>
          <Text size="xs" c="dimmed">
            Made with ❤️ by{' '}
            <Anchor href={config.links.author} size="xs" inherit>
              Undolog
            </Anchor>{' '}
            · Built with{' '}
            <Anchor href="https://mantine.dev/" size="xs" inherit>
              Mantine v{packageJson.dependencies['@mantine/core']}
            </Anchor>
          </Text>
          <Group gap="xs">
            <Button
              component={Link}
              href="/#sponsors"
              size="compact-sm"
              variant="light"
              color="red"
              leftSection={<IconHeartFilled size={14} />}
            >
              Sponsor
            </Button>
            <Button
              component="a"
              href={config.links.coffee}
              target="_blank"
              rel="noopener noreferrer"
              size="compact-sm"
              variant="light"
              color="orange"
              leftSection={<IconCoffee size={14} />}
            >
              Buy me a coffee
            </Button>
          </Group>
        </Group>
      </Box>
    </Box>
  );
}
