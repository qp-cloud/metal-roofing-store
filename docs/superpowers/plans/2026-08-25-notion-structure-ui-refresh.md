# UI Token & Shared-Component Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a missing elevation/radius/badge token layer to this Astro site's `global.css`, introduce two new shared components (`Card`, `Badge`), and apply them to the highest-duplication pages, without changing the site's existing red-oxide/steel-blue visual identity, IA, or copy.

**Architecture:** Pure CSS-token additions plus two new leaf Astro components (`Card.astro`, `Badge.astro`) with no client-side JS. Six existing pages (three TH/EN pairs) swap their hand-rolled card CSS for `<Card>` usages while keeping their own nested-content CSS (headings, paragraph color) working via Astro's automatic scope-class passthrough on the `class` prop. Two files gain a `.table-panel` wrapper class. `Header.astro` gets a breakpoint fix. Three files swap emoji glyphs for `@phosphor-icons/react` icons rendered statically (no `client:*` directive, so zero JS ships).

**Tech Stack:** Astro 5.2 (`.astro` components, scoped `<style>`), plain CSS custom properties (OKLCH colors), `@phosphor-icons/react` (new dependency, server-rendered only), pnpm.

**Spec:** `docs/superpowers/specs/2026-08-25-notion-structure-ui-refresh-design.md`

## Global Constraints

- No dark mode (DESIGN.md explicitly opts out for MVP — do not add one).
- No IA/nav-label/slug changes, no copy changes.
- Do not touch the ~30 other existing `var(--radius)` usages beyond what each task explicitly lists — the token bump to `--radius: 8px` covers those automatically with zero file edits.
- This repo has no test runner configured (no vitest/jest/playwright as a dependency — only a cached Playwright browser binary exists on disk for manual screenshotting). "Testing" in every task below means: `pnpm check` (Astro/TS diagnostics), `pnpm build` (build must succeed), and — for visual changes — a screenshot pass using the project's documented workflow:
  1. `pnpm build`
  2. `python3 -m http.server 8099 --bind 127.0.0.1` from the `dist/` directory (run in background; never `pkill -f "http.server 8099"` in a compound command, it matches the running shell too)
  3. Screenshot with `~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=W,H --force-device-scale-factor=1 --screenshot=out.png URL`
  4. Read the resulting PNG to visually confirm the change.
- Every task that edits a TH page and its `en/` counterpart edits both files in the same task — they're mechanically identical edits, never leave one language done and the other not.
- Astro scope-passthrough fact this plan relies on: when a parent `.astro` file writes `<Card class="foo">`, Astro injects the parent's own scoped-style hash into the `class` value forwarded to the child, so the parent's own `<style>` rules targeting `.foo` still apply to whatever element `Card` renders it onto (as long as `Card` places `Astro.props.class` on its root element, which it does via `class:list`). This is why each migration task below keeps the page's existing content-selector classes (e.g. `contact-card`, `std-card`) passed alongside the new `Card` component instead of discarding them.

---

### Task 1: Token layer in `global.css` + retint the one existing shadow

**Files:**
- Modify: `src/styles/global.css:1-44` (root token block), and near `src/styles/global.css:203-205` (`.table-scroll` rule)
- Modify: `src/components/StickyContact.astro:22-32` (existing ad-hoc shadow)

**Interfaces:**
- Produces (consumed by Tasks 2, 3, 8): `--radius: 8px` (bumped from 6px), `--radius-sm: 4px`, `--radius-lg: 12px`, `--radius-full: 9999px`, `--shadow-1`, `--shadow-2`, `--shadow-3`, and a global `.table-panel` class.

- [ ] **Step 1: Edit the root token block**

In `src/styles/global.css`, change line 34 from:
```css
  --radius: 6px;
```
to:
```css
  --radius: 8px;
  --radius-sm: 4px;
  --radius-lg: 12px;
  --radius-full: 9999px;
```

