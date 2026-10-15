import { describe, expect, it } from 'vitest';

import { scrambleOrder, seedFrom, splitToChars, splitToWords } from '@/lib/split';

describe('scrambleOrder', () => {
  it('is a permutation — every stagger position used exactly once', () => {
    for (const count of [1, 2, 7, 44, 61]) {
      const order = scrambleOrder(count, seedFrom('Tell us what you need cold.'));
      expect(order).toHaveLength(count);
      expect([...order].sort((a, b) => a - b)).toEqual(
        Array.from({ length: count }, (_, i) => i),
      );
    }
  });

  it('is deterministic, so the server and the client agree', () => {
    const a = scrambleOrder(40, seedFrom('Cold that lasts the whole day.'));
    const b = scrambleOrder(40, seedFrom('Cold that lasts the whole day.'));
    expect(a).toEqual(b);
  });

  it('actually scrambles rather than returning the identity', () => {
    const order = scrambleOrder(40, seedFrom('Cold that lasts the whole day.'));
    const identity = Array.from({ length: 40 }, (_, i) => i);
    expect(order).not.toEqual(identity);
  });

  it('gives different lines different scrambles', () => {
    const a = scrambleOrder(20, seedFrom('Water you could drink.'));
    const b = scrambleOrder(20, seedFrom('Still cold when it gets to you.'));
    expect(a).not.toEqual(b);
  });
});

describe('splitToWords', () => {
  const text = 'Cold that lasts the whole day.';
  const words = splitToWords(text);

  it('keeps every word, in order, with nothing lost', () => {
    expect(words.map((w) => w.chars.map((c) => c.char).join(''))).toEqual([
      'Cold', 'that', 'lasts', 'the', 'whole', 'day.',
    ]);
  });

  it('holds no space characters — spaces are text nodes, not elements', () => {
    for (const word of words) {
      for (const piece of word.chars) expect(piece.char).not.toBe(' ');
    }
  });

  it('gives every character a unique, contiguous stagger position', () => {
    const positions = splitToChars(text).map((p) => p.position).sort((a, b) => a - b);
    positions.forEach((position, index) => expect(position).toBe(index));
  });

  it('collapses runs of spaces rather than emitting empty words', () => {
    const spaced = splitToWords('a   b');
    expect(spaced).toHaveLength(2);
    expect(spaced.map((w) => w.chars.map((c) => c.char).join(''))).toEqual(['a', 'b']);
  });

  it('handles an empty string and a lone space without throwing', () => {
    expect(splitToWords('')).toEqual([]);
    expect(splitToWords(' ')).toEqual([]);
  });
});

describe('splitToChars', () => {
  it('flattens the words back to the text with the spaces removed', () => {
    const text = 'Quality, Efficiency and Durability.';
    expect(splitToChars(text).map((p) => p.char).join('')).toBe(text.replace(/ /g, ''));
  });
});
