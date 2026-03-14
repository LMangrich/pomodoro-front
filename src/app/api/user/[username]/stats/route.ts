import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const res = await fetch(`${BACKEND_URL}/api/user/${username}/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...(req.headers.get('cookie') ? { Cookie: req.headers.get('cookie')! } : {}) },
    });
    const text = await res.text();
    const response = new NextResponse(text || null, { status: res.status });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) response.headers.set('set-cookie', setCookie);
    return response;
  } catch {
    return NextResponse.json({ message: 'Ocorreu um erro' }, { status: 503 });
  }
}
