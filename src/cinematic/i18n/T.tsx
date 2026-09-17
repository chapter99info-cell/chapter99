import { useTranslation } from './LanguageContext'
import { isBilingual, type Bilingual } from './types'

export function T({ children }: { children: Bilingual | string }) {
  const { t } = useTranslation()
  return <>{isBilingual(children) ? t(children) : children}</>
}
