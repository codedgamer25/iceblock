import type { CSSProperties } from 'react';

import { GalleryFigure } from '@/components/gallery/GalleryFigure';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import type { GalleryShot } from '@/lib/gallery';

type Family = {
  shots: ReadonlyArray<GalleryShot>;
  group: string;
  priority?: boolean;
};

/**
 * Layout families, one per section of the catalogue.
 *
 * The first version of this page ran the same column grid in every section. Every section was
 * therefore the same shape, and a reader scrolling it could not tell from the composition
 * whether they were looking at machines, at ice, or at the factory. Grouping the photographs
 * was the right first move and it was not enough: a catalogue earns its keep by treating
 * different kinds of picture differently.
 *
 * So each family is chosen from what its photographs actually are, not for variety's sake.
 * Three are rendered, one per group in products/page.tsx:
 *
 *   LeadAndGrid      one nylon frame is clearly the best of nineteen, so it leads at full width
 *   PanoramaRows     the coldroom frames include wide interiors; they want the whole shell
 *   AsymmetricTrio   exactly three mould frames, so exactly three cells
 *
 * Three more are defined here and no longer rendered, kept because their CSS is load-bearing
 * for tests that have nothing to do with the gallery — `.gallery-strip` carries the mobile
 * suite's `touch-action: pan-x` assertion. They were written for product lines the client
 * later dropped:
 *
 *   ScrollStrip      near-identical piles of ice need breadth, not individual attention
 *   ContactBand      cabinets shot straight on read as a range, captions just add noise
 *   StaggeredColumn  the factory sequence is a story, so it steps down the page
 *
 * Each family declares its own collapse below 768px in the same file as its desktop layout,
 * and each one uses GalleryFigure, so the phone stamp and the Book now action are identical
 * in all of them.
 */

/**
 * React Bits' card-stack composition, with Koolink's figure left whole inside every card.
 *
 * The wrappers provide the sticky/scale layer; GalleryFigure still owns the uncropped image,
 * number stamp, caption, reveal and Book now action. ScrollStack itself is server-rendered and
 * leaves measurement to the site's one shared scroll runtime, so it cannot create a second Lenis
 * controller or a nested scroll trap.
 */
