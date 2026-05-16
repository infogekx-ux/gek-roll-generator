# D. Plan Implementacji — PrintFlow OS, 90 dni

**Cel:** Z 1 płacącego klienta (Willem) → 5 płacących klientów (€490 MRR + €1980 z setupów) w 12 tygodni.

**Twoje warunki brzegowe:**
- Budowa 6:00-16:30
- GEK-X 20:00-23:00 (2-3h/dzień)
- Weekendy 4-8h GEK-X (z odpoczynkiem)
- Łączna dyspozycja: ~25h/tydzień na ten projekt
- Budget: €0-100 (domena, mailing tool jeśli potrzebny)

**Zasada przewodnia:** Każdy tydzień ma JEDEN cel. Jak nie zdążysz — przesuń o tydzień. Nie pakuj 5 rzeczy w tydzień.

---

## FAZA 1: FUNDAMENTY (Tygodnie 1-4)

### TYDZIEŃ 1: Brand i pozycja produktu

**Cel:** PrintFlow OS jako jasny, sprzedawalny produkt z własną tożsamością.

**Pondz. wieczór (2h):**
- Zarezerwuj domenę **printflow.eu** lub **printflow.io** (~€10/rok). Sprawdź dostępność.
- Stwórz Trello/Notion board "PrintFlow OS 90 days" z 12 tygodni jako kolumny.
- Zaplanuj content: jakie video, jakie posty, do kogo dzwonisz.

**Wt. wieczór (2h):**
- Napisz w 1 zdaniu: "PrintFlow OS to ___ dla ___ który pomaga im ___."
- Test na Ance — jak rozumie, dobrze. Jak nie — pisz jeszcze raz.
- Pre-final wersja: "PrintFlow OS to vertical SaaS dla małych drukarni DTF, który zamienia chaos zamówień w jeden klik."

**Śr. wieczór (2h):**
- Zrób screenshoty wszystkich kluczowych ekranów DTF Roll Studio na laptopie i telefonie.
- Spisz 5 najczęstszych "before/after" — co drukarnia robi ręcznie vs co PrintFlow OS robi automatycznie.

**Czw. wieczór (2h):**
- Zarejestruj subdomenę na Netlify: **printflow.gek-x.nl** (jeśli .eu zajęte, na razie).
- Skonfiguruj DNS (wiesz jak — TransIP).
- Pusty deploy "coming soon".

