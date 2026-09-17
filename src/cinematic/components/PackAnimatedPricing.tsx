import PricingSection, { type PlayPlan } from '@/components/ui/pricing-section';
import { Briefcase, Camera, CreditCard, Database, Server, Video } from 'lucide-react';
import type { PricePackId } from '../data/industryPacks';
import type { PricingTier } from '../data/pricing';
import { useTranslation } from '../i18n/LanguageContext';
import type { Bilingual } from '../i18n/types';

const AUDIT =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';

function isBilingual(value: Bilingual | string): value is Bilingual {
  return typeof value === 'object' && value !== null && 'th' in value && 'en' in value;
}

const WEB_NUMBERS: Record<string, { price: number; yearly: number }> = {
  starter: { price: 19, yearly: 228 },
  professional: { price: 49, yearly: 588 },
  ultimate: { price: 89, yearly: 1068 },
};

const PHOTO_NUMBERS: Record<string, { price: number; yearly: number }> = {
  photos: { price: 349, yearly: 449 },
  video: { price: 349, yearly: 690 },
  combo: { price: 690, yearly: 990 },
};

const ICONS = [Briefcase, Database, Server, Camera, Video, CreditCard];

type Props = {
  packId: PricePackId;
  tiers: PricingTier[];
};

export function PackAnimatedPricing({ packId, tiers }: Props) {
  const { t } = useTranslation();
  const label = (value: Bilingual | string) => (isBilingual(value) ? t(value) : value);

  const plans: PlayPlan[] = tiers.map((tier, index) => {
    const Icon = ICONS[index % ICONS.length];
    const texts = tier.features.map((feature) => label(feature.label).replace(/<[^>]+>/g, ''));
    const numbers =
      packId === 'photo'
        ? PHOTO_NUMBERS[tier.id] ?? { price: 0, yearly: 0 }
        : packId === 'square'
          ? { price: 199, yearly: 199 }
          : WEB_NUMBERS[tier.id] ?? { price: 0, yearly: 0 };

    return {
      name: label(tier.eyebrow),
      description: label(tier.description),
      price: numbers.price,
      yearlyPrice: numbers.yearly,
      buttonText: t(tier.cta),
      buttonHref: tier.ctaHref ?? AUDIT,
      popular: Boolean(tier.badge),
      features: texts.slice(0, 3).map((text) => ({
        text,
        icon: <Icon size={20} />,
      })),
      includes: [
        t({ th: 'รวมในแพ็กนี้:', en: 'This package includes:' }),
        ...texts.slice(3),
        ...(tier.footnotes ?? []).map((note) => label(note)),
      ].filter(Boolean),
    };
  });

  const web = packId === 'massage' || packId === 'restaurant';

  return (
    <PricingSection
      plans={plans}
      showSwitch={packId !== 'square'}
      leftLabel={
        packId === 'photo'
          ? t({ th: 'ต่อครั้ง', en: 'Per session' })
          : t({ th: 'รายเดือน', en: 'Monthly' })
      }
      rightLabel={
        packId === 'photo'
          ? t({ th: 'รายเดือน', en: 'Monthly' })
          : t({ th: 'รายปี', en: 'Yearly' })
      }
      saveLabel={
        packId === 'photo'
          ? t({ th: 'แพ็กรายเดือน', en: 'Monthly pack' })
          : web
            ? t({ th: 'จ่าย 12 เดือน', en: 'Billed 12 months' })
            : undefined
      }
      leftPeriod={
        packId === 'photo'
          ? t({ th: 'ครั้ง', en: 'session' })
          : packId === 'square'
            ? t({ th: 'ครั้งเดียว', en: 'one-time' })
            : t({ th: 'เดือน', en: 'month' })
      }
      rightPeriod={
        packId === 'photo'
          ? t({ th: 'เดือน', en: 'month' })
          : t({ th: 'ปี', en: 'year' })
      }
      switchId={`pack-switch-${packId}`}
    />
  );
}
