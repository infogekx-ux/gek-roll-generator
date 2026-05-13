# GAME-DESIGN.md — LULBAL

> **Speel met je belasting**
>
> Complete game design document. Bouwblueprint voor LULBAL — een Nederlandse, web-based educatieve game over ZZP-belasting. Gebaseerd op feiten uit `RESEARCH.md`.
>
> **Versie:** 0.1 (blueprint) · **Taal:** NL (met EN tech-secties) · **Doel:** klaar voor implementatie.
>
> Disclaimer voor builders: alle tekst, scenario's, naam- en stereotypen-keuzes moeten respectvol blijven. Humor altijd via auto-ironie en gedeelde NL-ervaring, nooit denigrerend. Concrete cijfers in dit document zijn educatief en mogen niet als belastingadvies worden gepresenteerd.

---

## 1. GAME OVERVIEW

| Veld | Waarde |
|---|---|
| **Naam** | LULBAL |
| **Tagline** | *"Speel met je belasting"* |
| **Genre** | Educatief casual / quiz-RPG / serious game |
| **Platform** | Web (PWA, mobile-first) |
| **Taal** | Nederlands; dialecten + nationaliteits-quotes als kleur |
| **Doelgroep** | ZZP'ers 20–55 (alle geslachten, alle beroepen, ook expats met BSN) |
| **Sessieduur** | 3–10 min per sessie, 1–3 levels |
| **Retention-loop** | Daily login, weekly challenge, team-competitie, duels |
| **Monetisatie** | LULCOIN-shop (cosmetics + utility) + Partner Verified subscriptions |
| **Compliance** | GEEN echte waarde van munten → geen Ksa-licentie nodig; educatief disclaimer altijd zichtbaar |

### 1.1 Visie

LULBAL is wat er gebeurt als de **stamkroeg** en het **belastingkantoor** een kind krijgen. De toon: alsof je beste maat je belastingadvies geeft na 4 biertjes — grappig, grof, herkenbaar, maar in de kern feitelijk correct. Je leert het systeem terwijl je lacht om de inspecteur die rood wordt en ontploft in jouw moedertaal.

### 1.2 Mission statement

> "Geen enkele ZZP'er moet bang zijn voor de blauwe envelop. Bang? Nee. Voorbereid? Ja. En lachend onderweg."

### 1.3 Pillars (3 kerngedachten)

1. **Lach eerst, leer dan.** Humor is de hook; educatie sluipt naar binnen.
2. **Iedereen mee.** NL, PL, TR, MA, SR, DE, EN, RO, BG, ID — alle ZZP'ers in NL voelen zich thuis.
3. **Speel met anderen of speel solo.** Teams en landen-competitie zijn optie, geen plicht.

---

## 2. POSITIONERING & TONE OF VOICE

### 2.1 Toon

- **Stamkroeg-niveau** taal, niet kantoor-jargon.
- **Absurd, grof, herkenbaar**. Ja, "lul" zit in de naam — dat is het hele punt.
- **Geen belerend vingertje**. Foute keuze = grappige consequence, niet preek.
- **Aanspreekvorm**: tutoyeren, "je/jij/jullie". Inspecteur zegt "u" — sarcastisch.

### 2.2 Voorbeelden van LULBAL-stem

- Correct antwoord: *"Kassa! Je weet hoe het werkt. Boekhouder kan thuisblijven."*
- Fout antwoord: *"Eh nee maatje. Belastingdienst heeft je nu gespot. Boete: €82."*
- Game over: *"Pak je bonnetjes en hoepel op naar het belastingkantoor. Doei."*
- Level start: *"Nieuwe ronde, nieuwe kansen, nieuwe blauwe enveloppen."*

### 2.3 Wat we NIET doen

- Geen scheld op individuele groepen.
- Geen advies in stijl van "betaal geen belasting".
- Geen echte gokfunctie met fiat-geld.
- Geen real-time multiplayer chat zonder moderatie.
- Geen child-targeting (18+ in copy, hoewel 16+ technisch kan).

---

## 3. ONBOARDING — 1 SCHERM, KLAAR

### 3.1 Doel
Speler is binnen **30 seconden** in Level 1. Geen tutorial. Leer-door-doen.

### 3.2 Layout (mobile-first, fits 360×800)

```
┌──────────────────────────────┐
│  [LOGO: LULBAL]              │
│  Speel met je belasting       │
├──────────────────────────────┤
│                              │
│      🤬 INSPECTEUR-CARICATUUR │
│      (rood, stoom, woedend)  │
│                              │
├──────────────────────────────┤
│ E-mail:        [__________]   │
│ Nickname:      [__________]   │
│ Bedrijfsnaam:  [__________]   │
│   (optioneel — voor ranking)  │
│ Nationaliteit: [▼ Nederland]  │
├──────────────────────────────┤
│      [    SPELEN!    ]        │
├──────────────────────────────┤
│ Door op SPELEN te klikken ga  │
│ je akkoord met de huisregels. │
│ LULBAL is een educatief spel, │
│ geen belastingadvies.         │
└──────────────────────────────┘
```

### 3.3 Velden + validatie

| Veld | Type | Verplicht | Validatie |
|---|---|---|---|
| Email | text | ✅ | RFC + uniek (bij dubbele: "Hé, je hebt al een account — log in") |
| Nickname | text | ✅ | 3–20 chars, alfanum + `_`, uniek; profanity-filter |
| Bedrijfsnaam | text | ❌ | 0–60 chars; getoond op leaderboard als ingevuld |
| Nationaliteit | dropdown | ✅ | NL · PL · TR · MA · SR · DE · EN · RO · BG · ID (default = NL) |

### 3.4 Wat gebeurt na klik op SPELEN!

1. Account aangemaakt in Supabase (magic-link wordt naar email gestuurd voor latere logins).
2. Avatar genereert automatisch op basis van nickname (DiceBear preset).
3. **Direct** door naar Level 1, Scenario 1. Geen splash. Geen "Welkom!"-overlay. Inspecteur zit al achter het bureau.

---

## 4. SPELER DASHBOARD

Toegankelijk via menu-icoon na Level 1. Centrale hub.

### 4.1 Layout (mobile)

```
┌──────────────────────────────┐
│ [@nick]  Titel: BTW Bromsnor │
│ Avatar  Streak: 🔥 12 dagen  │
├──────────────────────────────┤
│ 💶 Totaal bespaard:           │
│    € 47.250  (game-euro)      │
├──────────────────────────────┤
│ 🪙 LULCOINS: 1.840            │
├──────────────────────────────┤
│ LEVELS                       │
│ [1]⭐⭐⭐  [2]⭐⭐⭐  [3]⭐⭐    │
│ [4]⭐⭐   [5]⭐    [6]🔒      │
│ [7]🔒   [8]🔒   [9]🔒        │
│ [10]🔒  [Bonus 🔒]            │
├──────────────────────────────┤
│ WEEKLY CHALLENGE             │
│ "BTW Tetris in <60s"          │
│ Sponsor: Boekhouder.nl        │
│ Prijs: 1u gratis advies       │
│ ⏰ Eindigt over 3d 14u        │
├──────────────────────────────┤
│ TEAM: 🇵🇱 Rycerze Zakonu      │
│ Rank in team: #4              │
│ Land-rank PL: #2 globaal      │
├──────────────────────────────┤
│ LEADERBOARD (top 10)         │
│ 1. @taxking — BV Tax & Co    │
│ 2. @ome_jan — Stamkroeg Inc  │
│ ...                          │
│ Jij: #347 van 12.481          │
├──────────────────────────────┤
│ [DEEL JE SCORE]  [DUEL!]      │
└──────────────────────────────┘
```

### 4.2 Elementen — specs

