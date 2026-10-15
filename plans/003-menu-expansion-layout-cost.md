# 003 — Measure the menu's grid-template-rows animation before replacing it

- **Status**: WONTFIX (2026-09-04) — the plan requires before/after frame numbers under 4x CPU throttling and this environment cannot produce them: the preview pane reports `document.visibilityState: hidden`, so no transition runs and the Performance panel has nothing to record. The tradeoff at globals.css:1855-1862 is documented, the duration was already cut from 700ms to 240ms to mitigate it, and shipping an unmeasured performance rewrite is what step 3 of this plan forbids. Re-open with a real device profile.
- **Commit**: no VCS in this repo. Stamped **2026-09-04**.
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: measurement only, or 1 CSS file + no markup change if it proceeds

## Problem

The menu's link list expands by animating a layout property:

```css
/* src/app/globals.css:1863-1868 — current */
.link-item-links {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  padding-left: calc(var(--u) * 2.2);
  transition: grid-template-rows var(--speed-ui) var(--ease-out-quart);
}
```

`grid-template-rows` is a layout property. Every frame of that 240ms transition costs layout →
paint → composite, where `transform` and `opacity` cost composite alone. The catalog
(`AUDIT.md` §5) says animate `transform` and `opacity` only.

**This is already a documented deliberate tradeoff.** The comment at `src/app/globals.css:1855-1862`
says it is "the most expensive thing on this page per frame", explains that `0fr → 1fr` is the only
way to reveal auto-height content without hardcoding a height, and records that the duration was
cut from the reference site's 700ms to 240ms specifically to reduce the cost.

So the finding is not "this is wrong". It is: **the cost was reasoned about but never measured**,
and it runs on the one surface that also carries a 30px animated backdrop blur (the menu sheet),
on an audience the repo's own comments describe as being on mid-range Android.

## Target

**Step 1 is a measurement, not an edit.** Only if the measurement shows dropped frames does the
rewrite below happen.

If it proceeds, the replacement animates the inner wrapper instead, which is composite-only:

```css
/* target — src/app/globals.css */
.link-item-links {
  display: grid;
  grid-template-rows: 1fr;   /* no longer animated */
  overflow: hidden;
  padding-left: calc(var(--u) * 2.2);
  /* Height is now set by a max-height that does not animate; the reveal is the inner wrapper
     sliding up behind `overflow: hidden`, which is composite-only. */
  max-height: 0;
  transition: max-height 0s linear var(--speed-ui);
}

.link-item-links-inner {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 0.75);
  transform: translateY(-100%);
  transition: transform var(--speed-ui) var(--ease-out-quart);
}

.link-item[data-active='true'] .link-item-links {
  max-height: 100vh;
  transition-delay: 0s;
  margin-bottom: calc(var(--u) * 1.75);
}

.link-item[data-active='true'] .link-item-links-inner {
  transform: none;
}
```

`translateY(-100%)` is the wrapper's own height, so nothing is hardcoded — see `AUDIT.md` §8 on
percentage translates. The `max-height` flips with a delay on close so the container does not
collapse before the slide finishes.

## Repo conventions to follow

- Duration and easing tokens only, never literals (`tests/liquid-glass.test.ts` enforces it).
- The sub-links already carry their own staggered opacity and translate at
  `src/app/globals.css:1900-1915` — do not duplicate or fight that. The container's motion is
  scenery behind them, which the existing comment says explicitly.

## Steps

1. **Measure.** Run `npm run dev`, open DevTools → Performance, start recording, open the menu and
   expand two different groups, stop. In the flame chart, look at the frames during the 240ms
   expansion and record: (a) longest frame in ms, (b) whether any frame exceeds 16.7ms, (c)
   whether "Layout" appears in the frame breakdown. Write the three numbers into this file under a
   new `## Measurement` heading.
2. Repeat step 1 with CPU throttling set to **4× slowdown** (Performance panel → gear icon), which
   approximates the mid-range Android this site is built for. Record the same three numbers.
3. **Decide.** If no frame exceeds 16.7ms under 4× throttling, mark this plan `WONTFIX`, note the
   numbers, and stop — the documented tradeoff holds and the rewrite is not worth the risk.
4. If frames are dropped, apply the Target CSS above, then re-measure with step 2 and record the
   after numbers. Keep the change only if the longest frame improved.

## Boundaries

- Do NOT edit any `.tsx` file. The markup already has the wrapper this needs
  (`.link-item-links-inner`, `src/components/SiteHeader.tsx:321`).
- Do NOT change the 240ms duration or the easing.
- Do NOT touch the sub-link stagger at `src/app/globals.css:1900-1915`.
- Do NOT apply the rewrite without the before/after numbers in this file. An unmeasured
  performance change is a guess.
- If the comment at lines 1855-1862 has been rewritten since this stamp, STOP and report.

## Verification

- **Mechanical**: `npx vitest run` and `npm run build` clean.
- **Feel check**: open the menu, expand a group, collapse it, expand a different one:
  - The links must still appear to slide down from behind the heading, not fade in place.
  - Collapsing must not clip the links before they have left — watch the last link.
  - Expand and collapse the same group rapidly five times. The reveal must retarget from wherever
    it is, never restart from zero.
  - On a real phone, expand a group while scrolling the menu. No stutter in the scroll.
- **Done when**: either `WONTFIX` with numbers, or the rewrite is in with before/after numbers
  showing the longest frame improved under 4× throttling.
