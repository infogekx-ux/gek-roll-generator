// LULBAL — scene-based level data.
// Geen quiz meer. Elke scene heeft een type + scene-specifieke items/state.

// Helper: meertalige explain-strings.
const M = (nl, en, pl) => ({ NL: nl, EN: en, PL: pl });

// ============================================================
// LEVEL 1 — De Eerste Werkdag
// ============================================================
export const LEVEL1 = {
  id: 1,
  title: M('De Eerste Werkdag', 'The First Workday', 'Pierwszy dzień pracy'),
  scenes: [
    // ----- SCENE 1: Bouwmarkt + boss confrontatie -----
    {
      id: 'bouwmarkt',
      type: 'bouwmarkt',
      maxScore: 600,
      items: [
        {
          id: 'boormachine', name: M('Boormachine', 'Drill', 'Wiertarka'), price: 220,
          truthBusiness: true, emoji: '🔩',
          explain: M(
            'Gereedschap is volledig zakelijk en valt onder KIA als ≥€450 op bedrijfsniveau.',
            'Tools are fully deductible and fall under KIA if ≥€450 at the business level.',
            'Narzędzia w pełni odliczalne, kwalifikują się do KIA (Kleinschaligheidsinvesteringsaftrek = ulga inwestycyjna) jeśli ≥€450.'
          ),
        },
        {
          id: 'veiligheidsschoenen', name: M('Veiligheidsschoenen', 'Safety shoes', 'Buty robocze'), price: 85,
          truthBusiness: true, emoji: '👢',
          explain: M(
            'Verplichte veiligheidskleding op de bouw — 100% aftrekbaar.',
            'Mandatory safety wear on construction sites — 100% deductible.',
            'Obowiązkowa odzież BHP — 100% odliczalne.'
          ),
        },
        {
          id: 'bouwhelm', name: M('Bouwhelm', 'Hard hat', 'Kask'), price: 28,
          truthBusiness: true, emoji: '⛑️',
          explain: M(
            'Veiligheidsmateriaal — gewoon aftrekbaar.',
            'Safety gear — straightforward deduction.',
            'Sprzęt BHP — proste odliczenie.'
          ),
        },
        {
          id: 'bier', name: M('Bier (12-pack)', 'Beer (12-pack)', 'Piwo (12-pak)'), price: 14,
          truthBusiness: false, emoji: '🍺',
          explain: M(
            'Bier op de zaak boeken? Nee joh. Borrel voor klant valt evt onder representatie (beperkt aftrekbaar), maar kratje thuis = privé.',
            'Beer on the business? Nope. Client drinks count as representation (limited deduction), but a crate for home = private.',
            'Piwo na firmę? Nie, kolego. Drink z klientem to ewentualnie reprezentacja (ograniczone), ale skrzynka do domu = prywatne.'
          ),
        },
        {
          id: 'koffiemachine', name: M('Espressomachine €350', 'Espresso machine €350', 'Ekspres do kawy €350'), price: 350,
          truthBusiness: false, emoji: '☕',
          explain: M(
            '€350 espressomachine voor thuis is privé, ook al neem je af en toe een mok mee naar je werkbus.',
            'A €350 home espresso machine is private, even if you sometimes take a mug to your work van.',
            'Ekspres za €350 do domu jest prywatny, nawet jeśli czasem zabierasz kubek do auta.'
          ),
        },
        {
          id: 'kabels', name: M('Kabels & connectors', 'Cables & connectors', 'Kable i złączki'), price: 45,
          truthBusiness: true, emoji: '🔌',
          explain: M(
            'Direct werkmateriaal — zakelijk en aftrekbaar.',
            'Direct work supplies — business and deductible.',
            'Materiał roboczy — firmowy i odliczalny.'
          ),
        },
        {
          id: 'lunch', name: M('Lunch broodjes', 'Lunch sandwiches', 'Lunch (kanapki)'), price: 8,
          truthBusiness: false, emoji: '🥪',
          explain: M(
            'Eigen lunch is privé (loonelementen). Zakelijke lunch met klant valt onder representatie (beperkt aftrekbaar).',
            'Your own lunch is private (wage element). Client lunches fall under representation (limited deduction).',
            'Własny lunch jest prywatny. Lunch z klientem to reprezentacja (ograniczone odliczenie).'
          ),
        },
        {
          id: 'laptop', name: M('Laptop voor werk', 'Work laptop', 'Laptop do pracy'), price: 1180,
          truthBusiness: true, emoji: '💻',
          explain: M(
            'Werklaptop zakelijk + telt mee voor KIA (vanaf totaal investering €2.901).',
            'Work laptop is business + counts toward KIA (from total investment €2,901).',
            'Laptop do pracy firmowy + liczy się do KIA (od łącznej inwestycji €2.901).'
          ),
        },
      ],
      defendCorrectPts: 80,
      defendWrongPts: 0,
      admitCorrectPts: 80,
      admitWrongPts: 0,
    },

    // ----- SCENE 2: Sorteer facturen -----
    {
      id: 'facturenSorteren',
      type: 'sort',
      maxScore: 600,
      timerSec: 90,
      buckets: ['btw21', 'btw9', 'btw0', 'prive'],
      items: [
        {
          id: 'f1', label: M('Reparatie cv-ketel — klant in Utrecht (B2C)', 'Boiler repair — client Utrecht (B2C)', 'Naprawa pieca — klient Utrecht (B2C)'),
          correct: 'btw21',
          explain: M(
            'Reparatiedienst aan particulier in NL = 21% BTW standaard.',
            'Repair service to individual in NL = 21% VAT standard rate.',
            'Naprawa dla osoby prywatnej w NL = 21% VAT (BTW = Belasting Toegevoegde Waarde = VAT).'
          ),
        },
        {
          id: 'f2', label: M('Eigen schilderij verkocht aan particulier', 'Own painting sold to individual', 'Własny obraz sprzedany osobie prywatnej'),
          correct: 'btw9',
          explain: M(
            'Origineel werk van de maker = 9% kunstenaars-tarief. Prints in oplage = 21%.',
            'Original artwork by the maker = 9% artist rate. Print runs = 21%.',
            'Oryginał od twórcy = 9% (stawka artystyczna). Reprodukcje = 21%.'
          ),
        },
        {
          id: 'f3', label: M('Software-abonnement aan Frans bedrijf (B2B, VAT-ID)', 'Software sub to French company (B2B, VAT-ID)', 'Abonament SW dla firmy francuskiej (B2B, VAT-ID)'),
          correct: 'btw0',
          explain: M(
            'Intracommunautaire B2B-dienst → verleggingsregeling, 0% NL-BTW, klant betaalt eigen tarief.',
            'Intracommunity B2B service → reverse charge, 0% NL VAT, client handles their own rate.',
            'Usługa wewnątrzwspólnotowa B2B → reverse charge, 0% NL VAT, klient rozlicza u siebie.'
          ),
        },
        {
          id: 'f4', label: M('Onderaanneming voor grote bouwer', 'Subcontracting to main contractor', 'Podwykonawstwo dla głównego wykonawcy'),
          correct: 'btw0',
          explain: M(
            'Verleggingsregeling in de bouw: factuur zonder BTW, dopisek "btw verlegd".',
            'Construction reverse charge: invoice without VAT, note "btw verlegd".',
            'Reverse charge w budowlance: faktura bez VAT, dopisek "btw verlegd".'
          ),
        },
        {
          id: 'f5', label: M('Eigen Netflix-abo thuis €13/mnd', 'Own Netflix sub €13/mo', 'Własny Netflix €13/mies'),
          correct: 'prive',
          explain: M(
            'Persoonlijke entertainment = privé. Bonnetje wegtikken op de zaak? Inspecteur lacht je uit.',
            'Personal entertainment = private. Charging it to the business? Inspector laughs at you.',
            'Rozrywka osobista = prywatne. Wrzucić na firmę? Inspektor się z ciebie śmieje.'
          ),
        },
        {
          id: 'f6', label: M('Maaltijd in restaurant — eten ter plaatse', 'Restaurant meal — eaten in', 'Posiłek w restauracji — na miejscu'),
          correct: 'btw9',
          explain: M(
            'Eten ter plaatse = 9%. Alcohol blijft 21%. Afhalen ook 9%.',
            'Eating in = 9%. Alcohol stays 21%. Takeaway also 9%.',
            'Jedzenie na miejscu = 9%. Alkohol pozostaje 21%. Na wynos też 9%.'
          ),
        },
      ],
    },
  ],
};

