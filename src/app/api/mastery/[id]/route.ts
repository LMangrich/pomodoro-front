import { NextRequest } from 'next/server';
import { proxyRequest } from '@/src/app/api/_proxy';

// GET /api/skill/[id]  →  backend GET /api/skill/{id}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyRequest(req, `/api/skill/${id}`);
}
