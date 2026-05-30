# LANDING DEMO — przepis techniczny (jak to zrobiłem, czego użyłem)
**Autor:** Kodzior 🤖🔫 · **Data:** 2026-05-30 (poranek, kontynuacja)
**Po co:** Dawid chce wykorzystać te efekty (głównie scroll-driven na 16 kartach). Tu masz CO, GDZIE, JAK.

---

## 📂 GDZIE TO JEST
Branch `claude/misja5-bg-vectorizer`, folder **`projekty/landing-demo/`**:
- **`index.html`** — demo v2, ciemny CMYK. Scrollytelling: grafika morphuje na scroll (foto→tło znika→wektor→rolka), bento, nić.
- **`dtfrollstudio.html`** — reskin NASZEGO dtfrollstudio.com w prawdziwym brandzie (biel + `#FF2A2A` + Montserrat), pipeline na scroll: raw PNG→auto-trim→auto-nest→rolka PNG/TIFF, cursor-follow glow.
- `d-*.png`, `shot-*.png`, `*-frames.png` — zrzuty (dowody / contact sheety).

Te pliki są **w gicie** (śledzone) ORAZ na hubie: `gek-x-hub/projekty/landing-demo/`.

---

## 🧱 STACK (czego użyłem)
- **Czysty 1 plik: HTML + CSS + vanilla JS.** Zero frameworka, zero build-stepu, zero npm na wyjściu. Otwiera się offline dwuklikiem.
- **Fonty:** Google Fonts — `Montserrat` (brand) / `Inter` (ciemne demo).
- **Ikony:** Tabler Icons webfont z CDN (`@tabler/icons-webfont`), `<i class="ti ti-...">`.
- **Kolory/brand:** wyciągnięte z żywej strony — `dtfrollstudio.com/css/*.css` (zmienne `--accent:#FF2A2A`, `--bg`, Apple-greye) + teksty z `js/i18n.js`.
- **Zrzuty:** Puppeteer (headless Chromium) + `sharp` do sklejania.

---

## 🎬 JAK DZIAŁA KAŻDY EFEKT

### 1) Scroll-driven transformation ← TEN, KTÓRY CHCESZ NA 16 KARTACH
Sekcja wysoka na np. `height:360vh`, w środku przypięty kontener:
```css
.pipeline{position:relative;height:360vh}
.pl-sticky{position:sticky;top:0;height:100vh}
```
Wszystkie „klatki" leżą na sobie absolutnie (`.pl-layer{position:absolute;inset:0}`).
W jednym handlerze scrolla (rAF-throttled) liczę postęp i cross-fade'uję warstwy:
```js
const r = pipe.getBoundingClientRect();
const p = clamp((-r.top)/(pipe.offsetHeight - innerHeight), 0, 1); // 0→1
const N = 4, fp = p*(N-1);            // pozycja "płynna" między klatkami
layers.forEach((l,i)=>{
  const op = clamp(1 - Math.abs(fp-i), 0, 1);   // bliżej klatki = bardziej widoczna
  l.style.opacity   = op;
  l.style.transform = `scale(${0.95+0.05*op}) translateY(${(i-fp)*16}px)`;
});
const active = Math.round(fp);          // która klatka „aktywna"
caps.forEach((c,i)=>c.classList.toggle('on', i===active));   // podpis
dots.forEach((d,i)=>d.classList.toggle('on', i<=active));    // kropki postępu
```
**Na 16 kartach:** to samo — 16 warstw (albo grupy po kilka), `N=16`, każda karta to jedna „klatka", która wjeżdża/odsłania się gdy `fp` ją mija. Podpis + numer lecą z `active`.

### 2) Cursor-follow glow (cień goniący myszkę) — wydajny
Pre-renderowany radialny gradient w `<div>`, ruszany TYLKO przez `transform` (GPU, zero repaintu):
```css
#glow{position:fixed;width:680px;height:680px;margin:-340px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,42,42,.10),transparent 62%);
  pointer-events:none;will-change:transform;transition:transform .14s ease-out}
```
```js
addEventListener('pointermove',e=>{ gx=e.clientX; gy=e.clientY;
  if(!gt){gt=true; requestAnimationFrame(()=>{ glow.style.transform=`translate(${gx}px,${gy}px)`; gt=false; });}
},{passive:true});
```

### 3) Scroll-reveal (sekcje wjeżdżają)
`IntersectionObserver` dodaje klasę `.in` → CSS animuje `opacity`/`translateY`, stagger przez `transition-delay`.

### 4) Count-up liczb
`IntersectionObserver` odpala pętlę `requestAnimationFrame` z easingiem `1-(1-p)^3`.

### 5) Magnetyczne przyciski
`pointermove` na buttonie → `transform: translate()` w stronę kursora; `pointerleave` resetuje.

### 6) Marquee (przewijające się napisy)
Zduplikowany track + `@keyframes { to{ transform:translateX(-50%) } }` + maska gradientem na brzegach.

### 7) Bento „obraz w obraz"
CSS grid ze spanami; na hover cross-fade dwóch nałożonych warstw `.art.base`/`.art.hov` (np. foto→szachownica).

---

## ⚡ WYDAJNOŚĆ (czego pilnować — Dawid zgłaszał lag w v1)
- **Jeden** handler scrolla, **rAF-throttled** (flaga `ticking`), wszystkie odczyty w jednym miejscu.
- Animować TYLKO `transform` i `opacity` (nie `top/left/width`, nie ciężkie `filter:blur` na dużych ruchomych elementach).
- Glow = transform, nie przemalowywanie gradientu co klatkę.
- `will-change` oszczędnie. `@media (prefers-reduced-motion:reduce)` = wyłącznik wszystkiego.

---

## 📸 JAK ROBIŁEM ZRZUTY (do powtórzenia lokalnie)
```bash
npm i puppeteer          # ściąga Chromium
```
```js
const p = await browser.newPage();
await p.setViewport({width:1440,height:900,deviceScaleFactor:2});
await p.goto('file:///.../dtfrollstudio.html',{waitUntil:'networkidle0'});
// dla scroll-driven: scrollTo(0, sectionTop + progress*(sectionH-vh)) i screenshot na każdym etapie
await p.screenshot({path:'shot.png'});
```
Contact sheety sklejałem `sharp` (compose).

---

## ▶️ JAK URUCHOMIĆ
Otwórz plik `.html` w przeglądarce (dwuklik, działa offline). Najlepszy efekt na desktopie:
rusz myszką (glow) i **powoli** przewiń sekcję ze scroll-driven.

## 🎯 NASTĘPNY KROK (ustalony z Dawidem)
**16 kart funkcji = scroll-driven** (przechodzą jedna w drugą jak pipeline). Reszta brandu/treści zostaje nasza.
