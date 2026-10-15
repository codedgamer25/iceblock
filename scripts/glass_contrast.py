"""Worst-case WCAG contrast for text sitting on a translucent surface.

This is the arithmetic behind The Brightness-Not-Opacity Rule, made runnable. Every glass
surface on the site is a tint of known alpha over a backdrop that `backdrop-filter` has already
dimmed with `brightness()`, and the question a change to the glass has to answer is: at the
worst backdrop the surface can ever sit over, does the text still clear 4.5:1?

Four things this gets right that a naive check does not:

  * `brightness(b)` multiplies the backdrop's channels *before* the tint composites over it.
    So the composite is `tint*a + (backdrop*b)*(1-a)`, not `tint*a + backdrop*(1-a)`. That
    ordering is the whole reason the tints can be as low as 0.12.
  * the sheen `background-image` is a second translucent layer over the tint, and on a dark
    surface carrying light text it *lightens* the background and so reduces contrast. It is
    composited rather than ignored. It is also a gradient, so it does not have one alpha — what
    governs is its alpha where the text sits, which for centred chrome is the middle of the ramp
    and not the top stop. Both are reported.
  * the menu panel does not sit on the page. It sits on `.menu-scrim`, which has its own
    `brightness(0.86)` and its own 18% black over that. Ignoring the scrim understates the
    panel's contrast by about 2.7:1 — the panel is far darker than the page behind it.
  * the ink is often translucent itself. `.nav-link` is `rgb(var(--frost) / 0.72)`, so the
    effective foreground is frost composited over the surface it sits on, not frost.

The worst-case backdrops are measured rather than assumed: the hero photograph's header band has
a p95 relative luminance of 0.953 and the brightest bottom-left corner in the gallery — where the
phone stamp sits — is 0.924. Both round to white, so white is what this uses.

Run after any change to a brightness(), a tint alpha, a sheen alpha, or an ink alpha.
"""

from __future__ import annotations

# sRGB, 0-255, straight from globals.css.
FROST = (242, 247, 250)
HAZE = (159, 188, 204)
DEEP = (7, 24, 34)
ABYSS = (4, 16, 23)
FROST_BED = (240, 246, 250)
WHITE = (255, 255, 255)
AA = 4.5


def lin(c: float) -> float:
    """One sRGB channel, 0-255, to linear light."""
    s = c / 255
    return s / 12.92 if s <= 0.04045 else ((s + 0.055) / 1.055) ** 2.4


def luminance(rgb) -> float:
    r, g, b = (lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg, bg) -> float:
    a, b = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (a + 0.05) / (b + 0.05)


def over(top, alpha: float, bottom):
    """Source-over, per channel, in sRGB space — which is what the compositor does."""
    return tuple(t * alpha + b * (1 - alpha) for t, b in zip(top, bottom))


def dim(rgb, brightness: float):
    return tuple(min(255.0, c * brightness) for c in rgb)


class Layer:
    """One translucent layer: a backdrop-filter brightness, a tint, and a sheen alpha."""

    def __init__(self, brightness, tint, tint_alpha, sheen=(0.0, 0.0)):
        self.brightness = brightness
        self.tint = tint
        self.tint_alpha = tint_alpha
        self.sheen_top, self.sheen_text = sheen

    def paint(self, backdrop, at_text: bool):
        out = over(self.tint, self.tint_alpha, dim(backdrop, self.brightness))
        a = self.sheen_text if at_text else self.sheen_top
        return over(WHITE, a, out) if a else out


class Surface:
    """A stack of layers over a worst-case backdrop, and the ink read against the top of it.

    `rendered` distinguishes text that is actually on the page from a bed token declared
    defensively. The action bar declares `--text-muted` so that a control added to it later is
    correct by default, but nothing in it renders muted text today — so that row is a guardrail
    for a future change rather than a live failure, and it should not set the headline number.
    """

    def __init__(self, name, stack, ink, ink_alpha, backdrop, rendered=True):
        self.name, self.stack, self.ink, self.ink_alpha, self.backdrop = (
            name, stack, ink, ink_alpha, backdrop,
        )
        self.rendered = rendered

    def rows(self):
        for label in ("at text", "top edge"):
            bg = self.backdrop
            for layer in self.stack:
                bg = layer.paint(bg, label == "at text")
            fg = over(self.ink, self.ink_alpha, bg) if self.ink_alpha < 1 else self.ink
            yield label, bg, ratio(fg, bg)


SCRIM = Layer(0.86, (0, 0, 0), 0.18)


