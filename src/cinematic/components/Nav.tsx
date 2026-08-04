import { useEffect, useState } from 'react';
import { navLinks } from '../data/nav';
import { useTranslation } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/types';

export function Nav() {
  const { lang, setLang, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <div className={`navwrap${menuOpen ? ' is-open' : ''}`}>
      <nav aria-label="Main">
        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {t(link.label)}
            </a>
          ))}
        </div>

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

        <button
          type="button"
          className="nav-burger"
          aria-expanded={menuOpen}
          aria-controls="cinematic-mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-burger-lines" aria-hidden="true" />
        </button>
      </nav>

      <div
        id="cinematic-mobile-nav"
        className="nav-drawer"
        hidden={!menuOpen}
      >
        {navLinks.map((link) => (
          <a
            key={`m-${link.href}`}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {t(link.label)}
          </a>
        ))}
      </div>
    </div>
  );
}
