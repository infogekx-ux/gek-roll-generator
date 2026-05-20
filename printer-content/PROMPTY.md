# Prompty — gotowe do kopiowania

Każdy prompt jest sparowany ze zdjęciem z [`SHOT-LIST.md`](./SHOT-LIST.md).
Workflow: bierzesz `r1-XX.jpg` + odpowiedni prompt + model → klip 4-6s.

## Złota zasada promptu pod image-to-video

```
[ruch kamery] + [co się dzieje w kadrze] + [oświetlenie / atmosfera] + [styl]
```

**NIGDY nie wymieniaj „Prestige R1" ani „GEK-X" w prompcie** — model nie zna marki.
Identyfikację daje zdjęcie. W prompcie piszesz CO MA ZROBIĆ KAMERA i CO MA SIĘ ZMIENIAĆ.

---

## Domyślny model: Seedance 2.0 (`seedance_2_0`)

**Dlaczego:** image-to-video z preservation identity (model trzyma się referencji),
4-15s, do 1080p, akceptuje `start_image` + opcjonalnie `end_image`.

**Parametry domyślne:**
- `resolution`: `720p` (test) → `1080p` (final)
- `mode`: `std`
- `genre`: `auto` (lub `drama` dla cinematic; `epic` dla hero shotów)
- `aspect_ratio`: `9:16` (rolka)
- `duration`: `5`

---

## Prompty per ujęcie

### `r1-01.jpg` → hero open
**Prompt:**
```
Slow cinematic dolly-in from 2 meters to 0.5 meters toward an industrial DTF printer on a dark background. Soft rim light from the right. Subtle dust particles drifting in the beam. Camera glides smoothly, no shake. Realistic, hyper-detailed, cinematic depth of field.
```
**Genre:** `drama` · **Duration:** 5s

### `r1-02.jpg` → reveal wnętrza
**Prompt:**
```
Top-down camera tilts down 30 degrees to reveal the inside of an open industrial printer. Internal LED light glows soft blue. Mechanical rails are sharply in focus, the background falls into bokeh. Smooth gimbal-like motion. Photorealistic.
```
**Genre:** `drama` · **Duration:** 5s

### `r1-03.jpg` → top-down dolly
**Prompt:**
```
Overhead drone-style camera slowly pushes down toward a printer seen from directly above. The machine sits in a clean studio. Light catches the metal edges. Realistic, sharp focus, no warping of mechanical parts.
```
**Genre:** `auto` · **Duration:** 4s

### `r1-04.jpg` → głowica makro (TO JEST KLUCZOWY KLIP)
**Prompt:**
```
Extreme close-up macro of a printer print head. Camera slowly pans 5cm to the right along the row of nozzles, holding the nozzle line in razor-sharp focus. Tiny reflections on metal. Subtle ink residue. No motion of the head itself. Hyper-realistic macro photography style.
```
**Genre:** `auto` · **Duration:** 5s

**WAŻNE:** jeśli w pierwszej generacji głowica się DEFORMUJE — zmień `mode` na `std`,
zmniejsz `duration` do 3s, NIE używaj `epic` genre. Mniej ruchu kamery = mniej halucynacji.

### `r1-05.jpg` → głowica profil
**Prompt:**
```
Macro close-up of a printer print head seen from the side. Camera holds still while the print head slowly slides 3cm to the left along its rail. Mechanical wires and cables visible in the background, slightly out of focus. Cool industrial lighting.
```
**Duration:** 4s

### `r1-06.jpg` → motion działającej głowicy
**Prompt:**
```
Macro shot of a printer print head in motion, moving rapidly back and forth along a metal rail. Camera holds steady. Light motion blur on the head. Sharp focus on the rail and surroundings. Industrial workshop atmosphere.
```
**Duration:** 4s

### `r1-07.jpg` → kropla tuszu ⭐ viral shot
**Prompt:**
```
Extreme macro slow-motion of a single black ink droplet falling and impacting a white surface. The droplet stretches, splashes, then settles. 240fps slow-motion feel. Crystal sharp focus on the droplet. Black void background. Hyper-realistic, food-photography style lighting.
```
**Genre:** `drama` · **Duration:** 4s · **resolution:** 1080p (warto)

### `r1-08.jpg` → butelka tuszu
**Prompt:**
```
Slow turntable rotation of an ink bottle on a black reflective surface. Camera holds steady, the bottle rotates 30 degrees. Soft side light creates a long highlight on the bottle's curve. Photo-realistic product commercial style.
```
**Duration:** 4s

### `r1-09.jpg` → przelewany tusz
**Prompt:**
```
Cinematic macro slow-motion of black liquid pouring from a bottle into a cartridge. The liquid stream is smooth, glossy, no splashing. Camera holds at eye-level with the stream. Soft rim light catches the surface tension. Crystal sharp.
```
**Genre:** `drama` · **Duration:** 5s · **resolution:** 1080p

### `r1-10.jpg` → folia DTF
**Prompt:**
```
Slow camera glide across a printed DTF transfer film, revealing vivid colors and crisp detail. Camera moves left-to-right at 3cm per second, 10cm above the surface. Sharp focus on the print, soft light from above. Product showcase aesthetic.
```
**Duration:** 5s

### `r1-11.jpg` → prasa / transfer
**Prompt:**
```
Steam rising slowly from a heat press while a printed transfer is applied to a t-shirt. Camera holds at a low angle. The steam catches a soft warm backlight. No people in frame. Cinematic industrial atmosphere.
```
**Genre:** `drama` · **Duration:** 5s

### `r1-12.jpg` → final hero
**Prompt:**
```
Slow push-in macro across a vibrant printed pattern on textile. Threads visible. Camera moves 2cm forward. Crisp light, color-rich. Final product showcase shot, satisfying reveal.
```
**Genre:** `epic` · **Duration:** 4s

---

## Składanie rolki (z 12 klipów → 1 rolka 15s)

Wybierz 5–6 ujęć z 12. Sugerowana kolejność dla viral'owej rolki TikTok:

```
1. r1-07 (kropla — HOOK, 0-2s)        — łapie uwagę
2. r1-01 (hero drukarka — 2-4s)        — kontekst
3. r1-04 (głowica makro — 4-7s)        — wow effect
4. r1-09 (przelewany tusz — 7-10s)     — satysfakcja
5. r1-10 (folia DTF — 10-12s)          — to co wychodzi
6. r1-11 (prasa + koszulka — 12-15s)   — payoff
```

Składa się to skryptem [`compose.sh`](./compose.sh) albo w CapCut.

---

## Marketing Studio Video (alternatywa: pełen ad z hookiem)

Gdy chcesz pominąć composing i dostać gotowy ad-clip z hookiem na początku
i CTA na końcu — użyj `marketing_studio_video`.

Najpierw rejestrujesz drukarkę jako „product":
1. W Higgsfield UI: Marketing Studio → Create Product → wrzucasz `r1-01.jpg` + nazwę „Prestige R1 DTF Printer"
2. Wybierasz preset (`UGC`, `Product Review`, `Tutorial`, `Unboxing`)
3. Wybierasz hook (np. „I bought a $X printer and you won't believe what's inside")
4. Generujesz klip ~8s

To jest najbliżej „prompt → gotowy reel" jakie istnieje. Kompromis: mniej kontroli
nad konkretnymi ujęciami, ale gotowy storytelling.
