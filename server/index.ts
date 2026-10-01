import { handleInquiry, type InquiryEnvironment } from './inquiry.ts';

interface Environment extends InquiryEnvironment {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    if (new URL(request.url).pathname === '/api/inquiry') return handleInquiry(request, env);
    if (new URL(request.url).pathname.startsWith('/api/')) {
      return Response.json({ error: 'Endpoint not found.' }, { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};
