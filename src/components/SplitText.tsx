import type { CSSProperties, ElementType } from 'react';

import { cx } from '@/lib/cx';
import { splitToWords } from '@/lib/split';

/**
 * A heading whose characters arrive one at a time in a scrambled order — the
 * reference site's `[text-split]` treatment, rebuilt on CSS transitions.
 *
 * The reference site's numbers were 400ms per character on a 20ms step. Ours are 300 on
 * 12, and the change is about this site's headings rather than about theirs: the hero here
 * is fifty-four characters, which at 400/20 put the last one finishing at 1460ms. Because
 * the order is shuffled the sentence is not readable until nearly the end, so a reader on
 * a slow connection waited for the page and then waited again for the line that says what
 * the company sells. Same effect, 940ms. The curve is unchanged — GSAP `power2.out`, an
 * ease-out cubic — and it still fires when the element's top reaches 90% of the viewport
 * height. That last one is what the runtime's group observer already does with
 * `rootMargin: 0 0 -10% 0`, so this needs no observer of its own — only a `data-in-view`
 * attribute to be flipped.
 *
 * Characters are grouped into words, and that is not decoration: a character in an
 * inline-block is its own break opportunity, so a purely per-character split lets
 * the browser wrap mid-word. The spaces between words are real text nodes rather
 * than elements, which is what keeps a wrapped line flush left.
 *
 * The text is also present as an `aria-label`, because a heading chopped into forty
 * single-character spans is read out as forty separate things by some screen
 * readers.
 */
export function SplitText({
  as: Tag = 'span',
  text,
  className,
  delay = 0,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  /** Whole-line offset in the same 12ms steps, for sequencing one line after another. */
  delay?: number;
}) {
  const words = splitToWords(text);

  return (
    <Tag
      className={cx('split-text', className)}
      data-in-view="false"
      aria-label={text}
      style={delay > 0 ? ({ '--split-offset': delay } as CSSProperties) : undefined}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex}>
          <span className="split-word" aria-hidden="true">
            {word.chars.map((piece, charIndex) => (
              <span
                key={charIndex}
                className="split-char"
                style={{ '--i': piece.position } as CSSProperties}
              >
                {piece.char}
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
