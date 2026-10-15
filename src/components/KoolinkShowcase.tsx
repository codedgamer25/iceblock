'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FlexCarousel, { FlexCarouselItem } from '@/components/FlexCarousel';
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
  return (
    <section id="products" className="theme-sheet py-v-space border-y scroll-mt-header" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell flex flex-col gap-6">
        <Reveal className="w-full flex items-center justify-between">
          <div>
            <p className="eyebrow" style={{ color: 'var(--accent)' }}>Interactive Showcase</p>
            <h2 className="h2 mt-1">Explore our flagship refrigeration lines.</h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 body-small font-medium"
            style={{ color: 'var(--accent)' }}
          >
            Explore all 29 photographs <ArrowRight size={16} />
          </Link>
        </Reveal>

        {/* Liquid-glass flex-squeeze carousel */}
        <Reveal className="w-full" delay={1}>
          <div className="w-full h-[clamp(380px,52vh,560px)] relative rounded-card overflow-hidden shadow-md">
            <FlexCarousel
              items={koolinkItems}
              preset="liquid"
              intro="rise"
              cardHeight={0.92}
              gap={14}
              squeeze={0.22}
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
