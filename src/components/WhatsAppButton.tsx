import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { useSiteContent, whatsappUrl } from '../lib/site';
import { ArrowIcon, WhatsAppIcon } from './fx';

const BUBBLE_KEY = 'wt-wa-bubble-seen';

/** Floating WhatsApp button with a one-time greeting bubble per visit. */
export default function WhatsAppButton() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const content = useSiteContent();
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [bubble, setBubble] = useState(false);

  const href = whatsappUrl(t('whatsapp_greeting'), content);
  const hidden = pathname.startsWith('/admin');

  // The greeting appears once per visit, only after the visitor has scrolled past the first
  // screen (so it never covers the hero buttons), and hides itself after a few seconds.
  useEffect(() => {
    if (hidden) return;
    try {
      if (sessionStorage.getItem(BUBBLE_KEY)) return;
    } catch {
      /* storage blocked: still show the bubble once */
    }
    const mountedAt = Date.now();
    let showTimer = 0;
    let hideTimer = 0;
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.7) return;
      window.removeEventListener('scroll', onScroll);
      showTimer = window.setTimeout(
        () => {
          setBubble(true);
          try {
            sessionStorage.setItem(BUBBLE_KEY, '1');
          } catch {
            /* ignore */
          }
          hideTimer = window.setTimeout(() => setBubble(false), 10000);
        },
        Math.max(800, 4000 - (Date.now() - mountedAt)),
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 end-5 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:end-7">
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="pointer-events-auto relative w-64 origin-bottom-right rounded-2xl bg-ivory p-5 text-ink shadow-2xl shadow-ink/25 ring-1 ring-ink/5 rtl:origin-bottom-left"
          >
            <button
              type="button"
              onClick={() => setBubble(false)}
              aria-label={t('close')}
              className="absolute end-3 top-3 rounded-full p-1 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-whatsapp" />
              </span>
              Wrentexstile
            </div>
            <p className="mt-2 font-serif text-[1.35rem] leading-snug">{t('whatsapp_bubble')}</p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setBubble(false)}
              className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0f7a5c]"
            >
              {t('whatsapp_bubble_action')}
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </a>
            <span className="absolute -bottom-1.5 end-6 h-3 w-3 rotate-45 bg-ivory" aria-hidden />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsapp_cta')}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        onClick={() => setBubble(false)}
        initial={{ scale: 0, rotate: -120 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1.4 }}
        whileTap={{ scale: 0.92 }}
        className="pointer-events-auto relative flex h-14 items-center rounded-full bg-whatsapp text-white shadow-xl shadow-whatsapp/30 sm:h-16"
      >
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-whatsapp"
            animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeOut' }}
          />
        )}
        <span className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden whitespace-nowrap"
            >
              <span className="block pe-6 text-sm font-semibold">{t('whatsapp_cta')}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>
    </div>
  );
}