Then, immediately after the `--ease-out-quart` line (currently line 43), add:
```css

  /* Elevation scale — tinted to the steel-blue accent hue (240), never pure black. */
  --shadow-1: 0 1px 2px oklch(0.32 0.03 240 / 0.08);
  --shadow-2: 0 4px 14px oklch(0.30 0.035 240 / 0.12);
  --shadow-3: 0 24px 48px -8px oklch(0.26 0.04 240 / 0.24);
```

- [ ] **Step 2: Add the `.table-panel` class**

In `src/styles/global.css`, immediately after the existing `.table-scroll { overflow-x: auto; }` rule, add:
```css

.table-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
```

- [ ] **Step 3: Retint `StickyContact.astro`'s shadow**

In `src/components/StickyContact.astro`, change:
```css
    box-shadow: 0 -4px 12px oklch(0 0 0 / 0.06);
```
to:
```css
    box-shadow: 0 -4px 14px oklch(0.30 0.035 240 / 0.10);
```
(Same shape as the new `--shadow-2` token but kept as a literal value since this is an upward-cast bar shadow, not a card-elevation shadow — the elevation tokens are all downward.)

- [ ] **Step 4: Verify**

Run: `pnpm check`
Expected: `0 errors`

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/components/StickyContact.astro
git commit -m "Add radius/elevation token scale and table-panel class"
```

---

### Task 2: `Card.astro` component

**Files:**
- Create: `src/components/Card.astro`

**Interfaces:**
- Consumes: `--radius-lg`, `--shadow-1`, `--shadow-2`, `--shadow-3`, `--color-bg`, `--color-border`, `--color-primary`, `--color-primary-ink`, `--space-4`, `--ease-out-quart` (all from Task 1 / existing tokens).
- Produces (consumed by Tasks 4, 5, 6): `Card` component with:
  ```ts
  interface Props {
    variant?: 'base' | 'interactive' | 'elevated'; // default 'base'
    elevation?: 2 | 3;                              // only used when variant === 'elevated', default 2
    emphasis?: 'primary';                           // fills background/border/text with the primary tone
    href?: string;                                  // presence renders <a>, absence renders <div>
    target?: string;
    rel?: string;
    class?: string;                                 // merged onto the root element
  }
  ```
  Root element carries classes `card card--{variant}` plus `card--emphasis-primary` when `emphasis="primary"` plus `card--elevation-3` when `variant === 'elevated' && elevation === 3`, plus whatever `class` was passed in.

This is a leaf presentational component with no page wired to it yet in this task — verification here is compile-only; full behavioral verification happens in Tasks 4-6 where it's actually used.

- [ ] **Step 1: Write the component**

Create `src/components/Card.astro`:
```astro
---
interface Props {
  variant?: 'base' | 'interactive' | 'elevated';
  elevation?: 2 | 3;
  emphasis?: 'primary';
  href?: string;
  target?: string;
  rel?: string;
  class?: string;
}

const {
  variant = 'base',
  elevation = 2,
  emphasis,
  href,
  target,
  rel,
  class: className,
} = Astro.props;

const Tag = href ? 'a' : 'div';
---

<Tag
  class:list={[
    'card',
    `card--${variant}`,
    emphasis === 'primary' && 'card--emphasis-primary',
    variant === 'elevated' && elevation === 3 && 'card--elevation-3',
    className,
  ]}
  href={href}
  target={target}
  rel={rel}
>
  <slot />
</Tag>

<style>
  .card {
    display: block;
    border-radius: var(--radius-lg);
    color: inherit;
    text-decoration: none;
  }

  .card--base,
  .card--interactive {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    padding: var(--space-4);
  }

  .card--interactive {
    cursor: pointer;
    transition:
      box-shadow 180ms var(--ease-out-quart),
      transform 180ms var(--ease-out-quart),
      border-color 180ms var(--ease-out-quart);
  }

  .card--interactive:hover {
    box-shadow: var(--shadow-1);
    transform: translateY(-2px);
    border-color: var(--color-primary);
  }

  .card--interactive:active {
    transform: translateY(0);
  }

  .card--emphasis-primary {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-primary-ink);
  }

  .card--elevated {
    border: none;
    padding: 0;
    box-shadow: var(--shadow-2);
    overflow: hidden;
  }

  .card--elevation-3 {
    box-shadow: var(--shadow-3);
  }
