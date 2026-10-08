import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TimelineContent } from '@/components/ui/timeline-animation';
import NumberFlow from '@number-flow/react';
import { CheckCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState, type ReactNode } from 'react';

export type PlayPlan = {
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  buttonText: string;
  buttonHref: string;
  buttonVariant?: 'outline' | 'default';
  popular?: boolean;
  priceDisplay?: string;
  periodLabel?: string;
  features: { text: string; icon: ReactNode }[];
  includes: string[];
};

function PricingSwitch({
  onSwitch,
  leftLabel,
  rightLabel,
  saveLabel,
  layoutId,
}: {
  onSwitch: (value: string) => void;
  leftLabel: string;
  rightLabel: string;
  saveLabel?: string;
  layoutId: string;
}) {
  const [selected, setSelected] = useState('0');

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full border border-[#dde3eb] bg-[#f7f8fa] p-1">
        <button
          type="button"
          onClick={() => handleSwitch('0')}
          className={`relative z-10 h-10 w-fit rounded-full px-3 py-1 font-medium transition-colors sm:h-12 sm:px-6 sm:py-2 ${
            selected === '0' ? 'text-white' : 'text-gray-500 hover:text-black'
          }`}
        >
          {selected === '0' ? (
            <motion.span
              layoutId={layoutId}
              className="absolute left-0 top-0 h-10 w-full rounded-full border-4 border-[#0b1f3a] bg-gradient-to-t from-[#0b1f3a] via-[#1d3a66] to-[#0b1f3a] shadow-sm shadow-[#0b1f3a]/40 sm:h-12"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          ) : null}
          <span className="relative">{leftLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => handleSwitch('1')}
          className={`relative z-10 flex h-10 w-fit flex-shrink-0 items-center rounded-full px-3 py-1 font-medium transition-colors sm:h-12 sm:px-6 sm:py-2 ${
            selected === '1' ? 'text-white' : 'text-gray-500 hover:text-black'
          }`}
        >
          {selected === '1' ? (
            <motion.span
              layoutId={layoutId}
              className="absolute left-0 top-0 h-10 w-full rounded-full border-4 border-[#0b1f3a] bg-gradient-to-t from-[#0b1f3a] via-[#1d3a66] to-[#0b1f3a] shadow-sm shadow-[#0b1f3a]/40 sm:h-12"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          ) : null}
          <span className="relative flex items-center gap-2">
            {rightLabel}
            {saveLabel ? (
              <span className="rounded-full bg-[#f3f5f8] px-2 py-0.5 text-xs font-medium text-[#0b1220]">
                {saveLabel}
              </span>
            ) : null}
          </span>
        </button>
      </div>
    </div>
  );
}

const revealVariants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { delay: i * 0.12, duration: 0.45 },
  }),
  hidden: { filter: 'blur(10px)', y: -20, opacity: 0 },
};

type PricingSectionProps = {
  plans: PlayPlan[];
  heading?: ReactNode;
  subheading?: string;
  showSwitch?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  saveLabel?: string;
  leftPeriod?: string;
  rightPeriod?: string;
  switchId?: string;
  prefix?: string;
};

export default function PricingSection({
  plans,
  heading,
  subheading,
  showSwitch = true,
  leftLabel = 'Monthly',
  rightLabel = 'Yearly',
  saveLabel,
  leftPeriod = 'month',
  rightPeriod = 'year',
  switchId = 'pricing-switch',
  prefix = 'A$',
}: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mx-auto bg-transparent px-1 pt-2" ref={pricingRef}>
      <div
        className="pointer-events-none absolute left-[10%] right-[10%] top-0 z-0 h-full w-[80%]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #0b1f3a 0%, transparent 70%)',
          opacity: 0.12,
        }}
      />

      {heading ? (
        <div className="relative z-[1] mx-auto mb-6 max-w-3xl text-center">
          <TimelineContent
            as="div"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="mb-4 text-3xl font-medium text-[#0b1220] sm:text-4xl md:text-5xl"
          >
            {heading}
          </TimelineContent>
          {subheading ? (
            <TimelineContent
              as="p"
              animationNum={1}
              timelineRef={pricingRef}
              customVariants={revealVariants}
              className="mx-auto w-[90%] text-sm text-[#4a5160] sm:text-base"
            >
              {subheading}
            </TimelineContent>
          ) : null}
        </div>
      ) : null}

      {showSwitch ? (
        <TimelineContent
          as="div"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch
            onSwitch={(value) => setIsYearly(Number.parseInt(value, 10) === 1)}
            leftLabel={leftLabel}
            rightLabel={rightLabel}
            saveLabel={saveLabel}
            layoutId={switchId}
          />
        </TimelineContent>
      ) : null}

      <div
        className={`relative z-[1] mx-auto grid max-w-7xl gap-4 py-6 ${
          plans.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-3'
        }`}
      >
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={3 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative h-full rounded-2xl border-[#e3e7ed] shadow-sm ${
                plan.popular ? 'bg-[#f3f5f8] ring-2 ring-[#0b1f3a]' : 'bg-white'
              }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between gap-3">
                  <h3 className="mb-2 text-2xl font-semibold text-[#0b1220] sm:text-3xl">
                    {plan.name}
                  </h3>
                </div>
                <p className="mb-4 text-sm text-[#4a5160]">{plan.description}</p>
                <div className="flex items-baseline">
                  {plan.priceDisplay ? (
                    <span className="text-xl font-semibold leading-snug text-[#0b1220] sm:text-2xl">
                      {plan.priceDisplay}
                    </span>
                  ) : (
                    <span className="text-4xl font-semibold text-[#0b1220]">
                      {prefix}
                      <NumberFlow
                        value={isYearly ? plan.yearlyPrice : plan.price}
                        className="text-4xl font-semibold"
                      />
                    </span>
                  )}
                  {plan.periodLabel || !plan.priceDisplay ? (
                    <span className="ml-1 text-[#4a5160]">
                      {plan.periodLabel ?? `/${isYearly ? rightPeriod : leftPeriod}`}
                    </span>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <a
                  href={plan.buttonHref}
                  className={`mb-6 block w-full rounded-xl p-4 text-center text-lg !text-white ${
                    plan.popular || plan.buttonVariant === 'default'
                      ? 'border border-[#1d3a66] bg-gradient-to-t from-[#0b1f3a] to-[#1d3a66] shadow-lg shadow-[#0b1f3a]/30'
                      : 'border border-[#13294b] bg-gradient-to-t from-[#0b1220] to-[#13294b] shadow-lg shadow-[#0b1220]/20'
                  }`}
                >
                  {plan.buttonText}
                </a>
                <ul className="space-y-2 py-5 font-semibold">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start">
                      <span className="mr-3 mt-0.5 grid place-content-center text-[#0b1f3a]">
                        {feature.icon}
                      </span>
                      <span className="text-sm font-normal text-[#4a5160]">{feature.text}</span>
                    </li>
                  ))}
                </ul>
                {plan.includes.length > 1 ? (
                  <div className="space-y-3 border-t border-[#e3e7ed] pt-4">
                    <h4 className="mb-3 text-base font-medium text-[#0b1220]">{plan.includes[0]}</h4>
                    <ul className="space-y-2 font-semibold">
                      {plan.includes.slice(1).map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className="mr-3 mt-0.5 grid h-6 w-6 flex-shrink-0 place-content-center rounded-full border border-[#0b1f3a] bg-[#f3f5f8]">
                            <CheckCheck className="h-4 w-4 text-[#0b1f3a]" />
                          </span>
                          <span className="text-sm font-normal text-[#4a5160]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
