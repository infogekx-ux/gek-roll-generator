# Informer API — dogłębna analiza techniczna pod client portal

> Data badania: 2026-06-30. Wszystkie nazwy techniczne, endpointy i terminy holenderskie pozostawiono w oryginale.
> Pełna specyfikacja OpenAPI została pobrana i przeanalizowana bezpośrednio (zob. sekcja "Dostępność dokumentacji" oraz "## Źródła").

---

## 0. Streszczenie wykonawcze (TL;DR)

Informer (InformerOnline, marka informer.nl / api.informer.eu) udostępnia **publiczne, otwarte REST API** z **w pełni dostępną, niegated dokumentacją OpenAPI 3.0**. Istnieją **dwie wersje**: **V1** (`https://api.informer.eu/v1`, Swagger UI) i **V2** (`https://api.informer.eu/v2`, nowy interfejs Scalar, "improved structure and new endpoints"). Obie specyfikacje są publicznie pobieralne jako JSON i zostały w całości przeanalizowane na potrzeby tego dokumentu.

Uwierzytelnianie jest proste: **dwa nagłówki HTTP** — `Apikey` (klucz API generowany w ustawieniach) oraz `Securitycode` (`beveiligingscode` / kod bezpieczeństwa firmy). **Brak OAuth, brak webhooków, brak środowiska sandbox.** Format danych to **wyłącznie JSON**. Limity: **60 wywołań/minutę** i **5000 wywołań/dobę na klucz API**. Integracja działa w modelu **polling** (odpytywanie), wspieranym przez parametr `last_edit` umożliwiający przyrostową synchronizację.

Dla client portalu kluczowe jest: dane można czytać szeroko (relacje, faktury, grootboek, BTW, producten, offertes), a zapisywać można relacje/kontakty oraz większość dokumentów sprzedaży/zakupu. Brak webhooków oznacza konieczność budowy własnej warstwy pollingu i cache'owania.

---

## 1. Oficjalna dokumentacja API

### 1.1. Dostępność dokumentacji — WERYFIKACJA

**Dokumentacja jest publiczna i NIE jest zablokowana logowaniem.** Strona marketingowa <https://www.informer.nl/koppelingen/api> ("Koppelingen maken via de API") kieruje do dokumentacji technicznej. Faktyczna dokumentacja techniczna znajduje się pod:

- **`https://api.informer.eu/docs/`** — interfejs Swagger UI dla **V1**.
- **`https://api.informer.eu/docs/v2/`** — interfejs Scalar (nowoczesny renderer) dla **V2**.

Strona docs to aplikacja JS (SPA), więc przez przeglądarkę/WebFetch widać tylko nagłówek "InformerOnline API". Jednak **pliki OpenAPI/Swagger są jawnie dostępne** i zostały pobrane bezpośrednio:

- V1: **`https://api.informer.eu/docs/v1/api-docs.json`** (OpenAPI 3.0.0, ~152 KB, 51 ścieżek)
- V2: **`https://api.informer.eu/docs/v2/api-docs.json`** (OpenAPI 3.0.0, wersja 2.0.0, ~232 KB, 49 ścieżek)

Wszystkie endpointy, schematy, przykłady request/response i parametry przytoczone w tym dokumencie pochodzą **bezpośrednio z tych dwóch plików OpenAPI** (źródło pierwotne), więc nie są zgadywane.

Opis API z pliku (info.description), cytat dosłowny:

> "Move your app forward with the InformerOnline API. First make sure you have a valid Informer account, then click here to create your API key. ALL DATES ARE IN FORMAT 'YYYY-mm-dd'! All fields that are given in the documentation MUST be present in the data you send to the api. To leave a field empty, use 0 for integers and '' for strings. If anything in this documentation is not clear enough or you require assistance related to the API, you can contact support at api@informer.eu"

Dwie ważne reguły walidacyjne z tego cytatu:
1. **Wszystkie daty w formacie `YYYY-mm-dd`.**
2. **Wszystkie pola wymienione w dokumentacji MUSZĄ być obecne** w wysyłanych danych — pustych nie pomija się, tylko ustawia `0` dla integerów i `''` dla stringów (dotyczy zwłaszcza V1; V2 ma luźniejsze, jawne pola `required`).

### 1.2. Wsparcie i kontakt

Wsparcie dla deweloperów: **api@informer.eu**. Helpcentrum: <https://helpdesk.informer.eu/en/collections/9131823-api>.

---

## 2. Uwierzytelnianie: API key + beveiligingscode

### 2.1. Mechanizm — WERYFIKACJA z OpenAPI

Z `components.securitySchemes` (identyczne w V1 i V2), oba schematy to `type: apiKey`, przekazywane w **nagłówkach HTTP**:

| Schemat | Nagłówek HTTP | Znaczenie |
|---|---|---|
| `Apikey` | `Apikey` | Klucz API. "Can be created at https://app.informer.eu/settings/api/" |
| `Code` | `Securitycode` | Kod bezpieczeństwa firmy. "Can be found in your company settings at https://app.informer.eu/settings/account/" |

Globalne `security` w specyfikacji: `[{"Code": [], "Apikey": []}]` — czyli **oba nagłówki są wymagane jednocześnie** dla wszystkich endpointów.

Przykładowe nagłówki żądania:

