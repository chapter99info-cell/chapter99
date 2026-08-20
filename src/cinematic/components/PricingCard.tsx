import { useState, type CSSProperties, type MouseEvent } from 'react';
import type { PricingTier } from '../data/pricing';
import { useTranslation } from '../i18n/LanguageContext';
import type { Bilingual } from '../i18n/types';

function isBilingual(value: Bilingual | string): value is Bilingual {
  return typeof value === 'object' && value !== null && 'th' in value && 'en' in value;
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

type PricingCardProps = {
  tier: PricingTier;
};

export function PricingCard({ tier }: PricingCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [spot, setSpot] = useState<CSSProperties>({
    '--spot-x': '-9999px',
    '--spot-y': '-9999px',
  } as CSSProperties);

  const label = (value: Bilingual | string) => (isBilingual(value) ? t(value) : value);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setSpot({
      '--spot-x': `${e.clientX - r.left}px`,
      '--spot-y': `${e.clientY - r.top}px`,
    } as CSSProperties);
  };

  const onLeave = () => {
    setSpot({
      '--spot-x': '-9999px',
      '--spot-y': '-9999px',
    } as CSSProperties);
  };

  return (
    <div className="spot" style={spot} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        className="price-card-inner"
        style={{ background: tier.innerBg ?? '#161616' }}
      >
        {tier.badge && <div className="price-badge">{label(tier.badge)}</div>}
        <span className="price-eyebrow">{label(tier.eyebrow)}</span>
        <div className="price-divider" />
        <div className="price-row">
          <span className="amt">{tier.amount}</span>
          {tier.per && <span className="per">{label(tier.per)}</span>}
          {tier.original && <span className="orig">{tier.original}</span>}
        </div>
        <p className="price-desc">{label(tier.description)}</p>
        <a
          className={`price-btn ${tier.ctaVariant ?? 'secondary'}`}
          href={tier.ctaHref ?? '#contact'}
        >
          {t(tier.cta)}
        </a>
        <button
          type="button"
          className="price-details-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open
            ? t({ th: 'ซ่อนรายละเอียด', en: 'Hide details' })
            : t({ th: 'ดูรายละเอียด', en: 'See details' })}
        </button>
        {open && (
          <ul className="price-features">
            {tier.features.map((feature, i) => {
              const text = label(feature.label);
              return (
                <li key={i} className={feature.included ? undefined : 'off'}>
                  <span className="dot">
                    {feature.included ? <CheckIcon /> : <CrossIcon />}
                  </span>
                  {/[<>]/.test(text) ? (
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
