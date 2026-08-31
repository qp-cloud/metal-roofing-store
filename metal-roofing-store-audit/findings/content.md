# Content Quality & E-E-A-T Findings — metal-roofing-store.vercel.app

Business: หจก.มีชัยสตีล / Meechai Steel Ltd., Part. — metal roofing sheet + PU foam
insulated panel manufacturer, Nong Khai, Thailand. B2B (contractors + projects),
cut-to-length, delivers upper-Isan + Vientiane. Single site, no branches.
Primary language Thai; English secondary.

Scored against Google Sept 2025 Quality Rater Guidelines. Weights (Experience 20%,
Expertise 25%, Authoritativeness 25%, Trust 30%) are this skill's internal model,
not Google's published values.

---

## Scores

| Metric | Score |
|---|---|
| **Overall content quality** | **46 / 100** |
| E-E-A-T composite | 40 / 100 |
| — Experience (20%) | 45 / 100 |
| — Expertise (25%) | 38 / 100 |
| — Authoritativeness (25%) | 25 / 100 |
| — Trust (30%) | 52 / 100 |
| AI citation readiness | 30 / 100 |
| Content freshness | 35 / 100 |
| Bilingual parity (EN vs TH) | ~65% complete |
| AI-generated-content quality risk | LOW (copy is specific + honest) |

---

## CRITICAL

### C1. Zero structured data on every page
**Evidence:** `src/layouts/BaseLayout.astro` `<head>` contains only title, description,
icons, fonts. No JSON-LD anywhere in `src/` (`grep application/ld+json` → 0 hits).
Homepage render confirms `structured_data.block_count: 0`.
**Impact:** No `Organization` / `LocalBusiness` (name, geo, phone, area served,
opening hours), no `Product` / `Offer`, no `Article` (author, datePublished), no
`BreadcrumbList`, no `ImageObject` for the 1,295-photo gallery, no `FAQPage`.
This is the single biggest AI-citation and knowledge-graph blocker — an LLM or
Google cannot reliably attribute facts (who, where, what they sell, service area)
to this entity.
**Fix:**
- Add `Organization`/`LocalBusiness` JSON-LD in `BaseLayout` sourced from
  `src/data/site.ts` + `src/data/branches.ts`: `name` (TH + EN via `alternateName`),
  `telephone` (all 3), `sameAs` (Facebook + LINE), `areaServed` (Nong Khai, Udon
  Thani, Bueng Kan, "Vientiane, LA"), `address` once the street address lands,
  `geo`, `openingHours` once confirmed.
- Add `Product` + `Offer` (`priceCurrency: THB`, `priceSpecification` /
  `PriceRange`, or `availability`) per entry on `/products` from `products.ts` +
  `specs.ts`.
- Add `Article` / `BlogPosting` in `blog/[slug].astro` with `author`, `publisher`,
  `datePublished`, `dateModified`, `image`.
- Add `BreadcrumbList` sitewide.

### C2. Team page is empty — no named experts, no credentials
**Evidence:** `src/data/team.ts` → `export const team: TeamMember[] = [];`
(deliberately emptied to avoid fabrication). `src/pages/technical-team.astro`
therefore renders only an H1, one lead paragraph, a 4-item checklist and a CTA.
No people, photos, roles, years, or engineering licences (กว. / ภาคีวิศวกร).
**Impact:** For a manufacturer selling "ทีมช่างเทคนิคช่วยคำนวณ Taking-off" and
"ประเมินหน้างานโดยวิศวกร", the absence of any identifiable expert guts the
Expertise and Experience scores. The whole value proposition is unattributed.
**Fix:** Publish 2–4 real team members with consent: name, role, years, a
1–2 sentence bio referencing real project types, and (for any engineer) licence
type/number. Even first names + role + photo materially lifts Expertise. Mirror
into `/en/technical-team` (already wired to the same data).