```http
GET /v2/relations HTTP/1.1
Host: api.informer.eu
Apikey: <twój-api-key>
Securitycode: <kod-bezpieczeństwa-firmy>
Accept: application/json
```

### 2.2. Gdzie wygenerować / znaleźć

- **API key**: zaloguj się do Informer → **Instellingen (Settings) → Algemeen (General) → API-sleutels** (lub bezpośrednio `https://app.informer.eu/settings/api/`). Można utworzyć wiele kluczy, każdy do osobnej integracji/platformy. Helpdesk: "create API keys to connect with different platforms".
- **Securitycode (beveiligingscode)**: według samej specyfikacji OpenAPI — w ustawieniach firmy/konta: `https://app.informer.eu/settings/account/` (Instellingen → Mijn account). 

> ⚠️ NIEZWERYFIKOWANE / SPRZECZNE ŹRÓDŁA: Część przewodników firm trzecich (np. Webwinkelfacturen, niektóre artykuły) twierdzi, że `beveiligingscode` to "kod, którym logujesz się do Informer", i że przy integracjach wpisuje się go jako "username", a API key jako "key". Oficjalna specyfikacja OpenAPI wskazuje jednak lokalizację w *company/account settings* (`/settings/account/`), a Zenvoices podaje "Settings/General/My account". Praktycznie: kod jest powiązany z firmą/administracją, nie globalny. Należy zweryfikować w realnym koncie przy implementacji.

### 2.3. Scopes / uprawnienia

> ⚠️ NIEZWERYFIKOWANE: W specyfikacji OpenAPI **nie ma żadnego modelu scopes/permissions per-klucz** — `securitySchemes` to czyste `apiKey` bez `flows`/`scopes`. Klucz API daje dostęp do całego zakresu API w obrębie administracji powiązanej z kodem bezpieczeństwa. Nie znaleziono dokumentacji o granularnych uprawnieniach (np. tylko-odczyt vs zapis) per klucz. Zakładać należy model "all-or-nothing" w obrębie jednej administracji do czasu potwierdzenia.

---

## 3. Dostępne endpointy

Poniżej **kompletna lista endpointów** wyekstrahowana wprost z plików OpenAPI. Skupiam się na **V2** (zalecana, "latest API with improved structure"), z odniesieniami do V1 tam, gdzie się różnią. Serwer produkcyjny V2: `https://api.informer.eu/v2`. Serwer V1: `https://api.informer.eu/v1`.

### 3.1. Relaties / Klanten / Contacten (relacje, klienci, kontakty)

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/relations` | Lista relacji (paginowana) |
| POST | `/relations` | Utwórz nową relację |
| GET | `/relations/{id}` | Pojedyncza relacja |
| PUT | `/relations/{id}` | Aktualizuj relację |
| POST | `/contact` | Utwórz kontakt (osoba kontaktowa przy relacji) |
| GET | `/contact/{id}` | Pojedynczy kontakt |
| PUT | `/contact/{id}` | Aktualizuj kontakt |

W V1 odpowiedniki to `/relation/`, `/relation/{id}/`, `/relations/`, `/contact/`, `/contact/{id}/` i — co ważne — **V1 wspiera DELETE relacji i kontaktu** (`DELETE /relation/{id}/`, `DELETE /contact/{id}/`). **V2 NIE eksponuje DELETE dla relacji/kontaktów** (zob. sekcja 5).

Parametry paginacji/filtrowania dla `GET /relations` (V2): `page` (default 1), `records` (default 20), `search` (szuka w nazwie firmy, ulicy, mieście i numerze relacji), `last_edit` (`YYYY-mm-dd` — tylko relacje edytowane po tej dacie → klucz do synchronizacji przyrostowej).

#### Przykład — POST /relations (firma), z `example` w schemacie `RelationInputCompany`:

```json
{
  "relation_number": 0,
  "relation_type": 0,
  "company_name": "Bakkerij De Gouden Bol BV",
  "street": "Voorbeeldstraat",
  "house_number": "12",
  "house_number_suffix": "A",
  "zip": "1234 AB",
  "city": "Amsterdam",
  "country": "NL",
  "email": "inkoop@voorbeeld.nl",
  "phone": "020-1234567",
  "vat": "NL123456789B01",
  "coc": "12345678",
  "iban": "NL00EXAM0000000000",
  "payment_condition_id": 1,
  "subtype": { "customer": 1 }
}
```

Pola wymagane (`RelationInputBase.required`): `relation_type` (0 = company, 1 = private person), `street`, `house_number`, `zip`, `city`, `country`. Dla firmy dodatkowo wymagane `company_name`. `relation_number` opcjonalny — jeśli `0`/brak, system wygeneruje nowy (musi być unikalny w administracji). Pola `vat`, `iban` są walidowane. `relation_type` jest realizowany jako `oneOf` (`RelationInputCompany` vs `RelationInputPrivate`).

#### Struktura odpowiedzi listy (wrapper `pagination` + tablica):

`GET /relations` zwraca obiekt `{ pagination, relations: [...] }`. Przykład `Pagination`:

```json
{ "page": 0, "records": 100, "total": 42, "pages": 1 }
```

Obiekt `Relation` (odczyt) zawiera m.in.: `id`, `relation_number`, `relation_type`, `company_name`/`firstname`/`surname_prefix`/`surname`, `street`, `house_number`, `city`, `country`, `phone`, `email`, `coc`, `vat`, `iban`, `bic`, `email_invoice`, `sales_invoice_template_id`, `payment_condition_id` itd.

#### Odpowiedź przy POST/PUT (`CreateResponse`):

```json
{ "id": 12345, "url": "https://app.informer.eu/sales-invoice/12345" }
```

### 3.2. Facturen — verkoop (faktury sprzedaży)

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/invoices/sales` | Lista faktur sprzedaży |
| POST | `/invoices/sales` | Utwórz fakturę sprzedaży |
| GET | `/invoices/sales/{id}` | Pojedyncza faktura |
| PUT | `/invoices/sales/{id}` | Aktualizuj fakturę |
| GET | `/invoices/sales/options` | Opcje (dozwolone wartości pól) dla faktury |
| GET | `/invoices/sales/pdf/{id}` | Pobierz PDF faktury |
| POST | `/invoices/sales/send/{id}` | Wyślij fakturę (np. e-mailem do relacji) |
| POST | `/invoices/sales/{id}/attachments` | Dodaj załącznik do faktury |
| GET | `/invoices/sales/{id}/attachments/{attachment_id}` | Pobierz załącznik |
| DELETE | `/invoices/sales/{id}/attachments/{attachment_id}` | Usuń załącznik faktury |

