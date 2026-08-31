# Local SEO Findings — Meechai Steel Ltd., Part. (หจก.มีชัยสตีล)

Site: https://metal-roofing-store.vercel.app/ (Astro static, bilingual th/en)
Audited: 2026-08-31
Scope: Nong Khai Province, Thailand. Metal roofing sheet + PU/PE/EPS insulated panel manufacturer, installer, and cross-border supplier (Vientiane, Lao PDR).

## Local SEO Score: 20 / 100

| Dimension | Weight | Score | Weighted | Notes |
|-----------|--------|-------|----------|-------|
| GBP Signals | 25% | 12 | 3.0 | No Google Business Profile linked/embedded; map is a "coming soon" placeholder; Facebook link is a personal profile, not a Page |
| Reviews & Reputation | 20% | 8 | 1.6 | No reviews on site (deliberate), no `aggregateRating`, no Google reviews (no GBP), testimonials array empty |
| Local On-Page SEO | 20% | 45 | 9.0 | Homepage TH/EN titles + meta carry "หนองคาย / Nong Khai" and service area; dedicated /contact, /branches, /services with cross-border section; but no map, no address, no service-area pages, thin contact page |
| NAP Consistency & Citations | 15% | 25 | 3.75 | Name + phones consistent across footer/pages with correct `tel:` E.164; but NO street address anywhere, no directory citations, no sitemap/robots |
| Local Schema Markup | 10% | 0 | 0.0 | Zero structured data site-wide — no Organization, LocalBusiness, WebSite, or BreadcrumbList |
| Local Link & Authority Signals | 10% | 10 | 1.0 | Only outbound links are own FB/LINE; no citations, no supplier/dealer listings; site on a vercel.app subdomain |

Interpretation: this is effectively pre-launch for local search. The on-page geographic targeting is reasonable, but the three pillars that actually drive local rankings — a verified Google Business Profile with the right primary category, a published NAP (address), and citations — are all absent.

---

## Business Type: HYBRID (storefront/factory + service-area)

Signals:
- Physical premises: repeated references to "โรงงานของเราเอง" / "Our plant is in Nong Khai", in-house production line, delivery fleet, in-house installation crews.
- Service-area language: "จัดส่งถึงหน้างานด้วยรถของเราเอง", service area = Nong Khai, Udon Thani, Bueng Kan, upper Isan + Vientiane (Lao PDR) cross-border.
- No visible street address, no Maps embed, no directions link anywhere.

GBP implication: this should be a **storefront listing at the factory address**. A service area can be added for user clarity, but **GBP rankings derive from the verification (physical) address, not the service area** — a configured service area does not, by itself, make you rank in Udon Thani, Bueng Kan, or Vientiane (Sterling Sky, March 2025). Ranking in outlying cities is an organic job (dedicated service-area pages), not a GBP setting. A storefront listing is still stronger than a pure SAB listing (SAB hides the pin and ranks on a wider, weaker radius). The missing address is the single biggest blocker to a strong GBP.

## Industry Vertical: Building materials manufacturer + roofing contractor (Home Services family)

Signals: manufacturing/roll-forming, cut-to-length, "รับงานผู้รับเหมาและโครงการ" (contractor & project supply), technical take-off service, licensed installation crews, RFQ workflow, cross-border export docs. No restaurant/healthcare/legal/real-estate/automotive signals.

Industry-specific findings:
- **No LocalBusiness subtype declared.** Recommended primary: JSON-LD `@type: "RoofingContractor"` (a Google-supported `HomeAndConstructionBusiness` > `LocalBusiness` subtype — confirmed in the March 2026 schema reference). If material sales dominate revenue over installation, use `HardwareStore` (a `Store` > `LocalBusiness` subtype) instead, or multi-type. Note: `Manufacturer` is an `Organization` subtype, **not** a Google LocalBusiness subtype — model the production side with `makesOffer` / `hasOfferCatalog`, or a separate `Organization` node, rather than as the local `@type`.
- **No `makesOffer` / `hasOfferCatalog`** for the product lines (metal roofing, snap-lock, wall panel, PU/PE/EPS foam, accessories) — these already exist in `src/data/products.ts` and could feed schema.
- **No `areaServed`** anywhere in markup — the service area is only prose. When added, use named places with `sameAs` links to Wikipedia/Wikidata (Nong Khai, Udon Thani, Bueng Kan, Vientiane Prefecture).
- **No "licensed & insured" / warranty / standards trust block** in a machine-readable form (there is prose on /about about factory standards).

