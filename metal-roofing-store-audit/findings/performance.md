# Performance & Core Web Vitals — metal-roofing-store.vercel.app

Method: Lighthouse 13.4.1 lab runs (Chrome for Testing 151, mobile = Moto G4
emulation + simulated 4G, desktop preset). No Google API creds → **no CrUX
field data**; all numbers below are single-run lab measurements. PSI API was
rate-limited. Treat absolute values as indicative, not 75th-percentile field
truth.

## Scores (Lighthouse Performance, 0–100)

| Page | Mobile | Desktop |
|------|--------|---------|
| `/` (home) | **94** | 99 |
| `/products` | **91** | not run (mobile is the constraint) |
| `/configurator` | **99** | not run |

## Measured Core Web Vitals (lab)

| Metric | Home mobile | Home desktop | Products mobile | Configurator mobile | Target |
|--------|-------------|--------------|-----------------|---------------------|--------|
| LCP | **2.9 s** ⚠️ | 0.9 s ✅ | **3.3 s** ⚠️ | 1.7 s ✅ | ≤2.5 s |
| CLS | 0.004 ✅ | 0.013 ✅ | 0.006 ✅ | 0.039 ✅ | ≤0.1 |
| TBT | 0 ms ✅ | 0 ms ✅ | 0 ms ✅ | 0 ms ✅ | <200 ms |
| FCP | 1.7 s | 0.6 s | 1.9 s | 1.7 s | ≤1.8 s |
| Speed Index | 1.7 s | 0.6 s | 1.9 s | 2.1 s | — |
| INP | *no field data* — **estimated "Good" (<100 ms)** | — | — | — | ≤200 ms |

**INP (estimate):** No `client:*` hydration ships on any of the three pages
(verified in `dist/*.html` — zero `astro-island`, zero module scripts). Only
JS on the page is a ~1.9 KB inline IntersectionObserver reveal script in
`BaseLayout.astro`. TBT is 0 ms everywhere. INP will almost certainly sit in
"Good"; flagged as estimate only because there is no field data.

**Verdict:** CLS and INP pass comfortably. **LCP is the only real problem —
"Needs Improvement" on mobile for `/` and `/products`.** Both are borderline and
fully fixable with the two High items below.

---

## Bottlenecks

### 1. [HIGH] LCP hero image is `loading="lazy"` + `fetchpriority="auto"`, not preloaded
`lcp-discovery-insight` scores **0/1**. LCP element on home mobile:
`section.hero > figure.hero__panel > img.hero__image`
(`_astro/hero-metal-roof.B4zKC3mW_*.webp`), rendered fully in the initial
viewport (bounding rect top 165, height 240) yet emitted with:
```
loading="lazy" decoding="async" fetchpriority="auto"
```
Lighthouse checklist fails on `priorityHinted` (no `fetchpriority=high`) and
`eagerlyLoaded` (uses `loading=lazy`).

LCP subpart breakdown (home mobile), total ~2.93 s:
- Time to first byte: 194 ms
- **Resource load delay: 264 ms** ← image discovered late (behind render-blocking
  CSS) and de-prioritised by `lazy`
- Resource load duration: 95 ms
- Element render delay: 14 ms

`/products` has the same pattern — first product photo
(`product-metal-sheet.CLJuCc0Z_*.webp`) is above the fold but lazy, LCP 3.3 s.

**Fix:** On the hero `<Image>` (and the first above-fold product image) set
`loading="eager"`, `fetchpriority="high"`, and drop `decoding="async"`. Add a
matching `<link rel="preload" as="image" imagesrcset=... imagesizes=...>` in
`<head>` for the hero (Astro: use `getImage()` to get the hashed URLs, or the
`<Image>` `priority` shortcut in Astro 5). Every other `<img>` on the page
(logo, gallery, wall-ceiling, footer) is correctly lazy — leave them.
**Expected impact: LCP −0.5 to −1.0 s on mobile → home and products both land in
"Good".**

### 2. [HIGH] Render-blocking Google Fonts — ~770–870 ms on the critical path
`render-blocking-insight` scores **0/1, "Est savings of 770 ms."** The
`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">` in
`BaseLayout.astro` blocks render; Lighthouse attributes **866 ms** wasted to it.
`network-dependency-tree-insight` (score 0) shows the chain:
`document → fonts.googleapis.com/css2 → 6+ woff2 on fonts.gstatic.com`
(8–13 KB each; Thai glyph sets are large).

Contributing factors:
- **Two Thai families loaded**: `IBM Plex Sans Thai` (400/500/600/700) **and**
  `Noto Sans Thai` (400/600/700/800) = **8 font files**. Redundant.
- `public/fonts/` exists but is **empty** — self-hosting was started and
  abandoned. No duplication/conflict today, just dead intent.
