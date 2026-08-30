# Editorial Homepage Reskin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Thai homepage in a navy-and-gold Swiss-editorial style, driven by a site-wide `global.css` token swap plus an in-place restyle of the shared header and footer.

**Architecture:** All colour and type come from CSS custom properties in `src/styles/global.css`; changing the values there re-skins every page. One new presentational component, `SectionHeader.astro`, supplies the numbered `01 / KICKER` + rule-line + heading motif used across the homepage. The homepage body (`src/pages/index.astro`) is rewritten section by section against the existing data modules — no data files change.

**Tech Stack:** Astro 5 (static output), Astro `<style>` scoped CSS, `@phosphor-icons/react/dist/ssr` icons rendered at build time, IBM Plex Sans Thai + Noto Sans Thai web fonts.

**Spec:** `docs/superpowers/specs/2026-08-31-editorial-homepage-reskin-design.md`

## Global Constraints

- **No test runner exists.** Every task is verified by: `pnpm check` (astro check) clean, `pnpm build` succeeds with **31 pages**, then a screenshot via the recipe below with explicit visual assertions. Commit at the end of every task.
- **Scope:** Thai homepage only. Do **not** edit `src/pages/en/index.astro` or any other page. Other pages inherit the new palette by cascade and are only spot-checked (Task 9).
- **Token names are frozen.** Only change token *values* in `global.css` and add the five new tokens named in the spec (`--color-link`, `--color-band`, `--color-band-ink`, `--color-panel`, `--rule`). Never rename an existing token.
- **`Header.astro` markup and `<script>` are frozen.** Only its `<style>` block changes. Same for `Footer.astro` (style block only).
- **Colour rule:** gold (`--color-primary`) is only ever a background behind dark ink, or text via `--color-link` (dark gold). Never gold text on a light background.
- **Content:** use the existing Thai copy from the current `src/pages/index.astro` and the data modules verbatim. Do not invent product lines, testimonials, or specs.
- **Icons:** import from `@phosphor-icons/react/dist/ssr`; the SSR export names all end in `Icon` (e.g. `HouseLineIcon`). Pass `aria-hidden="true"` on every decorative icon.
- **Reduced motion:** do not add new animation. The existing `.reveal` scroll pattern and `AnimatedBackground` already handle `prefers-reduced-motion`.

### Screenshot recipe (used by every task)

```bash
# from repo root, after `pnpm build`
( cd dist && python3 -m http.server 8099 --bind 127.0.0.1 ) &
SRV=$!
sleep 1
CH=~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
SHOT=/tmp/claude-1000/-mnt-e-Cluade-metal-roofing-store/78ff8d03-c0a4-4da6-8f0d-67d654ec6ee3/scratchpad
"$CH" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1440,3600 \
  --screenshot="$SHOT/home-desktop.png" http://127.0.0.1:8099/
"$CH" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=390,2600 \
  --screenshot="$SHOT/home-mobile.png" http://127.0.0.1:8099/
kill $SRV
```

Then `Read` the PNG(s). **Never** `pkill -f http.server` — it matches the running shell. Use the captured `$SRV` pid or `fuser -k 8099/tcp`.

---

## File Structure

| File | Responsibility | Change |
| --- | --- | --- |
| `src/styles/global.css` | single source of design tokens + base element styles + shared utilities | modify: token values, 5 new tokens, font stack, heading weight, link colour, add `.label` / `.rule` / `.section--band` |
| `src/layouts/BaseLayout.astro` | document shell, font loading | modify: Google Fonts `<link>` href only |
| `src/components/SectionHeader.astro` | numbered editorial section header (`01 / KICKER` + rule + heading + optional lede) | **create** |
| `src/pages/index.astro` | Thai homepage body + page-scoped section CSS | modify: full body + `<style>` rewrite |
| `src/components/Header.astro` | site header (sticky nav) | modify: `<style>` block only |
| `src/components/Footer.astro` | site footer | modify: `<style>` block only |
| `src/components/Badge.astro` | small status badge | modify: three tone colour literals |
| `src/components/StickyContact.astro` | mobile fixed call/LINE bar | modify only if contrast check fails |

Task order: 1 tokens → 2 primitive → 3–5 homepage body → 6 header → 7 footer → 8 badge/sticky → 9 verification sweep. Tasks 3–5 edit the same file in sequence.

---

## Task 1: Design tokens, fonts, and link colour

**Files:**
- Modify: `src/styles/global.css:1-118` (`:root` block, `body`, `h1`–`h4`, `a`)
- Modify: `src/layouts/BaseLayout.astro:28-31` (font `<link>`)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties consumed by every later task —
  `--color-bg`, `--color-surface`, `--color-ink`, `--color-muted`,
  `--color-primary`, `--color-primary-hover`, `--color-primary-ink`,
  `--color-accent`, `--color-accent-ink`, `--color-border`, `--color-success`,
  `--color-link`, `--color-band`, `--color-band-ink`, `--color-panel`, `--rule`.

- [ ] **Step 1: Replace the `:root` colour block in `src/styles/global.css`**

Replace lines 2-20 (the `/* Core */`, `/* Brand */`, `--color-border`/`--color-success`/`--color-danger`, and the two `--font-*` lines) with:

```css
  /* Core */
  --color-bg: oklch(0.995 0.004 95);
  --color-surface: oklch(0.975 0.003 245);
  --color-ink: oklch(0.23 0.008 250);
  --color-muted: oklch(0.52 0.03 250);

  /* Brand */
  --color-primary: oklch(0.76 0.145 74);
  --color-primary-hover: oklch(0.68 0.13 70);
  --color-primary-ink: oklch(0.2 0.01 60);
  --color-accent: oklch(0.27 0.045 252);
  --color-accent-ink: oklch(0.97 0.01 250);

  /* Editorial additions */
  --color-link: oklch(0.52 0.11 74);
  --color-band: oklch(0.24 0.04 252);
  --color-band-ink: oklch(0.95 0.01 250);
  --color-panel: oklch(0.93 0.012 245);
  --rule: oklch(0.82 0.015 245);

  --color-border: oklch(0.87 0.012 245);
  --color-success: oklch(0.52 0.11 155);
  --color-danger: oklch(0.55 0.18 25);

  --font-display: 'IBM Plex Sans Thai', 'Noto Sans Thai', system-ui, sans-serif;
  --font-body: 'IBM Plex Sans Thai', 'Noto Sans Thai', system-ui, sans-serif;
```

