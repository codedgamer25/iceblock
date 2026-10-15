# Koolink (Iceblock)

> Commercial refrigeration manufacturing web platform for Koolink Nigeria Limited.

Koolink manufactures commercial refrigeration systems tailored for Nigerian businesses operating under demanding grid conditions. The platform leads with four lines: nylon type ice block machines, mould type ice block machines, walk-in cold rooms, and dedicated solar panel systems.

---

## Overview

- **Manufacturer-First**: Built in Nigeria, delivered nationwide, backed by 25+ years of engineering experience and 4 physical walk-in offices.
- **Solar-Centric**: Designed for reliable off-grid and hybrid operation:
  - **Full Solar**: DC 24/48V hybrid commercial machines with lithium batteries and panels.
  - **Solar-Friendly**: DC 48V energy-saving machines compatible with existing solar installations.
  - **Non-Solar**: AC 220–240V for mains or generator operation.
- **Human Procurement Flow**: Built to turn visitors into focused WhatsApp or telephone consultations with pre-qualified machine specifications (type, power option, production cycle, capacity).
- **Verified Photography**: 29 authentic product and facility photographs across four lines with uncropped factory watermarks and automated WhatsApp image previews.

---

## Technical Highlights

- **Next.js 14 (App Router)** & **React 18**: Server-first rendering with client-side animation coordination.
- **Liquid Glass Shader (`src/lib/liquid-glass.ts`)**: Custom SVG displacement filter with squircle dome bevel ramps and chromatic prismatic fringing without heavy GPU noise filters.
- **Unified Scroll & Entrance Runtime (`src/components/InViewRuntime.tsx`)**: Coalesced IntersectionObserver runtime managing arrivals, viewport spread thresholds, and sticky ScrollStack scaling.
- **Deterministic Scramble SplitText (`src/lib/split.ts`)**: FNV-1a hashed Mulberry32 PRNG for SSR-safe character animations without heavy external animation bundles.
- **Rigorous Contrast & Color System**: 5-tier industrial palette (`theme-frost`, `theme-sheet`, `theme-glacier`, `theme-deep`, `theme-abyss`) mathematically verified against WCAG AA standards.
- **Automated Invariant Testing**: Vitest suite enforcing offline pricing policies, Nigerian phone number formatting, deep link parity, and optical filter bounds.

---

## Project Structure

```text
iceblock/
├── public/              # Optimized AVIF/WebP assets & product photography
├── scripts/             # Build pipelines, contrast checkers, and geometry authoring
├── src/
│   ├── app/             # Next.js App Router (homepage, /products, layout, globals.css)
│   ├── components/      # UI components, headers, liquid glass filter, scroll runtime
│   └── lib/             # Core business logic, machine specs, WhatsApp formatters
├── tests/               # Content policy, optical glass, and split-text test suites
├── PRODUCT.md           # Product specification and business constraints
└── DESIGN.md            # Detailed design tokens, typography, and contrast arithmetic
```

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or 20+
- npm or pnpm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3500](http://localhost:3500) with your browser.

### Run Tests

```bash
npm test
```

### Production Build

```bash
npm run build
npm start
```
