/**
 * Settings for the refracting glass, and the arithmetic that turns them into SVG
 * filter attributes.
 *
 * Six dials, named as asked: Light, Refraction, Depth, Dispersion, Frost, Splay. All
 * of them 0–1 so they can be reasoned about as "how much", with the mapping to real
 * units kept here rather than scattered through the markup.
 *
 * This is a separate module from the component for one reason: SVG filter primitives
 * take numbers in attributes, not CSS custom properties, so every value has to be
 * computed in JS before it is rendered. Keeping that arithmetic pure makes it
 * testable, which matters because a wrong displacement scale does not throw — it
 * just quietly looks wrong.
 *
 * The displacement map changed shape once, and the reason is worth keeping. It used to be
 * smoothed fractal noise whose amplitude was scaled down toward the middle by a radial mask.
 * That gets the amplitude of a lens — almost nothing in the centre, everything at the rim — but
 * not its *direction*: noise pushes each pixel a random way, so the backdrop shimmers instead of
 * bending, and a straight line crossing the surface stays straight. Laid side by side over the
 * same photograph with the blur switched off, the difference is not subtle; with the blur on,
 * the noise version shows no refraction at all.
 *
 * What replaced it is deterministic and nothing else: two linear ramps, red carrying the
 * horizontal offset and green the vertical, each flat through the middle of the surface and
 * sloping only in a band at the edges. `feDisplacementMap` reads a channel value of 128 as "do
 * not move", so a flat middle leaves the centre optically clean while every pixel inside the band
 * is pushed perpendicular to the nearest edge. That is a bevel, and a straight line crossing it
 * kinks.
 *
 * There is no noise left in the chain at all, and that is a performance decision taken against a
 * measurement rather than a taste one. An SVG-filter backdrop is a per-frame readback of the
 * destination texture plus the whole filter graph, re-run whenever the element or its backdrop
 * moves — which for fixed chrome over a scrolling page is every frame. The one published
 * mid-range-phone figure for this shape of work is Skia's, via Flutter: about 29ms a frame with a
 * backdrop filter against about 6ms filtering a source image, on a Moto G4. A trace of grain
 * bought a surface that looked like a material rather than a perfect optic, and it cost
 * `feTurbulence` plus a `feGaussianBlur` plus a `feComposite` on every one of those frames. Side
 * by side at the site's settings the two were indistinguishable. This audience is on mid-range
 * Android.
 */

