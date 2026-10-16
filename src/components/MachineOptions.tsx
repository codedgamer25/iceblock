import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import { isContactConfigured } from '@/lib/business';
import { CAPACITY, MACHINE_TYPES, POWER_OPTIONS, PRODUCTION_CYCLES } from '@/lib/machines';
import { enquiryMessage, whatsappLink } from '@/lib/whatsapp';

const GROUPS = [
  { id: 'type', badge: '01 • Architecture', label: 'Two types', choices: MACHINE_TYPES },
  { id: 'power', badge: '02 • Power Systems', label: 'Non solar and full solar', choices: POWER_OPTIONS },
  { id: 'cycle', badge: '03 • Production Cadence', label: 'Three formation categories', choices: PRODUCTION_CYCLES },
];

export function MachineOptions() {
  return (
    <section
      id="ice-block-machines"
      className="theme-sheet relative overflow-hidden py-v-space border-b"
      style={{ borderColor: 'var(--rule)' }}
    >
      {/* Shade 3: Cool Silver-Sky & Marine Sub-Surface Orbs for Liquid Glass Refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div
          className="absolute top-12 right-[-8%] w-[460px] h-[460px] rounded-full blur-3xl opacity-75"
          style={{
            background:
              'radial-gradient(circle, rgba(43, 168, 206, 0.28), rgba(20, 101, 121, 0.12) 55%, transparent 74%)',
          }}
        />
        <div
          className="absolute top-[42%] left-[-10%] w-[520px] h-[520px] rounded-full blur-3xl opacity-70"
          style={{
            background:
              'radial-gradient(circle, rgba(95, 211, 238, 0.3), rgba(195, 216, 230, 0.25) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute bottom-8 right-[15%] w-[420px] h-[360px] rounded-full blur-3xl opacity-65"
          style={{
            background:
              'radial-gradient(circle, rgba(53, 62, 152, 0.14), rgba(43, 168, 206, 0.16) 52%, transparent 74%)',
          }}
        />
      </div>

      <Reveal className="shell relative z-10">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-widest uppercase"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.68)',
            border: '1px solid rgba(255, 255, 255, 0.92)',
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.96), 0 2px 8px rgba(7, 24, 34, 0.06)',
            color: 'var(--accent)',
          }}
        >
          <span>Machine Specification Guide</span>
        </div>
        <SplitText
          as="h2"
          className="h2 mt-4 max-w-[28ch]"
          text="Our ice block machine is of two types, nylon type and mould types."
        />
        <p className="lead mt-4 max-w-[56ch]">
          Prices differ and the full solar is far more expensive than non solar.
        </p>
      </Reveal>

      {GROUPS.map((group, index) => (
        <Reveal key={group.id} className="shell relative z-10 mt-8 sm:mt-10" delay={index}>
          <div
            className="glass spec-group relative overflow-hidden rounded-[24px] sm:rounded-[30px] p-5 sm:p-8"
            style={{
              backgroundColor: 'rgba(242, 247, 250, 0.58)',
              backgroundImage:
                'linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(235, 244, 249, 0.48) 45%, rgba(195, 216, 230, 0.34) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.88)',
              boxShadow:
                'inset 0 1.5px 0 rgba(255, 255, 255, 0.96), inset 0 -1px 0 rgba(20, 101, 121, 0.12), 0 18px 42px -14px rgba(7, 24, 34, 0.12)',
            }}
          >
            <div
              id={`machine-${group.id}`}
              className="spec-head scroll-mt-header flex flex-wrap items-center justify-between gap-2"
            >
              <h3 className="h3">{group.label}</h3>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.72)',
                  border: '1px solid rgba(255, 255, 255, 0.94)',
                  color: 'var(--accent)',
                }}
              >
                {group.badge}
              </span>
            </div>

            {group.choices.map((choice) => (
              <div key={choice.id} className="spec-row">
                <p className="h3">{choice.name}</p>
                <div>
                  <p className="lead" style={{ color: 'var(--text)' }}>
                    {choice.detail}
                  </p>
                  {choice.note && (
                    <p className="body-small mt-2 font-medium" style={{ color: 'var(--accent)' }}>
                      {choice.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      ))}

      <Reveal className="shell relative z-10 mt-8 sm:mt-10">
        <div
          className="glass spec-group relative overflow-hidden rounded-[24px] sm:rounded-[30px] p-5 sm:p-8"
          style={{
            backgroundColor: 'rgba(227, 240, 247, 0.64)',
            backgroundImage:
              'linear-gradient(140deg, rgba(255, 255, 255, 0.86) 0%, rgba(215, 235, 246, 0.54) 50%, rgba(165, 210, 232, 0.36) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.92)',
            boxShadow:
              'inset 0 2px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(20, 101, 121, 0.16), 0 20px 44px -14px rgba(7, 24, 34, 0.14)',
          }}
        >
          <div
            id="machine-capacity"
            className="spec-head scroll-mt-header flex flex-wrap items-center justify-between gap-2"
          >
            <h3 className="h3">All sizes</h3>
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.76)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                color: 'var(--accent)',
              }}
            >
              04 • Daily Output Range
            </span>
          </div>

          <div className="spec-row">
            <p className="figure-value">
              {CAPACITY.from}
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              {CAPACITY.to}
            </p>
            <div>
              <p className="lead" style={{ color: 'var(--text)' }}>
                {CAPACITY.note}
              </p>
              {isContactConfigured() && (
                <a
                  href={whatsappLink(
                    enquiryMessage({
                      product: 'ice block machines',
                      capacity: 'PLEASE FILL IN: how many blocks a day',
                    }),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary mt-6"
                >
                  Call or WhatsApp for prices
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
