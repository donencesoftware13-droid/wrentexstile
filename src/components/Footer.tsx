import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { CONTACT, linkOrNull, useSiteContent, whatsappUrl } from '../lib/site';
import { EASE, Magnetic, WhatsAppIcon } from './fx';

export const SALES_CHANNELS = [
  { key: 'social_trendyol', label: 'Trendyol', alwaysShow: true },
  { key: 'social_etsy', label: 'Etsy', alwaysShow: true },
  { key: 'social_amazon', label: 'Amazon', alwaysShow: true },
  { key: 'social_hepsiburada', label: 'Hepsiburada', alwaysShow: false },
];

export default function Footer() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const content = useSiteContent();

  const channels = SALES_CHANNELS.map((c) => ({ ...c, url: linkOrNull(content, c.key) })).filter(
    (c) => c.alwaysShow || c.url,
  );

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    else navigate(`/#${id}`);
  };

  const heading = 'mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-ivory rtl:tracking-normal';
  const link = 'transition-colors duration-300 hover:text-ivory';

  return (
    <footer className={`relative overflow-hidden bg-ink text-ivory/60 ${pathname === '/' ? '' : 'mt-24'}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="font-serif text-4xl text-ivory">
              Wrentexstile
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{t('footer_tagline')}</p>
            <Magnetic className="mt-8">
              <a
                href={whatsappUrl(t('whatsapp_greeting'), content)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-ivory/20 px-6 py-3 text-sm font-medium text-ivory transition-colors duration-300 hover:border-whatsapp hover:bg-whatsapp hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t('whatsapp_cta')}
              </a>
            </Magnetic>
          </div>

          <div className="md:col-span-2">
            <h3 className={heading}>{t('quick_links')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/#about" onClick={goTo('about')} className={link}>
                  {t('about')}
                </a>
              </li>
              <li>
                <a href="/#categories" onClick={goTo('categories')} className={link}>
                  {t('categories')}
                </a>
              </li>
              <li>
                <Link to="/cart" className={link}>
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className={heading}>{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:+${CONTACT.phoneE164}`} className={link} dir="ltr">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className={link}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="leading-relaxed">{CONTACT.address}</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className={heading}>{t('sales_channels')}</h3>
            <ul className="space-y-3 text-sm">
              {channels.map((c) => (
                <li key={c.key}>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className={link}>
                      {c.label}
                    </a>
                  ) : (
                    c.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-ivory/10 pt-8 text-xs sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} Wrentexstile. {t('rights')}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-3 font-semibold uppercase tracking-[0.25em] text-ivory/70 transition-colors hover:text-ivory rtl:tracking-normal"
          >
            {t('back_to_top')}
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 transition-all duration-500 ease-luxe group-hover:-translate-y-1 group-hover:bg-ivory group-hover:text-ink">
              <ArrowUp className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      <div aria-hidden dir="ltr" className="relative select-none overflow-hidden">
        <motion.div
          initial={{ y: '45%' }}
          whileInView={{ y: '0%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
          className="whitespace-nowrap text-center font-serif text-[18.5vw] font-medium leading-[0.78] tracking-[-0.03em] text-ivory/[0.07]"
        >
          Wrentexstile
        </motion.div>
      </div>
    </footer>
  );
}
