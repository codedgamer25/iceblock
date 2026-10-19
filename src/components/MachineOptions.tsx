'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SplitText } from '@/components/SplitText';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/animate-drawer';
import { isContactConfigured } from '@/lib/business';
import { cx } from '@/lib/cx';
import {
  CAPACITY,
  MACHINE_TYPES,
  POWER_OPTIONS,
  PRODUCTION_CYCLES,
} from '@/lib/machines';
import { whatsappLink } from '@/lib/whatsapp';

/* Their own words for each group. The leads that used to sit under these headings were
   mine and said nothing the rows below did not already say. */
const GROUPS = [
  { id: 'type', label: 'Two types', choices: MACHINE_TYPES },
  { id: 'power', label: 'Non solar and full solar', choices: POWER_OPTIONS },
  { id: 'cycle', label: 'Three formation categories', choices: PRODUCTION_CYCLES },
] as const;

/**
 * How an ice block machine is actually specified: type, power, cycle, capacity.
 *
 * This is the most useful section on the site — a customer arrives knowing they want
 * "an ice block machine" and leaves knowing there are three power options and three
 * production cycles, which is the difference between a WhatsApp message that says "how
 * much" and one that says what they actually need.
 *
 * Laid out as rules rather than boxes, and that is a correction rather than a
 * preference. This is tabular information — options against explanations — and it was
 * being shown as nine bordered cards, which is about the most templated thing a page
 * can do with a table. The rows share their idiom with the figures in the numbers band,
 * so two sections now use one device instead of each inventing its own box.
 */
