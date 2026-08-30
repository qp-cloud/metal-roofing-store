# Editorial Homepage Reskin — Design

**Date:** 2026-08-31
**Status:** Approved for planning
**Scope:** Thai homepage (`src/pages/index.astro`) plus a site-wide design-token
change and an in-place restyle of the shared header and footer.

## Background

`saas-landing-template.zip` shipped a prebuilt `dist/` that is an editorial
treatment of this same metal-roofing content: a navy-and-gold Swiss-typographic
layout with numbered section indices (`01 / WHAT WE SUPPLY`), bracketed metadata
labels, hairline rule lines, an asymmetric hero, and a dark "product range"
selector band. The goal is to rebuild the Thai homepage in that visual language
while keeping the real Meechai Steel content and data model.

The existing site is a well-factored Astro project. Almost all styling reads
semantic CSS custom properties (`--color-primary`, `--color-accent`,
`--color-ink`, `--color-muted`, spacing and radius scales) declared once in
`src/styles/global.css`. Changing those values cascades to every page. The only
colour literals outside `global.css` are three rust `oklch()` values in
`Badge.astro` and a few light-on-dark greys in `Footer.astro`.

## Decisions (from clarifying questions)

1. **Visual identity:** adopt the dist's navy + gold editorial palette and
   typography site-wide (token rewrite). Every page inherits the new palette.
2. **Content:** keep the existing Meechai Steel data — `src/data/products.ts`,
   `testimonials.ts`, `site.ts`, `configurator.ts`. No invented product lines.
3. **Pages:** Thai homepage only. `src/pages/en/index.astro` is untouched this
   round; it keeps its current look and its `<ConfiguratorCTA>`.
4. **Chrome:** restyle `Header.astro` and `Footer.astro` in place (style blocks
   only; markup and JS unchanged).

## Approach

Approach A of three considered:

- **A (chosen):** rewrite the token values in `global.css`, add one small
  `SectionHeader.astro` primitive, rebuild the homepage body against existing
  data, and restyle header/footer in place. One new component, bounded blast
  radius.
- **B (rejected):** homepage-scoped tokens under an `.editorial` wrapper, no
  global change, header/footer variant-switched by path. Contradicts decisions 1
  and 4 and makes the header fragile.
- **C (rejected):** a full editorial component library (`Section`,
  `EditorialCard`, `IndexList`, `RangePanel`, `StatTile`). Closest to the dist
  polish but a multi-page project; YAGNI for a single-page rebuild.

## Design tokens — `src/styles/global.css`

Token **names** are unchanged so the cascade keeps working. Values change; five
new tokens are added.

| Token | New value | Notes |
| --- | --- | --- |
| `--color-bg` | `oklch(0.995 0.004 95)` | warm paper, ~`#fffdf8` |
| `--color-surface` | `oklch(0.975 0.003 245)` | cool paper, ~`#f6f7f8` |
| `--color-ink` | `oklch(0.23 0.008 250)` | near-black with a blue cast |
| `--color-muted` | `oklch(0.52 0.03 250)` | blue-grey, ~`#657689` |
| `--color-primary` | `oklch(0.76 0.145 74)` | signal gold, ~`#eea51b` |
| `--color-primary-hover` | `oklch(0.68 0.13 70)` | darker gold |
| `--color-primary-ink` | `oklch(0.20 0.01 60)` | dark ink on gold — a flip from white |
| `--color-accent` | `oklch(0.27 0.045 252)` | navy, ~`#102a43` |
| `--color-accent-ink` | `oklch(0.97 0.01 250)` | unchanged intent |
| `--color-border` | `oklch(0.87 0.012 245)` | hairline |
| `--color-success` | `oklch(0.52 0.11 155)` | ~`#177b4d` |
| `--color-danger` | keep current | no editorial equivalent needed |
| `--color-link` *(new)* | `oklch(0.52 0.11 74)` | dark gold for body links (AA on paper) |
| `--color-band` *(new)* | `oklch(0.24 0.04 252)` | dark section-band background |
| `--color-band-ink` *(new)* | `oklch(0.95 0.01 250)` | text on `--color-band` |
| `--color-panel` *(new)* | `oklch(0.93 0.012 245)` | pale inset panel, ~`#e6edf3` |
| `--rule` *(new)* | `oklch(0.82 0.015 245)` | rule line, darker than `--color-border` |

