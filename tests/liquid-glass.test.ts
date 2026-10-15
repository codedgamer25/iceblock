import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import type { GlassSettings } from '@/lib/liquid-glass';
import {
  RAMP_NEUTRAL,
  SITE_GLASS,
  filterValues,
  rampStops,
  surfaceValues,
} from '@/lib/liquid-glass';

const at = (over: Partial<GlassSettings>): GlassSettings => ({ ...SITE_GLASS, ...over });

describe('filterValues', () => {
  it('splits the three channel scales apart by the dispersion amount', () => {
    const none = filterValues(at({ dispersion: 0 }));
    expect(none.scaleRed).toBe(none.scaleGreen);
    expect(none.scaleBlue).toBe(none.scaleGreen);

    const full = filterValues(at({ dispersion: 1 }));
    expect(full.scaleRed).toBeLessThan(full.scaleGreen);
    expect(full.scaleBlue).toBeGreaterThan(full.scaleGreen);
    /* Green stays the reference, so the fringe is symmetrical about the real image. */
    expect(full.scaleGreen - full.scaleRed).toBeCloseTo(full.scaleBlue - full.scaleGreen, 2);
  });

  it('turns refraction off completely at zero, so the glass is only frosted', () => {
    const off = filterValues(at({ refraction: 0 }));
    expect(off.scaleRed).toBe(0);
    expect(off.scaleGreen).toBe(0);
    expect(off.scaleBlue).toBe(0);
  });

  it('scales displacement with refraction and never past the tearing point', () => {
    expect(filterValues(at({ refraction: 1, dispersion: 0 })).scaleGreen).toBe(34);
    expect(filterValues(at({ refraction: 0.5, dispersion: 0 })).scaleGreen).toBe(17);
  });

  it('pulls the bend inward as splay rises', () => {
    const low = filterValues(at({ splay: 0 }));
    const high = filterValues(at({ splay: 1 }));
    expect(high.edgeRamp).toBeLessThan(low.edgeRamp);
  });

  /* Both ramps run from an edge toward the middle. If either reached 0.5 of the surface the two
     would meet, and a pixel in the centre would be pulled two ways at once — which is the
     whole-surface wobble the ramps exist to avoid. */
  it('keeps each edge ramp short of the middle', () => {
    for (const splay of [0, 0.25, 0.5, 0.9, 1]) {
      const v = filterValues(at({ splay }));
      expect(v.edgeRamp).toBeGreaterThan(0);
      expect(v.edgeRamp).toBeLessThan(0.5);
    }
  });

  /* The map is two gradients and a blend, and nothing else. Noise used to be mixed in for surface
     texture; it cost an feTurbulence, an feGaussianBlur and an feComposite on every frame the
     backdrop moved, which for fixed chrome over a scrolling page is all of them, and at the site's
     settings it was indistinguishable side by side. */
  it('emits no noise parameters, because there is no noise left in the chain', () => {
    const v = filterValues(SITE_GLASS) as Record<string, unknown>;
    for (const dead of ['turbulenceFrequency', 'turbulenceOctaves', 'noiseSmoothing', 'grainWeight']) {
      expect(v[dead], dead).toBeUndefined();
    }
    const src = readFileSync(
      join(process.cwd(), 'src', 'components', 'LiquidGlassFilter.tsx'),
      'utf8',
    );
    const markup = src.slice(src.indexOf('<filter'));
    expect(markup).not.toContain('feTurbulence');
    expect(markup).not.toContain('feGaussianBlur');
  });

  it('clamps settings pushed outside 0-1 rather than emitting nonsense', () => {
    const over = filterValues(at({ refraction: 4, frost: -2, dispersion: 9 }));
    expect(over.scaleGreen).toBe(34);
    expect(over.blur).toBe(0);
    expect(over.scaleBlue).toBeGreaterThan(over.scaleGreen);
  });

  it('emits finite numbers for every setting, at every extreme', () => {
    for (const v of [0, 0.5, 1]) {
      const values = filterValues({ light: v, refraction: v, depth: v, dispersion: v, frost: v, splay: v });
      for (const [key, n] of Object.entries(values)) {
        expect(Number.isFinite(n), `${key} was ${n}`).toBe(true);
      }
    }
  });
});

