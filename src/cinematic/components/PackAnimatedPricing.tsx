import PricingSection, { type PlayPlan } from '@/components/ui/pricing-section';
import { Briefcase, Camera, CreditCard, Database, Server, Video } from 'lucide-react';
import { packageTiers } from '../data/packages';
import type { PricePackId } from '../data/industryPacks';
import type { PricingTier } from '../data/pricing';
import { useTranslation } from '../i18n/LanguageContext';
import type { Bilingual } from '../i18n/types';

const AUDIT =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';

function isBilingual(value: Bilingual | string): value is Bilingual {
  return typeof value === 'object' && value !== null && 'th' in value && 'en' in value;
}

const ICONS = [Briefcase, Database, Server, Camera, Video, CreditCard];

const PHOTO_NUMBERS: Record<string, { price: number; yearly: number; left: string; right: string }> = {
  photos: { price: 349, yearly: 449, left: 'session', right: 'month' },
  video: { price: 349, yearly: 690, left: 'session', right: 'month' },
  combo: { price: 690, yearly: 990, left: 'session', right: 'month' },
};

type Props = {
  packId?: PricePackId | 'catalog';
  tiers?: PricingTier[];
  heading?: string;
  subheading?: string;
};

function tierToPlan(
  tier: PricingTier,
  index: number,
  t: (value: Bilingual) => string,
  options: { numbered?: boolean; popular?: boolean },
): PlayPlan {
  const label = (value: Bilingual | string) => (isBilingual(value) ? t(value) : value);
  const Icon = ICONS[index % ICONS.length];
  const texts = tier.features.map((feature) => label(feature.label).replace(/<[^>]+>/g, ''));
  const name = label(tier.eyebrow);

  return {
    name,
    description: label(tier.description),
    price: options.numbered ? PHOTO_NUMBERS[tier.id]?.price ?? 199 : 0,
    yearlyPrice: options.numbered ? PHOTO_NUMBERS[tier.id]?.yearly ?? 199 : 0,
    priceDisplay: options.numbered
      ? undefined
      : label(tier.priceLine ?? { th: 'Scoped · ราคาตาม Product Catalog', en: 'Scoped · priced from Product Catalog' }),
    buttonText: t(tier.cta),
    buttonHref: tier.ctaHref ?? AUDIT,
    buttonVariant: index === 1 ? 'default' : 'outline',
    popular: options.popular && index === 1,
    features: texts.slice(0, 3).map((text) => ({ text, icon: <Icon size={20} /> })),
    includes: [
      t({ th: 'รวมในแพ็กนี้:', en: 'This package includes:' }),
      ...texts.slice(3),
      ...(tier.footnotes ?? []).map((note) => label(note)),
    ].filter(Boolean),
  };
}

export function PackAnimatedPricing({ packId = 'catalog', tiers, heading, subheading }: Props) {
  const { t } = useTranslation();
  const webTiers = !tiers || packId === 'catalog' || packId === 'massage' || packId === 'restaurant';
  const source = webTiers ? packageTiers : tiers;
  const photo = packId === 'photo';
  const square = packId === 'square';

  const plans = (source ?? []).map((tier, index) =>
    tierToPlan(tier, index, t, {
      numbered: photo || square,
      popular: false,
    }),
  );

  if (square && plans[0]) {
    plans[0].price = 199;
    plans[0].yearlyPrice = 199;
    plans[0].priceDisplay = undefined;
    plans[0].periodLabel = t({ th: 'ครั้งเดียว', en: 'one-time' });
  }

  const industryNote =
    packId === 'massage'
      ? t({
          th: 'ปรับ workflow ให้ร้านนวด: จองคิว บริการ และงานประจำวัน — ราคาจริงยังอ้าง Product Catalog',
          en: 'Massage workflow: booking, services and daily ops — quotes still come from the Product Catalog.',
        })
      : packId === 'restaurant'
        ? t({
            th: 'ปรับ workflow ให้ร้านอาหาร: เมนู จอง/สั่ง และใบเสร็จ — ราคาจริงยังอ้าง Product Catalog',
            en: 'Restaurant workflow: menu, booking/order and receipts — quotes still come from the Product Catalog.',
          })
        : undefined;

  return (
    <PricingSection
      plans={plans}
      heading={heading}
      subheading={industryNote ?? subheading}
      showSwitch={photo}
      leftLabel={t({ th: 'ต่อครั้ง', en: 'Per session' })}
      rightLabel={t({ th: 'รายเดือน', en: 'Monthly' })}
      saveLabel={photo ? t({ th: 'แพ็กรายเดือน', en: 'Monthly pack' }) : undefined}
      leftPeriod={t({ th: 'ครั้ง', en: 'session' })}
      rightPeriod={t({ th: 'เดือน', en: 'month' })}
      switchId={`pack-switch-${packId}`}
      prefix="A$"
    />
  );
}
