import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import CategoryProducts from './pages/CategoryProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { Settings } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" so the CSS smooth-scroll setting doesn't animate route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    document.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  useEffect(() => {
    // Track site visit once per session
    if (!sessionStorage.getItem('visited')) {
      fetch('/api/analytics/visit', { method: 'POST' }).catch(console.error);
      sessionStorage.setItem('visited', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-ivory font-sans text-ink">
      <Navbar />

      {/* The home hero sits under the transparent navbar; other pages start below it. */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={pathname === '/' ? '' : 'pt-20'}
      >
        {children}
      </motion.main>

      <Footer />
      <WhatsAppButton />

      <Link
        to="/admin"
        className="group fixed bottom-5 start-5 z-40 rounded-full bg-ink/80 p-2.5 text-ivory opacity-40 shadow-lg backdrop-blur transition-opacity duration-300 hover:opacity-100"
        title={t('admin')}
        aria-label={t('admin')}
      >
        <Settings className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/category/:id" element={<Layout><CategoryProducts /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        </Routes>
      </CartProvider>
    </MotionConfig>
  );
}
