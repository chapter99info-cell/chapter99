-- Chapter99 Agency Admin — idempotent (safe to re-run)
-- Target: jjbwiriphyxsnrnpoqnn (Creator Network Supabase, used by chapter99info.com/admin)

-- Enums
DO $$ BEGIN
  CREATE TYPE project_type AS ENUM ('DIGITAL_APP', 'PHOTOGRAPHY', 'FULL_SERVICE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('NEW_BRIEF', 'IN_PROGRESS', 'QA_REVIEW', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_assignee AS ENUM ('CLAUDE', 'GEMINI', 'CURSOR', 'PHEE_SAEN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('TODO', 'DOING', 'IN_REVIEW', 'DONE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE prompt_agent AS ENUM ('CLAUDE', 'GEMINI', 'CURSOR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_type project_type NOT NULL DEFAULT 'DIGITAL_APP',
  status project_status NOT NULL DEFAULT 'NEW_BRIEF',
  drive_folder_url TEXT NOT NULL DEFAULT '',
  contract_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  department_id SMALLINT NOT NULL CHECK (department_id BETWEEN 1 AND 9),
  assignee task_assignee NOT NULL,
  status task_status NOT NULL DEFAULT 'TODO',
  title TEXT NOT NULL,
  prompt_or_spec TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  deposit_paid BOOLEAN NOT NULL DEFAULT false,
  final_paid BOOLEAN NOT NULL DEFAULT false,
  quotation_url TEXT NOT NULL DEFAULT '',
  invoice_url TEXT NOT NULL DEFAULT '',
  receipt_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent prompt_agent NOT NULL,
  department SMALLINT NOT NULL CHECK (department BETWEEN 1 AND 9),
  prompt_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS prompts_updated_at ON prompts;
CREATE TRIGGER prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_write_clients" ON clients;
CREATE POLICY "auth_read_write_clients" ON clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_write_projects" ON projects;
CREATE POLICY "auth_read_write_projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_write_tasks" ON tasks;
CREATE POLICY "auth_read_write_tasks" ON tasks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_write_billing" ON billing;
CREATE POLICY "auth_read_write_billing" ON billing
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_write_prompts" ON prompts;
CREATE POLICY "auth_read_write_prompts" ON prompts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed prompts (only if table is empty)
INSERT INTO prompts (agent, department, prompt_text)
SELECT v.agent, v.department, v.prompt_text
FROM (VALUES
  ('CLAUDE'::prompt_agent, 1, 'Analyse this client brief and produce a structured spec with risks, data model notes, and Cursor-ready tasks.'),
  ('CLAUDE'::prompt_agent, 8, 'Review analytics requirements and define KPIs for this project.'),
  ('GEMINI'::prompt_agent, 2, 'Propose mood board directions and visual references for this Thai-Australian business.'),
  ('GEMINI'::prompt_agent, 3, 'Write bilingual EN/TH copy for homepage hero, services, and CTA buttons.'),
  ('GEMINI'::prompt_agent, 7, 'Draft a social media content calendar for the next 2 weeks.'),
  ('CURSOR'::prompt_agent, 4, 'Implement the attached spec on a feature branch. Do not push to main. Match existing code style.')
) AS v(agent, department, prompt_text)
WHERE NOT EXISTS (SELECT 1 FROM prompts LIMIT 1);