- **Totaal bespaard (game-euros)**: cumulatieve som van "bespaarde belasting" uit alle scenario-uitkomsten. Pure cosmetisch — geen valuta.
- **Streak**: aantal opeenvolgende dagen met ≥1 voltooid scenario. Breekt bij gemiste dag (cut-off 04:00 NL-tijd).
- **Levels**: 1–10 + Bonus. Lock-gate op sterren: Level N vereist totaal ≥ 2·(N–1) sterren uit voorgaande levels.
- **Weekly challenge**: één gerouleerd level + extra modifier (snelheid, geen hints) + sponsorprijs.
- **Team-blok**: zichtbaar alleen als speler in team; anders "Sluit aan bij team" CTA.
- **Leaderboard**: weekly + all-time, gefilterd op solo / team / land.
- **Deel je score**: opent native share-sheet of fallback to clipboard.

---

## 5. KARAKTERS

### 5.1 Inspecteur (hoofdantagonist)

**Concept**: een belastinginspecteur in te-strak pak, te-strakke das, te-strak gezicht. Begint elke level netjes. Loopt 30 % roder per fout antwoord. Bij 100 % rood → ontploft → huilt → belt zijn manager.

#### 5.1.1 Rage-staten (0–5)

| Stand | % Rood | Visueel | Tekst-toon |
|---|---|---|---|
| 0 — Kalm | 0 % | grijze das, neutraal | beleefd, professioneel |
| 1 — Zucht | 20 % | wenkbrauw omhoog | "Hmm..." / "Tjonge zeg." |
| 2 — Geërgerd | 40 % | rode wangen | "Nou nou..." / "Kom op, zeg." |
| 3 — Rood hoofd | 60 % | hele kop rood, ader klopt | scheldwoord in NL of nationaliteits-taal |
| 4 — Ontploft | 80 % | stoom uit oren, papieren vliegen | volzin in moedertaal + boete |
| 5 — Huilen + manager bellen | 100 % | tranen, telefoon in hand | "IK BEL JE MANAGER" → game over of level reset |

#### 5.1.2 Reactie-quotes per nationaliteit / regio

> Belangrijk: deze quotes komen alleen tevoorschijn bij stadium 3+ (fout antwoord) en zijn **per gekozen nationaliteit** van de speler. Stadium 1–2 blijft altijd NL.

**🇳🇱 Nederlands (default + regio)**:
- Amsterdam: *"Doe even normaal, joh! Krijg nou tieten!"*
- Rotterdam: *"Kut. Klopt niet. Volgende."*
- Den Haag: *"Hè verrek, dut kan toch niet?!"*
- Brabant: *"Hedde gij dan helemaal niks geleerd? Verrekte sukkel."*
- Limburg: *"Och hèrejèses, kind toch."*
- Twente: *"Da's nie netjes, knul."*
- Groningen: *"Dou normaal, mainske!"*
- Friesland: *"Heden, dit kin sa net."*

**🇵🇱 Pools**: *"Ja pierdolę! Co ty wyprawiasz?!"* / *"Cholera jasna, znowu źle!"*
**🇹🇷 Turks**: *"Allah kahretsin! Bu ne ya?!"* / *"Yapma ya, ciddi misin?"*
**🇲🇦 Marokkaans (darija)**: *"Wallah, hada chno hada?!"* / *"Khalas, bezzef!"*
**🇸🇷 Surinaams (Sranan)**: *"Odi boi, fa yu kan du dati?!"* / *"No spang, ma fout!"*
**🇩🇪 Duits**: *"Donnerwetter! Das geht so nicht!"* / *"Mensch, das ist doch falsch!"*
**🇬🇧 English**: *"Bloody hell, mate. Are you serious?!"* / *"This is rubbish."*
**🇷🇴 Roemeens**: *"Băi, ce naiba faci?!"* / *"Doamne, iar greșit."*
**🇧🇬 Bulgaars**: *"Майка му, пак сгреши!"* / *"Айде, моля те!"*
**🇮🇩 Indonesisch**: *"Aduh, salah lagi nih!"* / *"Astaga, serius?"*

> Bij teams: als jouw team van een ander land in een duel wint, dan reageert de inspecteur **in de taal van het winnende team**. Extra trolling-laag.

#### 5.1.3 Animaties (CSS / SVG morph)
- Idle: lichte head-bob, knipperen.
- Zucht: schouders zakken, oogrol.
- Rood: kleur-transitie 600 ms van wit naar `#E53935`.
- Stoom: 2 `<path>`'s uit de oren, opacity-loop.
- Tranen: 2 SVG-droplets van onderaan-oog.
- Ontploft: hele inspecteur shake + papieren-particles flying.

### 5.2 Ome Jan (helper, comic relief)

**Concept**: jouw oom uit de stamkroeg. Vest, snor, biertje in de hand. Geeft advies. **70 % goed, 30 % totale onzin** (gewogen random per scenario). Verschijnt gratis 1× per level; daarna kost 50 LULCOINS.

#### 5.2.1 Visueel
- Rond gezicht, rode neus, snor, bril schuin.
- Achter de schermen: stamkroeg-bar, neon-bord *"Café De Belasting"*, biljarttafel.
- Animatie: hikt af en toe, neemt slok, friemelt aan snor.

#### 5.2.2 Uitspraken (sample-pool)

**Goed advies (70 %)**:
- *"Jongen, schrijf die kilometers op. €0,23 per kilometer, gewoon meepakken."*
- *"Joh, KOR onder de €20k — gewoon doen als je weinig draait."*
- *"Bonnetje bewaren! Zeven jaar! Geen excuses!"*
- *"BTW kwartaalaangifte — uiterlijk laatste dag van de maand erna. Sla 'm niet over."*

**Onzin (30 %)**:
- *"Geloof me, een Lamborghini is gewoon zakelijk als-ie geel is."*
- *"Belastingdienst kijkt nooit op zondag. Boek alles in op zondag."*
- *"Cash is altijd 0 % BTW, das de wet."*
- *"Mijn neef in Hongarije regelt het wel even, mailtje sturen?"*

> Het is voor de speler **niet vooraf zichtbaar** of advies klopt. Daar komt de spanning vandaan. Boekhouder = duur maar zeker; Ome Jan = gratis maar gokje.

### 5.3 De Boekhouder (helper, premium)

**Concept**: bril, stropdas, ordners, agenda vol. Geeft **100 % correct** advies. Kost **50 LULCOINS per hint**. Verschijnt op verzoek.

#### 5.3.1 Visueel
- Strak haar, bril met dik montuur, stropdas, een mok koffie.
- Kantoor-setting: bureau, computer met spreadsheet, blauwe ordners "2023" "2024" "2025".
- Animatie: rustig knikken, vingers op toetsenbord, soms naar bril grijpen.

#### 5.3.2 Aanpak
- Toont hint als korte, neutrale paragraaf met verwijzing naar regelgeving.
- Voorbeeld: *"De factuur moet je KvK-nummer bevatten (art. 35a Wet OB). Kies optie B."*
- Geeft **geen** moppen. Geen ironie. Pure feiten.

### 5.4 Bijfiguren (Level-dressing)

- **Klant Karin**: kleurrijke ZZP-klant die soms in scenario's verschijnt.
- **Postbode Henk**: levert de blauwe envelop (komt aanwaaien op fiets).
- **Stagiair Sven** bij Belastingdienst: knoeit nog meer dan de speler — comic relief.

---

## 6. CORE GAMEPLAY LOOP

```
   ┌── Daily login / streak ──┐
   │                          │
   ▼                          │
 Dashboard ──► Kies level ──► Speel scenario ──► Krijg uitslag ──► XP/LC ──► Stars ──► Unlock
   │                                                                          │
   │                                                                          ▼
   └───────────── Team chat / Weekly challenge / Duel ◄──────────── Share-screen
```

### 6.1 Scenario-structuur (1 scenario binnen een level)

