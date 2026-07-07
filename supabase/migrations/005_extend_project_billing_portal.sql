-- Extend project + billing for client portal and ATO/GST
-- Target: jjbwiriphyxsnrnpoqnn — tables: client, project, task, billing, prompts
-- Safe to re-run

-- project_type: add VIDEO
DO $$ BEGIN
  ALTER TYPE project_type ADD VALUE IF NOT EXISTS 'VIDEO';
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN
    -- If project_type is text + check instead of enum, skip
    NULL;
END $$;

-- project: new portal + spec columns (snake_case)
ALTER TABLE project ADD COLUMN IF NOT EXISTS live_web_url TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS gallery_url TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS google_maps_embed_url TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS google_review_link TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS line_oa_url TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS project_spec TEXT;

-- billing: ATO/GST columns (snake_case)
ALTER TABLE billing ADD COLUMN IF NOT EXISTS total_amount_aud NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE billing ADD COLUMN IF NOT EXISTS gst_amount_aud NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE billing ADD COLUMN IF NOT EXISTS payment_received_date DATE;

-- Migrate existing total_amount → total_amount_aud (keep total_amount for backward compatibility)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'billing' AND column_name = 'total_amount'
  ) THEN
    UPDATE billing
    SET total_amount_aud = COALESCE(total_amount_aud, total_amount, 0)
    WHERE total_amount_aud IS NULL OR total_amount_aud = 0;
  END IF;
END $$;

-- Default GST to 10% of total where not yet set
UPDATE billing
SET gst_amount_aud = ROUND(total_amount_aud * 0.1, 2)
WHERE (gst_amount_aud IS NULL OR gst_amount_aud = 0) AND total_amount_aud > 0;

-- Client portal: anon read project + client (magic-link by UUID)
DO $$ BEGIN
  IF to_regclass('public.project') IS NOT NULL THEN
    DROP POLICY IF EXISTS "anon_read_project_portal" ON project;
    CREATE POLICY "anon_read_project_portal" ON project
      FOR SELECT TO anon USING (true);
  END IF;
  IF to_regclass('public.client') IS NOT NULL THEN
    DROP POLICY IF EXISTS "anon_read_client_portal" ON client;
    CREATE POLICY "anon_read_client_portal" ON client
      FOR SELECT TO anon
      USING (EXISTS (SELECT 1 FROM project p WHERE p.client_id = client.id));
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
