# Full SEO Audit — metal-roofing-store.vercel.app

**Audited URL:** https://metal-roofing-store.vercel.app/
**Date:** 2026-08-31
**Business type:** Local building-materials manufacturer + roofing contractor (hybrid factory storefront / service area), bilingual Thai + English, Astro static site on Vercel
**Business:** หจก.มีชัยสตีล / Meechai Steel Ltd., Part. — metal roofing sheet + PU-foam insulated panel manufacturer, Nong Khai Province, Thailand; serves upper-Isan Thailand + Vientiane, Laos

---

## SEO Health Score: 45 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 48 | 10.6 |
| Content Quality & E-E-A-T | 23% | 46 | 10.6 |
| On-Page SEO | 20% | 48 | 9.6 |
| Schema / Structured Data | 10% | 5 | 0.5 |
| Performance (CWV) | 10% | 72 | 7.2 |
| AI Search Readiness (GEO) | 10% | 53 | 5.3 |
| Images | 5% | 40 | 2.0 |
| **Total** | | | **~45** |

Supporting (not in the weighted score): Local SEO 20 · SXO 34 · Sitemap 45 · Visual/Mobile UX 68.

**One-line read:** the site is *built* well — clean static HTML, fast rendering, honest copy, disciplined layout — but it is missing almost the entire machine-readable layer (no sitemap, no robots.txt, no canonical/hreflang, no structured data, no OG) and the entire local-business proof layer (no address, no GBP, no reviews). Both are mostly fast fixes. Nothing is structurally broken.

### Method / limitations
- **No Google API credentials** — no CrUX / GSC / GA4 field data. Core Web Vitals below are a single-run lab measurement.
- **No DataForSEO / live SERP** — local-pack positions, competitor proximity, cross-web NAP consistency, and whether a Google Business Profile already exists could **not** be verified.
- Proximity is ~55% of local ranking variance and is not assessable until the real street address is published.
- Contrast ratios in the visual section are screenshot estimates (the parser could not resolve `oklch()` to sRGB).

---

## Top 5 Critical Issues

1. **Zero structured data on every page.** No `Organization` / `LocalBusiness` / `Product` / `Article` / `BreadcrumBlist`. `structured_data.block_count: 0` sitewide. This is the single biggest lever for both local ranking and AI-answer grounding.
2. **No `robots.txt` and no XML sitemap.** `/robots.txt` and `/sitemap.xml` both 404; `@astrojs/sitemap` is not installed. ~28 pages + 3 blog posts have no discovery path on a domain with almost no inbound links.
3. **No canonical, no hreflang, no OG tags** on a bilingual TH/EN site. `BaseLayout.astro`'s `<head>` is essentially just `<title>` + `<meta description>`. The th↔en pairing exists only as a visible header toggle. LINE and Facebook shares (the primary channels) have no preview.
4. **No published street address and no Google Business Profile signal.** Only "จังหวัดหนองคาย". The map on `/contact` and `/branches` is a "เร็ว ๆ นี้" placeholder. GBP primary category — the #1 local ranking factor — is unset. Local SEO scores 20/100.
5. **Price opacity on the highest-volume commercial queries.** Every product and spec row shows "สอบถามราคา" while competitors rank with visible ฿140–450/ตร.ม. This blocks featured-snippet and AI-Overview eligibility for "เมทัลชีท ราคา" / "แผ่นหลังคาเหล็ก ราคา", and `/specifications` (193 words) cannot compete with 1,000–2,500-word buyer guides.

## Top 5 Quick Wins

1. **`public/robots.txt`** — allow-all + explicit AI-crawler allow (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) + `Sitemap:` line.
2. **`pnpm add @astrojs/sitemap`** + i18n config (`defaultLocale: 'th'`, `locales: {th, en}`) — emits the sitemap *with* hreflang alternates. Rebuild, verify `dist/sitemap-index.xml`, submit to GSC + Bing.
3. **`BaseLayout.astro` head, ~15 lines** — `canonical` (from `Astro.url`), `hreflang` th/en/x-default, OG + Twitter tags, a default `og:image`. Fixes items on every page at once.
4. **`priority` on the hero `<Image>`** (TH + EN home) — currently `loading="lazy"`; one word moves mobile LCP from 2.9 s toward Good.
5. **One `<Schema>` component in `BaseLayout`** — `Organization` + `RoofingContractor` + `WebSite` `@graph` built from `src/data/site.ts` (province-level `areaServed`, `sameAs` Facebook + LINE, one `contactPoint` per phone). Grow `address` + `sameAs` as data lands.

