# GEK-X — Plan monetyzacji "Najwięcej pieniędzy w najkrótszym czasie"

Stan na 13-05-2026. Analiza www.gek-x.nl + repo `gek-roll-generator` v3.1.0.

---

## 1. Co już masz (Twoje realne aktywa)

| Aktywo | Stan | Wartość |
|---|---|---|
| **DTF Roll Studio** (web) — drag&drop, auto-nesting, live quote, auto-white-correction | Live na `/gprint/dtf-roll-studio` | Działa, ma unikalny stack |
| **UV-DTF Roll Studio** (web) — to samo dla UV-DTF | Live na `/gprint/uv-dtf-roll-studio` | Ma już zdanie "Volledig op maat, jouw branding" → white-label gotowe do sprzedaży |
| **Roll Generator backend** (to repo) — server-side sharp, 300 DPI, paralelizacja, auto-split 10m | v3.1.0, deployed na Railway | Industrial-grade. Mało kto w NL to ma. |
| **TIFF Converter** (`/convert-tiff`) — PNG→FlexiRIP-ready TIFF z white-fix | Działa w produkcji | **Skarb. Każda drukarnia DTF na FlexiRIP-ie tego potrzebuje codziennie.** |
| **Mr. GEK** — AI asystent + koszyk | Live, ale ręczny finał (mail/WA) | OK, brak Stripe/Mollie checkout = punkt do dodania |
| **NFC w ubraniu** | Aktywne, unikalne | Premium-niche, mało konkurencji |
| **Magnetyczne wizytówki** | Aktywne; "0 konkurencji w NL" | First-mover NL |
| **3D Print Calculator** + AMS multicolor | Live | Mała marża, traktuj jako lead-magnet |
| **Stack**: Supabase + Sharp + Railway + Resend | Solidny | Skalowanie bez kosztów |

---

## 2. Brutalna diagnoza — dlaczego tracisz pieniądze

### A. Twoje ceny druku DTF są ~2× powyżej rynku NL

| Produkt | Ty | Konkurencja NL | Stosunek |
|---|---|---|---|
| DTF rola | **€23/m** | Karman Transfers €8,95/m, Tshirtdeal €12,50/m | 2,1× – 2,6× drożej |
| UV-DTF rola | **€45/m** | Tshirtdeal €19/m, Stickerdeals ~€20/m | 2,4× drożej |

**Konsekwencja:** każdy klient, który zrobił 1 zapytanie do konkurencji, do Ciebie nie wraca. Tracisz volume.

**To NIE znaczy, że masz obniżać.** To znaczy: musisz albo (a) uzasadnić cenę premium konkretną wartością, albo (b) wprowadzić niższe tieryny dla bulk/standard, zachowując premium dla speed/custom.

### B. Nie monetyzujesz tego, w czym jesteś naprawdę unikalny — **softwaru**

Twoje Roll Studio + Roll Generator + TIFF Converter to produkty SaaS warte €99-€499/mc każdy. Sprzedajesz je raz na własny druk. **To strata ~80% potencjału.**

### C. Brak checkoutu = każda transakcja = ręczna robota

Mr. GEK kończy się "Dawid contacteer je morgen". Każde €23 zamówienie = 15 min Twojej pracy = ujemna marża na małych zamówieniach.

### D. Jeden język (NL only) = jeden rynek

Belgia + Niemcy + Polska to ten sam workflow, inny język = +3× TAM bez nowego produktu.

---

## 3. Trzy ruchy które dają największy pieniądz w najkrótszym czasie

### **RUCH #1 — Restrukturyzacja cennika DTF/UV-DTF (Week 1) — natychmiastowy lift**

Wprowadź 3 tiery zamiast jednej ceny. Pozycjonujesz €23/m jako "Pro", dodajesz "Bulk" poniżej i "Express" powyżej.

#### DTF Roll Studio — nowy cennik

