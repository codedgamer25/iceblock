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

export function Offices() {
  return (
    <section
      id="offices"
      className="theme-frost relative overflow-hidden py-v-space border-b"
      style={{
        borderColor: 'var(--rule)',
        backgroundImage:
          'radial-gradient(100% 65% at 15% 20%, rgba(95, 211, 238, 0.25), transparent 60%), radial-gradient(95% 60% at 85% 75%, rgba(178, 58, 8, 0.08), transparent 62%), linear-gradient(180deg, rgb(245 250 252) 0%, rgb(234 244 249) 52%, rgb(224 237 245) 100%)',
      }}
    >
      {/* Sub-surface pearl & warm-amber light blooms */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div
          className="absolute top-10 right-[10%] w-[420px] h-[360px] rounded-full blur-3xl opacity-70"
          style={{
            background:
              'radial-gradient(circle, rgba(43, 168, 206, 0.24), rgba(195, 216, 230, 0.2) 55%, transparent 74%)',
          }}
        />
        <div
          className="absolute bottom-12 left-[12%] w-[460px] h-[340px] rounded-full blur-3xl opacity-65"
          style={{
            background:
              'radial-gradient(circle, rgba(178, 58, 8, 0.12), rgba(255, 255, 255, 0.5) 55%, transparent 75%)',
          }}
        />
      </div>

      <Reveal className="shell relative z-10">
        <SectionLabel>Where we are</SectionLabel>
        <SplitText
          as="h2"
          className="h2 mt-4 max-w-[26ch]"
          text="Our office addresses."
        />
      </Reveal>

      <Reveal className="shell relative z-10 mt-10 grid gap-gutter sm:grid-cols-2" delay={1}>
        {OFFICES.map((office) => (
          <article
            key={office.label}
            className="card glass"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.62)',
              backgroundImage:
                'linear-gradient(145deg, rgba(255, 255, 255, 0.88) 0%, rgba(242, 247, 250, 0.52) 50%, rgba(195, 216, 230, 0.3) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.92)',
              boxShadow:
                'inset 0 2px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(20, 101, 121, 0.12), 0 18px 38px -12px rgba(7, 24, 34, 0.11)',
            }}
          >
            <h3 className="eyebrow" style={{ color: 'var(--accent)' }}>
              {office.label}
            </h3>
            <p className="lead mt-3" style={{ color: 'var(--text)' }}>
              {office.address}
            </p>
          </article>
        ))}
      </Reveal>

      <Reveal className="shell relative z-10 mt-8">
        <div
          className="glass flex flex-col gap-4 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 sm:flex-row sm:items-center sm:justify-between"
          style={{
            backgroundColor: 'rgba(255, 248, 244, 0.68)',
            backgroundImage:
              'linear-gradient(140deg, rgba(255, 255, 255, 0.88) 0%, rgba(254, 242, 235, 0.58) 52%, rgba(178, 58, 8, 0.08) 100%)',
            border: '1px solid rgba(178, 58, 8, 0.32)',
            boxShadow:
              'inset 0 2px 0 rgba(255, 255, 255, 0.96), 0 16px 36px -12px rgba(178, 58, 8, 0.12)',
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
        <Reveal className="shell relative z-10 mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
