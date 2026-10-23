import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { loadSiteContent, pick, useLang, whatsappUrl, type SiteContent } from '../lib/site';
import { EASE } from '../components/fx';
import Intro from '../components/home/Intro';
import Hero, { HERO_FALLBACK } from '../components/home/Hero';
import Marquee from '../components/home/Marquee';
import About, { ABOUT_FALLBACK } from '../components/home/About';
import CategoryRail from '../components/home/CategoryRail';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Craft, { SERVICES_FALLBACK } from '../components/home/Craft';
import ContactCta from '../components/home/ContactCta';
import type { Category, Product } from '../components/home/types';

const INTRO_KEY = 'wt-intro-seen';
const FEATURED_COUNT = 8;

function shouldShowIntro(): boolean {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

export default function Home() {
  const { t } = useTranslation();
  const lang = useLang();
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState<{ status: 'success' | 'error'; message?: string } | null>(
    null,
  );

  useEffect(() => {
    const status = searchParams.get('payment');
    const message = searchParams.get('message');
    if (status === 'success') {
      setPaymentStatus({ status: 'success' });
      clearCart();
      // Remove query params
      searchParams.delete('payment');
      setSearchParams(searchParams);
    } else if (status === 'error') {
      setPaymentStatus({ status: 'error', message: message || undefined });
      // Remove query params
      searchParams.delete('payment');
      searchParams.delete('message');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, clearCart]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, contentData, productsData] = await Promise.all([
          fetch('/api/categories').then((res) => (res.ok ? res.json() : [])),
          loadSiteContent(true),
          fetch('/api/products')
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []),
        ]);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setContent(contentData || {});
        const products: Product[] = Array.isArray(productsData) ? productsData : [];
        setFeatured(
          [...products]
            .sort((a, b) => (b.views || 0) - (a.views || 0) || a.id - b.id)
            .slice(0, FEATURED_COUNT),
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }
    setShowIntro(false);
  }, []);

  // No scrolling behind the opening curtain
  useEffect(() => {
    if (!showIntro) return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [showIntro]);

  // Links like /#about from other pages land here before the sections exist
  useEffect(() => {
    if (loading || !location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 150);
    return () => window.clearTimeout(timer);
  }, [loading, location.hash]);

  const play = !loading && !showIntro;
  const whatsappHref = whatsappUrl(t('whatsapp_greeting'), content);

  return (
    <div>
      <AnimatePresence>{showIntro && <Intro key="intro" ready={!loading} onFinish={finishIntro} />}</AnimatePresence>

      {/* Payment Status Toast */}
      <AnimatePresence>
        {paymentStatus && (
          <div className="fixed left-1/2 top-24 z-[70] w-full max-w-md -translate-x-1/2 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex items-start gap-4 rounded-2xl bg-ivory p-5 text-ink shadow-2xl shadow-ink/20 ring-1 ring-ink/10"
            >
              {paymentStatus.status === 'success' ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700" />
              ) : (
                <XCircle className="h-6 w-6 shrink-0 text-red-700" />
              )}
              <div className="flex-1">
                <h3 className="font-serif text-xl font-semibold">
                  {paymentStatus.status === 'success' ? t('payment_success_title') : t('payment_error_title')}
                </h3>
                <p className="mt-1 text-sm text-ink/70">
                  {paymentStatus.status === 'success'
                    ? t('payment_success_text')
                    : paymentStatus.message || t('payment_error_default')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentStatus(null)}
                aria-label={t('close')}
                className="text-ink/40 transition-colors hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Hero
        title={pick(content, 'hero_title', lang, t('hero_title'))}
        subtitle={pick(content, 'hero_subtitle', lang, t('hero_subtitle'))}
        image={pick(content, 'hero_image', 'tr', HERO_FALLBACK)}
        play={play}
        whatsappHref={whatsappHref}
      />

      {!loading && (
        <>
          <Marquee />
          <About text={pick(content, 'about_us', lang)} image={pick(content, 'about_us_image', 'tr', ABOUT_FALLBACK)} />
          <CategoryRail categories={categories} />
          <FeaturedProducts products={featured} />
          <Craft
            text={pick(content, 'services', lang)}
            image={pick(content, 'services_image', 'tr', SERVICES_FALLBACK)}
            content={content}
          />
          <ContactCta whatsappHref={whatsappHref} />
        </>
      )}
    </div>
  );
}
