'use client';

import { useMemo, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import { WHATSAPP_NUMBER } from '@/lib/business';
import { Glass, type GlassOptics } from '@/lib/samasante-liquid-glass';

type ZoneId = 'chamber' | 'power' | 'cadence' | 'service';
type OpticsPresetId = 'frost' | 'meniscus' | 'prism';

type ThermalZone = {
  id: ZoneId;
  index: string;
  label: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  coords: { x: string; y: string };
  lightOrigin: string;
  specs: ReadonlyArray<{ k: string; v: string }>;
};

const THERMAL_ZONES: ReadonlyArray<ThermalZone> = [
  {
    id: 'chamber',
    index: '01',
    label: 'Brine & Mould Matrix',
    title: 'Permanent mould or nylon formation across 21 to 500+ blocks.',
    summary:
      'Every chamber is fabricated from brand-new commercial steel and insulated for continuous sub-zero brine circulation — built to last up to 30 years on the body.',
    metricLabel: 'Body Lifespan',
    metricValue: '30 Years',
    secondaryLabel: 'Block Capacity',
    secondaryValue: '21 – 500+ Blocks',
    coords: { x: '48%', y: '52%' },
    lightOrigin: '50% 48%',
    specs: [
      { k: 'Formation Options', v: 'Permanent Mould Type or Nylon Type' },
      { k: 'Consumables', v: 'Zero daily nylon cost on Mould Type' },
      { k: 'Structural Rating', v: 'Up to 30-year commercial cabinet body' },
    ],
  },
  {
    id: 'power',
    index: '02',
    label: '24/48V DC Lithium Core',
    title: 'Self-powered DC 24/48V hybrid architecture with lithium storage.',
    summary:
      'Supplied complete with brand-new solar panels (up to 15-year lifespan), rugged lithium battery banks, and energy-saving 48V DC outdoor condensing units.',
    metricLabel: 'Solar Array Life',
    metricValue: '15 Years',
    secondaryLabel: 'DC Architecture',
    secondaryValue: '24V / 48V Hybrid',
    coords: { x: '34%', y: '38%' },
    lightOrigin: '35% 38%',
    specs: [
      { k: 'Battery Chemistry', v: 'Commercial Lithium (rugged, high-cycle, safe)' },
      { k: 'Grid Alternative', v: 'Also available in Solar-Friendly 48V & AC 220–240V' },
      { k: 'Fuel Overhead', v: 'Zero daily diesel or tariff cost on Full Solar' },
    ],
  },
  {
    id: 'cadence',
    index: '03',
    label: 'Thermal Harvest Cadence',
    title: 'Three formation categories engineered around your daily demand.',
    summary:
      'Specify a single 24-hour freeze, a 12-hour twice-daily harvest, or a high-turnover 8-hour thrice-daily cycle across any cabinet size.',
    metricLabel: 'Fastest Harvest',
    metricValue: 'Every 8 Hours',
    secondaryLabel: 'Daily Runs',
    secondaryValue: '1× / 2× / 3× Daily',
    coords: { x: '62%', y: '44%' },
    lightOrigin: '62% 44%',
    specs: [
      { k: 'Category I', v: 'Once daily — full harvest in under 24 hours' },
      { k: 'Category II', v: 'Twice daily — full harvest every 12 hours' },
      { k: 'Category III', v: 'Three times daily — full harvest every 8 hours' },
    ],
  },
  {
    id: 'service',
    index: '04',
    label: 'Commercial Serviceability',
    title: 'Built from scratch — never a converted domestic chest freezer.',
    summary:
      'Every condenser, pump, and electrical component is brand new and market-available across Nigeria, supplied with an operational manual and nationwide delivery.',
    metricLabel: 'Field Experience',
    metricValue: '25+ Years',
    secondaryLabel: 'Parts Availability',
    secondaryValue: '100% Open Market',
    coords: { x: '54%', y: '66%' },
    lightOrigin: '54% 64%',
    specs: [
      { k: 'Assembly Standard', v: '100% brand-new commercial refrigeration parts' },
      { k: 'Maintainability', v: 'Every fault is repairable with standard local parts' },
      { k: 'Documentation', v: 'Complete operational manual + pre-payment inspection' },
    ],
  },
];

const HARVEST_MODES = [
  { id: 'once', label: '24h Cycle', runs: 1, tag: 'Once daily' },
  { id: 'twice', label: '12h Cycle', runs: 2, tag: 'Twice daily' },
  { id: 'thrice', label: '8h Cycle', runs: 3, tag: '3× daily' },
] as const;

/**
 * Optical profiles powered by @samasante/liquid-glass SDF displacement + rim meniscus (`bend`) +
 * directional B-channel specular sheen + 3-pass RGB chromatic dispersion.
 */
const OPTICS_PRESETS: Record<
  OpticsPresetId,
  { label: string; panel: Partial<GlassOptics>; pill: Partial<GlassOptics> }
> = {
  frost: {
    label: 'Sub-Zero Frost',
    panel: {
      strength: 0.065,
      depth: 0.62,
      curvature: 0.38,
      bend: 0.55,
      bendWidth: 0.15,
      dispersion: 0.36,
      frost: 14,
      saturate: 1.32,
      sheen: 0.45,
      sheenWidth: 3,
      sheenFalloff: 1.4,
      sheenAngle: 48,
      glow: 0.16,
      glowSpread: 1,
      glowFalloff: 0.6,
      specular: 1.15,
    },
    pill: {
      strength: 0.08,
      depth: 0.75,
      curvature: 0.48,
      bend: 0.65,
      bendWidth: 0.18,
      dispersion: 0.45,
      frost: 10,
      saturate: 1.4,
      sheen: 0.65,
      sheenAngle: 45,
      glow: 0.22,
      specular: 1.25,
    },
  },
  meniscus: {
    label: 'Liquid Meniscus',
    panel: {
      strength: 0.11,
      depth: 0.85,
      curvature: 0.56,
      bend: 0.78,
      bendWidth: 0.14,
      dispersion: 0.52,
      frost: 7,
      saturate: 1.45,
      sheen: 0.68,
      sheenWidth: 3.5,
      sheenFalloff: 1.3,
      sheenAngle: 42,
      glow: 0.24,
      glowSpread: 1,
      glowFalloff: 0.7,
      specular: 1.28,
    },
    pill: {
      strength: 0.13,
      depth: 0.9,
      curvature: 0.62,
      bend: 0.82,
      bendWidth: 0.16,
      dispersion: 0.6,
      frost: 5,
      saturate: 1.5,
      sheen: 0.8,
      sheenAngle: 42,
      glow: 0.28,
      specular: 1.35,
    },
  },
  prism: {
    label: 'Chromatic Lens',
    panel: {
      strength: 0.14,
      depth: 0.92,
      curvature: 0.64,
      bend: 0.85,
      bendWidth: 0.12,
      dispersion: 0.82,
      frost: 4,
      saturate: 1.55,
      sheen: 0.85,
      sheenWidth: 4,
      sheenFalloff: 1.2,
      sheenAngle: 52,
      glow: 0.3,
      glowSpread: 1,
      glowFalloff: 0.8,
      specular: 1.38,
    },
    pill: {
      strength: 0.16,
      depth: 1,
      curvature: 0.7,
      bend: 0.88,
      bendWidth: 0.14,
      dispersion: 0.9,
      frost: 3,
      saturate: 1.6,
      sheen: 0.95,
      sheenAngle: 52,
      glow: 0.34,
      specular: 1.42,
    },
  },
};

export function ThermalCoreStage() {
  const [activeId, setActiveId] = useState<ZoneId>('chamber');
  const [harvestIdx, setHarvestIdx] = useState<number>(1);
  const [presetId, setPresetId] = useState<OpticsPresetId>('frost');
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const activeZone = THERMAL_ZONES.find((z) => z.id === activeId) ?? THERMAL_ZONES[0];
  const activeHarvest = HARVEST_MODES[harvestIdx];
  const preset = OPTICS_PRESETS[presetId];
  const sampleBatch = 100;
  const dailyOutput = sampleBatch * activeHarvest.runs;

  // Dynamic sheen angle that responds subtly to pointer position across the 16:9 stage
  const dynamicPanelOptics = useMemo<Partial<GlassOptics>>(
    () => ({
      ...preset.panel,
      sheenAngle: Math.round(35 + (pointerPos.x - 50) * 0.45),
    }),
    [preset.panel, pointerPos.x],
  );

  const inquiryText = `Hello Koolink, I inspected the ${activeZone.label} (${activeHarvest.tag} cycle) on your site and would like specifications and pricing.`;

  return (
    <section
      id="thermal-architecture"
      className="theme-deep py-v-space relative overflow-hidden"
      data-invert
    >
      <div className="shell">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow text-[rgb(var(--haze))] tracking-[0.16em] uppercase mb-3">
              Sub-Zero Architecture · 16:9 Liquid Glass Lens
            </p>
            <SplitText
              as="h2"
              className="h2 max-w-[22ch]"
              text="Inside the cold core."
            />
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="lead max-w-[46ch] text-[rgb(var(--glacier))] md:text-right">
              Clean, monochromatic engineering built from brand-new 24/48V DC units, lithium storage,
              and permanent mould chambers. Refracted in real time with Liquid Glass SDF optics.
            </p>
            {/* Interactive @samasante/liquid-glass Optics Mode Selector */}
            <div
              className="inline-flex items-center gap-1 rounded-full p-1 border border-[rgba(242,247,250,0.12)] bg-[rgba(4,16,23,0.55)]"
              role="group"
              aria-label="Liquid Glass optics mode"
            >
              {(Object.keys(OPTICS_PRESETS) as OpticsPresetId[]).map((key) => {
                const isSelected = key === presetId;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPresetId(key)}
                    aria-pressed={isSelected}
                    className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
                      isSelected
                        ? 'bg-[rgba(95,211,238,0.22)] text-[rgb(var(--frost))] border border-[rgba(95,211,238,0.45)]'
                        : 'text-[rgb(var(--haze))] hover:text-[rgb(var(--frost))]'
                    }`}
                  >
                    {OPTICS_PRESETS[key].label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* 16:9 Minimalist Liquid-Glass Workspace Stage */}
        <Reveal delay={1}>
          <div
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setPointerPos({ x, y });
            }}
            className="relative w-full lg:aspect-[16/9] rounded-[var(--radius-panel)] overflow-hidden border border-[rgba(242,247,250,0.12)] bg-[#041017] shadow-[0_24px_60px_rgba(4,16,23,0.55),inset_0_1px_0_rgba(242,247,250,0.14)]"
          >
            {/* High-Resolution 16:9 Blender Architectural Backdrop */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img
                src="/images/koolink-thermal-core-16x9.png"
                alt="Koolink 16:9 monochromatic frosted-ice and stainless brine chamber render"
                className="w-full h-full object-cover object-center opacity-80 transition-transform duration-700 ease-out"
                style={{
                  transform: `scale(1.04) translate3d(${(pointerPos.x - 50) * -0.09}%, ${(pointerPos.y - 50) * -0.09}%, 0)`,
                }}
              />
              {/* Soft Monochromatic Vignette & Subtle Cyan Depth Wash */}
              <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                  background: `
                    radial-gradient(circle at ${activeZone.lightOrigin}, rgba(95, 211, 238, 0.18) 0%, rgba(43, 168, 206, 0.06) 38%, rgba(4, 16, 23, 0.72) 80%),
                    linear-gradient(90deg, rgba(4, 16, 23, 0.78) 0%, rgba(4, 16, 23, 0.22) 50%, rgba(4, 16, 23, 0.80) 100%)
                  `,
                }}
              />
            </div>

            {/* Subtle Architectural Corner Framing Marks */}
            <span
              aria-hidden="true"
              className="hidden lg:block absolute top-4 left-4 w-3 h-3 border-t border-l border-[rgba(242,247,250,0.28)] pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="hidden lg:block absolute top-4 right-4 w-3 h-3 border-t border-r border-[rgba(242,247,250,0.28)] pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="hidden lg:block absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[rgba(242,247,250,0.28)] pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="hidden lg:block absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[rgba(242,247,250,0.28)] pointer-events-none"
            />

            {/* Balanced 3-Column Spatial Grid Inside the 16:9 Stage */}
            <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 sm:p-7 lg:p-8 items-stretch">
              {/* Left Column: @samasante/liquid-glass System Layer Selector & Cadence (4 Columns) */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                <Glass
                  optics={dynamicPanelOptics}
                  className="w-full rounded-[var(--radius-card)] p-4 sm:p-5"
                  style={{
                    display: 'block',
                    background: 'rgba(7, 24, 34, 0.44)',
                  }}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(242,247,250,0.10)]">
                    <span className="text-xs font-mono uppercase tracking-[0.14em] text-[rgb(var(--haze))]">
                      System Layers
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[rgb(var(--chill))]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--chill))]" />
                      48V DC / AC
                    </span>
                  </div>

                  <div className="flex flex-col gap-2" role="tablist" aria-label="Engineering zones">
                    {THERMAL_ZONES.map((zone) => {
                      const selected = zone.id === activeId;
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => setActiveId(zone.id)}
                          className={`group w-full text-left rounded-[var(--radius-base)] px-3.5 py-3 transition-all duration-300 border ${
                            selected
                              ? 'bg-[rgba(242,247,250,0.14)] border-[rgba(95,211,238,0.45)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                              : 'bg-[rgba(4,16,23,0.32)] border-[rgba(242,247,250,0.07)] hover:bg-[rgba(242,247,250,0.08)] hover:border-[rgba(242,247,250,0.18)]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`text-xs font-mono tracking-wider ${
                                  selected ? 'text-[rgb(var(--chill))]' : 'text-[rgb(var(--haze))]'
                                }`}
                              >
                                {zone.index}
                              </span>
                              <span className="text-sm font-medium text-[rgb(var(--frost))]">
                                {zone.label}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-mono transition-transform duration-300 ${
                                selected
                                  ? 'text-[rgb(var(--chill))] translate-x-0.5'
                                  : 'text-[rgb(var(--haze))] opacity-60'
                              }`}
                            >
                              {zone.metricValue}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Glass>

                {/* @samasante/liquid-glass Harvest Cadence Mini-Simulator */}
                <Glass
                  optics={dynamicPanelOptics}
                  className="w-full rounded-[var(--radius-card)] p-4 sm:p-5"
                  style={{
                    display: 'block',
                    background: 'rgba(7, 24, 34, 0.44)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono uppercase tracking-[0.14em] text-[rgb(var(--haze))]">
                      Formation Cadence
                    </span>
                    <span className="text-xs font-mono text-[rgb(var(--frost))]">
                      100-Block Ref: <strong className="text-[rgb(var(--chill))]">{dailyOutput} blocks/day</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {HARVEST_MODES.map((m, idx) => {
                      const active = idx === harvestIdx;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setHarvestIdx(idx);
                            setActiveId('cadence');
                          }}
                          className={`rounded-[var(--radius-tile)] py-2 px-2 text-center transition-all border text-xs font-mono ${
                            active
                              ? 'bg-[rgba(95,211,238,0.18)] border-[rgba(95,211,238,0.5)] text-[rgb(var(--frost))]'
                              : 'bg-[rgba(4,16,23,0.38)] border-[rgba(242,247,250,0.08)] text-[rgb(var(--haze))] hover:text-[rgb(var(--frost))]'
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </Glass>
              </div>

              {/* Center Column: Breathable 16:9 Architectural Core Viewport + Liquid Glass Lenses (3 Columns) */}
              <div className="lg:col-span-3 relative min-h-[200px] lg:min-h-0 flex items-end justify-center">
                {/* Interactive Spatial Nodes Mapped onto the Blender Chamber */}
                <div className="hidden lg:block absolute inset-0">
                  {THERMAL_ZONES.map((z) => {
                    const isSelected = z.id === activeId;
                    return (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => setActiveId(z.id)}
                        style={{ left: z.coords.x, top: z.coords.y }}
                        aria-label={`Inspect ${z.label}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                      >
                        <Glass
                          optics={preset.pill}
                          radius={999}
                          className={`flex items-center justify-center w-9 h-9 rounded-full transition-transform duration-300 ${
                            isSelected
                              ? 'scale-110 shadow-[0_0_22px_rgba(95,211,238,0.5)]'
                              : 'hover:scale-105'
                          }`}
                          style={{
                            display: 'flex',
                            background: isSelected
                              ? 'rgba(95, 211, 238, 0.24)'
                              : 'rgba(7, 24, 34, 0.45)',
                          }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-[rgb(var(--frost))]' : 'bg-[rgb(var(--haze))]'
                            }`}
                          />
                        </Glass>
                      </button>
                    );
                  })}
                </div>

                {/* Floating Center Status Pill using @samasante/liquid-glass */}
                <Glass
                  optics={preset.pill}
                  radius={999}
                  className="w-full rounded-full px-4 py-2.5 flex items-center justify-between text-xs font-mono text-[rgb(var(--glacier))]"
                  style={{
                    display: 'flex',
                    background: 'rgba(7, 24, 34, 0.48)',
                  }}
                >
                  <span>CORE STATE</span>
                  <span className="text-[rgb(var(--frost))]">
                    {activeZone.index} / {activeZone.label.toUpperCase()}
                  </span>
                </Glass>
              </div>

              {/* Right Column: @samasante/liquid-glass Telemetry & Specification Card (5 Columns) */}
              <Glass
                optics={dynamicPanelOptics}
                className="lg:col-span-5 flex flex-col justify-between rounded-[var(--radius-card)] p-5 sm:p-6 shadow-[0_20px_48px_rgba(4,16,23,0.45)]"
                style={{
                  display: 'flex',
                  background: 'rgba(7, 24, 34, 0.48)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[rgb(var(--chill))] mb-3">
                    <span>Layer {activeZone.index} Telemetry</span>
                    <span>Liquid Glass · { preset.label }</span>
                  </div>

                  <h3 className="h3 text-[rgb(var(--frost))] leading-snug mb-3">
                    {activeZone.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[rgb(var(--glacier))] leading-relaxed mb-5">
                    {activeZone.summary}
                  </p>

                  {/* Dual Frosted Metric Tiles */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="rounded-[var(--radius-base)] bg-[rgba(242,247,250,0.06)] border border-[rgba(242,247,250,0.10)] px-3.5 py-3">
                      <span className="block text-[11px] font-mono uppercase tracking-wider text-[rgb(var(--haze))]">
                        {activeZone.metricLabel}
                      </span>
                      <span className="mt-1 block text-lg sm:text-xl font-semibold text-[rgb(var(--frost))]">
                        {activeZone.metricValue}
                      </span>
                    </div>
                    <div className="rounded-[var(--radius-base)] bg-[rgba(242,247,250,0.06)] border border-[rgba(242,247,250,0.10)] px-3.5 py-3">
                      <span className="block text-[11px] font-mono uppercase tracking-wider text-[rgb(var(--haze))]">
                        {activeZone.secondaryLabel}
                      </span>
                      <span className="mt-1 block text-lg sm:text-xl font-semibold text-[rgb(var(--frost))]">
                        {activeZone.secondaryValue}
                      </span>
                    </div>
                  </div>

                  {/* Clean Monochromatic Specification Rows */}
                  <dl className="divide-y divide-[rgba(242,247,250,0.08)] border-y border-[rgba(242,247,250,0.08)]">
                    {activeZone.specs.map((row) => (
                      <div key={row.k} className="py-2.5 flex items-baseline justify-between gap-4 text-xs sm:text-sm">
                        <dt className="font-mono text-[rgb(var(--haze))] shrink-0">{row.k}</dt>
                        <dd className="text-right text-[rgb(var(--frost))]">{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-5 pt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-mono text-[rgb(var(--haze))]">
                    Inspect in person in Ogun, Lagos, Abuja &amp; PH
                  </span>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(inquiryText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--frost))] text-[rgb(var(--deep))] px-4 py-2 text-xs sm:text-sm font-medium transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <span>Request {activeZone.label} Spec</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </Glass>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
