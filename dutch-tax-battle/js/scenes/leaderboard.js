import { loadLeaderboard, clearLeaderboard, getName } from '../engine/storage.js';
import { sfx } from '../engine/audio.js';

export class LeaderboardScene {
  constructor(game) {
    this.game = game;
  }

  enter() {
    this.game.showHUD(false);
    this.game.showTouch(false);
    this._render();
  }

  leave() { this.game.hideOverlay(); }
  update() {}
  render() {}

  _render() {
    const lb = loadLeaderboard();
    const myName = getName();
    const rowsHtml = lb.length
      ? lb.slice(0, 20).map((e, i) => `
        <div class="score-row ${e.name === myName ? 'me' : ''}">
          <span class="rank">#${i + 1}</span>
          <span class="name">${escapeHtml(e.name || 'Anoniem')}</span>
          <span class="pts">${e.score}</span>
        </div>`).join('')
      : `<p class="boast">Nog niemand op het bord. Eerste die de Belastingdienst verslaat krijgt de eer.</p>`;

    this.game.showOverlay(`
      <div class="panel">
        <h1>🏆 Ranking</h1>
        <p>Top 20 — lokaal opgeslagen op dit toestel.</p>
        ${rowsHtml}
        <div class="btns">
          <button class="btn secondary" id="back">← Naar menu</button>
          ${lb.length ? '<button class="btn ghost" id="clear">Ranking wissen</button>' : ''}
        </div>
      </div>
    `);
    this.game.overlay.querySelector('#back').addEventListener('click', () => { sfx.click(); this.game.gotoMenu(); });
    const c = this.game.overlay.querySelector('#clear');
    if (c) c.addEventListener('click', () => {
      if (confirm('Ranking wissen? Dit kan niet ongedaan worden gemaakt.')) {
        clearLeaderboard();
        this._render();
      }
    });
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