### C3. No certification / standards evidence (มอก. / TIS / steel grade)
**Evidence:** `grep "มอก|TIS|ASTM|JIS|G550|AZ150|BlueScope"` across `src/` → none.
`about.astro` "โรงงานและมาตรฐาน" section makes only generic, unverifiable claims
("ควบคุมคุณภาพทุกล็อต", "รับประกันสินค้าตามประเภท", "ใบรับรองมาตรฐานสำหรับงานโครงการ").
**Impact:** Thai B2B roofing buyers filter on มอก. and on base-steel brand/grade.
None is stated. Directly requested check — fails. Kills Authoritativeness.
**Fix:** State concrete standards the product actually meets: มอก. number(s) for
coated steel / roofing sheet, base metal spec (e.g. hi-tensile G550), coating type
& class (AZ / ZM, e.g. AZ150), paint system, PU-foam density (kg/m³) and fire
behaviour, and named coil supplier if permitted. Add scanned certificates as
`ImageObject`. If a claim can't be substantiated, remove it rather than leave it
generic.

### C4. Factory / production / crew / delivery photos are all placeholders
**Evidence:** `src/assets/photos/` contains only `hero-metal-roof`,
`product-metal-sheet`, `product-pu-foam`, `product-panel-sheet`,
`product-accessory-ridge-cap`, `wall-ceiling-cafe`. Slots
`facility-exterior`, `facility-yard`, `production-roll-former`, `production-line`,
`installation-crew`, `installation-finished`, `delivery-truck`
(declared in `src/data/media.ts`, used on `/about` and `/services`) have no file,
so `Photo.astro` renders a striped placeholder `div`.
**Impact:** A self-described "โรงงานผลิต / factory-standard" manufacturer shows
**no photo of its factory, roll-former, production line, install crew or trucks**.
This is the core first-hand Experience proof for a manufacturer and it is absent
on the two pages that claim it.
**Fix:** Priority documentary photography for those 7 slots (brief already written
in `media.ts`). Until shot, the `/about` and `/services` pages materially overclaim
relative to what they can evidence.

---

## HIGH

### H1. Contact / legal trust gaps
**Evidence:** `src/data/branches.ts` — `addressTh/En` empty (province only:
"จังหวัดหนองคาย"); no `mapUrl`. `contact.astro` has "แผนที่ Google Maps
[เร็ว ๆ นี้]" and "เวลาเปิด–ปิด [เร็ว ๆ นี้]" as stubs. No email anywhere. No
legal-entity registration number (เลขทะเบียนนิติบุคคล/พาณิชย์ — required for a หจก.),
no tax ID, no founding year, no owner/founder name, no privacy policy / terms,
no written warranty term (years).
**Impact:** For B2B + cross-border export, buyers and procurement need a
verifiable registered address, hours, and entity number. Missing = Trust ceiling.
**Fix:** Publish street address + Google Maps embed + `geo` + opening hours +
หจก. registration number + a written warranty statement (term in years per
product) + a business email. These are the highest-leverage Trust wins.

