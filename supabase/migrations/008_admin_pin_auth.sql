-- Admin PIN lockout + sessions (accessed only by Edge Function service role)
CREATE TABLE IF NOT EXISTS admin_pin_attempts (
  client_key text PRIMARY KEY,
  failed_count int NOT NULL DEFAULT 0,
  locked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_pin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_pin_sessions_token_idx ON admin_pin_sessions (session_token);
CREATE INDEX IF NOT EXISTS admin_pin_sessions_expires_idx ON admin_pin_sessions (expires_at);

ALTER TABLE admin_pin_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_pin_sessions ENABLE ROW LEVEL SECURITY;

-- No RLS policies: anon/authenticated cannot access; Edge Function uses service role.
