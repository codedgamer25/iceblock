import type { GalleryShot } from '@/lib/gallery';
import { PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import { enquiryMessage, whatsappLink } from '@/lib/whatsapp';
import { cx } from '@/lib/cx';
import { ArrowUpRight, Maximize2 } from 'lucide-react';

/**
 * One photograph, everywhere it appears.
 *
 * Six layout families share this so the two things the client requires cannot drift apart
 * from each other: the phone number stamped onto the picture, and a "Book now" underneath
 * it that opens WhatsApp already naming what the reader was looking at.
 *
 * `caption` is the alt text either way. Whether it is also *shown* is the layout's decision,
 * not the photograph's: a tight three-up band of cabinets reads as a product range and a
 * line of prose under each one just makes it noisy, while a lead photograph carrying a
 * section deserves its sentence. Hence `showCaption`.
 */
export function GalleryFigure({
  shot,
  group,
  priority = false,
  showCaption = true,
  className,
  sizes,
  onPreview,
}: {
  shot: GalleryShot;
  /** The group's own title, so the WhatsApp message says which range they were looking at. */
  group: string;
  priority?: boolean;
  showCaption?: boolean;
  className?: string;
  sizes?: string;
  onPreview?: () => void;
}) {
  const picture = (
    <picture>
      <source
        type="image/avif"
        srcSet={`/gallery/${shot.slug}-400.avif ${shot.smallWidth}w, /gallery/${shot.slug}.avif ${shot.width}w`}
        sizes={sizes}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/gallery/${shot.slug}.webp`}
        srcSet={`/gallery/${shot.slug}-400.webp ${shot.smallWidth}w, /gallery/${shot.slug}.webp ${shot.width}w`}
        sizes={sizes}
        /* Empty where the caption is shown, because the figcaption directly below already
               carries this sentence into the accessibility tree. Duplicating it in `alt` made a
               screen reader announce the same description twice for most of the figures on the
               page. Where the layout suppresses the caption the alt does the whole job. */
        alt={showCaption ? '' : shot.caption}
        width={shot.width}
        height={shot.height}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
    </picture>
  );
  return (
    <figure
      className={cx('gallery-item', className)}
      data-in-view={onPreview ? 'true' : 'false'}
    >
      <div className="gallery-frame">
        {onPreview ? (
          <button
            type="button"
            className="gallery-preview"
            onClick={onPreview}
            aria-label={`View photo: ${shot.caption}`}
            title="Enlarge photo"
          >
            {picture}
            <span className="gallery-zoom" aria-hidden="true">
              <Maximize2 size={17} />
            </span>
          </button>
        ) : (
          picture
        )}
        {isContactConfigured() && (
          <span className="product-stamp numeral">{PHONE_DISPLAY}</span>
        )}
      </div>

      {showCaption && (
        <figcaption className="gallery-caption body-small">
          {shot.caption}
        </figcaption>
      )}

      {isContactConfigured() && (
        <a
          className="gallery-cta"
          href={whatsappLink(
            enquiryMessage({
              product: group,
              image: `/gallery/${shot.slug}.webp`,
            }),
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book now
          {onPreview && <ArrowUpRight size={17} aria-hidden="true" />}
        </a>
      )}
    </figure>
  );
}
