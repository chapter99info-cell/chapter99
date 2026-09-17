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
  popular?: boolean;
  features: { text: string; icon: ReactNode }[];
  includes: string[];
};

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
  leftLabel: string;
  rightLabel: string;
  saveLabel?: string;
  layoutId: string;
};

function PricingSwitch({
  onSwitch,
  leftLabel,
  rightLabel,
  saveLabel,
  layoutId,
}: PricingSwitchProps) {
  const [selected, setSelected] = useState('0');

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full border border-gray-200 bg-neutral-50 p-1">
        <button
          type="button"
          onClick={() => handleSwitch('0')}
          className={`relative z-10 h-10 w-fit rounded-full px-3 py-1 font-medium transition-colors sm:h-12 sm:px-6 sm:py-2 ${
            selected === '0' ? 'text-white' : 'text-gray-500 hover:text-black'
          }`}
        >
          {selected === '0' && (
            <motion.span
              layoutId={layoutId}
              className="absolute left-0 top-0 h-10 w-full rounded-full border-4 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600 shadow-sm shadow-blue-600 sm:h-12"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">{leftLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => handleSwitch('1')}
          className={`relative z-10 flex h-10 w-fit flex-shrink-0 items-center rounded-full px-3 py-1 font-medium transition-colors sm:h-12 sm:px-6 sm:py-2 ${
            selected === '1' ? 'text-white' : 'text-gray-500 hover:text-black'
          }`}
        >
          {selected === '1' && (
            <motion.span
              layoutId={layoutId}
              className="absolute left-0 top-0 h-10 w-full rounded-full border-4 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600 shadow-sm shadow-blue-600 sm:h-12"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            {rightLabel}
            {saveLabel ? (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-black">
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
    transition: {
      delay: i * 0.12,
      duration: 0.45,
    },
  }),
  hidden: {
    filter: 'blur(10px)',
    y: -20,
    opacity: 0,
  },
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

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value, 10) === 1);

  return (
    <div className="relative mx-auto pt-2" ref={pricingRef}>
      <div
        className="pointer-events-none absolute left-[10%] right-[10%] top-0 z-0 h-full w-[80%]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #206ce8 0%, transparent 70%)',
          opacity: 0.18,
          mixBlendMode: 'multiply',
        }}
      />

      {heading ? (
        <div className="relative z-[1] mx-auto mb-6 max-w-3xl text-center">
          <TimelineContent
            as="div"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="mb-4 text-3xl font-medium text-gray-900 sm:text-4xl md:text-5xl"
          >
            {heading}
          </TimelineContent>
          {subheading ? (
            <TimelineContent
              as="p"
              animationNum={1}
              timelineRef={pricingRef}
              customVariants={revealVariants}
              className="mx-auto w-[90%] text-sm text-gray-600 sm:text-base"
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
            onSwitch={togglePricingPeriod}
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
              className={`relative h-full border-neutral-200 ${
                plan.popular ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white'
              }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between gap-3">
                  <h3 className="mb-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
                    {plan.name}
                  </h3>
                  {plan.popular ? (
                    <span className="h-fit rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mb-4 text-sm text-gray-600">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-semibold text-gray-900">
                    {prefix}
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-semibold"
                    />
                  </span>
                  <span className="ml-1 text-gray-600">
                    /{isYearly ? rightPeriod : leftPeriod}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <a
                  href={plan.buttonHref}
                  className={`mb-6 block w-full rounded-xl p-4 text-center text-lg ${
                    plan.popular
                      ? 'border border-blue-400 bg-gradient-to-t from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500'
                      : 'border border-neutral-700 bg-gradient-to-t from-neutral-900 to-neutral-600 text-white shadow-lg shadow-neutral-900'
                  }`}
                >
                  {plan.buttonText}
                </a>
                <ul className="space-y-2 py-5 font-semibold">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center">
                      <span className="mr-3 mt-0.5 grid place-content-center text-neutral-800">
                        {feature.icon}
                      </span>
                      <span className="text-sm font-normal text-gray-600">{feature.text}</span>
                    </li>
                  ))}
                </ul>
                {plan.includes.length > 1 ? (
                  <div className="space-y-3 border-t border-neutral-200 pt-4">
                    <h4 className="mb-3 text-base font-medium text-gray-900">
                      {plan.includes[0]}
                    </h4>
                    <ul className="space-y-2 font-semibold">
                      {plan.includes.slice(1).map((feature) => (
                        <li key={feature} className="flex items-center">
                          <span className="mr-3 mt-0.5 grid h-6 w-6 place-content-center rounded-full border border-blue-500 bg-green-50">
                            <CheckCheck className="h-4 w-4 text-blue-500" />
                          </span>
                          <span className="text-sm font-normal text-gray-600">{feature}</span>
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