Parametry `GET /invoices/sales`: `page`, `records`, `filter` (enum: `concept`, `open`, `collect`, `accruals`, `collection_fines`, `payment_plans`), `last_edit`, `relation_id`, `sort` (format `field.direction`, np. `date.desc`; pola: `created`, `name`, `number`, `date`, `amount`, `invoiceAmountPaid`, `invoiceAmountOpen`).

#### Przykład — POST /invoices/sales (`SalesInvoiceInput.example`):

```json
{
  "relation_id": 1001,
  "invoice_date": "2024-01-15",
  "payment_condition_id": 1,
  "currency_id": 1,
  "vat_option": "excl",
  "template_id": 1,
  "reference": "PO-2024-001",
  "lines": [
    {
      "info": false,
      "qty": 2,
      "description": "Broodlevering week 3",
      "amount": 50.0,
      "vat_id": 1,
      "ledger_id": 8000
    }
  ]
}
```

Pola wymagane: `relation_id`, `invoice_date`, `payment_condition_id`, `currency_id`, `vat_option`, `template_id`, `lines`. `vat_option` enum: `incl`, `excl`, `shifted`, `icv_within_eu`, `icv_outside_eu` (musi pasować do `vat_id` w liniach). `delivery_date` wymagane dla administracji AT i DE. Linie (`InvoiceLineInput`): dla zwykłej linii `info=false` + `qty`, `description`, `amount`, `vat_id`, `ledger_id` (opcjonalnie `discount`, `costs_id`, `product_id`); dla linii informacyjnej `info=true` + sam `description`. Uwaga semantyczna: `amount` jest brutto, gdy `vat_option=incl`, w przeciwnym razie netto.

### 3.3. Facturen — inkoop (faktury zakupu)

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/invoices/purchase` | Lista faktur zakupu |
| POST | `/invoices/purchase` | Utwórz fakturę zakupu |
| GET | `/invoices/purchase/{id}` | Pojedyncza faktura zakupu |
| GET | `/invoices/purchase/options` | Opcje pól |
| GET | `/invoices/purchase/pdf/{id}` | PDF faktury zakupu |

Uwaga: w V2 dla faktur zakupu **brak PUT** (tylko POST + GET). W V1 było `POST /invoice/purchase/` i `GET /invoice/purchase/{id}/` oraz `GET /invoices/purchase/` — również bez aktualizacji.

### 3.4. Facturen — recurring / abonnementen (faktury cykliczne)

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/invoices/recurring` | Lista faktur cyklicznych |
| POST | `/invoices/recurring` | Utwórz fakturę cykliczną |
| GET | `/invoices/recurring/{id}` | Pojedyncza |
| PUT | `/invoices/recurring/{id}` | Aktualizuj |
| GET | `/invoices/recurring/options` | Opcje pól |
| GET | `/subscription-types` | Typy subskrypcji (słownik) |

> ⚠️ UWAGA WERSYJNA: To, co w **V1** nazywało się **`/subscription/`** (`POST/GET/PUT /subscription/`, `GET /subscriptions/`, tag "Subscriptions" — abonnementen), w **V2 zostało zastąpione** mechanizmem **Recurring Invoices** (`/invoices/recurring`). Słownik `GET /subscription-types` (`/subscription-types/` w V1) jest obecny w obu. Jeśli portal ma obsługiwać "abonnementy", w V2 należy używać `/invoices/recurring`.

