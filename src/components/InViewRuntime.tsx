'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const HIDDEN = '[data-in-view="false"]';
const STACK_QUERY = '[data-scroll-stack]';
const STACK_CARD_QUERY = '[data-scroll-stack-card]';
const STACK_DESKTOP = '(min-width: 768px) and (hover: hover) and (pointer: fine)';

/**
 * Every entrance on the page, watched from one place.
 *
 * `.scroll-entrance` and `.split-text` ship with `data-in-view="false"`, which CSS
 * renders as invisible; this flips them to `true` once and then stops watching,
 * because these are arrivals, not states — replaying them on the way back up is
 * what makes a site feel restless. All the timing lives in CSS.
 *
 * Because invisible-until-told is the resting state, anything that fails to be told
 * is invisible for good. So there are three ways an element gets revealed, and only
 * the first is pretty:
 *
 *   1. IntersectionObserver, with the insets that give each kind of block its own
 *      trigger point. This is what produces the staggered arrival.
 *   2. A geometric check on scroll: anything still hidden whose top has passed the
 *      bottom of the viewport gets revealed, no observer involved. This exists
 *      because an observer can silently never fire — see the scroll-container note
 *      below — and a business page that hides its own products is worse than one
 *      with no animation.
 *   3. A timer, for whatever is above the fold at load.
 *
 * Two observers for entrances, because one wrapper is not always one arrival. A block of
 * prose is: eyebrow, heading and paragraph appear together, a fraction apart, and the group
 * is the unit. A grid of cards is not — on a desktop it is two short rows, but on a
 * phone it is one very tall column, and watching the wrapper means the whole column
 * starts rising the moment its first card peeks over the bottom edge. The cards
 * below finish while they are still a screen or two down, so by the time they are
 * reached they are already at rest. That is how a site looks animated on a laptop
 * and dead on a phone. The choice is made per wrapper, from how far apart its
 * children actually sit — not from a breakpoint, because the same grid needs both
 * behaviours at different widths.
 *
 * The exception is a wrapper that scrolls on its own axis. The product row is a
 * horizontal strip on a phone, and a tile scrolled off to the right does not
 * intersect the viewport at all, so per-child observation would leave four of six
 * tiles hidden until the end of time. Those wrappers are always revealed as a group.
 *
 * The last part maintains `--scroll-percentage` (0 → 1 as an element crosses the
 * viewport) on anything marked `data-parallax`, which `.parallax`, the melt line and
 * the photographic beds read. Scrubbed sequences do their own measuring: they need
 * progress against their own sticky travel, not against the viewport crossing.
 *
 * A third observer, separate from the two above and with the opposite lifetime, keeps
 * `data-onscreen` in sync on anything marked `data-pause-offscreen`. Entrances are flipped
 * once and forgotten; a forever-animation needs to know when it has left the screen again
 * so it can stop costing a compositor pass nobody is watching.
 */
