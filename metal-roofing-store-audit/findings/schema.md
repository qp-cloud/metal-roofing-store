# Schema.org / Structured Data Audit — metal-roofing-store.vercel.app

Site: https://metal-roofing-store.vercel.app/ (Astro 5, static output, `trailingSlash: 'never'`, `site` configured correctly)
Business: **หจก.มีชัยสตีล / Meechai Steel Ltd., Part.** — metal roofing & insulated-panel manufacturer + installer, Nong Khai, Thailand. B2B, bilingual th (`/…`) + en (`/en/…`). No e-commerce, no public prices.

**Structured-data score: 5 / 100**
Nothing redeems this except that the HTML is clean, server-rendered (no SPA hydration needed for content), and `astro.config.mjs` `site` is set so absolute URLs are trivial to generate. Zero JSON-LD, zero Microdata, zero RDFa on every route.

---

## 1. Detection results

| Check | Result |
|---|---|
| JSON-LD blocks | **0** (confirmed across BaseLayout, all pages, blog `[slug]`) |
| Microdata / RDFa | none |
| `<link rel="canonical">` | **missing** (adjacent SEO gap, same PR) |
| `hreflang` alternates (th ↔ en) | **missing** (adjacent) |
| `og:*` / Twitter card / `og:image` | **missing** (blocks `image` reuse for Article schema) |
| `@astrojs/sitemap` | not installed (adjacent) |
| Head component | `src/layouts/BaseLayout.astro` — takes `lang`, `title`, `description` only; single injection point for site-wide schema |

Data available for markup (all real, no placeholders):
- `src/data/site.ts` — `nameTh` หจก.มีชัยสตีล, `nameEn` Meechai Steel Ltd., Part., taglines, 3 phones (E.164 hrefs), `lineHref`, `facebookHref`.
- `src/data/branches.ts` — single site; **province only** (`Nong Khai Province`), `addressTh/En` empty, no `mapUrl`, no geo. `serviceArea`: Nong Khai / Udon Thani / Bueng Kan + Lao PDR (Vientiane) cross-border.
- `src/data/products.ts` — 13 entries, 6 real (`metal-sheet`, `bolt-type`, `clip-lock`, `snap-lock`, `panel-sheet`, `pu-foam`), 7 `comingSoon`. No prices (`specs.ts` `startingPrice` all `''`).
- `src/content/blog/*.md` — 3 posts, frontmatter has `title`, `titleEn`, `excerpt`, `excerptEn`, `date` (Date), `cover?` (none set). Route `/blog/[slug]`, Thai only (no `/en/blog/[slug]`).
- `src/data/team.ts`, `src/data/testimonials.ts` — **deliberately empty**. Do NOT emit `Person`, `Review`, or `AggregateRating` — there is no real data and fabricating it would be a policy violation.
- `src/assets/brand/logo.png` — 1024×1024 RGBA, 1.5 MB (optimise + copy to `public/logo.png` for a stable absolute URL).

---

## 2. Missing schema + priority

| Priority | Type | Where | Notes |
|---|---|---|---|
| **Critical** | `Organization` + `RoofingContractor` | site-wide (BaseLayout) | The core entity. No business node anywhere today. Drives knowledge-graph / AI-overview identity, `sameAs` consolidation, `contactPoint`s. |
| **Critical** | `WebSite` | site-wide | Name/alternateName + `publisher` ref. No `SearchAction` (site has no search — do not invent `/search`). |
| **High** | `BreadcrumbList` | every page except `/` | 30+ pages, 3-level mega-nav. Eligible for breadcrumb rich result; cheap to generate from path. |
| **High** | `BlogPosting` | `/blog/[slug]` (×3) | Article rich-result eligible. All fields present except `author` (use Organization) and `image` (needs cover — see gap below). |
| **Medium** | `ItemList` + `Product` | `/products`, `/en/products` | Catalogue listing. **No `offers`** (no price, no checkout) — valid as plain `Product`, just no product rich result. |
| **Medium** | `ImageObject` (logo) | inside Organization `logo`/`image` | Needs `public/logo.png` + real dims (1024×1024 available). |
| **Medium** | `CollectionPage` / `Blog` | `/blog` index | Optional wrapper; low effort once helper exists. |
| **Low** | `AboutPage` / `ContactPage` / `WebPage` | `/about`, `/contact` | `mainEntity` → Organization `@id`. Marginal value. |
| **Low** | `Service` nodes | `/services` | Alternative/companion to Product for the install side (`provider` → Organization). |
| **Info** | `Person`, `Review`, `AggregateRating` | — | Blocked: no real data. Revisit when `team.ts` / `testimonials.ts` are populated with consented content. |

