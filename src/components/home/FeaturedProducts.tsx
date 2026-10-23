import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { formatPrice, useLang, type Lang } from '../../lib/site';
import { ArrowIcon, EASE, RevealWords, SectionLabel } from '../fx';
import { field, type Product } from './types';

function ProductCard({ product, index, lang }: { product: Product; index: number; lang: Lang }) {
  const { t } = useTranslation();
  const name = field(product, 'name', lang);
  const category = field(product, 'category_name', lang);
  const fallback = `https://picsum.photos/seed/${product.id}/600/750`;
  const images = Array.from(new Set([product.image_url, ...(product.image_urls || [])].filter(Boolean)));
  const primary = images[0] || fallback;
  const secondary = images[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay: (index % 4) * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-linen">
          <img
            src={primary}
            alt={name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 h-full w-full object-cover transition-[scale,opacity] duration-[1200ms] ease-luxe group-hover:scale-105 ${
              secondary ? 'group-hover:opacity-0' : ''
            }`}
            onError={(e) => {
              if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
          />
          {secondary && (
            <img
              src={secondary}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-[scale,opacity] duration-[1200ms] ease-luxe group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-[calc(100%+1rem)] transition-transform duration-500 ease-luxe group-hover:translate-y-0 md:block">
            <span className="flex items-center justify-between rounded-full bg-ivory/90 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink backdrop-blur rtl:tracking-normal">
              {t('view_product')}
              <ArrowIcon className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div>
            {category && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/45 rtl:text-xs rtl:tracking-normal">
                {category}
              </p>
            )}
            <h3 className="mt-1.5 font-serif text-xl font-medium leading-tight md:text-2xl">{name}</h3>
          </div>
          <p className="shrink-0 text-sm font-semibold sm:pt-5">{formatPrice(product.price, lang)}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const { t } = useTranslation();
  const lang = useLang();
  if (products.length === 0) return null;

  return (
    <section className="relative bg-ivory py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03" label={t('products')} />
            <RevealWords
              as="h2"
              text={t('featured_heading')}
              className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.02em] rtl:leading-[1.3] rtl:tracking-normal"
            />
          </div>
          <p className="max-w-xs text-ink/60">{t('featured_text')}</p>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
