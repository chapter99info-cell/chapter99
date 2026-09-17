import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../data/nav';
import { useTranslation } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/types';

export function Nav() {
  const { lang, setLang, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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
          {navLinks.map((link) => {
            const active = location.pathname === link.href;
            const className = active ? 'is-active' : undefined;
            if (link.href.startsWith('/#') || link.href.startsWith('#')) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={className}
                  onClick={() => setMenuOpen(false)}
                >
                  {t(link.label)}
                </a>
              );
            }
            return (
              <Link
                key={link.href}
                to={link.href}
                className={className}
                onClick={() => setMenuOpen(false)}
              >
                {t(link.label)}
              </Link>
            );
          })}
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
        {navLinks.map((link) => {
          const active = location.pathname === link.href;
          const className = active ? 'is-active' : undefined;
          if (link.href.startsWith('/#') || link.href.startsWith('#')) {
            return (
              <a
                key={`m-${link.href}`}
                href={link.href}
                className={className}
                onClick={() => setMenuOpen(false)}
              >
                {t(link.label)}
              </a>
            );
          }
          return (
            <Link
              key={`m-${link.href}`}
              to={link.href}
              className={className}
              onClick={() => setMenuOpen(false)}
            >
              {t(link.label)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
