import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentType, CSSProperties, ElementType, ReactNode } from 'react';

type FadeInProps = {
  children?: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  /** Animate on mount instead of when scrolled into view (for above-the-fold content). */
  immediate?: boolean;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
};

// motion.create() returns a new component each call, so cache one per element type.
const motionCache = new Map<ElementType, ComponentType<Record<string, unknown>>>();

function getMotionComponent(as: ElementType) {
  let component = motionCache.get(as);
  if (!component) {
    component = motion.create(as as never) as unknown as ComponentType<Record<string, unknown>>;
    motionCache.set(as, component);
  }
  return component;
}

export default function FadeIn({
  children,
  as = 'div',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  immediate = false,
  ...rest
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const MotionComponent = getMotionComponent(as);

  return (
    <MotionComponent
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x, y }}
      {...(immediate
        ? { animate: { opacity: 1, x: 0, y: 0 } }
        : { whileInView: { opacity: 1, x: 0, y: 0 }, viewport: { once: true, margin: '50px', amount: 0 } })}
      transition={{ duration: reduceMotion ? 0.3 : duration, delay: reduceMotion ? 0 : delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
