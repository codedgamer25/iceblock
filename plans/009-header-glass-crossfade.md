# 009 — Transition the header's glass when it crosses a bed, not just its ink

- **Status**: WONTFIX (2026-09-04) — see the Finding below. The premise was wrong: interpolating the glass would not fix the snap, because a worse problem sits underneath it.
- **Commit**: no VCS in this repo. Stamped **2026-09-04**.
- **Severity**: LOW (additive — a missed opportunity, not a defect)
- **Category**: Missed opportunities
- **Estimated scope**: 1 file, ~4 lines

## Problem

The header flips between a light and a dark state as it crosses sections, driven by
`data-on-dark` from `src/components/SiteHeader.tsx:79`. Three properties are transitioned:

```css
/* src/app/globals.css:1360-1365 — current */
  transition:
    color var(--speed-md) var(--ease-thaw),
    background-color var(--speed-md) var(--ease-thaw),
    border-color var(--speed-md) var(--ease-thaw);
```

The **glass is not**. The two states declare different filters, and the swap is instant:

```css
/* src/app/globals.css:2237 — light state */
  backdrop-filter: url(#liquid-glass) blur(var(--glass-blur-chrome)) saturate(1.6) brightness(1.1);

/* src/app/globals.css:2274 — dark state */
  backdrop-filter: url(#liquid-glass) blur(var(--glass-blur-chrome)) saturate(var(--glass-sat)) brightness(var(--glass-dim));
```

`brightness` goes `1.1 → 0.46` and `saturate` goes `1.6 → 1.5` in a single frame while the ink,
tint and border take 420ms to cross. So scrolling out of the hero snaps the material and fades
everything else — the one moment on the page where the glass stops behaving like a material.

## Target

Both changing values move to registered custom properties so they can interpolate, and join the
existing transition. **`backdrop-filter` cannot be transitioned directly here** — a filter list
containing a `url()` reference is not interpolable, so the transition would snap on Chromium, which
is the only engine that takes the `url()` declaration. The reason is documented at
`src/app/globals.css:1563-1571`; read it before editing.

```css
/* target — beside the existing @property blocks */
@property --chrome-dim {
  syntax: '<number>';
  inherits: false;
  initial-value: 1.1;
}

@property --chrome-sat {
  syntax: '<number>';
  inherits: false;
  initial-value: 1.6;
}
```

```css
/* target — src/app/globals.css:1355, .site-header structural rule */
  --chrome-dim: 1.1;
  --chrome-sat: 1.6;
  transition:
    color var(--speed-md) var(--ease-thaw),
    background-color var(--speed-md) var(--ease-thaw),
    border-color var(--speed-md) var(--ease-thaw),
    --chrome-dim var(--speed-md) var(--ease-thaw),
    --chrome-sat var(--speed-md) var(--ease-thaw);

/* target — src/app/globals.css:1372, the dark state */
  --chrome-dim: 0.46;
  --chrome-sat: 1.5;

/* target — both glass rules, :2235-2237 and :2272-2274 */
  backdrop-filter: blur(var(--glass-blur-chrome)) saturate(var(--chrome-sat)) brightness(var(--chrome-dim));
  -webkit-backdrop-filter: blur(var(--glass-blur-chrome)) saturate(var(--chrome-sat)) brightness(var(--chrome-dim));
  backdrop-filter: url(#liquid-glass) blur(var(--glass-blur-chrome)) saturate(var(--chrome-sat)) brightness(var(--chrome-dim));
```

The dark state's `brightness(var(--glass-dim))` becomes `brightness(var(--chrome-dim))` with
`--chrome-dim: 0.46` — the same number `--glass-dim` holds today. Confirm that with
`grep -- "--glass-dim:" src/app/globals.css` before hardcoding it; if `--glass-dim` is not `0.46`,
use whatever it actually is and note the change.

**Contrast is the risk.** The dark state's `brightness(0.46)` is not decorative — the comment at
`src/app/globals.css:2258-2266` records that frost text needs the composited backdrop at or below
0.164 relative luminance to clear 4.5:1, and that this filter is what guarantees it. During a 420ms
interpolation the value passes through every point between 1.1 and 0.46, so **for roughly 300ms of
that transition the header's text is over a backdrop brighter than its contrast floor.** That is
the whole judgement in this plan: a 300ms window of degraded contrast against a material that stops
snapping.

Mitigation, and it must be applied: run the interpolation on a curve that spends as little time as
possible in the bright region by using `--speed-ui` (240ms) for the two filter values while the ink
keeps `--speed-md` (420ms). If that still reads as a flash, this plan should be abandoned — record
that outcome rather than shipping a contrast regression.

