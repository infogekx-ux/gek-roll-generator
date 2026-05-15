# GEK-X.NL — Service Discovery Research

> Analiza UI/UX + research inspiracji dla landing page'a gek-x.nl.
> Skupienie: jak nowy użytkownik znajduje konkretną usługę, ile kroków zajmuje, co widzi na pierwszy rzut oka.
> **Zakres:** wyłącznie warstwa wizualna i nawigacja. Bez tematów technicznych.

---

## 1. Analiza obecnej strony — co naprawdę widzi użytkownik

### 1.1. Struktura strony (sekcje po kolei, od góry do dołu)

Strona to **pionowy snap-scroll z 12 sekcjami**, każda na pełny ekran:

| # | Sekcja | Co widzi user | Typ |
|---|--------|---------------|-----|
| 0 | **Hero / Orbit** | Animowane okręgi w 5 kolorach + napis "ARCHITECT van ERVARINGEN / WELCOME" | Pełnoekranowa animacja |
| 1 | Intro slide 1 | "Jij droomt. Wij bouwen het onmogelijke." | Tekst |
| 2 | Intro slide 2 | "Geen bureau. Geen wachttijd." | Tekst |
| 3 | Intro slide 3 | "Eén partner voor alles." | Tekst |
| 4 | Intro slide 4 | "Jij hebt een probleem. Wij bouwen de oplossing." | Tekst |
| 5 | Intro slide 5 | "Niet morgen. Nu." | Tekst |
| 6 | Intro slide 6 | "Vijf disciplines." | Tekst |
| 7 | **Mr. GEK** | AI chatbot promo z CTA | Promo |
| 8 | **G\|SAAS** carousel | 4 slajdy (Webapps, AI Agents, Mobile apps, Automation) | Karuzela |
| 9 | **G\|PRINT** carousel | 4 slajdy (Kleding, Roll Studio, 3D, Magneten) | Karuzela |
| 10 | **G\|SITE** carousel | 4 slajdy (Websites, Webshops, Portalen, SEO) | Karuzela |
| 11 | **G\|OPTIMA** carousel | 4 slajdy (Analiza, Werkplek, Automation, Rapportage) | Karuzela |
| 12 | **G\|CLIP** carousel | 4 slajdy (Rondleiding, Drone, Productie, Social) | Karuzela |
| 13 | About / Contact | Footer | Info |

### 1.2. Pierwsze 3 / 5 / 10 sekund — co widzi nowy user

**Sekunda 0–3 (po wejściu):**
- Czarne tło (OLED) z animacją pierścieni rysujących się od środka na zewnątrz
- Mały napis u dołu: "ARCHITECT van ERVARINGEN" / "WELCOME"
- Topbar z hamburgerem + brandem "GEK\|X™"
- W prawym górnym rogu pięć kolorowych kropek (bez podpisów)
- **User NIE WIE co firma robi.** Animacja sugeruje "design / kreatywne / tech", ale nie wskazuje na żaden konkret.

**Sekunda 3–5:**
- Animacja kończy się (po ~3.8s) — pojawia się duże "X" w środku pierścieni
- W napisie "ARCHITECT van ERVARINGEN" sugestia że firma "buduje doświadczenia" — abstrakcja
- Widoczna strzałka w dół ("hero-arrow")
- **User nadal nie wie co firma robi.** Tagline jest poetycki, nie informacyjny.

**Sekunda 5–10:**
- User czeka aż "coś się stanie" lub zaczyna scrollować
- Po scrollu trafia na slajd 1 ("Jij droomt") — kolejny tekst manifestu
- **User nadal nie wie co firma robi.**

### 1.3. Ile kroków do pierwszej usługi?

**Scenariusz: "Chcę koszulki z nadrukiem dla swojego zespołu" (G\|PRINT)**

