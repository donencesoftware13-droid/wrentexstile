/**
 * Small motion building blocks shared by the home page, navbar and footer.
 * All of them respect "reduce motion" through <MotionConfig reducedMotion="user"> in App.tsx
 * or an explicit useReducedMotion() check.
 */
import React, { Fragment, useEffect, useId, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useMediaQuery } from '../lib/site';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const CURTAIN = [0.76, 0, 0.24, 1] as const;

type TextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

/** Splits text into words that slide up from behind a mask, one after another. */
export function RevealWords({
  text,
  as = 'h2',
  className = '',
  delay = 0,
  stagger = 0.07,
  play,
  accentLast = false,
  accentClassName = 'italic text-brass',
}: {
  text: string;
  as?: TextTag;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Controlled start. When omitted the words reveal as they scroll into view. */
  play?: boolean;
  accentLast?: boolean;
  accentClassName?: string;
}) {
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const active = play ?? inView;
  const words = text.split(/\s+/).filter(Boolean);
  const hidden = { y: '115%', rotate: 4 };

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="-mx-[0.06em] -mb-[0.14em] inline-block overflow-hidden px-[0.06em] pb-[0.14em] align-top">
            <motion.span
              className={`inline-block origin-bottom-left rtl:origin-bottom-right ${
                accentLast && i === words.length - 1 ? accentClassName : ''
              }`}
              initial={hidden}
              animate={active ? { y: '0%', rotate: 0 } : hidden}
              transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}

function ScrollWord({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/** Paragraph whose words light up one by one as the reader scrolls through it. */
export function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.6'] });
  const words = text.split(/\s+/).filter(Boolean);

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <ScrollWord progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {word}
          </ScrollWord>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </p>
  );
}

/** Pulls its child gently toward the cursor (desktop pointers only). */
export function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery('(pointer: fine)');
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!finePointer || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Text that rolls up to a copy of itself on hover. The parent needs the `group` class. */
export function RollText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="block transition-transform duration-500 ease-luxe group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-luxe group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

export function SectionLabel({
  index,
  label,
  tone = 'light',
}: {
  index: string;
  label: string;
  tone?: 'light' | 'dark';
}) {
  return (
    <div
      className={`flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em] rtl:tracking-normal ${
        tone === 'dark' ? 'text-ivory/70' : 'text-ink/60'
      }`}
    >
      <span
        className={`font-serif text-lg font-medium italic normal-case tracking-normal ${
          tone === 'dark' ? 'text-brass' : 'text-brass-deep'
        }`}
      >
        ({index})
      </span>
      <motion.span
        className="h-px w-12 origin-left bg-current rtl:origin-right"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <span>{label}</span>
    </div>
  );
}

/** Counts up from zero the first time it scrolls into view. */
export function Counter({ to, suffix = '', duration = 2.2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    if (reduce) {
      node.textContent = `${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, suffix, duration]);

  return <span ref={ref}>{`0${suffix}`}</span>;
}

/**
 * A dashed "stitch" that sews itself along an SVG path. Driven either by a scroll MotionValue
 * (`progress`) or by time once `play` becomes true.
 */
export function Stitch({
  d,
  viewBox,
  className = '',
  progress,
  play = true,
  delay = 0,
  duration = 2.6,
  strokeWidth = 1.5,
  dash = '10 9',
}: {
  d: string;
  viewBox: string;
  className?: string;
  progress?: MotionValue<number>;
  play?: boolean;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
  dash?: string;
}) {
  const maskId = `stitch-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const drawn = progress
    ? { style: { pathLength: progress } }
    : {
        initial: { pathLength: 0 },
        animate: { pathLength: play ? 1 : 0 },
        transition: { duration, delay, ease: EASE },
      };

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className={className} fill="none" aria-hidden>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <motion.path d={d} stroke="white" strokeWidth={strokeWidth * 8} {...drawn} />
        </mask>
      </defs>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}

/** Image that is unveiled by a rising curtain and then drifts with scroll. */
export function RevealImage({
  src,
  fallback,
  alt,
  className = '',
  parallax = 10,
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-ink/10 ${className}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.4, ease: CURTAIN }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{ y }}
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE }}
        className="absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover"
        onError={(e) => {
          if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
        }}
      />
    </motion.div>
  );
}

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`rtl:-scale-x-100 ${className}`} aria-hidden>
      <path d="M4 12h16m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
