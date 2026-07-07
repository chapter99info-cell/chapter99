import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import type { ReactNode } from 'react'

export default function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAdminAuth()
  const location = useLocation()

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0] p-6">
        <div className="max-w-md rounded-xl border-2 border-[#2D5016] bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#1A1A1A]">Supabase not configured</h1>
          <p className="mt-3 text-base text-[#6B7280]">
            Set <code className="text-sm">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-sm">VITE_SUPABASE_ANON_KEY</code> in Vercel environment
            variables.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0] text-lg text-[#1A1A1A]">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
