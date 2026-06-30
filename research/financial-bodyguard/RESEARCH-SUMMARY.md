# RESEARCH SUMMARY — Financial Bodyguard (boekhouder NL portal)

> Data: 2026-06-30 · Research dla platformy klienckiej z AI (Sonnet) dla Financial Bodyguard BV (Eindhoven, KvK 85773247, financialbodyguard.nl)
> Zakres: 7 plików deep-research, ~25.200 słów łącznie. Wszystkie dane oznaczone źródłami; niepewne pozycje flagowane `⚠️ NIEZWERYFIKOWANE`.

## Spis plików

| # | Plik | Słów | Co w środku |
|---|------|------|-------------|
| 1 | `01-informer-api.md` | 4178 | Pełna spec OpenAPI V1+V2, auth, endpointy, limity, integracje konkurencji |
| 2 | `02-prawo-nl-ksiegowosc.md` | 3876 | BTW/IB/Box3/DBA/loonheffingen — stawki i deadliny 2026 z cytowaniami |
| 3 | `03-bankafschriften-instrukcje.md` | 2772 | Download afschriften per bank (10 banków) + formaty + PSD2 |
| 4 | `04-rynek-boekhouder-nl.md` | 3157 | Wielkość rynku, ceny, software landscape, AI, gap analysis |
| 5 | `05-bole-boekhoudera.md` | 3117 | 7 bólów boekhoudera + 16 pozycji FAQ aftrekbaarheid |
| 6 | `06-sonnet-ai-advisor-qa.md` | 4723 | Scope AI + ramy prawne + disclaimer NL + 33 pary Q&A |
| 7 | `07-google-workspace-integratie.md` | 3404 | Drive/Sheets/Calendar + AVG/OAuth + rekomendacja architektury |

---

## 1. CO ZNALEZIONE — najważniejsze ustalenia

### Informer API (plik 01)
- **Dokumentacja w pełni dostępna**, nie gated. Surowe specyfikacje OpenAPI 3.0 pobrane bezpośrednio: `api.informer.eu/docs/v1/api-docs.json` oraz `.../v2/api-docs.json`. Dwie wersje API; **V2 zalecana** (ritten/vehicles/units tylko w V1; "abonnementy" V2 = recurring invoices).
- **Auth = dwa nagłówki: `Apikey` + `Securitycode`** (beveiligingscode). Bez OAuth, bez scopes. Format wyłącznie JSON.
- **Limity zweryfikowane: 60 wywołań/min, 5000/dobę** na klucz (nagłówki `X-RateLimit-*` / `X-DailyLimit-*`). Klucze sprzed 2024-04-10 bez limitu.
- **Polling-only — brak webhooków. Brak sandboxa.** Sync przyrostowy przez pole `last_edit` (granularność dzienna).
- **Two-way (zapis):** relacje/kontakty, dokumenty sprzedaży (faktury, oferty, zamówienia, ontvangsten, memoriaal). **Read-only:** grootboek, BTW, producten. Brak DELETE dokumentów. PDF faktur dostępne.
- **Konkurencja dojrzała** (Appfront, Zenvoices, Inserve, Employes, Speedbooks, Webwinkelfacturen), ale **nie znaleziono gotowego "client portalu" jako produktu** → potencjalna luka.
- Gotchas: relacja = jednocześnie klient i dostawca; limit 1 załącznik / 8 MB PDF; brak prawdziwej wielowalutowości; brak SSO użytkownika końcowego.

### Prawo NL 2026 (plik 02)
- **BTW logies 9% → 21% od 1.01.2026** (hotele, Airbnb, parki wakacyjne) — dotyka klientów noclegowych. Stawkę 9% na kulturę/media/sport utrzymano (podwyżkę odwołano).
- **Zelfstandigenaftrek €1.200** (z €2.470 w 2025; cel €900 w 2027). Ze startersaftrek €2.123 → maks €3.323.
- **Gebruikelijk loon DGA €58.000** (z €56.000).
- **Box 3:** reżim przejściowy, forfait 1,28%/6,00%/2,70%, tarief 36%, heffingsvrij €59.357; od 1.07.2025 **tegenbewijsregeling** (realny dochód po Kerstarrest).
- **Wet DBA:** verzuimboetes zawieszone do 2027, ale **nowe vergrijpboetes 10–100%** przy umyślności; naheffing loonheffingen wstecz do 1.01.2025. Nowych modelovereenkomsten nie zatwierdza się od 6.09.2024.
- Deadliny BTW kwartaał: **30.04 / 31.07 / 31.10 / 31.01**. Urencriterium **1.225 u**. MKB-winstvrijstelling **12,7%**. KOR-grens **€20.000** (3-letni okres zniesiony). Bewaarplicht 7 lat (10 dla nieruchomości).

