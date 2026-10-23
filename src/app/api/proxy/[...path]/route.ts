import { NextRequest, NextResponse } from 'next/server';
import { CONSTANTS } from '@/config/constant';
import { KEYS } from '@/config/key';

const EXTERNAL_API_BASE = (process.env.NEXT_PUBLIC_URL || 'https://api.jindalsteelpower.com').trim().replace(/\/$/, '');

function buildSecureHeaders(incomingContentType?: string | null): Record<string, string> {
  const isMultipart = incomingContentType?.includes('multipart/form-data');
  const headers: Record<string, string> = {
    [KEYS.ACCEPT_TYPE]: CONSTANTS.RESPONSE_FORMAT,
    [KEYS.ACCEPT_LANGUAGE]: CONSTANTS.LANGUAGE_ENGLISH,
    [KEYS.X_AUTHORIZATION_TOKEN]: CONSTANTS.X_AUTHORIZATION_TOKEN || '',
    [KEYS.X_NETWORK_GUID]: CONSTANTS.X_NETWORK_GUID || '',
  };

  if (isMultipart && incomingContentType) {
    headers[KEYS.CONTENT_TYPE] = incomingContentType;
  } else {
    headers[KEYS.CONTENT_TYPE] = CONSTANTS.REQUEST_FORMAT;
  }

  return headers;
}

async function handleRequest(
  req: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
): Promise<NextResponse> {
  try {
    const { path } = await params;
    const pathStr = path.join('/');
    const searchParams = req.nextUrl.search; // includes leading '?' if query exists
    const externalUrl = `${EXTERNAL_API_BASE}/${pathStr}${searchParams}`;

    const incomingContentType = req.headers.get('content-type');
    const isMultipart = incomingContentType?.includes('multipart/form-data');

    const fetchOptions: RequestInit = {
      method,
      headers: buildSecureHeaders(incomingContentType),
      cache: 'no-store',
    };

    if (method !== 'GET') {
      if (isMultipart) {
        fetchOptions.body = await req.arrayBuffer();
      } else {
        const body = await req.text();
        if (body) fetchOptions.body = body;
      }
    }

    const externalResponse = await fetch(externalUrl, fetchOptions);
    const data = await externalResponse.json();

    return NextResponse.json(data, { status: externalResponse.status });
  } catch (error) {
    console.error('[API Proxy Error]', error);
    return NextResponse.json(
      { error: true, message: 'API Proxy request failed.' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, params, 'GET');
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, params, 'POST');
}
