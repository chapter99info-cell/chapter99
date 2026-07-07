-- ============================================================
-- PROPOSED Supabase Storage RLS — DO NOT RUN WITHOUT APPROVAL
-- Project: chapter99-creator-network (jjbwiriphyxsnrnpoqnn)
-- ============================================================

-- ------------------------------------------------------------
-- 1. profile-documents — PRIVATE (ABN, insurance, verification)
-- ------------------------------------------------------------
UPDATE storage.buckets SET public = false WHERE id = 'profile-documents';

-- Drop existing permissive policies if any (adjust names after checking Dashboard)
-- DROP POLICY IF EXISTS "Public Access" ON storage.objects;

CREATE POLICY "profile_documents_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'profile-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "profile_documents_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "profile_documents_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "profile_documents_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'profile-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admin read via service role (server-side API routes only — no anon policy)

-- ------------------------------------------------------------
-- 2. deliverables — PRIVATE (client photo deliverables)
-- ------------------------------------------------------------
UPDATE storage.buckets SET public = false WHERE id = 'deliverables';

CREATE POLICY "deliverables_select_participants"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'deliverables'
  AND (
    -- Photographer who uploaded (path: {bookingId}/{filename})
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN photographers p ON p.id = b.photographer_id
      WHERE p.id = auth.uid()
        AND b.id::text = (storage.foldername(name))[1]
    )
    OR
    -- Client who owns the booking
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.client_id = auth.uid()
        AND b.id::text = (storage.foldername(name))[1]
    )
  )
);

CREATE POLICY "deliverables_insert_photographer"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'deliverables'
  AND EXISTS (
    SELECT 1 FROM bookings b
    JOIN photographers p ON p.id = b.photographer_id
    WHERE p.id = auth.uid()
      AND b.id::text = (storage.foldername(name))[1]
  )
);

-- NOTE: Requires code change — replace getPublicUrl() with createSignedUrl()
-- in components/UploadDeliverables.tsx

-- ------------------------------------------------------------
-- 3. documents — PRIVATE (join uploads: avatars, insurance PDFs)
-- ------------------------------------------------------------
UPDATE storage.buckets SET public = false WHERE id = 'documents';

CREATE POLICY "documents_select_authenticated"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "documents_insert_service_only"
ON storage.objects FOR INSERT TO service_role
WITH CHECK (bucket_id = 'documents');

-- Upload already uses service role in app/api/join/upload/route.ts
-- Remove any anon INSERT policy on this bucket

-- ------------------------------------------------------------
-- 4. profile-photos — PUBLIC READ for verified profiles (optional tighten)
-- ------------------------------------------------------------
-- Keep bucket public = true for CDN-style portfolio URLs, OR:

-- UPDATE storage.buckets SET public = false WHERE id = 'profile-photos';

-- CREATE POLICY "profile_photos_public_verified"
-- ON storage.objects FOR SELECT TO anon, authenticated
-- USING (
--   bucket_id = 'profile-photos'
--   AND EXISTS (
--     SELECT 1 FROM photographers p
--     WHERE p.id::text = (storage.foldername(name))[1]
--       AND p.is_verified = true
--       AND p.is_active = true
--   )
-- );

-- CREATE POLICY "profile_photos_owner_write"
-- ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK (
--   bucket_id = 'profile-photos'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );

-- ------------------------------------------------------------
-- 5. VDO — keep PUBLIC (marketing hero video)
-- ------------------------------------------------------------
-- No change. Restrict writes to service_role only:

CREATE POLICY "vdo_public_read"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'VDO');

CREATE POLICY "vdo_service_write"
ON storage.objects FOR INSERT TO service_role
WITH CHECK (bucket_id = 'VDO');

-- ============================================================
-- Project A (euiwkvozrhnbxtttfuchh) — NO CHANGES PROPOSED NOW
-- Client marketing buckets stay public until document storage is added.
-- When adding private docs, create per-client private buckets, e.g.:
--   UPDATE storage.buckets SET public = false WHERE id = 'mira-documents';
-- ============================================================
