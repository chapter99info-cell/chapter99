import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageProvider, useTranslation } from '../cinematic/i18n/LanguageContext';
import type { Lang } from '../cinematic/i18n/types';
import { siteContact, siteIcons, siteMedia } from './media';
import { PricePackBar } from './PricePackBar';
import { SiteDock } from './SiteDock';
import { SearchButton, SiteUx } from './SiteUx';
import './site.css';

const AUDIT_MAIL =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';

const links = [
  { href: '/#solutions', label: { th: 'Solutions', en: 'Solutions' } },
  { href: '/pricing', label: { th: 'Packages & Pricing', en: 'Packages & Pricing' } },
  { href: '/#stages', label: { th: 'Business Stage', en: 'Business Stage' } },
  { href: '/#how', label: { th: 'How It Works', en: 'How It Works' } },
  { href: '/#toolkit', label: { th: 'Free Toolkit', en: 'Free Toolkit' } },
  { href: '/#proof', label: { th: 'Resources', en: 'Resources' } },
  { href: '/#audit', label: { th: 'About', en: 'About' } },
];

function SiteChrome({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('site-app');
    document.body.classList.remove('cinematic-page');
    return () => document.body.classList.remove('site-app');
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <div className="site-root">
      <header className={`topbar${open ? ' is-open' : ''}`}>
        <div className="container nav">
          <Link className="brand" to="/" onClick={() => setOpen(false)}>
            <img className="brand-mark" src={siteMedia.logo} alt="" />
            <span>
              <strong>Chapter99</strong>
              <small>Bring Your Business to Life Online.</small>
            </span>
          </Link>
          <nav className="navlinks" aria-label="Main">
            {links.map((link) =>
              link.href.startsWith('/#') ? (
                <a
                  key={link.href}
                  className="nav-link"
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {t(link.label)}
                </a>
              ) : (
                <Link
                  key={link.href}
                  className={`nav-link${location.pathname === link.href ? ' is-active' : ''}`}
                  to={link.href}
                  onClick={() => setOpen(false)}
                >
                  {t(link.label)}
                </Link>
              ),
            )}
          </nav>
          <div className="nav-end">
            <SearchButton />
            <a className="navcta" href={AUDIT_MAIL}>
              {t({ th: 'Book a Business Audit', en: 'Book a Business Audit' })}
            </a>
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
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <img src={open ? siteIcons.logout : siteIcons.menu} alt="" />
            </button>
          </div>
        </div>
        <div className="nav-drawer">
          {links.map((link) =>
            link.href.startsWith('/#') ? (
              <a key={`d-${link.href}`} href={link.href} onClick={() => setOpen(false)}>
                {t(link.label)}
              </a>
            ) : (
              <Link key={`d-${link.href}`} to={link.href} onClick={() => setOpen(false)}>
                {t(link.label)}
              </Link>
            ),
          )}
          <div className="drawer-tools">
            <SearchButton />
          </div>
        </div>
      </header>
      <SiteUx />
      <PricePackBar />
      <div id="main">{children}</div>
      <SiteDock />
      <footer>
        <div className="container">
          <div className="footerGrid">
            <div className="brand">
              <strong style={{ color: '#fff' }}>Chapter99</strong>
              <small>Bring Your Business to Life Online.</small>
            </div>
            <div className="footerCols">
              <div className="footerCol">
                <strong>SOLUTIONS</strong>
                <a href="/#solutions">Look</a>
                <a href="/#solutions">Be Found</a>
                <a href="/#solutions">Get Booked</a>
                <a href="/#solutions">Get Paid</a>
              </div>
              <div className="footerCol">
                <strong>RESOURCES</strong>
                <a href="/#toolkit">Free Tools</a>
                <a href="/#proof">Case Studies</a>
                <a href="/#how">How It Works</a>
                <Link to="/pricing">Packages & Pricing</Link>
              </div>
              <div className="footerCol">
                <strong>COMPANY</strong>
                <a href="/#audit">About</a>
                <a href="mailto:chapter99solutions@gmail.com">Contact</a>
                <a href={AUDIT_MAIL}>Business Audit</a>
                <div className="footer-contact">
                  <a href={AUDIT_MAIL}><img src={siteIcons.gmail} alt="Email" /></a>
                  <a href={siteContact.whatsapp} target="_blank" rel="noreferrer">
                    <img src={siteIcons.whatsapp} alt="WhatsApp" />
                  </a>
                  <a href={siteContact.facebook} target="_blank" rel="noreferrer">
                    <img src={siteIcons.chat} alt="Facebook" />
                  </a>
                  <img src={siteIcons.instagram} alt="" />
                  <img src={siteIcons.tiktok} alt="" />
                  <img src={siteIcons.youtube} alt="" />
                  <img src={siteIcons.location} alt="" />
                </div>
              </div>
              <div className="footerCol">
                <strong>TRUST CENTER</strong>
                <a href="/#audit">Privacy</a>
                <a href="/#audit">Security</a>
                <a href="/#audit">Terms</a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <span>© 2026 Chapter99. All rights reserved.</span>
            <span>Australia · chapter99solutions@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SiteChrome>{children}</SiteChrome>
    </LanguageProvider>
  );
}
