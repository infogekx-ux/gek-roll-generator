# TODO — LULBAL Roadmap naar Volledige Release

> Live: **https://lulbal.netlify.app**
>
> MVP-status: **avontuur-based gameplay actief**. Level 1 (Bouwmarkt + Boss + Facturen sorteren) en Level 2 (Brievenbus + Aangifte) zijn volledig interactief op mobile. Geen quiz-format meer.

---

## ✅ WAT WERKT NU (avontuur MVP)

### Onboarding & Dashboard
- [x] 1-scherm onboarding met inspecteur-karikatuur
- [x] Email / nickname / bedrijfsnaam / 10 nationaliteiten / **3 interface-talen** (NL/EN/PL)
- [x] Nationaliteit kiest automatisch de UI-taal (override mogelijk)
- [x] Dashboard met avatar, titel, streak, score, weekly challenge, leaderboard
- [x] Taal-switcher in dashboard-hero (NL/EN/PL)

### Karakters
- [x] **Inspecteur** — SVG met 6 rage-staten (kalm → zucht → boos → rood → ontploft → huilt+belt). Steam, tranen, tanden, telefoon.
- [x] **Inspecteur is altijd aanwezig** in scenes (corner watcher), niet alleen bij fouten
- [x] **Inspecteur reageert in 10 talen** (NL/PL/TR/MA/SR/DE/EN/RO/BG/ID) bij rage-flip
- [x] **Inspecteur wordt boos bij GOEDE keuzes** (omgekeerd!) en blij bij foute (zoals gevraagd)
- [x] **Ome Jan** als random popup tijdens scenes (slidet in van onderaan, 70% goed advies / 30% onzin, 24 quote-pool)

### Level 1 — De Eerste Werkdag
- [x] **Scene 1.1 Bouwmarkt**: tik op 8 items om in karretje te doen (boormachine, schoenen, helm, kabels, laptop = zakelijk; bier, espresso, lunch = privé). Geel "picked"-effect, KvK-prijzen.
- [x] **Scene 1.2 KASSA**: per item kiezen Op de zaak / Privé. Toggle-knoppen.
- [x] **Scene 1.3 BOSS — Inspecteur confronteert**: elk item één voor één, "Verdedig als zakelijk" of "Geef toe: privé". Educatieve uitleg na elke beslissing. Inspecteur SVG groeit, schudt, vloekt in moedertaal.
- [x] **Scene 1.4 Facturen sorteren**: 6 facturen, sleep naar 21% / 9% / 0% / Privé. Touch drag-and-drop via pointer events. 90s timer. Speed-bonus.

### Level 2 — De Blauwe Envelop
- [x] **Scene 2.1 Brievenbus**: 3 sub-fasen — tik brievenbus → envelop valt → letter open → 3 keuzes (Betaal/Bezwaar/Negeer). Negeer = €469 boete-banner. Dramatic animations (mailbox bob, envelope shake).
- [x] **Scene 2.2 Aangifte**: 2 sub-fasen — eerst inkomen slepen naar Box 1/2/3, dan aftrekposten beslissen (toepassen of niet). Inclusief FOR-trap (afgeschaft 2023 — wie het toepast verliest punten).

### Mechanics
- [x] **Point-and-click**: tap items, deuren, envelopes — geen multiple-choice quizzes
- [x] **Drag-and-drop** (touch + mouse via pointer events) — werkt op mobile
- [x] **Timer-systeem** per scene (alleen sort)
- [x] **Inspecteur idle**: corner watcher knippert, schudt bij hoge rage
- [x] **Educatie via gameplay**: na elke beslissing 1-2 zinnen in straattaal, met **echte boetebedragen** en wetsverwijzingen
- [x] Belasting-termen blijven NL met vertaling tussen haakjes (PL: "Ulga dla samozatrudnionych", EN: "Self-employed deduction")
- [x] Scoring per scene → aggregate naar level-totaal, sterren 50/75/90%
- [x] Game-euros + LULCOIN-style boekhouding in localStorage

