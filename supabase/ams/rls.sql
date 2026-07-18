-- =============================================================================
-- Chapter99 AMS — Row Level Security (schema: ams)
-- Run AFTER supabase/ams/schema.sql
-- Target: jjbwiriphyxsnrnpoqnn — does not touch public marketplace tables
-- =============================================================================

ALTER TABLE ams.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ams.staff_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE ams.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ams.clients FORCE ROW LEVEL SECURITY;
ALTER TABLE ams.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ams.leads FORCE ROW LEVEL SECURITY;
ALTER TABLE ams.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ams.projects FORCE ROW LEVEL SECURITY;
ALTER TABLE ams.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE ams.deliverables FORCE ROW LEVEL SECURITY;
ALTER TABLE ams.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ams.payments FORCE ROW LEVEL SECURITY;
ALTER TABLE ams.staff_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ams.staff_agreements FORCE ROW LEVEL SECURITY;
ALTER TABLE ams.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ams.activity_logs FORCE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA ams FROM PUBLIC, anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA ams FROM PUBLIC, anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA ams FROM PUBLIC, anon;

GRANT USAGE ON SCHEMA ams TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ams TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ams TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ams TO authenticated;

-- Future tables inherit grants for authenticated only
ALTER DEFAULT PRIVILEGES IN SCHEMA ams
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

REVOKE ALL ON TABLE ams.projects_admin_overview FROM PUBLIC, anon;
GRANT SELECT ON TABLE ams.projects_admin_overview TO authenticated;

-- Ensure anon has NO schema usage (only public.get_project_tracking as definer)
REVOKE USAGE ON SCHEMA ams FROM anon;

-- ─── staff_profiles ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "AMS admin full access staff_profiles" ON ams.staff_profiles;
CREATE POLICY "AMS admin full access staff_profiles"
  ON ams.staff_profiles FOR ALL
  TO authenticated
  USING (ams.is_ams_admin())
  WITH CHECK (ams.is_ams_admin());

DROP POLICY IF EXISTS "AMS staff read self and coworkers" ON ams.staff_profiles;
CREATE POLICY "AMS staff read self and coworkers"
  ON ams.staff_profiles FOR SELECT
  TO authenticated
  USING (
    ams.is_ams_staff()
    AND role IN ('admin', 'staff')
  );

DROP POLICY IF EXISTS "AMS staff update own profile" ON ams.staff_profiles;
CREATE POLICY "AMS staff update own profile"
  ON ams.staff_profiles FOR UPDATE
  TO authenticated
  USING (ams.ams_role() = 'staff' AND id = auth.uid())
  WITH CHECK (ams.ams_role() = 'staff' AND id = auth.uid() AND role = 'staff');

-- ─── clients ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "AMS admin full access clients" ON ams.clients;
CREATE POLICY "AMS admin full access clients"
  ON ams.clients FOR ALL
  TO authenticated
  USING (ams.is_ams_admin())
  WITH CHECK (ams.is_ams_admin());

DROP POLICY IF EXISTS "AMS staff read clients of assigned projects" ON ams.clients;
CREATE POLICY "AMS staff read clients of assigned projects"
  ON ams.clients FOR SELECT
  TO authenticated
  USING (
    ams.ams_role() = 'staff'
    AND EXISTS (
      SELECT 1 FROM ams.projects p
      WHERE p.client_id = clients.id
        AND p.staff_id = auth.uid()
    )
  );

-- ─── leads (admin-only) ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "AMS admin full access leads" ON ams.leads;
CREATE POLICY "AMS admin full access leads"
  ON ams.leads FOR ALL
  TO authenticated
  USING (ams.is_ams_admin())
  WITH CHECK (ams.is_ams_admin());

-- ─── projects ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "AMS admin full access projects" ON ams.projects;
CREATE POLICY "AMS admin full access projects"
  ON ams.projects FOR ALL
  TO authenticated
  USING (ams.is_ams_admin())
  WITH CHECK (ams.is_ams_admin());

DROP POLICY IF EXISTS "AMS staff select assigned projects" ON ams.projects;
CREATE POLICY "AMS staff select assigned projects"
  ON ams.projects FOR SELECT
  TO authenticated
  USING (
    ams.ams_role() = 'staff'
    AND staff_id = auth.uid()
  );