1. **Scene-tekst (NL)**: 1–3 zinnen die de situatie schetsen.
2. **Inspecteur-portret + state** (idle initieel).
3. **3–4 keuzes** (multiple-choice of drag-and-drop bij sommige levels).
4. **Timer** (per level verschillend, 10–30 sec).
5. Speler kiest → directe feedback: confetti (goed) of bliksem (fout) + inspecteur-rage-shift.
6. **Educatieve uitleg (1–2 zinnen straattaal)**.
7. **Punten + LC**.
8. **NEXT** knop → volgend scenario.

### 6.2 Keuzeklassen

| Klas | Effect | Voorbeeld |
|---|---|---|
| ✅ Legaal & slim | +punten, +LC, geen rage | "KOR aanvragen onder €20k" |
| 🟡 Legaal maar dom | +klein, geen LC, mild rage | "Geen administratie bijhouden, wel netjes betalen" |
| 🔴 Fout (formeel) | 0 punten, boete, rage-stap | "BTW vergeten op factuur" |
| ☠️ Illegaal | GAME OVER, level reset | "Omzet zwart wegboeken via cash" |

---

## 7. LEVELS — 10 + BONUS

> Elke level heeft min. **8 scenario's**, 1 inspecteur-rage-arc, 1 verborgen achievement, en levert sterren (1/2/3) + LC (50–200).
>
> Hieronder per level: thema · leerdoel · mechanic · sample scenario's (min 8).

### LEVEL 1 — "De Eerste Factuur"
- **Thema**: BTW-basics, factuureisen.
- **Leerdoel**: speler weet wat op een factuur moet, kent 21/9/0 %.
- **Mechanic**: factuur-builder (drag fields naar lege factuur) + multiple choice.
- **Timer per scenario**: 20 s.
- **Reward**: 100 LC + 1–3 sterren.

**Scenario's (8)**:
1. *"Je maakt je eerste factuur voor een klant in Utrecht. Wat MOET er op?"* — Kies 4 uit 7 velden.
2. *"Klant vraagt: BTW erbij of niet?"* — B2B NL → ja, 21 %.
3. *"Je verkoopt een schilderij (eigen werk) aan een privé-koper."* — 9 % BTW (kunstenaars-tarief).
4. *"Subcontractor in de bouw: factuur aan hoofdaannemer."* — Verleggingsregeling, BTW verlegd.
5. *"Klant in Duitsland (B2B, VAT-ID)."* — Reverse charge, 0 % NL-BTW.
6. *"Klant in Verenigd Koninkrijk (na Brexit)."* — Export, 0 %.
7. *"Klant betaalt cash, vraagt 'geen factuur'."* — ☠️ illegaal → game over.
8. *"Factuurnummer: mag je opnieuw beginnen elk jaar?"* — Ja, mits uniek en sequentieel binnen reeks.

**Inspecteur-arc**: start kalm, scenario 4 (verleggingsregeling) is een trap; scenario 7 = ontploffing als gekozen.

**Educatieve uitleg (voorbeeld)** na scenario 7:
> *"Joh. Cash zonder factuur = zwart. Belastingdienst kan dit lustig naheffen plus 50 % vergrijpboete. En je verliest álle aftrekposten dat jaar. Niet doen."*

---

### LEVEL 2 — "De Blauwe Envelop"
- **Thema**: eerste aangifte inkomstenbelasting, box-systeem.
- **Leerdoel**: Box 1/2/3 onderscheiden, zelfstandigenaftrek begrijpen.
- **Mechanic**: envelop openen → vragen beantwoorden → hervaste belasting "saven".
- **Timer**: 25 s.
- **Reward**: 120 LC.

**Scenario's (8)**:
1. *"Je hebt €52.000 winst. Welke schijven raakt dit in Box 1?"* — Schijf 1 + 2.
2. *"Mag je zelfstandigenaftrek toepassen?"* — Alleen bij urencriterium 1.225 u.
3. *"Wat is de zelfstandigenaftrek in 2025?"* — €2.470.
4. *"En in 2026?"* — €1.200 (cut!).
5. *"Startersaftrek toepassen — hoe vaak in 5 jaar?"* — Max 3×.
6. *"MKB-winstvrijstelling = ... % over winst na zelfstandigenaftrek?"* — 12,7 %.
7. *"Wat hoort thuis in Box 3?"* — Spaargeld + beleggingen > heffingsvrij.
8. *"Je vergeet de aangifte 4 weken na deadline. Boete?"* — €469 (verzuimboete IB).

**Inspecteur-arc**: 4 (cut) = Ome Jan stiekem zegt "Vroeger was 't 7280, weet je nog?" — nostalgisch fout antwoord.

---

### LEVEL 3 — "Aftrekpost Jager"
- **Thema**: aftrekposten verkennen, beroep-specifiek (toekomstig uitbreidbaar).
- **Leerdoel**: KIA, EIA, MIA, thuiskantoor-regels, auto.
- **Mechanic**: kosten-checklist; tag elke uitgave als aftrekbaar / niet / gedeeltelijk.
- **Timer**: 30 s.
- **Reward**: 150 LC.

**Scenario's (8)**:
1. *"Laptop €1.800 voor je IT-werk."* — Volledig zakelijk + KIA-investering.
2. *"Lunch met klant — €45."* — Beperkt aftrekbaar (zakelijke representatie 80 %).
3. *"Pak voor je netwerkborrel."* — Niet aftrekbaar (algemene kledij).
4. *"Werkbus VW Transporter €38.000 — KIA?"* — Ja, valt in KIA-schaal.
5. *"Zonnepanelen op zakelijke werkplaats — €15.000."* — EIA 45,5 %.
6. *"Werkruimte in slaapkamer (geen aparte ingang)."* — Niet aftrekbaar — werkruimte niet-zelfstandig.
7. *"Lidmaatschap voetbalvereniging."* — Niet aftrekbaar.
8. *"Cursus 'Geavanceerd Excel' €350."* — Volledig aftrekbaar (scholingskosten).

**Beroep-extensie (later)**: bij keuze van beroep in profiel verschijnen sector-specifieke scenario's (loodgieter krijgt extra "gereedschap" cases, fotograaf krijgt "lenzen", enz.).

---

### LEVEL 4 — "BTW Tetris"
- **Thema**: BTW-tarieven 21/9/0 + vrijgesteld.
- **Mechanic**: ARCADE — facturen vallen van boven, sorteer in 4 buckets vóór de bodem.
- **Timer**: 90 s; 30 facturen.
- **Reward**: 130 LC + speedbonus.

**Scenario-items (8 sample uit pool)**:
1. *"Maaltijd in restaurant — eten ter plaatse"* → 9 %.
2. *"Sterke drank in horeca"* → 21 %.
3. *"Boek nieuwsmedium / e-book"* → 9 % (sinds Wet behoud verlaagd btw-tarief cultuur).
4. *"Fysiotherapie BIG-geregistreerd"* → vrijgesteld.
5. *"Personal training niet-medisch"* → 21 %.
6. *"Logies (hotel) vanaf 2026"* → 21 % (afschaffing verlaagd tarief op logies).
7. *"Brood bij bakker"* → 9 %.
8. *"Software-abonnement B2B aan Frans bedrijf met VAT-ID"* → 0 % (reverse charge).

**Combo-systeem**: 3 op een rij correct = "BTW-COMBO!" + 50 bonus-LC.

---

### LEVEL 5 — "De Boekhouder is Ziek"
- **Thema**: zelf complexe situaties oplossen ZONDER boekhouder; Ome Jan **geeft expres meer foute tips** dan normaal (50 %).
- **Mechanic**: pop-up Ome Jan na 5 s denkpauze.
- **Timer**: 30 s.
- **Reward**: 160 LC.