---

## Technical SEO — 48/100

**Passing:** pure static SSR (`is_spa: false`), no hydration, no long tasks; clean URLs; unique titles/descriptions/H1s; valid HTTPS + HSTS + brotli + HTTP/2; correct mobile viewport; correct 404 status code.

**Critical**
- **No robots.txt** — `/robots.txt` 404s; `sitemap_discovery.py` returns `declared: []`.
- **No XML sitemap** — all variants 404; `@astrojs/sitemap` not in deps.
- **No canonical tags** — `grep rel="canonical" dist/` = 0; not in `BaseLayout.astro`.
- **Trailing-slash duplicates** — `/about` and `/about/` both return 200, identical body md5, no redirect. Vercel filesystem routing overrides Astro's `trailingSlash: 'never'`. No `vercel.json` exists. Fix: `vercel.json` with a `trailingSlash: false` 301 + canonical tags.
- **No hreflang** — bilingual site, zero `<link rel="alternate">`.

**High**
- **Hero = LCP element is `loading="lazy" fetchpriority="auto"`** (`src/pages/index.astro`). Direct mobile LCP hit. Add `priority` + `<link rel="preload" as="image">`.
- **Render-blocking cross-origin Google Fonts** — 2 heavy Thai families, 7–8 weights, ~770–870 ms. `public/fonts/` exists but is empty (abandoned self-host).
- **Zero structured data** — see Schema section.
- **No OG / Twitter tags** — breaks LINE/Facebook link previews.
- **No custom 404 page** — generic Vercel dead-end.