### 3.5. Grootboek / journaalposten / rekeningschema

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/ledgers` | Wszystkie grootboekrekeningen (konta księgi głównej) |
| GET | `/journals` | Wszystkie dagboeken/journals |
| GET | `/memorandum` | Lista wpisów memoriałowych (memoriaalboekingen) |
| POST | `/memorandum` | Utwórz wpis memoriałowy |
| GET | `/memorandum/{id}` | Pojedynczy wpis |
| PUT | `/memorandum/{id}` | Aktualizuj wpis |

Przykład `Ledger` (odczyt):

```json
{
  "id": 1, "number": "8000", "description": "Omzet", "type": "revenue",
  "category": "Winst en verlies", "vat_code": "VH", "costs": "0",
  "rgs": null, "blocked": false,
  "condensation_1": null, "condensation_2": null, "condensation_3": null
}
```

Przykład `Journal`:

```json
{ "id": 1, "number": 10, "description": "Verkoopboek", "type": "sales", "ledger_id": 1300 }
```

**Ważne dla portalu**: nie istnieje endpoint typu "pobierz wszystkie journaalposten / mutacje księgowe" jako surowy dziennik transakcji. Dziennik księgowy odczytuje się pośrednio przez **dokumenty** (faktury, ontvangsten, salesbook, memorandum) i **raporty** (sekcja 3.10). `memorandum` (memoriaalboeking) jest jedynym ogólnym mechanizmem ręcznego księgowania przez API. W V1 odpowiednik to `/memorandumbook/` (`POST`) i `/memorandumbooks/` (`GET`).

### 3.6. BTW / VAT (podatek VAT)

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/vat` | Wszystkie opcje BTW (słownik stawek) |

Przykład `Vat`:

```json
{
  "id": 1, "name": "Hoog tarief", "percentage": 21.0,
  "invoice_type": "1", "vat_code": "VH", "vat_shifted": "0", "available": true
}
```

BTW jest więc **tylko do odczytu** jako słownik — `vat_id` z tej listy wpina się w linie faktur. **Brak endpointu do generowania/wysyłania deklaracji BTW (BTW-aangifte)** przez API. Rozliczenie VAT widać pośrednio w raportach (saldo grootboek kont VAT) — zob. 3.10.

### 3.7. Producten (produkty/artykuły)

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/products` | Wszystkie produkty |

W V1 dostępne też `GET /product/{id}/` (pojedynczy). **Produkty są tylko do odczytu przez API** (brak POST/PUT/DELETE w obu wersjach). Przykład `Product`:

```json
{
  "id": 1, "product_code_sales": "BR-001", "description_sales": "Volkoren brood",
  "product_type": "product", "amount_sales": 3.5, "vat_id_sales": 1, "ledger_id_sales": 8000,
  "suppliers": [
    { "relation_id": 2001, "product_code": "MEEL-001",
      "product_description": "Tarwebloem 25kg", "product_price": 18.5, "product_tax_id": 1 }
  ]
}
```

`product_id` można podać w linii faktury, gdy aktywny jest moduł handlowy (trade module).

### 3.8. Offertes (oferty/quotations)

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/quotations` | Lista ofert |
| POST | `/quotations` | Utwórz ofertę |
| GET | `/quotations/{id}` | Pojedyncza |
| PUT | `/quotations/{id}` | Aktualizuj |
| GET | `/quotations/options` | Opcje pól |
| GET | `/quotations/pdf/{id}` | PDF oferty |
| POST | `/quotations/send/{id}` | Wyślij ofertę |

### 3.9. Sales orders, salesbook, receipts (zamówienia, sprzedaż, ontvangsten)

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET/POST | `/orders/sales` | Lista / utworzenie zamówienia sprzedaży |
| GET/PUT | `/orders/sales/{id}` | Pojedyncze / aktualizacja |
| GET | `/orders/sales/options`, `/orders/sales/pdf/{id}` | Opcje / PDF |
| POST | `/orders/sales/send/{id}` | Wyślij zamówienie |
| GET/POST | `/salesbook` | Lista / utworzenie wpisu salesbook (verkoopboek) |
| GET/PUT | `/salesbook/{id}` | Pojedynczy / aktualizacja |
| GET | `/salesbook/options`, `/salesbook/pdf/{id}` | Opcje / PDF |
| GET/POST | `/receipts` | Lista / utworzenie ontvangsten (kwitów/wpłat) |
| GET/PUT | `/receipts/{id}` | Pojedynczy / aktualizacja |

`Salesbook` to mechanizm masowego/uproszczonego wprowadzania faktur sprzedaży do verkoopboek bez generowania pełnego dokumentu PDF z layoutem.

### 3.10. Raporty, słowniki i pozostałe

| Metoda | Ścieżka (V2) | Cel |
|---|---|---|
| GET | `/administration` | Dane administracji (firmy) |
| GET | `/reports/balance` | Bilans (balans) |
| GET | `/reports/column-balance` | Kolombalans (saldi/obroty kont) |
| GET | `/currencies` | Waluty |
| GET | `/costs` | Kostenplaatsen (cost centres / MPK) |
| GET | `/payment-conditions` | Warunki płatności (betalingscondities) |
| GET | `/templates` | Szablony dokumentów |
| GET | `/attachments` | Wszystkie załączniki |

> Uwaga: V1 miało dodatkowo `GET /reports/ledger/` (raport pojedynczego grootboek). W V2 nie znaleziono `/reports/ledger`. ⚠️ NIEZWERYFIKOWANE, czy raport per-ledger został usunięty czy przeniesiony.

### 3.11. Endpointy obecne TYLKO w V1 (usunięte/niezmigrowane do V2)

V1 zawierał moduł **rittenregistratie** i pojazdów, których **brak w V2**:

