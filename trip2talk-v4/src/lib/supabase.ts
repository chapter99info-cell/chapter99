import { createClient } from '@supabase/supabase-js';
const URL = import.meta.env.VITE_SUPABASE_URL as string;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
if (!URL || !KEY) throw new Error('Missing Supabase env vars');
export const supabase = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { params: { eventsPerSecond: 10 } },
});
