import type { Lang } from '../../lib/site';

export interface Category {
  id: number;
  name_tr: string;
  name_en: string;
  name_ar: string;
  image_url: string;
}

export interface Product {
  id: number;
  category_id: number;
  name_tr: string;
  name_en: string;
  name_ar: string;
  price: number;
  image_url: string;
  image_urls?: string[];
  views?: number;
  stock?: number;
  category_name_tr?: string;
  category_name_en?: string;
  category_name_ar?: string;
}

type Localized<P extends string> = { [K in `${P}_${Lang}`]?: string | null };

/** `name_tr` / `name_en` / `name_ar` style lookup with a Turkish fallback. */
export function field<P extends string>(item: Localized<P>, prefix: P, lang: Lang): string {
  const own = item[`${prefix}_${lang}` as keyof Localized<P>];
  const fallback = item[`${prefix}_tr` as keyof Localized<P>];
  return (own || fallback || '') as string;
}
