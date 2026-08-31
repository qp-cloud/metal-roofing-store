# Search Experience Optimization (SXO) Findings — metal-roofing-store.vercel.app

Analyst pass: SERP-backwards analysis for the main Thai queries. Target: Meechai Steel
(หจก.มีชัยสตีล), metal roofing manufacturer, Nong Khai. Bilingual th/en Astro static site.

**SXO Gap Score: 34 / 100** (higher = better; 0-39 = Critical Mismatch band)

---

## 0. Method & Limitations

- SERP signals derived from WebSearch text results, not a logged-in Thai-geo Google SERP.
  Local pack, AI Overview, exact PAA wording and ad copy are **inferred from result-set
  composition**, not directly observed.
- No GSC / rank-tracker data — current rankings and existing impressions unknown.
- `render_page.py --mode auto` returned raw mode (`is_spa=false`) for all pages. The
  `/configurator` 3D tool is an embedded iframe; its interactive price output was not
  fully exercised.
- Thai keyword volumes are directional (from competitor title cues like "อัปเดต 2026"
  and result types), not from a keyword tool.
- Not individually audited: `/blog`, `/about`, `/technical-team`, `/testimonials`,
  `/promotions`, `/gallery`, `/branches`, `/en/*`. Competitor word counts estimated
  from snippets.

---

## 1. PRIMARY FINDING — Page-Type & Intent Mismatches

### 1a. `/products` + `/specifications` vs "แผ่นหลังคาเหล็ก ราคา" / "เมทัลชีท ราคา" — **CRITICAL**

**SERP consensus (~60% confidence):** ranking pages are **ecommerce category / product
listings with visible pricing** (Shopee, Thaiwatsadu, SCG Home, buildmate, spgwatsadu)
plus **price-guide Blog Posts** ("แผ่นเมทัลชีทราคาเมตรละเท่าไหร่ 2026 พร้อมวิธีคำนวณ",
"หลังคาเมทัลชีท คืออะไร ประเภท ราคา และวิธีเลือก"). Every competitor exposes a number:
฿140–450/ตร.ม. or ฿550–970/ม.

**Target reality:**
- `/specifications` = a **193-word** page whose entire "ราคาเริ่มต้น" column reads
  **"สอบถามราคา"** on every row. The page promises pricing in title/meta and delivers none.
- `/products` = **648 words**, no price, no SKU, no Product schema, no add-to-cart,
  no reviews, no per-model URLs. It is a thin category/hub, not a listing.

**Why it fails:** the dominant intent for these head terms is "show me a price / price
range." A page with zero pricing cannot win the snippet, cannot be cited in AI Overview,
and bounces the searcher. **This is the single highest-impact gap.**

**Fix (severity: CRITICAL):**
- Replace every "สอบถามราคา" cell with a real range: `เริ่มต้น ฿XXX–XXX / ตร.ม.
  (อัปเดต ส.ค. 2026)` + a one-line "ราคาขึ้นกับความหนา / สี / ปริมาณ / ระยะทางจัดส่ง".
  A range beats nothing.
- Build `/products` into a true listing: each รุ่น (Metal Sheet, Bolt-Type, Clip-Lock,
  PU Foam) gets its own URL, `Product` schema (`name`, `offers.priceSpecification`
  with a price range, `material`, `availability`), thickness options, starting price,
  downloadable spec PDF, use-case, 4+ photos, and a spec-prefilled "ขอใบเสนอราคา" form.
- See `/seo page` for page-level listing audit; `/seo schema` for Product/Offer markup.

### 1b. `/specifications` vs "เมทัลชีท คือ / ความหนา / เลือกอย่างไร" — **CRITICAL**

**SERP consensus (~95% confidence):** 100% informational **Blog Post** — 1,000–2,500-word
buyer guides from jorakay, ampelite, NS BlueScope (zacsroof), Thaiwatsadu articles,
SCG Smart Living. Paragraph featured snippet + PAA + likely AI Overview.

**Target reality:** `/specifications` is a 4-row table (193 words). `/blog` cadence
unknown but not surfaced in results. Meechai has **near-zero informational footprint**,
so it is invisible for the highest-volume awareness cluster and un-citable by AI Overview.

**Fix (severity: CRITICAL):** expand `/specifications` (or a new `/blog/` guide) to a
1,200+ word buyer guide: thickness-by-use-case (0.23–0.28 ชั่วคราว/รั้ว → 0.35+ บ้าน →
0.47+ โรงงาน), รูปลอน comparison, ระยะแป guidance, worked price calculation, FAQ block
with `FAQPage` schema. Internally link every section to the matching `/products` model.
Cross-ref `/seo content` for E-E-A-T depth.

