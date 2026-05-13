# 💼 ZZP vs Belastingdienst — De Blauwe Wraak

Een mobiele **PWA-game** waarin de Nederlandse ZZP'er terugvecht tegen de
Belastingdienst — met facturen, aftrekposten en pure overlevingsdrang.
Cynische, fact-based humor over de échte ZZP-pijn van 2026.

> Satire. Niet bedoeld als juridisch of fiscaal advies — voor je eigen situatie:
> raadpleeg een gekwalificeerd boekhouder of fiscalist.

## Modi

- **▶ Spelen** — 2D arcade-shooter. Je bent een ZZP'er met een laptop. Schiet
  facturen 📄 op blauwe enveloppen 📨, inspecteurs 🕵️, risico-algoritmes 🤖,
  terugvorderingen 💸, DBA-handhavers ⚖️ en de eindbaas: 🏛️ **De Blauwe Kolos**.
- **🧠 Belastingquiz** — 5 random vragen per ronde over urencriterium, KOR,
  Box 3, Wet DBA, MKB-winstvrijstelling, bewaarplicht, factuureisen enz.
  Elk antwoord heeft uitleg met de juridische realiteit.
- **📚 Wetboek** — Educatieve referentie in begrijpelijke Dutch. Beslaat alle
  hot-button issues voor ZZP'ers in 2026.
- **🏆 Ranking** — Lokale top-20 highscore-lijst (localStorage).

## Power-ups

| Power-up | Effect |
|---|---|
| 🛡️ **KOR-schild** | 3 sec onkwetsbaar (Kleineondernemersregeling) |
| 💰 **Zelfstandigenaftrek** | 5 sec triple-shot facturen |
| ⚡ **Jaarruimte** | 5 sec snelheid +50% |
| ❤️ **Aftrekpost** | +25 HP |

## Spelen

```bash
# Run de meegeleverde nul-dependencies statische server:
cd dutch-tax-battle
node serve.js
# of: PORT=3000 node serve.js
```

Open in browser:
- **Desktop:** http://localhost:8080/ — bediening met **WASD / Pijltjes + Spatie**
- **Telefoon (zelfde Wi-Fi):** http://&lt;jouw-LAN-IP&gt;:8080/ — touch-joystick + fire-button

### Als PWA op je telefoon "installeren"

1. Open de URL op je telefoon (Safari iOS of Chrome Android).
2. Tik op **Delen → Voeg toe aan beginscherm** (iOS) of menuknop **Toevoegen
   aan startscherm** (Android).
3. De game opent voortaan fullscreen, alsof het een native app is. Werkt
   offline dankzij de service worker.

## Architectuur

Vanilla HTML5 Canvas + JS — **geen build-stap, geen dependencies, geen
framework**. Werkt op iedere moderne telefoon.

```
dutch-tax-battle/
├── index.html            # PWA shell (mobile meta, HUD, touch controls)
├── manifest.webmanifest  # PWA manifest
├── sw.js                 # Service worker (offline cache)
├── serve.js              # Zero-dep static server
├── css/styles.css
└── js/
    ├── main.js                  # Boot + scene manager + game loop
    ├── engine/
    │   ├── input.js             # Keyboard + touch joystick
    │   ├── audio.js             # WebAudio SFX-synth
    │   ├── storage.js           # localStorage wrapper
    │   └── util.js
    ├── scenes/
    │   ├── menu.js
    │   ├── battle.js            # Arcade shooter, waves, pickups, boss
    │   ├── quiz.js              # 5-vragen quiz
    │   ├── leaderboard.js
    │   ├── lawbook.js           # Educatieve referentie
    │   └── gameover.js
    └── data/
        ├── questions.js         # 20+ vragen over NL belastingrecht
        ├── facts.js             # 24 in-game pop-up facts
        └── enemies.js           # Vijand & power-up specificaties
```

## Educatieve inhoud — gedekt

- **Urencriterium** (1.225 uur, directe + indirecte uren)
- **Zelfstandigenaftrek** (afbouw naar €1.200 in 2026, verder dalend)
- **MKB-winstvrijstelling** (12,7% in 2026, zonder urencrit)
- **Startersaftrek** (€2.123, max 3x in 5 jaar)
- **KOR** (drempel €20.000, BTW-vrijstelling)
- **BTW-tarieven** (21% / 9% / 0%)
- **Wet DBA & schijnzelfstandigheid** (volledige handhaving sinds 1-1-2025)
- **Box 3** (Kerstarrest, herstel, werkelijk-rendement-stelsel)
- **Toeslagenaffaire** (historische context van wantrouwen)
- **Aangifte-deadlines** (1 mei, uitstel, voorlopige aanslag)
- **Auto van de zaak** (500-km-grens, rittenregistratie)
- **KIA** (kleinschaligheidsinvesteringsaftrek)
- **Bewaarplicht** (7/10 jaar)
- **Boete-niveaus** (vergrijpboete bij opzet)
- **Factuureisen** (KVK/BTW-nrs, uniek volgnr, BTW-uitsplitsing)
- **Jaarruimte / lijfrente** (ZZP-pensioen)
- **Praktische vuistregels** (30–40% apart zetten, voorlopige aanslag)
- **Blauwe envelop** (sinds 1915 — culturele context)

## Bediening

| Apparaat | Beweging | Schieten | Pauze |
|---|---|---|---|
| Touchscreen | Linker joystick | Rechter 📄-knop | II-knop rechtsboven |
| Desktop | WASD of pijltjes | Spatiebalk / Enter | Esc of P |

Je schiet in de richting waarin je het laatst bewoog. Standaard schiet je
omhoog.

## Bekijk de bron van de feiten

De Dutch tax-feiten in dit spel zijn gecontroleerd tegen publiekelijk
beschikbare bronnen, waaronder:

- Belastingdienst — over-ons.belastingdienst.nl
- KVK — kvk.nl / wet-dba
- Ondernemersplein.overheid.nl
- ZZP Nederland — zzp-nederland.nl
- FNV Zelfstandigen
- Hoge Raad uitspraken (2021 Kerstarrest, 2024 vervolg)

## Licentie

Privé-project — alleen voor educatieve en satirische doeleinden.
