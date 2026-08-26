# Nav mega-menu + product taxonomy — design spec

## Context

The site's header nav is currently a flat list of 14 links (`src/data/site.ts`'s
`nav` array), rendered as a single-row list that collapses to a hamburger
below 1660px (see `src/components/Header.astro`, fixed in the prior
Notion-structure UI refresh). The user supplied a target information
architecture — a 4-category product taxonomy (เมทัลชีท, ผนัง, ฉนวน,
อุปกรณ์/อะไหล่) and a full site nav tree grouping today's 14 items (plus new
ones) under 6 top-level headings, some with dropdown children.

This is sub-project 1 of a larger IA initiative the user chose to decompose
(see chat: "Navigation + product taxonomy" was picked over "everything, one
big pass" and over letting the user pick a different starting point). The
other pieces — gallery category filtering, real content for the new
categories, Google Maps/hours content, promotions content — are explicitly
deferred to their own future sub-projects (see Non-goals).

## Goals

- Replace the flat 14-item top nav with a 6-item nav, most items opening a
  click-to-toggle dropdown or mega-menu.
- Fold today's 14 pages/anchors into the new structure so every existing
  page remains reachable — nothing currently linked becomes orphaned.
- Restructure the product content into the user's 4-category taxonomy
  (เมทัลชีท, ผนัง, ฉนวน, อุปกรณ์/อะไหล่), adding placeholder content for the
  categories that don't exist today (ฉนวน PE, ฉนวน EPS, อุปกรณ์/อะไหล่).
- Keep the menu exactly 2 levels deep everywhere, for one consistent,
  learnable interaction pattern (see "Depth rule" below).

## Non-goals (explicitly deferred)

- Gallery category filtering (บ้าน/โรงงาน/อาคาร/งานอื่นๆ) — the ตัวอย่างผลงาน
  dropdown links to the existing unfiltered `/gallery`; filtering is its own
  future sub-project.
- Real content for ฉนวน PE, ฉนวน EPS, อุปกรณ์/อะไหล่, วิสัยทัศน์, โปรโมชั่น,
  Google Maps embed, and business hours — all ship as clearly-marked
  placeholders this pass (see "Placeholder policy").
- Any visual redesign beyond what the menu itself needs. Reuses the existing
  token system, `Card`/`Badge` components, and palette from the prior UI
  refresh — no new colors, no new radius/shadow values.
- Changing the mobile hamburger drawer's overall mechanism — it stays a
  slide-down drawer; only its internal structure gains one level of
  accordion nesting (see "Mobile behavior").

## Depth rule

**Every 2nd-level mega-menu item is its own page (or an anchor within one
page's content). Anything nested deeper in the user's original outline
becomes content, filters, or sections on that page — never a 3rd menu
level.** This was explicitly confirmed for เมทัลชีท's own children (ลอน,
สี, ความหนา, ความยาว, วัสดุ/เกรด → attributes on the เมทัลชีท page, not a
submenu) and this spec applies the same rule uniformly:

- **ผนัง**'s two sub-types (ผนังเมทัลชีท, ผนังสำเร็จรูป) and its attributes
  (สี, ความหนา, ขนาด) → sections/attributes on the one `/products#panel`
  page, not two separate nav items.
- **อุปกรณ์/อะไหล่**'s four items (ครอบ, สกรู, Flashing, อุปกรณ์ติดตั้ง) →
  sections on the one `/products#accessories` page.
- **ฉนวน PE / PU / EPS** are each their own 2nd-level item (they're
  distinct enough to warrant separate pages/anchors), each with its own
  ความหนา/ขนาด/คุณสมบัติ attributes shown as content on that item's own
  page — not a further submenu.

## Nav structure

Top-level (6 items, replacing today's flat 14):

| # | TH | EN | Type | Destination |
|---|----|----|------|-------------|
| 1 | หน้าแรก | Home | link | `/` |
| 2 | เกี่ยวกับเรา | About Us | dropdown | (see below) |
| 3 | สินค้าและบริการ | Products & Services | mega-menu | (see below) |
| 4 | ตัวอย่างผลงาน | Our Work | dropdown | (see below) |
| 5 | โปรโมชั่น | Promotions | link | `/promotions` *(new page, placeholder)* |
| 6 | ติดต่อเรา | Contact | dropdown | (see below) |

A top-level item with children is a toggle button, not a link — it never
navigates on its own click, only opens/closes its dropdown (see "Why no
split-button" below). The dropdown's own first item serves as that
section's de facto landing page.

**เกี่ยวกับเรา / About Us** (simple dropdown, 4 items):

| TH | EN | Destination | Status |
|----|----|-----------  |--------|
| บริษัทของเรา | Our Company | `/about` (existing ประวัติ + โรงงาน + เครื่องจักร content) | existing |
| วิสัยทัศน์ | Vision | `/about#vision` | **new placeholder section** |
| จุดเด่น / มาตรฐาน | Standards | `/about#standards` (existing `std-card` content) | existing |
| ทีมช่างเทคนิค | Technical Team | `/technical-team` | existing, folded in |

**สินค้าและบริการ / Products & Services** (mega-menu, 3 columns):

*ระบบหลังคา / Roofing Systems*
| TH | EN | Destination | Status |
|----|----|-----------  |--------|
| หลังคาเมทัลชีท | Metal Roofing | `/products#metal-sheet` | existing product, gains attribute display (ลอน 760/860/other, สี, ความหนา, ความยาว, วัสดุ/เกรด) |
| Snap Lock | Snap Lock | `/products#snap-lock` | existing product |

*ผนังและฉนวน / Walls & Insulation*
| TH | EN | Destination | Status |
|----|----|-----------  |--------|
| ผนัง | Wall Panels | `/products#panel` | existing product (`panel-sheet`), gains ผนังเมทัลชีท/ผนังสำเร็จรูป sub-type + สี/ความหนา/ขนาด attributes |
| ฉนวน PU | PU Foam Insulation | `/products#pu-foam` | existing product |
| ฉนวน PE | PE Insulation | `/products#pe-foam` | **new placeholder** |
| ฉนวน EPS | EPS Insulation | `/products#eps` | **new placeholder** |
| อุปกรณ์ / อะไหล่ | Accessories & Parts | `/products#accessories` | **new placeholder** (ครอบ, สกรู, Flashing, อุปกรณ์ติดตั้ง as sub-items) |

*เครื่องมือช่วยตัดสินใจ / Decision Tools*
| TH | EN | Destination | Status |
|----|----|-----------  |--------|
| สเปกสินค้า | Specifications | `/specifications` | existing, folded in |
| สี / วัสดุ | Colors & Materials | `/colors` | existing, folded in |
| ออกแบบ 3D | 3D Configurator | `/configurator` | existing, folded in |
| บริการ | Services | `/services` | existing, folded in |

**ตัวอย่างผลงาน / Our Work** (simple dropdown, 3 items):

| TH | EN | Destination | Status |
|----|----|-----------  |--------|
| ผลงานทั้งหมด | All Work | `/gallery` | existing, unfiltered (filtering deferred) |
| รีวิวลูกค้า | Testimonials | `/testimonials` | existing, folded in |
| บทความ | Blog | `/blog` | existing, folded in |

**ติดต่อเรา / Contact** (simple dropdown, 7 items — jump-to-section on one page):

| TH | EN | Destination | Status |
|----|----|-----------  |--------|
| ที่อยู่ | Address | `/contact#address` | existing content, needs an anchor id added |
| โทรศัพท์ | Phone | `/contact#phone` | existing content, needs an anchor id added |
| LINE | LINE | `/contact#line` | existing content, needs an anchor id added |
| Facebook | Facebook | `/contact#facebook` | existing content, needs an anchor id added |
| Google Maps | Google Maps | `/contact#map` | **new placeholder** (no embed exists today) |
| เวลาเปิด–ปิด | Business Hours | `/contact#hours` | **new placeholder** (no hours content exists today) |
| โบรชัวร์ | Brochure | `/brochure` | existing standalone page, folded in here for discoverability |

## Placeholder policy

New categories/sections ship with real nav entries and real routes/anchors,
but clearly-marked placeholder content — not fake finished copy. Follow the
site's existing placeholder convention (`photo--pending`-style treatment
already used for missing photos): a labeled "ข้อมูลเร็ว ๆ นี้" (details
coming soon) block, styled distinctly enough that it's obviously
provisional, never presented as real product information. Applies to: ฉนวน
PE, ฉนวน EPS, อุปกรณ์/อะไหล่, วิสัยทัศน์, โปรโมชั่น, Google Maps, เวลาเปิด–ปิด.

## Dropdown mechanics

- **Click/tap to open**, not hover — matches the existing hamburger
  toggle's interaction model rather than introducing a second one.
- Closes on: outside click, Escape key, or selecting an item.
- Only one dropdown open at a time (opening a second closes the first).
- Full keyboard support: `Tab` reaches each top-level toggle button,
  `Enter`/`Space` opens it, arrow keys move between items inside, `Escape`
  closes and returns focus to the toggle button. `aria-expanded` on the
  toggle, `aria-haspopup` where applicable — matches the accessibility
  bar the existing hamburger toggle already clears.
- Visual treatment reuses existing tokens exactly: `var(--radius-lg)`,
  `var(--shadow-2)`, `var(--color-border)`, `var(--color-surface)` hover
  state — no new elevation or radius values introduced.

**Why no split-button (top-level item as both link and toggle):** เกี่ยวกับเรา,
ตัวอย่างผลงาน, and ติดต่อเรา each have one natural landing page/section that
could double as a direct link, but สินค้าและบริการ does not (its content is
split across 4+ existing pages with no single obvious landing page). Making
some top-level items dual-purpose (link + toggle) and others toggle-only
would be an inconsistent interaction pattern across 4 dropdowns for the sake
of saving one extra click on 3 of them. All 4 dropdown-bearing top items are
toggle-only; each dropdown's first item is that section's practical landing
page.

## Mobile behavior

The existing hamburger drawer (a slide-down vertical list, unchanged
mechanism) gains one level of accordion nesting: tapping a top-level item
with children expands its sub-items inline within the drawer (pushing
content below it down), rather than opening a separate overlay. Only one
section expanded at a time. This is the same interaction primitive as the
desktop dropdown (click-to-toggle, single-open) applied inside the existing
drawer rather than a new mobile-specific pattern.

สินค้าและบริการ's 3-column desktop grouping (ระบบหลังคา / ผนังและฉนวน /
เครื่องมือช่วยตัดสินใจ) collapses to a single vertical column on mobile, but
keeps the 3 group headers as inline sub-labels within the expanded
accordion — the grouping information isn't dropped, only the multi-column
layout.

## Data model changes

`src/data/site.ts`'s `NavItem` type (`{ th, en, href }`) becomes a
discriminated structure supporting nested children — the exact shape is an
implementation-plan decision, not a spec-level one, but it must support: a
leaf item (current shape), a dropdown item (label + ordered children, no
own href), and a mega-menu item (label + named groups, each an ordered list
of children).

`src/data/products.ts`'s flat `Product[]` (6 entries: metal-sheet, pu-foam,
bolt-type, clip-lock, snap-lock, panel-sheet) needs a `category` grouping
concept to render `/products` as 4 category sections instead of one flat
list, plus new placeholder entries for pe-foam, eps, and an accessories
category with its own 4 sub-items (ครอบ, สกรู, Flashing, อุปกรณ์ติดตั้ง).
Exact schema is an implementation-plan decision.

## TH/EN handling

One nav data structure, one `Header.astro` template — no separate dropdown
code path per locale, consistent with how the rest of the site already
handles bilingual content (a `lang` prop selecting `.th`/`.en` fields at
render time, not duplicated markup).

## Testing

No automated test runner exists in this repo (established constraint from
the prior UI-refresh plan). Verification is `pnpm check` + `pnpm build` +
manual screenshot verification at the established breakpoints (mobile,
tablet, and desktop widths spanning below/above wherever the new nav
collapses to hamburger), covering: every dropdown opens/closes correctly,
every new/existing link resolves, keyboard navigation works, and both TH
and EN render correctly.