export function MachineOptions() {
  const [selected, setSelected] = useState<{
    type?: string;
    power?: string;
    cycle?: string;
  }>({
    type: MACHINE_TYPES[0].name,
    power: POWER_OPTIONS[0].name,
    cycle: PRODUCTION_CYCLES[1].name,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [capacity, setCapacity] = useState<number>(100);

  const toggleChoice = (groupId: 'type' | 'power' | 'cycle', name: string) => {
    setSelected((prev) => ({
      ...prev,
      [groupId]: prev[groupId] === name ? undefined : name,
    }));
  };

  const isNylon = selected.type === 'Nylon type';
  const isFullSolar = selected.power === 'Full solar';
  const isSolarFriendly = selected.power === 'Solar friendly DC 48V';

  const cyclesCount =
    selected.cycle?.toLowerCase().includes('thrice') ||
    selected.cycle?.toLowerCase().includes('three')
      ? 3
      : selected.cycle?.toLowerCase().includes('twice')
      ? 2
      : 1;

  const dailyBlocks = capacity * cyclesCount;
  const dailyKg = dailyBlocks * 2;

  const drawerWhatsappMessage = [
    'Hello Koolink, I would like to review technical details and request an official quote for this custom ice block machine specification:',
    `- Machine Type: ${selected.type ?? 'Mould type'}`,
    `- Power System: ${selected.power ?? 'Full solar'}`,
    `- Formation Speed: ${selected.cycle ?? 'Twice daily'}`,
    `- Tank Batch Capacity: ${capacity} blocks per batch`,
    `- Estimated Daily Output: ${dailyBlocks} blocks/day (~${dailyKg.toLocaleString()} kg/day)`,
    '',
    'Please advise on configuration options, lead time, and current pricing.',
  ].join('\n');

  return (
    <section id="ice-block-machines" className="theme-sheet py-v-space">
      <Reveal className="shell">
        <SplitText
          as="h2"
          className="h2 mt-5 max-w-[28ch]"
          text="Our ice block machine is of two types, nylon type and mould types."
        />
        <p className="lead mt-5 max-w-[56ch]">
          Prices differ and the full solar is far more expensive than non solar. Tap any option below to build your specification.
        </p>
      </Reveal>

      {GROUPS.map((group, index) => (
        <Reveal key={group.id} className="shell mt-14" delay={index}>
          <div
            id={`machine-${group.id}`}
            className="scroll-mt-header flex flex-wrap items-baseline justify-between gap-2 border-t pt-6"
            style={{ borderColor: 'var(--rule)' }}
          >
            <h3 className="h3">{group.label}</h3>
            <span className="body-small" style={{ color: 'var(--text-muted)' }}>
              {selected[group.id] ? `Selected: ${selected[group.id]}` : 'Tap a card to select'}
            </span>
          </div>

          <div
            className={`mt-6 grid gap-gutter ${
              group.choices.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {group.choices.map((choice) => {
              const isSelected = selected[group.id] === choice.name;
              return (
                <motion.article
                  key={choice.id}
                  onClick={() => toggleChoice(group.id, choice.name)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleChoice(group.id, choice.name);
                    }
                  }}
                  className="card flex cursor-pointer flex-col justify-between gap-3 text-left"
                  style={{
                    borderColor: isSelected ? 'var(--accent)' : undefined,
                    boxShadow: isSelected ? '0 0 0 2px var(--accent)' : undefined,
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="h3">{choice.name}</h4>
                      <span
                        className="body-small shrink-0 rounded-full px-2.5 py-0.5 font-medium"
                        style={{
                          backgroundColor: isSelected ? 'var(--accent)' : 'rgb(255 255 255 / 0.5)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                    <p className="lead mt-3" style={{ color: 'var(--text)' }}>
                      {choice.detail}
                    </p>
                  </div>
                  {choice.note && (
                    <p className="body-small pt-2" style={{ color: 'var(--accent)' }}>
                      {choice.note}
                    </p>
                  )}
                </motion.article>
              );
            })}
          </div>
        </Reveal>
      ))}

      <Reveal className="shell mt-12" delay={3}>
        <div
          className="rounded-card border p-6 sm:p-8"
          style={{
            borderColor: 'var(--rule)',
            backgroundColor: 'rgb(255 255 255 / 0.55)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="eyebrow" style={{ color: 'var(--accent)' }}>
                Your Custom Specification
              </p>
              <h3 className="h3 mt-1">Ready to get your exact quote?</h3>
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="rounded-xl border p-3" style={{ borderColor: 'var(--rule)', backgroundColor: 'rgb(255 255 255 / 0.4)' }}>
                  <dt className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Machine Type</dt>
                  <dd className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>{selected.type ?? 'Any'}</dd>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: 'var(--rule)', backgroundColor: 'rgb(255 255 255 / 0.4)' }}>
                  <dt className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Power System</dt>
                  <dd className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>{selected.power ?? 'Any'}</dd>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: 'var(--rule)', backgroundColor: 'rgb(255 255 255 / 0.4)' }}>
                  <dt className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Formation Speed</dt>
                  <dd className="mt-1 font-semibold" style={{ color: 'var(--text)' }}>{selected.cycle ?? 'Any'}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center md:items-end lg:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="button secondary whitespace-nowrap self-start md:self-center shrink-0 flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>Configure &amp; Review Spec Details</span>
              </button>

              {isContactConfigured() && (
                <a
                  href={whatsappLink(
                    `Hello Koolink, I want a custom quote for: ${selected.type ?? 'Standard'} | ${selected.power ?? 'Solar'} | ${selected.cycle ?? 'Daily cycle'}. Please advise on capacity options and current pricing.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary whitespace-nowrap self-start md:self-center shrink-0"
                >
                  Get Price for This Spec on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Interactive Specification Breakdown & Calculator Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl"
      >
        <DrawerHeader className="relative pr-12">
          <p className="eyebrow" style={{ color: 'var(--accent)' }}>
            Engineering &amp; Capacity
          </p>
          <DrawerTitle className="mt-1">Specification Breakdown</DrawerTitle>
          <DrawerDescription className="mt-1">
            Compare mechanical trade-offs, electrical architecture, and calculate estimated daily ice block yield.
          </DrawerDescription>
          <DrawerClose className="absolute right-4 top-4" aria-label="Close specification review" />
        </DrawerHeader>

        <DrawerContent className="space-y-6">
          {/* Quick Configuration Selector */}
          <section className="space-y-3" aria-labelledby="active-spec-heading">
            <div className="flex items-center justify-between">
              <h3 id="active-spec-heading" className="eyebrow" style={{ color: 'var(--accent)' }}>
                Active Selection
              </h3>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Tap to reconfigure
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div
                className="rounded-xl border p-3"
                style={{
                  borderColor: 'var(--rule)',
                  backgroundColor: 'rgb(255 255 255 / 0.4)',
                }}
              >
                <span className="text-[11px] uppercase tracking-wider font-semibold block" style={{ color: 'var(--text-muted)' }}>
                  Machine Type
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {MACHINE_TYPES.map((t) => {
                    const active = selected.type === t.name;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleChoice('type', t.name)}
                        className={cx(
                          'rounded-md px-2.5 py-1 text-xs font-medium transition-colors text-left',
                          active
                            ? 'bg-deep text-frost dark:bg-frost dark:text-deep shadow-sm'
                            : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15'
                        )}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="rounded-xl border p-3"
                style={{
                  borderColor: 'var(--rule)',
                  backgroundColor: 'rgb(255 255 255 / 0.4)',
                }}
              >
                <span className="text-[11px] uppercase tracking-wider font-semibold block" style={{ color: 'var(--text-muted)' }}>
                  Power System
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {POWER_OPTIONS.map((p) => {
                    const active = selected.power === p.name;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleChoice('power', p.name)}
                        className={cx(
                          'rounded-md px-2.5 py-1 text-xs font-medium transition-colors text-left',
                          active
                            ? 'bg-deep text-frost dark:bg-frost dark:text-deep shadow-sm'
                            : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15'
                        )}
                      >
                        {p.name.replace('AC 220-240V', '').trim()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="rounded-xl border p-3"
                style={{
                  borderColor: 'var(--rule)',
                  backgroundColor: 'rgb(255 255 255 / 0.4)',
                }}
              >
                <span className="text-[11px] uppercase tracking-wider font-semibold block" style={{ color: 'var(--text-muted)' }}>
                  Formation Speed
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PRODUCTION_CYCLES.map((c) => {
                    const active = selected.cycle === c.name;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleChoice('cycle', c.name)}
                        className={cx(
                          'rounded-md px-2.5 py-1 text-xs font-medium transition-colors text-left',
                          active
                            ? 'bg-deep text-frost dark:bg-frost dark:text-deep shadow-sm'
                            : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15'
                        )}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Daily Output Calculator */}
          <section
            className="rounded-xl border p-5 space-y-4"
            style={{
              borderColor: 'var(--rule)',
              backgroundColor: 'rgb(255 255 255 / 0.5)',
            }}
            aria-labelledby="calculator-heading"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 id="calculator-heading" className="text-base font-semibold font-display">
                  Daily Output Calculator
                </h3>
                <p className="text-xs text-steel dark:text-haze mt-0.5">
                  Estimate total 24-hour yield based on tank batch capacity and cycle category
                </p>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
                style={{
                  borderColor: 'var(--rule)',
                  color: 'var(--accent)',
                  backgroundColor: 'rgb(255 255 255 / 0.4)',
                }}
              >
                21 to 500+ blocks
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>Batch Tank Capacity:</span>
                <span className="font-display font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  {capacity} blocks / batch
                </span>
              </div>

              <input
                type="range"
                min={CAPACITY.from}
                max={CAPACITY.to}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer bg-black/10 dark:bg-white/15 accent-[var(--accent)]"
                aria-label="Batch Tank Capacity Slider"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] mr-1" style={{ color: 'var(--text-muted)' }}>Presets:</span>
                {[25, 50, 100, 200, 300, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCapacity(preset)}
                    className={cx(
                      'px-2 py-0.5 text-xs rounded border transition-colors',
                      capacity === preset
                        ? 'border-[var(--accent)] text-white font-medium'
                        : 'border-[var(--rule)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                    )}
                    style={{
                      backgroundColor: capacity === preset ? 'var(--accent)' : undefined,
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Summary Grid */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t"
              style={{ borderColor: 'var(--rule)' }}
            >
              <div className="rounded-lg p-2.5 bg-black/[0.03] dark:bg-white/[0.03]">
                <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Batch Size
                </div>
                <div className="mt-1 text-lg font-bold font-display" style={{ color: 'var(--text)' }}>
                  {capacity}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>blocks / run</div>
              </div>

              <div className="rounded-lg p-2.5 bg-black/[0.03] dark:bg-white/[0.03]">
                <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Daily Frequency
                </div>
                <div className="mt-1 text-lg font-bold font-display" style={{ color: 'var(--text)' }}>
                  {cyclesCount}x
                </div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>runs / 24h</div>
              </div>

              <div
                className="rounded-lg p-2.5 border"
                style={{
                  borderColor: 'var(--accent)',
                  backgroundColor: 'rgb(255 255 255 / 0.6)',
                }}
              >
                <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--accent)' }}>
                  Daily Output
                </div>
                <div className="mt-1 text-lg font-bold font-display" style={{ color: 'var(--accent)' }}>
                  {dailyBlocks}
                </div>
                <div className="text-[11px] font-medium" style={{ color: 'var(--accent)' }}>blocks / day</div>
              </div>

              <div className="rounded-lg p-2.5 bg-black/[0.03] dark:bg-white/[0.03]">
                <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Est. Daily Weight
                </div>
                <div className="mt-1 text-lg font-bold font-display" style={{ color: 'var(--text)' }}>
                  ~{dailyKg.toLocaleString()}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>kg / day</div>
              </div>
            </div>

            <p className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>
              * Based on standard ~2kg commercial blocks. Koolink builds machines to match your physical site space and target block volume.
            </p>
          </section>

          {/* Machine Type Breakdown */}
          <section
            className="rounded-xl border p-5 space-y-3.5"
            style={{
              borderColor: 'var(--rule)',
              backgroundColor: 'rgb(255 255 255 / 0.5)',
            }}
            aria-labelledby="type-breakdown-heading"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent)' }}>
                  Type Comparison &amp; Trade-Offs
                </span>
                <h3 id="type-breakdown-heading" className="text-base font-semibold font-display mt-0.5">
                  {isNylon ? 'Nylon Type' : 'Mould Type'} Operational Profile
                </h3>
              </div>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full border font-medium shrink-0"
                style={{
                  borderColor: 'var(--rule)',
                  color: 'var(--text)',
                  backgroundColor: 'rgb(255 255 255 / 0.4)',
                }}
              >
                {isNylon ? 'Bagged Formation' : 'Permanent Steel Moulds'}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]">
                <span className="font-semibold text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--text)' }}>
                  Operational Mechanism
                </span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
                  {isNylon
                    ? 'Uses food-safe nylon film to form each block within chilled compartments. Water freezes enclosed inside the nylon wrapping.'
                    : 'Water freezes directly inside heavy-gauge, durable stainless or galvanized metallic moulds submerged in food-grade refrigerated brine.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    backgroundColor: 'rgba(16, 185, 129, 0.06)',
                  }}
                >
                  <span className="font-semibold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    Key Advantage
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
                    {isNylon
                      ? 'Blocks come out pre-bagged and ready for customer collection. Zero demoulding dipping tanks or manual harvesting extraction required.'
                      : 'Comes with permanent heavy-duty moulds. Zero recurring nylon film expense, delivering the lowest long-term operational cost per block.'}
                  </p>
                </div>

                <div
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                    backgroundColor: 'rgba(245, 158, 11, 0.06)',
                  }}
                >
                  <span className="font-semibold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    Operational Trade-Off
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
                    {isNylon
                      ? 'Requires continuous daily purchasing of nylon bags as an active operating consumable to maintain production cycles.'
                      : 'Requires a brief ambient thaw dip or mechanical hoist to release frozen blocks from their fixed moulds before transfer to deep storage.'}
                  </p>
                </div>
              </div>

              <div className="text-xs pt-1" style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text)' }}>Koolink Recommendation: </strong>
                {isNylon
                  ? 'Ideal for retail distribution points, pure water ice vendors, and operations seeking instant packaging without extra labor.'
                  : 'Best for high-volume commercial ice depots, wholesale seafood cold stores, and factories prioritizing lowest production cost.'}
              </div>
            </div>
          </section>

          {/* Power Requirements Breakdown */}
          <section
            className="rounded-xl border p-5 space-y-3.5"
            style={{
              borderColor: 'var(--rule)',
              backgroundColor: 'rgb(255 255 255 / 0.5)',
            }}
            aria-labelledby="power-breakdown-heading"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent)' }}>
                  Power Architecture &amp; Notes
                </span>
                <h3 id="power-breakdown-heading" className="text-base font-semibold font-display mt-0.5">
                  {selected.power ?? 'Power Option'} Architecture
                </h3>
              </div>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full border font-medium shrink-0"
                style={{
                  borderColor: 'var(--rule)',
                  color: 'var(--text)',
                  backgroundColor: 'rgb(255 255 255 / 0.4)',
                }}
              >
                {isFullSolar ? 'Autonomous Solar DC' : isSolarFriendly ? 'Direct DC 48V' : 'Mains / Generator AC'}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]">
                  <span className="text-[11px] uppercase tracking-wider block font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Supply Specification
                  </span>
                  <p className="text-xs mt-1 font-medium leading-relaxed" style={{ color: 'var(--text)' }}>
                    {isFullSolar
                      ? 'Self-powered DC 24V/48V system complete with high-wattage tier-1 mono panels and brand-new Lithium battery bank.'
                      : isSolarFriendly
                      ? 'Energy-saving DC 48V machine designed to connect directly into customer’s existing solar inverter and battery installation.'
                      : 'AC 220-240V (or 415V 3-phase). Best run on utility grid mains or a dedicated diesel/petrol generator (5kVA+).'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]">
                  <span className="text-[11px] uppercase tracking-wider block font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Koolink Engineering Standard
                  </span>
                  <p className="text-xs mt-1 font-medium leading-relaxed" style={{ color: 'var(--text)' }}>
                    {isFullSolar
                      ? 'Lithium batteries because they are the most durable, rugged, efficient and safest battery types. Complete with full operational manual.'
                      : isSolarFriendly
                      ? 'Eliminates DC-to-AC-to-DC conversion losses, conserving 15-20% battery energy for actual refrigeration duties.'
                      : 'Brand-new commercial outdoor refrigeration units. All parts and components are readily available in the local market.'}
                  </p>
                </div>
              </div>

              <div
                className="p-3 rounded-lg border text-xs leading-relaxed"
                style={{
                  borderColor: 'var(--rule)',
                  backgroundColor: 'rgb(255 255 255 / 0.3)',
                  color: 'var(--text)',
                }}
              >
                <strong style={{ color: 'var(--accent)' }}>Operational Notice: </strong>
                {isFullSolar
                  ? 'Costs considerably more upfront than non-solar, and runs on nothing. Completely different from domestic freezers sold as solar ice block machines, on batteries that will not last two years.'
                  : isSolarFriendly
                  ? 'Ensures maximum return from existing solar investments. Must be paired with adequate panel wattage to sustain continuous commercial duty cycles.'
                  : 'Commercial compressors have high inductive startup current and are strictly not suitable for domestic residential solar setups.'}
              </div>
            </div>
          </section>

          {/* Production Cycle Breakdown */}
          <section
            className="rounded-xl border p-5 space-y-3.5"
            style={{
              borderColor: 'var(--rule)',
              backgroundColor: 'rgb(255 255 255 / 0.5)',
            }}
            aria-labelledby="cycle-breakdown-heading"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent)' }}>
                  Formation Speed &amp; Turnaround
                </span>
                <h3 id="cycle-breakdown-heading" className="text-base font-semibold font-display mt-0.5">
                  {selected.cycle ?? 'Production Cycle'} Schedule
                </h3>
              </div>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full border font-medium shrink-0"
                style={{
                  borderColor: 'var(--rule)',
                  color: 'var(--text)',
                  backgroundColor: 'rgb(255 255 255 / 0.4)',
                }}
              >
                {cyclesCount} harvest{cyclesCount > 1 ? 's' : ''} / 24h
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]">
                  <span className="text-[11px] uppercase tracking-wider block font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Batch Turnaround
                  </span>
                  <div className="text-base font-bold font-display mt-1" style={{ color: 'var(--text)' }}>
                    {cyclesCount === 3 ? '~8 Hours' : cyclesCount === 2 ? '~12 Hours' : '< 24 Hours'}
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>per complete freeze</p>
                </div>

                <div className="p-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]">
                  <span className="text-[11px] uppercase tracking-wider block font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Harvest Routine
                  </span>
                  <div className="text-base font-bold font-display mt-1" style={{ color: 'var(--text)' }}>
                    {cyclesCount === 3 ? 'Every 8 Hours' : cyclesCount === 2 ? 'Morning & Evening' : 'Once Every 24h'}
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>harvest schedule</p>
                </div>

                <div className="p-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]">
                  <span className="text-[11px] uppercase tracking-wider block font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Commercial Yield
                  </span>
                  <div className="text-base font-bold font-display mt-1" style={{ color: 'var(--accent)' }}>
                    {dailyBlocks} Blocks
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>24-hour total</p>
                </div>
              </div>

              <div
                className="p-3 rounded-lg border text-xs leading-relaxed"
                style={{
                  borderColor: 'var(--rule)',
                  backgroundColor: 'rgb(255 255 255 / 0.3)',
                  color: 'var(--text)',
                }}
              >
                <strong style={{ color: 'var(--accent)' }}>Operational Schedule: </strong>
                {cyclesCount === 3
                  ? 'A full run every 8 hours. High-speed block turnover designed for wholesale distribution, busy market supply, and peak season demand.'
                  : cyclesCount === 2
                  ? 'A full run every 12 hours. The ideal balance between equipment lifespan and daily production, producing 2 batches each day from a single footprint.'
                  : 'One full production run in under 24 hours. Gentle, steady continuous operation requiring single-operator attention once daily.'}
              </div>
            </div>
          </section>

          {/* Direct WhatsApp Callout Card */}
          {isContactConfigured() && (
            <div
              className="rounded-xl border p-5 space-y-3 text-center sm:text-left"
              style={{
                borderColor: 'var(--rule)',
                backgroundColor: 'rgb(255 255 255 / 0.55)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold font-display" style={{ color: 'var(--text)' }}>
                    Ready to discuss this configuration?
                  </h4>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Send this exact specification to Koolink engineers on WhatsApp for current availability and official pricing.
                  </p>
                </div>
                <a
                  href={whatsappLink(drawerWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Request Quote on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>
              </div>
            </div>
          )}
        </DrawerContent>

        <DrawerFooter className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="button secondary w-full sm:w-auto text-center"
          >
            Close Review
          </button>
          {isContactConfigured() && (
            <a
              href={whatsappLink(drawerWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary w-full sm:w-auto text-center flex items-center justify-center gap-2"
            >
              <span>Get Price for This Spec on WhatsApp</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          )}
        </DrawerFooter>
      </Drawer>
    </section>
  );
}