| Krok | Akcja | Czas |
|------|-------|------|
| 1 | Wejście na stronę → Hero z animacją | 0s |
| 2 | Scroll #1 → Intro "Jij droomt" | ~2s |
| 3 | Scroll #2 → Intro "Geen bureau" | ~4s |
| 4 | Scroll #3 → Intro "Eén partner" | ~6s |
| 5 | Scroll #4 → Intro "Wij bouwen de oplossing" | ~8s |
| 6 | Scroll #5 → "Niet morgen. Nu." | ~10s |
| 7 | Scroll #6 → "Vijf disciplines." | ~12s |
| 8 | Scroll #7 → **Mr. GEK** (chatbot, nie usługa!) | ~14s |
| 9 | Scroll #8 → G\|SAAS carousel (1 z 4 slajdów) | ~16s |
| 10 | Scroll #9 → **G\|PRINT** carousel slajd 1 ("Kledingbedrukken") | ~18s |

→ **9 scrolli, ~18 sekund** żeby zobaczyć pierwszą koszulkę. To **2× za długo** w stosunku do 5-second testu UX (NN/G, Trymata).

**Alternatywa: hamburger menu**
- Krok 1: tap na hamburger
- Krok 2: rozwija się panel z listą pilarów (kolorowe kropki + nazwy "G\|SAAS", "G\|PRINT", ...)
- Krok 3: tap na "G\|PRINT" → scroll-jump do sekcji
- → 3 kroki, ~5 sekund. **Działa, ale wymaga że user wie że istnieje "G\|PRINT" — a tego nie wie!**

**Topbar dots (5 kolorowych kropek u góry):**
- Są klikalne, prowadzą do pilarów
- **Brak labelek** — user nie wie co oznaczają kolory
- W obecnym stanie to "easter egg" dla wracających, nie nawigacja dla nowych

### 1.4. Co jest niewizualne / nieczytelne dla nowego usera

**Problemy bardzo silne:**

1. **Hero nie mówi co firma robi.** "Architect van ervaringen" + animacja pierścieni = abstrakcja. Brakuje subtytułu typu "Vijf diensten: software, druk, websites, optimalisatie, video".

2. **6 intro slidów to "preroll" bez wartości informacyjnej.** Manifest typu "Jij droomt, wij bouwen" jest piękny copywriting, ale user którego nie znamy nie czeka 12 sekund na wstęp. Ten content powinien być w sekcji "Nasza filozofia", nie pomiędzy hero a usługami.

3. **Mr. GEK jest PRZED usługami.** Chatbot to feature, nie produkt-flagship dla nowego usera. User który nie wie co firma oferuje, nie wejdzie w czat z AI.

4. **Pilary są ukryte w pionowej karuzeli.** Każdy pilar to osobna pełnoekranowa sekcja z własną karuzelą produktów. Brak widoku "all 5 pilars at once". Nigdy nie ma jednego momentu w którym user widzi "oto nasza pełna oferta".

5. **Topbar dots bez labelek.** 5 kolorowych kropek to czysta dekoracja dla nowego usera. Powinny być z mini-labelkami "SAAS", "PRINT", "SITE", "OPTIMA", "CLIP" przynajmniej do pierwszej interakcji.

6. **Visualy w karuzelach to abstrakcyjne SVG (iso-stage)**. Webapp ma sidebar + chart, drone ma 4 ramiona, koszulka ma rękawy — wszystko stylizowane. Ładne, ale nie podają jednoznacznej informacji "to jest koszulka z logo". Real-world MKB ondernemer z Nuenen rozpozna **zdjęcie koszulki** szybciej niż **abstrakcyjny grafit**.

**Problemy słabsze (warte uwagi):**

7. Mobile subs (małe labelki na dole) pojawiają się dopiero PO animacji hero — pierwsze 3s są bez kontekstu.
8. Brak "okruchów chleba" — user nie wie ile jeszcze sekcji przed nim.
9. Cross-sell linki na końcu każdej karuzeli ("Webapp gebouwd? Geef het een website") są fajne, ale działają tylko jeśli user dotarł do końca karuzeli.
10. Cena pojawia się jako tag w karuzeli, ale nie jest widoczna na pierwszy rzut oka w gridzie.

### 1.5. Co już DZIAŁA dobrze (nie psuć)

