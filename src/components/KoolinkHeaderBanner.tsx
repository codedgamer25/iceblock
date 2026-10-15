import React from 'react';

export interface KoolinkHeaderBannerProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function KoolinkHeaderBanner({
  className,
  width = '100%',
  height = '100%',
}: KoolinkHeaderBannerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 390"
      width={width}
      height={height}
      className={className}
      role="banner"
      aria-label="Koolink Nigeria Limited (RC 950910) Header Banner"
    >
      <defs>
        {/* Circular text path for emblem */}
        <path
          id="koolinkSealPath"
          d="M 103.3,294.7 A 118,118 0 1,1 261.2,119.3 A 118,118 0 1,1 103.3,294.7"
        />

        {/* Purple-to-Magenta vertical gradient for KOOLINK title */}
        <linearGradient id="koolinkTitleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9A2B63" />
          <stop offset="48%" stopColor="#6B318B" />
          <stop offset="100%" stopColor="#353E98" />
        </linearGradient>

        {/* Soft drop shadow for KOOLINK wordmark */}
        <filter id="wordmarkShadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.32" />
        </filter>
      </defs>

      {/* ================= LEFT: CIRCULAR LOGO EMBLEM ================= */}
      <g transform="translate(10, 5)">
        {/* Outer Green Ring */}
        <circle cx="182" cy="207" r="145" fill="#009647" />
        {/* Inner Cream Circle */}
        <circle cx="182" cy="207" r="111" fill="#FEFAD4" />
        {/* Circular Text */}
        <text
          fill="#FEFAD4"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="21.8"
          fontWeight="500"
          letterSpacing="1"
        >
          <textPath href="#koolinkSealPath" startOffset="0%" textLength="726" lengthAdjust="spacing">
            KOOLINK NIGERIA LIMITED KOOLINK NIGERIA LIMITED
          </textPath>
        </text>
        {/* Center K Mark */}
        <rect x="132" y="117" width="35" height="190" fill="#ED2024" />
        <rect x="167" y="273" width="32" height="34" fill="#363795" />
        <polygon points="190,128 224,128 197,199 232,273 199,273 167,202 167,196" fill="#363795" />
      </g>

      {/* ================= RIGHT: RC NUMBER & WORDMARK LOCKUP ================= */}
      {/* RC 950910 */}
      <text
        x="1142"
        y="62"
        textAnchor="end"
        fill="#000000"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="27"
        fontWeight="800"
        letterSpacing="1"
      >
        RC 950910
      </text>

      {/* Main KOOLINK Gradient Wordmark */}
      <text
        x="758"
        y="210"
        textAnchor="middle"
        fill="url(#koolinkTitleGrad)"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        paintOrder="stroke fill"
        filter="url(#wordmarkShadow)"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="158"
        fontWeight="900"
        letterSpacing="4"
      >
        KOOLINK
      </text>

      {/* NIGERIA LIMITED */}
      <text
        x="758"
        y="282"
        textAnchor="middle"
        fill="#000000"
        fontFamily="'Trebuchet MS', Arial, sans-serif"
        fontSize="45"
        fontWeight="500"
        letterSpacing="12"
      >
        NIGERIA LIMITED
      </text>

      {/* ICEBLOCK MACHINES, COLDROOMS & CHILLERS */}
      <text
        x="758"
        y="324"
        textAnchor="middle"
        fill="#000000"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="28"
        fontWeight="800"
        letterSpacing="0.8"
      >
        ICEBLOCK MACHINES, COLDROOMS &amp; CHILLERS
      </text>

      {/* FULL SOLAR (DC 24V/48V) NON SOLAR (AC 220-240V) */}
      <text
        x="758"
        y="360"
        textAnchor="middle"
        fill="#E3242B"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="28"
        fontWeight="800"
        letterSpacing="0.6"
      >
        FULL SOLAR (DC 24V/48V) NON SOLAR (AC 220-240V)
      </text>
    </svg>
  );
}

export default KoolinkHeaderBanner;