describe('surfaceValues', () => {
  it('brightens the rim and both halves of the bevel with light', () => {
    const dim = surfaceValues(at({ light: 0 }));
    const bright = surfaceValues(at({ light: 1 }));
    expect(bright.rim).toBeGreaterThan(dim.rim);
    expect(bright.bevelNear).toBeGreaterThan(dim.bevelNear);
    expect(bright.bevelFar).toBeGreaterThan(dim.bevelFar);
  });

  /* The light is one source directly above, so the top edge catches several times what the
     bottom lip returns. Equal alphas would be a stroke round the shape rather than a surface
     with a direction. */
  it('keeps the lit edge well brighter than the answering gleam', () => {
    for (const light of [0, 0.4, 0.68, 1]) {
      const s = surfaceValues(at({ light }));
      expect(s.bevelNear, `light ${light}`).toBeGreaterThan(s.bevelFar * 2);
      expect(s.bevelNear).toBeLessThanOrEqual(1);
    }
  });

  it('never emits a rim alpha outside 0-1', () => {
    for (const light of [0, 0.5, 1, 2, -1]) {
      const s = surfaceValues(at({ light }));
      expect(s.rim).toBeGreaterThanOrEqual(0);
      expect(s.rim).toBeLessThanOrEqual(1);
      expect(s.rimInner).toBeLessThanOrEqual(s.rim);
    }
  });

  it('darkens the edge with depth, because that is what apparent thickness is', () => {
    expect(surfaceValues(at({ depth: 1 })).bevelDark).toBeGreaterThan(
      surfaceValues(at({ depth: 0 })).bevelDark,
    );
  });
});

describe("the site's own setting", () => {
  it('keeps every dial inside 0-1', () => {
    for (const [key, v] of Object.entries(SITE_GLASS)) {
      expect(v, key).toBeGreaterThanOrEqual(0);
      expect(v, key).toBeLessThanOrEqual(1);
    }
  });

  /* This assertion used to be `scaleGreen < 14`, and its reason was that the warp covered the
     whole surface, so anything visible also wobbled the text on it. The displacement map is
     deterministic ramps now and the bend is confined to the outer tenth, where no text sits —
     so the scale is free to be twice what it was, and the thing worth guarding moved. What
     matters is that the bend stays out of the middle and short of the tearing point. */
  it('bends hard at the rim without reaching the text or tearing the backdrop', () => {
    const v = filterValues(SITE_GLASS);
    expect(v.scaleGreen).toBeGreaterThan(14);
    expect(v.scaleGreen).toBeLessThan(28);
    /* The panel is the widest glass on the site at 27u. At edgeRamp the bend is already zero,
       and its own padding is 1.4u, so the ramp has to die inside a small multiple of that. */
    expect(v.edgeRamp).toBeLessThan(0.16);
  });

  it('concentrates the warp at the edges rather than across the middle', () => {
    expect(SITE_GLASS.splay).toBeGreaterThan(0.6);
  });
});

/**
 * The displacement map's own geometry.
 *
 * `filterValues` cannot see the one thing that made the first version of the ramps look like a bug
 * rather than an effect. `feDisplacementMap` samples at `x + scale * (channel - 0.5)`, so a channel
 * *below* the neutral at the left edge sends the sample point off the left of the filter region,
 * which returns transparent black — a pale halo round the surface instead of a bent strip of the
 * backdrop. Above it, the map samples from further inside and drags content inward, which is what
 * the edge of a magnifier does. Nothing throws either way, and at a glance both look like "some
 * kind of edge effect".
 */
