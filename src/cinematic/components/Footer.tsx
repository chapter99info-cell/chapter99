import {
  footerCopy,
  footerNavCompany,
  footerNavPrimary,
  footerNavSocial,
  type FooterLink,
} from '../data/footer';
import { useTranslation } from '../i18n/LanguageContext';
import type { Bilingual } from '../i18n/types';

function isBilingual(value: Bilingual | string): value is Bilingual {
  return typeof value === 'object' && value !== null && 'th' in value;
}

function FooterNav({
  links,
  label,
}: {
  links: FooterLink[];
  label: string;
}) {
  const { t } = useTranslation();

  return (
    <nav className="site-footer__nav" aria-label={label}>
      {links.map((link) => {
        const text = isBilingual(link.label) ? t(link.label) : link.label;
        return (
          <a
            key={`${link.href}-${text}`}
            href={link.href}
            {...(link.external
              ? { target: '_blank', rel: 'noreferrer' }
              : undefined)}
          >
            {text}
          </a>
        );
      })}
    </nav>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="site-footer">
      <div className="footer-dots" aria-hidden="true">
        <div className="footer-dots__line" />
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__top">
          <h2>{t(footerCopy.headline)}</h2>
          <FooterNav links={footerNavPrimary} label="Footer navigation" />
          <FooterNav links={footerNavCompany} label="Company links" />
          <FooterNav links={footerNavSocial} label="Social links" />
        </div>

        <div className="site-footer__brand-row">
          <a className="site-footer__brand" href="#top" aria-label="Chapter99 หน้าแรก">
            <span className="site-footer__mark" aria-hidden="true" />
            <span className="site-footer__wordmark">Chapter99</span>
          </a>
        </div>

        <div className="site-footer__legal">
          <p dangerouslySetInnerHTML={{ __html: t(footerCopy.copyright) }} />
          <a href="#privacy">{t(footerCopy.privacy)}</a>
          <a href="#terms">{t(footerCopy.terms)}</a>
          <a href="/pm/login">{t(footerCopy.systems)}</a>
        </div>
      </div>
    </footer>
  );
}