- **Color-coded pilary** — niebieski/czerwony/zielony/szary/żółty są spójne w całej stronie, w topbar dots, w karuzelach, w menu.
- **OLED-czarne tło** — bardzo eleganckie, pasuje do premium brandu.
- **Sekcja per pilar z opisami, featureami i CTA** — gdy już do niej dotrzesz, struktura jest świetna.
- **Cross-sell linki na końcu karuzeli** — łączą pilary między sobą.
- **Mr. GEK jako fallback** — gdy user nie wie czego szuka, AI agent pomaga.
- **Animacja hero jest piękna i własna** — ma wartość brandową, nie należy jej wywalać. Trzeba ją tylko "uzbroić" w treść.
- **Hamburger menu z rozwijalnymi pilarami i produktami** — najbardziej funkcjonalny element nawigacji.

---

## 2. Research — jak inne firmy z wieloma usługami to rozwiązują

### 2.1. Pentagram (https://www.pentagram.com/)

**Co robią:** Designerska agencja z ~15 dyscyplinami (brand identity, packaging, motion, typeface, websites, exhibitions...).

**Jak prezentują usługi:**
- **Hero headline:** "We design everything for everyone" — zwięzła wizja
- **Interaktywny matrix słów** — user może podświetlić "everything" → lista dyscyplin, lub "everyone" → lista sektorów
- **Project cards above the fold** — 4–6 dużych zdjęć z prawdziwych projektów
- Każda karta ma: tytuł projektu, tagline, tagi dyscypliny/sektora

**Co u nich działa dobrze:**
- W 3 sekundach user wie że to design consultancy, że robią "wszystko", i widzi konkretne wyniki (nie abstrakcję)
- Dwa wymiary klasyfikacji (dyscyplina + sektor) — user może szukać po typie pracy LUB po branży
- Zdjęcia realnych projektów = natychmiastowa wiarygodność

**Co adaptować dla GEK-X:**
- Hero headline w stylu "GEK-X bouwt **alles voor iedere ondernemer**" z interaktywnym podświetlaniem "alles" = lista 5 pilarów
- Pod hero: thumbnaile realnych prac (koszulka, strona www, dronowe ujęcie, dashboard, breloczek 3D)

### 2.2. Vistaprint (https://www.vistaprint.com/)

**Co robią:** Drukarnia online z ~10 kategoriami produktów (wizytówki, znaki, baner, ubrania, naklejki, opakowania, materiały marketingowe, zaproszenia, logo).

**Jak prezentują usługi:**
- Topbar nawigacja z **wszystkimi kategoriami głównymi** (Business Cards, Postcards, Signs, Stickers, Clothing, Promo Products, Packaging, ...)
- **Tile carousel "Explore all categories"** poniżej fold — kafelki ze zdjęciem produktu + label
- "Shop by collection" i "Explore seasonal favorites" — sekundarne sposoby przeglądania

**Co działa dobrze:**
- Top nav od razu pokazuje **wszystkie kategorie** — user wie ile rzeczy oferują
- Tile carousel z **prawdziwymi zdjęciami produktów** (nie abstrakcją)
- 12 kategorii w karuzeli, ale z numeracją "Slides 1 to 3 of 12" — user wie że jest więcej

**Co adaptować dla GEK-X:**
- 5 pilarów jako kafelki ze zdjęciami (koszulka, strona, dron, automatyzacja, breloczek) zamiast abstrakcji
- Topbar z **labelkami** przy kropkach, nie tylko z dots-only

### 2.3. Framer (https://www.framer.com/)

**Co robią:** Site builder z 4 głównymi feature areas (AI, Design, CMS, Collaborate) + 3 sub-narzędzia (Analytics, A/B Testing, SEO).

**Jak prezentują:**
- Hero: "Build better sites, faster" + 2 CTA ("Start for free", "Start with AI")
- **4 główne karty** w jednokolumnowym flow, każda z: nazwa feature'a + krótki opis (75–100 znaków) + "Learn more"
- Progressive disclosure — najpierw 4 karty, potem podstrony z 3 sub-features

