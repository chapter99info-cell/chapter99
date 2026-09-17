import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { hashToPack, pricePacks, type PricePackId } from '../cinematic/data/industryPacks';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { siteIcons } from './media';

const THUMBS: Record<PricePackId, string> = {
  massage: siteIcons.profile,
  restaurant: siteIcons.chili,
  photo: siteIcons.monitor,
  square: siteIcons.vkey,
};

export function PricePackBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const active: PricePackId = hashToPack(location.hash) ?? 'massage';

  return (
    <div className="pack-bar" role="navigation" aria-label="Price packs">
      <div className="container pack-bar-inner">
        <div className="pack-switch" role="tablist">
          {pricePacks.map((pack) => {
            const thumb = THUMBS[pack.id];
            const selected = location.pathname === '/pricing' && active === pack.id;
            return (
              <button
                key={pack.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={t(pack.label)}
                className={`pack-chip${selected ? ' is-active' : ''}`}
                onClick={() => {
                  const hash = pack.hash.startsWith('#') ? pack.hash : `#${pack.hash}`;
                  if (location.pathname === '/pricing') {
                    window.location.hash = hash;
                    document.getElementById('price-packs')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                    return;
                  }
                  window.location.assign(`/pricing${hash}`);
                }}
              >
                {selected ? (
                  <motion.span
                    layoutId="pack-pill"
                    className="pack-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                ) : null}
                <img className="pack-thumb" src={thumb} alt="" />
                <span>{t(pack.short)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
