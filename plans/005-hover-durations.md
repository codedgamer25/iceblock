# 005 — Halve three hover transitions from 420ms to 180ms

- **Status**: DONE (2026-09-04) — all three moved to `var(--speed-fast)`.
- **Commit**: no VCS in this repo. Stamped **2026-09-04**.
- **Severity**: LOW
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file, 3 lines

## Problem

Three pointer affordances run at `--speed-md` (`420ms`). A hover effect is hit tens of times a day;
the catalog (`AUDIT.md` §1) says such motion should be reduced, and §2 puts small-element feedback
at 100–200ms. At 420ms the pointer has often moved on before the effect resolves.

```css
/* src/app/globals.css:908 — the product photo's lift */
  transition: transform var(--speed-md) var(--ease-thaw);
/* triggered at :912 — .product-tile:hover .product-photo { transform: translate3d(0, -0.5u, 0) } */

/* src/app/globals.css:1508 — the header CTA's underline growing in */
  transition: transform var(--speed-md) var(--ease-out-quart);
/* triggered at :1512 — .contact-wrap:hover .underline { transform: scaleX(1) } */

/* src/app/globals.css:1797 — the cyan dot beside an open menu group */
  transition: opacity var(--speed-md) var(--ease-thaw);
/* triggered at :1800 by [data-active='true'] and at :1808 by .menu-link-heading:hover */
```

One caveat on the third: `.menu-icon` has **two triggers** — the group being open
(`.link-item[data-active='true'] .menu-icon`, line 1800) and hover (line 1808). Speeding up the
shared declaration speeds up both. That is acceptable here — the dot is a state indicator either
way and 180ms is inside the budget for both — but it is a different situation from the other two
and worth knowing before you edit.

## Target

All three move to `--speed-fast` (`180ms`), keeping their existing curves:

```css
/* target — src/app/globals.css:908 */
  transition: transform var(--speed-fast) var(--ease-thaw);

/* target — src/app/globals.css:1508 */
  transition: transform var(--speed-fast) var(--ease-out-quart);

/* target — src/app/globals.css:1797 */
  transition: opacity var(--speed-fast) var(--ease-thaw);
```

Nothing else changes. `--speed-fast` is the band the rest of the site's hover work already uses —
see `.product-corner` (`src/app/globals.css:975`), `.gallery-frame` (`:1082`) and `.nav-link`
(`:1904`), all hover affordances already at `--speed-fast`. These three were the outliers.

## Repo conventions to follow

- Tokens only, never literals — `tests/liquid-glass.test.ts` describe `the motion scale`, test
  *"leaves no duration decided outside the scale"*, fails on any `ms` literal outside `:root`.
- Exemplar of a hover affordance done right: `src/app/globals.css:975`
  (`.product-corner { transition: background-color var(--speed-fast) var(--ease-thaw); }`).

## Steps

1. In `src/app/globals.css` line 908 (inside `.product-photo`), change `var(--speed-md)` to
   `var(--speed-fast)`. Leave `var(--ease-thaw)`.
2. Line 1508 (inside `.contact-wrap .underline`), change `var(--speed-md)` to `var(--speed-fast)`.
   Leave `var(--ease-out-quart)`.
3. Line 1797 (inside `.menu-icon`), change `var(--speed-md)` to `var(--speed-fast)`. Leave
   `var(--ease-thaw)`.

## Boundaries

- Do NOT change any easing curve.
- Do NOT change `--speed-md` itself — other rules depend on it (the header's ink flip, the scrim
  arriving, the tile's background).
- Do NOT touch the second `.product-tile:hover .product-photo` rule at
  `src/app/globals.css:2584` — it cancels the transform below 991px and is deliberate.
- Do NOT extend this to `.product-photo`'s `box-shadow` or add properties to any transition list.

## Verification

- **Mechanical**: `npx vitest run` and `npm run build`, both clean, test count unchanged.
- **Feel check**: run `npm run dev` on a desktop browser with a mouse (all three are behind
  `(hover: hover) and (pointer: fine)` and will not appear on a touch device):
  - Sweep the pointer quickly across the six product tiles. Each photograph should have finished
    lifting before you leave it — at 420ms it could not keep up with a sweep.
  - Point at BOOK NOW in the header. The underline should draw in from the right almost at once.
  - Open the menu, point at a group heading. The cyan dot to its left should appear promptly, and
    should also appear promptly when a group is opened by clicking.
  - In DevTools → Animations at 25% playback, confirm all three now run the same length as the
    already-correct `.product-corner` hover.
- **Done when**: the three transitions read 180ms in the Animations panel and no hover on the site
  runs longer than `--speed-fast` except the card bloom's reveal half (see plan 001).