def before():
    """The values that shipped before the transparency/edge/refraction pass."""
    panel = Layer(0.44, DEEP, 0.12, (0.12, 0.07))
    bar = Layer(0.46, ABYSS, 0.22, (0.12, 0.07))
    return [
        Surface("header, light bed", [Layer(1.10, FROST_BED, 0.20, (0.30, 0.175))], DEEP, 1, FROST_BED),
        Surface("header, over hero", [Layer(0.46, ABYSS, 0.12, (0.14, 0.08))], FROST, 1, WHITE),
        Surface("action bar", [bar], FROST, 1, WHITE),
        Surface("action bar, muted", [bar], HAZE, 1, WHITE, rendered=False),
        Surface("menu panel heading", [SCRIM, panel], FROST, 1, WHITE),
        Surface("menu panel nav-link", [SCRIM, panel], FROST, 0.72, WHITE),
        Surface("phone stamp", [Layer(0.40, ABYSS, 0.16, (0.18, 0.10))], FROST, 1, WHITE),
    ]


def now():
    """What globals.css asks for today. Clearer tints, darker optical dim, tighter specular.

    The three moves are one idea. A tint covers the backdrop up; `brightness()` dims it optically
    while leaving it visible. So every surface drops its tint — more of the photograph comes
    through as colour — and pays for it by dimming harder, which measures *better* than what came
    before. The sheen does the same trick in reverse: its peak rises, so the top bevel reads as a
    harder line of light, while its reach collapses from most of the surface to the top fifth, so
    the alpha where the text actually sits falls to near nothing. "Sharper edge highlights" and
    "clearer transparency" turn out to be the same change, and it is also where the contrast
    comes from.

    `.nav-link` goes from 0.72 to 0.82 alpha. At 0.72 it measured 4.51:1 against a white backdrop,
    which is a hundredth of margin — not a margin.

    The `at text` sheen alphas below are rounded *up* from what the gradients actually give at the
    measured text bands (the header's ink runs 34.9%–65.1% of its height, and the ramp is spent by
    44%). Pessimistic on purpose: the real surface is a little darker than this says, so a number
    that passes here passes on screen.
    """
    panel = Layer(0.46, DEEP, 0.08, (0.22, 0.06))
    bar = Layer(0.42, ABYSS, 0.14, (0.24, 0.02))
    return [
        Surface("header, light bed", [Layer(1.12, FROST_BED, 0.12, (0.42, 0.02))], DEEP, 1, FROST_BED),
        Surface("header, over hero", [Layer(0.42, ABYSS, 0.08, (0.26, 0.015))], FROST, 1, WHITE),
        Surface("action bar", [bar], FROST, 1, WHITE),
        Surface("action bar, muted", [bar], HAZE, 1, WHITE, rendered=False),
        Surface("menu panel heading", [SCRIM, panel], FROST, 1, WHITE),
        Surface("menu panel nav-link", [SCRIM, panel], FROST, 0.82, WHITE),
        Surface("phone stamp", [Layer(0.38, ABYSS, 0.10, (0.30, 0.02))], FROST, 1, WHITE),
    ]


CONFIGS = {"before": before, "now": now}


def report(name, surfaces) -> tuple[float, str]:
    print(f"\n=== {name} ===")
    print(f"{'surface':<22} {'where':<9} {'composited':<20} {'ratio':>7}  AA")
    print("-" * 72)
    worst, worst_name = 99.0, ""
    for s in surfaces:
        for label, bg, r in s.rows():
            if label == "at text" and s.rendered and r < worst:
                worst, worst_name = r, s.name
            rgb = "rgb(" + " ".join(f"{v:.0f}" for v in bg) + ")"
            mark = "PASS" if r >= AA else "fail"
            if not s.rendered:
                mark += "  (not rendered today)"
            print(
                f"{s.name if label == 'at text' else '':<22} {label:<9} "
                f"{rgb:<20} {r:>6.2f}:1  {mark}"
            )
    print("-" * 72)
    print(f"worst rendered text: {worst:.2f}:1 ({worst_name}) against a {AA}:1 floor")
    return worst, worst_name


def main() -> int:
    results = {name: report(name, build()) for name, build in CONFIGS.items()}
    was, is_now = results["before"][0], results["now"][0]
    print(f"\nworst rendered text: {was:.2f}:1 before -> {is_now:.2f}:1 now")
    print(
        "\nThe `top edge` rows are expected to fail and are not a defect. That row is the\n"
        "one-pixel specular band along the top of each surface — the bevel catching light — and\n"
        "no text is laid in it. The header's ink starts at 34.9% of its height and every\n"
        "specular on the page is spent by 22%. The gate is the `at text` band."
    )
    return 0 if is_now >= AA else 1


if __name__ == "__main__":
    raise SystemExit(main())
