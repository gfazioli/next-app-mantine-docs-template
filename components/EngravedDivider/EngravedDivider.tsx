import cx from 'clsx';
import { Divider, type DividerProps } from '@mantine/core';
import classes from './EngravedDivider.module.css';

/** Mantine's `Divider`, drawn as a groove sunk into the page rather than a raised line. */
export function EngravedDivider({ className, ...props }: DividerProps) {
  return <Divider {...props} className={cx(classes.root, className)} />;
}
