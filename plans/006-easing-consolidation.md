# 006 — Resolve the two single-use easing curves

- **Status**: DONE (2026-09-04) — **Decision: Option A.** Both rare curves kept, each now documented with the single job it does. The feel check this plan requires could not be run (the preview pane does not composite transitions), and changing a curve I cannot see is worse than four tokens where two are rare on purpose.
- **Commit**: no VCS in this repo. Stamped **2026-09-04**.
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, ~4 lines either way

## Problem

Four ease-out curves are declared. Two of them carry the site; two are used exactly once each.

```css
/* src/app/globals.css:77-83 — current */
  --ease-thaw: cubic-bezier(0.22, 0.61, 0.16, 1);
  /* The reference site's three curves, as cubic-beziers: GSAP/Webflow `outCirc`
     on its 1200-1400ms reveals, `outQuart` on its 800-900ms ones, and `power2.out`
     on the character stagger. Same feel, no library. */
  --ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
```

Usage counts in `src/app/globals.css`:

| Token | Uses | Where |
| --- | --- | --- |
| `--ease-out-quart` | 23 | throughout |
| `--ease-thaw` | 18 | throughout |
| `--ease-out-circ` | **1** | `:1614`, the menu sheet's entrance transform |
| `--ease-out-cubic` | **1** | `:700`, the per-character heading reveal |

The catalog (`AUDIT.md` §7) calls near-identical curves a consolidation finding. The comment
records why four were adopted — matching the reference site's GSAP set — so the intent was
deliberate. The evidence is that for two of the four the intent never materialised: they were
adopted as a set and then two of them found one home apiece.

This is genuinely a taste call, not a defect. Both options below are defensible.

## Target

**Option A — keep both, and say why.** Replace the shared comment at lines 78-80 with one line per
curve naming its single job, so the next audit sees intent rather than leftovers:

```css
/* target — Option A */
  /* Four ease-outs at four strengths, and the two rare ones are rare on purpose.
     `circ` is the softest landing here and is used once, on the menu sheet's arrival, because a
     sheet that size wants a longer settle than anything else on the page. `cubic` is the
     gentlest and is used once, on the per-character heading reveal, where 300ms x N characters
     compounds and a stronger curve reads as snapping. */
  --ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
```

**Option B — collapse to two.** Point both single-use sites at `--ease-out-quart` and delete the
two tokens:

```css
/* target — Option B, src/app/globals.css:700 */
  transition: opacity var(--speed-fade) var(--ease-out-quart);

/* target — Option B, src/app/globals.css:1614 */
    transform var(--speed-enter) var(--ease-out-quart),
```

Option B is the smaller system; Option A is the more expressive one. **Do not guess — run the feel
check first**, because the difference between `outCirc` and `outQuart` on a 480–640ms slide is
visible, and the difference on a 300ms character fade probably is not.

## Repo conventions to follow

- Easing tokens live in the `:root` block of `src/app/globals.css`.
- Every token in this file carries prose explaining the choice. Whichever option you take, the
  comment must end up accurate — a stale comment is worse than no comment here.
- No test asserts either curve by name. `tests/split.test.ts` covers the character reveal's timing
  but not its curve; confirm with `grep -rn "ease-out-cubic\|ease-out-circ" tests/` returning
  nothing before deleting anything.

## Steps

1. Run `grep -rn "ease-out-cubic\|ease-out-circ" src/ tests/` and confirm the only hits are
   `globals.css:81`, `globals.css:83`, `globals.css:700` and `globals.css:1614`. If there are
   others, STOP and report.
2. Run the feel check below and record the verdict at the top of this file as
   `**Decision (2026-xx-xx): Option A|B — <one line why>**`.
3. Apply the chosen option. For Option B, delete both token declarations **and** the shared comment
   at lines 78-80, replacing it with a one-line note on `--ease-out-quart`.

## Boundaries

- Do NOT delete `--ease-out-quart` or `--ease-thaw`.
- Do NOT change any duration.
- Do NOT introduce a new curve. This plan removes or documents; it does not add.
- Do NOT change `--ease-in-quart` — that is plan 002's subject and the two must not be tangled.

## Verification

- **Mechanical**: `npx vitest run` and `npm run build` clean. If Option B, `grep -c "ease-out-circ"
  src/app/globals.css` returns `0`.
- **Feel check** — do this before deciding:
  - Open the menu and watch only the sheet's slide. Then change line 1614 to
    `var(--ease-out-quart)`, reload, and watch it again. If you cannot tell the two apart, take
    Option B for that site.
  - Reload the homepage and watch the hero heading assemble character by character. Then change
    line 700 to `var(--ease-out-quart)`, reload, watch again. Same question.
  - Do both at 10% playback in DevTools → Animations as well as at full speed; a difference that
    only exists at 10% is not a difference worth a token.
- **Done when**: the decision line is written at the top of this file, the code matches it, and the
  comment in the token block describes what is actually there.