describe('the displacement ramps', () => {
  const ramp = rampStops(filterValues(SITE_GLASS).edgeRamp);

  it('runs from one edge to the other without going backwards', () => {
    const offsets = ramp.map((s) => s.offset);
    expect(offsets[0]).toBe(0);
    expect(offsets.at(-1)).toBe(1);
    for (let i = 1; i < offsets.length; i += 1) {
      expect(offsets[i], `stop ${i}`).toBeGreaterThan(offsets[i - 1]);
    }
  });

  it('deflects inward at the leading edge and outward at the trailing one', () => {
    expect(ramp[0].value).toBeGreaterThan(RAMP_NEUTRAL);
    expect(ramp.at(-1)!.value).toBeLessThan(RAMP_NEUTRAL);
    /* Symmetrical about the neutral, or the surface would drift to one side. */
    expect(ramp[0].value - RAMP_NEUTRAL).toBe(RAMP_NEUTRAL - ramp.at(-1)!.value);
  });

  it('reaches the neutral before the middle and holds it across the flat centre', () => {
    const flat = ramp.filter((s) => s.value === RAMP_NEUTRAL);
    expect(flat.length, 'no flat centre').toBe(2);
    expect(flat[0].offset).toBeLessThan(0.5);
    expect(flat[1].offset).toBeGreaterThan(0.5);
    /* And the flat middle is most of the surface: this is a bevel, not a fishbowl. */
    expect(flat[1].offset - flat[0].offset).toBeGreaterThan(0.6);
  });

  /* A dome, not a chamfer. Deflection is proportional to the surface slope, and the slope of a
     dome that is flat in the middle steepens all the way to the rim — so the fall from the edge
     value to the neutral has to be convex. A straight line would have constant slope and a kink
     where it met the flat centre. */
  it('falls away from the edge on a curve rather than a straight line', () => {
    const band = ramp.filter((s) => s.offset <= ramp[4].offset);
    const linear = (i: number) =>
      ramp[0].value + ((RAMP_NEUTRAL - ramp[0].value) * i) / (band.length - 1);
    for (let i = 1; i < band.length - 1; i += 1) {
      expect(band[i].value, `stop ${i} is not below the straight line`).toBeLessThan(linear(i));
    }
  });

  it('keeps its shape at every splay, so no setting can flatten the lens', () => {
    for (const splay of [0, 0.25, 0.5, 0.9, 1]) {
      const r = rampStops(filterValues(at({ splay })).edgeRamp);
      expect(r[0].value, `splay ${splay}`).toBeGreaterThan(RAMP_NEUTRAL);
      expect(r.map((s) => s.offset)).toEqual([...r.map((s) => s.offset)].sort((a, b) => a - b));
    }
  });
});

/**
 * The glass as it is applied, rather than as it is computed.
 *
 * Everything above tests the arithmetic; none of it can see whether a surface actually asks
 * for the right thickness, keeps its non-Chromium fallback, or has anything to say to a
 * reader who has turned translucency off. These read the stylesheet.
 */