### H2. Thin content — specifications page
**Evidence:** `specifications.astro` + `specs.ts`: 6-row table (profile, thickness
range, application, price). **Every `startingPrice` is empty** → column renders
"สอบถามราคา" for all rows, yet the page title/H1 is "สเปกสินค้าและราคาเริ่มต้น"
(promises starting prices it never shows). No BMT vs TCT, no coating mass, no
yield strength, no rib height/pitch, no cover width, no weight kg/m², no span
tables, no PU density / thermal conductivity (W/m·K) / R-value, no fire rating.
**Impact:** Well below what a contractor needs to shortlist; the price promise in
the title is unmet (misleading). Weak Expertise + poor AI-citability (no real
numbers to extract).
**Fix:** Either publish real starting prices (even "เริ่มต้น ฿xxx/ม.²,
อัปเดต <date>") or retitle the page and drop the price column. Add a full
engineering spec table per profile. Add "last updated" date.

### H3. Thin content — product pages
**Evidence:** `products.ts`: 5 real products, each ≈ 1 sentence `descTh` +
1 short `useTh`. 7 of 12 entries are `comingSoon` placeholders (PE Foam, EPS,
ridge cap, screw, flashing, fixings) sharing **identical** body text
("รายละเอียดสเปกอยู่ระหว่างจัดเตรียม ติดต่อสอบถาม…ทาง LINE"). `Photo.astro`
maps 8 of the 12 product image slots to a shared category photo.
**Impact:** Real products lack dimensions, spec table, pros/cons, install notes,
FAQ. The 7 identical placeholders are repetitive near-duplicate stubs (thin /
doorway pattern) and dilute the section.
**Fix:** Expand each real product to a proper detail block (spec table, suitable
substrate/slope, fastening, finish options, min order, lead time, an FAQ). Set
`comingSoon` items to `noindex` or collapse them into a single "coming soon" list
item until they have real content.

### H4. Thin + stalled blog
**Evidence:** `src/content/blog/` — 3 posts only, dates 2026-03-20, 2026-05-03,
2026-06-12 (nothing in the ~2.5 months to the 2026-08-31 audit date). Each body
is ~400–550 word-equivalents of Thai (roughly one third of a comprehensive
article). No author/byline, no sources/citations, no `dateModified`, no internal
links beyond a generic CTA, no images except one manim diagram, no FAQ, no schema.
Topics themselves are well chosen and on-intent.
**Impact:** Cadence signal is "abandoned". Depth is below the bar for the queries
they target. `blog/[slug].astro` renders no author and no structured data.
**Fix:** Add author (a named C2 team member) + `dateModified` + `BlogPosting`
schema. Triple each article's depth with real job specifics (site type, area,
system chosen, what went wrong/right, photos from the gallery). Commit to a
cadence (e.g. 2×/month) and backfill high-intent topics — see H6.

### H5. English version is partial and lower quality than Thai
**Evidence:**
- `src/pages/en/index.astro` is an **older template**: gradient placeholder hero
  (`.hero__media` CSS gradient, no real photo), none of the TH homepage's 7
  editorial sections, and it renders `<h2>What Customers Say</h2>` above an
  **empty grid** because `testimonials = []` (visible empty section = defect).
- `src/pages/en/blog.astro` is a stub: EN titles/excerpts only, "Read (Thai)"
  links to the Thai `/blog/{slug}`; explicit disclaimer "Article bodies are
  currently published in Thai only".
- No `hreflang` / `rel=alternate` / canonical anywhere (`BaseLayout` has none),
  so TH and EN pages are not linked as language alternates.
- Positive: `/en/about`, `/en/products`, `/en/services`, `/en/specifications`,
  `/en/colors`, `/en/contact`, `/en/branches`, `/en/technical-team`,
  `/en/promotions` are genuine translations (data carries `*En` fields).
**Impact:** EN buyers (Vientiane/Laos B2B, an explicit target) land on a weaker
homepage, a broken-looking testimonials block, and untranslated articles.
No hreflang risks TH/EN being treated as duplicates or the wrong one ranking.
**Fix:** Rebuild `/en/index` from the current TH homepage component with EN copy
and real photos; guard the testimonials section with `testimonials.length > 0`
(same pattern already used elsewhere). Translate the 3 article bodies. Add
`hreflang` pairs + self-canonical in `BaseLayout`.

### H6. Keyword / buyer-intent coverage gaps
**Present & good:** เมทัลชีท, แผ่นหลังคาเหล็ก, PU Foam, แผ่นฉนวน, ผู้รับเหมา,
โครงการ, ตัดตามความยาวหน้างาน, Bolt Type / Clip-Lock / Snap-Lock, ฉนวนกันความร้อน,
ห้องเย็น, สปป.ลาว / เวียงจันทน์ / สะพานมิตรภาพ. Local + product + system intent
is covered.
**Missing / weak:**
- **Pricing intent** — "ราคาเมทัลชีทต่อเมตร/แผ่น", "ราคาแผ่น PU ต่อตารางเมตร":
  no actual price appears anywhere on the site.
