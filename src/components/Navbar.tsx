import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CONTACT } from '../lib/site';
import { CURTAIN, EASE, RollText } from './fx';

const LANGS = [
  { code: 'tr', short: 'TR', name: 'Türkçe' },
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'ar', short: 'AR', name: 'العربية' },
];

function LangSwitch({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  return (
    <div className={`items-center gap-1 text-xs font-semibold tracking-[0.15em] ${className}`}>
      {LANGS.map((lang, i) => (
        <Fragment key={lang.code}>
          {i > 0 && <span className="opacity-30">/</span>}
          <button
            type="button"
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-label={lang.name}
            aria-pressed={i18n.language === lang.code}
            className={`px-1 py-1 transition-opacity duration-300 ${
              i18n.language === lang.code ? 'opacity-100' : 'opacity-45 hover:opacity-100'
            }`}
          >
            {lang.short}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === '/';
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > previous && y > 240);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { id: 'top', label: t('home') },
    { id: 'about', label: t('about') },
    { id: 'categories', label: t('categories') },
    { id: 'contact', label: t('contact') },
  ];

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') {
      if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(id === 'top' ? '/' : `/#${id}`);
    }
  };

  // Transparent over the home hero, frosted ivory everywhere else.
  const solid = (!isHome || scrolled) && !open;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`border-b transition-[background-color,color,border-color] duration-500 ${
            solid
              ? 'border-ink/10 bg-ivory/85 text-ink backdrop-blur-xl'
              : 'border-transparent bg-transparent text-ivory'
          }`}
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link to="/" onClick={goTo('top')} className="font-serif text-[1.75rem] font-medium tracking-tight">
              Wrentexstile
            </Link>

            <nav className="hidden items-center gap-9 md:flex">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.id === 'top' ? '/' : `/#${link.id}`}
                  onClick={goTo(link.id)}
                  className="group relative py-2 text-[12px] font-semibold uppercase tracking-[0.2em] rtl:text-sm rtl:tracking-normal"
                >
                  <RollText>{link.label}</RollText>
                  <span className="absolute -bottom-0.5 start-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-luxe group-hover:scale-x-100 rtl:origin-right" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-5">
              <LangSwitch className="hidden md:flex" />
              <Link to="/cart" aria-label={t('cart')} className="relative p-1 transition-opacity hover:opacity-70">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="absolute -end-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brass px-1 text-[10px] font-bold text-ink"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? t('close') : t('menu')}
                aria-expanded={open}
                className="relative -me-1 p-2 md:hidden"
              >
                <span className="relative block h-3 w-7">
                  <motion.span
                    className="absolute start-0 h-px w-full bg-current"
                    initial={false}
                    animate={open ? { top: '50%', rotate: 45 } : { top: '0%', rotate: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                  <motion.span
                    className="absolute start-0 h-px w-full bg-current"
                    initial={false}
                    animate={open ? { top: '50%', rotate: -45 } : { top: '100%', rotate: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.8, ease: CURTAIN }}
            className="fixed inset-0 z-[45] flex flex-col bg-ink text-ivory md:hidden"
          >
            <div className="grain absolute inset-0" />
            <nav className="relative mt-32 flex flex-col px-6">
              {links.map((link, i) => (
                <div key={link.id} className="overflow-hidden border-b border-ivory/10">
                  <motion.a
                    href={link.id === 'top' ? '/' : `/#${link.id}`}
                    onClick={goTo(link.id)}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.07 }}
                    className="flex items-baseline justify-between py-4 font-serif text-[2.6rem] leading-none"
                  >
                    {link.label}
                    <span className="font-serif text-base italic text-brass">0{i + 1}</span>
                  </motion.a>
                </div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative mt-auto space-y-5 px-6 pb-10 text-sm text-ivory/70"
            >
              <LangSwitch className="flex text-ivory" />
              <div className="flex flex-col gap-1">
                <a href={`tel:+${CONTACT.phoneE164}`} className="hover:text-ivory">
                  {CONTACT.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-ivory">
                  {CONTACT.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
