import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  BUSINESS,
  NIGERIAN_MOBILE,
  OFFICES,
  PAYMENT_ADVICE,
  PHONE_ALT_DISPLAY,
  PHONE_ALT_E164,
  PHONE_DISPLAY,
  PHONE_E164,
  PRICES_ARE_OFFLINE,
  SOCIAL_LINKS,
  WHATSAPP_NUMBER,
  isContactConfigured,
} from '@/lib/business';
import { GALLERY, GALLERY_GROUPS } from '@/lib/gallery';
import { CAPACITY, MACHINE_TYPES, POWER_OPTIONS, PRODUCTION_CYCLES } from '@/lib/machines';
import { NAV_TARGETS } from '@/lib/nav';
import { PRODUCTS } from '@/lib/products';
import { enquiryMessage, telLink, whatsappLink } from '@/lib/whatsapp';

describe('contact details', () => {
  it('has two valid Nigerian mobiles', () => {
    expect(PHONE_E164).toMatch(NIGERIAN_MOBILE);
    expect(PHONE_ALT_E164).toMatch(NIGERIAN_MOBILE);
    expect(isContactConfigured()).toBe(true);
  });

  it('displays the same line it dials', () => {
    /* Nigerian local form starts with 0; E.164 replaces that 0 with +234. So the
       display and the dial string agree exactly when the leading zero is swapped
       for the country code — this catches a digit being fixed in one place and not
       the other, which is the way a phone number on a website actually goes wrong. */
    const local = (value: string) => value.replace(/[^\d]/g, '');
    expect(local(PHONE_DISPLAY)).toMatch(/^0/);
    expect(local(PHONE_DISPLAY).replace(/^0/, '234')).toBe(local(PHONE_E164));
    expect(local(PHONE_ALT_DISPLAY)).toMatch(/^0/);
    expect(local(PHONE_ALT_DISPLAY).replace(/^0/, '234')).toBe(local(PHONE_ALT_E164));
  });

  it('builds wa.me links from the number with no plus', () => {
    expect(WHATSAPP_NUMBER).toBe('2348022689722');
    expect(whatsappLink('hi & bye')).toBe('https://wa.me/2348022689722?text=hi%20%26%20bye');
  });

  it('dials the alternate number when asked', () => {
    expect(telLink()).toBe(`tel:${PHONE_E164}`);
    expect(telLink(true)).toBe(`tel:${PHONE_ALT_E164}`);
  });
});

describe('the no-prices-online policy', () => {
  it('is switched on', () => {
    expect(PRICES_ARE_OFFLINE).toBe(true);
  });

  it('gives no product a price field to fill in', () => {
    for (const product of PRODUCTS) {
      expect(product).not.toHaveProperty('price');
    }
  });

  /* The real guard. Koolink's instruction is "we don't disclose or discuss prices
     online", so a naira figure appearing anywhere in the source is a bug, whoever
     added it and however well-meant. */
  it('has no naira figure anywhere in src/', () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
          walk(path);
          continue;
        }
        if (!/\.(ts|tsx|css)$/.test(entry)) continue;
        const text = readFileSync(path, 'utf8');
        /* The word "price" is fine — talking about how pricing works is the point.
           A figure attached to a currency is not. */
        if (/[₦]\s*[\d]/.test(text) || /\bNGN\s*[\d]/.test(text)) offenders.push(path);
      }
    };
    walk(join(process.cwd(), 'src'));
    expect(offenders).toEqual([]);
  });

  it('asks for the price in the enquiry rather than stating one', () => {
    const message = enquiryMessage({ product: 'Ice block machines' });
    expect(message).toContain('Please send me the details and the price.');
    expect(message).not.toMatch(/₦/);
  });
});