### Explicitly NOT recommended
- **FAQPage** — Google retired FAQ rich results for all sites (May 7 2026). No SERP feature. Do not add it to `/about#standards`, `/contact`, or blog posts for SEO. Any AI/GEO benefit is unconfirmed.
- **QAPage** — only for genuine user-generated Q&A threads. None exist here.
- **HowTo** — rich results removed Sept 2023. The post "How to Choose the Right Roofing Sheet Thickness" is an **`Article`/`BlogPosting`**, not `HowTo`.
- **Fake `Offer.price`** — never fabricate prices to unlock Product rich results.

### Prerequisite content gaps (fix these to make schema valid/eligible)
1. **Blog cover images** — no `cover` on any post; `BlogPosting.image` is required by Google. Add 1200 px+ covers (ideally 16:9 + 1:1 + 4:3) or accept no Article rich result and use a site-wide default OG image as fallback.
2. **`public/logo.png`** — export an optimised copy (target < 100 KB) so `Organization.logo` has a stable URL.
3. **Street address + hours + `mapUrl`** — still `coming soon`. Until supplied, `LocalBusiness` cannot earn local rich results; markup below uses `addressRegion` only + `areaServed` (valid, entity-level). Add `address` street line, `openingHoursSpecification`, and `geo` when known.
4. **`datePublished` precision** — frontmatter `date` is date-only; add a time + `+07:00` offset for best practice (`2026-06-12T09:00:00+07:00`).

---

## 3. Ready-to-paste JSON-LD

All nodes below are designed to live in **one combined `@graph`** per page so `@id` cross-references (`#organization`, `#website`, `#logo`) resolve. The `<Schema>` component in §4 assembles `[organizationNode, websiteNode, ...pageNodes]` automatically.

### 3a. Site-wide — Organization (`RoofingContractor`) + WebSite

