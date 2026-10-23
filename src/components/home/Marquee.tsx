import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Endless row that speeds up and flips direction with the reader's scroll. */
function VelocityRow({
  children,
  baseVelocity,
  className = '',
}: {
  children: React.ReactNode;
  baseVelocity: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  // Four identical copies: sliding by one copy (25%) loops seamlessly.
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div dir="ltr" className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className={`flex shrink-0 whitespace-nowrap ${className}`}>
        {[0, 1, 2, 3].map((copy) => (
          <span key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Star({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"
      />
    </motion.svg>
  );
}

export default function Marquee() {
  const { t } = useTranslation();
  const items = t('marquee_items', { returnObjects: true }) as unknown;
  const list = Array.isArray(items) ? (items as string[]) : [];

  return (
    <section aria-label={list.join(', ')} className="relative overflow-hidden border-b border-ink/10 bg-ivory py-14 md:py-20">
      <VelocityRow baseVelocity={-2.2}>
        {list.map((item, i) => (
          <span key={item} className="flex items-center">
            <span
              className={`px-6 font-serif text-[clamp(2.75rem,7vw,6.5rem)] font-medium italic leading-[1.1] md:px-10 ${
                i % 2 === 1 ? 'text-outline text-ink/70' : 'text-ink'
              }`}
            >
              {item}
            </span>
            <Star className="h-6 w-6 shrink-0 text-brass-deep md:h-9 md:w-9" />
          </span>
        ))}
      </VelocityRow>

      <VelocityRow baseVelocity={1.4} className="mt-6 md:mt-8">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="flex items-center px-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-ink/50 md:text-xs rtl:text-sm rtl:tracking-normal"
          >
            {t('marquee_secondary')}
            <span className="ms-12 inline-block h-px w-16 bg-ink/25" />
          </span>
        ))}
      </VelocityRow>
    </section>
  );
}
