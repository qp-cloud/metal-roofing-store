# Action Plan — metal-roofing-store.vercel.app

SEO Health Score **45/100**. Ordered by priority and dependency. Each phase lists a leading
indicator you can watch without re-running the audit.

Dependency spine: **robots.txt + sitemap + hreflang/canonical** unblock indexation →
**structured data + address/GBP** unblock local & AI visibility →
**pricing + pillar content + trust on money pages** unblock ranking for commercial terms.

---

## Phase 1 — Critical Fixes (Week 1)

Foundation: make the site fully crawlable, indexable, de-duplicated, and machine-readable.

| # | Task | File(s) | First-principle | How we'd know it failed |
|---|---|---|---|---|
| 1 | `public/robots.txt` — allow-all + AI-crawler allow (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) + `Sitemap:` line | `public/robots.txt` | Crawlers need an entry point + a stated policy | `/robots.txt` still 404s; GSC "no robots.txt found" |
| 2 | `pnpm add @astrojs/sitemap`; config `i18n` (`defaultLocale:'th'`, `locales:{th:'th-TH',en:'en-US'}`); `serialize()` for priority nudges; **omit `lastmod`** rather than fake it | `astro.config.mjs` | 33 URLs need a discovery aid on a near-zero-backlink domain | after build, `dist/sitemap-index.xml` absent or missing `xhtml:link` alternates |
| 3 | Head expansion: `canonical` (`Astro.url`), `hreflang` th/en/x-default, OG + Twitter tags, default `og:image` | `src/layouts/BaseLayout.astro` | Bilingual site must declare pairs; social channels need previews | GSC International Targeting shows "no return tags"; LINE share has no card |
| 4 | `<Schema>` component: `Organization` + `RoofingContractor` + `WebSite` `@graph` from `site.ts` (province `areaServed`, `sameAs` FB+LINE, `contactPoint` per phone) | new `src/components/Schema.astro` + `src/lib/schema.ts`, wired in `BaseLayout` | An entity must exist for Google/AI to attach facts to | Rich Results Test finds 0 items; `block_count` still 0 |
| 5 | `vercel.json`: `trailingSlash:false` 301 + `X-Content-Type-Options` + `Referrer-Policy` | new `vercel.json` | `/about` and `/about/` are duplicate 200s today | both URLs still return 200 with no redirect |
| 6 | Hero `<Image>` (TH + EN home): add `priority`; add `<link rel="preload" as="image">` for hero + first product image | `src/pages/index.astro`, `src/pages/en/index.astro` | LCP element must not be lazy | lab mobile LCP still > 2.5 s |
| 7 | Fix 3 blank CLIENT WORK images + footer logo (bad asset paths); `loading="eager"` + width/height on the first row | homepage section + `Footer.astro` | `naturalWidth 0` = broken social proof | tiles still render as empty navy boxes |
| 8 | Guard `/en/` homepage testimonials block with `length > 0` (pattern already used elsewhere) | `src/pages/en/index.astro` | empty array currently renders an empty section | EN home still shows a blank testimonials block |
| 9 | `noindex` the "เร็ว ๆ นี้" stubs (Promotions, Vision, Maps, Hours) + 7 `comingSoon` products; drop Promotions from nav | stub pages, `products.ts` consumers, `site.ts` nav | thin indexable pages dilute quality signals | `site:` search still lists the stubs after recrawl |
| 10 | `src/pages/404.astro` wrapping `BaseLayout` with links to key pages | new `src/pages/404.astro` | dead-ends waste crawl + users | bad URL still shows the generic Vercel page |
| 11 | Publish the real factory street address (`branches.ts`) + footer NAP block; **create + verify a storefront Google Business Profile**, primary category "Roofing contractor" (secondaries: Metal fabricator, Manufacturer, Insulation contractor), add service areas | `src/data/branches.ts`, `Footer.astro`, + GBP (offsite) | proximity ≈ 55% of local ranking; GBP category is the #1 factor | GBP stuck "pending verification"; address still province-only |

**Phase 1 leading indicator:** GSC Coverage shows all 33 URLs "Submitted and indexed" within ~2 weeks; the hreflang report has zero errors; Rich Results Test shows `Organization` + `WebSite`.

---

## Phase 2 — High-Impact Improvements (Weeks 2–3)

Make the money pages competitive; get mobile LCP into Good; fix the mobile-UX bugs.