| Tier | Cena | Co dostajesz | Termin |
|---|---|---|---|
| **DTF Bulk** ≥5m | **€14,90/m** | Standard, auto-nest, white-correction | 3 dni robocze |
| **DTF Pro** 1–5m | **€22,90/m** *(bez zmian)* | Auto-nest, white-correction, kontrola kolorów | 48h |
| **DTF Express** *(dowolna ilość)* | **€32,90/m** | + Priorytet, gwarancja 24h, status push w Mr. GEK | 24h |
| **Sample pack** | **€4,95 + verzendkosten** | 30×30cm test print | 5 dni |

**Dlaczego to działa:**
- Bulk łapie klientów którzy poszliby do Karmana (€14,90 vs €8,95 — różnica 66% jest do uzasadnienia automatyzacją i NL-quality)
- Pro zostaje jak było — nie tracisz obecnych klientów
- Express jest nowym SKU które nikt nie oferuje w NL pod tą nazwą → tu jest najwyższa marża
- Sample pack = lead magnet, zero-friction first touch

#### UV-DTF Roll Studio — nowy cennik

| Tier | Cena | Termin |
|---|---|---|
| **UV-DTF Bulk** ≥3m | **€28,90/m** | 3 dni |
| **UV-DTF Pro** 1–3m | **€44,90/m** | 48h |
| **UV-DTF Express 3D-relief** | **€59,90/m** | 24h |

**Efekt prognozowany (konserwatywny):**
- Zakładając 50 zamówień/mc po średnio 1,2m teraz → €1.380/mc obrotu DTF
- Po nowym cenniku przy zakładanym +60% volume z Bulk → ~€2.500–€3.100/mc
- **Lift: +€1.100–€1.700/mc bez kosztów wdrożenia**

**Wdrożenie:** 1 dzień. Zmiana 3 stringów w Roll Studio frontend + dodaj kalkulator do `/quote` (zobacz Sekcja 6).

---

### **RUCH #2 — "FlexiRIP TIFF Converter" jako SaaS dla drugich drukarni (Week 1-3) — recurring**

To jest **największa ukryta okazja**. Twój `/convert-tiff` endpoint robi rzecz, którą każda mała drukarnia DTF korzystająca z FlexiRIP robi ręcznie w Photoshopie — i to są minuty pracy × dziesiątki plików dziennie × każdy operator.

#### Produkt: **GEK | TIFF Lab** — "Drop PNG → krijg FlexiRIP-klare TIFF in 10 sec"

| Plan | Cena | Co zawiera |
|---|---|---|
| **Starter** | **€0** | 5 konwersji/mc, watermark "Powered by GEK" w metadata |
| **Studio** | **€29/mc** | 200 konwersji/mc, batch upload, API key |
| **Pro** | **€89/mc** | 1000 konwersji/mc, batch, API, własne presety, priority queue |
| **Agency** | **€249/mc** | Unlimited, multi-tenant API keys, własna subdomena |

**Margin matematyka:**
- Koszt: ~€0,003 / konwersję (Railway CPU + Supabase storage)
- Plan Studio: €29 / 200 = €0,145/konwersję → **~98% gross margin**
- Break-even: 1 płacący klient pokrywa koszt całego serwera

**Konserwatywny prognozowany ARR:**
- 20× Studio + 5× Pro + 1× Agency = €580 + €445 + €249 = **€1.274 MRR = €15.288 ARR**
- Z dystrybucją w polskich/niemieckich grupach FB DTF i Discordach: realne w 60 dni

**Wdrożenie:**
1. Dodać autentykację API-key + quota tracking (Supabase tabela `tiff_keys`)
2. Stripe / Mollie subscription (recurring iDEAL działa) — 1 dzień konfigurowy
3. Landing: `gek-x.nl/tiff-lab` lub własna domena `tiff-lab.gek-x.nl`
4. Marketing: post w grupach FB "DTF Printing Netherlands/Germany", LinkedIn outreach do small print shops

