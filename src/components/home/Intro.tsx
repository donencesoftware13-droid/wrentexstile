import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CURTAIN, EASE } from '../fx';

const BRAND = 'Wrentexstile';

/**
 * Opening curtain: the brand name sews itself in, then the whole panel lifts away.
 * It stays at least ~2s and until the page data is ready.
 */
export default function Intro({ ready, onFinish }: { ready: boolean; onFinish: () => void }) {
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMinElapsed(true), 2100);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (minElapsed && ready) onFinish();
  }, [minElapsed, ready, onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-ivory"
      exit={{ y: '-100%' }}
      transition={{ duration: 1.1, ease: CURTAIN }}
      aria-hidden
    >
      <div className="grain absolute inset-0" />

      <div
        dir="ltr"
        className="relative flex overflow-hidden pb-[0.1em] font-serif text-[clamp(2.75rem,9vw,7rem)] font-medium leading-none tracking-tight"
      >
        {BRAND.split('').map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: '115%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-115%' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.045 }}
          >
            {ch}
          </motion.span>
        ))}
      </div>

      <div className="relative mt-7 h-px w-48 overflow-hidden bg-ivory/15">
        <motion.div
          className="h-full origin-left bg-brass"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: 0.25 }}
        />
      </div>

      <motion.p
        className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.55em] text-ivory/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        Premium Textile
      </motion.p>
    </motion.div>
  );
}