## Repo conventions to follow

- `@property` blocks sit above their consumer with prose explaining why the value is not animated
  directly. Exemplar: `src/app/globals.css:1563-1576`.
- Both glass rules must keep the **three** `backdrop-filter` declarations in order: plain,
  `-webkit-`, then `url()`. The fallback pattern is documented at `src/app/globals.css:2205-2215`
  and `tests/liquid-glass.test.ts` asserts it.
- Reduced motion: hold both properties at the dark state's values in the reduced-motion block
  beside the existing `--panel-blur` hold (`src/app/globals.css:2726`).

## Steps

1. Confirm `--glass-dim` is `0.46` and `--glass-sat` is `1.5`. If not, use the real values.
2. Add the two `@property` blocks.
3. Add the two custom properties and their transition entries to `.site-header`, using
   `var(--speed-ui)` for the two filter values.
4. Add the two dark-state values to `.site-header[data-on-dark='true']`.
5. Replace the `saturate()` and `brightness()` arguments in both glass rules with the properties,
   in all six declarations (three per state).
6. Add the reduced-motion hold.
7. Run the contrast feel check. **If the transition shows a visible bright flash behind the header
   text, revert everything and mark this plan WONTFIX with that note.**

## Boundaries

- Do NOT change `--glass-blur-chrome`, the tints, the gradients or the box-shadows.
- Do NOT animate `backdrop-filter` directly.
- Do NOT remove any of the three `backdrop-filter` declarations from either state.
- Do NOT change `--glass-dim` or `--glass-sat` themselves — other surfaces read them.
- Do NOT ship this if the contrast check fails. A snapping material is a much smaller problem than
  unreadable text.

## Verification

- **Mechanical**: `npx vitest run` — the liquid-glass suite must still pass, including the
  declare-it-twice assertions. `npm run build` clean.
- **Feel check**: run `npm run dev` on the homepage:
  - Scroll slowly out of the hero into the frost section, watching the header. The material should
    brighten across the same window the ink fades in, with no snap.
  - Scroll back up. Same, in reverse.
  - **The contrast check**: scroll so the transition is halfway, then stop by scrolling in tiny
    increments. Read MENU and BOOK NOW at every point. If either becomes hard to read at any point
    in the sweep, the mitigation failed.
  - Do the same over the hero photograph's brightest region — the ice at the bottom right — which
    is the worst case the 0.46 exists for.
  - Tick **Emulate CSS prefers-reduced-motion: reduce** and confirm the filter no longer
    interpolates.
- **Done when**: the glass crosses beds without snapping **and** the header's labels stay legible at
  every point of the sweep, including over the brightest part of the hero. Otherwise: WONTFIX, with
  the reason recorded here.

## Finding that closed this plan — the ink crossfade is the real problem

Before implementing, the contrast risk this plan warns about was computed rather than guessed, and
the numbers moved the problem somewhere else.

The header's ink already crossfades `deep (#071822) → frost (#F2F7FA)` over 420ms
(`src/app/globals.css:1360`). Measured against the composited backdrop luminance the dark state
guarantees — **0.164**, the figure documented at `src/app/globals.css:2258` — the ink passes through
every value between the two extremes, and mid-grey has poor contrast against a dark backdrop
*and* against a light one:

| t | ink | contrast on the dark backdrop |
| --- | --- | --- |
| 0.0 | `#071822` | 3.68:1 |
| 0.2 | `#36454D` | 2.02:1 |
| **0.4** | **`#657178`** | **1.02:1** |
| 0.6 | `#949EA4` | 1.80:1 |
| 0.8 | `#C3CACF` | 2.96:1 |
| 1.0 | `#F2F7FA` | 4.55:1 |

The trough bottoms at **1.02:1** and the crossfade is below 4.5:1 for its whole 420ms. Every scroll
past a section boundary runs it, in both directions.

**No backdrop value fixes that**, which is why this plan cannot work: fading the glass as well would
change which mid-luminance the ink is crossing, not whether it crosses one. The snap this plan set
out to smooth is cosmetic; the crossfade underneath it is a legibility problem.

The fix belongs in a new plan and is the opposite shape: **stop crossfading the ink**. Either cut
`color` instantly at the flip and let only the tint and border transition, or shorten `color` alone
to `--speed-press` so the trough is 160ms rather than 420ms. Cutting is the honest option — the
header's ink has two correct values and no meaningful state in between.

Not implemented here: it changes the header's behaviour on every scroll and wants a human's eyes
first.
