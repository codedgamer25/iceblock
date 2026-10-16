import { Reveal } from '@/components/Reveal';
import { BUSINESS, PAYMENT_ADVICE, PHONE_DISPLAY, isContactConfigured } from '@/lib/business';
import { telLink, whatsappLink } from '@/lib/whatsapp';

const HERO_PILLS = [
  { label: 'Nylon-Type Ice Machines', href: '#products' },
  { label: 'Mould-Type Ice Machines', href: '#products' },
  { label: 'Walk-In Coldrooms', href: '#products' },
  { label: 'Full Solar DC 24V/48V', href: '#products' },
] as const;

export function Hero() {
  return (
    <section
      className="theme-frost relative overflow-hidden pb-v-space pt-[calc(var(--header-height)+12px)] sm:pt-[calc(var(--header-height)+var(--v-space-sm))] border-b"
      style={{ borderColor: 'var(--rule)' }}
    >
      {/* Sub-surface glacial & prism light blooms for Liquid Glass refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[92vw] max-w-[980px] h-[360px] rounded-full blur-3xl opacity-75"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(95, 211, 238, 0.34), rgba(43, 168, 206, 0.16) 48%, transparent 76%)',
          }}
        />
        <div
          className="absolute top-[22%] -left-16 w-[320px] h-[320px] rounded-full blur-3xl opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(0, 150, 71, 0.14), transparent 70%)',
          }}
        />
        <div
          className="absolute top-[18%] -right-16 w-[360px] h-[360px] rounded-full blur-3xl opacity-65"
          style={{
            background: 'radial-gradient(circle, rgba(107, 49, 139, 0.15), rgba(53, 62, 152, 0.1) 50%, transparent 72%)',
          }}
        />
      </div>

      <div className="shell relative z-10 flex flex-col items-center gap-4 sm:gap-6">
        {/* Main Sculpted Liquid Glass Hero Vessel */}
        <Reveal className="w-[calc(100vw-14px)] max-w-none -mx-[var(--margin)] sm:mx-0 sm:w-full sm:max-w-[1080px]">
          <div
            className="glass relative overflow-hidden rounded-[26px] sm:rounded-[34px] p-2.5 sm:p-5 md:p-6"
            style={{
              backgroundColor: 'rgba(242, 247, 250, 0.62)',
              backgroundImage:
                'linear-gradient(145deg, rgba(255, 255, 255, 0.78) 0%, rgba(242, 247, 250, 0.42) 38%, rgba(195, 216, 230, 0.28) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.88)',
              boxShadow:
                'inset 0 2px 1px rgba(255, 255, 255, 0.96), inset 0 -1.5px 2px rgba(20, 101, 121, 0.14), inset 0 0 0 1px rgba(255, 255, 255, 0.68), 0 22px 50px -14px rgba(7, 24, 34, 0.15), 0 4px 16px rgba(43, 168, 206, 0.1)',
            }}
          >
            {/* Top specular liquid-glass crest line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-[2px]"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.98) 25%, #ffffff 50%, rgba(255, 255, 255, 0.98) 75%, transparent)',
              }}
            />

            {/* Diagonal optical glass reflection sweep */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-10 -top-24 h-44 rotate-[-4deg]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.08) 65%, transparent 100%)',
              }}
            />

            {/* Top Liquid Glass Status Strip */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-2.5 sm:pb-3.5 px-1 sm:px-2">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold tracking-wider uppercase"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.68)',
                  border: '1px solid rgba(255, 255, 255, 0.92)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 2px 8px rgba(7, 24, 34, 0.06)',
                  color: 'rgb(var(--deep))',
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: '#009647',
                    boxShadow: '0 0 8px rgba(0, 150, 71, 0.7)',
                  }}
                />
                <span>RC 950910 • Verified Nigerian Manufacturer</span>
              </div>

              <div
                className="hidden sm:inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.62)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 2px 8px rgba(7, 24, 34, 0.05)',
                  color: 'var(--accent)',
                }}
              >
                <span>25+ Years Engineering • Nationwide Delivery</span>
              </div>
            </div>

            {/* Inner Recessed Glass Lens Stage holding the Banner */}
            <div
              className="relative z-10 rounded-[18px] sm:rounded-[24px] p-1.5 sm:p-3 overflow-hidden"
              style={{
                backgroundColor: 'rgba(242, 247, 250, 0.78)',
                border: '1px solid rgba(255, 255, 255, 0.85)',
                boxShadow:
                  'inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 0 24px rgba(195, 216, 230, 0.32), 0 4px 14px rgba(7, 24, 34, 0.05)',
              }}
            >
              {/* Mobile Enlarged Portrait/Square Banner (< 640px) — Big Emblem, Big Wordmark & 6x3 Capsules */}
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

              {/* Desktop / Tablet Panoramic Banner (>= 640px) */}
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
            </div>

            {/* Bottom Liquid Glass Category Pills */}
            <div className="relative z-10 mt-2.5 sm:mt-3.5 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-1">
              {HERO_PILLS.map((pill) => (
                <a
                  key={pill.label}
                  href={pill.href}
                  className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-transform active:scale-95"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.66)',
                    border: '1px solid rgba(255, 255, 255, 0.92)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255, 255, 255, 0.98), 0 2px 6px rgba(7, 24, 34, 0.06)',
                    color: 'rgb(var(--deep))',
                  }}
                >
                  {pill.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Sculpted Liquid Glass Conversion Action Dock & Trust Notes */}
        <Reveal
          className="w-[calc(100vw-14px)] max-w-none -mx-[var(--margin)] sm:mx-0 sm:w-full sm:max-w-[1080px]"
          delay={1}
        >
          <div
            className="glass relative overflow-hidden rounded-[24px] sm:rounded-full px-4 py-4 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              backgroundColor: 'rgba(242, 247, 250, 0.68)',
              backgroundImage:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(242, 247, 250, 0.48) 50%, rgba(195, 216, 230, 0.3) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow:
                'inset 0 1.5px 0 rgba(255, 255, 255, 0.96), inset 0 -1px 0 rgba(20, 101, 121, 0.12), 0 14px 34px -10px rgba(7, 24, 34, 0.12)',
            }}
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

            <div className="text-center sm:text-right sm:max-w-[44ch] px-1">
              <p className="body-small font-semibold" style={{ color: 'var(--accent)' }}>
                {PAYMENT_ADVICE}
              </p>
              <p className="body-small text-subtle mt-0.5">
                {BUSINESS.deliveryNote}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;
