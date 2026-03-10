import { NextRequest } from 'next/server';
import { proxyRequest } from '@/src/app/api/_proxy';

export async function POST(req: NextRequest) {
  return proxyRequest(req, '/api/auth/register');
}
