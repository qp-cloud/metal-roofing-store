# Nav Mega-Menu + Product Taxonomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's flat 14-item header nav with a 6-item nav (mostly click-to-open dropdowns/mega-menu), fold every existing page into the new structure, and restructure product content into a 4-category taxonomy with clearly-marked placeholders for categories that don't exist yet.

**Architecture:** One nested `NavEntry[]` data structure (`src/data/site.ts`) replaces the flat `NavItem[]`, consumed by a rewritten `Header.astro` that renders three item kinds (`link`, `dropdown`, `mega`) and by a new `footerLinks` array for `Footer.astro`. Product data (`src/data/products.ts`) gains a `category` field and `productCategories` labels so `products.astro` can render 4 grouped sections instead of one flat list. New content (insulation PE/EPS, accessories, About's Vision section, Contact's Maps/Hours) ships as real routes/anchors with placeholder copy, marked via the existing `Badge` component (built in a prior refresh, previously unwired on every live page — this is its first real use).

**Tech Stack:** Astro 5.x, TypeScript, vanilla JS for dropdown interaction (no new dependencies), existing `Card`/`Badge` components and design tokens from `src/styles/global.css`.

**Spec:** `docs/superpowers/specs/2026-08-27-nav-megamenu-product-taxonomy-design.md`

## Global Constraints

