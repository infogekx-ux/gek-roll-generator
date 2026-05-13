import { rand, randi, pick, clamp, aabb } from '../engine/util.js';
import { sfx } from '../engine/audio.js';
import { ENEMIES, POWERUPS } from '../data/enemies.js';
import { FACTS } from '../data/facts.js';

const PLAYER_BASE_SPEED = 260; // px/s on a 1000px ref
const REF_H = 1000;

export class BattleScene {
  constructor(game) {
    this.game = game;
    this.player = null;
    this.bullets = [];
    this.enemies = [];
    this.enemyBullets = [];
    this.particles = [];
    this.pickups = [];
    this.wave = 1;
    this.waveTimer = 0;
    this.spawnTimer = 0;
    this.score = 0;
    this.money = 0;
    this.hp = 100;
    this.maxHp = 100;
    this.invuln = 0;
    this.tripleShot = 0;
    this.speedBoost = 0;
    this.fireCool = 0;
    this.factTimer = 0;
    this.bossActive = false;
    this.lastDirX = 0;
    this.lastDirY = -1;
    this.factShownThisWave = false;
    this.killsThisWave = 0;
    this.killsNeeded = 0;
  }

  enter() {
    this.game.showHUD(true);
    this.game.showTouch(true);
    this.player = this._makePlayer();
    this._startWave(1);
    this._scheduleFact(5);
  }

  leave() {
    this.game.showHUD(false);
    this.game.showTouch(false);
  }

  _makePlayer() {
    return {
      x: this.game.W / 2,
      y: this.game.H - 140,
      w: 44, h: 54,
      hpFlash: 0
    };
  }

  _startWave(n) {
    this.wave = n;
    this.factShownThisWave = false;
    this.game.setHUD({ wave: n });
    sfx.wave();
    this.game.toast(`Golf ${n}: ${this._waveLabel(n)}`);

    // Boss every 5 waves
    if (n % 5 === 0) {
      this.bossActive = true;
      this._spawnBoss();
      this.killsNeeded = 0;
    } else {
      this.bossActive = false;
      this.killsNeeded = Math.min(20, 6 + Math.floor(n * 1.5));
    }
    this.killsThisWave = 0;
    this.waveTimer = 0;
    this.spawnTimer = 0;
  }

  _waveLabel(n) {
    const labels = [
      'Blauwe enveloppen vallen',
      'Inspecteurs op pad',
      'Algoritme bekijkt je aangifte',
      'Terugvorderingen onderweg',
      'DE BLAUWE KOLOS',
      'DBA handhaaft',
      'Box 3 storm',
      'Audit-modus',
      'Het Toeslagensysteem',
      'EINDE-VAN-HET-KWARTAAL CHAOS',
      'BAAS HOOFDKANTOOR'
    ];
    return labels[(n - 1) % labels.length];
  }

  _spawnBoss() {
    const spec = ENEMIES.boss;
    const w = 110, h = 110;
    this.enemies.push({
      ...spec,
      x: this.game.W / 2 - w / 2,
      y: -h,
      w, h,
      targetY: 80,
      vx: 120,
      hpMax: spec.hp,
      hpCur: spec.hp,
      cd: 1,
      pattern: 0
    });
  }

  _spawnEnemy(typeId) {
    const spec = ENEMIES[typeId];
    const w = 44, h = 44;
    this.enemies.push({
      ...spec,
      x: rand(20, this.game.W - 20 - w),
      y: -h,
      w, h,
      hpMax: spec.hp,
      hpCur: spec.hp,
      vx: spec.behavior === 'zigzag' ? pick([-1, 1]) * 80 : 0,
      vy: spec.speed * 80,
      phase: rand(0, Math.PI * 2),
      cd: rand(1.5, 3)
    });
  }

  _pickWaveType() {
    const w = this.wave;
    const pool = [];
    pool.push('envelope', 'envelope', 'envelope');
    if (w >= 2) pool.push('inspecteur');
    if (w >= 3) pool.push('algoritme');
    if (w >= 4) pool.push('toeslag');
    if (w >= 6) pool.push('dba');
    return pick(pool);
  }

