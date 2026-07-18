import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import type { AmsRole, StaffProfile } from '../types/ams'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { amsDb } from '../lib/ams/db'
import { brandColor, useBrandStyle } from '../lib/useBrand'
import { AGENCY_CONFIG } from '../lib/agency-config'

/**
 * AMS-only guard — separate from AdminProtectedRoute.
 * Requires a real Supabase Auth JWT (`user`) AND an active ams.staff_profiles row.
 * Never treats PIN / pinSession as authenticated.
 */
export default function AmsProtectedRoute({
  roles,
  loginPath,
  children,
}: {
  roles: AmsRole[]
  /** Where to send users who have no JWT (e.g. /admin/login or /staff/login) */
  loginPath: string
  children: ReactNode | ((profile: StaffProfile) => ReactNode)
}) {
  const location = useLocation()
  const brandStyle = useBrandStyle()
  const [authLoading, setAuthLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<StaffProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false)
      return
    }

    let cancelled = false

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setUserId(data.session?.user?.id ?? null)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null)
      setAuthLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!userId) {
      setProfile(null)
      setProfileError(null)
      setProfileLoading(false)
      return
    }

    let cancelled = false
    setProfileLoading(true)
    setProfileError(null)

    ;(async () => {
      try {
        const { data, error } = await amsDb(supabase)
          .from('staff_profiles')
          .select('*')
          .eq('id', userId)
          .eq('is_active', true)
          .maybeSingle()

        if (cancelled) return

        if (error) {
          setProfile(null)
          setProfileError(error.message)
          return
        }

        if (!data) {
          setProfile(null)
          setProfileError('not_setup')
          return
        }

        const row = data as StaffProfile
        if (!roles.includes(row.role)) {
          setProfile(null)
          setProfileError(`role:${row.role}`)
          return
        }

        setProfile(row)
      } catch (e) {
        if (!cancelled) {
          setProfile(null)
          setProfileError(e instanceof Error ? e.message : 'Failed to load AMS profile')
        }
      } finally {
        if (!cancelled) setProfileLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, userId, roles.join('|')])

  if (!isSupabaseConfigured) {
    return (
      <div
        className="flex min-h-screen items-center justify-center p-6"
        style={{ ...brandStyle, backgroundColor: brandColor('background') }}
      >
        <div
          className="max-w-md rounded-xl border-2 bg-white p-8 text-center"
          style={{ borderColor: brandColor('primary') }}
        >
          <h1 className="text-xl font-bold">Supabase not configured</h1>
          <p className="mt-3 text-sm" style={{ color: brandColor('textMuted') }}>
            Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      </div>
    )
  }

  if (authLoading || (userId && profileLoading)) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-lg"
        style={{ ...brandStyle, backgroundColor: brandColor('background') }}
      >
        Loading AMS…
      </div>
    )
  }

  // No JWT — send to the appropriate login (PIN alone must never pass)
  if (!userId) {
    return <Navigate to={loginPath} state={{ from: location, amsOnly: true }} replace />
  }

  if (!profile) {
    const isNotSetup = profileError === 'not_setup'
    const roleMismatch = profileError?.startsWith('role:')

    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 py-12"
        style={{ ...brandStyle, backgroundColor: brandColor('background') }}
      >
        <div
          className="w-full max-w-lg rounded-2xl border-2 bg-white p-8"
          style={{ borderColor: brandColor('primary') }}
        >
          <p className="text-sm font-semibold" style={{ color: brandColor('primary') }}>
            {AGENCY_CONFIG.brandName} AMS
          </p>
          <h1 className="mt-2 font-serif text-2xl font-bold">Account not ready for AMS</h1>
          {isNotSetup ? (
            <p className="mt-4 text-base" style={{ color: brandColor('textMuted') }}>
              Your account isn&apos;t set up for AMS yet — ask พี่แสน to add you to{' '}
              <code className="text-sm">ams.staff_profiles</code>.
            </p>
          ) : roleMismatch ? (
            <p className="mt-4 text-base" style={{ color: brandColor('textMuted') }}>
              This area requires role: {roles.join(' or ')}. Your AMS role is{' '}
              <strong>{profileError?.slice(5)}</strong>. Ask พี่แสน if you need access.
            </p>
          ) : (
            <p className="mt-4 text-base text-red-700" role="alert">
              {profileError || 'Unable to verify AMS access.'}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={loginPath}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: brandColor('primary') }}
            >
              Sign in with another account
            </Link>
            <Link
              to="/"
              className="rounded-lg border px-4 py-2.5 text-sm font-semibold"
              style={{ borderColor: brandColor('border') }}
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{typeof children === 'function' ? children(profile) : children}</>
}