// ============================================================
// LEVEL 2 — De Blauwe Envelop
// ============================================================
export const LEVEL2 = {
  id: 2,
  title: M('De Blauwe Envelop', 'The Blue Envelope', 'Niebieska koperta'),
  scenes: [
    // ----- SCENE 1: Brievenbus + reactie -----
    {
      id: 'brievenbus',
      type: 'mailbox',
      maxScore: 400,
      options: [
        {
          id: 'pay', kind: 'good', points: 250,
          consequenceKey: 'bv_payCons',
          explain: M(
            'Op tijd betalen voorkomt €82 verzuimboete BTW of €469 IB-boete + invorderingsrente.',
            'Paying on time avoids €82 VAT late fine or €469 IB fine + collection interest.',
            'Płatność na czas chroni przed karą €82 (BTW) lub €469 (IB) + odsetkami.'
          ),
        },
        {
          id: 'object', kind: 'ok', points: 150,
          consequenceKey: 'bv_objectCons',
          explain: M(
            'Bezwaar mag binnen 6 weken na dagtekening. Goede argumenten? Aanslag kan worden verlaagd. Geen argumenten? Tijdverspilling.',
            'Objection allowed within 6 weeks. Good arguments? Assessment can be reduced. No arguments? Waste of time.',
            'Sprzeciw można wnieść w 6 tyg. Z dobrymi argumentami można obniżyć wymiar.'
          ),
        },
        {
          id: 'ignore', kind: 'bad', points: -100,
          consequenceKey: 'bv_ignoreCons',
          explain: M(
            'Negeren = aanmaning + invorderingskosten + €469 verzuimboete. Inspecteur juicht. Niet doen.',
            'Ignoring = reminder + collection costs + €469 fine. Inspector cheers. Don\'t.',
            'Ignorowanie = upomnienie + koszty + €469 kary. Inspektor się cieszy. Nie rób tego.'
          ),
        },
      ],
    },

    // ----- SCENE 2: Aangifte — sleep posten naar boxen + aftrekposten -----
    {
      id: 'aangifte',
      type: 'aangifte',
      maxScore: 800,
      boxes: ['box1', 'box2', 'box3'],
      incomeItems: [
        {
          id: 'i_winst', label: M('Winst onderneming €52.000', 'Business profit €52,000', 'Zysk z działalności €52.000'),
          correct: 'box1',
          explain: M('Winst uit onderneming = Box 1 (werk en woning).', 'Business profit = Box 1.', 'Zysk z działalności = Box 1.'),
        },
        {
          id: 'i_spaar', label: M('Spaargeld €60.000', 'Savings €60,000', 'Oszczędności €60.000'),
          correct: 'box3',
          explain: M('Boven heffingsvrij vermogen €57.684 — Box 3, forfaitair tarief 36%.', 'Above tax-free €57,684 — Box 3, 36% rate.', 'Powyżej kwoty wolnej €57.684 — Box 3, stawka 36%.'),
        },
        {
          id: 'i_aandelen', label: M('Aandelen broker €10.000', 'Stocks at broker €10,000', 'Akcje u brokera €10.000'),
          correct: 'box3',
          explain: M('Beleggingen vallen in Box 3.', 'Investments fall in Box 3.', 'Inwestycje wchodzą do Box 3.'),
        },
        {
          id: 'i_bv', label: M('25% aandelen in eigen BV', '25% shares in own BV', '25% udziałów we własnej BV'),
          correct: 'box2',
          explain: M('≥5% in BV = aanmerkelijk belang = Box 2.', '≥5% in BV = substantial interest = Box 2.', '≥5% w BV = znaczny udział = Box 2.'),
        },
      ],
      aftrekItems: [
        {
          id: 'a_zelf', label: M('Zelfstandigenaftrek €2.470', 'Self-employed deduction €2,470', 'Ulga dla samozatrudnionych €2.470'),
          applies: true,
          explain: M(
            'Mits urencriterium 1.225u. Wordt afgebouwd naar €1.200 in 2026.',
            'Provided 1,225h hour criterion met. Reduced to €1,200 in 2026.',
            'Pod warunkiem 1.225h. W 2026 spadek do €1.200.'
          ),
        },
        {
          id: 'a_starter', label: M('Startersaftrek €2.123', 'Starter deduction €2,123', 'Ulga dla nowych firm €2.123'),
          applies: true,
          explain: M(
            'Max 3x in eerste 5 jaar. Vereist urencriterium.',
            'Max 3x in first 5 years. Hour criterion required.',
            'Max 3x w pierwsze 5 lat. Wymóg godzinowy.'
          ),
        },
        {
          id: 'a_mkb', label: M('MKB-winstvrijstelling 12,7%', 'SME profit exemption 12.7%', 'Zwolnienie MŚP 12,7%'),
          applies: true,
          explain: M('Automatisch over winst na zelfstandigenaftrek.', 'Automatic on profit after self-employed deduction.', 'Automatyczne po uldze samozatrudnionych.'),
        },
        {
          id: 'a_for', label: M('FOR opbouwen', 'Build FOR reserve', 'Budowanie rezerwy FOR'),
          applies: false,
          explain: M(
            'FOR is per 1-1-2023 afgeschaft. Bestaande reserves mogen blijven staan, niets bijbouwen.',
            'FOR was abolished on 1-1-2023. Existing reserves may stay, no new contributions.',
            'FOR zniesione od 1-1-2023. Istniejące rezerwy zostają, nowych nie wolno dodawać.'
          ),
        },
      ],
    },
  ],
};

export const LEVELS_NEW = [LEVEL1, LEVEL2];

export function getLevelNew(id) {
  return LEVELS_NEW.find(l => l.id === id);
}
