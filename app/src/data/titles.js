// Titel-progressie. Threshold = totaal aantal sterren of speciale eis.
export const TITLES = [
  { id: 0, label: 'Belasting Beginneling',  minStars: 0,  desc: 'Zojuist verschenen. Inspecteur ruikt al bloed.' },
  { id: 1, label: 'BTW Bromsnor',           minStars: 3,  desc: '21 of 9 — je weet het verschil. Beetje.' },
  { id: 2, label: 'Aftrekpost Amateur',     minStars: 8,  desc: 'Je snuffelt aan elke bon als een hond aan een paal.' },
  { id: 3, label: 'Fiscaal Freak',          minStars: 15, desc: 'KIA, EIA, MIA — voor jou drie achternamen.' },
  { id: 4, label: 'Belasting Bandiet',      minStars: 22, desc: 'Inspecteur kent je naam. Niet als compliment.' },
  { id: 5, label: 'Tax Terrorist',          minStars: 30, desc: 'Belastingdienst heeft een dossier met "Pas op".' },
  { id: 6, label: 'Ontwijkings Olympiër',   minStars: 38, desc: 'Legaal, hè. Echt waar. Wij beloven.' },
  { id: 7, label: 'De Fiscale Feniks',      minStars: 45, desc: 'Vaker gecrasht dan een Tesla op autopilot, maar je staat weer op.' },
  { id: 8, label: 'LULBAL Legende',         minStars: 50, desc: 'Ome Jan vraagt aan jou om advies.' },
  { id: 9, label: 'Belasting Boss',         minStars: 60, desc: 'De inspecteur huilt al voordat je belt.' },
];

export function titleForStars(totalStars) {
  let title = TITLES[0];
  for (const t of TITLES) {
    if (totalStars >= t.minStars) title = t;
  }
  return title;
}