describe('enquiry messages', () => {
  it('names the product the customer tapped', () => {
    expect(enquiryMessage({ product: 'Walk-in coldrooms' })).toContain(
      'I am interested in your walk-in coldrooms.',
    );
  });

  it('leaves unanswered fields out entirely rather than sending empty labels', () => {
    const message = enquiryMessage({ product: 'Ice block machines', power: 'Full solar' });
    expect(message).toContain('Power: Full solar');
    expect(message).not.toContain('Machine type:');
    expect(message).not.toContain('Capacity needed:');
  });

  it('still reads like a person wrote it with nothing filled in', () => {
    expect(enquiryMessage({})).toContain('I am interested in your machines.');
  });
});

describe('the product list', () => {
  it('has the lines Koolink asked to lead with', () => {
    expect(PRODUCTS.map((p) => p.id)).toEqual([
      'nylon-type-machines',
      'mould-type-machines',
      'walk-in-cold-rooms',
      'solar-panel-types',
    ]);
  });

  it('says what each one is and who buys it', () => {
    for (const product of PRODUCTS) {
      expect(product.name.length).toBeGreaterThan(3);
      expect(product.what.length).toBeGreaterThan(20);
      expect(product.who.length).toBeGreaterThan(20);
    }
  });

  it('has unique ids, because they are used as React keys and anchors', () => {
    expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(PRODUCTS.length);
  });
});

describe('how a machine is specified', () => {
  it('offers the two machine types', () => {
    expect(MACHINE_TYPES.map((t) => t.id)).toEqual(['nylon', 'mould']);
  });

  it('offers all three power options', () => {
    expect(POWER_OPTIONS.map((p) => p.id)).toEqual(['full-solar', 'solar-friendly', 'mains']);
  });

  it('offers all three production cycles', () => {
    expect(PRODUCTION_CYCLES.map((c) => c.id)).toEqual(['once', 'twice', 'thrice']);
  });

  it('quotes the capacity range Koolink gave', () => {
    expect(CAPACITY.from).toBe(21);
    expect(CAPACITY.to).toBe(500);
  });

  it('explains every choice rather than just naming it', () => {
    for (const choice of [...MACHINE_TYPES, ...POWER_OPTIONS, ...PRODUCTION_CYCLES]) {
      expect(choice.detail.length).toBeGreaterThan(20);
    }
  });
});

describe('offices and social handles', () => {
  it('lists all four offices with an address each', () => {
    expect(OFFICES).toHaveLength(4);
    for (const office of OFFICES) {
      expect(office.label.length).toBeGreaterThan(2);
      expect(office.address.length).toBeGreaterThan(20);
    }
  });

  it('includes the head office and factory', () => {
    expect(OFFICES[0].label.toLowerCase()).toContain('factory');
  });

  it('covers Lagos, Abuja and Port Harcourt', () => {
    const labels = OFFICES.map((o) => o.label).join(' ');
    for (const city of ['Lagos', 'Abuja', 'Port Harcourt']) {
      expect(labels).toContain(city);
    }
  });

  it('tells customers to visit before paying', () => {
    expect(PAYMENT_ADVICE.toLowerCase()).toContain('before making any payment');
  });

  /* A handle with spaces in it is a page name, not a URL. Guessing one sends
     customers to somebody else's page, so a link is only rendered where it can be
     derived — and this asserts that any link present is a real absolute URL. */
  it('only carries links that are absolute https URLs', () => {
    expect(SOCIAL_LINKS).toHaveLength(4);
    for (const social of SOCIAL_LINKS) {
      expect(social.handle.length).toBeGreaterThan(3);
      if (social.href) expect(social.href).toMatch(/^https:\/\/[\w.-]+\/\S+$/);
    }
  });

  it('names all four platforms', () => {
    expect(SOCIAL_LINKS.map((s) => s.platform).sort()).toEqual([
      'Facebook',
      'Instagram',
      'TikTok',
      'YouTube',
    ]);
  });
});

