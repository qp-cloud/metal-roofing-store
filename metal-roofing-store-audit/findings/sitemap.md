# Sitemap + robots.txt Audit — metal-roofing-store

Target: https://metal-roofing-store.vercel.app/
Stack: Astro 5 static build, `output: static` (default), `trailingSlash: 'never'`, `site` set. Integrations: `@astrojs/react` only.
Build output verified against `dist/`.

**Score: 45 / 100** — every deduction is a quick win; nothing structurally broken.

---

## 1. Current State (verified)

| Item | Status |
|------|--------|
| `dist/robots.txt` | MISSING |
| `dist/sitemap-index.xml` / any sitemap | MISSING |
| `@astrojs/sitemap` in deps | NOT installed |
| `public/robots.txt` | absent (`public/` has favicon, fonts, images, brochure, gallery, animations only) |
| Canonical tag in `BaseLayout.astro` | MISSING |
| hreflang / `rel="alternate"` tags in HTML | MISSING (site is fully bilingual th/en — this matters) |
| `robots` meta | none (defaults to index,follow — fine) |
| XML validity | N/A (no file to validate) |
| URL count | 33 (well under 50,000) |
| Location pages | 0 (well under the 30 / 50 doorway thresholds) |
| `news:` sitemap needed | No |

### URLs actually emitted by `dist/` (33 total)

Thai (root, `defaultLocale`) — 18:
`/`, `/about`, `/branches`, `/brochure`, `/colors`, `/configurator`, `/contact`, `/gallery`, `/products`, `/promotions`, `/services`, `/specifications`, `/technical-team`, `/testimonials`, `/blog`, `/blog/choosing-roof-thickness`, `/blog/clip-lock-vs-snap-lock`, `/blog/pu-foam-cold-storage`

English (`/en/` prefix) — 15:
`/en`, `/en/about`, `/en/branches`, `/en/brochure`, `/en/colors`, `/en/configurator`, `/en/contact`, `/en/gallery`, `/en/products`, `/en/promotions`, `/en/services`, `/en/specifications`, `/en/technical-team`, `/en/testimonials`, `/en/blog`

Notes:
- `trailingSlash: 'never'` → canonical form is no-slash (`/about`, not `/about/`). Astro still writes `about/index.html`; Vercel serves it at both, but sitemap + canonical must use the no-slash form.
- Blog articles are **Thai-only**. `src/pages/blog/[slug].astro` hardcodes `lang="th"`; there is no `/en/blog/[slug]`. `src/pages/en/blog.astro` is a standalone English listing whose cards link to the Thai article URLs (on-page disclaimer: "Article bodies are currently published in Thai only"). So the 3 post URLs get **no `en` hreflang alternate** — x-default → Thai.
- 3 blog posts, dates from frontmatter: `choosing-roof-thickness` 2026-06-12, `clip-lock-vs-snap-lock` 2026-05-03, `pu-foam-cold-storage` 2026-03-20. All three files last touched in git 2026-08-11 (bulk commit).

---

## 2. Validation Report (pass/fail)

| Check | Severity | Result |
|-------|----------|--------|
| Sitemap exists | — | FAIL — none present |
| robots.txt exists | — | FAIL — none present |
| Invalid XML | Critical | N/A (nothing to parse) |
| > 50k URLs / > 50MB | Critical | PASS (33 URLs) |
| Non-200 URLs in sitemap | High | N/A |
| Noindexed URLs in sitemap | High | N/A (no noindex anywhere) |
| Redirected URLs in sitemap | Medium | N/A |
| All-identical `lastmod` | Low | RISK — see §4, use real per-type dates |
| `priority` / `changefreq` present | Info | N/A yet — Google ignores both; keep minimal / optional |
| Crawl vs sitemap coverage | — | Once generated, `@astrojs/sitemap` covers 100% of static routes automatically |
| Location-page quality gate (30/50) | — | PASS — 0 location pages |
| Thin / duplicate page types | — | PASS — smallest rendered page is ~14.9 KB HTML; no doorway/programmatic pages. th/en are genuine translations, not dupes (but need hreflang to prove it to Google) |