- **มอก. / มาตรฐาน / เกรดเหล็ก / ความหนา BMT** — see C3.
- **"เมทัลชีทกันร้อน"**, "หลังคากันความร้อน" — high-volume, not targeted as a page.
- **City/area landing pages** — "เมทัลชีทหนองคาย", "…อุดรธานี", "…บึงกาฬ",
  "…เวียงจันทน์": service area is stated in prose only, no per-area page.
- **Question queries** — "ระยะแปเมทัลชีทเท่าไหร่", "เมทัลชีทหนากี่มิล",
  "หลังคาเมทัลชีทกี่ปี…รับประกัน": no FAQ content anywhere on the site.
**Fix:** Add a real pricing/quote content block; add a "เมทัลชีทกันความร้อน" pillar
page; add 3–4 area pages (Nong Khai / Udon Thani / Bueng Kan / Vientiane) with
genuinely localised content (delivery time, border process, local projects);
add FAQ sections (with `FAQPage` schema) to `/products`, `/specifications`,
`/services`.

---

## MEDIUM

### M1. Gallery photos carry no semantic value
**Evidence:** `gallery.astro` — 1,295 real job photos, but alt text is
`ภาพผลงานติดตั้งหลังคาเหล็ก มีชัยสตีล เลขที่ {n}` (a sequence number). No caption,
project type, location, product/system, or date. No `ImageObject` schema.
`gallery-manifest.json` has only id/orientation/dimensions.
**Impact:** The site's strongest raw Experience asset is nearly invisible to
search/LLMs. 1,295 near-identical alt strings also read as low quality.
**Fix:** Tag a subset (even 40–60) with real captions: "หลังคาโกดัง Bolt Type
0.47 มม. อ.เมืองหนองคาย, 2025". Group into named case studies. Add `ImageObject`
with `contentUrl`, `caption`, `contentLocation`.

### M2. No visible social proof anywhere on-site
**Evidence:** `testimonials.ts` empty (deliberate); `/testimonials` is a CTA to
Facebook. `src/data/facebook-posts.json` is `[]`, so `FacebookUpdates` renders
nothing and the homepage "ข่าวสารจากเพจ" section never appears.
**Impact:** Zero reviews, ratings, or recent-activity signal on the property
itself. Trust + Experience both suffer; no `Review` / `AggregateRating` possible.
**Fix:** Run `pnpm run facebook` and keep the feed populated (freshness). Obtain
consent for 4–6 real named testimonials (project + area) and render them with
`Review` schema. Consider embedding 1–2 consented review videos (slots already
planned in `media.ts`).

### M3. "เร็ว ๆ นี้ / Coming Soon" stubs indexed
**Evidence:** `promotions.astro` (whole page), `about.astro#vision`,
`contact.astro#map`, `contact.astro#hours`, plus 7 `comingSoon` products, and EN
equivalents.
**Impact:** Multiple thin placeholder pages/sections in the index; "โปรโมชั่น" in
main nav leads to an empty page.
**Fix:** `noindex` the placeholder pages until they have content, or fill them.
Remove Promotions from primary nav until it's real.

### M4. No `dateModified` / freshness signal on evergreen pages
**Evidence:** `/specifications`, `/products`, `/colors`, `/services` show no
"updated" date. `htmldate` fell back to `2026-01-01` for the homepage.
**Impact:** Price/spec pages read as undateable; weak freshness for pages that
should be maintained.
**Fix:** Add a visible "ปรับปรุงล่าสุด <date>" to spec/price/product pages and
`dateModified` in schema.

### M5. About page overclaims vs evidence
**Evidence:** `about.astro` "ก่อตั้งจากครอบครัวช่างเหล็ก", "ทีมช่างเทคนิคที่มี
ประสบการณ์ตรง", "รับประกันสินค้า…ใบรับรองมาตรฐาน" — no founder name, no year, no
named team (C2), no certificate (C3), no factory photo (C4). Vision section is a
stub.
**Impact:** Reads as generic company boilerplate; little that a rater could
verify. Borderline for the Sept 2025 "generic phrasing / no first-hand signal"
AI-content markers even though the copy is otherwise specific.
**Fix:** Add founding year, founder/owner name, a concrete origin detail, machine
makes/capacities, output capacity, and at least one dated milestone.

