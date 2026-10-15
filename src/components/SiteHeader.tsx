'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { CSSProperties } from 'react';

import {
  BUSINESS,
  PHONE_ALT_DISPLAY,
  PHONE_DISPLAY,
  isContactConfigured,
} from '@/lib/business';
import { KoolinkLogo } from '@/components/KoolinkLogo';
import { NAV_GROUPS, NAV_TARGETS } from '@/lib/nav';
import { telLink, whatsappLink } from '@/lib/whatsapp';

/**
 * The header, and the slide-out menu behind it.
 *
 * Both are built to the reference site's structure, measured out of their
 * stylesheet rather than eyeballed: a three-column header (opener, logo, contact),
 * and a panel that is `47em` wide against a `#0000004d` scrim, holding a `4.4em`
 * heading per group with an icon that appears at `left: -3.25em` while the heading
 * slides `translateX(2em)`, and sub-links that expand on a 700ms
 * `cubic-bezier(.23, 1, .32, 1)`. Their colours are green on beige; ours are ours.
 *
 * Four things their version does not do, added because leaving them out would be a
 * bug rather than a difference: Escape closes the panel, focus moves into it on open
 * and back to the opener on close, the page behind is frozen through Lenis (which is
 * why the instance is exposed on `window.__lenis`), and the opener carries
 * `aria-expanded`.
 *
 * The header also recolours itself over dark sections — `data-on-dark` is set from
 * geometry on every scroll frame, which is their approach and survives resizes,
 * anchor jumps and variable section heights for free because it asks about the DOM
 * instead of remembering state.
 */
