import { motion, useInView, type Variants } from 'motion/react';
import type { ElementType, ReactNode, RefObject } from 'react';

type TimelineContentProps = {
  as?: ElementType;
  animationNum: number;
  timelineRef: RefObject<HTMLElement | null>;
  customVariants: Variants;
  className?: string;
  children: ReactNode;
};

export function TimelineContent({
  as: Tag = 'div',
  animationNum,
  timelineRef,
  customVariants,
  className,
  children,
}: TimelineContentProps) {
  const isInView = useInView(timelineRef, { once: true, margin: '-60px' });
  const MotionTag = motion(Tag);

  return (
    <MotionTag
      custom={animationNum}
      variants={customVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
