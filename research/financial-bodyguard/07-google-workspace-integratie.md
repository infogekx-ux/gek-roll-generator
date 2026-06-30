# Integracja Google Workspace (Drive, Sheets, Calendar) w portalu klienta holenderskiego księgowego

> Dokument badawczy — Financial Bodyguard, część 07
> Data: 2026-06-30
> Zakres: integracja **Google Drive API**, **Google Sheets API**, **Google Calendar API** z portalem klienta (client portal) dla holenderskiego *boekhouder/accountant*, z naciskiem na zgodność z **AVG/GDPR** oraz **verwerkersovereenkomst (DPA)**.

Oznaczenia:
- ⚠️ **NIEZWERYFIKOWANE** — twierdzenie, którego nie udało się jednoznacznie potwierdzić w oficjalnej dokumentacji w trakcie badania; wymaga weryfikacji przed wdrożeniem.
- Terminy techniczne (scopes, shared drive, service account, restricted scope, verwerkersovereenkomst) zostawiam w oryginale.

---

## 0. Streszczenie / kontekst produktowy

Produkt to portal klienta dla holenderskiego biura rachunkowego. Klienci (przedsiębiorcy, ZZP'ers, MKB) wgrywają dokumenty finansowe — *bankafschriften* (wyciągi bankowe), *facturen* (faktury), *bonnetjes* (paragony) — a księgowy je przetwarza, prowadzi *BTW-aangifte* (deklaracje VAT), pilnuje *deadlines* i umawia *afspraken* (spotkania).

Pokusa, by oprzeć cały backend na Google Workspace (Drive jako storage, Sheets jako baza danych, Calendar jako booking), jest duża, bo księgowy często **już** ma Workspace. Ale każda z tych decyzji ma poważne konsekwencje w zakresie **OAuth verification burden** (zwłaszcza restricted scopes + CASA security assessment) oraz **AVG** (dokumenty finansowe = dane osobowe, często wrażliwe biznesowo). Ten dokument analizuje każdą warstwę i kończy się jednoznaczną, opiniotwórczą rekomendacją architektoniczną.

---

## 1. Google Drive API — struktura folderów per klient, uprawnienia, scopes

### 1.1 Programowe tworzenie struktury folderów

W Drive API v3 **folder to po prostu plik** o specjalnym MIME type `application/vnd.google-apps.folder`. Strukturę:

```
/Klanten/{naam}/{jaar}/{kwartaal}/{bankafschriften|facturen|bonnetjes}
```

buduje się rekurencyjnie metodą `files.create`, gdzie każdy poziom otrzymuje `parents: [idRodzica]`. Pseudokod:

```
function ensureFolder(name, parentId):
    # idempotentnie: najpierw szukaj
    q = "name = '{name}' and '{parentId}' in parents
         and mimeType = 'application/vnd.google-apps.folder'
         and trashed = false"
    existing = drive.files.list(q=q, fields="files(id)")
    if existing: return existing[0].id
    meta = { name, mimeType: 'application/vnd.google-apps.folder',
             parents: [parentId] }
    return drive.files.create(body=meta, fields='id').id
```

Kluczowe uwagi praktyczne:
- **Idempotentność** trzeba zaimplementować samodzielnie — Drive **pozwala na dwa foldery o tej samej nazwie w tym samym rodzicu**. Bez `files.list` przed `create` powstaną duplikaty.
- **Limit zagnieżdżenia: max 100 poziomów** zarówno w My Drive, jak i w shared drive ([Google: large migration best practices](https://knowledge.workspace.google.com/admin/getting-started/google-drive-large-migration-best-practices)). Struktura `Klanten/naam/jaar/kwartaal/typ` to 5 poziomów — bez problemu.
- **Upload dokumentów**: `files.create` z `media` (multipart lub resumable upload dla większych plików). Resumable upload zalecany dla >5 MB i niestabilnych łączy.
- **Wydajność**: budowanie głębokiej struktury to wiele round-tripów. Warto cache'ować mapę `{klant -> folderId}` w lokalnej bazie, żeby nie odpytywać Drive za każdym razem.

### 1.2 Uprawnienia per folder (permissions)

Uprawnienia ustawia się przez `permissions.create` na zasobie pliku/folderu ([Method: permissions.create](https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/create)). Role: `owner`, `organizer`, `fileOrganizer`, `writer`, `commenter`, `reader` ([Roles and permissions](https://developers.google.com/workspace/drive/api/guides/ref-roles)).

**Krytyczna zasada dziedziczenia**: pliki dziedziczą uprawnienia folderu, w którym się znajdują. Dlatego **uprawnienia należy ustawiać na folderze, ZANIM wrzuci się do niego pliki** ([Share files, folders, and drives](https://developers.google.com/workspace/drive/api/guides/manage-sharing)). Dla portalu oznacza to: utwórz `/Klanten/{naam}/`, nadaj klientowi rolę `reader`/`writer` na tym folderze, a wszystkie kwartały i podfoldery odziedziczą dostęp.

Wzorzec dla portalu:
- Folder `/Klanten/{naam}/` → klient dostaje `writer` (może wgrywać) lub `reader` (tylko podgląd; upload przez aplikację, nie przez UI Drive).
- Foldery wewnętrzne księgowego (`/Werkdocumenten/`) → bez współdzielenia z klientem.

### 1.3 Shared drives vs My Drive

| Aspekt | **My Drive** | **Shared drive (Gedeelde Drive)** |
|---|---|---|
| Właściciel | konkretny **użytkownik** | **organizacja** |
| Co przy odejściu osoby | pliki znikają / wymagają transferu | **zostają na miejscu** |
| Service account może być właścicielem | tak (własne pliki SA) | **nie** — ale **może tworzyć** zasoby w shared drive |
| Model uprawnień | per-plik/folder | członkostwo w drive + per-plik |
| Odpowiedni dla | dane prywatne pojedynczej osoby | **dane firmowe/wielu klientów** |

Źródła: [Manage shared drives](https://developers.google.com/workspace/drive/api/guides/manage-shareddrives), [Service accounts overview](https://docs.cloud.google.com/iam/docs/service-account-overview).

**Dla portalu księgowego shared drive jest właściwym wyborem**, bo:
1. Dokumenty klientów to aktywa firmy, nie jednej osoby — przy rotacji pracowników nic nie ginie.
2. Service account **nie może posiadać** plików w My Drive jako trwały właściciel w sposób, który przeżyje organizacyjnie — ale **może tworzyć i zarządzać** plikami w shared drive. To rozwiązuje fundamentalny problem: chcemy, by backend (service account) tworzył strukturę, a właścicielem pozostawała organizacja.

⚠️ **NIEZWERYFIKOWANE**: dokładne limity (liczba plików per shared drive, liczba członków) zmieniają się w czasie; przed wdrożeniem należy sprawdzić aktualne limity Google dla shared drives.

### 1.4 Service account vs OAuth user consent

To najważniejsza decyzja architektoniczna w tej warstwie.

**Service account (+ ewentualnie Domain-Wide Delegation):**
- Backend działa jako tożsamość maszynowa, bez interaktywnego logowania użytkownika.
- Service account **nie należy do domeny Workspace** — zasoby współdzielone z całą domeną **nie są** automatycznie dzielone z SA ([IAM service accounts](https://docs.cloud.google.com/iam/docs/service-account-overview)).
- **Domain-Wide Delegation (DWD)** pozwala SA *impersonować* użytkowników domeny i sięgać do ich My Drive / shared drives bez ręcznego udostępniania. DWD bywa też używane do rozkładania write'ów na wielu impersonowanych użytkowników, by ominąć limity quota.
- ⚠️ DWD to **potężne i ryzykowne** uprawnienie (SA może podawać się za dowolnego użytkownika domeny). Wymaga rygorystycznej ochrony klucza i wąskiego zakresu scopes. Wielu audytorów bezpieczeństwa traktuje DWD jako red flag.

**OAuth user consent (3-legged):**
- Każdy klient/księgowy klika „Zaloguj przez Google" i wyraża zgodę na konkretne scopes.
- Aplikacja działa **w imieniu** zalogowanego użytkownika i widzi tylko to, co on.
- Z `drive.file` aplikacja widzi **wyłącznie pliki, które sama utworzyła lub które użytkownik jawnie otworzył przez picker** — minimalny dostęp.

**Wniosek dla tej warstwy**: dla zarządzanej, firmowej struktury dokumentów najczystszym modelem jest **service account tworzący zasoby w shared drive należącym do biura rachunkowego** (bez DWD, jeśli to możliwe), a klient otrzymuje dostęp przez `permissions.create`. To unika delikatnego DWD i jednocześnie utrzymuje własność po stronie organizacji.

### 1.5 Scopes — `drive.file` vs `drive` vs `drive.readonly` i ciężar weryfikacji

To jest **sedno** całej warstwy Drive z perspektywy kosztu i ryzyka.

| Scope | URL | Klasyfikacja | Co daje |
|---|---|---|---|
| `drive.file` | `https://www.googleapis.com/auth/drive.file` | **non-sensitive** | Tworzenie/modyfikacja **tylko plików utworzonych przez aplikację** lub jawnie otwartych przez użytkownika |
| `drive.appdata` | `https://www.googleapis.com/auth/drive.appdata` | non-sensitive | Ukryty folder konfiguracyjny aplikacji |
| `drive` | `https://www.googleapis.com/auth/drive` | **restricted** | „View and manage **all** your Drive files" |
| `drive.readonly` | `https://www.googleapis.com/auth/drive.readonly` | **restricted** | „View and download **all** your Drive files" |
| `drive.metadata` | `https://www.googleapis.com/auth/drive.metadata` | restricted | Metadane wszystkich plików |

Źródło: [Choose Google Drive API scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).

**Implikacje dla OAuth verification / security-assessment burden:**

- Aplikacje używające **restricted scopes** (`drive`, `drive.readonly`, `drive.metadata`) muszą przejść **restricted scope verification** ([Restricted scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)).
- Jeśli aplikacja **przechowuje lub przesyła dane z restricted scope na własnych serwerach** (a portal księgowego z definicji to robi), wymagany jest **third-party security assessment** w ramach **CASA** (Cloud Application Security Assessment, App Defense Alliance).
- CASA: assessment **co najmniej raz na 12 miesięcy** od daty zatwierdzenia *Letter of Assessment (LOA)*. Tier 2/3 dla `drive.readonly`/`drive`. To proces płatny, czasochłonny (tygodnie–miesiące) i powtarzalny corocznie.
- **`drive.file` NIE wymaga** restricted scope verification ani third-party security assessment — Google jawnie rekomenduje migrację na `drive.file`, gdy to możliwe ([Enhancing security controls for Google Drive third-party apps](https://workspace.google.com/blog/product-announcements/enhancing-security-controls-for-google-drive-third-party-apps)).

**To jest decydujące**: różnica między `drive.file` a `drive`/`drive.readonly` to różnica między „prosta weryfikacja consent screen" a „coroczny, płatny audyt bezpieczeństwa CASA Tier 2/3 + pełny pentest dowodowy". Dla małego/średniego produktu CASA to ogromny koszt i bariera wejścia.

> **Reguła projektowa: NIGDY nie proś o `drive`/`drive.readonly`, jeśli używasz service account + shared drive lub `drive.file`.** Service account działający na własnym shared drive nie potrzebuje user-restricted scope w ogóle (autoryzacja przez konto serwisowe, nie przez consent użytkownika), więc cały problem CASA dla 3-legged OAuth znika dla tej ścieżki.

---

## 2. Google Sheets API — co księgowy trzyma w Sheets i model „arkusz jako baza danych"

### 2.1 Typowe zastosowania u boekhoudera

W praktyce holenderski księgowy trzyma w Sheets:
- **Klantenlijst** — lista klientów (naam, KvK-nummer, BTW-nummer, kontakt, status).
- **Urenregistratie** — ewidencja godzin pracy (per klient/zlecenie).
- **Deadline-tracker** — terminy *BTW-aangifte* (kwartalnie), *aangifte inkomstenbelasting*, *jaarrekening*.
- **BTW-overzicht** — zestawienia VAT per kwartał.

Te arkusze są atrakcyjne, bo księgowy edytuje je ręcznie, a portal mógłby je czytać/zapisywać programowo.

### 2.2 Programowy odczyt/zapis

Sheets API v4:
- Odczyt: `spreadsheets.values.get` / `values.batchGet` (zakresy A1, np. `Klanten!A2:F`).
- Zapis: `spreadsheets.values.update` / `values.batchUpdate` (dane) oraz `spreadsheets.batchUpdate` (struktura/formatowanie — dodawanie kolumn, formatowanie warunkowe).
- Scope: `https://www.googleapis.com/auth/spreadsheets` (read/write) lub `spreadsheets.readonly`. ⚠️ **NIEZWERYFIKOWANE** w tym badaniu, czy `spreadsheets` jest klasyfikowane jako *sensitive* czy *restricted* — należy to potwierdzić na stronie wyboru scopes Sheets przed wdrożeniem (Drive `drive.file` jest non-sensitive, ale Sheets ma własną klasyfikację).

### 2.3 Limity quota — to boli przy modelu „baza danych"

- **300 read requests / minutę / projekt** oraz **300 write requests / minutę / projekt** (plus limity per-user). Każdy **batch request liczy się jako JEDNO żądanie** — to klucz do optymalizacji ([Usage limits](https://developers.google.com/workspace/sheets/api/limits)).
- Brak twardego limitu dziennego, dopóki mieścisz się w limitach na minutę.
- ⚠️ Google planuje, że **przekroczenia quota zaczną generować opłaty na koncie Google Cloud później w 2026** ([Usage limits](https://developers.google.com/workspace/sheets/api/limits)).

### 2.4 Sheet jako lekka baza danych — tradeoffs

| Kryterium | **Google Sheet jako „DB"** | **Prawdziwa baza (np. PostgreSQL)** |
|---|---|---|
| Setup | zerowy, księgowy już to ma | wymaga hostingu, migracji |
| Edycja ręczna przez księgowego | **natywna, świetna** | wymaga UI |
| Współbieżność / blokady | brak prawdziwych transakcji, race conditions | ACID, transakcje |
| Quota / throughput | **300 req/min** — wąskie gardło | tysiące zapytań/s |
| Zapytania / relacje / joiny | brak; wszystko ręcznie | natywne SQL |
| Integralność danych (typy, constraints) | brak; wszystko to string/number w komórce | schemat, foreign keys, constraints |
| AVG / kontrola dostępu | uprawnienia na poziomie arkusza, grube | row-level security, szyfrowanie kolumn |
| Audyt / historia | wersjonowanie Sheets (ograniczone) | pełny audit log, logi DB |
| Skala (tysiące klientów × kwartały) | degraduje się | skaluje się |

**Werdykt**: Sheet jest doskonały jako **interfejs ludzki / warstwa raportowa**, którą księgowy lubi i rozumie, ale **fatalny jako source-of-truth** dla danych transakcyjnych portalu (statusy uploadów, uprawnienia, tokeny, metadane dokumentów). Brak transakcji, race conditions przy współbieżnym zapisie z aplikacji i ręcznej edycji, oraz limit 300 req/min czynią go nieodpowiednim na bazę aplikacyjną.

**Wzorzec rekomendowany**: prawdziwa baza jako source-of-truth + **jednokierunkowy eksport/sync do Sheet** (np. BTW-overzicht, deadline-tracker) jako wygodny widok dla księgowego. Sheet pozostaje „read model", nie „write model".

---

## 3. Google Calendar API — booking/afspraken

### 3.1 Możliwości API

- **Tworzenie eventów**: `events.insert`; event może zawierać `attendees`, `conferenceData` (Google Meet), oraz `reminders` (`method: email|popup`, `minutes`) ([Create events](https://developers.google.com/workspace/calendar/api/guides/create-events)).
- **Free/busy**: `freebusy.query` zwraca okna zajętości dla zbioru kalendarzy — podstawa pokazywania dostępnych slotów ([Freebusy: query](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query)).
- **Reminders**: definiowane per event (override) lub domyślne kalendarza.

### 3.2 Scopes Calendar

| Scope | Status |
|---|---|
| `https://www.googleapis.com/auth/calendar` | **restricted** |
| `https://www.googleapis.com/auth/calendar.events` | **restricted** |
| `https://www.googleapis.com/auth/calendar.events.readonly` | restricted |
| `https://www.googleapis.com/auth/calendar.readonly` | restricted |
| `https://www.googleapis.com/auth/calendar.freebusy` | (węższy) |
| `https://www.googleapis.com/auth/calendar.events.freebusy` | (węższy) |
| `https://www.googleapis.com/auth/calendar.app.created` | tworzy/zarządza **tylko** kalendarzami utworzonymi przez aplikację |

Źródło: [Choose Google Calendar API scopes](https://developers.google.com/workspace/calendar/api/auth).

**Ważne**: każda operacja create/update/delete eventów wymaga `calendar` lub `calendar.events`, a oba są **restricted** → ponownie ten sam ciężar: third-party security assessment (CASA), jeśli przechowujesz dane z tych scopes na serwerze i działasz na 3-legged OAuth produkcyjnym. ⚠️ Wyjątek `calendar.app.created` (węższy, aplikacja widzi tylko własny kalendarz) — **NIEZWERYFIKOWANE**, czy Google klasyfikuje go jako non-restricted; warto sprawdzić, bo to potencjalna ucieczka od CASA analogiczna do `drive.file`.

### 3.3 Google Calendar API bezpośrednio vs Calendly vs Cal.com

| Kryterium | **Calendar API bezpośrednio** | **Calendly (SaaS)** | **Cal.com (open-source / self-host)** |
|---|---|---|---|
| Czas wdrożenia | wysoki (sloty, strefy, bufory, reschedule budujesz sam) | minuty | średni (Postgres + Redis + OAuth apps) |
| Kontrola UX / white-label | pełna, ale dużo pracy | ograniczona do dashboardu | **pełna, fork UI, white-label** |
| OAuth/CASA burden | **na Tobie** (restricted scopes) | po stronie Calendly | po stronie Cal.com (lub Twojej przy self-host integracji z Google) |
| AVG / data residency | zależy od Twojej infry | dane u Calendly pod ich DPA | **self-host w EU → dane u Ciebie** |
| Certyfikaty | — | — | ISO 27001, SOC 2 Type II, GDPR, EU-US DPF, HIPAA |
| Koszt | API darmowe, czas drogi | ~$10–20/user/mc | self-host „darmowy" (płacisz za serwer) |

Źródła: [Cal.com vs Calendly (Contabo)](https://contabo.com/blog/calcom-vs-calendly/), [European alternatives to Calendly](https://europeanpurpose.com/alternative-to/calendly), [Cal.com](https://cal.com/).

**Werdykt dla holenderskiego księgowego (AVG-wrażliwego):**
- **Calendly** odpada lub jest ryzykowne: SaaS-only, dane bookingowe (imię, e-mail, temat spotkania = dane osobowe) lądują u amerykańskiego dostawcy; wymaga osobnego *verwerkersovereenkomst* z Calendly i analizy transferu poza EOG.
- **Budowanie na czystym Calendar API** jest możliwe, ale wciąga Cię w restricted scopes + CASA i mnóstwo pracy nad logiką slotów.
- **Cal.com self-hosted w EU** jest najlepszym kompromisem dla wymogów AVG: dane bookingowe zostają na Twojej infrastrukturze w EU, masz pełen white-label, a Cal.com sam integruje się z kalendarzem księgowego (Google/Outlook/CalDAV), więc unikasz double-bookingu. Płacisz złożonością operacyjną (Postgres, Redis, OAuth apps).

---

## 4. Bezpieczeństwo & AVG/GDPR

### 4.1 OAuth consent screen i klasy scopes

Google dzieli scopes na **non-sensitive**, **sensitive** i **restricted**. Im szerszy zakres, tym cięższa weryfikacja:
- **non-sensitive** (`drive.file`, `drive.appdata`): podstawowa weryfikacja consent screen, brak audytu.
- **sensitive**: weryfikacja Google (uzasadnienie użycia, brand verification).
- **restricted** (`drive`, `drive.readonly`, `calendar`, `calendar.events`): pełna **restricted scope verification** + **CASA security assessment**, jeśli dane lądują na serwerze ([Restricted scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)).

### 4.2 CASA security assessment

- Wymagany przy restricted scopes z server-side storage.
- Standaryzowany przez **App Defense Alliance / CASA** (Cloud Application Security Assessment).
- **Reasekcja co najmniej co 12 miesięcy** od daty LOA.
- Płatny, prowadzony przez akredytowanego assessora; wymaga dowodów na testy bezpieczeństwa, zarządzanie podatnościami, ochronę danych.

**Konsekwencja architektoniczna**: każde restricted scope = stały, coroczny koszt zgodności. Architektura powinna agresywnie **minimalizować scopes**, by tego uniknąć.

### 4.3 Token storage

- **Refresh tokeny** to klucze do danych klienta — przechowywać **zaszyfrowane at-rest** (np. KMS/secret manager, szyfrowanie kolumny), nigdy w plaintext w bazie.
- Klucz **service account JSON** = sekret najwyższej wagi (zwłaszcza z DWD). Trzymać w secret managerze, rotować, nigdy w repo.
- Zasada najmniejszych uprawnień: token z `drive.file` zamiast `drive` ogranicza promień rażenia przy wycieku.

### 4.4 Data residency — Google Workspace EU

- **Data regions** pozwalają wybrać przechowywanie *covered data* w USA lub **Europie**, z granularnością do poziomu OU ([Control over data location](https://workspace.google.com/products/admin/data-regions/), [Data covered by data regions](https://knowledge.workspace.google.com/admin/compliance/data-covered-by-data-regions)).
- **Assured Controls / Assured Controls Plus** dają twardsze gwarancje przetwarzania i retencji w EU.
- ⚠️ **Istotne zastrzeżenie**: Google to firma amerykańska podlegająca **US CLOUD Act i FISA Section 702**. Nawet przy danych w EU dostęp władz USA pozostaje prawną możliwością. To realny argument w *DPIA* przy danych finansowych klientów ([GlobalDataShield: limitations](https://globaldatashield.com/blog/google-workspace-data-residency-limitations)).

### 4.5 Verwerkersovereenkomst (DPA) — z Google i z klientami

Dwa odrębne łańcuchy odpowiedzialności:

**1. Z Google (jako subprocessor):**
- **Cloud Data Processing Addendum (CDPA)** Google (dawniej „Data Processing Amendment to Google Workspace") reguluje przetwarzanie danych osobowych. Google występuje jako **processor**, klient jako **controller/processor** ([Cloud Data Processing Addendum](https://cloud.google.com/terms/data-processing-addendum/), [Workspace DPA terms](https://workspace.google.com/terms/09242021/dpa_terms/)).
- Trzeba **aktywnie opt-in / zaakceptować** CDPA w panelu administracyjnym.
- Dla danych pod EU GDPR Google przetwarza dane w EOG lub kraju z decyzją o adekwatności i wiąże kontraktowo swoich subprocesorów.

**2. Z klientami biura (księgowy jako verwerker/processor wobec klienta):**
- W relacji księgowy↔klient role bywają różne: dla części czynności (np. samodzielna *BTW-aangifte*) księgowy może być **verwerkingsverantwoordelijke** (controller), dla innych **verwerker** (processor). ⚠️ **NIEZWERYFIKOWANE** prawnie w tym dokumencie — w NL stanowiska *NBA/SRA* i Autoriteit Persoonsgegevens bywają niuansowane; wymaga konsultacji prawnej, kiedy dokładnie potrzebny jest *verwerkersovereenkomst* z klientem.
- Praktycznie: portal przetwarzający *bankafschriften/facturen/bonnetjes* przetwarza dane osobowe (a często też dane osób trzecich w fakturach), więc **łańcuch DPA: klient → biuro → dostawca portalu → Google** musi być spójny.

### 4.6 Co AVG wymaga przy dokumentach finansowych klienta

- **Rechtmatige grondslag** (podstawa prawna) — zwykle wykonanie umowy + obowiązek prawny (m.in. *bewaarplicht* 7 lat dla administracji).
- **Dataminimalisatie & doelbinding** — zbierać tylko to, co potrzebne; nie używać dokumentów do innych celów.
- **Beveiliging** (art. 32 GDPR) — szyfrowanie at-rest/in-transit, kontrola dostępu, logowanie.
- **Verwerkersovereenkomst** z każdym processorem (Google, hosting, ewentualnie booking SaaS).
- **DPIA** zalecane przy przetwarzaniu danych finansowych na większą skalę / profilowaniu.
- **Bewaartermijnen & verwijdering** — polityka retencji i bezpiecznego usuwania zgodna z *fiscale bewaarplicht* (7 lat) ale nie dłużej niż potrzeba.
- **Rechten van betrokkenen** — inzage, correctie, verwijdering; portal musi to technicznie umożliwiać.
- **Datalek-procedure** — zgłaszanie do Autoriteit Persoonsgegevens w 72h.

---

## 5. Rekomendacja architektoniczna (opiniotwórcza)

### 5.1 Zasada nadrzędna: minimalizuj scopes, by uniknąć CASA

Cały projekt powinien być zbudowany tak, by **nigdy nie prosić o restricted scopes na 3-legged OAuth z server-side storage**, bo to wpędza w coroczny, płatny CASA security assessment. Każda decyzja poniżej wynika z tej zasady.

### 5.2 Storage dokumentów (Drive)

**Rekomendacja: tak dla Drive, ale jako shared drive + service account, NIE jako restricted-scope OAuth.**

- Utwórz **Shared Drive** należący do biura rachunkowego. Service account tworzy w nim strukturę `/Klanten/{naam}/{jaar}/{kwartaal}/{typ}` i wgrywa dokumenty. Własność = organizacja, przeżywa rotację pracowników.
- Service account **nie potrzebuje restricted scope użytkownika** — autoryzuje się własnym kluczem; dostęp do shared drive nadaje admin biura jako członka. **Unikamy CASA dla tej ścieżki w całości.**
- Jeśli mimo to potrzebny jest dostęp w imieniu użytkownika z poziomu portalu webowego klienta, użyj **`drive.file`** (non-sensitive) + Google Picker — klient widzi tylko pliki utworzone/otwarte przez aplikację. **Nigdy `drive`/`drive.readonly`.**
- Unikaj **Domain-Wide Delegation**, chyba że jest absolutnie konieczne — to red flag bezpieczeństwa i poszerza promień rażenia.
- Uprawnienia ustawiaj **na folderze przed wgraniem plików** (dziedziczenie).

⚠️ Alternatywa do rozważenia: jeśli wymogi AVG / *bewaarplicht* / kontrola nad retencją są krytyczne, **dedykowany object storage w EU** (np. S3-kompatybilny u dostawcy EU, z szyfrowaniem kontrolowanym przez Ciebie) daje większą suwerenność niż Drive i eliminuje ryzyko CLOUD Act. Drive wygrywa wygodą i tym, że księgowy już go ma; dedykowany storage wygrywa kontrolą i zgodnością. **Dla danych finansowych skłaniam się ku dedykowanemu storage EU jako source-of-truth, z Drive co najwyżej jako opcjonalnym kanałem współdzielenia z klientem.**

### 5.3 Dane aplikacji (zamiast Sheets jako DB)

**Rekomendacja: prawdziwa baza danych (PostgreSQL) jako source-of-truth. Sheets tylko jako read-model dla księgowego.**

- Metadane dokumentów, statusy, uprawnienia, tokeny, klientów, deadliny → **Postgres** (transakcje, RLS, audyt, szyfrowanie, skala). Hostowany w **EU**.
- Sheets API używaj **jednokierunkowo**: eksportuj BTW-overzicht / deadline-tracker do arkusza, który księgowy lubi przeglądać. Nigdy nie traktuj arkusza jako write-source aplikacji (race conditions, 300 req/min, brak constraints).

### 5.4 Booking / afspraken

**Rekomendacja: Cal.com self-hosted w EU, NIE czysty Calendar API, NIE Calendly.**

- Cal.com self-host trzyma dane bookingowe (dane osobowe) na Twojej infrze w EU → czyste AVG, pełen white-label, integracja z kalendarzem księgowego bez double-bookingu.
- Unikasz budowania logiki slotów/free-busy od zera **oraz** unikasz restricted Calendar scopes + CASA po Twojej stronie produktu.
- Jeśli zespół nie ma capacity na self-host: rozważ Calendar API **wyłącznie** z `calendar.app.created` (aplikacja na własnym, dedykowanym kalendarzu) — ⚠️ potwierdź klasyfikację scope; potencjalnie unika to części restricted-burden, analogicznie do `drive.file`.

### 5.5 Zgodność / AVG — checklist wdrożeniowy

1. Zaakceptuj **Google CDPA** w panelu Workspace; włącz **Data Regions = Europe** (idealnie Assured Controls).
2. Podpisz **verwerkersovereenkomst** w łańcuchu: klient → biuro → dostawca portalu → (Google jako subprocessor).
3. Przeprowadź **DPIA** dla przetwarzania dokumentów finansowych.
4. **Szyfruj** tokeny i klucz service account w secret managerze; rotuj.
5. Polityka **retencji** zgodna z 7-letnią *fiscale bewaarplicht* + bezpieczne usuwanie.
6. **Minimalizuj scopes** — audytuj, że nigdzie nie ma `drive`/`drive.readonly`/`calendar` na 3-legged OAuth.
7. Udokumentuj **subprocessor list**, *privacy notice*, procedurę *datalek* (72h do AP).
8. ⚠️ Skonsultuj prawnie role controller/processor w relacji biuro↔klient (niuans NL).

---

## 6. Podsumowanie tabelaryczne

| Warstwa | Rekomendacja | Scope / model | Dlaczego |
|---|---|---|---|
| Storage dokumentów | Dedykowany EU object-storage jako SoT; Drive opcjonalnie via **shared drive + service account** lub **`drive.file`** | non-sensitive / SA | Unika CASA i CLOUD Act; własność organizacji |
| Baza aplikacji | **PostgreSQL (EU)**; Sheets tylko read-model | `spreadsheets` jednokierunkowo | Transakcje, RLS, skala; Sheet nie nadaje się na DB |
| Booking | **Cal.com self-hosted (EU)** | (unika restricted Calendar scopes) | AVG, white-label, brak CASA po Twojej stronie |
| Zgodność | CDPA + Data Regions EU + DPA łańcuch + DPIA | — | Wymóg AVG przy danych finansowych |

---

## Źródła

- Choose Google Drive API scopes — https://developers.google.com/workspace/drive/api/guides/api-specific-auth
- Restricted scope verification (app verification) — https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification
- Enhancing security controls for Google Drive third-party apps (Workspace Blog) — https://workspace.google.com/blog/product-announcements/enhancing-security-controls-for-google-drive-third-party-apps
- Manage shared drives — https://developers.google.com/workspace/drive/api/guides/manage-shareddrives
- Share files, folders, and drives — https://developers.google.com/workspace/drive/api/guides/manage-sharing
- Roles and permissions (Drive) — https://developers.google.com/workspace/drive/api/guides/ref-roles
- Method: permissions.create (Drive v3) — https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/create
- Google Drive large migration best practices — https://knowledge.workspace.google.com/admin/getting-started/google-drive-large-migration-best-practices
- Service accounts overview (IAM) — https://docs.cloud.google.com/iam/docs/service-account-overview
- Usage limits (Google Sheets API) — https://developers.google.com/workspace/sheets/api/limits
- Freebusy: query (Calendar API) — https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query
- Choose Google Calendar API scopes — https://developers.google.com/workspace/calendar/api/auth
- Create events (Calendar API) — https://developers.google.com/workspace/calendar/api/guides/create-events
- Cloud Data Processing Addendum (Google Cloud) — https://cloud.google.com/terms/data-processing-addendum/
- Data Processing Amendment to Google Workspace (DPA terms) — https://workspace.google.com/terms/09242021/dpa_terms/
- Control over data location with Google Workspace (Data Regions) — https://workspace.google.com/products/admin/data-regions/
- Data covered by data regions — https://knowledge.workspace.google.com/admin/compliance/data-covered-by-data-regions
- Google Workspace Data Residency: Capabilities and Limitations (GlobalDataShield) — https://globaldatashield.com/blog/google-workspace-data-residency-limitations
- Cal.com vs Calendly (Contabo Blog) — https://contabo.com/blog/calcom-vs-calendly/
- European Alternatives to Calendly (European Purpose) — https://europeanpurpose.com/alternative-to/calendly
- Cal.com — https://cal.com/