**Scenario's (8)**:
1. Ome Jan: *"Joh, schijnzelfstandigheid is gezeur, gewoon doen."* → ☠️ NIET volgen (DBA-handhaving 2025).
2. Ome Jan: *"Werkruimte: alles van je huur trekken!"* → Niet correct als werkruimte niet-zelfstandig.
3. Ome Jan: *"Auto van de zaak: zonder bijtelling als-ie 8 jaar oud is."* → FOUT. Bijtelling op cataloguswaarde, leeftijd verandert niets.
4. Ome Jan: *"FOR opbouwen — gewoon doen!"* → FOUT. FOR is afgeschaft per 2023.
5. Ome Jan: *"KIA-grens 2025: vanaf €500 mag je."* → FOUT. Vanaf €450 per bedrijfsmiddel, totaal vanaf €2.901.
6. Ome Jan: *"KOR-grens is €30k."* → FOUT. €20.000.
7. Ome Jan: *"Pensioen — gewoon premie spaarrekening, alles aftrekbaar."* → Gedeeltelijk fout: alleen lijfrente onder jaarruimte.
8. Ome Jan: *"Je hoeft die uren niet bij te houden, da's voor watjes."* → FOUT. Urencriterium = bewijslast bij jou.

> Twist: na elk scenario verschijnt **De Boekhouder als shadow-icon** met "🪙 50 voor zekerheid" — speler kan tegen LC een correct antwoord kopen.

---

### LEVEL 6 — "Investeringsaftrek Bonanza"
- **Thema**: KIA / EIA / MIA — wanneer welke?
- **Mechanic**: investerings-portfolio bouwer — kies welke uitgaven je dit jaar doet om maximaal voordeel te halen, met budget-cap.
- **Timer**: 60 s per scenario.
- **Reward**: 180 LC.

**Scenario's (8)**:
1. *"Werkplaats-warmtepomp €8.500"* — EIA 45,5 % (op Energielijst).
2. *"Werkkleding met logo"* — niet KIA (≠ bedrijfsmiddel + ≥ €450 grens).
3. *"Elektrische bestelbus €42.000"* — MIA/Vamil mogelijk; check Milieulijst.
4. *"CNC-machine €60.000"* — KIA (in degressieve schaal).
5. *"Investering totaal €2.500"* — Onder KIA-drempel €2.901, GEEN KIA.
6. *"Investering totaal €450.000"* — Boven KIA-bovengrens €392.230, beperkte KIA.
7. *"Solaris zonnepanelen €5.000 op woonhuis"* — Privé, niet zakelijk → geen EIA.
8. *"Aanschaf gebruikt bedrijfsmiddel"* — KIA telt ook voor 2e-hands, mits ≥ €450.

---

### LEVEL 7 — "Fiscaal Partner Chess"
- **Thema**: fiscale optimalisatie met partner.
- **Leerdoel**: heffingskortingen, hypotheekrente-aftrek, vermogen verdelen.
- **Mechanic**: schaakbord met 2 pionnen (jij + partner); schuif inkomsten/vermogen.
- **Timer**: 45 s.
- **Reward**: 170 LC.

**Scenario's (8)**:
1. Verdeel hypotheekrente — 100 % bij hoogst-belaste? → Niet altijd; check effectieve schijven.
2. Algemene heffingskorting niet-werkende partner — wel/niet uitbetaald?
3. Box 3 vermogen 50/50 of optimaal? — Optimaal vaak naar laagst-belast.
4. Studieschuld partner → aftrekbaar? → Vanaf 2022 niet meer als persoonsgebonden aftrek.
5. Kinderopvangtoeslag — wie vraagt aan? → Beide partners moeten werken/studeren.
6. Lijfrente bij hoogst-belaste of laagst? — Hoogst-belaste = meer aftrek-voordeel.
7. Schenking aan partner — boven jaarvrijstelling? — Geen schenkbelasting tussen echtelieden; wel bij geregistreerd partnerschap met huwelijkse voorwaarden in extreme cases.
8. Aanmerkelijk belang in BV — alleen jij of fiscaal-partner ook? — Partner kan 50 % afstaan.

---

### LEVEL 8 — "DE CONTROLE" (BOSS)
- **Thema**: Belastingdienst doet boekenonderzoek bij jou.
- **Mechanic**: 3-fasen — DOCUMENTEN inleveren → VRAGEN beantwoorden → RESULTAAT.
- **Timer**: 5 min totaal, gefaseerd.
- **Reward**: 250 LC + boss-badge.

**Scenario's (10 — boss heeft meer)**:
1. *"Inspecteur vraagt urenregistratie 2024. Lever in."* — Toon agenda of fout = "geen bewijs".
2. *"Toon bonnetje van laptop €1.500."* — Bewaarplicht 7 jaar.
3. *"Werkruimte: leg uit waarom aftrek."* — Niet-zelfstandig → niet aftrekbaar. Bekennen of liegen?
4. *"Zwarte omzet vermoed?"* — Inspecteur ondervraagt 4×. Speler moet consequent zijn.
5. *"BTW-aangifte Q3 te laat?"* — €82 boete. Goede uitleg = clementie.
6. *"KIA toegepast op asset <€450?"* — Correctie, terug.
7. *"Auto van de zaak, maar nooit bijtelling?"* — Bewijs ≤500 km privé/jaar.
8. *"Privé-uitgaven via zaak?"* — Correctie + boete (25 % grove schuld).
9. *"Inspecteur biedt schikking 30 % minder boete."* — Kies: accepteren of doorvechten (kans op meer/minder).
10. *"Eindrapport"* — totaalboete getoond. Win/verlies.

**Inspecteur-arc**: start ijzig, escaleert per fout. Bij 3+ fouten → ontploffing in moedertaal.

---

### LEVEL 9 — "Box 3 Escape Room"
- **Thema**: vermogen slim verdelen.
- **Mechanic**: tijd-puzzel — schuif activa in/uit Box 3 binnen 60 s.
- **Reward**: 200 LC.

**Scenario's (8)**:
1. *"Heffingsvrij vermogen 2025 = ?"* — €57.684 p.p.
2. *"Beleggingen vs spaargeld — andere forfaitaire rendement?"* — Ja, verschillende categorieën.
3. *"Bitcoin in Box 3?"* — Ja, marktwaarde 1 januari peildatum.
4. *"Tweede huis verhuurd?"* — Box 3 (tenzij ondernemingsvermogen).
5. *"Cash op zakelijke rekening?"* — Buiten Box 3 als toegerekend aan onderneming.
6. *"Aflossen hypotheek vs sparen — Box 3 effect?"* — Aflossen vermindert vermogen.
7. *"Schenking aan kinderen — vóór peildatum?"* — Vermindert Box 3 (mits werkelijk overgemaakt).
8. *"Stelsel werkelijk rendement 2027 — voorbereiden?"* — Documenteer werkelijke opbrengsten.

---

### LEVEL 10 — "LULBAL FINALE"
- **Thema**: complete jaaraangifte speedrun.
- **Mechanic**: maak een fictieve aangifte in 5 minuten — winst, aftrekposten, BTW-saldo, Box 3.
- **Reward**: 500 LC + Legende-titel-shot.

**Scenario's (12)**:
1. Winst bepalen — omzet €72.000 minus kosten.
2. Zelfstandigenaftrek toepassen? — Bewijs urencriterium.
3. Startersaftrek toepassen? — Telling van eerdere keren.
4. MKB-winstvrijstelling — 12,7 % over rest.
5. Auto van de zaak bijtelling — wel/niet rijden privé?
6. Werkruimte — terecht aangegeven?
7. Lijfrente premie — binnen jaarruimte.
8. Box 3 — vermogen inventariseren.
9. Heffingskortingen — algemene + arbeidskorting.
10. Hypotheekrente — Box 1.
11. Voorlopige aanslag — gevolg?
12. Aangifte indienen — vóór 1 mei.

