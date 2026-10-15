import type { Config } from 'tailwindcss';

/**
 * Palette, with every ratio computed rather than eyeballed:
 *
 *   deep    #071822 on frost #F2F7FA  → 16.74:1  headings and body on light
 *           on sheet #E3ECF2          → 15.09:1
 *           on glacier #C3D8E6        → 12.29:1
 *   steel   #3A5060 on frost          →  7.80:1  secondary text on light
 *           on sheet                  →  7.03:1
 *           on glacier                →  5.72:1  (glacier is the binding bed)
 *   marine  #146579 on frost          →  6.14:1  links and emphasis on light
 *           on sheet                  →  5.54:1
 *   frost   on deep                   → 16.74:1  the dark sections
 *           on abyss #041017          → 17.83:1
 *   haze    #9FBCCC on deep           →  9.06:1  secondary text when inverted
 *   chill   #5FD3EE on deep           → 10.35:1  accent on dark
 *   deep    on cyan #2BA8CE           →  6.53:1  the primary button
 *   ember   #B23A08 on frost          →  5.56:1  the one warm note
 *   cyan    on frost                  →  2.56:1  FAILS. Fills and hairlines only.
 *
 * cyan is never text on a light bed anywhere in this project — it is a button
 * fill under dark text, a hairline, or decoration. ember appears once, on the
 * delivery cut-off, because the only thing on this site that is warm is the
 * clock.
 *
 * Spacing and type are one fluid family: every token runs from its 375px value
 * to its 1440px value on the same slope, so the page breathes at one rate.
 * Generated arithmetic, not hand-tuned — see the clamp() block in globals.css.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        frost: 'rgb(var(--frost) / <alpha-value>)',
        sheet: 'rgb(var(--sheet) / <alpha-value>)',
        glacier: 'rgb(var(--glacier) / <alpha-value>)',
        deep: 'rgb(var(--deep) / <alpha-value>)',
        abyss: 'rgb(var(--abyss) / <alpha-value>)',
        steel: 'rgb(var(--steel) / <alpha-value>)',
        haze: 'rgb(var(--haze) / <alpha-value>)',
        cyan: 'rgb(var(--cyan) / <alpha-value>)',
        chill: 'rgb(var(--chill) / <alpha-value>)',
        marine: 'rgb(var(--marine) / <alpha-value>)',
        ember: 'rgb(var(--ember) / <alpha-value>)',
        /* Resolve to whatever the current section theme set. */
        surface: 'var(--surface)',
        ink: 'var(--text)',
        subtle: 'var(--text-muted)',
        rule: 'var(--rule)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        gutter: 'var(--gutter)',
        margin: 'var(--margin)',
        'v-space': 'var(--v-space)',
        'v-space-sm': 'var(--v-space-sm)',
        header: 'var(--header-height)',
      },
      maxWidth: {
        shell: 'var(--shell)',
      },
      borderRadius: {
        base: 'var(--radius-base)',
        card: 'var(--radius-card)',
        pill: 'var(--radius-pill)',
      },
      transitionTimingFunction: {
        thaw: 'var(--ease-thaw)',
      },
      transitionDuration: {
        fast: 'var(--speed-fast)',
        md: 'var(--speed-md)',
        slow: 'var(--speed-slow)',
      },
    },
  },
  plugins: [],
};

export default config;
