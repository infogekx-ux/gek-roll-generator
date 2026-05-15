// LULBAL — own dedicated Supabase project. Auth via magic link.
import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!URL || !KEY) console.warn('[LULBAL] Supabase env missing — offline mode');

export const ONLINE = !!(URL && KEY);

export const supabase = ONLINE
  ? createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
        storage: window.localStorage,
        storageKey: 'lulbal.auth.v1',
      },
    })
  : null;

// --- Pending signup buffer (between SPELEN click and magic-link return) ---
const PENDING_KEY = 'lulbal.pending_signup.v1';
export function savePendingSignup(d) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(d)); } catch {}
}
export function loadPendingSignup() {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null'); } catch { return null; }
}
export function clearPendingSignup() {
  try { localStorage.removeItem(PENDING_KEY); } catch {}
}

// --- Profile API ---
export async function fetchMyProfile() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('lulbal_users').select('*').eq('id', session.user.id).maybeSingle();
  if (error) { console.warn('[LULBAL] fetchMyProfile', error); return null; }
  return data;
}

export async function ensureProfile(payload) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const existing = await fetchMyProfile();
  if (existing) return existing;

  const insert = {
    id: session.user.id,
    email: payload.email || session.user.email,
    nickname: (payload.nickname || `player_${session.user.id.slice(0,8)}`).trim(),
    company_name: payload.company_name?.trim() || null,
    nationality: payload.nationality || 'NL',
    ui_lang: payload.ui_lang || 'NL',
  };
  let { data, error } = await supabase.from('lulbal_users').insert(insert).select('*').single();
  if (error?.code === '23505' && error.message?.includes('nickname')) {
    insert.nickname = `${insert.nickname}_${Math.floor(Math.random()*9999)}`;
    ({ data, error } = await supabase.from('lulbal_users').insert(insert).select('*').single());
  }
  if (error) { console.warn('[LULBAL] ensureProfile', error); return null; }
  return data;
}

export async function updateProfile(patch) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data } = await supabase
    .from('lulbal_users').update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', session.user.id).select('*').single();
  return data;
}

// --- Scores ---
export async function insertScore({ level, score, stars, time_seconds }) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase.from('lulbal_scores').insert({
    user_id: session.user.id, level, score, stars, time_seconds: time_seconds || 0,
  }).select('*').single();
  if (error) console.warn('[LULBAL] insertScore', error);
  return data;
}

export async function upsertProgress({ level, score, stars }) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data: prev } = await supabase
    .from('lulbal_progress').select('*')
    .eq('user_id', session.user.id).eq('level', level).maybeSingle();
  const best_score = Math.max(prev?.best_score || 0, score);
  const best_stars = Math.max(prev?.best_stars || 0, stars);
  const { data } = await supabase.from('lulbal_progress').upsert({
    user_id: session.user.id, level, completed: true, best_score, best_stars,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,level' }).select('*').single();
  return data;
}

export async function fetchMyProgress() {
  if (!supabase) return [];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const { data } = await supabase.from('lulbal_progress').select('*').eq('user_id', session.user.id);
  return data || [];
}

// --- Achievements ---
export async function unlockAchievementOnline(achievement_key) {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const { error } = await supabase.from('lulbal_achievements').insert({
    user_id: session.user.id, achievement_key,
  });
  if (error && error.code !== '23505') console.warn('[LULBAL] unlockAchievement', error);
}

export async function fetchMyAchievements() {
  if (!supabase) return [];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const { data } = await supabase
    .from('lulbal_achievements').select('achievement_key,unlocked_at')
    .eq('user_id', session.user.id);
  return data || [];
}

// --- Public leaderboards ---
export async function fetchGlobalLeaderboard(limit = 100) {
  if (!supabase) return [];
  const { data } = await supabase.from('lulbal_users_public').select('*')
    .order('total_score', { ascending: false }).limit(limit);
  return data || [];
}

export async function fetchLeaderboardByNationality(nationality, limit = 50) {
  if (!supabase) return [];
  const { data } = await supabase.from('lulbal_users_public').select('*')
    .eq('nationality', nationality)
    .order('total_score', { ascending: false }).limit(limit);
  return data || [];
}

export async function fetchWeeklyLeaderboard(limit = 50) {
  if (!supabase) return [];
  const now = new Date();
  const isoYear = now.getUTCFullYear();
  const isoWeek = getISOWeek(now);
  const { data } = await supabase
    .from('lulbal_leaderboard_weekly')
    .select(`total_score, week_number, year, user:lulbal_users_public!user_id ( id, nickname, company_name, nationality, current_title )`)
    .eq('year', isoYear).eq('week_number', isoWeek)
    .order('total_score', { ascending: false }).limit(limit);
  return data || [];
}

export async function fetchWeeklyActiveCount() {
  if (!supabase) return null;
  const now = new Date();
  const isoYear = now.getUTCFullYear();
  const isoWeek = getISOWeek(now);
  const { count } = await supabase
    .from('lulbal_leaderboard_weekly').select('user_id', { count: 'exact', head: true })
    .eq('year', isoYear).eq('week_number', isoWeek);
  return count;
}

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
