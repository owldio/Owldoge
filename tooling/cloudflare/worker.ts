import { submitContact } from '../../src/lib/submit-contact';

interface Env {
  GOOGLE_SCRIPT_URL?: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path === '/api/submit-contact') {
      if (request.method !== 'POST') {
        return Response.json({ status: 'error', message: 'Method not allowed' }, {
          status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
        });
      }
      // Cloudflare sets this header. Do not record a visitor-supplied forwarded IP.
      const headers = new Headers(request.headers);
      const clientIp = headers.get('CF-Connecting-IP');
      headers.delete('x-forwarded-for');
      headers.delete('x-real-ip');
      if (clientIp) headers.set('x-real-ip', clientIp);
      const response = await submitContact(new Request(request, { headers }), env.GOOGLE_SCRIPT_URL);
      response.headers.set('Cache-Control', 'no-store');
      return response;
    }
    if (path === '/api' || path.startsWith('/api/')) {
      return Response.json({ status: 'error', message: 'Not found' }, { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};

export default worker;
