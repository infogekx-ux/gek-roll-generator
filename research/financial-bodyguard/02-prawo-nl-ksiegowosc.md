# Prawo NL: księgowość i podatki dla ZZP / eenmanszaak / BV (stan na 2026)

> **Cel dokumentu.** Praktyczne, zweryfikowane kompendium holenderskich obowiązków podatkowo-księgowych dla klienta prowadzącego działalność jako **ZZP / eenmanszaak** (jednoosobowa działalność) lub **BV** (spółka z o.o.). Każda liczba/termin jest oznaczona rokiem obowiązywania i opatrzona źródłem (sekcja **## Źródła** na końcu). Terminy holenderskie zachowano w oryginale.
>
> **Data sporządzenia:** 2026-06-30.
> **Legenda znaczników:** ⚠️ NIEZWERYFIKOWANE = dane, których nie udało się potwierdzić w autorytatywnym źródle; ⚠️ 2025-DANE = znaleziono wyłącznie liczby za 2025 r.
>
> **Uwaga ogólna.** Holenderski rok podatkowy = rok kalendarzowy. Belastingdienst (holenderski urząd skarbowy) jest źródłem nadrzędnym; KVK (Izba Handlowa) i Ondernemersplein/Rijksoverheid są pomocnicze.

---

## 1. BTW — kwartaalaangifte (deklaracja VAT za kwartał)

### 1.1. Terminy (uiterste aangifte- en betaaldatums) — 2026

Dla podatnika rozliczającego BTW **kwartalnie** (najczęstszy wariant dla ZZP) deklaracja **oraz płatność** muszą wpłynąć do urzędu w terminie poniżej. Belastingdienst stosuje zasadę: *"Uw aangifte en betaling moeten binnen zijn op"* — czyli liczy się data **wpływu pieniędzy** na konto urzędu, nie data wysłania. Przelew SEPA może trwać 1–2 dni robocze, więc płatność należy zlecić z wyprzedzeniem.

| Kwartaal (2026) | Okres | Deadline aangifte **i** betaling |
|---|---|---|
| Q1 2026 | styczeń–marzec | **30 kwietnia 2026** |
| Q2 2026 | kwiecień–czerwiec | **31 lipca 2026** |
| Q3 2026 | lipiec–wrzesień | **31 października 2026** (faktycznie weekend → przesunięcie na poniedziałek **2 listopada 2026**) |
| Q4 2026 | październik–grudzień | **31 stycznia 2027** (sobota → przesunięcie na poniedziałek **2 lutego 2027**) |

(Źródło: Belastingdienst "uiterste-aangifte-en-betaaldatums", stan 2026. Przesunięcia weekendowe Q3/Q4 — zasada Belastingdienst: gdy termin wypada w sobotę/niedzielę/święto, przesuwa się na pierwszy dzień roboczy.)

**Ważne zasady (2026, źródło: Belastingdienst / KVK):**
- **Nihilaangifte (zerowa deklaracja) jest obowiązkowa** — nawet jeśli w kwartale nie było obrotu, deklarację BTW i tak trzeba złożyć. Brak deklaracji = ryzyko **verzuimboete** (kary porządkowej) ok. **€68** za niezłożenie w terminie. ⚠️ NIEZWERYFIKOWANE: dokładna kwota €68 pochodzi ze źródła pośredniego (loyaladministratie), nie potwierdzona bezpośrednio na belastingdienst.nl dla 2026 — kwota bazowa verzuimboete historycznie wynosi €68, ale należy zweryfikować przed komunikacją do klienta.
- Częstotliwość rozliczeń: domyślnie kwartalnie; można wnioskować o miesięczne (np. gdy stałe zwroty) lub roczne (przy bardzo małym obrocie, za zgodą urzędu).

### 1.2. Rubrieki deklaracji BTW (1a / 1b / ... / 5)

Holenderska deklaracja BTW dzieli się na 5 sekcji (rubrieken). Poniżej układ wg Belastingdienst:

**Rubriek 1 — Prestaties binnenland (dostawy krajowe, BTW należny):**
- **1a** — obrót opodatkowany stawką **wysoką 21%** + należny BTW.
- **1b** — obrót opodatkowany stawką **niską 9%** + należny BTW.
- **1c** — obrót przy innych stawkach (rzadko; np. kantyny sportowe — historyczna stawka mieszana). Marginalne zastosowanie.
- **1d** — **privégebruik** (użytek prywatny, np. samochód służbowy/telefon) — wypełniane **tylko w ostatniej deklaracji roku** (Q4).
- **1e** — obrót przy **stawce 0%** oraz obrót, dla którego BTW **przerzucono (verlegd)** na innego przedsiębiorcę krajowego (po stronie dostawcy).

**Rubriek 2 — Verleggingsregelingen binnenland (BTW przerzucony NA Ciebie, krajowo):**
- **2a** — sytuacje, w których inny przedsiębiorca przerzucił BTW na Ciebie; Ty sam obliczasz i wykazujesz należny BTW (jednocześnie zwykle odliczasz go w 5b).

**Rubriek 3 — Prestaties naar/in het buitenland (dostawy zagraniczne):**
- **3a** — dostawy do krajów **spoza UE** (eksport, 0%).
- **3b** — dostawy **wewnątrzwspólnotowe** (do przedsiębiorców w innych krajach UE, BTW przerzucony na nabywcę). **Powiązane z obowiązkiem ICP — patrz sekcja 2.**
- **3c** — instalacja/montaż i sprzedaż na odległość w innych krajach UE.

**Rubriek 4 — Prestaties vanuit het buitenland (zakupy zagraniczne, BTW należny u Ciebie):**
- **4a** — towary/usługi z krajów **spoza UE**, dla których BTW należny jest w NL (Ty obliczasz i wykazujesz, zwykle odliczasz w 5b).
- **4b** — nabycia **wewnątrzwspólnotowe** od przedsiębiorcy z UE (Ty rozliczasz BTW w NL).

**Rubriek 5 — Voorbelasting en eindtotaal (rozliczenie końcowe):**
- **5a** — suma należnego BTW z rubryk 1–4 (totaal verschuldigde btw).
- **5b** — **voorbelasting** (BTW naliczony — holenderski BTW z faktur zakupowych do odliczenia).
- Wynik = 5a − 5b → kwota do zapłaty lub do zwrotu.

(Źródło: Belastingdienst "ik-moet-btw-aangifte-doen-hoe-vul-ik-die-in" oraz Moore DRV / goedestartbelastingdienst, stan 2025/2026 — struktura rubryk jest stabilna od lat.)

### 1.3. Suppletie (korekta BTW)

**Suppletie** to formalna korekta wcześniej złożonych deklaracji BTW, gdy po zamknięciu roku okazuje się, że dopłata lub zwrot za dany rok różni się od tego, co zadeklarowano.

- **Próg €1.000:** jeśli łączna różnica BTW (do dopłaty lub zwrotu) za rok przekracza **€1.000**, **suppletie jest OBOWIĄZKOWE** — nie wolno "doksięgować" różnicy w kolejnej zwykłej deklaracji.
- **Poniżej €1.000:** korektę można po prostu uwzględnić w **najbliższej** zwykłej deklaracji BTW (bez formularza suppletie).
- **Termin:** po wykryciu błędu (powyżej €1.000) suppletie należy złożyć **jak najszybciej, w każdym razie w ciągu 8 tygodni** od wykrycia błędu.
- **Belastingrente (odsetki):** aby uniknąć odsetek od zaległości, suppletie warto złożyć **przed 1 kwietnia** roku następnego (tj. w ciągu 3 miesięcy po zakończeniu roku, którego dotyczy).
- **Ryzyko kary:** od **1 stycznia 2025** zaostrzono reżim — niezłożenie obowiązkowej suppletie w terminie może skutkować **vergrijpboete** do **100%** kwoty do skorygowania (podstawa: art. 10a ust. 3 AWR). To istotne ryzyko dla klienta — należy pilnować rocznego "uzgodnienia BTW" (aansluiting).

(Źródło: Belastingdienst "btw-aangifte corrigeren"; Hertoghs advocaten / Fiscaal-online dot. terminu od 1.1.2025; stan 2025/2026.)

### 1.4. KOR — kleineondernemersregeling (zwolnienie dla małych przedsiębiorców)

- **Próg obrotu (2026):** kwalifikujesz się do KOR, jeśli obrót **(bez BTW) < €20.000** rocznie — i to zarówno w roku zgłoszenia, **jak i w roku poprzednim**. (Źródło: Belastingdienst "kor-voorwaarden", stan 2026.)
- **Skutek:** przy KOR **nie naliczasz BTW** klientom, **nie składasz deklaracji BTW** i nie odprowadzasz BTW. **Ale** nie odliczasz też BTW od zakupów i inwestycji (voorbelasting). KOR jest więc korzystne głównie dla działalności o niskich kosztach/inwestycjach i klientach-konsumentach (B2C).
- **Przekroczenie progu:** gdy obrót przekroczy €20.000, KOR **kończy się natychmiast** — od transakcji, która przekracza próg, naliczasz już BTW normalnie.
- **Zgłoszenie:** wniosek do Belastingdienst musi wpłynąć **min. 4 tygodnie przed** żądaną datą startu.
- **Zmiana od 2025 (utrzymana w 2026):** zniesiono obowiązkowy 3-letni okres uczestnictwa. Można się **wyrejestrować w dowolnym momencie** i ponownie zgłosić bez 3-letniej karencji. (Źródło: Rabobank / Onderneming.nl / Informer, opis regulacji Belastingdienst; stan 2025/2026.)

### 1.5. Stawki BTW (2026)

| Stawka | Zastosowanie | Uwagi 2026 |
|---|---|---|
| **21%** (algemeen/hoog tarief) | stawka podstawowa — wszystko, co nie jest zwolnione ani objęte 9%/0% | — |
| **9%** (verlaagd/laag tarief) | m.in. żywność, leki, książki, woda, kultura, media, sport (patrz zmiana 2026 niżej) | **utrzymana** dla kultury/mediów/sportu |
| **0%** (nultarief) | m.in. eksport, dostawy wewnątrzwspólnotowe; nie naliczasz BTW, ale **odliczasz voorbelasting** | — |
| **vrijgesteld** (zwolnione) | m.in. opieka medyczna (lekarze, dentyści, fizjoterapeuci), edukacja, ubezpieczenia, usługi finansowe/bankowe, wynajem nieruchomości (z wyjątkami), niektóre usługi sportowe dla członków | **NIE odliczasz** voorbelasting |

**Krytyczna różnica:** *0%* vs *vrijgesteld* — przy 0% masz prawo do odliczenia BTW naliczonego; przy "vrijgesteld" **nie masz** tego prawa.

#### ⚠️ NAJWAŻNIEJSZA ZMIANA BTW 2026 — dwa ruchy w przeciwne strony

1. **Kultura, media i sport POZOSTAJĄ na 9%.** Pierwotny plan (Belastingplan 2025) zakładał likwidację stawki 9% i przeniesienie kultury/mediów/sportu na 21% od **1 stycznia 2026**. Po proteście i przyjęciu *Wet behoud verlaagd btw-tarief op cultuur, media en sport* (wetsvoorstel 36.814) **podwyżkę odwołano** — stawka **9% pozostaje** w 2026. (Źródło: PwC / EY / Eerste Kamer 36.814, stan 2026.)
2. **Logies (zakwaterowanie) IDZIE na 21%.** Wyjątkiem od powyższego jest **noclegi/zakwaterowanie** — od **1 stycznia 2026** hotele, parki wakacyjne, wynajem przez platformy (typu Airbnb), pensjonaty, umeblowane domy/karawany wakacyjne przechodzą z 9% na **21%**. (Źródło: PwC / lexfiscalisten, stan 2026.) **To dotyczy klientów z branży turystyczno-noclegowej.**
3. **Skutek uboczny finansowania:** lukę ~1,3 mld € rocznie sfinansowano m.in. **ograniczeniem indeksacji** (tabelcorrectiefactor zastosowano tylko w ~57%) progów w PIT/płacach — co podbija realne obciążenie podatkowe (skutek widoczny w progach box 1). (Źródło: PwC, stan 2026.)

---

## 2. ICP-opgave (Opgaaf intracommunautaire prestaties)

ICP = zbiorcza informacja o dostawach/usługach **wewnątrzwspólnotowych** (do przedsiębiorców z innych krajów UE z numerem VAT), będąca odpowiednikiem informacji podsumowującej.

- **Kiedy obowiązkowa:** gdy w danym okresie dostarczasz towary lub świadczysz usługi B2B do przedsiębiorców w innych krajach UE z przerzuceniem BTW (powiązane z **rubryką 3b** deklaracji BTW).
- **Brak transakcji = brak obowiązku:** w odróżnieniu od deklaracji BTW, **nie składa się ICP "zerowej"** (nihilopgaaf nie jest wymagana). Składasz tylko, gdy faktycznie były transakcje wewnątrzwspólnotowe.
- **Częstotliwość:**
  - **towary:** miesięcznie / kwartalnie / rocznie; rozliczenie **kwartalne** dozwolone tylko, gdy dostawy towarów **≤ €50.000** w kwartale (próg). Powyżej — miesięcznie.
  - **usługi:** miesięcznie / kwartalnie; rozliczenie **roczne** wymaga **zezwolenia (vergunning)**.
- **Termin złożenia:** **w ciągu 2 miesięcy** po zakończeniu okresu, którego dotyczy.
- **Spójność z BTW:** jeśli wykażesz obrót w rubryce 3b deklaracji BTW, ale nie złożysz ICP, urząd wezwie do uzupełnienia w wyznaczonym terminie; złożenie w terminie wezwania pozwala uniknąć **verzuimboete**.

(Źródło: Belastingdienst "tijdvak_opgaaf_icp" / "opgaaf_intracommunautaire_prestaties"; Crowe Peak; stan 2026.)

---

## 3. IB-aangifte (inkomstenbelasting) i odliczenia przedsiębiorcy

### 3.1. Termin deklaracji IB

- **Deklaracja IB za rok 2025:** standardowy termin **do 1 maja 2026**.
- **Uitstel (odroczenie):** wniosek przez Mijn Belastingdienst (DigiD) **przed 1 maja 2026** → odroczenie zwykle **do 1 września 2026**. Partnerzy fiskalni składają wniosek osobno (chyba że jest pełnomocnictwo). Odroczenie nie wstrzymuje naliczania **belastingrente** od ewentualnej dopłaty.
- (Dla przyszłych lat analogicznie: IB 2026 → termin 1 maja 2027.)

(Źródło: Belastingdienst "wanneer-moet-ik-aangifte-doen" / "ik-moet-aangifte-doen-maar-ik-wil-graag-uitstel"; stan 2026.)

### 3.2. Zelfstandigenaftrek (odliczenie dla samozatrudnionych) — wygaszane

- **Kwota 2026: €1.200.** (Źródło: Belastingdienst "zelfstandigenaftrek-2026", stan 2026.)
- **Trajektoria wygaszania (afbouw):** odliczenie jest systematycznie obniżane od 2020 r. (przyspieszone decyzją z 2023 r., by zmniejszyć różnicę w obciążeniu między samozatrudnionymi a pracownikami):
  - 2022: €6.310
  - 2023: €5.030 (⚠️ NIEZWERYFIKOWANE — wartość pośrednia, z trajektorii podawanej przez źródła branżowe)
  - 2024: ~€3.750 (⚠️ NIEZWERYFIKOWANE — j.w.)
  - **2025: €2.470** (⚠️ 2025-DANE, źródło MKB Servicedesk/Rabobank)
  - **2026: €1.200** (potwierdzone na belastingdienst.nl)
  - **2027 (zapowiedź): €900**
  - Wartości pośrednie 2023–2024 należy potwierdzić przed użyciem; punkty 2022, 2025, 2026, 2027 są spójne między źródłami.
- **Korzyść liczona stawką 37,56%** (2026) — odliczenia przedsiębiorcy "schodzą" do tej stawki, nie do najwyższej (49,5%). (Źródło: Belastingdienst 2026.)

### 3.3. Startersaftrek (dodatek dla startujących)

- **Kwota 2026: €2.123** (taka sama jak 2025). Doliczana **ponad** zelfstandigenaftrek.
- **Łączny maks. 2026:** €1.200 + €2.123 = **€3.323**.
- **Warunek:** nie byłeś przedsiębiorcą w ≥1 z 5 poprzednich lat **oraz** zastosowałeś zelfstandigenaftrek **≤ 2 razy** w tym okresie. Dostępne max przez pierwsze lata działalności.

(Źródło: Belastingdienst "zelfstandigenaftrek-2026"; Rabobank; stan 2026.)

### 3.4. MKB-winstvrijstelling (zwolnienie zysku MŚP)

- **2026: 12,7%** zysku **po** pomniejszeniu o ondernemersaftrek (czyli najpierw odejmujesz zelfstandigenaftrek/startersaftrek, potem od reszty 12,7% jest zwolnione).
- Dla porównania: 2024 = 13,31%; 2025 = 12,7% (bez zmiany w 2026).
- **Brak urencriterium** dla tego zwolnienia — stosuje je każdy przedsiębiorca (Belastingdienst nalicza automatycznie w aangifte).

(Źródło: Belastingdienst "mkb-winstvrijstelling-2026"; stan 2026.)

### 3.5. Urencriterium (kryterium godzinowe — 1.225 godz.)

- **Próg: 1.225 godzin** w roku kalendarzowym poświęcone na działalność — **warunek** uzyskania zelfstandigenaftrek i startersaftrek (oraz oude­dagsreserve/FOR — wygaszanej).
- Dodatkowo: zwykle musisz poświęcać działalności **więcej czasu niż innym zajęciom** (np. etatowi) — z wyjątkiem startujących, którzy nie byli przedsiębiorcami w 1 z 5 poprzednich lat.
- **Co się liczy:** wszystkie godziny "na firmę" — także oferty, administracja, strona www, **czas dojazdów** do klientów/biura/dostawców.
- **Wersja obniżona:** przy niezdolności do pracy (arbeidsongeschiktheid) próg = **800 godz.**; przy ciąży — do 16 tygodni niewykonywania pracy liczy się jako przepracowane.
- **Dowód:** trzeba **uprawdopodobnić** godziny (kalendarz, oferty, urenstaat, faktury). To częsty punkt sporny przy kontroli — kluczowe, by klient prowadził **rejestr godzin**.
- **1.225 godz. nie skaluje się proporcjonalnie** przy starcie w trakcie roku — pełen próg obowiązuje nawet, jeśli zacząłeś w połowie roku.

(Źródło: Belastingdienst "voorwaarden_urencriterium"; KVK "1225 uur"; stan 2026.)

### 3.6. Investeringsaftrek — KIA (kleinschaligheidsinvesteringsaftrek)

KIA = ulga na inwestycje w środki trwałe (bedrijfsmiddelen). Tabela **2026 = identyczna jak 2025** (brak zmian w Belastingplan). ⚠️ Uwaga: różne źródła pośrednie podają nieco rozbieżne progi dolne (€2.801 vs €2.901) i górne — poniżej tabela wg najczęściej powtarzanej wersji, ale **dokładne progi 2026 należy potwierdzić bezpośrednio na belastingdienst.nl** przed użyciem w rozliczeniu klienta:

| Łączna inwestycja w roku (2026) | KIA |
|---|---|
| do ~€2.900 | brak KIA |
| ~€2.901 – €69.764 | **28%** kwoty inwestycji |
| €69.765 – €116.273 | kwota stała **€19.534** |
| €116.274 – €382.707 | €19.534 **minus 7,56%** nadwyżki ponad €116.273 |
| powyżej €382.707 (do max €398.236 wg części źródeł) | brak KIA |

- **Minimum na środek trwały:** **€450** (excl. BTW) — drobniejsze pojedyncze zakupy nie kwalifikują.
- **Wyłączenia:** grunt, domy mieszkalne, auta osobowe nieprzeznaczone do przewozu zarobkowego, jachty reprezentacyjne, papiery wartościowe/wierzytelności, goodwill.
- ⚠️ NIEZWERYFIKOWANE: konkretne kwoty progów 2026 (€69.764 / €116.273 / €382.707 / €398.236 / €19.534) pochodzą ze źródeł pośrednich (Finny / belasting-overzicht / Bridgefund) i — choć spójne między sobą i opisywane jako "tabela 2025 przeniesiona na 2026" — nie zostały odczytane bezpośrednio ze strony Belastingdienst "kleinschaligheidsinvesteringsaftrek-2026". Wymaga potwierdzenia.
- Obok KIA istnieją **EIA** (energia) i **MIA/Vamil** (środowisko) — osobne reżimy, poza zakresem tego dokumentu.

(Źródło: belastingdienst.nl "kleinschaligheidsinvesteringsaftrek-2026" — strona istnieje; wartości z Finny/Bridgefund/belasting-overzicht; stan 2026.)

---

## 4. Box 1 i Box 3 (2026)

### 4.1. Box 1 — dochód z pracy/działalności (poniżej wieku AOW), 2026

| Schijf | Dochód (2026) | Tarief |
|---|---|---|
| 1 | do **€38.883** | **35,75%** |
| 2 | €38.883 – €78.426 | **37,56%** |
| 3 | powyżej €78.426 | **49,50%** |

- Stawka schijf 1 lekko spadła, schijf 2 lekko wzrosła, schijf 3 bez zmian (49,5%).
- **Osoby w wieku AOW (emeryci)** w schijf 1 płacą niższą stawkę (bez składki AOW) — ok. **17,90%** w 1. progu. ⚠️ NIEZWERYFIKOWANE: dokładna stawka 17,90% dla AOW-gerechtigden 2026 ze źródła pośredniego, do potwierdzenia na belastingdienst.nl.
- Dochód przedsiębiorcy (eenmanszaak) i DGA (z wynagrodzenia) opodatkowany jest w **box 1**.

(Źródło: Ondernemersplein/Overheid "belastingschijven-inkomstenbelasting-veranderen-in-2026"; Belastingdienst box 1; stan 2026.)

### 4.2. Box 3 — dochód z oszczędności i inwestycji, 2026

To obszar **największej niepewności prawnej** w holenderskim systemie — po **Kerstarrest** (wyrok Hoge Raad z 24.12.2021), w którym uznano, że ryczałtowe (forfaitaire) opodatkowanie fikcyjnego dochodu narusza prawo własności i zakaz dyskryminacji z EKPC.

**Stan 2026 (system przejściowy — Overbruggingswet box 3):**

| Parametr (2026) | Wartość |
|---|---|
| Forfait banktegoeden/spaargeld | **1,28%** |
| Forfait beleggingen/overige bezittingen (inwestycje, inne aktywa) | **6,00%** |
| Forfait schulden (długi, odliczane) | **2,70%** |
| **Tarief** (od fikcyjnego dochodu) | **36%** |
| **Heffingvrij vermogen** (kwota wolna) | **€59.357** na osobę (partnerzy fiskalni: €118.714) |

(Źródło: Belastingdienst "berekening-box-3-inkomen-2026"; stan 2026.)

**Tegenbewijsregeling (regulacja dowodu przeciwnego) — kluczowa zmiana po Kerstarrest:**
- Od **1 lipca 2025** obowiązuje **Wet tegenbewijsregeling box 3**: podatnik, który wykaże, że jego **rzeczywisty dochód (werkelijk rendement)** był niższy niż forfait, płaci od tej niższej kwoty i może wnioskować o zwrot nadpłaty (za lata objęte sporem, zasadniczo 2017–2027).
- To skutek wyroków Hoge Raad z 2024 r., które rozszerzyły ochronę z Kerstarrest. Belastingdienst udostępnił formularz "opgaaf werkelijk rendement" (OWR).
- **Docelowy system werkelijk rendement** (opodatkowanie faktycznego dochodu zamiast ryczałtu) jest planowany, ale **wielokrotnie przesuwany** — w 2026 nadal obowiązuje reżim przejściowy (forfait + tegenbewijs). ⚠️ NIEZWERYFIKOWANE: dokładna data wejścia docelowego box 3 (różne źródła podają 2028) — do potwierdzenia; w 2026 obowiązuje system przejściowy.

**Praktyczny wniosek dla klienta:** jeśli realny dochód z oszczędności/inwestycji był niższy od forfaitu (zwłaszcza przy dużych saldach gotówki przy forfait 1,28% lub stratach na inwestycjach), **warto policzyć werkelijk rendement** i ewentualnie złożyć tegenbewijs — to może obniżyć podatek box 3.

---

## 5. Bewaarplicht (obowiązek przechowywania dokumentacji)

- **Zasada ogólna: 7 lat.** Całą podstawową administrację (faktury, wyciągi, umowy, ewidencje, kalkulacje) trzeba przechowywać **7 lat**.
- **Wyjątek: 10 lat dla nieruchomości (onroerend goed)** i praw do nieruchomości — m.in. by Belastingdienst mógł skontrolować korekty/odliczenia BTW (okres korekty BTW przy nieruchomościach to 10 lat). Dotyczy aktów zakupu, umów najmu, dokumentów inwestycyjnych dot. nieruchomości.
- **Start okresu:** liczony od momentu, gdy dane **tracą bieżącą wartość** (np. po zakończeniu trwającej umowy), nie zawsze od daty wystawienia.
- **Forma:** dopuszczalne przechowywanie cyfrowe / skany / chmura — pod warunkiem, że dane pozostają **kompletne, czytelne, odtwarzalne i sprawdzalne** przez cały okres.
- **Po zamknięciu firmy** obowiązek bewaarplicht **trwa dalej** (7/10 lat).

(Źródło: Belastingdienst "administratie_bewaren"; Rijksoverheid; Ondernemersplein; stan 2025/2026 — zasada stabilna.)

---

## 6. Wet DBA / schijnzelfstandigheid (pozorne samozatrudnienie)

**Tło.** Wet DBA (Deregulering Beoordeling Arbeidsrelaties) reguluje, czy relacja ZZP'er–zleceniodawca to faktycznie samozatrudnienie, czy ukryty stosunek pracy (**schijnzelfstandigheid**). Przez lata obowiązywał **handhavingsmoratorium** (zawieszenie egzekwowania).

**Status egzekwowania 2025 → 2026:**
- **Od 1 stycznia 2025** — **koniec moratorium**. Belastingdienst znów może nakładać **naheffingen** (zaległe loonheffingen) za schijnzelfstandigheid, **ale tylko za pracę od 2025 r.** Naheffing z mocą wsteczną **nie sięga dalej niż 1.1.2025** — chyba że jest **kwade trouw** (zła wiara) lub zignorowano wcześniejsze wytyczne (wtedy do 5 lat wstecz).
- **2026 — "zachte landing" częściowo przedłużona:**
  - **Verzuimboetes (kary porządkowe) nadal zawieszone w 2026** — tak jak w 2025. Standardowe verzuimboetes wracają **od 2027**.
  - **NOWOŚĆ 2026:** mogą być nakładane **vergrijpboetes** (kary za przewinienie, 10–100% naheffingu) — **tylko** przy wykazanym **opzet of grove schuld** (umyślności lub rażącym niedbalstwie).
  - Kontrole zwykle zaczynają się od **bedrijfsbezoek** (wizyty), nie od pełnego audytu; podejście **risico­gericht** (sektory wysokiego ryzyka).
- **Modelovereenkomsten (umowy modelowe):**
  - **Od 6 września 2024 nie zatwierdza się nowych** umów modelowych.
  - Istniejące zatwierdzone umowy obowiązują **do końca 2029**, **ALE** nie dają już gwarancji — Belastingdienst patrzy na **faktyczny** sposób współpracy; jeśli rzeczywistość odbiega od umowy, egzekwowanie następuje niezależnie od papieru.
- **Nowe ustawodawstwo (w toku, NIE uchwalone):** **VBAR** (Wet verduidelijking beoordeling arbeidsrelaties en rechtsvermoeden) oraz **Zelfstandigenwet** — mają doprecyzować kryteria i wprowadzić domniemanie zatrudnienia poniżej pewnej stawki godzinowej. ⚠️ NIEZWERYFIKOWANE: status legislacyjny VBAR w połowie 2026 — projekty były w obróbce; należy sprawdzić aktualny etap przed komunikacją do klienta.

**Ryzyka dla ZZP/zleceniodawcy (praktyka):**
- Jeśli relacja ma cechy **gezag** (podporządkowanie), **persoonlijke arbeid** (obowiązek osobistego świadczenia) i **loon** — to stosunek pracy; ryzyko naheffing loonheffingen po stronie **zleceniodawcy**.
- Czynniki bezpieczeństwa: wielu klientów, własne narzędzia/ryzyko, swoboda zastępstwa, własny cennik, brak integracji z organizacją zleceniodawcy.
- Dla klienta-ZZP: **dokumentować niezależność** (wielu zleceniodawców, własne ryzyko, KvK, własne ubezpieczenia/inwestycje).

(Źródło: Belastingdienst "schijnzelfstandigheid" / "arbeidsrelaties handhaving"; KVK "wet-dba"; ZiPconomy 01/2026; ZZP Nederland; stan 2026.)

---

## 7. Loonheffingen (BV z personelem / DGA)

Dotyczy klientów prowadzących **BV** zatrudniającą personel lub samego **DGA** (directeur-grootaandeelhouder — dyrektor-większościowy udziałowiec, ≥5% udziałów).

### 7.1. Gebruikelijk loon DGA (wynagrodzenie "zwyczajowe") — 2026

DGA musi wypłacać sobie z BV **gebruikelijk loon** (nie może sztucznie zaniżać pensji, by uniknąć box 1).

- **Normbedrag 2026: €58.000** (wzrost z €56.000 w 2025).
- **Reguła "najwyższego z trzech":** gebruikelijk loon = **najwyższa** z kwot:
  1. wynagrodzenie z **najbardziej porównywalnego** zatrudnienia (meest vergelijkbare dienstbetrekking),
  2. wynagrodzenie **najlepiej zarabiającego pracownika** w firmie/grupie,
  3. **norma €58.000** (2026).
- **Doelmatigheidsmarge zniesiona:** od 1.1.2023 **brak** 25-proc. marży — pensja DGA musi być **100%** wynagrodzenia z porównywalnego zatrudnienia (wcześniej dopuszczano 75%).
- **Bewijslast (ciężar dowodu):** jeśli ustalone loon < norma → ciężar wykazania, że powinno być wyższe, leży po stronie pracodawcy; jeśli > norma → po stronie Belastingdienst.
- **Wyjątki/obniżenie:** start-up (pierwsze ~3 lata) — możliwe niższe loon (część źródeł: minimum 75% normy ≈ €43.500 w 2026); firma ze stratą; praca w niepełnym wymiarze — wszystko **wymaga solidnej dokumentacji**. ⚠️ NIEZWERYFIKOWANE: kwota €43.500 dla start-upów 2026 (75% × €58.000) ze źródła pośredniego (deZaak/Wetaxus) — reguła start-upowa istnieje, ale dokładny mechanizm na 2026 do potwierdzenia na belastingdienst.nl.

(Źródło: Belastingdienst gebruikelijkloonregeling; Boon/Blue Accountants; deZaak; stan 2026.)

### 7.2. Pozostałe loonheffingen (BV z personelem)

- BV jako **inhoudingsplichtige** (płatnik) odprowadza **loonheffingen**: loonbelasting + premie volksverzekeringen + premie werknemersverzekeringen (WW, WIA, ZW) + **ZVW** (składka zdrowotna).
- **Aangiftetijdvak:** zwykle **miesięcznie** lub 4-tygodniowo; deklaracja i płatność loonheffingen — co do zasady do końca **miesiąca następnego**. ⚠️ NIEZWERYFIKOWANE: dokładne terminy loonaangifte 2026 nie zostały odczytane bezpośrednio z belastingdienst.nl w tym researchu — do potwierdzenia (zasada "miesiąc następny" jest stabilna).
- **WKR** (werkkostenregeling) — wolna przestrzeń na świadczenia pozapłacowe; **vrije ruimte** ⚠️ NIEZWERYFIKOWANE dla 2026 (procent i progi do potwierdzenia).
- DGA bez innego personelu zwykle ma uproszczoną loonaangifte (tylko własne loon).

---

## 8. Checklista per okres — dokumenty, które klient MUSI dostarczyć

Konkretna, użytkowa lista do operacyjnego pilnowania klienta.

### 8.1. PER KWARTAŁ (cykl BTW) — dostarczyć w ciągu ~2 tygodni po końcu kwartału

**Cel:** złożenie BTW-aangifte do terminu (30.04 / 31.07 / 31.10/02.11 / 31.01/02.02).

Klient dostarcza za dany kwartał:
1. **Wszystkie faktury sprzedażowe (verkoopfacturen)** wystawione w kwartale — z rozbiciem na stawki 21% / 9% / 0% / zwolnione.
2. **Wszystkie faktury kosztowe/zakupowe (inkoopfacturen, bonnen)** z BTW do odliczenia (voorbelasting) — paragony, faktury, subskrypcje.
3. **Wyciągi bankowe (rekeningafschriften)** konta firmowego za pełny kwartał (do uzgodnienia/aansluiting).
4. **Faktury wewnątrzwspólnotowe** (sprzedaż/zakup do/z UE) + numery VAT kontrahentów UE → potrzebne do rubryk 3b/4b i do **ICP**.
5. **Faktury spoza UE** (import/eksport) + dokumenty celne, jeśli są.
6. **Faktury z BTW verlegd** (przerzucony) — np. budownictwo/podwykonawstwo.
7. Informacja o **prywatnym użytku** (auto, telefon) — **tylko do Q4** (rubriek 1d).
8. Potwierdzenie statusu **KOR** (jeśli klient korzysta — wtedy zwykle brak deklaracji BTW).

**ICP (jeśli były transakcje UE):** lista dostaw/usług wewnątrzwspólnotowych per numer VAT kontrahenta → ICP-opgaaf w 2 miesiące po kwartale.

### 8.2. PER ROK (cykl IB / jaarrekening) — dostarczyć w styczniu–marcu roku następnego

**Cel:** aangifte inkomstenbelasting (do 1 maja / uitstel do 1 września) oraz jaarrekening (BV).

**Eenmanszaak / ZZP:**
1. **Komplet faktur sprzedaży i kosztów za cały rok** (jeśli rozliczenie kwartalne BTW — domknięcie i uzgodnienie roczne → ewentualna **suppletie** >€1.000).
2. **Wszystkie wyciągi bankowe** (firmowe; przy działalności także prywatne, jeśli mieszane).
3. **Rejestr godzin (urenadministratie)** — dla **urencriterium 1.225 godz.** (kalendarz, urenstaat) — warunek zelfstandigenaftrek/startersaftrek.
4. **Lista środków trwałych i inwestycji** (data, kwota, faktura) — do **KIA** i amortyzacji (afschrijving).
5. **Beginbalans / eindbalans** (stany: kasa, należności, zobowiązania, zapasy).
6. **Saldo dłużników i wierzycieli** na 31.12 (debiteuren/crediteuren).
7. **Umowy** istotne (najem, leasing, pożyczki) + odsetki.
8. **Dane prywatne do IB:** dochody partnera, hipoteka (eigenwoning/WOZ), aktywa **box 3** na 1.01 (salda kont, inwestycje, długi) — pod kątem heffingvrij vermogen €59.357 i ewentualnej **tegenbewijsregeling** (realny dochód box 3).
9. Polisy: **AOV** (ubezpieczenie na wypadek niezdolności do pracy), składki emerytalne (lijfrente) — do odliczeń.
10. Decyzje/aanslagen z Belastingdienst (voorlopige aanslag IB, BTW) z danego roku.

**Dodatkowo BV:**
11. **Pełna księgowość** → **jaarrekening** (bilans + rachunek wyników); **deponowanie** uproszczonej jaarrekening w **KVK** (mikro/mała BV) — termin: zasadniczo w ciągu **8 dni po ustaleniu** przez walne, **najpóźniej ~12 miesięcy** po końcu roku obrotowego. ⚠️ NIEZWERYFIKOWANE: dokładne terminy deponowania w KVK 2026 nie były przedmiotem odrębnego sprawdzenia — do potwierdzenia.
12. **Vennootschapsbelasting (Vpb)** — deklaracja CIT BV (osobny reżim, poza zakresem; termin zwykle 5 miesięcy po roku obrotowym / z uitstel).
13. **Loonadministracja DGA i personelu** — roczne podsumowanie loonheffingen, **gebruikelijk loon €58.000** (2026) ujęte w loonaangifte.
14. Rejestr **dividenduitkering** (jeśli wypłata dywidendy) → dividendbelasting 15% + box 2.

---

## Źródła

**BTW — terminy, rubrieki, suppletie, KOR, stawki:**
- Belastingdienst — uiterste aangifte- en betaaldatums: https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/uiterste-aangifte-en-betaaldatums
- Belastingdienst — btw-aangifte invullen (rubrieki): https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/ik-moet-btw-aangifte-doen-hoe-vul-ik-die-in
- Moore DRV — 5 rubryk BTW: https://www.moore-drv.nl/de-vijf-rubrieken-van-de-btw-aangifte/
- Belastingdienst — btw-aangifte corrigeren (suppletie): https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/btw_aangifte_doen_en_betalen/aangifte_corrigeren/
- Hertoghs advocaten — termin suppletie od 1.1.2025: https://hertoghsadvocaten.nl/en/kennisbank/btw-suppletie-termijn/
- Fiscaal-online — próg €1.000 suppletie: https://fiscaal-online.nl/kennisbank/suppletie/drempelbedrag
- Belastingdienst — KOR voorwaarden: https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/kor-voorwaarden
- Belastingdienst — btw-tarieven: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/btw_berekenen_aan_uw_klanten/btw_berekenen/btw_tarief/btw_tarief
- PwC — opheffen verlaagd btw-tarief / logies 21% od 2026: https://www.pwc.nl/nl/actueel-en-publicaties/belastingnieuws/pwc-prinsjesdag-special/opheffen-verlaagd-btw-tarief-vanaf-1-januari-2026.html
- PwC — btw-verhoging cultuur/sport/media afgeschaft: https://www.pwc.nl/nl/actueel-en-publicaties/belastingnieuws/pwc-prinsjesdag-special/btwverhogingopcultuursportenmediaafgeschaft.html
- Eerste Kamer — Wet behoud verlaagd btw-tarief 36.814: https://www.eerstekamer.nl/wetsvoorstel/36814_wet_behoud_verlaagd_btw

**ICP:**
- Belastingdienst — tijdvak opgaaf ICP: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/zakendoen_met_het_buitenland/goederen_en_diensten_naar_andere_eu_landen/opgaaf_icp/tijdvak_opgaaf_icp/tijdvak_opgaaf_icp
- Belastingdienst — opgaaf intracommunautaire prestaties: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/internationaal/btw_voor_buitenlandse_ondernemers/btw_aangifte_doen_en_betalen/aangifte_doen/opgaaf_icp/opgaaf_intracommunautaire_prestaties

**IB — odliczenia, urencriterium, KIA, terminy:**
- Belastingdienst — zelfstandigenaftrek 2026: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/inkomstenbelasting/veranderingen-inkomstenbelasting-2026/ondernemersaftrek-2026/zelfstandigenaftrek-2026
- Belastingdienst — mkb-winstvrijstelling 2026: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/inkomstenbelasting/veranderingen-inkomstenbelasting-2026/mkb-winstvrijstelling-2026
- Belastingdienst — urencriterium: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/inkomstenbelasting/inkomstenbelasting_voor_ondernemers/voorwaarden_urencriterium
- KVK — 1225 uur urencriterium: https://www.kvk.nl/starten/de-magische-1225-uur-alles-over-het-urencriterium/
- Belastingdienst — kleinschaligheidsinvesteringsaftrek 2026: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/inkomstenbelasting/veranderingen-inkomstenbelasting-2026/investeringsaftrek-2026/kleinschaligheidsinvesteringsaftrek-2026
- Belastingdienst — wanneer aangifte IB doen: https://www.belastingdienst.nl/wps/wcm/connect/nl/belastingaangifte/content/wanneer-moet-ik-aangifte-doen
- Belastingdienst — uitstel aangifte: https://www.belastingdienst.nl/wps/wcm/connect/nl/belastingaangifte/content/ik-moet-aangifte-doen-maar-ik-wil-graag-uitstel-kan-dat
- Rabobank — zelfstandigenaftrek/startersaftrek (trajektoria afbouw): https://www.rabobank.nl/bedrijven/eigen-bedrijf-starten/belasting/zelfstandigenaftrek-en-startersaftrek-zo-zit-dat
- MKB Servicedesk — zelfstandigenaftrek 2026 €1.200: https://www.mkbservicedesk.nl/nieuws/ondernemersnieuws/zelfstandigenaftrek-2026-verlaagd

**Box 1 / Box 3:**
- Ondernemersplein — belastingschijven 2026: https://ondernemersplein.overheid.nl/wetswijzigingen/belastingschijven-inkomstenbelasting-veranderen-in-2026/
- Belastingdienst — box 1: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_1/box_1
- Belastingdienst — berekening box 3 inkomen 2026: https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026
- Rijksoverheid — box 3 rechtsherstel/overbrugging: https://www.rijksoverheid.nl/onderwerpen/inkomstenbelasting/box-3
- SRA — tegenbewijsregeling box 3 (2017-2027): https://www.sra.nl/dossiers/dossier-hoge-raad-box-3/tegenbewijsregeling-box-3-2017-2027/

**Bewaarplicht:**
- Belastingdienst — administratie bewaren 7/10 jaar: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/administratie_bewaren/administratie_bewaren
- Rijksoverheid — hoe lang administratie bewaren: https://www.rijksoverheid.nl/onderwerpen/inkomstenbelasting/vraag-en-antwoord/hoe-lang-moet-ik-mijn-financiele-administratie-bewaren

**Wet DBA / schijnzelfstandigheid:**
- Belastingdienst — schijnzelfstandigheid: https://over-ons.belastingdienst.nl/onderwerpen/schijnzelfstandigheid/
- Belastingdienst — arbeidsrelaties handhaving: https://www.belastingdienst.nl/wps/wcm/connect/nl/arbeidsrelaties/content/handhaving
- KVK — Wet DBA: https://www.kvk.nl/wetten-en-regels/wet-dba-voorkom-schijnzelfstandigheid/
- ZiPconomy — handhaving schijnzelfstandigheid 2026: https://www.zipconomy.nl/2026/01/handhaving-schijnzelfstandigheid-in-2026-wat-wordt-anders-en-wat-niet/
- ZZP Nederland — boetes uitgesteld 2026: https://www.zzp-nederland.nl/nieuws/kabinet-stelt-boetes-bij-schijnzelfstandigheid-ook-2026-uit

**Loonheffingen / gebruikelijk loon DGA:**
- Boon — normbedrag gebruikelijk loon 2026 €58.000: https://www.boon.nl/nieuws/normbedrag-gebruikelijk-loon-dga-verhoo
- Blue Accountants — gebruikelijk loon 2026 €58.000: https://www.blueaccountants.nl/normbedrag-gebruikelijk-loon-dga-in-2026-naar-e-58-000
- deZaak — gebruikelijk loon DGA 2026: https://www.dezaak.nl/financien/belastingen/dga-salaris-hoe-werkt-gebruikelijk-loon-dga/

---

*Dokument do okresowej rewizji. Pozycje oznaczone ⚠️ NIEZWERYFIKOWANE / ⚠️ 2025-DANE należy potwierdzić bezpośrednio na belastingdienst.nl przed użyciem w rozliczeniu klienta.*
