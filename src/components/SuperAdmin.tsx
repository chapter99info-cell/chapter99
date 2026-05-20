import { isSupabaseConfigured } from '../lib/supabase';
import { SyncResult } from '../types';

interface SuperAdminProps {
  onSync: () => Promise<SyncResult>;
  syncMessage: string;
}

export function SuperAdmin({ onSync, syncMessage }: SuperAdminProps) {
  return (
    <section className="dashboard-grid" aria-label="Super admin dashboard">
      <div className="panel hero-panel">
        <p className="eyebrow">Super Admin</p>
        <h2>System control</h2>
        <p>Validate environment configuration, trigger sync, and review deployment readiness.</p>
      </div>

      <div className="panel">
        <h3>Configuration</h3>
        <ul className="stack-list">
          <li>
            <span>
              <strong>Supabase</strong>
              <small>VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</small>
            </span>
            <span className={`status-pill ${isSupabaseConfigured ? 'active' : 'expiring'}`}>
              {isSupabaseConfigured ? 'ready' : 'missing'}
            </span>
          </li>
          <li>
            <span>
              <strong>Google Sheets webhook</strong>
              <small>VITE_GOOGLE_SHEETS_WEBHOOK_URL</small>
            </span>
            <span className="status-pill expiring">runtime check</span>
          </li>
        </ul>
      </div>

      <div className="panel">
        <h3>Data sync</h3>
        <button type="button" onClick={() => void onSync()}>
          Sync expenses to Sheets
        </button>
        <p className="muted">{syncMessage}</p>
      </div>

      <div className="panel">
        <h3>Deployment checklist</h3>
        <p className="muted">
          Deploy Edge Functions, configure secrets, run SQL 00-03, then complete the PWA test checklist.
        </p>
      </div>
    </section>
  );
}