</style>
```

- [ ] **Step 2: Verify**

Run: `pnpm check`
Expected: `0 errors` (validates the `Props` interface and template compile cleanly).

Run: `pnpm build`
Expected: build succeeds (component is unused so far, which is not an error in Astro).

- [ ] **Step 3: Commit**

```bash
git add src/components/Card.astro
git commit -m "Add shared Card component (base/interactive/elevated)"
```

---

### Task 3: `Badge.astro` component

**Files:**
- Create: `src/components/Badge.astro`

**Interfaces:**
- Consumes: `--radius-full`, `--radius-sm`, `--color-accent`, `--color-accent-ink`, `--color-surface`, `--color-border`, `--color-muted` (existing tokens).
- Produces: `Badge` component with:
  ```ts
  interface Props {
    tone?: 'primary' | 'success' | 'danger' | 'neutral'; // default 'neutral'
    variant?: 'solid' | 'soft';                            // default 'soft'
    class?: string;
  }
  ```

Per the spec's Non-goals (no new copy/content in this pass), **no page wires this up yet** — it ships as a ready-to-use primitive for a future content pass (e.g. a warranty/certification callout), matching how the spec defines it without listing an application target. Verification is compile-only plus a standalone contrast check.

The solid/soft tone colors are deliberately different (darker) shades than the site's existing `--color-primary` / `--color-success` / `--color-danger` tokens used elsewhere (buttons, forms) — those existing tokens don't hit WCAG AA (4.5:1) when used as badge fills at this small size, so this component defines its own darker "badge-safe" shades scoped to `Badge.astro` only. This does not affect any existing button/form styling.

- [ ] **Step 1: Write the component**

Create `src/components/Badge.astro`:
```astro
---
interface Props {
  tone?: 'primary' | 'success' | 'danger' | 'neutral';
  variant?: 'solid' | 'soft';
  class?: string;
}

const { tone = 'neutral', variant = 'soft', class: className } = Astro.props;
---

<span class:list={['badge', `badge--${variant}`, `badge--${tone}`, className]}>
  <slot />
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1.4;
    white-space: nowrap;
  }

  /* Badge-safe tones: darker than the site's general --color-primary/success/danger
     tokens so solid-fill white text and soft-tint text both clear WCAG AA 4.5:1
     at this component's small size. See Task 3 verification for the numbers. */
  .badge--primary { --badge-color: oklch(0.525 0.16 32); }
  .badge--success { --badge-color: oklch(0.495 0.13 145); }
  .badge--danger  { --badge-color: oklch(0.530 0.18 25); }
  .badge--neutral { --badge-color: var(--color-accent); }

  .badge--solid {
    border-radius: var(--radius-full);
    padding: 4px 10px;
    background: var(--badge-color);
    color: var(--color-accent-ink);
  }

  .badge--soft {
    border-radius: var(--radius-sm);
    padding: 2px 8px;
    background: oklch(from var(--badge-color) l c h / 0.12);
    color: var(--badge-color);
  }

  .badge--soft.badge--neutral {
    background: var(--color-surface);
    color: var(--color-muted);
    border: 1px solid var(--color-border);
  }
</style>
```

Note: `.badge--neutral` uses `--color-accent` (dark steel-blue, contrast ~14.5:1 vs white) for its solid variant, and falls back to the existing `--color-surface` / `--color-muted` pairing (contrast ~5.95:1) for its soft variant rather than the generic `oklch(from ...)` formula, since accent has no natural light tint in the existing palette.

- [ ] **Step 2: Verify contrast (replaces a unit test — no test runner exists in this repo)**

Run this to confirm every solid and soft combination clears WCAG AA (4.5:1 for normal text):
```bash
python3 - <<'EOF'
import math

