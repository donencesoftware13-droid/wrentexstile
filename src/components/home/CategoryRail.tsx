import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useLang, useMediaQuery, type Lang } from '../../lib/site';
import { ArrowIcon, EASE, RevealWords, SectionLabel } from '../fx';
import { field, type Category } from './types';

const fallbackImage = (id: number) => `https://picsum.photos/seed/cat${id}/600/600`;
const pad = (n: number) => String(n).padStart(2, '0');

function CategoryCard({
  category,
  index,
  lang,
  imageX,
  onHover,
}: {
  category: Category;
  index: number;
  lang: Lang;
  imageX?: MotionValue<string>;
  onHover?: (hovering: boolean) => void;
}) {
  const name = field(category, 'name', lang);
  const fallback = fallbackImage(category.id);

  return (
    <Link
      to={`/category/${category.id}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
      className="group relative block aspect-[3/4] w-[78vw] shrink-0 overflow-hidden bg-ink-2 sm:w-[46vw] lg:w-[30vw] lg:cursor-none xl:w-[26vw]"
    >
      <motion.img
        src={category.image_url || fallback}
        alt={name}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={imageX ? { x: imageX } : undefined}
        className="absolute inset-y-0 -start-[10%] h-full w-[120%] max-w-none object-cover transition-[scale] duration-[1400ms] ease-luxe group-hover:scale-110"
        onError={(e) => {
          if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-ink/10" />
      <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/25" />

      <span className="absolute start-6 top-6 font-serif text-lg italic text-ivory/80">({pad(index + 1)})</span>

      <div className="absolute inset-x-6 bottom-7 flex items-end justify-between gap-4 text-ivory">
        <h3 className="font-serif text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.95]">{name}</h3>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ivory/30 transition-all duration-500 ease-luxe group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
          <ArrowIcon
            className={`h-5 w-5 transition-transform duration-500 ease-luxe group-hover:rotate-0 ${
              lang === 'ar' ? 'rotate-45' : '-rotate-45'
            }`}
          />
        </span>
      </div>
      <span className="absolute inset-x-6 bottom-0 h-[2px] origin-left scale-x-0 bg-brass transition-transform duration-700 ease-luxe group-hover:scale-x-100 rtl:origin-right" />
    </Link>
  );
}

function Intro({ count, progress }: { count: number; progress?: MotionValue<number> }) {
  const { t } = useTranslation();
  return (
    <>
      <SectionLabel index="02" label={t('categories')} tone="dark" />
      <RevealWords
        as="h2"
        text={t('collections_heading')}
        className="mt-8 font-serif text-[clamp(3.25rem,6.5vw,7rem)] font-medium leading-[0.9] tracking-[-0.02em] rtl:leading-[1.25] rtl:tracking-normal"
      />
      <p className="mt-8 max-w-sm text-base leading-relaxed text-ivory/60">{t('collections_text')}</p>
      {progress && (
        <div className="mt-12 flex items-center gap-4 text-ivory/50">
          <span className="font-serif text-lg italic text-brass">01</span>
          <div className="h-px w-40 overflow-hidden bg-ivory/15">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-brass rtl:origin-right" />
          </div>
          <span className="font-serif text-lg italic">{pad(count)}</span>
        </div>
      )}
    </>
  );
}

/** Desktop: the section pins while vertical scrolling slides the collection sideways. */
function StickyRail({ categories, lang }: { categories: Category[]; lang: Lang }) {
  const { t } = useTranslation();
  const isRtl = lang === 'ar';
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [hovering, setHovering] = useState(false);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [categories.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const rawX = useTransform(scrollYProgress, (v) => v * distance * (isRtl ? 1 : -1));
  const x = useSpring(rawX, { stiffness: 160, damping: 32, mass: 0.35 });
  const imageX = useTransform(scrollYProgress, [0, 1], isRtl ? ['-7%', '7%'] : ['7%', '-7%']);
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32 });

  // "Discover" cursor that follows the mouse over the cards
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 350, damping: 30, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 350, damping: 30, mass: 0.5 });

  return (
    <section
      ref={sectionRef}
      id="categories"
      style={{ height: `calc(100vh + ${distance}px)` }}
      onPointerMove={(e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }}
      className="relative bg-ink text-ivory"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="grain absolute inset-0" />
        <motion.div ref={trackRef} style={{ x }} className="relative flex w-max items-center gap-8 px-[6vw]">
          <div className="flex w-[34vw] shrink-0 flex-col justify-center pe-[3vw]">
            <Intro count={categories.length} progress={progress} />
          </div>
          {categories.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={i}
              lang={lang}
              imageX={imageX}
              onHover={setHovering}
            />
          ))}
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed left-0 top-0 z-30 -ml-12 -mt-12 h-24 w-24"
      >
        <motion.div
          initial={false}
          animate={{ scale: hovering ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="flex h-full w-full items-center justify-center rounded-full bg-brass text-[11px] font-semibold uppercase tracking-[0.2em] text-ink rtl:tracking-normal"
        >
          {t('discover')}
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Mobile, tablet and reduced motion: a native swipe carousel. */
function SwipeRail({ categories, lang }: { categories: Category[]; lang: Lang }) {
  return (
    <section id="categories" className="relative overflow-hidden bg-ink py-24 text-ivory md:py-32">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Intro count={categories.length} />
      </div>
      <div className="no-scrollbar relative mt-14 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8">
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
            className="snap-start"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE, delay: Math.min(i, 3) * 0.1 }}
          >
            <CategoryCard category={category} index={i} lang={lang} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function CategoryRail({ categories }: { categories: Category[] }) {
  const lang = useLang();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduce = useReducedMotion();

  if (categories.length === 0) return <div id="categories" />;
  return desktop && !reduce ? (
    <StickyRail categories={categories} lang={lang} />
  ) : (
    <SwipeRail categories={categories} lang={lang} />
  );
}
