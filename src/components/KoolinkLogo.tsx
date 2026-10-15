import { BUSINESS } from '@/lib/business';
import { cx } from '@/lib/cx';

/**
 * The initial, drawn.
 *
 * A didone K where every stroke is split into a hairline and a heavy stroke — a hairline at
 * the left edge of the stem with the weight beside it, and a hairline running outside the leg
 * — which is what makes one letter read as two overlapping Ks. Nothing in Archivo does that,
 * and no font does, so it is drawn rather than set. The geometry is authored in
 * `scripts/draw_wordmark_k.py`, which rasterises it at the sizes the site actually renders
 * and prints this `d`; edit it there, not here.
 *
 * Its weights are a size decision rather than taste, and the size is not negotiable: the
 * initial matches the cap height of the letters after it, which puts it between 14px and 21px
 * across `--step-h3`. The reference artwork is a display mark with roughly a 1-to-13 hairline;
 * at 14px that hairline is a seventh of a pixel and anti-aliases to a grey smear, so the split
 * is drawn at 7-against-12.5 instead — measured, by rasterising at 21, 18 and 14px and
 * magnifying the pixel grid until each band landed on at least one whole pixel.
 *
 * The leg's hairline companion is gone for the same reason and is not coming back at this size:
 * at every size tested it merged into the leg and read as a thickened edge rather than a second
 * stroke. The split now lives only in the stem, which is where it survives.
 *
 * `currentColor`, not the accent: the reference is black ink on paper, and a large ornate
 * initial in bright cyan reads as a sticker rather than a logotype.
 */
function KoolinkInitial() {
  return (
    <svg
      className="logo-k-mark"
      viewBox="4 0 95 102"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 2H50V9H38.5V95H50V102H8ZM15 9H26V95H15ZM88 2C66 16 48 30 38.5 42L38.5 34C46 25 64 12 80 2ZM33 42H46.5L87 95H70ZM66 95H92V102H66Z" />
    </svg>
  );
}

/**
 * The wordmark: a drawn initial followed by the rest of the name in the display face.
 *
 * There used to be a separate K mark to the left of the word. Set immediately before a word
 * beginning with the same letter, the header read "K Koolink", and a reader who notices that
 * once cannot stop. So there is one K and the drawing is it — the word's own initial, doing
 * the job the mark was doing.
 *
 * The letter stays in the DOM behind the drawing, visually hidden. `.logo-word` still reads
 * "Koolink" to a screen reader and to a text selection, which an `aria-label` on the link
 * would only have fixed in the header — the footer and the menu sheet have no such label.
 *
 * `rest` is sliced off the name rather than typed, so the split follows the name if the name
 * in business.ts is ever corrected.
 */
export function KoolinkLogo({ className }: { className?: string }) {
  const initial = BUSINESS.name.slice(0, 1);
  const rest = BUSINESS.name.slice(1);

  return (
    <span className={cx('logo-lockup', className)}>
      <span className="logo-word">
        <span className="logo-k">
          <KoolinkInitial />
          <span className="visually-hidden">{initial}</span>
        </span>
        {rest}
      </span>
    </span>
  );
}