**Co działa dobrze:**
- Hero ma **value proposition w 5 słowach** — natychmiast wiesz co dostajesz
- Konsystentny rozmiar i odstępy między kartami = łatwe skanowanie wzrokiem
- Każda karta = jeden feature = jedna decyzja

**Co adaptować dla GEK-X:**
- Tak jak Framer ma 4 karty — GEK-X mógłby mieć **5 kart pilarów** w sekcji "Wat doen wij?" tuż pod hero
- Każda karta: kolor pilaru jako akcent + nazwa + 1 zdanie + 1 CTA

### 2.4. Anyday.agency (https://anyday.agency/nl/diensten) — przykład holenderski

**Co robią:** Creative digital bureau (Amsterdam) z 4 dyscyplinami: Design, Webdevelopment, Video, Creatie.

**Jak prezentują:**
- Card-based layout (1 karta = 1 dyscyplina)
- Każda karta: tytuł + tagline (storytelling, np. "Craftsmanship with the tools of today") + akapit opisu + "Learn more"
- **Brak ikon** — text-forward design, minimalizm
- Modular grid, każda dyscyplina niezależna

**Co u nich działa:**
- Bardzo holenderski styl — czyste, tekstowe, bez ozdóbek
- Storytelling ("the best ideas begin with good coffee") + linki do projektów

**Co adaptować dla GEK-X:**
- Holenderski user akceptuje minimalizm — nie trzeba przesadzać z grafiką
- Storytelling już jest na GEK-X (intro slides) — tylko ZA WCZEŚNIE w lejku

### 2.5. Bento grids (https://bentogrids.com/, https://onepagelove.com/tag/bento)

**Trend 2024–2026:** 67% top SaaS sites używa bento grid layoutu (źródło: ProductHunt analysis).

**Bento grid = grid z tile'ami różnych rozmiarów, jak japoński pojemnik na lunch.**

**Najlepsze przykłady multi-service:**
- **Apple (apple.com/iphone)** — bento z featurami iPhone'a, każdy tile różnej wielkości
- **Supabase** — modular bento dla backend tools, każdy tile = jeden moduł
- **Highnote** — bento dla narzędzi kolaboracji
- **Framer Templates** — bento z thumbnailami template'ów

**Dlaczego bento działa dla GEK-X:**
- Pozwala pokazać **5 pilarów + 1 chatbot (Mr. GEK)** w jednym widoku
- Różne rozmiary kafelków = naturalna hierarchia (flagship pilar duży, mniejsze małe)
- Mobile-friendly — kafelki przepływają w 1 kolumnę

### 2.6. NN/G — bottom navigation dla multi-service mobile

**Reguła:** Tab bar działa najlepiej dla **3–5 destynacji o równej ważności**.
**GEK-X ma 5 pilarów = idealna liczba dla bottom tab bar na mobile.**

- Ikona + krótki, konsystentny label
- Zawsze widoczny, niezależnie od scrolla
- Pozycja w "thumb zone" (dolne 40% ekranu)

GEK-X już ma `mobile-subs` na dole — ale to są małe labelki które pojawiają się dopiero podczas scrolla. **Brak prawdziwego, pełnego tab baru z 5 pilarami na mobile.**

---

## 3. Wzorce UI — kafelki, ikony, service grids

### 3.1. Kafelek usługi — co powinien zawierać

Na podstawie best practices (NN/G, Alf Design Group):

**Minimum (must-have):**
- Nazwa usługi (jasna, krótka)
- Wizualny akcent (kolor pilaru lub ikona/zdjęcie)
- Klikalność na cały kafelek (44x44px minimum, na mobile)

**Optimum (recommended):**
- Krótki tagline / wartość (1 zdanie, max 70 znaków)
- Mini ikona pasująca do usługi
- Hover state (zmiana koloru / podniesienie / poświata pilaru)
- Cena od (jeśli relevant)

**Anti-pattern (unikać):**
- Wiele CTA na jednym kafelku (powoduje friction)
- Długie opisy >100 znaków (user nie czyta)
- Niska kontrastowość tekstu na tle

