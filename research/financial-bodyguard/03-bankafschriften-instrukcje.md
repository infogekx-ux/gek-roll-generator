# Jak pobierać bankafschriften (wyciągi bankowe) z holenderskich banków

**Instrukcja dla klientów biura rachunkowego (boekhouder / accountant)**
Stan na: czerwiec 2026 (zweryfikowane wobec oficjalnych stron banków 2025/2026).

---

## Wprowadzenie — co i po co pobieramy

Twój księgowy (boekhouder) potrzebuje Twoich transakcji bankowych, żeby zaksięgować przychody i koszty. Są dwa światy plików:

- **PDF (rekeningafschrift)** — to elektroniczna wersja papierowego wyciągu. Ładnie wygląda, nadaje się do archiwum (archief), ale **księgowy NIE może go zaimportować** do programu księgowego. Maszyna nie czyta z niego danych.
- **MT940 / CAMT.053 / CSV** — to pliki "maszynowe" (machine-readable). Program księgowy (boekhoudsoftware) wczytuje je automatycznie i tworzy z nich pozycje księgowe.

**Najważniejsza zasada dla klienta:** kiedy księgowy prosi o "bankafschriften do importu", prawie zawsze chodzi o **CAMT.053** (lub starszy MT940), a **nie** o PDF. PDF wysyłaj tylko wtedy, gdy ktoś wyraźnie prosi o "kopię wyciągu" do wglądu.

### Ważna zmiana 2025/2026: MT940 znika, wchodzi CAMT.053

SWIFT (międzynarodowy system komunikatów bankowych) wycofuje format **MT940**. Holenderskie banki przechodzą na **CAMT.053** (XML, standard ISO 20022) jako nowy standard. Daty zależą od banku — np. ING/ABN AMRO komunikowały koniec MT940 od **listopada 2025**, Rabobank zapowiedział zakończenie wsparcia formatów MT od **15 listopada 2026**. Praktyczny wniosek: **jeśli masz wybór, pobieraj CAMT.053.** Jest nowszy, zawiera więcej danych (structured references, end-to-end ID, waluty) i większość programów księgowych już go obsługuje.

> ⚠️ Uwaga ogólna: interfejsy bankowości internetowej i aplikacji mobilnych zmieniają się regularnie. Kroki opisane poniżej zostały zweryfikowane wobec oficjalnych stron pomocy banków, ale jeśli menu wygląda inaczej — szukaj słów kluczowych: **"Afschriften"**, **"Downloaden"**, **"Transacties downloaden"**, **"Bij- en afschrijvingen downloaden"**, **"Boekhoudexport"**.

---

## ING

### Web (Mijn ING — internetbankieren)

1. Zaloguj się na **Mijn ING** (ing.nl) na komputerze.
2. Wybierz **'Service'** → **'Af- en bijschrijvingen downloaden'** (pobieranie obciążeń i uznań).
   - (Dla wyciągów PDF jako dokumentu: **'Service' → 'Afschriften'** / "Afschriften en overzichten".)
3. Zaznacz konto / konta, których dotyczy pobieranie.
4. Wybierz **okres (periode)** — zakres dat (datum vanaf / datum tot) lub kwartał.
5. Wybierz **format pliku**.
6. Kliknij **Download**.

### App (ING-app / Mijn ING-app — particulier)

1. Otwórz aplikację ING i zaloguj się.
2. Stuknij w **konto płatnicze (betaalrekening)**.
3. Stuknij ikonę **Instellingen** (koło zębate / ustawienia).
4. Wybierz **'Afschriften downloaden'**.
5. Wpisz **datum begin** i **datum eind** (data początkowa i końcowa).
6. Wybierz format (w aplikacji typowo **PDF** — najbardziej przypomina papierowy wyciąg).
7. Stuknij **Download** — plik PDF wyświetli się; możesz go udostępnić mailem lub wydrukować ikoną "udostępnij" w prawym górnym rogu.

