# 001 — Make the card's frost bloom fast on hover, slow on reveal

- **Status**: DONE (2026-09-04) — hover half now `var(--speed-fast)`; the reveal keeps 900ms.
- **Commit**: no VCS in this repo (`git rev-parse` fails — not a git repository). Stamped **2026-09-04**. Verify the excerpts below match before editing; if they do not, STOP and report.
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file, ~2 lines

## Problem

`.card::before` is the frost bloom in the card's top-left corner. It has **two triggers** — the
scroll reveal and pointer hover — but only one transition, declared at 900ms:

```css
/* src/app/globals.css:643 — current */
  transition: opacity var(--speed-slow) var(--ease-thaw);
```

`--speed-slow` is `900ms`. The two triggers are at:

```css
/* src/app/globals.css:649 — current (scroll reveal, correct at 900ms) */
[data-in-view='true'] .card::before {
  opacity: 1;
}

/* src/app/globals.css:653-657 — current (hover, wrong at 900ms) */
@media (hover: hover) and (pointer: fine) {
  .card:hover::before {
    opacity: 1;
  }
}
```

So pointing at a card starts a bloom that takes **nine tenths of a second** to arrive. A hover
effect is hit tens of times a day; the budget for one is 100–200ms. At 900ms the pointer has
usually left before the bloom finishes, which reads as the interface lagging behind the hand
rather than answering it.

This is the same structural bug already fixed once on `.product-tile` — one property serving two
purposes at one duration. See `src/app/globals.css:712` for that fix and its comment.

## Target

The scroll reveal keeps 900ms. The hover gets `--speed-fast` (`180ms`), scoped to the hover
block so it cannot affect the reveal:

```css
/* target — src/app/globals.css, inside the existing (hover: hover) block */
@media (hover: hover) and (pointer: fine) {
  /* 180ms, not the 900ms the reveal uses. The bloom has two triggers and one transition, and
     a pointer affordance that takes nine tenths of a second is not an affordance. Scoped to
     the hover state so the scroll reveal above keeps its slow arrival. */
  .card:hover::before {
    opacity: 1;
    transition-duration: var(--speed-fast);
  }
}
```

`transition-duration` on the hover state applies while hovering — so hover-in and hover-out are
both 180ms, and a card revealed by scrolling with no pointer near it still uses 900ms.

## Repo conventions to follow

- Duration tokens live in the `:root` block of `src/app/globals.css` (search `--speed-press`).
  Use `var(--speed-fast)`; do **not** write `180ms` literally — a test fails on literal
  durations outside `:root` (`tests/liquid-glass.test.ts`, describe `the motion scale`).
- Every rule in this file carries a comment explaining *why* the number is what it is, in prose,
  no bullet lists. Match that voice. Exemplar: `src/app/globals.css:712`.
- Hover rules stay inside `@media (hover: hover) and (pointer: fine)`. Do not add a new query.

## Steps

1. In `src/app/globals.css`, find the block at line ~653 that reads
   `@media (hover: hover) and (pointer: fine) {` followed by `.card:hover::before { opacity: 1; }`.
2. Add `transition-duration: var(--speed-fast);` as a second declaration inside
   `.card:hover::before`, and add the comment from the Target section above the selector.
3. Change nothing else. The declaration at line 643 stays at `var(--speed-slow)`.

## Boundaries

- Do NOT touch `.product-tile`, `.gallery-item`, or any other component.
- Do NOT change the 900ms on line 643 — the scroll reveal wants it.
- Do NOT add a duration literal; use the token.
- Do NOT restructure the two-trigger split at lines 649 and 653 — it is deliberate and
  documented at line 645.
- If line 643 no longer reads `transition: opacity var(--speed-slow) var(--ease-thaw);`, STOP.

## Verification

- **Mechanical**: from `C:\Users\shadr\iceblock`, run `npx vitest run` — expect all tests
  passing, same count as before the change. Then `npm run build` — expect
  `✓ Generating static pages` and no CSS warnings.
- **Feel check**: run `npm run dev`, open the homepage, scroll to a section using `.card`
  (the "Why Koolink" section), then:
  - Point at a card. The cyan/chill bloom in its top-left corner should appear almost at once —
    if you can watch it fade in, it is still too slow.
  - Move the pointer off. The bloom should leave just as fast.
  - Reload and scroll the section into view **without** the pointer over it. The bloom should
    now arrive slowly, over most of a second, as part of the reveal.
  - In DevTools → Animations, set playback speed to 10% and confirm the hover bloom and the
    scroll bloom are visibly different lengths.
- **Done when**: hovering a card blooms in under 200ms, and a pointer-free scroll reveal still
  blooms over ~900ms.