### 3.2. Typy ikon — co pasuje do OLED + Montserrat

**Pasuje:**
- **Linearne, monochromatyczne ikony** (1.5–2px stroke, biały lub kolor pilaru) — podobny styl do tych już w menu (clock, phone, info)
- **Outline iconography** (Feather, Lucide style)
- **Mini ilustracje** w kolorze pilaru jako akcent

**Nie pasuje:**
- 3D ikony (gradient, depth) — psują estetykę OLED-flat
- Fotorealistyczne zdjęcia (ale: zdjęcia gotowych produktów typu koszulka/breloczek w bento mogą działać jako "real-world anchor")

### 3.3. Service grid — układy które działają

**A) "Hero hall of mirrors" — 5 kafelków pod hero w jednym widoku**
- Grid 5-kolumnowy na desktop (lub 5 w jednym rzędzie z karty 200×280px każda)
- 2×3 na tablet (5. karta + Mr. GEK = 6 tile bento)
- 1×5 / 2×3 stack na mobile

**B) "Bento" — różne rozmiary**
- Flagship pilar (np. G\|PRINT bo to gateway product) = duża karta
- Pozostałe = mniejsze kafelki
- Mr. GEK jako 6. kafelek "ask anything"

**C) "Sticky service bar" — stała listwa nawigacyjna**
- Pasek z 5 kropkami + labelkami zawsze widoczny pod topbar
- Zawsze wskazuje gdzie user jest w lejku
- Wzór z Pentagram-like matrix

### 3.4. Mobile navigation pattern

Dla GEK-X najlepiej zadziała **hybrid: bottom tab bar + top hero tiles:**

- **Górna część strony:** 5 kafelków pilarów + 1 kafelek Mr. GEK (bento layout, 2×3 grid na mobile)
- **Sticky bottom tab bar:** 5 kropek z labelkami + ikonka home / Mr. GEK
- **Tap na kropce w bottom bar:** scroll do sekcji pilaru

---

## 4. Konkretne rekomendacje dla GEK-X

### 4.1. Hero (sekcja 0) — co zmienić

**Zachować:**
- Animacja pierścieni (orbit) — to brandowy hallmark, nie do ruszania
- OLED-czarne tło
- "ARCHITECT van ERVARINGEN" jako mniejszy subtekst

**Dodać (kluczowe):**
- **Główny H1 nad/pod animacją:** "**Vijf disciplines. Eén team.**" (już to mają w meta description — przenieść do hero!)
- **Sub-line z 5 słowami:** "Software · Druk · Websites · Optimalisatie · Video" — kolory zgodne z pilarami
- **Mikro-CTA pod sub-line:** "Bekijk wat we doen ↓" — jasna intencja scrolla
- **Tagline mniej dominujący** — przeniesione na bok lub zmniejszone

**Skutek:** W 3 sekundach user wie:
1. To firma z 5 dyscyplinami
2. Konkretne 5 obszarów (po Niderlandsku — czyta jak listę produktów)
3. Dalej scroll = więcej info

### 4.2. NOWA sekcja 1: "Service hall" — bento z 5 pilarów + Mr. GEK

**Wstawić TUŻ PO hero, PRZED intro carousel.**

