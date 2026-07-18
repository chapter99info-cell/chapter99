-- =============================================================================
-- Chapter99 AMS — bootstrap first admin (ams.staff_profiles)
-- Target: jjbwiriphyxsnrnpoqnn
-- =============================================================================
-- 1. Create user in Supabase Auth (Authentication → Users)
-- 2. Replace the UUID / email / name below
-- 3. Run this script (service role / SQL editor)
--
-- Does NOT touch public.profiles (marketplace).

/*
INSERT INTO ams.staff_profiles (id, full_name, display_name, email, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- auth.users.id
  'Chapter99 Admin',
  'Admin',
  'you@chapter99.com.au',
  'admin',
  TRUE
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    is_active = TRUE,
    updated_at = NOW();
*/