### 1c. Homepage `/` vs "เมทัลชีท หนองคาย" (+ ราคา / โรงงาน / ใกล้ฉัน) — **HIGH**

**SERP consensus (~70% local/commercial):** local vendor storefronts (LnwShop sites with
phone numbers + "สั่งตัด"), B2B directory listings with **full NAP** (bethailand:
"หจ.พร้อมเมทัลชีท … 282 หมู่ 12 ต.โพธิ์ชัย อ.เมืองหนองคาย 43000"), local blogspot pages.
Local pack almost certainly present. Dominant type: **Local Page / local Service Page.**

**Target reality:** homepage is the *right intent match* (a real Nong Khai factory) but
is under-built for local: no `LocalBusiness` schema, NAP not above the fold, no map embed,
no opening hours, no Google review stars surfaced, no city-landing content, `/branches`
not linked from the hero. Domain is a `vercel.app` subdomain — weak entity/brand signal
for winning branded + local queries.

**Fix (severity: HIGH):**
- Sitewide `LocalBusiness` / `RoofingContractor` + `Organization` schema: full NAP, geo
  coords, `openingHoursSpecification`, `sameAs` (Facebook/LINE/Google Maps), company
  registration number.
- Above the fold on `/` and `/contact`: NAP block + Google Maps embed + tap-to-call
  `โทรเลย 042-xxx-xxx` + review rating.
- Add local landing pages: `เมทัลชีท-หนองคาย`, plus nearby demand (`อุดรธานี`, `บึงกาฬ`,
  `เลย`, `หนองบัวลำภู`) and per-สาขา pages.
- Migrate to a branded custom domain (e.g. `meechaisteel.co.th`) with 301s.
- See `/seo local` for GBP + local pack analysis.

### 1d. `/configurator` vs "โปรแกรมคำนวณเมทัลชีท / คำนวณหลังคา" — **MEDIUM**

**SERP consensus (~70% Tool):** interactive calculators (SCG Smart Living, zacsroof
`/roof-calculator`, homeest) that output จำนวนแผ่น + พื้นที่ + ราคา immediately, plus a
Pantip how-to thread and how-to articles.

**Target reality:** `/configurator` **is** a genuine 3D tool — page-type ALIGNED. But:
- Only **86 words** of wrapper copy; nothing to rank on.
- Price output is "ราคาโดยประมาณ", then the page pushes to LINE for "ราคาจริง" — the
  competitor tools just show the number.
- Ships with an "เปิดไม่ขึ้น หรือต้องการดูเต็มจอ?" fallback link — an implicit
  reliability/embedding caveat.
- No supporting SEO body: no "วิธีวัดพื้นที่หลังคา", no pitch-factor / overlap
  explanation, no worked example, no `WebApplication` schema.

**Fix (severity: MEDIUM):** show the estimated price inline (with disclaimer); add
"ดาวน์โหลด / แชร์สเปก (PDF)"; add a 600+ word below-the-tool section on measuring a
roof + a worked example; add `WebApplication` schema; deep-link `/products` cards into
the configurator with the model pre-selected.

### 1e. `/colors` (154 w), `/services` (250 w) — **HIGH (thin)**

Right page types but no depth, no schema, near-zero informational value. `/services`
should carry `Service` schema, a process description, and at least one case study;
`/colors` should carry per-colour anchors, warranty/coating detail, and links into
`/products` + `/configurator`.

### 1f. Bilingual th/en targeting — **HIGH**

`/en/` page tree exists but **no `hreflang` tags anywhere** and **no `canonical` tags
anywhere** (confirmed: `Canonical: None`, `hreflang: []` on every page parsed). Result:
ambiguous language targeting, likely-orphaned or self-cannibalising `/en/` pages, wasted
crawl budget. ~95%+ of the addressable market is Thai. Add `hreflang` th / en / x-default
on every pair + self-referencing canonicals, or `noindex` the `/en/` tree until it earns
its keep. See `/seo hreflang`.

---

## 2. SERP Feature Summary (inferred)