Leave the spacing, `--content-*`, radius, z-index, `--ease-out-quart`, and `--shadow-*` lines exactly as they are.

- [ ] **Step 2: Bump heading weight/tracking**

In the `h1, h2, h3, h4` rule (around line 80-90) change `font-weight: 600;` to `font-weight: 700;`, `line-height: 1.25;` to `line-height: 1.15;`, and `letter-spacing: -0.01em;` to `letter-spacing: -0.02em;`.

- [ ] **Step 3: Point body links at the dark-gold token**

Change the `a` rule (around line 110):

```css
a {
  color: var(--color-link);
}
```

- [ ] **Step 4: Swap the font `<link>` in `src/layouts/BaseLayout.astro`**

Replace the `href` on the stylesheet `<link>` (line 29) with:

```
https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;600;700;800&display=swap
```

- [ ] **Step 5: Check and build**

Run: `pnpm check && pnpm build`
Expected: no errors; `pnpm build` prints `31 page(s) built`.

- [ ] **Step 6: Screenshot and eyeball**

Run the screenshot recipe. `Read` `home-desktop.png`.
Expected: layout is still the OLD homepage structure, but the palette has shifted — background is warm off-white, headings are a heavy sans (not serif), primary buttons are gold with dark text, body links render dark gold (not bright). No element is invisible or unreadable.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "Reskin design tokens to navy+gold editorial palette

Swap global.css :root colour values, add --color-link/-band/-band-ink/
-panel/--rule, switch heading font to IBM Plex Sans Thai / Noto Sans Thai
at weight 700, and point body links at the dark-gold --color-link so they
still clear AA on the new paper background.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: `SectionHeader` primitive + editorial utilities

**Files:**
- Create: `src/components/SectionHeader.astro`
- Modify: `src/styles/global.css` (append `.label`, `.rule`, `.section--band` after the existing utility rules, before `:focus-visible`)

**Interfaces:**
- Consumes: colour tokens from Task 1.
- Produces:
  - `<SectionHeader index={string} kicker={string} heading={string} lede?={string} tone?={'light' | 'dark'} />` — Astro component, default export via file.
  - CSS classes `.label` (caps metadata text), `.rule` (1px top rule), `.section--band` (navy full-bleed section) usable by any later task.

- [ ] **Step 1: Append the utility classes to `src/styles/global.css`**

Add just before the `.visually-hidden` rule:

```css
.label {
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted);
  margin: 0;
}

.rule {
  border-top: 1px solid var(--rule);
}

.section--band {
  background: var(--color-band);
  color: var(--color-band-ink);
}

.section--band :is(h1, h2, h3, h4) {
  color: var(--color-band-ink);
}

.section--band a:not(.btn) {
  color: var(--color-primary);
}
```

- [ ] **Step 2: Create `src/components/SectionHeader.astro`**

```astro
---
interface Props {
  index: string;
  kicker: string;
  heading: string;
  lede?: string;
  tone?: 'light' | 'dark';
}

const { index, kicker, heading, lede, tone = 'light' } = Astro.props;
---

<header class:list={['section-header', `section-header--${tone}`]}>
  <p class="label section-header__kicker">
    <span class="section-header__index">{index}</span>
    <span class="section-header__slash" aria-hidden="true">/</span>
    {kicker}
  </p>
  <div class="rule section-header__rule"></div>
  <div class="section-header__body">
    <h2 class="section-header__heading">{heading}</h2>
    {lede && <p class="section-header__lede">{lede}</p>}
  </div>
</header>

<style>
  .section-header {
    margin-bottom: var(--space-6);
  }

  .section-header__kicker {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: var(--space-3);
  }

  .section-header__index {
    color: var(--color-ink);
    font-weight: 700;
  }

  .section-header__slash {
    color: var(--color-primary);
  }

  .section-header__rule {
    margin-bottom: var(--space-4);
  }

  .section-header__body {
    display: grid;
    gap: var(--space-3);
  }

  .section-header__heading {
    margin: 0;
  }

  .section-header__lede {
    margin: 0;
    max-width: 46ch;
    color: var(--color-muted);
  }

  @media (min-width: 900px) {
    .section-header__body {
      grid-template-columns: 1.1fr 0.9fr;
      align-items: end;
      gap: var(--space-6);
    }

    .section-header__lede {
      justify-self: end;
    }
  }

  .section-header--dark .section-header__kicker,
  .section-header--dark .section-header__lede {
    color: color-mix(in oklab, var(--color-band-ink) 72%, transparent);
  }

  .section-header--dark .section-header__index {
    color: var(--color-band-ink);
  }

  .section-header--dark .section-header__rule {
    border-top-color: color-mix(in oklab, var(--color-band-ink) 25%, transparent);
  }
</style>
```

- [ ] **Step 3: Temporarily mount it to prove it renders**

At the top of the `<main>` slot content in `src/pages/index.astro` (immediately after `<BaseLayout ...>`), add:

```astro
  <section class="section"><div class="container">
    <SectionHeader index="00" kicker="RENDER TEST" heading="ทดสอบหัวข้อส่วน" lede="ตรวจว่าเส้นคั่นและป้ายกำกับแสดงถูกต้อง" />
  </div></section>
```

and add `import SectionHeader from '../components/SectionHeader.astro';` to the frontmatter.

- [ ] **Step 4: Check, build, screenshot**

Run: `pnpm check && pnpm build`, then the screenshot recipe; `Read` `home-desktop.png`.
Expected: at the top of the page, a small grey uppercase `00 / RENDER TEST` line with a gold slash, a thin horizontal rule under it, then a heavy heading `ทดสอบหัวข้อส่วน` with the lede text to its right on desktop.

- [ ] **Step 5: Revert the test mount, keep the import**

Delete the `<section>...RENDER TEST...</section>` block from Step 3. Keep the `SectionHeader` import — Task 3 uses it.

Run: `pnpm build` again; expect `31 page(s)` and no `RENDER TEST` text in `dist/index.html` (`grep -c "RENDER TEST" dist/index.html` → `0`).

- [ ] **Step 6: Commit**