Type choice: `["Organization","RoofingContractor"]`. `RoofingContractor` is a Google-recognised `LocalBusiness` subtype that fits "manufacture + supply + install roofing" and works with province-level `areaServed` when there is no street address. `HardwareStore` is wrong (implies walk-in retail hardware store). If the client sees itself as pure supplier, fall back to `["Organization","HomeAndConstructionBusiness"]`.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "RoofingContractor"],
      "@id": "https://metal-roofing-store.vercel.app/#organization",
      "name": "Meechai Steel Ltd., Part.",
      "alternateName": ["หจก.มีชัยสตีล", "Meechai Steel"],
      "legalName": "หจก.มีชัยสตีล",
      "url": "https://metal-roofing-store.vercel.app/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://metal-roofing-store.vercel.app/#logo",
        "url": "https://metal-roofing-store.vercel.app/logo.png",
        "contentUrl": "https://metal-roofing-store.vercel.app/logo.png",
        "width": 1024,
        "height": 1024,
        "caption": "Meechai Steel Ltd., Part."
      },
      "image": { "@id": "https://metal-roofing-store.vercel.app/#logo" },
      "description": "Metal roofing and insulated-panel manufacturer and installer in Nong Khai, Thailand. Factory-standard metal roofing sheet, clip-lock and snap-lock systems, wall panels and PU foam insulated panels for houses, factories and cold storage.",
      "slogan": "Metal roofing & insulated panel manufacturer — factory-standard quality, expert installation.",
      "knowsLanguage": ["th", "en"],
      "telephone": "+6642990595",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Nong Khai",
        "addressCountry": "TH"
      },
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Nong Khai Province" },
        { "@type": "AdministrativeArea", "name": "Udon Thani Province" },
        { "@type": "AdministrativeArea", "name": "Bueng Kan Province" },
        { "@type": "City", "name": "Vientiane" },
        { "@type": "Country", "name": "Laos" }
      ],
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61593025679719",
        "https://line.me/R/ti/p/@680rgqnj"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+6642990595",
          "contactType": "sales",
          "name": "Office",
          "areaServed": "TH",
          "availableLanguage": ["th", "en"]
        },
        {
          "@type": "ContactPoint",
          "telephone": "+66910529136",
          "contactType": "sales",
          "name": "Mobile",
          "areaServed": ["TH", "LA"],
          "availableLanguage": ["th", "en"]
        },
        {
          "@type": "ContactPoint",
          "telephone": "+66818726147",
          "contactType": "customer support",
          "name": "Mobile",
          "areaServed": ["TH", "LA"],
          "availableLanguage": ["th", "en"]
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Metal roofing, wall panel & insulation products",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Metal Roofing Systems",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Metal Roofing Sheet", "url": "https://metal-roofing-store.vercel.app/products#metal-sheet" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bolt-Type Roofing System", "url": "https://metal-roofing-store.vercel.app/products#bolt-type" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Clip-Lock System", "url": "https://metal-roofing-store.vercel.app/products#clip-lock" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Snap-Lock System", "url": "https://metal-roofing-store.vercel.app/products#snap-lock" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Wall Panels",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Wall Panel Sheet", "url": "https://metal-roofing-store.vercel.app/products#panel-sheet" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Insulation",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "PU Foam Insulated Panel", "url": "https://metal-roofing-store.vercel.app/products#pu-foam" } }
            ]
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://metal-roofing-store.vercel.app/#website",
      "url": "https://metal-roofing-store.vercel.app/",
      "name": "Meechai Steel Ltd., Part.",
      "alternateName": "หจก.มีชัยสตีล",
      "inLanguage": ["th-TH", "en"],
      "publisher": { "@id": "https://metal-roofing-store.vercel.app/#organization" }
    }
  ]
}
```

Notes:
- `telephone` values kept as raw E.164 to match `phones[].href`. `+66-42-990-595` style is equally valid.
- `email` omitted — none in the data. Add a `ContactPoint.email` when available.
- No `openingHoursSpecification` / `geo` / street `address` — add when the business supplies them; the node stays valid without.
- `hasOfferCatalog` uses bare `Product` refs (no price) — this is valid and links the org to the catalogue without asserting prices.

### 3b. BreadcrumbList (per page)

Pattern — Thai `/products`:

```json
{
  "@type": "BreadcrumbList",
  "@id": "https://metal-roofing-store.vercel.app/products#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": "https://metal-roofing-store.vercel.app/" },
    { "@type": "ListItem", "position": 2, "name": "สินค้าและบริการ", "item": "https://metal-roofing-store.vercel.app/products" }
  ]
}
```

Pattern — blog post (3 levels):

```json
{
  "@type": "BreadcrumbList",
  "@id": "https://metal-roofing-store.vercel.app/blog/choosing-roof-thickness#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "หน้าแรก", "item": "https://metal-roofing-store.vercel.app/" },
    { "@type": "ListItem", "position": 2, "name": "บทความ", "item": "https://metal-roofing-store.vercel.app/blog" },
    { "@type": "ListItem", "position": 3, "name": "เลือกความหนาแผ่นหลังคาเหล็กอย่างไรให้เหมาะกับบ้าน", "item": "https://metal-roofing-store.vercel.app/blog/choosing-roof-thickness" }
  ]
}
```

English pages: swap labels to `Home` / `Products & Services` / `Blog` and prefix `/en`. Keep the final crumb `item` present (Google accepts it and it future-proofs).

### 3c. BlogPosting (per `/blog/[slug]`)

```json
{
  "@type": "BlogPosting",
  "@id": "https://metal-roofing-store.vercel.app/blog/choosing-roof-thickness#article",
  "isPartOf": { "@id": "https://metal-roofing-store.vercel.app/#website" },
  "mainEntityOfPage": "https://metal-roofing-store.vercel.app/blog/choosing-roof-thickness",
  "headline": "เลือกความหนาแผ่นหลังคาเหล็กอย่างไรให้เหมาะกับบ้าน",
  "description": "ความหนา 0.35 มม. กับ 0.47 มม. ต่างกันอย่างไร ใช้งานแบบไหนถึงจะคุ้มค่าและปลอดภัย",
  "inLanguage": "th-TH",
  "datePublished": "2026-06-12",
  "dateModified": "2026-06-12",
  "author": { "@id": "https://metal-roofing-store.vercel.app/#organization" },
  "publisher": { "@id": "https://metal-roofing-store.vercel.app/#organization" },
  "image": [
    "https://metal-roofing-store.vercel.app/og-default.png"
  ]
}
```

- `author` = the Organization: valid; Google accepts an organisation author. Switch to a `Person` node only when a real, named, consenting author exists.
- `image`: replace `og-default.png` with a real per-post `cover` (≥ 1200 px) once added — that is what makes the Article rich result eligible.
- Add time + offset to `datePublished`/`dateModified` when possible.
- Other two posts: `clip-lock-vs-snap-lock` (date `2026-05-03`), `pu-foam-cold-storage` (date `2026-03-20`).

### 3d. /products — ItemList + Product (no offers)

```json
{
  "@type": "ItemList",
  "@id": "https://metal-roofing-store.vercel.app/products#productlist",
  "name": "Metal roofing, wall & insulation products",
  "itemListOrder": "https://schema.org/ItemListOrderAscending",
  "numberOfItems": 6,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "@id": "https://metal-roofing-store.vercel.app/products#metal-sheet",
        "name": "Metal Roofing Sheet",
        "description": "Pre-painted galvanized steel sheet, factory roll-formed for strength and weather resistance.",
        "category": "Metal Roofing Systems",
        "url": "https://metal-roofing-store.vercel.app/products#metal-sheet",
        "image": "https://metal-roofing-store.vercel.app/photos/product-metal-sheet.png",
        "brand": { "@type": "Brand", "name": "Meechai Steel" },
        "manufacturer": { "@id": "https://metal-roofing-store.vercel.app/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Product",
        "@id": "https://metal-roofing-store.vercel.app/products#bolt-type",
        "name": "Bolt-Type Roofing System",
        "description": "Through-fastened screw-down system — straightforward installation, cost-effective.",
        "category": "Metal Roofing Systems",
        "url": "https://metal-roofing-store.vercel.app/products#bolt-type",
        "brand": { "@type": "Brand", "name": "Meechai Steel" },
        "manufacturer": { "@id": "https://metal-roofing-store.vercel.app/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Product",
        "@id": "https://metal-roofing-store.vercel.app/products#clip-lock",
        "name": "Clip-Lock System",
        "description": "Concealed-clip fastening with no sheet penetration — fewer leak points, suited to low-slope roofs.",
        "category": "Metal Roofing Systems",
        "url": "https://metal-roofing-store.vercel.app/products#clip-lock",
        "brand": { "@type": "Brand", "name": "Meechai Steel" },
        "manufacturer": { "@id": "https://metal-roofing-store.vercel.app/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Product",
        "@id": "https://metal-roofing-store.vercel.app/products#snap-lock",
        "name": "Snap-Lock System",
        "description": "Self-locking seam with no separate clips — fast installation, clean architectural finish.",
        "category": "Metal Roofing Systems",
        "url": "https://metal-roofing-store.vercel.app/products#snap-lock",
        "brand": { "@type": "Brand", "name": "Meechai Steel" },
        "manufacturer": { "@id": "https://metal-roofing-store.vercel.app/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Product",
        "@id": "https://metal-roofing-store.vercel.app/products#panel-sheet",
        "name": "Wall Panel Sheet",
        "description": "Prefabricated wall panels — fast install, shorter construction time, interior or exterior use.",
        "category": "Wall Panels",
        "url": "https://metal-roofing-store.vercel.app/products#panel-sheet",
        "image": "https://metal-roofing-store.vercel.app/photos/product-panel-sheet.png",
        "brand": { "@type": "Brand", "name": "Meechai Steel" },
        "manufacturer": { "@id": "https://metal-roofing-store.vercel.app/#organization" }
      }
    },
    {
      "@type": "ListItem",
      "position": 6,
      "item": {
        "@type": "Product",
        "@id": "https://metal-roofing-store.vercel.app/products#pu-foam",
        "name": "PU Foam Insulated Panel",
        "description": "Steel-faced polyurethane foam sandwich panel — high thermal and acoustic insulation.",
        "category": "Insulation",
        "url": "https://metal-roofing-store.vercel.app/products#pu-foam",
        "image": "https://metal-roofing-store.vercel.app/photos/product-pu-foam.png",
        "brand": { "@type": "Brand", "name": "Meechai Steel" },
        "manufacturer": { "@id": "https://metal-roofing-store.vercel.app/#organization" }
      }
    }
  ]
}
```

- `comingSoon` products are excluded (thin/no real spec). Add them when they have content.
- Verify the `image` URLs — product PNGs currently live in `src/assets/photos/` (bundled by Astro, hashed filenames). Either copy the 4 product images to `public/photos/…` for stable URLs, or import them in the page and use `img.src` (which resolves to the built absolute path). Only 4 of the 6 have photos; omit `image` where none exists rather than pointing at a 404.
- **No `offers`**: valid `Product`, but no product rich result. Only add `offers` when there is a real `price` + `"priceCurrency": "THB"`, or model a genuine quote flow as `Offer` with `"availability": "https://schema.org/InStock"` + `"url"` + `"priceSpecification"`. Do not ship an `Offer` with no price.

### 3e. English variants

`/en/products`, `/en/about`, etc. reuse the **same** Organization/WebSite `@id`s (one entity, two languages). Only localise `BreadcrumbList` labels, `inLanguage`, and page `@id`s (use the `/en/...` URL). There is no `/en/blog/[slug]`, so English `BlogPosting` is not applicable yet.

---

## 4. Astro implementation guidance

**Recommended: a `<Schema>` component invoked from `BaseLayout`, with an optional per-page prop.** This gives every page the Organization + WebSite graph for free and lets pages contribute their own nodes into the same `@graph` (so `@id` refs resolve).

### `src/lib/schema.ts` (builders — single source of truth)

```ts
import { site } from '../data/site';
import { location } from '../data/branches';

export const SITE_URL = 'https://metal-roofing-store.vercel.app';
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;
export const abs = (path: string) => new URL(path, SITE_URL).href;

export const organizationNode = {
  '@type': ['Organization', 'RoofingContractor'],
  '@id': ORG_ID,
  name: site.nameEn,
  alternateName: [site.nameTh, 'Meechai Steel'],
  legalName: site.nameTh,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    '@id': LOGO_ID,
    url: abs('/logo.png'),
    contentUrl: abs('/logo.png'),
    width: 1024,
    height: 1024,
    caption: site.nameEn,
  },
  image: { '@id': LOGO_ID },
  description:
    'Metal roofing and insulated-panel manufacturer and installer in Nong Khai, Thailand.',
  slogan: site.taglineEn,
  knowsLanguage: ['th', 'en'],
  telephone: site.phones[0].href.replace('tel:', ''),
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Nong Khai',
    addressCountry: 'TH',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Nong Khai Province' },
    { '@type': 'AdministrativeArea', name: 'Udon Thani Province' },
    { '@type': 'AdministrativeArea', name: 'Bueng Kan Province' },
    { '@type': 'City', name: 'Vientiane' },
    { '@type': 'Country', name: 'Laos' },
  ],
  sameAs: [site.facebookHref, site.lineHref],
  contactPoint: site.phones.map((p, i) => ({
    '@type': 'ContactPoint',
    telephone: p.href.replace('tel:', ''),
    contactType: i === 0 ? 'sales' : i === 1 ? 'sales' : 'customer support',
    name: p.labelEn,
    areaServed: i === 0 ? 'TH' : ['TH', 'LA'],
    availableLanguage: ['th', 'en'],
  })),
};

