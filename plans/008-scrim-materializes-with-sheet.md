# 008 — Ramp the scrim's blur with the sheet, so one thing arrives once

- **Status**: DONE (2026-09-04) — `--scrim-blur` 0→3px on `--speed-exit`; frame-rate check on a real phone still outstanding.
- **Commit**: no VCS in this repo. Stamped **2026-09-04**.
- **Severity**: LOW (additive — a missed opportunity, not a defect)
- **Category**: Missed opportunities
- **Estimated scope**: 1 file, ~6 lines

## Problem

The menu sheet now materializes: its backdrop blur ramps from 6px to 30px as it slides in, through
a registered custom property.

```css
/* src/app/globals.css:1572-1576 — the mechanism, for reference */
@property --panel-blur {
  syntax: '<length>';
  inherits: false;
  initial-value: 30px;
}
```

The scrim behind it does not participate. Its blur is a constant:

```css
/* src/app/globals.css:2400-2403 — current */
.menu-scrim {
  background-color: rgb(0 0 0 / 0.18);
  backdrop-filter: blur(3px) saturate(1.1) brightness(0.86);
  -webkit-backdrop-filter: blur(3px) saturate(1.1) brightness(0.86);
}
```

So opening the menu is one event rendered two ways: the sheet's glass forms over 380ms while the
scrim's blur is simply on from frame one, fading in only its opacity
(`src/app/globals.css:1546-1547`). The seam is visible at the sheet's edge, which is exactly the
"gap between the panel edge and the page" the comment at `src/app/globals.css:2397-2399` says the
scrim blur exists to hide.

## Target

The scrim's blur ramps on the same mechanism and the same curve, over a shorter distance because it
is a thinner material:

```css
/* target — src/app/globals.css, beside the existing @property block */
@property --scrim-blur {
  syntax: '<length>';
  inherits: false;
  initial-value: 3px;
}
```

```css
/* target — src/app/globals.css:1516 area, .menu-scrim's structural rule */
.menu-scrim {
  /* … existing position/inset/z-index/border/padding/cursor/background-color … */
  --scrim-blur: 0px;
  opacity: 0;
  transition:
    opacity var(--speed-ui) var(--ease-in-quart),
    --scrim-blur var(--speed-ui) var(--ease-in-quart);
}

.menu-side[data-open='true'] .menu-scrim {
  --scrim-blur: 3px;
  opacity: 1;
  transition:
    opacity var(--speed-md) var(--ease-out-quart),
    --scrim-blur var(--speed-exit) var(--ease-out-quart);
}
```

```css
/* target — src/app/globals.css:2400, the glass rule */
.menu-scrim {
  background-color: rgb(0 0 0 / 0.18);
  backdrop-filter: blur(var(--scrim-blur)) saturate(1.1) brightness(0.86);
  -webkit-backdrop-filter: blur(var(--scrim-blur)) saturate(1.1) brightness(0.86);
}
```

`0px → 3px`, matching the sheet's `--speed-exit` (380ms) ramp so both materials finish forming at
the same moment.

**The blur must travel through a registered property, not through `backdrop-filter` directly** — a
filter list containing a `url()` reference is not interpolable, and although the scrim has no
`url()` today, using the same mechanism as the sheet keeps one pattern in the file. The reason is
documented at `src/app/globals.css:1563-1571`; read it before editing.

## Repo conventions to follow

- `@property` blocks sit immediately above the rule that consumes them, with prose explaining why
  the value is not animated directly. Exemplar: `src/app/globals.css:1563-1576`.
- Durations and curves from tokens only — `tests/liquid-glass.test.ts` fails on literals outside
  `:root`. Note `3px` and `0px` are lengths, not durations, and are fine.
- The reduced-motion block at `src/app/globals.css:2726` already holds `--panel-blur` at its target
  in both states; do the same for `--scrim-blur` so it does not ramp under reduced motion.

## Steps

1. Add the `@property --scrim-blur` block next to the existing `@property --panel-blur` block.
2. Add `--scrim-blur: 0px;` and the `--scrim-blur` entry in the transition list to `.menu-scrim`
   (`src/app/globals.css:1516`).
3. Add `--scrim-blur: 3px;` and its transition entry to
   `.menu-side[data-open='true'] .menu-scrim` (`src/app/globals.css:1550`).
4. Change the two `blur(3px)` occurrences at `src/app/globals.css:2402-2403` to
   `blur(var(--scrim-blur))`.
5. In the reduced-motion block, add `.menu-scrim, .menu-side[data-open='true'] .menu-scrim
   { --scrim-blur: 3px; }` beside the existing `--panel-blur` hold.
6. Extend the test *"is the only surface that ramps, because it is the only one that arrives"* in
   `tests/liquid-glass.test.ts` — it currently fails if anything other than `.menu-panel` mentions
   `--panel-blur`; it must now also allow `.menu-scrim` to mention `--scrim-blur`, and still fail if
   the header, action bar or stamp mention either.

## Boundaries

- Do NOT animate `backdrop-filter` directly. Use the registered property.
- Do NOT change the scrim's `background-color`, `saturate` or `brightness`.
- Do NOT add refraction (`url(#liquid-glass)`) to the scrim — it covers the whole viewport and
  warping a full page is documented as rejected at `src/app/globals.css:2398`.
- Do NOT raise the blur above 3px. The scrim is a thin material by design.

## Verification

- **Mechanical**: `npx vitest run` — the amended test must still fail if you temporarily add
  `--panel-blur` to `.site-header`; check that, then revert. `npm run build` clean.
- **Feel check**: run `npm run dev`, open the menu and watch the **page behind** the sheet, not the
  sheet:
  - The background should come into softness as the sheet arrives, both finishing together.
  - Close the menu: the background should sharpen as the sheet leaves, not snap sharp at the end.
  - In DevTools → Animations at 10% playback, confirm sheet and scrim finish on the same frame.
  - Tick **Emulate CSS prefers-reduced-motion: reduce** and confirm the scrim's blur is simply on
    with no ramp.
  - On a real phone, open and close the menu five times. If the frame rate drops, this plan is not
    worth it — two animated backdrop filters is one more than the repo's own performance rule
    allows, and reverting is the correct outcome. Record that if it happens.
- **Done when**: sheet and scrim form and dissolve together, and no frame rate regression on a real
  phone.