export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(NAV_GROUPS[0]?.id ?? null);
  /* Which section the reader is actually in, so the menu can say "you are here".
     Computed once when the panel opens. A live observer would be watching eleven
     sections for the sake of a panel that is shut most of the time. */
  const [current, setCurrent] = useState<string | null>(null);

  /* Shut on navigation. The header lives in the layout, so a client-side route change
     leaves this component mounted and its state intact — which was fine while every menu
     link was an on-page anchor handled by `goTo`, and became a bug the moment the menu
     gained links to /products: the reader tapped one, the new page rendered underneath,
     and the panel was still sitting over it with the page behind it inert. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Geometry-driven header inversion. */
  useEffect(() => {
    const node = header.current;
    if (!node) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const box = node.getBoundingClientRect();
      const middle = box.top + box.height / 2;
      let onDark = false;
      for (const section of document.querySelectorAll<HTMLElement>('[data-invert]')) {
        const area = section.getBoundingClientRect();
        if (area.top <= middle && area.bottom >= middle) {
          onDark = true;
          break;
        }
      }
      node.dataset.onDark = String(onDark);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    /* The first measure runs before the hero's background image has decoded, so the
       section it is testing against can still change height underneath it. Both of
       these call measure directly rather than through the frame queue: a colour that
       is wrong until the user happens to scroll is worse than measuring twice. */
    window.addEventListener('load', measure);
    const layout = new ResizeObserver(() => measure());
    layout.observe(document.body);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('load', measure);
      layout.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* `restoreFocus` is false when the panel is closing because a link inside it was
     followed: sending focus back to the menu button would fight the destination the
     reader just chose. */
  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) opener.current?.focus();
  }, []);

  /**
   * Following a link out of the panel, which does not work if you simply let the
   * anchor fire.
   *
   * While the menu is open, Lenis is stopped and `html.menu-open` has `overflow:
   * hidden` on the document. Both are undone by an effect that runs after React
   * re-renders — which is several frames after the click. So the browser handles the
   * anchor while the page is still frozen, the scroll goes nowhere, and the reader
   * lands at the top of a closed page having asked for something specific.
   *
   * So the unlock happens here, synchronously, before the scroll is asked for.
   */
  const goTo = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('/#')) return;
      const target = document.getElementById(href.slice(2));
      if (!target) return;

      event.preventDefault();
      document.documentElement.classList.remove('menu-open');
      window.__lenis?.start?.();
      close(false);

      /* Land the section below the fixed header rather than under it. */
      const clearance = (header.current?.offsetHeight ?? 0) + 12;
      const lenis = window.__lenis;
      if (!lenis?.scrollTo) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      lenis.scrollTo(target, { offset: -clearance });

      /* Then aim again once, because the page moves underneath a long scroll: every
         reveal that fires on the way past changes the height of what it is inside, so
         a destination measured at click time can be hundreds of pixels out by the
         time we arrive. Measured overshoot on the offices link was 68px before this.
         One correction is enough, it runs after the reveals have settled, and a
         second would just be chasing the first. */
      window.setTimeout(() => {
        const drift = target.getBoundingClientRect().top - clearance;
        if (Math.abs(drift) > 16) lenis.scrollTo(target, { offset: -clearance });
      }, 900);
    },
    [close],
  );

  /* Freeze the page, listen for Escape, and put focus where the user is looking. */
  useEffect(() => {
    /* Everything that is not the header or the menu itself, made unreachable while the
       panel is open. `aria-modal` on the dialog already tells a screen reader to stay
       inside it, but it does nothing for a sighted keyboard user: without this, Tab walks
       straight out of the panel into a page that is still fully focusable, sitting behind
       a scrim, and the ring goes somewhere the reader cannot see. `inert` removes
       focusability and pointer events from a whole subtree in one attribute.

       Both refs have to be spared, not just the header. The panel is a *sibling* of the
       header inside this component's fragment, so at the document level they are two
       separate children of `<body>` — sparing only the header marks the menu itself inert
       and it stops responding to anything at all. Excluding by containment rather than by
       selector keeps that true if either one is ever moved or nested. */
    const keep = [header.current, panel.current].filter(Boolean) as HTMLElement[];
    const outside = Array.from(document.body.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        node.tagName !== 'SCRIPT' &&
        !keep.some((alive) => node.contains(alive)),
    );
    const setInert = (on: boolean) => {
      for (const node of outside) {
        if (on) node.setAttribute('inert', '');
        else node.removeAttribute('inert');
      }
    };

    if (!open) {
      window.__lenis?.start?.();
      document.documentElement.classList.remove('menu-open');
      setInert(false);
      return;
    }

    window.__lenis?.stop?.();
    document.documentElement.classList.add('menu-open');
    setInert(true);
    panel.current?.querySelector<HTMLElement>('button, a')?.focus();

    /* Whichever anchor's top most recently passed the header is the one being read. */
    let best: string | null = null;
    let bestTop = -Infinity;
    for (const id of NAV_TARGETS) {
      const node = document.getElementById(id);
      if (!node) continue;
      const top = node.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.4 && top > bestTop) {
        bestTop = top;
        best = id;
      }
    }
    setCurrent(best);
    const owner = NAV_GROUPS.find((group) =>
      group.children?.some((child) => child.href.replace('/#', '') === best),
    );
    if (owner) setExpanded(owner.id);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      setInert(false);
    };
  }, [open, close]);

  return (
    <>
      <header ref={header} data-on-dark="false" className="site-header">
        <div className="nav-wrap">
          <button
            ref={opener}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <span className="menu-bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="text-caps">Menu</span>
          </button>

          <Link href="/" className="nav-logo h3" aria-label={BUSINESS.legalName}>
            <KoolinkLogo />
          </Link>

          {isContactConfigured() ? (
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-wrap"
            >
              <span className="text-caps">Book now</span>
              <span className="underline" aria-hidden="true" />
            </a>
          ) : (
            <span className="text-caps text-subtle">Contact pending</span>
          )}
        </div>
      </header>

      <div className="menu-side" data-open={open} aria-hidden={!open}>
        {/* The scrim. Their `.menu-side-bg` at 30% black, and clicking it closes. */}
        <button type="button" className="menu-scrim" tabIndex={-1} aria-label="Close menu" onClick={() => close()} />

        <div
          ref={panel}
          id="site-menu"
          className="menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button type="button" className="close-btn" onClick={() => close()}>
            <span className="logo-inside h3">
              <KoolinkLogo />
            </span>
            <span className="text-caps">Close</span>
          </button>

          <div className="menu-divider" aria-hidden="true" />

          {/* data-lenis-prevent is not optional here. Lenis binds wheel events on the
              window and, while it is stopped for the menu, swallows them, so without
              this the panel's own scroller never receives a wheel event and the menu
              simply cannot be scrolled. Lenis checks for this attribute on the event
              path and leaves those elements to scroll natively. */}
          <div className="menu-items" data-lenis-prevent>
            <div className="menu-items-wrap">
              {NAV_GROUPS.map((group, index) => {
                const isOpen = expanded === group.id;
                const holdsCurrent = Boolean(
                  current && group.children?.some((c) => c.href.replace('/#', '') === current),
                );
                return (
                  <div
                    key={group.id}
                    className="link-item"
                    data-active={isOpen}
                    data-current={holdsCurrent}
                    style={{ '--i': index } as CSSProperties}
                  >
                    <button
                      type="button"
                      className="menu-link-heading"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : group.id)}
                    >
                      <span className="menu-icon" aria-hidden="true" />
                      <span className="menu-heading">{group.label}</span>
                    </button>

                    <div className="link-item-links">
                      <div className="link-item-links-inner">
                        {group.children?.map((child, childIndex) => (
                          <a
                            key={child.label}
                            className="nav-link"
                            href={child.href}
                            onClick={(event) => goTo(event, child.href)}
                            aria-current={child.href.replace('/#', '') === current ? 'true' : undefined}
                            style={{ '--i': childIndex } as CSSProperties}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isContactConfigured() && (
              <div className="menu-foot">
                <a href={telLink()} className="nav-link numeral">
                  {PHONE_DISPLAY}
                </a>
                <a href={telLink(true)} className="nav-link numeral">
                  {PHONE_ALT_DISPLAY}
                </a>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary mt-4"
                >
                  Book now on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