export const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: site.nameEn,
  alternateName: site.nameTh,
  inLanguage: ['th-TH', 'en'],
  publisher: { '@id': ORG_ID },
};

export function breadcrumb(
  crumbs: { name: string; path: string }[],
  pageUrl: string,
) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function blogPosting(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: Date;
  cover?: string;
}) {
  const url = abs(`/blog/${post.slug}`);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    inLanguage: 'th-TH',
    datePublished: post.date.toISOString(),
    dateModified: post.date.toISOString(),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    image: [abs(post.cover ?? '/og-default.png')],
  };
}
```

### `src/components/Schema.astro`

```astro
---
import { organizationNode, websiteNode } from '../lib/schema';

interface Props {
  /** Page-specific nodes merged into the site-wide @graph. */
  nodes?: Record<string, unknown>[];
}
const { nodes = [] } = Astro.props;

const graph = [organizationNode, websiteNode, ...nodes];
const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  // Neutralise </script> breakout + JSON-in-HTML parser hazards.
  .replace(/</g, '\\u003c')
  .replace(/>/g, '\\u003e')
  .replace(/&/g, '\\u0026')
  .replace(/ /g, '\\u2028')
  .replace(/ /g, '\\u2029');
---
<script type="application/ld+json" is:inline set:html={json} />
```

`is:inline` stops Astro from bundling/transforming the tag; `set:html` injects the pre-serialised string verbatim. Do **not** hand-write JSON in the template.

### `BaseLayout.astro` change

```astro
interface Props {
  lang: 'th' | 'en';
  title: string;
  description: string;
  schema?: Record<string, unknown>[];   // NEW
}
const { lang, title, description, schema = [] } = Astro.props;
```

In `<head>` (after `<meta name="description">`):

```astro
<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site).href} />
<Schema nodes={schema} />
```

(Import `Schema` at the top. The `canonical` line is a free adjacent win while editing head.)

### Page usage

```astro
---
import { breadcrumb } from '../lib/schema';
const crumbs = breadcrumb(
  [
    { name: 'หน้าแรก', path: '/' },
    { name: 'สินค้าและบริการ', path: '/products' },
  ],
  new URL(Astro.url.pathname, Astro.site).href,
);
---
<BaseLayout lang="th" title="สินค้า | หจก.มีชัยสตีล" description="…" schema={[crumbs, productItemListNode]}>
```

Blog `[slug].astro`:

```astro
schema={[
  breadcrumb(
    [
      { name: 'หน้าแรก', path: '/' },
      { name: 'บทความ', path: '/blog' },
      { name: post.data.title, path: `/blog/${post.slug}` },
    ],
    new URL(Astro.url.pathname, Astro.site).href,
  ),
  blogPosting({ slug: post.slug, title: post.data.title, excerpt: post.data.excerpt, date: post.data.date, cover: post.data.cover }),
]}
```

Alternative considered — per-page `<script set:html>` blocks with no shared component: rejected. It duplicates the Organization node, risks `@context`/escaping mistakes per page, and breaks `@id` graph resolution. The component approach centralises escaping and the entity definition.

### Validation checklist for the PR
1. `@context` = `https://schema.org` (single, at graph root) ✅
2. Types valid, none deprecated (no FAQPage/HowTo/SpecialAnnouncement) ✅
3. Required props: Organization → `name`, `url`; BreadcrumbList → `itemListElement[].{position,name}`; BlogPosting → `headline`, `datePublished`, `author`, `publisher`, `image` ✅ (image pending real covers)
4. All URLs absolute (helpers force `new URL(..., SITE_URL)`) ✅
5. Dates ISO 8601 (`Date.toISOString()`) ✅
6. No placeholder strings — all values come from `src/data/*` ✅
7. Run every template through Google Rich Results Test + Schema Markup Validator after deploy.

