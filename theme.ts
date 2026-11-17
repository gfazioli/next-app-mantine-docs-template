'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  // Mantine gives its interactive components the default arrow cursor, links rendered by them
  // included (NavLink, Anchor, the table of contents): a docs site wants the hand on every link.
  cursorType: 'pointer',
  // Body text keeps Mantine's default system stack; headings use Outfit, as on mantine.dev.
  headings: {
    fontFamily: 'var(--font-outfit), sans-serif',
    fontWeight: '600',
  },
});
