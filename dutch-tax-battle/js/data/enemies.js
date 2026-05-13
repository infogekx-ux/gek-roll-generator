// Belastingdienst-themed enemies. Pure satire — not real officials.

export const ENEMIES = {
  envelope: {
    id: 'envelope',
    name: 'Blauwe Envelop',
    emoji: '📨',
    hp: 1,
    speed: 1.6,
    score: 10,
    color: '#3a78d6',
    behavior: 'straight',
    desc: 'Onschuldig ogend papiertje. Veroorzaakt nachtmerries.'
  },
  inspecteur: {
    id: 'inspecteur',
    name: 'Inspecteur',
    emoji: '🕵️',
    hp: 3,
    speed: 1.1,
    score: 40,
    color: '#222',
    behavior: 'zigzag',
    desc: 'Controleert je urenregistratie. Lacht zelden.'
  },
  algoritme: {
    id: 'algoritme',
    name: 'Risico-algoritme',
    emoji: '🤖',
    hp: 2,
    speed: 1.4,
    score: 30,
    color: '#9a4ed1',
    behavior: 'homing',
    desc: 'Vooringenomen, oncontroleerbaar, en altijd net niet juist.'
  },
  toeslag: {
    id: 'toeslag',
    name: 'Terugvordering',
    emoji: '💸',
    hp: 4,
    speed: 0.9,
    score: 60,
    color: '#d63a52',
    behavior: 'straight',
    desc: '"Je krijgt te veel toeslag — betaal het maar terug. Met rente."'
  },
  dba: {
    id: 'dba',
    name: 'DBA-handhaver',
    emoji: '⚖️',
    hp: 5,
    speed: 0.8,
    score: 90,
    color: '#ffa500',
    behavior: 'zigzag',
    desc: 'Sinds 2025 weer actief. Vraagt: "Ben je écht zelfstandig?"'
  },
  boss: {
    id: 'boss',
    name: 'De Blauwe Kolos',
    emoji: '🏛️',
    hp: 35,
    speed: 0.5,
    score: 500,
    color: '#0a3a7a',
    behavior: 'boss',
    desc: 'Hoofdkantoor zelf. Schiet enveloppen in alle richtingen.'
  }
};

export const POWERUPS = {
  kor: { id: 'kor', name: 'KOR-schild', emoji: '🛡️', desc: '3s onkwetsbaar (Kleineondernemersregeling)', color: '#46c46a' },
  aftrek: { id: 'aftrek', name: 'Zelfstandigenaftrek', emoji: '💰', desc: 'Triple-shot voor 5s', color: '#ffc83d' },
  jaarruimte: { id: 'jaarruimte', name: 'Jaarruimte', emoji: '⚡', desc: 'Snelheid +50% voor 5s', color: '#00d4ff' },
  heart: { id: 'heart', name: 'Aftrekpost', emoji: '❤️', desc: '+25 HP', color: '#e63946' }
};