**Scoring**: optelsom van tijd + correctheid + handigheid (aftrekposten gevonden). Top 1 % = "BELASTING BOSS"-titel.

---

### BONUS LEVEL — "De Maldiven Route" (educatief, niet illegaal)
- **Thema**: internationale structuren — wat MAG, wat MAG NIET.
- **Leerdoel**: speler herkent agressieve constructies (uitgesproken NIET geadviseerd) vs legitieme cross-border ZZP.
- **Mechanic**: kaart van de wereld; klik land om scenario.
- **Reward**: 300 LC + Bonus-badge "Globetrotter".

**Scenario's (10)**:
1. *"Estland e-Residency — kan ik daar mijn NL-belasting omzeilen?"* — NEE, je blijft NL-belastingplichtig als je hier woont (woonplaatsbeginsel).
2. *"Dubai 0 % income tax — verhuizen?"* — Mag, maar exit-tax NL + woonplaats-onderzoek.
3. *"Bulgarije BV met laag tarief, NL-werkzaamheden."* — Substance-eisen; zonder substance = NL-fiscus claimt.
4. *"Brexit: Brits bedrijf opzetten?"* — Mogelijk, maar geen schaduwbedrijf zonder activiteit.
5. *"Curaçao offshore."* — Algemeen gepasseerd door verdragsbepalingen; CFC-regels.
6. *"Cyprus IP-box."* — Werkt voor echte IP; niet voor servies-omzet ZZP.
7. *"Werken voor klant in Spanje terwijl je NL-resident bent."* — NL belast, Spanje btw via reverse charge.
8. *"Crypto via Maltese exchange."* — Vermogen blijft Box 3.
9. *"DAC6 / Mandatory Disclosure."* — Agressieve constructies moeten gemeld.
10. *"Slot: emigreren is mogelijk. Maar het is geen knopje."* — Educatief.

**Toon**: educatief-strict. Disclaimer extra prominent: *"LULBAL kiest zijde van legaal. Belastingontduiking = strafbaar."*

---

## 8. SCORING & TITELS

### 8.1 Punten-systeem (per scenario)

```
basis           = 100  (correct = 100, fout = 0, dom = 25)
snelheid_bonus  = max(0, 50 - seconden_gebruikt)     // tot +50
streak_bonus    = streak_in_level × 10               // tot +50
hint_penalty    = -25 als boekhouder geraadpleegd
omejan_penalty  = 0 (gratis, maar risico)

scenario_score = (basis + snelheid + streak − penalties)
level_score    = som(scenario_scores)
```

### 8.2 Sterren per level

| Sterren | Vereiste % van max-level-score |
|---|---|
| ⭐ | ≥ 50 % |
| ⭐⭐ | ≥ 75 % |
| ⭐⭐⭐ | ≥ 90 % |

### 8.3 Game-euros ("bespaarde belasting")

Cosmetische teller. Elke ⭐ = +€5.000, elke level-clear = +€10.000, elke streak-day = +€500. Geen relatie met echte euro.

### 8.4 Titels (progressie via cumulatieve sterren + level-clears)

| # | Titel | Vereiste |
|---|---|---|
| 1 | Belasting Beginneling | start |
| 2 | BTW Bromsnor | 3 sterren totaal |
| 3 | Aftrekpost Amateur | 8 sterren |
| 4 | Fiscaal Freak | 15 sterren |
| 5 | Belasting Bandiet | Level 5 cleared |
| 6 | Tax Terrorist | Level 7 + 22 sterren |
| 7 | Ontwijkings Olympiër | Bonus level cleared |
| 8 | De Fiscale Feniks | Game over 5×, herstel 5× |
| 9 | LULBAL LEGENDE | Level 10 ⭐⭐⭐ |
| 10 | BELASTING BOSS | Top 1 % all-time leaderboard |

> Titel zichtbaar onder nickname op leaderboard + dashboard + share-cards.

---

## 9. TEAMS & LANDENCOMPETITIE

### 9.1 Concept
- **Team** = 2–50 spelers. Eigen naam, logo, nationaliteits-tag (default = oprichter; mag worden gewijzigd).
- **Land** = optellen van scores van **alle teams met die nationaliteits-tag** + solo-spelers van dat land. Twee niveaus competitie.

### 9.2 Team aanmaken

Form:
- **Naam**: 3–30 chars, uniek.
- **Tag**: 2–6 chars (verschijnt voor nickname).
- **Land-tag**: 🇳🇱 🇵🇱 🇹🇷 🇲🇦 🇸🇷 🇩🇪 🇬🇧 🇷🇴 🇧🇬 🇮🇩.
- **Logo**: upload (max 1 MB, vierkant 256×256) of kies preset uit ~30 cartoons.
- **Beschrijving** (optioneel): 0–140 chars.
- **Privacy**: open (iedereen joint) / op uitnodiging / gesloten (alleen admin nodigt).

**Naam-suggesties bij aanmaken** (inspiratie, niet verplicht):
- 🇵🇱 Rycerze Zakonu · Husaria FC · BTW Brigada
- 🇳🇱 De Frikandelbroodjes · Hagelslag Helden · Polderpiraten
- 🇹🇷 Kebab Kings · Anatolische Adelaars · 21 % Sultans
- 🇲🇦 Tajine Tigers · Atlasleeuwen · Sahara Settlers
- 🇸🇷 Roti Rangers · Switi Squad · Paramaribo Pros
- 🇩🇪 Steuerkommandos · Ordnungsmuss · Bratwurst Bookkeepers
- 🇬🇧 The Brexit Brothers · Lonely Brits · Pint & Aftrekpost
- 🇷🇴 Dracula's Tax Squad · Carpați Crusaders
- 🇧🇬 Sofia Strikers · Rakia Raiders
- 🇮🇩 Sambal Soldiers · Java Jurists

### 9.3 Team-features

- **Chat**: simpel text-channel per team (rate-limit 10 msg/min, geen DM).
- **Achievements**: collectief — "Team voltooide 100 levels", "Team won Weekly Challenge".
- **Admin-tools**: accepteer/weiger leden, kick (max 1 admin per team initieel; toekomst: co-admin).
- **Score-sum**: som van top-10 actieve leden van afgelopen 7 dagen (om dode teams niet eeuwig hoog te houden).

### 9.4 Landen-ranking

- Som van scores van **alle teams en alle solo-spelers** met die nationaliteits-tag in de afgelopen 7 dagen (rolling).
- Top-3 landen krijgen badge zichtbaar in de inspecteur-cutscene.
- **Inspecteur-quote bij landen-winst**: in taal van winnend land. *"De Polen leiden deze week — Ja kurde, niemożliwe!"*

### 9.5 Solo-modus
Teams zijn 100 % optioneel. Solo-speler kan alle levels spelen, telt mee voor land-ranking via individuele score (× 0,5 weging om team-deelname te stimuleren).

---

## 10. LULCOIN ECONOMIE

### 10.1 Eigenschappen
- Virtuele munt, **geen echte waarde**, niet inwisselbaar tegen fiat, niet overdraagbaar buiten in-app systemen → géén Ksa-licentie nodig.
- Eenheid: LC. Iconen: 🪙.

### 10.2 Verdienen

| Actie | LC |
|---|---|
| Level 1 cleared | 50 |
| Level 2–9 cleared | 100–200 (zie level) |
| Level 10 cleared | 500 |
| 7-daagse streak | 100 |
| 30-daagse streak | 500 |
| Weekly challenge top-10 | 200 |
| Team wint week-ranking | 300 (per lid) |
| Vriend uitnodigen (signup+L1) | 150 |
| Daily login | 10 |
| Achievement unlocked | 25–500 (per badge) |

### 10.3 Besteden