### Tech & Visueel
- [x] React 18 + Vite, mobile-first 480px max-width
- [x] Pointer-event drag-and-drop (touch + mouse)
- [x] Web Audio synth voor SFX
- [x] OLED-zwart (#000) achtergrond, gele/rode/blauwe accents, dikke 2D-lijnen
- [x] Confetti bij correct, bliksem-flash bij fout, shake bij hoge rage
- [x] Mailbox + envelope SVG-illustraties inline
- [x] Disclaimer altijd zichtbaar: "LULBAL is een educatief spel, geen belastingadvies"
- [x] Deployed op Netlify (lulbal.netlify.app)

---

## 🔧 BUG-RISK / POLISH (eerste week)

- [ ] Drag-and-drop: visuele feedback van drop-zone bij hover (gloed)
- [ ] Inspecteur idle-animaties (voet tikken, op horloge kijken) — alleen rage shake nu
- [ ] Geluiden bij scene-transitions (envelope opening, item picked, drag-drop)
- [ ] AangifteScene: betere visuele scheiding tussen income- en aftrek-fase
- [ ] BouwmarktScene: scroll lock tijdens drag — bij sommige Androids scrollt scherm mee
- [ ] Brievenbus: dramatische muziek-cue bij envelope-fall (free SFX nodig)
- [ ] Score-blips animeren bij scoring (huidige `score-blip` CSS niet meer gebruikt)
- [ ] Volledige Onboarding/Dashboard testen op iOS Safari 14+
- [ ] Native-speaker review van EN/PL interface-strings
- [ ] Nickname-uniciteit (lokaal nu, server later)
- [ ] Profanity-filter op nick + bedrijfsnaam
- [ ] Mute-toggle in HUD (audio.setMuted bestaat al)

---

## 🎮 NIEUWE LEVELS (sprint 2)

### Level 3 — De Auto
- [ ] Rij-mini-game: tik op klanten op de kaart
- [ ] Kilometer-administratie: log per rit zakelijk/privé
- [ ] Inspecteur op achterbank — commenteert je route
- [ ] Bijtelling-decision: auto van zaak of privé?

### Level 4 — BTW Tetris (echte arcade)
- [ ] Facturen vallen van bovenaf, sorteren in 4 buckets vóór bodem
- [ ] Combo-systeem (3 op een rij = bonus)
- [ ] 90s, 30 facturen, life-system

### Level 5 — De Boekhouder is Ziek
- [ ] Ome Jan in extra-foute modus (50/50)
- [ ] Complex scenarios — speler moet zelf inschatten

### Level 6 — Investeringsaftrek Bonanza
- [ ] Portfolio-builder met budget-cap
- [ ] KIA/EIA/MIA categoriseer-mechanic

### Level 7 — Fiscaal Partner Chess
- [ ] Schaakbord-puzzle met 2 pionnen
- [ ] Verdeel hypotheekrente, Box 3, lijfrente

### Level 8 — De Controle (BOSS)
- [ ] 3-fasen audit: documenten → vragen → uitspraak
- [ ] 5 min totaal, inspecteur ondervraagt direct
- [ ] Schikking-keuze: accepteren of doorvechten

### Level 9 — Box 3 Escape Room
- [ ] Vermogen slim verdelen binnen tijdslimiet
- [ ] Heffingsvrij vermogen-puzzle
- [ ] Schenking-mechanic

### Level 10 — LULBAL FINALE
- [ ] Complete jaaraangifte speedrun
- [ ] 5 minuten timer, alle aspecten combineren
- [ ] Top 1% = BELASTING BOSS titel

### Bonus — De Maldiven Route
- [ ] Wereldkaart, klik landen voor internationale structuren
- [ ] Educatief: wat MAG, wat MAG NIET

---

## 🌍 i18n UITBREIDING

- [ ] Volledige TR (Turks) interface
- [ ] Volledige MA (Marokkaans/Frans-fallback) interface
- [ ] Volledige SR (Surinaams) interface
- [ ] Volledige DE (Duits) interface
- [ ] Volledige RO (Roemeens) interface
- [ ] Volledige BG (Bulgaars) interface
- [ ] Volledige ID (Indonesisch) interface
- [ ] Regio-tags voor NL (Amsterdam/Rotterdam/Brabant/Limburg/Twente/Groningen/Friesland)
- [ ] Inspecteur-quote-pool minstens 8 quotes per stadium per nationaliteit
- [ ] Native-speaker review per taal

---

## 🏆 TEAMS & LANDENCOMPETITIE (sprint 3)

- [ ] Teams aanmaken (naam, tag, logo, nationaliteit)
- [ ] Open / invite / closed privacy
- [ ] Team-chat (rate-limited, mod queue)
- [ ] Team-admin: accept/weiger leden, kick
- [ ] Team-achievements
- [ ] Landen-ranking (rolling 7d)
- [ ] Naam-suggesties bij aanmaken
- [ ] Inspecteur reageert in taal van winnend land

---

## 🪙 LULCOIN-ECONOMIE (sprint 3-4)

- [ ] LULCOIN-balance per speler (state al voorbereid)
- [ ] Earn-flow: levels, streaks, challenges, team, referrals, daily login
- [ ] Shop: avatar-skins, ultra-rage-mode, boekhouder-hint (LC), team-logo upload, gouden naam-leaderboard, Ome Jan mute
- [ ] **10% grap-belasting** op elke LC-transactie met inspecteur-cutscene
- [ ] Maandelijkse Jackpot
- [ ] Wedden (50–1000 LC) op duels en eigen prestaties

---

## ⚔️ DUEL MODE (sprint 4)

- [ ] Realtime matchmaking via Supabase
- [ ] Splitscreen mobile-UI
- [ ] Live inspecteur-commentaar onder beeld
- [ ] Serverside anti-cheat score-validatie
- [ ] Cooldown 5 min, max 20/dag

---

## ☁️ BACKEND MIGRATIE — Supabase (sprint 4)

- [ ] Supabase Auth (magic link) — vervangt localStorage-only
- [ ] Postgres schema (zie GAME-DESIGN.md sectie 17)
- [ ] Row Level Security policies
- [ ] Edge Functions: submit-scenario, complete-level, duel-lifecycle, jackpot-draw, leaderboards-refresh
- [ ] Materialized views voor leaderboards
- [ ] Storage bucket voor team-logos
- [ ] Migratie-pad: lokaal → server bij eerste login

---

## 💼 PARTNER / SPONSOR-PORTAAL (sprint 5)

- [ ] Partner-aanmeldformulier (KvK, BTW-ID, Trustpilot)
- [ ] Bronze €250 / Silver €500 / Gold €1000
- [ ] Stripe-abonnementen
- [ ] Partner-dashboard: impressies, clicks, leads
- [ ] "LULBAL Verified" badge
- [ ] Sponsor weekly challenge — koppeling + prize-coupon
- [ ] Manual quality-review eerste 30 dagen

---

## 🎨 ASSETS & POLISH

- [ ] Echte karakter-illustraties (huidige SVG's zijn placeholder-niveau)
- [ ] Scène-achtergronden: bouwmarkt-interior, brievenbus-straat, thuiskantoor, belastingkantoor
- [ ] Echte SFX van Freesound (envelope-open, drag, scribble, fanfare, alarm)
- [ ] PWA service worker + offline support + install-prompt
- [ ] App-icon set (192/512/maskable) + splash screens
- [ ] Custom font-loading (Bebas Neue + Inter)
- [ ] Animatie-polish: idle breathing, blink, mouth-flap voor dialoog
- [ ] Geluiden bij ELKE interactie (huidig: alleen click/correct/wrong)

---

## 📊 ANALYTICS & DATA

- [ ] Plausible / PostHog (privacy-first)
- [ ] Funnel: onboarding → L1.1 → L1.2 → L1.3 → dashboard → L2
- [ ] Drop-off rapport per scene-fase
- [ ] A/B-tests voor copy

---

## 🔒 LEGAL / COMPLIANCE

- [ ] Privacy-pagina + huisregels
- [ ] AVG/GDPR DPIA
- [ ] Ksa-toetsing LULCOIN (no real value — bevestigen met jurist)
- [ ] Belastingdienst-logo NIET gebruiken (eigen parodie)
- [ ] Fiscalist-review van scene-uitleg
- [ ] Native-speaker review nationaliteits-quotes
- [ ] Chat-moderatie (filter + report-flow)

---

## 🐛 BEKENDE BEPERKINGEN MVP

- localStorage-only (geen multi-device sync, geen account-recovery)
- Levels 3–10 + Bonus nog niet speelbaar (UI placeholder)
- 3 interface-talen (NL/EN/PL) — anderen vallen tijdelijk terug op EN
- Inspecteur-vloeken nog niet door native speakers geverifieerd
- Web Audio tonen primitief (8-bit gevoel)
- Drag-and-drop heeft geen visuele drop-zone hover-feedback nog
- Geen multiplayer (duels in sprint 4)
- Geen echte beloning (cosmetisch alleen)

---

## 🧪 HOE TESTEN

```bash
cd app
npm install
npm run dev
# → http://localhost:5173
```

Productie-build:
```bash
npm run build && npm run preview
```

Live: **https://lulbal.netlify.app**

**Smoke-test flow**:
1. Vul onboarding: nationaliteit "Polski", taal PL
2. Bouwmarkt — gooi 6 items in karretje, tag ze in kassa
3. Boss-confrontatie: verdedig boormachine (correct), bier (admit privé)
4. Facturen sorteren: sleep elke factuur naar juiste BTW-bakje
5. Naar dashboard, kies Level 2
6. Brievenbus: kies "Negeer" om de boete-scene te zien
7. Aangifte: sleep winst naar Box 1, spaargeld naar Box 3, BV-aandelen naar Box 2
8. Aftrekposten: FOR opbouwen weigeren (afgeschaft 2023)
9. Submit → confetti, stars, share-button met PL-tekst

---

*"Geen quiz meer. Een avontuur. De inspecteur is altijd in de buurt."*