  update(dt, input) {
    if (this.game.paused) return;

    // Player movement
    const speedMul = this.speedBoost > 0 ? 1.5 : 1;
    const scale = this.game.H / REF_H;
    const sp = PLAYER_BASE_SPEED * scale * speedMul;
    let ax = input.axis.x, ay = input.axis.y;
    const m = Math.hypot(ax, ay);
    if (m > 1) { ax /= m; ay /= m; }
    if (ax !== 0 || ay !== 0) { this.lastDirX = ax; this.lastDirY = ay; }
    this.player.x = clamp(this.player.x + ax * sp * dt, this.player.w / 2, this.game.W - this.player.w / 2);
    this.player.y = clamp(this.player.y + ay * sp * dt, this.player.h / 2, this.game.H - this.player.h / 2);

    // Fire
    this.fireCool -= dt;
    if (input.fire && this.fireCool <= 0) {
      this._shoot();
      this.fireCool = this.tripleShot > 0 ? 0.16 : 0.22;
    }

    // Update timers
    if (this.invuln > 0) this.invuln -= dt;
    if (this.tripleShot > 0) this.tripleShot -= dt;
    if (this.speedBoost > 0) this.speedBoost -= dt;
    if (this.player.hpFlash > 0) this.player.hpFlash -= dt;
    this.factTimer -= dt;
    if (this.factTimer <= 0 && !this.factShownThisWave) {
      this.game.showFactToast(pick(FACTS));
      this.factShownThisWave = true;
      this._scheduleFact(10);
    }

    // Bullets
    for (const b of this.bullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
    }
    this.bullets = this.bullets.filter((b) => b.life > 0 && b.y > -40 && b.y < this.game.H + 40 && b.x > -40 && b.x < this.game.W + 40);

    // Enemies
    this.spawnTimer -= dt;
    this.waveTimer += dt;
    // Cap concurrent enemies so screen doesn't get overrun
    const cap = Math.min(10, 4 + Math.floor(this.wave / 2));
    if (!this.bossActive && this.spawnTimer <= 0 && this.enemies.length < cap) {
      // Stop spawning once we've sent enough enemies for this wave
      const spawnedSoFar = this.killsThisWave + this.enemies.length;
      if (spawnedSoFar < this.killsNeeded + 2) {
        this._spawnEnemy(this._pickWaveType());
        const base = Math.max(0.45, 1.4 - this.wave * 0.07);
        this.spawnTimer = rand(base * 0.55, base * 1.1);
      } else {
        this.spawnTimer = 0.5;
      }
    }

    const scaleY = this.game.H / REF_H;
    for (const e of this.enemies) {
      if (e.behavior === 'boss') {
        if (e.y < e.targetY) e.y += 60 * dt;
        else {
          e.x += e.vx * dt;
          if (e.x < 20 || e.x + e.w > this.game.W - 20) e.vx *= -1;
        }
        e.cd -= dt;
        if (e.cd <= 0) {
          this._bossShoot(e);
          e.cd = rand(0.8, 1.3);
        }
      } else if (e.behavior === 'zigzag') {
        e.phase += dt * 3;
        e.x += Math.cos(e.phase) * 90 * dt;
        e.y += e.vy * scaleY * dt;
        e.x = clamp(e.x, 0, this.game.W - e.w);
      } else if (e.behavior === 'homing') {
        const dx = this.player.x - (e.x + e.w / 2);
        const dy = this.player.y - (e.y + e.h / 2);
        const len = Math.hypot(dx, dy) || 1;
        e.x += (dx / len) * 70 * dt;
        e.y += Math.max(40, e.vy * 0.6) * scaleY * dt;
      } else {
        e.y += e.vy * scaleY * dt;
      }
      e.cd = (e.cd || 0) - dt;
    }

    // Enemy bullets
    for (const b of this.enemyBullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
    }
    this.enemyBullets = this.enemyBullets.filter((b) => b.life > 0 && b.y > -40 && b.y < this.game.H + 40);

    // Particles
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt;
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    // Pickups
    for (const p of this.pickups) {
      p.y += 60 * dt;
      p.phase += dt * 4;
    }
    this.pickups = this.pickups.filter((p) => p.y < this.game.H + 40);

    // Collisions: bullets vs enemies
    for (const b of this.bullets) {
      for (const e of this.enemies) {
        if (e.hpCur <= 0) continue;
        if (aabb(b, e)) {
          e.hpCur -= 1;
          b.life = 0;
          this._spawnParticles(b.x, b.y, e.color || '#fff', 4);
          sfx.hit();
          if (e.hpCur <= 0) {
            this._killEnemy(e);
          }
        }
      }
    }

    // Collisions: enemy bullets vs player
    if (this.invuln <= 0) {
      for (const eb of this.enemyBullets) {
        if (aabb({ x: this.player.x - this.player.w / 2, y: this.player.y - this.player.h / 2, w: this.player.w, h: this.player.h }, eb)) {
          this._hitPlayer(eb.dmg || 10);
          eb.life = 0;
        }
      }
      // enemies physical contact
      for (const e of this.enemies) {
        if (e.hpCur <= 0) continue;
        if (aabb({ x: this.player.x - this.player.w / 2, y: this.player.y - this.player.h / 2, w: this.player.w, h: this.player.h }, e)) {
          this._hitPlayer(e.behavior === 'boss' ? 20 : 15);
          if (e.behavior !== 'boss') {
            e.hpCur = 0;
            this._spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.color, 8);
          }
        }
      }
    }