| Query cluster | Dominant type | Confidence | SERP features |
|---|---|---|---|
| เมทัลชีท ราคา / แผ่นหลังคาเหล็ก ราคา | Product/Category listing + price-guide Blog | ~60% | Shopping, ads, price-range snippet, PAA |
| เมทัลชีท คือ / ความหนา / เลือก | Blog Post (buyer guide) | ~95% | Paragraph snippet, PAA, AI Overview likely |
| เมทัลชีท หนองคาย / ใกล้ฉัน / โรงงาน | Local Page / local Service Page | ~70% | Local pack (map + 3), directory cards, "ใกล้ฉัน" related |
| โปรแกรมคำนวณเมทัลชีท / คำนวณหลังคา | Tool / Interactive | ~70% | Tool results, forum (Pantip), minimal PAA |

---

## 3. User Stories (each cites a SERP signal)

1. **Homeowner, one roof (awareness → consideration).** As a homeowner in Nong Khai
   re-roofing my house, I want to know which ความหนา / รูปลอน to choose and a ballpark
   ฿/ตร.ม., because I don't want to overpay or pick the wrong grade, **but I'm blocked
   by an information gap** — `/specifications` is a 4-row table with "สอบถามราคา" and no
   guidance.
   *Signal: informational SERP "หลังคาเมทัลชีท เลือกความหนากับความเหมาะในการใช้งาน";
   price-guide result "ราคาเมตรละเท่าไหร่ 2026 พร้อมวิธีคำนวณ".*

2. **Contractor, bulk buyer (decision).** As a ผู้รับเหมา sourcing sheet across multiple
   jobs, I want cut-to-length pricing, MOQ, lead time and delivery coverage to
   อีสานตอนบน / ลาว, because my bid margin depends on material-cost certainty, **but I'm
   blocked by price opacity** — every price cell says "สอบถามราคา", no rate card.
   *Signal: local storefront results advertising "สั่งตัด" + phone; marketplace results
   with explicit ฿/ตร.ม. ranges; target's own H1 "สำหรับงานผู้รับเหมาและโครงการ".*

3. **Project procurement, B2B (decision).** As a procurement officer for a warehouse
   build, I want spec sheets, มอก. compliance, warranty terms and a formal quote channel,
   because I must document vendor selection, **but I'm blocked by a trust/evidence gap**
   — no downloadable specs, no schema, no company-registration/credentials above fold.
   *Signal: SERP results stressing "ตัวแทนจำหน่ายอย่างเป็นทางการ … มีรับประกัน"; B2B
   directory listings with full NAP.*

4. **Estimator, calculator user (consideration).** As a builder estimating a จั่ว roof,
   I want to enter width / length / pitch and get sheet count + area + price, because
   I'm comparing quotes tonight, **but I'm blocked by tool friction** — Meechai's
   configurator returns only "ราคาโดยประมาณ" and routes me to LINE.
   *Signal: Tool-type SERP for "โปรแกรมคำนวณเมทัลชีท"; Pantip "คำนวณหลังคาเมทัลชีทยังงัย";
   competitor calculators (zacsroof, homeest, SCG) output จำนวนแผ่น / ราคา instantly.*

5. **Local near-me buyer (decision).** As a Nong Khai resident searching "เมทัลชีท
   ใกล้ฉัน", I want a nearby factory with address, hours, phone and reviews I can visit
   today, because I want to see sheet quality in person, **but I'm blocked by missing
   local signals** — no map, NAP not above fold, no `LocalBusiness` schema, no reviews.
   *Signal: local pack + "ใกล้ฉัน" storefront results for "เมทัลชีท หนองคาย"; directory
   listing "หจ.พร้อมเมทัลชีท" with full address.*

Journey coverage: awareness (1), consideration (1, 4), decision (2, 3, 5).

---

## 4. Gap Analysis — 7 Dimensions (34 / 100)

| Dimension | Score | Evidence |
|---|---|---|
| Page Type match | **7 / 15** | Homepage ~aligns to local-manufacturer intent; `/configurator` aligned. But `/products` and `/specifications` badly mismatched vs their target SERPs (listing/guide with pricing). |
| Content Depth | **3 / 15** | Word counts: `/` 336, `/products` 648, `/specifications` 193, `/colors` 154, `/configurator` 86, `/services` 250. Competitors run 1,000–2,500. Nothing to rank on for informational/price clusters; no PAA coverage. |
| UX Signals | **10 / 15** | Fast Astro static, mobile viewport, clear nav, thoughtful IA (footer quick-links, contact block). Deductions: no breadcrumbs, configurator iframe reliability caveat, vague CTAs ("พร้อมเริ่มโครงการหลังคาของคุณ?"). |
| Schema | **0 / 15** | `Schema Blocks: 0` on every page parsed. No `LocalBusiness`, `Organization`, `Product`, `FAQPage`, `BreadcrumbList`. |
| Media | **5 / 15** | `/` 7 imgs, `/products` 16 — OK. But `/configurator` 2, `/specifications` 3, `/colors` 2, `/services` 2. No video, no spec PDFs. Thin on the pages that must convert. Gallery exists but not surfaced on money pages. |
| Authority / E-E-A-T | **5 / 15** | Structural intent is good: `/about`, `/technical-team`, `/testimonials`, `/gallery` exist. But no credentials/มอก./client list above fold on money pages, no reviews surfaced, no company reg number visible, `vercel.app` subdomain weakens the entity. |
| Freshness | **4 / 10** | `publication_date` = generic 2026-01-01 build date; no visible dates; price table undated while competitors title "อัปเดต 2026"; `/blog` cadence not evidenced. |