def oklch_to_srgb255(L, C, H):
    h = math.radians(H)
    a, b = C * math.cos(h), C * math.sin(h)
    l_ = L + 0.3963377774*a + 0.2158037573*b
    m_ = L - 0.1055613458*a - 0.0638541728*b
    s_ = L - 0.0894841775*a - 1.2914855480*b
    l, m, s = l_**3, m_**3, s_**3
    r = +4.0767416621*l -3.3077115913*m +0.2309699292*s
    g = -1.2684380046*l +2.6097574011*m -0.3413193965*s
    bch = -0.0041960863*l -0.7034186147*m +1.7076147010*s
    def lin(c):
        c = max(0.0, min(1.0, c))
        return 12.92*c if c <= 0.0031308 else 1.055*(c**(1/2.4)) - 0.055
    return tuple(round(max(0, min(1, lin(x))) * 255) for x in (r, g, bch))

def rel_lum(rgb):
    def f(c):
        c = c/255
        return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
    r, g, b = rgb
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)

def contrast(rgb1, rgb2):
    l1, l2 = rel_lum(rgb1), rel_lum(rgb2)
    l1, l2 = max(l1, l2), min(l1, l2)
    return (l1 + 0.05) / (l2 + 0.05)

def blend(fg, bg, alpha):
    return tuple(fg[i]*alpha + bg[i]*(1-alpha) for i in range(3))

white = (255, 255, 255)
tones = {
    'primary': (0.525, 0.16, 32),
    'success': (0.495, 0.13, 145),
    'danger':  (0.530, 0.18, 25),
}
ok = True
for name, (L, C, H) in tones.items():
    rgb = oklch_to_srgb255(L, C, H)
    soft_bg = blend(rgb, white, 0.12)
    c_solid = contrast(rgb, white)
    c_soft = contrast(rgb, soft_bg)
    status_solid = "PASS" if c_solid >= 4.5 else "FAIL"
    status_soft = "PASS" if c_soft >= 4.5 else "FAIL"
    print(f"{name}: solid-vs-white={c_solid:.2f} {status_solid}   soft-text-vs-soft-bg={c_soft:.2f} {status_soft}")
    ok = ok and c_solid >= 4.5 and c_soft >= 4.5
print("ALL PASS" if ok else "SOME FAILED")
EOF
```
Expected output:
```
primary: solid-vs-white=5.84 PASS   soft-text-vs-soft-bg=4.88 PASS
success: solid-vs-white=5.81 PASS   soft-text-vs-soft-bg=4.90 PASS
danger: solid-vs-white=5.79 PASS   soft-text-vs-soft-bg=4.81 PASS
ALL PASS
```

- [ ] **Step 3: Run `pnpm check` and `pnpm build`**

Expected: `0 errors`, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Badge.astro
git commit -m "Add shared Badge component (solid/soft x primary/success/danger/neutral)"
```

---

### Task 4: Icon replacement (StickyContact, contact, en/contact)

**Files:**
- Modify: `package.json` (new dependency)
- Modify: `src/components/StickyContact.astro:11-20`
- Modify: `src/pages/contact.astro:20,26,38`
- Modify: `src/pages/en/contact.astro:20,26,38`

**Interfaces:** none (icons are presentational only, no shared component created — Phosphor components are used directly).

- [ ] **Step 1: Install the icon library**

```bash
pnpm add @phosphor-icons/react
```

- [ ] **Step 2: Replace icons in `StickyContact.astro`**