---

## LOW / POSITIVE

### Positives (protect these)
- **Anti-fabrication editorial stance** — `team.ts`, `testimonials.ts`,
  `branches.ts` deliberately hold no invented people, reviews, or address.
  This is a genuine Trust signal and the right call; the fix is to add *real*
  data, not to relax the stance.
- **Copy is specific and human** — real geography (25 km from Vientiane, First
  Friendship Bridge), real process language (Taking-off, ระบบยึด, ระยะแป,
  ความลาดเอียงต่ำ), honest disclaimers on the diagrams and on pricing. Low risk
  against the Sept 2025 low-quality-AI markers.
- **Concept diagrams** (manim: sheet-thickness, seam-systems, pu-foam) on
  `/specifications`, `/products`, blog — a real Expertise asset. Expand this
  library.
- **Information architecture / hierarchy** — clean single H1 per page, logical
  H2s, semantic sections, descriptive alt on the real product/hero images,
  skip-link, reduced-motion handling. Good readability for Thai B2B (short
  declarative sentences, scannable chips/lists).
- **Real product taxonomy** (`products.ts`, `specs.ts`, `colors.ts`) and a large
  genuine job-photo gallery — strong foundations once captioned and structured.

### L1. `og:*` / `twitter:*` / canonical absent
`BaseLayout` emits no Open Graph or Twitter Card tags and no self-canonical.
Hurts link previews and AI summarisation. Add OG title/description/image/type,
`article:published_time` on posts, and self-canonical.

### L2. No `robots.txt` / `sitemap.xml`
Neither in `public/` nor generated (`@astrojs/sitemap` not installed). Add both.

### L3. Blog Buddhist-era dates only
`blog/index.astro` formats dates as `th-TH-u-ca-buddhist` ("2569"). Fine for
humans; ensure `<time datetime>` (already ISO) and schema use Gregorian.

---

## Recommended priority order

1. **C1** JSON-LD (`Organization`/`LocalBusiness`, `Product`, `Article`,
   `Breadcrumb`) in `BaseLayout` + templates — unblocks AI citation.
2. **H1** Publish street address + map + hours + หจก. registration no. +
   warranty terms.
3. **C3 / H2** Real standards (มอก., steel grade, coating, PU density/fire) and
   real starting prices (or retitle the specs page).
4. **C2** Add 2–4 real, consented team members with credentials.
5. **C4** Shoot the 7 factory/production/crew/delivery photo slots.
6. **H4 / H6** Deepen the 3 posts (with author + schema), then publish
   pricing / "กันความร้อน" / area / FAQ pages on a fixed cadence.
7. **H5** Rebuild `/en/index` to parity, fix the empty EN testimonials section,
   translate article bodies, add `hreflang`.
8. **M1 / M2** Caption a gallery subset as case studies; populate the Facebook
   feed; add consented `Review` schema.
9. **M3** `noindex` or remove the "เร็ว ๆ นี้" stub pages/nav entries.

---

## audit-data.json — Content Quality category

