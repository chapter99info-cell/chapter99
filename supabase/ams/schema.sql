-- =============================================================================
-- Chapter99 Agency Management System (AMS)
-- Target: https://jjbwiriphyxsnrnpoqnn.supabase.co
--
-- ALL AMS objects live in schema `ams` — do NOT create/alter public.profiles,
-- public.client, public.project, photographers, bookings, etc.
--
-- Sole public-schema entry for anon clients:
--   public.get_project_tracking(token)  → SECURITY DEFINER → queries ams.*
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS ams;

COMMENT ON SCHEMA ams IS
  'Chapter99 Agency Management System — isolated from public marketplace / legacy tables.';

GRANT USAGE ON SCHEMA ams TO authenticated;
-- anon: no USAGE on ams (only public.get_project_tracking can reach ams as definer)

-- ─── Helpers ────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION ams.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Cryptographic public_token via pgcrypto gen_random_bytes (min 21 chars)
CREATE OR REPLACE FUNCTION ams.generate_public_token(size INT DEFAULT 21)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  alphabet CONSTANT TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  result TEXT := '';
  i INT;
  bytes BYTEA;
  token_size INT;
BEGIN
  token_size := GREATEST(COALESCE(size, 21), 21);
  bytes := gen_random_bytes(token_size);
  FOR i IN 0 .. token_size - 1 LOOP
    result := result || substr(alphabet, (get_byte(bytes, i) % 64) + 1, 1);
  END LOOP;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION ams.extract_url_domain(url TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  cleaned TEXT;
BEGIN
  IF url IS NULL OR btrim(url) = '' THEN
    RETURN NULL;
  END IF;
  cleaned := lower(btrim(url));
  cleaned := regexp_replace(cleaned, '^https?://', '');
  cleaned := split_part(cleaned, '/', 1);
  cleaned := split_part(cleaned, '?', 1);
  cleaned := split_part(cleaned, '#', 1);
  RETURN NULLIF(cleaned, '');
END;
$$;

CREATE OR REPLACE FUNCTION ams.is_valid_http_url(url TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN url ~* '^https?://[^\s/$.?#].[^\s]*$';
END;
$$;

-- ─── staff_profiles (NOT public.profiles — marketplace owns that name) ──────

CREATE TABLE IF NOT EXISTS ams.staff_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  email TEXT,
  phone TEXT,
  line_user_id TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_profiles_role ON ams.staff_profiles (role)
  WHERE is_active = TRUE;

DROP TRIGGER IF EXISTS staff_profiles_updated_at ON ams.staff_profiles;
CREATE TRIGGER staff_profiles_updated_at
  BEFORE UPDATE ON ams.staff_profiles
  FOR EACH ROW EXECUTE FUNCTION ams.set_updated_at();

CREATE OR REPLACE FUNCTION ams.ams_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ams, public
AS $$
  SELECT role FROM ams.staff_profiles
  WHERE id = auth.uid() AND is_active = TRUE
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION ams.is_ams_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ams, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM ams.staff_profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION ams.is_ams_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ams, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM ams.staff_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff') AND is_active = TRUE
  );
$$;

-- ─── clients ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ams.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_type TEXT NOT NULL DEFAULT 'individual'
    CHECK (client_type IN ('business', 'individual')),
  business_name TEXT,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  line_user_id TEXT,
  address TEXT,
  notes TEXT,
  created_by UUID REFERENCES ams.staff_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT clients_contact_required CHECK (
    email IS NOT NULL OR phone IS NOT NULL OR line_user_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON ams.clients (email)
  WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_name ON ams.clients (contact_name);

DROP TRIGGER IF EXISTS clients_updated_at ON ams.clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON ams.clients
  FOR EACH ROW EXECUTE FUNCTION ams.set_updated_at();

-- ─── leads ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ams.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'other'
    CHECK (source IN ('facebook', 'other')),
  name TEXT NOT NULL,
  fb_profile_url TEXT,
  fb_psid TEXT,
  contact_note TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN (
      'new', 'contacted', 'converted_client', 'converted_staff', 'rejected'
    )),
  converted_client_id UUID REFERENCES ams.clients(id) ON DELETE SET NULL,
  converted_staff_id UUID REFERENCES ams.staff_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT leads_converted_client_status CHECK (
    converted_client_id IS NULL OR status = 'converted_client'
  ),
  CONSTRAINT leads_converted_staff_status CHECK (
    converted_staff_id IS NULL OR status = 'converted_staff'
  )
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON ams.leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_fb_psid ON ams.leads (fb_psid)
  WHERE fb_psid IS NOT NULL;

COMMENT ON COLUMN ams.leads.fb_psid IS
  'Facebook Page-Scoped ID — placeholder for future Messenger integration.';

-- ─── projects ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ams.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_token TEXT NOT NULL DEFAULT ams.generate_public_token(21),
  title TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'photography'
    CHECK (service_type IN (
      'photography', 'videography', 'editing', 'real_estate',
      'wedding', 'event', 'corporate', 'other'
    )),
  status TEXT NOT NULL DEFAULT 'capturing'
    CHECK (status IN (
      'capturing', 'editing', 'ready_for_review', 'completed', 'cancelled'
    )),
  payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'deposit_paid', 'paid', 'refunded')),
  total_amount_cents INTEGER CHECK (total_amount_cents IS NULL OR total_amount_cents >= 0),
  deposit_amount_cents INTEGER NOT NULL DEFAULT 0
    CHECK (deposit_amount_cents >= 0),
  deliver_on_deposit BOOLEAN NOT NULL DEFAULT FALSE,
  deadline DATE,
  brief TEXT,
  internal_notes TEXT,
  client_id UUID NOT NULL REFERENCES ams.clients(id) ON DELETE RESTRICT,
  staff_id UUID REFERENCES ams.staff_profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES ams.staff_profiles(id) ON DELETE SET NULL,
  ready_for_review_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  qc_escalated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT projects_token_length CHECK (char_length(public_token) >= 21),
  CONSTRAINT projects_deposit_vs_total CHECK (
    total_amount_cents IS NULL OR deposit_amount_cents <= total_amount_cents
  ),
  CONSTRAINT projects_deliver_on_deposit_requires_deposit CHECK (
    deliver_on_deposit = FALSE OR deposit_amount_cents > 0
  )
);

