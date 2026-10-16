import { Reveal } from '@/components/Reveal';
import { BUSINESS, PAYMENT_ADVICE, PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import { telLink, whatsappLink } from '@/lib/whatsapp';

export function Hero() {
  return (
    <section className="theme-frost relative overflow-hidden pb-v-space pt-[calc(var(--header-height)+18px)] sm:pt-[calc(var(--header-height)+var(--v-space-sm))] border-b" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell flex flex-col items-center gap-6 sm:gap-8">
        {/* Seamless Hero Lockup with Official Emblem & Production Photo Capsules */}
        <Reveal className="w-[calc(100vw-16px)] max-w-none -mx-[var(--margin)] sm:mx-0 sm:w-full sm:max-w-[1020px] flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/koolink-hero-banner.png"
            alt="Koolink Nigeria Limited (RC 950910) - Commercial Refrigeration, Ice Block Machines, Coldrooms and Solar Systems"
            className="w-full h-auto object-contain block select-none pointer-events-none"
            loading="eager"
            fetchPriority="high"
          />
        </Reveal>

        {/* Conversion Action Bar & Trust Notes */}
        <Reveal className="w-[calc(100vw-32px)] max-w-none -mx-[var(--margin)] sm:mx-0 sm:w-full sm:max-w-[1080px] flex flex-col sm:flex-row items-center justify-between gap-4 mt-1 sm:mt-2" delay={1}>
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
