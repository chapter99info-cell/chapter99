import { useTranslation } from './LanguageContext';
import type { Bilingual } from './types';
import type { ElementType, HTMLAttributes } from 'react';

type TProps = Bilingual &
  HTMLAttributes<HTMLElement> & {
    as?: ElementType;
  };

/** Renders bilingual copy; supports HTML strings from the mockup. */
export function T({ th, en, as: Tag = 'span', ...rest }: TProps) {
  const { lang } = useTranslation();
  const html = lang === 'en' ? en : th;
  if (/[<>]/.test(html)) {
    return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <Tag {...rest}>{html}</Tag>;
}