describe('how the glass is applied', () => {
  const raw = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8');
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  const px = (name: string) => {
    const label = `--glass-blur-${name}: `;
    const at = css.indexOf(label);
    expect(at, `${label} is not declared`).toBeGreaterThan(-1);
    return parseFloat(css.slice(at + label.length));
  };
  /* Rule bodies keyed by selector, from the top level only. At-rule blocks are cut out
     first: `@media (prefers-contrast: more)` legitimately puts a `border-bottom` back on the
     header, and a flat scan would read that as the divider still being there. Concatenated
     per selector and read as the cascade would, so a surface re-declared further down the
     file is seen at its final value. */
  const topLevel = (() => {
    let out = '';
    let depth = 0;
    let i = 0;
    while (i < css.length) {
      if (css[i] === '@' && depth === 0) {
        /* Skip the whole at-rule: find its opening brace, then its matching close. */
        const open = css.indexOf('{', i);
        if (open === -1) break;
        let d = 1;
        let j = open + 1;
        while (j < css.length && d > 0) {
          if (css[j] === '{') d += 1;
          else if (css[j] === '}') d -= 1;
          j += 1;
        }
        i = j;
        continue;
      }
      if (css[i] === '{') depth += 1;
      else if (css[i] === '}') depth -= 1;
      out += css[i];
      i += 1;
    }
    return out;
  })();
  const bodies = new Map<string, string>();
  for (const match of topLevel.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1].trim().split('\n').pop()!.trim();
    bodies.set(selector, (bodies.get(selector) ?? '') + match[2]);
  }

  it('has three thicknesses, ordered by how big the surface is', () => {
    /* A material the same thickness everywhere reads as a filter applied to things rather
       than as glass. By area on a 1280px viewport: stamp ~4k px², header ~92k, panel ~266k. */
    expect(px('chip')).toBeLessThan(px('chrome'));
    expect(px('chrome')).toBeLessThan(px('sheet'));
  });

  it('gives each surface the thickness for its size', () => {
    expect(bodies.get('.site-header')).toContain('blur(var(--glass-blur-chrome))');
    expect(bodies.get(".site-header[data-on-dark='true']")).toContain('blur(var(--glass-blur-chrome))');
    expect(bodies.get('.product-stamp')).toContain('blur(var(--glass-blur-chip))');
    expect(css).toContain('blur(var(--glass-blur-chrome)) saturate(var(--glass-sat)) brightness(var(--glass-dim))');
    /* The panel reads its blur from `--panel-blur` because it ramps, so its thickness is
       asserted at the ramp's endpoint instead of in the filter. */
    expect(bodies.get('.menu-panel')).toContain('blur(var(--panel-blur))');
    expect(bodies.get(".menu-side[data-open='true'] .menu-panel")).toContain(
      '--panel-blur: var(--glass-blur-sheet);',
    );
  });

  it('materializes the sheet through a registered property, not through the filter', () => {
    /* A filter list containing a `url()` reference is not interpolable, so transitioning
       `backdrop-filter` snaps on Chromium — the one engine that takes the `url(#liquid-glass)`
       declaration and therefore the only one showing the real lens. Registering the length
       makes the number animatable and the filter re-resolves from it each frame. */
    expect(css).toContain('@property --panel-blur');
    const at = css.indexOf('@property --panel-blur');
    const decl = css.slice(at, css.indexOf('}', at));
    expect(decl).toContain("syntax: '<length>';");
    expect(decl).toContain('inherits: false;');
    expect(decl).toMatch(/initial-value: \d+px;/);

    /* Closed at a fifth of the target rather than at zero: a first frame with no glass reads
       as a flat panel that suddenly frosts, which is the opposite of a material arriving. */
    expect(bodies.get('.menu-panel')).toContain('--panel-blur: calc(var(--glass-blur-sheet) * 0.2);');
    /* And the ramp finishes before the slide does — fewer recomposited frames, and the
       material has formed by the time the sheet lands. Both read from the duration scale, so
       the assertion is on the bands rather than on numbers that live in one place now. */
    expect(bodies.get(".menu-side[data-open='true'] .menu-panel")).toContain(
      '--panel-blur var(--speed-exit)',
    );
    expect(bodies.get(".menu-side[data-open='true'] .menu-panel")).toContain(
      'transform var(--speed-enter)',
    );
    expect(bodies.get('.menu-panel')).toContain('--panel-blur var(--speed-ui)');
  });

  it('ramps only the two surfaces that arrive, and nothing persistent', () => {
    /* The sheet and the scrim arrive together and form together. The header, the action bar and
       the stamp are persistent chrome — nothing to materialize, and no reason to pay for a
       recomposite on a mid-range Android. */
    for (const [selector, body] of bodies) {
      const isSheet = selector.includes('.menu-panel');
      const isScrim = selector.includes('.menu-scrim');
      if (isSheet || isScrim) continue;
      expect(body, `${selector} animates a blur`).not.toContain('--panel-blur');
      expect(body, `${selector} animates a blur`).not.toContain('--scrim-blur');
    }
  });

  it('forms the scrim on the same ramp as the sheet it sits under', () => {
    expect(css).toContain('@property --scrim-blur');
    expect(bodies.get('.menu-scrim')).toContain('--scrim-blur: 0px;');
    expect(bodies.get(".menu-side[data-open='true'] .menu-scrim")).toContain('--scrim-blur: 3px;');
    /* Same duration token as the sheet's ramp, so the two finish on the same frame. */
    expect(bodies.get(".menu-side[data-open='true'] .menu-scrim")).toContain(
      '--scrim-blur var(--speed-exit)',
    );
    expect(css).toContain('blur(var(--scrim-blur))');
    /* And no refraction on it — warping a full viewport rather than a panel is documented as
       rejected, and the scrim is the whole viewport. */
    const scrim = css.slice(css.lastIndexOf('.menu-scrim {'));
    expect(scrim.slice(0, scrim.indexOf('}'))).not.toContain('url(#liquid-glass)');
  });

  it('holds the sheet at full thickness under Reduce Motion', () => {
    const at = css.indexOf('@media (prefers-reduced-motion: reduce)');
    const block = css.slice(at, css.indexOf('\n}\n', at));
    expect(block).toContain('--panel-blur: var(--glass-blur-sheet);');
  });

  it('keeps the header at one thickness in both of its states', () => {
    /* It was 28px light and 12px dark: the same strip changing thickness depending on what
       happened to be behind it, which is the one thing glass never does. */
    const light = bodies.get('.site-header')!;
    const dark = bodies.get(".site-header[data-on-dark='true']")!;
    for (const body of [light, dark]) {
      expect(body).not.toMatch(/blur\(\d+px\)/);
    }
  });

  it('separates the header from content with a scroll edge, not a divider', () => {
    /* A 1px rule under fixed chrome reads as a border between two regions. The header is a
       floating layer and the page runs underneath it. */
    expect(bodies.get('.site-header')).not.toContain('border-bottom: 1px');
    const edge = bodies.get('.site-header::after')!;
    expect(edge, '.site-header::after is missing').toBeTruthy();
    expect(edge).toContain('inset: 100% 0 auto;');
    expect(edge).toContain('pointer-events: none;');
    /* Heavier over a photograph than over a flat bed — a busy backdrop needs more of one. */
    expect(bodies.get(".site-header[data-on-dark='true']::after")).toContain('height:');
  });

  it('never declares the refracting filter without its fallback', () => {
    /* The Declare-It-Twice Rule. A browser that cannot parse `url()` inside
       `backdrop-filter` discards the whole declaration, so the plain blur has to come
       first and `-webkit-` has to be there for Safari. */
    const offenders: string[] = [];
    for (const [selector, body] of bodies) {
      if (!body.includes('url(#liquid-glass)')) continue;
      const plain = body.includes('backdrop-filter: blur(');
      const webkit = body.includes('-webkit-backdrop-filter:');
      if (!plain || !webkit) offenders.push(selector);
    }
    expect(offenders).toEqual([]);
  });

  /* Two rules in one assertion, because they are the same rule counted two ways.
     The Four Surfaces Rule caps how many places pay for a backdrop-filter, and the reference
     material's own prohibition — avoid glass on glass — caps where they may be. The menu's open
     group used to carry a seventh, nested inside the panel's own glass: the panel had already
     blurred and re-lit what was behind it, so the inner filter had nothing left to bend and spent
     a composite discovering that. A static stylesheet cannot see DOM nesting, so what this guards
     is the count and the list. */
  it('spends a backdrop-filter on exactly the surfaces that earn one', () => {
    const filtered = [...bodies]
      .filter(([, body]) => body.includes('url(#liquid-glass)'))
      .map(([selector]) => selector)
      .sort();
    expect(filtered).toEqual([
      '.button',
      '.glass',
      '.menu-panel',
      '.product-stamp',
      '.site-header',
      ".site-header[data-on-dark='true']",
    ]);
  });

  /* The Declare-It-Twice Rule is not enough on its own, and that was a real bug rather than a
     theoretical one. Firefox parses `backdrop-filter: url(...)` — measured on 153, and
     `CSS.supports` agrees — so the reference declaration wins its cascade, and only at paint time
     does Gecko find `feDisplacementMap` and `feImage` pref-gated off and throw the *entire* chain
     away, blur included. Every one of these surfaces was rendering with no filter at all in
     Firefox: the header over the hero photograph came out at roughly 1.1:1, invisible rather than
     merely low. Safari is fine because it reads `-webkit-backdrop-filter`, which carries no
     `url()`.

     So every filtered selector has to appear again inside the Gecko block, and that block has to
     come after all of them — `@supports` adds no specificity, so source order is what decides. */
  it('hands Firefox back the plain chain it would otherwise lose', () => {
    const at = css.indexOf('@supports (-moz-orient: inline)');
    expect(at, 'no Gecko fallback block').toBeGreaterThan(-1);

    const block = css.slice(at, css.indexOf('\n}\n', at));
    const filtered = [...bodies]
      .filter(([, body]) => body.includes('url(#liquid-glass)'))
      .map(([selector]) => selector);

    for (const selector of filtered) {
      expect(block, `${selector} is missing from the Gecko fallback`).toContain(selector);
      /* And what it gets back must be a real filter, not `none`. */
      const start = block.indexOf(selector);
      const rule = block.slice(start, block.indexOf('}', start));
      expect(rule, `${selector} gets no blur back`).toMatch(/backdrop-filter: blur\(/);
      expect(rule, `${selector} smuggled a url() into the fallback`).not.toContain('url(');
    }

    /* Source order: the block must sit after the last `url()` declaration and before the
       accessibility overrides, which have to keep winning. */
    expect(at).toBeGreaterThan(css.lastIndexOf('url(#liquid-glass)'));
    expect(at).toBeLessThan(css.indexOf('@media (prefers-reduced-transparency: reduce)'));
  });

  it('answers Reduce Transparency by going opaque, not merely frostier', () => {
    /* Opaque raises every measurement: frost text is 16.74:1 on deep and 17.83:1 on abyss,
       against the 4.55:1 floor the glass itself guarantees. A half-measure would be the
       worst of both — still hard to read, and no longer glass. */
    const at = css.indexOf('@media (prefers-reduced-transparency: reduce)');
    expect(at, 'Reduce Transparency is unhandled').toBeGreaterThan(-1);
    const block = css.slice(at, css.indexOf('\n}\n', at));
    expect(block).toContain('backdrop-filter: none;');
    expect(block).toContain('-webkit-backdrop-filter: none;');
    for (const surface of ['.site-header', '.menu-panel', '.product-stamp', '.action-bar']) {
      expect(block, `${surface} still translucent`).toContain(surface);
    }
    /* The scrim has to carry the separation once the blur is gone. */
    expect(block).toContain('.menu-scrim');
  });

  it('answers Increase Contrast with a real border rather than a rim of light', () => {
    const at = css.indexOf('@media (prefers-contrast: more)');
    expect(at, 'Increase Contrast is unhandled').toBeGreaterThan(-1);
    const block = css.slice(at, css.indexOf('\n}\n', at));
    expect(block).toContain('backdrop-filter: none;');
    expect(block).toContain('border-bottom: 1px solid rgb(var(--deep) / 0.7);');
    expect(block).toContain('border-color: rgb(var(--frost) / 0.7);');
    /* And the soft edge goes: a gradient is the kind of edge this reader asked not to hunt for. */
    expect(block).toContain('background-image: none;');
  });
});