---

## 5. Persona Scoring

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Homeowner, one roof | 12 | 9 | 8 | 10 | **39 / 100** | Critical Mismatch |
| Local near-me buyer | 14 | 8 | 7 | 10 | **39 / 100** | Critical Mismatch |
| Project procurement (B2B) | 13 | 8 | 7 | 11 | **39 / 100** | Critical Mismatch |
| Lao cross-border buyer | 15 | 9 | 8 | 11 | **43 / 100** | Needs Work |
| Estimator / calculator user | 17 | 12 | 9 | 12 | **50 / 100** | Needs Work |
| Contractor, bulk buyer | 18 | 11 | 10 | 13 | **52 / 100** | Needs Work |

**Persona evidence:** Homeowner + Local + Estimator derive from informational, local-pack
and tool SERP clusters respectively (highest head-term volume). Contractor is the
target's own declared audience (H1). Procurement derives from directory NAP + "official
distributor / warranty" result framing. Lao cross-border is target-declared
("ส่งไทย–ลาว") with light SERP support.

### Weakest personas (tie, 39/100) — address first, weighted by volume: Homeowner & Local

- **Homeowner, one roof — top issue:** no price and no "which spec for a house" answer;
  the searcher must bounce between `/colors`, `/specifications`, `/configurator` and
  still gets "สอบถามราคา". **Fix:** on `/specifications`, add a "เลือกความหนาสำหรับบ้าน"
  section with a recommendation table + a starting ฿/ตร.ม. range and a "ดูรุ่นสำหรับบ้าน"
  link to a filtered `/products` view. Change CTA from "สอบถามราคา" to
  "ดูราคาเริ่มต้น" → anchor to the price table.
- **Local near-me buyer — top issue:** no map, NAP below the fold, no reviews, no
  `LocalBusiness` schema. **Fix:** hero-adjacent NAP + Maps embed + `โทรเลย` button +
  review stars on `/` and `/contact`; ship `LocalBusiness` schema sitewide; link
  `/branches` from the header.

### Systemic issues (all personas)

- **Trust is the lowest dimension for every persona (7–10 / 25):** no schema, no reviews
  surfaced, no credentials above fold, `vercel.app` subdomain. Fix once, lifts all six.
- **Clarity second-lowest:** pricing hidden everywhere ("สอบถามราคา"); answers scattered
  across four thin pages with no contextual internal links or breadcrumbs.

### Priority actions

1. Kill "สอบถามราคา" — publish real starting price ranges on `/specifications` +
   `/products` (targets weakest personas + the CRITICAL SERP mismatch).
2. Sitewide `LocalBusiness` + `Organization` + `Product` + `FAQPage` schema, and NAP +
   map + reviews above the fold (systemic Trust fix).
3. Expand `/specifications` into a 1,200+ word buyer guide with FAQ (weakest persona:
   Homeowner; unlocks awareness cluster + AI Overview).
4. Add `hreflang` + `canonical` sitewide; decide `/en/` keep-or-noindex.
5. Contextual internal linking + `BreadcrumbList`: guide/spec sections → `/products`
   models → `/configurator` (pre-filled). Money pages currently get only boilerplate nav.

---

## 6. Why a well-built page still fails to rank / convert

