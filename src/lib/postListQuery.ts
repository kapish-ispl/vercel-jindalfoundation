export type PageSearchParams = Record<string, string | string[] | undefined>;

export function getPostListQuery(slug: string, pageSlug: string, limit: number, page: number, type?: string | null): string {
  const params = new URLSearchParams({ slug, limit: String(limit), excludeUrl: '1' });
  if (page > 1) params.set('offset', String((page - 1) * limit));
  if (pageSlug === 'publications') params.set('metaInfo[category_1761552186]', type || 'Success Stories');
  if (pageSlug === 'news') params.set('metaInfo[type_1602134867]', type || 'Media Coverage');
  if (pageSlug === 'gallery' || slug === 'gallery') params.set('metaInfo[type_1617597580]', type || 'photo');
  return params.toString();
}

export function getPageNumber(value?: string | null): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function getPostListKey(slug: string, component: string, limit: number): string {
  return JSON.stringify([slug, component, limit]);
}
