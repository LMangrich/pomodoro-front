import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing BACKEND_URL environment variable');
}

export async function proxyRequest(
  req: NextRequest,
  backendPath?: string,
): Promise<NextResponse> {
  const path = backendPath ?? req.nextUrl.pathname;
  const { searchParams } = req.nextUrl;
  const queryString = searchParams.toString();
  const targetUrl = `${BACKEND_URL}${path}${queryString ? `?${queryString}` : ''}`;

  const headers = new Headers();

  const methodsWithBody = ['POST', 'PUT', 'PATCH'];
  if (methodsWithBody.includes(req.method)) {
    headers.set('Content-Type', req.headers.get('Content-Type') ?? 'application/json');
  }

  const cookie = req.headers.get('Cookie');
  if (cookie) headers.set('Cookie', cookie);

  const origin = req.headers.get('Origin');
  if (origin) headers.set('Origin', origin);

  let body: BodyInit | undefined;
  if (methodsWithBody.includes(req.method)) {
    body = await req.text();
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: 'manual',
    });
  } catch (err) {
    console.error('[proxy] Upstream fetch failed:', err);
    return NextResponse.json(
      { message: 'Service unavailable' },
      { status: 503 },
    );
  }

  const responseBody = await backendRes.text();

  const proxyRes = new NextResponse(responseBody || null, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  backendRes.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    
    if (['transfer-encoding', 'connection', 'content-encoding'].includes(lowerKey)) return;

    if (lowerKey === 'location') {
      try {
        const locationUrl = new URL(value);
        proxyRes.headers.set(key, `${locationUrl.pathname}${locationUrl.search}`);
        return;
      } catch (e) {
        proxyRes.headers.set(key, value);
        return;
      }
    }

    if (lowerKey === 'set-cookie') {
      const cleanCookie = value.replace(/Domain=[^;]+;?\s*/gi, '');
      proxyRes.headers.append(key, cleanCookie);
      return;
    }

    proxyRes.headers.append(key, value);
  });

  return proxyRes;
}
