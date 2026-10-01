import test from 'node:test';
import assert from 'node:assert/strict';
import { handleInquiry } from '../server/inquiry.ts';

const payload = { name: 'Gallery Test', email: 'test@example.com', message: 'Is this available?', artworkId: 'art-01', website: '' };
const environment = {
  RESEND_API_KEY: 'test-key', INQUIRY_FROM: 'gallery@example.com', INQUIRY_TO: 'studio@example.com',
  INQUIRY_LIMITER: { limit: async () => ({ success: true }) },
};
const request = (body = payload, headers = {}, method = 'POST') => new Request('https://gallery.example/api/inquiry', {
  method, headers: { origin: 'https://gallery.example', 'content-type': 'application/json', ...headers },
  ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
});
const forbiddenSend = async () => { throw new Error('Provider should not be called'); };

test('valid inquiry uses trusted artwork/sender/recipient and a visitor reply address', async () => {
  let sent;
  const result = await handleInquiry(request({ ...payload, title: 'Forged title', to: 'other@example.com' }), environment, async (url, options) => {
    sent = { url, ...JSON.parse(options.body) };
    return Response.json({ id: 'email-123' });
  });
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.equal(sent.subject, 'Artwork inquiry: Un Verano en Nueva York');
  assert.deepEqual(sent.to, ['studio@example.com']);
  assert.equal(sent.reply_to, payload.email);
});

test('invalid inputs and non-available works never contact provider', async () => {
  for (const body of [null, [], '{', { ...payload, name: ' ' }, { ...payload, email: 'bad' }, { ...payload, email: 'a@b.com\r\nBcc:x@y.com' },
    { ...payload, message: 'a'.repeat(5001) }, { ...payload, message: 12 }, { ...payload, artworkId: 'missing' }, { ...payload, artworkId: 'art-03' }]) {
    assert.equal((await handleInquiry(request(body), environment, forbiddenSend)).status, 400);
  }
});

test('rejects external origins, unsupported methods/types and oversized streamed payloads', async () => {
  assert.equal((await handleInquiry(request(payload, { origin: 'https://other.example' }), environment, forbiddenSend)).status, 403);
  assert.equal((await handleInquiry(request(payload, {}, 'GET'), environment, forbiddenSend)).status, 405);
  assert.equal((await handleInquiry(request(payload, { 'content-type': 'text/plain' }), environment, forbiddenSend)).status, 415);
  assert.equal((await handleInquiry(request({ ...payload, message: 'a'.repeat(13_000) }), environment, forbiddenSend)).status, 413);
});

test('honeypot consumes no email quota', async () => {
  assert.equal((await handleInquiry(request({ ...payload, website: 'bot.example' }), environment, forbiddenSend)).status, 200);
});

test('missing credentials and rate limiting return actionable failures', async () => {
  assert.equal((await handleInquiry(request(), { ...environment, RESEND_API_KEY: '' }, forbiddenSend)).status, 503);
  const limited = await handleInquiry(request(), { ...environment, INQUIRY_LIMITER: { limit: async () => ({ success: false }) } }, forbiddenSend);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');
});

test('provider rejection, missing receipt and network/timeout failures cannot report success', async () => {
  for (const send of [async () => new Response('', { status: 429 }), async () => Response.json({}), async () => { throw new DOMException('Timeout', 'TimeoutError'); }]) {
    assert.equal((await handleInquiry(request(), environment, send)).status, 502);
  }
});