- `display=swap` is present (good — that's why CLS stays low), but the CSS
  request itself is still render-blocking.

**Fix (in priority order):**
1. Self-host the woff2 files under `public/fonts/`, add `@font-face` with
   `font-display: swap` in `global.css`, and `<link rel="preload" as="font"
   type="font/woff2" crossorigin>` the 1–2 weights used above the fold. Removes
   the third-party CSS round-trip entirely (−400 ms+ on the chain).
2. **Drop one family.** Pick either IBM Plex Sans Thai *or* Noto Sans Thai, not
   both. Halves font bytes and requests.
3. **Subset** to Thai (U+0E00–0E7F) + Latin (U+0000–00FF) with `unicode-range`;
   ship 2–3 weights max (400/600/700). Use `glyphhanger`/`subfont` or
   fonttools. Target < 40 KB total font transfer.
4. Keep the existing `preconnect` to `fonts.gstatic.com` only if you keep any
   Google-hosted fallback; otherwise remove both preconnects.

**Expected impact: FCP −0.3 to −0.5 s, LCP −0.3 to −0.8 s (image no longer
queues behind font CSS), configurator CLS 0.039 → ~0.**

### 3. [MEDIUM] Gallery images are full-resolution, no `srcset`, used as thumbnails
`dist/gallery/full/*.webp` are **500–568 KB each**. Homepage lazy-loads 3 of
them (`/gallery/full/1013322459072462.webp` etc.) as small grid tiles with a
plain `<img src>` — no `srcset`, no `sizes`, no width/height. `dist/gallery/`
is **243 MB** total. `image-delivery-insight` scores 0.5 and flags **187 KiB**
savings on `wall-ceiling-cafe` alone.

**Fix:** Route gallery/Facebook-card images through `astro:assets`
(`<Image>`/`<Picture>` or `getImage()`) to emit responsive WebP/AVIF at
~360/720/1080 w. Add explicit `width`/`height`. Below-fold so it won't move
LCP, but cuts ~1–1.5 MB of wasted transfer and data cost per homepage view.

### 4. [MEDIUM] Only WebP emitted — no AVIF
`dist/_astro/` contains WebP variants only (hero 46–173 KB across 4 sizes).
Source PNGs in `src/assets/photos/` are 1.9–2.6 MB each; astro:assets is
converting them (good) but stopping at WebP.

**Fix:** `<Picture formats={['avif', 'webp']}>` for hero + product images.
AVIF typically −25–35 % vs WebP at equal quality → hero ~30 KB at 960 w.
Directly shrinks LCP resource load duration.

### 5. [MEDIUM] `/products` server latency spike
`network-server-latency` was 40 ms on home but **160 ms on /products** in the
same session. Site is fully static (`output: static`, `trailingSlash: never`),
so this is Vercel edge-cache cold-miss variance, not app code. Low effort:
confirm `Cache-Control`/`s-maxage` on the static HTML via `vercel.json` so edge
keeps it hot.

### 6. [LOW] Dead 192 KB React runtime in the deploy
`dist/_astro/client.DMEExJqY.js` (194,807 bytes) is built by `@astrojs/react`
but **referenced by zero HTML files** — no `client:*` directive exists in the
codebase. It is never downloaded by users (no runtime cost), but it is dead
weight in the deploy and a footgun (any future `client:load` will suddenly ship
195 KB).

**Fix:** Either remove the `react()` integration from `astro.config.mjs` if no
interactive island is planned, or leave a comment documenting that
`@phosphor-icons/react/ssr` is SSR-only and hydration is intentionally never
used.

### 7. [LOW] Two render-blocking first-party CSS files on every page
Home loads `index.DEfydYj6.css` (10.9 KB) **and** `about.BqTZ8M0P.css`
(13.7 KB — this is the compiled `global.css` bundle, misleadingly hash-named
after the `about` route; it ships on `/`, `/products`, `/configurator`,
`/about`, all of them). Combined ~24 KB, both render-blocking. Lighthouse
`unused-css-rules` and `unminified-css` both pass, so this is minor.

**Fix (optional):** Inline critical CSS and defer the rest, or accept as-is —
low ROI given the small size.

### 8. [LOW] No third-party JS — confirmed clean
`FacebookUpdates.astro` renders build-time data from a local JSON into static
`<img>` cards — **no Facebook SDK, no iframe embed, no third-party script.**
`third-parties-insight` scores 1/1. Only third-party origin is Google Fonts
(addressed in item 2). Nothing else to remove.

---

## Prioritized recommendations

| # | Sev | Fix | Effort | Expected impact |
|---|-----|-----|--------|-----------------|
| 1 | HIGH | Hero + first product image: `loading="eager"` + `fetchpriority="high"` + `<link rel=preload as=image>` | S | LCP −0.5–1.0 s mobile; home & products → "Good" |
| 2 | HIGH | Self-host + subset fonts, drop one Thai family, preload 1–2 weights, kill render-blocking `<link>` | M | FCP −0.3–0.5 s, LCP −0.3–0.8 s, CLS → ~0 |
| 3 | MED | Responsive `<Image>`/`<Picture>` for gallery + FB-card images (currently 500 KB+ full-res `<img src>`) | M | −1–1.5 MB transfer/homepage |
| 4 | MED | Add AVIF (`<Picture formats={['avif','webp']}>`) for hero/product | S | −25–35 % LCP image bytes |
| 5 | MED | `vercel.json` cache headers to keep static HTML hot on edge (`/products` saw 160 ms TTFB) | S | TTFB −100 ms on cold routes |
| 6 | LOW | Remove unused `@astrojs/react` or document intent (192 KB dead `client.*.js` in `dist/`) | S | Deploy hygiene; prevents future regression |
| 7 | LOW | Inline critical CSS / defer the two ~11–14 KB render-blocking stylesheets | M | FCP −50–150 ms |

## What's already good — keep it

- Zero client-side JS framework hydration; TBT 0 ms; INP effectively a non-issue.
- All images have explicit `width`/`height`; CLS 0.004–0.039 across all pages.
- `font-display: swap` in place (prevents FOIT-driven CLS).
- astro:assets generating hashed, multi-width WebP with correct `srcset`/`sizes`.
- Non-hero images correctly `loading="lazy"`.
- `preconnect` to font origins present.
- Fully static output on Vercel; desktop is 99 with 0.9 s LCP.