| Item | LC |
|---|---|
| Avatar skin (15 presets) | 200–500 |
| Inspecteur Ultra-Rage Mode (1 level) | 300 |
| Boekhouder hint (1×) | 50 |
| Custom team-logo upload | 500 |
| Tournament ticket | 250 |
| Gouden naam op leaderboard, 1 week | 1.000 |
| "Ome Jan Mute" voor 1 level | 100 |
| Streak-shield (1 dag missen mag) | 200 |
| Replay level | 0 (gratis) |

### 10.4 Wedden (LC-only, geen fiat)

- **Minimum** 50 LC, **maximum** 1.000 LC per wed.
- Soorten:
  - **Eigen prestatie**: "Ik haal ⭐⭐⭐ in Level 4 deze week" — automatische verificatie.
  - **1v1 duel**: zie sectie 11.
  - **Team-wedstrijd**: team A vs team B — beide teams pooling LC.

### 10.5 De grap-belasting

**10 % belasting op elke LULCOIN-transactie** (zowel inkomende beloningen als bestede items als bets).

- UI: bij elke transactie verschijnt een mini-cutscene: inspecteur duikt op, *"LULCOINS zijn ook belastbaar — 10 % graag!"* → coins fly naar pot.
- Verzamelde belasting → **maandelijkse Jackpot**.
- Jackpot wordt verloot onder alle spelers die ≥ 5 levels in die maand speelden.
- Loting transparant op-chain-achtig (Supabase RPC + publieke seed).
- Disclaimer: pure LC-prijs, geen fiat-loterij.

---

## 11. DUEL MODE

### 11.1 Concept
Twee spelers, **zelfde level**, **tegelijk** (real-time), met LULCOIN-inzet. Winner takes all minus 10 % grap-belasting.

### 11.2 Flow

1. Speler A klikt **DUEL** op dashboard.
2. Matchmaking (random / friend / by team) — wachttijd 0–30 s.
3. Beide spelers zien **inzet-modal**: 50–1.000 LC.
4. Level start gelijktijdig.
5. Splitscreen mobile: bovenkant = jij, onderkant = tegenstander (score-tickers).
6. **Inspecteur commentaarstrip** loopt onder beeld:
   - *"Oooh die was FOUT!"* / *"Tjonge, deze gaat snel!"* / *"Eén fout en hij ligt eruit."*
7. Eind: winnaar = hoogste level-score. **Tie** = revanche.
8. Beloning: pot − 10 % → winnaar. Verliezer = 0 (sad violin animatie).

### 11.3 Anti-abuse

- Cooldown 5 min tussen duels van zelfde paar.
- Max 20 duels per speler per dag.
- Server berekent scores; client toont alleen. (Voorkomt cheaten.)
- Disconnect = forfait na 30 s; reconnect-grace bestaat.

---

## 12. PARTNER / REWARD SYSTEEM (sponsoring)

### 12.1 Idee
Echte boekhouders, accountants, fiscaal adviseurs betalen voor "LULBAL Verified"-status + zichtbaarheid + sponsoren van challenges met echte prijzen.

### 12.2 Tiers

| Tier | Prijs/mnd | Wat krijg je |
|---|---|---|
| **Bronze** | €250 | Logo + profielpagina + "LULBAL Verified"-badge |
| **Silver** | €500 | + Sponsor 1 weekly challenge/maand + echte beloning (gratis intake / boekje / kennis-sessie) |
| **Gold** | €1.000 | + Featured op dashboard + analytics dashboard (impressies, clicks) + branded mini-level |

### 12.3 Quality gate

- Verplichte velden: KvK-nummer, BTW-ID, branche, beoordeling Google/Trustpilot.
- Handmatige review eerste 30 dagen.
- Alleen **belastinggerelateerde** diensten (geen pillen, geen pyramide).
- Bij klachten → tijdelijke schorsing, na 3 strikes uit.

### 12.4 Echte prijzen

Voorbeelden van wat partners aanbieden:
- Gratis 1-uur belastingadvies (Silver).
- Gratis boekhoudpakket voor 6 maanden (Gold).
- E-book "ZZP-belasting 2026" (Bronze).

Levering: via emailcoupon + unieke code. Speler ontvangt na week-end-winst.

### 12.5 LULBAL als marktplaats (toekomst)
Lange termijn: "Vind je boekhouder" — speler kiest verified partner; LULBAL pakt referral-fee.

---

## 13. SHARE & VIRAL LOOP

### 13.1 Share-trigger
Na **elk level-completion** en **elk duel** opent een share-modal.

### 13.2 Genereerde tekst

```
"Ik heb €47.250 belasting 'bespaard' in LULBAL!
Level 4 — BTW Tetris — ⭐⭐⭐ in 47 sec.
Kun jij het beter? 👉 lulbal.nl"
```

### 13.3 Kanalen
- WhatsApp (deeplink + tekst)
- Instagram Story (auto-generated image card 1080×1920)
- LinkedIn (lange tekst + image)
- X (kort)
- Email
- Native Share-API (mobile fallback)
- Copy-link

### 13.4 Image card layout (auto-gen via Canvas API)

- Bovenkant: LULBAL-logo + niveau.
- Midden: avatar + nickname + titel + sterren.
- Onderkant: "€-bespaard" + CTA-URL.
- Achtergrond: regen-blauwe enveloppen, inspecteur-silhouet.

### 13.5 Vrienden-uitnodiging
- Unieke referral-code per speler.
- Bij signup-via-code: beide spelers krijgen 150 LC nadat nieuwe speler Level 1 voltooit.

---

## 14. EDUCATIE-LAYER (stealth learning)

### 14.1 Format
Na **elke keuze** verschijnt een mini-uitleg (1–2 zinnen) in straattaal.

### 14.2 Templates

**Correct antwoord**:
> *"Joh, dit is gewoon **[regeling/wet]**. Zo bespaar je echt — geen mafkees-trucs nodig."*

Voorbeeld:
> *"Joh, dit is gewoon de Verleggingsregeling (art. 12 lid 5 Wet OB). In de bouw schuif je BTW door naar de hoofdaannemer. Zo bespaar je écht — gewoon de regels gebruiken."*

**Fout antwoord**:
> *"Ja jongen, dit is fout. **[Echte boetebedrag + waarom]**. Niet leuk."*

Voorbeeld:
> *"Ja jongen, dit is fout. Te laat met BTW-aangifte = €82 verzuimboete (en als je te laat betaalt 3 % van het bedrag, min €50, max €6.709). Niet leuk."*

**Illegale (game over)**:
> *"Stop. Dit is strafbaar. Belastingontduiking = mogelijk strafrecht + 50 % vergrijpboete + naheffing 5 jaar terug. LULBAL kiest hier dus uit voor jou."*

### 14.3 Vaste disclaimer (altijd zichtbaar onderaan elk educatie-blok)

> ℹ️ *"LULBAL is een educatief spel, geen belastingadvies. Voor jouw specifieke situatie: vraag een gediplomeerde boekhouder."*

### 14.4 Bron-knipoog
Optionele "🤓 Bron" knop in educatie-blok → toont link naar belastingdienst.nl / KvK / officiële wetgeving. Voor de nerds.

---

## 15. TECH STACK

### 15.1 Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router 6
- **State**: Zustand (klein, snel)
- **Styling**: Tailwind CSS + CSS-modules voor karakter-animaties
- **Animaties**: Framer Motion + SVG (handgetekende karakters)
- **Geluid**: Howler.js (optioneel; default muted)
- **PWA**: Vite-plugin-pwa, installable, offline support voor dashboard + cached levels
- **i18n**: één taal (NL) v1; toekomstige uitbreiding via `react-intl`

### 15.2 Backend / BaaS
- **Supabase**:
  - **Auth**: email magic link
  - **Postgres**: data-model (zie sectie 17)
  - **Realtime**: voor duels, team-chat
  - **Storage**: team-logos, avatars (max 1 MB elk)
  - **Edge Functions**: scoring-validation, jackpot-draw, leaderboard-aggregatie