DROP POLICY IF EXISTS "AMS staff update assigned projects" ON ams.projects;
CREATE POLICY "AMS staff update assigned projects"
  ON ams.projects FOR UPDATE
  TO authenticated
  USING (
    ams.ams_role() = 'staff'
    AND staff_id = auth.uid()
  )
  WITH CHECK (
    ams.ams_role() = 'staff'
    AND staff_id = auth.uid()
  );

-- ─── deliverables ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "AMS admin full access deliverables" ON ams.deliverables;
CREATE POLICY "AMS admin full access deliverables"
  ON ams.deliverables FOR ALL
  TO authenticated
  USING (ams.is_ams_admin())
  WITH CHECK (ams.is_ams_admin());

DROP POLICY IF EXISTS "AMS staff select deliverables for assigned" ON ams.deliverables;
CREATE POLICY "AMS staff select deliverables for assigned"
  ON ams.deliverables FOR SELECT
  TO authenticated
  USING (
    ams.ams_role() = 'staff'
    AND EXISTS (
      SELECT 1 FROM ams.projects p
      WHERE p.id = deliverables.project_id
        AND p.staff_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "AMS staff insert deliverables for assigned" ON ams.deliverables;
CREATE POLICY "AMS staff insert deliverables for assigned"
  ON ams.deliverables FOR INSERT
  TO authenticated
  WITH CHECK (
    ams.is_ams_staff()
    AND (
      ams.is_ams_admin()
      OR EXISTS (
        SELECT 1 FROM ams.projects p
        WHERE p.id = deliverables.project_id
          AND p.staff_id = auth.uid()
      )
    )
  );

-- ─── payments (staff SELECT only) ───────────────────────────────────────────

DROP POLICY IF EXISTS "AMS admin full access payments" ON ams.payments;
CREATE POLICY "AMS admin full access payments"
  ON ams.payments FOR ALL
  TO authenticated
  USING (ams.is_ams_admin())
  WITH CHECK (ams.is_ams_admin());

DROP POLICY IF EXISTS "AMS staff read payments for assigned" ON ams.payments;
CREATE POLICY "AMS staff read payments for assigned"
  ON ams.payments FOR SELECT
  TO authenticated
  USING (
    ams.ams_role() = 'staff'
    AND EXISTS (
      SELECT 1 FROM ams.projects p
      WHERE p.id = payments.project_id
        AND p.staff_id = auth.uid()
    )
  );

-- ─── staff_agreements ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS "AMS admin full access staff_agreements" ON ams.staff_agreements;
CREATE POLICY "AMS admin full access staff_agreements"
  ON ams.staff_agreements FOR ALL
  TO authenticated
  USING (ams.is_ams_admin())
  WITH CHECK (ams.is_ams_admin());

DROP POLICY IF EXISTS "AMS staff insert own agreement" ON ams.staff_agreements;
CREATE POLICY "AMS staff insert own agreement"
  ON ams.staff_agreements FOR INSERT
  TO authenticated
  WITH CHECK (
    ams.is_ams_staff()
    AND staff_id = auth.uid()
  );

DROP POLICY IF EXISTS "AMS staff read own agreements" ON ams.staff_agreements;
CREATE POLICY "AMS staff read own agreements"
  ON ams.staff_agreements FOR SELECT
  TO authenticated
  USING (
    ams.is_ams_staff()
    AND staff_id = auth.uid()
  );

-- ─── activity_logs ──────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "AMS admin read activity_logs" ON ams.activity_logs;
CREATE POLICY "AMS admin read activity_logs"
  ON ams.activity_logs FOR SELECT
  TO authenticated
  USING (ams.is_ams_admin());

DROP POLICY IF EXISTS "AMS staff read own related logs" ON ams.activity_logs;
CREATE POLICY "AMS staff read own related logs"
  ON ams.activity_logs FOR SELECT
  TO authenticated
  USING (
    ams.ams_role() = 'staff'
    AND (
      actor_id = auth.uid()
      OR (
        entity_type = 'project'
        AND EXISTS (
          SELECT 1 FROM ams.projects p
          WHERE p.id = activity_logs.entity_id
            AND p.staff_id = auth.uid()
        )
      )
    )
  );
