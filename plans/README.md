# Animation plans

Produced by `improve-animations` on **2026-09-04** against `src/app/globals.css` and
`src/components/`. All nine came from one audit pass; findings 001–006 are corrective, 007–009 are
additive.

**This repo has no VCS** (`git rev-parse` fails — not a git repository), so plans are stamped with a
date rather than a commit. Every plan opens with the current code verbatim; if an excerpt does not
match what you find, stop and report rather than improvising.

## Plans

| # | Title | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| [001](001-card-bloom-hover-duration.md) | Make the card's frost bloom fast on hover, slow on reveal | HIGH | Easing & duration | DONE |
| [002](002-exit-curve-decision.md) | Decide the exit curve: ease-in or ease-out | HIGH | Easing & duration | DONE — Option B |
| [003](003-menu-expansion-layout-cost.md) | Measure the menu's `grid-template-rows` animation before replacing it | MEDIUM | Performance | WONTFIX — unmeasurable here |
| [004](004-drawer-entrance-budget.md) | Bring the menu sheet's entrance inside the drawer budget | MEDIUM | Easing & duration | DONE |
| [005](005-hover-durations.md) | Halve three hover transitions from 420ms to 180ms | LOW | Purpose & frequency | DONE |
| [006](006-easing-consolidation.md) | Resolve the two single-use easing curves | LOW | Cohesion & tokens | DONE — Option A |
| [007](007-gallery-reveal-travel.md) | Give the gallery figures the travel every other reveal has | LOW | Missed opportunity | DONE |
| [008](008-scrim-materializes-with-sheet.md) | Ramp the scrim's blur with the sheet, so one thing arrives once | LOW | Missed opportunity | DONE — phone frame check outstanding |
| [009](009-header-glass-crossfade.md) | Transition the header's glass when it crosses a bed, not just its ink | LOW | Missed opportunity | WONTFIX — superseded, see below |

## Outcome, 2026-09-04

Seven applied, two closed without code. **98 tests, typecheck and build clean.**

The two feel checks these plans call for could not be run: the preview pane reports
`document.visibilityState: hidden`, and browsers do not run CSS transitions in a hidden document —
`getAnimations()` comes back empty even for `transform`. So 002 and 006 were decided on their
catalogue defaults rather than by eye, and 008's frame-rate check on a real phone is still owed.

**009 was closed by a measurement that moved the problem.** The header's ink crossfade passes through
**1.02:1** at the midpoint and stays below 4.5:1 for its whole 420ms, in both scroll directions. No
backdrop value fixes that, so fading the glass as well would not have helped. The fix is the
opposite shape — stop crossfading the ink — and it is written up at the bottom of
[009](009-header-glass-crossfade.md) as the next plan to open.

## Recommended order

Do the cheap certainties first, then the decisions, then the two that might end in WONTFIX.

1. **005** — three one-token swaps, no judgement required. Warms you up on the token rules.
2. **001** — two lines, fixes the worst-feeling bug in the audit (a 900ms hover).
3. **004** — one line, but read the monotonic-order test note first.
4. **007** — four lines, and the only plan that adds motion rather than retuning it.
5. **002** — a decision, not an edit. Needs you on a real phone. Do it before 006 so the two curve
   questions do not get tangled.
6. **006** — the other curve question. Do it after 002.
7. **003** — measurement first; may legitimately end as WONTFIX.
8. **008** — may end as a revert on frame rate. Do it after 004, because it references the sheet's
   timings.
9. **009** — the riskiest, and the only one that can trade contrast for polish. Do it last, and be
   willing to abandon it.

## Dependencies

- **002 before 006.** Both change easing tokens. 002 may delete `--ease-in-quart`; 006 may delete
  two ease-outs. Interleaving them makes the token block hard to reason about and puts two
  unrelated feel checks in one session.
- **004 before 008.** 008's scrim ramp is specified to finish with the sheet, and 004 changes how
  long the sheet takes. Doing 008 first means re-checking it after 004.
- **008 and 009 both add a second animated backdrop filter to the page.** If 008 costs frames on a
  real phone, do not attempt 009 — the answer for 009 will be the same, and worse, because it runs
  during scroll rather than on a discrete open.
- **003 is independent** of all of them.

## Things this audit deliberately did not report

Documented deliberate tradeoffs, per the skill's rule against re-litigating settled decisions.
Listed so a future audit does not spend time on them again:

- **The animated backdrop blur reaching 30px** (`src/app/globals.css:2185`) exceeds the catalog's
  20px transition-time blur ceiling. The performance objection was raised and overruled explicitly,
  with the tradeoff on the table.
- **`will-change: transform` at rest** on `.parallax` (`:787`) and `.section-bg img` (`:1956`).
  Justified at `:771-780`: the transform is rewritten every scroll frame for the life of the page,
  so there is no rest state to release the layer back to. Released under reduced motion.
- **The IntersectionObserver trigger line** (`rootMargin: '0px 0px -10% 0px'`, `threshold: 0.05`) in
  `src/components/InViewRuntime.tsx:83`. Lower than the catalog's 20–30% visible guidance, and
  deliberately so — a high threshold cannot fire for an element taller than the viewport, which was
  a real bug on phones.
- **The ungated `:hover`** at `src/app/globals.css:2584`. It *cancels* a transform below 991px
  rather than adding one, which is the opposite of the flagged pattern.
- **The 32.5ms list stagger** (`--delay-list`). Below the catalog's 40–90ms, deliberately, because a
  vertical list of seven links at 55ms puts the last one 450ms behind the first.
- **`--scroll-percentage` set on a parent and read by a child** (`.section-bg` → its `img`). The
  flagged cost is style recalculation across many children; here there is exactly one.