```json
{
  "category": "Content Quality",
  "score": 46,
  "eeat": {
    "composite": 40,
    "experience": 45,
    "expertise": 38,
    "authoritativeness": 25,
    "trust": 52
  },
  "ai_citation_readiness": 30,
  "content_freshness": 35,
  "bilingual_parity_pct": 65,
  "ai_generated_content_risk": "low",
  "findings": [
    { "id": "C1", "severity": "critical", "title": "Zero structured data on every page (no Organization/LocalBusiness/Product/Article/Breadcrumb JSON-LD)", "evidence": "src/layouts/BaseLayout.astro head; grep application/ld+json = 0; render structured_data.block_count = 0" },
    { "id": "C2", "severity": "critical", "title": "Technical team page empty — no named experts or credentials", "evidence": "src/data/team.ts team = []; src/pages/technical-team.astro" },
    { "id": "C3", "severity": "critical", "title": "No certification / standards evidence (มอก./TIS/steel grade/PU spec absent)", "evidence": "grep มอก|TIS|ASTM|JIS|G550|AZ150 in src/ = none; about.astro standards section generic" },
    { "id": "C4", "severity": "critical", "title": "Factory, production, crew and delivery photos are placeholders", "evidence": "src/assets/photos/ missing facility-*, production-*, installation-*, delivery-truck; Photo.astro renders striped div fallback" },
    { "id": "H1", "severity": "high", "title": "Contact/legal trust gaps: no street address, map, hours, registration no., email, warranty terms", "evidence": "src/data/branches.ts addressTh empty, no mapUrl; contact.astro map & hours are 'เร็ว ๆ นี้' stubs" },
    { "id": "H2", "severity": "high", "title": "Specifications page thin; every starting price blank despite price-promising title", "evidence": "src/data/specs.ts startingPrice all ''; specifications.astro title 'สเปกสินค้าและราคาเริ่มต้น'" },
    { "id": "H3", "severity": "high", "title": "Product pages thin; 7 identical 'coming soon' placeholder entries", "evidence": "src/data/products.ts — 5 real (1-sentence), 7 comingSoon with identical body text" },
    { "id": "H4", "severity": "high", "title": "Blog thin and stalled: 3 short posts, none since 2026-06-12, no author/schema/sources", "evidence": "src/content/blog/*.md; blog/[slug].astro renders no author or JSON-LD" },
    { "id": "H5", "severity": "high", "title": "English version partial + lower quality; empty EN testimonials section; no hreflang", "evidence": "src/pages/en/index.astro old template + empty testimonials grid; src/pages/en/blog.astro stub links to Thai bodies; BaseLayout has no hreflang/canonical" },
    { "id": "H6", "severity": "high", "title": "Buyer-intent coverage gaps: pricing, มอก., 'กันความร้อน', city/area pages, FAQ", "evidence": "no price anywhere; no FAQ anywhere; service area in prose only" },
    { "id": "M1", "severity": "medium", "title": "1,295 gallery photos have only sequential-number alt text, no captions or ImageObject", "evidence": "gallery.astro altFor(i) = '...เลขที่ {i+1}'; gallery-manifest.json has no captions" },
    { "id": "M2", "severity": "medium", "title": "No visible social proof; Facebook feed empty so homepage updates section never renders", "evidence": "src/data/testimonials.ts = []; src/data/facebook-posts.json = []" },
    { "id": "M3", "severity": "medium", "title": "'เร็ว ๆ นี้ / Coming Soon' stub pages indexed (Promotions in main nav, Vision, Maps, Hours)", "evidence": "promotions.astro, about.astro#vision, contact.astro#map & #hours" },
    { "id": "M4", "severity": "medium", "title": "No visible dateModified / freshness signal on spec, price, product, color pages", "evidence": "specifications.astro, products.astro, colors.astro; htmldate fallback 2026-01-01" },
    { "id": "M5", "severity": "medium", "title": "About page claims (family founding, experienced team, warranty, certificates) unbacked by names/dates/photos/docs", "evidence": "about.astro; vision section is a stub" },
    { "id": "L1", "severity": "low", "title": "No Open Graph / Twitter Card / self-canonical tags", "evidence": "src/layouts/BaseLayout.astro" },
    { "id": "L2", "severity": "low", "title": "No robots.txt or sitemap.xml", "evidence": "public/ has neither; @astrojs/sitemap not in package.json" },
    { "id": "L3", "severity": "low", "title": "Blog dates rendered Buddhist-era only (cosmetic)", "evidence": "blog/index.astro toLocaleDateString('th-TH-u-ca-buddhist')" }
  ],
  "positives": [
    "Deliberate anti-fabrication stance (no invented team, reviews, or address)",
    "Copy is specific and human — real geography, real process vocabulary, honest disclaimers; low AI-slop risk",
    "Concept diagrams (manim) are a genuine expertise asset",
    "Clean heading hierarchy, semantic sections, good alt text on real images, strong Thai B2B readability",
    "Real product taxonomy and a large genuine job-photo gallery as foundations"
  ]
}
```
