import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import { BUSINESS, OFFICES } from '@/lib/business';
import { CAPACITY } from '@/lib/machines';

const FIGURES: ReadonlyArray<{ value: string; unit: string; label: string }> = [
  {
    value: String(BUSINESS.yearsExperience),
    unit: 'years',
    label: 'We know the challenges and exactly what the user needs.',
  },
  {
    value: `${CAPACITY.to}+`,
    unit: 'blocks a day',
    label: `Various capacities and sizes, ranging from ${CAPACITY.from} blocks to over ${CAPACITY.to} blocks.`,
  },
  {
    value: '30',
    unit: 'years',
    label: 'The body has a lifespan of over 30 years. The solar system can be up to 15 years or more if well maintained.',
  },
  {
    value: String(OFFICES.length),
    unit: 'offices',
    label: 'Head office and factory in Ogun State, with offices in Lagos, Abuja and Port Harcourt.',
  },
];

export function Numbers() {
  return (
    <section
      id="numbers"
      className="theme-glacier relative overflow-hidden py-v-space border-b"
      style={{ borderColor: 'var(--rule)' }}
    >
      {/* Shade 4: Deep Glacial Ice-Blue & Cyan Liquid Glass Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div
          className="absolute -top-20 left-[8%] w-[480px] h-[480px] rounded-full blur-3xl opacity-80"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.75), rgba(95, 211, 238, 0.34) 52%, transparent 74%)',
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[6%] w-[520px] h-[440px] rounded-full blur-3xl opacity-75"
          style={{
            background:
              'radial-gradient(circle, rgba(43, 168, 206, 0.36), rgba(20, 101, 121, 0.18) 54%, transparent 76%)',
          }}
        />
      </div>

      <div className="shell relative z-10 grid gap-x-gutter gap-y-8 lg:grid-cols-12 items-start">
        <Reveal className="lg:col-span-4">
          <div
            className="glass relative overflow-hidden rounded-[26px] sm:rounded-[32px] p-6 sm:p-8"
            style={{
              backgroundColor: 'rgba(235, 245, 251, 0.56)',
              backgroundImage:
                'linear-gradient(150deg, rgba(255, 255, 255, 0.84) 0%, rgba(215, 234, 246, 0.45) 55%, rgba(175, 208, 228, 0.35) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow:
                'inset 0 2px 0 rgba(255, 255, 255, 0.96), inset 0 -1px 0 rgba(20, 101, 121, 0.16), 0 20px 44px -14px rgba(7, 24, 34, 0.15)',
            }}
          >
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.74)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                color: 'var(--accent)',
              }}
            >
              Proven Scale
            </span>
            <SplitText
              as="h2"
              className="h-display mt-4 max-w-[12ch]"
              text="21 to over 500 blocks."
            />
          </div>
        </Reveal>

        <div
          className="glass lg:col-span-8 relative overflow-hidden rounded-[26px] sm:rounded-[32px] p-5 sm:p-8"
          style={{
            backgroundColor: 'rgba(240, 248, 252, 0.62)',
            backgroundImage:
              'linear-gradient(145deg, rgba(255, 255, 255, 0.86) 0%, rgba(220, 238, 248, 0.52) 50%, rgba(182, 212, 230, 0.36) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow:
              'inset 0 2px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(20, 101, 121, 0.15), 0 22px 48px -14px rgba(7, 24, 34, 0.16)',
          }}
        >
          {FIGURES.map((figure, index) => (
            <Reveal key={figure.unit + figure.value} className="figure-row" delay={index}>
              <p className="figure-value">
                {figure.value}
                <span className="eyebrow ml-3 align-super" style={{ color: 'var(--accent)' }}>
                  {figure.unit}
                </span>
              </p>
              <p className="lead max-w-[42ch]">{figure.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
