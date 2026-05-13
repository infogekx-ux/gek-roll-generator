import { sfx } from '../engine/audio.js';

// "Wetboek" — educational reference, written in plain Dutch with humor.
const ENTRIES = [
  {
    title: 'Urencriterium — De Heilige 1.225',
    emoji: '⏱️',
    body: 'Wie als ondernemer aanspraak wil maken op zelfstandigenaftrek, startersaftrek en MKB-faciliteiten met urencrit, moet minimaal 1.225 uur per kalenderjaar aan zijn onderneming besteden. Indirecte uren (administratie, scholing, acquisitie, reizen) tellen mee, mits aantoonbaar via een urenregistratie. Vergeet de helft van het jaar te registreren? Pech.'
  },
  {
    title: 'Zelfstandigenaftrek — Stille Sloop',
    emoji: '💸',
    body: 'Klassieke ondernemersaftrek voor wie het urencrit haalt. Was €7.280 in 2019, gestaag verlaagd tot €1.200 in 2026, en verder dalend richting 2027. De facto fiscaal terugdraaien van de ZZP-vriendelijke jaren. Wie boekhoudt heeft het al gemerkt.'
  },
  {
    title: 'MKB-winstvrijstelling — De Stille Held',
    emoji: '🛡️',
    body: '12,7% van je winst (na zelfstandigenaftrek) is vrijgesteld in 2026. Geen urencrit nodig. Werkt automatisch via je IB-aangifte. Eén van de weinige fiscale strepen die níet snel naar nul zakt.'
  },
  {
    title: 'Startersaftrek',
    emoji: '🚀',
    body: 'Extra €2.123 aftrek bovenop de zelfstandigenaftrek. Max 3x in de eerste 5 jaar als ondernemer. Voorwaarde: urencrit. Geboorte-cadeau van Fiscus, met een houdbaarheidsdatum.'
  },
  {
    title: 'KOR — Kleineondernemersregeling',
    emoji: '🪙',
    body: 'Onder €20.000 omzet/jaar? Je mag de KOR aanvragen — geen BTW factureren, geen BTW aftrekken, geen BTW-aangifte. Aanmelden moet minimaal 3 maanden vóór de gewenste ingangsdatum. Geldt voor minimaal 3 jaar of tot je boven de grens komt.'
  },
  {
    title: 'BTW — De Cash Die Niet Van Jou Is',
    emoji: '🧾',
    body: 'Hoofdtarief 21% (de meeste diensten/producten). Verlaagd 9% (boeken, eten/drinken, kapper, fiets, personenvervoer). 0% bij export buiten EU. Vrijgesteld o.a. onderwijs, zorg, financiële diensten. Wat je incasseert moet je doorstorten — het is nooit "jouw" geld, ook al staat het op je rekening.'
  },
  {
    title: 'Wet DBA — Schijnzelfstandigheid',
    emoji: '⚖️',
    body: 'Sinds 1-1-2025 handhaaft de Belastingdienst weer volledig. Het gaat om de feitelijke werksituatie: gezagsverhouding, persoonlijk verrichten, loondoorbetaling. Eén klant + zijn middelen + zijn instructies = vermoeden van dienstbetrekking. Naheffing kan voor de opdrachtgever, met terugwerkende kracht.'
  },
  {
    title: 'Box 3 — De Vermogenstroebel',
    emoji: '🏛️',
    body: 'Het Kerstarrest van de Hoge Raad (2021) verklaarde het fictieve rendement onrechtmatig. Latere arresten (2024) bevestigden: werkelijk rendement telt. Een nieuw stelsel "werkelijk rendement" is meermaals uitgesteld. Voorlopig: aangifte met keuzeregeling, herstelloket loopt.'
  },
  {
    title: 'Toeslagenaffaire',
    emoji: '💔',
    body: 'Tienduizenden gezinnen werden ten onrechte als fraudeur bestempeld bij de kinderopvangtoeslag. Levens verwoest. Kabinet Rutte III viel in 2021. Compensatie via UHT loopt nog en wordt door betrokkenen als veel te traag ervaren. Dit is de morele ondergrond van wantrouwen jegens de Belastingdienst.'
  },
  {
    title: 'Aangifte & Deadlines',
    emoji: '📅',
    body: 'Inkomstenbelasting: 1 mei deadline. Uitstel aanvragen vóór die datum (meestal tot 1 september). Aangifte vóór 1 april? De Belastingdienst belooft een reactie vóór 1 juli. Voorlopige aanslag aanvragen voorkomt cashflow-schokken — je betaalt in maandtermijnen.'
  },
  {
    title: 'Auto van de Zaak',
    emoji: '🚗',
    body: 'Bijtelling bij privégebruik. Minder dan 500 privé-km/jaar = geen bijtelling, mits sluitende rittenregistratie of een "Verklaring geen privégebruik". Boodschappen lopen of die ene zaterdagse rit telt ook als privé. Pas op met combinaties.'
  },
  {
    title: 'KIA — Investeringsaftrek',
    emoji: '🔧',
    body: 'Kleinschaligheidsinvesteringsaftrek voor investeringen vanaf ~€2.901 (2026, geïndexeerd). Niet voor personenauto\'s, woningen, grond of investeringen <€450 per stuk. Percentage trapsgewijs. Combineerbaar met andere aftrekposten.'
  },
  {
    title: 'Boete & Bewaarplicht',
    emoji: '📂',
    body: 'Administratie 7 jaar bewaren, onroerend goed 10 jaar. Bij opzet kan de vergrijpboete 100% of meer zijn van de te weinig betaalde belasting. Plus belastingrente. "Vergeten" telt vaak als grove schuld. Bij fraude komt het strafrecht erbij.'
  },
  {
    title: 'Pensioen — Jaarruimte',
    emoji: '🪙',
    body: 'AOW alleen is te weinig. ZZP\'ers kunnen fiscaal aftrekbaar inleggen in een lijfrente, beperkt tot de "jaarruimte" — berekend via een Belastingdienst-tool of je accountant. Reserveringsruimte gebruikt achterstanden uit eerdere jaren. Doe het.'
  },
  {
    title: 'Praktische ZZP-vuistregels',
    emoji: '🎯',
    body: '• 30–40% van iedere factuur direct apart op een spaarrekening (BTW + IB + ZVW + buffer)\n• Aparte zakelijke rekening\n• Urenregistratie bijhouden vanaf dag 1\n• Voorlopige aanslag aanvragen → maandtermijnen\n• Boekhoudpakket met automatische bankkoppeling\n• Eén verzekeraar voor AOV vergelijken, niet uitstellen'
  },
  {
    title: 'Disclaimer',
    emoji: 'ℹ️',
    body: 'Deze app is satirisch en educatief. Het bevat geen juridisch of fiscaal advies. Voor je eigen situatie: raadpleeg een gekwalificeerd boekhouder of fiscalist, of de officiële informatie van Belastingdienst, KVK en Ondernemersplein.'
  }
];

export class LawbookScene {
  constructor(game) { this.game = game; }

  enter() {
    this.game.showHUD(false);
    this.game.showTouch(false);
    const list = ENTRIES.map((e) => `
      <li>
        <span class="emoji">${e.emoji}</span>
        <div><b>${e.title}</b><br><span style="opacity:0.85;white-space:pre-wrap;">${e.body}</span></div>
      </li>
    `).join('');
    this.game.showOverlay(`
      <div class="panel">
        <h1>📚 Wetboek voor ZZP'ers</h1>
        <p>De Belastingwet in begrijpelijke taal — met een vleugje cynisme.</p>
        <ul>${list}</ul>
        <div class="btns">
          <button class="btn secondary" id="back">← Naar menu</button>
        </div>
      </div>
    `);
    this.game.overlay.querySelector('#back').addEventListener('click', () => { sfx.click(); this.game.gotoMenu(); });
  }

  leave() { this.game.hideOverlay(); }
  update() {}
  render() {}
}
