# UI Token & Shared-Component Refresh (Notion structure, steel-industrial skin)

## Context

Meechai Steel (`หจก.มีชัยสตีล`) is a Thai metal-roofing manufacturer's bilingual (TH/EN) lead-gen site, built in Astro. `DESIGN.md` and `PRODUCT.md` already establish a deliberate brand identity: red-oxide/steel-blue OKLCH palette, Taviraj (display serif) + Sarabun (body sans), "traditional & reliable, not a startup showroom," and explicit anti-references against SaaS-landing-page tropes (gradient text, glassmorphism, pill CTAs, pastel cards).

`notion-DESIGN.md` was supplied as a structural reference (component taxonomy, elevation scale, radius tiers, badge system) — explicitly **not** as a visual reference. `taste-SKILL.md` was supplied as an anti-slop discipline reference (AI-tell avoidance, hero/nav/motion hard rules).

**Decision (confirmed with user):** pull Notion's component *structure* only — elevation scale, tiered radius, badge/tag taxonomy, dense comparison-table pattern — and re-skin every one of those patterns onto the existing red-oxide/steel-blue palette and type stack. No purple, no pastel cards, no navy hero, no dark mode (DESIGN.md explicitly opts out of dark mode for MVP; that decision is preserved, overriding taste-SKILL's default dark-mode requirement).

## Current-state audit

- `src/styles/global.css` defines one flat `--radius: 6px` used in ~30 places across every page (buttons, photos, cards, diagrams) and has **no shadow/elevation tokens at all** — every card is flat-bordered.
- There is no shared `Card` or `Badge` component. Each page hand-rolls its own card class (`.std-card`, `.branch-mini`, `.profile-card`, `.contact-card`, `.color-swatch`) with near-identical CSS duplicated per file, and duplicated again in the parallel `src/pages/en/*.astro` file for the English route.
- `Header.astro` fits 14 nav items on one line by shrinking to `font-size: 0.85rem` at desktop widths instead of condensing/collapsing earlier — the exact anti-pattern `taste-SKILL.md` §4.7 warns against ("shrink font to fit" instead of "condense or hamburger").
- Three raw emoji glyphs (📞 💬 📘) are used as icons in `StickyContact.astro` and `contact.astro`/`en/contact.astro`, against the icon-library discipline in `taste-SKILL.md` §3.C/§9.E.
- `StickyContact.astro` has one ad-hoc shadow (`0 -4px 12px oklch(0 0 0 / 0.06)`) using a pure-black tint rather than a hue-tinted shadow.
- Existing specs/product tables (`specifications.astro`, `products.astro`) use bare `<table>` inside a `.table-scroll` div with global `thead th` / `tbody td` styling — functional but visually flat, no container framing.

## Goals

1. Add the missing token layer (tiered radius, elevation scale, badge tones) to `global.css`, additive only — do not require touching the ~30 existing `var(--radius)` usages.
2. Introduce two new shared Astro components (`Card`, `Badge`) that future and existing markup can adopt incrementally.
3. Fix the header nav collapse anti-pattern.
4. Frame the two data tables in a bordered/rounded panel matching the new radius scale.
5. Replace the three emoji icons with a real icon library, since those files are already in scope.

## Non-goals