```bash
git add src/components/SectionHeader.astro src/styles/global.css src/pages/index.astro
git commit -m "Add SectionHeader primitive and editorial utility classes

New SectionHeader.astro renders the numbered '01 / KICKER' + rule +
heading motif with a light and a dark (on-band) tone. Adds .label, .rule
and .section--band helpers to global.css.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 3: Homepage — frontmatter, hero, category strip, section 01

**Files:**
- Modify: `src/pages/index.astro` (frontmatter; replace the `<section class="hero">` … `<ConfiguratorCTA />` … first products `<section>` region; add page `<style>` for hero + supply grid)

**Interfaces:**
- Consumes: `SectionHeader` (Task 2); `Card` from `src/components/Card.astro` (props `variant`, `href`, `class`); `AnimatedBackground`; `configuratorLink` from `src/data/configurator.ts`; `products`, `productCategories`, `categoryOrder` from `src/data/products.ts`; `site` from `src/data/site.ts`.
- Produces: a `supply` array shape `{ cat, index, label, sub, Icon, href }` and a `roofing` array (used by Task 4), both defined in the frontmatter.

- [ ] **Step 1: Rewrite the frontmatter of `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeader from '../components/SectionHeader.astro';
import Card from '../components/Card.astro';
import AnimatedBackground from '../components/AnimatedBackground.astro';
import FacebookUpdates from '../components/FacebookUpdates.astro';
import { site } from '../data/site';
import { products, productCategories, categoryOrder } from '../data/products';
import { configuratorLink } from '../data/configurator';
import {
  HouseLineIcon,
  WallIcon,
  ThermometerIcon,
  WrenchIcon,
  ArrowUpRightIcon,
  ArrowRightIcon,
  CheckIcon,
  PathIcon,
} from '@phosphor-icons/react/dist/ssr';

const categoryIcons = {
  roofing: HouseLineIcon,
  wall: WallIcon,
  insulation: ThermometerIcon,
  accessories: WrenchIcon,
} as const;

const stripParens = (name: string) => name.replace(/\s*\(.*?\)\s*/g, '').trim();

const supply = categoryOrder.map((cat, i) => {
  const inCat = products.filter((p) => p.category === cat);
  const named = inCat.filter((p) => !p.comingSoon);
  const names = (named.length ? named : inCat).map((p) => stripParens(p.nameTh)).slice(0, 4);
  return {
    cat,
    index: String(i + 1).padStart(2, '0'),
    label: productCategories[cat].th,
    sub: names.join(' · '),
    Icon: categoryIcons[cat],
    href: `/products#category-${cat}`,
  };
});

const roofing = products.filter((p) => p.category === 'roofing');
---
```

- [ ] **Step 2: Replace the hero + ConfiguratorCTA + first products section**

Replace everything from `<section class="hero">` through the end of the `<section class="section" data-reveal-group>` that renders `สินค้าของเรา` (the current lines 16-49) with:

```astro
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__copy">
        <p class="label hero__eyebrow">
          <span aria-hidden="true">[</span>
          ผู้ผลิตและจำหน่ายเมทัลชีท มาตรฐานโรงงาน
          <span aria-hidden="true">]</span>
        </p>
        <h1>แผ่นหลังคาเหล็กจากโรงงาน สำหรับงานผู้รับเหมาและโครงการ</h1>
        <p class="hero__lede">
          ผลิตเอง ตัดตามความยาวหน้างาน คุมสเปกให้เหมือนกันทั้งโครงการ
          พร้อมทีมช่างเทคนิคช่วยคำนวณปริมาณวัสดุก่อนสั่งผลิต
        </p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="/contact">ขอใบเสนอราคาโครงการ</a>
          <a class="btn btn--outline" href={site.lineHref} target="_blank" rel="noopener noreferrer">สอบถามทาง LINE</a>
        </div>
        <p class="hero__reassure">
          <CheckIcon size={16} weight="bold" aria-hidden="true" />
          ส่งอีสานตอนบนและ สปป.ลาว · ปรึกษาฟรีก่อนสั่งผลิต
        </p>
      </div>

      <div class="hero__panel">
        <AnimatedBackground />
        <p class="label hero__panel-label">MATERIAL <span aria-hidden="true">/</span> ON SITE</p>
        <div class="hero__panel-cta">
          <span>ตัดความยาวตามหน้างาน</span>
          <a class="hero__panel-link" href="/configurator">
            ออกแบบ 3D
            <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>

    <div class="container hero__tags">
      {categoryOrder.map((cat) => <span class="hero__tag">{productCategories[cat].th}</span>)}
    </div>
  </section>

  <section class="section" data-reveal-group>
    <div class="container">
      <SectionHeader
        index="01"
        kicker="WHAT WE SUPPLY"
        heading="วัสดุครบ จบในที่เดียว"
        lede="เลือกสินค้าให้ตรงกับงานของคุณ พร้อมคำแนะนำเรื่องสเปก ลอน สี และปริมาณวัสดุก่อนสั่งซื้อ"
      />
      <div class="grid-auto supply-grid">
        {supply.map(({ index, label, sub, Icon, href }) => (
          <Card variant="interactive" href={href} class="supply-card reveal">
            <span class="supply-card__icon"><Icon size={26} weight="light" aria-hidden="true" /></span>
            <span class="supply-card__arrow" aria-hidden="true"><ArrowUpRightIcon size={18} weight="bold" /></span>
            <span class="label supply-card__index">{index}</span>
            <h3>{label}</h3>
            <p>{sub}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
```

Keep the rest of the current body (the `ทำไมต้องมีชัยสตีล`, testimonials, `<FacebookUpdates>`, and `cta-band` sections) untouched for now — Tasks 4 and 5 replace them.

- [ ] **Step 3: Replace the page `<style>` block's hero rules and add supply-grid rules**

In the `<style>` block at the bottom of the file, replace the `.hero`, `.hero__inner`, `.hero__lede`, `.hero__actions`, `.hero__media`, `.hero__eyebrow`, and the `@media (max-width: 800px)` hero rules with:

```css
  .hero {
    padding-block: var(--space-8) var(--space-6);
  }

  .hero__inner {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: var(--space-6);
    align-items: stretch;
  }

  .hero__eyebrow {
    display: flex;
    gap: 0.4rem;
    margin-bottom: var(--space-3);
    color: var(--color-muted);
  }

  .hero__eyebrow span {
    color: var(--color-primary);
  }

  .hero__lede {
    font-size: 1.1rem;
    color: var(--color-muted);
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }

  .hero__reassure {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: var(--space-3);
    font-size: 0.9rem;
    color: var(--color-muted);
  }

  .hero__panel {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 340px;
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    background: var(--color-band);
    color: var(--color-band-ink);
  }

  .hero__panel-label {
    position: relative;
    z-index: 1;
    color: color-mix(in oklab, var(--color-band-ink) 70%, transparent);
  }

  .hero__panel-label span {
    color: var(--color-primary);
  }

  .hero__panel-cta {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    padding-top: var(--space-3);
    border-top: 1px solid color-mix(in oklab, var(--color-band-ink) 22%, transparent);
    font-weight: 600;
  }

  .hero__panel-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--color-primary);
    text-decoration: none;
  }

  .hero__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-4);
    padding-top: var(--space-3);
    border-top: 1px solid var(--rule);
  }

  .hero__tag {
    font-size: 0.82rem;
    color: var(--color-muted);
  }

  .hero__tag:not(:last-child)::after {
    content: '·';
    margin-left: var(--space-2);
    color: var(--color-primary);
  }

  .supply-grid {
    margin-top: var(--space-2);
  }

  .supply-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .supply-card__icon {
    color: var(--color-primary);
    margin-bottom: var(--space-2);
  }

  .supply-card__arrow {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    color: var(--color-muted);
    transition: color 180ms var(--ease-out-quart), transform 180ms var(--ease-out-quart);
  }

  .supply-card:hover .supply-card__arrow {
    color: var(--color-primary);
    transform: translate(2px, -2px);
  }

  .supply-card__index {
    color: var(--color-muted);
  }

  .supply-card h3 {
    font-size: 1.1rem;
    margin: 0;
  }

  .supply-card p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-muted);
  }

  @media (max-width: 860px) {
    .hero__inner {
      grid-template-columns: 1fr;
    }

    .hero__panel {
      order: -1;
      min-height: 240px;
    }
  }