In `src/components/StickyContact.astro`, add the import to the frontmatter (after the existing `site` import):
```astro
import { Phone, ChatCircleDots } from '@phosphor-icons/react/dist/ssr';
```
Then change:
```astro
  <a class="sticky-contact__link" href={site.phoneHref}>
    <span aria-hidden="true">📞</span>
    {lang === 'en' ? 'Call' : 'โทร'}
  </a>
  <a class="sticky-contact__link sticky-contact__link--line" href={site.lineHref} target="_blank" rel="noopener noreferrer">
    <span aria-hidden="true">💬</span>
    LINE
  </a>
```
to:
```astro
  <a class="sticky-contact__link" href={site.phoneHref}>
    <Phone size={20} weight="bold" aria-hidden="true" />
    {lang === 'en' ? 'Call' : 'โทร'}
  </a>
  <a class="sticky-contact__link sticky-contact__link--line" href={site.lineHref} target="_blank" rel="noopener noreferrer">
    <ChatCircleDots size={20} weight="bold" aria-hidden="true" />
    LINE
  </a>
```

- [ ] **Step 3: Replace icons in `contact.astro` and `en/contact.astro`**

In both files, add the same import to the frontmatter:
```astro
import { ChatCircleDots, Phone, FacebookLogo } from '@phosphor-icons/react/dist/ssr';
```
Then change each of the three:
```astro
<span class="contact-card__icon" aria-hidden="true">💬</span>
```
to
```astro
<ChatCircleDots size={28} weight="bold" class="contact-card__icon" aria-hidden="true" />
```
```astro
<span class="contact-card__icon" aria-hidden="true">📞</span>
```
to
```astro
<Phone size={28} weight="bold" class="contact-card__icon" aria-hidden="true" />
```
```astro
<span class="contact-card__icon" aria-hidden="true">📘</span>
```
to
```astro
<FacebookLogo size={28} weight="bold" class="contact-card__icon" aria-hidden="true" />
```
The existing `.contact-card__icon { font-size: 1.75rem; }` rule no longer sizes anything (icons take an explicit `size` prop instead) — remove that rule from both files' `<style>` blocks in this step, since a dead `font-size` rule on a non-text element is misleading.

- [ ] **Step 4: Verify**

Run: `pnpm check`
Expected: `0 errors`.

Run: `pnpm build`
Expected: build succeeds.

Run the screenshot workflow (see Global Constraints) against `/contact`, `/en/contact`, and any page (icons in `StickyContact` are visible at ≤720px width) at a 375×800 window size. Read the resulting PNGs and confirm: no emoji glyphs remain, the three icons render as clean line/bold-weight glyphs, sized consistently, with visible text labels beside them.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/StickyContact.astro src/pages/contact.astro src/pages/en/contact.astro
git commit -m "Replace emoji contact icons with @phosphor-icons/react"
```

---

### Task 5: Migrate `contact.astro` / `en/contact.astro` cards to `Card`

**Files:**
- Modify: `src/pages/contact.astro:20-43,89-138` (template + style)
- Modify: `src/pages/en/contact.astro:20-43,91-138` (template + style)

**Interfaces:**
- Consumes: `Card` from Task 2 (`variant`, `emphasis`, `href`, `target`, `rel`, `class` props).

- [ ] **Step 1: Import `Card` and swap the template markup**

In both `contact.astro` and `en/contact.astro`, add to the frontmatter:
```astro
import Card from '../components/Card.astro';
```
(use `'../../components/Card.astro'` in `en/contact.astro`, matching that file's existing relative-import depth).

Replace (Thai version shown; English version is the same structural change with its own existing text):
```astro
<a class="contact-card contact-card--primary" href={site.lineHref} target="_blank" rel="noopener noreferrer">
  <span class="contact-card__icon" aria-hidden="true">💬</span>
  ...
</a>
<div class="contact-card">
  ...
</div>
<a class="contact-card" href={site.facebookHref} target="_blank" rel="noopener noreferrer">
  ...
</a>
```
with:
```astro
<Card
  variant="interactive"
  emphasis="primary"
  class="contact-card contact-card--primary"
  href={site.lineHref}
  target="_blank"
  rel="noopener noreferrer"
>
  <ChatCircleDots size={28} weight="bold" class="contact-card__icon" aria-hidden="true" />
  <h2>แชททาง LINE</h2>
  <p>{site.lineId}</p>
  <span class="contact-card__cta">เปิดแชท &rarr;</span>