describe('the business record', () => {
  it('uses the registered name and their own motto', () => {
    expect(BUSINESS.legalName).toBe('Koolink Nigeria Limited');
    expect(BUSINESS.motto).toBe('Quality, Efficiency and Durability.');
  });

  it('claims exactly the experience Koolink claims', () => {
    expect(BUSINESS.yearsExperience).toBe(25);
  });

  it('serves the whole country', () => {
    expect(BUSINESS.areaServed).toBe('Nigeria');
    expect(BUSINESS.deliveryNote.toLowerCase()).toContain('anywhere in nigeria');
  });
});

describe('the menu goes where it says', () => {
  /* The first version of this menu listed six products that all linked to
     `/#products`, so six entries did the same thing. This is the guard against that
     coming back: every target either appears literally as an id in the source, or is
     produced by a template whose values come from the same data the menu reads. */
  const source = (() => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.tsx?$/.test(entry)) files.push(readFileSync(path, 'utf8'));
      }
    };
    walk(join(process.cwd(), 'src'));
    return files.join('\n');
  })();

  it('has no duplicate destinations', () => {
    expect(new Set(NAV_TARGETS).size).toBe(NAV_TARGETS.length);
  });

  it('offers a destination for every product', () => {
    for (const product of PRODUCTS) {
      expect(NAV_TARGETS).toContain(`product-${product.id}`);
    }
  });

  it('renders an anchor for every destination it offers', () => {
    const missing = NAV_TARGETS.filter((id) => {
      if (source.includes(`id="${id}"`)) return false;
      /* Template-generated: `id={`product-${product.id}`}` covers every product id,
         and `id={`machine-${group.id}`}` every option group. */
      if (id.startsWith('product-') && source.includes('id={`product-${product.id}`}')) return false;
      if (id.startsWith('machine-') && source.includes('id={`machine-${group.id}`}')) return false;
      return true;
    });
    expect(missing).toEqual([]);
  });

  it('keeps anchored targets clear of the fixed header', () => {
    /* Without scroll-margin-top an anchor lands underneath the header. */
    expect(source).toContain('scroll-mt-header');
  });
});

