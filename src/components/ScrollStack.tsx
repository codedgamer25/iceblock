import type { CSSProperties, ReactNode } from 'react';

import { cx } from '@/lib/cx';

type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
  /** Scale reached by the oldest card. Kept shallow so text and actions remain readable. */
  baseScale?: number;
  /** How much less each newer card shrinks than the card before it. */
  itemScale?: number;
  /** Viewport position at which a card begins to stack. */
  stackPosition?: number;
  /** Viewport position at which that card reaches its final scale. */
  scaleEndPosition?: number;
};

type ScrollStackItemProps = {
  children: ReactNode;
  itemClassName?: string;
  stackIndex?: number;
};

type StackStyle = CSSProperties & {
  '--scroll-stack-base-scale': number;
  '--scroll-stack-item-scale': number;
  '--scroll-stack-position': number;
};

type StackItemStyle = CSSProperties & {
  '--stack-index': number;
};

/**
 * The React Bits ScrollStack shape, adapted to Koolink's single window-scroll owner.
 *
 * This component deliberately owns no Lenis instance, listeners or animation frame. The site's
 * existing InViewRuntime measures every stack in its one coalesced scroll pass, while CSS leaves
 * these cards in ordinary document flow until that runtime explicitly activates the effect.
 * That makes no-JavaScript, touch and Reduced Motion the safe baseline rather than exceptions.
 */
export default function ScrollStack({
  children,
  className,
  enabled = true,
  baseScale = 0.92,
  itemScale = 0.018,
  stackPosition = 18,
  scaleEndPosition = 8,
}: ScrollStackProps) {
  return (
    <div
      className={cx('scroll-stack', className)}
      data-scroll-stack
      data-stack-enabled={enabled}
      data-stack-active="false"
      data-stack-position={stackPosition}
      data-scale-end-position={scaleEndPosition}
      style={
        {
          '--scroll-stack-base-scale': baseScale,
          '--scroll-stack-item-scale': itemScale,
          '--scroll-stack-position': stackPosition,
        } as StackStyle
      }
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" aria-hidden="true" />
      </div>
    </div>
  );
}

/** A separate transform layer, so the figure's reveal and hover transforms cannot collide. */
export function ScrollStackItem({
  children,
  itemClassName,
  stackIndex = 0,
}: ScrollStackItemProps) {
  return (
    <div
      className={cx('scroll-stack-card', itemClassName)}
      data-scroll-stack-card
      style={{ '--stack-index': stackIndex } as StackItemStyle}
    >
      {children}
    </div>
  );
}
