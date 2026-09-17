import { Link } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  Package,
  Layers,
  Waypoints,
  Wrench,
  MessageCircle,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { siteContact } from './media';
import { withUtm } from './SiteUx';

const iconClass = 'h-full w-full text-[#d7e1ef]';

export function SiteDock() {
  const { t } = useTranslation();

  const items = [
    {
      title: t({ th: 'หน้าแรก', en: 'Home' }),
      href: '/',
      icon: <Home className={iconClass} strokeWidth={2.1} />,
    },
    {
      title: t({ th: 'Solutions', en: 'Solutions' }),
      href: '/#solutions',
      icon: <LayoutGrid className={iconClass} strokeWidth={2.1} />,
    },
    {
      title: t({ th: 'Packages', en: 'Packages' }),
      href: '/pricing',
      icon: <Package className={iconClass} strokeWidth={2.1} />,
    },
    {
      title: t({ th: 'Business Stage', en: 'Business Stage' }),
      href: '/#stages',
      icon: <Layers className={iconClass} strokeWidth={2.1} />,
    },
    {
      title: t({ th: 'How It Works', en: 'How It Works' }),
      href: '/#how',
      icon: <Waypoints className={iconClass} strokeWidth={2.1} />,
    },
    {
      title: t({ th: 'Free Toolkit', en: 'Free Toolkit' }),
      href: '/#toolkit',
      icon: <Wrench className={iconClass} strokeWidth={2.1} />,
    },
    {
      title: t({ th: 'ทัก Facebook', en: 'Message on Facebook' }),
      href: siteContact.facebook,
      icon: <MessageCircle className={iconClass} strokeWidth={2.1} />,
    },
  ];

  return (
    <div className="pointer-events-none fixed bottom-3 left-1/2 z-[60] w-full max-w-full -translate-x-1/2 px-2">
      <div className="pointer-events-auto">
        <Dock className="items-end bg-[#07162c] pb-3">
          {items.map((item) => {
            const inner = (
              <DockItem
                className="aspect-square rounded-full bg-[#0d2344]"
                aria-label={item.title}
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            );
            const wrapClass = 'contents';
            if (item.href.startsWith('http')) {
              return (
                <a
                  key={item.href}
                  className={wrapClass}
                  href={withUtm(item.href)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.title}
                >
                  {inner}
                </a>
              );
            }
            if (item.href.startsWith('mailto:') || item.href.startsWith('/#')) {
              return (
                <a key={item.href} className={wrapClass} href={item.href} aria-label={item.title}>
                  {inner}
                </a>
              );
            }
            return (
              <Link key={item.href} className={wrapClass} to={item.href} aria-label={item.title}>
                {inner}
              </Link>
            );
          })}
        </Dock>
      </div>
    </div>
  );
}