describe('the photograph catalogue', () => {
  /* Forty-seven of Koolink's own photographs, generated into src/lib/gallery.ts by
     scripts/build_products.py. These guard the two ways that pipeline can silently rot:
     a manifest entry whose files were never written, and a group heading with nothing
     underneath it. Both would ship a page with holes in it and no error anywhere. */
  const dir = join(process.cwd(), 'public', 'gallery');

  /* Four files per photograph: two formats at two widths. The narrow variant is what makes
     the `sizes` attribute mean anything, so a missing one is not cosmetic. */
  const files = (shot: (typeof GALLERY)[number]) => [
    `${shot.slug}.avif`,
    `${shot.slug}.webp`,
    `${shot.slug}-400.avif`,
    `${shot.slug}-400.webp`,
  ];

  it('has a photograph for every entry, in both formats at both widths', () => {
    const present = new Set(readdirSync(dir));
    const missing = GALLERY.flatMap((shot) => files(shot).filter((file) => !present.has(file)));
    expect(missing).toEqual([]);
  });

  it('ships no photograph the manifest does not list', () => {
    const listed = new Set(GALLERY.flatMap(files));
    const orphans = readdirSync(dir).filter((file) => !listed.has(file));
    expect(orphans).toEqual([]);
  });

  it('gives the narrow variant a width smaller than the wide one', () => {
    for (const shot of GALLERY) {
      expect(shot.smallWidth, shot.slug).toBeLessThanOrEqual(shot.width);
      expect(shot.smallWidth, shot.slug).toBeGreaterThan(100);
    }
  });

  it('carries real pixel dimensions, so nothing shifts as the page loads', () => {
    for (const shot of GALLERY) {
      expect(shot.width).toBeGreaterThan(200);
      expect(shot.height).toBeGreaterThan(150);
    }
  });

  it('describes every photograph rather than leaving alt text to chance', () => {
    for (const shot of GALLERY) {
      expect(shot.caption.length).toBeGreaterThan(20);
      expect(shot.caption.endsWith('.')).toBe(true);
    }
  });

  it('fills every group it advertises', () => {
    for (const group of GALLERY_GROUPS) {
      const shots = GALLERY.filter((shot) => shot.group === group.id);
      if (group.id === 'mould') {
        expect(shots.length).toBe(0);
      } else {
        expect(shots.length, `${group.id} has no photographs`).toBeGreaterThan(0);
      }
    }
  });

  it('files every photograph under a group the page renders', () => {
    const known = new Set(GALLERY_GROUPS.map((group) => group.id));
    for (const shot of GALLERY) {
      expect(known.has(shot.group), `${shot.slug} is in unknown group ${shot.group}`).toBe(true);
    }
  });

  it('has unique slugs, because they are used as React keys and filenames', () => {
    const slugs = GALLERY.map((shot) => shot.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /* The captions were written against a contact sheet, and the first pass captioned a nylon
     trough as "a chiller's channels packed with bottled drinks" — a sentence naming one of the
     three product lines the client had just dropped. It read as fine in isolation, which is
     exactly why it survived to a build.

     No test can tell whether a caption describes its photograph. This one only guards the
     failure that actually happened: copy left behind from the old taxonomy. */
  it('never captions a frame with a product line the client dropped', () => {
    const gone = ['chiller', 'deep freezer', 'freezer', 'cold storage'];
    for (const shot of GALLERY) {
      for (const word of gone) {
        expect(shot.caption.toLowerCase(), `${shot.slug}: ${shot.caption}`).not.toContain(word);
      }
    }
  });

  /* Every layout family gives shots[0] the most room — LeadAndGrid runs it the full width of
     the shell — so the first frame of a group is the one carrying the section. Filename order
     picked it before build_products.py had a LEADS map, which opened the nineteen-frame nylon
     section on the one frame in it with no ice in the picture. */
  it('opens each group on the lead frame named in the build script', () => {
    const script = readFileSync(join(process.cwd(), 'scripts', 'build_products.py'), 'utf8');
    const block = script.slice(script.indexOf('LEADS = {'));
    const leads = [...block.slice(0, block.indexOf('}')).matchAll(/"([^"]+)":\s*"([^"]+)"/g)];
    expect(leads.length).toBe(GALLERY_GROUPS.length);

    for (const [, group, slug] of leads) {
      if (group === 'mould') continue;
      const first = GALLERY.find((shot) => shot.group === group);
      expect(first?.slug, `${group} should open on ${slug}`).toBe(slug);
    }
  });
});

describe('every photograph appears once', () => {
  /* Two instructions from the client, and this guards the first: the frames that lead the
     homepage product tiles must not also sit in the catalogue, or the same picture is on the
     site twice. The tile sources live in the build script rather than in TypeScript, so this
     reads them from there — the script is the thing that would drift. */
  const script = readFileSync(join(process.cwd(), 'scripts', 'build_products.py'), 'utf8');
  const slugFor = (stem: string) =>
    stem.replace(/\./g, '-').replace(/ /g, '').replace(/\(/g, '-').replace(/\)/g, '');
  const tileSources = (() => {
    const block = script.slice(script.indexOf('TILES = {'), script.indexOf('DROP = {'));
    return [...block.matchAll(/"WhatsApp Image 2026-09-\d\d at ([^"]+)\.jpeg"/g)].map((m) =>
      slugFor(m[1]),
    );
  })();

  it('uses a distinct source photograph for each tile', () => {
    expect(tileSources.length).toBe(PRODUCTS.length);
    expect(new Set(tileSources).size).toBe(tileSources.length);
  });

  it('keeps every tile photograph out of the catalogue', () => {
    const inGallery = new Set(GALLERY.map((shot) => shot.slug));
    const both = tileSources.filter((slug) => inGallery.has(slug));
    expect(both).toEqual([]);
  });

  /* And this guards the harder half of the same instruction. The tile-overlap check above
     compares slugs, so it only ever catches the identical file appearing twice — and the
     duplicates in these folders are near-identical files with different names. They were found
     by difference hash before anything was encoded: two pairs, 1 and 2 bits of 64 apart.

     The dropped names live in the build script's DROP set with a comment saying which frame each
     duplicates. Reading them from there rather than restating them here means the test cannot
     drift from the thing it is guarding. */
  const dropped = [...script.matchAll(/"(WhatsApp Image 2026-09-05 at [^"]+)\.jpeg",\s*# ==/g)].map(
    (m) => slugFor(m[1].replace('WhatsApp Image 2026-09-05 at ', '')),
  );

  it('names the duplicates it dropped, so they cannot come back unremarked', () => {
    expect(dropped.length).toBeGreaterThanOrEqual(2);
    const inGallery = new Set(GALLERY.map((shot) => shot.slug));
    expect(dropped.filter((slug) => inGallery.has(slug))).toEqual([]);
  });

  it('has no duplicate files left on disk for a frame that is no longer in the manifest', () => {
    const inGallery = new Set(GALLERY.map((shot) => shot.slug));
    const orphans = readdirSync(join(process.cwd(), 'public', 'gallery'))
      .map((name) => name.replace(/(-400)?\.(avif|webp)$/, ''))
      .filter((stem) => !inGallery.has(stem));
    expect([...new Set(orphans)]).toEqual([]);
  });

  /* Two frames of one moment tended to arrive with two captions that said the same thing —
     "a nylon-type machine in a customer's shop" and "a nylon-type machine handed over and
     running in a customer's shop" were the same photograph. Captions repeating is not proof
     of a duplicate, but in this set it was the tell every time, so it is worth failing on. */
  it('describes each photograph in its own words', () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const shot of GALLERY) {
      const key = shot.caption
        .toLowerCase()
        .replace(/[^a-z ]/g, '')
        .split(' ')
        .filter((word) => word.length > 3)
        .sort()
        .join(' ');
      const first = seen.get(key);
      if (first) clashes.push(`${first} / ${shot.slug}`);
      else seen.set(key, shot.slug);
    }
    expect(clashes).toEqual([]);
  });
});