- `POST/GET/PUT /ride/`, `GET /rides/` — przejazdy (rides / ritten)
- `POST/GET/PUT /vehicle/`, `GET /vehicles/` — pojazdy (vehicles / voertuigen)
- `GET /units/` — jednostki miary (units)
- `GET /pdf/{type}/{id}` — generyczny endpoint PDF (w V2 zastąpiony dedykowanymi `/.../pdf/{id}` per typ)
- `/subscription/` (zob. 3.4 — zastąpione recurring invoices)

Dla client portalu finansowego moduł ritten/vehicles prawdopodobnie nieistotny — ale jeśli będzie potrzebny, **wymaga V1** (lub V1+V2 równolegle).

---

## 4. Formaty danych, paginacja, limity, sandbox

### 4.1. Format danych

- **Wyłącznie JSON.** OpenAPI deklaruje `application/json` dla request i response; renderer V2 nawet wymusza nagłówek `Accept: application/json` (`onBeforeRequest`). **Słowa "XML" nie ma w żadnej z dwóch specyfikacji** — w przeciwieństwie do np. e-Boekhouden.nl (które ma SOAP/XML), Informer jest czysto RESTowo-JSONowe.
- **Daty**: zawsze `YYYY-mm-dd`.
- **Puste pola (zwłaszcza V1)**: `0` dla integerów, `''` dla stringów; wszystkie udokumentowane pola muszą być obecne.

### 4.2. Paginacja

Model offset/page: parametry zapytania `page` (domyślnie 1) i `records` (domyślnie 20 dla relacji; konfigurowalny). Odpowiedzi listowe są opakowane: `{ "pagination": { page, records, total, pages }, "<zasób>": [...] }`. Nazwa klucza tablicy zależy od zasobu (zweryfikowane z OpenAPI V2):

| Endpoint | Klucz tablicy |
|---|---|
| `/relations` | `relations` |
| `/invoices/sales`, `/invoices/purchase`, `/quotations`, `/salesbook` | `invoices` |
| `/invoices/recurring` | `recurring_invoices` |
| `/orders/sales` | `orders` |
| `/receipts` | `receipts` |
| `/memorandum` | `memorandums` |

> ⚠️ GOTCHA dla implementacji: klucz tablicy NIE jest jednolity — kilka różnych zasobów (faktury, oferty, salesbook) zwraca tablicę pod kluczem `invoices`. Parser musi to uwzględnić per-endpoint.

### 4.3. Limity (rate limiting) — WERYFIKACJA

Oficjalny artykuł helpdesk "What are the limits of the API?":

- **60 wywołań / 60 sekund / klucz API** (limit per minutę)
- **5000 wywołań / 24 h / klucz API** (limit dobowy)
- **Nagłówki zwracane przy każdym wywołaniu**:
  - `X-RateLimit-Limit`, `X-RateLimit-Remaining` (per minuta)
  - `X-DailyLimit-Limit`, `X-DailyLimit-Remaining` (per doba)
- **Klucze utworzone przed 10-04-2024 nie mają przypisanego limitu** (legacy, bez restrykcji).
- Zwiększenie limitu: e-mail na **api@informer.eu** z tematem **`[Request limit increase]`**.

> ⚠️ NIEZWERYFIKOWANE: dokładny kod statusu przy przekroczeniu (najpewniej HTTP 429, ale słowo "429" nie pada w spec ani w artykule; brak też informacji o `Retry-After`). Należy potwierdzić empirycznie.

**Implikacja dla portalu**: 5000/dobę/klucz to mało przy dużej liczbie klientów. Trzeba: (a) używać `last_edit` do synchronizacji przyrostowej, (b) cache'ować słowniki (ledgers, vat, currencies, payment-conditions, templates) rzadko, (c) rozważyć osobny klucz API per administracja klienta (limit jest per klucz), (d) ewentualnie wnioskować o podniesienie limitu.

### 4.4. Sandbox / środowisko testowe

> ⚠️ NIEZWERYFIKOWANE / PRAWDOPODOBNIE BRAK: W żadnej z dwóch specyfikacji OpenAPI ani w przejrzanej dokumentacji **nie ma wzmianki o sandbox / test environment / mock URL** (jedyny "mocking" w V1 to artefakt SwaggerHub: `"description": "SwaggerHub API Auto Mocking"`, nie realne środowisko testowe Informer). Serwery produkcyjne to `https://api.informer.eu/v1` i `/v2`. Najpewniej testy wykonuje się na realnym (testowym) koncie/administracji. Do potwierdzenia z api@informer.eu.

---

## 5. Co realnie można synchronizować dwukierunkowo (write) vs read-only

Na podstawie metod HTTP w OpenAPI V2:

### Zapis (POST/PUT) — możliwy dwukierunkowo:
- **Relaties** — POST, PUT (tworzenie i aktualizacja). **Brak DELETE w V2** (V1 miało DELETE).
- **Contacten** — POST, PUT (brak DELETE w V2).
- **Sales invoices** — POST, PUT + send + załączniki (POST/DELETE attachment).
- **Purchase invoices** — tylko POST (brak PUT/DELETE — faktury zakupu nie da się zaktualizować przez API).
- **Recurring invoices** — POST, PUT.
- **Quotations (offertes)** — POST, PUT + send.
- **Sales orders** — POST, PUT + send.
- **Salesbook** — POST, PUT.
- **Receipts (ontvangsten)** — POST, PUT.
- **Memorandum (memoriaalboeking)** — POST, PUT.

