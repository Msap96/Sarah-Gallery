import assert from 'node:assert/strict';
import { stat, readFile } from 'node:fs/promises';
import { artworks, artistInfo, collections } from '../src/data.ts';
import { generatedImages } from '../src/lib/generatedImages.ts';

const ids = new Set();
const collectionsById = new Set(collections.map(c => c.id));
const images = new Set([artistInfo.portraitUrl]);
for (const work of artworks) {
  assert.match(work.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Artwork ids must be URL-safe.');
  assert(!ids.has(work.id), `Duplicate artwork id: ${work.id}`);
  ids.add(work.id);
  assert(work.title.trim() && work.medium.trim(), `Missing title/medium: ${work.id}`);
  assert(Number.isInteger(work.year) && work.year > 0, `Invalid year: ${work.id}`);
  assert(Number.isFinite(work.price) && work.price >= 0, `Invalid price: ${work.id}`);
  assert(['available', 'sold', 'not-for-sale'].includes(work.status), `Invalid status: ${work.id}`);
  for (const dimension of [work.widthIn, work.heightIn]) {
    assert(dimension === undefined || (Number.isFinite(dimension) && dimension > 0), `Invalid size: ${work.id}`);
  }
  assert(!work.collection || collectionsById.has(work.collection), `Unknown collection: ${work.id}`);
  if (work.scalePreviewReady) {
    const image = generatedImages[work.imageUrl];
    assert(work.widthIn > 0 && work.heightIn > 0 && image, `Scale preview needs verified size/photo: ${work.id}`);
    assert(Math.abs(image.width / image.height / (work.widthIn / work.heightIn) - 1) < 0.05, `Scale preview photo must match canvas proportions: ${work.id}`);
  }
  for (const image of [work.imageUrl, ...(work.additionalImageUrls ?? [])]) images.add(image);
}
for (const image of images) {
  assert.match(image, /^\/artworks\/[a-z0-9-]+\.jpg$/, `Use a generated artwork photo: ${image}`);
  const metadata = generatedImages[image];
  assert(metadata?.width > 0 && metadata?.height > 0, `Missing image metadata: ${image}`);
  const paths = [image, ...metadata.widths.flatMap(w => ['avif', 'webp'].map(ext => image.replace('.jpg', `-${w}.${ext}`)))];
  for (const path of paths) assert((await stat(`dist${path}`)).size > 0, `Missing/empty image: ${path}`);
}
assert((await readFile('dist/_headers', 'utf8')).includes('Content-Security-Policy:'), 'Missing deployed security headers.');
for (const work of artworks) {
  const html = await readFile(`dist/work/${work.id}.html`, 'utf8');
  assert(html.includes('<link rel="canonical"'), `Missing canonical: ${work.id}`);
  assert(html.includes(`content="${work.title.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')} — `), `Missing work-specific preview: ${work.id}`);
  assert(html.includes(work.imageUrl), `Missing preview image: ${work.id}`);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const work of artworks) assert(sitemap.includes(`/work/${work.id}`), `Missing sitemap entry: ${work.id}`);
console.log(`Verified ${artworks.length} artworks, ${images.size} image families, and deployment headers.`);
