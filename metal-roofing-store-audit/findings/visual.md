# Visual + Mobile Audit — metal-roofing-store.vercel.app

Date: 2026-08-31
Method: Cached Chromium (headless) via CDP. Desktop 1440x900 (DSF 1), Mobile 390x844 (DSF 3, iPhone UA, touch).
Pages captured: **homepage only** — coordinator halted capture before /products, /contact, /configurator.

## Screenshots
- `screenshots/home-desktop.png` — desktop above-the-fold
- `screenshots/home-desktop-full.png` — desktop full page
- `screenshots/home-mobile.png` — mobile above-the-fold
- `screenshots/home-mobile-full.png` — mobile full page
- `screenshots/home-desktop.json`, `screenshots/home-mobile.json` — raw DOM metrics

---

## Summary scores
- Above-the-fold clarity: Desktop 8/10 · Mobile 4/10
- Mobile responsiveness: 6/10
- Tap-target sizing: 5/10
- Colour contrast (WCAG AA): 6/10 (manual — automated oklch parsing unreliable)
- Layout stability: 10/10 (CLS 0.0015 desktop, 0 mobile; no horizontal overflow at either width)
- **Overall: 68 / 100**

---

## HIGH severity

### H1. Mobile header: wordmark collides with / runs under the hamburger button
`home-mobile.png` (top). "หจก.มีชัยสตีล" wordmark is not truncated and overlaps the hamburger toggle (~x390-420). Header looks broken on first paint — strong polish/credibility hit, raises bounce on the most common device class.
Fix: shrink or hide the text wordmark < 480px (keep logo mark only), or `flex` with `min-width:0; overflow:hidden; text-overflow:ellipsis` and guarantee ≥12px gap before the toggle.

### H2. Mobile above-the-fold does not answer "what is sold / how to contact"
`home-mobile.png`. DOM order puts the ~570px hero **image panel first**; the H1 ("แผ่นหลังคาเหล็กจากโรงงาน…"), sub-copy, product chips and the primary CTA ("ขอใบเสนอราคาโครงการ") all render below the fold. First screen = cramped header + a dusk photo with only "MATERIAL / ON SITE" and "ออกแบบ 3D". A first-time buyer scrolls before learning the business.
Fix: on mobile, reorder so eyebrow + H1 + one-line value prop + primary CTA sit above the image; move the image below or reduce its height to ~240px.

### H3. "CLIENT WORK" (section 06) project images do not render
`home-desktop-full.png` (section 06) shows 3 empty navy tiles; `home-desktop.json` → 3 `<img>` (`1013322459072462.webp`, `1116543733807710.webp`, `1005493303188711.webp`) + a duplicate footer `logo.webp` report `naturalWidth 0`. No 4xx was logged, so likely lazy-load/IntersectionObserver not firing OR wrong asset path. Either way the social-proof section renders as blank boxes — directly undermines "ผลงานติดตั้งจริงจากหน้างาน".
Fix: verify the webp files exist at the referenced path in `public/`; add width/height; consider `loading="eager"` for the first row; test the built `dist/` render, not just dev.

### H4. Mobile sticky contact bar overlaps page content / the hero CTA
`home-mobile.png` (bottom): fixed bottom bar (โทร | LINE, 390x58, z-200) sits on top of the amber "ขอใบเสนอราคาโครงการ" button — the CTA is partially occluded on the first screen. Body has no bottom padding reserved for the bar, so it will also cover the footer's last row and any bottom-anchored content.
Fix: add `padding-bottom: <bar height + safe-area>` to the scroll container / `main`; ensure `env(safe-area-inset-bottom)` handling on iOS.

---

## MEDIUM severity

### M1. Contrast — amber text/links on white likely fail AA (normal text)
`home-desktop-full.png` section 05 "MORE MATERIALS": link headings "ฉนวนกันความร้อน", "สีและเฉดวัสดุ", "สเปกสินค้า" render in the brand amber (~oklch 0.76 0.145 74) on white at ~14–15px. Amber-on-white is typically ~2.3–2.8:1 — below the 4.5:1 requirement. Same amber used for "ออกแบบ 3D" (14px) on the hero photo.
Fix: use amber only for ≥24px or bold ≥18.66px; for body-size links use a dark ink colour and reserve amber for the underline/hover, or darken the amber to ~oklch 0.55 for text use.

### M2. Contrast — hero image overlay text has no scrim
`home-desktop.png` / `home-mobile.png`: "MATERIAL / ON SITE", "ตัดความยาวตามหน้างาน", "ออกแบบ 3D" are set directly on the dusk photo with no gradient/overlay. Currently legible only because this specific photo is dark; the lower-left label sits over the lit-house area and is already borderline. Fragile if the image is ever swapped.
Fix: add a bottom/top linear-gradient scrim (e.g. `rgba(0,0,0,.55)` → transparent) behind the overlay text, or a text-shadow.

