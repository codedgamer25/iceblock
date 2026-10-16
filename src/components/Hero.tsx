import { Reveal } from '@/components/Reveal';
import { BUSINESS, PAYMENT_ADVICE, PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import { telLink, whatsappLink } from '@/lib/whatsapp';

export function Hero() {
  return (
    <section
      className="theme-frost relative overflow-hidden pb-v-space pt-[calc(var(--header-height)+12px)] sm:pt-[calc(var(--header-height)+var(--v-space-sm))] border-b"
      style={{ borderColor: 'var(--rule)' }}
    >
      <div className="shell flex flex-col items-center gap-5 sm:gap-8">
        {/* Seamless Hero Lockup with Official Emblem & Production Photo Capsules */}
        <Reveal className="w-full sm:max-w-[1020px] flex justify-center">
          {/* Mobile-optimized enlarged 6x3 banner (< 640px) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/koolink-hero-banner-mobile.png"
            alt="Koolink Nigeria Limited (RC 950910) - Commercial Refrigeration, Ice Block Machines, Coldrooms and Solar Systems"
            width={960}
            height={845}
            className="block sm:hidden w-full h-auto object-contain select-none pointer-events-none"
            loading="eager"
            fetchPriority="high"
          />

          {/* Desktop / Tablet panoramic 9x2 banner (>= 640px) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/koolink-hero-banner.png"
            alt="Koolink Nigeria Limited (RC 950910) - Commercial Refrigeration, Ice Block Machines, Coldrooms and Solar Systems"
            width={875}
            height={493}
            className="hidden sm:block w-full h-auto object-contain select-none pointer-events-none"
            loading="eager"
            fetchPriority="high"
          />
        </Reveal>

        {/* Conversion Action Bar & Trust Notes */}
        <Reveal
          className="w-full sm:max-w-[1020px] flex flex-col sm:flex-row items-center justify-between gap-4 mt-1 sm:mt-2"
          delay={1}
        >
          <div
            className="flex w-full flex-col items-stretch gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-3"
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

          <div className="text-center sm:text-right sm:max-w-[44ch]">
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
