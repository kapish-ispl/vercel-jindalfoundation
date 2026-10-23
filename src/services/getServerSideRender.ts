import { CONSTANTS } from '@/config/constant';
import { KEYS } from '@/config/key';

export async function serverRequest(
  request: any,
  url: string,
  methodName: string = CONSTANTS.REQUEST_GET,
  requestType?: 'client' | 'server'
): Promise<any> {
  const isServer = requestType ? requestType === 'server' : typeof window === 'undefined';

  try {
    let response: Response;

    if (isServer) {
      // Server-side path (Node.js): direct fetch with auth headers
      const requestHeaders = buildHeaders();
      if (methodName === CONSTANTS.REQUEST_GET) {
        response = await fetch(url, {
          method: 'GET',
          headers: requestHeaders,
          cache: 'no-store',
        });
      } else {
        response = await fetch(url, {
          method: methodName,
          headers: requestHeaders,
          body: JSON.stringify(request),
        });
      }
    } else {
      // Client-side path (Browser): route via /api/proxy to eliminate CORS
      const externalBase = (process.env.NEXT_PUBLIC_URL || 'https://api.jindalsteelpower.com').trim().replace(/\/$/, '');
      const pathAndQuery = url.replace(externalBase, '');
      const proxyUrl = `/api/proxy${pathAndQuery.startsWith('/') ? '' : '/'}${pathAndQuery}`;

      if (methodName === CONSTANTS.REQUEST_GET) {
        response = await fetch(proxyUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        response = await fetch(proxyUrl, {
          method: methodName,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
      }
    }

    const json = await response.json();

    if (json?.errors?.length > 0 && json.errors[0]?.message) {
      console.warn(`[serverRequest:${isServer ? 'server' : 'client'}] API Error:`, json.errors[0].message);
    }

    return json;
  } catch (error: any) {
    const isDynamicServerError = error?.digest === 'DYNAMIC_SERVER_USAGE' || error?.message?.includes('Dynamic server usage');
    // Next must see this signal to render no-store requests dynamically.
    if (isDynamicServerError) throw error;
    console.error(`[serverRequest:${isServer ? 'server' : 'client'}] Fetch error:`, error);
    return {
      error: true,
      message: 'Something went wrong while fetching data.',
    };
  }
}

/**
 * Build headers for API requests
 */
export function buildHeaders(): Record<string, string> {
  return {
    [KEYS.CONTENT_TYPE]: CONSTANTS.REQUEST_FORMAT,
    [KEYS.ACCEPT_TYPE]: CONSTANTS.RESPONSE_FORMAT,
    [KEYS.ACCEPT_LANGUAGE]: CONSTANTS.LANGUAGE_ENGLISH,
    [KEYS.X_AUTHORIZATION_TOKEN]: CONSTANTS.X_AUTHORIZATION_TOKEN || '',
    [KEYS.X_NETWORK_GUID]: CONSTANTS.X_NETWORK_GUID || '',
  };
}