```

Leave `.product-card`, `.point`, `.quote`, `.section-cta`, `.cta-band__inner` rules in place for now (Tasks 4-5 remove the ones they replace).

- [ ] **Step 4: Check and build**

Run: `pnpm check && pnpm build`
Expected: no errors; `31 page(s)`.

- [ ] **Step 5: Screenshot desktop + mobile**

Run the screenshot recipe; `Read` both PNGs.
Expected desktop: asymmetric hero — bracketed grey eyebrow, heavy `h1`, two buttons (gold + outline), a check reassurance line on the left; a dark navy panel on the right with faint animated ribs, a `MATERIAL / ON SITE` label top-left and a bordered CTA row at its bottom. A `·`-separated category-tag strip under a rule. Below: `01 / WHAT WE SUPPLY` header and a 4-card grid, each card with a gold line-icon top-left, a corner arrow top-right, a `0N`, a category name, and a `·`-joined product list.
Expected mobile: panel stacks above the copy; cards single-column; nothing overflows horizontally.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro
git commit -m "Rebuild homepage hero and supply grid in editorial style

Asymmetric hero with a dark AnimatedBackground panel, a category-tag
strip, and section 01 'WHAT WE SUPPLY' as a 4-card grid wired to
productCategories. Drops the standalone ConfiguratorCTA from the home
page (its role moves into section 02).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4: Homepage — section 02 (roofing band) and section 03 (wall & ceiling)

**Files:**
- Modify: `src/pages/index.astro` (replace the `ทำไมต้องมีชัยสตีล` section with sections 02 + 03; add their `<style>` rules)

**Interfaces:**
- Consumes: `roofing` array and `configuratorLink` (Task 3 frontmatter); `SectionHeader` with `tone="dark"`; `CheckIcon`, `PathIcon` (Task 3 imports); `site.lineHref`.
- Produces: nothing new for later tasks.

- [ ] **Step 1: Replace the `section--surface` "ทำไมต้องมีชัยสตีล" block**

Replace the current `<section class="section section--surface">` … `ทำไมต้องมีชัยสตีล` … `</section>` (current lines 51-73) with:

```astro
  <section class="section section--band roofing" data-reveal-group>
    <div class="container roofing__inner">
      <div class="roofing__copy">
        <SectionHeader
          index="02"
          kicker="ROOFING METAL SHEET"
          heading="หลังคาเมทัลชีท สวย เรียบ ลดปัญหารั่วซึม"
          tone="dark"
          lede="เลือกหลังคาให้เหมาะกับบ้าน อาคาร โรงงาน และโกดัง พร้อมบริการสั่งผลิตและตัดความยาวตามขนาดหน้างาน"
        />
        <ul class="roofing__chips">
          {roofing.map((p) => <li>{p.nameTh.replace(/\s*\(.*?\)\s*/g, '').trim()}</li>)}
        </ul>
        <a class="btn btn--primary" href="/contact">ส่งขนาดหลังคาให้เราประเมิน</a>
      </div>

      <div class="roofing__panel">
        <p class="label roofing__panel-label">ROOFING <span aria-hidden="true">/</span> PRODUCT RANGE</p>
        <div class="range-tiles">
          <a class="range-tile" href={configuratorLink({ profile: 'bolt-type' })}>
            <span class="range-tile__value">760</span>
            <span class="range-tile__name">ลอนมาตรฐาน</span>
          </a>
          <a class="range-tile range-tile--active" href={configuratorLink({ profile: 'snap-lock' })}>
            <span class="range-tile__value">304</span>
            <span class="range-tile__name">Snap-Lock</span>
          </a>
          <a class="range-tile" href={configuratorLink({ profile: 'clip-lock' })}>
            <span class="range-tile__value" aria-hidden="true"><PathIcon size={30} weight="bold" /></span>
            <span class="range-tile__name">หลังคาโค้ง</span>
          </a>
        </div>
        <p class="roofing__note">
          <CheckIcon size={15} weight="bold" aria-hidden="true" />
          สั่งตัดความยาวต่อเนื่อง ลดรอยต่อและเศษวัสดุ
        </p>
      </div>
    </div>
  </section>

  <section class="section wall" data-reveal-group>
    <div class="container wall__inner">
      <div class="wall__media" role="img" aria-label="แผ่นผนังและฝ้าเมทัลชีทลายไม้ในอาคารสมัยใหม่"></div>
      <div class="wall__copy">
        <SectionHeader
          index="03"
          kicker="WALL & CEILING"
          heading="เปลี่ยนฝ้าและผนังเดิม ให้ดูโมเดิร์นด้วยลายไม้"
          lede="แผ่นผนังและฝ้าเมทัลชีท ผิวเรียบ น้ำหนักเบา ติดตั้งรวดเร็ว เหมาะกับบ้าน คาเฟ่ ร้านค้า และสำนักงาน"
        />
        <ul class="wall__points">
          <li><CheckIcon size={16} weight="bold" aria-hidden="true" /> ลายไม้และสีเรียบแบบใหม่</li>
          <li><CheckIcon size={16} weight="bold" aria-hidden="true" /> ลดปัญหาฝ้าเดิมบวมน้ำและเป็นสนิม</li>
          <li><CheckIcon size={16} weight="bold" aria-hidden="true" /> เหมาะกับงานภายในและภายนอก</li>
        </ul>
        <a class="btn btn--outline" href={site.lineHref} target="_blank" rel="noopener noreferrer">สอบถามทาง LINE</a>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add section 02 + 03 rules to the page `<style>` block**

