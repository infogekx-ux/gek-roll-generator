// LULBAL — Level scripts.
// Elke choice heeft "kind": 'correct' | 'wrong' | 'dumb' | 'illegal'
//   correct = +100 pts, geen rage
//   dumb    = +25 pts, +1 rage (mild)
//   wrong   = 0 pts, +1 rage, boete-tekst
//   illegal = GAME OVER

export const LEVELS = [
  // ============================================================
  // LEVEL 1 — De Eerste Factuur
  // ============================================================
  {
    id: 1,
    title: 'De Eerste Factuur',
    subtitle: 'BTW basics en factuureisen',
    timerPerScenario: 22,
    setting: 'kantoor',
    intro: 'Je eerste factuur. De inspecteur kijkt al mee. Doe even normaal.',
    scenarios: [
      {
        id: 1,
        prompt: 'Je doet je eerste loodgieters-klusje voor een gezin in Utrecht. Reparatie van de cv-ketel. Welke BTW zet je op de factuur?',
        choices: [
          { id: 'a', text: '21% BTW (standaard)', kind: 'correct',
            explain: 'Klopt, kassa! Reparatiediensten = 21% BTW. Standaard tarief op de meeste B2C-diensten.' },
          { id: 'b', text: '9% BTW (verlaagd)', kind: 'wrong',
            explain: '9% is voor eten, boeken, fietsreparatie en wat horeca-spul. Voor cv-reparatie geldt gewoon 21%. Boete bij correctie + naheffing.' },
          { id: 'c', text: 'Geen BTW. Cash. Geen factuur.', kind: 'illegal',
            explain: 'Stop. Dat is gewoon zwart werken. Belastingdienst kan 5 jaar terug naheffen + 50% vergrijpboete. Sleutel inleveren bij de balie.' },
          { id: 'd', text: 'Eerst even Ome Jan bellen', kind: 'dumb',
            explain: 'Ome Jan zit nog op het terras. Antwoord is 21%. Knoop dat in je oren.' },
        ],
      },
      {
        id: 2,
        prompt: 'Je vergeet één van deze velden op je factuur. Welke is GEEN verplicht veld?',
        choices: [
          { id: 'a', text: 'Jouw KvK-nummer', kind: 'wrong',
            explain: 'Fout — KvK-nummer is wel verplicht. Mist dat → factuur niet rechtsgeldig.' },
          { id: 'b', text: 'Uniek factuurnummer', kind: 'wrong',
            explain: 'Verplicht. Sequentieel en uniek. Zonder = klant kan BTW niet aftrekken, jij krijgt gedoe.' },
          { id: 'c', text: 'Logo van je bedrijf', kind: 'correct',
            explain: 'Goed zo! Logo is leuk maar niet wettelijk verplicht. Wat WEL moet: datum, factuurnummer, jouw + klant gegevens, BTW-ID, KvK, omschrijving, bedragen.' },
          { id: 'd', text: 'BTW-bedrag apart vermeld', kind: 'wrong',
            explain: 'Verplicht. Netto + BTW% + BTW-bedrag + bruto. Anders is je factuur waardeloos.' },
        ],
      },
      {
        id: 3,
        prompt: 'Je werkt als onderaannemer voor een grote bouwer in Rotterdam (B2B). Wat zet je op de factuur?',
        choices: [
          { id: 'a', text: '21% BTW erbij optellen', kind: 'wrong',
            explain: 'Mis! In de bouw geldt voor onderaanneming meestal verleggingsregeling. Klopt niet → naheffing.' },
          { id: 'b', text: '"BTW verlegd" + 0 op de regel, BTW-ID klant erbij', kind: 'correct',
            explain: 'Kassa! Verleggingsregeling (art. 12 lid 5 Wet OB). Hoofdaannemer regelt de BTW. Vergeet BTW-ID klant niet op de factuur.' },
          { id: 'c', text: '9% want het is renovatie', kind: 'dumb',
            explain: '9% is voor de hoofdaannemer naar particulier (op arbeid bij woningen > 2 jaar). Onderaanneming = verleggen. Niet hetzelfde.' },
          { id: 'd', text: 'Cash, geen papier', kind: 'illegal',
            explain: 'Game over. Onderaanneming zwart = en jij EN de hoofdaannemer hangen.' },
        ],
      },
      {
        id: 4,
        prompt: 'Klant in Berlijn (Duits bedrijf, geldige VAT-ID). Je levert online dienst. Wat is het BTW-tarief op je factuur?',
        choices: [
          { id: 'a', text: '21% Nederlandse BTW', kind: 'wrong',
            explain: 'Nee. B2B met geldige VAT-ID buiten NL maar binnen EU → reverse charge. Geen NL-BTW.' },
          { id: 'b', text: '19% Duitse BTW', kind: 'wrong',
            explain: 'Lol nee. Jij bent geen Duitse BTW-ondernemer. Reverse charge: 0%.' },
          { id: 'c', text: '0% BTW + "VAT reverse charged" + VAT-ID klant', kind: 'correct',
            explain: 'Bingo. Intracommunautaire B2B-dienst — 0% NL-BTW, klant berekent en betaalt zijn eigen 19%. Vermeld VAT-ID anders gaat het mis.' },
            { id: 'd', text: 'Geen factuur, gewoon Tikkie', kind: 'illegal',
            explain: 'GAME OVER. Een Tikkie aan een Duits bedrijf is geen factuur. Belastingdienst krijgt al hartkloppingen van het idee.' },
        ],
      },
      {
        id: 5,
        prompt: 'Klant in een snackbar betaalt €450 cash en vraagt "doe maar zonder factuur, scheelt jou ook gedoe". Wat doe je?',
        choices: [
          { id: 'a', text: 'Top idee, cash in m\'n broek', kind: 'illegal',
            explain: 'KLAAR. Zwarte omzet = strafbaar. Naheffing 5 jaar terug + 50% vergrijpboete + reputatie weg. Ome Jan zou trots zijn. Belastingdienst niet.' },
          { id: 'b', text: 'Factuur maken, omzet boeken, BTW afdragen', kind: 'correct',
            explain: 'Saai maar verstandig. Cash mag, factuur en BTW gewoon administreren. Bewaarplicht 7 jaar.' },
          { id: 'c', text: 'Halve factuur, halve cash', kind: 'illegal',
            explain: 'Nog steeds illegaal. "Beetje zwart" = helemaal zwart in de ogen van de fiscus.' },
          { id: 'd', text: 'Doorverwijzen naar m\'n collega', kind: 'dumb',
            explain: 'Je collega is geen excuus. Jij krijgt €0 én geen omzet. Slim is anders.' },
        ],
      },
      {
        id: 6,
        prompt: 'Je verkoopt je eigen schilderij (uniek werk) aan een particulier voor €800. BTW-tarief?',
        choices: [
          { id: 'a', text: '21%', kind: 'wrong',
            explain: 'Niet helemaal — origineel werk van de kunstenaar zelf valt onder 9% (tabel I, post a-29 Wet OB).' },
          { id: 'b', text: '9% kunstenaars-tarief', kind: 'correct',
            explain: 'Precies! Origineel werk van de maker zelf = 9%. Prints in oplage = 21%. Zo onthoud je het.' },
          { id: 'c', text: '0% want het is kunst', kind: 'wrong',
            explain: 'Kunst is geen vrijstelling. 9% is het verlaagde tarief. 0% bestaat in NL alleen bij export en intracom.' },
          { id: 'd', text: 'Vrijgesteld want hobby', kind: 'wrong',
            explain: 'Als je systematisch verkoopt = ondernemer. Hobby-vrijstelling bestaat formeel niet als de Belastingdienst je als ondernemer ziet.' },
        ],
      },
      {
        id: 7,
        prompt: 'Je wil je BTW-aangifte over Q2 indienen. Wat is de deadline?',
        choices: [
          { id: 'a', text: '30 juni', kind: 'wrong',
            explain: 'Te vroeg, en je hebt het laatste kwartaal-datum nog niet eens. Q2 = april-mei-juni.' },
          { id: 'b', text: '31 juli (laatste dag maand erna)', kind: 'correct',
            explain: 'Klopt! Kwartaalaangifte: uiterlijk laatste dag van de maand NA het kwartaal. Coulancetermijn van 7 dagen daarna, dan boete €82.' },
          { id: 'c', text: '31 december', kind: 'wrong',
            explain: 'Lol nee. Dat is jaareinde. BTW gaat per kwartaal.' },
          { id: 'd', text: 'Als ik er zin in heb', kind: 'wrong',
            explain: '€82 verzuimboete, en bij betaalverzuim 3% van het bedrag (min €50, max €6.709). Niet leuk.' },
        ],
      },
      {
        id: 8,
        prompt: 'Klant betaalt al 90 dagen niet je factuur van €2.420 inclusief BTW. De BTW heb je wél al afgedragen. Wat kun je doen?',
        choices: [
          { id: 'a', text: 'Wachten en hopen', kind: 'dumb',
            explain: 'Wachten = BTW kwijt. Er is een betere route.' },
          { id: 'b', text: 'BTW terugvragen via "oninbare vordering" na 1 jaar', kind: 'correct',
            explain: 'Goed! Bij oninbaarheid (na 1 jaar of bij bewijs van onbetaalbaarheid) kun je de afgedragen BTW terugvragen via je aangifte.' },
          { id: 'c', text: 'Factuur dubbel sturen', kind: 'dumb',
            explain: 'Dat verandert niks aan je BTW-positie en irriteert klant alleen meer.' },
          { id: 'd', text: 'Klant chanteren met foto\'s van de feestdagenborrel', kind: 'illegal',
            explain: 'GAME OVER. Afpersing is geen oplossing. Het is een ander hoofdstuk in het wetboek.' },
        ],
      },
    ],
  },

  // ============================================================
  // LEVEL 2 — De Blauwe Envelop
  // ============================================================
  {
    id: 2,
    title: 'De Blauwe Envelop',
    subtitle: 'Box-systeem en zelfstandigenaftrek',
    timerPerScenario: 25,
    setting: 'thuis',
    intro: 'Postbode Henk fietst voorbij. Pleurt een blauwe envelop op de mat. Tijd voor aangifte.',
    scenarios: [
      {
        id: 1,
        prompt: 'Je hebt €52.000 winst uit onderneming (na aftrekposten). In welke schijven van Box 1 valt dit in 2025?',
        choices: [
          { id: 'a', text: 'Alleen schijf 1 (tot €38.441)', kind: 'wrong',
            explain: 'Nee — je zit erboven. Het stuk boven €38.441 valt in schijf 2.' },
          { id: 'b', text: 'Schijf 1 EN schijf 2 (gedeeltelijk)', kind: 'correct',
            explain: 'Precies. Tot €38.441 = 35,82%, daarboven tot €76.817 = 37,48% in 2025. Schijf 3 raak je nog niet.' },
          { id: 'c', text: 'Alleen schijf 3 (49,5%)', kind: 'wrong',
            explain: 'Pas vanaf €76.817 (2025). Jij zit lager.' },
          { id: 'd', text: 'Box 2', kind: 'wrong',
            explain: 'Box 2 is voor aanmerkelijk belang (5%+ in BV). Jouw winst uit onderneming = Box 1.' },
        ],
      },
      {
        id: 2,
        prompt: 'Mag je zelfstandigenaftrek toepassen?',
        choices: [
          { id: 'a', text: 'Altijd als ZZP\'er', kind: 'wrong',
            explain: 'Niet altijd. Voorwaarde: urencriterium van 1.225 uren per jaar.' },
          { id: 'b', text: 'Alleen als je minstens 1.225 uur aan je onderneming besteedt', kind: 'correct',
            explain: 'Goed! Urencriterium. En bewijslast ligt bij JOU — kalender, offertes, urenbriefjes. Belastingdienst kan om bewijs vragen.' },
          { id: 'c', text: 'Alleen als je winst maakt', kind: 'wrong',
            explain: 'Mooi gedacht maar nee. Urencriterium is doorslaggevend. Bij verlies kan zelfstandigenaftrek beperkt zijn (max verlies = 0 in dat jaar).' },
          { id: 'd', text: 'Alleen als je geen werknemer bent', kind: 'dumb',
            explain: 'Bijbaan + ZZP mag, mits je grotendeels (>50% van werktijd) in ZZP zit. Maar urencriterium blijft hoofdregel.' },
        ],
      },
      {
        id: 3,
        prompt: 'Wat is de zelfstandigenaftrek in 2025?',
        choices: [
          { id: 'a', text: '€7.280', kind: 'wrong',
            explain: 'Dat was de zelfstandigenaftrek vóór de afbouw begon (2019). Anno 2025 een stuk minder.' },
          { id: 'b', text: '€2.470', kind: 'correct',
            explain: 'Correct. €2.470 in 2025. Wordt verder afgebouwd: €1.200 in 2026, €900 in 2027.' },
          { id: 'c', text: '€1.200', kind: 'wrong',
            explain: 'Dat is 2026. In 2025 nog €2.470.' },
          { id: 'd', text: '€5.000', kind: 'wrong',
            explain: 'Geen bestaand bedrag. €2.470 is het in 2025.' },
        ],
      },
      {
        id: 4,
        prompt: 'Je bent net dit jaar gestart. Mag je naast zelfstandigenaftrek ook startersaftrek pakken?',
        choices: [
          { id: 'a', text: 'Ja, en zo vaak als ik wil', kind: 'wrong',
            explain: 'Nee — max 3x in de eerste 5 jaar van je onderneming. Niet onbeperkt.' },
          { id: 'b', text: 'Ja, max 3x in eerste 5 jaar, €2.123 per keer', kind: 'correct',
            explain: 'Klopt! Startersaftrek = €2.123 (2025). Max 3 keer in eerste 5 jaar. Wel urencriterium nodig.' },
          { id: 'c', text: 'Alleen als ik onder de 30 ben', kind: 'wrong',
            explain: 'Leeftijd doet niet ter zake. Eerste 5 jaar telt.' },
          { id: 'd', text: 'Alleen bij KvK in januari', kind: 'wrong',
            explain: 'Inschrijfdatum maakt niets uit voor startersaftrek.' },
        ],
      },
      {
        id: 5,
        prompt: 'Na zelfstandigenaftrek pas je nog een vrijstelling toe over de rest van je winst. Welk percentage is dat in 2025?',
        choices: [
          { id: 'a', text: '7%', kind: 'wrong',
            explain: 'Nee. MKB-winstvrijstelling is in 2025 12,7%.' },
          { id: 'b', text: '12,7% MKB-winstvrijstelling', kind: 'correct',
            explain: 'Kassa! Automatische vrijstelling, geen urencriterium nodig. Stealth-bonus die iedereen vergeet.' },
          { id: 'c', text: '21% (BTW-tarief)', kind: 'dumb',
            explain: 'Je verwart BTW met inkomstenbelasting. Twee verschillende werelden.' },
          { id: 'd', text: '0% want dat bestaat niet meer', kind: 'wrong',
            explain: 'Bestaat wel degelijk. 12,7% in 2025 én 2026.' },
        ],
      },
      {
        id: 6,
        prompt: 'Wat hoort thuis in Box 3 (vermogen)?',
        choices: [
          { id: 'a', text: 'Je eigen huis (hoofdwoning)', kind: 'wrong',
            explain: 'Hoofdwoning = Box 1 (eigenwoningforfait + hypotheekrente-aftrek). Niet Box 3.' },
          { id: 'b', text: 'Spaargeld, beleggingen, 2e huis verhuurd', kind: 'correct',
            explain: 'Klopt. Box 3 = sparen en beleggen. Heffingsvrij vermogen €57.684 per persoon in 2025. Tarief 36% over forfaitair rendement.' },
          { id: 'c', text: 'Je inkomen uit ZZP-werk', kind: 'wrong',
            explain: 'ZZP-winst = Box 1. Box 3 is alleen vermogen.' },
          { id: 'd', text: 'Aanmerkelijk belang in BV (5%+)', kind: 'wrong',
            explain: 'Dat is Box 2. Drie verschillende boksen voor verschillende dingen.' },
        ],
      },
      {
        id: 7,
        prompt: 'Je deadline voor de aangifte inkomstenbelasting (zonder uitstel) is meestal:',
        choices: [
          { id: 'a', text: '1 mei', kind: 'correct',
            explain: 'Klopt. 1 mei van het volgende jaar. Uitstel kan via Belastingdienst aanvragen. Te laat = €469 verzuimboete.' },
          { id: 'b', text: '31 december', kind: 'wrong',
            explain: 'Te laat. Aangiftedeadline is 1 mei.' },
          { id: 'c', text: '15 maart', kind: 'wrong',
            explain: 'Te vroeg. Dat is een Amerikaanse datum (tax day USA was vroeger 15 maart).' },
          { id: 'd', text: 'Geen deadline, doe ik wanneer ik wil', kind: 'wrong',
            explain: 'Krijg nou wat. €469 verzuimboete bij overschrijding, oplopend tot €6.709 bij recidive.' },
        ],
      },
      {
        id: 8,
        prompt: 'Je bent 4 weken te laat met aangifte IB. Welke boete krijg je standaard?',
        choices: [
          { id: 'a', text: '€82', kind: 'wrong',
            explain: 'Dat is BTW-verzuimboete. Inkomstenbelasting is anders.' },
          { id: 'b', text: '€469 verzuimboete', kind: 'correct',
            explain: 'Yes — €469 standaard verzuimboete IB. Recidive of opzettelijk niet doen → tot €6.709.' },
          { id: 'c', text: '€10.000', kind: 'wrong',
            explain: 'Dat is geen standaard bedrag. €469 is de eerste verzuimboete.' },
          { id: 'd', text: 'Geen boete, alleen aansporing', kind: 'wrong',
            explain: 'Belastingdienst is geen pamper-pluche-beer. Direct €469.' },
        ],
      },
    ],
  },
];

export function getLevel(id) {
  return LEVELS.find(l => l.id === id);
}

export function maxScoreForLevel(level) {
  return level.scenarios.length * 150;  // ~100 basis + 50 max snelheid
}