---

## NAP Consistency Audit

| Field | Footer (th/en) | /contact | /branches | JSON-LD schema | Meta tags | Facebook | Google Maps |
|-------|----------------|----------|-----------|----------------|-----------|----------|-------------|
| **Name** | หจก.มีชัยสตีล / Meechai Steel Ltd., Part. | หจก.มีชัยสตีล | หจก.มีชัยสตีล / Meechai Steel Ltd., Part. | ABSENT | in `<title>` only | profile.php (name not a verified business name field) | NONE |
| **Address** | omitted (`hasAddress` false) | "กำลังจัดเตรียม… / coming soon" | "จังหวัดหนองคาย / Nong Khai Province" only | ABSENT | none | none on a personal profile | NONE |
| **Phone** | 042-990-595, 091-052-9136, 081-872-6147 | same 3, `tel:+6642990595` etc. | same 3 | ABSENT | none | not structured | NONE |

Discrepancies / gaps:
- **[Critical] No street address in any source.** Province-only. GBP verification, citation building, and `PostalAddress` schema (a Google-*required* LocalBusiness property, with streetAddress/addressLocality/addressRegion/postalCode) are all blocked until the factory address (บ้านเลขที่ / หมู่ / ตำบล / อำเภอ / จังหวัด / รหัสไปรษณีย์) is published.
- **[Critical] No Google Maps listing / URL / embed.** Menu has a "Google Maps — เร็ว ๆ นี้" link to `/contact#map`, which is a placeholder ("กำลังจัดเตรียมแผนที่ฝังหน้านี้"). Same for business hours (`#hours`).
- **[High] Facebook is a personal profile** (`facebook.com/profile.php?id=61593025679719`), not a Business Page (`/YourPageName`). A personal profile has no NAP fields, no category, no reviews/recommendations, no "Services" tab, and cannot be claimed as a citation. This also fails the FB<->GBP name/category consistency check.
- **[Medium] Phone roles unconfirmed** — `site.ts` comments admit "which desk answers which line has not been confirmed". Pick ONE primary number for GBP + schema `telephone` (must match GBP + page NAP exactly); keep the others as `contactPoint`s. Use 042-990-595 (landline) as primary for local trust.
- **[Low] Name transliteration** — "Ltd., Part." is an unusual English rendering of หจก. (ห้างหุ้นส่วนจำกัด / limited partnership). Fine legally, but pick one exact English string and reuse it byte-for-byte across GBP, Facebook, and every directory. Schema `name` must match GBP exactly.
- **Positive:** name and all three phone numbers are internally consistent everywhere they appear, and `tel:` hrefs are valid E.164.

---

## GBP Optimization Checklist (detected vs missing)

| Item | Status |
|------|--------|
| GBP exists / claimed / verified | UNKNOWN — nothing on-site references one; assume not created |
| Maps embed on site | MISSING (placeholder) |
| "Get directions" link | MISSING |
| Primary category set | N/A — **#1 ranking factor (Whitespark score 193); wrong category is the #1 negative factor (176)** |
| Secondary categories | N/A |
| NAP on GBP matches site | N/A — site has no address to match |
| Business hours (openingHoursSpecification) | MISSING on site (placeholder) and presumably on GBP |
| Service area configured | MISSING (helps users; does not itself drive rank in those cities) |
| GBP photos (exterior, interior, product, team, at-work) | Gallery photos exist on-site and could be reused; none tied to a GBP |
| GBP Products / Services populated | Product + service data exists in repo; not published to a GBP |
| GBP Posts cadence | No indicator |
| Review link / QR in use | No indicator |
| UTM-tagged website link from GBP | N/A |

Recommended categories (Thailand GBP taxonomy):
- **Primary:** "Roofing contractor" (ผู้รับเหมามุงหลังคา) OR "Roofing supply store" (ร้านขายอุปกรณ์มุงหลังคา) — choose by dominant revenue. Given in-house crews + "รับงานผู้รับเหมาและโครงการ", "Roofing contractor" is the safer #1.
- **Secondary:** "Metal fabricator", "Manufacturer", "Insulation contractor", "Corrugated iron supplier", "Building materials supplier".
- Do NOT pick a generic "Contractor" or "Construction company" as primary — too broad, weak relevance.

---

## Review Health Snapshot

