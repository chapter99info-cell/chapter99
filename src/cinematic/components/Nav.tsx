import { navLinks } from '../data/nav';
import { useTranslation } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/types';

export function Nav() {
  const { lang, setLang, t } = useTranslation();

  return (
    <div className="navwrap">
      <nav>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {t(link.label)}
          </a>
        ))}
        <span className="lang-toggle">
          {(['th', 'en'] as Lang[]).map((code) => (
            <button
              key={code}
              type="button"
              className={`lang-btn${lang === code ? ' active' : ''}`}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </span>
      </nav>
    </div>
  );
}