### Tylko odczyt (GET) — read-only:
- **Ledgers (grootboek), journals (dagboeken)** — read-only (rekeningschema/dagboeki konfiguruje się w aplikacji, nie przez API).
- **VAT (BTW)** — read-only słownik.
- **Producten** — read-only (nie da się tworzyć/edytować produktów przez API).
- **Currencies, costs (kostenplaatsen), payment-conditions, templates, subscription-types, administration, attachments** — read-only.
- **Reports (balance, column-balance)** — read-only.

### Brak operacji w ogóle (gotcha):
- **Brak DELETE** dla relacji, kontaktów, faktur, ofert (poza usuwaniem załączników faktury sprzedaży). Czyli przez API nie usuwa się dokumentów — co przy portalu wymaga strategii "anulowania" po stronie aplikacji, nie kasowania.
- **Brak zapisu** dla produktów, grootboek, BTW, dagboeków.

**Wniosek**: realny "two-way sync" obejmuje przede wszystkim **relacje/klientów oraz dokumenty sprzedażowe (faktury, oferty, zamówienia, ontvangsten, memoriaal)**. Plan kont, podatki i produkty to dane referencyjne — read-only — które portal powinien tylko czytać i cache'ować, a konfigurować w samym Informerze.

---

## 6. Webhooks / push vs polling

> ⚠️ WERYFIKACJA: **Brak webhooków.** Słowo "webhook" nie występuje w żadnej z dwóch specyfikacji OpenAPI ani w przejrzanej dokumentacji. Nie ma też push/streaming/events. **Model integracji to wyłącznie polling.**

Mechanizmy wspierające efektywny polling:
- Parametr **`last_edit`** (`YYYY-mm-dd`) na endpointach listowych (relacje, faktury sprzedaży i in.) — zwraca tylko rekordy zmienione po dacie → synchronizacja przyrostowa (delta).
- **`sort`** (np. `date.desc`) i **`filter`** (status faktury) — zawężanie zbioru.

**Implikacja dla portalu**: trzeba zbudować własny scheduler/poller (np. co X minut), pamiętać znacznik ostatniej synchronizacji per zasób/administracja, respektować limity 60/min i 5000/dobę. Brak webhooków oznacza opóźnienie (latency) między zmianą w Informerze a odświeżeniem portalu = częstotliwość pollingu. Granularność `last_edit` to **dzień** (`YYYY-mm-dd`), nie timestamp — przy pollingu śróddziennym i tak trzeba przepuszczać cały dzień bieżący i deduplikować po `id`/`last_edit` po stronie portalu. ⚠️ Brak potwierdzenia, czy istnieje filtr z dokładnością do godziny.

---

## 7. Konkurencyjne / istniejące integracje (kto już integruje z Informer)

Informer prowadzi marketplace koppelingen: <https://www.informer.nl/koppelingen> — pogrupowany na ~13 kategorii: **API, Banken, CRM Software, Betaalproviders, Factuurverwerking, Incassobureau, Kassasystemen, Overheid (KvK, Peppol, Belastingdienst), Rapportagesoftware, Rittenregistratie, Salarisadministratie, Urenregistratie, Webshops.**

Konkretni, zweryfikowani partnerzy/integracje:

- **Appfront** (<appfront.nl>) — agencja budująca koppelingi na zamówienie przez open API; reklamuje automatyczną synchronizację "facturen, klanten, BTW en grootboek" z webshopami (WooCommerce, Shopify), CRM, oprogramowaniem fakturowym; wsparcie Zapier & Make. Robi też koppelingi do Exact Online, Snelstart, Navision, Pipedrive, Nmbrs. (Strona ich Informer-koppeling zwróciła HTTP 403 przy automatycznym fetchu — treść z wyników wyszukiwarki.)
- **KPI Solutions** (<kpisolutions.nl>) — firma od integracji API/middleware, łączy systemy biznesowe; ogólny dostawca koppelingów (w tym księgowych).
- **Webwinkelfacturen** (<webwinkelfacturen.nl>) — platforma pośrednicząca: podłącza webshopy (Mijnwebwinkel, JouwWeb, Bol, Amazon i in.) do Informera; każde zamówienie → automatyczna faktura w Informer. Integracja idzie przez ich platformę, nie bezpośrednio z webshopu.
- **Inserve** (<informer.nl/koppelingen/crm-software/inserve>, docs.inserve.nl) — CRM/ticketing dla IT/MSP. Produkty i debiteuren ładowane do Inserve; godziny i produkty zapisywane na ticketach pojawiają się jako concept-facturen w Informer. Reklamują ~8 h/miesiąc oszczędności.
- **Employes** (support.employes.nl) — salarisadministratie (płace); co miesiąc automatycznie wrzuca journaalpost (księgowanie płac) do Informer.
- **Speedbooks** (<speedbooks.nl>, partnerstwo ogłoszone z Informer) — rapportagesoftware; ciągnie dane z administracji Informer do dashboardów/raportów finansowych, automatyczne odświeżanie. Łączy się również bezpośrednio do bazy ("databasekoppelingen-online").
- **Zenvoices** (help.zenvoices.com) — factuurverwerking (OCR/scan & herken faktur zakupu) → wysyła faktury zakupu do Informer; ich dokumentacja "Points of attention when integrating with Informer" jest cennym źródłem gotchas (zob. sekcja 8).
- **Brixxs** (brixxs.com) — agencja oferująca budowę koppelingów API z Informer (treść głównie consultingowa).

