import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'motion/react';
import { Counter, EASE, RevealImage, RevealWords, ScrollRevealText, SectionLabel, Stitch } from '../fx';

export const ABOUT_FALLBACK = 'https://picsum.photos/seed/about/800/1000';

export default function About({ text, image }: { text: string; image: string }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const seam = useTransform(scrollYProgress, [0.12, 0.75], [0, 1]);

  return (
    <section ref={ref} id="about" className="relative overflow-hidden bg-ivory py-28 md:py-40">
      <Stitch
        progress={seam}
        d="M 1520 60 C 1180 160, 1080 380, 1240 540 S 1420 860, 1080 1020"
        viewBox="0 0 1440 1000"
        className="pointer-events-none absolute inset-0 h-full w-full text-brass-deep/35"
      />

      <div className="relative mx-auto grid max-w-7xl gap-20 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <SectionLabel index="01" label={t('about')} />
          <RevealWords
            as="h2"
            text={t('about_heading')}
            accentLast
            accentClassName="italic text-brass-deep"
            className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.02em] rtl:leading-[1.3] rtl:tracking-normal"
          />
          {text && (
            <ScrollRevealText
              text={text}
              className="mt-12 max-w-2xl font-serif text-[clamp(1.35rem,2.1vw,1.85rem)] leading-[1.45] text-ink"
            />
          )}
        </div>

        <div className="relative lg:col-span-5 lg:pt-28">
          <RevealImage src={image} fallback={ABOUT_FALLBACK} alt={t('about')} className="aspect-[4/5] w-full" />
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
            className="absolute -bottom-12 start-6 flex h-40 w-40 flex-col items-center justify-center rounded-full bg-ink text-center text-ivory shadow-2xl shadow-ink/30 md:-start-12 md:h-44 md:w-44"
          >
            <span className="font-serif text-6xl font-medium leading-none lining-nums">
              <Counter to={10} suffix="+" />
            </span>
            <span className="mt-2 max-w-[7.5rem] text-[10px] font-semibold uppercase leading-snug tracking-[0.22em] text-ivory/70 rtl:text-xs rtl:tracking-normal">
              {t('years_experience')}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