Spacing, radius, z-index, easing, and shadow scales are unchanged.

### Typography

- `--font-display` and `--font-body` both become
  `'IBM Plex Sans Thai', 'Noto Sans Thai', system-ui, sans-serif`. The editorial
  direction is heavy sans; the current Taviraj serif is dropped for headings.
- `h1`–`h4`: `font-weight: 700`, `letter-spacing: -0.02em`, `line-height: 1.15`.
  Existing `clamp()` sizes stay.
- `BaseLayout.astro` swaps the Google Fonts href to
  `family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;600;700;800`.

### New utility classes in `global.css`

- `.label` — all-caps metadata label: `text-transform: uppercase`,
  `letter-spacing: 0.08em`, `font-size: 0.75rem`, `font-weight: 600`,
  `color: var(--color-muted)`. A gold `/` or coordinate dot is styled via a
  child `<span>`.
- `.rule` — `border-top: 1px solid var(--rule)`.
- `.section--band` — `background: var(--color-band); color: var(--color-band-ink);`
  with descendant heading/label colour overrides.

### Link-colour gotcha

`global.css` currently has `a { color: var(--color-primary); }`. With
`--color-primary` now gold, that fails WCAG AA on the paper background. The rule
changes to `a { color: var(--color-link); }` (dark gold). This is the only
change needed for text-link contrast across all ~30 pages.
`thead th` and `:focus-visible` use `--color-accent` (navy) and remain correct.

## New component — `src/components/SectionHeader.astro`

Props:

- `index: string` — e.g. `"01"`.
- `kicker: string` — e.g. `"WHAT WE SUPPLY"` (Latin caps).
- `heading: string`.
- `lede?: string` — optional right-column paragraph.
- `tone?: 'light' | 'dark'` — default `'light'`; `'dark'` uses band-ink colours
  for use inside `.section--band`.

Renders: a `.label` line reading `01 / WHAT WE SUPPLY` (gold slash), a `.rule`
line, an `<h2>` heading, and — when `lede` is set — a two-column desktop grid
with the heading left and the lede right, stacking on mobile.

## Homepage rebuild — `src/pages/index.astro`

Body replaced with the editorial section spine below. Each row lists its data
source. `<AnimatedBackground>` and `<FacebookUpdates>` are kept.
`<ConfiguratorCTA>` is removed from this page only (its role is absorbed into
section 02); the component file is untouched and still used by
`src/pages/en/index.astro`.

| # | Index label | Data source | Structure |
| --- | --- | --- | --- |
| Hero | Bracketed eyebrow `[ ผู้ผลิตและจำหน่ายเมทัลชีท มาตรฐานโรงงาน ]` | current hero copy, `site.ts` | Asymmetric split: headline + lede + two CTAs (`ขอใบเสนอราคาโครงการ`, `สอบถามทาง LINE`) on the left; a dark panel labelled `MATERIAL / ON SITE` on the right containing `<AnimatedBackground>` and a bottom CTA chip linking to `/configurator`. A category-tag strip (`productCategories`) sits below the split. |
| 01 | `01 / WHAT WE SUPPLY` — "วัสดุครบ จบในที่เดียว" | `productCategories`, `products` | `SectionHeader` with lede, then a 4-card `grid-auto` using `Card variant="interactive"`. Each card: a Phosphor icon, a corner `ArrowUpRightIcon`, the `0N` index, the category name, and a sub-line of member product names. Links to `/products#category-<category>`. |
| 02 | `02 / ROOFING METAL SHEET` — "หลังคาเมทัลชีท สวย เรียบ ลดปัญหารั่วซึม" | roofing `products`, `configuratorLink()` | `.section--band` (navy). Left: `SectionHeader tone="dark"`, a lede, a chip row (Metal Sheet / Bolt Type / Clip-Lock / Snap-Lock), and a CTA `ส่งขนาดหลังคาให้เราประเมิน` → `/contact`. Right: a `--color-panel` inset headed `ROOFING / PRODUCT RANGE` with three stat tiles — `760`, `304 Snap-Lock` (gold active state), and a curved-roof icon — each linking to `configuratorLink({ profile: <slug> })`. |
| 03 | `03 / WALL & CEILING` — "เปลี่ยนฝ้าและผนังเดิม ให้ดูโมเดิร์น" | wall + insulation `products` copy | Split: a `<Photo>` slot (neutral placeholder until a real photo lands) on the left; copy, three `CheckIcon` bullets, and a LINE CTA on the right. |
| 04 | `04 / WHY CHOOSE US` — "มีสินค้าจริง ให้คำปรึกษาได้จริง" | the four why-points, kept inline in `index.astro` | `SectionHeader` with lede, then a four-column index. Each column: a `.rule` top border, a gold `0N`, a title, a paragraph. |
| 05 | `05 / MORE MATERIALS` — "ต่อยอดงานให้ครบทุกมุม" | insulation / accessories categories | `SectionHeader` with lede, then a right-aligned three-row definition list (label / description) linking to `/specifications`, `/colors`, and `/products`. |
| 06 | `06 / CLIENT WORK` | `testimonials` | Reskinned quote grid plus a `/testimonials` link. |
| 07 | `07 / UPDATES` | `<FacebookUpdates lang="th" />` | Component kept; token reskin only. |
| 08 | `08 / START YOUR PROJECT` — "พร้อมเริ่มโครงการหลังคาของคุณ?" | `site.ts` | `.section--band` CTA with a gold primary button and an outline button. |

