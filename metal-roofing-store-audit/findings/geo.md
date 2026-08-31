# GEO / AI-Search-Readiness Audit — Meechai Steel (metal-roofing-store.vercel.app)

**Audited:** 2026-08-31
**Scope:** homepage, /products, /specifications, /about, /blog + `/en/*` mirrors
**Stack:** Astro 5 static export on Vercel, bilingual `th` (root) / `en` (`/en/`), SSR HTML (not an SPA — `is_spa: false`, full content present pre-JS)

## GEO Health Score: 53 / 100

| Dimension | Weight | Score | Weighted | Notes |
|-----------|--------|-------|----------|-------|
| Citability | 25% | 52 | 13.0 | Passages near-optimal length in blog; spec table is a strong asset. No direct-answer lead blocks, headings not question-form on core pages, prices absent, specs qualitative, EN pages leak Thai units. |
| Structural Readability | 20% | 68 | 13.6 | Clean semantic H1→H3 hierarchy, one real data table, lists. No FAQ blocks, no schema, nav chrome heavy on thin pages. |
| Multi-Modal Content | 15% | 55 | 8.3 | Good diagram videos (mp4+webp) with descriptive captions/labels; responsive webp images. Many `alt=""`, no VideoObject/ImageObject schema, zero YouTube presence. |
| Authority & Brand Signals | 20% | 28 | 5.6 | No street address, no Google Business Profile, no `sameAs`, no Wikidata/Wikipedia entity, no author bylines, no founding year, no named certifications, no third-party citations. |
| Technical Accessibility | 20% | 66 | 13.2 | Static SSR HTML, fast, clean URLs, AI crawlers not blocked. But no robots.txt, no sitemap.xml, no llms.txt, no canonical, no hreflang. |

**Platform-specific readiness (estimated):**

| Platform | Score | Main blocker |
|----------|-------|--------------|
| Google AI Overviews | 40 | No LocalBusiness/Organization schema, no GBP entity, thin authority |
| ChatGPT Search | 46 | Crawlable but no brand mentions anywhere off-site; no llms.txt |
| Perplexity | 51 | Content is citable and static-rendered; held back by missing schema + entity |
| Bing Copilot | 42 | No sitemap, no IndexNow/Bing Webmaster, weak entity |

---

## 1. AI Crawler Accessibility

**Status: no `robots.txt` exists (404).** Nothing is blocked, so GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot and PerplexityBot-Bot can all currently crawl. But there is also **no sitemap directive and no sitemap.xml**, so discovery relies entirely on inbound links — of which this new domain has almost none.

| Crawler | Purpose | Current | Recommended stance |
|---------|---------|---------|--------------------|
| GPTBot | ChatGPT browsing + training | Allowed (default) | **Allow** |
| OAI-SearchBot | ChatGPT Search index | Allowed (default) | **Allow** |
| ClaudeBot | Claude citations | Allowed (default) | **Allow** |
| PerplexityBot | Perplexity answers | Allowed (default) | **Allow** |
| Google-Extended | Gemini / AIO grounding | Allowed (default) | **Allow** |
| CCBot | Common Crawl (feeds many LLMs) | Allowed (default) | **Allow** (visibility > training concern for a local B2B site) |
| anthropic-ai / cohere-ai | Legacy training tokens | Allowed (default) | Allow or block — no visibility impact either way |

### [HIGH] FIX — add `public/robots.txt`

Astro copies `public/` verbatim, so drop this in `public/robots.txt`:

```
# Meechai Steel — allow AI + search crawlers, expose sitemap
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://metal-roofing-store.vercel.app/sitemap-index.xml
```

### [HIGH] FIX — generate a sitemap
Install `@astrojs/sitemap` and add it to `astro.config.mjs` `integrations`. It emits `/sitemap-index.xml` automatically from the static routes and picks up the `site` value already configured. Without this, AI crawlers with no link graph to follow will not find `/specifications`, `/blog/*`, or the `/en/` tree.

---

## 2. llms.txt & Licensing

**Status: `/llms.txt` 404 (absent). No RSL 1.0 / licensing metadata anywhere.**