> Wzmianka o "**KvK, Peppol, Belastingdienst**" w kategorii Overheid sugeruje, że niektóre integracje rządowe (e-fakturowanie Peppol, dane KvK) są wbudowane po stronie Informera — ale ⚠️ NIEZWERYFIKOWANE, czy są wystawione przez publiczne API, czy tylko jako gotowe funkcje aplikacji.

**Wniosek konkurencyjny**: ekosystem jest dojrzały, ale zdominowany przez (a) wyspecjalizowane vertykalne koppelingi (płace, CRM/MSP, factuurverwerking, raportowanie) i (b) agencje budujące integracje na zamówienie. **Nie znaleziono gotowego "client portalu"** (portalu dla klientów biura/firmy z wglądem w faktury/saldo) jako produktu z półki — to potencjalna luka rynkowa dla budowanego produktu.

---

## 8. Praktyczne gotchas, ograniczenia i czego brakuje dla client portalu

Część potwierdzona z OpenAPI, część z dokumentacji integracyjnej Zenvoices (realne doświadczenie produkcyjne):

### Z analizy OpenAPI:
1. **Brak webhooków → tylko polling** (sekcja 6). Trzeba budować scheduler + delta-sync + cache.
2. **Limity 60/min, 5000/dobę per klucz** (sekcja 4.3) — krytyczne przy wielu administracjach; klucz per klient, cache słowników.
3. **`last_edit` ma granularność dzienną** (`YYYY-mm-dd`), nie timestamp — utrudnia near-real-time.
4. **Brak DELETE** dokumentów; brak PUT dla faktur zakupu — strategia anulowania, nie kasowania.
5. **Producten, grootboek, BTW = read-only** — portal nie skonfiguruje planu kont/produktów, tylko je odczyta.
6. **Niejednolity klucz tablicy w odpowiedziach** (`invoices` używane przez kilka różnych zasobów).
7. **Brak modelu scopes** — klucz daje pełen dostęp w administracji; ostrożność z przechowywaniem `Apikey` + `Securitycode`.
8. **Dwie wersje API (V1/V2) z rozjazdem funkcji** — ritten/vehicles/units/per-ledger-report tylko w V1; abonnementy w V2 to recurring invoices. Wybór wersji wpływa na zakres.
9. **Sztywna walidacja**: wszystkie udokumentowane pola obecne, daty `YYYY-mm-dd`, `vat_option` musi pasować do `vat_id` linii, `ledger_id` musi być zgodny z `vat_id`, `costs_id` (kostenplaats) wymagany lub zabroniony zależnie od konta.
10. **Brak surowego dziennika księgowego (journaalposten)** jako strumienia — mutacje czyta się przez dokumenty + raporty (balance/column-balance). Memoriaal (`/memorandum`) to jedyne ogólne ręczne księgowanie.
11. **Brak endpointu BTW-aangifte** — deklaracji VAT nie złoży się przez API.

### Z doświadczenia integracyjnego (Zenvoices, "Points of attention"):
12. **Wszystkie relacje są jednocześnie klientem i dostawcą** — "lack of API filtering capability"; brak rozróżnienia po stronie API przy pobieraniu (trzeba filtrować po `subtype` po swojej stronie).
13. **`relation_type` domyślnie firma** — oznaczenie osoby prywatnej bywa nieobsługiwane w niektórych przepływach.
14. **Załączniki**: tylko PDF przechodzi bezpośrednio (inne formaty konwertowane do PDF), **max 1 dokument na transakcję, do 8 MB**.
15. **Numery transakcji generowane w Informer nie są zwracane/widoczne** w niektórych integracjach (utrudnia reconciliation po stronie portalu — trzeba trzymać własne mapowanie `id` ↔ dokument).
16. **Brak obsługi obcych walut w praktyce** — "currency is only used as a calculation tool", kurs wpisywany ręcznie; wielowalutowość ograniczona.
17. **Pola autoryzacji incasso (direct debit) nie przenoszą się na faktury**; warunki płatności liczą tylko datę wymagalności.
18. **Faktury zakupu pozwalają na odchylenie kwoty VAT od wyliczonej; sprzedażowe nie.**
19. **Ostrzeżenia o duplikatach numerów faktur** pojawiają się per konto, ale eksport i tak przechodzi (ryzyko duplikatów — deduplikacja po stronie portalu).
20. **Niewspierane**: wiele administracji na jeden konektor, G-rekeningen (G-accounts), spread transactions, projecten, kostendragers/cost units, betalingskenmerk (payment references), audit-rapporten podczas autoryzacji, Purchase-to-Pay workflow.