Section-specific CSS (hero split, stat tiles, four-column index, band spacing)
lives in the page's `<style>` block. Reuse `.container`, `.grid-auto`,
`.section`, `.btn` and the `.reveal` scroll pattern already in `global.css`.

## Edited files

| File | Change |
| --- | --- |
| `src/styles/global.css` | token values + 5 new tokens; font stack; `h1`–`h4` weight/tracking; `a` colour → `--color-link`; add `.label`, `.rule`, `.section--band`. |
| `src/layouts/BaseLayout.astro` | Google Fonts href → IBM Plex Sans Thai + Noto Sans Thai. |
| `src/pages/index.astro` | full body rewrite per the spine above; new `<style>`. |
| `src/components/SectionHeader.astro` | **new** primitive. |
| `src/components/Header.astro` | `<style>` only: rule bottom-border, caps nav labels, gold CTA, bracket treatment on the wordmark. Markup and `<script>` unchanged. |
| `src/components/Footer.astro` | `<style>` only: `.label` section headings, top rule. Navy background already comes from `--color-accent`. |
| `src/components/Badge.astro` | three badge-safe tone literals → gold / navy / green; re-verify AA. |
| `src/components/StickyContact.astro` | verify the LINE button (gold background, dark ink) clears AA; adjust if not. |

No data files change. No server or build-config change.

## Out of scope

- `src/pages/en/index.astro` and all other pages — they inherit the new palette
  but are not restyled or re-laid-out.
- The `06 / HEAT INSULATION` and `07 / HOW TO ORDER` sections from the dist —
  replaced by the site's real testimonials and updates content.
- Any change to `Header.astro` navigation structure or behaviour.
- New photography. `<Photo>` slots render their existing placeholders.

## Verification

1. `pnpm check` (astro check) passes with no new errors.
2. `pnpm build` completes; page count unchanged (31).
3. Serve `dist/` with `python3 -m http.server` and screenshot the homepage with
   the cached Playwright Chromium (see the `browser-screenshot-workflow`
   memory) at 1440×desktop and 390×mobile.
4. Spot-screenshot four token-inheritor pages — `/about`, `/products`,
   `/colors`, `/contact` — and confirm the gold/navy cascade reads correctly
   with no contrast regressions.
5. Manual checks: body-link contrast (dark gold on paper) meets AA 4.5:1;
   focus rings remain visible; `prefers-reduced-motion` still freezes
   `AnimatedBackground`; the mobile sticky contact bar and nav toggle still work.

## Risks

- **Palette bleed on unrestyled pages.** Pages that used rust `--color-primary`
  as an accent (services, contact, technical-team, blog) turn gold. Expected and
  accepted under Approach A; step 4 of verification is the check.
- **Gold contrast.** Gold is only ever a background with dark ink, or text via
  the dark-gold `--color-link`. No gold text on white anywhere.
- **Heading font weight.** Thai text at weight 700–800 in IBM Plex Sans Thai /
  Noto Sans Thai renders heavier than the previous Taviraj serif; intended, but
  confirm it does not crowd at mobile `h1` sizes.
