# Technical SEO Findings — metal-roofing-store.vercel.app

Audit date: 2026-08-31
Target: https://metal-roofing-store.vercel.app/ (live, Vercel) + source of truth /mnt/e/Cluade/metal-roofing-store
Stack: Astro 5.2 static (SSG), `@astrojs/react` configured but **no hydrated islands shipped**, `trailingSlash: 'never'`, bilingual (TH at root, EN under `/en/`).

Category score: **48 / 100**

Pass/fail snapshot:
| Category | Status |
|---|---|
| Crawlability (robots, sitemap) | FAIL |
| Indexability (canonical, dupes, hreflang) | FAIL |
| Security (HTTPS/headers) | PARTIAL |
| URL structure / redirects | PARTIAL |
| Mobile | PASS |
| Core Web Vitals (source signals) | PARTIAL |
| Structured data | FAIL (none) |
| JavaScript rendering | PASS (pure static HTML) |
| IndexNow | FAIL (not implemented) |

---

## CRITICAL

### C1. No `robots.txt`
- Evidence: `GET /robots.txt` -> HTTP 404 (`NOT_FOUND`, Vercel). `claude-seo run sitemap_discovery.py` -> `declared: []`, warning "robots.txt returned HTTP 404". No `public/robots.txt`, no `dist/robots.txt`.
- Impact: no crawl directives, no sitemap pointer. Not fatal (crawlers assume allow-all) but blocks sitemap discovery and IndexNow/GSC best practice.
- Fix (Astro): create `public/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://metal-roofing-store.vercel.app/sitemap-index.xml
  ```
  Prefer generating it via `@astrojs/sitemap` (see C2) or an `src/pages/robots.txt.ts` endpoint so the host stays in sync with `astro.config.mjs` `site`.

### C2. No XML sitemap
- Evidence: `/sitemap.xml`, `/sitemap-index.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml` all HTTP 404. No `@astrojs/sitemap` in `package.json`/`astro.config.mjs`. ~28 indexable URLs (14 page types x TH/EN) + 3 blog posts + 2 blog indexes have zero sitemap coverage.
- Fix (Astro):
  ```
  pnpm add @astrojs/sitemap
  ```
  ```js
  // astro.config.mjs
  import sitemap from '@astrojs/sitemap';
  integrations: [react(), sitemap({
    i18n: { defaultLocale: 'th', locales: { th: 'th-TH', en: 'en-US' } },
  })],
  ```
  With `site` already set and `trailingSlash: 'never'`, emitted URLs will be canonical. The `i18n` option also injects `xhtml:link` hreflang pairs into the sitemap.

### C3. No canonical tags anywhere
- Evidence: `grep -rl 'rel="canonical"' dist/` -> 0 files. `src/layouts/BaseLayout.astro` `<head>` has no canonical.
- Impact: combined with C4 (trailing-slash duplicates served 200/200) and query-string variants, every page is crawlable under multiple URLs with no consolidation signal. Direct duplicate-content / index-dilution risk.
- Fix (Astro) — add to `BaseLayout.astro` `<head>`:
  ```astro
  ---
  const canonical = new URL(Astro.url.pathname.replace(/\/$/, '') || '/', Astro.site).href;
  ---
  <link rel="canonical" href={canonical} />
  ```

### C4. Trailing-slash duplicates resolve 200 with no redirect
- Evidence: `GET /about` -> HTTP 200; `GET /about/` -> HTTP 200 (no 301/308, `location` absent). `curl` body md5 identical (`ece0b15819eb...`) for both. Same for `/en` vs `/en/`. `astro.config.mjs` sets `trailingSlash: 'never'` but Vercel's filesystem router serves `about/index.html` at both paths.
- Impact: two indexable URLs per page, no canonical (C3) to disambiguate.
- Fix: add `vercel.json` (currently absent) with a normalizing redirect, and ship C3 canonicals as defence-in-depth:
  ```json
  {
    "trailingSlash": false,
    "redirects": [
      { "source": "/:path+/", "destination": "/:path+", "permanent": true }
    ]
  }
  ```
  (Vercel honours top-level `"trailingSlash": false` for static output — verify after deploy that `/about/` now 308s to `/about`.)

