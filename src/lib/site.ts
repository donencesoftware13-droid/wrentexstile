import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type Lang = 'tr' | 'en' | 'ar';

export interface LocalizedValue {
  tr: string;
  en: string;
  ar: string;
}

export type SiteContent = Record<string, LocalizedValue | undefined>;

export const CONTACT = {
  phoneDisplay: '+90 545 528 42 62',
  phoneE164: '905455284262',
  email: 'info@wrentexstile.com',
  address: 'Ulubatlıhasan mahallesi başkonak sokak No:3/J Karatay-Konya',
};

export function useLang(): Lang {
  const { i18n } = useTranslation();
  const lng = i18n.language;
  return lng === 'en' || lng === 'ar' ? lng : 'tr';
}

/** Value for the current language, falling back to Turkish, then to `fallback`. */
export function pick(content: SiteContent | null | undefined, key: string, lang: Lang, fallback = ''): string {
  const entry = content?.[key];
  return entry?.[lang]?.trim() || entry?.tr?.trim() || fallback;
}

/** A marketplace/social URL from the admin panel, or null while it is still the "#" placeholder. */
export function linkOrNull(content: SiteContent | null | undefined, key: string): string | null {
  const url = content?.[key]?.tr?.trim();
  return url && url !== '#' ? url : null;
}

/**
 * WhatsApp chat link. If the admin panel holds a wa.me / api.whatsapp.com link, its number wins;
 * otherwise the shop number is used.
 */
export function whatsappUrl(message?: string, content?: SiteContent | null): string {
  let phone = CONTACT.phoneE164;
  const configured = linkOrNull(content, 'social_whatsapp');
  const match = configured?.match(/wa\.me\/(\d{8,15})/) || configured?.match(/[?&]phone=(\d{8,15})/);
  if (match) phone = match[1];
  return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

let contentRequest: Promise<SiteContent> | null = null;

/** Fetches /api/content once and shares it. Pass `fresh` to refetch (the home page does, so admin edits show). */
export function loadSiteContent(fresh = false): Promise<SiteContent> {
  if (!contentRequest || fresh) {
    contentRequest = fetch('/api/content')
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => {
        contentRequest = null;
        return {};
      });
  }
  return contentRequest;
}

export function useSiteContent(): SiteContent | null {
  const [content, setContent] = useState<SiteContent | null>(null);
  useEffect(() => {
    let alive = true;
    loadSiteContent().then((data) => alive && setContent(data));
    return () => {
      alive = false;
    };
  }, []);
  return content;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function formatPrice(value: number, lang: Lang): string {
  // Arabic keeps the Turkish format so prices match the cart and checkout pages.
  const locale = lang === 'en' ? 'en-US' : 'tr-TR';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'TRY' }).format(value);
  } catch {
    return `₺${value.toFixed(2)}`;
  }
}
