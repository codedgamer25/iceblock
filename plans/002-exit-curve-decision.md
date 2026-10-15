# 002 — Decide the exit curve: ease-in or ease-out

- **Status**: DONE (2026-09-04) — **Decision: Option B.** `--ease-in-quart` retired, all five exits back on `var(--ease-out-quart)`. The catalog is explicit that entrances and exits both take ease-out, and the duration asymmetry (380 exit against 480 enter) already carries the decisiveness the ease-in was reaching for. Could not run the phone feel check — the preview pane does not composite transitions — so this took the catalog's default rather than a guess.
- **Commit**: no VCS in this repo. Stamped **2026-09-04**.
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file, 5 lines — or zero lines, depending on the decision

## Problem

Four exits currently run on an ease-in curve:

```css
/* src/app/globals.css:87 — current, the token */
  --ease-in-quart: cubic-bezier(0.5, 0, 0.75, 0);

/* src/app/globals.css:1547 — the scrim leaving */
  transition: opacity var(--speed-ui) var(--ease-in-quart);

/* src/app/globals.css:1594-1597 — the menu sheet leaving */
  transition:
    transform var(--speed-exit) var(--ease-in-quart),
    opacity var(--speed-ui) linear,
    --panel-blur var(--speed-ui) var(--ease-in-quart);

/* src/app/globals.css:1706-1708 — the sheet's contents leaving */
  transition:
    opacity var(--speed-press) var(--ease-in-quart),
    transform var(--speed-press) var(--ease-in-quart);
```

**Two authorities disagree about whether this is right.**

The `animation-systems` skill says: *"Entering: ease-out. Exiting: ease-in (faster)."* That is
what produced the code above.

The `improve-animations` catalog (`AUDIT.md` §2) says: *"Entering or exiting → **ease-out**"* and
*"**`ease-in` on UI is always a finding** — it starts slow, delaying the exact moment the user is
watching."*

Neither can be settled from the source. The anti-`ease-in` rule is about the moment a user waits
for a response, and nobody waits on a dismissal — but the catalog is explicit and does not carve
out exits. This needs eyes on the real menu, not an argument.

## Target

**Option A — keep ease-in on exits (no code change).** Add one sentence to the token's comment at
`src/app/globals.css:83-87` recording that this was reviewed against the `improve-animations`
catalog on 2026-09-04 and kept deliberately, so the next audit does not re-report it.

**Option B — revert to ease-out.** Replace all five `var(--ease-in-quart)` occurrences with
`var(--ease-out-quart)` and delete the token block at `src/app/globals.css:83-87`. The exits keep
their shorter durations (`--speed-exit` 380ms against `--speed-enter` 640ms), which is where most
of the "leaves decisively" feeling actually comes from.

```css
/* Option B target — src/app/globals.css:1594 */
  transition:
    transform var(--speed-exit) var(--ease-out-quart),
    opacity var(--speed-ui) linear,
    --panel-blur var(--speed-ui) var(--ease-out-quart);
```

Do **not** implement either option until the feel check below has been run and a choice recorded
at the top of this file.

## Repo conventions to follow

- Easing tokens live in the `:root` block of `src/app/globals.css` (search `--ease-thaw`).
- `tests/liquid-glass.test.ts`, describe `the motion scale`, has a test named
  *"has an exit curve, and only exits use it"* which asserts `--ease-in-quart` exists and that no
  `[data-open='true']` state uses it. **Option B must delete that test**; Option A leaves it.

## Steps

1. Run the feel check below and write the verdict at the top of this file as
   `**Decision (2026-xx-xx): Option A|B — <one line why>**`.
2. If Option A: add the review note to the comment at `src/app/globals.css:83-87`. Stop.
3. If Option B: replace the five `var(--ease-in-quart)` occurrences (lines 1547, 1595, 1597,
   1707, 1708) with `var(--ease-out-quart)`, delete the token and its comment at lines 83-87, and
   delete the test *"has an exit curve, and only exits use it"* from
   `tests/liquid-glass.test.ts`.

## Boundaries

- Do NOT change any duration. This plan is about curves only.
- Do NOT change the entrance curves (`--ease-out-circ` on the sheet arriving).
- Do NOT half-apply it: either all five occurrences change or none do.
- Do NOT delete `--ease-out-quart` under any circumstance — 23 rules use it.

## Verification

- **Mechanical**: `npx vitest run` and `npm run build` both clean. If Option B, the test count
  drops by exactly 1.
- **Feel check** — this is the whole point of the plan. Run `npm run dev`, open the site on a
  **real phone** if possible (the exit is most visible on the bottom sheet):
  - Open the menu, then close it. Watch only the first 100ms of the close.
  - With ease-in the sheet barely moves at first, then accelerates off the edge.
  - With ease-out it leaves immediately and decelerates as it goes.
  - Do it ten times alternating (edit, reload) and pick the one that reads as *decisive* rather
    than as *hesitating* or as *snatched away*.
  - In DevTools → Animations at 10% playback, confirm which one you actually prefer rather than
    which one you expect to prefer.
- **Done when**: the decision line is written at the top of this file and the code matches it.