```css
  .roofing__inner,
  .wall__inner {
    display: grid;
    gap: var(--space-6);
    align-items: center;
  }

  @media (min-width: 900px) {
    .roofing__inner {
      grid-template-columns: 1.05fr 0.95fr;
    }

    .wall__inner {
      grid-template-columns: 0.9fr 1.1fr;
    }
  }

  .roofing__chips {
    list-style: none;
    margin: 0 0 var(--space-4);
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .roofing__chips li {
    padding: 0.3rem 0.7rem;
    border: 1px solid color-mix(in oklab, var(--color-band-ink) 30%, transparent);
    border-radius: var(--radius-full);
    font-size: 0.82rem;
  }

  .roofing__panel {
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    background: var(--color-panel);
    color: var(--color-ink);
  }

  .roofing__panel-label {
    margin-bottom: var(--space-3);
  }

  .roofing__panel-label span {
    color: var(--color-primary);
  }

  .range-tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
  }

  .range-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    padding: var(--space-3) var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-bg);
    color: var(--color-ink);
    text-decoration: none;
    text-align: center;
    transition: border-color 180ms var(--ease-out-quart), transform 180ms var(--ease-out-quart);
  }

  .range-tile:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  .range-tile--active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-primary-ink);
  }

  .range-tile__value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 1;
  }

  .range-tile__name {
    font-size: 0.78rem;
  }

  .roofing__note {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: var(--space-3) 0 0;
    font-size: 0.85rem;
    color: var(--color-muted);
  }

  .wall__media {
    aspect-ratio: 4 / 3;
    border-radius: var(--radius-lg);
    background:
      linear-gradient(135deg, var(--color-accent) 0%, var(--color-band) 60%, var(--color-primary) 160%);
  }

  .wall__points {
    list-style: none;
    margin: 0 0 var(--space-4);
    padding: 0;
    display: grid;
    gap: var(--space-2);
  }

  .wall__points li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .wall__points svg {
    color: var(--color-primary);
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    .range-tiles {
      grid-template-columns: 1fr;
    }

    .wall__media {
      order: -1;
    }
  }
```

Delete the now-unused `.point h3` and `.point p` rules from the `<style>` block.

- [ ] **Step 3: Check, build, screenshot**

Run: `pnpm check && pnpm build`, then the screenshot recipe; `Read` both PNGs.
Expected: section 02 is a full-bleed navy band — light heading + kicker, pill chips (four roofing profile names), a gold CTA button, and on the right a pale inset panel titled `ROOFING / PRODUCT RANGE` holding three tiles `760` / `304 Snap-Lock` (gold, filled) / a curved-path icon, with a check note under. Section 03 has a diagonal-gradient media block and copy with three gold check bullets and an outline CTA. Mobile: everything single-column, media above copy, tiles stacked; no horizontal scroll.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add editorial sections 02 (roofing band) and 03 (wall & ceiling)

Section 02 is a navy .section--band with a pale 'PRODUCT RANGE' panel
whose tiles deep-link into the configurator by profile. Section 03 is a
split media/copy block. Removes the old .point styles.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 5: Homepage — sections 04–07, updates, and final CTA

**Files:**
- Modify: `src/pages/index.astro` (replace the testimonials section, keep `<FacebookUpdates>`, replace the `cta-band` section; add their `<style>` rules; remove dead styles)

**Interfaces:**
- Consumes: `SectionHeader`; `site.lineHref`, `site.lineId`, `site.phone`, `site.phoneHref` from `site`; `<FacebookUpdates lang="th" />`.
- Produces: nothing.

- [ ] **Step 1: Replace the testimonials `<section>` with sections 04, 05, 06**

Replace the current `<section class="section">` … `เสียงจากลูกค้า` … `</section>` (current lines 75-91) with:

```astro
  <section class="section section--surface" data-reveal-group>
    <div class="container">
      <SectionHeader
        index="04"
        kicker="WHY CHOOSE US"
        heading="มีสินค้าจริง ให้คำปรึกษาได้จริง"
        lede="ตั้งแต่เลือกวัสดุไปจนถึงสั่งผลิต ทีมช่างเทคนิคช่วยถอดแบบและคำนวณปริมาณให้ก่อนตัดสินใจ"
      />
      <ol class="why-grid">
        <li class="why reveal">
          <span class="label why__index">01</span>
          <h3>สั่งผลิตตามความยาวหน้างาน</h3>
          <p>ตัดตามความยาวจริงของแต่ละช่วงหลังคา ลดรอยต่อ ลดเศษเหลือ และลดงานตัดหน้างาน</p>
        </li>
        <li class="why reveal">
          <span class="label why__index">02</span>
          <h3>คำนวณปริมาณวัสดุให้ก่อนสั่ง</h3>
          <p>ส่งแบบมา ทีมช่างเทคนิคช่วยถอดปริมาณ (Taking-off) และแนะนำระบบยึดที่เหมาะกับงาน</p>
        </li>
        <li class="why reveal">
          <span class="label why__index">03</span>
          <h3>ส่งข้ามแดนไป สปป.ลาว</h3>
          <p>อยู่ติดสะพานมิตรภาพไทย–ลาว แห่งที่ 1 ห่างเวียงจันทน์ประมาณ 25 กม.</p>
        </li>
        <li class="why reveal">
          <span class="label why__index">04</span>
          <h3>ใบเสนอราคาตามงานจริง</h3>
          <p>คิดราคาตามสเปก ปริมาณ และหน้างานจริง แจ้งชัดเจนก่อนสั่งผลิต</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section" data-reveal-group>
    <div class="container">
      <SectionHeader
        index="05"
        kicker="MORE MATERIALS"
        heading="ต่อยอดงานให้ครบทุกมุม"
        lede="นอกจากหลังคา เรายังมีฉนวน สี และสเปกให้เทียบ เพื่อวางแผนทั้งโครงการจากผู้ผลิตรายเดียว"
      />
      <dl class="more-list">
        <div class="more-row rule">
          <dt><a href="/products#category-insulation">ฉนวนกันความร้อน</a></dt>
          <dd>PU Foam / PE / EPS ประกบแผ่นเหล็ก ลดความร้อนเข้าอาคารและลดเสียง</dd>
        </div>
        <div class="more-row rule">
          <dt><a href="/colors">สีและเฉดวัสดุ</a></dt>
          <dd>เทียบเฉดหลังคาและผนังก่อนสั่ง เลือกให้เข้ากับงาน</dd>
        </div>
        <div class="more-row rule">
          <dt><a href="/specifications">สเปกสินค้า</a></dt>
          <dd>ความหนา ลอน และการใช้งานของแต่ละระบบ ในตารางเดียว</dd>
        </div>
      </dl>
    </div>
  </section>

  <section class="section section--surface">
    <div class="container">
      <SectionHeader
        index="06"
        kicker="CLIENT WORK"
        heading="ผลงานติดตั้งจริงจากหน้างาน"
        lede="ดูงานหลังคา ผนัง และฉนวนที่ติดตั้งจริง พร้อมรีวิวจากลูกค้าบนเฟซบุ๊ก"
      />
      <div class="hero__actions">
        <a class="btn btn--primary" href="/gallery">ดูผลงานทั้งหมด</a>
        <a class="btn btn--outline" href="/testimonials">รีวิวลูกค้า</a>
      </div>
    </div>
  </section>
```

Rationale for section 06: `src/data/testimonials.ts` is intentionally empty (real reviews live on Facebook), so this section links out instead of rendering an empty quote grid.

- [ ] **Step 2: Leave `<FacebookUpdates lang="th" />` exactly where it is**

It already renders its own `<section>` with its own heading and self-hides when there are no posts. Do not wrap it in a `SectionHeader`. No change to this line.

- [ ] **Step 3: Replace the `cta-band` section**

Replace the current `<section class="section section--surface cta-band">` … `</section>` (current lines 95-106) with:

```astro
  <section class="section section--band cta-band">
    <div class="container cta-band__inner">
      <SectionHeader
        index="07"
        kicker="START YOUR PROJECT"
        heading="พร้อมเริ่มโครงการหลังคาของคุณ?"
        tone="dark"
        lede="ทักแชท LINE หรือโทรหาทีมขาย รับคำปรึกษาฟรีก่อนตัดสินใจ"
      />
      <div class="hero__actions">
        <a class="btn btn--primary" href={site.lineHref} target="_blank" rel="noopener noreferrer">แชท LINE: {site.lineId}</a>
        <a class="btn btn--outline cta-band__outline" href={site.phoneHref}>โทร {site.phone}</a>
      </div>
    </div>
  </section>
```

- [ ] **Step 4: Update the page `<style>` block — remove dead rules, add sections 04–07**

Delete these now-unused rules: `.product-card`, `.product-card:hover`, `.product-card h3`, `.product-card p`, `.quote`, `.quote p`, `.quote footer`, `.quote__branch`, `.section-cta`, `.section-cta a`.

Change `.cta-band__inner` and add the rest:

```css
  .why-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-4);
  }

  .why {
    padding-top: var(--space-3);
  }

  .why__index {
    display: block;
    margin-bottom: var(--space-2);
    color: var(--color-primary);
  }

  .why h3 {
    font-size: 1.05rem;
  }

  .why p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-muted);
  }

  .more-list {
    margin: 0;
  }

  .more-row {
    display: grid;
    gap: var(--space-1);
    padding: var(--space-4) 0;
  }

  .more-row dt {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.1rem;
  }

  .more-row dd {
    margin: 0;
    color: var(--color-muted);
    font-size: 0.92rem;
  }

  @media (min-width: 720px) {
    .more-row {
      grid-template-columns: 0.4fr 0.6fr;
      align-items: baseline;
      gap: var(--space-4);
    }
  }

  .cta-band__inner {
    display: grid;
    gap: var(--space-4);
  }

  .cta-band__outline {
    color: var(--color-band-ink);
    border-color: color-mix(in oklab, var(--color-band-ink) 40%, transparent);
  }

  .cta-band__outline:hover {
    border-color: var(--color-band-ink);
  }

  @media (max-width: 860px) {
    .why-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 560px) {
    .why-grid {
      grid-template-columns: 1fr;
    }
  }
```

- [ ] **Step 5: Check and build**

Run: `pnpm check && pnpm build`
Expected: no errors; `31 page(s)`. Confirm no leftover references: `grep -n "product-card\|class=\"quote\|ConfiguratorCTA" src/pages/index.astro` → no matches.

- [ ] **Step 6: Full-page screenshot desktop + mobile**

Run the screenshot recipe; `Read` both PNGs.
Expected: section 04 on a paper-surface band — `04 / WHY CHOOSE US`, then a 4-column list, each with a rule on top, a gold `0N`, a title, a paragraph. Section 05 — `05 / MORE MATERIALS` then three ruled rows, each a bold gold-linked term and a muted description. Section 06 — heading + two buttons, no empty grid. Then the Facebook section (or nothing, if no posts). Final navy band `07 / START YOUR PROJECT` with a gold LINE button and a light-outline phone button. Two columns collapse to one on mobile; `why-grid` is 2-up then 1-up; nothing overflows.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add editorial sections 04-07 and drop dead homepage styles

Section 04 numbered why-us index, section 05 'more materials' ruled
definition list, section 06 client-work link-out (testimonials data is
empty by design), section 07 navy final-CTA band. Removes the unused
product-card / quote / section-cta rules.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6: Restyle `Header.astro`

