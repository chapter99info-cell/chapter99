-- Client portal: public view + revoke direct anon project reads + seed E2E test URLs
-- Target: jjbwiriphyxsnrnpoqnn — safe to re-run

CREATE OR REPLACE VIEW public.project_public_view AS
SELECT
  p.id,
  p.project_type,
  p.status,
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

-- Portal must use the view only — not the base project table
DO $$ BEGIN
  IF to_regclass('public.project') IS NOT NULL THEN
    DROP POLICY IF EXISTS "anon_read_project_portal" ON project;
  END IF;
END $$;

-- E2E test project (Test Business) — fill portal URLs when missing
UPDATE public.project
SET
  live_web_url = COALESCE(NULLIF(trim(live_web_url), ''), 'https://mirathaimassage.com.au'),
  gallery_url = COALESCE(NULLIF(trim(gallery_url), ''), 'https://mirathaimassage.com.au/gallery'),
  google_review_link = COALESCE(
    NULLIF(trim(google_review_link), ''),
    'https://g.page/r/mira-thai-massage-altona/review'
  ),
  contract_url = COALESCE(NULLIF(trim(contract_url), ''), 'https://drive.google.com/contract-test'),
  project_spec = COALESCE(NULLIF(trim(project_spec), ''), 'E2E test spec — not exposed via portal view')
WHERE id = '5073961b-b869-45a0-948c-e27fbda16867';

NOTIFY pgrst, 'reload schema';
