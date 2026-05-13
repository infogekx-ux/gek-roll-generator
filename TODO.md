# TODO — LULBAL Roadmap naar Volledige Release

> Wat de MVP **wel** doet en wat er nog moet voordat we publiek gaan.
>
> MVP-status: ✅ werkende game met Level 1 + 2 (elk 8 scenario's), Inspecteur in 5 talen, Ome Jan helper, lokaal leaderboard, scoring/sterren/streak, share-knop, OLED-dark mobile-first UI.

---

## ✅ WAT WERKT NU (MVP)

- [x] Vite + React 18 app in `app/` (mobile-first, max-width 480px)
- [x] Onboarding-scherm met inspecteur-karikatuur en formulier (email, nick, bedrijf, nationaliteit)
- [x] Direct na registratie → Level 1 (geen tutorial)
- [x] **Level 1: De Eerste Factuur** — 8 scenario's (BTW basics, factuureisen, verleggingsregeling, EU-klant, cash/zwart, kunstenaars-tarief, BTW-deadline, oninbare vordering)
- [x] **Level 2: De Blauwe Envelop** — 8 scenario's (Box 1 schijven, zelfstandigenaftrek 2025 €2.470, startersaftrek €2.123, MKB-vrijstelling 12,7%, Box 3, IB-deadline 1 mei, verzuimboete €469)
- [x] Inspecteur SVG met **6 rage-stadia** (kalm → zucht → boos → rood → ontploft → huilt + belt manager) — stoom uit oren, tranen, telefoon, tanden
- [x] Inspecteur scheld-quotes per nationaliteit: 🇳🇱 NL (+regio's later) · 🇵🇱 PL · 🇹🇷 TR · 🇸🇷 SR · 🇬🇧 EN · 🇩🇪 DE · 🇲🇦 MA · 🇷🇴 RO · 🇧🇬 BG · 🇮🇩 ID — meer dan 10 unieke regels per land verdeeld over 5 stadia
- [x] Ome Jan helper: 70% goed advies / 30% complete onzin, eigen quote-pool van 24 lines
- [x] Boekhouder helper (gratis in MVP — toont juiste antwoord)
- [x] Scoring: 100 basis + snelheidsbonus (0–50) + streak-bonus (0–50)
- [x] Sterren: 1⭐ ≥50%, 2⭐ ≥75%, 3⭐ ≥90%
- [x] Titel-systeem: 10 titels (Belasting Beginneling → Belasting Boss)
- [x] Streak-systeem (dagelijks)
- [x] Lokaal leaderboard (localStorage) — top 50, gefilterd op top 10 zichtbaar
- [x] Game-over scherm bij illegale keuze met restart-knop
- [x] Confetti bij correct, bliksem-flash bij fout, shake-animatie bij rage 4+
- [x] Web Audio API geluidseffecten (correct/wrong/illegal/click/levelUp/rage) — geen externe assets
- [x] "Deel je score" met native share-sheet + WhatsApp link + copy-to-clipboard + zichtbare preview-tekst
- [x] Educatieve uitleg na elke keuze in straattaal ("Joh, ..." / "Kassa!" / "GAME OVER")
- [x] Disclaimer zichtbaar op elk scherm: "LULBAL is een educatief spel, geen belastingadvies"
- [x] Volledig in het Nederlands (inspecteur-vloeken in moedertaal speler)
- [x] OLED-zwart achtergrond (#000), gele/rode/blauwe accents, dikke 2D-lijnen
- [x] PWA-ready meta tags (icoon embedded SVG)
- [x] LocalStorage persist (geen backend nodig)

---

## 🔧 BUG-RISK / POLISH (eerste week na MVP)

- [ ] Inspecteur na correct-antwoord: rage echt zien dalen (animatie kleur-fade i.p.v. abrupte switch)
- [ ] Onboarding: nickname-uniciteit check (lokaal nu, server later)
- [ ] Onboarding: profanity-filter op nick + bedrijfsnaam
- [ ] Toetsenbord-navigatie: keyboard-shortcuts voor A/B/C/D-keuzes
- [ ] Aria-labels op alle SVG-karakters voor screenreader
- [ ] Loading-skeleton bij eerste boot (nu flikkert "LULBAL" splash kort)
- [ ] Mute-toggle ergens in UI (audio-util heeft wel `setMuted`, geen knop nog)
- [ ] Timer-tick geluid (zachte tikkende klok bij <5s)
- [ ] Score-blip beter positioneren (nu absoluut, soms buiten viewport bij kleine schermen)

---

## 🎮 GAMEPLAY-UITBREIDING (sprint 2)

### Levels 3–10 + Bonus
Alles staat in `GAME-DESIGN.md`. Per level minimaal 8 scenario's schrijven. Per level:
- [ ] **Level 3 — Aftrekpost Jager**: kosten-checklist, tag-mechanic
- [ ] **Level 4 — BTW Tetris**: arcade sorter, vallende facturen, 90s timer
- [ ] **Level 5 — De Boekhouder is Ziek**: Ome Jan extra-foute modus (50/50)
- [ ] **Level 6 — Investeringsaftrek Bonanza**: KIA/EIA/MIA portfolio-builder
- [ ] **Level 7 — Fiscaal Partner Chess**: schaakbord met 2 pionnen, optimalisatie
- [ ] **Level 8 — De Controle (BOSS)**: 3-fasen audit, 5 min totaal, 10 scenario's
- [ ] **Level 9 — Box 3 Escape Room**: tijd-puzzel vermogen verdelen
- [ ] **Level 10 — LULBAL FINALE**: jaaraangifte speedrun, 12 scenario's
- [ ] **Bonus — De Maldiven Route**: 10 scenario's, internationale structuren

### Mechanics
- [ ] Drag-and-drop voor BTW Tetris (Level 4)
- [ ] Multi-step boss-fight (Level 8) met document-inlevering
- [ ] Portfolio-builder UI met budget-cap (Level 6)
- [ ] Schaakbord-shuffle (Level 7)

### Beroep-specifieke scenario's
- [ ] Profielinstelling: kies primair beroep (bouw / IT / zorg / horeca / creatief / transport / techniek / persoonlijke diensten)
- [ ] Level 3 gebruikt beroep om scenario-pool te filteren
- [ ] Pool van ~10 scenario's per sector (zie `RESEARCH.md` B-sectie voor stof)

---

## 🌍 NATIONALITEITEN & REGIONALE DIALECTEN

- [ ] Voeg **regio-tag** toe aan NL-spelers (Amsterdam / Rotterdam / Den Haag / Brabant / Limburg / Twente / Groningen / Friesland)
- [ ] Inspecteur-quote-pool per regio (Brabant "houdoe sukkel", Rotterdam "klopt niet, volgende", enz.)
- [ ] Inspecteur-quote-pool uitbreiden: minimaal 8 quotes per stadium per nationaliteit
- [ ] Native-speaker review per nationaliteit voordat productie (geen onbedoelde beledigingen)

---

## 🏆 TEAMS & LANDENCOMPETITIE (sprint 3)

- [ ] Teams aanmaken: naam, tag, logo upload, nationaliteits-tag
- [ ] Open / invite / closed privacy modus
- [ ] Team-chat (rate-limited, moderation queue)
- [ ] Team-admin kan accepteren/weigeren
- [ ] Achievements collectief ("Team voltooide 100 levels")
- [ ] Team-leaderboard
- [ ] Landen-ranking (som top-10 actieve leden per land)
- [ ] Inspecteur reageert in taal van **winnend land** in landen-ranking-cutscene
- [ ] Naam-suggesties bij aanmaken (Rycerze Zakonu, De Frikandelbroodjes, Kebab Kings, etc.)

---

## 🪙 LULCOIN-ECONOMIE (sprint 3-4)

- [ ] LULCOIN-balance per speler
- [ ] Verdienen-flow: level (50–200), streaks (100/500), challenges (200), team-wint (300), referral (150), daily login (10)
- [ ] Besteden-shop: avatar skins (200–500), ultra-rage mode (300), boekhouder hint (50), team-logo upload (500), gouden naam (1000), Ome Jan mute (100), streak-shield (200)
- [ ] **10% grap-belasting** op elke transactie met inspecteur-cutscene
- [ ] Maandelijkse Jackpot-pot van die 10%
- [ ] Jackpot-draw: deterministische seed (1e van de maand)
- [ ] Wedden: 1v1 + team-wedstrijd, min 50 / max 1.000 LC

---

## ⚔️ DUEL MODE (sprint 4)

- [ ] Matchmaking (random / friend / by team)
- [ ] Realtime score-sync via Supabase Realtime
- [ ] Splitscreen mobile UI
- [ ] Inspecteur live-commentaar onder beeld
- [ ] Anti-cheat: serverside score-validatie (Edge Function)
- [ ] Forfeit-handling bij disconnect (30s grace)
- [ ] Cooldowns (5 min tussen zelfde paar, 20/dag totaal)

---

## ☁️ BACKEND MIGRATIE — Supabase (sprint 4)

- [ ] Supabase project setup
- [ ] Auth via magic link (vervanging van localStorage-only)
- [ ] Postgres schema implementeren (zie GAME-DESIGN.md sectie 17)
- [ ] Row Level Security policies
- [ ] Edge Functions:
  - [ ] `submit-scenario` (anti-cheat scoring)
  - [ ] `complete-level` (sterren + LC + TX)
  - [ ] `start-duel` / `submit-duel-score` / `resolve-duel`
  - [ ] `draw-jackpot` (cron 1e v.d. maand)
  - [ ] `refresh-leaderboards` (cron elke 5 min)
- [ ] Materialized views voor leaderboards (weekly / alltime / country)
- [ ] Storage bucket voor team-logos en avatars (1 MB limit)
- [ ] Migratie-pad: lokale data → server bij eerste login

---

## 💼 PARTNER / SPONSOR-PORTAAL (sprint 5)

- [ ] Partner-aanmeldformulier (KvK-check, BTW-ID, Trustpilot)
- [ ] Tiers: Bronze €250 / Silver €500 / Gold €1000
- [ ] Stripe-integratie voor abonnementen
- [ ] Partner-dashboard: impressies, clicks, leads
- [ ] "LULBAL Verified" badge weergave
- [ ] Sponsor weekly challenge — koppelen aan level + prijs-uitkering
- [ ] Prize-coupon mechanisme (e-mail + unieke code)
- [ ] Manual quality-review eerste 30 dagen

---

## 🎨 ASSETS & POLISH

- [ ] Echte karakter-illustraties (huidige SVG's zijn placeholder-stijl, kunnen mooier)
- [ ] Achtergrondscènes per level: kantoor, stamkroeg, bouwplaats, werkplaats, huiskantoor
- [ ] Echte geluiden i.p.v. WebAudio-tonen (free SFX van Freesound / Pixabay)
- [ ] Stem-acting (optie 2026): inspecteur-voiceover bij ontploffing
- [ ] Custom font-loading (Bebas Neue + Inter via Google Fonts)
- [ ] PWA: service worker, offline support, "Voeg toe aan beginscherm"-prompt
- [ ] App-icon set (192, 512, maskable)
- [ ] Splash screens iOS / Android
- [ ] Animatie-polish: micro-bewegingen (idle breathing, blink)

---

## 📊 ANALYTICS & DATA

- [ ] Plausible / PostHog integratie (privacy-vriendelijk)
- [ ] Funnel tracking: onboarding → L1 → L2 → dashboard → L3
- [ ] Drop-off rapporten per scenario (welke vragen breken spelers)
- [ ] A/B-test framework voor copy-variaties

---

## 🔒 LEGAL / COMPLIANCE

- [ ] Privacybeleid-pagina (`/privacy`)
- [ ] Huisregels-pagina (`/huisregels`)
- [ ] Cookie-banner (minimaal, geen tracking-cookies in MVP)
- [ ] DPIA-document (GDPR)
- [ ] Ksa-toetsing van LULCOIN-economie (no real value, geen licentie nodig — bevestigen met jurist)
- [ ] T&C bevestiging dat spel ≥16 jaar is
- [ ] Fiscalist-review van scenario-uitleg (3 onafhankelijke ZZP'ers + 1 fiscalist)
- [ ] Belastingdienst-logo NIET gebruiken; eigen parodie-logo "Belastingbeest"
- [ ] Native-speaker review van nationaliteits-quotes (geen ongewilde beledigingen)
- [ ] Chat-moderatie (filter + report-flow + ban-tools)

---

## 🚀 LAUNCH-CHECKLIST

- [ ] Domein lulbal.nl registreren + DNS
- [ ] Hosting (Vercel / Netlify) productie-deploy
- [ ] Supabase production-instance
- [ ] Sentry voor error monitoring
- [ ] Lighthouse Performance ≥ 85 mobile
- [ ] WCAG 2.1 AA toegankelijkheid
- [ ] Email-deliverability via Resend / SendGrid
- [ ] Eerste 3 betalende Bronze-partners
- [ ] Persbericht naar ZZP-pers (FD ZZP, Het Financieele Dagblad ZZP-katern, ZZP Nederland)
- [ ] Influencer-seeding (Reddit r/zzp, LinkedIn-NL, TikTok #zzp)

---

## 🐛 BEKENDE BEPERKINGEN MVP

- Geen account-recovery (puur localStorage — leeg het en alles weg)
- Leaderboard is alleen lokaal (eigen device)
- Geen multi-device sync
- Geen multiplayer (duel mode komt in sprint 4)
- Geen echte beloning (cosmetisch alleen)
- Levels 3–10 + Bonus zijn nog niet speelbaar
- Geen regio-keuze in Onboarding (alleen nationaliteit)
- Inspecteur-vloeken zijn nog niet door native speakers geverifieerd
- Web Audio tonen zijn primitief (8-bit gevoel)

---

## 🧪 HOE DE MVP TESTEN

```bash
cd app
npm install
npm run dev
# → open http://localhost:5173 op desktop OF op je telefoon (zelfde netwerk + IP)

# Productie-build verifiëren:
npm run build
npm run preview
```

**Test-scenario**:
1. Vul onboarding in met nationaliteit "Pools".
2. Speel Level 1 — kies expres "Cash zonder factuur" → zie GAME OVER met PL-rage.
3. Restart → speel correct → ⭐⭐⭐ → deel score via WhatsApp.
4. Terug naar dashboard → kies Level 2 → herhaal.
5. Sluit browser → open opnieuw → state moet bewaard zijn (localStorage).

---

*"Belasting is geen straf. Het is een spel. En jij speelt mee. Welkom bij LULBAL."*