---

## 3. DELIVERABLE 1 — `public/robots.txt` (exact, add as-is)

Create `/mnt/e/Cluade/metal-roofing-store/public/robots.txt`:

```txt
# https://metal-roofing-store.vercel.app/robots.txt

# --- Search engines -------------------------------------------------------
User-agent: *
Allow: /

# --- AI / LLM crawlers (GEO stance: ALLOW) ------------------------------
# This is a lead-gen marketing site. Being quoted in ChatGPT, Claude,
# Perplexity and Google AI Overviews is upside, not a threat. We explicitly
# opt IN. To opt a bot out later, change its "Allow: /" to "Disallow: /".
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

# --- Sitemap -----------------------------------------------------------
Sitemap: https://metal-roofing-store.vercel.app/sitemap-index.xml
```

- `@astrojs/sitemap` publishes `sitemap-index.xml` as the entry point (plus `sitemap-0.xml`), so the `Sitemap:` line points there.
- If you ship the manual fallback (§5) instead, change the line to `.../sitemap.xml`.
- When a custom domain is attached, update the two absolute URLs here and `site` in `astro.config.mjs`.

---

## 4. DELIVERABLE 2 — Recommended: install `@astrojs/sitemap`

```bash
npx astro add sitemap
# or: npm i -D @astrojs/sitemap
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Update this when a custom domain is attached — canonical URLs derive from it.
  site: 'https://metal-roofing-store.vercel.app',
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      // Bilingual site: Thai at root, English under /en/.
      // This auto-emits <xhtml:link rel="alternate" hreflang> pairs
      // for routes that exist in both locales, and x-default -> th.
      i18n: {
        defaultLocale: 'th',
        locales: {
          th: 'th-TH',
          en: 'en-US',
        },
      },
      // Google ignores changefreq + priority; Bing weights them slightly.
      // Keep defaults minimal, nudge a few via serialize().
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        const u = item.url;
        // Homepages
        if (u === 'https://metal-roofing-store.vercel.app/' ||
            u === 'https://metal-roofing-store.vercel.app/en') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        // Promotions turn over often
        if (u.includes('/promotions')) {
          item.changefreq = 'weekly';
          item.priority = 0.6;
        }
        // Money pages
        if (u.includes('/products') || u.includes('/colors') ||
            u.includes('/specifications') || u.includes('/services')) {
          item.priority = 0.8;
        }
        // Utility pages (search value is low, keep them but de-emphasise)
        if (u.includes('/brochure') || u.includes('/configurator')) {
          item.priority = 0.4;
          item.changefreq = 'yearly';
        }
        // Blog
        if (/\/blog(\/|$)/.test(u)) {
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
});
```

**Exclusions:** none. No thin, staging, or utility routes here that warrant a `filter`. Every one of the 33 URLs should be in the sitemap.

**On `lastmod`:** deliberately omitted from the config above. `@astrojs/sitemap`'s `serialize()` only exposes `url/changefreq/priority/lastmod/links` — it cannot read content-collection dates — so a global `lastmod: new Date()` would stamp all 33 URLs identically (Low-severity "all identical lastmod" finding, and it lies about the static pages). Options, best first:
1. **Ship without `lastmod`.** Google is fine without it; better than fake uniform dates.
2. If you want real article dates, add a tiny custom endpoint `src/pages/sitemap.xml.ts` that imports `getCollection('blog')` and writes `<lastmod>` per post — only worth it once the blog grows.
3. Hardcode a per-URL date map in `serialize()` and maintain it by hand (fine at this scale, rots as pages change).

**i18n pairing behaviour to expect:** `/about`↔`/en/about` etc. get reciprocal `hreflang="th-TH"` / `hreflang="en-US"` + `x-default` → `/about`. `/blog`↔`/en/blog` also pair (both are blog landing pages — acceptable). The 3 `/blog/<slug>` posts have no `/en/` twin, so they appear with no alternates / self x-default — correct given content reality.

