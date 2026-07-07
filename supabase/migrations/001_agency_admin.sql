-- Chapter99 Agency Admin — run in Supabase SQL Editor
-- Project: chapter99info-cell's Project (euiwkvozrhnbxtttfuchh) or dedicated agency project

-- Enums
CREATE TYPE project_type AS ENUM ('DIGITAL_APP', 'PHOTOGRAPHY', 'FULL_SERVICE');
CREATE TYPE project_status AS ENUM ('NEW_BRIEF', 'IN_PROGRESS', 'QA_REVIEW', 'DELIVERED', 'CANCELLED');
CREATE TYPE task_assignee AS ENUM ('CLAUDE', 'GEMINI', 'CURSOR', 'PHEE_SAEN');
CREATE TYPE task_status AS ENUM ('TODO', 'DOING', 'IN_REVIEW', 'DONE');
CREATE TYPE prompt_agent AS ENUM ('CLAUDE', 'GEMINI', 'CURSOR');

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_type project_type NOT NULL DEFAULT 'DIGITAL_APP',
  status project_status NOT NULL DEFAULT 'NEW_BRIEF',
  drive_folder_url TEXT NOT NULL DEFAULT '',
  contract_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
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

-- Billing
CREATE TABLE billing (
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

-- Prompt library (per AI agent + department)
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent prompt_agent NOT NULL,
  department SMALLINT NOT NULL CHECK (department BETWEEN 1 AND 9),
  prompt_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Row Level Security — authenticated admin only
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read_write_clients" ON clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_read_write_projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_read_write_tasks" ON tasks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_read_write_billing" ON billing
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_read_write_prompts" ON prompts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default prompts per agent (optional starter library)
INSERT INTO prompts (agent, department, prompt_text) VALUES
  ('CLAUDE', 1, 'Analyse this client brief and produce a structured spec with risks, data model notes, and Cursor-ready tasks.'),
  ('CLAUDE', 8, 'Review analytics requirements and define KPIs for this project.'),
  ('GEMINI', 2, 'Propose mood board directions and visual references for this Thai-Australian business.'),
  ('GEMINI', 3, 'Write bilingual EN/TH copy for homepage hero, services, and CTA buttons.'),
  ('GEMINI', 7, 'Draft a social media content calendar for the next 2 weeks.'),
  ('CURSOR', 4, 'Implement the attached spec on a feature branch. Do not push to main. Match existing code style.');
