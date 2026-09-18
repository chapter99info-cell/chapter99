import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageProvider, useTranslation } from '../cinematic/i18n/LanguageContext';
import type { Lang } from '../cinematic/i18n/types';
import { siteContact, siteIcons, siteMedia } from './media';
import { PricePackBar } from './PricePackBar';
import { SearchButton, SiteUx } from './SiteUx';
import './site.css';
import './homepage-v2.css';

const AUDIT_MAIL =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';

const navLinks = [
  { href: '/business-toolkit', label: { th: 'ชุดเครื่องมือธุรกิจฟรี', en: 'Free Toolkit' } },
  { href: '/#audit', label: { th: 'Business Audit', en: 'Business Audit' } },
  { href: '/#how', label: { th: 'วิธีทำงาน', en: 'How It Works' } },
  { href: '/pricing', label: { th: 'แพ็กเกจและราคา', en: 'Packages' } },
  { href: '/work', label: { th: 'ผลงาน', en: 'Resources' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
];

const solutionLinks = [
  { href: '/massage', label: { th: 'ร้านนวด', en: 'Massage' } },
  { href: '/restaurants', label: { th: 'ร้านอาหาร', en: 'Restaurants' } },
  { href: '/beauty', label: { th: 'ความงาม', en: 'Beauty' } },
  { href: '/cleaning', label: { th: 'ทำความสะอาด', en: 'Cleaning' } },
  { href: '/photography', label: { th: 'ภาพถ่าย', en: 'Photography' } },
];

function linkActive(pathname: string, hash: string, href: string) {
  if (href.startsWith('/#')) return pathname === '/' && hash === href.slice(1);
  return pathname === href;
}

function scrollToRouteHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  const header = document.querySelector('.topbar') as HTMLElement | null;
  const offset = (header?.getBoundingClientRect().height ?? 72) + 12;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  return true;
}

function SiteChrome({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false);
  const solRef = useRef<HTMLDivElement>(null);
  const isToolkit = location.pathname === '/business-toolkit';
  const isPricing = location.pathname === '/pricing';
  const solActive = solutionLinks.some((item) => location.pathname === item.href);

  useEffect(() => {
    document.body.classList.add('site-app');
    document.body.classList.remove('cinematic-page');
    document.documentElement.lang = lang;
    return () => document.body.classList.remove('site-app');
  }, [lang]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!solRef.current?.contains(e.target as Node)) setSolOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSolOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    let cancelled = false;
    const tryScroll = () => {
      if (cancelled) return;
      scrollToRouteHash(location.hash);
    };
    const timers = [0, 50, 200, 400].map((ms) => window.setTimeout(tryScroll, ms));
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [location.pathname, location.hash]);

  return (
    <div className={`site-root site-v2${isToolkit ? ' is-toolkit' : ''}${isPricing ? ' is-pricing' : ''}`}>
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
            <div className={`nav-sol${solOpen ? ' is-open' : ''}`} ref={solRef}>
              <button
                type="button"
                className={`nav-link nav-sol-btn${solActive ? ' is-active' : ''}`}
                aria-expanded={solOpen}
                aria-haspopup="true"
                onClick={() => setSolOpen((v) => !v)}
              >
                {t({ th: 'แนวทางธุรกิจ', en: 'Solutions' })}
              </button>
              {solOpen ? (
                <div className="nav-sol-menu" role="menu">
                  {solutionLinks.map((item) => (
                    <Link
                      key={item.href}
                      role="menuitem"
                      to={item.href}
                      className={location.pathname === item.href ? 'is-active' : ''}
                      onClick={() => {
                        setSolOpen(false);
                        setOpen(false);
                      }}
                    >
                      {t(item.label)}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            {navLinks.map((link) => {
              const active = linkActive(location.pathname, location.hash, link.href);
              return link.href.startsWith('/#') ? (
                <a
                  key={link.href}
                  className={`nav-link${active ? ' is-active' : ''}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {t(link.label)}
                </a>
              ) : (
                <Link
                  key={link.href}
                  className={`nav-link${active ? ' is-active' : ''}`}
                  to={link.href}
                  onClick={() => setOpen(false)}
                >
                  {t(link.label)}
                </Link>
              );
            })}
          </nav>
          <div className="nav-end">
            <SearchButton />
            <Link className="navcta header-cta" to="/business-toolkit" onClick={() => setOpen(false)}>
              {t({ th: 'ชุดเครื่องมือธุรกิจฟรี', en: 'Free Business Toolkit' })}
            </Link>
            <a className="navcta header-cta header-cta-ghost" href="/#audit">
              {t({ th: 'Business Audit', en: 'Business Audit' })}
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
          <p className="drawer-label">{t({ th: 'แนวทางธุรกิจ', en: 'Solutions' })}</p>
          {solutionLinks.map((item) => (
            <Link key={`d-${item.href}`} to={item.href} onClick={() => setOpen(false)}>
              {t(item.label)}
            </Link>
          ))}
          {navLinks.map((link) =>
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
          <Link className="navcta drawer-cta" to="/business-toolkit" onClick={() => setOpen(false)}>
            {t({ th: 'ชุดเครื่องมือธุรกิจฟรี', en: 'Free Business Toolkit' })}
          </Link>
          <a className="navcta drawer-cta drawer-cta-ghost" href="/#audit" onClick={() => setOpen(false)}>
            {t({ th: 'Business Audit', en: 'Business Audit' })}
          </a>
          <div className="drawer-tools">
            <SearchButton />
          </div>
        </div>
      </header>
      <SiteUx />
      {isPricing ? <PricePackBar /> : null}
      <div id="main">{children}</div>
      <footer>
        <div className="container">
          <div className="footerGrid">
            <div className="brand">
              <strong style={{ color: '#fff' }}>Chapter99</strong>
              <small>Bring Your Business to Life Online.</small>
            </div>
            <div className="footerCols">
              <div className="footerCol">
                <strong>{t({ th: 'แนวทาง', en: 'SOLUTIONS' })}</strong>
                <Link to="/massage">{t({ th: 'ร้านนวด', en: 'Massage' })}</Link>
                <Link to="/restaurants">{t({ th: 'ร้านอาหาร', en: 'Restaurants' })}</Link>
                <Link to="/beauty">{t({ th: 'ความงาม', en: 'Beauty' })}</Link>
                <Link to="/cleaning">{t({ th: 'ทำความสะอาด', en: 'Cleaning' })}</Link>
                <Link to="/photography">{t({ th: 'ภาพถ่าย', en: 'Photography' })}</Link>
              </div>
              <div className="footerCol">
                <strong>{t({ th: 'ทรัพยากร', en: 'RESOURCES' })}</strong>
                <Link to="/business-toolkit">{t({ th: 'เครื่องมือฟรี', en: 'Free Tools' })}</Link>
                <Link to="/work">{t({ th: 'ผลงาน', en: 'Work' })}</Link>
                <Link to="/pricing">{t({ th: 'แพ็กเกจและราคา', en: 'Packages & Pricing' })}</Link>
              </div>
              <div className="footerCol">
                <strong>{t({ th: 'บริษัท', en: 'COMPANY' })}</strong>
                <Link to="/about">{t({ th: 'เกี่ยวกับเรา', en: 'About' })}</Link>
                <Link to="/contact">{t({ th: 'ติดต่อ', en: 'Contact' })}</Link>
                <a href={AUDIT_MAIL}>{t({ th: 'นัด Business Audit', en: 'Business Audit' })}</a>
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
                <strong>{t({ th: 'ศูนย์ความเชื่อถือ', en: 'TRUST CENTER' })}</strong>
                <Link to="/legal/privacy">{t({ th: 'ความเป็นส่วนตัว', en: 'Privacy' })}</Link>
                <Link to="/legal">{t({ th: 'ความปลอดภัย', en: 'Security' })}</Link>
                <Link to="/legal/terms">{t({ th: 'ข้อกำหนด', en: 'Terms' })}</Link>
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
