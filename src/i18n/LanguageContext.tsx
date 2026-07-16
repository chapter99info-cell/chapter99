import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translations, type Lang, type TranslationKey } from './translations'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'chapter99-lang'

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'th'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'th' || stored === 'en') return stored
  return 'th'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => setLangState(next)
  const toggleLang = () => setLangState((prev) => (prev === 'th' ? 'en' : 'th'))

  const t = useMemo(() => {
    return (key: TranslationKey) => translations[lang][key] ?? translations.th[key] ?? key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Fallback used when a shared component (e.g. PaymentQrCode, reused inside the
// Admin app) renders outside the public site's <LanguageProvider>. Admin stays
// Thai-only, so this just needs to be a safe, non-throwing default rather than
// requiring every consumer to be wrapped.
const DEFAULT_CONTEXT: LanguageContextValue = {
  lang: 'th',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: TranslationKey) => translations.th[key] ?? key,
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  return ctx ?? DEFAULT_CONTEXT
}
