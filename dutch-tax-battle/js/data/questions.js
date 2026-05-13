// All questions are in Dutch, factually accurate for 2026.
// Sources cross-checked against Belastingdienst, KVK, ZZP Nederland, FNV Zelfstandigen.
// Each question has a humorous tone but the correct answer reflects current law.

export const QUESTIONS = [
  {
    id: 'urencrit',
    cat: 'Urencriterium',
    q: 'Je doet als ZZP\'er een dutje, terwijl je nog steeds nadenkt over een offerte. Tellen die uren mee voor het urencriterium?',
    choices: [
      { t: 'Ja, álles telt — slapen is brainstormen', ok: false },
      { t: 'Alleen directe uren (factureerbaar werk) tellen', ok: false },
      { t: 'Directe én indirecte uren tellen, maar wel aantoonbaar', ok: true },
      { t: 'Alleen op werkdagen tussen 9 en 17 uur', ok: false }
    ],
    why: 'Urencriterium = minimaal 1.225 uur/jaar. Directe (klantwerk) én indirecte uren (administratie, reizen, acquisitie, scholing) tellen — mits aantoonbaar in een urenregistratie. Dutjes helaas niet.'
  },
  {
    id: 'zelfaftrek26',
    cat: 'Zelfstandigenaftrek',
    q: 'Hoe hoog is de zelfstandigenaftrek in 2026?',
    choices: [
      { t: '€7.280 — net als altijd', ok: false },
      { t: '€3.750', ok: false },
      { t: '€1.200', ok: true },
      { t: 'Afgeschaft', ok: false }
    ],
    why: 'De zelfstandigenaftrek wordt elk jaar verlaagd. In 2026 is het €1.200 (was €7.280 in 2019). In 2027 daalt het verder. De ZZP\'er voelt het langzaam wegglippen.'
  },
  {
    id: 'mkb',
    cat: 'MKB-winstvrijstelling',
    q: 'Heb je de MKB-winstvrijstelling ook als je het urencriterium NIET haalt?',
    choices: [
      { t: 'Ja, urencriterium geldt niet voor MKB-vrijstelling', ok: true },
      { t: 'Nee, je moet altijd 1.225 uur halen', ok: false },
      { t: 'Alleen met startersaftrek', ok: false },
      { t: 'Alleen als je BV bent', ok: false }
    ],
    why: 'MKB-winstvrijstelling (12,7% in 2026) geldt voor élke ondernemer, ook zonder urencriterium. Wel wordt deze berekend ná de zelfstandigenaftrek.'
  },
  {
    id: 'kor',
    cat: 'BTW / KOR',
    q: 'Onder welke jaarlijkse omzet mag je gebruikmaken van de Kleineondernemersregeling (KOR)?',
    choices: [
      { t: '€10.000', ok: false },
      { t: '€20.000', ok: true },
      { t: '€30.000', ok: false },
      { t: '€50.000', ok: false }
    ],
    why: 'KOR-grens is €20.000 omzet per kalenderjaar. Geen BTW factureren, geen BTW aftrekken, geen BTW-aangifte. Je meldt je drie maanden vooraf bij de Belastingdienst.'
  },
  {
    id: 'btwlow',
    cat: 'BTW',
    q: 'Welk tarief geldt voor boeken, eten in een restaurant en een kappersbeurt?',
    choices: [
      { t: '21%', ok: false },
      { t: '9%', ok: true },
      { t: '0%', ok: false },
      { t: 'Vrijgesteld', ok: false }
    ],
    why: 'Het verlaagde BTW-tarief van 9% geldt o.a. voor boeken, eten/drinken (geen alcohol), kappers, fietsenmaker en personenvervoer. Hoog tarief 21% voor de rest.'
  },
  {
    id: 'blauwe',
    cat: 'Folklore',
    q: 'Sinds welk jaar verstuurt de Belastingdienst de iconische blauwe envelop?',
    choices: [
      { t: '1948 — na de oorlog', ok: false },
      { t: '1915 — vlak na invoering inkomstenbelasting', ok: true },
      { t: '1981 — voor de herkenbaarheid', ok: false },
      { t: '2001 — bij de euro-overgang', ok: false }
    ],
    why: 'De blauwe envelop bestaat sinds 1915, vlak na de invoering van de inkomstenbelasting in 1914. Voor veel mensen is het tegelijk een nostalgisch en pijnlijk symbool.'
  },
  {
    id: 'dba',
    cat: 'Wet DBA',
    q: 'Je hebt één klant, werkt 40 uur/week op zijn kantoor, gebruikt zijn laptop. Wat zegt de Belastingdienst sinds 2025?',
    choices: [
      { t: 'Prima, als je een ZZP-contract hebt', ok: false },
      { t: 'Schijnzelfstandigheid — feitelijke situatie telt', ok: true },
      { t: 'Mag zolang je factureert', ok: false },
      { t: 'Mag als je KVK-nummer hebt', ok: false }
    ],
    why: 'Sinds 1 januari 2025 handhaaft de Belastingdienst de Wet DBA weer volledig. Papieren afspraken zijn niet voldoende — de praktijk telt. Eén klant + werkplek + middelen van de opdrachtgever = bijna zeker schijnzelfstandigheid.'
  },
  {
    id: 'box3',
    cat: 'Box 3',
    q: 'Wat is er aan de hand met de Box 3 vermogensbelasting na 2022?',
    choices: [
      { t: 'Niks, alles loopt op rolletjes', ok: false },
      { t: 'Hoge Raad oordeelde dat het oude stelsel onrechtmatig was — herstel loopt nog', ok: true },
      { t: 'Helemaal afgeschaft', ok: false },
      { t: 'Verplaatst naar Box 1', ok: false }
    ],
    why: 'Het Kerstarrest (2021) en latere uitspraken (2024) oordeelden dat fictief rendement in Box 3 onrechtmatig was. Een nieuw "werkelijk rendement"-stelsel is in de maak — invoering is meermaals uitgesteld.'
  },
  {
    id: 'toeslagen',
    cat: 'Geschiedenis',
    q: 'Wat was kern van het Toeslagenschandaal?',
    choices: [
      { t: 'Te lage uitkeringen', ok: false },
      { t: 'Onterecht als fraudeur bestempelde ouders moesten tienduizenden euro\'s terugbetalen', ok: true },
      { t: 'BTW-fout op luiers', ok: false },
      { t: 'IT-storing bij de UWV', ok: false }
    ],
    why: 'Tienduizenden gezinnen werden ten onrechte beschuldigd van fraude met kinderopvangtoeslag. Levens verwoest, kinderen uit huis geplaatst. Kabinet Rutte III viel in 2021. Compensatie loopt nog en is veel te traag.'
  },
  {
    id: 'aangiftedeadline',
    cat: 'Aangifte',
    q: 'Wat is de standaarddeadline voor inkomstenbelasting-aangifte over een voorgaand jaar?',
    choices: [
      { t: '31 maart', ok: false },
      { t: '1 mei', ok: true },
      { t: '1 juli', ok: false },
      { t: 'Geen — wanneer je wil', ok: false }
    ],
    why: '1 mei. Uitstel aanvragen kan vóór 1 mei (meestal tot 1 september). Bij aangifte vóór 1 april belooft de Belastingdienst antwoord vóór 1 juli.'
  },
  {
    id: 'fiscalebuffer',
    cat: 'Strategie',
    q: 'Hoeveel van je omzet zet je als ZZP\'er minimaal apart voor IB + ZVW + buffer?',
    choices: [
      { t: '5%', ok: false },
      { t: '15%', ok: false },
      { t: '30–40%', ok: true },
      { t: '70%', ok: false }
    ],
    why: 'Vuistregel: zet 30–40% van iedere factuur direct apart op een aparte rekening. Inkomstenbelasting + Zvw-bijdrage + Pensioen + buffer. Anders huilen in maart.'
  },
  {
    id: 'investeringsaftrek',
    cat: 'Aftrekposten',
    q: 'Wanneer mag je de kleinschaligheidsinvesteringsaftrek (KIA) gebruiken?',
    choices: [
      { t: 'Bij investering van minstens €2.901 in 2026', ok: true },
      { t: 'Alleen bij autokoop', ok: false },
      { t: 'Bij elke uitgave boven €100', ok: false },
      { t: 'Alleen in het eerste bedrijfsjaar', ok: false }
    ],
    why: 'KIA geldt vanaf een investeringsbedrag (drempel jaarlijks geïndexeerd, in 2026 rond €2.901). Niet voor o.a. personenauto\'s, woonhuis, grond. Percentage daalt boven hogere drempels.'
  },
  {
    id: 'startersaftrek',
    cat: 'Aftrekposten',
    q: 'Hoe vaak mag je startersaftrek krijgen in je eerste vijf jaar als ondernemer?',
    choices: [
      { t: 'Eén keer', ok: false },
      { t: 'Twee keer', ok: false },
      { t: 'Maximaal drie keer', ok: true },
      { t: 'Elk jaar zolang je wil', ok: false }
    ],
    why: 'Startersaftrek (€2.123, bovenop zelfstandigenaftrek) mag je maximaal 3x in de eerste 5 jaar gebruiken, en alleen als je het urencriterium haalt.'
  },
  {
    id: 'voorlopig',
    cat: 'Aangifte',
    q: 'Waarom is een voorlopige aanslag aanvragen vaak handig?',
    choices: [
      { t: 'Korting krijgen op je belasting', ok: false },
      { t: 'Belasting in maandtermijnen betalen i.p.v. één keer achteraf', ok: true },
      { t: 'Recht op extra toeslagen', ok: false },
      { t: 'Geen idee, dat is voor accountants', ok: false }
    ],
    why: 'Met een voorlopige aanslag betaal je je geschatte belasting in maandelijkse termijnen. Geen schok in maart, en geen belastingrente als je te weinig hebt betaald.'
  },
  {
    id: 'autovdz',
    cat: 'Auto van de zaak',
    q: 'Je rijdt minder dan 500 km privé met je zakelijke auto. Bijtelling?',
    choices: [
      { t: 'Toch bijtelling, want regels zijn regels', ok: false },
      { t: 'Geen bijtelling, mits sluitende kilometeradministratie of "Verklaring geen privégebruik"', ok: true },
      { t: 'Halve bijtelling', ok: false },
      { t: 'Bijtelling alleen op weekenden', ok: false }
    ],
    why: 'Onder 500 privé-km per jaar: geen bijtelling, mits je een sluitende rittenregistratie bijhoudt óf een "Verklaring geen privégebruik" hebt. Boodschappen lopen telt ook als privé!'
  },
  {
    id: 'pensioen',
    cat: 'Pensioen',
    q: 'Wat is de meest gebruikte fiscale ZZP-pensioenoplossing?',
    choices: [
      { t: 'AOW dekt alles', ok: false },
      { t: 'Jaarruimte (aftrekbare lijfrente-inleg)', ok: true },
      { t: 'Crypto staken', ok: false },
      { t: 'Een blauwe envelop verbranden', ok: false }
    ],
    why: 'Met de jaarruimte mag je een deel van je winst fiscaal aftrekbaar inleggen in lijfrente. Zelf berekenen via Belastingdienst-tool of accountant. AOW alléén is veel te weinig.'
  },
  {
    id: 'fooirek',
    cat: 'Boekhouding',
    q: 'Hoe lang moet je je administratie bewaren?',
    choices: [
      { t: '1 jaar', ok: false },
      { t: '3 jaar', ok: false },
      { t: '7 jaar (10 voor onroerend goed)', ok: true },
      { t: 'Voor altijd', ok: false }
    ],
    why: 'Wettelijke bewaarplicht is 7 jaar. Voor onroerende zaken (gebouwen) zelfs 10 jaar. Digitaal mag — maar wel leesbaar én controleerbaar.'
  },
  {
    id: 'opzettelijk',
    cat: 'Boete',
    q: 'Je "vergeet" omzet aan te geven. Wat is de maximale boete?',
    choices: [
      { t: 'Een waarschuwing', ok: false },
      { t: '50% van de te weinig betaalde belasting', ok: false },
      { t: '100% (bij opzet zelfs hoger) + naheffing + rente', ok: true },
      { t: 'Niks, ze controleren toch niet', ok: false }
    ],
    why: 'Bij opzet kan de vergrijpboete 100% of meer zijn, bovenop naheffing en belastingrente. Bij fraude komt strafrecht erbij. "Vergeten" is geen verdediging.'
  },
  {
    id: 'factuur',
    cat: 'Boekhouding',
    q: 'Welke gegevens MOETEN op een geldige factuur staan?',
    choices: [
      { t: 'Alleen bedrag en datum', ok: false },
      { t: 'Naam + KVK + BTW-nr van jou & klant, datum, uniek nr, omschrijving, bedrag, BTW', ok: true },
      { t: 'Een leuke quote', ok: false },
      { t: 'Een handtekening', ok: false }
    ],
    why: 'Verplicht: factuurdatum, uniek volgnummer, jouw + klantgegevens (incl. KVK & BTW-nr), omschrijving, hoeveelheid, datum levering, BTW-tarief, BTW-bedrag, totaalbedrag.'
  },
  {
    id: 'savings',
    cat: 'Strategie',
    q: 'De legendarische ZZP-stelregel: zet altijd een deel van elke factuur direct apart. Waarom werkt dat?',
    choices: [
      { t: 'Belastingdienst geeft korting voor sparen', ok: false },
      { t: 'Cashflow-discipline + je houdt nooit het BTW-geld voor uitgaven', ok: true },
      { t: 'Inflatie-bescherming', ok: false },
      { t: 'Het is verplicht', ok: false }
    ],
    why: 'BTW dat je ontvangt is NIET van jou — het is van de Belastingdienst, tijdelijk in jouw kassa. Hetzelfde met je geschatte IB. Een aparte spaarrekening voorkomt dat je het uitgeeft.'
  }
];

export function getRandomQuestions(n = 5) {
  const a = QUESTIONS.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}
