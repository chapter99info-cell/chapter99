import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { isBilingual, pick, type Bilingual, type Lang } from './types'

type TranslationValue = Bilingual | string

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (value: TranslationValue) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readLang(): Lang {
  try {
    const stored = window.localStorage.getItem('c99-lang')
    if (stored === 'th' || stored === 'en') return stored
  } catch {
    /* ignore */
  }
  return 'th'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next)
        try {
          window.localStorage.setItem('c99-lang', next)
        } catch {
          /* ignore */
        }
      },
      t: (item) => (isBilingual(item) ? pick(lang, item) : item),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within LanguageProvider')
  }
  return ctx
}