| Metric | Value |
|--------|-------|
| On-site rating shown | none |
| On-site review count | none |
| `aggregateRating` in schema | none |
| Google reviews | none (no GBP) |
| Facebook recommendations | not visible (personal profile can't collect them) |
| Response pattern | n/a |
| Velocity | 0 — **fails the 18-day rule** (Sterling Sky: local rankings cliff after ~3 weeks with no new reviews) |

`/testimonials` deliberately shows no quotes and links to Facebook ("เราเลือกที่จะไม่คัดลอกรีวิวมาแสดง"). Ethically sound, but it means there is currently **zero first-party or Google review signal** for local ranking or AI visibility. `src/data/testimonials.ts` is intentionally empty.

Actions:
- Stand up GBP, then run a continuous review drive: post-install QR card + LINE broadcast + follow-up. Target a minimum of 2-4 new Google reviews/month, never a gap > 2 weeks.
- Once ≥ 5 genuine, permission-cleared reviews exist, add real quotes to `testimonials.ts` and mark up the page with `Review` items (with `author`, `datePublished`) — but only reflect real GBP/FB reviews; do not fabricate `aggregateRating`.
- Ask 3-5 Lao (Vientiane) customers for reviews too — cross-border social proof and Lao-language keywords help the Vientiane service-area page.

---

## Citation Presence — Tier 1 (Thailand-adjusted)

Yelp and BBB are not relevant in Thailand. Thailand Tier 1 / high-value sources:

| Source | Status | Notes |
|--------|--------|-------|
| Google Business Profile / Google Maps | MISSING | Highest priority. Blocked by missing address. |
| Facebook **Business Page** | WRONG TYPE | Currently a personal profile. Create/convert to a Page with full NAP, category, hours, Services. |
| LINE Official Account | PARTIAL | `@680rgqnj` looks like an OA handle — confirm it is a verified OA (not a basic account), list it consistently, add to schema `sameAs`. |
| Longdo Map (map.longdo.com) | MISSING | Thai-native mapping/POI service — add the factory POI. |
| Thai Yellow Pages (yellowpages.co.th) | MISSING | Category: roofing / steel / building materials. |
| Thaitambon (thaitambon.com) | MISSING | Thai SME/OTOP + manufacturer directory — strong fit for a หจก. manufacturer. |
| DBD / Creden.co / dataforthai.com | LIKELY AUTO-LISTED | Registered as หจก., so corporate registry data exists. Verify the trading address + business description match your published NAP. |
| Wazzadu.com | MISSING | Thai construction-materials marketplace/community — high vertical relevance. |
| Builk.com / one-stock / ThaiWatsadu supplier networks | MISSING | Construction procurement platforms. |
| Coil-supplier dealer locator (NS BlueScope / BHP / Bluescope Zacs, etc.) | MISSING | Ask your steel-coil supplier to list you as an authorized roll-former — a strong industry citation + backlink. |
| Kapook / Pantip Market / ThaiSecondhand B2B threads | OPTIONAL | Lower value, but cheap. |
| Apple Business Connect (Apple Maps) | MISSING | Covers Thailand + Laos. |
| Lao: yellowpages.la, Lao FB groups/marketplace | MISSING | For Vientiane demand; Facebook is dominant in Laos. |

Note: citation-related factors are 3 of the top 5 AI-visibility factors — this gap materially limits both local pack and AI-answer inclusion.

---

## Local Schema Validation

Current state: **no structured data of any kind** (`structured_data.block_count = 0` in render; no `application/ld+json` in any `dist/**/*.html`; `BaseLayout.astro` `<head>` emits only `charset`, `viewport`, `title`, `description`, icons, fonts).

Context: schema is **not a direct ranking factor** (confirmed: Mueller, Illyes). Its value here is indirect — rich results (~43% CTR uplift, Webstix), entity/NAP disambiguation, and eligibility for AI-search features. Given the current zero baseline, the upside is still large.

Also missing from `<head>` (not schema, but local-relevant): canonical, `og:*`, `twitter:*`, and `hreflang` alternates linking each `/xxx` (th) to `/en/xxx` (en). No `robots.txt`, no `sitemap.xml` (no `@astrojs/sitemap`).

Required + recommended properties for the LocalBusiness node (target completeness):

| Property | Required? | Have data? |
|----------|-----------|-----------|
| `@type` correct subtype (`RoofingContractor`, or `HardwareStore` if supply-led) | required | decision only |
| `name` (must match GBP exactly) | required | yes (`site.nameTh` / `nameEn`) |
| `address` (`PostalAddress`: streetAddress, addressLocality, addressRegion, postalCode, addressCountry TH) | required | **NO street/postal** |
| `telephone` (match GBP + page NAP) | recommended | yes — pick primary |
| `url` (canonical for the location) | recommended | yes |
| `geo` (`GeoCoordinates` lat/lng, **≥ 5 decimal places**, ~1.1 m) | recommended | **NO** |
| `openingHoursSpecification` | recommended | **NO** (placeholder) |
| `areaServed` (named places + `sameAs` Wikidata: Nong Khai, Udon Thani, Bueng Kan, Vientiane) | recommended (industry, SAB) | prose only |
| `sameAs` (Facebook Page, LINE OA) | recommended | partial (FB is wrong type) |
| `image` / `logo` | recommended | yes (`src/assets/brand/logo.png`, gallery) |
| `priceRange` (< 100 chars) | optional | could add |
| `hasMap` | recommended | **NO** |
| `aggregateRating` | optional | **do not add until real reviews exist** |

Recommended implementation:
1. Site-wide `Organization` + `WebSite` node in `BaseLayout.astro` (with `@id`).
2. `LocalBusiness`/`RoofingContractor` node on `/branches` and `/contact` (once address + geo + hours exist), `branchOf` the Organization `@id`, driven from `src/data/branches.ts` + `src/data/site.ts` so it stays single-source-of-truth.
3. `BreadcrumbList` per page.
4. Optional `Product` / `hasOfferCatalog` from `src/data/products.ts` to carry the manufacturing/supply dimension.

---

## Location Page Quality (multi-location)

Single location — multi-location location-page rules do not apply. `src/data/branches.ts` correctly models one site and templates skip the empty address line rather than inventing one (good discipline).

Service-area landing pages — OPPORTUNITY, gated on quality:
- Candidate pages under a subdirectory (subdirectory consolidates link equity better than subdomain — Bruce Clay, ~50%+ traffic lift): `/service-area/nong-khai`, `/service-area/udon-thani`, `/service-area/bueng-kan`, `/service-area/vientiane-laos` (th + en). Dedicated service/area pages are the **#1 local-organic factor and #2 AI-visibility factor**, so the upside is real — and since GBP service-area config does not drive rank in those cities, these pages are the primary lever for Udon Thani / Bueng Kan / Vientiane visibility.
- **Do NOT ship thin doorway pages** (same body text with the city name swapped — fails the doorway swap test and risks a manual action). Each page needs genuinely unique content: real projects in that province (photos + scope), delivery lead time and distance from the factory, local structural considerations, and — for Vientiane — the customs/permit/currency/Incoterms detail that already exists in prose on `/services` and `/branches`.
- Enabler first: `src/data/gallery-manifest.json` / gallery projects currently carry **no province/location tags**. Add a `province` (and optional `country`) field per project, surface "ผลงานใน[จังหวัด]" filtering, and let those real projects populate the area pages. Without 3+ real local projects per area, hold the page.
- Internal linking: from homepage service-area block, footer, `/branches`, and `/services` cross-border section into each area page; cross-link area pages to relevant product pages.

Cross-border (Lao PDR) considerations:
- Keep ONE GBP at the Nong Khai factory with Vientiane added as a service area. Do **not** create a Lao address/listing you can't staff or verify — that risks a GBP suspension.
- Google Maps and Apple Maps both cover Laos; a Vientiane service-area page in TH + EN is legitimate. Consider a short Lao-language (lo) summary block — though most Lao B2B buyers read Thai.
- Facebook is the dominant discovery channel in Laos — the FB Business Page matters more for that market than for Thailand.
- Currency, First Thai–Lao Friendship Bridge logistics, and export-doc content is already drafted on `/services` — repurpose into the Vientiane page rather than writing thin filler.

---

## On-Page Local Signals — detail

Strengths:
- Homepage TH `<title>`: `หจก.มีชัยสตีล หนองคาย | โรงงานผลิต…ส่งไทย–ลาว` — brand + city + vertical + service area. Good.
- Homepage EN `<title>`: `Meechai Steel, Nong Khai | Metal Roofing & Insulated Panels, Thailand & Laos`. Good.
- Meta descriptions on homepage (th/en) name the city and service area.
- Dedicated `/contact`, `/branches`, `/services` with a genuine cross-border section; RFQ list asks for จังหวัด / Lao-side flag.
- Bilingual th/en throughout (helps Lao + expat/EN queries).

Gaps:
- Inner-page titles (`/contact`, `/services`, `/branches`, `/products`, `/about`, `/gallery`, `/testimonials`) are brand-only, no city/region. Add "หนองคาย" / "อีสานตอนบน" where natural.
- No `<meta name="geo.*">` / `<meta name="ICBM">` (minor, but cheap).
- Footer has no NAP block (address suppressed; phones present). Add full NAP to footer once address exists — sitewide NAP is a standard local signal.
- No embedded map, no directions link.
- No visible business hours anywhere.
- H1s are generic ("ติดต่อเรา", "บริการของเรา") — no geo modifier.
- No breadcrumb navigation (UX + `BreadcrumbList` schema).
- vercel.app subdomain: weak for brand/citation matching and trust. Move to a custom domain (`.co.th` ideal for a registered Thai partnership, or `.com`).

---

## Top 10 Prioritized Actions

1. **[Critical] Publish the full factory street address** in `src/data/branches.ts` (`addressTh`/`addressEn` + postal code) and render it on `/branches`, `/contact`, and the footer. Unblocks GBP, citations, and schema.
2. **[Critical] Create and verify a Google Business Profile** as a storefront at the factory. Set **primary category "Roofing contractor"** (or "Roofing supply store"); add secondaries (Metal fabricator, Manufacturer, Insulation contractor). Add Vientiane/Udon/Bueng Kan as service areas for clarity, but rely on organic pages for rank in those cities. Wrong/generic primary category is the #1 local ranking mistake.
3. **[Critical] Add LocalBusiness schema.** Site-wide `Organization`+`WebSite` in `BaseLayout.astro`; `@type:"RoofingContractor"` (or `HardwareStore`) node on `/branches` + `/contact` with `address`, `geo` (≥5 decimals), `telephone`, `url`, `openingHoursSpecification`, `areaServed` (+ `sameAs` Wikidata), `sameAs`, `image`, `hasMap`. Data-driven from `site.ts`/`branches.ts`. Model manufacturing via `hasOfferCatalog`, not the `@type`.
4. **[High] Fix Facebook: use a Business Page**, not `profile.php`. Create/convert, fill NAP + category + hours + Services identically to GBP, then update `site.ts` `facebookHref` and schema `sameAs`.
5. **[High] Replace the "coming soon" map** on `/contact#map` and `/branches` with a real Google Maps embed + "นำทาง / Get directions" link; populate `location.mapUrl`.
6. **[High] Publish business hours** — visible on `/contact#hours` + `/branches`, and as `openingHoursSpecification` in schema. Remove the placeholder.
7. **[High] Start a Google review program** the day the GBP is live: QR card handed over at install sign-off, LINE follow-up message, target 2-4/month with no >2-week gap (18-day velocity rule). Include Vientiane customers.
8. **[High] Build Tier-1 Thai citations** with the exact published NAP: Longdo Map, Google Maps, Apple Maps, yellowpages.co.th, thaitambon.com, wazzadu.com, verify DBD/creden/dataforthai address, and request a listing on your steel-coil supplier's dealer locator.
9. **[Medium] Add `hreflang` (th <-> en) + canonical + `og:`/`twitter:` tags** in `BaseLayout.astro`, add `@astrojs/sitemap` and a `robots.txt`. Add geo modifiers to inner-page `<title>`/H1.
10. **[Medium] Tag gallery projects by province** in `gallery-manifest.json`; once 3+ real projects exist per area, build unique `/service-area/{nong-khai,udon-thani,bueng-kan,vientiane-laos}` pages (th/en) with real projects + delivery/logistics detail. No thin doorway pages. Also: migrate off `vercel.app` to a custom `.co.th`/`.com` domain.

---

## Limitations / What Could Not Be Assessed

- **No verification of whether a GBP already exists** or its current category, NAP, hours, reviews, photos, or Q&A — no GBP API / DataForSEO MCP available in this run.
- **No live local-pack / SERP data** — cannot report current rankings for "เมทัลชีท หนองคาย", "แผ่นฉนวน PU หนองคาย", "roofing Nong Khai", etc., or competitor positions.
- **Proximity** accounts for ~55.2% of local ranking variance (Search Atlas ML) and is outside on-page control; cannot be modeled without the real address + competitor map.
- **Citation audit is directional** — actual NAP presence/consistency across the Thai and Lao web (Longdo, yellowpages.co.th, thaitambon, DBD mirrors, FB) was not crawled; needs a citation tool or manual sweep once the canonical NAP is set.
- **Facebook Page insights, review counts, and LINE OA status** not accessible (auth required).
- **Cross-border demand (Vientiane)** search volume and Lao-language keyword data not available.
- Analysis is based on the repo source (`src/`), the built `dist/`, and a single live fetch of the homepage.
