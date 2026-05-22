# DTFlow — product landing page

Marketing site for **DTFlow**, the AI-powered DTF prep plugin for Adobe Illustrator.

Part of the **G|SAAS** product line, powered by **GEK-X**.

## Files

```
dtflow-site/
├── index.html         Full landing — navbar, hero, trust bar, problem/solution,
│                      7-feature showcase, 6-step "how it works" timeline,
│                      pricing card, FAQ accordion, pre-footer CTA, footer.
├── privacy.html       GDPR-compliant privacy policy.
├── terms.html         Terms of Service (Dutch law, EU consumer rules).
├── INSTALL-SITE.md    Netlify deploy instructions (CLI / drag-and-drop / API).
└── README.md          This file.
```

Three pages, zero build step, zero runtime dependencies, **white background only**.

## Design system

| Token | Value | Used for |
|---|---|---|
| Primary blue  | `#0A84FF` | CTAs, accents, brand `G|SAAS` |
| Accent red    | `#FF2A2A` | Highlights inherited from `G|PRINT` |
| Ink           | `#111827` | Body text on white |
| Muted         | `#6B7280` | Sub-copy |
| Tile bg       | `#F3F4F6` | Subtle section grounds |
| Type          | Montserrat 300–900 (Google Fonts) | Everywhere |
| Radius        | 14–22 px on cards, 999 px on buttons | |
| Shadow lg     | `0 24px 60px -20px rgba(17,24,39,0.18)` | Hero mockup, pricing card |

Brand names are wrapped in `<span translate="no" class="notranslate">…</span>` everywhere so Google Translate doesn't mangle `DTFlow`, `G|SAAS`, `G|PRINT`, or `GEK-X`.

## Editing copy

Open `index.html` and search for the section comment:

* `<!-- ================= HERO ================= -->`
* `<!-- ================= TRUST ================= -->`
* `<!-- ================= PROBLEM vs SOLUTION ================= -->`
* `<!-- ================= FEATURES ================= -->`  &nbsp;&larr; seven blocks marked `F1`…`F7`
* `<!-- ================= HOW IT WORKS ================= -->`  &nbsp;&larr; six `.step` blocks
* `<!-- ================= PRICING ================= -->`
* `<!-- ================= FAQ ================= -->`
* `<!-- ================= CTA ================= -->`
* `<!-- ================= FOOTER ================= -->`

Headline animation: change the strings near the bottom of the inline `<script>`:

```js
var prefix = 'DTF Prep on ';
var accent = 'Autopilot.';
```

Pricing: change `19.99` and `€/month` inside `.price-card`.

## Editing the Illustrator mockup

The hero mockup is built with `<div>` blocks under `.ai-window`. The right-hand panel uses `.ai-panel` with class names that mirror the real `dtf-prep/client` UI (`.pbtn.primary`, `.pbtn.blue`, etc.) &mdash; tweak labels there to mirror any panel-UI changes you make in the actual plugin.

## Animations (no GSAP needed, vanilla only)

1. **Hero headline** &mdash; types in letter-by-letter (`typeStep()`).
2. **Sticky navbar** &mdash; adds `.scrolled` (background blur + border) once `scrollY > 8`.
3. **Trust pills** &mdash; staggered fade-in (100 ms each) when the bar enters the viewport.
4. **Problem / Solution & Pricing card** &mdash; reveal on scroll via `IntersectionObserver`.
5. **Feature cards** &mdash; same observer, alternating left/right via `.feature.reverse`.
6. **How-it-works timeline** &mdash; `.steps-line .fill` height tracks scroll position; `.step` gets `.active` as you pass it (blue circle + shadow).
7. **FAQ accordion** &mdash; max-height transition, closes other items on open.
8. **CTA buttons** &mdash; subtle pulse animation every 5 s (`@keyframes pulse`).

## Responsive breakpoints

* `<= 480px` &mdash; hero buttons stack
* `<= 720px` &mdash; "how-it-works" step body collapses to single column
* `<= 768px` &mdash; section padding reduced, timeline circle shrinks
* `<= 860px` &mdash; mobile menu, problem/solution and footer collapse to single column
* `<= 980px` &mdash; hero & feature grids collapse to single column

Tested mentally at iPhone 13 (390 px), iPad (768 px), MacBook (1440 px). No horizontal scroll at any width.

## Deployment

See **INSTALL-SITE.md**. Short version:

```bash
cd dtflow-site
netlify deploy --prod --dir=.
```

or drag the folder onto <https://app.netlify.com/drop>.

## Legal contact

All copy points to `info@gek-x.nl`. Address, KvK, and BTW number are in the footer of every page.