**Code scaffolding już dodaję w tym commicie — patrz Sekcja 6.**

---

### **RUCH #3 — White-Label "Roll Studio as a Service" (Week 4-12) — duże recurring**

To jest gra długoterminowa ALE pierwsze umowy podpisujesz w 4-6 tygodni. Tutaj jest największy potencjał — Ninja Transfers, Antigro, DTFsheet w US tym zarabiają miliony.

#### Produkt: **GEK | Roll Studio License** — biały label dla drukarni

Drukarnia X dostaje:
- Własną subdomenę `studio.drukarniaX.nl`
- Własny branding (logo, kolory)
- Działający DTF + UV-DTF Roll Studio
- Backend Roll Generator + TIFF konwerter
- Customers piszą do Mr. GEK, ale ze swoim logo

| Plan | Setup fee | Monthly |
|---|---|---|
| **Studio Solo** (1 drukarnia, do 100 zamówień/mc) | €499 | **€149/mc** |
| **Studio Plus** (do 500 zamówień/mc + custom domain) | €499 | **€299/mc** |
| **Studio Enterprise** (unlimited, dedicated subaccount Supabase, SLA) | €1.499 | **€499/mc** |

**Rynek:**
- W NL/BE/DE jest ~800-1.200 małych drukarni DTF (małe garaże, jednoosobowe)
- Wskaźnik konwersji nawet 1% = 8-12 płacących = €1.200-€3.600 MRR
- Realny cel rok 1: **20 płacących klientów = €3.000-€6.000 MRR = €36-72k ARR**

**Wdrożenie:**
1. **Tydzień 4-5:** dodaj multi-tenant do Roll Generator (każdy roll ma `tenantId`, bucket Supabase per tenant)
2. **Tydzień 6:** template branding (logo URL + 2 kolory CSS w configu)
3. **Tydzień 7:** landing `gek-x.nl/license` + demo
4. **Tydzień 8-12:** outreach. LinkedIn Sales Navigator filtr "print shop owner NL/BE/DE", DM template w Sekcji 5.

---

## 4. Plan 30-dniowy (dzień po dniu)