</Card>
<Card variant="base" class="contact-card">
  <Phone size={28} weight="bold" class="contact-card__icon" aria-hidden="true" />
  <h2>โทรหาเรา</h2>
  <ul class="phone-list">
    {site.phones.map((p) => (
      <li>
        <a href={p.href}>{p.display}</a>
        <span class="phone-list__label">{p.labelTh}</span>
      </li>
    ))}
  </ul>
</Card>
<Card variant="interactive" class="contact-card" href={site.facebookHref} target="_blank" rel="noopener noreferrer">
  <FacebookLogo size={28} weight="bold" class="contact-card__icon" aria-hidden="true" />
  <h2>Facebook</h2>
  <p>{site.nameTh}</p>
  <span class="contact-card__cta">ไปที่เพจ &rarr;</span>
</Card>
```
(The middle "Call Us" card is informational, not a link, so it stays `variant="base"` — matching its original plain-`<div>` behavior. The LINE and Facebook cards are links, so `variant="interactive"`.)

- [ ] **Step 2: Delete the now-redundant structural CSS, keep the content-specific CSS**

In both files' `<style>` blocks, delete these rules (now owned by `Card`):
```css
  .contact-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    background: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-5);
    text-decoration: none;
    color: var(--color-ink);
    transition: border-color 180ms var(--ease-out-quart), transform 180ms var(--ease-out-quart);
  }

  .contact-card:hover {
    transform: translateY(-2px);
    border-color: var(--color-primary);
  }

  .contact-card--primary {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-primary-ink);
  }
```
Keep everything else as-is (`.contact-grid`, `.contact-card--primary p, .contact-card--primary .contact-card__cta`, `.contact-card h2`, `.contact-card p`, `.contact-card__cta`, `.phone-list*`, `.rfq-*`, `.hero__actions`) — these are content/typography rules, not structural card rules, and they still apply because `Card` forwards the `contact-card` / `contact-card--primary` classes onto its root element (see Global Constraints scope-passthrough note).

Also add `display: flex; flex-direction: column; gap: var(--space-1);` to the kept `.contact-card` selector's replacement — since that layout rule was bundled into the deleted block but is still needed for the icon/heading/paragraph stack inside the card. Add this new small rule in its place:
```css
  .contact-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
```

- [ ] **Step 3: Verify**

Run: `pnpm check` — expected `0 errors`.
Run: `pnpm build` — expected success.
Run the screenshot workflow against `/contact` and `/en/contact` at 1280×900. Read the PNGs and confirm: three cards render with correct spacing/icons, the LINE card is still filled with the primary red-oxide color with white text, hovering (simulate by checking the CSS is present — full hover-state screenshotting isn't necessary) isn't required to be captured, just confirm the resting-state layout matches the pre-change screenshot in `screenshots/` for comparison.

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro src/pages/en/contact.astro
git commit -m "Migrate contact page cards to shared Card component"
```

---

### Task 6: Migrate `branches.astro` / `en/branches.astro` to `Card`

**Files:**
- Modify: `src/pages/branches.astro:21-46,74-78`
- Modify: `src/pages/en/branches.astro:21-46,74-78`

**Interfaces:**
- Consumes: `Card` from Task 2 (`variant="base"`, no `href`).

- [ ] **Step 1: Import `Card` and swap the wrapping element**

Add to frontmatter: `import Card from '../components/Card.astro';` (`'../../components/Card.astro'` in the `en/` file).

Replace:
```astro
<div class="location-card">
  ...
</div>
```
with:
```astro
<Card variant="base" class="location-card">
  ...
</Card>
```
(inner content unchanged in both files).

- [ ] **Step 2: Delete the now-redundant structural CSS**

In both files, delete:
```css
  .location-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-5);
  }
```
Keep every other `.location-card*` rule (`h2`, `__address`, `__pending`, `__map`, `__province`) — those are content typography, not structural, and still apply via scope passthrough.

- [ ] **Step 3: Verify**