---

## 5. DELIVERABLE 3 — Manual fallback sitemap (`public/sitemap.xml`)

Use only if you do **not** install `@astrojs/sitemap`. Static file, must be hand-maintained. hreflang alternates included; `lastmod` uses frontmatter dates for posts and the last significant edit date for the rest (update when a page changes materially).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- ============ Paired routes (th <-> en) ============ -->

  <url>
    <loc>https://metal-roofing-store.vercel.app/</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/about</loc>
    <lastmod>2026-08-27</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/about"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/about"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/about"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/about</loc>
    <lastmod>2026-08-27</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/about"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/about"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/about"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/branches</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/branches"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/branches"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/branches"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/branches</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/branches"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/branches"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/branches"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/brochure</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/brochure"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/brochure"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/brochure"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/brochure</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/brochure"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/brochure"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/brochure"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/colors</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/colors"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/colors"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/colors"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/colors</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/colors"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/colors"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/colors"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/configurator</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/configurator"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/configurator"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/configurator"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/configurator</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/configurator"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/configurator"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/configurator"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/contact</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/contact"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/contact"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/contact"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/contact</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/contact"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/contact"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/contact"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/gallery</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/gallery"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/gallery"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/gallery"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/gallery</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/gallery"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/gallery"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/gallery"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/products</loc>
    <lastmod>2026-08-27</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/products"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/products"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/products"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/products</loc>
    <lastmod>2026-08-27</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/products"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/products"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/products"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/promotions</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/promotions"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/promotions"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/promotions"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/promotions</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/promotions"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/promotions"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/promotions"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/services</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/services"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/services"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/services"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/services</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/services"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/services"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/services"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/specifications</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/specifications"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/specifications"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/specifications"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/specifications</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/specifications"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/specifications"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/specifications"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/technical-team</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/technical-team"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/technical-team"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/technical-team"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/technical-team</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/technical-team"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/technical-team"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/technical-team"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/testimonials</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/testimonials"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/testimonials"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/testimonials"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/testimonials</loc>
    <lastmod>2026-08-31</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/testimonials"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/testimonials"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/testimonials"/>
  </url>

  <url>
    <loc>https://metal-roofing-store.vercel.app/blog</loc>
    <lastmod>2026-08-11</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/blog"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/blog"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/blog"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/en/blog</loc>
    <lastmod>2026-08-11</lastmod>
    <xhtml:link rel="alternate" hreflang="th-TH" href="https://metal-roofing-store.vercel.app/blog"/>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://metal-roofing-store.vercel.app/en/blog"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/blog"/>
  </url>

  <!-- ============ Thai-only blog posts (no en twin) ============ -->

  <url>
    <loc>https://metal-roofing-store.vercel.app/blog/choosing-roof-thickness</loc>
    <lastmod>2026-06-12</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/blog/choosing-roof-thickness"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/blog/clip-lock-vs-snap-lock</loc>
    <lastmod>2026-05-03</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/blog/clip-lock-vs-snap-lock"/>
  </url>
  <url>
    <loc>https://metal-roofing-store.vercel.app/blog/pu-foam-cold-storage</loc>
    <lastmod>2026-03-20</lastmod>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://metal-roofing-store.vercel.app/blog/pu-foam-cold-storage"/>
  </url>

