import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
};

type MotionComponent = React.ComponentType<HTMLMotionProps<'div'>>;

const motionCache = new Map<ElementType, MotionComponent>();

function getMotionComponent(as: ElementType) {
  let component = motionCache.get(as);
  if (!component) {
    component = motion.create(as) as MotionComponent;
    motionCache.set(as, component);
  }
  return component;
}

export default function FadeIn({
  children,
  as = 'div',
  className,
  style,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
}: FadeInProps) {
  const MotionComponent = getMotionComponent(as);

  return (
    <MotionComponent
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionComponent>
  );
}