### Bankafschriften (plik 03)
- Solidnie zweryfikowane flow web: **ING, ABN AMRO, ASN/SNS/RegioBank** (de Volksbank), **Triodos, bunq, Van Lanschot, Knab**; Rabobank OK (dwa interfejsy: zwykły + Professional).
- **Rekomendacja: proś klientów o CAMT.053 (XML)** — maszynowy, importowalny; PDF tylko do archiwum; MT940 starszy ale ok; CSV nierówny.
- Eksport maszynowy zwykle **tylko w wersji webowej** — apki mobilne dają głównie PDF (oznaczone jako niepewne dla większości banków).
- Alternatywa: **bankkoppeling / PSD2 feed** w samym software zamiast ręcznego pobierania.

### Rynek (plik 04)
- **~18.800 biur** SBI 69203 (~24k z administratiekantoren), **~1,2 mln ZZP'erów** jako baza klientów.
- Ceny: €65–100/uur, €80–150/mies (ZZP), BTW ~€45/kw, IB €170–250.
- 11 pakietów software z cenami i otwartością API; Informer ma realnie otwarte API + Peppol + pozycję AI-first.
- **3 luki rynkowe:** (1) **wielojęzyczność, zwłaszcza polski** — żaden liczący się portal nie obsługuje PL → obronny monopol; (2) **konwersacyjny AI doradca dla klienta końcowego** na jego danych (istniejące AI celuje w back-office); (3) **proaktywny document collection** (rynek = pasywny upload).

### Bóle boekhoudera (plik 05)
- **#1 ból = zbieranie dokumentów od klientów** — korzeń łańcucha (deadliny, komunikacja, brak skalowania to pochodne), najłatwiejsze ROI. Atakować pierwsze.
- Differentiator #2: **warstwa wielojęzyczna** (PL/EN ondernemers).
- 16 pozycji FAQ aftrekbaarheid z poprawnymi odpowiedziami 2026 (km €0,23→€0,25, eten 80%/drempel, werkkleding 70cm² logo, werkruimte 30%/70%-criterium, telefoon, studie, representatie, relatiegeschenken).

### Sonnet AI advisor (plik 06)
- **33 pary Q&A** (NL + PL, odpowiedź NL + nota PL), z flagami **[D]** disclaimer / **[E]** eskalacja. Tematy: aftrekbare kosten, BTW, IB/ulgi, facturatie, document delivery, KvK, ZZP vs BV, proces/portal.
- **Ramy prawne:** belastingadviseur **NIE** jest tytułem chronionym, ale **RA/AA SĄ** (Wab). AI może dawać **informację ogólną**, nie **indywidualne bindend advies** → wymagany disclaimer (NL+PL) + 10 reguł eskalacji do człowieka.
- Fakty 2026 zweryfikowane (zelfstandigenaftrek €1.200, urencriterium 1.225, MKB 12,7%, KOR €20.000, km €0,25 itd.).

### Google Workspace (plik 07)
- **Storage: shared drive + service account (lub scope `drive.file`), NIGDY `drive`/`drive.readonly`** — restricted scopes = coroczny płatny CASA assessment. Dla danych finansowych rozważyć dedykowany object-storage EU jako source-of-truth.
- **Dane app: PostgreSQL (EU) jako source-of-truth, Sheets tylko jednokierunkowy read-model** (arkusz nie nadaje się na bazę: 300 req/min, brak transakcji).
- **Booking: Cal.com self-hosted (EU)**, nie Calendly, nie czysty Calendar API (unika restricted scopes + AVG clean).
- AVG: zaakceptować Google CDPA + Data Regions = Europe, łańcuch verwerkersovereenkomst (klient → biuro → portal → Google), DPIA dla dokumentów finansowych.