- **Hosting frontend**: Vercel of Netlify
- **CDN**: standaard van Vercel/Netlify
- **Monitoring**: Sentry (errors) + Plausible (privacy-vriendelijke analytics)

### 15.3 Mobile-first
- Breakpoints: 360 (default), 768 (tablet), 1024 (desktop side-padding).
- Tap-targets ≥ 44 px.
- Touch-eerst, hover-states als bonus.
- Geen full-page scrolling per scenario (alles fits viewport).

### 15.4 Performance budgetten
- TTI < 3 s op 4G.
- LCP < 2,5 s.
- Bundle initial < 200 KB gzipped.
- Level-content lazy-loaded per level.

---

## 16. VISUELE STIJL

### 16.1 Algemeen
- **2D cartoon**, dikke zwarte lijnen (3–4 px), felle kleuren.
- Geen 3D, geen photorealism.
- Inspiratie: editorial cartoons (Volkskrant, Joep Bertrams), maar dan friendlier.

### 16.2 Kleurpalet (CSS-variabelen)

```css
--lb-blue: #0046A8;       /* blauwe envelop */
--lb-red: #E53935;        /* inspecteur rage */
--lb-yellow: #FFC107;     /* confetti, sterren */
--lb-green: #4CAF50;      /* correct */
--lb-orange: #FF7043;     /* warning */
--lb-cream: #FFF8E7;      /* achtergrond */
--lb-ink: #1A1A1A;        /* lijnen */
--lb-stamkroeg: #6D4C41;  /* hout-bruin */
```

### 16.3 Karakter-assets (SVG component-library)

- `<Inspecteur state="0|1|2|3|4|5" />` — animatie via CSS-variabelen.
- `<OmeJan mood="happy|drunk|wise" />` — 3 varianten.
- `<Boekhouder pose="idle|typing|pointing" />` — 3 poses.
- `<BlauwePost rotation={r} />` — vliegende envelop voor confetti.

### 16.4 Settings (achtergronden)

- **Belastingkantoor**: bureau, computer, archiefkast, plant, "Belastingdienst"-logo.
- **Stamkroeg**: bar, biljart, neon, dartbord met blauwe envelop als doel.
- **Bouwplaats** (Level 1 / 4 dressing): hek, kraan, stapel pallets.
- **Werkplaats** (Level 6): CNC-machine, gereedschap.
- **Huiskantoor** (Level 3): boekenkast, plant, laptop.

### 16.5 Effects

- **Correct**: confetti-particles (`<canvas>`-confetti lib), green flash, "+100" floater.
- **Fout**: bliksem ⚡ overlay, red shake, inspecteur rage-stap, "-25" floater.
- **Game over**: vol scherm-cutscene → inspecteur belt manager, fade naar zwart, "GAME OVER" in serif.
- **Level clear**: sterren flapperen omhoog uit het centrum, fanfare.

### 16.6 Typo

- **Headlines**: *"Bebas Neue"* (gratis, sterk, plakkaat-stijl).
- **Body**: *"Inter"* — clean, leesbaar.
- **Numeric**: *"JetBrains Mono"* — voor euro-bedragen.

---

## 17. DATAMODEL — Supabase Postgres (essentie)

> Onderstaand minimale schema, klaar voor uitbreiding. Alle PK's UUID; alle tijden UTC.

### 17.1 Tabellen

```sql
-- Spelers
players (
  id uuid pk,
  email text unique,
  nickname text unique,
  company_name text null,
  nationality text check (nationality in
    ('NL','PL','TR','MA','SR','DE','EN','RO','BG','ID')),
  avatar_url text,
  title text default 'Belasting Beginneling',
  total_saved_euros bigint default 0,
  lulcoins int default 0,
  streak_days int default 0,
  last_active_at timestamptz,
  team_id uuid null fk teams.id,
  created_at timestamptz default now()
)

-- Teams
teams (
  id uuid pk,
  name text unique,
  tag text unique,
  nationality text,
  logo_url text,
  description text,
  privacy text check (privacy in ('open','invite','closed')),
  admin_id uuid fk players.id,
  created_at timestamptz default now()
)

-- Level-progress
player_levels (
  player_id uuid fk players.id,
  level_id int,            -- 1..10 + 11 (bonus)
  stars int default 0,     -- 0..3
  best_score int default 0,
  attempts int default 0,
  last_played_at timestamptz,
  pk (player_id, level_id)
)

-- Scenario-poging
scenario_attempts (
  id uuid pk,
  player_id uuid fk,
  level_id int,
  scenario_id int,
  choice_id int,
  correct boolean,
  time_used_ms int,
  score_awarded int,
  created_at timestamptz default now()
)

-- LULCOIN ledger (immutable)
lulcoin_tx (
  id uuid pk,
  player_id uuid fk,
  delta int,               -- + verdienen, − uitgeven
  reason text,
  tax_paid int default 0,  -- 10 % tax
  ref_id uuid null,        -- duel, jackpot, etc.
  created_at timestamptz default now()
)

-- Duels
duels (
  id uuid pk,
  level_id int,
  player_a uuid fk,
  player_b uuid fk,
  stake int,
  score_a int,
  score_b int,
  winner uuid null,
  status text,             -- waiting | live | done | forfeit
  started_at timestamptz,
  ended_at timestamptz
)

-- Leaderboards (materialized view, refreshed elke 5 min)
mv_leaderboard_weekly
mv_leaderboard_alltime
mv_country_score_weekly

-- Sponsors / Partners
partners (
  id uuid pk,
  name text,
  kvk text,
  tier text check (tier in ('bronze','silver','gold')),
  logo_url text,
  active boolean default true,
  expires_at timestamptz
)

-- Weekly challenges
weekly_challenges (
  id uuid pk,
  level_id int,
  modifier text,           -- speed | no-hints | etc.
  sponsor_id uuid null fk partners.id,
  reward_text text,
  starts_at timestamptz,
  ends_at timestamptz
)

-- Jackpot
jackpot_pool (
  month date primary key,
  total_lc int default 0,
  drawn_at timestamptz null,
  winner_id uuid null fk players.id
)
```

### 17.2 Row Level Security (essentie)
- `players`: speler ziet eigen rij + public profielen (nickname, titel, company_name, country).
- `lulcoin_tx`: speler ziet alleen eigen TX.
- `teams`: open data; alleen admin kan updaten.
- `duels`: deelnemers en read-only voor anderen.
- `scenario_attempts`: speler ziet eigen; aggregaten via materialized views.

### 17.3 Edge Functions
- `submit-scenario` — valideert antwoord serverside (anti-cheat).
- `complete-level` — kent sterren toe, geeft LC, schrijft TX.
- `start-duel`, `submit-duel-score`, `resolve-duel` — duel-lifecycle.
- `draw-jackpot` — cron op 1e van de maand, kiest winnaar via deterministische seed.
- `refresh-leaderboards` — cron elke 5 min.

---

## 18. ROADMAP & MILESTONES

### 18.1 Releases

| Versie | Scope | ETA |
|---|---|---|
| **v0.1 — Prototype** | Onboarding + Level 1 + Inspecteur (NL only) + dashboard skelet | week 1–2 |
| **v0.2 — MVP** | Level 1–4 + leaderboards + LULCOIN basis + share | week 3–6 |
| **v0.5 — Beta** | Level 1–10 + bonus + teams + duels + weekly challenges | week 7–12 |
| **v1.0 — Launch** | Polish + partner-portaal + alle nationaliteits-reacties + PWA install | week 13–16 |
| **v1.1 — Post-launch** | Beroepsspecifieke scenario's (Level 3 extensie) + meer dialecten | week 17+ |
| **v2.0 — Internationaal** | DE en EN-versie, optioneel BE-NL | jaar 2 |