Honest framing: **llms.txt is currently ignored by Google, OpenAI, Anthropic and Perplexity** — no major consumer honors it in production. Value here is modest and mostly future-proofing / self-documentation. Worth doing because it is ~20 minutes of work and this is a small site with a clear structure, but it should **not** displace the robots.txt, schema, or entity fixes below.

### [LOW] FIX — add `public/llms.txt`

```markdown
# Meechai Steel Ltd., Part. (หจก.มีชัยสตีล)

> Metal roofing sheet and insulated (PU foam) panel manufacturer in Nong Khai,
> Thailand. Roll-forms its own sheet, cuts to site run-length, and supplies
> contractors and projects across upper Isan and across the border into
> Vientiane, Lao PDR, via the First Thai–Lao Friendship Bridge.

## Key facts
- Legal name (TH): หจก.มีชัยสตีล — ห้างหุ้นส่วนจำกัด (limited partnership)
- Legal name (EN): Meechai Steel Ltd., Part.
- Location: Nong Khai Province, Thailand (≈25 km from Vientiane, Lao PDR)
- Phone: +66 42 990 595 (office), +66 91 052 9136, +66 81 872 6147
- LINE: @680rgqnj
- Products: metal roofing sheet, bolt-type / clip-lock / snap-lock systems,
  wall panels, PU foam insulated panels, roofing accessories
- Sheet thickness range: 0.35–0.55 mm; PU foam core: 25–50 mm; wall panel: 30–75 mm

## Core pages
- [Products](https://metal-roofing-store.vercel.app/en/products): all roofing, wall and insulation systems
- [Specifications](https://metal-roofing-store.vercel.app/en/specifications): profile / thickness / application / price table
- [About](https://metal-roofing-store.vercel.app/en/about): company, factory, production process
- [Colors & materials](https://metal-roofing-store.vercel.app/en/colors)

## Articles
- [Choosing roofing sheet thickness](https://metal-roofing-store.vercel.app/blog/choosing-roof-thickness) (Thai)
- [Clip-Lock vs Snap-Lock](https://metal-roofing-store.vercel.app/blog/clip-lock-vs-snap-lock) (Thai)
- [Why cold storage uses PU foam panels](https://metal-roofing-store.vercel.app/blog/pu-foam-cold-storage) (Thai)

## Contact
- Website: https://metal-roofing-store.vercel.app/en/contact
```

---

## 3. Structured Data (biggest single lever)

**Status: zero JSON-LD, zero microdata, no OpenGraph, no Twitter cards, no canonical, no hreflang** across every page checked. For a business whose entire GEO value proposition is *"local manufacturer, Nong Khai, Thai–Lao border"*, the absence of `LocalBusiness` / `Organization` schema is the highest-impact gap. LLMs and AI Overviews lean heavily on schema + knowledge-graph entities to answer "near me" / place-scoped and "supplier of X in Y" queries.

