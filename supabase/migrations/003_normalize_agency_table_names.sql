-- Normalize agency admin tables: quoted PascalCase → lowercase snake_case
-- Target: jjbwiriphyxsnrnpoqnn (tables created manually as "Client", "Project", etc.)
-- Safe to re-run — each step checks existence before altering.

-- Helper: rename column if old name exists and new name does not
CREATE OR REPLACE FUNCTION rename_column_if_exists(
  p_table regclass,
  p_old text,
  p_new text
) RETURNS void AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = p_table::text
      AND column_name = p_old
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = p_table::text
      AND column_name = p_new
  ) THEN
    EXECUTE format('ALTER TABLE %s RENAME COLUMN %I TO %I', p_table, p_old, p_new);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 1. Rename PascalCase tables → lowercase (PostgREST expects unquoted lowercase)
DO $$ BEGIN
  IF to_regclass('public."Client"') IS NOT NULL AND to_regclass('public.clients') IS NULL THEN
    ALTER TABLE "Client" RENAME TO clients;
  END IF;
  IF to_regclass('public."Project"') IS NOT NULL AND to_regclass('public.projects') IS NULL THEN
    ALTER TABLE "Project" RENAME TO projects;
  END IF;
  IF to_regclass('public."Task"') IS NOT NULL AND to_regclass('public.tasks') IS NULL THEN
    ALTER TABLE "Task" RENAME TO tasks;
  END IF;
  IF to_regclass('public."Billing"') IS NOT NULL AND to_regclass('public.billing') IS NULL THEN
    ALTER TABLE "Billing" RENAME TO billing;
  END IF;
END $$;

-- 2. Rename camelCase columns → snake_case (frontend uses snake_case)
DO $$ BEGIN
  IF to_regclass('public.clients') IS NOT NULL THEN
    PERFORM rename_column_if_exists('clients', 'businessName', 'business_name');
    PERFORM rename_column_if_exists('clients', 'contactName', 'contact_name');
    PERFORM rename_column_if_exists('clients', 'createdAt', 'created_at');
  END IF;

  IF to_regclass('public.projects') IS NOT NULL THEN
    PERFORM rename_column_if_exists('projects', 'clientId', 'client_id');
    PERFORM rename_column_if_exists('projects', 'projectType', 'project_type');
    PERFORM rename_column_if_exists('projects', 'driveFolderUrl', 'drive_folder_url');
    PERFORM rename_column_if_exists('projects', 'contractUrl', 'contract_url');
    PERFORM rename_column_if_exists('projects', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('projects', 'updatedAt', 'updated_at');
  END IF;

  IF to_regclass('public.tasks') IS NOT NULL THEN
    PERFORM rename_column_if_exists('tasks', 'projectId', 'project_id');
    PERFORM rename_column_if_exists('tasks', 'departmentId', 'department_id');
    PERFORM rename_column_if_exists('tasks', 'promptOrSpec', 'prompt_or_spec');
    PERFORM rename_column_if_exists('tasks', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('tasks', 'updatedAt', 'updated_at');
  END IF;

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

  IF to_regclass('public.prompts') IS NOT NULL THEN
    PERFORM rename_column_if_exists('prompts', 'promptText', 'prompt_text');
    PERFORM rename_column_if_exists('prompts', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('prompts', 'updatedAt', 'updated_at');
  END IF;
END $$;

DROP FUNCTION IF EXISTS rename_column_if_exists(regclass, text, text);

-- 3. Ensure RLS policies exist on lowercase table names
DO $$ BEGIN
  IF to_regclass('public.clients') IS NOT NULL THEN
    ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_clients" ON clients;
    CREATE POLICY "auth_read_write_clients" ON clients
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF to_regclass('public.projects') IS NOT NULL THEN
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_projects" ON projects;
    CREATE POLICY "auth_read_write_projects" ON projects
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF to_regclass('public.tasks') IS NOT NULL THEN
    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_tasks" ON tasks;
    CREATE POLICY "auth_read_write_tasks" ON tasks
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF to_regclass('public.billing') IS NOT NULL THEN
    ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_billing" ON billing;
    CREATE POLICY "auth_read_write_billing" ON billing
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF to_regclass('public.prompts') IS NOT NULL THEN
    ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "auth_read_write_prompts" ON prompts;
    CREATE POLICY "auth_read_write_prompts" ON prompts
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