### C5. No hreflang / alternate annotations on a bilingual site
- Evidence: `grep -rl 'hreflang' dist/` -> 0. `BaseLayout.astro` renders no `<link rel="alternate">`. The TH<->EN relationship exists only as a visible `Header.astro` toggle (`thHref`/`enHref`), invisible to crawlers.
- Impact: Google cannot pair `/about` (th-TH) with `/en/about` (en-US); wrong-language results, split signals, potential "duplicate" treatment of the two homepages.
- Fix (Astro): compute the alternate path in `BaseLayout` (mirror the logic already in `Header.astro`) and emit:
  ```astro
  <link rel="alternate" hreflang="th" href={thUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="x-default" href={thUrl} />
  ```
  Edge case already handled in Header: blog articles are TH-only — for `/blog/[slug]` either omit the EN alternate or point `x-default`/`en` at `/en/blog`. Do NOT emit an `hreflang="en"` that 404s. Defer detailed validation to the `seo-hreflang` sub-skill.

---

## HIGH

### H1. LCP image (homepage hero) is lazy-loaded and low priority
- Evidence: `dist/index.html` hero `<img src="/_astro/hero-metal-roof...webp" ... loading="lazy" decoding="async" fetchpriority="auto" width="1536" height="1024">`. Source `src/pages/index.astro:78-85` uses `<Image>` with no `loading`/`priority` -> Astro's `lazy` default. Same pattern on the second in-view image (`wall-ceiling-cafe`, `index.astro:168`). EN homepage (`dist/en/index.html`) shares the layout — verify/fix in parallel.
- Impact: hero is the mobile LCP element (100vw under 860px, near top of DOM). `loading="lazy"` + `fetchpriority="auto"` pushes it behind CSS/font/other requests -> LCP likely in the 3–4s "needs improvement / poor" band on 4G.
- Fix (Astro 5): add the `priority` shorthand (sets `loading="eager" decoding="sync" fetchpriority="high"`):
  ```astro
  <Image class="hero__image" src={heroRoofPhoto} priority
         widths={[640, 960, 1280]} sizes="(max-width: 860px) 100vw, 48vw" quality={86} alt="…" />
  ```
  Keep every other below-the-fold image lazy (they already are).

### H2. Render-blocking Google Fonts via `@import`-style `<link>`
- Evidence: `BaseLayout.astro` -> `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai…&family=Noto+Sans+Thai…&display=swap" rel="stylesheet">`. Two render-blocking round trips to `fonts.googleapis.com` then `fonts.gstatic.com` before first paint; two large Thai families (7 weights total) requested. `preconnect` present but the CSS request itself still blocks.
- Impact: adds ~200–500ms to FCP/LCP on cold connections; Thai glyph files are heavy; `display=swap` mitigates FOIT but not the blocking CSS.
- Fix: self-host with `@fontsource/*` (or `astro-font` / Fontaine) and `font-display: swap`, subset to Thai+Latin, preload only the 1–2 weights used above the fold, and drop unused weights (Noto 800, IBM Plex 500/600 if not used). Removes the third-party blocking request entirely.

### H3. Zero structured data
- Evidence: `grep -rl 'application/ld+json' dist/` -> 0. `render_page.py` `structured_data.block_count: 0`. No Organization, LocalBusiness, BreadcrumbList, Article, or Product markup.
- Impact: this is a Nong Khai manufacturer with branches, phone numbers, LINE, and a blog — strong candidates for `LocalBusiness`/`Organization` (knowledge panel, rich results) and `Article` on `/blog/*`. All missed.
- Fix (Astro): add a JSON-LD `<script type="application/ld+json">` in `BaseLayout` (Organization + LocalBusiness sitewide, from `src/data/site.ts`/`src/data/branches.ts`), and `Article` in `src/pages/blog/[slug].astro` using `post.data.title`/`date`/`excerpt`. Validate with Rich Results Test.

### H4. No Open Graph / Twitter Card tags
- Evidence: `grep -rl 'property="og:'` dist/ -> 0. `BaseLayout` head has none.
- Impact: not a ranking factor, but LINE/Facebook/X shares (primary channels for this business) render with no title/image/description. Also weakens entity signals.
- Fix (Astro): add `og:title/og:description/og:type/og:url/og:image/og:locale` (+ `og:locale:alternate`) and `twitter:card=summary_large_image` in `BaseLayout`, with a per-page `image` prop defaulting to a branded share image in `public/`.

### H5. No custom 404 page
- Evidence: `GET /this-does-not-exist-xyz` -> HTTP 404 with generic Vercel body ("The page could not be found"). No `src/pages/404.astro`, no `dist/404.html`.
- Impact: correct status code (good — not a soft 404), but dead-end UX: no header/nav/search, no language, higher bounce, wasted link equity from any broken inbound links.
- Fix (Astro): add `src/pages/404.astro` using `BaseLayout` with nav + links to `/` and `/products`. Astro emits `dist/404.html`; Vercel serves it automatically on static output.

