'use client';

import { useEffect } from 'react';

type LenisLike = {
  raf: (time: number) => void;
  destroy: () => void;
  scrollTo: (target: number | string | HTMLElement, options?: Record<string, unknown>) => void;
  /* Used by the slide-out menu to freeze the page behind it. */
  stop: () => void;
  start: () => void;
};

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

/**
 * Momentum scrolling, the same way the reference site does it — Lenis intercepts
 * the wheel and eases the page instead of jumping it.
 *
 * Three deliberate details: the library is imported inside the effect, so it is
 * fetched only by visitors who will actually see it; anyone with "reduce motion"
 * set never downloads it at all; and neither does anyone on a touch screen, where
 * the operating system already does momentum better than any library can and the
 * only thing left to import is bytes. Native scrolling is left completely alone in
 * both cases, which is the correct behaviour, not a degraded one.
 *
 * The configuration is the reference site's, verbatim: `new Lenis({ lerp: 0.1 })`.
 * lerp is exponential smoothing rather than a fixed duration — each frame closes
 * a tenth of the remaining distance — which is what gives that site its long,
 * heavy glide. `anchors` is ours: they wire in-page links up by hand with jQuery,
 * and Lenis has done it natively since 1.1.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    let cancelled = false;
    let frame = 0;
    let instance: LenisLike | null = null;

    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;

      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        anchors: true,
      });

      instance = lenis;
      /* Exposed deliberately, the same way the reference site does it. Anything
         that needs to freeze the page. A modal, a slide-out menu, has to be able
         to reach the scroll driver, and so does any check of scroll behaviour from
         outside the React tree. `window.scrollTo` does not work while Lenis owns
         the scroll; `window.__lenis.scrollTo` does.
         The plain `lenis` global is taken by the library itself for its version. */
      window.__lenis = lenis;

      const tick = (time: number) => {
        lenis.raf(time);
        frame = window.requestAnimationFrame(tick);
      };

      frame = window.requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      if (frame !== 0) window.cancelAnimationFrame(frame);
      instance?.destroy();
      if (window.__lenis === instance) delete window.__lenis;
    };
  }, []);

  return null;
}
