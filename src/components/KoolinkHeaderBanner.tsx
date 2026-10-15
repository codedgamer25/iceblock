import React from 'react';
import { BUSINESS, PHONE_DISPLAY, PHONE_ALT_DISPLAY } from '@/lib/business';

export interface KoolinkHeaderBannerProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function KoolinkHeaderBanner({
  className,
  width = '100%',
  height = 'auto',
}: KoolinkHeaderBannerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 280"
      width={width}
      height={height}
      className={className}
      role="banner"
      aria-label={`${BUSINESS.legalName} (${BUSINESS.rcNumber}) Header Banner`}
    >
      <defs>
        {/* Gradient for the KOOLINK wordmark */}
        <linearGradient id="koolinkWordmarkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A154B" />
          <stop offset="35%" stopColor="#7E1D86" />
          <stop offset="70%" stopColor="#C026D3" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Seal center gradient */}
        <radialGradient id="sealCenterGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#9333EA" />
        </radialGradient>

        {/* Outer seal cyan ring */}
        <linearGradient id="sealRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Text drop shadow filter */}
        <filter id="bannerDropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.28" />
        </filter>
        <filter id="sealShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Top Registration Badge (RC 950910) */}
      <g id="rc-badge" transform="translate(850, 36)">
        <rect
          x="-75"
          y="-18"
          width="150"
          height="28"
          rx="14"
          fill="#071822"
          stroke="#06B6D4"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#F2F7FA"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="13"
          letterSpacing="0.08em"
        >
          {BUSINESS.rcNumber}
        </text>
      </g>

      {/* Left: Circular Official Seal */}
      <g id="koolink-seal" transform="translate(130, 140)" filter="url(#sealShadow)">
        {/* Outer Ring */}
        <circle r="96" fill="url(#sealRingGradient)" stroke="#ffffff" strokeWidth="4" />
        <circle r="86" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" />

        {/* Curved Text - Top: KOOLINK NIGERIA LIMITED */}
        <path id="sealTopArc" fill="none" d="M -72,0 A 72,72 0 1,1 72,0" />
        <text
          fill="#ffffff"
          fontSize="11.5"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.16em"
        >
          <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
            KOOLINK NIGERIA LIMITED
          </textPath>
        </text>

        {/* Curved Text - Bottom: Phone numbers */}
        <path id="sealBottomArc" fill="none" d="M -72,0 A 72,72 0 0,0 72,0" />
        <text
          fill="#ffffff"
          fontSize="9.5"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.06em"
        >
          <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
            {PHONE_DISPLAY} • {PHONE_ALT_DISPLAY}
          </textPath>
        </text>

        {/* Center Oval with KL monogram */}
        <ellipse rx="52" ry="46" fill="url(#sealCenterGradient)" stroke="#ffffff" strokeWidth="3" />
        <text
          x="0"
          y="12"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontFamily="'Arial Black', 'Archivo', sans-serif"
          fontWeight="900"
          fontSize="44"
          letterSpacing="-0.04em"
        >
          KL
        </text>
      </g>

      {/* Right Content Stack */}
      <g id="wordmark-and-subtitles" transform="translate(255, 60)">
        {/* Main KOOLINK Wordmark */}
        <text
          x="0"
          y="80"
          fill="url(#koolinkWordmarkGradient)"
          stroke="#ffffff"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="'Archivo', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="84"
          letterSpacing="0.04em"
          filter="url(#bannerDropShadow)"
        >
          KOOLINK
        </text>

        {/* Primary Subtitle: Commercial Refrigeration & Solar Systems */}
        <text
          x="4"
          y="118"
          fill="#071822"
          fontFamily="'Archivo', system-ui, sans-serif"
          fontWeight="700"
          fontSize="21"
          letterSpacing="0.08em"
        >
          COMMERCIAL REFRIGERATION &amp; SOLAR SYSTEMS
        </text>

        {/* Secondary Subtitle / Product Lines */}
        <text
          x="4"
          y="144"
          fill="#146579"
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
          fontSize="14.5"
          letterSpacing="0.03em"
        >
          Walk-In Cold Rooms • Ice Block Machines (Nylon &amp; Mould) • Solar DC Systems
        </text>

        {/* Company Motto */}
        <g transform="translate(4, 168)">
          <rect x="0" y="0" width="310" height="24" rx="4" fill="#071822" />
          <text
            x="155"
            y="13"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#5FD3EE"
            fontFamily="system-ui, sans-serif"
            fontWeight="700"
            fontSize="11.5"
            letterSpacing="0.1em"
          >
            {BUSINESS.motto.toUpperCase()}
          </text>
        </g>
      </g>
    </svg>
  );
}

export default KoolinkHeaderBanner;