**Pt. wieczór (2h):**
- Wybierz 3 kolory brandu PrintFlow OS (ZACHOWAJ G|SAAS niebieski #0055FF jako akcent).
- Stwórz logo (Figma / OpenSCAD jak chcesz). Albo niech AI wygeneruje wektor. Albo zostań przy literach PRINTFLOW + ikona rolki.

**Sobota (4h):**
- Napisz tekst landing page'a (Hero + Problem + Rozwiązanie + Features + Pricing + Demo + CTA).
- KRYTYCZNE: Hero MUSI być "Mam drukarnię DTF" → "Płacę €98/mnd → mam to" (konkret, nie marketing-bullshit).

**Niedziela (4h):**
- Złóż landing page. Vanilla HTML (twoja sila). Mobile-first.
- Deploy.
- Wyślij Willemowi link "co myślisz". Jego feedback = walidacja.

**Milestone tydzień 1:** ✅ printflow.gek-x.nl live. ✅ One-liner clear. ✅ Willem widział i potwierdził.

---

### TYDZIEŃ 2: Demo + sales materials

**Cel:** Każdy potencjalny klient widzi 90-sekundowe video i wie, że to działa.

**Pn-Wt wieczór (4h):**
- Nagraj demo video: 90 sekund, telefon (1080p), pokazujesz instancję Willema (anonimowy klient: "drukarnia w NL"):
  1. Klient drukarni wchodzi → wgrywa pliki (15s)
  2. System trimuje, sprawdza DPI, składa rolkę (20s)
  3. Pokazuje cenę (10s)
  4. Klient zatwierdza, drukarz dostaje email z plikami (15s)
  5. Closing: "PrintFlow OS. Twoja drukarnia, ale lepsza. €495 + €98/mnd. printflow.gek-x.nl" (15s)

**Śr wieczór (2h):**
- Wgraj na YouTube (unlisted) + osadzaj na landing page.
- Drugi krótki shorts/reel (30s) na LinkedIn/Instagram.

**Czw wieczór (2h):**
- Stwórz "One-pager PDF" (1 strona A4): co to jest, ile kosztuje, co dostaje klient, kontakt.
- Wygeneruj fakturę-wzór (PL i NL) z Admin Panel v10 dla demo.

**Pt wieczór (2h):**
- Stwórz email template "Pierwszy kontakt z drukarnią DTF" — krótki, konkretny, z linkiem do demo.
- Stwórz email follow-up (po 5 dniach jeśli brak odpowiedzi).

**Sobota (4h):**
- Stwórz **Notion/Markdown stronę "Case Study: Willem"** — jak była przed PrintFlow OS, jak jest teraz. Liczby (jeśli Willem zgodzi się podać).
- Zapisz testimonial od Willema (video 30s na telefonie albo cytat z podpisem).

**Niedziela (4h):**
- Lista 50 drukarni DTF w Beneluksie + Niemczech:
  - Google: "DTF print" + "NL/BE/DE"
  - Facebook groups: "DTF printers Netherlands", "DTF Belgium"
  - KvK search (NL): SBI 1812 (druk) + filtr odzież
  - Każdy wpis: nazwa, www, email, kontakt-osoba (jeśli widoczna)
- Zapisz w Google Sheet "Prospects PrintFlow OS"

**Milestone tydzień 2:** ✅ Demo video. ✅ Lista 50 prospektów. ✅ Email templates.

---

### TYDZIEŃ 3: First outreach (cold) + warm intro

**Cel:** Wyślij 30 emaili, otrzymaj 3 odpowiedzi, umów 1 demo call.

**Pn wieczór (2h):**
- WAŻNE: ZAPYTAJ WILLEMA o **warm intro** do 3-5 drukarni, które zna osobiście. Warm intro = 50x lepiej niż cold email.
- Jak ma listę 5 — napisz mu wiadomość, której Willem może użyć do forward'u.

**Wt wieczór (2h):**
- Wyślij 10 emaili z listy 50 (najbardziej "ciepłe" — które wyglądają jak mniejsze drukarnie, prawdopodobnie dotknięte problemem).
- Personalizacja: 1 zdanie o ich konkretnej firmie (gdzie są, co drukują).

**Śr wieczór (2h):**
- Post na LinkedIn po holendersku + angielsku:
  > "Bouwde een SaaS voor mijn klant (DTF printer). Klanten uploaden hun designs, het systeem trimt, checkt DPI, plant de rol optimaal, en stuurt automatisch een bestelling. Hij betaalt mij maandelijks. Nu zoek ik 4 andere DTF printers die hetzelfde willen. printflow.gek-x.nl"
- Post na FB groupie "DTF printers Netherlands" / "DTF printers Belgium" (TEN SAM message).

**Czw wieczór (2h):**
- Wyślij kolejne 10 emaili z listy.
- Sprawdź odpowiedzi z poniedziałku/wtorku. Odpowiedz natychmiast.

**Pt wieczór (2h):**
- Follow-up emaile do wczesnych wysyłek (jeśli brak odpowiedzi).
- Jeśli ktoś odpowiedział pozytywnie → umów 30-min call (Google Meet/Zoom).

**Sobota (4h):**
- Pierwsze demo call jeśli umówiłeś. **WAŻNE: rano, nie wieczorem** (emocjonalny autorytet).
- Zapisz w Notion: co działa w pitchu, co nie.

**Niedziela (4h):**
- Wyślij ostatnie 10 emaile (do 30 total tygodniowy outreach).
- Zaktualizuj landing na podstawie pytań z calls.

**Milestone tydzień 3:** ✅ 30 emaili wysłanych. ✅ Min. 3 odpowiedzi. ✅ Min. 1 demo call zrobione.

---

### TYDZIEŃ 4: Domknij pierwszego nowego klienta

**Cel:** Pierwszy ✍️ podpisany kontrakt (oprócz Willema).

**Pn-Pt wieczór (10h razem):**
- Follow-up z demo call (jeśli były).
- Negocjacja warunków.
- Onboarding pierwszego nowego klienta:
  1. Zbierz: logo, kolory, email drukarza, ceny per metr, materiały
  2. Skopiuj DTF Roll Studio instancję
  3. Skonfiguruj per klient (env vars, branding, ceny)
  4. Deploy na subdomenie klienta-drukarni (np. `[drukarnia].printflow.gek-x.nl` lub własna)
  5. Test
  6. Faktura €495 setup + €98 pierwszy miesiąc

**Weekend (8h):**
- Final onboarding + Loom video "how to use" dla klienta-drukarni
- Update Case Study z drugim klientem
- Kolejne 20 emaili do prospektów (z update'em "Nasz drugi klient też wdrożony")

**Milestone tydzień 4:** ✅ DRUGI klient. €593 cash. €196 MRR.

---

## FAZA 2: SKALOWANIE (Tygodnie 5-8)

### TYDZIEŃ 5: Powtórka outreach + automatyzacja onboardingu

**Cel:** Skrócić onboarding z 4h do 1h przez automation.

- Skrypt deploy'u nowej instancji (1 polecenie zamiast 20 manualnych kroków)
- Template config.js z dokumentacją
- Self-service onboarding form (klient sam wgrywa logo, kolory, email)
- 20 nowych emaili do prospektów
- Follow-up wszystkich pending

### TYDZIEŃ 6: Content marketing + LinkedIn

**Cel:** 3 posty/tydzień, 1 video w miesiącu, organic reach.

- **Pn:** Post LinkedIn — case study (jak Willem oszczędza X godzin/tydz)
- **Śr:** Post LinkedIn — twoja historia ("Od fabryki ryb do SaaS — co kosztowało budowanie produktu wieczorami")
- **Pt:** Post LinkedIn — feature spotlight (np. "Auto-trim — drukarnia oszczędza 30% materiału")
- **Weekend:** 1 video YouTube/Shorts (90 sek)

### TYDZIEŃ 7: Trzeci klient + przygotowania do upselli

**Cel:** Trzeci klient core + zacznij myśleć o module #1 (Stock).

- Domknij trzeciego klienta z FAZY 1.
- Zaprojektuj PrintFlow Stock (magazyn rolek) — prosty MVP w Supabase
- ZAPYTAJ Willema czy chce stock module za €39/mnd. Jeśli tak → ŚCIEŻKA UPSELL otwarta.

### TYDZIEŃ 8: Stock module MVP + outreach kontynuuj

**Cel:** Pierwszy upsell + 4 klient core.

- Wdrożenie Stock module u Willema (testowo)
- Kolejne 20 emaili
- Pierwszy upsell zafakturowany (€39 dodatkowych MRR)

**Milestone tydzień 8:** ✅ 4 klienci core. €392 MRR + €39 upsell = €431 MRR. €2475 in setupy.

---

## FAZA 3: KONSOLIDACJA + REFERRAL ENGINE (Tygodnie 9-12)

### TYDZIEŃ 9: Referral program

**Cel:** Każdy istniejący klient przyprowadza jednego nowego.

- Stwórz program: "Polec drukarnię — pierwszy miesiąc free dla obu"
- Wyślij email do wszystkich aktualnych klientów (4 osoby)
- Personalnie zapytaj Willema o 2-3 konkretne nazwiska

### TYDZIEŃ 10: Piąty klient (przez referral)

**Cel:** Pierwszy klient z referrala.

- Domknij klienta z referrala (mniejszy effort, lepsza konwersja)
- Update Case Study

### TYDZIEŃ 11: Niemcy / Belgium expansion

**Cel:** Pierwsza drukarnia poza NL.

- Tłumaczenie landing na DE (i upewnij się że NL i EN OK)
- Wyślij 15 emaili do drukarni w NRW (Nordrhein-Westfalen) + 10 do Belgii
- LinkedIn post w niemieckim

### TYDZIEŃ 12: Stabilizacja + plan kolejnych 90 dni

**Cel:** Stabilne €500 MRR. Plan Q2.

- Klient #5 onboardowany
- Total MRR review: powinno być €490-590 MRR
- Total setupy: ~€2475 cash
- Plan kolejnych 90 dni:
  - **Faza 2A:** 5 → 10 klientów (jeszcze 3 miesiące)
  - **Faza 2B:** NEXTAG Smart Workwear pilot start w M4-M6

**Milestone tydzień 12:** ✅ 5 klientów. €490-590 MRR. €2966 cash z setupów (włącznie z Willem). Plus ~€468 z budowy/mies, masz **wolność operacyjną na pierwszy lokalny boom**.

---

## KAMIENIE MILOWE I METRYKI SUKCESU

| Kamień | Termin | Metryka | Czerwone światło jeśli... |
|---|---|---|---|
| Landing live | T1 | URL działa | Po T2 jeszcze nie ma |
| Demo video | T2 | YouTube link | Po T3 jeszcze nie ma |
| 50 prospektów | T2 | Sheet zapełniony | Mniej niż 30 |
| 30 maili wysłanych | T3 | Sent folder | Mniej niż 20 |
| Drugi klient | T4 | Faktura €493 | Po T6 nadal Willem only |
| Trzeci klient | T7 | €294 MRR | Po T9 nadal 2 klienci |
| Czwarty klient | T8 | €392 MRR + Stock | Po T10 nadal 3 |
| Piąty klient | T10-12 | €490+ MRR | Po T13 nadal 4 |
| Plan Q2 | T12 | Nowy 90-day plan | Brak planu = drift |

---

## PLAN B JEŚLI NIE ZADZIAŁA PO 3 MIESIĄCACH

**Definicja "nie zadziałało":** Po 12 tygodniach <3 klientów core, <€200 MRR.

### Scenariusz B1: Outreach nie konwertuje
**Symptom:** 50+ maili wysłanych, <5 odpowiedzi, 0 demo calls.
**Diagnoza:** Albo email się nie czyta, albo oferta nie rezonuje.
**Akcja:**
1. Zmień podejście z cold email na **personal calls + WhatsApp** (Willem to robi z klientami)
2. Idź **fizycznie** na lokalne targi/sklepy DTF (z Willemem)
3. Skoncentruj się na 5 drukarni i prowadź "konsultacje" za darmo (Trojan horse)

### Scenariusz B2: Konwertujesz ale klient odchodzi w 30 dni
**Symptom:** Setupy są, ale po miesiącu klient nie płaci dalej.
**Diagnoza:** Produkt nie rozwiązuje realnego bólu albo onboarding zostawia klienta samego.
**Akcja:**
1. 1-na-1 calls z każdym churnem — DOSŁOWNIE pytaj "co nie zadziałało"
2. Dodaj 4-tygodniowy onboarding (3 calls × 30 min)
3. Zmień model: €495 setup → €0 setup + €149/mnd (niższa bariera wejścia)

### Scenariusz B3: Klienci chcą ale nie płacą tyle ile chcesz
**Symptom:** "Fajne, ale €98/mnd to za drogo, mogę dać €40"
**Diagnoza:** Twoja value proposition nie jest dla małych drukarni, jest dla średnich.
**Akcja:**
1. Pivot na większe drukarnie (€199-499/mnd, mniej klientów ale więcej)
2. ALBO: Trzy poziomy — Solo €49 / Pro €98 / Enterprise €199
3. Sprawdź "freemium" — pierwszy klient drukarni darmowy, kolejne płatne (per-seat pricing)

### Scenariusz B4: PrintFlow OS to było złe założenie
**Symptom:** Po 3 miesiącach widzisz że to nie jest skalowalne / market jest za mały / coś fundamentalnego nie gra.
**Akcja:**
1. **STOP** — nie pakuj kolejnych 3 miesięcy w ten sam tor
2. Pivot na **NEXTAG Smart Workwear** jako #1 (przesunięte z #2)
3. PrintFlow zostaje "boutique" — tylko Willem + 2-3 najlepsi klienci, brak aktywnego marketingu

---

## BUDŻET

| Pozycja | Koszt |
|---|---|
| Domena printflow.eu/.io | €10-50/rok |
| Email (jeśli nie używasz Resend free tier) | €0-20/mies |
| Mailing tool dla outreach (opcjonalnie Lemlist/Apollo) | €0-50/mies |
| LinkedIn Sales Navigator (opcjonalnie) | €0-79/mies |
| Logo design (jeśli nie sam) | €0-50 jednorazowo |
| **TOTAL pierwsze 3 miesiące** | **€30-300** |

**Wniosek:** Możesz to zrobić praktycznie z €0 jeśli używasz Resend free + LinkedIn organic + Apollo free tier.

---

## ZASADA #1 NA 90 DNI

**Każdy wieczór zadaj sobie pytanie: "Czy to co robię TERAZ przybliża PrintFlow OS do 5 klientów?"**

Jeśli odpowiedź NIE — **przestań i zrób coś innego**.

- Pisanie kodu nowej feature, której klienci nie prosili = NIE
- Wymyślanie nowych produktów = NIE
- Optymalizacja CSS na landing = NIE (po pewnym poziomie)
- Wysłanie maila prospekta = TAK
- Demo call = TAK
- Onboarding nowego klienta = TAK
- Case study z istniejącym klientem = TAK
- Feature, którą Willem REALNIE chce = TAK

**Read more →** [akcje_natychmiast.md](./akcje_natychmiast.md)
