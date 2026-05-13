import { Input } from './engine/input.js';
import { unlockAudio, sfx, setMuted, isMuted } from './engine/audio.js';
import { setName, getName } from './engine/storage.js';
import { MenuScene } from './scenes/menu.js';
import { BattleScene } from './scenes/battle.js';
import { QuizScene } from './scenes/quiz.js';
import { LeaderboardScene } from './scenes/leaderboard.js';
import { LawbookScene } from './scenes/lawbook.js';
import { GameOverScene } from './scenes/gameover.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('stage');
    this.ctx = this.canvas.getContext('2d');
    this.W = 0;
    this.H = 0;
    this.dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    this.input = new Input();
    this.input.attachTouch(
      document.getElementById('stick'),
      document.querySelector('#stick .stick-knob'),
      document.getElementById('fire')
    );
    this.hud = document.getElementById('hud');
    this.touch = document.getElementById('touch');
    this.overlay = document.getElementById('overlay');
    this.paused = false;
    this.scene = null;
    this._shakeT = 0;

    this.scenes = {
      menu: new MenuScene(this),
      battle: new BattleScene(this),
      quiz: new QuizScene(this),
      leaderboard: new LeaderboardScene(this),
      lawbook: new LawbookScene(this),
      gameover: new GameOverScene(this)
    };

    window.addEventListener('resize', () => this._resize());
    window.addEventListener('orientationchange', () => setTimeout(() => this._resize(), 200));
    this._resize();

    document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (this.scene === this.scenes.battle) this.togglePause();
      }
    });

    // Try to register service worker (PWA)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }

    // Unlock audio on first interaction anywhere
    const unlock = () => { unlockAudio(); document.removeEventListener('pointerdown', unlock); };
    document.addEventListener('pointerdown', unlock);

    this.gotoMenu();
    this._lastTime = performance.now();
    requestAnimationFrame((t) => this._loop(t));
  }

  _resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.W = w;
    this.H = h;
    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  _loop(t) {
    const now = t;
    let dt = (now - this._lastTime) / 1000;
    this._lastTime = now;
    if (dt > 0.05) dt = 0.05; // clamp big frame skips
    if (this.scene && this.scene.update) this.scene.update(dt, this.input);
    this._render();
    requestAnimationFrame((tt) => this._loop(tt));
  }

  _render() {
    let offX = 0, offY = 0;
    if (this._shakeT > 0) {
      this._shakeT -= 1 / 60;
      const m = this._shakeT * 18;
      offX = (Math.random() - 0.5) * m;
      offY = (Math.random() - 0.5) * m;
    }
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, offX * this.dpr, offY * this.dpr);
    this.ctx.clearRect(-50, -50, this.W + 100, this.H + 100);
    if (this.scene && this.scene.render) this.scene.render(this.ctx);
  }

  shakeStage() { this._shakeT = 0.35; }

  _switch(next) {
    if (this.scene && this.scene.leave) this.scene.leave();
    this.scene = next;
    if (this.scene && this.scene.enter) this.scene.enter();
  }

  gotoMenu() { this._switch(this.scenes.menu); }
  gotoQuiz() { this._switch(this.scenes.quiz); }
  gotoLeaderboard() { this._switch(this.scenes.leaderboard); }
  gotoLawbook() { this._switch(this.scenes.lawbook); }
  gotoBattle() {
    // Fresh battle each time
    this.scenes.battle = new BattleScene(this);
    this.paused = false;
    this._switch(this.scenes.battle);
  }
  gotoGameOver(result) {
    this.scenes.gameover.setResult(result);
    this._switch(this.scenes.gameover);
  }

  showOverlay(html) {
    this.overlay.innerHTML = html;
    this.overlay.classList.add('active');
  }
  hideOverlay() {
    this.overlay.classList.remove('active');
    this.overlay.innerHTML = '';
  }

  showHUD(v) { this.hud.classList.toggle('hidden', !v); }
  showTouch(v) {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.touch.classList.toggle('hidden', !(v && isTouch));
  }

  setHUD({ score, wave, hp, money }) {
    if (score !== undefined) document.getElementById('hud-score').textContent = score;
    if (wave !== undefined) document.getElementById('hud-wave').textContent = wave;
    if (hp !== undefined) document.getElementById('hud-hp').textContent = Math.max(0, hp);
    if (money !== undefined) document.getElementById('hud-money').textContent = money;
  }

  togglePause() {
    if (this.scene !== this.scenes.battle) return;
    this.paused = !this.paused;
    if (this.paused) {
      this.showOverlay(`
        <div class="panel">
          <h1>⏸ Pauze</h1>
          <p>Even ademhalen. De Belastingdienst slaapt nooit, maar wij wel.</p>
          <div class="btns">
            <button class="btn" id="resume">▶ Doorgaan</button>
            <button class="btn secondary" id="quit">Stop & ga naar menu</button>
            <button class="btn ghost" id="mute">${isMuted() ? '🔇 Geluid uit' : '🔊 Geluid aan'}</button>
          </div>
        </div>
      `);
      this.overlay.querySelector('#resume').addEventListener('click', () => { sfx.click(); this.togglePause(); });
      this.overlay.querySelector('#quit').addEventListener('click', () => { sfx.click(); this.paused = false; this.gotoMenu(); });
      this.overlay.querySelector('#mute').addEventListener('click', () => { setMuted(!isMuted()); this.togglePause(); this.togglePause(); });
    } else {
      this.hideOverlay();
    }
  }

  toast(msg) {
    const el = document.createElement('div');
    el.className = 'fact-toast';
    el.textContent = msg;
    document.getElementById('app').appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }
  showFactToast(msg) { this.toast(msg); }

  promptName() {
    const cur = getName();
    const n = prompt('Naam in de ranking (max 18 tekens):', cur || '');
    if (n !== null) { setName(n); this.gotoMenu(); }
  }
}

new Game();
