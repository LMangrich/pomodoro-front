import { NextRequest } from 'next/server';
import { proxyRequest } from '@/src/app/api/_proxy';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  return proxyRequest(req, `/api/user/${username}/skills`);
}