---

## MEDIUM

### M1. Missing baseline security headers
- Evidence: `curl -I` on `/` and `/about` returns only `strict-transport-security: max-age=63072000; includeSubDomains; preload`. Absent: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` (or at least `frame-ancestors`), `X-Frame-Options`. No `vercel.json` to set them.
- Impact: not a ranking signal, but flagged by security scanners / some “site quality” heuristics; `X-Content-Type-Options: nosniff` and a `Referrer-Policy` are cheap wins. Note the site embeds a third-party iframe (`roofing-configurator.vercel.app`) so a full `frame-src`/`frame-ancestors` CSP needs that allow-listed.
- Fix: `vercel.json` `headers` block:
  ```json
  { "headers": [{ "source": "/(.*)", "headers": [
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
    { "key": "Permissions-Policy", "value": "geolocation=(), camera=(), microphone=()" }
  ]}]}
  ```

### M2. No IndexNow implementation
- Evidence: no API key file in `public/`, no ping step in build/deploy. `scripts/` has facebook/gallery/photos scripts only.
- Impact: slower discovery of new/updated blog posts and promotions on Bing (and Yandex/Naver). Relevant for TH/Lao market where Bing share is non-trivial.
- Fix: generate a UUID key, host it at `public/<key>.txt`, and add a post-deploy script that POSTs changed URLs to `https://api.indexnow.org/indexnow` (or the Bing endpoint). Pairs naturally with the sitemap from C2.

### M3. `<meta name="robots">` absent (no explicit index directive)
- Evidence: `grep -rl 'name="robots"' dist/` -> 0; no `X-Robots-Tag` header.
- Impact: default is `index,follow` so pages ARE indexable — but there is no mechanism to keep thin/utility pages (e.g. `/brochure` which is a PDF launcher, `/configurator` which is a 3rd-party iframe shell) out of the index, and no `max-image-preview:large` opt-in for rich thumbnails.
- Fix (Astro): add an optional `robots` prop to `BaseLayout` (default `index,follow,max-image-preview:large,max-snippet:-1`); set `noindex,follow` on `configurator`/`brochure` if they prove to be thin in Search Console.

### M4. `@astrojs/react` integration ships nothing but adds build weight / config surface
- Evidence: `grep -rl 'astro-island' dist/` -> 0; `dist/_astro/client.DMEExJqY.js` (190 KB) and `react-dom` are built but referenced by zero pages. Configurator is an `<iframe>` to `roofing-configurator.vercel.app`, not a React island.
- Impact: no user-facing perf hit today (bundle never loads), but dead dependency = slower installs/builds and a foot-gun (first `client:` directive silently ships 190 KB).
- Fix: if no islands are planned, remove `react()` from `astro.config.mjs` and the React deps. If keeping, document intent.

### M5. Homepage in-body gallery `<img>` lack width/height
- Evidence: `dist/index.html` -> `<img src="/gallery/full/1013322459072462.webp" ... loading="lazy">` (x3, `index.astro:263-271`), no `width`/`height`/`aspect-ratio` attr.
- Impact: low CLS risk only because the CSS grid `.hero__panel`-adjacent strip uses fixed `grid-template-rows: repeat(2, minmax(180px,1fr))` / `repeat(3,220px)` to size the cells; still fragile if CSS load is delayed.
- Fix: add explicit `width`/`height` (intrinsic ratio) or wrap in a container with `aspect-ratio`. The dedicated `/gallery` page already does this correctly (`.gallery-item{aspect-ratio:1/1}`, 8 eager / 43 lazy).

---

## LOW / INFO

