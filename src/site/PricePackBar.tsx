import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import {
  businessPacks,
  hashToPack,
  squarePack,
  type PricePackId,
} from '../cinematic/data/industryPacks';
import { useTranslation } from '../cinematic/i18n/LanguageContext';

const allPacks = [...businessPacks, squarePack];

function goToPack(pathname: string, hash: string) {
  const next = hash.startsWith('#') ? hash : `#${hash}`;
  const target = next === '#square-setup' || next === '#pack-square' ? 'square-setup' : 'price-packs';
  if (pathname === '/pricing') {
    window.location.hash = next;
    document.getElementById(target)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    return;
  }
  window.location.assign(`/pricing${next}`);
}

export function PricePackTabs({ className = '', lightId = 'pack' }: { className?: string; lightId?: string }) {
  const { t } = useTranslation();
  const location = useLocation();
  const active: PricePackId = hashToPack(location.hash) ?? 'massage';

  return (
    <div
      className={`pack-tabs ${className}`.trim()}
      role="tablist"
      aria-label={t({ th: 'หมวดธุรกิจ', en: 'Business types' })}
    >
      {allPacks.map((pack) => {
        const selected = location.pathname === '/pricing' && active === pack.id;
        return (
          <button
            key={pack.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`pack-chip${selected ? ' is-active' : ''}`}
            onClick={() => goToPack(location.pathname, pack.hash)}
          >
            {selected ? (
              <motion.span
                className="pack-chip-glow"
                layoutId={`pack-tubelight-${lightId}`}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="pack-chip-label">{t(pack.label)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function PricePackDock() {
  return <PricePackTabs />;
}

export function PricePackBar() {
  return (
    <div className="pack-bar" role="navigation" aria-label="Business types">
      <div className="container pack-bar-inner">
        <PricePackTabs lightId="bar" />
      </div>
    </div>
  );
}
