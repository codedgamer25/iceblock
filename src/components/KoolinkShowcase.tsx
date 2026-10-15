'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import FlexCarousel, { DEFAULT_ITEMS, FlexCarouselItem } from '@/components/FlexCarousel';
import { Reveal } from '@/components/Reveal';

const koolinkItems: ReadonlyArray<FlexCarouselItem> = [
  {
    src: '/products/nylon.avif',
    alt: 'Koolink Nylon Type Ice Block Machine',
    title: 'Nylon Type Machines',
    subtitle: '21 to 500+ blocks • Bagged clean ice',
  },
  {
    src: '/products/mould.avif',
    alt: 'Koolink Stainless Mould Type Ice Block Machine',
    title: 'Mould Type Machines',
    subtitle: 'Fixed steel grid • Zero daily nylon cost',
  },
  {
    src: '/products/coldroom.avif',
    alt: 'Koolink Walk-In Coldroom Installation',
    title: 'Walk-In Coldrooms',
    subtitle: 'Custom-fitted panels • Solar & AC options',
  },
  {
    src: '/products/solar.avif',
    alt: 'Full Solar DC 24V/48V Lithium System',
    title: 'Full Solar (DC 24V/48V)',
    subtitle: 'Monocrystalline panels + lithium battery bank',
  },
];

export function KoolinkShowcase() {
  const [collection, setCollection] = useState<'koolink' | 'materials'>('koolink');

  const activeItems = collection === 'koolink' ? koolinkItems : DEFAULT_ITEMS;

  return (
    <section id="products" className="theme-frost py-v-space border-b scroll-mt-header" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell flex flex-col gap-6">
        <Reveal className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="eyebrow" style={{ color: 'var(--accent)' }}>Interactive WebGL Showcase</p>
            <h2 className="h2 mt-1">Explore our product lines & material studies.</h2>
            <p className="body text-subtle mt-1">
              Drag, swipe or scrub with trackpad. Click any card to expand details with chromatic liquid dispersion.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            {/* Collection Switcher Pills */}
            <div className="inline-flex p-1 rounded-pill bg-[rgb(var(--deep)/0.06)] border border-[rgb(var(--deep)/0.08)]">
              <button
                type="button"
                onClick={() => setCollection('koolink')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                  collection === 'koolink'
                    ? 'bg-white text-[rgb(var(--deep))] shadow-sm'
                    : 'text-[rgb(var(--steel))] hover:text-[rgb(var(--deep))]'
                }`}
              >
                <Layers size={14} />
                Flagship Machines ({koolinkItems.length})
              </button>
              <button
                type="button"
                onClick={() => setCollection('materials')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                  collection === 'materials'
                    ? 'bg-white text-[rgb(var(--deep))] shadow-sm'
                    : 'text-[rgb(var(--steel))] hover:text-[rgb(var(--deep))]'
                }`}
              >
                <Sparkles size={14} />
                Art & Materials ({DEFAULT_ITEMS.length})
              </button>
            </div>

            <Link
              href="/products"
              className="hidden lg:inline-flex items-center gap-2 body-small font-medium"
              style={{ color: 'var(--accent)' }}
            >
              Explore all 29 photographs <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        {/* Liquid-glass WebGL FlexCarousel */}
        <Reveal className="w-full" delay={1}>
          <div className="w-full h-[clamp(420px,56vh,620px)] relative rounded-card overflow-hidden bg-gradient-to-b from-transparent via-[rgb(var(--deep)/0.02)] to-[rgb(var(--deep)/0.04)]">
            <FlexCarousel
              items={activeItems}
              preset="liquid"
              intro="rise"
              cardHeight={0.62}
              gap={16}
              radius={20}
              fit="natural"
              squeeze={0.25}
              focusOnClick
              captions
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default KoolinkShowcase;