export function ScrollStackGallery({ shots, group, priority }: Family) {
  return (
    <div className="shell gallery-shell scroll-stack-shell">
      <ScrollStack>
        {shots.map((shot, index) => (
          <ScrollStackItem key={shot.slug} stackIndex={index}>
            <GalleryFigure
              shot={shot}
              group={group}
              priority={priority && index === 0}
              sizes="(max-width: 767px) 100vw, 72vw"
            />
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </div>
  );
}

/** One photograph leads at full shell width, the rest fill a column grid beneath it. */
export function LeadAndGrid({ shots, group, priority }: Family) {
  const [lead, ...rest] = shots;
  if (!lead) return null;

  return (
    <>
      <div className="shell gallery-shell">
        <GalleryFigure
          shot={lead}
          group={group}
          priority={priority}
          className="gallery-lead"
          sizes="(max-width: 767px) 100vw, 90vw"
        />
      </div>
      {rest.length > 0 && (
        <div className="shell gallery-shell mt-8">
          <div className="gallery-grid">
            {rest.map((shot) => (
              <GalleryFigure key={shot.slug} shot={shot} group={group} sizes="(max-width: 767px) 100vw, 33vw" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * The wide frames run full width; everything else pairs off beside them. Which is which is
 * measured, not hand-listed: anything past 2:1 came out of the watermark crop as a strip and
 * looks wrong in a column, and looks deliberate across the whole shell.
 */
export function PanoramaRows({ shots, group, priority }: Family) {
  const wide = shots.filter((shot) => shot.width / shot.height > 2);
  const rest = shots.filter((shot) => shot.width / shot.height <= 2);

  /* Interleave so the page alternates between a full-width band and a pair, rather than
     stacking all the panoramas and then all the pairs. */
  const rows: Array<{ kind: 'wide'; shot: GalleryShot } | { kind: 'pair'; shots: GalleryShot[] }> = [];
  let w = 0;
  for (let i = 0; i < rest.length; i += 2) {
    rows.push({ kind: 'pair', shots: rest.slice(i, i + 2) });
    if (w < wide.length) rows.push({ kind: 'wide', shot: wide[w++] });
  }
  while (w < wide.length) rows.push({ kind: 'wide', shot: wide[w++] });

  return (
    <div className="shell gallery-shell flex flex-col gap-[calc(var(--gutter)*1.6)]">
      {rows.map((row, index) =>
        row.kind === 'wide' ? (
          <GalleryFigure
            key={row.shot.slug}
            shot={row.shot}
            group={group}
            priority={priority && index === 0}
            sizes="(max-width: 767px) 100vw, 90vw"
          />
        ) : (
          <div key={`pair-${index}`} className="gallery-pair">
            {row.shots.map((shot) => (
              <GalleryFigure
                key={shot.slug}
                shot={shot}
                group={group}
                sizes="(max-width: 767px) 100vw, 45vw"
              />
            ))}
          </div>
        ),
      )}
    </div>
  );
}

/**
 * A strip that scrolls on its own axis, for photographs that carry breadth rather than
 * individual interest. Six piles of bagged ice do not each deserve a third of the viewport;
 * what they collectively prove is that the machines run all day. Snap points so a flick
 * lands on a picture rather than between two.
 */
export function ScrollStrip({ shots, group }: Family) {
  return (
    /* tabIndex makes the strip reachable, and that is not a nicety: without it a keyboard
       user can tab to the Book now link of every photograph except the four that start off
       screen, because nothing can scroll the container to bring them into view.

       `region` rather than `group`, because a focusable scrollable area is a landmark a
       screen reader should be able to jump to; `group` gets no such treatment. The label
       names the thing rather than repeating the heading directly above it, which was the
       whole of the old one. */
    <div
      className="gallery-strip"
      role="region"
      aria-label={`${group}, scrollable photographs`}
      tabIndex={0}
    >
      {shots.map((shot) => (
        <GalleryFigure
          key={shot.slug}
          shot={shot}
          group={group}
          className="gallery-strip-item"
          sizes="(max-width: 767px) 78vw, 30vw"
        />
      ))}
    </div>
  );
}

/**
 * One large beside the rest, stacked. It was written for exactly three and now runs on two,
 * because the drinks group gave a frame back to the product tiles; the shape holds either way,
 * since the point is the asymmetry rather than the count. An even row would read as the
 * generic feature grid.
 */
export function AsymmetricTrio({ shots, group, priority }: Family) {
  const [first, ...pair] = shots;
  if (!first) return null;

  return (
    <div className="shell gallery-shell">
      <div className="gallery-trio">
        <GalleryFigure
          shot={first}
          group={group}
          priority={priority}
          className="gallery-trio-lead"
          sizes="(max-width: 767px) 100vw, 60vw"
        />
        <div className="gallery-trio-stack">
          {pair.map((shot) => (
            <GalleryFigure
              key={shot.slug}
              shot={shot}
              group={group}
              sizes="(max-width: 767px) 100vw, 30vw"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * A tight band, no captions. These are all cabinets shot straight on, and what the reader is
 * being shown is the range rather than any one of them; a sentence under each would be six
 * near-identical sentences. The alt text still describes every frame.
 */
export function ContactBand({ shots, group }: Family) {
  /* Columns from the count, not a fixed three. Four cabinets in a 3-up grid leaves two empty
     cells in the second row, which reads as a grid that ran out of content; 2x2 reads as a
     set. Anything divisible by three keeps three across. */
  const columns = shots.length % 3 === 0 ? 3 : 2;

  return (
    <div className="shell gallery-shell">
      <div className="gallery-band" style={{ '--band-cols': columns } as CSSProperties}>
        {shots.map((shot) => (
          <GalleryFigure
            key={shot.slug}
            shot={shot}
            group={group}
            showCaption={false}
            sizes="(max-width: 767px) 50vw, 30vw"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * The factory sequence steps down the page instead of sitting in a grid, because it is the
 * one group that is a story: built, finished, wrapped, palletised, collected. The offset is
 * the site's variance showing up where it means something, and it flattens to a single column
 * on a phone where a 2vw indent would just look like a mistake.
 */
export function StaggeredColumn({ shots, group }: Family) {
  return (
    <div className="shell gallery-shell">
      <div className="gallery-stagger">
        {shots.map((shot, index) => (
          <GalleryFigure
            key={shot.slug}
            shot={shot}
            group={group}
            className={index % 2 === 1 ? 'gallery-stagger-offset' : undefined}
            sizes="(max-width: 767px) 100vw, 46vw"
          />
        ))}
      </div>
    </div>
  );
}