**Medium/Low:** only HSTS present (missing `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP); no IndexNow; no per-page robots-meta control; `@astrojs/react` built a **192 KB `dist/_astro/client.*.js` referenced by zero pages** (no `client:*` islands exist — Phosphor icons use the `/ssr` import); 3 homepage gallery `<img>` lack dimensions.

**Core Web Vitals (source inspection):** LCP needs-improvement until the hero + font fixes land; INP good (no hydration); CLS good–borderline.

Full detail: `findings/technical.md`.

---

## Content Quality & E-E-A-T — 46/100

Composite E-E-A-T 40/100 (Experience 45 · Expertise 38 · Authoritativeness 25 · Trust 52). AI-citation readiness 30/100. Content freshness 35/100. Bilingual parity ~65%. **AI-slop risk: LOW** — the copy is specific, human, and honestly written.

**Critical**
- **Team page is empty** (`team.ts = []`) — no named experts or credentials, despite the pitch being "our technical team does your take-off".
- **No certification / standards evidence** — มอก./TIS, steel grade, coating mass, PU density, fire rating absent sitewide (`grep` = 0). The `/about` "standards" section is generic unverifiable claims.
- **Factory proof is placeholder** — `src/assets/photos/` has no facility/production/crew/delivery images; `/about` and `/services` render striped placeholder divs. A "factory-standard manufacturer" shows no factory.

**High**
- Contact/legal trust gaps: no street address, no map, no hours, no หจก. registration number, no email, no written warranty term.
- `/specifications` thin (193 words) and every `startingPrice` is blank while the title promises "ราคาเริ่มต้น".
- Product pages are one sentence each; 7 identical "coming soon" entries are indexable.
- Blog thin and stalled — 3 short posts, none since 2026-06-12, no author/schema/sources/cover images.
- English tree partial and weaker — `/en/index` is an old template; the empty EN testimonials section renders as a visible bug; article bodies are Thai-only.
- Intent gaps — no pricing content, no มอก. page, no "เมทัลชีทกันร้อน" pillar, no city/area pages, no FAQ content.

**Medium:** 1,295 gallery photos carry only sequential-number alt text; `facebook-posts.json = []` so the homepage feed never renders; "เร็ว ๆ นี้" stubs (incl. Promotions in main nav) are indexable; no `dateModified` on spec/price pages.

**Protect:** the deliberate anti-fabrication stance, the specific human copy, the manim concept diagrams, the clean heading hierarchy, the real product taxonomy and large genuine job-photo gallery.

Full detail: `findings/content.md`.

---

## On-Page SEO — 48/100

**Works:** homepage TH/EN titles carry brand + "หนองคาย / Nong Khai" + service area; one unique H1 per page; clean heading structure.

**Findings:** the whole canonical/hreflang/OG metadata layer is missing (see Technical); inner-page titles/H1s are brand-only (no product/geo modifiers); H2s are slogans rather than queries, which blocks passage extraction; weak internal linking and no breadcrumbs — money pages get only nav/footer links; indexable "เร็ว ๆ นี้" stub pages sit in the main nav.

---

## Schema / Structured Data — 5/100

`block_count: 0` on every route. The only positives: clean SSR HTML and `astro.config` `site` is set (free absolute `@id`s).

| Missing | Priority | Notes |
|---|---|---|
| `Organization` / `RoofingContractor` (+ `Manufacturer`) | Critical | Province-level `areaServed`; `address` = `addressRegion` + `addressCountry` only (no street address yet); `sameAs` = Facebook + LINE; one `contactPoint` per phone; `hasOfferCatalog` of the 6 real products. **Not** `HardwareStore` (implies walk-in retail). |
| `WebSite` | Critical | Omit `SearchAction` — the site has no search. |
| `BreadcrumbList` | High | 30+ pages, 3-level mega-nav. Generate from `Astro.url.pathname`. |
| `BlogPosting` ×3 | High | Frontmatter present except `author` (use Organization) and cover image (none — blocks the Article rich result). |
| `ItemList` / `Product` on `/products` | Medium | 6 `Product` nodes with **no `offers`** (no public price, no checkout — valid, just no product rich result). Exclude the 7 `comingSoon`. |
| Logo `ImageObject` / `og:image` | Medium | 1024×1024 source at `src/assets/brand/logo.png`. |
| `Person` / `Review` / `AggregateRating` | Info | `team.ts` and `testimonials.ts` deliberately empty — **do not fabricate**. |

**Do not add `FAQPage` or `HowTo`.** Google retired FAQ rich results for all sites (May 2026) — there is no SERP feature to win. `HowTo` was deprecated Sept 2023. FAQ-style *content* is still fine for users and AI answers — write it as plain content or `QAPage` (genuine Q&A only).

**Implementation:** one `<Schema>` component in `BaseLayout` emitting an `Organization` + `WebSite` `@graph` from `site.ts`, plus an optional `schema?: Record<string,unknown>[]` prop so pages can push `BreadcrumbList` / `BlogPosting` / `ItemList` nodes into the same graph. Serialize with `JSON.stringify`, escape `< > &` and U+2028/2029, emit via `<script type="application/ld+json" is:inline set:html={json}>`. Ready-to-paste JSON-LD and builder code are in `findings/schema.md`.

---

## Performance (Core Web Vitals) — 72/100

Lighthouse lab (no CrUX field data): home **94** mobile / **99** desktop · products **91** mobile · configurator **99** mobile.

| Metric | Home mob | Home desk | Products mob | Config mob | Verdict |
|---|---|---|---|---|---|
| LCP | 2.9 s ⚠️ | 0.9 s | 3.3 s ⚠️ | 1.7 s | **only failure** — borderline, fixable |
| CLS | 0.004 | 0.013 | 0.006 | 0.039 | pass easily |
| TBT | 0 ms | 0 ms | 0 ms | 0 ms | — |
| INP | — | — | — | — | no field data; estimated Good (<100 ms), zero hydration |

**Fixes by impact:**
1. **[High]** Hero LCP image ships `loading="lazy"` + `fetchpriority="auto"`, not preloaded (264 ms resource-load-delay). `loading="eager"` + `fetchpriority="high"` + `<link rel="preload" as="image">` on hero + first product image → expect LCP −0.5 to −1.0 s.
2. **[High]** Render-blocking Google Fonts ~770–870 ms. Self-host + subset Thai+Latin, one family, 2–3 weights, preload the critical face.
3. **[Med]** Gallery / FB-card images are 500–568 KB full-res `<img src>` with no `srcset`; homepage lazy-loads ~1.5 MB; `dist/gallery` = 243 MB. Route through `astro:assets`.
4. **[Med]** Only WebP emitted — add AVIF via `<Picture formats={['avif','webp']}>` for hero/products (−25–35% bytes).
5. **[Med]** `/products` TTFB 160 ms vs 40 ms home — add Vercel edge cache headers for static HTML.
6. **[Low]** Remove the dead 192 KB React runtime.

Full detail: `findings/performance.md`.

---

## AI Search Readiness (GEO) — 53/100

Citability 52 · Structural readability 68 · Multi-modal 55 · **Authority & brand signals 28** · Technical accessibility 66. Platform estimates: Google AIO 40 · ChatGPT 46 · Perplexity 51 · Bing Copilot 42.

- **Zero structured data** — nothing for an AI to attach "metal roofing manufacturer, Nong Khai, Thai–Lao border" to. Biggest GEO lever.
- **Authority near-empty** — no GBP, no street address, no `sameAs` cluster, no Wikidata/Wikipedia, no author bylines, no named certifications, no YouTube/Reddit/directory mentions.
- **No robots.txt / sitemap** — AI crawlers aren't blocked but have no discovery aid.
- **Low citability** — H2s are slogans; no 40–60 word direct-answer blocks; prices are 100% "ask for quote"; specs are qualitative.
- **English pages leak Thai units** — `/en/specifications` renders `0.35 – 0.50 มม.` because `specs.ts` `thickness` is one hard-coded Thai string. Split into `thicknessTh` / `thicknessEn`.
- **No llms.txt** — honestly low value today, cheap future-proofing.

Highest-ROI offsite moves: verify a GBP, publish the explainer animations to YouTube, obtain the real street address. Full detail + TH/EN passage rewrites: `findings/geo.md`.

---

## Images — 40/100

**Works:** explicit width/height → near-zero CLS; WebP from `astro:assets`; `/gallery` uses aspect-ratio pinning + eager/lazy split.

**Findings:** 1,295 gallery photos have number-only alt text (the site's strongest asset is invisible to search and LLMs); oversized unmanaged images (500–568 KB, no `srcset`); no AVIF; **3 CLIENT WORK images + a footer logo render blank** in the built site (`naturalWidth 0`, no 4xx — likely bad asset paths); no `og:image`.

---

## Local SEO — 20/100

GBP signals 12 · Reviews 8 · Local on-page 45 · NAP & citations 25 · Local schema 0 · Local links 10.

**Business type:** hybrid factory/storefront + service area → should be a **storefront GBP at the factory**, not SAB. Recommended LocalBusiness `@type`: `RoofingContractor` (Google-supported subtype) — or `HardwareStore` if material sales dominate installation revenue. `Manufacturer` is an `Organization` subtype, not a LocalBusiness one, so model the manufacturing side via a separate `Organization` node + `hasOfferCatalog`, not the local `@type`. Note: GBP rank derives from the **verification address**, not the configured service area (Sterling Sky, Mar 2025) — so Udon Thani / Bueng Kan / Vientiane visibility depends on organic service-area *pages* (as a subdirectory, not a subdomain), not a GBP setting.

**Critical**
- **No street address anywhere** (province only) — blocks GBP verification, citations, `PostalAddress` schema, and proximity ranking.
- **No Google Business Profile signal** — no listing, placeholder map, no hours, no directions link; primary category unset.
- **Zero local structured data** — plus no canonical/og/hreflang/robots/sitemap.

**High**
- Facebook link is a **personal profile** (`profile.php?id=...`), not a Business Page — unusable as a citation.
- **No Google review strategy** — testimonials deliberately empty and pointed at Facebook; zero velocity.
- **No directory citations** — nothing on Longdo Map, yellowpages.co.th, thaitambon, wazzadu, Apple Maps, or coil-supplier dealer locators.

**Medium**
- Thin on-page geo beyond the homepage; footer has no NAP block; `vercel.app` subdomain is weak for brand/citation matching.
- Service-area pages (Nong Khai / Udon Thani / Bueng Kan / Vientiane) are the #1 local-organic factor **but not yet buildable** — gallery projects carry no province tags, so there's no unique local content. Tag projects first; **do not ship thin doorway pages.**

**Cross-border:** one GBP at Nong Khai + Vientiane as a service area; do not create an unverifiable Lao listing. A Facebook Business Page matters more for the Laos market.

**Positive:** name + all 3 phones consistent everywhere with valid E.164 `tel:` hrefs; homepage titles already carry the geo; `branches.ts` cleanly skips the empty address rather than faking one.

Full detail: `findings/local.md`.

---

## SXO (Search Experience) — 34/100

Persona scores (weakest first): Homeowner one-roof **39** · Local near-me **39** · Project procurement **39** · Lao cross-border **43** · Estimator **50** · Contractor bulk **52**.

| Target | Ranks for | SERP actually rewards | Severity |
|---|---|---|---|
| `/products` + `/specifications` | "เมทัลชีท ราคา", "แผ่นหลังคาเหล็ก ราคา" | Listings + price guides that show a ฿/ตร.ม. number (฿140–450). Target shows "สอบถามราคา" on every row. | Critical |
| `/specifications` (193 words) | "เมทัลชีท คือ / ความหนา / เลือก" | 1,000–2,500-word buyer guides + AI Overview | Critical |
| Homepage `/` | "เมทัลชีท หนองคาย / ใกล้ฉัน" | Local pack + full-NAP vendor pages. No LocalBusiness schema, NAP below fold, no map, no reviews. | High |
| `/en/*` tree | — | No hreflang, no canonical — split targeting, cannibalisation | High |
| `/configurator` (86 words) | "โปรแกรมคำนวณเมทัลชีท" | Right type, but withholds the estimate (routes to LINE); no body copy | Medium |

**Systemic:** price opacity kills snippet + AI-Overview eligibility on the highest-volume terms; zero structured data; thin content (86–648 words vs 1,000–2,500 norm); trust proof (testimonials, team, มอก., reg number) never surfaces on the money pages; weak internal linking, no breadcrumbs.

Full detail: `findings/sxo.md`.

---

## Visual / Mobile UX — 68/100

**Fixed:** the hero gradient wash-out — the near-black Thai H1 is now fully legible at 1440 and 390 on a solid cream background.

**High**
- Mobile header: "หจก.มีชัยสตีล" wordmark overlaps / runs under the hamburger — looks broken on first paint.
- Mobile above-the-fold: a ~570 px hero image renders first; H1, value prop, product chips, and primary CTA are all below the fold.
- 3 "CLIENT WORK" webp tiles (+ footer logo) render as empty navy boxes (`naturalWidth 0`).
- Mobile sticky contact bar overlaps the hero CTA — no bottom padding reserved on `main`.

**Medium**
- Contrast: brand amber links on white at ~14–15 px fail AA for normal text; hero photo overlay text has no scrim; section-02 navy-band body copy is borderline. *(Estimates — re-run with an oklch→sRGB step.)*
- Tap targets: hamburger 32×40, TH/EN toggle 18×24, "ออกแบบ 3D" 105×28 — 19 sub-44px interactive elements on mobile.
- No phone number in the desktop header (only LINE); `tel:` links live ~4800 px down.

Screenshots: `screenshots/home-{desktop,mobile}{,-full}.png`. Full detail: `findings/visual.md`.

---

## Where to look

- `ACTION-PLAN.md` — prioritised, dependency-sequenced fixes with a leading indicator per phase
- `audit-data.json` — structured envelope for the PDF report generator
- `findings/*.md` — full per-category detail (ready-to-paste `robots.txt`, sitemap config, JSON-LD, font/CWV fixes, TH/EN passage rewrites)
- `screenshots/` — desktop + mobile captures