describe('Book now carries the picture', () => {
  /* The client's second instruction. `wa.me` cannot attach a file, so the message carries an
     absolute URL to the photograph and WhatsApp renders it as a preview. These assert the URL
     is there, is absolute, is the format a preview scraper can decode, and points at a file
     that exists. */
  it('puts an absolute image URL in the message', () => {
    const message = enquiryMessage({ product: 'Ice block machines', image: '/gallery/01-45-26.webp' });
    expect(message).toContain('/gallery/01-45-26.webp');
    expect(message).toMatch(/https?:\/\/[^\s]+\/gallery\/01-45-26\.webp/);
  });

  it('always links the WebP, because that is what a link preview can decode', () => {
    const fromTile = enquiryMessage({ image: '/products/nylon.avif' });
    expect(fromTile).toContain('/products/nylon.webp');
    expect(fromTile).not.toContain('.avif');
  });

  it('leaves the message clean when there is no picture to send', () => {
    const message = enquiryMessage({ product: 'Walk-in coldrooms' });
    expect(message).not.toContain('This is the one I am looking at');
    expect(message).not.toContain('undefined');
  });

  it('still refuses to quote a price', () => {
    const message = enquiryMessage({ product: 'Ice block machines', image: '/gallery/01-45-26.webp' });
    expect(message).not.toMatch(/₦|NGN/);
    expect(message).toContain('Please send me the details and the price.');
  });

  it('sends a file that is actually on disk for every catalogue photograph', () => {
    const present = new Set(readdirSync(join(process.cwd(), 'public', 'gallery')));
    const missing = GALLERY.filter((shot) => !present.has(`${shot.slug}.webp`)).map((s) => s.slug);
    expect(missing).toEqual([]);
  });

  it('sends a file that is actually on disk for every product tile', () => {
    const present = new Set(readdirSync(join(process.cwd(), 'public', 'products')));
    const missing = PRODUCTS.filter(
      (p) => p.image && !present.has(p.image.split('/').pop()!.replace(/\.avif$/, '.webp')),
    ).map((p) => p.id);
    expect(missing).toEqual([]);
  });
});