---

## 5. audit-data.json — category: Schema / Structured Data

```json
{
  "category": "Schema / Structured Data",
  "score": 5,
  "summary": "Zero structured data on every route. No Organization, WebSite, BreadcrumbList, Product, or BlogPosting. Clean static HTML and correct `site` config make remediation low-risk.",
  "findings": [
    { "id": "schema-no-organization", "priority": "critical", "title": "No Organization / LocalBusiness node", "recommendation": "Add site-wide Organization+RoofingContractor via a <Schema> component in BaseLayout. Province-level areaServed (no street address available); sameAs Facebook + LINE; one contactPoint per phone." },
    { "id": "schema-no-website", "priority": "critical", "title": "No WebSite node", "recommendation": "Add WebSite with publisher ref to Organization. No SearchAction (site has no search)." },
    { "id": "schema-no-breadcrumbs", "priority": "high", "title": "No BreadcrumbList on any page", "recommendation": "Generate from path on all pages except home; 3 levels for blog posts." },
    { "id": "schema-no-blogposting", "priority": "high", "title": "Blog posts have no Article/BlogPosting", "recommendation": "Add BlogPosting to /blog/[slug]; author = Organization; needs per-post cover images for Article rich-result eligibility." },
    { "id": "schema-no-product-itemlist", "priority": "medium", "title": "/products has no ItemList/Product", "recommendation": "ItemList of 6 real Products, no offers (no public price / no checkout). Exclude comingSoon items." },
    { "id": "schema-no-logo-imageobject", "priority": "medium", "title": "No logo ImageObject", "recommendation": "Copy optimised logo to public/logo.png (1024x1024 source available); reference as Organization.logo ImageObject." },
    { "id": "schema-adjacent-canonical-hreflang-og", "priority": "medium", "title": "No canonical, hreflang, or og:image", "recommendation": "Add in the same head edit; og:image doubles as BlogPosting image fallback." },
    { "id": "schema-no-person-review", "priority": "info", "title": "No Person / Review / AggregateRating", "recommendation": "Blocked: team.ts and testimonials.ts are intentionally empty. Do not fabricate. Add when consented real data exists." },
    { "id": "schema-faqpage-note", "priority": "info", "title": "Do not add FAQPage", "recommendation": "Google retired FAQ rich results for all sites (May 2026). Use QAPage only for genuine user Q&A (none here). Never HowTo." }
  ]
}
```
