import { getRandomQuestions } from '../data/questions.js';
import { getProgress, saveProgress } from '../engine/storage.js';
import { sfx } from '../engine/audio.js';

export class QuizScene {
  constructor(game) {
    this.game = game;
    this.questions = [];
    this.idx = 0;
    this.correct = 0;
    this.answered = false;
  }

  enter() {
    this.game.showHUD(false);
    this.game.showTouch(false);
    this.questions = getRandomQuestions(5);
    this.idx = 0;
    this.correct = 0;
    this._render();
  }

  leave() { this.game.hideOverlay(); }
  update() {}
  render() {}

  _render() {
    if (this.idx >= this.questions.length) return this._finish();
    const q = this.questions[this.idx];
    this.answered = false;
    const choicesHtml = q.choices.map((c, i) => `<button class="quiz-choice" data-i="${i}">${c.t}</button>`).join('');
    this.game.showOverlay(`
      <div class="panel">
        <span class="tag">${q.cat}</span>
        <span class="tag" style="background:rgba(255,255,255,0.08);color:var(--paper);">Vraag ${this.idx + 1}/${this.questions.length}</span>
        <div class="quiz-q">${q.q}</div>
        <div class="quiz-choices">${choicesHtml}</div>
        <div id="quiz-explain"></div>
        <div class="btns" id="quiz-controls"></div>
      </div>
    `);
    this.game.overlay.querySelectorAll('.quiz-choice').forEach((el) => {
      el.addEventListener('click', (e) => this._answer(parseInt(e.currentTarget.getAttribute('data-i'), 10)));
    });
  }

  _answer(i) {
    if (this.answered) return;
    this.answered = true;
    const q = this.questions[this.idx];
    const buttons = this.game.overlay.querySelectorAll('.quiz-choice');
    let okIdx = -1;
    q.choices.forEach((c, j) => { if (c.ok) okIdx = j; });
    buttons.forEach((btn, j) => {
      btn.disabled = true;
      if (j === okIdx) btn.classList.add('correct');
      else if (j === i) btn.classList.add('wrong');
    });
    const ok = q.choices[i].ok;
    if (ok) { this.correct++; sfx.correct(); } else { sfx.wrong(); }
    const expEl = this.game.overlay.querySelector('#quiz-explain');
    expEl.innerHTML = `<div class="quiz-explain"><b>${ok ? '✅ Correct.' : '❌ Niet helemaal.'}</b><br>${q.why}</div>`;
    const controls = this.game.overlay.querySelector('#quiz-controls');
    const label = this.idx + 1 === this.questions.length ? 'Resultaat zien →' : 'Volgende vraag →';
    controls.innerHTML = `<button class="btn" id="next">${label}</button>`;
    controls.querySelector('#next').addEventListener('click', () => {
      this.idx++;
      this._render();
    });
  }

  _finish() {
    const total = this.questions.length;
    const pct = Math.round((this.correct / total) * 100);
    let verdict = '';
    if (pct === 100) verdict = '🏆 Belasting-Bhagavad. Jij bent de accountant die nooit slaapt.';
    else if (pct >= 80) verdict = '🥇 Expert. De Belastingdienst belt jou voor advies.';
    else if (pct >= 60) verdict = '🥈 Solide. Je overleeft de aangifte zonder paniek.';
    else if (pct >= 40) verdict = '🥉 Niet slecht — maar pas op die blauwe envelop.';
    else verdict = '😬 Tijd voor een boekhouder. Echt.';
    const prog = getProgress();
    prog.quizCorrect += this.correct;
    saveProgress(prog);
    this.game.showOverlay(`
      <div class="panel">
        <h1>📊 Quiz-resultaat</h1>
        <p style="font-size:34px;font-weight:800;color:var(--gold);margin:10px 0 4px;">${this.correct} / ${total}</p>
        <p>${verdict}</p>
        <p class="boast">Totaal goede antwoorden ooit: <b>${prog.quizCorrect}</b></p>
        <div class="btns">
          <button class="btn" id="again">Nog 5 vragen</button>
          <button class="btn secondary" id="menu">Naar menu</button>
        </div>
      </div>
    `);
    this.game.overlay.querySelector('#again').addEventListener('click', () => this.enter());
    this.game.overlay.querySelector('#menu').addEventListener('click', () => this.game.gotoMenu());
  }
}
