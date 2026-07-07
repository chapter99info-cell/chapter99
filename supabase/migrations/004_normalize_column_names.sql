-- Normalize agency admin: plural lowercase table names + snake_case columns
-- Target: jjbwiriphyxsnrnpoqnn (chapter99info.com/admin)
-- Frontend expects: clients, projects, tasks, billing, prompts + snake_case columns
-- Safe to re-run (IF EXISTS checks on every rename)

CREATE OR REPLACE FUNCTION rename_column_if_exists(
  p_table regclass,
  p_old text,
  p_new text
) RETURNS void AS $$
DECLARE
  v_table text := trim(both '"' from split_part(p_table::text, '.', greatest(1, array_length(string_to_array(p_table::text, '.'), 1))));
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = v_table
      AND column_name = p_old
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = v_table
      AND column_name = p_new
  ) THEN
    EXECUTE format('ALTER TABLE %s RENAME COLUMN %I TO %I', p_table, p_old, p_new);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 1. Normalize table names → plural lowercase (match frontend .from('clients') etc.)
DO $$ BEGIN
  IF to_regclass('public."Client"') IS NOT NULL AND to_regclass('public.clients') IS NULL THEN
    ALTER TABLE "Client" RENAME TO clients;
  END IF;
  IF to_regclass('public.client') IS NOT NULL AND to_regclass('public.clients') IS NULL THEN
    ALTER TABLE client RENAME TO clients;
  END IF;

  IF to_regclass('public."Project"') IS NOT NULL AND to_regclass('public.projects') IS NULL THEN
    ALTER TABLE "Project" RENAME TO projects;
  END IF;
  IF to_regclass('public.project') IS NOT NULL AND to_regclass('public.projects') IS NULL THEN
    ALTER TABLE project RENAME TO projects;
  END IF;

  IF to_regclass('public."Task"') IS NOT NULL AND to_regclass('public.tasks') IS NULL THEN
    ALTER TABLE "Task" RENAME TO tasks;
  END IF;
  IF to_regclass('public.task') IS NOT NULL AND to_regclass('public.tasks') IS NULL THEN
    ALTER TABLE task RENAME TO tasks;
  END IF;

  IF to_regclass('public."Billing"') IS NOT NULL AND to_regclass('public.billing') IS NULL THEN
    ALTER TABLE "Billing" RENAME TO billing;
  END IF;
END $$;

-- 2. Rename camelCase columns → snake_case (from frontend agencyMappers.ts + agencyService.ts)
DO $$ BEGIN
  -- clients: business_name, contact_name, email, phone, created_at
  IF to_regclass('public.clients') IS NOT NULL THEN
    PERFORM rename_column_if_exists('clients', 'businessName', 'business_name');
    PERFORM rename_column_if_exists('clients', 'contactName', 'contact_name');
    PERFORM rename_column_if_exists('clients', 'createdAt', 'created_at');
  END IF;

  -- projects: client_id, project_type, status, drive_folder_url, contract_url, created_at, updated_at
  IF to_regclass('public.projects') IS NOT NULL THEN
    PERFORM rename_column_if_exists('projects', 'clientId', 'client_id');
    PERFORM rename_column_if_exists('projects', 'projectType', 'project_type');
    PERFORM rename_column_if_exists('projects', 'driveFolderUrl', 'drive_folder_url');
    PERFORM rename_column_if_exists('projects', 'contractUrl', 'contract_url');
    PERFORM rename_column_if_exists('projects', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('projects', 'updatedAt', 'updated_at');
  END IF;

  -- tasks: project_id, department_id, assignee, status, title, prompt_or_spec, notes, created_at, updated_at
  IF to_regclass('public.tasks') IS NOT NULL THEN
    PERFORM rename_column_if_exists('tasks', 'projectId', 'project_id');
    PERFORM rename_column_if_exists('tasks', 'departmentId', 'department_id');
    PERFORM rename_column_if_exists('tasks', 'promptOrSpec', 'prompt_or_spec');
    PERFORM rename_column_if_exists('tasks', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('tasks', 'updatedAt', 'updated_at');
  END IF;

  -- billing: project_id, total_amount, deposit_paid, final_paid, quotation_url, invoice_url, receipt_url, created_at
  IF to_regclass('public.billing') IS NOT NULL THEN
    PERFORM rename_column_if_exists('billing', 'projectId', 'project_id');
    PERFORM rename_column_if_exists('billing', 'totalAmount', 'total_amount');
    PERFORM rename_column_if_exists('billing', 'depositPaid', 'deposit_paid');
    PERFORM rename_column_if_exists('billing', 'finalPaid', 'final_paid');
    PERFORM rename_column_if_exists('billing', 'quotationUrl', 'quotation_url');
    PERFORM rename_column_if_exists('billing', 'invoiceUrl', 'invoice_url');
    PERFORM rename_column_if_exists('billing', 'receiptUrl', 'receipt_url');
    PERFORM rename_column_if_exists('billing', 'createdAt', 'created_at');
  END IF;

  -- prompts: agent, department, prompt_text, created_at, updated_at
  IF to_regclass('public.prompts') IS NOT NULL THEN
    PERFORM rename_column_if_exists('prompts', 'promptText', 'prompt_text');
    PERFORM rename_column_if_exists('prompts', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('prompts', 'updatedAt', 'updated_at');
  END IF;
END $$;

-- 3. Add columns frontend reads but may be missing after manual schema creation
DO $$ BEGIN
  IF to_regclass('public.tasks') IS NOT NULL THEN
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
  IF to_regclass('public.projects') IS NOT NULL THEN
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
  IF to_regclass('public.billing') IS NOT NULL THEN
    ALTER TABLE billing ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
  IF to_regclass('public.prompts') IS NOT NULL THEN
    ALTER TABLE prompts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE prompts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

DROP FUNCTION IF EXISTS rename_column_if_exists(regclass, text, text);

-- 4. RLS on normalized tables
DO $$ BEGIN
  IF to_regclass('public.clients') IS NOT NULL THEN
    ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_clients" ON clients;
    CREATE POLICY "auth_read_write_clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF to_regclass('public.projects') IS NOT NULL THEN
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_projects" ON projects;
    CREATE POLICY "auth_read_write_projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF to_regclass('public.tasks') IS NOT NULL THEN
    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_tasks" ON tasks;
    CREATE POLICY "auth_read_write_tasks" ON tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF to_regclass('public.billing') IS NOT NULL THEN
    ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_billing" ON billing;
    CREATE POLICY "auth_read_write_billing" ON billing FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF to_regclass('public.prompts') IS NOT NULL THEN
    ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_prompts" ON prompts;
    CREATE POLICY "auth_read_write_prompts" ON prompts FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
