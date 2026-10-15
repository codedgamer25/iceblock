'use client';

import { useEffect, useRef } from 'react';

import { PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import { telLink, whatsappLink } from '@/lib/whatsapp';

/**
 * A persistent action bar pinned to the bottom of the screen, phones only.
 *
 * This is the one pattern that matters most for this business on a phone and the site
 * did not have it. Every call to action was scattered up a 14,000px page, so a reader
 * who decided to get in touch had to go and find a button. Now the two things they can
 * do — message or call — are always under their thumb.
 *
 * The bottom edge specifically, because that is the reachable third of a modern phone
 * screen. The menu opener is top-left, which is the hardest corner to reach one-handed;
 * that is tolerable for something tapped once, and not for the thing the whole page is
 * asking them to do.
 *
 * Three details that stop it being annoying rather than useful:
 *
 * It hides while the menu is open, because two competing sets of actions on one screen
 * is worse than either alone.
 *
 * It hides itself over anything that already offers the same two actions: the footer,
 * which repeats both numbers, and the hero, whose own "Book now on WhatsApp" button sits
 * about 250px above this one at first paint. Holding a bar over the top of a duplicate of
 * itself is worse than not having it, and the first thing a reader sees should not be the
 * same button twice.
 *
 * It sits above the iOS home indicator via `env(safe-area-inset-bottom)`, and the page
 * gets matching bottom padding, so nothing is ever underneath it.
 */
export function MobileActionBar() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = bar.current;
    if (!node) return;

    /* Anything on screen that already carries these actions. Counted rather than
       flag-per-target, because two of them can be visible at once and the bar should
       stay away until the last one has left.

       Two observers, because the two rivals want different trigger points and one
       rootMargin cannot serve both. The footer should not tuck the bar until it is
       properly in view, so it keeps the 20% bottom inset. The hero's button should tuck
       it the moment either one is on screen at all, and under the inset that button sat
       exactly on the shrunken boundary and never registered — which is why both were
       visible at first paint. */
    const showing = new Set<Element>();
    const onChange: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) showing.add(entry.target);
        else showing.delete(entry.target);
      }
      node.dataset.tucked = String(showing.size > 0);
    };

    const observers: IntersectionObserver[] = [];
    const watch = (targets: Element[], options: IntersectionObserverInit) => {
      if (targets.length === 0) return;
      const observer = new IntersectionObserver(onChange, options);
      for (const target of targets) observer.observe(target);
      observers.push(observer);
    };

    watch(Array.from(document.querySelectorAll('footer')), {
      rootMargin: '0px 0px -20% 0px',
    });
    watch(Array.from(document.querySelectorAll('[data-hero-cta]')), { threshold: 0 });

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, []);

  if (!isContactConfigured()) return null;

  return (
    <div ref={bar} className="action-bar" data-tucked="false">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="button primary action-bar-main"
      >
        Book now on WhatsApp
      </a>
      <a href={telLink()} className="button secondary action-bar-call" aria-label={`Call ${PHONE_DISPLAY}`}>
        Call
      </a>
    </div>
  );
}