- **L1 (Low): PWA/icon set is minimal.** Only `favicon.png` + `apple-touch-icon.png` (both served with `cache-control: public, max-age=0, must-revalidate`). No SVG favicon, no `site.webmanifest`, no `theme-color`. Add a manifest + `<meta name="theme-color">` and an SVG icon.
- **L2 (Low): favicon / root HTML cache.** `/` and `/favicon.png` return `cache-control: public, max-age=0, must-revalidate` (revalidate every hit). Hashed `/_astro/*` assets are correctly `max-age=31536000, immutable`. For a static marketing site consider a short `s-maxage` (e.g. 300) on HTML via `vercel.json` to cut TTFB on cache MISS (`x-vercel-cache: MISS` observed on first hit).
- **L3 (Info): HTTPS / transport are solid.** HTTP/2, `content-encoding: br`, valid cert, HSTS with `preload`, `http://` -> `https://` 308, `www` host not applicable for `*.vercel.app`. HTTPS category passes on transport; only the response-header set (M1) is weak.
- **L4 (Info): URL structure is clean.** Lowercase, hyphenated, no params, no file extensions, logical `/en/` locale prefix, shallow depth (<=2). Internal links in `Header.astro`/`Footer.astro` are all extension-less and slash-less — consistent with `trailingSlash: 'never'` (no internal link triggers the C4 redirect).
- **L5 (Info): JavaScript rendering — PASS.** `render_page.py` `is_spa: false`, `mode_used: raw`; full content/nav/headings present in raw HTML. Only two small inline `<script type="module">` (IntersectionObserver reveal animations + nav toggle), no framework runtime, no hydration. Ideal for crawl/render budget. `prefers-reduced-motion` respected.
- **L6 (Info): Mobile — PASS.** `<meta name="viewport" content="width=device-width, initial-scale=1">` on every page; responsive CSS grids, `@media` breakpoints (nav collapses <=1200px), tap targets in nav are full-width rows on mobile, `srcset`/`sizes` on `<Image>` outputs. No fixed-width layout, no `user-scalable=no`.
- **L7 (Info): Titles & meta descriptions — mostly good.** Sampled TH/EN home, about, products, blog index, blog post: all have a single unique `<h1>`, unique `<title>` (22–84 chars), unique `description` (71–155 chars). `<html lang>` correctly `th` / `en`. Watch EN home `<title>` (84 chars) and TH home description (131 chars) for SERP truncation; ampersands render as `&amp;` (correct). No `name="keywords"` bloat.
- **L8 (Info): Third-party iframe on `/configurator`.** `<iframe src="https://roofing-configurator.vercel.app/configurator" loading="lazy">`. Content is not part of this page's indexable text (expected for a tool). Ensure the parent page has enough of its own copy to not be thin (see M3), and that the child app sets its own `X-Frame-Options`/CSP to allow this embed.
- **L9 (Info): EN blog articles do not exist.** `src/pages/en/blog.astro` lists posts but links to TH `/blog/<slug>` (disclosed in a note). `Header.astro` already redirects the EN toggle on `/blog/[slug]` to `/en/blog` to avoid a 404. Acceptable; make sure hreflang (C5) does not assert an `en` alternate for `/blog/<slug>`.

---

## Core Web Vitals — source-inspection assessment (no field/lab run performed)

| Metric | Signal from source | Risk |
|---|---|---|
| LCP | Hero `<Image>` is `loading="lazy"` + `fetchpriority="auto"` (H1); render-blocking cross-origin font CSS (H2); hero base file `hero-metal-roof...webp` ~172 KB, srcset 640/960/1280 present. | **Needs improvement / Poor** until H1+H2 fixed; likely Good after. |
| INP | No hydration, no long-task JS; only IntersectionObserver + tiny nav script; all interactions are native `<a>`/CSS. | **Good** expected. |
| CLS | Global layout uses explicit grid sizing; `<Image>` outputs carry `width`/`height`; `/gallery` items pinned to `aspect-ratio:1/1`. Minor exposure: 3 homepage gallery `<img>` without dimensions (M5), and font swap (Thai) can cause small reflow. | **Good–borderline**; tighten M5 + self-host fonts. |

Recommend a real PSI/CrUX + Lighthouse run post-fix to confirm.

---

## Prioritized action list

1. C1 `public/robots.txt` + C2 `@astrojs/sitemap` (with `i18n`)  — unblocks discovery.
2. C3 canonical in `BaseLayout` + C4 `vercel.json` trailing-slash redirect — kills duplicate URLs.
3. C5 hreflang `th` / `en` / `x-default` in `BaseLayout`.
4. H1 add `priority` to hero `<Image>` (TH + EN home) — direct LCP win.
5. H2 self-host fonts, prune weights.
6. H3 JSON-LD Organization/LocalBusiness sitewide + Article on blog.
7. H4 OG/Twitter tags; H5 `src/pages/404.astro`.
8. M1 security headers, M2 IndexNow, M3 robots-meta prop, M4 drop unused React, M5 dimension the 3 homepage imgs.

## Quick wins (low effort, high value)

- `public/robots.txt` (5 min).
- Add `priority` to the hero `<Image>` — one word, meaningful LCP gain (H1).
- `vercel.json` with `"trailingSlash": false` + `X-Content-Type-Options`/`Referrer-Policy` headers (M1, C4).
- `src/pages/404.astro` wrapping `BaseLayout` (H5).
- Canonical + hreflang: ~15 lines in `BaseLayout.astro` frontmatter/head (C3, C5).
- `pnpm add @astrojs/sitemap` + 4 config lines (C2).
