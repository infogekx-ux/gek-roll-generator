// Ome Jan — stamkroeg-oom. 70% goed advies, 30% complete onzin.
// Speler weet niet vooraf welke je krijgt. Dat is de spanning.

export const omeJanGood = [
  'Joh, schrijf die uren op! 1225 per jaar, anders krijg je geen zelfstandigenaftrek. Punt.',
  'KOR onder de €20.000 omzet? Gewoon doen. Geen BTW-gedoe, klaar.',
  'Bonnetje SCANNEN. Niet op de keukentafel laten verkleuren tussen de pepers.',
  'BTW-aangifte: laatste dag van de maand na het kwartaal. Niet vergeten, anders €82 boete.',
  'Auto van de zaak? Logboek bijhouden, anders bijtelling 22% over cataloguswaarde. Au.',
  'Energie-investering? EIA pakt 45,5% terug. Echt. Op de Energielijst kijken.',
  'Bewaarplicht is ZEVEN jaar. Niet zes, niet acht. Zeven.',
  'Verleggingsregeling in de bouw — factuur ZONDER BTW, dopisek "btw verlegd". Hoofdaannemer regelt het.',
  'Schenkbelasting tussen echtelieden? Bestaat niet, knul. Drink je biertje rustig.',
  'Box 3: heffingsvrij vermogen €57.684 per persoon in 2025. Daaronder geen belasting.',
  'MKB-winstvrijstelling 12,7% pakt-ie er nog overheen. Ze vergeten het altijd!',
  'Startersaftrek: max 3x in de eerste 5 jaar. €2.123. Pak het zolang het er nog is.',
];

export const omeJanBad = [
  'Lamborghini in het geel? Da\'s gewoon zakelijk. Wet. Geel = zakelijk. Vraag maar na.',
  'Belastingdienst werkt nooit in juli. Vakantie. Slaap rustig, ouwe.',
  'Cash is altijd 0% BTW. Da\'s wet. Iedereen weet dat.',
  'Hongarije-BV opzetten? M\'n neef regelt het binnen een uur. Voor 50 euro.',
  'FOR opbouwen, gewoon doen! Lekker veel pensioen later.',  // FALSE — FOR afgeschaft per 2023
  'Werkruimte in huis? Hele huur trekken van de zaak. Niemand merkt het.',
  'DigiD-code op je sleutelbos plakken — kun je niet kwijt. Slim hè?',
  'Vakantie naar Maldiven? Boek het als "klantbezoek". Belastingdienst snapt het wel.',
  'Privé-Netflix op de zaak — gewoon "marketingonderzoek" zetten op de bon.',
  'Zelfstandigenaftrek? €7.280 hè, gewoon invullen!',  // FOUT — was vroeger, nu €2.470 (2025)
  'Schijnzelfstandigheid is gezeur, gewoon negeren. DBA bestaat niet meer.',
  'KOR-grens is €50.000. Tot daar geen BTW, hoor.',  // FOUT — €20.000
];

export function pickOmeJanQuote() {
  const isGood = Math.random() < 0.7;  // 70% goed advies
  const pool = isGood ? omeJanGood : omeJanBad;
  return {
    text: pool[Math.floor(Math.random() * pool.length)],
    isGood,
  };
}
