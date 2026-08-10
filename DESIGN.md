# Design

## Mood

Red-oxide primer on raw galvanized steel — industrial, protective, honest craftsmanship. Factory floor credibility, not a startup showroom. The palette should feel like it belongs to a company that has been forming steel for decades, not one that launched last quarter.

## Color Strategy

**Committed** — the red-oxide primary carries real presence (CTAs, key headings, active states, the brand mark) against a clean, pure-neutral field. The mood lives in the primary + accent, not in a tinted background.

## Color System (OKLCH)

```css
:root {
  /* Core */
  --color-bg:       oklch(1.000 0.000 0);     /* pure white — lets primary carry the industrial warmth */
  --color-surface:  oklch(0.965 0.004 250);   /* faint cool steel-gray — cards, panels, alternating sections */
  --color-ink:      oklch(0.220 0.010 30);    /* body text, ~15:1 on bg */
  --color-muted:    oklch(0.480 0.006 30);    /* secondary text, ~5.3:1 on bg */

  /* Brand */
  --color-primary:      oklch(0.550 0.160 32);  /* red-oxide steel primer — CTAs, links, brand mark */
  --color-primary-ink:  oklch(1.000 0.000 0);   /* white text on primary (saturated mid-L fill) */
  --color-accent:       oklch(0.280 0.060 240); /* dark galvanized steel-blue — spec headers, badges, technical team */
  --color-accent-ink:   oklch(1.000 0.000 0);   /* white text on accent (clearly dark fill) */

  /* Borders / dividers */
  --color-border: oklch(0.880 0.006 250);

  /* Semantic (forms, contact) */
  --color-success: oklch(0.560 0.130 145);
  --color-danger:  oklch(0.550 0.180 25);

  /* Z-index scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}
```

No dark mode for MVP — this is a B2B/B2C catalog + lead-gen site read primarily in daylight/work contexts (job sites, offices); not requested, and the added maintenance isn't justified yet.

## Typography

Thai-first with full Latin coverage for the EN toggle — both families below cover both scripts natively, so no separate Latin pairing is needed.

- **Display / Headings** — `Taviraj` (serif, weights 600/700). A sturdy, slightly formal Thai serif — reads as established and considered rather than trendy. Used for H1–H3, hero statements, section titles.
- **Body / UI** — `Sarabun` (humanist sans, weights 400/500/600). Extremely legible at small sizes in Thai, the de facto professional/official standard — reinforces "reliable." Used for body copy, nav, forms, tables, buttons.
- Contrast axis: serif display vs. sans body — deliberate pairing, not two similar sans-serifs.
- Hero/display clamp ceiling: `clamp(2rem, 5vw, 3.75rem)` (~60px max) — confident but not shouting, and safe for longer Thai headline strings.
- Letter-spacing floor on display: `-0.01em` (Thai script doesn't benefit from Latin-style tight tracking; keep it near-neutral).
- Body line length: cap at 65–75ch equivalent; Thai has no word-spacing, so rely on `line-height: 1.7–1.8` for body text and `text-wrap: pretty` on paragraphs.
- `text-wrap: balance` on H1–H3.

## Spacing & Layout

- 8px base spacing scale (4/8/12/16/24/32/48/64/96/128).
- Flexbox for nav/cards/rows; Grid for the product/spec matrices and branch listings.
- Responsive card/spec grids: `repeat(auto-fit, minmax(280px, 1fr))`.
- Max content width: 1280px, with a 1024px reading column for blog/article pages.
- Section rhythm alternates `--color-bg` and `--color-surface` to separate the long homepage/product pages without relying on cards for everything.

## Components

- **Buttons**: primary (red-oxide fill, white text) for LINE/phone contact CTAs; secondary (outline, ink text) for internal navigation ("View specs", "Download brochure").
- **Spec tables**: accent-colored header row (steel-blue, white text), zebra-striped body rows on `--color-surface`, sticky first column on mobile scroll for profile/thickness comparison.
- **Testimonial blocks**: full-width quote with attribution (name, project type, branch) — no nested cards, no star-rating iconography clichés.
- **Branch cards**: address, map link, phone, LINE — grid of `auto-fit, minmax(280px, 1fr)`.
- **Contact bar**: persistent sticky LINE + phone contact strip on mobile (bottom), header-integrated on desktop.
- **Language toggle**: simple TH/EN switch in the header, persists via URL path (`/en/...`).

## Motion

- Low-key, functional motion only — this is a trust/credibility site, not a campaign page.
- Section reveals: subtle fade + 8px rise on scroll, staggered per grid item (products, testimonials, branches), `ease-out-quart`, 300–400ms.
- No parallax, no bounce/elastic easing.
- All motion respects `prefers-reduced-motion: reduce` (crossfade/instant fallback).

## Imagery

- Real factory, product, and installation photography carries the "traditional & reliable" mood — favor documentary/on-site photos over stock/illustration.
- Corrugated metal texture and color-swatch imagery for the Colors/Materials page should be actual product photography, not flat CSS gradients standing in for material.