| Dzień | Akcja | Efekt |
|---|---|---|
| 1 | Wdrożyć nowy cennik DTF/UV-DTF (Ruch #1) na stronie | Lift przychodu od dnia 2 |
| 1 | Komunikat na IG/FB/LinkedIn "Nowe ceny: Bulk -35%, Express 24h" | Push do bazy |
| 2 | Wdrożyć `/quote` i `/pricing` endpointy (kod w tym commicie) | Mr. GEK podaje real-time tier |
| 3-4 | Dodać Mollie Recurring (iDEAL) do koszyka Mr. GEK | Self-checkout dla Bulk/Pro |
| 5-7 | Wdrożyć API-key auth + quota do `/convert-tiff` (scaffolding w tym commicie) | Gotowe pod TIFF Lab |
| 8 | Landing `gek-x.nl/tiff-lab` (1 strona, copy w Sekcji 5) | Lead capture |
| 9 | Stripe/Mollie subscription dla TIFF Lab | Recurring revenue ready |
| 10 | Sample pack DTF €4,95 — dodać do shopu | Lead magnet, dane do remarketingu |
| 11-14 | Outreach TIFF Lab: 10 grup FB DTF + 50 LinkedIn DM-ów | Pierwsze 3-5 płacących |
| 15-21 | Tłumaczenie najważniejszych stron na DE (DeepL) — `de.gek-x.com` lub `/de/` | Otwarcie rynku DE |
| 22-28 | Multi-tenant skeleton dla Roll Studio (tenantId, branding config) | Fundament pod White-Label |
| 29-30 | Landing `gek-x.nl/license` + 30 DM-ów na LinkedIn do print-shop owners | Pierwsze leady |

---

## 5. Gotowe teksty (copy-paste)

### 5.1 Nowa sekcja cennika DTF Roll Studio (NL)

```text
DTF Roll Studio — Slimme tarieven
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ BULK         vanaf €14,90/m   • 5m+   • 3 werkdagen
▸ PRO          €22,90/m         • 1-5m  • 48 uur
▸ EXPRESS 24h  €32,90/m         • elke afmeting  • klaar binnen 24u
▸ Sample pack  €4,95            • 30×30cm test  • verzending NL

✓ Auto-nesting voor 0% verspilling
✓ Wit-correctie automatisch (FlexiRIP-klaar)
✓ 300 DPI, 32cm bedrukbaar
✓ Geen MOQ, ook 1 design op 30cm kan
✓ Realtime offerte. Realtime preview. Geen wachten.

Niet morgen. Nu.
```

### 5.2 Landing page **TIFF Lab** (NL) — pełen tekst

```text
GEK | TIFF Lab
PNG → FlexiRIP-klare TIFF in 10 seconden
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stop met handmatig wit-fixen in Photoshop.
Upload je PNG, krijg een uncompressed 8-bit RGB TIFF
met perfecte witkanaal-correctie — direct geschikt
voor FlexiRIP en élke DTF-printer.

▸ Automatische wit-correctie (255,255,255 → 255,255,255,252)
▸ Transparante pixels → puur wit (geen inkt-verspilling)
▸ 300 DPI metadata behouden
▸ Tot 2GB per bestand, geen browser-limieten
▸ Batch upload (Studio+)
▸ API voor je eigen workflow (Pro+)

╔══════════════════════════════════════════╗
║  STARTER   €0      5/mc        Try free  ║
║  STUDIO    €29     200/mc      Most pop. ║
║  PRO       €89     1000/mc + API         ║
║  AGENCY    €249    Unlimited + WL        ║
╚══════════════════════════════════════════╝

→ Start gratis. Geen creditcard.
```

### 5.3 LinkedIn DM template — print-shop outreach (NL/DE)

```text
Hi [Name],

zag dat je DTF prints doet voor klanten in [stad].
Snelle vraag: hoeveel uur per week verlies je aan
PNG→TIFF in Photoshop voor je FlexiRIP?

Bij GEK | TIFF Lab doet onze tool dat in 10 sec,
inclusief wit-fix. €29/mc voor 200 conversies.

Eerste 5 gratis als je wilt proberen — link in mijn profiel.

Geen sales pitch, gewoon curious of dit voor jullie iets is.

Groet, Dawid
```

### 5.4 Email do bestaande baza (NL) — push nowego cennika

```text
Subject: Nieuwe DTF tarieven — Bulk -35%, Express 24h

Hey [Naam],

We hebben de tarieven herzien:

  • DTF Bulk (5m+): €14,90/m  — voor wie veel print
  • DTF Pro (1-5m): €22,90/m  — onveranderd
  • DTF Express 24h: €32,90/m — als 't echt snel moet

Geen MOQ. Wit-correctie automatisch. 300 DPI.
Roll Studio: realtime preview, realtime prijs.

Open de Studio → www.gek-x.nl/gprint/dtf-roll-studio

Niet morgen. Nu.
— Dawid, GEK | X
```

### 5.5 Sales sheet **Roll Studio License** (white-label) — 1-pager

```text
GEK | Roll Studio — White-Label voor jouw drukkerij
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Je eigen DTF/UV-DTF gang-sheet builder.
Onder jouw merk. Op jouw domein. In 5 dagen live.

WAT JE KRIJGT
✓ Drag & drop Roll Studio (DTF + UV-DTF)
✓ Auto-nesting voor minimale verspilling
✓ Live offerte voor je klanten
✓ 300 DPI server-side rendering (geen browser-crashes)
✓ FlexiRIP-klare TIFF export
✓ Eigen logo, kleuren, domein
✓ Supabase storage subaccount (jouw data, jouw eigendom)

PLANS
  Solo       €499 setup + €149/mc   tot 100 orders/mc
  Plus       €499 setup + €299/mc   tot 500 orders/mc + custom domain
  Enterprise €1499 setup + €499/mc  unlimited + SLA

ROI rekensom (Plus)
  - Bespaar 8h/week op handmatig nesting & file-prep
  - €30/h × 32h/mc = €960 bespaard
  - Studio kost €299/mc → netto winst: €661/mc
  - Plus: meer orders door snellere offerte = +20-30% volume

Vraag een demo: demo@gek-x.nl
```

---

## 6. Co dodaję do kodu w tym commicie (gotowe do deployu)

### 6.1 `src/pricing.js` — single source of truth dla cennika

Konfiguracja tier-pricing dla DTF / UV-DTF, używana przez nowy endpoint `/quote`.
Zmienisz cenę w jednym pliku — propaguje się wszędzie.

### 6.2 `src/index.js` — nowe endpointy
- `GET /pricing` — zwraca aktualny cennik (Roll Studio frontend może pobierać dynamicznie)
- `POST /quote` — przyjmuje `{ type: 'dtf'|'uvdtf', meters, express }` → zwraca tier + cena + ETA
- `POST /convert-tiff` — dodaję opcjonalny `X-API-Key` header + walidację quota (placeholder, integracja z Supabase tabelą)

### 6.3 Supabase migration (do uruchomienia ręcznie w SQL editor)

```sql
-- TIFF Lab subscriptions & quota
create table if not exists tiff_keys (
  id uuid primary key default gen_random_uuid(),
  api_key text unique not null,
  customer_email text,
  plan text not null check (plan in ('starter','studio','pro','agency')),
  quota_monthly int not null,
  used_this_month int not null default 0,
  reset_at timestamptz not null default date_trunc('month', now() + interval '1 month'),
  active boolean not null default true,
  stripe_subscription_id text,
  created_at timestamptz default now()
);
create index on tiff_keys (api_key);

-- White-label tenants (faza 3)
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,        -- np 'drukarnia-jan'
  display_name text not null,
  logo_url text,
  brand_color text default '#000000',
  custom_domain text,
  supabase_bucket text not null,
  plan text check (plan in ('solo','plus','enterprise')),
  active boolean default true,
  created_at timestamptz default now()
);
create index on tenants (slug);
create index on tenants (custom_domain);
```

---

## 7. Mierniki — co śledzić co tydzień

| Metryka | Cel m1 | Cel m3 | Cel m6 |
|---|---|---|---|
| Średnie zamówienie DTF (€) | +20% | +35% | +50% |
| Zamówienia DTF/mc | +30% | +60% | +100% |
| TIFF Lab MRR (€) | 100 | 600 | 1.500 |
| Roll Studio License MRR (€) | 0 | 600 | 3.000 |
| **TOTAL MRR z SaaS (€)** | **100** | **1.200** | **4.500** |
| **Total ARR z SaaS (€)** | 1.200 | 14.400 | **54.000** |

ARR €54k z SaaS po 6 mc jest realistyczny **bez żadnego nowego sprzętu, bez najmu, bez pracowników**. To czysto z monetyzacji softwaru który już zbudowałeś dla siebie.

---

## 8. Jedna rzecz którą musisz zrobić jutro

Wdróż nowy cennik DTF (Sekcja 3.1) na stronie. To 30 minut roboty + push do bazy mailowej (Sekcja 5.4). Pierwszy efekt zobaczysz w 48h.

Reszta (TIFF Lab, White-Label) wymaga tygodni, ale fundament kodowy dodaję w tym commicie. Zostaje konfiguracja Stripe/Mollie i marketing.

---

*Plan oparty na danych: www.gek-x.nl (analiza wszystkich publicznych stron), konkurencja NL (Karman Transfers, Tshirtdeal, Stickerdeals), benchmarki US (Ninja Transfers, Antigro), stan repo `gek-roll-generator` v3.1.0.*
