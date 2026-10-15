import type { CSSProperties } from 'react';

/**
 * A photographic bed for a section, with the reference site's `Bg Scale` move on it:
 * their `.hero-img` goes from scale 1 to 1.2 starting at 40% of the section's
 * crossing, so the picture keeps opening up as you read past it. Driven here by the
 * `--scroll-percentage` the runtime already maintains on `[data-parallax]`, so it
 * costs one custom property and no library.
 *
 * Two shapes, picked by orientation rather than width: a full-bleed background on a
 * phone held upright crops a 16:9 frame down to about 0.46 and upscales what is
 * left, so the portrait variant is cropped at encode time where the pixels are
 * actually shown.
 *
 * AVIF first with a WebP fallback. AVIF is a third of the size here, and WebP is the
 * one format every browser in use can decode, so nothing is left without a picture.
 *
 * The scrim is not decoration. Frost text over the headline region of the hero shot
 * measures 15.45:1 unaided, which is comfortably AA — but the block's own highlights
 * are far brighter than that regional average, and type crossing one of them would
 * disappear without it. The right scrim is a property of the individual photograph:
 * sampled at the copy region, the hero's brightest 5% sits at 0.04 relative luminance
 * and the CTA's at 0.49, so they need very different amounts of it. Derive the value,
 * never inherit it from the last bed that worked.
 */
export function SectionBackground({
  name,
  alt,
  /** 0 → 1. How much of the scrim to lay on. */
  scrim = 1,
  /**
   * True for a bed above the fold. It becomes the LCP element, so it is fetched at high
   * priority and never lazily; false-by-default keeps a bed at the bottom of a very long
   * page from competing with the first paint for bandwidth on a slow connection.
   */
  priority = false,
}: {
  name: 'hero' | 'cta';
  alt: string;
  scrim?: number;
  priority?: boolean;
}) {
  return (
    <div
      className="section-bg"
      data-parallax
      aria-hidden="true"
      style={{ '--scrim': scrim } as CSSProperties}
    >
      <picture>
        <source
          media="(orientation: portrait)"
          type="image/avif"
          srcSet={`/bg/${name}-portrait.avif`}
        />
        <source media="(orientation: portrait)" srcSet={`/bg/${name}-portrait.webp`} />
        <source type="image/avif" srcSet={`/bg/${name}-wide.avif`} />
        {/* alt="" rather than the description. The wrapper is aria-hidden — these beds
            are atmosphere, not content — so a described image here would be unreachable
            text that reads in source as though the picture were announced. `alt` is kept
            as a prop because the sentence at each call site is the only record of what
            the asset actually shows, which is what the next person swapping it needs. */}
        <img
          src={`/bg/${name}-wide.webp`}
          alt=""
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
    </div>
  );
}