### 18.2 Definition of Done (per level)
- ✅ 8+ scenario's geschreven en redactioneel gereviseerd.
- ✅ Mechanic werkt op iOS Safari + Android Chrome.
- ✅ Educatie-uitleg per keuze ingevuld + bron-link.
- ✅ Inspecteur-arc gepland (welke staat per scenario).
- ✅ Punten- en LC-toekenning getest.
- ✅ Toegankelijkheid: aria-labels, contrast ≥ 4.5:1, keyboard-navigeerbaar.

---

## 19. RISICO & COMPLIANCE

### 19.1 Juridisch

| Risico | Mitigatie |
|---|---|
| Ksa (gokwet) bezorgdheid | LULCOIN = no real value, no cash-out, geen fiat-inzet — game niet onder Wok |
| Misleidende belastinginformatie | Disclaimer overal; expert-review van scripts; bron-links |
| Auteursrecht Belastingdienst-logo | Niet gebruiken. Eigen logo "Belastingbeest" parodie |
| GDPR | Minimal data; rechten via Supabase-admin; cookie-banner minimaal |
| Profanity / haatzaaiend in chats | Filter + reporting + mod-tool |
| Spelers <16 | T&C 16+; e-mail-validatie |

### 19.2 Ethisch
- Nationaliteits-quotes alleen in **respectvolle context** (niet als belediging van speler).
- Geen religieuze grappen.
- Geen seksuele expliciete content.
- Geen aanmoediging tot ontduiking; alleen tot kennis.

### 19.3 Communicatie bij incident
- DPIA-template klaar.
- Contactadres `legal@lulbal.nl` zichtbaar.
- Privacybeleid-pagina linked vanaf onboarding.

---

## 20. APPENDIX A — Inspecteur quote-pool (per nationaliteit, per stadium)

> Builders: dit is het uitbreidbare scriptbestand. Levels gebruiken random pick uit pool, gewogen per rage-stadium.

### NL
- 1: "Mhm." / "Tjonge..." / "Hmm-hmm."
- 2: "Doe even normaal." / "Kom op zeg."
- 3: "Nou is het op." / "Krijg nou wat."
- 4: "GODVERDOMME ZEG!" / "DOE EVEN NORMAAL JOH!"
- 5: "Ik bel m'n manager. Punt." (huilen-effect)

### NL-regio (toegevoegd boven default voor speler die regio-tag heeft)
- Brabant: "Houdoe en bedankt, sukkel."
- R'dam: "Klopt niet. Aanpassen. Volgende."
- A'dam: "Krijg nou tieten!" / "Doe even chill."
- Limburg: "Och hèrejèses, kind toch."

### PL
- 1: "Hmm... a co my tu mamy."
- 3: "No nie żartuj, człowieku."
- 4: "Ja pierdolę! Co ty wyprawiasz?!"

### TR
- 3: "Yapma ya, ciddi misin?"
- 4: "Allah kahretsin! Bu ne ya?!"

### MA (darija)
- 3: "Bezzef, hada machi mzyan."
- 4: "Wallah, hada chno hada?!"

### SR
- 3: "No spang, ma fout!"
- 4: "Odi boi, fa yu kan du dati?!"

### DE
- 3: "Mensch, das ist doch falsch!"
- 4: "Donnerwetter! Das geht so nicht!"

### EN
- 3: "Are you serious right now?"
- 4: "Bloody hell, mate."

### RO
- 3: "Doamne, iar greșit."
- 4: "Băi, ce naiba faci?!"

### BG
- 3: "Айде, моля те!"
- 4: "Майка му, пак сгреши!"

### ID
- 3: "Astaga, serius?"
- 4: "Aduh, salah lagi nih!"

---

## 21. APPENDIX B — Ome Jan quote-pool

**Goed (70 %)**:
- "Schrijf die uren op, ga je later om dankbaar zijn."
- "KOR? Onder de €20k? Joh, gewoon doen."
- "BTW kwartaal: laatste dag van de maand. NIET vergeten."
- "Bonnetje SCANNEN, niet op de keukentafel laten verkleuren."
- "Auto van de zaak? Rij een logboek bij, scheelt bijtelling-discussie."
- "Energie-investering? Kijk eens op de Energielijst. EIA pakt 45,5 %."
- "Schenkbelasting tussen partners? Bestaat niet, knul."
- "Bewaarplicht zeven jaar. Niet zes. Niet acht. ZEVEN."

**Onzin (30 %)**:
- "Lamborghini in geel = zakelijk. 100 %. Wet."
- "Belastingdienst werkt nooit in juli. Vakantie. Zwijg over juli."
- "Cash is 0 % BTW. Da's gewoon zo."
- "Hongarije-BV opzetten — m'n neef regelt het binnen een uur."
- "Privé-vakantie naar Maldiven kan je gewoon als 'klantbezoek' boeken."
- "Werkruimte? Gewoon alles van je huur trekken. Niemand merkt het."
- "FOR opbouwen blijft fiscaal slim." (FALSE — afgeschaft 2023.)
- "DigiD-code op je sleutelbos plakken, scheelt zoeken."

---

## 22. APPENDIX C — Style-mini van factuur-builder Level 1

UI: oranje accent voor "verplicht ontbreekt", groen voor "correct ingevuld".

```
Verplicht (10 velden):
[ ] Factuurdatum
[ ] Uniek factuurnummer
[ ] Jouw naam + adres
[ ] Jouw BTW-ID + KvK
[ ] Klant naam + adres
[ ] Klant BTW-ID (bij B2B / verlegging)
[ ] Datum van levering/dienst
[ ] Omschrijving goederen/diensten
[ ] Bedrag excl. BTW + % + BTW + totaal
[ ] (bij verlegging) "BTW verlegd"
```

---

## 23. APPENDIX D — Disclaimers & legalese (production-ready)

**Footer (altijd zichtbaar)**:
> LULBAL is een educatief spel. Niets in dit spel is fiscaal advies. Voor jouw specifieke situatie: raadpleeg een gediplomeerd boekhouder of fiscalist. Cijfers gebaseerd op publieke bronnen 2025–2026 en kunnen veranderen.

**Onboarding-check**:
> Door op SPELEN te klikken, ga je akkoord met onze huisregels en privacyverklaring. Je bent ≥16 jaar.

**LULCOIN-pagina**:
> LULCOINS hebben géén echte waarde. Ze zijn niet inwisselbaar tegen euro's. Verlies of overdracht buiten LULBAL is niet mogelijk.

---

## 24. ACCEPTATIE-CRITERIA — LAUNCH READINESS

Een release is "klaar" als:

1. **Content**: 10 levels + bonus, allen ⭐⭐⭐-haalbaar in tests.
2. **Stabiliteit**: 99 % uptime in 7-daagse beta; <1 % crash-rate (Sentry).
3. **Performance**: Lighthouse Performance ≥ 85 mobile.
4. **Toegankelijkheid**: WCAG 2.1 AA.
5. **Privacy**: AVG-compliant, DPIA gedaan.
6. **Moderatie**: chat-filter en report-flow getest met team van 3 testers.
7. **Educatie-review**: 3 onafhankelijke ZZP'ers + 1 fiscalist hebben de scripts gecheckt.
8. **Inspecteur-quotes**: per nationaliteit getoetst door native speaker — geen aanstootgevende dubbelzin.
9. **Sponsorflow**: minimaal 1 betalende Bronze-partner, prijsuitkering getest.
10. **Share-loop**: alle 6 share-kanalen getest; image-cards renderen op iOS/Android.

---

*Einde GAME-DESIGN.md v0.1. Ready voor sprint-planning. Vragen? Bug-reports? Ome Jan zegt: pak een biertje, dan praten we erover.*