### M3. Contrast — section 02 navy band body copy
`home-desktop-full.png` section 02: right-hand paragraph ("เลือกหลังคาให้เหมาะกับ…") is mid-grey on dark navy — likely under 4.5:1 for normal text. Headline (white) is fine.
Fix: lift the body text to ~oklch 0.82+ on the navy background.

### M4. Tap targets below 44px (mobile), several clustered
`home-mobile.json`: hamburger `เปิดเมนู` 32x40; `TH` and `EN` language links 18x24 each and horizontally adjacent (mis-tap risk); hero "ออกแบบ 3D" link 105x28. 19 sub-44px interactive elements total on mobile.
Fix: pad hamburger to ≥44x44; make TH/EN a single 44px-tall segmented control with ≥8px separation; give the "ออกแบบ 3D" link a ≥44px hit area.

### M5. Header "แชท LINE" button bleeds to the mobile viewport edge
`home-mobile.png`: the amber header CTA extends to x≈390 with no right gutter, visually touching the screen edge and crowding the language toggle.
Fix: add ≥16px right padding/gutter; consider icon-only LINE button < 400px.

### M6. Desktop has no persistent phone/contact affordance
Desktop header exposes only "แชท LINE". `tel:` links appear only in the section-07 CTA band and the footer (`home-desktop.json`). Phone-preferring buyers must scroll ~4800px.
Fix: add a visible phone number (or a compact call button) to the desktop header.

---

## LOW severity

### L1. Small Thai/label text at 12–12.5px
`home-*.json` tinyText: section kickers ("01 / WHAT WE SUPPLY" …), the Thai eyebrow "[ ผู้ผลิตและจำหน่ายเมทัลชีท มาตรฐานโรงงาน ]", and spec-card labels ("ลอนมาตรฐาน", "Snap-Lock", "หลังคาโค้ง") are 12–12.48px. Latin kickers are decorative and acceptable; 12px Thai is small for older trade buyers.
Fix: bump Thai body-ish labels to ≥13–14px.

### L2. Hero image aspect distortion / minor container clip on mobile
Hero `hero-metal-roof.webp` natural 691x460 (1.5:1) displayed 562x500 (~1.1:1) — relying on object-fit crop. On mobile the photo's right edge appears flush with / slightly past the card's rounded corner while the left corner is rounded.
Fix: confirm `object-fit:cover` + `overflow:hidden` on the frame; check the right-edge radius.

### L3. Images without intrinsic dimensions
`home-desktop.json`: 3 `<img>` lack width/height/aspect-ratio. CLS is currently negligible, but set dimensions to keep it that way on slow 3G.

### L4. Decorative logo `alt=""` is also a home link
Acceptable only if the wrapping `<a>` has an aria-label; verify.

---

## Verified OK / positives
- **Hero gradient wash-out is FIXED.** Hero panel now sits on a solid light cream background (`home-desktop.png`); H1 is near-black Thai on cream — high contrast, fully legible. No animated gradient bleeding into the text panel at 1440 or 390.
- No horizontal scroll at 1440 or 390; no elements wider than viewport.
- CLS effectively zero (0.0015 desktop / 0 mobile).
- Sticky header 69px, z-200, no overlap with content on scroll.
- Mobile sticky contact bar exists and gives one-tap โทร / LINE (conversion-positive) — aside from the overlap in H4.
- Thai body text: IBM Plex Sans Thai, 16px / 28px line-height — loads (`document.fonts` = loaded), renders crisply, good line spacing.
- Single H1, descriptive; `<html lang="th">`; document title is keyword-rich (โรงงานผลิตแผ่นหลังคาเหล็ก… ส่งไทย–ลาว).
- Desktop above-the-fold: H1 + value prop + two CTAs + product chips (หลังคาเมทัลชีท · ผนัง · ฉนวน · อุปกรณ์) + hero photo all visible — a buyer instantly understands the offer.
- Primary CTA "ขอใบเสนอราคาโครงการ": amber fill with dark text = strong contrast, clearly the primary action.
- No broken network requests / 4xx logged.

## Coverage gaps (not tested — capture halted)
- /products, /contact, /configurator: no screenshots or metrics.
- Mobile mega-menu / nav drawer **open** state (accordion submenu behaviour, focus trap, close affordance) not exercised.
- Desktop dropdown/mega-menu open state not exercised.
- Contrast ratios are manual estimates from screenshots — `getComputedStyle` returns `oklch()` which the scripted parser could not resolve to sRGB. Re-run with an oklch→sRGB conversion for exact numbers.
