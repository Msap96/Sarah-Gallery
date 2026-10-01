import test from 'node:test';
import assert from 'node:assert/strict';
import { pageMetadata } from '../src/lib/pageMetadata.ts';
import { artworks, artistInfo } from '../src/data.ts';

test('artwork metadata identifies the specific piece and canonical route', () => {
  const meta = pageMetadata('/work/art-01/', artworks, artistInfo);
  assert.equal(meta.path, '/work/art-01');
  assert.equal(meta.title, 'Un Verano en Nueva York — Sarah Sandia');
  assert.match(meta.description, /30" × 24"/);
  assert.equal(meta.image, '/artworks/art-01.jpg');
  assert.equal(meta.known, true);
});
test('unknown routes are recognized for noindex behavior', () => {
  assert.equal(pageMetadata('/work/missing', artworks, artistInfo).known, false);
  assert.equal(pageMetadata('/missing', artworks, artistInfo).known, false);
  assert.equal(pageMetadata('/gallery', artworks, artistInfo).known, true);
});