| # | Cause | Severity | Fix |
|---|---|---|---|
| 1 | **Price opacity** — "สอบถามราคา" everywhere while every SERP competitor shows ฿/ตร.ม. or ฿/ม. Fails dominant intent; blocks snippet + AI Overview for "ราคา" queries. | CRITICAL | Publish starting price ranges + "อัปเดต ส.ค. 2026" date. |
| 2 | **Thin content** — 86–648 words vs 1,000–2,500 competitor guides. No informational/price-guide surface, no PAA coverage. | CRITICAL | 1,200+ word buyer guide; expand `/products`, `/services`, `/colors`. |
| 3 | **Zero structured data** on all pages. No local pack eligibility, no price rich results, no PAA capture, no knowledge panel. | CRITICAL | `LocalBusiness`, `Organization`, `Product`/`Offer`, `FAQPage`, `BreadcrumbList`, `WebApplication`. |
| 4 | **No hreflang / no canonical** despite `/en/` tree — split language targeting, orphaned/cannibalising EN pages, wasted crawl budget. | HIGH | hreflang th/en/x-default + self-canonicals, or noindex `/en/`. |
| 5 | **Weak internal linking, no breadcrumbs** — money pages get ~36 links = nav+footer only; no topical hub, no guide→product flow, low internal PageRank to `/products` & `/specifications`. | HIGH | Contextual cross-links + breadcrumb trail + a pillar guide. |
| 6 | **Trust proof not above fold** — testimonials, technical-team, gallery, company reg, มอก. all live on separate pages, never surfaced where conversion happens. | HIGH | Inject NAP, review stars, credentials, one testimonial into hero + money-page templates. |
| 7 | **`vercel.app` subdomain** — weak entity/brand signal; harder to win branded + "หนองคาย" local queries; lower perceived trust. | HIGH | Branded custom domain + 301s. |
| 8 | **Vague CTAs** — "พร้อมเริ่มโครงการหลังคาของคุณ?" instead of intent-matched "ขอใบเสนอราคา / โทรเลย / ดูราคาเริ่มต้น". | MEDIUM | Rewrite CTA labels per journey stage. |
| 9 | **Configurator withholds the number** — routes to LINE for "ราคาจริง"; competitor tools display it. Plus no supporting body copy. | MEDIUM | Show estimate inline + disclaimer; add measuring guide + `WebApplication` schema. |

---

## 7. Quick Wins (high impact / low effort)

1. Replace all "สอบถามราคา" cells with a starting **฿/ตร.ม. range** + update date on
   `/specifications` and `/products`.
2. Add `LocalBusiness` + `Organization` JSON-LD sitewide (full NAP, geo, hours, sameAs).
3. Add `FAQPage` JSON-LD + a 5–7 Q&A block to `/specifications` and `/products`
   (captures PAA).
4. Put NAP + Google Maps embed + tap-to-call + review stars above the fold on `/` and
   `/contact`; link `/branches` from the header.
5. Add `hreflang` (th / en / x-default) and self-referencing `canonical` to every page.
6. Show the configurator's estimated price inline (with disclaimer); add
   "ดาวน์โหลดสเปก (PDF)".
7. Rewrite hero/section CTAs to intent-matched labels ("ขอใบเสนอราคาโครงการ",
   "ดูราคาเริ่มต้น", "โทรเลย 042-…").
8. Add contextual internal links + `BreadcrumbList` connecting guide ↔ specs ↔ products
   ↔ configurator.

## 8. Structural (higher effort)

- Rebuild `/products` as a real listing: per-model URLs, `Product` schema with price
  range, thickness options, spec PDFs, photos, RFQ form.
- Expand `/specifications` (or new `/blog/` pillar) into a 1,200+ word buyer guide;
  build an informational cluster ("เมทัลชีท คืออะไร", "เลือกความหนา", "ราคาเมทัลชีท 2026",
  "เมทัลชีท vs กระเบื้อง", "ระยะแป") internally linked to products.
- Local landing pages: `เมทัลชีท-หนองคาย` + nearby demand (อุดรธานี, บึงกาฬ, เลย,
  หนองบัวลำภู) + per-สาขา pages.
- Dedicated cross-border `/ส่งลาว` page: export terms, customs, Vientiane delivery,
  Lao-language contact, a cross-border case study.
- Migrate to a branded custom domain with 301 redirects.

---

## 9. Cross-Skill Referrals

- `/seo schema` — generate `LocalBusiness`, `Organization`, `Product`/`Offer`,
  `FAQPage`, `BreadcrumbList`, `WebApplication`.
- `/seo content` — E-E-A-T depth for the `/specifications` buyer guide and cluster.
- `/seo local` — GBP + local pack analysis for "เมทัลชีท หนองคาย".
- `/seo page` — page-level audit for the `/products` listing rebuild.
- `/seo hreflang` — th/en targeting cleanup.

_Generate a PDF report? Use `/seo google report`._
