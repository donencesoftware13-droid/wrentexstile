import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { linkOrNull, useLang, type SiteContent } from '../../lib/site';
import { SALES_CHANNELS } from '../Footer';
import { ArrowIcon, EASE, RevealImage, RevealWords, RollText, SectionLabel } from '../fx';

export const SERVICES_FALLBACK = 'https://picsum.photos/seed/services/800/1000';

const rise = (i: number) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: 0.15 + i * 0.12 } },
});

/** Services, the three brand values and the marketplaces the shop sells on. */
export default function Craft({ text, image, content }: { text: string; image: string; content: SiteContent }) {
  const { t } = useTranslation();
  const lang = useLang();
  const values = [1, 2, 3].map((n) => ({ title: t(`value_${n}_title`), text: t(`value_${n}_text`) }));
  const channels = SALES_CHANNELS.map((c) => ({ ...c, url: linkOrNull(content, c.key) })).filter(
    (c) => c.alwaysShow || c.url,
  );

  return (
    <section id="services" className="relative bg-linen py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <RevealImage
              src={image}
              fallback={SERVICES_FALLBACK}
              alt={t('services')}
              parallax={8}
              className="aspect-[4/5] w-full"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionLabel index="04" label={t('services')} />
          <RevealWords
            as="h2"
            text={t('craft_heading')}
            accentLast
            accentClassName="italic text-brass-deep"
            className="mt-8 font-serif text-[clamp(2.75rem,5.5vw,5rem)] font-medium leading-[0.95] tracking-[-0.02em] rtl:leading-[1.3] rtl:tracking-normal"
          />
          {text && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="mt-10 max-w-xl text-base leading-[1.8] text-ink/70 md:text-lg"
            >
              {text}
            </motion.p>
          )}

          <ol className="mt-16">
            {values.map((value, i) => (
              <motion.li
                key={value.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '0px 0px -80px 0px' }}
                className="group relative grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-2 py-8 md:grid-cols-[4.5rem_1fr_1fr] md:items-baseline"
              >
                <motion.span
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 1.3, ease: EASE, delay: i * 0.12 } },
                  }}
                  className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20 rtl:origin-right"
                />
                <motion.span variants={rise(i)} className="font-serif text-2xl italic text-brass-deep">
                  0{i + 1}
                </motion.span>
                <motion.h3
                  variants={rise(i)}
                  className="font-serif text-3xl font-medium transition-[translate] duration-500 ease-luxe group-hover:translate-x-2 md:text-4xl rtl:group-hover:-translate-x-2"
                >
                  {value.title}
                </motion.h3>
                <motion.p variants={rise(i)} className="col-start-2 text-ink/60 md:col-start-3">
                  {value.text}
                </motion.p>
              </motion.li>
            ))}
          </ol>

          <div className="mt-12 border-t border-ink/20 pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/50 rtl:text-sm rtl:tracking-normal">
              {t('channels_heading')}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {channels.map((c, i) => (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
                >
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 font-serif text-4xl font-medium md:text-5xl"
                    >
                      <RollText>{c.label}</RollText>
                      <ArrowIcon
                        className={`h-5 w-5 text-brass-deep transition-transform duration-500 ease-luxe group-hover:rotate-0 ${
                          lang === 'ar' ? 'rotate-45' : '-rotate-45'
                        }`}
                      />
                    </a>
                  ) : (
                    <span className="font-serif text-4xl font-medium text-ink/80 md:text-5xl">{c.label}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
