import { artworks } from '../src/data.ts';

export interface InquiryEnvironment {
  INQUIRY_LIMITER: { limit(input: { key: string }): Promise<{ success: boolean }> };
  RESEND_API_KEY?: string;
  INQUIRY_FROM?: string;
  INQUIRY_TO?: string;
}

const MAX_BODY_BYTES = 12_000;
const reply = (status: number, error?: string) => Response.json(error ? { error } : { ok: true }, {
  status,
  headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(status === 429 ? { 'Retry-After': '60' } : {}) },
});

async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > MAX_BODY_BYTES) { await reader.cancel(); throw new RangeError(); }
      text += decoder.decode(part.value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}

export async function handleInquiry(request: Request, env: InquiryEnvironment, send: typeof fetch = fetch): Promise<Response> {
  if (request.method !== 'POST') {
    const response = reply(405, 'Use POST to send an inquiry.');
    response.headers.set('Allow', 'POST');
    return response;
  }
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply(403, 'Please submit through the gallery website.');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(415, 'Please send JSON.');

  let body: unknown;
  try { body = await readBody(request); }
  catch (error) { return reply(error instanceof RangeError ? 413 : 400, 'The inquiry could not be read. Please shorten it and try again.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, 'Please check your inquiry details.');
  const input = body as Record<string, unknown>;
  if (typeof input.website === 'string' && input.website.trim()) return reply(200);
  if (input.website !== undefined && typeof input.website !== 'string') return reply(400, 'Please check your inquiry details.');
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  const work = artworks.find(a => a.id === input.artworkId && a.status === 'available');
  if (!name || name.length > 120 || /[\r\n]/.test(name) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length > 5000 || !work || (input.message !== undefined && typeof input.message !== 'string')) {
    return reply(400, 'Please check your name, email, message and artwork availability.');
  }
  if (!env.RESEND_API_KEY || !env.INQUIRY_FROM || !env.INQUIRY_TO || !env.INQUIRY_LIMITER) {
    return reply(503, 'The inquiry form is temporarily unavailable. Please use the studio email below.');
  }
  try {
    const limit = await env.INQUIRY_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') ?? 'unknown' });
    if (!limit.success) return reply(429, 'Too many requests. Please wait a minute and try again.');
    const result = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.INQUIRY_FROM,
        to: [env.INQUIRY_TO],
        reply_to: email,
        subject: `Artwork inquiry: ${work.title}`,
        text: `Name: ${name}\nEmail: ${email}\nArtwork: ${work.title}\n\n${message || '(No additional message)'}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!result.ok) return reply(502, 'Your inquiry could not be sent. Your details are saved here; please try again or email the studio.');
    const receipt = await result.json() as { id?: unknown };
    if (typeof receipt.id !== 'string' || !receipt.id) return reply(502, 'Your inquiry could not be confirmed. Please email the studio.');
    return reply(200);
  } catch {
    return reply(502, 'Your inquiry could not be sent. Please try again or email the studio.');
  }
}
