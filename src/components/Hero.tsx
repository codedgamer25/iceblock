import { Reveal } from '@/components/Reveal';
import { KoolinkHeaderBanner } from '@/components/KoolinkHeaderBanner';
import { BUSINESS, PAYMENT_ADVICE, PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import { telLink, whatsappLink } from '@/lib/whatsapp';

export function Hero() {
  return (
    <section className="theme-frost relative overflow-hidden pb-v-space pt-[calc(var(--header-height)+var(--v-space-sm))] border-b" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell flex flex-col items-center gap-8">
        {/* Exact Vector Header Banner */}
        <Reveal className="w-full max-w-[1080px] bg-white rounded-card p-4 sm:p-7 shadow-sm border" style={{ borderColor: 'var(--rule)' }}>
          <KoolinkHeaderBanner />
        </Reveal>

        {/* Koolink Official Flyer Showcase */}
        <Reveal className="w-full max-w-[1080px] overflow-hidden rounded-card shadow-xl border bg-white" style={{ borderColor: 'var(--rule)' }} delay={1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/koolink-flyer.jpg"
            alt="Koolink Nigeria Limited - Commercial Refrigeration, Ice Block Machines, Walk-in Coldrooms and Solar Systems"
            className="w-full h-auto object-contain block"
            loading="eager"
            fetchPriority="high"
          />
        </Reveal>

        {/* Conversion Action Bar & Trust Notes */}
        <Reveal className="w-full max-w-[1080px] flex flex-col sm:flex-row items-center justify-between gap-4 mt-2" delay={2}>
          <div
            className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
            data-hero-cta
          >
            {isContactConfigured() ? (
              <>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary"
                >
                  Book now on WhatsApp
                </a>
                <a href={telLink()} className="button secondary numeral">
                  Call {PHONE_DISPLAY}
                </a>
              </>
            ) : (
              <p className="body-small text-subtle">
                The numbers in business.ts are not valid Nigerian mobiles.
              </p>
            )}
          </div>

          <div className="text-right sm:max-w-[44ch]">
            <p className="body-small font-semibold" style={{ color: 'var(--accent)' }}>
              {PAYMENT_ADVICE}
            </p>
            <p className="body-small text-subtle mt-0.5">
              {BUSINESS.deliveryNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;
