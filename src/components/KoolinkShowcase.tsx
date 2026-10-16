'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FlexCarousel, { DEFAULT_ITEMS } from '@/components/FlexCarousel';
import { Reveal } from '@/components/Reveal';

export function KoolinkShowcase() {
  return (
    <section
      id="products"
      className="theme-frost relative overflow-hidden py-v-space border-b scroll-mt-header"
      style={{ borderColor: 'var(--rule)' }}
    >
      {/* Ambient glacial bloom behind the Liquid Glass WebGL stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[960px] h-[340px] rounded-full blur-3xl opacity-65"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(95, 211, 238, 0.26), rgba(43, 168, 206, 0.12) 55%, transparent 78%)',
          }}
        />
      </div>

      <div className="shell relative z-10 flex flex-col gap-6">
        <Reveal className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-2 text-[11px] font-semibold tracking-widest uppercase"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.68)',
                border: '1px solid rgba(255, 255, 255, 0.92)',
                boxShadow:
                  'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 2px 8px rgba(7, 24, 34, 0.05)',
                color: 'var(--accent)',
              }}
            >
              <span>Interactive Liquid Glass Showcase</span>
            </div>
            <h2 className="h2 mt-1">Explore our flagship refrigeration &amp; cold systems.</h2>
            <p className="body text-subtle mt-1">
              Drag, swipe or scrub with trackpad. Click any card to expand details with chromatic liquid dispersion.
            </p>
          </div>

          <Link
            href="/products"
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 body-small font-semibold self-start sm:self-auto transition-transform active:scale-95"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.66)',
              border: '1px solid rgba(255, 255, 255, 0.92)',
              boxShadow:
                'inset 0 1px 0 rgba(255, 255, 255, 0.96), 0 4px 14px rgba(7, 24, 34, 0.08)',
              color: 'var(--accent)',
            }}
          >
            Explore all 29 photographs <ArrowRight size={16} />
          </Link>
        </Reveal>

        {/* Liquid-glass WebGL FlexCarousel inside a sculpted glass lens stage */}
        <Reveal className="w-[calc(100vw-16px)] max-w-none -mx-[var(--margin)] sm:mx-0 sm:w-full" delay={1}>
          <div
            className="glass w-full h-[clamp(430px,58vh,620px)] relative overflow-hidden rounded-[26px] sm:rounded-[32px]"
            style={{
              backgroundColor: 'rgba(242, 247, 250, 0.56)',
              backgroundImage:
                'linear-gradient(155deg, rgba(255, 255, 255, 0.72) 0%, rgba(242, 247, 250, 0.36) 45%, rgba(195, 216, 230, 0.24) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.88)',
              boxShadow:
                'inset 0 2px 1px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(20, 101, 121, 0.12), 0 20px 44px -14px rgba(7, 24, 34, 0.12)',
            }}
          >
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
