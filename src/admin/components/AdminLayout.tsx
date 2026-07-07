import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAdminAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1A1A1A]">
      <header className="sticky top-0 z-30 border-b-2 border-[#2D5016] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-bold text-[#2D5016]">Chapter99 Admin</p>
            <p className="text-sm text-[#6B7280]">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border-2 border-[#1A1A1A] bg-white px-4 py-2 text-base font-semibold hover:bg-[#F8F5F0]"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
