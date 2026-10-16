import { Reveal } from '@/components/Reveal';
import { SectionLabel } from '@/components/SectionLabel';
import { SplitText } from '@/components/SplitText';
import {
  BUSINESS,
  OFFICES,
  PAYMENT_ADVICE,
  PHONE_ALT_DISPLAY,
  PHONE_DISPLAY,
  isContactConfigured,
} from '@/lib/business';
import { telLink, whatsappLink } from '@/lib/whatsapp';

/**
 * Four offices, nationwide delivery, and the line about visiting before you pay.
 *
 * That last one is Koolink's own standing advice and it is the most trust-building
 * sentence they have — a business inviting you to come and look at the machine
 * before money moves is saying something no testimonial can. It gets the warm
 * accent, the only warm thing in the palette.
 */
export function Offices() {
  return (
    <section id="offices" className="theme-frost py-v-space">
      <Reveal className="shell">
        <SectionLabel>Where we are</SectionLabel>
        <SplitText
          as="h2"
          className="h2 mt-4 max-w-[26ch]"
          text="Our office addresses."
        />
      </Reveal>

      <Reveal className="shell mt-12 grid gap-gutter sm:grid-cols-2" delay={1}>
        {OFFICES.map((office) => (
          <article key={office.label} className="card">
            <h3 className="eyebrow" style={{ color: 'var(--accent)' }}>
              {office.label}
            </h3>
            <p className="lead mt-3" style={{ color: 'var(--text)' }}>
              {office.address}
            </p>
          </article>
        ))}
      </Reveal>

      <Reveal className="shell mt-10">
        <div
          className="glass-surface flex flex-col gap-4 rounded-card border p-[calc(var(--gutter)*1.5)] sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: 'rgb(var(--ember) / 0.35)',
            backgroundColor: 'rgb(255 255 255 / 0.48)',
          }}
        >
          <div>
            <p className="eyebrow" style={{ color: 'rgb(var(--ember))' }}>
              Before you pay
            </p>
            <p className="h3 mt-2 max-w-[30ch]">{PAYMENT_ADVICE}</p>
          </div>
          <p className="body-small max-w-[30ch] text-subtle">{BUSINESS.deliveryNote}</p>
        </div>
      </Reveal>

      {isContactConfigured() && (
        <Reveal className="shell mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="button primary"
          >
            Message us on WhatsApp
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
        </Reveal>
      )}
    </section>
  );
}
