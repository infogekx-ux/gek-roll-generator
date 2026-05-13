// Inspecteur uitspraken per nationaliteit + rage-stadium
// Stadium 0 = stil (idle). 1=zucht, 2=geërgerd, 3=rood, 4=ontploft, 5=huilen+manager

export const NATIONALITIES = [
  { code: 'NL', label: '🇳🇱 Nederland' },
  { code: 'PL', label: '🇵🇱 Polska' },
  { code: 'TR', label: '🇹🇷 Türkiye' },
  { code: 'MA', label: '🇲🇦 Maroc' },
  { code: 'SR', label: '🇸🇷 Sranan' },
  { code: 'DE', label: '🇩🇪 Deutschland' },
  { code: 'EN', label: '🇬🇧 English' },
  { code: 'RO', label: '🇷🇴 România' },
  { code: 'BG', label: '🇧🇬 България' },
  { code: 'ID', label: '🇮🇩 Indonesia' },
];

export const inspecteurQuotes = {
  NL: {
    1: ['Hmm.', 'Tjonge zeg.', 'Mhm-mhm.', 'Kijk eens aan...', 'Tja...'],
    2: ['Nou nou.', 'Doe even normaal.', 'Kom op zeg.', 'Hou je vast, vriend.'],
    3: ['Godverdomme zeg!', 'Krijg nou wat!', 'Doe even normaal joh!', 'Tieten!'],
    4: ['GODVERDOMME WAT EEN GEKLOOI!', 'DIT IS NIET TE GELOVEN!', 'OPHOEPELEN MET DIE ONZIN!'],
    5: ['Ik bel m\'n manager. Punt.', 'Henk! HENK! Kom hier!', '*snik* dit gaat niet meer...']
  },
  PL: {
    1: ['Hmm...', 'A co my tu mamy.', 'No proszę.'],
    2: ['No nie...', 'Daj spokój.', 'Serio?'],
    3: ['No nie żartuj!', 'Kurde, znowu źle!', 'Cholera!'],
    4: ['Ja pierdolę! Co ty wyprawiasz?!', 'Cholera jasna, to nie do wiary!', 'Człowieku, weź się ogarnij!'],
    5: ['Dzwonię do szefa. Koniec.', '*płacze* nie mogę już...']
  },
  TR: {
    1: ['Hmm...', 'Bakalım.', 'Şöyle bir bakalım.'],
    2: ['Yapma ya.', 'Hadi ama.', 'Ciddi misin?'],
    3: ['Yapma ya, ciddi misin?!', 'Olmaz böyle!', 'Yeter artık!'],
    4: ['Allah kahretsin! Bu ne ya?!', 'Vallahi inanmıyorum!', 'Bu kadar yeter!'],
    5: ['Müdürü arıyorum. Tamam.', '*ağlıyor* artık dayanamıyorum...']
  },
  MA: {
    1: ['Hmm...', 'Chouf...', 'Zid zid.'],
    2: ['Bezzef.', 'Yallah.', 'Wallah?'],
    3: ['Bezzef, hada machi mzyan!', 'Wallah ghi bzzaf!', 'Khalas!'],
    4: ['Wallah, hada chno hada?!', 'Hada mafhoumch!', 'Sir f7alak men hna!'],
    5: ['Ghadi n3eyyet l mol l madrasa.', '*ka-ybki* ma kant9ad...']
  },
  SR: {
    1: ['Hmm.', 'No spang.', 'Luku...'],
    2: ['No spang ma fout!', 'Bos!', 'No play.'],
    3: ['No spang ma!', 'Fa yu kan du dati?', 'Bos!!'],
    4: ['Odi boi, fa yu kan du dati?!', 'No ben mi mati!', 'Lasi mi!'],
    5: ['Mi e bel mi basi.', '*kre* mi no man moro...']
  },
  DE: {
    1: ['Hmm.', 'Schauen wir mal.', 'Aha.'],
    2: ['Mensch.', 'Nun ja.', 'Das geht doch nicht.'],
    3: ['Mensch, das ist doch falsch!', 'Verdammt!', 'Das gibt\'s doch nicht!'],
    4: ['Donnerwetter! Das geht so nicht!', 'Verflucht noch mal!', 'Unmöglich!'],
    5: ['Ich rufe meinen Vorgesetzten.', '*schluchz* das ist zu viel...']
  },
  EN: {
    1: ['Hmm.', 'Right then.', 'Let\'s see.'],
    2: ['Come on, mate.', 'Really?', 'You sure?'],
    3: ['Are you serious right now?', 'Oh come off it.', 'That\'s rubbish.'],
    4: ['Bloody hell, mate!', 'You\'ve got to be kidding me!', 'For crying out loud!'],
    5: ['I\'m calling my supervisor.', '*sobbing* I can\'t do this...']
  },
  RO: {
    1: ['Hmm.', 'Să vedem.', 'Aha.'],
    2: ['Hai măi.', 'Serios?', 'Nu se poate.'],
    3: ['Doamne, iar greșit!', 'Ce naiba!', 'Nu mai pot!'],
    4: ['Băi, ce naiba faci?!', 'Mama dracului!', 'Pleacă de aici!'],
    5: ['Sun șeful. Gata.', '*plânge* nu mai pot...']
  },
  BG: {
    1: ['Хмм.', 'Така...', 'Виж сега.'],
    2: ['Айде, моля те.', 'Сериозно ли?', 'Пак?'],
    3: ['Айде, моля те!', 'По дяволите!', 'Това е зле!'],
    4: ['Майка му, пак сгреши!', 'Не може да бъде!', 'Махай се!'],
    5: ['Звъня на шефа.', '*плаче* не мога повече...']
  },
  ID: {
    1: ['Hmm.', 'Coba lihat.', 'Lah...'],
    2: ['Astaga.', 'Serius?', 'Yang bener.'],
    3: ['Astaga, serius?!', 'Aduh!', 'Ya ampun!'],
    4: ['Aduh, salah lagi nih!', 'Gila lu!', 'Keluar sana!'],
    5: ['Aku panggil bos.', '*nangis* sudah tidak kuat...']
  },
};

export function pickInspecteurQuote(nationalityCode, rage) {
  const safeRage = Math.max(0, Math.min(5, rage));
  if (safeRage === 0) return null;
  const pool = inspecteurQuotes[nationalityCode] || inspecteurQuotes.NL;
  const tier = pool[safeRage] || pool[1];
  return tier[Math.floor(Math.random() * tier.length)];
}
