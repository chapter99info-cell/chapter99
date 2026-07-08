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
  signIn: (email: string, password: string) => Promise<void>
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
        if (nextSession?.user) {
          setPinSession(false)
          clearPinToken()
        } else {
          const valid = await validatePinSession()
          setPinSession(valid)
        }
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      throw new Error('Email and password are required')
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })
    if (error) throw error
    clearPinToken()
    setPinSession(false)
  }, [])

  const signInWithPin = useCallback(async (pin: string) => {
    await verifyAdminPin(pin)
    setPinSession(true)
  }, [])

  const signOut = useCallback(async () => {
    clearPinToken()
    setPinSession(false)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const isAuthenticated = Boolean(user) || pinSession

  const value = useMemo(
    () => ({
      user,
      session,
      pinSession,
      loading,
      configured: isSupabaseConfigured,
      isAuthenticated,
      signIn,
      signInWithPin,
      signOut,
    }),
    [user, session, pinSession, loading, isAuthenticated, signIn, signInWithPin, signOut]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
