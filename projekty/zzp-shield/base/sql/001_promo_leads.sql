-- ZZP Shield: promotion leads table
-- Stores interest signals from ZZP'ers when they click "Interested" on a promotion
-- shown inside their panel. Inserts are made directly from the panel using the
-- anon key, so RLS allows anonymous INSERT only. SELECT/UPDATE/DELETE remain
-- restricted to the service role (GEK-X admins).

CREATE TABLE IF NOT EXISTS zzp_promo_leads (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_id     TEXT NOT NULL,
  company_name TEXT,
  owner_name   TEXT,
  email        TEXT,
  phone        TEXT,
  kvk          TEXT,
  language     TEXT,
  source_url   TEXT,
  status       TEXT DEFAULT 'new',
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_zzp_promo_leads_promo ON zzp_promo_leads (promo_id);
CREATE INDEX IF NOT EXISTS idx_zzp_promo_leads_created ON zzp_promo_leads (created_at DESC);

ALTER TABLE zzp_promo_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous role: INSERT only, no read
DROP POLICY IF EXISTS "anon_insert" ON zzp_promo_leads;
CREATE POLICY "anon_insert" ON zzp_promo_leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated users (none expected in v1) — same as anon
DROP POLICY IF EXISTS "auth_insert" ON zzp_promo_leads;
CREATE POLICY "auth_insert" ON zzp_promo_leads
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- service_role bypasses RLS automatically, no explicit policy needed.