describe('the product ScrollStack', () => {
  const component = readFileSync(
    join(process.cwd(), 'src', 'components', 'ScrollStack.tsx'),
    'utf8',
  );
  const families = readFileSync(
    join(process.cwd(), 'src', 'components', 'gallery', 'families.tsx'),
    'utf8',
  );
  const catalogue = readFileSync(join(process.cwd(), 'src', 'components', 'products', 'ProductCatalogue.tsx'), 'utf8');
  const runtime = readFileSync(
    join(process.cwd(), 'src', 'components', 'InViewRuntime.tsx'),
    'utf8',
  );
  const css = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8').replace(
    /\r\n/g,
    '\n',
  );

  const sourceFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) return sourceFiles(path);
      return /\.(ts|tsx)$/.test(entry) ? [path] : [];
    });

  it('keeps Lenis under one owner', () => {
    const owners = sourceFiles(join(process.cwd(), 'src')).filter((path) =>
      /new\s+Lenis\s*\(/.test(readFileSync(path, 'utf8')),
    );
    expect(owners.map((path) => path.replace(process.cwd(), '').replace(/\\/g, '/'))).toEqual([
      '/src/components/SmoothScroll.tsx',
    ]);
    expect(component).not.toContain("from 'lenis'");
    expect(component).not.toContain('requestAnimationFrame');
  });

  it('wraps every existing gallery figure instead of recreating its actions', () => {
    expect(catalogue).toContain('<ScrollStack');
    expect(catalogue).toContain('enabled={view === \'stack\'}');
    expect(catalogue).toContain('<GalleryFigure');
    expect(families).toContain('shots.map((shot, index) =>');
    expect(families).toContain('<ScrollStackItem key={shot.slug} stackIndex={index}>');
    expect(families).toContain('<GalleryFigure');
    expect(component).not.toContain('Book now');
    expect(component).not.toContain('<img');
  });

  it('keeps one card, phone stamp and Book now action per photograph', () => {
    const figure = readFileSync(
      join(process.cwd(), 'src', 'components', 'gallery', 'GalleryFigure.tsx'),
      'utf8',
    );
    expect(GALLERY).toHaveLength(21);
    expect(new Set(GALLERY.map((shot) => shot.slug)).size).toBe(GALLERY.length);
    expect(figure).toContain('className="product-stamp numeral"');
    expect(figure.match(/^\s*Book now\s*$/gm)).toHaveLength(1);
    const stackFamily = families.slice(
      families.indexOf('export function ScrollStackGallery'),
      families.indexOf('/** One photograph leads'),
    );
    expect(stackFamily.match(/<GalleryFigure/g)).toHaveLength(1);
  });

  it('uses the shared, cleaned-up scroll measurement pass', () => {
    expect(runtime).toContain("const STACK_QUERY = '[data-scroll-stack]';");
    expect(runtime).toContain("window.addEventListener('scroll', onScroll, { passive: true })");
    expect(runtime).toContain("window.removeEventListener('scroll', onScroll)");
    expect(runtime).toContain('resetStacks();');
  });

  it('makes ordinary flow the baseline and gates sticky transforms', () => {
    expect(css).toContain('.scroll-stack-card {\n  position: relative;\n  transform: none;');
    expect(css).toContain(
      '@media (min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    expect(css).toContain(".scroll-stack[data-stack-active='true'] .scroll-stack-card");
    expect(css).toContain('@media (max-width: 767px), (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)');
    expect(css).toContain('transform: none !important;');
    expect(css).not.toContain('blur(var(--stack');
  });
});

/**
 * The open group's pill.
 *
 * It is deliberately wider than the label it highlights, which means three declarations have
 * to agree about one number: the padding holding the text off its edge, the negative margin
 * cancelling that padding so the label still lines up with the links beneath it, and the
 * width that has to grow by both. They were three separate literals, and the pill ended up
 * 1.4u out of centre with its left corners sliced flat by the column's clip box. These tie
 * the numbers together and check the column leaves room for the bleed.
 */
