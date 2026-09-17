import { Camera, HeartHandshake, UtensilsCrossed } from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { useLocation } from 'react-router-dom';
import {
  businessPacks,
  hashToPack,
  type PricePackId,
} from '../cinematic/data/industryPacks';
import { useTranslation } from '../cinematic/i18n/LanguageContext';

const ICONS: Record<Exclude<PricePackId, 'square'>, typeof HeartHandshake> = {
  massage: HeartHandshake,
  restaurant: UtensilsCrossed,
  photo: Camera,
};

const iconClass = 'h-full w-full text-[#d7e1ef]';

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

export function PricePackDock() {
  const { t } = useTranslation();
  const location = useLocation();
  const active: PricePackId = hashToPack(location.hash) ?? 'massage';

  return (
    <Dock className="items-end bg-[#07162c] pb-3" panelHeight={56} magnification={64}>
      {businessPacks.map((pack) => {
        const Icon = ICONS[pack.id as Exclude<PricePackId, 'square'>];
        const selected = location.pathname === '/pricing' && active === pack.id;
        return (
          <button
            key={pack.id}
            type="button"
            className="contents"
            aria-label={t(pack.label)}
            aria-pressed={selected}
            onClick={() => goToPack(location.pathname, pack.hash)}
          >
            <DockItem
              className={`aspect-square rounded-full ${selected ? 'bg-[#1769ff]' : 'bg-[#0d2344]'}`}
              aria-label={t(pack.label)}
            >
              <DockLabel>{t(pack.label)}</DockLabel>
              <DockIcon>
                <Icon className={iconClass} strokeWidth={2.1} />
              </DockIcon>
            </DockItem>
          </button>
        );
      })}
    </Dock>
  );
}

export function PricePackBar() {
  return (
    <div className="pack-bar" role="navigation" aria-label="Business types">
      <div className="container pack-bar-inner">
        <PricePackDock />
      </div>
    </div>
  );
}
