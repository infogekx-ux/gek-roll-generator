// ============================================================
// MISJA 5 — bento layout generator
// Defines 16 cards once, emits two HTML compositions:
//   P = Pączek's tiered pyramid (big top → small bottom)
//   K = Kodzior's woven mosaic (Apple/Linear-style asymmetry, F-pattern hero)
// Both load live CSS + bento.css. Variant differs only in DOM order + size class.
// ============================================================
'use strict';
const fs = require('fs');

// --- 16 features: id, name, demoHTML, badge ('core'|'new'|null), desc ---
const F = {
  trim:   { name: 'Auto-trim', demo: '<div class="trim-wrap"><div class="trim-border"></div><div class="trim-box"></div></div>', badge: 'core', desc: 'Transparent + near-transparent white pixels gone in &lt;1 sec.' },
  nest:   { name: 'Auto-nesting', demo: '<div class="nest-wrap"><div class="nest-a"></div><div class="nest-b"></div><div class="nest-c"></div></div>', badge: 'core', desc: 'Maximal rectangles + 5-strategy bin packing. Optimal layout in seconds.' },
  web:    { name: 'Web-based', demo: '<div class="device"><div class="device-bar"><div class="device-dot"></div><div class="device-dot"></div><div class="device-dot"></div></div><div class="device-body"><div class="device-check">✓</div></div></div>', badge: null, desc: 'Chrome, Safari, Firefox. Zero install.' },
  dpi:    { name: 'DPI Guardian', demo: '<div class="dpi-row"><div class="dpi-item dpi-r"><div class="dpi-box"></div><div class="dpi-lbl">72</div></div><div class="dpi-item dpi-o"><div class="dpi-box"></div><div class="dpi-lbl">150</div></div><div class="dpi-item dpi-g"><div class="dpi-box"></div><div class="dpi-lbl">300</div></div></div>', badge: null, desc: 'Reads pHYs chunk. Red/orange/green warnings before you print.' },
  label:  { name: 'ID labels on every roll', demo: '<div class="label-wrap"><div class="label-strip label-top">START · #2847</div><div class="label-item"></div><div class="label-strip label-bot">END · #2847</div></div>', badge: null, desc: 'START + END strips with order ID, date, your logo.' },
  export: { name: 'PNG + TIFF export', demo: '<div class="export-wrap"><div class="export-file export-png"><span>PNG</span></div><div class="export-file export-tiff"><span>TIFF</span></div></div>', badge: null, desc: '300 DPI client-side. NeoStampa, FlexiRIP, VersaWorks.' },
  send:   { name: 'Send to printer', demo: '<div class="send-wrap"><div class="send-item"></div><div class="send-plane">✉</div></div>', badge: null, desc: 'One click → email to your print partner.' },
  cost:   { name: 'Cost calculator', demo: '<div class="bar-wrap"><div class="bar-col"><div class="bar bar-sell"></div><div class="bar-lbl">SELL</div></div><div class="bar-col"><div class="bar bar-cost"></div><div class="bar-lbl">COST</div></div><div class="bar-col"><div class="bar bar-profit"></div><div class="bar-lbl">PROFIT</div></div></div>', badge: null, desc: 'Sell, cost, profit per meter — margins before you ship.' },
  resize: { name: 'Bulk resize', demo: '<div class="resize-wrap"><div class="resize-box resize-a"></div><div class="resize-box resize-b"></div><div class="resize-box resize-c"></div></div>', badge: null, desc: 'Set all widths/heights at once. Proportions preserved.' },
  split:  { name: 'Auto-split long rolls', demo: '<div class="cut-wrap"><div class="cut-top"><div class="cut-lbl cut-lbl-1">1/2</div></div><div class="cut-bot"><div class="cut-lbl cut-lbl-2">2/2</div></div></div>', badge: null, desc: 'Roll over 5m? Auto-split into labeled segments.' },
  lang:   { name: 'Multi-language', demo: '<div class="lang-wrap"><div class="lang-item lang-es">ES</div><div class="lang-item lang-de">DE</div><div class="lang-item lang-en">EN</div><div class="lang-item lang-nl">NL</div><div class="lang-item lang-pl">PL</div></div>', badge: null, desc: 'PL · NL · EN · ES · DE. Switch anytime.' },
  brand:  { name: 'Your branding', demo: '<div class="brand-tag"><div class="brand-icon"></div><div class="brand-name">YOUR CO.</div></div>', badge: null, desc: 'Your logo on every roll label. Your tool.' },
  demo:   { name: 'Free demo, no signup', demo: '<div class="lock-wrap"><div class="lock-hook"></div><div class="lock-body"><div class="lock-hole"></div></div><div class="lock-free">FREE</div></div>', badge: null, desc: 'Try the engine right now. No signup.' },
  price:  { name: '€29.99 flat', demo: '<div class="price-wrap"><div class="price-old">hidden fees</div><div class="price-new">€29.99</div><div class="price-sub">/ month · flat</div></div>', badge: null, desc: 'One price. Everything included. Cancel anytime.' },
  ai:     { name: 'Built-in AI support', demo: '<div class="chat-wrap"><div class="chat-bubble"><div class="chat-dot"></div><div class="chat-dot"></div><div class="chat-dot"></div></div><div class="chat-label">AI typing...</div></div>', badge: null, desc: 'Ask our AI assistant directly in the app.' },
  optima: { name: 'Smart roll optimizer', demo: '<div class="optima-demo"><div class="optima-bar-group"><div class="optima-bar"><div class="optima-fill" style="height:62%;transform:scaleY(1)"></div></div><div class="optima-bar-label">80%</div></div><div class="optima-arrow"><i class="ti ti-arrow-right"></i></div><div class="optima-bar-group"><div class="optima-bar"><div class="optima-fill optima-fill-green" style="height:82%;transform:scaleY(1)"></div></div><div class="optima-bar-label optima-label-green">94%</div></div><div class="optima-saved">-14%<br>waste</div></div>', badge: 'new', desc: 'AI finds micro-adjustments across all designs — 2-10% less waste per roll, automatically.' },
};