</urlset>
```

Total: 33 `<loc>` entries — matches `dist/` exactly.

---

## 6. DELIVERABLE 4 — Quality Gate Check

| Gate | Threshold | This site | Verdict |
|------|-----------|-----------|---------|
| Total URLs vs 50,000 / 50MB per file | hard cap | 33 URLs, ~1 MB | PASS — single sitemap file, no index needed (sitemap-index still fine) |
| `news:` sitemap cap | 1,000 URLs | no news sitemap | N/A |
| Location pages — WARNING | 30+ | **0** | PASS |
| Location pages — HARD STOP | 50+ | **0** | PASS — no user justification required |
| Thin / duplicate content page types | 60%+ unique at scale | none at scale | PASS |
| Programmatic "best [tool] for [industry]" pages | — | none | PASS |
| AI-generated mass content | — | none detected; blog is 3 hand-written technical articles with original diagrams | PASS |

Page-type read:
- **Safe at scale:** `products`, `colors`, `specifications` are data-driven (`src/data/*.ts`) but carry unique specs/attributes — analogous to product pages, safe.
- **Utility (not thin, just low search value):** `configurator`, `brochure` — keep in sitemap, de-prioritise. Smallest rendered HTML is `/en/brochure` at 14.9 KB; nothing is empty.
- **Translations, not duplicates:** 15 route pairs. Currently at risk of being read as duplicate/competing because **no hreflang exists in the HTML** — the sitemap alternates (or `@astrojs/sitemap` i18n) fix the signal; adding `<link rel="alternate" hreflang>` + canonical in `BaseLayout.astro` fixes it properly.
- **Doorway risk:** none. No city/region pages.

---

## 7. Findings (structured — for audit-data.json, category: Sitemap)

| id | severity | title | detail | fix |
|----|----------|-------|--------|-----|
| SM-01 | High | No sitemap | No `sitemap-index.xml` / `sitemap.xml` in `dist/`; `@astrojs/sitemap` not installed | Install `@astrojs/sitemap` with i18n config (§4) |
| SM-02 | High | No robots.txt | No `public/robots.txt`; nothing served at `/robots.txt` | Add file from §3 |
| SM-03 | Medium | No `Sitemap:` directive | Search engines get no sitemap pointer | Included in §3 robots.txt once sitemap exists |
| SM-04 | Medium | No hreflang on bilingual site | 15 th/en route pairs, zero `rel="alternate"` in HTML or sitemap → duplicate-content / wrong-locale-ranking risk | sitemap i18n alternates + add hreflang & canonical to `BaseLayout.astro` |
| SM-05 | Low | No canonical tag | `BaseLayout.astro` emits no `<link rel="canonical">`; with `trailingSlash:'never'` the slash/no-slash dupes are unmanaged | Add `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)}>` |
| SM-06 | Low | lastmod strategy | Global build-time `lastmod` would be uniform/inaccurate; blog post dates live in frontmatter unused by sitemap | Omit `lastmod`, or add `src/pages/sitemap.xml.ts` endpoint for real post dates |
| SM-07 | Info | changefreq/priority | Deprecated for Google; only add via `serialize()` minimally | Optional, per §4 |
| SM-08 | Info | Blog is Thai-only | `blog/[slug].astro` hardcodes `lang="th"`; `/en/blog` links to Thai articles | Acceptable; revisit if English articles are added — then add `/en/blog/[slug]` route |

No Critical findings. No quality-gate blocks.

---

## 8. Quick Wins (do in this order)

1. **Add `public/robots.txt`** (§3) — 1 file, allow-all + AI opt-in + Sitemap pointer. ~2 min.
2. **`npx astro add sitemap`** + paste i18n config (§4) — auto-covers all 33 URLs with correct hreflang, zero maintenance. ~10 min.
3. **Rebuild + verify:** `npm run build` then confirm `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/robots.txt` exist and `dist/sitemap-0.xml` has 33 `<loc>` + `xhtml:link` alternates.
4. **Add canonical + hreflang to `BaseLayout.astro`** `<head>` (needs the layout to know the route's locale + its alternate path; `path` is already passed in). Closes SM-04/SM-05 at the page level.
5. **Submit `sitemap-index.xml` in Google Search Console + Bing Webmaster Tools** once deployed.
6. (Later) If blog grows past ~10 posts or gets English versions, swap the static sitemap thinking for the `sitemap.xml.ts` endpoint to carry real `lastmod`.
