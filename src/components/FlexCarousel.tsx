'use client';

import React, { useState } from 'react';
import { FILTER_ID } from '@/lib/liquid-glass';

export type FlexCarouselItem = {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  objectPosition?: string;
};

export interface FlexCarouselProps {
  items: ReadonlyArray<FlexCarouselItem>;
  preset?: 'liquid' | 'default';
  intro?: 'rise' | 'fade' | 'none';
  cardHeight?: number; // 0 to 1 ratio of container height, or pixel height if > 1
  gap?: number;
  squeeze?: number; // 0 to 1 compression factor for non-active items
  focusOnClick?: boolean;
  captions?: boolean;
}

export default function FlexCarousel({
  items,
  preset = 'liquid',
  intro = 'rise',
  cardHeight = 0.5,
  gap = 12,
  squeeze = 0.2,
  focusOnClick = true,
  captions = true,
}: FlexCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentFocus = hoveredIndex ?? activeIndex;
  const resolvedHeight =
    cardHeight <= 1 ? `${Math.round(cardHeight * 100)}%` : `${cardHeight}px`;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${gap}px`,
        padding: '16px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map((item, idx) => {
        const isFocused = currentFocus === idx;
        const baseFlex = 1;
        const expandedFlex = 1 + squeeze * (items.length - 1);
        const squeezedFlex = Math.max(0.15, 1 - squeeze);
        const flexGrow =
          currentFocus === null
            ? baseFlex
            : isFocused
              ? expandedFlex
              : squeezedFlex;

        return (
          <article
            key={item.src + idx}
            onClick={() => {
              if (focusOnClick) {
                setActiveIndex(idx === activeIndex ? null : idx);
              }
            }}
            onMouseEnter={() => {
              if (!focusOnClick) setHoveredIndex(idx);
            }}
            style={{
              position: 'relative',
              height: isFocused ? '92%' : resolvedHeight,
              flex: `${flexGrow} 1 0%`,
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: focusOnClick ? 'pointer' : 'default',
              transition:
                'flex 560ms cubic-bezier(0.22, 1, 0.36, 1), height 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1)',
              animation:
                intro === 'rise'
                  ? `flexCarouselRise 640ms cubic-bezier(0.22, 1, 0.36, 1) ${idx * 90}ms both`
                  : undefined,
              boxShadow: isFocused
                ? '0 24px 48px -12px rgba(0, 0, 0, 0.38)'
                : '0 10px 24px -8px rgba(0, 0, 0, 0.22)',
              border:
                preset === 'liquid'
                  ? '1px solid rgba(255, 255, 255, 0.28)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // Keep watermark badge & numbers in top-left visible per Koolink requirement
                objectPosition: item.objectPosition ?? 'top left',
                transform: isFocused ? 'scale(1.03)' : 'scale(1.12)',
                transition: 'transform 680ms cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'block',
              }}
            />

            {captions && (
              <div
                style={{
                  position: 'absolute',
                  insetInline: '12px',
                  bottom: '12px',
                  padding: isFocused ? '14px 18px' : '10px 12px',
                  borderRadius: '14px',
                  background:
                    preset === 'liquid'
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))'
                      : 'rgba(15, 23, 42, 0.75)',
                  backdropFilter:
                    preset === 'liquid'
                      ? `url(#${FILTER_ID}) blur(14px) saturate(160%)`
                      : 'blur(10px)',
                  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  color: '#ffffff',
                  opacity: isFocused ? 1 : 0.82,
                  transform: isFocused ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'all 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: isFocused ? '1.05rem' : '0.85rem',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </div>
                {item.subtitle && isFocused && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      opacity: 0.88,
                      marginTop: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.subtitle}
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}

      <style>{`
        @keyframes flexCarouselRise {
          from {
            opacity: 0;
            transform: translateY(36px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
