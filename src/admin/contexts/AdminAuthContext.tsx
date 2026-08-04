import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { clearPinToken, validatePinSession, verifyAdminPin } from '../../lib/adminPinApi'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'

interface AdminAuthContextValue {
  user: User | null
  session: Session | null
  pinSession: boolean
  loading: boolean
  configured: boolean
  isAuthenticated: boolean
  signInWithPin: (pin: string) => Promise<void>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [pinSession, setPinSession] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (event === 'INITIAL_SESSION') {
        const validPin = await validatePinSession()
        setPinSession(validPin)
        // JWT may exist from a prior PIN→session exchange; keep both.
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithPin = useCallback(async (pin: string) => {
    const result = await verifyAdminPin(pin)
    setPinSession(true)

    // Optional server-side JWT exchange so AMS RLS (auth.uid()) keeps working
    // without showing an email/password form.
    if (result.access_token && result.refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      })
      if (error) {
        // PIN session alone still unlocks Agency Hub (client_jobs anon policies).
        console.warn('[admin] PIN ok but Supabase session exchange failed:', error.message)
      }
    }
  }, [])

  const signOut = useCallback(async () => {
    clearPinToken()
    setPinSession(false)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  // PIN is the sole login UI. JWT may exist only as a side-effect of PIN exchange.
  const isAuthenticated = pinSession || Boolean(user)

  const value = useMemo(
    () => ({
      user,
      session,
      pinSession,
      loading,
      configured: isSupabaseConfigured,
      isAuthenticated,
      signInWithPin,
      signOut,
    }),
    [user, session, pinSession, loading, isAuthenticated, signInWithPin, signOut]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

/** Safe for routes outside AdminAuthProvider (e.g. /staff StaffApp). */
export function useAdminAuthOptional() {
  return useContext(AdminAuthContext)
}
