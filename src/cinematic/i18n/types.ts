export type Lang = 'th' | 'en';

export type Bilingual = {
  th: string;
  en: string;
};

export const LANG_STORAGE_KEY = 'chapter99_lang';
export const DEFAULT_LANG: Lang = 'th';

export function pick(lang: Lang, text: Bilingual): string {
  return text[lang];
}
