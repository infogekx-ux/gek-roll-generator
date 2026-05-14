import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!URL || !KEY) {
  console.warn('[LULBAL] Supabase env vars ontbreken — game draait in offline-modus.');
}

export const supabase = URL && KEY
  ? createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'lulbal.auth.v1',
      },
    })
  : null;

export const ONLINE = !!supabase;

// Pending onboarding data — store nick/company/nationality/lang between
// "click SPELEN → magic link sent" and "user clicks link → comes back".
const PENDING_KEY = 'lulbal.pending_signup.v1';

export function savePendingSignup(data) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(data)); } catch {}
}
export function loadPendingSignup() {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null'); }
  catch { return null; }
}
export function clearPendingSignup() {
  try { localStorage.removeItem(PENDING_KEY); } catch {}
}

// Profile API ------------------------------------------------------------
export async function fetchMyProfile() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('lulbal_users')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();
  if (error) {
    console.warn('[LULBAL] fetchMyProfile error', error);
    return null;
  }
  return data;
}

export async function ensureProfile({ email, nickname, company_name, nationality, ui_lang }) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const id = session.user.id;
  // Try fetch first
  const existing = await fetchMyProfile();
  if (existing) return existing;

  // Insert
  const payload = {
    id,
    email: email || session.user.email,
    nickname: (nickname || `player_${id.slice(0, 8)}`).trim(),
    company_name: company_name?.trim() || null,
    nationality: nationality || 'NL',
    ui_lang: ui_lang || 'NL',
  };
  const { data, error } = await supabase
    .from('lulbal_users')
    .insert(payload)
    .select('*')
    .single();
  if (error) {
    // Could be a duplicate nickname — try appending random suffix
    if (error.code === '23505' && error.message?.includes('nickname')) {
      payload.nickname = `${payload.nickname}_${Math.floor(Math.random() * 1000)}`;
      const retry = await supabase.from('lulbal_users').insert(payload).select('*').single();
      if (!retry.error) return retry.data;
    }
    console.warn('[LULBAL] ensureProfile insert error', error);
    return null;
  }
  return data;
}

export async function updateProfile(patch) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('lulbal_users')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', session.user.id)
    .select('*')
    .single();
  if (error) {
    console.warn('[LULBAL] updateProfile error', error);
    return null;
  }
  return data;
}

// Scores --------------------------------------------------------------
export async function insertScore({ level, score, stars, time_seconds }) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const payload = {
    user_id: session.user.id,
    level,
    score,
    stars,
    time_seconds: time_seconds || 0,
  };
  const { data, error } = await supabase
    .from('lulbal_scores')
    .insert(payload)
    .select('*')
    .single();
  if (error) console.warn('[LULBAL] insertScore error', error);
  return data;
}

// Progress upsert ----------------------------------------------------
export async function upsertProgress({ level, score, stars }) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  // Fetch existing first to compute best
  const { data: existing } = await supabase
    .from('lulbal_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('level', level)
    .maybeSingle();

  const newBestScore = Math.max(existing?.best_score || 0, score);
  const newBestStars = Math.max(existing?.best_stars || 0, stars);

  const { data, error } = await supabase
    .from('lulbal_progress')
    .upsert({
      user_id: session.user.id,
      level,
      completed: true,
      best_score: newBestScore,
      best_stars: newBestStars,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,level' })
    .select('*')
    .single();
  if (error) console.warn('[LULBAL] upsertProgress error', error);
  return data;
}

// Achievements --------------------------------------------------------
export async function unlockAchievementOnline(achievement_key) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { error } = await supabase
    .from('lulbal_achievements')
    .insert({
      user_id: session.user.id,
      achievement_key,
    });
  // ignore unique-violation (already unlocked)
  if (error && error.code !== '23505') {
    console.warn('[LULBAL] unlockAchievementOnline error', error);
  }
}

export async function fetchMyAchievements() {
  if (!supabase) return [];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const { data, error } = await supabase
    .from('lulbal_achievements')
    .select('achievement_key, unlocked_at')
    .eq('user_id', session.user.id);
  if (error) {
    console.warn('[LULBAL] fetchMyAchievements error', error);
    return [];
  }
  return data || [];
}

// Leaderboards --------------------------------------------------------
export async function fetchGlobalLeaderboard(limit = 100) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('lulbal_users_public')
    .select('*')
    .order('total_score', { ascending: false })
    .limit(limit);
  if (error) {
    console.warn('[LULBAL] fetchGlobalLeaderboard error', error);
    return [];
  }
  return data || [];
}

export async function fetchLeaderboardByNationality(nationality, limit = 50) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('lulbal_users_public')
    .select('*')
    .eq('nationality', nationality)
    .order('total_score', { ascending: false })
    .limit(limit);
  if (error) {
    console.warn('[LULBAL] fetchLeaderboardByNationality error', error);
    return [];
  }
  return data || [];
}

export async function fetchWeeklyLeaderboard(limit = 50) {
  if (!supabase) return [];
  // Current ISO year + week
  const now = new Date();
  const isoYear = now.getUTCFullYear();
  const isoWeek = getISOWeek(now);

  const { data, error } = await supabase
    .from('lulbal_leaderboard_weekly')
    .select(`
      total_score,
      week_number,
      year,
      user:lulbal_users_public!user_id (
        id, nickname, company_name, nationality, current_title
      )
    `)
    .eq('year', isoYear)
    .eq('week_number', isoWeek)
    .order('total_score', { ascending: false })
    .limit(limit);
  if (error) {
    console.warn('[LULBAL] fetchWeeklyLeaderboard error', error);
    return [];
  }
  return data || [];
}

// Count of players with weekly leaderboard rows in current ISO week+year.
export async function fetchWeeklyActiveCount() {
  if (!supabase) return null;
  const now = new Date();
  const isoYear = now.getUTCFullYear();
  const isoWeek = getISOWeek(now);
  const { count, error } = await supabase
    .from('lulbal_leaderboard_weekly')
    .select('user_id', { count: 'exact', head: true })
    .eq('year', isoYear)
    .eq('week_number', isoWeek);
  if (error) {
    console.warn('[LULBAL] fetchWeeklyActiveCount error', error);
    return null;
  }
  return count;
}

export async function fetchMyProgress() {
  if (!supabase) return [];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const { data, error } = await supabase
    .from('lulbal_progress')
    .select('*')
    .eq('user_id', session.user.id);
  if (error) {
    console.warn('[LULBAL] fetchMyProgress error', error);
    return [];
  }
  return data || [];
}

// Helper -------------------------------------------------------------
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
