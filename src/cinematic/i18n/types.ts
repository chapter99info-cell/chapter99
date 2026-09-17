export type Lang = 'th' | 'en'

export type Bilingual = {
  th: string
  en: string
}

export function pick(lang: Lang, text: Bilingual): string {
  return lang === 'th' ? text.th : text.en
}

export function isBilingual(value: unknown): value is Bilingual {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'th' in value &&
      'en' in value &&
      typeof (value as Bilingual).th === 'string' &&
      typeof (value as Bilingual).en === 'string',
  )
}