/**
 * The duration scale.
 *
 * An audit of globals.css found twelve literal durations across the motion layer against four
 * tokens — 120, 140, 160, 200, 240, 260, 280, 300, 380, 400, 420, 640 — with a 260 and a 280
 * sitting next to a 240 doing the same job in the same component. That is how a motion system
 * stops being one. These keep the scale the only place a duration is decided.
 */
describe('the motion scale', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );
  const root = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));

  it('declares one band per intent, in order', () => {
    const scale = [...root.matchAll(/--speed-([a-z]+):\s*(\d+)ms;/g)].map(
      (m) => [m[1], Number(m[2])] as const,
    );
    expect(scale.map(([name]) => name)).toEqual([
      'press',
      'fast',
      'ui',
      'fade',
      'exit',
      'md',
      'enter',
      'slow',
    ]);
    /* Monotonic, because a scale whose names do not sort by value is a set of aliases. */
    const values = scale.map(([, v]) => v);
    expect([...values].sort((a, b) => a - b)).toEqual(values);
    /* An exit is always shorter than the entrance it reverses. */
    const by = Object.fromEntries(scale);
    expect(by.exit).toBeLessThan(by.enter);
    /* A press is the fastest thing on the site: it is the frame confirming the tap landed. */
    expect(by.press).toBe(Math.min(...values));
  });

  it('keeps two stagger steps, because a column is not a row', () => {
    expect(root).toContain('--delay: 55ms;');
    expect(root).toContain('--delay-list: 32.5ms;');
    /* Per character, an order of magnitude below the sibling stagger. */
    expect(root).toContain('--split-step: 12ms;');
    const list = Number(root.match(/--delay-list:\s*([\d.]+)ms;/)![1]);
    const grid = Number(root.match(/--delay:\s*([\d.]+)ms;/)![1]);
    expect(list).toBeLessThan(grid);
    /* And a phone falls back to the list step for grids too, because it stacks them. */
    const phone = css.slice(css.indexOf('@media (max-width: 479px)'));
    expect(phone.slice(0, phone.indexOf('}'))).toContain(`--delay: ${list}ms;`);
  });

  it('has no exit curve, and the durations carry the asymmetry instead', () => {
    /* An earlier pass gave exits an ease-in. The improve-animations catalog puts entrances and
       exits both on ease-out and calls ease-in on UI a defect, and the shortness of an exit
       already carries the "leaves decisively" intent, so the curve was retired on 2026-09-04.
       This fails if it comes back without the argument being reopened. */
    expect(root).not.toContain('--ease-in-quart');
    expect(css).not.toContain('var(--ease-in-quart)');
    const by = Object.fromEntries(
      [...root.matchAll(/--speed-([a-z]+):\s*(\d+)ms;/g)].map((m) => [m[1], Number(m[2])]),
    );
    expect(by.exit).toBeLessThan(by.enter);
  });

  it('leaves no duration decided outside the scale', () => {
    const offenders: string[] = [];
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = m[1].trim().split('\n').pop()!.trim();
      if (selector === ':root') continue;
      for (const decl of m[2].matchAll(
        /(transition|transition-duration|transition-delay|animation|animation-duration)\s*:\s*([^;]+);/g,
      )) {
        const literals = [...decl[2].matchAll(/(?<![\w-])(\d+(?:\.\d+)?m?s)/g)]
          .map((l) => l[1])
          /* Milliseconds only. `0s` is "no delay"; the marquee is a content loop measured in
             whole seconds rather than a UI band; and `20ms` is the hold that keeps an exit
             visible a frame past its own duration, written `calc(var(--speed-exit) + 20ms)`. */
          .filter((l) => l.endsWith('ms') && l !== '20ms');
        if (literals.length) offenders.push(`${selector} { ${decl[1]}: ${literals.join(' ')} }`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