Run: `pnpm check` — expected `0 errors`.
Run: `pnpm build` — expected success.
Screenshot `/branches` and `/en/branches` at 1280×900 and 375×800; confirm the card still renders bordered with the same padding as before.

- [ ] **Step 4: Commit**

```bash
git add src/pages/branches.astro src/pages/en/branches.astro
git commit -m "Migrate branches page location card to shared Card component"
```

---

### Task 7: Migrate `about.astro` / `en/about.astro` cards to `Card`

**Files:**
- Modify: `src/pages/about.astro:42-53,75-83,100-117`
- Modify: `src/pages/en/about.astro:43-54,76-84,101-118`

**Interfaces:**
- Consumes: `Card` from Task 2 (`variant="base"`, no `href`).

Per the spec, the hero-featured `elevated` variant is **not** applied here in this pass — both `facility-exterior` and `facility-yard` photo slots are still `photo--pending` placeholders (confirmed via the built HTML), and the spec explicitly says to skip the elevated treatment on a pending placeholder rather than putting a deep shadow around a diagonal-stripe placeholder pattern.

- [ ] **Step 1: Import `Card` and swap the three `.std-card` divs plus the one `.branch-mini` div**

Add to frontmatter: `import Card from '../components/Card.astro';` (`'../../components/Card.astro'` in `en/about.astro`).

Replace each:
```astro
<div class="std-card reveal">
  <h3>...</h3>
  <p>...</p>
</div>
```
with:
```astro
<Card variant="base" class="std-card reveal">
  <h3>...</h3>
  <p>...</p>
</Card>
```
(three times, keeping each card's existing Thai/English text unchanged; the `reveal` class must stay for the existing scroll-reveal `IntersectionObserver` behavior in `BaseLayout.astro` to keep working — it targets `.reveal` by class name, unaffected by the element becoming a `Card`).

Replace:
```astro
<div class="branch-mini">
  <h3>{location.nameTh}</h3>
  ...
</div>
```
with:
```astro
<Card variant="base" class="branch-mini">
  <h3>{location.nameTh}</h3>
  ...
</Card>
```
(same for the English `location.nameEn` version).

- [ ] **Step 2: Delete the now-redundant structural CSS**

In both files, delete:
```css
  .std-card,
  .branch-mini {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-4);
  }
```
Keep `.std-card h3, .branch-mini h3`, `.std-card p, .branch-mini p`, `.branch-mini a` — content typography, still applies via scope passthrough.

- [ ] **Step 3: Verify**

Run: `pnpm check` — expected `0 errors`.
Run: `pnpm build` — expected success.
Screenshot `/about` and `/en/about` at 1280×900; confirm the three factory-standards cards and the contact mini-card render bordered exactly as before, and that scroll-reveal still fires (Read the PNG — cards should be visible/opaque since by the time a static screenshot is taken post-load with JS having run, reveal should have completed; if unsure, also grep the built `dist/about/index.html` for `class="std-card reveal"` to confirm the class survived the build).

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/en/about.astro
git commit -m "Migrate about page standards/contact cards to shared Card component"
```

---

### Task 8: `.table-panel` on the specifications tables

**Files:**
- Modify: `src/pages/specifications.astro:22`
- Modify: `src/pages/en/specifications.astro:22` (same line number, mirrored file)

**Interfaces:**
- Consumes: `.table-panel` global class from Task 1.

Correction to the spec: `products.astro` / `en/products.astro` do **not** contain a `<table>` (they use a zig-zag product-detail layout with `Diagram` components) — only `specifications.astro` / `en/specifications.astro` have the comparison table. This task applies to those two files only.

- [ ] **Step 1: Add the class**

In both files, change:
```astro
<div class="table-scroll">
```
to:
```astro
<div class="table-scroll table-panel">
```

- [ ] **Step 2: Verify**

Run: `pnpm check` — expected `0 errors`.
Run: `pnpm build` — expected success.
Screenshot `/specifications` and `/en/specifications` at 1280×900; confirm the table now sits inside a rounded, bordered panel rather than a bare table.

- [ ] **Step 3: Commit**

```bash
git add src/pages/specifications.astro src/pages/en/specifications.astro
git commit -m "Frame the specifications table in a bordered table-panel"
```

---

### Task 9: Header nav breakpoint fix

**Files:**
- Modify: `src/components/Header.astro:142-153,198-222`

**Interfaces:** none (self-contained CSS-only change within one component).

- [ ] **Step 1: Restore a comfortable nav font size and remove the shrink-to-fit comment**

Change:
```css
  .main-nav__list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    /* Nav is now 14 items (Gallery added). Tighter gap plus a smaller
       font-size keeps all of them on one line at 1440px — see the earlier
       12-space-2 fix, which stopped being enough once a 14th item landed. */
    gap: var(--space-1) 0.5rem;
    margin: 0;
    padding: 0;
    font-size: 0.85rem;
  }