| # | Task | File(s) | Note |
|---|---|---|---|
| 1 | Show real starting **฿/ตร.ม. ranges** + "ปรับปรุงล่าสุด ส.ค. 2026" on `/specifications` and `/products` | `specs.ts` `startingPrice`, product/spec pages | if price genuinely can't be shown, retitle the page (it currently promises "ราคาเริ่มต้น") |
| 2 | Self-host + subset Thai fonts (one family, 2–3 weights, preload critical face); remove the render-blocking Google Fonts `<link>` | `BaseLayout.astro`, `public/fonts/` | ~770–870 ms saved; `public/fonts/` already exists (empty) |
| 3 | Add `BreadcrumbList` (from `Astro.url.pathname`) + `BlogPosting` (add cover images to the 3 posts, author = Organization) + `ItemList`/`Product` on `/products` (**no `offers`**) | `Schema.astro` graph, blog frontmatter | do not fake `Offer.price` |
| 4 | Split `specs.ts` Thai-string fields into `thicknessTh`/`thicknessEn` etc. so `/en/` stops rendering `มม.` | `src/data/specs.ts` + consumers | corrupts English AI extraction today |
| 5 | Mobile: hide text wordmark < 480px; reorder hero (H1 + prop + CTA above the image, image ~240px); reserve `padding-bottom` for the sticky bar (`+ env(safe-area-inset-bottom)`); pad tap targets to 44px; darken amber for body-size text | `Header.astro`, homepage hero, `StickyContact.astro`, global CSS | 4 High-severity mobile bugs |
| 6 | Surface trust on money pages: 2–3 testimonials + certification badge row + team blurb on `/products`, `/specifications`, `/services` | those pages | Trust is the lowest-scoring dimension for all 6 personas |
| 7 | Show the configurator estimate **inline** + add "ดาวน์โหลดสเปก (PDF)" + 150–300 words of context | `configurator.astro` | currently routes to LINE instead of showing output |
| 8 | Convert Facebook to a Business Page; update `site.ts` `facebookHref` + schema `sameAs`; replace map/hours placeholders with a real Maps embed + "นำทาง" link + published hours | `site.ts`, `contact.astro`, `branches.astro` | personal profile is unusable as a citation |
| 9 | Route gallery / FB-card images through `astro:assets` (`srcset` + AVIF); real captions on 40–60 primary gallery photos | gallery components, `Photo.astro` | ~1.5 MB lazy-loaded on the homepage today |
| 10 | Remove unused `@astrojs/react` (dead 192 KB `client.*.js`) or document the island plan | `astro.config.mjs`, `package.json` | zero `client:*` islands exist |

**Phase 2 leading indicator:** PSI mobile LCP < 2.5 s on `/` and `/products`; `/specifications` and `/products` start showing in GSC for "…ราคา" queries with impressions climbing; mobile bounce rate (GA4, once configured) drops.

---

## Phase 3 — Content & Authority (Month 2)

Build the E-E-A-T and local content that ranking for commercial + local terms actually requires.

1. Publish real team members (`team.ts`) — role, years, engineer licence; short version on `/services` + `/about`.
2. Standards/certification page — real มอก. numbers, coating class (AZ/Z), BMT/TCT, PU density, fire rating + certificate scans.
3. Shoot + publish 15–25 real factory/line/crew/loading photos with descriptive captions (replace the placeholder divs).
4. Expand `/specifications` into a 1,200+ word pillar guide — quantified spec tables, question-form H2s, 40–60 word direct-answer lead blocks (TH + EN); add a small informational cluster.
5. 150–300 words per real product model; 1–2 buyer-intent blog guides/month (pricing, กันร้อน, เลือกความหนา) with author byline + sources.
6. Tag gallery projects by province → then build **one substantive page each** for Nong Khai / Udon Thani / Bueng Kan + a `/ส่งลาว` cross-border page (real projects, delivery notes, local specifics). **No thin doorway pages** — quality gate: 60%+ unique content per page.
7. Build 8–12 consistent NAP citations on Thai directories (Longdo Map, yellowpages.co.th, thaitambon, wazzadu, Apple Maps).
8. Launch the Google review drive on GBP go-live — QR at install sign-off + LINE follow-up; 2–4/month, no gap > 2 weeks.
9. Publish the existing explainer animations to YouTube (entity/authority signal); add `public/llms.txt`.
10. Migrate off `vercel.app` to a branded `.co.th`/`.com` domain with 301s; update GSC, schema `url`, canonical, GBP website.

**Phase 3 leading indicator:** local-pack appearance for "เมทัลชีท หนองคาย"; GBP review count rising with < 2-week gaps; the pillar guide earning impressions for "เมทัลชีท คือ / ความหนา"; first non-brand referring domains.

---

## Phase 4 — Monitoring & Iteration (Ongoing)

- Set up **Google Search Console + Bing Webmaster**; submit `sitemap-index.xml`; watch indexation of the 33 URLs + the th/en hreflang report.
- Add a **CrUX / PSI** check once there's traffic; track mobile LCP staying < 2.5 s after the hero + font fixes.
- Capture a **`/seo drift baseline`** now so every future deploy is diffed against a known-good SEO state.
- Monthly: GBP insights, review count + recency, local-pack position for "เมทัลชีท หนองคาย", Core Web Vitals field data.
- **Re-run this audit after Phase 2** — targets: Schema 5 → 60+, Local 20 → 55+, SXO 34 → 55+, overall 45 → 65+.

---

## Notes / caveats

- No Google API credentials this run → CWV is single-run lab only; no indexation or traffic data.
- No DataForSEO / live SERP → local-pack positions, competitor proximity, cross-web NAP consistency, and whether a GBP already exists are **unverified**.
- The SXO agent recommended `FAQPage` schema — **overridden**: Google retired FAQ rich results for all sites (May 2026). Keep FAQ-style *content* for users and AI answers; do not add `FAQPage` markup for a SERP feature. `QAPage` only for genuine user Q&A.
- 0 location pages today → well clear of the 30-page warning / 50-page hard-stop quality gate. Keep it that way: build service-area pages only on real, unique local content.
