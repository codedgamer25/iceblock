'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FlexCarousel, { DEFAULT_ITEMS } from '@/components/FlexCarousel';
import { Reveal } from '@/components/Reveal';

export function KoolinkShowcase() {
  return (
    <section id="products" className="theme-frost pt-v-space pb-8 sm:pb-12 border-b scroll-mt-header overflow-hidden" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell mb-6 sm:mb-8">
        <Reveal className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="h2">Machines and cold rooms at work.</h2>
            <p className="body text-subtle mt-2 max-w-[54ch]">
              Nylon and mould ice block machines, walk-in cold rooms and solar installations built in our factory.
            </p>
          </div>

          <Link
            href="/products"
            className="button secondary self-start sm:self-auto shrink-0"
          >
            View all 29 photographs <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>

      {/* Liquid-glass WebGL FlexCarousel */}
      <Reveal className="w-full" delay={1}>
        <div className="w-full h-[clamp(490px,66vh,740px)] relative overflow-hidden bg-transparent">
          <FlexCarousel
            items={DEFAULT_ITEMS}
            preset="liquid"
            intro="rise"
            cardHeight={0.52}
            gap={18}
            radius={20}
            fit="natural"
            squeeze={0.25}
            focusOnClick
            captions
          />
        </div>
      </Reveal>
    </section>
  );
}

export default KoolinkShowcase;
