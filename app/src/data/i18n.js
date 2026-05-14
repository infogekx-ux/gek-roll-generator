// i18n — minimum NL + EN + PL voor interface.
// Belasting-termen blijven NL, met vertaling tussen haakjes.
//
// Inspecteur-vloeken zitten in inspecteurQuotes.js (10 talen).
// Educatieve uitleg blijft NL met optionele NL tax-term + (vertaling).

export const LANGUAGES = [
  { code: 'NL', label: 'Nederlands' },
  { code: 'EN', label: 'English' },
  { code: 'PL', label: 'Polski' },
];

// Mapping: nationaliteit → default UI-taal.
// MVP-fallback voor TR/MA/SR/DE/RO/BG/ID → EN (interface). Inspecteur vloekt wel in eigen taal.
export function uiLangFromNationality(nat) {
  switch (nat) {
    case 'NL': return 'NL';
    case 'PL': return 'PL';
    case 'EN':
    case 'DE': // tijdelijk fallback naar EN
    case 'TR':
    case 'MA':
    case 'SR':
    case 'RO':
    case 'BG':
    case 'ID':
      return 'EN';
    default: return 'NL';
  }
}

const D = {
  // ------------------------------ COMMON ------------------------------
  play:          { NL: 'SPELEN!',      EN: 'PLAY!',         PL: 'GRAJ!' },
  next:          { NL: 'Volgende',     EN: 'Next',          PL: 'Dalej' },
  back:          { NL: 'Terug',        EN: 'Back',          PL: 'Wstecz' },
  stop:          { NL: 'Stop',         EN: 'Stop',          PL: 'Stop' },
  retry:         { NL: 'Opnieuw',      EN: 'Retry',         PL: 'Spróbuj ponownie' },
  score:         { NL: 'Score',        EN: 'Score',         PL: 'Wynik' },
  points:        { NL: 'pts',          EN: 'pts',           PL: 'pkt' },
  timer:         { NL: 'Tijd',         EN: 'Time',          PL: 'Czas' },
  streak:        { NL: 'streak',       EN: 'streak',        PL: 'seria' },
  rage:          { NL: 'Woede',        EN: 'Rage',          PL: 'Wściekłość' },
  share:         { NL: 'Deel je score',EN: 'Share score',   PL: 'Udostępnij wynik' },
  correct:       { NL: 'Kassa!',       EN: 'Nailed it!',    PL: 'Bingo!' },
  wrong:         { NL: 'Fout!',        EN: 'Wrong!',        PL: 'Źle!' },
  illegal:       { NL: 'Illegaal!',    EN: 'Illegal!',      PL: 'Nielegalne!' },
  levelComplete: { NL: 'Level geklaard!', EN: 'Level cleared!', PL: 'Poziom ukończony!' },
  gameOver:      { NL: 'GAME OVER',    EN: 'GAME OVER',     PL: 'KONIEC GRY' },
  dashboard:     { NL: 'Dashboard',    EN: 'Dashboard',     PL: 'Panel' },
  yes:           { NL: 'Ja',           EN: 'Yes',           PL: 'Tak' },
  no:            { NL: 'Nee',          EN: 'No',            PL: 'Nie' },
  ok:            { NL: 'Oké',          EN: 'OK',            PL: 'OK' },
  level:         { NL: 'Level',        EN: 'Level',         PL: 'Poziom' },
  scene:         { NL: 'Scène',        EN: 'Scene',         PL: 'Scena' },

  // --------------------------- ONBOARDING -----------------------------
  ob_tagline:    { NL: '"Speel met je belasting"', EN: '"Play with your taxes"', PL: '"Pograj z fiskusem"' },
  ob_email:      { NL: 'E-mail',         EN: 'Email',         PL: 'E-mail' },
  ob_nickname:   { NL: 'Nickname',       EN: 'Nickname',      PL: 'Pseudonim' },
  ob_company:    { NL: 'Bedrijfsnaam (optioneel — voor de ranking)',
                   EN: 'Company name (optional — for ranking)',
                   PL: 'Nazwa firmy (opcjonalnie — do rankingu)' },
  ob_nationality:{ NL: 'Nationaliteit (de inspecteur vloekt in jouw taal)',
                   EN: 'Nationality (the inspector curses in your language)',
                   PL: 'Narodowość (inspektor klnie w twoim języku)' },
  ob_language:   { NL: 'Interface-taal', EN: 'Interface language', PL: 'Język interfejsu' },
  ob_emailErr:   { NL: 'Echte e-mail, joh.', EN: 'Real email, mate.', PL: 'Prawdziwy e-mail, no weź.' },
  ob_nickErr:    { NL: 'Min 3 tekens.',  EN: 'Min 3 chars.',  PL: 'Min 3 znaki.' },
  ob_termsHint:  { NL: 'Door SPELEN ga je akkoord met de huisregels. Je bent ≥16 jaar.',
                   EN: 'By clicking PLAY you accept the house rules. You are ≥16.',
                   PL: 'Klikając GRAJ akceptujesz regulamin. Masz ≥16 lat.' },

  // --------------------------- DASHBOARD ------------------------------
  d_saved:       { NL: 'Totaal "bespaarde" belasting',
                   EN: 'Total taxes "saved"',
                   PL: 'Łącznie "zaoszczędzony" podatek' },
  d_levels:      { NL: 'Levels',         EN: 'Levels',        PL: 'Poziomy' },
  d_leader:      { NL: '🏆 Leaderboard (lokaal)', EN: '🏆 Leaderboard (local)', PL: '🏆 Ranking (lokalny)' },
  d_leaderEmpty: { NL: 'Nog niemand. Wees jij de eerste.',
                   EN: 'No one yet. Be the first.',
                   PL: 'Jeszcze nikt. Bądź pierwszy.' },
  d_weekly:      { NL: '🗓️ Weekly Challenge', EN: '🗓️ Weekly Challenge', PL: '🗓️ Wyzwanie tygodnia' },
  d_weeklyDesc:  { NL: 'Sorteer alle facturen in <60s', EN: 'Sort all invoices in <60s', PL: 'Posortuj wszystkie faktury w <60s' },
  d_weeklySpon:  { NL: 'Sponsor: jouw boekhouder (binnenkort)',
                   EN: 'Sponsor: your accountant (soon)',
                   PL: 'Sponsor: twój księgowy (wkrótce)' },
  d_resetAll:    { NL: '🧨 Reset alles (alleen voor dappere zielen)',
                   EN: '🧨 Reset everything (brave souls only)',
                   PL: '🧨 Reset wszystkiego (tylko odważni)' },

  // ----------------------------- HUDS ---------------------------------
  hud_inspector: { NL: 'INSPECTEUR', EN: 'INSPECTOR', PL: 'INSPEKTOR' },
  hud_omejan:    { NL: 'OME JAN',    EN: 'UNCLE JAN', PL: 'WUJEK JANEK' },

  // ----------------------- BOUWMARKT SCENE ----------------------------
  bm_title:      { NL: 'De Bouwmarkt', EN: 'The Hardware Store', PL: 'Market budowlany' },
  bm_intro:      { NL: 'Welkom in de bouwmarkt. Tik op spullen om ze in je karretje te gooien. De inspecteur kijkt straks mee.',
                   EN: 'Welcome to the hardware store. Tap items to drop them in your cart. The inspector will check later.',
                   PL: 'Witaj w markecie. Stuknij produkty, by je wrzucić do koszyka. Inspektor sprawdzi później.' },
  bm_cart:       { NL: 'Karretje', EN: 'Cart', PL: 'Koszyk' },
  bm_checkout:   { NL: 'NAAR DE KASSA →', EN: 'TO CHECKOUT →', PL: 'DO KASY →' },
  bm_emptyCart:  { NL: 'Eerst iets in je karretje gooien, joh.',
                   EN: 'Put something in your cart first, mate.',
                   PL: 'Najpierw coś wrzuć do koszyka.' },
  bm_kassaTitle: { NL: 'KASSA', EN: 'CHECKOUT', PL: 'KASA' },
  bm_kassaIntro: { NL: 'Caissière: "Op de zaak of privé?"',
                   EN: 'Cashier: "Business or private?"',
                   PL: 'Kasjerka: "Na firmę czy prywatnie?"' },
  bm_zakelijk:   { NL: 'Op de zaak', EN: 'Business', PL: 'Firmowe' },
  bm_prive:      { NL: 'Privé', EN: 'Private', PL: 'Prywatne' },
  bm_payConfirm: { NL: 'AFREKENEN', EN: 'PAY', PL: 'ZAPŁAĆ' },
  bm_bossIntro:  { NL: 'BAM! Plotseling staat de inspecteur naast je. "Laten we even kijken wat u zakelijk noemt..."',
                   EN: 'BAM! The inspector suddenly stands beside you. "Let\'s see what you call business..."',
                   PL: 'BAM! Nagle inspektor stoi obok. "Zobaczmy, co nazywasz firmowym..."' },
  bm_defend:     { NL: 'VERDEDIG ALS ZAKELIJK', EN: 'DEFEND AS BUSINESS', PL: 'BROŃ JAKO FIRMOWE' },
  bm_admit:      { NL: 'GEEF TOE: PRIVÉ',       EN: 'ADMIT: PRIVATE',     PL: 'PRZYZNAJ: PRYWATNE' },

  // -------------------- FACTUREN SORTEREN SCENE -----------------------
  fs_title:      { NL: 'Sorteer je facturen', EN: 'Sort your invoices', PL: 'Posortuj faktury' },
  fs_intro:      { NL: 'Sleep elke factuur naar het juiste BTW-bakje. Timer tikt.',
                   EN: 'Drag each invoice to the right VAT bucket. Timer ticks.',
                   PL: 'Przeciągnij każdą fakturę do właściwego segregatora VAT. Czas leci.' },
  fs_btw21:      { NL: '21% BTW',    EN: '21% VAT',    PL: '21% VAT' },
  fs_btw9:       { NL: '9% BTW',     EN: '9% VAT',     PL: '9% VAT' },
  fs_btw0:       { NL: '0% / verlegd', EN: '0% / reverse', PL: '0% / reverse' },
  fs_prive:      { NL: 'Privé / vrijgesteld', EN: 'Private / exempt', PL: 'Prywatne / zwolnione' },
  fs_finish:     { NL: 'KLAAR!',     EN: 'DONE!',      PL: 'KONIEC!' },
  fs_correct:    { NL: 'goed',       EN: 'right',      PL: 'dobrze' },
  fs_wrong:      { NL: 'fout',       EN: 'wrong',      PL: 'źle' },

  // ----------------------- BRIEVENBUS SCENE ---------------------------
  bv_title:      { NL: 'De Blauwe Envelop', EN: 'The Blue Envelope', PL: 'Niebieska koperta' },
  bv_intro:      { NL: 'Postbode Henk fietst voorbij. Tik op de brievenbus.',
                   EN: 'Postman Henk cycles past. Tap the mailbox.',
                   PL: 'Listonosz Henk przejeżdża. Stuknij skrzynkę.' },
  bv_openMailbox:{ NL: 'OPEN BRIEVENBUS', EN: 'OPEN MAILBOX', PL: 'OTWÓRZ SKRZYNKĘ' },
  bv_openEnv:    { NL: 'OPEN ENVELOP', EN: 'OPEN ENVELOPE', PL: 'OTWÓRZ KOPERTĘ' },
  bv_letterHead: { NL: 'VOORLOPIGE AANSLAG 2025', EN: 'PROVISIONAL ASSESSMENT 2025', PL: 'WSTĘPNY WYMIAR PODATKU 2025' },
  bv_letterBody: { NL: 'Te betalen vóór 30 dagen: € 4.500',
                   EN: 'To pay within 30 days: € 4,500',
                   PL: 'Do zapłaty w 30 dni: € 4.500' },
  bv_pay:        { NL: 'BETAAL', EN: 'PAY', PL: 'ZAPŁAĆ' },
  bv_object:     { NL: 'BEZWAAR INDIENEN', EN: 'FILE APPEAL', PL: 'WNIEŚ SPRZECIW' },
  bv_ignore:     { NL: 'NEGEER', EN: 'IGNORE', PL: 'ZIGNORUJ' },
  bv_ignoreCons: { NL: 'Drie weken later... klop klop. Inspecteur op je stoep. €469 verzuimboete.',
                   EN: 'Three weeks later... knock knock. Inspector at your doorstep. €469 fine.',
                   PL: 'Trzy tygodnie później... puk puk. Inspektor pod drzwiami. €469 kary.' },
  bv_payCons:    { NL: 'Saai maar verstandig. Pijn in de portemonnee, vrede in je hoofd.',
                   EN: 'Boring but smart. Wallet hurts, mind is calm.',
                   PL: 'Nudno ale mądrze. Boli portfel, spokojna głowa.' },
  bv_objectCons: { NL: 'Bezwaarschrift binnen 6 weken indienen. Argumenten klaarmaken.',
                   EN: 'File objection within 6 weeks. Prepare arguments.',
                   PL: 'Złóż sprzeciw w 6 tygodni. Przygotuj argumenty.' },

  // -------------------------- AANGIFTE SCENE --------------------------
  ag_title:      { NL: 'Aangifte invullen', EN: 'Fill in tax return', PL: 'Wypełnij zeznanie' },
  ag_intro:      { NL: 'Sleep elke post naar de juiste Box. Daarna de aftrekposten.',
                   EN: 'Drag each item to the right Box. Then the deductions.',
                   PL: 'Przeciągnij każdą pozycję do właściwego Boxu. Potem odliczenia.' },
  ag_box1:       { NL: 'Box 1 — Werk & woning', EN: 'Box 1 — Work & home', PL: 'Box 1 — Praca i dom' },
  ag_box2:       { NL: 'Box 2 — BV ≥5%', EN: 'Box 2 — Substantial interest', PL: 'Box 2 — Znaczny udział' },
  ag_box3:       { NL: 'Box 3 — Spaargeld & beleggingen', EN: 'Box 3 — Savings & investments', PL: 'Box 3 — Oszczędności i inwestycje' },
  ag_aftrekTitle:{ NL: 'Aftrekposten', EN: 'Deductions', PL: 'Odliczenia' },
  ag_applied:    { NL: 'Toegepast', EN: 'Applied', PL: 'Zastosowane' },
  ag_submit:     { NL: 'AANGIFTE INDIENEN', EN: 'SUBMIT TAX RETURN', PL: 'WYŚLIJ ZEZNANIE' },
};

export function t(key, lang) {
  const entry = D[key];
  if (!entry) return key;
  return entry[lang] || entry.NL || key;
}

// Tax-term helper — keeps Dutch + adds translation between parens
export function taxTerm(termNL, lang, translationsMap) {
  if (lang === 'NL' || !translationsMap) return termNL;
  const tr = translationsMap[lang];
  return tr ? `${termNL} (${tr})` : termNL;
}

// Educatieve uitleg-templates per scene/keuze leveren explain-text in juiste taal.
// Voor MVP geven we explain-strings inline in scene data, met taalvarianten.
