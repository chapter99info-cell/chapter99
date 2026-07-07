import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { AGENCY_CONFIG } from '../../lib/agency-config'
import { brandColor, useBrandStyle } from '../../lib/useBrand'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export default function AdminLogin() {
  const { signIn, user, loading, configured } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin'

  if (!loading && user) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const brandStyle = useBrandStyle()
  const primary = brandColor('primary')

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ ...brandStyle, backgroundColor: brandColor('background') }}
    >
      <div
        className="w-full max-w-md rounded-2xl border-2 bg-white p-8 shadow-lg"
        style={{ borderColor: primary }}
      >
        <h1 className="text-2xl font-bold" style={{ color: brandColor('text') }}>
          {AGENCY_CONFIG.brandName} Admin
        </h1>
        <p className="mt-2 text-base" style={{ color: brandColor('textMuted') }}>
          Sign in with your admin account
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg bg-amber-50 border border-amber-300 p-3 text-sm text-amber-900">
            Supabase environment variables are missing. Configure them in Vercel before logging in.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-base font-semibold text-[#1A1A1A]">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-[#1A1A1A]/20 py-3 pl-11 pr-4 text-base text-[#1A1A1A] focus:border-[#2D5016] focus:outline-none"
                placeholder="admin@chapter99info.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-base font-semibold text-[#1A1A1A]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-[#1A1A1A]/20 py-3 pl-11 pr-4 text-base text-[#1A1A1A] focus:border-[#2D5016] focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-300 p-3 text-base text-red-800" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !configured}
            className="w-full rounded-lg bg-[#2D5016] py-4 text-base font-bold text-white hover:bg-[#234012] disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