describe('the menu pill is not clipped by its column', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );
  const rule = (selector: string) => {
    const start = css.indexOf(`${selector} {`);
    expect(start, `${selector} has no rule`).toBeGreaterThan(-1);
    return css.slice(start, css.indexOf('}', start));
  };

  it('derives the pill geometry from one bleed value', () => {
    const base = rule('.menu-link-heading');
    expect(base).toContain('--pill-bleed: calc(var(--u) * 0.7);');
    /* Width has to be stated: a button shrinks to fit at `width: auto` whatever its display
       is, so leaving it off makes the pill hug its label instead of filling the column. */
    expect(base).toContain('width: calc(100% + var(--pill-bleed) * 2);');
    expect(css).toContain('padding: calc(var(--u) * 0.4) var(--pill-bleed);');
    expect(css).toContain('margin-inline: calc(var(--pill-bleed) * -1);');
  });

  it('gives the scrolling column enough padding to hold the bleed', () => {
    /* The clip box of a scroll container is its padding box. 0.7u on the left is the bleed;
       1.2u on the right is the bleed plus the 0.5u the pill is nudged when its group opens. */
    const items = rule('.menu-items');
    expect(items).toContain('overflow-x: hidden;');
    expect(items).toContain('padding-inline: calc(var(--u) * 0.7) calc(var(--u) * 1.2);');
    expect(items).toContain('margin-inline: calc(var(--u) * -0.7) calc(var(--u) * -1.2);');
  });

  it('keeps the open group nudge no larger than the padding allows for it', () => {
    /* If the active nudge ever grows past 0.5u, the right padding above has to grow with it
       or the pill starts being clipped again on the side it moves toward. */
    const active = rule(".link-item[data-active='true'] .menu-link-heading");
    expect(active).toContain('transform: translateX(calc(var(--u) * 0.5));');
  });
});

/**
 * The wordmark's initial.
 *
 * There is one K on the site now and it is the word's own, set as a versal in the bed's
 * accent. That makes the logo the only thing in the header reading `var(--accent)`, and the
 * header carries no theme class — so these guard the two ways it could silently go wrong:
 * the accent failing to resolve on an un-themed surface, and the accent pair drifting to a
 * value that cannot be read on the beds it lands on.
 */
