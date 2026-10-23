import React, { useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowIcon, EASE, Magnetic, RevealWords, RollText, Stitch, WhatsAppIcon } from '../fx';

export const HERO_FALLBACK = 'https://picsum.photos/seed/textile/1920/1080?blur=2';
const STITCH_PATH = 'M -60 780 C 200 720, 340 520, 600 560 S 960 780, 1180 540 S 1380 250, 1520 290';

function SpinBadge({ onClick, label }: { onClick: () => void; label: string }) {
  const pathId = `badge-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative flex h-36 w-36 items-center justify-center rounded-full text-ivory"
    >
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      >
        <defs>
          <path id={pathId} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current text-[13px] font-semibold uppercase" style={{ letterSpacing: '0.32em' }}>
          <textPath href={`#${pathId}`} textLength="486" lengthAdjust="spacing">
            Wrentexstile · Premium Textile · Konya ·
          </textPath>
        </text>
      </motion.svg>
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/30 transition-all duration-500 ease-luxe group-hover:scale-110 group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
        <ArrowDown className="h-5 w-5" strokeWidth={1.5} />
      </span>
    </button>
  );
}

export default function Hero({
  title,
  subtitle,
  image,
  play,
  whatsappHref,
}: {
  title: string;
  subtitle: string;
  image: string;
  play: boolean;
  whatsappHref: string;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Scroll: the photo sinks slower than the page, the copy drifts and fades.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Pointer: the photo leans away from the cursor.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 50, damping: 18 });
  const spy = useSpring(py, { stiffness: 50, damping: 18 });
  const lookX = useTransform(spx, (v) => v * -26);
  const lookY = useTransform(spy, (v) => v * -16);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const scrollToCollections = (e?: React.MouseEvent) => {
    e?.preventDefault();
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink text-ivory"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <motion.div style={{ x: lookX, y: lookY }} className="absolute -inset-[4%]">
          <motion.img
            src={image}
            alt=""
            referrerPolicy="no-referrer"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={play ? { scale: 1.04, opacity: 0.6 } : undefined}
            transition={{ duration: 2.8, ease: EASE }}
            className="h-full w-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== HERO_FALLBACK) e.currentTarget.src = HERO_FALLBACK;
            }}
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_20%,rgba(17,16,14,0.65)_85%)]" />
      <div className="grain absolute inset-0" />

      <Stitch
        d={STITCH_PATH}
        viewBox="0 0 1440 900"
        play={play}
        delay={0.5}
        duration={3.4}
        className="absolute inset-0 h-full w-full text-brass/55"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={play ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1.2, ease: EASE, delay: 1.3 }}
        className="absolute end-10 top-32 z-10 hidden lg:block"
      >
        <SpinBadge onClick={() => scrollToCollections()} label={t('hero_cta_primary')} />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-28 sm:px-8 md:pb-32"
      >
        <motion.div
          {...fadeUp(0.2)}
          className="mb-7 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ivory/75 rtl:text-sm rtl:tracking-normal"
        >
          <motion.span
            className="h-px w-14 origin-left bg-brass rtl:origin-right"
            initial={{ scaleX: 0 }}
            animate={play ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
          />
          {t('hero_eyebrow')}
        </motion.div>

        <RevealWords
          as="h1"
          text={title}
          play={play}
          delay={0.35}
          stagger={0.09}
          accentLast
          className="max-w-5xl font-serif text-[clamp(3rem,8.2vw,8rem)] font-medium leading-[0.92] tracking-[-0.025em] rtl:leading-[1.25] rtl:tracking-normal"
        />

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p {...fadeUp(0.95)} className="max-w-md text-base leading-relaxed text-ivory/75 md:text-lg">
            {subtitle}
          </motion.p>

          <motion.div {...fadeUp(1.1)} className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#categories"
                onClick={scrollToCollections}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ivory px-8 py-4 text-sm font-semibold text-ink"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-brass transition-transform duration-500 ease-luxe group-hover:translate-y-0" />
                <RollText className="relative">{t('hero_cta_primary')}</RollText>
                <ArrowIcon className="relative h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </a>
            </Magnetic>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-ivory/25 px-7 py-4 text-sm font-semibold text-ivory backdrop-blur-sm transition-colors duration-500 hover:border-ivory/60 hover:bg-ivory/10"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              <RollText>{t('hero_cta_secondary')}</RollText>
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute inset-x-0 bottom-0 z-10 mx-auto hidden max-w-7xl items-center gap-3 px-5 pb-8 text-[10px] md:flex font-semibold uppercase tracking-[0.35em] text-ivory/60 sm:px-8 rtl:tracking-normal"
      >
        <span className="relative block h-10 w-px overflow-hidden bg-ivory/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-ivory"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
        {t('scroll')}
      </motion.div>
    </section>
  );
}
