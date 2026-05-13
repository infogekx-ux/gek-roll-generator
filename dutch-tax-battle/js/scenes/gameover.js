import { saveScore, getName, setName, getProgress, saveProgress } from '../engine/storage.js';
import { sfx } from '../engine/audio.js';
import { pick } from '../engine/util.js';

const TAUNTS = [
  'De blauwe envelop wint deze ronde. Volgende keer beter.',
  'De Belastingdienst stuurt een naheffing. En een dankkaart.',
  'Je urenregistratie was niet sluitend. Inspecteur lacht subtiel.',
  'Het algoritme heeft je gevonden. Bezwaar maken duurt 24 maanden.',
  'Box 3 huilt in de hoek. Jij ook.',
  'Toeslag terugvorderen? Doe het nu maar gewoon.',
  'Schijnzelfstandig verklaard. Bel je opdrachtgever, maar voorzichtig.',
  'Belastingrente loopt al. Ren!'
];

export class GameOverScene {
  constructor(game) { this.game = game; }
  setResult(r) { this.result = r; }

  enter() {
    this.game.showHUD(false);
    this.game.showTouch(false);
    const r = this.result || { score: 0, wave: 1, money: 0 };
    const name = getName();
    const taunt = pick(TAUNTS);

    // Update progress
    const prog = getProgress();
    if (r.score > prog.highScore) prog.highScore = r.score;
    if (r.wave > prog.wavesCleared) prog.wavesCleared = r.wave - 1;
    saveProgress(prog);

    this.game.showOverlay(`
      <div class="panel shake">
        <h1>💀 Game Over</h1>
        <p style="font-style:italic;opacity:0.85;">${taunt}</p>
        <div style="display:flex;justify-content:space-around;margin:14px 0;text-align:center;">
          <div><small style="opacity:0.7;">Score</small><div style="font-size:24px;font-weight:800;color:var(--gold);">${r.score}</div></div>
          <div><small style="opacity:0.7;">Golf</small><div style="font-size:24px;font-weight:800;color:var(--orange);">${r.wave}</div></div>
          <div><small style="opacity:0.7;">€ Buit</small><div style="font-size:24px;font-weight:800;color:var(--green);">${r.money}</div></div>
        </div>
        ${prog.highScore === r.score && r.score > 0 ? '<p style="color:var(--gold);font-weight:700;text-align:center;">🏆 Nieuwe persoonlijke highscore!</p>' : ''}
        <p>Voer je naam in voor de ranking:</p>
        <input type="text" id="name" class="txt" maxlength="18" placeholder="Bijv. Jan ZZP" value="${escapeAttr(name)}" />
        <div class="btns">
          <button class="btn" id="save">Score opslaan & opnieuw</button>
          <button class="btn secondary" id="menu">Naar menu</button>
        </div>
      </div>
    `);
    const nameInput = this.game.overlay.querySelector('#name');
    nameInput.focus();
    this.game.overlay.querySelector('#save').addEventListener('click', () => {
      const n = (nameInput.value || 'Anoniem').trim().slice(0, 18) || 'Anoniem';
      setName(n);
      sfx.click();
      const entry = { name: n, score: r.score, wave: r.wave, money: r.money, ts: Date.now() };
      const rank = saveScore(entry);
      if (rank >= 0 && rank < 10) this.game.toast(`🏆 Top ${rank + 1} op de ranking!`);
      this.game.gotoBattle();
    });
    this.game.overlay.querySelector('#menu').addEventListener('click', () => {
      const n = (nameInput.value || 'Anoniem').trim().slice(0, 18) || 'Anoniem';
      setName(n);
      const entry = { name: n, score: r.score, wave: r.wave, money: r.money, ts: Date.now() };
      saveScore(entry);
      sfx.click();
      this.game.gotoMenu();
    });
  }

  leave() { this.game.hideOverlay(); }
  update() {}
  render() {}
}

function escapeAttr(s) {
  return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