function card(id, size) {
  const f = F[id];
  const badge = f.badge === 'core'
    ? '<div class="feature-tag">CORE</div>'
    : f.badge === 'new'
      ? '<div class="feature-tag feature-tag-new">NEW</div>'
      : '';
  // feature-card-optima activates the optima-demo styles from features.css
  // (bars width/height, flex-row layout). bento-optima adds bento-specific tweaks.
  const optimaCls = id === 'optima' ? ' bento-optima feature-card-optima' : '';
  // pre-reveal = starting state for the staggered scroll reveal (opacity/transform
  // only, no shadow — DNA). JS removes it on intersect; <noscript> unhides it.
  return `      <div class="bento-card bento-${size}${optimaCls} pre-reveal">
        <div class="bento-demo">${f.demo}</div>
        <div class="bento-body">
          ${badge}
          <h3>${f.name}</h3>
          <p>${f.desc}</p>
        </div>
      </div>`;
}

function page(title, cardsHTML) {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DRS Bento — ${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.6.0/dist/tabler-icons.min.css">
<link rel="stylesheet" href="live/common.css">
<link rel="stylesheet" href="live/landing.css">
<link rel="stylesheet" href="live/features.css">
<link rel="stylesheet" href="live/app.css">
<link rel="stylesheet" href="bento.css">
<style>.preview-label{position:fixed;top:8px;right:8px;background:#000;color:#fff;font-family:Montserrat,sans-serif;font-weight:800;font-size:11px;padding:6px 10px;border-radius:6px;z-index:9999;letter-spacing:.06em;text-transform:uppercase}</style>
<noscript><style>.bento-card.pre-reveal{opacity:1!important;transform:none!important}</style></noscript>
</head><body>
<div class="preview-label">${title}</div>
<section class="section" id="features"><div class="container">
  <div class="section-eyebrow fade-in">Built for printers</div>
  <h2 class="section-title fade-in">16 things you will use every day.</h2>
  <p class="section-sub fade-in">No bloat. No tutorial. Just the tools you need to ship rolls faster.</p>
  <div class="bento-grid">
${cardsHTML}
  </div>
</div></section>
<script>
// Staggered scroll reveal — transform + opacity ONLY (DNA: dramat ruchem, nie cieniem).
// Stagger comes from delayed class removal, so it never lags the hover transition.
(function () {
  var grid = document.querySelector('.bento-grid');
  if (!grid) return;
  var cards = [].slice.call(grid.querySelectorAll('.bento-card'));
  if (!('IntersectionObserver' in window)) {
    cards.forEach(function (c) { c.classList.remove('pre-reveal'); });
    return;
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(function (c) { c.classList.remove('pre-reveal'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = cards.indexOf(e.target);
      setTimeout(function () { e.target.classList.remove('pre-reveal'); }, Math.min(i, 12) * 45);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  cards.forEach(function (c) { io.observe(c); });
})();
</script>
</body></html>`;
}

// --- Wariant P: Pączek tiered pyramid ---
// Tier 1 (hero 2x2): nest, optima. Tier 2 (wide 2x1): trim, dpi, export, send.
// Tier 3 (small 1x1): web, cost, resize, split, lang, brand, demo, ai, label, price.
const P = [
  ['nest','hero'], ['optima','hero'],
  ['trim','wide'], ['dpi','wide'], ['export','wide'], ['send','wide'],
  ['web','small'], ['cost','small'], ['resize','small'], ['split','small'],
  ['lang','small'], ['brand','small'], ['demo','small'], ['ai','small'],
  ['label','small'], ['price','small'],
];

// --- Wariant K: Kodzior woven mosaic ---
// Optima 2x2 hero TOP-LEFT (F-pattern prime). Nesting 2x1 wide top-right.
// Small cards woven AROUND heroes, not stacked below. Asymmetric rhythm.
//
// GRID MATH (polish, Dawid wybrał K): 4-col desktop. Cells = sum of spans.
//   hero=4 + wide(2)×5 + small(1)×10 = 24 = exactly 6 full rows, ZERO holes.
//   (was 3 wide + 12 small = 22 → left a 2-cell hole bottom-right.)
//   Pączek OK'd promoting 1-2 small→wide to close the grid. Promoted: cost, demo.
//   Wide spine runs down the left under the hero (F-pattern), smalls woven right.
// DOM order tuned so grid-auto-flow:dense tiles big+small with no gaps.
const K = [
  ['optima','hero'],                       // r1-2 c1-2 — top-left hero, green przełamanie
  ['nest','wide'],                         // r1 c3-4 — core engine next to optima
  ['web','small'], ['dpi','small'],        // r2 c3, c4 — fill beside hero
  ['cost','wide'],                         // r3 c1-2 — promoted: bar chart reads well wide
  ['export','small'], ['resize','small'],  // r3 c3, c4
  ['trim','wide'],                         // r4 c1-2 — core
  ['split','small'], ['label','small'],    // r4 c3, c4
  ['send','wide'],                         // r5 c1-2 — wide accent
  ['lang','small'], ['brand','small'],     // r5 c3, c4
  ['demo','wide'],                         // r6 c1-2 — promoted: free-demo CTA anchor
  ['price','small'], ['ai','small'],       // r6 c3, c4
];

const pCards = P.map(([id, s]) => card(id, s)).join('\n');
const kCards = K.map(([id, s]) => card(id, s)).join('\n');

fs.writeFileSync(__dirname + '/bento-P.html', page('Wariant P — Pączek pyramid', pCards));
fs.writeFileSync(__dirname + '/bento-K.html', page('Wariant K — Kodzior mosaic', kCards));
console.log('Generated bento-P.html (' + P.length + ' cards), bento-K.html (' + K.length + ' cards)');
