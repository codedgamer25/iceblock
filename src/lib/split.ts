/**
 * Splitting a line into characters so each one can arrive on its own.
 *
 * This is the reference site's signature text move, which it gets from GSAP's
 * SplitText plus a `stagger: { each: 0.02, from: "random" }`. The effect is worth
 * having and the 60KB plugin is not: characters fading in at 20ms intervals in a
 * scrambled order is a CSS transition with a per-character delay.
 *
 * The order is shuffled deterministically from the text itself rather than from
 * Math.random, for one specific reason: the markup is rendered on the server and
 * hydrated on the client, and a genuinely random order would differ between the
 * two and React would report a mismatch. Seeding from the string means both sides
 * compute the same scramble, and the same line always animates the same way, which
 * also makes it testable.
 */

/** mulberry32 — small, fast, and identical in every JS engine. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a, so a line's scramble is a function of the line. */
export function seedFrom(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * A stagger position for each of `count` items, scrambled. Returns an array where
 * index `i` holds the position item `i` takes in the sequence — so every position
 * from 0 to count-1 is used exactly once and no two characters share a delay.
 */
export function scrambleOrder(count: number, seed: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  const next = random(seed);
  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    const swap = order[i];
    order[i] = order[j];
    order[j] = swap;
  }
  return order;
}

export type SplitPiece = { char: string; position: number };
export type SplitWord = { chars: SplitPiece[] };

/**
 * Split text into words, each holding its characters with a scrambled stagger
 * position.
 *
 * Words, not just characters, and that is not decoration. A character in an
 * `inline-block` span is its own break opportunity, so a purely per-character split
 * lets the browser wrap in the middle of a word — "Commercial col / d, built to".
 * Wrapping each word in an inline-block that cannot break internally puts the break
 * opportunities back where the spaces are. GSAP's SplitText takes
 * `type: "chars, words, lines"` for exactly this reason.
 *
 * Spaces are not characters here: they live between the word wrappers as ordinary
 * text, which is what lets a wrapped line start flush instead of indented by a
 * leading space. They get no stagger position either — an invisible glyph does not
 * need to fade in, and counting it would leave a gap in the rhythm.
 */
export function splitToWords(text: string): SplitWord[] {
  const words = text.split(' ').filter((word) => word.length > 0);
  const visible = words.reduce((sum, word) => sum + Array.from(word).length, 0);
  const order = scrambleOrder(visible, seedFrom(text));
  let taken = 0;

  return words.map((word) => ({
    chars: Array.from(word).map((char) => {
      const position = order[taken];
      taken += 1;
      return { char, position };
    }),
  }));
}

/** Flat character list, for tests and for anything that only needs the rhythm. */
export function splitToChars(text: string): SplitPiece[] {
  return splitToWords(text).flatMap((word) => word.chars);
}
