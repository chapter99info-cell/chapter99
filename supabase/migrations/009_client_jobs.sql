-- Chapter99 Agency Hub — Internal client job queue + tax invoices
-- Project: jjbwiriphyxsnrnpoqnn (chapter99info.com /admin)
-- Apply manually in Supabase SQL Editor before using /admin/jobs.
-- Do NOT mix with massage-shop tenant data (chapter99-v4-complete).

CREATE TABLE IF NOT EXISTS client_jobs (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name          TEXT NOT NULL,
  client_email         TEXT,
  job_type             TEXT NOT NULL
                         CHECK (job_type IN ('photography','video','web','other_service')),
  status               TEXT NOT NULL DEFAULT 'received'
                         CHECK (status IN ('received','in_progress','review','delivered','paid')),
  deposit_amount       DECIMAL(10,2),
  deposit_paid_at      TIMESTAMPTZ,
  total_amount         DECIMAL(10,2),
  delivered_at         TIMESTAMPTZ,
  deadline             DATE,
  square_payment_link  TEXT,
  deliverable_link     TEXT,
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS client_jobs_status_idx ON client_jobs (status);
CREATE INDEX IF NOT EXISTS client_jobs_created_idx ON client_jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS client_jobs_job_type_idx ON client_jobs (job_type);

CREATE TABLE IF NOT EXISTS agency_invoices (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number   TEXT NOT NULL UNIQUE,
  client_job_id    UUID NOT NULL REFERENCES client_jobs(id) ON DELETE RESTRICT,
  kind             TEXT NOT NULL CHECK (kind IN ('deposit','final')),
  client_name      TEXT NOT NULL,
  client_email     TEXT,
  job_type         TEXT NOT NULL,
  amount_ex_gst    DECIMAL(10,2) NOT NULL,
  gst              DECIMAL(10,2) NOT NULL,
  total            DECIMAL(10,2) NOT NULL,
  issued_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email_sent       BOOLEAN NOT NULL DEFAULT FALSE,
  pdf_url          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_job_id, kind)
);

CREATE INDEX IF NOT EXISTS agency_invoices_issued_idx ON agency_invoices (issued_at DESC);
CREATE INDEX IF NOT EXISTS agency_invoices_job_type_idx ON agency_invoices (job_type);

CREATE TABLE IF NOT EXISTS agency_invoice_counters (
  year     INT PRIMARY KEY,
  last_seq INT NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION next_agency_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  y INT := EXTRACT(YEAR FROM NOW())::INT;
  seq INT;
BEGIN
  INSERT INTO agency_invoice_counters (year, last_seq)
  VALUES (y, 1)
  ON CONFLICT (year) DO UPDATE
    SET last_seq = agency_invoice_counters.last_seq + 1
  RETURNING last_seq INTO seq;

  RETURN 'C99-' || y::TEXT || '-' || LPAD(seq::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION client_jobs_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.status = 'delivered' AND (OLD.status IS DISTINCT FROM 'delivered') AND NEW.delivered_at IS NULL THEN
    NEW.delivered_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_client_jobs_updated_at ON client_jobs;
CREATE TRIGGER trg_client_jobs_updated_at
  BEFORE UPDATE ON client_jobs
  FOR EACH ROW
  EXECUTE FUNCTION client_jobs_set_updated_at();

ALTER TABLE client_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_invoice_counters ENABLE ROW LEVEL SECURITY;

-- Agency Hub is PIN/JWT gated in the SPA. Anon policies allow Super Admin UI
-- (same pattern as legacy agency tables). Invoice API uses service role.
DROP POLICY IF EXISTS "client_jobs_admin_all" ON client_jobs;
CREATE POLICY "client_jobs_admin_all" ON client_jobs
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "agency_invoices_admin_all" ON agency_invoices;
CREATE POLICY "agency_invoices_admin_all" ON agency_invoices
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "agency_invoice_counters_admin_all" ON agency_invoice_counters;
CREATE POLICY "agency_invoice_counters_admin_all" ON agency_invoice_counters
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE client_jobs IS
  'Chapter99 Solutions internal client job queue. UI: /admin/jobs (Agency Hub).';
COMMENT ON TABLE agency_invoices IS
  'Chapter99 Solutions tax invoices (deposit/final). Raw figures for accountant export — no tax advice.';