export function InViewRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const revealAll = () => {
      for (const node of document.querySelectorAll(HIDDEN)) {
        node.setAttribute('data-in-view', 'true');
      }
    };

    /* Reduce Motion: the CSS has already turned every entrance into a cross-fade with
       no movement, and nothing is left that needs timing to the scroll. Flag
       everything on the frame after mount and take the observers out of the chain
       entirely, one less thing that has to work on a device we cannot inspect for
       the content to be visible at all. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAll();
      return;
    }

    const groups: IntersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-in-view', 'true');
          groups.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    /* Single children of a spread-out group: a 4% inset rather than 10%, and a
       threshold low enough that a card taller than the screen still triggers. */
    const items: IntersectionObserver = new IntersectionObserver(
      (entries) => {
        let position = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          /* Everything in one callback crossed the edge in the same frame, so this is
             a row, not a sequence: stagger it exactly as CSS would have. */
          if (position > 0) node.style.transitionDelay = `calc(var(--delay) * ${position})`;
          node.setAttribute('data-in-view', 'true');
          items.unobserve(node);
          position += 1;
        }
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.01 },
    );

    /* A quarter of the screen is about as far as a child can sit below its group's
       top edge and still be on screen while it moves. Measured from the first child
       rather than from the wrapper, because the children are translated down at rest
       and the wrapper is not, comparing like with like cancels the offset out. */
    const reach = window.innerHeight * 0.25;

    /* Split headings are one arrival by definition — the characters ARE the stagger —
       so they go straight to the group observer, whose -10% inset is exactly the
       `top 90%` trigger the reference site uses for them. */
    for (const node of document.querySelectorAll(`.split-text${HIDDEN}`)) {
      groups.observe(node);
    }

    for (const node of document.querySelectorAll<HTMLElement>(`.scroll-entrance${HIDDEN}`)) {
      const style = window.getComputedStyle(node);
      const scrolls = /(auto|scroll)/.test(style.overflowX) || /(auto|scroll)/.test(style.overflowY);
      const children = Array.from(node.children) as HTMLElement[];
      const top = children[0]?.getBoundingClientRect().top ?? 0;
      const spread = children.reduce(
        (far, child) => Math.max(far, child.getBoundingClientRect().top - top),
        0,
      );

      if (scrolls || spread <= reach) {
        groups.observe(node);
        continue;
      }
      for (const child of children) items.observe(child);
    }

    /* The catalogue's photographs, observed individually rather than by wrapper. Six layout
       families put them in six different containers — a column grid, a snap strip, pairs, a
       trio, a band, a staggered pair of columns — so there is no single wrapper whose spread
       could be measured to decide between group and per-child. Per-child is also the right
       answer on the merits: twenty-eight figures down a very long page are not one arrival,
       and the items observer already hands out the stagger for anything crossing the line in
       the same frame, which turns a row of three into a row rather than three events.

       Except inside the snap strip. Four of its six frames start off to the right of the
       viewport and never intersect it at all, so watching them individually would leave them
       invisible for the life of the page — the same failure the product row had before those
       wrappers were group-revealed. So a figure with a horizontally scrolling ancestor hands
       its reveal to that ancestor, which does sit in the normal flow. */
    const scrollingAncestor = (node: Element): Element | null => {
      let parent = node.parentElement;
      while (parent && parent !== document.body) {
        if (/(auto|scroll)/.test(window.getComputedStyle(parent).overflowX)) return parent;
        parent = parent.parentElement;
      }
      return null;
    };

    const strips = new Map<Element, Element[]>();
    for (const node of document.querySelectorAll(`.gallery-item${HIDDEN}`)) {
      const strip = scrollingAncestor(node);
      if (!strip) {
        items.observe(node);
        continue;
      }
      const members = strips.get(strip);
      if (members) members.push(node);
      else strips.set(strip, [node]);
    }

    const stripsObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const members = strips.get(entry.target) ?? [];
          members.forEach((node, position) => {
            if (position > 0) {
              (node as HTMLElement).style.transitionDelay = `calc(var(--delay) * ${position})`;
            }
            node.setAttribute('data-in-view', 'true');
          });
          stripsObserver.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    for (const strip of strips.keys()) stripsObserver.observe(strip);

    const parallax = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    const stackMedia = window.matchMedia(STACK_DESKTOP);
    const readStacks = () => Array.from(document.querySelectorAll<HTMLElement>(STACK_QUERY)).map((node) => ({
      node,
      cards: Array.from(node.querySelectorAll<HTMLElement>(STACK_CARD_QUERY)),
      layoutTops: [] as number[],
    }));
    let stacks = readStacks();
    let frame = 0;

    const resetStacks = () => {
      for (const { node, cards } of stacks) {
        node.dataset.stackActive = 'false';
        for (const card of cards) {
          card.style.removeProperty('--stack-scale');
        }
      }
    };

    /* Sticky positioning changes offsetTop in Chromium once a card pins. Cache every card's
       document coordinate while the stack is still ordinary flow, then refresh that cache only
       after a resize has put the wrappers back into ordinary flow. */
    const cacheStackLayout = () => {
      resetStacks();
      for (const stack of stacks) {
        stack.layoutTops = stack.cards.map(
          (card) => card.getBoundingClientRect().top + window.scrollY,
        );
      }
    };
    cacheStackLayout();

    /* The one two-way observer here. Everything above is an arrival — flipped once and
       then forgotten — but an animation that runs forever needs to know when it has gone
       off screen again, not just when it first appeared. `data-onscreen` is its own
       attribute rather than a reuse of `data-in-view` precisely because the two have
       opposite lifetimes, and conflating them would make a one-shot reveal start toggling.
       Nothing is hidden by this: the elements it watches are decorative and already
       painted, so a failed observer costs a paused marquee, not missing content. */
    const onscreen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.onscreen = String(entry.isIntersecting);
        }
      },
      { rootMargin: '0px', threshold: 0 },
    );
    for (const node of document.querySelectorAll('[data-pause-offscreen]')) {
      onscreen.observe(node);
    }

    /* The safety net has to stay out of the way at first, and this is the bug it caused:
       it ran inside the mount tick, so anything above the fold went from
       data-in-view="false" to "true" before the browser had painted the "false" state.
       A transition with no rendered starting frame does not interpolate, it snaps. So
       the hero's characters were revealed correctly and animated not at all.

       Twelve hundred milliseconds is long enough for an observer that works to have
       delivered, and short enough that a reader looking at a genuinely stuck element is
       not left waiting. */
    const netArmsAt = performance.now() + 1200;

    const measure = () => {
      frame = 0;
      const viewport = window.innerHeight;

      for (const node of parallax) {
        const box = node.getBoundingClientRect();
        const progress = 1 - (box.top + box.height) / (viewport + box.height);
        node.style.setProperty('--scroll-percentage', String(Math.min(1, Math.max(0, progress))));
      }

      /* React Bits' ScrollStack mathematics, folded into this runtime's existing frame instead
         of giving the catalogue another Lenis instance and another perpetual rAF. Only wrappers
         are transformed: GalleryFigure keeps sole ownership of its reveal and hover layers. */
      if (stackMedia.matches) {
        for (const { node, cards, layoutTops } of stacks) {
          if (node.dataset.stackEnabled === 'false') continue;
          node.dataset.stackActive = 'true';
          const stackPosition = Number.parseFloat(node.dataset.stackPosition ?? '18') / 100;
          const scaleEndPosition = Number.parseFloat(node.dataset.scaleEndPosition ?? '8') / 100;
          const startLine = viewport * stackPosition;
          const endLine = viewport * scaleEndPosition;
          const baseScale = Number.parseFloat(
            window.getComputedStyle(node).getPropertyValue('--scroll-stack-base-scale'),
          );
          const itemScale = Number.parseFloat(
            window.getComputedStyle(node).getPropertyValue('--scroll-stack-item-scale'),
          );

          cards.forEach((card, index) => {
            const absoluteCardTop =
              layoutTops[index] ?? node.getBoundingClientRect().top + window.scrollY;
            /* Read the resolved sticky top rather than `--stack-offset` itself. Custom-property
               values remain token streams such as `calc(2 * clamp(...))`, so parseFloat on the
               variable returns NaN and invalidates the entire scale transform. `top` is the same
               expression after layout has resolved it to pixels. */
            const resolvedTop = Number.parseFloat(window.getComputedStyle(card).top);
            const stackOffset = Number.isFinite(resolvedTop) ? resolvedTop - startLine : 0;
            const triggerStart = absoluteCardTop - startLine - stackOffset;
            const triggerEnd = absoluteCardTop - endLine;
            const travel = Math.max(1, triggerEnd - triggerStart);
            const progress = Math.min(1, Math.max(0, (window.scrollY - triggerStart) / travel));
            const target = Math.min(1, baseScale + index * itemScale);
            const scale = 1 - progress * (1 - target);

            card.style.setProperty('--stack-scale', scale.toFixed(4));
          });
        }
      } else {
        resetStacks();
      }

      /* The safety net, and deliberately later than either observer: their insets fire
         at 90% and 96% of the viewport height, so by the time an element's top has
         reached 60% a working observer has certainly delivered. Anything still hidden
         at that point is a failure, and gets revealed without one, no animation, but
         on screen, which is the right way round. */
      if (performance.now() < netArmsAt) return;
      for (const node of document.querySelectorAll(HIDDEN)) {
        if (node.getBoundingClientRect().top < viewport * 0.6) {
          node.setAttribute('data-in-view', 'true');
        }
      }
    };

    const onScroll = () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    const onResize = () => {
      resetStacks();
      stacks = readStacks();
      cacheStackLayout();
      onScroll();
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('catalogue:layout', onResize);
    /* Catches whatever is above the fold if the observers never delivered at all. */
    const backstop = window.setTimeout(measure, 1600);

    return () => {
      groups.disconnect();
      items.disconnect();
      stripsObserver.disconnect();
      onscreen.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('catalogue:layout', onResize);
      window.clearTimeout(backstop);
      resetStacks();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
