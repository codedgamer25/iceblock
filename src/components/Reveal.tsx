import type { CSSProperties, ReactNode } from 'react';

import { cx } from '@/lib/cx';

/**
 * Wraps a group whose direct children should rise into place one after another.
 *
 * Only the immediate children animate, so the markup inside decides the rhythm:
 * four sibling elements stagger four ways, and one element wrapping four moves as
 * a single block. `delay` shifts the whole group later in multiples of the same
 * 32.5ms step, for sequencing one group behind its neighbour.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cx('scroll-entrance', className)}
      data-in-view="false"
      style={delay > 0 ? ({ '--delay-value': delay } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
