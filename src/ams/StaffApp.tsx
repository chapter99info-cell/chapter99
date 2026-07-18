import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import type { AmsProject, ProjectStatus, StaffProfile } from '../types/ams'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { listStaffAssignments } from '../lib/ams/service'
import { AGENCY_CONFIG } from '../lib/agency-config'
import { brandColor, useBrandStyle } from '../lib/useBrand'
import AmsProtectedRoute from './AmsProtectedRoute'
import StaffProjectCard from './components/StaffProjectCard'

function StaffLogin() {
  const navigate = useNavigate()
  const brandStyle = useBrandStyle()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) navigate('/staff', { replace: true })
      setChecking(false)
    })
  }, [navigate])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) throw authError
      navigate('/staff', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  if (checking) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ ...brandStyle, backgroundColor: brandColor('background') }}
      >
        Loading…
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ ...brandStyle, backgroundColor: brandColor('background') }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-6"
        style={{ borderColor: brandColor('border') }}
      >
        <h1 className="font-serif text-2xl font-bold" style={{ color: brandColor('primary') }}>
          {AGENCY_CONFIG.brandName} Staff
        </h1>
        <p className="text-sm" style={{ color: brandColor('textMuted') }}>
          Sign in with Supabase email/password (JWT required for AMS)
        </p>
        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2.5"
            style={{ borderColor: brandColor('border') }}
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2.5"
            style={{ borderColor: brandColor('border') }}
          />
        </label>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || !isSupabaseConfigured}
          className="w-full rounded-lg py-3 font-semibold text-white"
          style={{ backgroundColor: brandColor('primary') }}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

function StaffDashboard({ profile }: { profile: StaffProfile }) {
  const brandStyle = useBrandStyle()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<
    Pick<AmsProject, 'id' | 'title' | 'status' | 'deadline' | 'service_type'>[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProjects(await listStaffAssignments())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/staff/login', { replace: true })
  }

  return (
    <div
      className="min-h-screen"
      style={{ ...brandStyle, backgroundColor: brandColor('background'), color: brandColor('text') }}
    >
      <header
        className="sticky top-0 z-20 border-b bg-white"
        style={{ borderColor: brandColor('primary') }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="font-bold" style={{ color: brandColor('primary') }}>
              Staff jobs
            </p>
            <p className="text-sm" style={{ color: brandColor('textMuted') }}>
              {profile.full_name ?? profile.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-lg border px-3 py-2 text-sm font-semibold"
            style={{ borderColor: brandColor('border') }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <p className="text-sm" style={{ color: brandColor('textMuted') }}>
          Update status from the field. Each upload creates a new deliverable version.
        </p>
        {error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {loading ? (
          <p className="text-center text-sm" style={{ color: brandColor('textMuted') }}>
            Loading…
          </p>
        ) : projects.length === 0 && !error ? (
          <p
            className="rounded-2xl border bg-white px-4 py-10 text-center text-sm"
            style={{ borderColor: brandColor('border'), color: brandColor('textMuted') }}
          >
            No active assignments.
          </p>
        ) : (
          projects.map((p) => (
            <StaffProjectCard
              key={p.id}
              project={{
                id: p.id,
                title: p.title,
                status: p.status as ProjectStatus,
                deadline: p.deadline,
                service_type: p.service_type,
              }}
              onChanged={() => void load()}
            />
          ))
        )}
      </main>
    </div>
  )
}

export default function StaffApp() {
  return (
    <Routes>
      <Route path="login" element={<StaffLogin />} />
      <Route
        index
        element={
          <AmsProtectedRoute roles={['staff', 'admin']} loginPath="/staff/login">
            {(profile) => <StaffDashboard profile={profile} />}
          </AmsProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/staff" replace />} />
    </Routes>
  )
}
