---
name: Koolink
description: "An ice core in five strata: cool industrial editorial for a Nigerian refrigeration manufacturer."
colors:
  frost: "#F2F7FA"
  sheet: "#E3ECF2"
  glacier: "#C3D8E6"
  deep: "#071822"
  abyss: "#041017"
  steel: "#3A5060"
  haze: "#9FBCCC"
  marine: "#146579"
  cyan: "#2BA8CE"
  chill: "#5FD3EE"
  ember: "#B23A08"
  tile-muted: "#D1E1E7"
typography:
  display:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(48px, 6.6vw + 23.25px, 118px)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(34px, 4.1315vw + 18.507px, 78px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(27px, 2.3474vw + 18.1972px, 52px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.018em"
  subtitle:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(20px, 0.939vw + 16.4789px, 30px)"
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: "-0.012em"
  figure:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(48px, 6.6vw + 23.25px, 118px)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.045em"
    fontFeature: "'tnum' 1"
  lead:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(17px, 0.4695vw + 15.2394px, 22px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(16px, 0.1878vw + 15.2958px, 18px)"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(14px, 0.0939vw + 13.6479px, 15px)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(11px, 0.1878vw + 10.2958px, 13px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  focus: "3px"
  stamp: "calc(var(--u) * 0.13)"
  tile: "calc(var(--u) * 0.4)"
  base: "calc(var(--u) * 0.58)"
  card: "calc(var(--u) * 1.45)"
  panel: "calc(var(--u) * 1.8)"
  pill: "9999px"
spacing:
  unit: "clamp(12px, 0.96vw, 18px)"
  gutter: "calc(var(--u) * 1.88)"
  margin: "calc(var(--u) * 4.6)"
  header: "calc(var(--u) * 6)"
  section-sm: "calc(var(--u) * 5.5)"
  section: "calc(var(--u) * 10.7)"
  shell: "calc(var(--u) * 85)"
components:
  button-primary:
    backgroundColor: "{colors.frost}"
    textColor: "{colors.deep}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.frost}"
    textColor: "{colors.deep}"
  button-secondary:
    textColor: "{colors.frost}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "52px"
  product-tile:
    backgroundColor: "{colors.marine}"
    textColor: "{colors.frost}"
    rounded: "{rounded.tile}"
    padding: "calc(var(--u) * 1.25)"
    height: "calc(var(--u) * 23.88)"
  product-tile-hover:
    backgroundColor: "{colors.deep}"
  phone-stamp:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.frost}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "calc(var(--u) * 0.28) calc(var(--u) * 0.65)"
  card:
    rounded: "{rounded.card}"
    padding: "calc(var(--gutter) * 1.25)"
---

# Design System: Koolink

## Overview

**Creative North Star: "The Ice Core"**

The site is a vertical section cut through ice. Five section beds run from `frost`
(#F2F7FA) at the surface down through `sheet`, `glacier`, `deep` and `abyss` (#041017) at
the floor, and scrolling the page is descending through those strata. A section declares
which depth it is; everything inside it reads its own text color, hairline and accent from
that declaration, so no component ever needs to know whether it is sitting on light or
dark. That single mechanism is what lets the page change temperature five times without a
single component learning a light and a dark variant.

The register is industrial editorial, not consumer soft. Type is set in Archivo at four
distinct tiers with negative tracking, structure is carried by 1px hairline rules rather
than by boxes, and figures get their own scale because a number is the one piece of
content that can carry a section on its own. There is exactly one fashionable material
here, glass, and it earns its place because ice and glass are the same physical problem:
something clear that bends what is behind it.

Everything dimensional descends from one proportional unit. `--u: clamp(12px, 0.96vw,
18px)` is the site's only measure of length, and gutters, page margins, section rhythm,
radii, shadow offsets and animation distances are all `calc()` off it. The result behaves
like a drawing that scales rather than a layout with breakpoint variants: change the unit
and the entire composition breathes together.

**Key Characteristics:**

- One proportional unit (`--u`) governs every dimension; type sits on its own clamps so
  text size is never purely a function of window width.
- Five tonal beds, one component set. Depth is declared by the section, inherited by
  everything inside it.
- Hairlines instead of containers. Structure comes from 1px rules and negative space.
- Real refraction, sparingly. Four surfaces get `backdrop-filter`; nothing else does.
- Monochromatic cool by instruction, with exactly one warm accent used exactly once.
- Every glass value is a contrast measurement, not a taste choice.
## Colors

An entirely cool palette running white-blue to near-black, sampled from ice rather than
from a brand guideline, with a single warm exception that exists to be alarming.

### Primary

- **Marine** (#146579): the accent on all three light beds. A deep desaturated teal, dark
  enough to hold its own as link and label color against frost without becoming a second
  ink. Used on the wordmark's initial, active nav states, link hovers and inline emphasis.
  Measured against the light beds: 6.14:1 on frost, 5.54:1 on sheet, 4.51:1 on glacier.
- **Chill** (#5FD3EE): the accent on both dark beds. The same role as Marine, lifted to
  where it reads against `deep` — 10.35:1 there and 11.03:1 on abyss. The pair is one accent
  with two altitudes, never two accents in play at once, and it is not interchangeable:
  marine on abyss is 2.16:1 and chill on frost is 2.10:1, so a surface that declares the
  wrong altitude fails rather than merely looks off.

### Secondary

- **Cyan** (#2BA8CE): the interaction color, distinct from the accent. It fills the product
  tile's corner square on hover, draws the frost bloom on cards, and is the text selection
  color at 35% alpha. It signals *something responded*, never *something is important*. It
  is deliberately **not** the focus ring: measured against the light beds it reaches only
  2.56:1 on frost, 2.31:1 on sheet and 1.88:1 on glacier, all under the 3:1 a focus
  indicator must clear, so the ring reads `var(--accent)` and inherits the bed instead.

### Tertiary

- **Ember** (#B23A08): the one warm value in the system, and it appears exactly once, on
  the "visit our office, or send someone, before making any payment" caution in the
  Offices section, as a 35%-alpha border and the label color inside it.

### Neutral

- **Frost** (#F2F7FA): the top stratum and the page's default background. Also the ink on
  both dark beds and the fill of the primary button there.
- **Sheet** (#E3ECF2): the second stratum. A frost that has been breathed on; used where
  two light sections meet and need separating without a rule.
- **Glacier** (#C3D8E6): the third stratum, and the last light one. Carries a heavier
  hairline (18% versus frost's 12%) because a rule has to work harder on a tinted bed.
- **Deep** (#071822): the primary dark bed and the ink on all three light beds. Relative
  luminance 0.01253.
- **Abyss** (#041017): the floor. Relative luminance 0.00546, effectively black with a
  blue cast, reserved for the deepest sections and for glass tint on dark.
- **Steel** (#3A5060): muted text on light beds.
- **Haze** (#9FBCCC): muted text on dark beds, and the color of the deliberately empty
  product frame. It is only valid on `deep` and `abyss`: on the marine product tile it
  measures 3.33:1, which is what `tile-muted` exists to replace.
- **Tile Muted** (#D1E1E7): the muted ink inside a product tile, and the one color in the
  palette that is derived rather than picked — `color-mix(in srgb, rgb(var(--marine)) 15%,
  rgb(var(--frost)))`. The tile is the only surface on the page whose background is not one
  of the five beds, so it needs its own secondary tone, and that tone belongs to marine's
  hue rather than to the neutral ramp. 4.94:1 at rest, 13.44:1 once the tile darkens on
  hover.

### Named Rules

**The One Accent Altitude Rule.** Marine and Chill are the same accent at two depths, never
two colors. A section uses whichever its bed declares and never reaches across for the
other.

**The One Warm Thing Rule.** Ember appears once in the entire site, on the payment
caution. Its rarity is the entire mechanism: a customer scanning a cool page stops at the
one warm thing on it. Nothing decorative may ever use it, and a second use destroys the
first.

**The Interaction-Is-Not-Emphasis Rule.** Cyan means something responded to a pointer.
Marine and Chill mean something matters. Swapping them makes hover states look like
headlines and headlines look like hover states.

**The Own-Bed Rule.** Any surface that is not inside a `.theme-*` section must declare the
bed tokens itself. `--text`, `--text-muted`, `--rule`, `--accent`, `--btn-fill` and
`--btn-ink` only exist inside a bed, and outside one they resolve to nothing — a component
reading them then silently falls back to the inherited body ink, which is dark. This has
already cost three real defects: the focus ring, invisible on two thirds of the page; the
mobile action bar's Call label at 1.00:1 against its own backdrop; and the header, which had
no `--accent` at all, so the wordmark's initial and the focus ring both resolved to marine
over the hero — 2.03:1. Fixed chrome, portals, and anything `position: fixed` are the cases
that bite, and the header is the one that bites twice because it has two states. Either
declare the tokens on the element or give every read a fallback.
## Typography

**Display Font:** Archivo (with 'Helvetica Neue', Arial fallback), loaded via `next/font`
as `--font-display`. Every heading, figure and the wordmark.

**Body Font:** Geist (with system-ui fallback), from the `geist` package as
`--font-geist-sans`. Everything that is read rather than seen.

**Character:** A grotesque with real weight and a slightly condensed cast set against a
neutral, highly legible workhorse. Archivo carries the industrial half of the brief:
it looks like signage on a machine rather than a typeface chosen for a startup. Geist was
picked over Inter deliberately — equally legible at 16px on a cheap phone, without the
every-AI-site-uses-it association.

### Hierarchy

- **Display** (500, `clamp(48px, 6.6vw + 23.25px, 118px)`, 0.94, -0.035em): the two or
  three moments that carry the page. Hero and the numbers spread only.
- **Headline** (500, `clamp(34px → 78px)`, 1.02, -0.022em): the tier below display, for a
  section that needs to speak at nearly full volume.
- **Title** (500, `clamp(27px → 52px)`, 1.06, -0.018em): ordinary section headings.
- **Subtitle** (500, `clamp(20px → 30px)`, 1.14, -0.012em): the `h2-quiet` tier, for
  sections whose job is to be read rather than seen, and for card headings.
- **Lead** (400, `clamp(17px → 22px)`, 1.5): the paragraph directly under a heading, set in
  muted text.
- **Body** (400, `clamp(16px → 18px)`, 1.6): default.
- **Small** (400, `clamp(14px → 15px)`, 1.55): captions, tile copy, button labels.
- **Label** (500, `clamp(11px → 13px)`, 1.2, +0.16em, uppercase): the eyebrow. One per
  section, above a heading, never as a heading itself.
- **Figure** (500, display size, 0.86, -0.045em, tabular): standalone numerals — 25, 500+,
  4. Tighter tracking and leading than display type, because a numeral has no descenders
  to protect and looks loose at display tracking.

All headings carry `text-wrap: balance`. All numerals carry `font-variant-numeric:
tabular-nums` so a column of figures aligns and a changing number does not shift its
neighbours.

### The Wordmark

`Koolink`, set in the display face at the tightened tracking a five-letter name needs to read
as a logotype rather than a word. It appears three times — header, menu sheet, footer — from
one component, sized in `em` so it scales with whatever it is dropped into.

There is exactly one K in it, and that is a correction rather than a given. A drawn K mark used
to sit immediately to its left; set before a word beginning with the same letter, the header
read "K Koolink", and once a reader notices that they cannot stop. The mark is gone and the
word's own initial does the job — **drawn**, not set, because what it is drawn as does not exist
in any loaded face.

**The initial** is a didone K where every stroke is split into a hairline and a heavy stroke: a
hairline at the left edge of the stem with the weight beside it, joined top and bottom by flat
unbracketed serifs, and a second hairline running outside the leg. That split is what makes one
letter read as two overlapping Ks. The arm is a single tapering hairline curved like a swash,
because a straight hairline at this contrast reads as a rule rather than a stroke.

Its weights are size decisions, not taste, and the size itself is not negotiable: the initial
matches the cap height of the letters after it, which puts it between **14px and 21px** across
`--step-h3`. `scripts/draw_wordmark_k.py` holds the geometry, rasterises it, and magnifies the
pixel grid at 21, 18 and 14px so the drawing is judged where it actually renders:

- **The hairline is 7 units against the stem's 12.5**, not the roughly 1-against-13 of a display
  didone. At a 14px cap one device pixel is 100/14 = 7.14 units on the drawing's grid, so
  anything finer anti-aliases to a grey smear instead of a stroke. That is exactly what the
  raster showed at 4.6: the stem's hairline became a soft band and the split stopped reading.
- **The split lives only in the stem.** The leg had a hairline companion too, and at every size
  tested it merged into the leg and read as a thickened edge rather than a second stroke, so it
  is gone.
- **The mark is 0.714em**, which is Archivo's 0.70em cap height times 102/100 — the drawing's cap
  is 100 of its 102-unit viewBox. Measured on the live element at 120px: 84px against the text's
  83px, which is the granularity of `actualBoundingBoxAscent` rather than a mismatch. Change the
  display face and this number has to be re-measured.

An earlier pass set the initial as a 1.55em versal with a finer hairline, which is where the fine
contrast survives. It read as too big beside the rest of the word, and matching the cap height is
what forced the drawing to be re-cut heavier. The reference artwork's contrast is a display-size
effect; at 14px the pixel grid, not the design, sets the floor.

It is `currentColor`, not the accent: the artwork is black ink on paper, and a large ornate
initial in bright cyan reads as a sticker rather than a logotype.

Two implementation notes worth keeping. The drawing's baseline is the **bottom edge of its
viewBox**, so `vertical-align: baseline` aligns it with the text for free and there is no magic
offset to keep in sync with the artwork. And the `.logo-k` wrapper must stay a plain inline box:
as an inline-block it forms its own line box, takes a baseline from the mark inside it, and that
baseline then gets aligned against the outer one — the two struts' descents compound and the
wordmark's box grew from 43px to 62px, dragging `oolink` below the mark.

The letter itself stays in the document behind the drawing, visually hidden with `clip-path`
rather than `display: none`, so the wordmark still reads as one word to a screen reader and to a
text selection. An `aria-label` on the header link would only have covered the header; the
footer and the menu sheet have none.

### Named Rules

**The Four Tiers Rule.** An audit of the finished page found every single `h2` rendering at
exactly 52px, and that uniformity is what makes a site read as templated no matter how good
the individual parts are. Display, headline, title and subtitle exist so that something can
be more important than something else. Never add a fifth tier; never collapse to one.

**The Negative Tracking Rule.** Tracking tightens as size grows: -0.012em at 30px,
-0.018em at 52px, -0.035em at 118px, -0.045em on figures. At display sizes default
tracking reads as loose, and negative tracking is most of what separates display type from
big body type.

**The Eyebrow Is Not A Heading Rule.** The uppercase 0.16em label sits above a heading and
labels it. It never replaces one, and it never appears twice in a section.
## Layout

**One unit, three bands.** `--u` is the site's only measure of length:

| Band | Unit | Behavior |
|---|---|---|
| Default | `clamp(12px, 0.96vw, 18px)` | 13.8px at 1440, floors at 12px below 1250, caps at 18px past 1875 |
| ≤ 991px | `clamp(12px, 1.75vw, 18px)` | the unit re-scales rather than the layout re-flowing |
| ≤ 479px | `clamp(12px, 4vw, 18px)` | phones get a unit proportional to a narrow viewport |

Everything spatial is a multiple of it: gutter `1.88u`, page margin `4.6u`, header height
`6u`, section rhythm `10.7u` (or `5.5u` for a quiet section), content shell `85u` capped and
centered. Radii, shadow offsets and animation distances are the same arithmetic. This is
why there are only three media queries in a 1,949-line stylesheet: the composition is
authored in proportions, and the breakpoints re-proportion the unit rather than rewriting
the layout.

**Anchoring.** Every `section[id]` carries `scroll-margin-top: calc(var(--header-height) +
var(--u))`, so a section reached from the menu, from a shared link, or by typing the URL
lands clear of the fixed header.

**Three rhythms, not one.** Uniform vertical padding was the other half of what made the
page read as templated. Loud sections take the full `10.7u`; quiet ones take `5.5u`; the
product row takes `12u` of top margin because its photographs hang up out of their tiles
and need the air.

**The row idiom.** Figures and machine specifications share one device: a two-column grid
with a hairline on top, `5fr / 7fr` for figures and `4fr / 8fr` for specs (an option name is
two or three words; a numeral is one glyph doing a headline's work). Two sections using the
same device is consistency. Two sections each inventing their own box is what makes a page
read as assembled.

### Named Rules

**The Unit Rule.** Never write a raw pixel dimension. If a value is not a multiple of
`--u`, it is either type (which has its own clamps), a hairline (always exactly 1px), or a
mistake.

**The Three Queries Rule.** A new breakpoint is a last resort. Re-proportioning the unit or
changing a grid's column count inside an existing band is almost always the real fix.

## Elevation & Depth

Tonal, with material exceptions. Depth is carried by the five beds and by 1px hairlines;
a shadow only exists where a real material would cast one. There are exactly two such
places: under glass, and under the product photograph that hangs out of its tile.

The glass system separates surfaces from their background with **light on the edge rather
than darkness underneath** — a bright rim, then a tighter ring inside it, then the faintest
lift. That is a deliberate inversion of the usual card shadow, and it is what makes the
panels read as thick glass rather than as floating rectangles.

### Shadow Vocabulary

- **Glass lift** (`0 calc(var(--u) * 0.8) calc(var(--u) * 2) rgb(var(--deep) / 0.22)`,
  under `inset 0 1px 0 rgb(spec / 0.28)` and `inset 0 -2px 0 rgb(tint / 0.3)`): the
  standard four-layer glass edge. Top highlight where a bevel would catch light, bottom
  shading so the surface has both edges and reads as raised rather than flat.
- **Panel rim** (`inset 0 0 0 1px rgb(255 255 255 / 0.16)`, `inset 0 1px 2px rgb(255 255
  255 / 0.3)`, `0 1u 3u rgb(0 0 0 / 0.34)`): the menu panel. Two rings at different alphas
  read as the thickness of a real sheet of glass.
- **Hanging photograph** (`0 1.2u 2.4u rgb(var(--deep) / 0.28)`): the product photo, the
  only genuinely lifted object in the system. It breaks out of its tile, so it casts.
- **Header** (`0 1px 1.5u rgb(var(--deep) / 0.07)` light, `rgb(0 0 0 / 0.3)` dark): barely
  there. The header is separated by its blur and its hairline, not by a shadow.

### Named Rules

**The Edge-Light Rule.** A raised surface is separated by a bright rim, not by a dark
shadow. If a new component needs to lift, give it a 1px highlight along its top edge before
reaching for `box-shadow`.

**The Two Casters Rule.** Only glass and the hanging photograph cast. A card, a tile, a
row or a section that acquires a drop shadow has broken the system.

## Shapes

Seven radii and no others, every one of them named — an unnamed radius is how a form
language drifts, and the count is high because the page genuinely has seven scales of
corner, not because the scale was never pruned. **Focus** (`3px`) is the ring's own
rounding, and the only radius in the system that is a fixed pixel value rather than a
proportion, because a 2px outline is fixed too. **Stamp** (`0.13u`, ≈1.8px) is the corner
square inside a product tile, near-sharp on purpose. **Tile** (`0.4u`, ≈5.5px) is the
product tiles and their photographs, where near-square corners read as industrial. **Base**
(`0.58u`, ≈8px) is the default for small surfaces. **Card** (`1.45u`, ≈20px) is cards and
the menu's link headings. **Panel** (`1.8u`, ≈25px) is the menu sheet, and it is more
generous than a card on purpose: it is the largest surface on the page, and a corner that
reads as generous at 340px reads as timid at full height. **Pill** (`9999px`) is buttons and
the phone stamp, the only fully round form in the system.

Borders are always exactly 1px, and their color is always `var(--rule)` (a bed-declared
alpha of the ink: 12% on frost, 14% on sheet, 18% on glacier, 16%/14% on the dark beds) or a
glass rim alpha. There is no 2px border anywhere and no dashed or dotted line.

Two recurring silhouettes define the form language. The **hairline row** — content on a
grid with a rule across its top — is the structural unit for anything list-shaped, and it
works only because nothing clips: the rules run edge to edge in their column. The **hanging
frame** — a 4:3 photograph pulled `8u` up out of the top of its tile — is the signature
shape, and it depends on there being no `overflow: hidden` anywhere on its way up the tree.

### Named Rules

**The No-Box Rule.** Reach for a hairline before a bordered container. The page has almost
no boxes in it, and adding one costs more than the structure it buys.

**The Nothing-Clips Rule.** The hanging photograph breaks out of its tile. Any
`overflow: hidden` added to a product tile or an ancestor of one silently destroys the
site's signature move.

## Components

Precise and industrial. Edges are exact, numerals are tabular, nothing is soft for the sake
of being soft. The pills and the lens are the only curves in the system.

### Buttons

- **Shape:** fully round (`9999px`), 52px minimum height, `0 1.5rem` padding, 15px label at
  weight 600 with +0.01em tracking.
- **Primary:** inverts its bed rather than changing hue, because the palette is
  monochromatic by instruction and hue is not available for hierarchy. A light frosted pill
  on a dark section, a dark one on a light section, at 90% fill — enough of the bed comes
  through at the edges to read as glass rather than paint, and the label still measures
  13.7:1 on a dark section.
- **Secondary:** barely there. A 7% white wash, a 50%-alpha rim, a tighter 16% ring inside
  it. Against the primary the hierarchy reads at a glance with one palette.
- **Every button is glass:** `blur(14px) saturate(1.5) brightness(0.94)`, plus one specular
  sweep across the top **30%** of the pill. 30% and not 50% is a contrast constraint, not a
  taste one: the label occupies roughly 35–65% of a 52px pill, and at 52% the sweep crossed
  it and dropped frost-on-secondary from 6.49:1 to 3.29:1, under AA for 15px text.
- **Hover:** fill goes to 100% (primary) or 16% (secondary), the rim brightens, and the pill
  rises 1px over 420ms on `ease-out-quart`. **Active:** it settles back to 0 rather than
  jumping, at the 180ms duration.

### Cards

- **Corner Style:** card radius (`1.45u`, ≈20px).
- **Border:** 1px `var(--rule)`, inherited from the bed.
- **Background:** none of its own; the bed shows through.
- **Internal Padding:** `1.25 × gutter`.
- **Signature:** the **frost bloom** — a crystal grows out of the top-left corner when the
  card arrives or is hovered, drawn with two conic gradients on a pseudo-element masked by a
  radial falloff, so it costs no markup and no image. It fades in over 900ms on `ease-thaw`.

### Navigation

- **Header:** three-column, glass, fixed. It measures the bed behind it geometrically and
  flips `data-on-dark`, which swaps the tint from `frost / 0.12` with `brightness(1.12)` (a
  light bed wants its backdrop *lifted*, since the ink is dark) to `abyss / 0.08` with
  `brightness(0.42)`.
- **Menu panel:** a sheet of glass laid over the site, not a new page. 8% tint,
  `blur(30px)`, `brightness(0.46)`, a 50%-alpha rim, and it sits on the scrim rather than on
  the page. At that transparency you can trace the page's own structure straight across the
  panel, which is the entire point.
- **Links:** display face, sentence case, with an icon that translates on hover. Active
  state via `aria-current`, colored with the bed's accent.
- **Mobile:** a fixed bottom action bar (WhatsApp + Call) on phones only, which tucks away
  over the footer, over the hero's own CTA row, and while the menu is open — anywhere a
  duplicate of its own two actions is already on screen. It respects
  `env(safe-area-inset-bottom)`, and because it is fixed chrome with no bed above it, it
  declares the dark-bed tokens itself per The Own-Bed Rule.
### Product Tile (signature component)

The one component that defines the site. A marine block `23.88u` tall with its content
anchored to the bottom, a 4:3 photograph suspended `8u` above it and breaking out of its top
edge, a `3.38u` square in the top-right corner holding an arrow, and a caption row whose
rule extends to fill the remaining width. On hover the block darkens marine → deep, the
photograph rises another `0.5u`, and the corner square fills with cyan.

Two details are content requirements rather than decoration. The **phone stamp** — the
number on a pill at the bottom-left of every photograph — exists because a screenshot of one
tile, shared into a WhatsApp group with no link attached, still has to carry a number to
call. And the **empty frame** is deliberate: where a real photograph is missing, the frame
shows a fine grid on abyss with a line of haze text, because stock photography of somebody
else's machine teaches a customer something untrue about this company.

### Photograph Gallery (signature component)

The `/products` catalogue has 29 photographs across nylon machines, mould machines, cold
rooms and solar systems. Category filters retain the existing hash links and browser history.
The default grid uses three columns on desktop, two on tablets and one on phones. Every image
uses `object-fit: contain`, so the original Koolink badge and phone numbers stay visible.

The product surfaces use off-white `#f6f8f6`, charcoal `#222b28`, muted ink `#59635e`, green
`#236349` and light grey image beds `#e9edea`. Product cards have 8px corners, fixed image
areas, a caption and a Book now action. Type sizes are fixed within responsive breakpoints.
The homepage uses the same treatment for four product cards with direct range links.

An enlarged photograph opens in a native modal dialog, with previous/next controls, a caption,
phone stamp and a booking link containing the selected image. Escape closes it and focus returns
to the opener. The existing Lenis instance pauses while the modal is open.

Desktop visitors can choose the React Bits-inspired scroll stack as an alternate view. The
shared InViewRuntime refreshes its measurements when the category or view changes; there is
still only one Lenis owner. Phones and Reduced Motion keep the normal grid. Filter changes
use a short fade and rise, disabled for Reduced Motion. No image blur is added.

### Glass (signature system)

Two kinds, and the distinction is about performance as much as looks.

`.glass` does the real thing: `backdrop-filter: url(#liquid-glass) blur() saturate()
brightness()`, declared twice so the plain blur-and-brightness version is there for an engine that
rejects the reference one. Refraction renders in Chromium only in practice, so the base is tuned
to stand up without it. It is reserved for the four surfaces with something behind them worth
bending: the header, the menu panel, the buttons, and the number stamped on a photograph.

`.glass-surface` is the same visual language with no filter at all — specular top edge,
raking 148° sheen, low-alpha rim. On a flat color bed there is nothing to refract, so a blur
there costs a composite and buys a placebo.

**The refraction is a lens, not noise.** The reference material's defining behaviour is called
lensing, and it is explicitly the opposite of a blur: light is *bent*, not scattered. Nothing
`backdrop-filter` accepts moves a pixel, so the bend has to come from `feDisplacementMap`, and
what it is fed decides whether the surface reads as glass. The displacement map is two linear
gradients — red carrying the horizontal deflection, green the vertical — each holding the
neutral 128 across the middle of the surface and sloping only through a band at the rim. A
channel above 128 makes the map sample from further inside, which drags outside content inward
and compresses it against the border, the way the edge of a magnifier does. Below 128 sends the
sample point outside the filter region, which returns transparent black: a pale halo that looks
like a bug because it is one.

The fall from the rim value to the neutral is a curve, not a straight line — `(1 - u) ** 2.2`,
five stops a side. Deflection is proportional to surface slope, and the slope of a dome that is
flat in the middle steepens all the way to the edge; a straight ramp has constant slope and a
visible kink where it meets the flat centre, which reads as a chamfer machined onto a flat sheet.

Two failures are worth recording because neither throws and both look like "some kind of edge
effect" at a glance. The map used to be smoothed fractal noise with its amplitude scaled down
toward the middle by a radial mask: that gets a lens's amplitude but never its direction, so the
backdrop shimmers instead of bending and a straight line crossing the surface stays straight.
And the filter region used to be `-8% / 116%`; `feImage` with `preserveAspectRatio="none"`
stretches the gradients to fill the *region*, so the ramps' peak sat 8% outside the surface and
was clipped before it reached a visible pixel. The region is the element exactly now, which is
safe because these ramps only ever sample inward.

**The tints are arithmetic.** Frost text needs the composited backdrop at or below **0.164
relative luminance** to clear 4.5:1. A tint alone would have to be **0.55** to guarantee that
against the bright rim of ice in a photograph, which is barely glass at all. `brightness(0.42)`
dims the backdrop *optically* instead of covering it, which buys the same guarantee at a
**0.08–0.14** tint: nine tenths of the picture still comes through. The worst case is measured
rather than assumed — the hero photograph's header band is p95 **0.953** relative luminance and
the brightest bottom-left corner in the gallery, where the phone stamp sits, is **0.924**, so
white is the worst case and not a pessimistic one.

Run `scripts/glass_contrast.py` after any change to a `brightness()`, a tint alpha, a sheen
alpha or an ink alpha. It composites each surface's real stack — the menu panel sits on
`.menu-scrim`, not on the page, and ignoring that understates it by about 2.7:1 — and gates on
the text band rather than the specular edge. The worst rendered text on the site is **5.04:1**
(the menu's nav links against a white backdrop). It was **4.28:1** before this pass, which was
under AA and had gone unnoticed because the earlier arithmetic left the specular sheen out of
what the text is read against.

### Named Rules

**The Deterministic-Map Rule.** No noise in the filter graph. A trace of `feTurbulence` was mixed
into the ramps for surface texture and came back out: an SVG-filter backdrop is a per-frame
readback of the destination texture plus the whole filter graph, re-run whenever the element or
its backdrop moves, which for fixed chrome over a scrolling page is every frame. The turbulence,
its `feGaussianBlur` and their `feComposite` were three of those primitives, and side by side at
the site's settings the result was indistinguishable. The graph is twelve primitives now, down
from fifteen, and the only published mid-range-phone figure for this shape of work — Skia's, via
Flutter, about 29ms a frame with a backdrop filter against about 6ms filtering a source image on
a Moto G4 — is the reason to care.

**Known limits, stated rather than hidden.**

- `prefers-reduced-transparency` is Chromium-only. Safari does not support it at all, so on iOS
  the reader who turns Reduce Transparency on gets no fallback from this site — the setting is
  invisible to CSS on the platform that invented it, and there is no JS detection either. Most of
  this audience is on Android Chrome, which does get it, but the gap is real.
- The bevel band is a constant fraction of each surface (13.2%), because one shared SVG filter
  stretched by `preserveAspectRatio="none"` can only be proportional. The reference material does
  the opposite: a narrow bevel on a large panel, the whole surface domed on a small control. Fixing
  it properly means a second filter — a wide-dome one for chips, a narrow-bevel one for the sheet —
  which is the same idea as the three blur tiers and has not been done.
- This site's Reduce Transparency answer diverges from the reference on purpose. Apple's own
  behaviour is *frostier*, not opaque. Opaque is kept here because it is the only version where
  nothing in the fallback can fail contrast, and a reader who turns that setting on has said
  translucency costs them legibility.
- The refraction has never been measured on a real mid-range Android. Nothing in this environment
  can produce a frame time for it, and no credible published measurement of an SVG-filter backdrop
  on a phone appears to exist — every article found on the subject reasons from the mechanism.

**The Four Surfaces Rule.** `backdrop-filter` goes on the header, the menu panel, the
buttons and the phone stamp. Nothing else. It is one of the most expensive things a browser
can be asked to do and this audience is on mid-range Android phones.
`tests/liquid-glass.test.ts` asserts the exact list, so a fifth cannot arrive quietly.

**The No-Glass-On-Glass Rule.** The reference material forbids it outright, and the menu's open
group used to break it: a filtered pill inside the filtered panel. The panel had already blurred
and re-lit what was behind it, so the inner filter had nothing left to bend and spent a composite
finding that out. It is a translucent lifted row now. The site had already reached the same
conclusion from the accessibility end — that stack was the one combination the Reduce
Transparency fallback had to make fully opaque.

**The Vertical-Light Rule.** One light source, directly above, which is what the reference uses
and what its icon tooling states outright. So the top edge catches hard
(`--glass-bevel-near`), the bottom lip returns a weaker gleam (`--glass-bevel-far`), and the
left and right edges get neither — what shows there is `--glass-bevel-dark`, a dark ring inside
the rim that is the only thing in the CSS saying how thick the glass is. A first pass used a
diagonal top-left/bottom-right pair, which is a chamfer lit from a corner and not what the
reference does. All four alphas are injected by `LiquidGlassFilter` from the same six dials the
SVG filter is built from, so the CSS edge and the refraction cannot drift apart.

**The Brighter-But-Shorter Rule.** When a specular needs to read harder, raise its peak and
shorten its reach in the same edit. The header's ink occupies 34.9%–65.1% of its height, so a
sheen spent by 22% can be as bright as it likes; the same gradient stretched across the whole
surface was lifting the luminance under the text and costing contrast for nothing. This is why
"sharper edge highlights" and "clearer transparency" turned out to be one change rather than two
opposed ones.

**The Thickness-By-Size Rule.** A material that is the same thickness everywhere reads as a
filter applied to things rather than as glass — a window looks thicker than a lens. So there
are three blur tiers and a surface takes the one that matches its area: `--glass-blur-chip`
(10px) for the phone stamp, `--glass-blur-chrome` (20px) for the header and the phone action
bar, `--glass-blur-sheet` (30px) for the menu panel. On a 1440px viewport that is roughly 4k,
92k and 266k px² of surface. The corollary matters as much: **one surface, one thickness.**
The header used to blur at 28px over a light bed and 12px over a dark one, which is the same
strip changing thickness depending on what happened to be behind it. Both states are `chrome`
now, and the dark state gained from it — its contrast guarantee rests on the blur averaging a
specular needle into its neighbourhood, and 20px averages more of one than 12px did.

**The Scroll-Edge Rule.** Fixed chrome separates itself from content with a short gradient
below it, never with a 1px border. A rule reads as a boundary between two regions; the header
is a floating layer with the page running underneath it, and the edge should say so. The fade
is heavier over a photograph than over a flat bed — 1.3u at 18% black over the hero against
0.9u at 6% over frost — because a busy backdrop needs more separation, and because over the
hero it is the difference between the header floating and the header dissolving.

**The Brightness-Not-Opacity Rule.** When glass fails contrast, lower `brightness()`. Never
raise the tint. Raising the tint is how glass becomes a dark panel with a blur on it.

**The Declare-It-Twice Rule, and why it was not enough.** Every refracted surface writes
`backdrop-filter` twice: the filter-function version first, the `url(#liquid-glass)` version
second. Deleting the first line breaks Safari silently — Safari reads `-webkit-backdrop-filter`,
which never carries a `url()`, so it takes the plain glass and loses nothing.

Firefox does not behave that way, and the assumption that it did was a live bug. Gecko *parses*
`backdrop-filter: url(...)` — measured on Firefox 153, where `getComputedStyle` returned
`url("#liquid-glass") blur(20px) saturate(1.5) brightness(0.42)` and `CSS.supports` agreed — so the
reference declaration wins its cascade. Only at paint time does Gecko find `feDisplacementMap`,
`feTurbulence` and `feImage` pref-gated off (`gfx.webrender.svg-filter-effects.*`, all default
false) and, because the backdrop path cannot use a blob-image fallback, throw away the **entire**
chain: blur, saturation and brightness with it. Every glass surface on this site was rendering
with no filter at all in Firefox, and the header over the hero photograph came out around
**1.1:1** — invisible, not merely low.

The fix is one `@supports (-moz-orient: inline)` block that restates the plain chain for Gecko
only. `-moz-orient` is Gecko-only and stable; verified true on Firefox 153 and false on Chromium
148. It has to sit after every `url()` declaration and before the accessibility blocks, because
`@supports` adds no specificity and source order is what decides. `tests/liquid-glass.test.ts`
asserts every filtered selector reappears in it, that what it gets back is a real blur rather
than `none`, and that it is in the right place in the file.

**The Opaque-Not-Frostier Rule.** Under `prefers-reduced-transparency: reduce`, glass goes
fully opaque and the filter comes off. Not frostier — opaque. A reader who turns that setting
on is saying translucency costs them legibility, and a half-measure is the worst of both:
still hard to read, and no longer glass. Nothing in that fallback can fail contrast, which is
the point of doing it that way: opaque, frost text measures **16.74:1** on deep and **17.83:1**
on abyss, and the muted tone measures **9.06:1**. Under `prefers-contrast: more` the same
surfaces go opaque and every low-alpha rim becomes a real 70%-alpha border, because at that
setting separation by light piling up in an edge is not enough to find.

## Do's and Don'ts

### Do:

- **Do** express every dimension as a multiple of `--u`. A raw pixel value is either type, a
  1px hairline, or a bug.
- **Do** let the section bed decide color. Write `var(--text)`, `var(--rule)`,
  `var(--accent)`, `var(--btn-fill)` — never a raw channel name in a component. Outside a
  bed, declare the tokens on the element rather than hoping they resolve.
- **Do** pick a heading tier deliberately. If a new section's heading is the same size as
  every other heading, the tier was not chosen.
- **Do** put the phone number on every product picture, and a "Book now" action under it.
  This is a client requirement, not a design preference.
- **Do** state a specification where you are tempted to write an adjective. Type, power,
  cycle, capacity.
- **Do** leave a figure absent when it is unknown. An empty frame or a missing number is
  honest; an invented one is a liability.
- **Do** derive contrast before choosing a glass value, and record the measurement in a
  comment next to it. Every existing glass number has one.

### Don't:

- **Don't** use stock photography of machines that are not Koolink's. All three tiles carry
  Koolink's own photographs; the empty frame stays in the code as the fallback for any product
  added without one.
- **Don't** crop a supplied photograph so its watermark badge is clipped rather than either
  fully excluded or fully kept. Which of those two applies is the client's call and it has
  changed once: the 2026-08-31 set was cropped above the badge, and the 2026-09-05 set keeps it
  on their instruction. A half-clipped badge is the only wrong answer. The tile stamps
  the phone number itself, so the badge is redundant and only costs sharpness.
- **Don't** add a fifth type tier or a fourth breakpoint. Both were reduced on purpose.
- **Don't** write a literal `border-radius` or a literal white. Seven radius tokens and
  `--glass-spec` exist for exactly those two values; a literal is how the next six appear.
- **Don't** put `overflow: hidden` on a product tile or any ancestor of one; it destroys the
  hanging photograph.
- **Don't** give a card, row or section a drop shadow. Only glass and the hanging photograph
  cast.
- **Don't** extend `backdrop-filter` to a fifth surface. It is a performance budget, not a
  style.
- **Don't** introduce a new hue. The palette is monochromatic cool by client instruction;
  hierarchy comes from inversion and depth, not from color.
- **Don't** reuse ember. One warm thing, on the payment caution, once.
- **Don't** fake depth with harsh shadows or multi-stop gradients. Both were ruled out
  explicitly in the button brief; 1px edges and one restrained sheen are the whole
  vocabulary.
- **Don't** put a price anywhere, in any form. A test fails the build if a naira figure
  appears under `src/`.

