import { Reveal } from '@/components/Reveal';
import { BUSINESS } from '@/lib/business';
import { SplitText } from '@/components/SplitText';
import { DURABILITY } from '@/lib/machines';

export function WhyKoolink() {
  return (
    <section
      id="why-us"
      className="theme-deep relative overflow-hidden py-v-space border-b"
      style={{ borderColor: 'var(--rule)' }}
      data-invert
    >
      {/* Shade 5: Dark Cryo-Sapphire & Bioluminescent Cyan Liquid Glass Blooms */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div
          className="absolute -top-24 left-[12%] w-[520px] h-[440px] rounded-full blur-3xl opacity-75"
          style={{
            background:
              'radial-gradient(circle, rgba(43, 168, 206, 0.34), rgba(20, 101, 121, 0.16) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute top-[35%] right-[-8%] w-[480px] h-[480px] rounded-full blur-3xl opacity-70"
          style={{
            background:
              'radial-gradient(circle, rgba(107, 49, 139, 0.28), rgba(53, 62, 152, 0.16) 52%, transparent 74%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[30%] w-[540px] h-[360px] rounded-full blur-3xl opacity-65"
          style={{
            background:
              'radial-gradient(circle, rgba(95, 211, 238, 0.22), transparent 72%)',
          }}
        />
      </div>

      <Reveal className="shell relative z-10">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-widest uppercase mb-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(95, 211, 238, 0.32)',
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 14px rgba(0, 0, 0, 0.28)',
            color: 'var(--accent)',
          }}
        >
          <span>Engineered to Outlast</span>
        </div>
        <SplitText as="h2" className="h2 max-w-[24ch]" text={BUSINESS.motto} />
        <p className="lead mt-5 max-w-[58ch]">
          It is better to use high-quality, efficient, durable materials and products than to do
          otherwise in the name of affordability.
        </p>
      </Reveal>

      <Reveal className="shell relative z-10 mt-10 sm:mt-12" delay={1}>
        <div
          className="glass spec-group relative overflow-hidden rounded-[26px] sm:rounded-[34px] p-5 sm:p-9"
          style={{
            backgroundColor: 'rgba(12, 38, 54, 0.56)',
            backgroundImage:
              'linear-gradient(145deg, rgba(255, 255, 255, 0.14) 0%, rgba(20, 101, 121, 0.16) 45%, rgba(7, 24, 34, 0.62) 100%)',
            border: '1px solid rgba(159, 188, 204, 0.28)',
            boxShadow:
              'inset 0 1.5px 0 rgba(255, 255, 255, 0.34), inset 0 -1px 0 rgba(95, 211, 238, 0.16), 0 24px 56px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Top specular cyan-white crest */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(95, 211, 238, 0.75) 30%, rgba(255, 255, 255, 0.9) 50%, rgba(95, 211, 238, 0.75) 70%, transparent)',
            }}
          />

          {DURABILITY.map((item) => (
            <div key={item.heading} className="spec-row">
              <h3 className="h3 max-w-[18ch]">{item.heading}</h3>
              <p className="lead max-w-[54ch]">{item.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
