-- Finalize snake_case columns across all agency tables (idempotent)
-- Target: jjbwiriphyxsnrnpoqnn — tables: client, project, task, billing, prompts
-- Safe to re-run: only renames when camelCase exists and snake_case does not

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

DO $$ BEGIN
  -- client
  IF to_regclass('public.client') IS NOT NULL THEN
    PERFORM rename_column_if_exists('client', 'businessName', 'business_name');
    PERFORM rename_column_if_exists('client', 'contactName', 'contact_name');
    PERFORM rename_column_if_exists('client', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('client', 'updatedAt', 'updated_at');
  END IF;

  -- project
  IF to_regclass('public.project') IS NOT NULL THEN
    PERFORM rename_column_if_exists('project', 'clientId', 'client_id');
    PERFORM rename_column_if_exists('project', 'projectType', 'project_type');
    PERFORM rename_column_if_exists('project', 'driveFolderUrl', 'drive_folder_url');
    PERFORM rename_column_if_exists('project', 'contractUrl', 'contract_url');
    PERFORM rename_column_if_exists('project', 'liveWebUrl', 'live_web_url');
    PERFORM rename_column_if_exists('project', 'galleryUrl', 'gallery_url');
    PERFORM rename_column_if_exists('project', 'googleMapsEmbedUrl', 'google_maps_embed_url');
    PERFORM rename_column_if_exists('project', 'googleReviewLink', 'google_review_link');
    PERFORM rename_column_if_exists('project', 'facebookUrl', 'facebook_url');
    PERFORM rename_column_if_exists('project', 'lineOaUrl', 'line_oa_url');
    PERFORM rename_column_if_exists('project', 'projectSpec', 'project_spec');
    PERFORM rename_column_if_exists('project', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('project', 'updatedAt', 'updated_at');
  END IF;

  -- task
  IF to_regclass('public.task') IS NOT NULL THEN
    PERFORM rename_column_if_exists('task', 'projectId', 'project_id');
    PERFORM rename_column_if_exists('task', 'departmentId', 'department_id');
    PERFORM rename_column_if_exists('task', 'promptOrSpec', 'prompt_or_spec');
    PERFORM rename_column_if_exists('task', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('task', 'updatedAt', 'updated_at');
  END IF;

  -- billing
  IF to_regclass('public.billing') IS NOT NULL THEN
    PERFORM rename_column_if_exists('billing', 'projectId', 'project_id');
    PERFORM rename_column_if_exists('billing', 'totalAmount', 'total_amount');
    PERFORM rename_column_if_exists('billing', 'totalAmountAud', 'total_amount_aud');
    PERFORM rename_column_if_exists('billing', 'gstAmountAud', 'gst_amount_aud');
    PERFORM rename_column_if_exists('billing', 'paymentReceivedDate', 'payment_received_date');
    PERFORM rename_column_if_exists('billing', 'depositPaid', 'deposit_paid');
    PERFORM rename_column_if_exists('billing', 'finalPaid', 'final_paid');
    PERFORM rename_column_if_exists('billing', 'quotationUrl', 'quotation_url');
    PERFORM rename_column_if_exists('billing', 'invoiceUrl', 'invoice_url');
    PERFORM rename_column_if_exists('billing', 'receiptUrl', 'receipt_url');
    PERFORM rename_column_if_exists('billing', 'createdAt', 'created_at');
  END IF;

  -- prompts
  IF to_regclass('public.prompts') IS NOT NULL THEN
    PERFORM rename_column_if_exists('prompts', 'promptText', 'prompt_text');
    PERFORM rename_column_if_exists('prompts', 'createdAt', 'created_at');
    PERFORM rename_column_if_exists('prompts', 'updatedAt', 'updated_at');
  END IF;
END $$;

-- Add timestamp columns if missing after manual schema creation
DO $$ BEGIN
  IF to_regclass('public.task') IS NOT NULL THEN
    ALTER TABLE task ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE task ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
  IF to_regclass('public.prompts') IS NOT NULL THEN
    ALTER TABLE prompts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE prompts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

DROP FUNCTION IF EXISTS rename_column_if_exists(regclass, text, text);

NOTIFY pgrst, 'reload schema';
