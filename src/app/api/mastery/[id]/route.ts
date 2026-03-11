import { NextRequest } from 'next/server';
import { proxyRequest } from '@/src/app/api/_proxy';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyRequest(req, `/gambiarra/api/skill/${id}`);
}
