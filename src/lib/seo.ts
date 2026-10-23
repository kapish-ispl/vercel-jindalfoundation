export const SITE_URL = 'https://jindalfoundation.com';
export const CANONICAL_HOST = 'jindalfoundation.com';

export function normalizePagePath(path: string): string {
  const normalized = `/${path.replace(/^\/+|\/+$/g, '')}`.toLowerCase();
  return normalized === '/home' ? '/' : normalized;
}

export function getCanonicalUrl(slug: string, pathPrefix = ''): string {
  const path = [pathPrefix, slug].map(part => part.trim().replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/');
  return `${SITE_URL}${normalizePagePath(path)}`;
}