describe('the wordmark initial', () => {
  const raw = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8');
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  const rule = (selector: string) => {
    const start = css.indexOf(selector + ' {');
    expect(start, selector + ' has no rule').toBeGreaterThan(-1);
    return css.slice(start, css.indexOf('}', start));
  };

  it('is drawn, not set, and the drawing matches the script that authored it', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'KoolinkLogo.tsx'), 'utf8');
    const shipped = source.match(/<path d="([^"]+)"/);
    expect(shipped, 'the initial has no path data').toBeTruthy();

    /* The geometry is authored in the script, which rasterises it at the sizes the site
       actually renders so it can be looked at. If the two ever disagree, the drawing on the
       page is no longer the one anybody reviewed. Rebuilt here from the same constants rather
       than string-matched, so a change to the script's formatting does not fail the test. */
    const py = readFileSync(join(process.cwd(), 'scripts', 'draw_wordmark_k.py'), 'utf8');
    const num = (name: string) => {
      const found = py.match(new RegExp('^' + name + ' = ([\\d.]+)$', 'm'));
      expect(found, name + ' is not in the script').toBeTruthy();
      return Number(found![1]);
    };
    const trim = (v: number) => String(v).replace(/\.0$/, '');
    const hair = num('HAIR');
    const serifH = num('SERIF_H');
    /* The number the drawing lives or dies by, and the reason the script exists. The initial
       matches the wordmark's cap height, which bottoms out at 14px, so one device pixel is
       100/14 = 7.14 units on the drawing's grid. A hairline thinner than about 7 anti-aliases
       to a grey smear instead of a stroke — that is what the raster showed at 4.6. Above about
       9 there is no contrast left against the stem's 12.5 and it stops being a didone. */
    expect(hair).toBeGreaterThanOrEqual(6.5);
    expect(hair).toBeLessThan(9);
    expect(serifH).toBeGreaterThanOrEqual(6.5);
    expect(shipped![1]).toContain('H' + trim(hair + 8));
    expect(shipped![1]).toContain('V' + trim(2 + serifH));
  });

  it('is set to the cap height of the letters it sits beside', () => {
    const mark = rule('.logo-k-mark');
    /* Archivo's cap height measures 0.70em, read off the live element with a canvas. The
       drawing's cap is 100 of its 102-unit viewBox, so 0.70 x 102/100 = 0.714em puts its cap
       line on the wordmark's. Verified in the browser at 120px: 84px against 83px, which is
       the granularity of `actualBoundingBoxAscent` rather than a mismatch. */
    expect(mark).toContain('height: 0.714em;');
    expect(mark).toContain('vertical-align: baseline;');
    /* The viewBox has to keep its 102-unit height or the 0.714 above stops meaning anything. */
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'KoolinkLogo.tsx'), 'utf8');
    expect(source).toContain('viewBox="4 0 95 102"');
  });

  it('keeps the letter itself in the document for a screen reader and a selection', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'KoolinkLogo.tsx'), 'utf8');
    /* The drawing is aria-hidden, so without the hidden letter the wordmark reads "oolink" —
       and an aria-label on the header link would not cover the footer or the menu sheet. */
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain('<span className="visually-hidden">{initial}</span>');
    const hidden = rule('.visually-hidden');
    expect(hidden).toContain('clip-path: inset(50%);');
    /* `display: none` and `visibility: hidden` both take it out of the accessibility tree. */
    expect(hidden).not.toContain('display: none');
    expect(hidden).not.toContain('visibility: hidden');
  });

  it('has an accent declared on every un-themed surface in the chrome', () => {
    /* Own-Bed Rule. The focus ring reads `var(--accent)`, and until these were here it fell
       back to marine in the header's dark state — 2.03:1 on `deep`, a ring nobody can see. */
    expect(rule('.site-header')).toContain('--accent: rgb(var(--marine));');
    expect(rule(".site-header[data-on-dark='true']")).toContain('--accent: rgb(var(--chill));');
    expect(rule('.menu-panel')).toContain('--accent: rgb(var(--chill));');
  });

  it('keeps both accent altitudes readable on the beds they land on', () => {
    /* Sliced rather than matched with a pattern: the tokens are three plain integers after a
       known label, and a regex is only more ways to get the escaping wrong. */
    const channel = (name: string) => {
      const label = '--' + name + ': ';
      const at = raw.indexOf(label);
      expect(at, name + ' is not in the token block').toBeGreaterThan(-1);
      const value = raw.slice(at + label.length, raw.indexOf(';', at)).trim().split(/\s+/);
      expect(value, name + ' is not three channels').toHaveLength(3);
      return value.map(Number) as readonly number[];
    };
    const lum = (rgb: readonly number[]) =>
      rgb
        .map((v) => v / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a: readonly number[], b: readonly number[]) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };

    const marine = channel('marine');
    const chill = channel('chill');
    for (const bed of ['frost', 'sheet', 'glacier'] as const) {
      expect(ratio(marine, channel(bed)), 'marine on ' + bed).toBeGreaterThanOrEqual(4.5);
    }
    for (const bed of ['deep', 'abyss'] as const) {
      expect(ratio(chill, channel(bed)), 'chill on ' + bed).toBeGreaterThanOrEqual(4.5);
    }
    /* And the pair is not interchangeable, which is the whole reason there are two of them. */
    expect(ratio(marine, channel('abyss'))).toBeLessThan(3);
    expect(ratio(chill, channel('frost'))).toBeLessThan(3);
  });
});