    // Collisions: pickups
    for (const p of this.pickups) {
      if (aabb({ x: this.player.x - this.player.w / 2, y: this.player.y - this.player.h / 2, w: this.player.w, h: this.player.h }, { x: p.x - 20, y: p.y - 20, w: 40, h: 40 })) {
        this._applyPickup(p.type);
        p.y = this.game.H + 100;
      }
    }

    this.enemies = this.enemies.filter((e) => e.hpCur > 0 && e.y < this.game.H + 80);

    // Wave progression
    if (this.bossActive) {
      const bossDead = !this.enemies.some((e) => e.behavior === 'boss');
      if (bossDead) {
        this.bossActive = false;
        this._spawnPickup(this.game.W / 2, this.game.H / 2, 'heart');
        this._nextWave();
      }
    } else {
      // Wave complete when kill quota met
      if (this.killsThisWave >= this.killsNeeded && this.enemies.length === 0) {
        this._nextWave();
      }
    }

    // Game over
    if (this.hp <= 0) {
      sfx.gameover();
      this.game.gotoGameOver({ score: this.score, wave: this.wave, money: this.money });
    }
  }

  _hitPlayer(dmg) {
    this.hp -= dmg;
    this.invuln = 0.8;
    this.player.hpFlash = 0.4;
    sfx.ouch();
    this.game.setHUD({ hp: Math.max(0, this.hp) });
    this.game.shakeStage();
  }

  _shoot() {
    const baseY = this.player.y - this.player.h / 2;
    let dx = this.lastDirX;
    let dy = this.lastDirY;
    if (dx === 0 && dy === 0) { dy = -1; }
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const speed = 520;
    const make = (ax, ay) => ({
      x: this.player.x - 6,
      y: baseY - 6,
      w: 14, h: 14,
      vx: ax * speed,
      vy: ay * speed,
      life: 2.5,
      kind: 'factuur'
    });
    this.bullets.push(make(dx, dy));
    if (this.tripleShot > 0) {
      // ±15°
      const a = Math.atan2(dy, dx);
      const a1 = a + 0.26, a2 = a - 0.26;
      this.bullets.push(make(Math.cos(a1), Math.sin(a1)));
      this.bullets.push(make(Math.cos(a2), Math.sin(a2)));
    }
    sfx.shoot();
  }

  _bossShoot(boss) {
    boss.pattern = (boss.pattern + 1) % 3;
    const cx = boss.x + boss.w / 2;
    const cy = boss.y + boss.h;
    if (boss.pattern === 0) {
      // Spread of 5
      for (let i = -2; i <= 2; i++) {
        const a = Math.PI / 2 + i * 0.2;
        this.enemyBullets.push({ x: cx - 8, y: cy, w: 16, h: 16, vx: Math.cos(a) * 220, vy: Math.sin(a) * 220, life: 4, dmg: 10 });
      }
    } else if (boss.pattern === 1) {
      // Aim at player
      const dx = this.player.x - cx;
      const dy = this.player.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      this.enemyBullets.push({ x: cx - 8, y: cy, w: 16, h: 16, vx: (dx / len) * 280, vy: (dy / len) * 280, life: 4, dmg: 12 });
    } else {
      // Circle of 8
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        this.enemyBullets.push({ x: cx - 8, y: cy, w: 16, h: 16, vx: Math.cos(a) * 180, vy: Math.sin(a) * 180, life: 4, dmg: 8 });
      }
    }
  }

  _killEnemy(e) {
    this.score += e.score;
    this.money += Math.round(e.score * 1.5);
    if (e.behavior !== 'boss') this.killsThisWave++;
    this.game.setHUD({ score: this.score, money: this.money });
    this._spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.color || '#fff', 12);
    sfx.coin();
    // 20% chance pickup
    if (Math.random() < 0.18) {
      const types = ['kor', 'aftrek', 'jaarruimte', 'heart'];
      const weights = [3, 3, 3, 1];
      const total = weights.reduce((a, b) => a + b);
      let r = Math.random() * total;
      let chosen = 'kor';
      for (let i = 0; i < types.length; i++) {
        r -= weights[i];
        if (r <= 0) { chosen = types[i]; break; }
      }
      this._spawnPickup(e.x + e.w / 2, e.y + e.h / 2, chosen);
    }
  }

  _spawnPickup(x, y, type) {
    this.pickups.push({ x, y, type, phase: 0 });
  }

  _applyPickup(type) {
    const p = POWERUPS[type];
    sfx.powerup();
    this.game.toast(`${p.emoji} ${p.name}: ${p.desc}`);
    if (type === 'kor') this.invuln = Math.max(this.invuln, 3);
    if (type === 'aftrek') this.tripleShot = Math.max(this.tripleShot, 5);
    if (type === 'jaarruimte') this.speedBoost = Math.max(this.speedBoost, 5);
    if (type === 'heart') { this.hp = Math.min(this.maxHp, this.hp + 25); this.game.setHUD({ hp: this.hp }); }
  }

  _spawnParticles(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x, y,
        vx: rand(-180, 180),
        vy: rand(-260, -40),
        life: rand(0.4, 0.9),
        color,
        size: rand(2, 5)
      });
    }
  }

  _nextWave() {
    this._startWave(this.wave + 1);
  }

  _scheduleFact(s) { this.factTimer = s; }

  render(ctx) {
    const W = this.game.W, H = this.game.H;

    // Sky gradient backdrop is provided by CSS — paint extras
    ctx.save();
    // moving stars / paper-flecks background
    const t = performance.now() / 1000;
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 24; i++) {
      const x = (i * 73 + (t * 30) % W) % W;
      const y = ((i * 137 + t * 60) % H);
      ctx.fillStyle = i % 3 === 0 ? '#ffc83d' : '#a8c7ff';
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Pickups
    for (const p of this.pickups) {
      const spec = POWERUPS[p.type];
      ctx.save();
      const bob = Math.sin(p.phase) * 3;
      ctx.translate(p.x, p.y + bob);
      ctx.fillStyle = spec.color;
      ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spec.emoji, 0, 0);
      ctx.restore();
    }

    // Enemy bullets
    for (const b of this.enemyBullets) {
      ctx.save();
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      ctx.rotate(performance.now() / 200);
      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📨', 0, 0);
      ctx.restore();
    }

    // Player bullets (facturen)
    for (const b of this.bullets) {
      ctx.save();
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      const a = Math.atan2(b.vy, b.vx);
      ctx.rotate(a + Math.PI / 2);
      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📄', 0, 0);
      ctx.restore();
    }

    // Enemies
    for (const e of this.enemies) {
      ctx.save();
      ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
      if (e.behavior === 'boss') {
        // Boss aura
        ctx.fillStyle = 'rgba(255, 107, 26, 0.18)';
        ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill();
      }
      ctx.font = `${e.behavior === 'boss' ? 88 : 36}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(e.emoji, 0, 0);
      // HP bar for tough enemies
      if (e.hpMax > 1) {
        const w = e.w;
        const pct = clamp(e.hpCur / e.hpMax, 0, 1);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(-w / 2, -e.h / 2 - 10, w, 4);
        ctx.fillStyle = pct > 0.5 ? '#46c46a' : pct > 0.25 ? '#ffc83d' : '#e63946';
        ctx.fillRect(-w / 2, -e.h / 2 - 10, w * pct, 4);
      }
      ctx.restore();
    }

    // Player
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    if (this.invuln > 0 && Math.floor(this.invuln * 12) % 2 === 0) ctx.globalAlpha = 0.4;
    // shield ring during invuln
    if (this.invuln > 0) {
      ctx.strokeStyle = '#46c46a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (this.player.hpFlash > 0) {
      ctx.fillStyle = `rgba(230,57,70,${this.player.hpFlash})`;
      ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
    }
    ctx.font = '46px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💼', 0, 4);
    // Player emoji on top
    ctx.font = '28px serif';
    ctx.fillText('🧑‍💻', 0, -18);
    ctx.restore();

    // Particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.restore();
    }

    // Wave progress indicator (top-center)
    if (!this.bossActive && this.killsNeeded > 0) {
      const barW = Math.min(220, W * 0.55);
      const barH = 6;
      const bx0 = (W - barW) / 2;
      const by0 = 72;
      const pct = clamp(this.killsThisWave / this.killsNeeded, 0, 1);
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(bx0, by0, barW, barH);
      ctx.fillStyle = '#ffc83d';
      ctx.fillRect(bx0, by0, barW * pct, barH);
      ctx.fillStyle = '#fff';
      ctx.font = '600 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.killsThisWave}/${this.killsNeeded}`, W / 2, by0 - 4);
      ctx.restore();
    } else if (this.bossActive) {
      const boss = this.enemies.find((e) => e.behavior === 'boss');
      if (boss) {
        const barW = Math.min(260, W * 0.7);
        const barH = 8;
        const bx0 = (W - barW) / 2;
        const by0 = 72;
        const pct = clamp(boss.hpCur / boss.hpMax, 0, 1);
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(bx0, by0, barW, barH);
        ctx.fillStyle = pct > 0.5 ? '#e63946' : '#ffc83d';
        ctx.fillRect(bx0, by0, barW * pct, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '700 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏛️ ' + boss.name, W / 2, by0 - 4);
        ctx.restore();
      }
    }

    // Power-up indicators horizontal, just below HUD
    let bx = 14;
    const by = 100;
    const drawBuff = (emoji, time, color) => {
      if (time <= 0) return;
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(bx, by, 68, 30);
      ctx.globalAlpha = 1;
      ctx.font = '18px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, bx + 14, by + 15);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.fillText(time.toFixed(1) + 's', bx + 28, by + 19);
      ctx.restore();
      bx += 74;
    };
    drawBuff('🛡️', this.invuln, '#46c46a');
    drawBuff('💰', this.tripleShot, '#ffc83d');
    drawBuff('⚡', this.speedBoost, '#00d4ff');
  }

  handleClick() {}
}
