import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AGENCY_CONFIG } from '../../lib/agency-config'
import { brandColor, useBrandStyle } from '../../lib/useBrand'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminPinPad from './AdminPinPad'

/**
 * Agency Hub login — PIN only (mobile-first).
 * Email/password removed; AMS JWT (if needed) is exchanged server-side after PIN verify.
 * Staff portal at /staff keeps its own email/password login untouched.
 */
export default function AdminLogin() {
  const { isAuthenticated, signInWithPin, loading, configured } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')

  const locationState = location.state as {
    from?: { pathname?: string }
  } | null
  const from = locationState?.from?.pathname ?? '/admin'

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handlePinSubmit(pin: string) {
    setError('')
    try {
      await signInWithPin(pin)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PIN login failed')
    }
  }

  const brandStyle = useBrandStyle()
  const primary = brandColor('primary')

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10 sm:py-12"
      style={{ ...brandStyle, backgroundColor: brandColor('background') }}
    >
      <div
        className="w-full max-w-md rounded-2xl border-2 bg-white p-6 shadow-lg sm:p-8"
        style={{ borderColor: primary }}
      >
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: brandColor('text') }}
        >
          {AGENCY_CONFIG.brandName} Admin
        </h1>
        <p className="mt-2 text-base" style={{ color: brandColor('textMuted') }}>
          Enter your 4-digit PIN · กรอกรหัส PIN 4 หลัก
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Supabase environment variables are missing. Configure them in Vercel
            before logging in.
          </p>
        )}

        {error && (
          <p
            className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-base text-red-800"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-8">
          <AdminPinPad onSubmit={handlePinSubmit} disabled={!configured} />
        </div>
      </div>
    </div>
  )
}
