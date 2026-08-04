import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AGENCY_CONFIG } from '../../lib/agency-config'
import { brandColor, useBrandStyle } from '../../lib/useBrand'
import { useAdminAuth } from '../contexts/AdminAuthContext'

const NAV = [
  { to: '/admin', label: 'Projects', end: true },
  { to: '/admin/ams', label: 'AMS' },
  { to: '/admin/ams/leads', label: 'Leads' },
  { to: '/admin/briefing', label: 'Briefing' },
  { to: '/admin/jobs', label: 'งานลูกค้า' },
  { to: '/admin/finance', label: 'Finance' },
  { to: '/admin/tax', label: 'Tax Summary' },
  { to: '/admin/tasks', label: 'Tasks' },
  { to: '/admin/workflow', label: 'Workflow' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAdminAuth()
  const navigate = useNavigate()
  const brandStyle = useBrandStyle()
  const primary = brandColor('primary')

  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen" style={{ ...brandStyle, backgroundColor: brandColor('background'), color: brandColor('text') }}>
      <header className="sticky top-0 z-30 border-b-2 bg-white" style={{ borderColor: primary }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-bold" style={{ color: primary }}>
              {AGENCY_CONFIG.brandName} Agency Hub
            </p>
            <p className="text-sm" style={{ color: brandColor('textMuted') }}>
              {user?.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <nav
              className="flex flex-wrap gap-1 rounded-lg border p-1"
              style={{ borderColor: brandColor('border'), backgroundColor: brandColor('background') }}
              aria-label="Admin sections"
            >
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive ? 'text-white' : ''
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { backgroundColor: primary }
                      : { color: brandColor('text') }
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border-2 bg-white px-4 py-2 text-base font-semibold"
              style={{ borderColor: brandColor('text') }}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