export type GlassSettings = {
  /** Specular strength: how hard the rim and the top highlight catch. */
  light: number;
  /** Distortion strength. How far the backdrop is pushed around. */
  refraction: number;
  /** Apparent thickness — drives the inner rings and the lift shadow. */
  depth: number;
  /** Chromatic edge. Splits the red and blue displacement apart for the fringe. */
  dispersion: number;
  /** Blur, in the frosted sense. */
  frost: number;
  /**
   * Edge falloff. At 1 the bend is confined to a narrow band hard against the border and the
   * middle is left alone, which is how a thick bevel behaves; at 0 it is spread across most of
   * the surface, which is a whole-pane distortion rather than an edge.
   */
  splay: number;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export type GlassFilterValues = {
  /** feDisplacementMap scale, one per channel — the gap between them is the fringe. */
  scaleRed: number;
  scaleGreen: number;
  scaleBlue: number;
  /**
   * Where each edge ramp reaches zero, as a fraction of the surface from that edge. 0.1 is a
   * bevel; 0.4 is most of the surface. Always below 0.5 so the two ramps cannot meet and cancel
   * in the middle.
   */
  edgeRamp: number;
  blur: number;
  saturate: number;
};

/**
 * Ranges chosen so that 1 is "as far as this still looks like glass". Refraction
 * tops out at 34px because past roughly forty the backdrop tears rather than bends,
 * and dispersion at ±38% of the base scale because a wider split stops reading as
 * one fringe and starts reading as three overlapping images.
 */
export function filterValues(settings: GlassSettings): GlassFilterValues {
  const light = clamp01(settings.light);
  const refraction = clamp01(settings.refraction);
  const dispersion = clamp01(settings.dispersion);
  const frost = clamp01(settings.frost);
  const splay = clamp01(settings.splay);

  const base = refraction * 34;
  const spread = dispersion * 0.38;

  return {
    scaleRed: Number((base * (1 - spread)).toFixed(2)),
    scaleGreen: Number(base.toFixed(2)),
    scaleBlue: Number((base * (1 + spread)).toFixed(2)),
    edgeRamp: Number((0.42 - 0.32 * splay).toFixed(3)),
    blur: Number((frost * 26).toFixed(2)),
    saturate: Number((1.2 + 0.7 * light).toFixed(2)),
  };
}

/** Surface treatment that is CSS rather than filter: rims, highlight, lift. */

/**
 * The dome, sampled as gradient stops — one axis of the displacement map.
 *
 * Apple describes the material as a convex squircle dome: flat across the middle, curving down
 * through a band at the rim, so the slope is zero in the centre and steepens all the way to the
 * edge. Deflection is proportional to that slope, which is why it must not fall linearly across
 * the band. A straight ramp has constant slope and a visible kink where it meets the flat middle,
 * and it reads as a chamfer machined onto a flat sheet rather than as a curve.
 *
 * `(1 - u) ** 2.2`, with u the distance in from the edge as a fraction of the band, is close
 * enough to a shallow dome at five stops a side.
 *
 * 128 is the value `feDisplacementMap` reads as "leave this pixel where it is". Above it the map
 * samples from further inside the surface, which drags outside content inward and compresses it
 * against the border — the edge of a magnifier. Below it the sample point goes outside the filter
 * region, which returns transparent black: a pale halo instead of a bent strip of backdrop. So
 * the leading edge must be above 128 and the trailing edge below it, and getting that backwards
 * looks like a bug rather than a weaker effect.
 */
export const RAMP_CURVE = 2.2;
export const RAMP_NEUTRAL = 128;

export function rampStops(edgeRamp: number): ReadonlyArray<{ offset: number; value: number }> {
  const samples = [0, 0.25, 0.5, 0.75, 1];
  const near = samples.map((u) => ({
    offset: Number((u * edgeRamp).toFixed(4)),
    value: Math.round(RAMP_NEUTRAL + 127 * (1 - u) ** RAMP_CURVE),
  }));
  const far = near
    .map(({ offset, value }) => ({
      offset: Number((1 - offset).toFixed(4)),
      value: 2 * RAMP_NEUTRAL - value,
    }))
    .reverse();
  return [...near, ...far];
}

export function surfaceValues(settings: GlassSettings) {
  const light = clamp01(settings.light);
  const depth = clamp01(settings.depth);
  return {
    rim: Number((0.22 + 0.42 * light).toFixed(3)),
    rimInner: Number((0.06 + 0.16 * light).toFixed(3)),
    /**
     * The two halves of the bevel. A rim of one alpha all the way round is a stroke; Apple's
     * light is a single source directly above, so the top edge catches hard and the bottom lip
     * returns a weaker gleam, and the gap between these two is what makes the edge read as a
     * curved surface rather than an outline. The left and right edges get neither — they face
     * away from a vertical light — which is where the darkened ring below shows through.
     */
    bevelNear: Number((0.3 + 0.52 * light).toFixed(3)),
    bevelFar: Number((0.06 + 0.2 * light).toFixed(3)),
    /**
     * The darkened edge, which is what `depth` means on screen. iOS 27 pairs its brighter
     * speculars with a dark line inside the rim, and that line is the only thing in the CSS that
     * says how thick the glass is: a bevel catching light on two sides tells you there is a
     * surface, the shadow on the other two tell you it has a wall.
     */
    bevelDark: Number((0.1 + 0.24 * depth).toFixed(3)),
  };
}

/**
 * The site's setting.
 *
 * Refraction sits much higher than it used to — 0.62 where it was 0.34 — and that is a
 * consequence of the map changing rather than a change of mind. With noise, the warp covered the
 * whole surface, so any scale strong enough to be visible also wobbled the text sitting on it,
 * and the honest answer was to keep it too faint to see. With ramps, the warp is confined to the
 * outer tenth of the surface: it never reaches the text, and displacing the backdrop does not
 * change its average luminance, so a stronger bend costs nothing in legibility. Splay is near the
 * top of its range for the same reason — it is what keeps the bend in the band.
 */
export const SITE_GLASS: GlassSettings = {
  light: 0.72,
  refraction: 0.62,
  depth: 0.42,
  dispersion: 0.48,
  frost: 0.42,
  splay: 0.9,
};

export const FILTER_ID = 'liquid-glass';
