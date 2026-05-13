// Scoring math.

export function scenarioScore({ kind, timeUsedSec, timerMax, streak }) {
  let basis = 0;
  if (kind === 'correct') basis = 100;
  else if (kind === 'dumb') basis = 25;
  else basis = 0;

  if (basis === 0) return { points: 0, speedBonus: 0, streakBonus: 0 };

  const speedBonus = Math.max(0, Math.round((1 - timeUsedSec / timerMax) * 50));
  const streakBonus = Math.min(50, streak * 10);

  return {
    points: basis + speedBonus + streakBonus,
    speedBonus,
    streakBonus,
    basis,
  };
}

export function starsFor(scorePct) {
  if (scorePct >= 0.9) return 3;
  if (scorePct >= 0.75) return 2;
  if (scorePct >= 0.5) return 1;
  return 0;
}

export function euroFromScore(score, stars) {
  // Cosmetisch — €5.000 per ster + €10 per punt
  return stars * 5000 + score * 10;
}