**Files:**
- Modify: `src/components/Header.astro:125-467` (the `<style>` block only)

**Interfaces:**
- Consumes: colour + `--rule` tokens; `.label` is *not* used here (scoped styles can't see it cleanly on child elements without markup change, which is frozen) — restyle via the existing selectors.
- Produces: nothing.

- [ ] **Step 1: Give the header a rule border and tighten the wordmark**

In the `<style>` block:
- `.site-header` — change `border-bottom: 1px solid var(--color-border);` to `border-bottom: 1px solid var(--rule);`.
- `.brand__name` — add `letter-spacing: -0.01em;`.

- [ ] **Step 2: Make the nav labels editorial**

- `.main-nav__list` — add `text-transform: uppercase;` and `letter-spacing: 0.04em;`, change `font-size: 0.95rem;` to `font-size: 0.8rem;`, add `font-weight: 600;`.
- `.nav-toggle` — add `text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600;` and `font-size: 0.8rem;` (overriding the inherited `font: inherit`).
- `.main-nav__list > li > a:hover`, `.main-nav__list > li > a[aria-current='page']`, `.nav-toggle:hover`, `.nav-toggle[aria-expanded='true']` — these already use `var(--color-primary)` for text + underline; that is now gold. Change the text `color` in those four rules to `var(--color-link)` so hovered/active labels stay AA-legible; keep `border-bottom-color: var(--color-primary);` (gold underline is fine).

- [ ] **Step 3: Keep the CTA button readable**

`.btn--sm` needs no change — it inherits `.btn--primary` (gold bg, dark ink from `--color-primary-ink`). Confirm in the screenshot.

- [ ] **Step 4: Dropdown/mega hover colour**

In `.dropdown-panel li a:hover`, `.dropdown-panel li a[aria-current='page']`, `.mega-group li a:hover`, `.mega-group li a[aria-current='page']` — change `color: var(--color-primary);` to `color: var(--color-link);` (keep the `background: var(--color-surface);`).

- [ ] **Step 5: Check, build, screenshot header at two widths**

Run: `pnpm check && pnpm build`, then a screenshot at `--window-size=1440,900` and one at `--window-size=390,900` (URL `http://127.0.0.1:8099/`). `Read` both.
Expected desktop: thin rule under the header, uppercase small-caps nav labels, gold "แชท LINE" button with dark text, hovered/active item shows a gold underline with dark-gold text. Mobile: hamburger visible, tapping it (can't script the tap here — just confirm the toggle button renders as a bordered 40×40 square) — the desktop nav list is hidden below 1200px.

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.astro
git commit -m "Restyle header for editorial look

Rule-line bottom border, uppercase letter-spaced nav labels, and
dark-gold (--color-link) hover/active text so labels stay AA-legible
against the gold underline. Markup and script unchanged.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 7: Restyle `Footer.astro`

**Files:**
- Modify: `src/components/Footer.astro:53-135` (the `<style>` block only)

**Interfaces:**
- Consumes: colour + `--rule` tokens.
- Produces: nothing.

- [ ] **Step 1: Editorial section headings + a top rule**

In the `<style>` block:
- `.site-footer` — keeps `background: var(--color-accent);` (navy). Add `border-top: 3px solid var(--color-primary);` for a gold edge.
- `.site-footer h3` — change to an uppercase metadata label: `text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.72rem; font-weight: 600;` and `color: color-mix(in oklab, var(--color-accent-ink) 65%, transparent);`.
- `.footer-bottom` — change `border-top: 1px solid oklch(1 0 0 / 0.15);` to `border-top: 1px solid color-mix(in oklab, var(--color-accent-ink) 20%, transparent);`.

- [ ] **Step 2: Check, build, screenshot the footer**

Run: `pnpm check && pnpm build`, then the screenshot recipe (`home-desktop.png` at `1440,3600` shows the footer at the bottom). `Read` it.
Expected: navy footer with a thin gold line along its top edge, the three column headings now small uppercase letter-spaced labels, links still light on navy, the copyright rule faint. Contrast of the light-grey `.footer-tagline` / `.footer-hq` (unchanged literals) on navy is still legible.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "Restyle footer for editorial look

Gold top edge, uppercase letter-spaced column labels, token-based
divider. Navy ground already comes from --color-accent.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 8: Badge and StickyContact contrast

**Files:**
- Modify: `src/components/Badge.astro:28-30`
- Modify (only if the check fails): `src/components/StickyContact.astro:47-50`

**Interfaces:**
- Consumes: colour tokens.
- Produces: nothing.

- [ ] **Step 1: Repoint the badge-safe tone literals**

In `Badge.astro` replace the three lines:

```css
  .badge--primary { --badge-color: oklch(0.5 0.11 74); }
  .badge--success { --badge-color: oklch(0.48 0.11 155); }
  .badge--danger  { --badge-color: oklch(0.505 0.17 25); }
```

(`--badge--neutral` still uses `var(--color-accent)`, now navy — fine for both solid white-ink and soft tint.)

- [ ] **Step 2: Reason about the numbers**

`badge--solid` puts `--color-accent-ink` (near-white) on `--badge-color`. `badge--soft` puts `--badge-color` text on a 12%-tint of itself over `--color-bg`. All three lightnesses above are ≤ 0.51, which keeps white-on-fill and tint-text-on-paper above 4.5:1 at the badge's 0.75rem size — the same rationale as the original rust values (which were L≈0.525). No runtime test harness exists to assert this; the constraint is the lightness ceiling.

- [ ] **Step 3: Check the StickyContact LINE button**

`.sticky-contact__link--line` is `background: var(--color-primary)` (gold) with `color: var(--color-primary-ink)` (dark) — inherited from Task 1. That pairing is AA. The plain `.sticky-contact__link` is `var(--color-ink)` on `var(--color-bg)` — unchanged, fine. **No edit needed** unless the screenshot shows otherwise.

- [ ] **Step 4: Check, build, screenshot a page that uses Badge**

Run: `pnpm check && pnpm build`. `Badge` renders where imported — grep: `grep -rl "Badge" src/pages` — screenshot one such page (e.g. `http://127.0.0.1:8099/specifications` if listed, else `/products`) at `1440,3000`. Also screenshot the homepage at `390,2600` and confirm the bottom sticky bar: left "โทร" dark-on-white, right "LINE" dark-on-gold, both readable.
Expected: badges legible in both solid and soft variants; sticky bar contrast fine.

- [ ] **Step 5: Commit**

```bash
git add src/components/Badge.astro
git commit -m "Repoint badge-safe tones to the editorial palette

Gold / green / red kept at lightness <= 0.51 so white-on-fill and
soft-tint text both clear AA at the badge's small size.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 9: Verification sweep

**Files:** none (verification + any tiny fixes surfaced here, each its own commit).

**Interfaces:** none.

- [ ] **Step 1: Clean check + build**

Run: `pnpm check && pnpm build`
Expected: zero errors/warnings from `astro check`; build reports **31 page(s)**. If the count differs, a route was lost — stop and investigate.

- [ ] **Step 2: Homepage screenshots, full height, both viewports**

Run the screenshot recipe. `Read` `home-desktop.png` and `home-mobile.png`.
Assert, top to bottom: editorial hero with dark panel → category strip → `01` supply grid → `02` navy roofing band with PRODUCT RANGE panel → `03` wall/ceiling split → `04` why-us index → `05` more-materials list → `06` client-work link-out → (Facebook section or nothing) → `07` navy final CTA → restyled footer with gold top edge. No horizontal scrollbar at 390px. No serif headings anywhere. No bright-gold text on white.

- [ ] **Step 3: Spot-check four token-inheritor pages**

For each of `http://127.0.0.1:8099/about`, `/products`, `/colors`, `/contact`: screenshot at `1440,3000` and `Read`.
Assert: palette is navy/gold/paper; body links are dark gold and legible; primary buttons are gold with dark text; table headers (`/specifications`, `/products`) are navy with white text; focus styles unaffected; nothing is invisible or clashing. Rust is gone. Note any page that looks broken (not just recoloured) — that is a follow-up ticket, not a fix in this plan unless it is a one-line token miss.

- [ ] **Step 4: Reduced-motion and link-contrast checks**

- Re-run the desktop screenshot with `--force-prefers-reduced-motion` added to the Chromium flags; `Read` it and confirm the hero panel's ribs render as a static gleam (no error, content intact).
- Eyeball a body-copy link (e.g. in section 05) against the paper background: dark gold, clearly a link, comfortably readable. `--color-link` at L≈0.52 C≈0.11 h≈74 on `--color-bg` L≈0.995 exceeds 4.5:1.

- [ ] **Step 5: Final commit if anything was touched**

If Steps 1-4 surfaced a one-line fix (a missed token, a stray rust literal), apply it, rebuild, and commit:

```bash
git add -A
git commit -m "Fix <specific issue> found in verification sweep

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

Otherwise record in the task notes that the sweep passed with no changes.

- [ ] **Step 6: Update the spec status**

In `docs/superpowers/specs/2026-08-31-editorial-homepage-reskin-design.md`, change `**Status:** Approved for planning` to `**Status:** Implemented 2026-08-31`. Commit:

```bash
git add docs/superpowers/specs/2026-08-31-editorial-homepage-reskin-design.md
git commit -m "Mark editorial homepage reskin spec implemented

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**

| Spec item | Task |
| --- | --- |
| Token value rewrite + 5 new tokens | 1 |
| Font stack → IBM Plex + Noto, heading weight 700 | 1 |
| `BaseLayout` font `<link>` | 1 |
| `a { color: var(--color-link) }` gotcha | 1, verified 9 |
| `.label` / `.rule` / `.section--band` utilities | 2 |
| `SectionHeader.astro` (props, light/dark tone) | 2 |
| Hero: bracket eyebrow, dark panel, `AnimatedBackground`, CTA chip, category strip | 3 |
| §01 WHAT WE SUPPLY — 4 category cards from `productCategories` | 3 |
| Drop standalone `<ConfiguratorCTA>` from homepage | 3 |
| §02 ROOFING — navy band, chips, PRODUCT RANGE panel, `configuratorLink` deep-links | 4 |
| §03 WALL & CEILING — split media/copy, check bullets, LINE CTA | 4 |
| §04 WHY CHOOSE US — numbered index, verbatim 4 points | 5 |
| §05 MORE MATERIALS — ruled definition list → /specifications, /colors, /products | 5 |
| §06 CLIENT WORK — link-out (testimonials empty by design) | 5 |
| §07 UPDATES — `<FacebookUpdates>` kept, token reskin only | 5 (left in place) |
| §08 final CTA band → renumbered §07 START YOUR PROJECT | 5 |
| `Header.astro` style-only restyle | 6 |
| `Footer.astro` style-only restyle | 7 |
| `Badge.astro` tone literals | 8 |
| `StickyContact.astro` contrast check | 8 |
| Verify: check, build 31 pages, screenshots, 4 spot-checks, reduced-motion, AA | 9 |

Deviations from the spec, all minor and noted in-task:
- The dist hero panel label `01 / PROJECT MATERIAL` is rendered as `MATERIAL / ON SITE` to avoid colliding with the §01 index (spec already updated to this).
- The final CTA is numbered `07`, not `08` — `<FacebookUpdates>` keeps its own heading and self-hides when empty, so it gets no editorial index number, and the sequence stays contiguous.
- §03 media is a CSS gradient placeholder, not a `<Photo>` slot, to avoid adding a `media.ts` entry; swap to `<Photo>` later.
- §06 links out instead of rendering quotes, because `testimonials.ts` is deliberately empty.

**Placeholder scan:** no "TBD"/"handle edge cases"/"similar to Task N"; every code step has the literal code.

**Type consistency:** `supply` object keys (`cat`, `index`, `label`, `sub`, `Icon`, `href`) defined in Task 3 Step 1, consumed with the same names in Task 3 Step 2. `roofing` defined Task 3, used Task 4. `configuratorLink({ profile: ... })` — single object arg, matches `configuratorLink(params?: Record<string, string | number>)` in `src/data/configurator.ts`. Icon names (`HouseLineIcon`, `WallIcon`, `ThermometerIcon`, `WrenchIcon`, `ArrowUpRightIcon`, `ArrowRightIcon`, `CheckIcon`, `PathIcon`) all verified present in `node_modules/@phosphor-icons/react/dist/ssr/`.