```
to:
```css
  .main-nav__list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-3);
    margin: 0;
    padding: 0;
    font-size: 0.95rem;
  }
```

- [ ] **Step 2: Raise the hamburger breakpoint**

Change:
```css
  @media (max-width: 900px) {
```
to:
```css
  @media (max-width: 1200px) {
```
(this is the single media query controlling `.main-nav__toggle` display and `.main-nav__list` collapse — both stay inside the same block, only the width changes).

- [ ] **Step 3: Verify**

Run: `pnpm check` — expected `0 errors`.
Run: `pnpm build` — expected success.
Screenshot the homepage at four widths: 1024×900, 1150×900, 1200×900, 1280×900. Read all four PNGs:
- At 1024, 1150, 1200: hamburger button should show, full nav list hidden.
- At 1280 and above: full nav should show on one line at the new 0.95rem size, not wrapping to two lines.
If 14 items wrap at 1280 (a real risk — verify against the actual rendered header), reduce `gap` back toward `var(--space-1) 0.5rem` before increasing the breakpoint further, and re-screenshot; do not silently reintroduce a sub-0.85rem font as the fix.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro
git commit -m "Fix header nav to collapse to hamburger before crowding, not shrink font"
```

---

### Task 10: Full-site verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full type-check and build**

Run: `pnpm check`
Expected: `0 errors`, `0 warnings` related to any file touched in Tasks 1-9.

Run: `pnpm build`
Expected: build succeeds for every route (TH and EN, all ~15 pages).

- [ ] **Step 2: Full screenshot sweep**

Using the documented workflow, screenshot each of these routes at 375×800 (mobile), 768×1024 (tablet), and 1440×900 (desktop): `/`, `/about`, `/en/about`, `/branches`, `/en/branches`, `/contact`, `/en/contact`, `/specifications`, `/en/specifications`. Read every PNG. Confirm:
- No emoji glyphs remain anywhere in the sticky contact bar or contact page.
- No layout regressions (no overlapping text, no broken card borders, no header wrapping to two lines at desktop width).
- Cards migrated in Tasks 5-7 look visually equivalent to their pre-migration appearance (bordered, same padding), just with the new 8px radius and (for interactive cards) a hover-capable shadow.
- The specifications table sits inside the new rounded panel.

- [ ] **Step 3: Re-run the Task 3 contrast script**

Re-run the exact contrast-check script from Task 3, Step 2, to confirm no later edit accidentally altered the badge tone values in `Badge.astro`. Expected: `ALL PASS`.

- [ ] **Step 4: Clean up screenshot artifacts**

Remove any throwaway screenshot files created during this verification pass that aren't meant to be committed (check `git status` — the pre-existing `screenshots/` directory contents from before this plan started are untracked and unrelated; do not delete those, only remove new ad-hoc files this task's screenshotting created outside that directory, if any).

- [ ] **Step 5: Final commit (if Step 4 removed anything, or if no changes remain uncommitted, skip this step)**

```bash
git status --short
```
If clean, this task ends here. If any stray file remains from verification, remove it and confirm `git status --short` is clean before considering the plan complete.
