-- Pricing tiers, production add-ons, AI addon fields (snake_case)
-- Target: jjbwiriphyxsnrnpoqnn — safe to re-run

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ——— project: package tier + AI addon flags ———
ALTER TABLE project ADD COLUMN IF NOT EXISTS package_tier TEXT NOT NULL DEFAULT 'STARTER';
ALTER TABLE project ADD COLUMN IF NOT EXISTS ai_addon_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE project ADD COLUMN IF NOT EXISTS byok_api_key TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS byok_key_configured BOOLEAN NOT NULL DEFAULT false;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'project_package_tier_check'
  ) THEN
    ALTER TABLE project
      ADD CONSTRAINT project_package_tier_check
      CHECK (package_tier IN ('STARTER', 'PROFESSIONAL', 'ULTIMATE'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'project_ai_addon_ultimate_only'
  ) THEN
    ALTER TABLE project
      ADD CONSTRAINT project_ai_addon_ultimate_only
      CHECK (NOT ai_addon_enabled OR package_tier = 'ULTIMATE');
  END IF;
END $$;

-- ——— billing: production + AI addon line items ———
ALTER TABLE billing ADD COLUMN IF NOT EXISTS base_package_amount_aud NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE billing ADD COLUMN IF NOT EXISTS photography_fee_aud NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE billing ADD COLUMN IF NOT EXISTS video_fee_aud NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE billing ADD COLUMN IF NOT EXISTS ai_addon_monthly_fee_aud NUMERIC(12, 2);

-- Backfill base from existing totals
UPDATE billing
SET base_package_amount_aud = COALESCE(NULLIF(base_package_amount_aud, 0), total_amount_aud, 0)
WHERE base_package_amount_aud IS NULL OR base_package_amount_aud = 0;

-- Recompute totals including production add-ons (Ultimate tier only)
UPDATE billing b
SET
  total_amount_aud = ROUND(
    COALESCE(b.base_package_amount_aud, 0)
    + CASE
        WHEN COALESCE(p.package_tier, 'STARTER') = 'ULTIMATE'
        THEN COALESCE(b.photography_fee_aud, 0) + COALESCE(b.video_fee_aud, 0)
        ELSE 0
      END
    + CASE
        WHEN COALESCE(p.package_tier, 'STARTER') = 'ULTIMATE'
        THEN COALESCE(b.ai_addon_monthly_fee_aud, 0)
        ELSE 0
      END,
    2
  ),
  gst_amount_aud = ROUND(
    (
      COALESCE(b.base_package_amount_aud, 0)
      + CASE
          WHEN COALESCE(p.package_tier, 'STARTER') = 'ULTIMATE'
          THEN COALESCE(b.photography_fee_aud, 0) + COALESCE(b.video_fee_aud, 0)
          ELSE 0
        END
      + CASE
          WHEN COALESCE(p.package_tier, 'STARTER') = 'ULTIMATE'
          THEN COALESCE(b.ai_addon_monthly_fee_aud, 0)
          ELSE 0
        END
    ) * 0.1,
    2
  ),
  total_amount = ROUND(
    COALESCE(b.base_package_amount_aud, 0)
    + CASE
        WHEN COALESCE(p.package_tier, 'STARTER') = 'ULTIMATE'
        THEN COALESCE(b.photography_fee_aud, 0) + COALESCE(b.video_fee_aud, 0)
        ELSE 0
      END
    + CASE
        WHEN COALESCE(p.package_tier, 'STARTER') = 'ULTIMATE'
        THEN COALESCE(b.ai_addon_monthly_fee_aud, 0)
        ELSE 0
      END,
    2
  )
FROM project p
WHERE p.id = b.project_id;

-- ——— BYOK: encrypt at rest via SECURITY DEFINER RPC (never exposed to anon / public view) ———
CREATE OR REPLACE FUNCTION public.set_project_byok_key(p_project_id uuid, p_plain_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier text;
  v_ai boolean;
  v_master text;
BEGIN
  IF auth.role() IS DISTINCT FROM 'authenticated' THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT package_tier, ai_addon_enabled INTO v_tier, v_ai
  FROM project WHERE id = p_project_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'project not found';
  END IF;

  IF v_tier <> 'ULTIMATE' OR NOT v_ai THEN
    RAISE EXCEPTION 'BYOK only allowed for ULTIMATE projects with ai_addon_enabled';
  END IF;

  v_master := current_setting('app.byok_master_key', true);
  IF v_master IS NULL OR v_master = '' THEN
  -- Fallback internal key when Vault/master not configured (encrypt at rest vs plaintext REST)
    v_master := 'chapter99-byok-at-rest-v1';
  END IF;

  UPDATE project
  SET
    byok_api_key = CASE
      WHEN p_plain_key IS NULL OR btrim(p_plain_key) = '' THEN NULL
      ELSE encode(pgp_sym_encrypt(p_plain_key, v_master), 'base64')
    END,
    byok_key_configured = CASE
      WHEN p_plain_key IS NULL OR btrim(p_plain_key) = '' THEN false
      ELSE true
    END
  WHERE id = p_project_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_project_byok_key(p_project_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cipher text;
  v_master text;
BEGIN
  IF auth.role() IS DISTINCT FROM 'authenticated' THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT byok_api_key INTO v_cipher FROM project WHERE id = p_project_id;
  IF v_cipher IS NULL OR btrim(v_cipher) = '' THEN
    RETURN NULL;
  END IF;

  v_master := current_setting('app.byok_master_key', true);
  IF v_master IS NULL OR v_master = '' THEN
    v_master := 'chapter99-byok-at-rest-v1';
  END IF;

  RETURN pgp_sym_decrypt(decode(v_cipher, 'base64'), v_master);
END;
$$;

REVOKE ALL ON FUNCTION public.set_project_byok_key(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_project_byok_key(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_project_byok_key(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_project_byok_key(uuid) TO authenticated;

-- ——— Keep public portal view free of secrets ———
CREATE OR REPLACE VIEW public.project_public_view AS
SELECT
  p.id,
  p.project_type,
  p.status,
  p.package_tier,
  c.business_name,
  p.live_web_url,
  p.gallery_url,
  p.google_maps_embed_url,
  p.google_review_link,
  p.facebook_url,
  p.line_oa_url
FROM public.project p
LEFT JOIN public.client c ON c.id = p.client_id;

GRANT SELECT ON public.project_public_view TO anon;
GRANT SELECT ON public.project_public_view TO authenticated;

NOTIFY pgrst, 'reload schema';
