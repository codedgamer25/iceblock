import type { ReactNode } from 'react';

/**
 * A small label above a section heading: `What we build`.
 *
 * It used to carry a hairline in front of the words. That line is gone — the client asked
 * for it removed from the Book now actions and from anywhere else it appeared, and this was
 * the other place. Nothing about the label depended on it: the rule was `aria-hidden`, so it
 * never reached a screen reader in the first place, and the words are what tell a reader
 * which part of the document they are in.
 */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label eyebrow">{children}</p>;
}
