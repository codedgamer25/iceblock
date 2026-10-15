# 007 — Give the gallery figures the travel every other reveal has

- **Status**: DONE (2026-09-04) — figures rise 1u; reduced motion sets `transform: none`.
- **Commit**: no VCS in this repo. Stamped **2026-09-04**.
- **Severity**: LOW (additive — a missed opportunity, not a defect)
- **Category**: Missed opportunities
- **Estimated scope**: 1 file, ~4 lines

## Problem

Every `.scroll-entrance` child on the site rises 50px as it fades in:

```css
/* src/app/globals.css:687-693 — the site's reveal, for reference */
html[data-js='1'] .scroll-entrance > * {
  opacity: 0;
  transform: translate3d(0, 50px, 0);
  transition:
    opacity var(--speed-slow) var(--ease-thaw),
    transform var(--speed-slow) var(--ease-thaw);
  transition-delay: calc(var(--delay) * var(--delay-value, 0));
}
```

The 35 catalogue figures do not. They fade only:

```css
/* src/app/globals.css:1064-1070 — current */
html[data-js='1'] .gallery-item[data-in-view='false'] {
  opacity: 0;
}

html[data-js='1'] .gallery-item {
  transition: opacity var(--speed-ui) var(--ease-out-quart);
}
```

So the products page reveals its headings with travel and its photographs without, and the two
read as different systems. (The product **tile** is opacity-only too, but that is deliberate and
documented at `src/app/globals.css:712` — its transform is reserved for the press. The figures have
no such constraint: nothing else animates their transform.)

A fade with no travel also reads as "the image finally loaded" rather than "the image arrived",
which is the exact confusion the comment at `src/app/globals.css:1029-1031` says it was trying to
avoid.

## Target

A short rise — 14px, not the sections' 50px, because a figure is a smaller object than a section
and the same distance on a smaller thing reads as a lurch:

```css
/* target — src/app/globals.css */
html[data-js='1'] .gallery-item[data-in-view='false'] {
  opacity: 0;
  transform: translate3d(0, calc(var(--u) * 1), 0);
}

/* A rise as well as a fade, so a photograph arriving reads the same way as the heading above it
   rather than like an image that finally loaded. 1u rather than the sections' 50px: a figure is a
   smaller object, and the same distance on a smaller thing reads as a lurch. */
html[data-js='1'] .gallery-item {
  transition:
    opacity var(--speed-ui) var(--ease-out-quart),
    transform var(--speed-ui) var(--ease-out-quart);
}
```

`1u` is `clamp(12px, 0.96vw, 18px)` — 12px on a phone, ~14px at 1440px. Using the unit rather than
a pixel value is required by the repo's own rule (see Conventions).

The reduced-motion override at `src/app/globals.css:2839-2841` already replaces this transition with
an opacity-only cross-fade, so no new accessibility work is needed — **but confirm it still wins**
after the change (step 3).

## Repo conventions to follow

- **Never write a raw pixel dimension.** Everything spatial is a multiple of `--u`. This is a named
  rule in `DESIGN.md` ("The Unit Rule"). The existing 50px in the section reveal predates it.
- Reduced motion: `src/app/globals.css:2839` inside `@media (prefers-reduced-motion: reduce)`
  already sets `.gallery-item { transition: opacity var(--speed-fast) linear; transition-delay: 0s
  !important; }` — it must continue to drop the transform.
- Exemplar of a small, correct reveal: `src/app/globals.css:687`.

## Steps

1. In `src/app/globals.css`, add `transform: translate3d(0, calc(var(--u) * 1), 0);` to
   `html[data-js='1'] .gallery-item[data-in-view='false']` (line ~1064).
2. Extend the transition at line ~1069 to include
   `transform var(--speed-ui) var(--ease-out-quart)`, and add the comment from the Target section.
3. In the reduced-motion block at line ~2839, add `transform: none;` to the
   `html[data-js='1'] .gallery-item` rule so the rise is dropped rather than merely un-transitioned.

## Boundaries

- Do NOT change the 240ms duration or the curve.
- Do NOT touch `.gallery-frame`'s hover transform (`src/app/globals.css:1082`) — different element,
  different job.
- Do NOT add travel to `.product-tile`; its transform is reserved for the press and that is
  documented at `src/app/globals.css:712`.
- Do NOT use a pixel literal for the distance.
- Do NOT touch the per-child observer in `src/components/InViewRuntime.tsx`.

## Verification

- **Mechanical**: `npx vitest run` and `npm run build` clean.
- **Feel check**: run `npm run dev`, open `/products`:
  - Scroll slowly. Photographs should lift slightly as they fade in, the same gesture as the
    heading above them, just shorter.
  - It must not read as a lurch — if you can measure the distance by eye, it is too far.
  - Scroll fast, then stop. Figures mid-reveal must retarget from where they are, not restart.
  - Check the horizontal ice strip ("What they produce"): those figures scroll sideways inside
    their own container, so confirm the rise does not fight the strip's own scrolling.
  - In DevTools → Rendering, tick **Emulate CSS prefers-reduced-motion: reduce**, reload, and
    confirm the figures cross-fade with **no** vertical movement.
- **Done when**: figures rise ~12–14px as they fade, and reduced motion shows no movement at all.
