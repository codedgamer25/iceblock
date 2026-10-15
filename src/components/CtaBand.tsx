import { SectionBackground } from '@/components/SectionBackground';
import { SplitText } from '@/components/SplitText';
import {
  BUSINESS,
  PHONE_ALT_DISPLAY,
  PHONE_DISPLAY,
  isContactConfigured,
} from '@/lib/business';
import { telLink, whatsappLink } from '@/lib/whatsapp';

export function CtaBand() {
  return (
    <section className="theme-abyss relative overflow-hidden py-v-space" data-invert>
      <SectionBackground
        name="cta"
        alt="Cold water streaming off a block of ice as it sinks."
        /* Measured, not carried over from the hero. Sampling the copy region of
           cta-wide and compositing the scrim per channel, the brightest 5% of that
           region lands at 0.21 relative luminance at the old 1.05 — frost display type
           at 3.74:1 and this paragraph at 2.02:1, both under AA. 1.52 puts them at
           5.60:1 and 3.03:1. The hero needs none of this: its own copy region measures
           0.04 at p95, which is why 1 was right there and wrong here. */
        scrim={1.52}
      />

      <div className="shell flex flex-col items-start gap-7">
        <SplitText
          as="h2"
          className="h-display max-w-[20ch]"
          text="Can we know precisely which product you want?"
        />
        {/* Full-strength ink, not the muted tone. Two reasons and they agree: haze at 22px
            regular needs 4.5:1, not the 3:1 that only applies from 24px, and even at the
            heavier scrim it reaches 3.03:1 over the bright fifth of this photograph. And
            it should not have been muted anyway — this is the last sentence anyone reads
            before deciding, which makes it the worst paragraph on the page to whisper.
            Frost measures 5.60:1 in the same place. */}
        <p className="lead max-w-[52ch]" style={{ color: 'var(--text)' }}>
          We don&apos;t disclose or discuss prices online. Call or WhatsApp for more details
          including prices. You can also visit or send someone to our office before making any
          payment.
        </p>

        {isContactConfigured() ? (
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
            >
              Book now on WhatsApp
            </a>
            <a href={telLink()} className="button secondary numeral" aria-label={`Call ${PHONE_DISPLAY}`}>
              {PHONE_DISPLAY}
            </a>
            <a
              href={telLink(true)}
              className="button secondary numeral"
              aria-label={`Call ${PHONE_ALT_DISPLAY}`}
            >
              {PHONE_ALT_DISPLAY}
            </a>
          </div>
        ) : (
          <p className="body-small text-subtle">
            The numbers in <code>src/lib/business.ts</code> are not valid Nigerian mobiles, so the
            buttons are held back rather than dialling nobody.
          </p>
        )}
      </div>
    </section>
  );
}
