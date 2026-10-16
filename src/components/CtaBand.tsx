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
        scrim={1.52}
      />

      <div className="shell relative z-10">
        <div
          className="glass relative overflow-hidden rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 md:p-12 flex flex-col items-start gap-7"
          style={{
            backgroundColor: 'rgba(7, 24, 34, 0.52)',
            backgroundImage:
              'linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(43, 168, 206, 0.14) 45%, rgba(4, 16, 23, 0.64) 100%)',
            border: '1px solid rgba(159, 188, 204, 0.3)',
            boxShadow:
              'inset 0 1.5px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 0 rgba(95, 211, 238, 0.18), 0 28px 64px -14px rgba(0, 0, 0, 0.55)',
          }}
        >
          <SplitText
            as="h2"
            className="h-display max-w-[20ch]"
            text="Can we know precisely which product you want?"
          />
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
      </div>
    </section>
  );
}
