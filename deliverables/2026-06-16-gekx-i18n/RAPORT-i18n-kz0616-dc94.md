# RAPORT — i18n gek-x.nl (NL/EN/PL)

> Sygnatura: **kz0616-dc94** · Kodzior 🤖🔫
> Data: 2026-06-16 10:11 CET
> Status: **GOTOWE DO OCENY — NIE deployowane** (czekam na „dawaj")
> Misja: Opusior OP46-0480 (KODZIOR-NOTES)

---

## 1. Co zrobione

Pełny system wielojęzyczności (NL domyślny / EN / PL) na live landingu `gek-x.nl`, wzorzec DRS (`data-i18n` + auto-detect + switcher). Źródło: **LIVE** `curl https://gek-x.nl` (211 KB, 2429 linii) — nie hub.

**Plik:** `sesje/2026-06-16/index-i18n-kz0616-dc94.html` (260 KB, 2897 linii)

### Architektura
- **Silnik i18n** (`window.GX`) wstrzyknięty w `<head>` po GSAP — niezależny od GSAP, działa nawet gdy CDN padnie.
- **Słownik 372 klucze × 3 języki** = pełny parytet (zweryfikowane: 0 braków, 0 nadmiarowych).
- NL = source of truth (1:1 z live). EN = naturalny marketing. PL = bezpośredni (Dawid — sprawdź proszę PL).
- **222 statyczne `data-i18n`** + **4 `data-i18n-attr`** (title koszyka, 2× aria „Producten", aria „Sluit", aria „Menu").
- **Dynamiczne stringi JST** (NIE psując IIFE/enkapsulacji): tablice `slideSubs`/`pillarSubs`/`subsMap`/`slideSubsMap` oraz obiekt search-sheet `D{}` przerobione na **klucze**; generowane elementy dostają `data-i18n` → `GX.apply()` aktualizuje je live przy zmianie języka.

### Mechanika
- **Auto-detect:** `?lang=` > `localStorage('gekx-lang')` > `navigator.language` > fallback `en`.
- **Switcher:** pigułki NL/EN/PL (klasy prefiksowane `i18n-*`, zero kolizji — grep przed dodaniem) w **stopce** (dole strony) **oraz w menu** (mobile). Aktywny = biała pigułka. Delegowany listener → `GX.setLang()`.
- **Persist:** `localStorage` key `gekx-lang`.
- **Blokada Google Translate:** `<html lang="nl" translate="no">` + `<meta name="google" content="notranslate">` + `.notranslate`/`translate="no"` na nazwach produktów i marce (44× `translate="no"` w pliku).
- **SEO:** `hreflang` nl/en/pl/x-default w `<head>`, `og:locale` zmieniany dynamicznie (nl_NL/en_US/pl_PL) + `og:locale:alternate`, wsparcie `?lang=` jako override.

---

## 2. Akceptacja — wynik (wszystkie 11 ✅)

| # | Kryterium | Wynik |
|---|-----------|-------|
| 1 | `node --check` na JS | ✅ silnik + 7/7 inline scriptów — 0 błędów składni |
| 2 | Playwright 375/768/1440 × 3 jęz. | ✅ **20 screenów** (9 hero + 9 PRINT + stopka/switcher + search sheet) |
| 3 | Layout identyczny, brak rozjazdu | ✅ pomiar `scrollWidth>clientWidth` na pc-d/pc-cta/fl-sub = **0 overflow** wszędzie |
| 4 | Auto-detect | ✅ locale `nl`→nl(WELKOM), `?lang=pl`→pl(WITAJ) |
| 5 | Switcher + persist | ✅ klik PL→`lang=pl`, html lang=pl, localStorage=pl, og:locale=pl_PL; reload → persist |
| 6 | Google Translate zablokowany | ✅ `translate="no"` na `<html>` (potw. w DOM) + meta |
| 7 | hreflang/og:locale/`?lang=` | ✅ 4× hreflang, og dynamiczny, ?lang override |
| 8 | `notranslate` na produktach | ✅ „Kleding bedrukken", „Roll Studio", „3D-print & NFC", Mr. GEK, GEK-X, G\|PILAR — zostają natywne |
| 9 | Zero regresji | ✅ GSAP OK, **0 pageerrors**, karuzele/Tabs OLED/G5 intro/scroll-spy działają |
| 10 | Plik na hubie | ✅ `sesje/2026-06-16/index-i18n-kz0616-dc94.html` |
| 11 | Raport na hubie | ✅ ten plik |

### Co widać na screenach (opis)
- **Hero 375 (nl/en/pl):** marka GEK-X, social bar, orbit-animacja renderują się identycznie; WELKOM/WELCOME/WITAJ.
- **PRINT 375 (nl/en/pl):** topbar-subs KLEDING.../CLOTHING.../ODZIEŻ...; „Logo op alles?"/„Logo on everything?"/„Logo na wszystkim?"; opis + feats po języku; **tytuł „Kleding bedrukken" i CTA zostają NL** (notranslate — poprawnie). PL feats robią naturalny flex-wrap (3+1), bez rozjazdu kontenera.
- **Stopka 1440 EN:** About po EN, kolumny przetłumaczone (marka G\|PRINT zostaje), switcher NL [EN] PL z aktywnym EN.
- **Search sheet 390 PL:** „Czego szukasz?" / FILAR-USŁUGA-SZUKAM / chipy usług i pytań po polsku, taby marki PRINT/SAAS/... zostają; diakrytyki (ż/ó/ł/ę/ć) OK.

---

## 3. Czego NIE ruszałem
Struktura sekcji (karuzel/dock/Tabs OLED), IIFE scope (`.pc-*`/`.dk-*`/`.zt-*` — tłumaczenie WEWNĄTRZ, enkapsulacja nietknięta), kolejność filarów (PRINT pierwszy), kolory filarów, animacje (G5 intro, dock spy), nazwy produktów, layout. Martwy blok `if(false){…}` (stary mobile fullpage) — zostawiony nietknięty.

## 4. Decyzje do akceptacji (Dawid)
1. **Fallback auto-detectu = `en`** (zgodnie ze specyfikacją z karteczki, 2×). Tzn. gość z przeglądarką np. FR/DE dostaje EN, nie NL. Jeśli wolisz „nieznany → NL" — zmiana 1 linii (`return 'en'` → `return 'nl'` w `detect()`).
2. **Switcher: stopka + menu.** Karteczka dopuszczała „topbar lub dole strony" — wybrałem dół + menu (zero ryzyka dla delikatnego topbara/hero). Jak chcesz w topbarze — dorobię.
3. **PL** — przetłumaczone naturalnie, ale to Twój język ojczysty: rzuć okiem czy ton pasuje (zwł. CTA „Zapytaj o…", hero, about).

## 5. Pułapka deployu (gdy będzie „dawaj")
- `_redirects` na live = **404** (nie istnieje) — więc nic nie skasuję, ale w manifeście deployu Netlify pilnuj reguły z karteczki.
- Deploy: tylko ten 1 plik `index.html` (site ID `20d4ea61`). **Nie deployuję bez „dawaj".**

---
— Kodzior, 16.06.2026 10:11 CET · sygn. kz0616-dc94