---

## 2. CZEGO BRAKUJE / LIMITY RESEARCHU

- **Informer:** brak sandboxa potwierdzony → testy trzeba robić na realnym koncie (lub koncie Martijna). Przykłady request/response pochodzą ze spec OpenAPI, nie z żywych wywołań — przed budową warto odpalić jeden realny call.
- **Bankafschriften:** eksport MT940/CAMT.053 z **aplikacji mobilnych** niepotwierdzony dla większości banków (UI banków się zmienia — przed publikacją instrukcji do klientów zweryfikować na żywym koncie). Plik 03 ma 2772 słowa (lekko pod progiem 3000) — treść kompletna, ale można dociągnąć więcej screenshotów/edge case'ów.
- **Box 3 / Wet DBA:** stan prawny dynamiczny (orzecznictwo, nowa ustawa Box 3 w toku) — przy uruchomieniu produktu odświeżyć.
- **Status regulacyjny samego AI** dla tego use-case (czy AI-doradca = belastingadvies w sensie prawnym) wymaga konsultacji z prawnikiem NL — research daje ramy, nie wiążącą opinię.
- **Ceny software** i niektóre dane rynkowe to częściowo szacunki (oznaczone `⚠️ NIEZWERYFIKOWANE`).
- Placeholdery do dopasowania pod realny produkt: nazwy zakładek portalu, wewnętrzne terminy biura, próg opłacalności BV.

---

## 3. REKOMENDACJE (CO BUDOWAĆ)

1. **Rdzeń produktu = document collection w języku klienta.** Mobilny upload/scan + automatyczne eskalujące przypomnienia + checklista braków per kwartaał + status zlecenia. To #1 ból i najszybsze ROI dla biura.
2. **Wielojęzyczność PL/NL/EN jako differentiator nr 1** — nie tylko UI, ale AI rozmawiający po polsku o holenderskich podatkach. Najsłabsza konkurencja, duża populacja polskich ZZP'erów.
3. **Sonnet AI advisor: zakres "informacja ogólna" + twardy disclaimer + reguły eskalacji.** Wbudować 33 Q&A jako bazę wiedzy, odświeżać kwoty co rok. Każda odpowiedź podatkowa = disclaimer + opcja "przekaż do księgowego".
4. **Integracja Informer V2, polling przyrostowy po `last_edit`**, respektować limit 60/min · 5000/dzień. Two-way na relacje + faktury; resztę traktować read-only. Zbudować własną warstwę cache (brak webhooków).
5. **Architektura danych: PostgreSQL EU jako source-of-truth.** Google Drive (shared drive + service account, scope `drive.file`) jako kanał dokumentów; Sheets tylko jako read-model dla księgowego. Cal.com self-hosted na booking.
6. **AVG od początku:** verwerkersovereenkomst w całym łańcuchu, Data Regions EU, DPIA. Dane finansowe = wrażliwe.
7. **Pricing model produktu:** €99/mies abonament mieści się w realiach rynku (biuro płaci €80–150/mies za klienta) — pozycjonować jako narzędzie oszczędzające godziny *niet-declarabel*, nie jako koszt.

---

## 4. NASTĘPNE KROKI

- [ ] Odpalić jeden realny call Informer V2 na koncie Martijna (weryfikacja spec).
- [ ] Konsultacja prawnika NL: status AI-doradcy vs belastingadvies + treść disclaimera.
- [ ] Zweryfikować flow eksportu afschriften na żywych kontach (zwłaszcza apki mobilne) przed publikacją instrukcji.
- [ ] Dopasować placeholdery (nazwy zakładek, terminy biura) do realnego procesu Martijna.
- [ ] Odświeżyć stawki/deadliny na 2027 przy każdym roku podatkowym.

---
*Research: 7 agentów równoległych z web access, każdy weryfikował dane źródłami. Pełne cytowania w sekcjach `## Źródła` poszczególnych plików.*