**Layout desktop (1920px):**
```
┌──────────────────────────────────────────────────────────────┐
│  Wat we doen — kies een richting                             │
│                                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │ G|SAAS  │ │ G|PRINT │ │ G|SITE  │ │ OPTIMA  │ │ G|CLIP  ││
│  │ niebie- │ │ czerwo- │ │ zielony │ │ szary   │ │ żółty   ││
│  │ ski     │ │ ny      │ │         │ │         │ │         ││
│  │ Software│ │ T-shirts│ │ Web &   │ │ Lean &  │ │ Video & ││
│  │ op maat │ │ & print │ │ shops   │ │ proces  │ │ drone   ││
│  │ vanaf   │ │ vanaf   │ │ vanaf   │ │ vanaf   │ │ vanaf   ││
│  │ €1.500  │ │ €1/stk  │ │ €1.500  │ │ €350    │ │ €450    ││
│  │ [ikona] │ │ [ikona] │ │ [ikona] │ │ [ikona] │ │ [ikona] ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ✦ Mr. GEK — Niet zeker? Vraag het Mr. GEK            │ │
│  │   AI-assistent, 24/7, gratis offerte in 3 minuten     │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Layout mobile (380px):**
```
┌──────────────┐
│ Wat we doen  │
├──────┬───────┤
│SAAS  │PRINT  │
├──────┼───────┤
│SITE  │OPTIMA │
├──────┴───────┤
│ CLIP         │  (full-width na 3 rzędzie)
├──────────────┤
│ ✦ Mr. GEK    │
└──────────────┘
```

**Co w każdym kafelku:**
- Górna część: ikona linearna (24×24, stroke 2px) w kolorze pilaru
- Środek: nazwa pilaru w stylu "G\|SAAS" (już ten styling istnieje)
- Pod spodem: 1 zdanie wartości (np. "Software & AI op maat", "Logo op alles — shirts, stickers, magneten")
- Stopka: "Vanaf €X" + mała strzałka
- Hover: subtle glow w kolorze pilaru (`0 0 20px var(--saas)` etc.) + lekka skala 1.02
- Tap: scroll do sekcji tego pilaru

**Ikony do każdego pilaru (sugestie, monochromatyczne linearne):**
- G\|SAAS — `<>` (code brackets) lub dashboard chart
- G\|PRINT — koszulka outline + iskra
- G\|SITE — przeglądarka outline
- G\|OPTIMA — koła zębate
- G\|CLIP — kamera filmowa outline

### 4.3. Kolejność treści — co przesunąć

**Proponowana nowa kolejność:**

| # | Sekcja | Status |
|---|--------|--------|
| 0 | Hero (z nowym H1 + sub-line) | **ZMIENIĆ** |
| 1 | **Service hall (bento 5 pilarów + Mr. GEK)** | **NOWA** |
| 2 | G\|SAAS carousel | bez zmian |
| 3 | G\|PRINT carousel | bez zmian |
| 4 | G\|SITE carousel | bez zmian |
| 5 | G\|OPTIMA carousel | bez zmian |
| 6 | G\|CLIP carousel | bez zmian |
| 7 | Mr. GEK promo (full slide) | **PRZESUNĄĆ TUTAJ** |
| 8 | Intro carousel "Jij droomt" (6 slidów) | **PRZESUNĄĆ TUTAJ** (jako "Onze filosofie") |
| 9 | About / Footer | bez zmian |

**Dlaczego intro carousel ma być na dole:**
- To manifest "kim jesteśmy" — czyta go user który już wie co oferujesz i waha się czy ci ufać
- Storytelling jest **post-discovery**, nie pre-discovery
- Wymaga emocjonalnej inwestycji — najpierw user musi mieć kontekst

**Dlaczego Mr. GEK ma być po pilarach:**
- Mr. GEK to fallback "nie wiem czego szukam, pomóż mi"
- Najpierw user widzi 5 pilarów. Jeśli wie czego chce → idzie do pilaru. Jeśli nie wie → Mr. GEK go zapyta.
- Reverse order = "AI before products" = surrealistyczne dla MKB ondernemera z Nuenen

### 4.4. Topbar — uzbroić w labelki

**Obecne:**
```
[≡] GEK|X™               • • • • •      [badge]
```

**Proponowane:**
```
[≡] GEK|X™               SAAS PRINT SITE OPTIMA CLIP    [Mr.GEK ✦]
                          •    •    •    •     •