- No dark mode.
- No new pages or sections (no FAQ accordion, no stat strip, no pricing table — none of those exist in the current IA and none are being added).
- No copy changes, no IA/nav-label/slug changes.
- No mass migration of every existing card usage to the new `Card` component in this pass — this spec defines the components and applies them to the highest-value duplication points (see "Application targets" below); a full sweep of every page can follow in a later pass without re-touching tokens.
- No change to how fonts are loaded (Google Fonts `<link>` stays as-is; that's a Next.js-specific `taste-SKILL.md` rule that doesn't apply to Astro's setup here).

## Token layer (`src/styles/global.css`)

```css
:root {
  /* existing --radius: 6px becomes the "md" tier, bumped slightly softer */
  --radius: 8px;              /* buttons, inputs, photos — unchanged usages, new value */
  --radius-sm: 4px;           /* new: tag chips */
  --radius-lg: 12px;          /* new: Card feature/elevated, table-panel, elevated hero photo */
  --radius-full: 9999px;      /* new: status badge pills */

  /* new: elevation scale, tinted to the steel-blue accent hue (240), never pure black */
  --shadow-1: 0 1px 2px oklch(0.32 0.03 240 / 0.08);   /* hover lift */
  --shadow-2: 0 4px 14px oklch(0.30 0.035 240 / 0.12); /* resting feature/elevated card */
  --shadow-3: 0 24px 48px -8px oklch(0.26 0.04 240 / 0.24); /* one hero-featured photo only */

  /* new: soft (low-alpha) backgrounds for tag-style badges, derived from existing tones */
  --color-primary-soft: oklch(0.55 0.16 32 / 0.12);
  --color-success-soft: oklch(0.56 0.13 145 / 0.12);
  --color-danger-soft: oklch(0.55 0.18 25 / 0.12);
  --color-neutral-soft: var(--color-surface);
}
```

`StickyContact.astro`'s existing pure-black shadow is replaced with `var(--shadow-2)` (flipped vertically via a `-shadow-2` override or simply `0 -4px 14px oklch(0.30 0.035 240 / 0.12)`) as part of this token rollout, since it's the one pre-existing shadow in the codebase.

## New component: `src/components/Card.astro`

Props:
```ts
interface Props {
  variant?: 'base' | 'interactive' | 'elevated'; // default 'base'
  elevation?: 2 | 3;                              // only meaningful for 'elevated', default 2
  href?: string;                                  // if present, renders <a>, else <div>
}
```

Behavior:
- `base` — `background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-4);`. Replaces the informational-card pattern currently duplicated as `.std-card` / `.branch-mini` / `.profile-card`.
- `interactive` — same as `base` plus `cursor: pointer`, hover `box-shadow: var(--shadow-1)` with a `translateY(-2px)` lift, `:active` presses back to `translateY(0)`. Replaces the link-card pattern currently duplicated as `.contact-card`.
- `elevated` — no border, `box-shadow: var(--shadow-2)` (or `var(--shadow-3)` when `elevation={3}`), `border-radius: var(--radius-lg)`. Reserved for one hero-featured photo per page (the Notion "mockup card breaks out of the hero" pattern, using real factory/product photography instead of a product screenshot) — not for general use, to avoid every card on the page competing for the same visual weight.
- Content via default `<slot />`.

## New component: `src/components/Badge.astro`

Props:
```ts
interface Props {
  tone?: 'primary' | 'success' | 'danger' | 'neutral'; // default 'neutral'
  variant?: 'solid' | 'soft';                            // default 'soft'
}
```

Behavior (mirrors Notion's `badge-*` vs `badge-tag-*` split, recolored to the site's existing tones — no rainbow palette):
- `solid` — full-strength tone background, inverse text (`--color-{tone}-ink` where it exists, else white), `border-radius: var(--radius-full)`, `padding: 4px 10px`, `typography: 0.75rem/600`. For status/certification callouts, e.g. "รับประกัน 10 ปี" (10-year warranty).
- `soft` — `background: var(--color-{tone}-soft)`, text in the full-strength tone color, `border-radius: var(--radius-sm)`, `padding: 2px 8px`. For category/product tags, e.g. profile type or branch labels.
- Content via default `<slot />`.

## Table panel

Add a `.table-panel` class to `global.css`:
```css
.table-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
```
Applied to the existing `.table-scroll` wrapper div in `specifications.astro` / `en/specifications.astro` and `products.astro` / `en/products.astro` (four files, wrapper-class-only change — no markup restructuring, no data changes).

## Header nav fix (`Header.astro`)

- Raise the hamburger breakpoint from `max-width: 900px` to `max-width: 1200px` so 14 items no longer need to shrink below a comfortable size in the range that currently forces the 0.85rem hack. Verify visually against the live nav after the change and nudge the number if 14 items still crowd at widths just above 1200px.
- Restore `.main-nav__list` to a readable `font-size` (target ~0.95rem) above that breakpoint, since cramming is no longer the fallback.
- Keep the existing underline-on-active/hover treatment; no new visual language needed here beyond removing the shrink-to-fit hack.
- No changes to nav item labels, order, or count (IA stays stable).

## Icon replacement

Add `@phosphor-icons/react` as a dependency. Since Astro renders framework components to static HTML with zero JS when no `client:*` directive is used, these render as plain static SVG:
- 📞 → `Phone` icon
- 💬 → `ChatCircleDots` icon (LINE contact)
- 📘 → `FacebookLogo` icon

Applied in `StickyContact.astro`, `contact.astro`, and `en/contact.astro` (three files). `aria-hidden="true"` wrapping stays as-is; visible label text next to each icon is unchanged.

## Application targets for this pass

New tokens and components are added globally, but full-site migration of every existing card usage is out of scope (see Non-goals). This pass applies the new components to the following files, chosen because they're the clearest duplication points identified in the audit:
- `contact.astro` / `en/contact.astro` — `.contact-card` → `Card` (`variant="interactive"`, `href`).
- `branches.astro` / `en/branches.astro` — `.branch-mini` → `Card` (`variant="base"`).
- `about.astro` / `en/about.astro` — `.std-card` → `Card` (`variant="base"`); add one `Card` (`variant="elevated"`) around the facility photo if a real photo exists at that slot (currently a `photo--pending` placeholder — if still pending at implementation time, skip the elevated treatment rather than applying a deep shadow to a placeholder pattern fill).
- `specifications.astro` / `en/specifications.astro`, `products.astro` / `en/products.astro` — `.table-panel` wrapper.
- `StickyContact.astro`, `contact.astro`, `en/contact.astro` — icon replacement + shadow token.
- `Header.astro` — breakpoint fix.

Other pages keep their current markup untouched in this pass; they already inherit the token-layer changes (radius bump, new shadow/badge tokens available for later use) without any file edits.

## Testing / verification plan

- `pnpm check` (Astro type-check) after all edits.
- `pnpm build` to confirm no build regressions across TH/EN routes.
- Visual check via the project's browser-screenshot workflow (serve `dist/`, drive headless Chromium) at mobile/tablet/desktop widths for: Header (nav collapse point, no wrap/shrink), Contact page (new interactive cards, new icons), Branches page, About page, Specifications/Products tables.
- Contrast check on new badge tones (solid and soft) against their backgrounds, WCAG AA.
- Confirm `prefers-reduced-motion` still degrades the existing `.reveal` system correctly (untouched, but re-verify after CSS changes land).

## Known gaps / follow-ups (not this pass)

- Full-site sweep converting every remaining ad-hoc card class to the shared `Card` component.
- The `.main-nav` still lists all 14 items with no overflow/mega-menu; if 14 items ever grows, a real overflow pattern (not addressed here) will be needed.
- Google Fonts still loaded via `<link>` rather than self-hosted — acceptable for Astro, flagged only because `taste-SKILL.md` calls it out for Next.js projects.
