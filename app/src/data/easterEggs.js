// Easter eggs — verborgen klikbare objecten in scenes.
// Bij tappen: 30–50% kans BETRAPT door inspecteur (rage spike), anders achievement unlocked.

export const EASTER_EGGS = {
  lichtschakelaar: {
    id: 'lichtschakelaar',
    name: { NL: 'Lichtschakelaar', EN: 'Light switch', PL: 'Włącznik światła' },
    emoji: '💡',
    caughtChance: 0.40,
    title: {
      NL: 'STIEKEM ENERGIE-BESPAARDER',
      EN: 'STEALTH ENERGY SAVER',
      PL: 'CICHY OSZCZĘDNY',
    },
    caughtText: {
      NL: 'Inspecteur: "Energie besparen tijdens werkuren? Dat staat NIET op de EIA-lijst, hè."',
      EN: 'Inspector: "Saving energy on work hours? That\'s NOT on the EIA list, mate."',
      PL: 'Inspektor: "Oszczędzasz prąd w godzinach pracy? To NIE jest na liście EIA."',
    },
    achText: {
      NL: 'Je drukte de schakelaar in tijdens een controle. Inspecteur knipperde mee. Niemand zag het.',
      EN: 'You flipped the switch during an audit. Inspector blinked along. Nobody saw.',
      PL: 'Wcisnąłeś włącznik podczas kontroli. Inspektor mrugnął. Nikt nie widział.',
    },
  },
  prullenbak: {
    id: 'prullenbak',
    name: { NL: 'Prullenbak', EN: 'Trash bin', PL: 'Kosz' },
    emoji: '🗑️',
    caughtChance: 0.32,
    title: {
      NL: 'FOR-DUMPER',
      EN: 'FOR DUMPER',
      PL: 'WYRZUCACZ FOR',
    },
    caughtText: {
      NL: 'Inspecteur graait erin: "Oude FOR-papieren?! Die zijn bewijsmateriaal! Bewaarplicht 7 jaar!"',
      EN: 'Inspector digs in: "Old FOR papers?! That\'s evidence! 7-year retention!"',
      PL: 'Inspektor grzebie: "Stare papiery FOR?! To dowody! 7 lat przechowywania!"',
    },
    achText: {
      NL: 'Je gooide oude FOR-papieren weg. FOR is afgeschaft per 2023, dus emotioneel oké.',
      EN: 'You tossed old FOR papers. FOR was abolished in 2023, so emotionally fine.',
      PL: 'Wyrzuciłeś papiery FOR. Zniesiono w 2023, więc emocjonalnie OK.',
    },
  },
  koffiezetapparaat: {
    id: 'koffiezetapparaat',
    name: { NL: 'Koffiezetapparaat', EN: 'Coffee machine', PL: 'Ekspres do kawy' },
    emoji: '☕',
    caughtChance: 0.48,
    title: {
      NL: 'BAKKIE OP DE ZAAK',
      EN: 'COFFEE ON THE BIZ',
      PL: 'KAWA NA FIRMĘ',
    },
    caughtText: {
      NL: 'Inspecteur ruikt aan je mok: "Espressomachine van €350 op de zaak? Eigen koffie = PRIVÉ, joh."',
      EN: 'Inspector sniffs your mug: "€350 espresso machine on the biz? Own coffee = PRIVATE."',
      PL: 'Inspektor wącha kubek: "Ekspres za €350 na firmę? Własna kawa = PRYWATNE."',
    },
    achText: {
      NL: 'Stiekem bakkie pleur gepakt. Geen bon, geen bewijs, geen probleem.',
      EN: 'Sneaky cup nabbed. No receipt, no evidence, no problem.',
      PL: 'Cichcem zabrałeś kawę. Bez paragonu, bez dowodu, bez problemu.',
    },
  },
  telefoon: {
    id: 'telefoon',
    name: { NL: 'Telefoon', EN: 'Phone', PL: 'Telefon' },
    emoji: '📞',
    caughtChance: 0.45,
    title: {
      NL: 'BELASTINGDIENST OP DE WACHT',
      EN: 'TAX OFFICE ON HOLD',
      PL: 'URZĄD NA CZEKANIU',
    },
    caughtText: {
      NL: 'Belastingdienst-bandje: "U bent nummer 47 in de rij." Inspecteur grinnikt naast je.',
      EN: 'Tax office jingle: "You are number 47 in line." Inspector smirks beside you.',
      PL: 'Bandka urzędu: "Jesteś numer 47 w kolejce." Inspektor szczerzy się obok.',
    },
    achText: {
      NL: '47 minuten in de wachtrij. Iedereen heeft het overleefd. Klein klein klein klein klein klein.',
      EN: '47 minutes on hold. Everyone survived. Small small small small small.',
      PL: '47 minut w kolejce. Każdy przeżył. Mały mały mały mały mały.',
    },
  },
  biertje: {
    id: 'biertje',
    name: { NL: 'Ome Jan\'s biertje', EN: 'Uncle Jan\'s beer', PL: 'Piwko wujka Janka' },
    emoji: '🍺',
    caughtChance: 0.36,
    title: {
      NL: 'BIERTJE PIKKER',
      EN: 'BEER NABBER',
      PL: 'ZŁODZIEJ PIWKA',
    },
    caughtText: {
      NL: 'Ome Jan kijkt op: "Hé! Da\'s mijn pils! Geef terug!" Inspecteur lacht voor het eerst dit jaar.',
      EN: 'Uncle Jan looks up: "Hey! That\'s my pint! Give it back!" Inspector laughs for the first time this year.',
      PL: 'Wujek Janek patrzy: "Hej! To moje piwo!" Inspektor po raz pierwszy w tym roku się śmieje.',
    },
    achText: {
      NL: 'Slokje van Ome Jan\'s pils. Hij merkt het niet. Ome Jan vergeet sneller dan een Belastingdienst-systeem.',
      EN: 'A sip of Uncle Jan\'s pint. He doesn\'t notice. Uncle Jan forgets faster than a tax office system.',
      PL: 'Łyk piwa wujka. Nie zauważył. Wujek zapomina szybciej niż systemy urzędu.',
    },
  },
};

export function rollCaught(egg) {
  return Math.random() < egg.caughtChance;
}

export function eggsList() {
  return Object.values(EASTER_EGGS);
}
