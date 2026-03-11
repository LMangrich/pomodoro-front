import { NextRequest } from 'next/server';
import { proxyRequest } from '@/src/app/api/_proxy';

export async function GET(req: NextRequest) {
  return proxyRequest(req, '/gambiarra/api/auth/current-user');
}