> ⚠️ NIEZWERYFIKOWANE: pełna lista formatów eksportu maszynowego (MT940/CAMT) w samej aplikacji mobilnej. W praktyce eksport CAMT.053/MT940 robi się w wersji webowej; aplikacja służy głównie do PDF.

### Dostępne formaty

ING (web): **XLS, PDF, TXT, MT940, CAMT.053**. (CSV nie jest osobno wyróżniany — odpowiednikiem dla arkusza jest XLS/TXT.)
Aplikacja: praktycznie **PDF**.

### Zakelijk vs particulier

- **Particulier:** PDF + eksport af-/bijschrijvingen przez "Service".
- **Zakelijk:** to samo menu "Service" → "Af- en bijschrijvingen downloaden"; firmy najczęściej pobierają **CAMT.053** (lub MT940 do końca jego wsparcia) do importu w boekhoudsoftware. ING oferuje też papierloos bankieren (cyfrowe wyciągi).

---

## Rabobank

### Web — Rabobank Internetbankieren / Rabo Business Banking

**Wariant prosty (osoby prywatne i mniejsze konta):**
1. Zaloguj się do **Rabobank internetbankieren**.
2. Kliknij **'Transacties downloaden'**.
3. Wybierz właściwe konto / konta.
4. Wybierz **okres** — do **13 miesięcy** wstecz.
5. Wybierz **format pliku** (np. CAMT.053 .xml lub MT940 Structured .swi).
6. Pobierz.

**Wariant Rabo Business Banking Professional (firmy):**
1. Zaloguj się do **Rabo Business Banking Professional**.
2. Przejdź **'Service' → 'Bestanden' → 'Exporteren mutaties'**.
3. Wybierz **CAMT.053** (.xml) lub MT940 Structured.
4. Wybierz konta i okres, eksportuj.

### App (Rabo Bankieren-app)

1. Otwórz aplikację Rabo Bankieren i zaloguj się.
2. Wejdź w konto → poszukaj **'Afschriften'** / **'Downloaden'** (PDF wyciągu).

> ⚠️ NIEZWERYFIKOWANE: eksport CAMT.053/MT940 bezpośrednio z aplikacji mobilnej Rabobank. Eksport maszynowy do księgowości robi się w internetbankieren / Business Banking Professional. PDF jest dostępny w aplikacji.

### Dostępne formaty

Rabobank: **PDF**, **CAMT.053 (.xml)**, **MT940 Structured (.swi)**, oraz intraday: CAMT.052 (.xml) i MT942 Structured. (CSV/Excel zwykle przez eksport w Business Banking.)

### Ważne daty

Rabobank zapowiedział **zakończenie wsparcia formatów MT (MT940/MT942) od 15 listopada 2026** — przechodź na CAMT.053 / CAMT.052.

### Zakelijk vs particulier

- Particulier: "Transacties downloaden" + PDF.
- Zakelijk: pełny eksport mutacji przez Rabo Business Banking Professional (Service → Bestanden → Exporteren mutaties). Dostępne też bezpośrednie koppelingi (PSD2) z pakietami księgowymi.

---

## ABN AMRO

### Web — Internet Bankieren

**Particulier (wyciągi i obciążenia/uznania):**
1. Zaloguj się do **Internet Bankieren** na komputerze.
2. Przejdź **'Zelf regelen' → 'Overzichten en afschriften' → 'Bij- en afschrijvingen downloaden'**.
3. Zaznacz konto / konta.
4. Wybierz **okres** — do **18 miesięcy** wstecz.
5. Wybierz format (PDF / CAMT.053 / MT940 / XLS / TXT).
6. Pobierz.

**Zakelijk (eksport do księgowości):**
- **'Zelf regelen' → 'Overzichten en afschriften' → 'Bij- en afschrijvingen downloaden'** → zaznacz konta → wybierz **okres** → wybierz **CAMT.053 (XML)** → pobierz.

