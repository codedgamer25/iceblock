import type { GlassSettings } from '@/lib/liquid-glass';
import {
  FILTER_ID,
  SITE_GLASS,
  filterValues,
  rampStops,
  surfaceValues,
} from '@/lib/liquid-glass';

/**
 * The refraction itself: an SVG filter that bends whatever is behind the glass at its edges, the
 * way a bevel does, rather than only softening it.
 *
 * How it works, in the order the primitives run:
 *
 *   feImage ×2        two ramps, one across x and one down y. Red carries the horizontal offset
 *                     and green the vertical, and `feDisplacementMap` reads 128 as "do not move" —
 *                     so each ramp is flat at 128 through the middle of the surface and slopes
 *                     only inside a band at the edges. That band is the bevel, and the fall
 *                     through it follows a dome rather than a straight line
 *   feBlend screen    merges them into one map: red from the x ramp, green from the y ramp, each
 *                     pinned to the neutral in the other's channel so nothing is lost
 *   feDisplacementMap ×3, at three slightly different scales
 *   feColorMatrix     keeps red from the smallest, green from the middle, blue from the largest,
 *                     then adds them back — the three wavelengths bend by different amounts,
 *                     which is what a prism does and where the coloured fringe comes from
 *
 * `colorInterpolationFilters="sRGB"` is load-bearing, not boilerplate. In the default linearRGB
 * space 128 is not the neutral displacement value, so the whole surface drifts to one side.
 *
 * The sign of the ramps matters more than their strength. Sloping so that a channel reads *above*
 * the neutral at an edge makes the map sample from further inside the surface, which drags outside
 * content inward and compresses it against the border — the edge of a magnifier. Sloping the other
 * way pushes the sample point outside the element's border box, and Filter Effects 2 clips the
 * backdrop input to that box before the filter runs, so there is literally nothing out there to
 * fetch: the result is a pale halo that looks like a bug because it is one.
 *
 * This replaced a map built from fractal noise alone. Noise gets the amplitude of a lens once you
 * mask it — quiet in the centre, loud at the rim — but never its direction, so it shimmers rather
 * than bends and a straight line crossing the surface stays straight. Compared side by side over
 * the same photograph the difference is not subtle, and with the blur switched on the noise
 * version shows no refraction at all.
 *
 * The filter is rendered once, hidden, and referenced from CSS by id. It carries no visual output
 * of its own.
 *
 * One limit worth stating plainly, and its obvious version is wrong. `backdrop-filter: url(#…)`
 * renders in Chromium. Safari has no implementation at all — WebKit bug 245510, open since 2022 —
 * but Safari reads `-webkit-backdrop-filter`, which never carries a `url()`, so it takes the plain
 * blur-and-brightness glass and loses nothing. Firefox *does* parse `backdrop-filter: url(...)`,
 * and Gecko has a real SVG-filter path for backdrop filters; what it does not have is
 * `feDisplacementMap` or `feImage` — both are pref-gated off — and when a primitive falls back to
 * a blob image the backdrop path discards the whole chain, blur included. So Firefox needs the
 * plain chain handed back to it explicitly: see the `@supports (-moz-orient: inline)` block in
 * globals.css.
 *
 * Either way the warping is an enhancement layered over the blur-and-brightness glass rather than
 * a replacement for it, which is why the base is still tuned to stand on its own.
 */
export function LiquidGlassFilter({ settings = SITE_GLASS }: { settings?: GlassSettings }) {
  const f = filterValues(settings);
  const s = surfaceValues(settings);

  /* One profile, used on both axes: red carries the horizontal deflection and green the vertical,
     and each holds the other channel at the neutral so the screen blend below loses nothing. */
  const ramp = rampStops(f.edgeRamp);

  return (
    <>
      {/* The rims, the highlight and the lift come from the same six settings as the
          filter does, so the CSS and the SVG cannot drift apart. Custom properties set
          on the <svg> element would not reach its siblings, hence a :root rule. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{--glass-rim:${s.rim};--glass-rim-inner:${s.rimInner};--glass-bevel-near:${s.bevelNear};--glass-bevel-far:${s.bevelFar};--glass-bevel-dark:${s.bevelDark}}`,
        }}
      />
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <linearGradient id={`${FILTER_ID}-ramp-x`} x1="0" y1="0" x2="1" y2="0">
            {ramp.map(({ offset, value }) => (
              <stop key={offset} offset={offset} stopColor={`rgb(${value},0,0)`} />
            ))}
          </linearGradient>
          <linearGradient id={`${FILTER_ID}-ramp-y`} x1="0" y1="0" x2="0" y2="1">
            {ramp.map(({ offset, value }) => (
              <stop key={offset} offset={offset} stopColor={`rgb(0,${value},0)`} />
            ))}
          </linearGradient>

          {/* preserveAspectRatio="none" on the feImage below stretches these to whatever the
              surface is, so the bevel is a proportion of the surface rather than a fixed width —
              a bigger sheet gets a bigger bevel, which is the same idea as the three blur tiers. */}
          <rect
            id={`${FILTER_ID}-rect-x`}
            width="100%"
            height="100%"
            fill={`url(#${FILTER_ID}-ramp-x)`}
          />
          <rect
            id={`${FILTER_ID}-rect-y`}
            width="100%"
            height="100%"
            fill={`url(#${FILTER_ID}-ramp-y)`}
          />

          <filter
            id={FILTER_ID}
            /* The filter region is the element exactly, and that is load-bearing rather than
               tidy. `feImage` with `preserveAspectRatio="none"` stretches the ramps to fill the
               *region*, not the element — so at the -8%/116% region this started with, the ramps'
               0% sat 8% outside the surface and the peak deflection was clipped away before it
               ever reached a visible pixel. The bevel was a band of the curve's middle, which is
               most of the way to no bevel at all.

               Nothing needs the overspill: these ramps only ever sample *inward*, so the
               displacement never reads a pixel outside the region and there is nothing out there
               to preserve. */
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={`#${FILTER_ID}-rect-x`}
              result="rampX"
              preserveAspectRatio="none"
            />
            <feImage
              href={`#${FILTER_ID}-rect-y`}
              result="rampY"
              preserveAspectRatio="none"
            />
            <feBlend in="rampX" in2="rampY" mode="screen" result="lens" />

            <feDisplacementMap
              in="SourceGraphic"
              in2="lens"
              scale={f.scaleRed}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispR"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lens"
              scale={f.scaleGreen}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispG"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lens"
              scale={f.scaleBlue}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispB"
            />

            {/* One channel from each pass. */}
            <feColorMatrix
              in="dispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="onlyR"
            />
            <feColorMatrix
              in="dispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="onlyG"
            />
            <feColorMatrix
              in="dispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="onlyB"
            />

            <feBlend in="onlyR" in2="onlyG" mode="screen" result="rg" />
            <feBlend in="rg" in2="onlyB" mode="screen" result="rgb" />
            <feComposite in="rgb" in2="SourceGraphic" operator="over" result="filled" />
            <feComposite in="filled" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
