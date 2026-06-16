/* ============================================================
   GEK-X i18n — NL / EN / PL   (Kodzior, kz0616-dc94)
   Wzorzec: DRS i18n (data-i18n + data-i18n-attr + auto-detect).
   NL = source of truth (1:1 z live). EN = marketing-natuurlijk.
   PL = naturalny, bezpośredni (Dawid sprawdzi).
   ============================================================ */
(function () {
  var GX = (window.GX = window.GX || {});

  var I18N = (GX.I18N = {
    nl: {
      /* ---- NAV / MENU ---- */
      menu_pilaren: `Pilaren`,
      menu_producten: `Producten`,
      menu_beoordelingen: `Beoordelingen`,
      menu_contact: `Contact`,
      menu_over: `Over `,
      menu_volg: `Volg ons`,
      bag_title: `Mr. GEK — Live winkelwagen`,
      menu_aria: `Menu`,
      /* ---- HERO ---- */
      hero_welkom: `WELKOM`,
      zk_trig: `Wat zoek je?`,
      /* ---- INTRO (ig5) ---- */
      ig5_kicker: `Waarom GEK-X`,
      ig5_0: `Jij droomt. Wij bouwen het <span class="ig5-gr">onmogelijke.</span>`,
      ig5_1: `<span class="ig5-dim">Geen bureau.</span> <span class="ig5-gr">Geen wachttijd.</span>`,
      ig5_2: `E&#233;n <span class="ig5-gr">partner</span> voor alles.`,
      ig5_3: `<span class="ig5-dim">Niet morgen.</span> <span class="ig5-gr">Nu.</span>`,
      /* ---- MR GEK ---- */
      mrgek_sub: `Spreekt jouw taal. Vult je wagen.<br>Onthoudt je.`,
      mrgek_small: `'s Werelds eerste AI-assistent met live winkelwagen.<br>Ook voor jouw bedrijf.`,
      /* ---- SAAS ---- */
      saas_flsub: `Slim ondernemen?`,
      saas_0_tag: `Op maat`, saas_0_t: `Webapplicaties`, saas_0_d: `Dashboards, bestelplatforms en tools — precies zoals jij het nodig hebt. Geen standaard oplossingen.`,
      saas_0_f1: `Dashboard`, saas_0_f2: `Bestelplatform`, saas_0_f3: `Koppelingen`, saas_0_f4: `Vanaf €1.500`, saas_0_cta: `Software aanvragen ✦`,
      saas_1_tag: `24/7 bereikbaar`, saas_1_t: `AI Agents`, saas_1_d: `Slimme chatbots die je klanten helpen. Nooit ziek, altijd paraat. Jouw stijl, jouw kennis.`,
      saas_1_f1: `Jouw branding`, saas_1_f2: `Meertalig`, saas_1_f3: `Lerende AI`, saas_1_f4: `Koppeling met je systemen`, saas_1_cta: `Agent aanvragen ✦`,
      saas_2_tag: `iOS & Android`, saas_2_t: `Mobiele apps`, saas_2_d: `Apps voor je klanten of medewerkers. Push-berichten, offline toegang, eigen huisstijl.`,
      saas_2_f1: `Push berichten`, saas_2_f2: `Offline modus`, saas_2_f3: `Eigen huisstijl`, saas_2_f4: `App Store klaar`, saas_2_cta: `App aanvragen ✦`,
      saas_3_tag: `Zero handwerk`, saas_3_t: `Automatisering`, saas_3_d: `Werkflows die vanzelf draaien. Orders, e-mails, voorraadbeheer — zonder handwerk.`,
      saas_3_f1: `Automatische workflows`, saas_3_f2: `E-mail triggers`, saas_3_f3: `Koppelingen`, saas_3_f4: `Schaalbaar`, saas_3_cta: `Automatisering aanvragen ✦`,
      saas_xs_q: `Webapp gebouwd?`, saas_xs_a: `Geef het een website die erbij past.`,
      /* ---- PRINT ---- */
      print_flsub: `Logo op alles?`,
      print_0_tag: `Jouw design`, print_0_d: `T-shirts, polo's, hoodies en werkkleding met jouw design. Voor jezelf, je team of je bedrijf. Bedrukt of geborduurd.`,
      print_0_f1: `DTF bedrukking`, print_0_f2: `Borduurwerk`, print_0_f3: `NFC Smart Kleding`, print_0_f4: `Vanaf 1 stuk`,
      print_1_tag: `Bestel per meter`, print_1_d: `Upload je designs, wij printen ze op de rol. Kies DTF voor textiel of UV-DTF voor stickers en harde materialen.`,
      print_1_f1: `DTF: €23/m`, print_1_f2: `Textiel`, print_1_f3: `UV-DTF: €45/m`, print_1_f4: `Stickers & hard`,
      print_2_tag: `Op maat`, print_2_d: `Breloki, gadgets en prototypen in 3D — met optionele NFC-chip. Jouw logo als sleutelhanger die contactinfo deelt bij aanraking.`,
      print_2_f1: `NFC in 3D-brelok`, print_2_f2: `Jouw logo als vorm`, print_2_f3: `Vanaf 1 stuk`, print_2_f4: `Prototypen & gadgets`, print_2_cta2: `Offerte via `,
      print_3_tag: `Op de koelkast`, print_3_t: `Magnetische Visitekaartjes`, print_3_d: `Niet in de prullenbak, maar op de koelkast. Magnetische visitekaartjes die blijven hangen — letterlijk.`,
      print_3_f1: `Magnetisch`, print_3_f2: `Full-color print`, print_3_f3: `Eigen ontwerp`, print_3_f4: `Op maat gesneden`, print_3_cta1: `Ontwerp zelf`, print_3_cta2: `Laat ontwerpen (+€89) ✦`,
      print_xs_q: `Nieuwe kleding?`, print_xs_a: `Laat het zien in een video.`,
      /* ---- SITE ---- */
      site_flsub: `Online groeien?`,
      site_0_tag: `Op maat gebouwd`, site_0_t: `Websites`, site_0_d: `Snelle, professionele sites met slimme functies die je bij andere bouwers niet vindt. AI, animaties, automatisering — ingebouwd.`,
      site_0_f1: `Responsive`, site_0_f2: `Razendsnel`, site_0_f3: `SEO-proof`, site_0_f4: `Zelf aanpasbaar`, site_0_cta: `Website aanvragen ✦`,
      site_1_tag: `Verkoop online`, site_1_t: `Webshops`, site_1_d: `Niet zomaar een webshop. Slimme shops met AI-ondersteuning, automatische voorraadbeheer en op maat gebouwde bestelflows.`,
      site_1_f1: `Winkelwagen`, site_1_f2: `iDEAL / Mollie`, site_1_f3: `Voorraadbeheer`, site_1_f4: `Op maat`, site_1_cta: `Webshop aanvragen ✦`,
      site_2_tag: `Veilig & privé`, site_2_t: `Portalen`, site_2_d: `Klantportalen met login, dashboard en data. Veilig en volledig op maat gebouwd.`,
      site_2_f1: `Login systeem`, site_2_f2: `Dashboard`, site_2_f3: `Rollen & rechten`, site_2_f4: `Data export`, site_2_cta: `Portaal aanvragen ✦`,
      site_3_tag: `Score 95+`, site_3_t: `SEO & snelheid`, site_3_d: `Razendsnel en goed vindbaar in Google. Sneller dan 90% van het internet.`,
      site_3_f1: `Google score 95+`, site_3_f2: `Supersnel`, site_3_f3: `Vindbaar in Google`, site_3_f4: `Gestructureerde data`, site_3_cta: `SEO aanvragen ✦`,
      site_xs_q: `Website staat?`, site_xs_a: `Optimaliseer de processen erachter.`,
      /* ---- OPTIMA ---- */
      optima_flsub: `Slimmer werken?`,
      optima_0_tag: `Analyse`, optima_0_t: `Procesanalyse`, optima_0_d: `Ik loop mee in je bedrijf, vind knelpunten en los ze op. Concrete resultaten binnen een week.`,
      optima_0_f1: `Meeloopdag`, optima_0_f2: `Knelpunten vinden`, optima_0_f3: `Actieplan`, optima_0_f4: `Binnen 1 week`, optima_0_cta: `Analyse aanvragen ✦`,
      optima_1_tag: `Orde & structuur`, optima_1_t: `Werkplekoptimalisatie`, optima_1_d: `Van chaos naar orde. 5S-methode, kortere looplijnen, ergonomisch en slim ingericht.`,
      optima_1_f1: `Ergonomie`, optima_1_f2: `Looplijnen`, optima_1_f3: `Visueel management`, optima_1_f4: `Foto voor/na`, optima_1_cta: `Werkplek aanvragen ✦`,
      optima_2_tag: `Zero handwerk`, optima_2_t: `Automatisering`, optima_2_d: `Handwerk elimineren. E-mails, triggers, voorraadbeheer — alles automatisch.`,
      optima_2_f1: `Automatische workflows`, optima_2_f2: `Slimme koppelingen`, optima_2_f3: `E-mail triggers`, optima_2_f4: `Meldingen`, optima_2_cta: `Automatisering aanvragen ✦`,
      optima_3_tag: `Meten = weten`, optima_3_t: `Rapportage`, optima_3_d: `Hoe weet je of het werkt? Wij meten voor en na. Concrete cijfers, duidelijke resultaten, geen onderbuikgevoel.`,
      optima_3_f1: `Voor/na meting`, optima_3_f2: `Tijdsbesparing`, optima_3_f3: `Kostenbesparing`, optima_3_f4: `Maandrapportage`, optima_3_cta: `Rapportage aanvragen ✦`,
      optima_xs_q: `Proces verbeterd?`, optima_xs_a: `Bouw er een webapp omheen.`,
      /* ---- CLIP ---- */
      clip_flsub: `In beeld komen?`,
      clip_0_tag: `Nieuwe medewerkers`, clip_0_t: `Virtuele rondleiding`, clip_0_d: `Laat nieuwe medewerkers je bedrijf zien vóór hun eerste werkdag. De route, de werkplek, het team — alsof ze er al zijn.`,
      clip_0_f1: `Rondleiding video`, clip_0_f2: `Nieuwe medewerkers`, clip_0_f3: `Interactief`, clip_0_f4: `Vastgoed geschikt`, clip_0_cta: `Video aanvragen ✦`,
      clip_1_tag: `Luchtbeelden`, clip_1_t: `Drone-opnames`, clip_1_d: `Luchtbeelden van je bedrijf, bouwproject of evenement. Cinematic kwaliteit.`,
      clip_1_f1: `4K video`, clip_1_f2: `Bouwvoortgang`, clip_1_f3: `Evenementen`, clip_1_f4: `A1/A2 gecertificeerd`, clip_1_cta: `Drone aanvragen ✦`,
      clip_2_tag: `In actie`, clip_2_t: `Productievideo`, clip_2_d: `Video's die laten zien hoe het écht werkt. Jouw productieproces, jouw vakmanschap, jouw team in actie.`,
      clip_2_f1: `Productieproces`, clip_2_f2: `Vakmanschap`, clip_2_f3: `Achter de schermen`, clip_2_f4: `Ondertiteld`, clip_2_cta: `Salesvideo aanvragen ✦`,
      clip_3_tag: `Reels & TikTok`, clip_3_t: `Social content`, clip_3_d: `Korte clips die laten zien wat je doet. Jouw werk, jouw proces, jouw dag — echt en herkenbaar.`,
      clip_3_f1: `TikTok`, clip_3_f2: `LinkedIn video`, clip_3_f3: `Vertical 9:16`, clip_3_f4: `Authentiek`, clip_3_cta: `Content aanvragen ✦`,
      /* ---- ABOUT ---- */
      about_over: `Over `,
      about_p1: `Geen vijf afdelingen. <span class="kw">Één organisme</span> — alles verbonden, alles in beweging. Print leidt naar een website, een website onthult de behoefte aan software, software optimaliseert processen en video laat het aan de wereld zien. <span class="kw">Het één drijft het ander aan.</span>`,
      about_p2: `Gebouwd voor ondernemers die wél een <span class="kw">visie</span> hebben, maar niet het budget van een corporate. In Nederland zijn er <span class="kw">1,8 miljoen</span> kleine bedrijven met ideeën die nooit worden gerealiseerd omdat "het te duur is".`,
      about_punch: `Dat veranderen wij.`,
      /* ---- FOOTER ---- */
      ft_print_1: `Kleding`, ft_print_2: `DTF`, ft_print_3: `Rolls`, ft_print_4: `3D & NFC`, ft_print_5: `Magneet`,
      ft_saas_1: `Webapplicaties`, ft_saas_2: `AI Agents`, ft_saas_3: `Mobiele apps`, ft_saas_4: `Automatisering`,
      ft_site_1: `Websites`, ft_site_2: `Webshops`, ft_site_3: `Portalen`, ft_site_4: `SEO`,
      ft_optima_1: `Procesanalyse`, ft_optima_2: `Werkplek`, ft_optima_3: `Automatisering`, ft_optima_4: `QR & NFC`,
      ft_clip_1: `Rondleiding`, ft_clip_2: `Drone`, ft_clip_3: `Productie`, ft_clip_4: `Social`,
      ft_privacy: `Privacybeleid`, ft_terms: `Algemene voorwaarden`,
      /* ---- SEARCH SHEET (zt) ---- */
      zt_ttl: `Wat zoek je?`, zt_sub: `Kies pijler, dienst & je vraag`,
      zt_eye_pijler: `Pijler`, zt_eye_dienst: `Dienst`, zt_eye_zoek: `Ik zoek`,
      zt_hint: `Tik om te kiezen`, zt_go: `Klik aan`, zt_close: `Sluit`,
      zt_print_s0: `Kleding & DTF`, zt_print_0_q0: `Shirt bedrukken`, zt_print_0_q1: `Werkkleding logo`, zt_print_0_q2: `Hoodie nadruk`, zt_print_0_q3: `Polo opdruk`, zt_print_0_q4: `Event shirts`,
      zt_print_s1: `DTF Rolls`, zt_print_1_q0: `Zelf persen`, zt_print_1_q1: `Rol bestellen`, zt_print_1_q2: `Grote oplagen`, zt_print_1_q3: `Gang sheet`,
      zt_print_s2: `3D & NFC`, zt_print_2_q0: `NFC in kleding`, zt_print_2_q1: `3D-textuur`, zt_print_2_q2: `Glow-in-dark`, zt_print_2_q3: `UV-DTF hard`,
      zt_print_s3: `Visitekaartjes`, zt_print_3_q0: `Op koelkast`, zt_print_3_q1: `Premium kaart`, zt_print_3_q2: `Opvallend`, zt_print_3_q3: `Magneet logo`,
      zt_saas_s0: `Webapplicaties`, zt_saas_0_q0: `Interne tool`, zt_saas_0_q1: `Eigen dashboard`, zt_saas_0_q2: `Bestelplatform`, zt_saas_0_q3: `Planning tool`,
      zt_saas_s1: `AI Agents`, zt_saas_1_q0: `Klantenservice`, zt_saas_1_q1: `Offerte-bot`, zt_saas_1_q2: `Slimme chat`, zt_saas_1_q3: `Auto-planning`,
      zt_saas_s2: `Mobiele apps`, zt_saas_2_q0: `iOS & Android`, zt_saas_2_q1: `PWA`, zt_saas_2_q2: `Notificaties`, zt_saas_2_q3: `Offline-first`,
      zt_saas_s3: `Automatisering`, zt_saas_3_q0: `Handmatig weg`, zt_saas_3_q1: `Proces beter`, zt_saas_3_q2: `Efficiënter`, zt_saas_3_q3: `Kosten omlaag`,
      zt_site_s0: `Websites`, zt_site_0_q0: `Nieuwe website`, zt_site_0_q1: `Herontwerp`, zt_site_0_q2: `Snelle site`, zt_site_0_q3: `SEO-proof`,
      zt_site_s1: `Webshops`, zt_site_1_q0: `Online verkopen`, zt_site_1_q1: `Productpagina`, zt_site_1_q2: `Betaalflow`, zt_site_1_q3: `Voorraad`,
      zt_site_s2: `Portalen`, zt_site_2_q0: `Klantportaal`, zt_site_2_q1: `Login-systeem`, zt_site_2_q2: `Extranet`, zt_site_2_q3: `Documenten`,
      zt_site_s3: `SEO & snelheid`, zt_site_3_q0: `Pagina-snelheid`, zt_site_3_q1: `Google-score`, zt_site_3_q2: `Core Web Vitals`, zt_site_3_q3: `Ranking`,
      zt_optima_s0: `Procesanalyse`, zt_optima_0_q0: `Tijd verlies?`, zt_optima_0_q1: `Proces beter`, zt_optima_0_q2: `Efficiënter`, zt_optima_0_q3: `Kosten omlaag`,
      zt_optima_s1: `Werkplek`, zt_optima_1_q0: `Ergonomie`, zt_optima_1_q1: `Inrichting`, zt_optima_1_q2: `Productie-flow`, zt_optima_1_q3: `5S`,
      zt_optima_s2: `Automatisering`, zt_optima_2_q0: `Handmatig weg`, zt_optima_2_q1: `Koppeling`, zt_optima_2_q2: `API`, zt_optima_2_q3: `Data-flow`,
      zt_optima_s3: `Rapportage`, zt_optima_3_q0: `Dashboard`, zt_optima_3_q1: `KPI`, zt_optima_3_q2: `Real-time`, zt_optima_3_q3: `Inzicht`,
      zt_clip_s0: `360° rondleiding`, zt_clip_0_q0: `Showroom`, zt_clip_0_q1: `Fabriek`, zt_clip_0_q2: `Kantoor`, zt_clip_0_q3: `Restaurant`,
      zt_clip_s1: `Drone-opnames`, zt_clip_1_q0: `Terrein`, zt_clip_1_q1: `Bouw`, zt_clip_1_q2: `Event`, zt_clip_1_q3: `Landbouw`,
      zt_clip_s2: `Productievideo`, zt_clip_2_q0: `Promo`, zt_clip_2_q1: `Uitleg`, zt_clip_2_q2: `Training`, zt_clip_2_q3: `Testimonial`,
      zt_clip_s3: `Social content`, zt_clip_3_q0: `Reels`, zt_clip_3_q1: `TikTok`, zt_clip_3_q2: `LinkedIn`, zt_clip_3_q3: `YouTube`,
      /* ---- DYNAMIC SUBS (topbar / mobile / carousel) ---- */
      ss_arch_0: `Creativiteit`, ss_arch_1: `Technologie`, ss_arch_2: `Ervaring`, ss_arch_3: `Resultaat`,
      ss_dream_0: `Dromen`, ss_dream_1: `Bouwen`, ss_dream_2: `Leveren`, ss_dream_3: `Groeien`,
      ss_nob_0: `Geen bureau`, ss_nob_1: `Geen wachttijd`, ss_nob_2: `Geen gedoe`,
      ss_part_0: `Eén team`, ss_part_1: `Alles onder één dak`, ss_part_2: `Persoonlijk`,
      ss_prob_0: `Probleem?`, ss_prob_1: `Analyse`, ss_prob_2: `Oplossing`, ss_prob_3: `Resultaat`,
      ss_nu_0: `Vandaag starten`, ss_nu_1: `Morgen live`, ss_nu_2: `Direct resultaat`,
      ss_mrgek_0: `24/7 online`, ss_mrgek_1: `Meertalig`, ss_mrgek_2: `Live winkelwagen`, ss_mrgek_3: `Jouw stijl`,
      ss_intro_0: `Ontdek onze visie`,
      psub_saas_0: `Webapplicaties`, psub_saas_1: `AI Agents`, psub_saas_2: `Mobiele apps`, psub_saas_3: `Automatisering`,
      psub_print_0: `Kleding`, psub_print_1: `DTF`, psub_print_2: `Rolls`, psub_print_3: `3D & NFC`, psub_print_4: `Magneet`,
      psub_site_0: `Websites`, psub_site_1: `Webshops`, psub_site_2: `Portalen`, psub_site_3: `SEO`,
      psub_optima_0: `Procesanalyse`, psub_optima_1: `Werkplek`, psub_optima_2: `Automatisering`, psub_optima_3: `Rapportage`, psub_optima_qr: `QR & NFC`,
      psub_clip_0: `Rondleiding`, psub_clip_1: `Drone`, psub_clip_2: `Productie`, psub_clip_3: `Social`,
      psub_clipc_0: `Simulator`, psub_clipc_2: `Salesvideo`
    },

    en: {
      menu_pilaren: `Pillars`, menu_producten: `Products`, menu_beoordelingen: `Reviews`, menu_contact: `Contact`, menu_over: `About `, menu_volg: `Follow us`,
      bag_title: `Mr. GEK — Live shopping cart`, menu_aria: `Menu`,
      hero_welkom: `WELCOME`, zk_trig: `What are you looking for?`,
      ig5_kicker: `Why GEK-X`,
      ig5_0: `You dream. We build the <span class="ig5-gr">impossible.</span>`,
      ig5_1: `<span class="ig5-dim">No agency.</span> <span class="ig5-gr">No waiting.</span>`,
      ig5_2: `One <span class="ig5-gr">partner</span> for everything.`,
      ig5_3: `<span class="ig5-dim">Not tomorrow.</span> <span class="ig5-gr">Now.</span>`,
      mrgek_sub: `Speaks your language. Fills your cart.<br>Remembers you.`,
      mrgek_small: `The world's first AI assistant with a live shopping cart.<br>For your business too.`,
      saas_flsub: `Smart business?`,
      saas_0_tag: `Custom-built`, saas_0_t: `Web applications`, saas_0_d: `Dashboards, ordering platforms and tools — exactly how you need them. No off-the-shelf solutions.`,
      saas_0_f1: `Dashboard`, saas_0_f2: `Ordering platform`, saas_0_f3: `Integrations`, saas_0_f4: `From €1,500`, saas_0_cta: `Request software ✦`,
      saas_1_tag: `Available 24/7`, saas_1_t: `AI Agents`, saas_1_d: `Smart chatbots that help your customers. Never sick, always ready. Your style, your knowledge.`,
      saas_1_f1: `Your branding`, saas_1_f2: `Multilingual`, saas_1_f3: `Learning AI`, saas_1_f4: `Connects to your systems`, saas_1_cta: `Request agent ✦`,
      saas_2_tag: `iOS & Android`, saas_2_t: `Mobile apps`, saas_2_d: `Apps for your customers or staff. Push notifications, offline access, your own branding.`,
      saas_2_f1: `Push notifications`, saas_2_f2: `Offline mode`, saas_2_f3: `Own branding`, saas_2_f4: `App Store ready`, saas_2_cta: `Request app ✦`,
      saas_3_tag: `Zero manual work`, saas_3_t: `Automation`, saas_3_d: `Workflows that run themselves. Orders, emails, inventory — without manual work.`,
      saas_3_f1: `Automated workflows`, saas_3_f2: `Email triggers`, saas_3_f3: `Integrations`, saas_3_f4: `Scalable`, saas_3_cta: `Request automation ✦`,
      saas_xs_q: `Web app built?`, saas_xs_a: `Give it a website that matches.`,
      print_flsub: `Logo on everything?`,
      print_0_tag: `Your design`, print_0_d: `T-shirts, polos, hoodies and workwear with your design. For yourself, your team or your company. Printed or embroidered.`,
      print_0_f1: `DTF printing`, print_0_f2: `Embroidery`, print_0_f3: `NFC Smart Clothing`, print_0_f4: `From 1 piece`,
      print_1_tag: `Order by the meter`, print_1_d: `Upload your designs, we print them on the roll. Choose DTF for textile or UV-DTF for stickers and hard materials.`,
      print_1_f1: `DTF: €23/m`, print_1_f2: `Textile`, print_1_f3: `UV-DTF: €45/m`, print_1_f4: `Stickers & hard`,
      print_2_tag: `Custom`, print_2_d: `Keychains, gadgets and prototypes in 3D — with optional NFC chip. Your logo as a keychain that shares contact info on touch.`,
      print_2_f1: `NFC in 3D keychain`, print_2_f2: `Your logo as a shape`, print_2_f3: `From 1 piece`, print_2_f4: `Prototypes & gadgets`, print_2_cta2: `Quote via `,
      print_3_tag: `On the fridge`, print_3_t: `Magnetic business cards`, print_3_d: `Not in the bin, but on the fridge. Magnetic business cards that stick around — literally.`,
      print_3_f1: `Magnetic`, print_3_f2: `Full-color print`, print_3_f3: `Your own design`, print_3_f4: `Cut to size`, print_3_cta1: `Design it yourself`, print_3_cta2: `Have it designed (+€89) ✦`,
      print_xs_q: `New clothing?`, print_xs_a: `Show it off in a video.`,
      site_flsub: `Grow online?`,
      site_0_tag: `Custom-built`, site_0_t: `Websites`, site_0_d: `Fast, professional sites with smart features you won't find at other builders. AI, animations, automation — built in.`,
      site_0_f1: `Responsive`, site_0_f2: `Lightning-fast`, site_0_f3: `SEO-proof`, site_0_f4: `Self-editable`, site_0_cta: `Request website ✦`,
      site_1_tag: `Sell online`, site_1_t: `Online stores`, site_1_d: `Not just a webshop. Smart stores with AI support, automated inventory and custom-built order flows.`,
      site_1_f1: `Shopping cart`, site_1_f2: `iDEAL / Mollie`, site_1_f3: `Inventory management`, site_1_f4: `Custom`, site_1_cta: `Request webshop ✦`,
      site_2_tag: `Secure & private`, site_2_t: `Portals`, site_2_d: `Customer portals with login, dashboard and data. Secure and fully custom-built.`,
      site_2_f1: `Login system`, site_2_f2: `Dashboard`, site_2_f3: `Roles & permissions`, site_2_f4: `Data export`, site_2_cta: `Request portal ✦`,
      site_3_tag: `Score 95+`, site_3_t: `SEO & speed`, site_3_d: `Lightning-fast and easy to find on Google. Faster than 90% of the internet.`,
      site_3_f1: `Google score 95+`, site_3_f2: `Super fast`, site_3_f3: `Found on Google`, site_3_f4: `Structured data`, site_3_cta: `Request SEO ✦`,
      site_xs_q: `Website live?`, site_xs_a: `Optimize the processes behind it.`,
      optima_flsub: `Work smarter?`,
      optima_0_tag: `Analysis`, optima_0_t: `Process analysis`, optima_0_d: `I join you on the floor, find bottlenecks and fix them. Concrete results within a week.`,
      optima_0_f1: `Shadow day`, optima_0_f2: `Find bottlenecks`, optima_0_f3: `Action plan`, optima_0_f4: `Within 1 week`, optima_0_cta: `Request analysis ✦`,
      optima_1_tag: `Order & structure`, optima_1_t: `Workplace optimization`, optima_1_d: `From chaos to order. 5S method, shorter walking routes, ergonomic and smart layout.`,
      optima_1_f1: `Ergonomics`, optima_1_f2: `Walking routes`, optima_1_f3: `Visual management`, optima_1_f4: `Before/after photo`, optima_1_cta: `Request workplace ✦`,
      optima_2_tag: `Zero manual work`, optima_2_t: `Automation`, optima_2_d: `Eliminate manual work. Emails, triggers, inventory — all automatic.`,
      optima_2_f1: `Automated workflows`, optima_2_f2: `Smart integrations`, optima_2_f3: `Email triggers`, optima_2_f4: `Notifications`, optima_2_cta: `Request automation ✦`,
      optima_3_tag: `Measure = know`, optima_3_t: `Reporting`, optima_3_d: `How do you know it works? We measure before and after. Concrete numbers, clear results, no gut feeling.`,
      optima_3_f1: `Before/after measurement`, optima_3_f2: `Time savings`, optima_3_f3: `Cost savings`, optima_3_f4: `Monthly reporting`, optima_3_cta: `Request reporting ✦`,
      optima_xs_q: `Process improved?`, optima_xs_a: `Build a web app around it.`,
      clip_flsub: `Get on screen?`,
      clip_0_tag: `New employees`, clip_0_t: `Virtual tour`, clip_0_d: `Show new employees your company before their first day. The route, the workplace, the team — as if they're already there.`,
      clip_0_f1: `Tour video`, clip_0_f2: `New employees`, clip_0_f3: `Interactive`, clip_0_f4: `Real-estate ready`, clip_0_cta: `Request video ✦`,
      clip_1_tag: `Aerial footage`, clip_1_t: `Drone footage`, clip_1_d: `Aerial footage of your company, construction project or event. Cinematic quality.`,
      clip_1_f1: `4K video`, clip_1_f2: `Construction progress`, clip_1_f3: `Events`, clip_1_f4: `A1/A2 certified`, clip_1_cta: `Request drone ✦`,
      clip_2_tag: `In action`, clip_2_t: `Production video`, clip_2_d: `Videos that show how it really works. Your production process, your craftsmanship, your team in action.`,
      clip_2_f1: `Production process`, clip_2_f2: `Craftsmanship`, clip_2_f3: `Behind the scenes`, clip_2_f4: `Subtitled`, clip_2_cta: `Request sales video ✦`,
      clip_3_tag: `Reels & TikTok`, clip_3_t: `Social content`, clip_3_d: `Short clips that show what you do. Your work, your process, your day — real and relatable.`,
      clip_3_f1: `TikTok`, clip_3_f2: `LinkedIn video`, clip_3_f3: `Vertical 9:16`, clip_3_f4: `Authentic`, clip_3_cta: `Request content ✦`,
      about_over: `About `,
      about_p1: `Not five departments. <span class="kw">One organism</span> — everything connected, everything in motion. Print leads to a website, a website reveals the need for software, software optimizes processes and video shows it to the world. <span class="kw">One drives the other.</span>`,
      about_p2: `Built for entrepreneurs who do have a <span class="kw">vision</span>, but not a corporate budget. In the Netherlands there are <span class="kw">1.8 million</span> small businesses with ideas that never get built because "it's too expensive".`,
      about_punch: `We're changing that.`,
      ft_print_1: `Clothing`, ft_print_2: `DTF`, ft_print_3: `Rolls`, ft_print_4: `3D & NFC`, ft_print_5: `Magnet`,
      ft_saas_1: `Web apps`, ft_saas_2: `AI Agents`, ft_saas_3: `Mobile apps`, ft_saas_4: `Automation`,
      ft_site_1: `Websites`, ft_site_2: `Webshops`, ft_site_3: `Portals`, ft_site_4: `SEO`,
      ft_optima_1: `Process analysis`, ft_optima_2: `Workplace`, ft_optima_3: `Automation`, ft_optima_4: `QR & NFC`,
      ft_clip_1: `Tour`, ft_clip_2: `Drone`, ft_clip_3: `Production`, ft_clip_4: `Social`,
      ft_privacy: `Privacy policy`, ft_terms: `Terms & conditions`,
      zt_ttl: `What are you looking for?`, zt_sub: `Pick pillar, service & your question`,
      zt_eye_pijler: `Pillar`, zt_eye_dienst: `Service`, zt_eye_zoek: `I'm looking for`,
      zt_hint: `Tap to choose`, zt_go: `Go`, zt_close: `Close`,
      zt_print_s0: `Clothing & DTF`, zt_print_0_q0: `Print a shirt`, zt_print_0_q1: `Workwear logo`, zt_print_0_q2: `Hoodie print`, zt_print_0_q3: `Polo print`, zt_print_0_q4: `Event shirts`,
      zt_print_s1: `DTF Rolls`, zt_print_1_q0: `Press it yourself`, zt_print_1_q1: `Order a roll`, zt_print_1_q2: `Large runs`, zt_print_1_q3: `Gang sheet`,
      zt_print_s2: `3D & NFC`, zt_print_2_q0: `NFC in clothing`, zt_print_2_q1: `3D texture`, zt_print_2_q2: `Glow-in-dark`, zt_print_2_q3: `UV-DTF hard`,
      zt_print_s3: `Business cards`, zt_print_3_q0: `On the fridge`, zt_print_3_q1: `Premium card`, zt_print_3_q2: `Eye-catching`, zt_print_3_q3: `Magnet logo`,
      zt_saas_s0: `Web applications`, zt_saas_0_q0: `Internal tool`, zt_saas_0_q1: `Custom dashboard`, zt_saas_0_q2: `Ordering platform`, zt_saas_0_q3: `Planning tool`,
      zt_saas_s1: `AI Agents`, zt_saas_1_q0: `Customer service`, zt_saas_1_q1: `Quote bot`, zt_saas_1_q2: `Smart chat`, zt_saas_1_q3: `Auto-scheduling`,
      zt_saas_s2: `Mobile apps`, zt_saas_2_q0: `iOS & Android`, zt_saas_2_q1: `PWA`, zt_saas_2_q2: `Notifications`, zt_saas_2_q3: `Offline-first`,
      zt_saas_s3: `Automation`, zt_saas_3_q0: `Cut manual work`, zt_saas_3_q1: `Better process`, zt_saas_3_q2: `More efficient`, zt_saas_3_q3: `Lower costs`,
      zt_site_s0: `Websites`, zt_site_0_q0: `New website`, zt_site_0_q1: `Redesign`, zt_site_0_q2: `Fast site`, zt_site_0_q3: `SEO-proof`,
      zt_site_s1: `Online stores`, zt_site_1_q0: `Sell online`, zt_site_1_q1: `Product page`, zt_site_1_q2: `Checkout flow`, zt_site_1_q3: `Inventory`,
      zt_site_s2: `Portals`, zt_site_2_q0: `Customer portal`, zt_site_2_q1: `Login system`, zt_site_2_q2: `Extranet`, zt_site_2_q3: `Documents`,
      zt_site_s3: `SEO & speed`, zt_site_3_q0: `Page speed`, zt_site_3_q1: `Google score`, zt_site_3_q2: `Core Web Vitals`, zt_site_3_q3: `Ranking`,
      zt_optima_s0: `Process analysis`, zt_optima_0_q0: `Losing time?`, zt_optima_0_q1: `Better process`, zt_optima_0_q2: `More efficient`, zt_optima_0_q3: `Lower costs`,
      zt_optima_s1: `Workplace`, zt_optima_1_q0: `Ergonomics`, zt_optima_1_q1: `Layout`, zt_optima_1_q2: `Production flow`, zt_optima_1_q3: `5S`,
      zt_optima_s2: `Automation`, zt_optima_2_q0: `Cut manual work`, zt_optima_2_q1: `Integration`, zt_optima_2_q2: `API`, zt_optima_2_q3: `Data flow`,
      zt_optima_s3: `Reporting`, zt_optima_3_q0: `Dashboard`, zt_optima_3_q1: `KPI`, zt_optima_3_q2: `Real-time`, zt_optima_3_q3: `Insight`,
      zt_clip_s0: `360° tour`, zt_clip_0_q0: `Showroom`, zt_clip_0_q1: `Factory`, zt_clip_0_q2: `Office`, zt_clip_0_q3: `Restaurant`,
      zt_clip_s1: `Drone footage`, zt_clip_1_q0: `Site`, zt_clip_1_q1: `Construction`, zt_clip_1_q2: `Event`, zt_clip_1_q3: `Agriculture`,
      zt_clip_s2: `Production video`, zt_clip_2_q0: `Promo`, zt_clip_2_q1: `Explainer`, zt_clip_2_q2: `Training`, zt_clip_2_q3: `Testimonial`,
      zt_clip_s3: `Social content`, zt_clip_3_q0: `Reels`, zt_clip_3_q1: `TikTok`, zt_clip_3_q2: `LinkedIn`, zt_clip_3_q3: `YouTube`,
      ss_arch_0: `Creativity`, ss_arch_1: `Technology`, ss_arch_2: `Experience`, ss_arch_3: `Result`,
      ss_dream_0: `Dream`, ss_dream_1: `Build`, ss_dream_2: `Deliver`, ss_dream_3: `Grow`,
      ss_nob_0: `No agency`, ss_nob_1: `No waiting`, ss_nob_2: `No hassle`,
      ss_part_0: `One team`, ss_part_1: `All under one roof`, ss_part_2: `Personal`,
      ss_prob_0: `Problem?`, ss_prob_1: `Analysis`, ss_prob_2: `Solution`, ss_prob_3: `Result`,
      ss_nu_0: `Start today`, ss_nu_1: `Live tomorrow`, ss_nu_2: `Instant result`,
      ss_mrgek_0: `24/7 online`, ss_mrgek_1: `Multilingual`, ss_mrgek_2: `Live cart`, ss_mrgek_3: `Your style`,
      ss_intro_0: `Discover our vision`,
      psub_saas_0: `Web apps`, psub_saas_1: `AI Agents`, psub_saas_2: `Mobile apps`, psub_saas_3: `Automation`,
      psub_print_0: `Clothing`, psub_print_1: `DTF`, psub_print_2: `Rolls`, psub_print_3: `3D & NFC`, psub_print_4: `Magnet`,
      psub_site_0: `Websites`, psub_site_1: `Webshops`, psub_site_2: `Portals`, psub_site_3: `SEO`,
      psub_optima_0: `Process analysis`, psub_optima_1: `Workplace`, psub_optima_2: `Automation`, psub_optima_3: `Reporting`, psub_optima_qr: `QR & NFC`,
      psub_clip_0: `Tour`, psub_clip_1: `Drone`, psub_clip_2: `Production`, psub_clip_3: `Social`,
      psub_clipc_0: `Simulator`, psub_clipc_2: `Sales video`
    },

    pl: {
      menu_pilaren: `Filary`, menu_producten: `Produkty`, menu_beoordelingen: `Opinie`, menu_contact: `Kontakt`, menu_over: `O `, menu_volg: `Obserwuj nas`,
      bag_title: `Mr. GEK — Koszyk na żywo`, menu_aria: `Menu`,
      hero_welkom: `WITAJ`, zk_trig: `Czego szukasz?`,
      ig5_kicker: `Dlaczego GEK-X`,
      ig5_0: `Ty marzysz. My budujemy to, co <span class="ig5-gr">niemożliwe.</span>`,
      ig5_1: `<span class="ig5-dim">Żadnej agencji.</span> <span class="ig5-gr">Żadnego czekania.</span>`,
      ig5_2: `Jeden <span class="ig5-gr">partner</span> do wszystkiego.`,
      ig5_3: `<span class="ig5-dim">Nie jutro.</span> <span class="ig5-gr">Teraz.</span>`,
      mrgek_sub: `Mówi w Twoim języku. Pełni koszyk.<br>Pamięta Cię.`,
      mrgek_small: `Pierwszy na świecie asystent AI z koszykiem na żywo.<br>Także dla Twojej firmy.`,
      saas_flsub: `Mądry biznes?`,
      saas_0_tag: `Na miarę`, saas_0_t: `Aplikacje webowe`, saas_0_d: `Dashboardy, platformy zamówień i narzędzia — dokładnie takie, jakich potrzebujesz. Zero gotowców.`,
      saas_0_f1: `Dashboard`, saas_0_f2: `Platforma zamówień`, saas_0_f3: `Integracje`, saas_0_f4: `Od 1500 €`, saas_0_cta: `Zapytaj o software ✦`,
      saas_1_tag: `Dostępne 24/7`, saas_1_t: `Agenci AI`, saas_1_d: `Inteligentne chatboty, które pomagają Twoim klientom. Nigdy chore, zawsze gotowe. Twój styl, Twoja wiedza.`,
      saas_1_f1: `Twój branding`, saas_1_f2: `Wielojęzyczne`, saas_1_f3: `Uczące się AI`, saas_1_f4: `Integracja z Twoimi systemami`, saas_1_cta: `Zapytaj o agenta ✦`,
      saas_2_tag: `iOS & Android`, saas_2_t: `Aplikacje mobilne`, saas_2_d: `Aplikacje dla klientów lub pracowników. Powiadomienia push, dostęp offline, własna identyfikacja.`,
      saas_2_f1: `Powiadomienia push`, saas_2_f2: `Tryb offline`, saas_2_f3: `Własny branding`, saas_2_f4: `Gotowe do App Store`, saas_2_cta: `Zapytaj o aplikację ✦`,
      saas_3_tag: `Zero ręcznej pracy`, saas_3_t: `Automatyzacja`, saas_3_d: `Procesy, które działają same. Zamówienia, e-maile, magazyn — bez ręcznej pracy.`,
      saas_3_f1: `Automatyczne procesy`, saas_3_f2: `Wyzwalacze e-mail`, saas_3_f3: `Integracje`, saas_3_f4: `Skalowalne`, saas_3_cta: `Zapytaj o automatyzację ✦`,
      saas_xs_q: `Masz już webaplikację?`, saas_xs_a: `Daj jej pasującą stronę.`,
      print_flsub: `Logo na wszystkim?`,
      print_0_tag: `Twój projekt`, print_0_d: `T-shirty, polo, bluzy i odzież robocza z Twoim projektem. Dla Ciebie, zespołu lub firmy. Nadruk lub haft.`,
      print_0_f1: `Nadruk DTF`, print_0_f2: `Haft`, print_0_f3: `Odzież NFC Smart`, print_0_f4: `Od 1 sztuki`,
      print_1_tag: `Zamów na metry`, print_1_d: `Wgraj projekty, drukujemy je na rolce. Wybierz DTF do tekstyliów lub UV-DTF do naklejek i twardych materiałów.`,
      print_1_f1: `DTF: €23/m`, print_1_f2: `Tekstylia`, print_1_f3: `UV-DTF: €45/m`, print_1_f4: `Naklejki i twarde`,
      print_2_tag: `Na miarę`, print_2_d: `Breloki, gadżety i prototypy w 3D — z opcjonalnym chipem NFC. Twoje logo jako brelok, który udostępnia kontakt po dotknięciu.`,
      print_2_f1: `NFC w breloku 3D`, print_2_f2: `Twoje logo jako kształt`, print_2_f3: `Od 1 sztuki`, print_2_f4: `Prototypy i gadżety`, print_2_cta2: `Wycena przez `,
      print_3_tag: `Na lodówce`, print_3_t: `Magnetyczne wizytówki`, print_3_d: `Nie do kosza, lecz na lodówkę. Magnetyczne wizytówki, które zostają — dosłownie.`,
      print_3_f1: `Magnetyczne`, print_3_f2: `Druk pełnokolorowy`, print_3_f3: `Własny projekt`, print_3_f4: `Cięte na wymiar`, print_3_cta1: `Zaprojektuj sam`, print_3_cta2: `Zleć projekt (+89 €) ✦`,
      print_xs_q: `Nowa odzież?`, print_xs_a: `Pokaż to w filmie.`,
      site_flsub: `Rośnij online?`,
      site_0_tag: `Budowane na miarę`, site_0_t: `Strony www`, site_0_d: `Szybkie, profesjonalne strony z funkcjami, których nie znajdziesz u innych. AI, animacje, automatyzacja — wbudowane.`,
      site_0_f1: `Responsywne`, site_0_f2: `Błyskawiczne`, site_0_f3: `Gotowe pod SEO`, site_0_f4: `Samodzielna edycja`, site_0_cta: `Zapytaj o stronę ✦`,
      site_1_tag: `Sprzedawaj online`, site_1_t: `Sklepy online`, site_1_d: `Nie byle sklep. Inteligentne sklepy ze wsparciem AI, automatycznym magazynem i procesami zamówień na miarę.`,
      site_1_f1: `Koszyk`, site_1_f2: `iDEAL / Mollie`, site_1_f3: `Zarządzanie magazynem`, site_1_f4: `Na miarę`, site_1_cta: `Zapytaj o sklep ✦`,
      site_2_tag: `Bezpieczne i prywatne`, site_2_t: `Portale`, site_2_d: `Portale klienckie z logowaniem, dashboardem i danymi. Bezpieczne i w pełni na miarę.`,
      site_2_f1: `System logowania`, site_2_f2: `Dashboard`, site_2_f3: `Role i uprawnienia`, site_2_f4: `Eksport danych`, site_2_cta: `Zapytaj o portal ✦`,
      site_3_tag: `Wynik 95+`, site_3_t: `SEO i szybkość`, site_3_d: `Błyskawiczne i łatwe do znalezienia w Google. Szybsze niż 90% internetu.`,
      site_3_f1: `Wynik Google 95+`, site_3_f2: `Superszybkie`, site_3_f3: `Widoczne w Google`, site_3_f4: `Dane strukturalne`, site_3_cta: `Zapytaj o SEO ✦`,
      site_xs_q: `Strona gotowa?`, site_xs_a: `Zoptymalizuj procesy w tle.`,
      optima_flsub: `Pracować mądrzej?`,
      optima_0_tag: `Analiza`, optima_0_t: `Analiza procesów`, optima_0_d: `Wchodzę do Twojej firmy, znajduję wąskie gardła i je usuwam. Konkretne efekty w tydzień.`,
      optima_0_f1: `Dzień obserwacji`, optima_0_f2: `Wykrycie wąskich gardeł`, optima_0_f3: `Plan działania`, optima_0_f4: `W tydzień`, optima_0_cta: `Zapytaj o analizę ✦`,
      optima_1_tag: `Porządek i struktura`, optima_1_t: `Optymalizacja stanowiska`, optima_1_d: `Od chaosu do porządku. Metoda 5S, krótsze ścieżki, ergonomia i mądry układ.`,
      optima_1_f1: `Ergonomia`, optima_1_f2: `Ścieżki ruchu`, optima_1_f3: `Zarządzanie wizualne`, optima_1_f4: `Zdjęcie przed/po`, optima_1_cta: `Zapytaj o stanowisko ✦`,
      optima_2_tag: `Zero ręcznej pracy`, optima_2_t: `Automatyzacja`, optima_2_d: `Eliminacja ręcznej pracy. E-maile, wyzwalacze, magazyn — wszystko automatycznie.`,
      optima_2_f1: `Automatyczne procesy`, optima_2_f2: `Inteligentne integracje`, optima_2_f3: `Wyzwalacze e-mail`, optima_2_f4: `Powiadomienia`, optima_2_cta: `Zapytaj o automatyzację ✦`,
      optima_3_tag: `Mierzyć = wiedzieć`, optima_3_t: `Raportowanie`, optima_3_d: `Skąd wiesz, że działa? Mierzymy przed i po. Konkretne liczby, jasne wyniki, zero przeczuć.`,
      optima_3_f1: `Pomiar przed/po`, optima_3_f2: `Oszczędność czasu`, optima_3_f3: `Oszczędność kosztów`, optima_3_f4: `Raport miesięczny`, optima_3_cta: `Zapytaj o raportowanie ✦`,
      optima_xs_q: `Proces usprawniony?`, optima_xs_a: `Zbuduj wokół niego webaplikację.`,
      clip_flsub: `Pokazać się?`,
      clip_0_tag: `Nowi pracownicy`, clip_0_t: `Wirtualny spacer`, clip_0_d: `Pokaż nowym pracownikom firmę przed pierwszym dniem. Trasa, stanowisko, zespół — jakby już tam byli.`,
      clip_0_f1: `Film-spacer`, clip_0_f2: `Nowi pracownicy`, clip_0_f3: `Interaktywne`, clip_0_f4: `Dla nieruchomości`, clip_0_cta: `Zapytaj o film ✦`,
      clip_1_tag: `Ujęcia z lotu`, clip_1_t: `Nagrania z drona`, clip_1_d: `Ujęcia z lotu Twojej firmy, budowy lub eventu. Jakość kinowa.`,
      clip_1_f1: `Wideo 4K`, clip_1_f2: `Postęp budowy`, clip_1_f3: `Eventy`, clip_1_f4: `Certyfikat A1/A2`, clip_1_cta: `Zapytaj o drona ✦`,
      clip_2_tag: `W akcji`, clip_2_t: `Film produkcyjny`, clip_2_d: `Filmy pokazujące, jak to naprawdę działa. Twój proces, Twój kunszt, Twój zespół w akcji.`,
      clip_2_f1: `Proces produkcji`, clip_2_f2: `Rzemiosło`, clip_2_f3: `Za kulisami`, clip_2_f4: `Z napisami`, clip_2_cta: `Zapytaj o film sprzedażowy ✦`,
      clip_3_tag: `Reels & TikTok`, clip_3_t: `Treści social`, clip_3_d: `Krótkie klipy pokazujące, co robisz. Twoja praca, proces, dzień — prawdziwie i z charakterem.`,
      clip_3_f1: `TikTok`, clip_3_f2: `LinkedIn video`, clip_3_f3: `Vertical 9:16`, clip_3_f4: `Autentyczne`, clip_3_cta: `Zapytaj o treści ✦`,
      about_over: `O `,
      about_p1: `Nie pięć działów. <span class="kw">Jeden organizm</span> — wszystko połączone, wszystko w ruchu. Druk prowadzi do strony, strona ujawnia potrzebę oprogramowania, oprogramowanie usprawnia procesy, a wideo pokazuje to światu. <span class="kw">Jedno napędza drugie.</span>`,
      about_p2: `Dla przedsiębiorców, którzy mają <span class="kw">wizję</span>, ale nie budżet korporacji. W Holandii jest <span class="kw">1,8 miliona</span> małych firm z pomysłami, które nigdy nie powstają, bo „to za drogie".`,
      about_punch: `My to zmieniamy.`,
      ft_print_1: `Odzież`, ft_print_2: `DTF`, ft_print_3: `Rolls`, ft_print_4: `3D & NFC`, ft_print_5: `Magnes`,
      ft_saas_1: `Aplikacje web`, ft_saas_2: `Agenci AI`, ft_saas_3: `Aplikacje mobilne`, ft_saas_4: `Automatyzacja`,
      ft_site_1: `Strony`, ft_site_2: `Sklepy`, ft_site_3: `Portale`, ft_site_4: `SEO`,
      ft_optima_1: `Analiza procesów`, ft_optima_2: `Stanowisko`, ft_optima_3: `Automatyzacja`, ft_optima_4: `QR & NFC`,
      ft_clip_1: `Spacer`, ft_clip_2: `Dron`, ft_clip_3: `Produkcja`, ft_clip_4: `Social`,
      ft_privacy: `Polityka prywatności`, ft_terms: `Regulamin`,
      zt_ttl: `Czego szukasz?`, zt_sub: `Wybierz filar, usługę i pytanie`,
      zt_eye_pijler: `Filar`, zt_eye_dienst: `Usługa`, zt_eye_zoek: `Szukam`,
      zt_hint: `Dotknij, by wybrać`, zt_go: `Przejdź`, zt_close: `Zamknij`,
      zt_print_s0: `Odzież i DTF`, zt_print_0_q0: `Nadruk na koszulkę`, zt_print_0_q1: `Logo na odzież roboczą`, zt_print_0_q2: `Nadruk na bluzę`, zt_print_0_q3: `Nadruk na polo`, zt_print_0_q4: `Koszulki na event`,
      zt_print_s1: `Rolki DTF`, zt_print_1_q0: `Wgrzewam sam`, zt_print_1_q1: `Zamów rolkę`, zt_print_1_q2: `Duże nakłady`, zt_print_1_q3: `Gang sheet`,
      zt_print_s2: `3D & NFC`, zt_print_2_q0: `NFC w odzieży`, zt_print_2_q1: `Tekstura 3D`, zt_print_2_q2: `Glow-in-dark`, zt_print_2_q3: `UV-DTF na twarde`,
      zt_print_s3: `Wizytówki`, zt_print_3_q0: `Na lodówkę`, zt_print_3_q1: `Karta premium`, zt_print_3_q2: `Rzucające się w oczy`, zt_print_3_q3: `Logo na magnesie`,
      zt_saas_s0: `Aplikacje webowe`, zt_saas_0_q0: `Narzędzie wewnętrzne`, zt_saas_0_q1: `Własny dashboard`, zt_saas_0_q2: `Platforma zamówień`, zt_saas_0_q3: `Narzędzie do planowania`,
      zt_saas_s1: `Agenci AI`, zt_saas_1_q0: `Obsługa klienta`, zt_saas_1_q1: `Bot ofertowy`, zt_saas_1_q2: `Inteligentny czat`, zt_saas_1_q3: `Autoplanowanie`,
      zt_saas_s2: `Aplikacje mobilne`, zt_saas_2_q0: `iOS & Android`, zt_saas_2_q1: `PWA`, zt_saas_2_q2: `Powiadomienia`, zt_saas_2_q3: `Offline-first`,
      zt_saas_s3: `Automatyzacja`, zt_saas_3_q0: `Koniec z ręczną pracą`, zt_saas_3_q1: `Lepszy proces`, zt_saas_3_q2: `Wydajniej`, zt_saas_3_q3: `Niższe koszty`,
      zt_site_s0: `Strony www`, zt_site_0_q0: `Nowa strona`, zt_site_0_q1: `Przeprojektowanie`, zt_site_0_q2: `Szybka strona`, zt_site_0_q3: `Gotowe pod SEO`,
      zt_site_s1: `Sklepy online`, zt_site_1_q0: `Sprzedaż online`, zt_site_1_q1: `Strona produktu`, zt_site_1_q2: `Proces płatności`, zt_site_1_q3: `Magazyn`,
      zt_site_s2: `Portale`, zt_site_2_q0: `Portal klienta`, zt_site_2_q1: `System logowania`, zt_site_2_q2: `Extranet`, zt_site_2_q3: `Dokumenty`,
      zt_site_s3: `SEO i szybkość`, zt_site_3_q0: `Szybkość strony`, zt_site_3_q1: `Wynik Google`, zt_site_3_q2: `Core Web Vitals`, zt_site_3_q3: `Ranking`,
      zt_optima_s0: `Analiza procesów`, zt_optima_0_q0: `Tracisz czas?`, zt_optima_0_q1: `Lepszy proces`, zt_optima_0_q2: `Wydajniej`, zt_optima_0_q3: `Niższe koszty`,
      zt_optima_s1: `Stanowisko`, zt_optima_1_q0: `Ergonomia`, zt_optima_1_q1: `Aranżacja`, zt_optima_1_q2: `Przepływ produkcji`, zt_optima_1_q3: `5S`,
      zt_optima_s2: `Automatyzacja`, zt_optima_2_q0: `Koniec z ręczną pracą`, zt_optima_2_q1: `Integracja`, zt_optima_2_q2: `API`, zt_optima_2_q3: `Przepływ danych`,
      zt_optima_s3: `Raportowanie`, zt_optima_3_q0: `Dashboard`, zt_optima_3_q1: `KPI`, zt_optima_3_q2: `Real-time`, zt_optima_3_q3: `Wgląd`,
      zt_clip_s0: `Spacer 360°`, zt_clip_0_q0: `Showroom`, zt_clip_0_q1: `Fabryka`, zt_clip_0_q2: `Biuro`, zt_clip_0_q3: `Restauracja`,
      zt_clip_s1: `Nagrania z drona`, zt_clip_1_q0: `Teren`, zt_clip_1_q1: `Budowa`, zt_clip_1_q2: `Event`, zt_clip_1_q3: `Rolnictwo`,
      zt_clip_s2: `Film produkcyjny`, zt_clip_2_q0: `Promo`, zt_clip_2_q1: `Wyjaśnienie`, zt_clip_2_q2: `Szkolenie`, zt_clip_2_q3: `Testimonial`,
      zt_clip_s3: `Treści social`, zt_clip_3_q0: `Reels`, zt_clip_3_q1: `TikTok`, zt_clip_3_q2: `LinkedIn`, zt_clip_3_q3: `YouTube`,
      ss_arch_0: `Kreatywność`, ss_arch_1: `Technologia`, ss_arch_2: `Doświadczenie`, ss_arch_3: `Efekt`,
      ss_dream_0: `Marzenia`, ss_dream_1: `Budowa`, ss_dream_2: `Dostawa`, ss_dream_3: `Wzrost`,
      ss_nob_0: `Bez agencji`, ss_nob_1: `Bez czekania`, ss_nob_2: `Bez stresu`,
      ss_part_0: `Jeden zespół`, ss_part_1: `Wszystko pod jednym dachem`, ss_part_2: `Osobiście`,
      ss_prob_0: `Problem?`, ss_prob_1: `Analiza`, ss_prob_2: `Rozwiązanie`, ss_prob_3: `Efekt`,
      ss_nu_0: `Start dziś`, ss_nu_1: `Jutro online`, ss_nu_2: `Efekt od razu`,
      ss_mrgek_0: `24/7 online`, ss_mrgek_1: `Wielojęzyczny`, ss_mrgek_2: `Koszyk na żywo`, ss_mrgek_3: `Twój styl`,
      ss_intro_0: `Poznaj naszą wizję`,
      psub_saas_0: `Aplikacje web`, psub_saas_1: `AI Agents`, psub_saas_2: `Apl. mobilne`, psub_saas_3: `Automatyzacja`,
      psub_print_0: `Odzież`, psub_print_1: `DTF`, psub_print_2: `Rolls`, psub_print_3: `3D & NFC`, psub_print_4: `Magnes`,
      psub_site_0: `Strony`, psub_site_1: `Sklepy`, psub_site_2: `Portale`, psub_site_3: `SEO`,
      psub_optima_0: `Analiza procesów`, psub_optima_1: `Stanowisko`, psub_optima_2: `Automatyzacja`, psub_optima_3: `Raporty`, psub_optima_qr: `QR & NFC`,
      psub_clip_0: `Spacer`, psub_clip_1: `Dron`, psub_clip_2: `Produkcja`, psub_clip_3: `Social`,
      psub_clipc_0: `Symulator`, psub_clipc_2: `Film sprzedażowy`
    }
  });

  /* ---- detect: ?lang= > localStorage > navigator > fallback 'en' ---- */
  function detect() {
    try {
      var u = new URLSearchParams(location.search).get('lang');
      if (u) { u = u.toLowerCase(); if (I18N[u]) return u; }
      var s = localStorage.getItem('gekx-lang');
      if (s && I18N[s]) return s;
      var n = (navigator.language || '').slice(0, 2).toLowerCase();
      if (I18N[n]) return n;
    } catch (e) {}
    return 'en';
  }

  GX.lang = detect();

  GX.t = function (key) {
    var d = I18N[GX.lang] || I18N.nl;
    if (d && d[key] != null) return d[key];
    return I18N.nl[key] != null ? I18N.nl[key] : key;
  };

  GX._cbs = [];
  GX.onLang = function (fn) { if (typeof fn === 'function') GX._cbs.push(fn); };

  GX.apply = function () {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) els[i].innerHTML = GX.t(els[i].getAttribute('data-i18n'));
    var ats = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < ats.length; j++) {
      ats[j].getAttribute('data-i18n-attr').split(';').forEach(function (p) {
        var kv = p.split(':');
        if (kv.length === 2) ats[j].setAttribute(kv[0].trim(), GX.t(kv[1].trim()));
      });
    }
  };

  GX.setLang = function (lang) {
    if (!I18N[lang]) return;
    GX.lang = lang;
    try { localStorage.setItem('gekx-lang', lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);
    var ogl = document.querySelector('meta[property="og:locale"]');
    if (ogl) ogl.setAttribute('content', lang === 'nl' ? 'nl_NL' : (lang === 'pl' ? 'pl_PL' : 'en_US'));
    GX.apply();
    var pills = document.querySelectorAll('.i18n-pill');
    for (var i = 0; i < pills.length; i++) pills[i].classList.toggle('i18n-on', pills[i].getAttribute('data-lang') === lang);
    for (var c = 0; c < GX._cbs.length; c++) { try { GX._cbs[c](lang); } catch (e) {} }
  };

  // ustaw <html lang> jak najwcześniej (zanim IIFE wyrenderują treść)
  try { document.documentElement.setAttribute('lang', GX.lang); } catch (e) {}

  function boot() { GX.setLang(GX.lang); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
