import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CONTACT } from '../../lib/site';
import { EASE, Magnetic, RevealWords, RollText, WhatsAppIcon } from '../fx';

/** Closing call to action: a big "sewn button" that opens WhatsApp. */
export default function ContactCta({ whatsappHref }: { whatsappHref: string }) {
  const { t } = useTranslation();

  return (
    <section id="contact" className="relative overflow-hidden bg-ivory py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brass-deep rtl:text-sm rtl:tracking-normal"
        >
          {t('cta_eyebrow')}
        </motion.p>
        <RevealWords
          as="h2"
          text={t('cta_heading')}
          accentLast
          accentClassName="italic text-brass-deep"
          className="mx-auto mt-8 max-w-5xl font-serif text-[clamp(3.25rem,9vw,9rem)] font-medium leading-[0.9] tracking-[-0.03em] rtl:leading-[1.25] rtl:tracking-normal"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          className="mx-auto mt-10 max-w-xl text-base leading-relaxed text-ink/65 md:text-lg"
        >
          {t('cta_text')}
        </motion.p>

        <div className="mt-16 flex flex-col items-center gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
          >
            <Magnetic strength={0.4}>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-44 w-44 items-center justify-center rounded-full md:h-52 md:w-52"
              >
                {/* stitched ring around the button */}
                <motion.svg
                  viewBox="0 0 100 100"
                  className="absolute -inset-4 text-brass-deep/60"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  aria-hidden
                >
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2.2 2" />
                </motion.svg>
                <span className="absolute inset-0 overflow-hidden rounded-full bg-ink">
                  <span className="absolute inset-0 scale-0 rounded-full bg-whatsapp transition-[scale] duration-700 ease-luxe group-hover:scale-100" />
                </span>
                <span className="relative flex flex-col items-center gap-3 px-6 text-ivory">
                  <WhatsAppIcon className="h-8 w-8 transition-[translate] duration-500 ease-luxe group-hover:-translate-y-1" />
                  <span className="text-[11px] font-semibold uppercase leading-snug tracking-[0.2em] rtl:text-sm rtl:tracking-normal">
                    {t('whatsapp_cta')}
                  </span>
                </span>
              </a>
            </Magnetic>
          </motion.div>

          <div className="flex flex-col items-center gap-2 text-sm text-ink/60 sm:flex-row sm:gap-6">
            <span>{t('or_reach_us')}</span>
            <a href={`tel:+${CONTACT.phoneE164}`} dir="ltr" className="group font-semibold text-ink">
              <RollText>{CONTACT.phoneDisplay}</RollText>
            </a>
            <span className="hidden h-1 w-1 rounded-full bg-ink/30 sm:block" />
            <a href={`mailto:${CONTACT.email}`} className="group font-semibold text-ink">
              <RollText>{CONTACT.email}</RollText>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