### App (ABN AMRO Mobiel Bankieren / Grip)

1. Otwórz aplikację i zaloguj się.
2. Wejdź w konto → poszukaj wyciągów/**'Afschriften'** (PDF).

> ⚠️ NIEZWERYFIKOWANE: pobieranie eksportu CAMT.053/MT940 w aplikacji mobilnej ABN AMRO. Eksport maszynowy realizuj w Internet Bankieren (web). PDF dostępny w aplikacji.

### Dostępne formaty

ABN AMRO: **XLS, PDF, TXT, MT940, CAMT.053**.

### Zakelijk vs particulier

- Particulier: PDF + bij-/afschrijvingen (do 18 mies.).
- Zakelijk: eksport CAMT.053 (XML) dla boekhoudsoftware, plus możliwość bezpośrednich koppelingów. MT940 wycofywany (od listopada 2025) na rzecz CAMT.053.

---

## ASN Bank

ASN należy do **de Volksbank** i dzieli platformę z SNS i RegioBank — przepływy są niemal identyczne.

### Web — ASN Online Bankieren

1. Zaloguj się do **ASN Online Bankieren**.
2. Przejdź do **rekeningoverzicht** (przegląd konta), którego transakcje chcesz pobrać.
3. Kliknij link **'transacties downloaden'**.
4. Wybierz **okres** (zakres dat).
5. Wybierz format — **CAMT.053** (do importu) lub PDF/CSV.
6. Kliknij **Downloaden**.
7. Plik CAMT.053 pobiera się jako **ZIP** — rozpakuj go, w środku jest plik **.xml**.
8. Wczytaj .xml do programu księgowego.

### App (ASN Bankieren-app)

> ⚠️ NIEZWERYFIKOWANE: ścieżka eksportu CAMT.053 w aplikacji mobilnej ASN. Wyciągi PDF (rekeningafschriften) zwykle dostępne w aplikacji w sekcji "Downloads/Afschriften"; eksport maszynowy realizuj w wersji webowej.

### Dostępne formaty

ASN: **CAMT.053** (główny do importu), **PDF**, **CSV**. **MT940 jest wycofany / nieobsługiwany** — używaj CAMT.053.

### Zakelijk vs particulier

- Oba typy kont: ten sam link "transacties downloaden" w rekeningoverzicht.
- Zakelijk: dostępna **ASN Boekhoudkoppeling** (automatyczne połączenie z pakietami typu SnelStart, e-Boekhouden.nl, Exact) jako alternatywa dla ręcznego CAMT.053.

---

## Bunq

Bunq jest "mobile-first" — najwięcej robi się w aplikacji, ale jest też **web.bunq.com**.

### App (bunq-app)

**Metoda 1 — przez Profil:**
1. Stuknij **Profile** (lewy górny róg).
2. Wybierz **Accounting** (Boekhouding).
3. Wybierz **Export Statement** (Exporteren afschrift).
4. Wskaż konto i **okres**, wybierz **format**.
5. Stuknij **Export Statement**.

**Metoda 2 — przez ustawienia konta:**
1. Wejdź na **Home**.
2. Wybierz konkretne konto (Bank Account).
3. Kliknij **Settings** (Instellingen).
4. Kliknij **Export statement**.
5. Wskaż okres i format.
6. Stuknij **Export Statement**.

- Opcjonalnie (PDF, od wersji 22.12+): przełącznik **"Include Attachments"** dołącza zdjęcia/załączniki dodane do płatności.

### Web (web.bunq.com)

- Analogiczna funkcja eksportu jak w aplikacji.

### Dostępne formaty

Oficjalna pomoc bunq wymienia: **PDF, CSV, MT940**. Dla celów księgowych bunq udostępnia też **CAMT.053** (potwierdzane m.in. przez dostawców księgowości jak Yuki).

> ⚠️ Uwaga: dostępność CAMT.053 zależy od typu konta/wersji — w oficjalnym artykule pomocy o eksporcie wymienione są PDF/CSV/MT940. Jeśli księgowy chce CAMT.053, sprawdź w eksporcie, czy format jest na liście; jeśli nie — daj MT940 lub użyj bankkoppeling PSD2.

### Wymóg / różnice

- Konto **musi być zweryfikowane (verified)** — z niezweryfikowanego konta eksport nie zadziała.
- Kroki są **takie same dla kont prywatnych i firmowych**.

---

## Knab

### Web — Internetbankieren (Knab)

**Wariant nowy (Boekhoudexport, CAMT.053):**
1. Zaloguj się do środowiska bankowości Knab (web) na komputerze.
2. Kliknij swoje **zakelijke betaalrekening** (firmowe konto), a potem ikonę **trzech kropek (…)**.
3. Kliknij **'Boekhoudexport'**.
4. Wybierz format **CAMT.053**.
5. Kliknij **'Download'** i zapisz plik.

**Wariant przez "Transacties downloaden":**
1. Zaloguj się do **'Internetbankieren'** na komputerze.
2. Przejdź **'Betalen en ontvangen' → 'Downloads en documenten' → 'Transacties downloaden'**.
3. Wybierz konto / konta firmowe.
4. Wybierz format **CAMT.053** (lub MT940 dopóki wspierany).
5. Ustaw **okres** i pobierz.

### App (Knab-app)

> ⚠️ NIEZWERYFIKOWANE: ścieżka eksportu MT940/CAMT.053 w aplikacji mobilnej Knab. Eksport księgowy (Boekhoudexport) realizuj w wersji webowej.

### Dostępne formaty

Knab: **CAMT.053** (zalecany), **MT940** (do wycofania), **PDF** (rekeningafschrift), **CSV**.

### Zakelijk vs particulier

- Knab jest mocno nastawiony na ZZP/firmy — funkcja **'Boekhoudexport'** dotyczy kont firmowych.
- MT940 wycofywany od listopada 2025 → przechodź na CAMT.053.

---

## RegioBank

RegioBank należy do **de Volksbank** (jak SNS i ASN) — interfejs i kroki są niemal identyczne jak w SNS/ASN.

### Web — Mijn RegioBank

**Wariant PDF (wyciągi / bij- en afschrijvingen):**
1. Zaloguj się do **'Mijn RegioBank'**.
2. Przejdź **'Zelf regelen' → 'Rekeningen'**.
3. Pod nagłówkiem **"Downloaden"** wybierz **'Bij- en afschrijvingen'**.
4. Wybierz konto / konta.
5. Określ **okres**.
6. Wybierz format **'PDF'** (lub CSV / CAMT.053) i kliknij **'Download'**.

**Wariant CAMT.053 (do księgowości) — przez rekeningoverzicht:**
1. Zaloguj się do **Mijn RegioBank**.
2. Wejdź w **rekeningoverzicht** danego konta.
3. Kliknij **'transacties downloaden'**.
4. Wybierz okres i format **CAMT.053**.
5. Pobierz (ZIP → rozpakuj .xml).

- Historię (stare wyciągi) możesz pobierać do **5 lat wstecz** w Mijn RegioBank.

### App (RegioBank-app)

> ⚠️ NIEZWERYFIKOWANE: pełna ścieżka eksportu w aplikacji mobilnej RegioBank. PDF wyciągów zwykle dostępny w aplikacji; eksport CAMT.053 realizuj w wersji webowej.

### Dostępne formaty

RegioBank: **PDF, CSV, CAMT.053**. (MT940 wycofywany na rzecz CAMT.053.)

### Zakelijk vs particulier

- Particulier: PDF/CSV przez "Zelf regelen → Rekeningen → Downloaden".
- Zakelijk: **CAMT.053** + możliwość handmatige export do pakietu księgowego oraz koppeling boekhoudpakket.

---

## SNS

SNS należy do **de Volksbank** (jak ASN i RegioBank) — kroki identyczne.

### Web — Mijn SNS

1. Zaloguj się do **'Mijn SNS'**.
2. Przejdź do **rekeningoverzicht** (przegląd konta), z którego pobierasz.
3. Kliknij link **'transacties downloaden'**.
4. Wybierz, które dane chcesz pobrać — np. konkretny **okres (periode)**.
5. Wybierz format **'CAMT.053'**.
6. Kliknij **'Downloaden'** (plik przychodzi jako ZIP → rozpakuj .xml).

> Ważne: plik CAMT.053 jest zawsze **opóźniony o jeden dzień roboczy** — transakcje z dzisiejszej daty nie są w nim ujęte.

### App (SNS-app)

> ⚠️ NIEZWERYFIKOWANE: ścieżka eksportu CAMT.053 w aplikacji mobilnej SNS. PDF wyciągów (rekeningafschriften) zwykle dostępny w aplikacji; eksport księgowy realizuj w Mijn SNS (web).

### Dostępne formaty

SNS: **CAMT.053** (główny do importu), **PDF**, **CSV**. (MT940 wycofywany.)

### Zakelijk vs particulier

- Oba typy: ten sam link "transacties downloaden".
- Zakelijk (ZZP): dedykowana strona "CAMT.053 voor boekhoudpakketten" + koppeling boekhoudpakket.

---

## Triodos

### Web — Internet Bankieren (Triodos)

**Wyciągi / rekeningafschriften:**
1. Zaloguj się do **Internet Bankieren**.
2. Przejdź **'Zelf regelen' → 'Download' → 'Rekeningafschriften'**.
3. Wybierz wyciąg i pobierz.

**Konta inwestycyjne (effecten/beleggingen):**
1. Zaloguj się i wybierz konto inwestycyjne.
2. Przewiń do **'Transacties'**.
3. Kliknij transakcję → **'Download'**.

### App (Triodos-app)

1. Otwórz aplikację i zaloguj się.
2. Wybierz **'Meer' → 'Downloads' → 'Rekeningafschriften'**.
3. Wybierz konto.
4. Znajdź żądany wyciąg i stuknij.
5. Stuknij ikonę strzałki, aby pobrać.

### Dostępne formaty

Triodos: **CSV, Excel, CAMT.053, MT940 (structured), PDF**.

> Wskazówka techniczna: każdy bank ma swój "dialekt" MT940. Przy imporcie pliku MT940 z Triodos **wybierz w programie księgowym "Triodos Bank"**, żeby uniknąć błędów parsowania.

### Zakelijk vs particulier

- Te same ścieżki i formaty dla particulier i zakelijk.
- Zakelijk: dostępna **Triodos Boekhoudkoppeling** (automatyczne połączenie z administracją).

---

## Van Lanschot (Van Lanschot Kempen)

Bank private banking — terminologia czasem "Mijn Private Bank".

### Web — Online Bankieren

**Eksport mutacji (do księgowości):**
1. Zaloguj się do Van Lanschot online banking.
2. Kliknij **'Betalen'** → **'Beheer'** → **'Exporteren mutaties'**.
   - (Alternatywnie spotykana ścieżka: **'Documenten' → 'Rekeningafschrift' → 'Exporteren mutaties'**.)
3. Wybierz **zakelijke / betaalrekening**.
4. Wybierz **datum begin** i **datum eind**.
5. Wybierz format **'MT940 Structured'** lub **'CAMT.053'**.
6. Kliknij **'Exporteren'**, następnie **'Opslaan'**, aby zapisać plik w folderze na komputerze.

**Konta inwestycyjne (effectenrekeningen):**
- W **Mijn Private Bank** można pobrać MT940 dla kont płatniczych oraz dla transakcji gotówkowych kont inwestycyjnych (osobna handleiding "MT940 Effectenrekeningen").

### App (Van Lanschot-app)

> ⚠️ NIEZWERYFIKOWANE: ścieżka eksportu MT940/CAMT.053 w aplikacji mobilnej. PDF wyciągów dostępny; eksport mutacji realizuj w online banking (web).

### Dostępne formaty

Van Lanschot: **MT940 (.MT940 / Structured)**, **CAMT.053 (.CAMT053)**, **PDF** (rekeningafschrift).

> CAMT.053 jest następcą MT940 — bezpieczniejszy, zapobiega podwójnym mutacjom (dubbele mutaties) i daje więcej informacji.

### Zakelijk vs particulier

- Particulier/private: PDF wyciągów + eksport mutacji.
- Zakelijk: MT940/CAMT.053 do importu; dostępne też koppelingi (Informer, Yuki itd.) i połączenie automatyczne (PSD2).

---

# Sekcja przekrojowa

## Który format chce naprawdę boekhouder?

Krótka odpowiedź: **CAMT.053** (a do czasu jego wycofania ewentualnie **MT940**). **Nie PDF.**

| Format | Co to jest | Do czego | Czy księgowy może importować? |
|---|---|---|---|
| **PDF** | Cyfrowy obraz papierowego wyciągu (rekeningafschrift) | Archiwum (archief), wgląd, dowód | **NIE** — nie da się zaimportować danych |
| **CSV** | Tabela transakcji (tekst rozdzielany przecinkami) | Czasem import, analiza w Excelu | Częściowo — zależy od pakietu; struktura bywa różna między bankami, ryzyko błędów |
| **MT940** | Stary tekstowy format SWIFT z wyciągami | Import do księgowości (format wycofywany 2025/2026) | **TAK**, ale przestarzały; "dialekty" per bank |
| **CAMT.053** | Nowoczesny XML wg ISO 20022 | **Import do księgowości (nowy standard)** | **TAK** — preferowany |

**Dlaczego CAMT.053, a nie PDF:** PDF jest "tylko do odczytu" dla człowieka. Maszyna nie wyciągnie z niego linii transakcji w sposób pewny. Import PDF-ów = ręczne przepisywanie = czas + błędy. CAMT.053 zawiera ustrukturyzowane dane (kwoty, daty, IBAN-y kontrahentów, opisy, end-to-end ID, oznaczenia walut), które program księgowy wczytuje automatycznie i przypisuje do właściwych kont.

**Dlaczego nie tylko CSV:** CSV bywa "płaski" i różni się między bankami (kolejność kolumn, format daty, separator). Część programów go obsługuje, ale CAMT.053 jest jednoznaczny i standaryzowany — mniej niespodzianek.

### O co konkretnie prosić klienta

> "Proszę o wyciągi za **[kwartał / zakres dat]** wszystkich kont firmowych w formacie **CAMT.053** (plik XML, zwykle w ZIP). Jeśli Twój bank nie ma jeszcze CAMT.053 w eksporcie — daj **MT940**. **PDF tylko jeśli wyraźnie poproszę** (do archiwum)."

Dodatkowe wskazówki dla klienta:
- Pobieraj **całe okresy** (cały kwartał/miesiąc), nie pojedyncze transakcje — księgowy potrzebuje salda otwarcia i zamknięcia.
- Pliki CAMT.053 z banków de Volksbank (SNS/ASN/RegioBank) i innych przychodzą jako **ZIP** — rozpakuj przed wysłaniem albo wyślij ZIP, jeśli księgowy tak woli.
- Pamiętaj o **opóźnieniu jednego dnia roboczego** (CAMT.053 nie zawiera transakcji z dzisiejszej daty) — pobieraj po zamknięciu okresu.

## PSD2 / bezpośrednie bankkoppelingi vs ręczne pobieranie

Zamiast ręcznie pobierać i wysyłać pliki, większość programów księgowych oferuje **automatyczne połączenie z bankiem**. Są dwa rodzaje:

1. **Koppeling PSD2 (bankkoppeling).** Na mocy europejskiej dyrektywy **PSD2** banki muszą — za **zgodą posiadacza konta** — udostępniać licencjonowanym stronom trzecim bezpieczny dostęp do danych o transakcjach. Po jednorazowym ustawieniu i autoryzacji, transakcje **wczytują się automatycznie i na bieżąco** do administracji. Zgodę PSD2 zwykle trzeba **odnawiać co ~90/180 dni**.
2. **Boekhoudkoppeling banku** (np. ASN Boekhoudkoppeling, Triodos Boekhoudkoppeling, koppelingi Rabobank/ING dla pakietów jak Exact, SnelStart, e-Boekhouden.nl) — dedykowane, często stabilniejsze połączenie udostępniane przez sam bank.

**Zalety automatycznego połączenia (PSD2/boekhoudkoppeling):**
- Księgowość **zawsze aktualna**, realtime wgląd w przychody i wydatki.
- Mniej pracy ręcznej i mniejsze ryzyko błędów — po utworzeniu reguł księgowania (boekingsinstructies) pozycje przypisują się automatycznie.
- Brak ręcznego pobierania/uploadowania plików co miesiąc.

**Kiedy mimo to ręczne pobieranie (CAMT.053/MT940):**
- Bank lub typ konta nie obsługuje koppelingu w Twoim pakiecie.
- Nie chcesz dawać ciągłego dostępu (jednorazowe przekazanie pliku zamiast stałego połączenia).
- Konta zagraniczne / specyficzne (np. niektóre konta inwestycyjne).
- Połączenie PSD2 wygasło i czeka na odnowienie — w międzyczasie dajesz plik ręcznie.

Banki obsługujące automatyczne połączenia (potwierdzane przez dostawców księgowości) to m.in.: **Knab, ABN AMRO, Rabobank, SNS, ASN, RegioBank, Triodos, ING, Van Lanschot Kempen, bunq, Revolut.**

**Rekomendacja:** dla firm prowadzonych na bieżąco — ustawcie z księgowym **bankkoppeling (PSD2)**; to oszczędza najwięcej czasu. Ręczne **CAMT.053** trzymajcie jako metodę zapasową i do banków/kont, których koppeling nie obejmuje.

---

## Źródła

- ING — Bestandsformaten en dagafschriften: https://www.ing.nl/zakelijk/betalen/betalingen-doen/bestandsformaten
- ING — MT940-bestand downloaden: https://www.ing.nl/zakelijk/financieren/mt940-downloaden
- ING — Zakelijk digitale afschriften / papierloos bankieren: https://www.ing.nl/zakelijk/digitaal-bankieren/mijn-ing/papierloos-bankieren
- ING — Afschriften bekijken en downloaden (particulier): https://www.ing.nl/particulier/digitaal-bankieren/afschriften-downloaden
- ING — Afschriften en overzichten: https://www.ing.nl/particulier/digitaal-bankieren/mijn-ing/afschriften-en-overzichten
- Rabobank — Informatie over bestandsformaten (Business Banking Professional): https://www.rabobank.nl/bedrijven/service/online-bankieren/informatie-over-bestandsformaten
- Rabobank — Hoe download ik een MT940-bestand: https://www.rabobank.nl/bedrijven/zakelijk-financieren/alles-over-financieren/hoe-download-ik-een-mt940-bestand
- Rabobank — Formats, documentation and downloads: https://www.rabobank.com/products/manage-my-trade-and-cash/rabo-business-banking/downloads-and-documentation
- ABN AMRO — Exporteren naar je boekhoudprogramma: https://www.abnamro.nl/nl/zakelijk/internet-bankieren/bestanden-downloaden.html
- ABN AMRO — Rekeningafschriften en bij- en afschrijvingen downloaden (prive): https://www.abnamro.nl/nl/prive/betalen/bij-en-afschrijvingen/downloaden.html
- ABN AMRO — Keuze MT940/942 vs CAMT.053/052: https://www.abnamro.nl/nl/zakelijk/producten/betalen/sepa/rapportages/keuze-formaat.html
- ASN Bank — CAMT.053 handmatig exporteren: https://www.asnbank.nl/zakelijk/boekhoudpakket-koppelen/camt053.html
- ASN Bank — Formaatbeschrijving CAMT.053: https://www.asnbank.nl/downloads/formaatbeschrijving-camt053.html
- bunq — How do I export a bank statement?: https://help.bunq.com/articles/how-do-i-export-a-bank-statement
- bunq — What types of bank statements can I export?: https://help.bunq.com/articles/what-types-of-bank-statements-can-i-export
- bunq export files (Yuki): https://support.yuki.nl/en/support/solutions/articles/80000787495-bunq-bank-export-files
- Knab — Waar kan ik mijn transacties in MT940-formaat downloaden: https://www.knab.nl/contact/veelgestelde-vragen/content/waar-kan-ik-mijn-transacties-in-mt940-formaat-downloaden
- Knab — Banktransacties exporteren (DigiBoox): https://www.digiboox.app/nl/support/bankimport/knab-bankexport
- RegioBank — CAMT.053 voor boekhoudpakketten: https://www.regiobank.nl/service/online-bankieren/camt053-voor-boekhoudpakketten.html
- RegioBank — Rekeningafschriften downloaden: https://www.regiobank.nl/service/online-bankieren/rekeningafschriften-downloaden.html
- RegioBank — CAMT.053 handmatige export (zakelijk): https://www.regiobank.nl/zakelijk/service/koppeling-boekhoudpakket/camt.053.html
- SNS — CAMT.053 voor boekhoudpakketten: https://www.snsbank.nl/zakelijk/zzp/camt053-voor-boekhoudpakketten.html
- SNS — Formaatbeschrijving CAMT.053: https://www.snsbank.nl/particulier/support/download-tonen-op-pagina/sns-formaatbeschrijving-camt053.html
- Triodos — In welke bestandstypen kan ik overzichten downloaden: https://www.triodos.nl/veelgestelde-vragen/in-welke-bestandstypen-kan-ik-overzichten-downloaden?id=ecea2482a3bc
- Triodos — Boekhoudkoppeling: https://www.triodos.nl/service/zakelijk/betalen/boekhoudkoppeling
- Van Lanschot Kempen — Handleiding MT940 Effectenrekeningen: https://www.vanlanschotkempen.com/nl-nl/private-banking/help/online-bankieren/handleiding-mt940-effectenrekeningen
- Van Lanschot Kempen — Handleiding downloaden MT940 (PDF): https://www.vanlanschotkempen.com/-/media/files/documents/private-banking/handleiding/handleiding-downloaden-mt940-van-lanschot-kempen.ashx
- CAMT.053 uitleg / downloaden (Rompslomp): https://rompslomp.nl/blog/wat-is-camt.053-hoe-downloaden
- PSD2 vs boekhoudkoppeling (MoneyMonk): https://www.moneymonk.nl/help/542-wat-is-het-verschil-tussen-een-boekhoudkoppeling-en-een-psd-koppeling
- PSD2 en boekhoudkoppeling — 7 voordelen (Accountancy van Morgen): https://www.accountancyvanmorgen.nl/2019/03/26/psd2-en-de-boekhoudkoppeling-7-voordelen-voor-accountants/
- Banktransacties downloaden — alle Nederlandse banken (Spreadsheet Shop): https://spreadsheet-shop.nl/blogs/extra-uitleg-bij-boekhouden-in-sheets/banktransacties-downloaden-doe-je-zo-alle-nederlandse-banken
