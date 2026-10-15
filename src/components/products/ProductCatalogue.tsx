'use client';

import {
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Layers,
  Package,
  Phone,
  Sun,
  Warehouse,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { GalleryFigure } from '@/components/gallery/GalleryFigure';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import { BUSINESS, PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import {
  CATALOGUE,
  catalogueFilterFromHash,
  type CatalogueFilter,
} from '@/lib/catalogue';
import { GALLERY, type GalleryGroupId } from '@/lib/gallery';
import { enquiryMessage, telLink, whatsappLink } from '@/lib/whatsapp';
import styles from './Products.module.css';

const ICONS = { nylon: Package, mould: Boxes, coldroom: Warehouse, solar: Sun };

export function ProductCatalogue() {
  const [filter, setFilter] = useState<CatalogueFilter>('all');
  const [view, setView] = useState<'grid' | 'stack'>('grid');
  const [viewer, setViewer] = useState<{
    group: GalleryGroupId;
    index: number;
  } | null>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const viewerGroup = CATALOGUE.find((group) => group.id === viewer?.group);
  const shot =
    viewerGroup && viewer ? viewerGroup.shots[viewer.index] : undefined;
  const visibleGroups = CATALOGUE.filter(
    (group) => filter === 'all' || group.id === filter,
  );
  const count = visibleGroups.reduce(
    (total, group) => total + group.shots.length,
    0,
  );
  const viewerOpen = viewer !== null;

  useEffect(() => {
    const sync = () => setFilter(catalogueFilterFromHash(window.location.hash));
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  useEffect(() => {
    // Re-measure the existing scroll runtime after a filter or layout changes the cards.
    window.dispatchEvent(new Event('catalogue:layout'));
  }, [filter, view]);

  useEffect(() => {
    if (!viewerOpen) return;
    const node = dialog.current;
    if (!node) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    node.showModal();
    return () => {
      node.close();
      document.body.style.overflow = overflow;
      window.__lenis?.start();
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [viewerOpen]);

  const chooseFilter = (next: CatalogueFilter) => {
    setFilter(next);
    const hash = next === 'all' ? '#catalogue' : `#${next}`;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    if (toolbar.current) {
      const headerHeight =
        document.querySelector('.site-header')?.getBoundingClientRect()
          .height ?? 0;
      const top =
        toolbar.current.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;
      if (window.scrollY > top) {
        window.__lenis?.scrollTo(top, { immediate: true });
        window.scrollTo({ top, behavior: 'instant' });
      }
    }
  };

  const movePhoto = (direction: number) => {
    if (!viewer || !viewerGroup) return;
    setViewer({
      ...viewer,
      index: Math.max(
        0,
        Math.min(viewerGroup.shots.length - 1, viewer.index + direction),
      ),
    });
  };

  return (
    <div className={`${styles.catalogue} theme-frost`}>
      <header className={styles.intro}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Koolink home
          </Link>
          <div className={styles.introRow}>
            <div>
              <p className={styles.eyebrow}>
                Built in Nigeria. Delivered nationwide.
              </p>
              <h1>
                Koolink products<span>.</span>
              </h1>
              <p className={styles.introCopy}>
                Ice block machines, cold rooms and solar systems.
                <br />
                Made for the way your business works.
              </p>
            </div>
            {isContactConfigured() && (
              <a className={styles.contactLink} href={telLink()}>
                <Phone size={19} />
                <span>
                  Talk to Koolink<strong>{PHONE_DISPLAY}</strong>
                </span>
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>
      </header>

      <div ref={toolbar} id="catalogue" className={styles.toolbar}>
        <div className={styles.container}>
          <div
            className={styles.filters}
            role="group"
            aria-label="Product categories"
          >
            <button
              type="button"
              aria-pressed={filter === 'all'}
              onClick={() => chooseFilter('all')}
            >
              All products <span>{GALLERY.length}</span>
            </button>
            {CATALOGUE.map((group) => {
              const Icon = ICONS[group.id];
              return (
                <button
                  key={group.id}
                  type="button"
                  aria-pressed={filter === group.id}
                  onClick={() => chooseFilter(group.id)}
                >
                  <Icon size={18} />
                  {group.label}
                  <span>{group.shots.length}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.resultsBar}>
          <p role="status" aria-live="polite">
            {count} {count === 1 ? 'photograph' : 'photographs'}{' '}
            <span>/ Our own work</span>
          </p>
          <div
            className={styles.viewSwitch}
            role="group"
            aria-label="Catalogue layout"
          >
            <button
              type="button"
              title="Photo grid"
              aria-label="Photo grid"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <Grid2X2 size={18} />
            </button>
            <button
              type="button"
              title="Scroll stack"
              aria-label="Scroll stack"
              aria-pressed={view === 'stack'}
              onClick={() => setView('stack')}
            >
              <Layers size={18} />
            </button>
          </div>
        </div>

        <div key={filter} className={styles.results}>
          {visibleGroups.map((group, groupIndex) => {
            const Icon = ICONS[group.id];
            return (
              <section
                id={group.id}
                key={group.id}
                className={styles.group}
                aria-labelledby={`heading-${group.id}`}
              >
                <div className={styles.groupHeading}>
                  <div>
                    <p className={styles.categoryLabel}>
                      <Icon size={18} />
                      {group.label}
                    </p>
                    <h2 id={`heading-${group.id}`}>{group.title}</h2>
                    <p>{group.blurb}</p>
                  </div>
                  <p className={styles.audience}>
                    <span>Made for</span>
                    {group.product.who}
                  </p>
                </div>
                <ScrollStack
                  className={`${styles.photoGrid} ${view === 'stack' ? styles.stackView : ''}`}
                  enabled={view === 'stack'}
                >
                  {group.shots.map((photo, index) => (
                    <ScrollStackItem key={photo.slug} stackIndex={index}>
                      <GalleryFigure
                        shot={photo}
                        group={group.title}
                        priority={groupIndex === 0 && index < 3}
                        className={styles.photoCard}
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        onPreview={() => setViewer({ group: group.id, index })}
                      />
                    </ScrollStackItem>
                  ))}
                </ScrollStack>
              </section>
            );
          })}
        </div>

        <section className={styles.customBuild}>
          <div>
            <p className={styles.eyebrow}>Your space. Your output.</p>
            <h2>Need a different size?</h2>
            <p>
              Tell us what you need to freeze and where it is going.
              <br />
              We fabricate to your requirements.
            </p>
          </div>
          <div className={styles.customActions}>
            {isContactConfigured() && (
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryLink}
              >
                Discuss your machine <ArrowUpRight size={18} />
              </a>
            )}
            <span>{BUSINESS.deliveryNote}</span>
          </div>
        </section>
      </div>

      <dialog
        ref={dialog}
        className={styles.viewer}
        aria-labelledby="photo-viewer-title"
        data-lenis-prevent
        onCancel={() => setViewer(null)}
        onClose={() => setViewer(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setViewer(null);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            movePhoto(-1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            movePhoto(1);
          }
        }}
      >
        {shot && viewer && viewerGroup && (
          <div className={styles.viewerInner}>
            <div className={styles.viewerHeading}>
              <div>
                <p>{viewerGroup.label}</p>
                <h2 id="photo-viewer-title">
                  {viewer.index + 1} / {viewerGroup.shots.length}
                </h2>
              </div>
              <button
                type="button"
                autoFocus
                aria-label="Close photo"
                title="Close photo"
                onClick={() => setViewer(null)}
              >
                <X size={23} />
              </button>
            </div>
            <div className={styles.viewerPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={shot.slug}
                src={`/gallery/${shot.slug}.webp`}
                alt={shot.caption}
                width={shot.width}
                height={shot.height}
              />
              {isContactConfigured() && (
                <span className="product-stamp numeral">{PHONE_DISPLAY}</span>
              )}
            </div>
            <div className={styles.viewerFooter}>
              <p>{shot.caption}</p>
              <div className={styles.viewerActions}>
                <button
                  type="button"
                  aria-label="Previous photo"
                  title="Previous photo"
                  disabled={viewer.index === 0}
                  onClick={() => movePhoto(-1)}
                >
                  <ChevronLeft size={21} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  title="Next photo"
                  disabled={viewer.index === viewerGroup.shots.length - 1}
                  onClick={() => movePhoto(1)}
                >
                  <ChevronRight size={21} />
                </button>
                {isContactConfigured() && (
                  <a
                    className={styles.primaryLink}
                    href={whatsappLink(
                      enquiryMessage({
                        product: viewerGroup.title,
                        image: `/gallery/${shot.slug}.webp`,
                      }),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book now <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
