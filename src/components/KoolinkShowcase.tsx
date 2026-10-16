'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FlexCarousel, { DEFAULT_ITEMS } from '@/components/FlexCarousel';
import { Reveal } from '@/components/Reveal';

export function KoolinkShowcase() {
  return (
    <section id="products" className="theme-frost py-v-space border-b scroll-mt-header" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell flex flex-col gap-6">
        <Reveal className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="eyebrow" style={{ color: 'var(--accent)' }}>Interactive WebGL Showcase</p>
            <h2 className="h2 mt-1">Explore our flagship refrigeration &amp; cold systems.</h2>
            <p className="body text-subtle mt-1">
              Drag, swipe or scrub with trackpad. Click any card to expand details with chromatic liquid dispersion.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 body-small font-medium self-start sm:self-auto"
            style={{ color: 'var(--accent)' }}
          >
            Explore all 29 photographs <ArrowRight size={16} />
          </Link>
        </Reveal>

        {/* Liquid-glass WebGL FlexCarousel */}
        <Reveal className="w-full" delay={1}>
          <div className="w-full h-[clamp(420px,56vh,620px)] relative overflow-hidden bg-transparent">
            <FlexCarousel
              items={DEFAULT_ITEMS}
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