### Czego brakuje konkretnie dla CLIENT PORTALU:
- **Brak danych o płatnościach/saldzie debiteura jako osobnego endpointu** — status faktury (`open`, `collect` itd.) jest przez `filter`, a kwoty `invoiceAmountPaid`/`invoiceAmountOpen` przez `sort`/pola faktury, ale ⚠️ NIEZWERYFIKOWANE, czy istnieje zbiorczy "openstaande posten / debiteurensaldo" endpoint. Najpewniej trzeba agregować po stronie portalu z listy faktur.
- **Brak push/notyfikacji** o nowej fakturze/płatności dla klienta → portal musi pollingować i sam powiadamiać.
- **Brak SSO/uwierzytelniania końcowego użytkownika (klienta)** — API uwierzytelnia *integrację* (klucz firmy), nie *użytkownika końcowego*. Portal musi mieć własną warstwę auth i mapowanie użytkownik↔relacja (`relation_id`).
- **Brak sandbox** (sekcja 4.4) → testy na realnym koncie testowym.
- **Brak DELETE** → cykl życia dokumentu (storno/credit nota) trzeba modelować dokumentami sprzedaży, nie usuwaniem.
- **PDF dostępne** (`/invoices/sales/pdf/{id}` itd.) → portal może serwować oryginalne PDFy faktur klientowi — to duży plus.

---

## 9. Rekomendacje architektoniczne (skrót)

- Używać **V2** jako bazowego (`https://api.informer.eu/v2`), z fallbackiem do V1 tylko jeśli potrzebne są ritten/vehicles/units.
- **Klucz API per administracja klienta** (limity są per klucz; izolacja danych).
- **Warstwa sync (poller)**: delta przez `last_edit`, znacznik ostatniej synchronizacji per (administracja, zasób), backoff przy zbliżaniu do limitu (monitorować nagłówki `X-RateLimit-Remaining` / `X-DailyLimit-Remaining`).
- **Cache referencyjny** (ledgers, vat, currencies, payment-conditions, templates, products) odświeżany rzadko.
- **Własna tożsamość użytkownika końcowego** + mapowanie do `relation_id`; API daje tylko dostęp na poziomie firmy.
- **Serwowanie PDF** faktur/ofert klientowi przez `/.../pdf/{id}`.
- **Deduplikacja i własne mapowanie `id`** dokumentów (brak webhooków, ostrzeżenia o duplikatach nie blokują).

---

## Źródła

Dokumentacja oficjalna i specyfikacje (źródła pierwotne):
- Strona API (marketing): <https://www.informer.nl/koppelingen/api>
- Marketplace koppelingen: <https://www.informer.nl/koppelingen>
- Dokumentacja V1 (Swagger UI): <https://api.informer.eu/docs/>
- Dokumentacja V2 (Scalar): <https://api.informer.eu/docs/v2/>
- **OpenAPI V1 JSON (analizowany)**: <https://api.informer.eu/docs/v1/api-docs.json>
- **OpenAPI V2 JSON (analizowany)**: <https://api.informer.eu/docs/v2/api-docs.json>
- Generowanie klucza API: <https://app.informer.eu/settings/api/>
- Ustawienia konta/firmy (security code): <https://app.informer.eu/settings/account/>

Helpdesk / pomoc:
- "What is the Informer API and How Do I Connect the API?": <https://helpdesk.informer.eu/en/articles/8185005-what-is-the-informer-api-and-how-do-i-connect-the-api>
- "What are the limits of the API?" (rate limits): <https://helpdesk.informer.eu/en/articles/9173619-what-are-the-limits-of-the-api>
- Kolekcja API w helpdesku: <https://helpdesk.informer.eu/en/collections/9131823-api>

Integracje / partnerzy / gotchas:
- Appfront (Informer koppeling): <https://appfront.nl/diensten/web-ontwikkeling/integraties/informer-koppeling-laten-maken> (zwróciło HTTP 403 przy fetchu)
- KPI Solutions: <https://kpisolutions.nl/nieuws/welke-systemen-kun-je-koppelen-met-een-api/>
- Brixxs FAQ: <https://brixxs.com/faq/hoe-kan-ik-een-api-koppeling-maken-met-informer/>
- Webwinkelfacturen (handleidingen): <https://www.webwinkelfacturen.nl/handleiding-mijnwebwinkel-informer>
- Inserve: <https://www.informer.nl/koppelingen/crm-software/inserve> oraz <https://docs.inserve.nl/nl/article/informer>
- Employes: <https://support.employes.nl/nl/articles/3582573-informer-koppeling-instellen>
- Speedbooks: <https://www.informer.nl/koppelingen/rapportage/speedbooks> oraz <https://www.speedbooks.nl/kennisbank/handleidingen/informer>
- **Zenvoices — "Points of attention when integrating with Informer"** (kluczowe gotchas): <https://help.zenvoices.com/en/articles/5919444-points-of-attention-when-integrating-with-informer>
- API Tracker (profil): <https://apitracker.io/a/informer-nl>

---

*Uwaga metodyczna: endpointy, parametry, schematy i przykłady JSON w sekcjach 2–5 pochodzą bezpośrednio z pobranych plików OpenAPI V1/V2. Limity i nagłówki rate-limit — z oficjalnego artykułu helpdesk. Gotchas integracyjne (sekcja 8, pkt 12–20) — z dokumentacji Zenvoices (integracja produkcyjna), więc opisują zachowanie API w praktyce. Wszystkie twierdzenia, których nie dało się potwierdzić źródłem, oznaczono "⚠️ NIEZWERYFIKOWANE".*