### [HIGH] FIX — `Organization` + `LocalBusiness` on every page
Add to `BaseLayout.astro` `<head>` (single source, rendered on all routes). Use `@type: ["Organization","RoofingContractor"]` or `HomeAndConstructionBusiness`:

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://metal-roofing-store.vercel.app/#org",
  "name": "Meechai Steel Ltd., Part.",
  "alternateName": "หจก.มีชัยสตีล",
  "description": "Metal roofing sheet and PU foam insulated panel manufacturer in Nong Khai, Thailand.",
  "url": "https://metal-roofing-store.vercel.app/",
  "telephone": "+66-42-990-595",
  "areaServed": ["Nong Khai","Udon Thani","Bueng Kan","Vientiane"],
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Nong Khai",
    "addressCountry": "TH"
  },
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61593025679719"
  ]
}
```

- Fill `streetAddress` + `geo` (lat/long) the moment the address in `src/data/branches.ts` is supplied — this is currently blank and is the #1 authority gap.
- Grow `sameAs` as accounts are created (see §5).
- Emit `@type: WebSite` with `inLanguage` and a `WebPage` node per route.

### [HIGH] FIX — `hreflang` + `canonical`
No reciprocal `th` ⇄ `en` annotations exist. AI answer engines de-duplicate and may pick the wrong-language page for a query, or treat the pair as thin/duplicate. In `BaseLayout.astro` add per-page:

```html
<link rel="canonical" href={canonicalUrl} />
<link rel="alternate" hreflang="th" href={thUrl} />
<link rel="alternate" hreflang="en" href={enUrl} />
<link rel="alternate" hreflang="x-default" href={thUrl} />
```

### [MEDIUM] FIX — page-type schema
- `/specifications`: wrap the comparison table in a `Product` list or an `ItemList` of `Product` nodes, each with `material`, `width`/`depth` (thickness), `audience`. Tables + Product schema are disproportionately cited.
- `/products`: `Product` per item with `category`, `additionalType`.
- `/blog/*`: `BlogPosting` with `headline`, `datePublished` (the `<time datetime>` is already correct — mirror it), `inLanguage: "th"`, and **`author`** (currently missing — see §5).
- All pages: `BreadcrumbList`.

### [MEDIUM] FIX — OpenGraph / Twitter
No `og:*` or `twitter:*` tags. These do not directly drive LLM citation but are used for link unfurls in Perplexity, Copilot, and social surfaces that feed Reddit/Discord mentions. Add `og:title`, `og:description`, `og:type`, `og:image`, `og:locale` + `og:locale:alternate`, `twitter:card=summary_large_image`.

---

## 4. Passage-Level Citability

### What already works
- **Blog bodies are close to the ideal citation length** (~120–165 words) and self-contained. `choosing-roof-thickness` "แนะนำตามประเภทงาน" section is a clean extractable answer block.
- `/specifications` has a genuine `<table>` (profile / thickness / application / price) — the single most citable structure on the site.
- Distinctive, quotable entity facts exist in prose: *"We sit at the First Thai–Lao Friendship Bridge, roughly 25 km from Vientiane"*, thickness ranges, "cut to run length".

### [HIGH] Gaps

1. **Headings on core pages are marketing slogans, not questions.** e.g. `วัสดุครบ จบในที่เดียว`, `มีสินค้าจริง ให้คำปรึกษาได้จริง`, "Why Meechai Steel". AI engines match question-form H2/H3 to user prompts.
2. **No direct-answer lead block.** No page opens a section with a 40–60 word standalone answer to an implied question.
3. **Prices are 100% absent** — every cell is "สอบถามราคา" / "Ask for a quote". "How much does metal roofing cost in Nong Khai" cannot be answered from this site. Even a range ("เริ่มต้น ~130–190 บาท/เมตร ขึ้นกับความหนาและสี") would make the spec table citable.
4. **Specs are qualitative only.** No coating class (AZ150 / Zincalume / galvanised coating weight), no base-metal standard, no warranty term in years, no wind-load / purlin-spacing guidance. Spec-hungry queries ("PU foam roofing R-value", "0.47mm vs 0.5mm roofing wind rating") fall through.
5. **English pages leak Thai units.** `/en/specifications` renders `0.35 – 0.50 มม.` and `25 – 50 มม. (ฉนวน)` — the `thickness` field in `src/data/specs.ts` is a single hard-coded Thai string. Split into `thicknessTh` / `thicknessEn` (`0.35–0.50 mm`). This actively corrupts extraction for English AI queries.
6. **Blog is Thai-only bodies** — `/en/blog` lists English titles but every article links to a Thai body. Translate the three posts into `/en/blog/[slug]` so `en` LLM queries have a citable answer.

### [MEDIUM] Concrete rewrite examples

**`/specifications` — add a lead answer block above the table (TH):**
> **แผ่นหลังคาเมทัลชีทควรหนาเท่าไหร่?** สำหรับบ้านพักอาศัยที่มีโครงหลังคาดี ความหนา 0.35–0.40 มม. เพียงพอ งานโรงงาน โกดัง หรือพื้นที่ลมแรง แนะนำ 0.47 มม. ขึ้นไป ระบบคลิปล็อกและสแนปล็อกใช้แผ่นหนา 0.47–0.55 มม. ส่วนแผ่นฉนวน PU Foam มีความหนาแกนโฟม 25–50 มม. ตารางด้านล่างเปรียบเทียบทุกลอน ความหนา และการใช้งานที่เหมาะสม

**`/en/specifications` — EN equivalent (≈55 words, self-contained):**
> **How thick should a metal roofing sheet be?** For houses on a sound roof structure, 0.35–0.40 mm is enough. For factories, warehouses, or high-wind areas, use 0.47 mm or thicker. Clip-lock and snap-lock systems use 0.47–0.55 mm sheet. PU foam insulated panels have a 25–50 mm foam core. The table below compares every profile, thickness, and typical application.

**`/about` — add a factual identity block (TH), currently the page opens on brand story not facts:**
> **หจก.มีชัยสตีล** เป็นโรงงานผลิตแผ่นหลังคาเหล็กและแผ่นฉนวน PU Foam ตั้งอยู่ในจังหวัดหนองคาย ผลิตด้วยการรีดขึ้นรูปแผ่นเองจากคอยล์เหล็กเคลือบ ควบคุมความหนาและลอนทุกขั้นตอน ตัดความยาวตามหน้างานจริง ให้บริการผู้รับเหมาและงานโครงการในภาคอีสานตอนบน (หนองคาย อุดรธานี บึงกาฬ) และ สปป.ลาว บริเวณเวียงจันทน์ ผ่านสะพานมิตรภาพไทย–ลาว แห่งที่ 1

**Convert core-page H2s to question form:**
| Current | Rewrite (TH) | Rewrite (EN) |
|---|---|---|
| วัสดุครบ จบในที่เดียว | มีชัยสตีลจำหน่ายสินค้าอะไรบ้าง? | What roofing systems does Meechai Steel supply? |
| Why Meechai Steel | ทำไมต้องสั่งแผ่นหลังคาจากโรงงานโดยตรง? | Why order roofing sheet direct from the mill? |
| ความหนามีผลอย่างไร | ความหนาแผ่นเหล็กมีผลต่ออะไรบ้าง? | What does sheet thickness actually change? |

---

## 5. Brand-Mention & Entity Signals

| Signal | Status | Impact |
|--------|--------|--------|
| Google Business Profile | **Absent** | Critical for "เมทัลชีทหนองคาย" / "near me" AI answers and Google AIO local pack |
| Street address (NAP) | **Blank** in `src/data/branches.ts` (province only) | Blocks LocalBusiness schema + GBP + map — top authority gap |
| Wikidata / Wikipedia entity | **Absent** | No knowledge-graph node for LLMs to anchor to |
| `sameAs` cluster | Only Facebook exists; not linked as `sameAs` | LLMs use `sameAs` to confirm entity identity |
| Facebook | Exists (`profile.php?id=61593025679719`) — personal-style URL, no vanity handle | Weak; a Page with a named handle is stronger |
| YouTube | **None** | Highest observed correlation (~0.74) with AI citation — biggest untapped opportunity given the site already produces explainer animations |
| Reddit / forum presence | **None** | Common LLM citation source; nil for this brand |
| LinkedIn company page | **None** | Minor B2B trust signal |
| Author identity on blog | **None** — posts have dates but no byline | Weakens `BlogPosting` E-E-A-T; add a named "ทีมช่างเทคนิคมีชัยสตีล" author entity |
| Named certifications / standards | Vague ("certified suppliers", "warranty appropriate to type") | Name the actual standard (มอก. number, coating spec) to become citable |
| Third-party citations / directories | None found | No corroborating sources for LLMs to cross-check |

### [HIGH] FIX priorities for entity
1. Create & verify **Google Business Profile** (category: Roofing supply store / Manufacturer), Nong Khai. Feeds Google AIO + Gemini directly.
2. **Fill the street address** in `src/data/branches.ts` + `mapUrl`; it auto-propagates to footer and (once added) schema.
3. Stand up a **YouTube channel**, upload the existing `pu-foam`, `seam-systems`, `sheet-thickness` animations (they already have Thai + English versions and captions), link from site + `sameAs`.
4. Convert Facebook to a **named Page**; add LINE Official Account and (optional) TikTok — all into `sameAs`.
5. Add **named author** to blog posts; render a byline + `author` in `BlogPosting`.
6. List the business in **Thai B2B directories** (e.g. Thailand YellowPages, thaitambon, brand.thsearch) for corroborating mentions.
7. Once notable, create a **Wikidata item** (legal name, location, industry, founding year — which also needs to be added to `/about`).

---

## 6. Technical Accessibility

- **[GOOD]** Static Astro export — full text content in initial HTML, `is_spa: false`. No JS execution needed for crawlers. This is the right architecture for GEO.
- **[GOOD]** Clean, extensionless URLs (`trailingSlash: 'never'`), logical `/en/` mirror.
- **[GOOD]** Responsive `webp` images, font `preconnect`, reveal animations gated behind `prefers-reduced-motion` and `IntersectionObserver` (content is visible without them).
- **[MEDIUM]** Diagram media is `<video>` + `.webp` poster with a text `label` + `caption` — good. But no `VideoObject` schema and no transcript, so the explanatory content is invisible to text-only indexers.
- **[MEDIUM]** Several images use `alt=""` (e.g. footer logo, some `Photo` usages) — verify product/gallery images have descriptive alt text; AI image understanding and accessibility both depend on it.
- **[LOW]** `publication_date` resolves to `2026-01-01` (build default) on non-blog pages — no `dateModified` signal. Add `dateModified` to WebPage schema on content pages.
- **[LOW]** No `<meta name="robots">` — fine (defaults to index,follow), but add explicit `index,follow,max-snippet:-1,max-image-preview:large` to encourage full snippet use in AI/rich results.

---

## Prioritised Action List

| # | Change | Severity | Effort | Dimension |
|---|--------|----------|--------|-----------|
| 1 | Add `public/robots.txt` (AI allow-list + sitemap ref) | HIGH | XS (15 min) | Technical |
| 2 | Add `@astrojs/sitemap`, generate `sitemap-index.xml` | HIGH | S (30 min) | Technical |
| 3 | `Organization`/`HomeAndConstructionBusiness` JSON-LD in `BaseLayout` | HIGH | S (1–2 h) | Authority |
| 4 | Create + verify Google Business Profile (Nong Khai) | HIGH | M (offsite, ongoing) | Authority |
| 5 | Fill street address + `geo` in `src/data/branches.ts`; wire into schema | HIGH | S (needs client data) | Authority |
| 6 | `canonical` + reciprocal `hreflang` th/en in `BaseLayout` | HIGH | S (1 h) | Technical |
| 7 | Split `specs.ts` thickness into `thicknessTh`/`thicknessEn` (fix Thai-unit leak on `/en`) | HIGH | XS (20 min) | Citability |
| 8 | Add 40–60 word direct-answer lead block to `/specifications`, `/about`, `/products` (TH+EN) | HIGH | M (3–4 h) | Citability |
| 9 | Convert core-page H2/H3 to question form (TH+EN) | MEDIUM | M (2–3 h) | Citability |
| 10 | Add price ranges (even approximate) to spec table | MEDIUM | S (needs client data) | Citability |
| 11 | `Product`/`ItemList` schema on `/specifications` + `/products`; `BlogPosting` + author on `/blog/*` | MEDIUM | M (3 h) | Structural |
| 12 | Add named blog author entity + visible byline | MEDIUM | S (1 h) | Authority |
| 13 | YouTube channel with existing explainer animations; add to `sameAs` | MEDIUM | M (offsite) | Multi-Modal / Authority |
| 14 | Translate 3 blog posts to `/en/blog/[slug]` | MEDIUM | M (3 h) | Citability |
| 15 | OpenGraph + Twitter card tags in `BaseLayout` | MEDIUM | S (1 h) | Structural |
| 16 | Enrich specs with coating class, base standard, warranty years, wind guidance | MEDIUM | M (needs client data) | Citability |
| 17 | Add `public/llms.txt` | LOW | XS (20 min) | Technical |
| 18 | `VideoObject` schema + text transcript/summary for diagram videos | LOW | S (2 h) | Multi-Modal |
| 19 | Audit and fix empty `alt=""` on product/gallery images | LOW | S (1–2 h) | Multi-Modal |
| 20 | Add founding year + explicit legal-entity facts to `/about` | LOW | XS (needs client data) | Authority |