- No automated test runner exists in this repo. "Testing" means `pnpm check` (expect 0 errors/0 warnings/0 hints) + `pnpm build` (expect success) + manual screenshot verification via the established workflow (`pnpm build`, serve `dist/` with `python3 -m http.server`, screenshot with the cached Playwright Chromium at `~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`).
- **Depth rule:** every mega-menu/dropdown item is exactly 2 levels deep (top-level trigger → its items). Nothing goes 3 levels deep. Anything nested further in the original taxonomy (attributes, sub-types, specific colors/thicknesses) becomes content/sections on that item's own page, never a further submenu.
- **Dropdown mechanics:** click/tap to open, not hover. Only one dropdown open at a time. Closes on outside click, Escape, or selecting an item. Arrow keys move focus between items inside an open panel.
- **No new visual primitives:** reuse `var(--radius-lg)`, `var(--shadow-2)`, `var(--color-border)`, `var(--color-surface)`, `var(--space-*)` tokens exactly as defined in `src/styles/global.css`. No new colors, radii, or shadow values.
- **Placeholder policy:** new content (ฉนวน PE/EPS, อุปกรณ์/อะไหล่, วิสัยทัศน์, โปรโมชั่น, Google Maps, business hours) ships as real routes/anchors with a `<Badge tone="neutral" variant="soft">` "เร็ว ๆ นี้"/"Coming Soon" marker plus honest placeholder copy — never fabricated finished content.
- **TH/EN pairs are edited together** in the same task, mirroring content exactly (same structure, translated copy) — this codebase's existing, unchanged architecture (not something this plan changes).
- One shared `NavEntry[]` data structure drives the menu for both locales — no duplicated per-locale menu markup or logic.
- Gallery category filtering (บ้าน/โรงงาน/อาคาร/งานอื่นๆ), real content for the new categories, and real Google Maps/hours content are explicitly out of scope for this plan (see spec's Non-goals).

---

### Task 1: Nav data model + mega-menu Header rewrite + Footer fix

**Files:**
- Modify: `src/data/site.ts` (replace `NavItem`/`nav` block, add `footerLinks`)
- Modify: `src/components/Header.astro` (full rewrite of nav rendering + interaction script + CSS)
- Modify: `src/components/Footer.astro:3,30-32` (swap `nav.slice(0, 6)` for `footerLinks`)
- Modify: `DESIGN.md` (remove the now-unnecessary header-width-exception note added in the prior UI refresh)

**Interfaces:**
- Produces: `NavEntry` type and `nav: NavEntry[]` export from `src/data/site.ts`, consumed by `Header.astro`. Also `footerLinks: { th: string; en: string; href: string }[]`, consumed by `Footer.astro`.
- `NavEntry` is a discriminated union on `kind`:
  ```ts
  export type NavChild = { th: string; en: string; href: string; isNew?: boolean };
  export type NavGroup = { th: string; en: string; items: NavChild[] };
  export type NavEntry =
    | { kind: 'link'; th: string; en: string; href: string }
    | { kind: 'dropdown'; th: string; en: string; items: NavChild[] }
    | { kind: 'mega'; th: string; en: string; groups: NavGroup[] };
  ```

- [ ] **Step 1: Replace the nav data in `src/data/site.ts`**

Find this block (the existing flat nav):
```ts
export type NavItem = { th: string; en: string; href: string };

export const nav: NavItem[] = [
  { th: 'หน้าแรก', en: 'Home', href: '/' },
  { th: 'เกี่ยวกับเรา', en: 'About Us', href: '/about' },
  { th: 'สินค้า', en: 'Products', href: '/products' },
  { th: 'ออกแบบ 3D', en: '3D Configurator', href: '/configurator' },
  { th: 'สเปกสินค้า', en: 'Specifications', href: '/specifications' },
  { th: 'สี / วัสดุ', en: 'Colors & Materials', href: '/colors' },
  { th: 'บริการ', en: 'Services', href: '/services' },
  { th: 'ทีมช่างเทคนิค', en: 'Technical Team', href: '/technical-team' },
  { th: 'ที่ตั้ง', en: 'Location', href: '/branches' },
  { th: 'ผลงาน', en: 'Our Work', href: '/gallery' },
  { th: 'รีวิวลูกค้า', en: 'Testimonials', href: '/testimonials' },
  { th: 'บทความ', en: 'Blog', href: '/blog' },
  { th: 'โบรชัวร์', en: 'Brochure', href: '/brochure' },
  { th: 'ติดต่อเรา', en: 'Contact', href: '/contact' },
];
```

Replace it entirely with:
```ts
export type NavChild = { th: string; en: string; href: string; isNew?: boolean };
export type NavGroup = { th: string; en: string; items: NavChild[] };
export type NavEntry =
  | { kind: 'link'; th: string; en: string; href: string }
  | { kind: 'dropdown'; th: string; en: string; items: NavChild[] }
  | { kind: 'mega'; th: string; en: string; groups: NavGroup[] };

export const nav: NavEntry[] = [
  { kind: 'link', th: 'หน้าแรก', en: 'Home', href: '/' },
  {
    kind: 'dropdown',
    th: 'เกี่ยวกับเรา',
    en: 'About Us',
    items: [
      { th: 'บริษัทของเรา', en: 'Our Company', href: '/about' },
      { th: 'วิสัยทัศน์', en: 'Vision', href: '/about#vision', isNew: true },
      { th: 'จุดเด่น / มาตรฐาน', en: 'Standards', href: '/about#standards' },
      { th: 'ทีมช่างเทคนิค', en: 'Technical Team', href: '/technical-team' },
    ],
  },
  {
    kind: 'mega',
    th: 'สินค้าและบริการ',
    en: 'Products & Services',
    groups: [
      {
        th: 'ระบบหลังคา',
        en: 'Roofing Systems',
        items: [
          { th: 'หลังคาเมทัลชีท', en: 'Metal Roofing', href: '/products#metal-sheet' },
          { th: 'Snap Lock', en: 'Snap Lock', href: '/products#snap-lock' },
        ],
      },
      {
        th: 'ผนังและฉนวน',
        en: 'Walls & Insulation',
        items: [
          { th: 'ผนัง', en: 'Wall Panels', href: '/products#panel-sheet' },
          { th: 'ฉนวน PU', en: 'PU Foam Insulation', href: '/products#pu-foam' },
          { th: 'ฉนวน PE', en: 'PE Insulation', href: '/products#pe-foam', isNew: true },
          { th: 'ฉนวน EPS', en: 'EPS Insulation', href: '/products#eps', isNew: true },
          { th: 'อุปกรณ์ / อะไหล่', en: 'Accessories & Parts', href: '/products#category-accessories', isNew: true },
        ],
      },
      {
        th: 'เครื่องมือช่วยตัดสินใจ',
        en: 'Decision Tools',
        items: [
          { th: 'สเปกสินค้า', en: 'Specifications', href: '/specifications' },
          { th: 'สี / วัสดุ', en: 'Colors & Materials', href: '/colors' },
          { th: 'ออกแบบ 3D', en: '3D Configurator', href: '/configurator' },
          { th: 'บริการ', en: 'Services', href: '/services' },
        ],
      },
    ],
  },
  {
    kind: 'dropdown',
    th: 'ตัวอย่างผลงาน',
    en: 'Our Work',
    items: [
      { th: 'ผลงานทั้งหมด', en: 'All Work', href: '/gallery' },
      { th: 'รีวิวลูกค้า', en: 'Testimonials', href: '/testimonials' },
      { th: 'บทความ', en: 'Blog', href: '/blog' },
    ],
  },
  { kind: 'link', th: 'โปรโมชั่น', en: 'Promotions', href: '/promotions' },
  {
    kind: 'dropdown',
    th: 'ติดต่อเรา',
    en: 'Contact',
    items: [
      { th: 'ที่อยู่', en: 'Address', href: '/branches' },
      { th: 'โทรศัพท์', en: 'Phone', href: '/contact#phone' },
      { th: 'LINE', en: 'LINE', href: '/contact#line' },
      { th: 'Facebook', en: 'Facebook', href: '/contact#facebook' },
      { th: 'Google Maps', en: 'Google Maps', href: '/contact#map', isNew: true },
      { th: 'เวลาเปิด–ปิด', en: 'Business Hours', href: '/contact#hours', isNew: true },
      { th: 'โบรชัวร์', en: 'Brochure', href: '/brochure' },
    ],
  },
];

export const footerLinks: { th: string; en: string; href: string }[] = [
  { th: 'หน้าแรก', en: 'Home', href: '/' },
  { th: 'เกี่ยวกับเรา', en: 'About Us', href: '/about' },
  { th: 'สินค้าและบริการ', en: 'Products & Services', href: '/products' },
  { th: 'ตัวอย่างผลงาน', en: 'Our Work', href: '/gallery' },
  { th: 'โปรโมชั่น', en: 'Promotions', href: '/promotions' },
  { th: 'ติดต่อเรา', en: 'Contact', href: '/contact' },
];
```

Note: `/products#category-accessories` anchors to the accessories *category section* (added in Task 3), not an individual product — matches the depth rule (อุปกรณ์/อะไหล่'s 4 items are page content, not menu items).

- [ ] **Step 2: Fix `Footer.astro` to use `footerLinks` instead of the old flat `nav`**

In `src/components/Footer.astro`, change:
```astro
import { site, nav } from '../data/site';
```
to:
```astro
import { site, footerLinks } from '../data/site';
```

And change:
```astro
        {nav.slice(0, 6).map((item) => (
          <li><a href={`${prefix}${item.href === '/' ? '' : item.href}` || '/'}>{lang === 'en' ? item.en : item.th}</a></li>
        ))}
```
to:
```astro
        {footerLinks.map((item) => (
          <li><a href={`${prefix}${item.href === '/' ? '' : item.href}` || '/'}>{lang === 'en' ? item.en : item.th}</a></li>
        ))}
```

- [ ] **Step 3: Rewrite `src/components/Header.astro` in full**

Replace the entire file with:

```astro
---
import { Image } from 'astro:assets';
import { nav, site } from '../data/site';
import logo from '../assets/brand/logo.png';

interface Props {
  lang: 'th' | 'en';
  path: string;
}

const { lang, path } = Astro.props;

const basePath = lang === 'en' ? path.replace(/^\/en/, '') || '/' : path;
const thHref = basePath;
// Blog article bodies are Thai-only (no per-article translation yet), so
// the EN toggle from an article falls back to the EN blog listing rather
// than a 404.
const isBlogArticle = /^\/blog\/[^/]+$/.test(basePath);
const enHref = isBlogArticle ? '/en/blog' : basePath === '/' ? '/en' : `/en${basePath}`;

const prefix = lang === 'en' ? '/en' : '';

function localize(href: string) {
  return `${prefix}${href === '/' ? '' : href}` || '/';
}
---

<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href={lang === 'en' ? '/en' : '/'}>
      <Image src={logo} alt="" width={44} height={44} class="brand__mark" />
      <span class="brand__name">{lang === 'en' ? site.nameEn : site.nameTh}</span>
    </a>

    <nav class="main-nav" aria-label={lang === 'en' ? 'Main navigation' : 'เมนูหลัก'}>
      <button class="main-nav__toggle" type="button" aria-expanded="false" aria-controls="main-nav-list">
        <span class="visually-hidden">{lang === 'en' ? 'Toggle menu' : 'เปิดเมนู'}</span>
        <span class="main-nav__toggle-bar" aria-hidden="true"></span>
      </button>
      <ul class="main-nav__list" id="main-nav-list">
        {nav.map((entry) => {
          if (entry.kind === 'link') {
            const href = localize(entry.href);
            const isActive = basePath === entry.href;
            return (
              <li>
                <a href={href} aria-current={isActive ? 'page' : undefined}>
                  {lang === 'en' ? entry.en : entry.th}
                </a>
              </li>
            );
          }

          if (entry.kind === 'dropdown') {
            return (
              <li class="has-dropdown">
                <button class="nav-toggle" type="button" aria-expanded="false" aria-haspopup="true">
                  {lang === 'en' ? entry.en : entry.th}
                  <span class="nav-caret" aria-hidden="true" />
                </button>
                <ul class="dropdown-panel">
                  {entry.items.map((item) => {
                    const itemPath = item.href.split('#')[0];
                    const isActive = itemPath !== '' && basePath === itemPath;
                    return (
                      <li>
                        <a href={localize(item.href)} aria-current={isActive ? 'page' : undefined}>
                          {lang === 'en' ? item.en : item.th}
                          {item.isNew && <span class="new-badge">{lang === 'en' ? 'New' : 'ใหม่'}</span>}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          }

          return (
            <li class="has-dropdown has-mega">
              <button class="nav-toggle" type="button" aria-expanded="false" aria-haspopup="true">
                {lang === 'en' ? entry.en : entry.th}
                <span class="nav-caret" aria-hidden="true" />
              </button>
              <div class="mega-panel">
                {entry.groups.map((group) => (
                  <div class="mega-group">
                    <h3>{lang === 'en' ? group.en : group.th}</h3>
                    <ul>
                      {group.items.map((item) => {
                        const itemPath = item.href.split('#')[0];
                        const isActive = itemPath !== '' && basePath === itemPath;
                        return (
                          <li>
                            <a href={localize(item.href)} aria-current={isActive ? 'page' : undefined}>
                              {lang === 'en' ? item.en : item.th}
                              {item.isNew && <span class="new-badge">{lang === 'en' ? 'New' : 'ใหม่'}</span>}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>

    <div class="header-actions">
      <div class="lang-toggle" role="group" aria-label="Language">
        <a href={thHref} aria-current={lang === 'th' ? 'true' : undefined}>TH</a>
        <span aria-hidden="true">/</span>
        <a href={enHref} aria-current={lang === 'en' ? 'true' : undefined}>EN</a>
      </div>
      <a class="btn btn--primary btn--sm" href={site.lineHref} target="_blank" rel="noopener noreferrer">
        {lang === 'en' ? 'LINE Us' : 'แชท LINE'}
      </a>
    </div>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .site-header__inner {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding-block: var(--space-2);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
    color: var(--color-ink);
    flex-shrink: 0;
  }

  .brand__mark {
    display: block;
    width: 44px;
    height: 44px;
    object-fit: contain;
  }

  .brand__name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.05rem;
    line-height: 1.2;
  }

  .main-nav {
    flex: 1;
    min-width: 0;
  }

  .main-nav__toggle {
    display: none;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .main-nav__toggle-bar,
  .main-nav__toggle-bar::before,
  .main-nav__toggle-bar::after {
    content: '';
    display: block;
    width: 18px;
    height: 2px;
    background: var(--color-ink);
    position: relative;
  }

  .main-nav__toggle-bar::before {
    position: absolute;
    top: -6px;
  }

  .main-nav__toggle-bar::after {
    position: absolute;
    top: 6px;
  }

  .main-nav__list {
    list-style: none;
    display: flex;
    flex-wrap: nowrap;
    gap: var(--space-4);
    margin: 0;
    padding: 0;
    font-size: 0.95rem;
  }

  .main-nav__list > li {
    position: relative;
  }

  .main-nav__list > li > a {
    display: block;
    color: var(--color-ink);
    text-decoration: none;
    padding: 0.4rem 0;
    border-bottom: 2px solid transparent;
  }

  .main-nav__list > li > a:hover,
  .main-nav__list > li > a[aria-current='page'] {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }

  .nav-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--color-ink);
    padding: 0.4rem 0;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    font: inherit;
    font-size: inherit;
    cursor: pointer;
  }

  .nav-toggle:hover,
  .nav-toggle[aria-expanded='true'] {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }

  .nav-caret {
    width: 7px;
    height: 7px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
    margin-top: -3px;
    transition: transform 0.15s ease;
  }

  .nav-toggle[aria-expanded='true'] .nav-caret {
    transform: rotate(225deg);
    margin-top: 3px;
  }

  .dropdown-panel,
  .mega-panel {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2);
    z-index: var(--z-sticky);
  }

  .has-dropdown.is-open .dropdown-panel,
  .has-dropdown.is-open .mega-panel {
    display: block;
  }

  .dropdown-panel {
    list-style: none;
    margin: 4px 0 0;
    padding: var(--space-2);
    min-width: 200px;
  }

  .dropdown-panel li a {
    display: block;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
    color: var(--color-ink);
    text-decoration: none;
    font-size: 0.92rem;
    white-space: nowrap;
  }

  .dropdown-panel li a:hover,
  .dropdown-panel li a[aria-current='page'] {
    background: var(--color-surface);
    color: var(--color-primary);
  }

  .mega-panel {
    padding: var(--space-4);
  }

  .has-dropdown.is-open .mega-panel {
    display: grid;
    grid-template-columns: repeat(3, 200px);
    gap: var(--space-4);
  }

  .mega-group h3 {
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--color-muted);
    margin: 0 0 var(--space-2);
  }

  .mega-group ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .mega-group li a {
    display: block;
    padding: 0.45rem 0.5rem;
    margin-inline: -0.5rem;
    border-radius: var(--radius-sm);
    color: var(--color-ink);
    text-decoration: none;
    font-size: 0.92rem;
    white-space: nowrap;
  }

  .mega-group li a:hover,
  .mega-group li a[aria-current='page'] {
    background: var(--color-surface);
    color: var(--color-primary);
  }

  .new-badge {
    display: inline-block;
    margin-left: 6px;
    font-size: 0.68rem;
    font-weight: 600;
    background: var(--color-surface);
    color: var(--color-muted);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    padding: 1px 7px;
    vertical-align: middle;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .lang-toggle {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .lang-toggle a {
    color: var(--color-muted);
    text-decoration: none;
  }

  .lang-toggle a[aria-current='true'] {
    color: var(--color-primary);
  }

  .btn--sm {
    padding: 0.55rem 1rem;
    font-size: 0.88rem;
    white-space: nowrap;
  }

  /* Breakpoint verified empirically in Step 5 below — 900px is a starting
     point, not a final value. With only 6 short top-level items (vs. the
     prior 14-item flat nav), this should need far less width than the
     1600px/1660px exception the prior UI refresh required; that exception
     is intentionally removed here (see DESIGN.md Step 4). */
  @media (max-width: 900px) {
    .main-nav__toggle {
      display: flex;
    }

    .main-nav__list {
      display: none;
      position: absolute;
      inset-inline: 0;
      top: 100%;
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      flex-direction: column;
      align-items: stretch;
      padding: var(--space-3) var(--space-4);
      gap: var(--space-1);
      max-height: calc(100vh - 64px);
      overflow-y: auto;
    }

    .main-nav {
      position: static;
      display: flex;
      justify-content: flex-end;
    }

    .main-nav.is-open .main-nav__list {
      display: flex;
    }

    .main-nav__list > li {
      width: 100%;
    }

    .nav-toggle {
      width: 100%;
      justify-content: space-between;
      padding: var(--space-2) 0;
    }

    .dropdown-panel,
    .mega-panel {
      position: static;
      display: none;
      border: none;
      box-shadow: none;
      border-radius: 0;
      margin: 0 0 0 var(--space-3);
      padding: 0 0 var(--space-2);
      background: none;
    }

    .has-dropdown.is-open .dropdown-panel {
      display: block;
    }

    .has-dropdown.is-open .mega-panel {
      display: block;
      grid-template-columns: none;
    }

    .mega-group {
      margin-bottom: var(--space-2);
    }
  }
</style>

<script>
  const toggle = document.querySelector<HTMLButtonElement>('.main-nav__toggle');
  const nav = document.querySelector<HTMLElement>('.main-nav');

  toggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });

  const dropdownItems = Array.from(document.querySelectorAll<HTMLLIElement>('.has-dropdown'));

  function closeAllDropdowns(except?: HTMLLIElement) {
    dropdownItems.forEach((li) => {
      if (li === except) return;
      li.classList.remove('is-open');
      li.querySelector<HTMLButtonElement>('.nav-toggle')?.setAttribute('aria-expanded', 'false');
    });
  }

  dropdownItems.forEach((li) => {
    const button = li.querySelector<HTMLButtonElement>('.nav-toggle');
    button?.addEventListener('click', () => {
      const willOpen = !li.classList.contains('is-open');
      closeAllDropdowns();
      if (willOpen) {
        li.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });

    const panel = li.querySelector<HTMLElement>('.dropdown-panel, .mega-panel');
    panel?.addEventListener('keydown', (event) => {
      const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>('a'));
      const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        links[(currentIndex + 1) % links.length]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        links[(currentIndex - 1 + links.length) % links.length]?.focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    const clickedInsideAnyDropdown = dropdownItems.some((li) => li.contains(target));
    if (!clickedInsideAnyDropdown) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllDropdowns();
    }
  });
</script>
```

- [ ] **Step 4: Remove the now-unnecessary header-width exception from `DESIGN.md`**

Find and delete this bullet (added in the prior UI-refresh plan):
```
- **Header is a deliberate exception to the 1280px cap.** `.site-header__inner` caps at 1600px instead of the shared 1280px content max, because the bilingual 14-item nav plus lang toggle plus CTA genuinely cannot fit inside 1280px at any usable font size without wrapping — this was verified during the nav-wrap fix, not an oversight. Every other section on the site uses the shared 1280px cap; if you're tempted to add a second wide-chrome exception elsewhere, check whether the header's constraint actually applies to your case first, and don't "fix" the header by narrowing it back to 1280px or adding matching padding-inline math — that reintroduces the wrap regression this exception exists to prevent.
```

With the nav down to 6 short top-level items, the header no longer needs to exceed the shared 1280px cap — `Header.astro`'s `.site-header__inner` in this rewrite no longer sets a `max-width` override, so it inherits the standard `.container` cap like every other section. No replacement bullet is needed; just remove the stale one.

- [ ] **Step 5: Verify**

Run: `pnpm check` — expect `0 errors`.
Run: `pnpm build` — expect success, 31+ pages (30 existing + this task adds no new routes yet).

Serve `dist/` and screenshot the homepage (`/` and `/en/`) at widths 700, 850, 900, 901, 1024, 1280, 1440 to find the real hamburger/full-nav boundary for the new 6-item nav. If the nav wraps to two lines at any width *above* 900px, raise the breakpoint (and the CSS media query value) until it doesn't — follow the same measurement approach as the prior UI refresh (screenshot at increasing widths until the full nav renders on one line with margin to spare, then set the breakpoint just above that). Re-verify with **both locales** at whatever final breakpoint you land on — EN's "Products & Services" is the longest label and is the binding constraint.

At a desktop width above the breakpoint, click each of the 4 dropdown/mega triggers (เกี่ยวกับเรา, สินค้าและบริการ, ตัวอย่างผลงาน, ติดต่อเรา) and screenshot each open state — confirm: the panel renders with the expected items (per the data in Step 1), a `ใหม่`/`New` badge appears on the 5 items marked `isNew`, and clicking a different trigger closes the previous panel (only one open at a time).

At a mobile width below the breakpoint, open the hamburger, tap each accordion trigger, and screenshot — confirm items expand inline within the drawer without leaving the page, and the mega-menu's 3 groups still show as labeled sub-sections (just single-column).

- [ ] **Step 6: Commit**

```bash
git add src/data/site.ts src/components/Header.astro src/components/Footer.astro DESIGN.md
git commit -m "Replace flat 14-item nav with 6-item mega-menu/dropdown navigation"
```

---

### Task 2: Product taxonomy data model

**Files:**
- Modify: `src/data/products.ts` (add `category`/`comingSoon` fields, add `productCategories` labels, add 6 new placeholder entries)
- Modify: `src/data/media.ts` (add 6 new photo slots for the new products, in the existing `products` category's `slots` array)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `ProductCategory` type, `productCategories: Record<ProductCategory, {th,en}>`, and `Product.category`/`Product.comingSoon` fields — consumed by Task 3 (`products.astro`/`en/products.astro`). Task 1's mega-menu already links to `/products#pe-foam`, `/products#eps`, `/products#category-accessories`, `/products#panel-sheet`, `/products#metal-sheet`, `/products#pu-foam`, `/products#snap-lock` — this task's new product `slug`s must match those anchors exactly (`pe-foam`, `eps`; the accessories anchor is a category-level id added in Task 3, not a product slug).

- [ ] **Step 1: Replace `src/data/products.ts` in full**

```ts
export type ProductCategory = 'roofing' | 'wall' | 'insulation' | 'accessories';

export type Product = {
  slug: string;
  category: ProductCategory;
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  useTh: string;
  useEn: string;
  /** True for taxonomy categories that don't have real content yet. */
  comingSoon?: boolean;
};

export const productCategories: Record<ProductCategory, { th: string; en: string }> = {
  roofing: { th: 'หลังคาเมทัลชีท', en: 'Metal Roofing Systems' },
  wall: { th: 'ผนัง', en: 'Wall Panels' },
  insulation: { th: 'ฉนวนกันความร้อน', en: 'Insulation' },
  accessories: { th: 'อุปกรณ์และอะไหล่', en: 'Accessories & Parts' },
};

export const products: Product[] = [
  {
    slug: 'metal-sheet',
    category: 'roofing',
    nameTh: 'แผ่นเหล็กมุงหลังคา (Metal Sheet)',
    nameEn: 'Metal Roofing Sheet',
    descTh: 'แผ่นเหล็กเคลือบสี ขึ้นรูปลอนตามมาตรฐานโรงงาน แข็งแรง ทนแดดทนฝน',
    descEn: 'Pre-painted galvanized steel sheet, factory roll-formed for strength and weather resistance.',
    useTh: 'บ้านพักอาศัย โรงงาน โกดังสินค้า หลังคาโรงจอดรถ',
    useEn: 'Houses, factories, warehouses, carports.',
  },
  {
    slug: 'bolt-type',
    category: 'roofing',
    nameTh: 'หลังคาระบบยึดสกรู (Bolt Type)',
    nameEn: 'Bolt-Type Roofing System',
    descTh: 'ระบบหลังคายึดด้วยสกรูเจาะยึดโดยตรง ติดตั้งง่าย ราคาประหยัด',
    descEn: 'Through-fastened screw-down system — straightforward installation, cost-effective.',
    useTh: 'งานหลังคาทั่วไป งบประมาณจำกัด',
    useEn: 'General-purpose roofing, budget-conscious projects.',
  },
  {
    slug: 'clip-lock',
    category: 'roofing',
    nameTh: 'ระบบคลิปล็อก (Clip-Lock)',
    nameEn: 'Clip-Lock System',
    descTh: 'ยึดด้วยคลิปซ่อนสกรู ไม่เจาะทะลุแผ่น ลดจุดรั่วซึม เหมาะกับหลังคาลาดเอียงต่ำ',
    descEn: 'Concealed-clip fastening with no sheet penetration — fewer leak points, suited to low-slope roofs.',
    useTh: 'อาคารพาณิชย์ โรงงานที่ต้องการกันรั่วซึมสูง',
    useEn: 'Commercial buildings, plants requiring high leak resistance.',
  },
  {
    slug: 'snap-lock',
    category: 'roofing',
    nameTh: 'ระบบสแนปล็อก (Snap-Lock)',
    nameEn: 'Snap-Lock System',
    descTh: 'แผ่นล็อกตัวเองไม่ต้องใช้คลิปเพิ่ม ติดตั้งรวดเร็ว ผิวเรียบสวยงาม',
    descEn: 'Self-locking seam with no separate clips — fast installation, clean architectural finish.',
    useTh: 'อาคารสถาปัตยกรรมที่ต้องการความสวยงาม หลังคาโค้ง',
    useEn: 'Architectural buildings and curved roofs where finish matters.',
  },
  {
    slug: 'panel-sheet',
    category: 'wall',
    nameTh: 'แผ่นผนังพาแนล (Panel Sheet)',
    nameEn: 'Wall Panel Sheet',
    descTh: 'แผ่นผนังสำเร็จรูป ติดตั้งเร็ว ลดเวลาก่อสร้าง ใช้ได้ทั้งผนังภายในและภายนอก',
    descEn: 'Prefabricated wall panels — fast install, shorter construction time, interior or exterior use.',
    useTh: 'โรงงาน คลังสินค้า อาคารสำนักงานชั่วคราว',
    useEn: 'Factories, warehouses, temporary office buildings.',
  },
  {
    slug: 'pu-foam',
    category: 'insulation',
    nameTh: 'แผ่นฉนวน PU Foam',
    nameEn: 'PU Foam Insulated Panel',
    descTh: 'แผ่นเหล็กประกบฉนวนโพลียูรีเทน กันความร้อนและเสียงได้ดีเยี่ยม',
    descEn: 'Steel-faced polyurethane foam sandwich panel — high thermal and acoustic insulation.',
    useTh: 'ห้องเย็น โรงงานควบคุมอุณหภูมิ อาคารที่ต้องการกันร้อน',
    useEn: 'Cold storage, temperature-controlled plants, heat-sensitive buildings.',
  },
  {
    slug: 'pe-foam',
    category: 'insulation',
    comingSoon: true,
    nameTh: 'แผ่นฉนวน PE Foam',
    nameEn: 'PE Foam Insulation',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'eps',
    category: 'insulation',
    comingSoon: true,
    nameTh: 'แผ่นฉนวน EPS',
    nameEn: 'EPS Insulation',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'accessory-ridge-cap',
    category: 'accessories',
    comingSoon: true,
    nameTh: 'ครอบสันหลังคา',
    nameEn: 'Ridge Caps',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'accessory-screw',
    category: 'accessories',
    comingSoon: true,
    nameTh: 'สกรูยึดแผ่น',
    nameEn: 'Fixing Screws',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'accessory-flashing',
    category: 'accessories',
    comingSoon: true,
    nameTh: 'Flashing (แผ่นปิดรอยต่อ)',
    nameEn: 'Flashing',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
  {
    slug: 'accessory-fixing',
    category: 'accessories',
    comingSoon: true,
    nameTh: 'อุปกรณ์ติดตั้ง',
    nameEn: 'Installation Fixings',
    descTh: 'รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถามข้อมูลเบื้องต้นได้ทาง LINE',
    descEn: 'Full specifications are being prepared. Contact us on LINE for preliminary details.',
    useTh: 'ข้อมูลเร็ว ๆ นี้',
    useEn: 'Details coming soon.',
  },
];
```

- [ ] **Step 2: Add photo slots for the 6 new products in `src/data/media.ts`**

Find the `products` category's `slots` array (currently 6 entries ending with `product-panel-sheet`), and append these 6 entries:
```ts
      { id: 'product-pe-foam', altTh: 'แผ่นฉนวน PE Foam', altEn: 'PE foam insulated panel' },
      { id: 'product-eps', altTh: 'แผ่นฉนวน EPS', altEn: 'EPS insulation board' },
      { id: 'product-accessory-ridge-cap', altTh: 'ครอบสันหลังคาเหล็ก', altEn: 'Steel ridge cap' },
      { id: 'product-accessory-screw', altTh: 'สกรูยึดแผ่นหลังคา', altEn: 'Roofing fixing screws' },
      { id: 'product-accessory-flashing', altTh: 'แผ่น Flashing ปิดรอยต่อ', altEn: 'Flashing trim' },
      { id: 'product-accessory-fixing', altTh: 'อุปกรณ์ยึดติดตั้งหลังคา', altEn: 'Roof installation fixings' },
```

(These get the same `photo--pending` diagonal placeholder as every other product without a real photo yet — no code change needed in `Photo.astro`, it already handles missing files gracefully. Declaring the slot with alt text is required, or `Photo.astro` throws.)

- [ ] **Step 3: Verify**

Run: `pnpm check` — expect `0 errors` (this task alone doesn't change any `.astro` template, so `products.astro` will still render the old flat list correctly against the new data shape — `category`/`comingSoon` are just unused-but-valid extra fields until Task 3).
Run: `pnpm build` — expect success.

- [ ] **Step 4: Commit**

```bash
git add src/data/products.ts src/data/media.ts
git commit -m "Add product taxonomy categories and placeholder entries for PE/EPS/accessories"
```

---

### Task 3: Restructure `products.astro` / `en/products.astro` into category sections

**Files:**
- Modify: `src/pages/products.astro`
- Modify: `src/pages/en/products.astro`

**Interfaces:**
- Consumes: `products`, `productCategories`, `Product.category`, `Product.comingSoon` from Task 2. `Badge` component (`src/components/Badge.astro`, props `{tone?, variant?, class?}`) — already exists from a prior refresh, unwired until now.

- [ ] **Step 1: Replace `src/pages/products.astro` in full**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Diagram from '../components/Diagram.astro';
import Badge from '../components/Badge.astro';
import { products, productCategories } from '../data/products';
import { site } from '../data/site';
import Photo from '../components/Photo.astro';

const categoryOrder = ['roofing', 'wall', 'insulation', 'accessories'] as const;

// Roof profile/color/insulation-type detail already lives on /colors and
// /specifications under their own naming — this points there rather than
// fabricating attribute values (e.g. "760/860") that aren't backed by real
// product data. Accessories has no equivalent existing page, so no note.
const categoryNotes: Partial<Record<(typeof categoryOrder)[number], string>> = {
  roofing: 'ดูลอนและสีทั้งหมดที่หน้า <a href="/colors">สี / วัสดุ</a> และดูความหนากับราคาเริ่มต้นที่หน้า <a href="/specifications">สเปกสินค้า</a>',
  wall: 'ดูสีและตัวเลือกวัสดุที่หน้า <a href="/colors">สี / วัสดุ</a> และดูความหนากับราคาเริ่มต้นที่หน้า <a href="/specifications">สเปกสินค้า</a>',
  insulation: 'ดูชนิดฉนวนเพิ่มเติมที่หน้า <a href="/colors">สี / วัสดุ</a> และดูความหนากับราคาเริ่มต้นที่หน้า <a href="/specifications">สเปกสินค้า</a>',
};
---

<BaseLayout
  lang="th"
  title="สินค้า | หจก.มีชัยสตีล"
  description="แผ่นเหล็กมุงหลังคา แผ่นผนัง ฉนวนกันความร้อน และอุปกรณ์ติดตั้ง ครบทุกระบบ"
>
  <section class="page-hero">
    <div class="container">
      <h1>สินค้าของเรา</h1>
      <p>ครบทุกระบบหลังคาและผนังเหล็ก เลือกให้เหมาะกับงบประมาณและลักษณะอาคารของคุณ</p>
    </div>
  </section>

  {categoryOrder.map((cat, catIndex) => {
    const items = products.filter((p) => p.category === cat);
    const note = categoryNotes[cat];
    return (
      <section
        class="section"
        id={`category-${cat}`}
        style={catIndex % 2 === 1 ? 'background:var(--color-surface)' : undefined}
      >
        <div class="container product-list">
          <h2 class="category-heading">{productCategories[cat].th}</h2>
          {note && <p class="category-note" set:html={note} />}
          {items.map((p, i) => (
            <article class="product-detail" id={p.slug}>
              <div class="container product-detail__inner">
                <div class="product-detail__media">
                  <Photo slot={`product-${p.slug}`} lang="th" ratio="4 / 3" eager={catIndex === 0 && i === 0} />
                </div>
                <div>
                  <h3>
                    {p.nameTh}
                    {p.comingSoon && (
                      <Badge tone="neutral" variant="soft" class="product-detail__badge">เร็ว ๆ นี้</Badge>
                    )}
                  </h3>
                  <p class="product-detail__en">{p.nameEn}</p>
                  <p>{p.descTh}</p>
                  <p class="product-detail__use"><strong>เหมาะกับ:</strong> {p.useTh}</p>
                  <div class="hero__actions">
                    <a class="btn btn--outline" href="/specifications">ดูสเปกและราคาเริ่มต้น</a>
                    <a class="btn btn--primary" href={site.lineHref} target="_blank" rel="noopener noreferrer">สอบถามสินค้านี้</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  })}

  <section class="section section--surface">
    <div class="container-narrow">
      <h2>เข้าใจระบบก่อนตัดสินใจ</h2>
      <p class="explainer-lead">
        ภาพตัดขวางเชิงหลักการ ช่วยให้เห็นว่าแต่ละระบบต่างกันตรงไหน ก่อนคุยกับทีมช่างหน้างาน
      </p>
      <Diagram
        lang="th"
        slug="seam-systems-th"
        label="ภาพตัดขวางเปรียบเทียบระบบยึดแผ่นหลังคาแบบสกรู คลิปล็อก และสแนปล็อก"
        caption="ระบบสกรูเจาะทะลุแผ่น ทุกรูคือจุดที่น้ำเข้าได้ ส่วนคลิปล็อกและสแนปล็อกยึดในร่องรอยต่อโดยไม่เจาะแผ่น"
      />
      <Diagram
        lang="th"
        slug="pu-foam-th"
        label="ภาพเปรียบเทียบการถ่ายเทความร้อนระหว่างแผ่นเหล็กเปล่ากับแผ่นฉนวน PU Foam"
        caption="แผ่นฉนวน PU Foam ชะลอความร้อนที่แกนโฟม ความหนาฉนวนอ้างอิงตามสเปกสินค้า 25–50 มม."
      />
    </div>
  </section>
</BaseLayout>

<style>
  .page-hero {
    padding-block: var(--space-7) var(--space-6);
    background: var(--color-surface);
  }

  .page-hero p {
    color: var(--color-muted);
    font-size: 1.05rem;
  }

  .product-list {
    padding-block: var(--space-7);
  }

  .category-heading {
    margin-bottom: var(--space-2);
  }

  .category-note {
    color: var(--color-muted);
    margin-bottom: var(--space-5);
  }

  .category-note a {
    font-weight: 600;
  }

  .explainer-lead {
    color: var(--color-muted);
    margin-bottom: var(--space-4);
  }

  .product-detail {
    scroll-margin-top: 90px;
  }

  .product-detail + .product-detail {
    margin-top: var(--space-7);
  }

  .product-detail__inner {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: var(--space-6);
    align-items: center;
  }

  /* Layout only — Photo.astro owns the image and its pending state. */
  .product-detail__media {
    min-width: 0;
  }

  .product-detail__badge {
    margin-left: var(--space-2);
    vertical-align: middle;
  }

  .product-detail__en {
    color: var(--color-muted);
    font-size: 0.95rem;
    margin-top: -0.5rem;
  }

  .product-detail__use {
    color: var(--color-ink);
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-3);
  }

  @media (max-width: 800px) {
    .product-detail__inner {
      grid-template-columns: 1fr;
    }

    .product-detail__media {
      order: -1;
    }
  }
</style>
```

- [ ] **Step 2: Replace `src/pages/en/products.astro` in full**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Diagram from '../../components/Diagram.astro';
import Badge from '../../components/Badge.astro';
import { products, productCategories } from '../../data/products';
import { site } from '../../data/site';
import Photo from '../../components/Photo.astro';

const categoryOrder = ['roofing', 'wall', 'insulation', 'accessories'] as const;

// Roof profile/color/insulation-type detail already lives on /colors and
// /specifications under their own naming — this points there rather than
// fabricating attribute values (e.g. "760/860") that aren't backed by real
// product data. Accessories has no equivalent existing page, so no note.
const categoryNotes: Partial<Record<(typeof categoryOrder)[number], string>> = {
  roofing: 'See all profiles and colors on <a href="/en/colors">Colors & Materials</a>, and thickness plus starting prices on <a href="/en/specifications">Specifications</a>.',
  wall: 'See colors and material options on <a href="/en/colors">Colors & Materials</a>, and thickness plus starting prices on <a href="/en/specifications">Specifications</a>.',
  insulation: 'See more insulation types on <a href="/en/colors">Colors & Materials</a>, and thickness plus starting prices on <a href="/en/specifications">Specifications</a>.',
};
---

<BaseLayout
  lang="en"
  title="Products | Meechai Steel Ltd., Part."
  description="Metal roofing sheet, wall panels, insulation, and installation accessories — every system you need."
>
  <section class="page-hero">
    <div class="container">
      <h1>Our Products</h1>
      <p>Every roofing and wall panel system you need — sized to your budget and building type.</p>
    </div>
  </section>

  {categoryOrder.map((cat, catIndex) => {
    const items = products.filter((p) => p.category === cat);
    const note = categoryNotes[cat];
    return (
      <section
        class="section"
        id={`category-${cat}`}
        style={catIndex % 2 === 1 ? 'background:var(--color-surface)' : undefined}
      >
        <div class="container product-list">
          <h2 class="category-heading">{productCategories[cat].en}</h2>
          {note && <p class="category-note" set:html={note} />}
          {items.map((p, i) => (
            <article class="product-detail" id={p.slug}>
              <div class="container product-detail__inner">
                <div class="product-detail__media">
                  <Photo slot={`product-${p.slug}`} lang="en" ratio="4 / 3" eager={catIndex === 0 && i === 0} />
                </div>
                <div>
                  <h3>
                    {p.nameEn}
                    {p.comingSoon && (
                      <Badge tone="neutral" variant="soft" class="product-detail__badge">Coming Soon</Badge>
                    )}
                  </h3>
                  <p class="product-detail__th">{p.nameTh}</p>
                  <p>{p.descEn}</p>
                  <p class="product-detail__use"><strong>Best for:</strong> {p.useEn}</p>
                  <div class="hero__actions">
                    <a class="btn btn--outline" href="/en/specifications">View specs & starting prices</a>
                    <a class="btn btn--primary" href={site.lineHref} target="_blank" rel="noopener noreferrer">Ask about this product</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  })}

  <section class="section section--surface">
    <div class="container-narrow">
      <h2>Understand the systems first</h2>
      <p class="explainer-lead">
        Schematic cross-sections showing what actually separates these systems, before you talk specifics with our site team.
      </p>
      <Diagram
        lang="en"
        slug="seam-systems-en"
        label="Cross-section comparison of bolt-type, clip-lock and snap-lock roof fastening"
        caption="Bolt-type fasteners pierce the sheet, so every screw hole is a potential leak path. Clip-lock and snap-lock fix inside the seam channel without penetrating the pan."
      />
      <Diagram
        lang="en"
        slug="pu-foam-en"
        label="Heat transfer compared between a bare steel sheet and a PU foam insulated panel"
        caption="A PU foam panel stops most of the heat at the core. Insulation thickness per our published specs, 25–50 mm."
      />
    </div>
  </section>
</BaseLayout>

<style>
  .page-hero {
    padding-block: var(--space-7) var(--space-6);
    background: var(--color-surface);
  }

  .page-hero p {
    color: var(--color-muted);
    font-size: 1.05rem;
  }

  .product-list {
    padding-block: var(--space-7);
  }

  .category-heading {
    margin-bottom: var(--space-2);
  }

  .category-note {
    color: var(--color-muted);
    margin-bottom: var(--space-5);
  }

  .category-note a {
    font-weight: 600;
  }

  .explainer-lead {
    color: var(--color-muted);
    margin-bottom: var(--space-4);
  }

  .product-detail {
    scroll-margin-top: 90px;
  }

  .product-detail + .product-detail {
    margin-top: var(--space-7);
  }

  .product-detail__inner {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: var(--space-6);
    align-items: center;
  }

  /* Layout only — Photo.astro owns the image and its pending state. */
  .product-detail__media {
    min-width: 0;
  }

  .product-detail__badge {
    margin-left: var(--space-2);
    vertical-align: middle;
  }

  .product-detail__th {
    color: var(--color-muted);
    font-size: 0.95rem;
    margin-top: -0.5rem;
  }

  .product-detail__use {
    color: var(--color-ink);
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-3);
  }

  @media (max-width: 800px) {
    .product-detail__inner {
      grid-template-columns: 1fr;
    }

    .product-detail__media {
      order: -1;
    }
  }
</style>
```

- [ ] **Step 3: Verify**

Run: `pnpm check` — expect `0 errors`.
Run: `pnpm build` — expect success.

Screenshot `/products` and `/en/products` at 1280×2400 (tall viewport to capture multiple sections) and confirm: 4 category headings render in order (หลังคาเมทัลชีท, ผนัง, ฉนวนกันความร้อน, อุปกรณ์และอะไหล่ / their EN equivalents), the 4 roofing products (metal-sheet, bolt-type, clip-lock, snap-lock) all appear under the roofing heading, and the 6 `comingSoon` products show a visible "เร็ว ๆ นี้"/"Coming Soon" badge next to their name with the placeholder body copy — not fabricated specs. Also confirm the roofing/wall/insulation category notes render with working links to `/colors` and `/specifications` (`/en/colors`/`/en/specifications` on the EN page), and that the accessories category has no such note (no equivalent existing page to point to).

Confirm the mega-menu links from Task 1 resolve correctly: click สินค้าและบริการ → หลังคาเมทัลชีท (should land on/scroll to `#metal-sheet`), → ฉนวน PE (`#pe-foam`), → อุปกรณ์ / อะไหล่ (`#category-accessories`).

- [ ] **Step 4: Commit**

```bash
git add src/pages/products.astro src/pages/en/products.astro
git commit -m "Group products page into 4 taxonomy categories with coming-soon badges"
```

---

### Task 4: About page — anchors + Vision section

**Files:**
- Modify: `src/pages/about.astro:21-57` (add `id="company"` and `id="standards"`, insert new Vision section)
- Modify: `src/pages/en/about.astro:21-58` (same, EN)

**Interfaces:**
- Consumes: `Badge` component from `src/components/Badge.astro`.
- Produces: the `#company`, `#vision`, `#standards` anchors that Task 1's `เกี่ยวกับเรา` dropdown links to.

- [ ] **Step 1: In `src/pages/about.astro`, add `id="company"` to the history section**

Change:
```astro
  <section class="section">
    <div class="container-narrow">
      <h2>ประวัติความเป็นมา</h2>
```
to:
```astro
  <section class="section" id="company">
    <div class="container-narrow">
      <h2>ประวัติความเป็นมา</h2>
```

- [ ] **Step 2: Add `id="standards"` to the factory/standards section**

Change:
```astro
  <section class="section section--surface">
    <div class="container">
      <h2>โรงงานและมาตรฐาน</h2>
```
to:
```astro
  <section class="section section--surface" id="standards">
    <div class="container">
      <h2>โรงงานและมาตรฐาน</h2>
```

- [ ] **Step 3: Insert a new Vision section, and import `Badge`**

Add to the frontmatter imports:
```astro
import Badge from '../components/Badge.astro';
```

Insert this new section directly after the `id="company"` section (i.e., between the history section's closing `</section>` and the `id="standards"` section's opening `<section>`):
```astro
  <section class="section" id="vision">
    <div class="container-narrow">
      <h2>วิสัยทัศน์ <Badge tone="neutral" variant="soft">เร็ว ๆ นี้</Badge></h2>
      <p>
        เรากำลังเรียบเรียงวิสัยทัศน์และเป้าหมายระยะยาวของมีชัยสตีลให้ชัดเจนยิ่งขึ้น
        ระหว่างนี้ทักแชททาง LINE เพื่อพูดคุยกับทีมงานได้โดยตรง
      </p>
    </div>
  </section>
```

- [ ] **Step 4: Repeat Steps 1-3 for `src/pages/en/about.astro`**

Add `id="company"` to the `<h2>Our History</h2>` section, `id="standards"` to the `<h2>Factory & Standards</h2>` section, add the `Badge` import, and insert this Vision section between them:
```astro
  <section class="section" id="vision">
    <div class="container-narrow">
      <h2>Vision <Badge tone="neutral" variant="soft">Coming Soon</Badge></h2>
      <p>
        We're putting together a clearer statement of Meechai Steel's long-term vision and goals.
        In the meantime, message us on LINE to talk with the team directly.
      </p>
    </div>
  </section>
```

- [ ] **Step 5: Verify**

Run: `pnpm check` — expect `0 errors`.
Run: `pnpm build` — expect success.

Screenshot `/about` and `/en/about` at 1280×1600 and confirm: the new Vision section renders between the history and factory/standards sections with a visible "เร็ว ๆ นี้"/"Coming Soon" badge next to its heading. Confirm the `เกี่ยวกับเรา` dropdown's 4 links (from Task 1) all land on/scroll to a real section on the page: บริษัทของเรา → `#company`, วิสัยทัศน์ → `#vision`, จุดเด่น / มาตรฐาน → `#standards`, ทีมช่างเทคนิค → `/technical-team`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/about.astro src/pages/en/about.astro
git commit -m "Add Vision section and company/standards anchors to About page"
```

---

### Task 5: Contact page — anchors + Google Maps + Business Hours placeholders

**Files:**
- Modify: `src/pages/contact.astro:20-54` (add `id="phone"`/`id="line"`/`id="facebook"` to the 3 existing cards, add new Maps + Hours sections)
- Modify: `src/pages/en/contact.astro:20-54` (same, EN)

**Interfaces:**
- Consumes: `Badge` component from `src/components/Badge.astro`. `Card` component from `src/components/Card.astro` — this task adds `id?: string` to its `Props` and forwards it, since `Card` currently destructures only its declared props onto the rendered tag (no `{...Astro.props}` spread) and would otherwise silently drop an `id` passed to it.
- Produces: the `#phone`, `#line`, `#facebook`, `#map`, `#hours` anchors that Task 1's `ติดต่อเรา` dropdown links to. (`ที่อยู่` links to `/branches` — an existing page, not touched by this task.)

- [ ] **Step 1: Add `id` passthrough to `Card.astro`**

`Card.astro` currently destructures only `variant, elevation, emphasis, href, target, rel, class` from `Astro.props` and lists exactly those attributes on `<Tag>` — no spread — so an `id` prop passed to `<Card>` is silently dropped today. In `src/components/Card.astro`, change:
```astro
interface Props {
  variant?: 'base' | 'interactive' | 'elevated';
  elevation?: 2 | 3;
  emphasis?: 'primary';
  href?: string;
  target?: string;
  rel?: string;
  class?: string;
}

const {
  variant = 'base',
  elevation = 2,
  emphasis,
  href,
  target,
  rel,
  class: className,
} = Astro.props;

const Tag = href ? 'a' : 'div';
---

<Tag
  class:list={[
    'card',
    `card--${variant}`,
    emphasis === 'primary' && 'card--emphasis-primary',
    variant === 'elevated' && elevation === 3 && 'card--elevation-3',
    className,
  ]}
  href={href}
  target={target}
  rel={rel}
>
```
to:
```astro
interface Props {
  variant?: 'base' | 'interactive' | 'elevated';
  elevation?: 2 | 3;
  emphasis?: 'primary';
  href?: string;
  target?: string;
  rel?: string;
  class?: string;
  id?: string;
}

const {
  variant = 'base',
  elevation = 2,
  emphasis,
  href,
  target,
  rel,
  class: className,
  id,
} = Astro.props;

const Tag = href ? 'a' : 'div';
---

<Tag
  id={id}
  class:list={[
    'card',
    `card--${variant}`,
    emphasis === 'primary' && 'card--emphasis-primary',
    variant === 'elevated' && elevation === 3 && 'card--elevation-3',
    className,
  ]}
  href={href}
  target={target}
  rel={rel}
>
```

- [ ] **Step 2: In `src/pages/contact.astro`, add ids to the 3 existing cards**

Change:

```astro
      <Card
        variant="interactive"
        emphasis="primary"
        class="contact-card contact-card--primary"
        href={site.lineHref}
        target="_blank"
        rel="noopener noreferrer"
      >
```
to:
```astro
      <Card
        id="line"
        variant="interactive"
        emphasis="primary"
        class="contact-card contact-card--primary"
        href={site.lineHref}
        target="_blank"
        rel="noopener noreferrer"
      >
```

(Astro forwards any prop not declared in a component's `Props` interface straight through to the rendered root element as an HTML attribute — this is standard Astro passthrough behavior and does not require modifying `Card.astro`. Confirm this by checking the built HTML in the verify step below; if `id="line"` does not appear on the rendered element, `Card.astro` needs a small change to explicitly forward `id`, which is not anticipated but must be checked rather than assumed.)

Change:
```astro
      <Card variant="base" class="contact-card">
        <PhoneIcon size={28} weight="bold" className="contact-card__icon" aria-hidden="true" />
        <h2>โทรหาเรา</h2>
```
to:
```astro
      <Card id="phone" variant="base" class="contact-card">
        <PhoneIcon size={28} weight="bold" className="contact-card__icon" aria-hidden="true" />
        <h2>โทรหาเรา</h2>
```

Change:
```astro
      <Card variant="interactive" class="contact-card" href={site.facebookHref} target="_blank" rel="noopener noreferrer">
```
to:
```astro
      <Card id="facebook" variant="interactive" class="contact-card" href={site.facebookHref} target="_blank" rel="noopener noreferrer">
```

- [ ] **Step 3: Add `Badge` import and insert Maps + Hours sections**

Add to the frontmatter:
```astro
import Badge from '../components/Badge.astro';
```

Insert these two new sections directly after the closing `</section>` of the `contact-grid` section (before the `ขอใบเสนอราคาโครงการ` section):
```astro
  <section class="section" id="map">
    <div class="container-narrow">
      <h2>แผนที่ Google Maps <Badge tone="neutral" variant="soft">เร็ว ๆ นี้</Badge></h2>
      <p>
        กำลังจัดเตรียมแผนที่ฝังหน้านี้ ระหว่างนี้ดูที่อยู่และพิกัดเต็มได้ที่หน้า
        <a href="/branches">ที่ตั้งสาขา</a>
      </p>
    </div>
  </section>

  <section class="section" id="hours">
    <div class="container-narrow">
      <h2>เวลาเปิด–ปิด <Badge tone="neutral" variant="soft">เร็ว ๆ นี้</Badge></h2>
      <p>
        กำลังจัดเตรียมข้อมูลเวลาทำการ ระหว่างนี้ทักแชททาง LINE หรือโทรได้ตามเบอร์ด้านบน ทีมงานตอบกลับในเวลาทำการ
      </p>
    </div>
  </section>
```

- [ ] **Step 4: Repeat Steps 2-3 for `src/pages/en/contact.astro`**

Add `id="line"`, `id="phone"`, `id="facebook"` to the same 3 cards, add the `Badge` import, and insert:
```astro
  <section class="section" id="map">
    <div class="container-narrow">
      <h2>Google Maps <Badge tone="neutral" variant="soft">Coming Soon</Badge></h2>
      <p>
        We're preparing an embedded map for this page. In the meantime, see the full address and coordinates on our
        <a href="/en/branches">branch locations</a> page.
      </p>
    </div>
  </section>

  <section class="section" id="hours">
    <div class="container-narrow">
      <h2>Business Hours <Badge tone="neutral" variant="soft">Coming Soon</Badge></h2>
      <p>
        We're preparing our business hours for this page. In the meantime, message us on LINE or call the numbers
        above — our team replies during business hours.
      </p>
    </div>
  </section>
```

- [ ] **Step 5: Verify**

Run: `pnpm check` — expect `0 errors`.
Run: `pnpm build` — expect success.

Confirm `Card`'s `id` passthrough (Step 1) actually reaches the rendered HTML: `grep -o 'id="line"[^>]*' dist/contact/index.html` (and `id="phone"`, `id="facebook"`) should each match once.

Screenshot `/contact` and `/en/contact` at 1280×1800 and confirm the new Maps and Hours sections render with visible "เร็ว ๆ นี้"/"Coming Soon" badges. Confirm all 7 links in the `ติดต่อเรา` dropdown (from Task 1) resolve: ที่อยู่ → `/branches`, โทรศัพท์ → `#phone`, LINE → `#line`, Facebook → `#facebook`, Google Maps → `#map`, เวลาเปิด–ปิด → `#hours`, โบรชัวร์ → `/brochure`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Card.astro src/pages/contact.astro src/pages/en/contact.astro
git commit -m "Add id passthrough to Card, and phone/line/facebook anchors plus Maps/Hours sections to Contact"
```

---

### Task 6: New Promotions page

**Files:**
- Create: `src/pages/promotions.astro`
- Create: `src/pages/en/promotions.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `Badge` component, `site` data — all existing.
- Produces: the `/promotions` and `/en/promotions` routes that Task 1's top-level `โปรโมชั่น`/`Promotions` link points to.

- [ ] **Step 1: Create `src/pages/promotions.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Badge from '../components/Badge.astro';
import { site } from '../data/site';
---

<BaseLayout
  lang="th"
  title="โปรโมชั่น | หจก.มีชัยสตีล"
  description="โปรโมชั่นและข้อเสนอพิเศษจากมีชัยสตีล"
>
  <section class="page-hero">
    <div class="container">
      <h1>โปรโมชั่น <Badge tone="neutral" variant="soft">เร็ว ๆ นี้</Badge></h1>
      <p>กำลังจัดเตรียมโปรโมชั่นและข้อเสนอพิเศษ ระหว่างนี้ทักแชททาง LINE เพื่อสอบถามราคาปัจจุบันได้โดยตรง</p>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <div class="hero__actions">
        <a class="btn btn--primary" href={site.lineHref} target="_blank" rel="noopener noreferrer">สอบถามทาง LINE</a>
        <a class="btn btn--outline" href="/products">ดูสินค้าทั้งหมด</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .page-hero {
    padding-block: var(--space-7) var(--space-6);
    background: var(--color-surface);
  }

  .page-hero h1 {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .page-hero p {
    color: var(--color-muted);
    font-size: 1.05rem;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
</style>
```

- [ ] **Step 2: Create `src/pages/en/promotions.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Badge from '../../components/Badge.astro';
import { site } from '../../data/site';
---

<BaseLayout
  lang="en"
  title="Promotions | Meechai Steel Ltd., Part."
  description="Promotions and special offers from Meechai Steel."
>
  <section class="page-hero">
    <div class="container">
      <h1>Promotions <Badge tone="neutral" variant="soft">Coming Soon</Badge></h1>
      <p>We're preparing promotions and special offers. In the meantime, message us on LINE for current pricing.</p>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <div class="hero__actions">
        <a class="btn btn--primary" href={site.lineHref} target="_blank" rel="noopener noreferrer">Ask on LINE</a>
        <a class="btn btn--outline" href="/en/products">View all products</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .page-hero {
    padding-block: var(--space-7) var(--space-6);
    background: var(--color-surface);
  }

  .page-hero h1 {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .page-hero p {
    color: var(--color-muted);
    font-size: 1.05rem;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
</style>
```

- [ ] **Step 3: Verify**

Run: `pnpm check` — expect `0 errors`.
Run: `pnpm build` — expect success, page count increases by 2 (from 31 to 33).

Screenshot `/promotions` and `/en/promotions` and confirm the page renders with a visible "เร็ว ๆ นี้"/"Coming Soon" badge and working LINE/products links. Confirm the top-level `โปรโมชั่น`/`Promotions` nav item (from Task 1) links here correctly and shows as the active page (`aria-current="page"`).

- [ ] **Step 4: Commit**

```bash
git add src/pages/promotions.astro src/pages/en/promotions.astro
git commit -m "Add Promotions page (placeholder content)"
```

---

### Task 7: Full-site verification

**Files:** none (verification only).

**Interfaces:** consumes the complete output of Tasks 1-6.

- [ ] **Step 1: Run the full check/build**

Run: `pnpm check` — expect `0 errors, 0 warnings, 0 hints`.
Run: `pnpm build` — expect success, 33 pages.

- [ ] **Step 2: Verify no broken links**

For every `href` in the `nav` array (Task 1) and every product/category anchor introduced in Tasks 2-6, confirm the target page/anchor exists in the built `dist/` output. A simple check: `grep -r 'id="<anchor>"' dist/<page>/index.html` for each anchor-based link, and confirm each page-based link's directory exists under `dist/`.

- [ ] **Step 3: Screenshot sweep — both locales, 3 widths**

Serve `dist/` and screenshot these routes at mobile (390px), tablet (768px), and desktop (1440px) widths, for both `/` and `/en/`:
- `/`, `/about`, `/products`, `/gallery`, `/promotions`, `/contact`

At desktop width, additionally screenshot each of the 4 dropdown/mega-menu open states (from Task 1's Step 5) one more time on a *different* page than the homepage (e.g. `/products`) to confirm the header behaves identically across pages, not just on `/`.

At mobile width, open the hamburger drawer and screenshot all 4 accordion sections expanded (one at a time) to confirm no regressions from the individual task-level checks.

- [ ] **Step 4: Verify EN mirrors match TH structure**

For each of Tasks 3-6's page changes, screenshot the EN equivalent at desktop width and visually confirm the same section order, same badges on the same items, and same layout as the TH version (translated copy, identical structure).

- [ ] **Step 5: Write a verification summary**

Note in the commit message (or a throwaway local note, not committed) which widths were tested, the final hamburger breakpoint value landed on in Task 1 Step 5, and confirmation that every nav link/anchor resolved. No code changes in this task — if verification finds a real defect, fix it as part of whichever earlier task owns the affected file, and re-run this task's checks from Step 1.

- [ ] **Step 6: Final commit (if Step 5 required any fixes)**

```bash
git add -A
git commit -m "Fix issues found in full-site nav/taxonomy verification sweep"
```

(Skip this step entirely if Step 5 found no issues — do not create an empty commit.)