```

Z kropkami pod labelkami (jak małe ikony). Na hover: pełna nazwa "G\|SAAS" z color flash.

**Na mobile (gdy mało miejsca):**
- Kropki w topbar (jak jest) — bez labelek
- ALE: bottom sticky tab bar z 5 ikon + labelek

### 4.5. Mobile-specific: sticky bottom tab bar

**Layout (zawsze widoczny):**
```
┌────────────────────────────────────────┐
│  [content]                             │
│                                        │
│                                        │
│                                        │
├────────────────────────────────────────┤
│ 🔧  👕  🌐  ⚙️  🎬   ✦                │
│SAAS PRINT SITE OPT CLIP Mr.GEK         │
└────────────────────────────────────────┘
```

- Wysokość 56–64px
- Tło: `rgba(0,0,0,0.95)` z backdrop blur (jak topbar)
- Aktywny tab: kolorowa kropka pod ikoną + label w kolorze pilaru
- Tap = smooth scroll do sekcji pilaru
- Mr. GEK jako 6. "tab" z gwiazdką (otwiera chatbot)

### 4.6. Wizualizacje w karuzelach — opcjonalne ulepszenie

**Obecne abstrakcyjne SVG (iso-stage)** są ładne, ale nieczytelne dla MKB ondernemera. Propozycja **hybryda**:

- Pierwszy slajd każdego pilaru: **prawdziwe zdjęcie produktu** (koszulka z logo, prawdziwa strona www na monitorze, screenshot drona, dashboard webapp, breloczek 3D)
- Kolejne slajdy: zachować obecne SVG (są stylistycznie świetne dla pokazywania konceptów typu "automatyzacja", "AI agent", "SEO score")

To mieszanka "real-world anchor" (zdjęcie pierwsze) + "concept reinforcement" (SVG dalej) = najlepsza z dwóch światów.

---

## 5. Quick wins — co da efekt w 1 dzień pracy

**Posortowane po stosunku impact / effort.**

### Quick win #1: Dodaj sub-line w hero ⭐⭐⭐⭐⭐
**Effort:** 30 minut
**Impact:** Ogromny — od 0% do ~60% zrozumienia w 3 sekundy

Pod animacją orbit, między "ARCHITECT van ERVARINGEN" a strzałką w dół:
```
Software · Druk · Websites · Optimalisatie · Video
```
Każde słowo w kolorze swojego pilaru. Krój: Montserrat 500, letter-spacing 0.1em, 14px.

### Quick win #2: Labelki przy topbar dots ⭐⭐⭐⭐
**Effort:** 1 godzina
**Impact:** Duży — desktop nav nagle staje się informacyjny

Dodać pod każdą kropką w `topbar-dots` malutki label "SAAS", "PRINT", "SITE", "OPTIMA", "CLIP" w `font-size: 9px; color: rgba(255,255,255,0.5)`. Na hover pełna nazwa pojawia się jako tooltip.

### Quick win #3: Przenieść intro carousel za pilary ⭐⭐⭐⭐⭐
**Effort:** 2 godziny (reorder sekcji w snap container)
**Impact:** Ogromny — skraca lejek do pierwszej usługi z 9 do 2 scrolli

Sekcje 1–6 (intro carousel "Jij droomt") + sekcja 7 (Mr. GEK) idą **za** karuzele pilarów, jako "Onze filosofie" + Mr. GEK promo.

Po tej zmianie:
- Scroll #1 → G\|SAAS
- Scroll #2 → G\|PRINT
- ...
- Scroll #6 → Mr. GEK
- Scroll #7 → Onze filosofie

### Quick win #4: Bento service hall pod hero ⭐⭐⭐⭐⭐
**Effort:** 1 dzień (komponent + 5 ikon)
**Impact:** Game-changer — user widzi WSZYSTKIE pilary w 2 sekundy

Dodać nową sekcję 1 między hero a pilarami z 6-tile bento (5 pilarów + Mr. GEK), tak jak opisano w 4.2. To największa pojedyncza zmiana w zrozumiałości strony.

### Quick win #5: Mobile bottom tab bar ⭐⭐⭐⭐
**Effort:** 4 godziny
**Impact:** Średni, ale konsystentnie na każdej sekcji

Dodać sticky bottom nav z 5 ikon pilarów + Mr. GEK. Pozwala teleportować się między pilarami w jednym tapie.

### Quick win #6: Tagline z meta description do hero ⭐⭐⭐
**Effort:** 15 minut
**Impact:** Średni — strona zaczyna "mówić" o sobie

W `<meta name="description">` jest już złoto:
> "Vijf disciplines. Eén team. GEK-X bouwt webapps, print, websites, optimaliseert processen en filmt content."

To tagline gotowy do hero! Zmienić obecne "ARCHITECT van ERVARINGEN" na:
```
Vijf disciplines.
Eén team.
```
Jako H1, a "Architect van ervaringen" jako mniejsze pre-headline.

### Quick win #7: Cena na kafelku ⭐⭐⭐
**Effort:** 2 godziny (w bento + w karuzelach)
**Impact:** Konwersyjny — "Vanaf €X" znika friction "ile to kosztuje?"

Każdy bento tile + pierwszy slajd karuzeli powinien mieć "Vanaf €X" w prawym dolnym rogu. Już istnieją te dane w karuzelach (DTF €23/m, 3D vanaf 1 stk, SAAS vanaf €1.500), tylko trzeba je wynieść na top of funnel.

---

## Podsumowanie — TL;DR

**Problem:** Strona pokazuje hero z animacją + 6 intro slidów + chatbot, zanim pokaże pierwszą usługę. Nowy user MKB nie wie co GEK-X robi przez pierwsze ~15 sekund i ~9 scrolli.

**Diagnoza:** Świetna struktura per-pilar (karuzele, opisy, ikonki, CTA), ale brakuje **widoku z lotu ptaka** — momentu w którym wszystkie 5 pilarów jest widoczne jednocześnie. Manifest "Jij droomt, wij bouwen" jest piękny ale **przedwczesny w lejku**.

**Rekomendacja:** Dodać **sekcję service hall** (bento grid z 5 kafelków pilarów + Mr. GEK) **tuż po hero**. Przenieść intro carousel + Mr. GEK promo na koniec, jako "Onze filosofie". Dodać sub-line z 5 słowami w hero. Uzbroić topbar dots w labelki. Na mobile dodać sticky bottom tab bar.

**Inspiracje:** Pentagram (interaktywny matrix słów), Vistaprint (top nav z labelkami + tile carousel), Framer (4-card modular layout), Anyday.agency (holenderski minimalistyczny card layout), bento grid trend (67% top SaaS w 2025).

**Spodziewany efekt:** Czas do pierwszej widzialnej usługi spada z ~18 sekund do ~2 sekund. Stosunek "wiem co firma robi" w 5-second teście idzie z 0% do >70%.

---

## Źródła i inspiracje

- [Pentagram — multi-discipline agency homepage](https://www.pentagram.com/)
- [Vistaprint — tile carousel + top nav](https://www.vistaprint.com/)
- [Framer — 4-card feature layout](https://www.framer.com/)
- [Anyday Agency NL — Dutch service cards](https://anyday.agency/nl/diensten)
- [Bento Grids inspiration gallery](https://bentogrids.com/)
- [Bento grid examples on OnePageLove](https://onepagelove.com/tag/bento)
- [NN/G — Mobile navigation patterns](https://www.nngroup.com/articles/mobile-navigation-patterns/)
- [Mockuuups — Bento grid design examples 2026](https://mockuuups.studio/blog/post/best-bento-grid-design-examples/)
- [Kalungi — 5-Second Test UX Questions](https://www.kalungi.com/blog/5-second-test-ux-questions)
- [The Good — Above the Fold strategy](https://thegood.com/insights/above-the-fold/)
- [Alf Design Group — UI Card Design Best Practices 2026](https://www.alfdesigngroup.com/post/best-practices-to-design-ui-cards-for-your-website)
- [Smashing Magazine — Bottom Navigation on Mobile](https://www.smashingmagazine.com/2019/08/bottom-navigation-pattern-mobile-web-pages/)
- [Bento Grid Design — 40+ examples 2025](https://mukeshkdesigns.com/blogs/bento-grid-design-inspiration/)
- [Framer Blog — Landing page best practices 2025](https://www.framer.com/blog/landing-page-best-practices/)

---

*Research wykonany 15.05.2026. Bez zmian na stronie — wyłącznie analiza i rekomendacje.*
