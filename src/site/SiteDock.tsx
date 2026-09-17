import { Link } from 'react-router-dom';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/mac-dock';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { siteIcons } from './media';

export function SiteDock() {
  const { t } = useTranslation();

  const items = [
    {
      title: t({ th: 'หน้าแรก', en: 'Home' }),
      href: '/',
      icon: siteIcons.location,
    },
    {
      title: t({ th: 'Solutions', en: 'Solutions' }),
      href: '/#solutions',
      icon: siteIcons.search,
    },
    {
      title: t({ th: 'Packages', en: 'Packages' }),
      href: '/pricing',
      icon: siteIcons.menu,
    },
    {
      title: t({ th: 'Business Stage', en: 'Business Stage' }),
      href: '/#stages',
      icon: siteIcons.monitor,
    },
    {
      title: t({ th: 'How It Works', en: 'How It Works' }),
      href: '/#how',
      icon: siteIcons.settings,
    },
    {
      title: t({ th: 'Free Toolkit', en: 'Free Toolkit' }),
      href: '/#toolkit',
      icon: siteIcons.notification,
    },
    {
      title: t({ th: 'ทัก Facebook', en: 'Message on Facebook' }),
      href: 'https://www.facebook.com/profile.php?id=61586534972406',
      icon: siteIcons.chat,
    },
  ];

  return (
    <div className="pointer-events-none fixed bottom-3 left-1/2 z-[60] w-full max-w-full -translate-x-1/2 px-2">
      <div className="pointer-events-auto">
        <Dock className="items-end bg-neutral-900 pb-3 dark:bg-neutral-900">
          {items.map((item) => {
            const inner = (
              <DockItem
                className="aspect-square rounded-full bg-neutral-800"
                aria-label={item.title}
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>
                  <img src={item.icon} alt="" className="h-full w-full object-contain p-0.5" />
                </DockIcon>
              </DockItem>
            );
            const wrapClass = 'contents';
            if (item.href.startsWith('http')) {
              return (
                <a
                  key={item.href}
                  className={wrapClass}
                  href={item.href}
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
