# 004 — Bring the menu sheet's entrance inside the drawer budget

- **Status**: DONE (2026-09-04) — `--speed-enter` 640ms → 480ms; scale stays monotonic, exit still shorter.
- **Commit**: no VCS in this repo. Stamped **2026-09-04**.
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, 1 line

## Problem

The menu sheet takes 640ms to arrive:

```css
/* src/app/globals.css:99 — current, the token */
  --speed-enter: 640ms;

/* src/app/globals.css:1607-1616 — current, the only consumer */
.menu-side[data-open='true'] .menu-panel {
  --slide-x: 0%;
  --slide-y: 0%;
  --slide-scale: 1;
  --panel-blur: var(--glass-blur-sheet);
  opacity: 1;
  transition:
    transform var(--speed-enter) var(--ease-out-circ),
    opacity var(--speed-fade) linear,
    --panel-blur var(--speed-exit) var(--ease-out-quart);
}
```

The catalog's budget for a modal or drawer is **200–500ms** (`AUDIT.md` §2). 640ms is 28% over.
The comment at `src/app/globals.css:1601-1605` records that this was already cut down from 1400ms
and that "a menu is something the reader is waiting on" — the direction was right, the landing was
short of the budget.

`--speed-enter` has exactly one consumer, so this is a single-value change with no blast radius.
Confirm that before editing: `grep -c "var(--speed-enter)" src/app/globals.css` must return `1`.

## Target

```css
/* target — src/app/globals.css:99 */
  --speed-enter: 480ms;
```

480ms, not 500: it keeps the sheet meaningfully slower than its own 380ms exit (arriving should
feel weightier than leaving, which the comment at line 1601 states as the intent) while landing
inside the budget with a little room.

The blur ramp at `--speed-exit` (380ms) still finishes before the slide does, which is the
relationship the comment at line 1604 describes — 380 < 480 keeps it true.

## Repo conventions to follow

- The token block in `src/app/globals.css` (search `--speed-press`) is the only place a duration
  is decided. `tests/liquid-glass.test.ts` describe `the motion scale` asserts the scale is
  **monotonically increasing** in declaration order:
  `press 160, fast 180, ui 240, fade 300, exit 380, md 420, enter 640, slow 900`.
  **480 keeps that order valid** (380 → 420 → 480 → 900). Do not reorder the declarations.
- The same test asserts `exit < enter`. 380 < 480 holds.

## Steps

1. Run `grep -c "var(--speed-enter)" src/app/globals.css` and confirm it returns `1`. If it
   returns more, STOP and report — the change now has consumers this plan did not account for.
2. In `src/app/globals.css`, change `--speed-enter: 640ms;` to `--speed-enter: 480ms;`.
3. Update the `enter` line in the scale's comment (the block above `--speed-press`) if it quotes
   640 anywhere. It should read as the band's purpose, not a number.

## Boundaries

- Do NOT change `--speed-exit`, `--speed-fade`, or `--speed-slow`.
- Do NOT change the easing (`--ease-out-circ` on the transform is correct for an entrance).
- Do NOT touch the `--panel-blur` ramp.
- Do NOT reorder the token declarations — a test asserts their order.

## Verification

- **Mechanical**: `npx vitest run` — the `the motion scale` describe must still pass all four of
  its tests, in particular *"declares one band per intent, in order"*. Then `npm run build` clean.
- **Feel check**: run `npm run dev`, on a phone viewport if possible:
  - Tap MENU. The sheet should arrive without you feeling you waited for it.
  - Immediately tap Close. The exit should still read as quicker than the entrance — if entrance
    and exit now feel the same length, 480 went too far and 520 is the fallback.
  - Open and close five times rapidly. The sheet must retarget from wherever it is mid-flight,
    never snap to the start.
  - In DevTools → Animations at 10% playback, confirm the blur has finished ramping before the
    slide lands.
- **Done when**: the sheet's entrance measures 480ms in the Animations panel and the exit still
  reads as the faster of the two.