CREATE INDEX IF NOT EXISTS idx_projects_staff ON ams.projects (staff_id);
CREATE INDEX IF NOT EXISTS idx_projects_client ON ams.projects (client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON ams.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON ams.projects (deadline)
  WHERE status <> 'completed' AND status <> 'cancelled';
CREATE INDEX IF NOT EXISTS idx_projects_payment ON ams.projects (payment_status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_public_token ON ams.projects (public_token);

DROP TRIGGER IF EXISTS projects_updated_at ON ams.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON ams.projects
  FOR EACH ROW EXECUTE FUNCTION ams.set_updated_at();

CREATE OR REPLACE VIEW ams.projects_admin_overview
WITH (security_invoker = true)
AS
SELECT
  p.*,
  c.contact_name AS client_contact_name,
  c.business_name AS client_business_name,
  c.email AS client_email,
  s.full_name AS staff_name,
  s.email AS staff_email,
  (
    p.deadline IS NOT NULL
    AND p.deadline < CURRENT_DATE
    AND p.status NOT IN ('completed', 'cancelled')
  ) AS is_overdue,
  (
    p.status = 'ready_for_review'
    AND p.ready_for_review_at IS NOT NULL
    AND p.ready_for_review_at < NOW() - INTERVAL '48 hours'
    AND p.qc_escalated_at IS NULL
  ) AS needs_qc_escalation
FROM ams.projects p
JOIN ams.clients c ON c.id = p.client_id
LEFT JOIN ams.staff_profiles s ON s.id = p.staff_id;

-- ─── deliverables (append-only) ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ams.deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ams.projects(id) ON DELETE CASCADE,
  link TEXT NOT NULL,
  link_domain TEXT,
  version INT NOT NULL DEFAULT 1,
  notes TEXT,
  uploaded_by UUID REFERENCES ams.staff_profiles(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT deliverables_link_url CHECK (ams.is_valid_http_url(link))
);

CREATE INDEX IF NOT EXISTS idx_deliverables_project ON ams.deliverables (project_id, uploaded_at DESC);

CREATE OR REPLACE FUNCTION ams.deliverables_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_version INT;
BEGIN
  IF NOT ams.is_valid_http_url(NEW.link) THEN
    RAISE EXCEPTION 'delivery_link must be a valid http(s) URL';
  END IF;

  NEW.link_domain := ams.extract_url_domain(NEW.link);

  SELECT COALESCE(MAX(version), 0) + 1
    INTO next_version
  FROM ams.deliverables
  WHERE project_id = NEW.project_id;

  NEW.version := next_version;
  NEW.uploaded_at := COALESCE(NEW.uploaded_at, NOW());
  NEW.uploaded_by := COALESCE(NEW.uploaded_by, auth.uid());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS deliverables_before_insert ON ams.deliverables;
CREATE TRIGGER deliverables_before_insert
  BEFORE INSERT ON ams.deliverables
  FOR EACH ROW EXECUTE FUNCTION ams.deliverables_before_insert();

CREATE OR REPLACE FUNCTION ams.deliverables_immutable()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NOT ams.is_ams_admin() THEN
    RAISE EXCEPTION 'Deliverables are append-only; create a new version instead';
  END IF;
  IF TG_OP = 'DELETE' AND NOT ams.is_ams_admin() THEN
    RAISE EXCEPTION 'Only admin can delete deliverable history';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS deliverables_immutable ON ams.deliverables;
CREATE TRIGGER deliverables_immutable
  BEFORE UPDATE OR DELETE ON ams.deliverables
  FOR EACH ROW EXECUTE FUNCTION ams.deliverables_immutable();

-- ─── payments ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ams.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ams.projects(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'AUD',
  status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (status IN ('unpaid', 'deposit_paid', 'paid', 'refunded')),
  method TEXT,
  reference TEXT,
  notes TEXT,
  paid_at TIMESTAMPTZ,
  recorded_by UUID REFERENCES ams.staff_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_project ON ams.payments (project_id, created_at DESC);

DROP TRIGGER IF EXISTS payments_updated_at ON ams.payments;
CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON ams.payments
  FOR EACH ROW EXECUTE FUNCTION ams.set_updated_at();

CREATE OR REPLACE FUNCTION ams.is_valid_payment_transition(old_status TEXT, new_status TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT old_status IS NOT DISTINCT FROM new_status
    OR (old_status, new_status) IN (
      ('unpaid', 'deposit_paid'),
      ('unpaid', 'paid'),
      ('deposit_paid', 'paid'),
      ('unpaid', 'refunded'),
      ('deposit_paid', 'refunded'),
      ('paid', 'refunded'),
      ('refunded', 'unpaid')
    );
$$;

CREATE OR REPLACE FUNCTION ams.payments_before_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ams, public
AS $$
DECLARE
  current_status TEXT;
BEGIN
  SELECT payment_status INTO current_status
  FROM ams.projects
  WHERE id = NEW.project_id
  FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Project not found for payment';
  END IF;

  IF NOT ams.is_valid_payment_transition(current_status, NEW.status) THEN
    RAISE EXCEPTION 'Invalid payment transition: % → %', current_status, NEW.status;
  END IF;

  IF current_status = 'refunded' AND NEW.status = 'unpaid'
     AND NOT ams.is_ams_admin() THEN
    RAISE EXCEPTION 'Only admin can reopen payment_status from refunded to unpaid';
  END IF;

  IF NEW.status IN ('deposit_paid', 'paid') AND NEW.paid_at IS NULL THEN
    NEW.paid_at := NOW();
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION ams.payments_after_write_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ams, public
AS $$
DECLARE
  old_status TEXT;
BEGIN
  SELECT payment_status INTO old_status FROM ams.projects WHERE id = NEW.project_id;

  UPDATE ams.projects
  SET
    payment_status = NEW.status,
    updated_at = NOW()
  WHERE id = NEW.project_id;

  INSERT INTO ams.activity_logs (
    actor_id, entity_type, entity_id, action, from_value, to_value, meta
  ) VALUES (
    auth.uid(),
    'payment',
    NEW.id,
    'payment_status_synced',
    jsonb_build_object('payment_status', old_status),
    jsonb_build_object('payment_status', NEW.status, 'amount_cents', NEW.amount_cents),
    jsonb_build_object('project_id', NEW.project_id)
  );

  RETURN NEW;
END;
$$;

-- activity_logs must exist before payments_after_write_sync runs at runtime;
-- table created below; function body resolves at execute time.

CREATE OR REPLACE FUNCTION ams.projects_payment_status_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    IF NOT ams.is_valid_payment_transition(OLD.payment_status, NEW.payment_status) THEN
      RAISE EXCEPTION 'Invalid payment transition: % → %', OLD.payment_status, NEW.payment_status;
    END IF;

    IF OLD.payment_status = 'refunded' AND NEW.payment_status = 'unpaid'
       AND NOT ams.is_ams_admin() THEN
      RAISE EXCEPTION 'Only admin can reopen payment_status from refunded to unpaid';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION ams.can_release_deliverable(
  p_payment_status TEXT,
  p_deliver_on_deposit BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    p_payment_status = 'paid'
    OR (p_payment_status = 'deposit_paid' AND p_deliver_on_deposit IS TRUE);
$$;

-- ─── staff_agreements ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ams.staff_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES ams.staff_profiles(id) ON DELETE CASCADE,
  agreement_version TEXT NOT NULL,
  agreement_type TEXT NOT NULL DEFAULT 'nda'
    CHECK (agreement_type IN ('nda', 'contractor', 'privacy', 'other')),
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  UNIQUE (staff_id, agreement_type, agreement_version)
);

CREATE INDEX IF NOT EXISTS idx_staff_agreements_staff ON ams.staff_agreements (staff_id);

-- ─── activity_logs ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ams.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES ams.staff_profiles(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL
    CHECK (entity_type IN (
      'project', 'deliverable', 'payment', 'client', 'staff_profile', 'lead', 'system'
    )),
  entity_id UUID,
  action TEXT NOT NULL,
  from_value JSONB,
  to_value JSONB,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_entity
  ON ams.activity_logs (entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor
  ON ams.activity_logs (actor_id, created_at DESC);

CREATE OR REPLACE FUNCTION ams.log_activity(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_from JSONB DEFAULT NULL,
  p_to JSONB DEFAULT NULL,
  p_meta JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ams, public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO ams.activity_logs (
    actor_id, entity_type, entity_id, action, from_value, to_value, meta
  ) VALUES (
    auth.uid(), p_entity_type, p_entity_id, p_action, p_from, p_to, COALESCE(p_meta, '{}'::jsonb)
  )
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Payment triggers (after activity_logs exists)
DROP TRIGGER IF EXISTS payments_before_write ON ams.payments;
DROP TRIGGER IF EXISTS payments_after_write_sync ON ams.payments;

CREATE TRIGGER payments_before_write
  BEFORE INSERT OR UPDATE OF status, amount_cents, paid_at ON ams.payments
  FOR EACH ROW EXECUTE FUNCTION ams.payments_before_write();

CREATE TRIGGER payments_after_write_sync
  AFTER INSERT OR UPDATE OF status ON ams.payments
  FOR EACH ROW EXECUTE FUNCTION ams.payments_after_write_sync();

DROP TRIGGER IF EXISTS projects_payment_status_guard ON ams.projects;
CREATE TRIGGER projects_payment_status_guard
  BEFORE UPDATE OF payment_status ON ams.projects
  FOR EACH ROW EXECUTE FUNCTION ams.projects_payment_status_guard();

-- ─── Quality / status guards ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION ams.projects_status_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ams, public
AS $$
DECLARE
  actor_role TEXT;
BEGIN
  actor_role := ams.ams_role();

  IF actor_role = 'staff' THEN
    IF NEW.staff_id IS DISTINCT FROM OLD.staff_id
       OR NEW.client_id IS DISTINCT FROM OLD.client_id
       OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
       OR NEW.public_token IS DISTINCT FROM OLD.public_token
       OR NEW.deposit_amount_cents IS DISTINCT FROM OLD.deposit_amount_cents
       OR NEW.total_amount_cents IS DISTINCT FROM OLD.total_amount_cents
       OR NEW.deliver_on_deposit IS DISTINCT FROM OLD.deliver_on_deposit THEN
      RAISE EXCEPTION 'Staff cannot change assignment, payment, or public_token';
    END IF;
  END IF;

  IF NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' THEN
    IF actor_role IS DISTINCT FROM 'admin' THEN
      RAISE EXCEPTION 'Quality gate: only admin can mark a project Completed';
    END IF;
    NEW.completed_at := COALESCE(NEW.completed_at, NOW());
  END IF;

  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'ready_for_review' AND OLD.status IS DISTINCT FROM 'ready_for_review' THEN
      NEW.ready_for_review_at := NOW();
      NEW.qc_escalated_at := NULL;
    END IF;

    IF actor_role = 'staff' THEN
      IF NEW.status NOT IN ('capturing', 'editing', 'ready_for_review') THEN
        RAISE EXCEPTION 'Staff may only set status to capturing, editing, or ready_for_review';
      END IF;
    END IF;

    PERFORM ams.log_activity(
      'project',
      NEW.id,
      'status_changed',
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      jsonb_build_object('role', actor_role)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_status_guard ON ams.projects;
CREATE TRIGGER projects_status_guard
  BEFORE UPDATE ON ams.projects
  FOR EACH ROW EXECUTE FUNCTION ams.projects_status_guard();

-- ─── Internal tracking (ams) + public wrapper ───────────────────────────────

CREATE OR REPLACE FUNCTION ams.get_project_tracking(p_token TEXT)
RETURNS TABLE (
  title TEXT,
  service_type TEXT,
  status TEXT,
  deadline DATE,
  payment_status TEXT,
  progress_pct INT,
  deliverable_link TEXT,
  deliverable_version INT,
  deliverable_uploaded_at TIMESTAMPTZ,
  is_overdue BOOLEAN,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ams, public
AS $$
DECLARE
  proj ams.projects%ROWTYPE;
  latest ams.deliverables%ROWTYPE;
  can_see_link BOOLEAN;
BEGIN
  IF p_token IS NULL OR char_length(btrim(p_token)) < 21 THEN
    RETURN;
  END IF;

  SELECT * INTO proj
  FROM ams.projects
  WHERE public_token = btrim(p_token)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  SELECT * INTO latest
  FROM ams.deliverables d
  WHERE d.project_id = proj.id
  ORDER BY d.version DESC
  LIMIT 1;

  can_see_link := ams.can_release_deliverable(
    proj.payment_status,
    proj.deliver_on_deposit
  );

  RETURN QUERY SELECT
    proj.title,
    proj.service_type,
    proj.status,
    proj.deadline,
    proj.payment_status,
    CASE proj.status
      WHEN 'capturing' THEN 25
      WHEN 'editing' THEN 50
      WHEN 'ready_for_review' THEN 75
      WHEN 'completed' THEN 100
      WHEN 'cancelled' THEN 0
      ELSE 0
    END::INT,
    CASE WHEN can_see_link THEN latest.link ELSE NULL END,
    CASE WHEN can_see_link THEN latest.version ELSE NULL END,
    CASE WHEN can_see_link THEN latest.uploaded_at ELSE NULL END,
    (
      proj.deadline IS NOT NULL
      AND proj.deadline < CURRENT_DATE
      AND proj.status NOT IN ('completed', 'cancelled')
    ),
    proj.updated_at;
END;
$$;

-- Thin public wrapper — ONLY anon/authenticated entry for client tracking.
-- search_path locked to public; every AMS reference is schema-qualified.
CREATE OR REPLACE FUNCTION public.get_project_tracking(p_token TEXT)
RETURNS TABLE (
  title TEXT,
  service_type TEXT,
  status TEXT,
  deadline DATE,
  payment_status TEXT,
  progress_pct INT,
  deliverable_link TEXT,
  deliverable_version INT,
  deliverable_uploaded_at TIMESTAMPTZ,
  is_overdue BOOLEAN,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM ams.get_project_tracking(p_token);
$$;

REVOKE ALL ON FUNCTION public.get_project_tracking(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_project_tracking(TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION ams.get_project_tracking(TEXT) FROM PUBLIC;
-- authenticated may call via ams schema after Exposed Schemas; anon must use public wrapper only

CREATE OR REPLACE FUNCTION ams.submit_deliverable(
  p_project_id UUID,
  p_link TEXT,
  p_notes TEXT DEFAULT NULL,
  p_mark_ready BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ams, public
AS $$
DECLARE
  proj ams.projects%ROWTYPE;
  new_id UUID;
  actor_role TEXT;
BEGIN
  actor_role := ams.ams_role();
  IF actor_role IS NULL THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT * INTO proj FROM ams.projects WHERE id = p_project_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  IF actor_role = 'staff' AND proj.staff_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Staff may only submit deliverables for assigned projects';
  END IF;

  INSERT INTO ams.deliverables (project_id, link, notes, uploaded_by)
  VALUES (p_project_id, p_link, p_notes, auth.uid())
  RETURNING id INTO new_id;

  PERFORM ams.log_activity(
    'deliverable',
    new_id,
    'submitted',
    NULL,
    jsonb_build_object('link', p_link, 'project_id', p_project_id),
    '{}'::jsonb
  );

  IF p_mark_ready THEN
    UPDATE ams.projects
    SET status = 'ready_for_review'
    WHERE id = p_project_id;
  END IF;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION ams.submit_deliverable(UUID, TEXT, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION ams.submit_deliverable(UUID, TEXT, TEXT, BOOLEAN) TO authenticated;

CREATE OR REPLACE FUNCTION ams.escalate_stale_qc_reviews()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ams, public
AS $$
DECLARE
  r RECORD;
  cnt INT := 0;
BEGIN
  FOR r IN
    SELECT id, title, ready_for_review_at
    FROM ams.projects
    WHERE status = 'ready_for_review'
      AND ready_for_review_at IS NOT NULL
      AND ready_for_review_at < NOW() - INTERVAL '48 hours'
      AND qc_escalated_at IS NULL
  LOOP
    UPDATE ams.projects SET qc_escalated_at = NOW() WHERE id = r.id;

    INSERT INTO ams.activity_logs (
      actor_id, entity_type, entity_id, action, from_value, to_value, meta
    ) VALUES (
      NULL, 'project', r.id, 'qc_escalated',
      jsonb_build_object('ready_for_review_at', r.ready_for_review_at),
      jsonb_build_object('qc_escalated_at', NOW()),
      jsonb_build_object('title', r.title, 'reason', 'admin_review_overdue_48h')
    );

    cnt := cnt + 1;
  END LOOP;
  RETURN cnt;
END;
$$;

CREATE OR REPLACE FUNCTION ams.projects_needing_deadline_nudge(p_within_hours INT DEFAULT 48)
RETURNS TABLE (
  project_id UUID,
  title TEXT,
  deadline DATE,
  staff_id UUID,
  staff_email TEXT,
  staff_line_user_id TEXT,
  has_deliverable BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ams, public
AS $$
  SELECT
    p.id,
    p.title,
    p.deadline,
    p.staff_id,
    s.email,
    s.line_user_id,
    EXISTS (SELECT 1 FROM ams.deliverables d WHERE d.project_id = p.id)
  FROM ams.projects p
  LEFT JOIN ams.staff_profiles s ON s.id = p.staff_id
  WHERE p.status NOT IN ('completed', 'cancelled')
    AND p.deadline IS NOT NULL
    AND p.deadline <= (CURRENT_DATE + ((p_within_hours / 24.0) || ' days')::INTERVAL)
    AND NOT EXISTS (SELECT 1 FROM ams.deliverables d WHERE d.project_id = p.id);
$$;

COMMENT ON FUNCTION public.get_project_tracking IS
  'Public client tracking wrapper → ams.get_project_tracking. Only anon entry into AMS data.';
