import { getProgress, getName } from '../engine/storage.js';
import { sfx, unlockAudio, setMuted, isMuted } from '../engine/audio.js';

export class MenuScene {
  constructor(game) {
    this.game = game;
  }

  enter() {
    this.game.showHUD(false);
    this.game.showTouch(false);
    const prog = getProgress();
    const name = getName();
    const muted = isMuted();
    this.game.showOverlay(`
      <div class="panel">
        <h1>💼 ZZP vs Belastingdienst</h1>
        <p style="color:var(--gold);font-weight:700;letter-spacing:0.3px;margin-top:2px;">De Blauwe Wraak</p>
        <p>Jij bent een Nederlandse ZZP'er. Sinds 1915 valt er een blauwe envelop op de mat. Vandaag schiet je terug — met <b>facturen</b>, <b>aftrekposten</b> en pure overlevingsdrang.</p>
        <div style="margin:10px 0 6px;">
          <span class="tag">2D arcade</span>
          <span class="tag">Quiz</span>
          <span class="tag">Wetboek</span>
          <span class="tag">Ranking</span>
        </div>
        <small>Highscore: <b>${prog.highScore}</b> · Goede antwoorden: <b>${prog.quizCorrect}</b></small>
        <div class="btns">
          <button class="btn" data-action="play">▶ Spelen — De Wraak Begint</button>
          <button class="btn secondary" data-action="quiz">🧠 Belastingquiz</button>
          <button class="btn secondary" data-action="lawbook">📚 Wetboek (educatie)</button>
          <button class="btn ghost" data-action="leaderboard">🏆 Ranking</button>
          <button class="btn ghost" data-action="mute">${muted ? '🔇 Geluid uit' : '🔊 Geluid aan'}</button>
        </div>
        <p class="boast">Speltips: gebruik joystick links + 📄-knop rechts. Op desktop: WASD/Pijltjes + Spatie. Schiet in de richting waarin je beweegt. KOR = schild, 💰 = triple-shot, ⚡ = sneller, ❤️ = HP.</p>
        <p class="boast">Naam in ranking: <b>${name || 'Anoniem'}</b> ${name ? `<button class="btn ghost" style="padding:4px 10px;font-size:11px;display:inline-block;margin-left:6px;" data-action="rename">wijzig</button>` : `<button class="btn ghost" style="padding:4px 10px;font-size:11px;display:inline-block;margin-left:6px;" data-action="rename">instellen</button>`}</p>
      </div>
    `);
    this.game.overlay.querySelectorAll('[data-action]').forEach((el) => {
      el.addEventListener('click', (e) => {
        unlockAudio();
        sfx.click();
        const a = e.currentTarget.getAttribute('data-action');
        if (a === 'play') this.game.gotoBattle();
        else if (a === 'quiz') this.game.gotoQuiz();
        else if (a === 'lawbook') this.game.gotoLawbook();
        else if (a === 'leaderboard') this.game.gotoLeaderboard();
        else if (a === 'mute') { setMuted(!isMuted()); this.enter(); }
        else if (a === 'rename') this.game.promptName();
      });
    });
  }

  leave() { this.game.hideOverlay(); }
  update() {}
  render() {}
}
