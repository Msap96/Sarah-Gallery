import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';
import { artworks, artistInfo } from '../src/data.ts';
import { generatedImages } from '../src/lib/generatedImages.ts';
import { pageMetadata } from '../src/lib/pageMetadata.ts';

const configured = process.env.SITE_URL || loadEnv('production', process.cwd(), '').SITE_URL;
const origin = new URL(configured || 'https://sarah-gallery.vercel.app');
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('SITE_URL must be an HTTPS origin without a path or credentials.');
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const template = (await readFile('dist/index.html', 'utf8'))
  .replace(/<meta\s+(?:property="og:[^"]*"|name="(?:twitter:[^"]*|robots)")[\s\S]*?>/g, '')
  .replace(/<link\s+rel="canonical"[^>]*>/g, '');
const routes = ['/', '/gallery', '/about', ...artworks.map(a => `/work/${a.id}`)];
for (const route of routes) {
  const meta = pageMetadata(route, artworks, artistInfo);
  const image = new URL(meta.image, origin).href;
  const size = generatedImages[meta.image];
  const url = new URL(route, origin).href;
  const tags = [
    `<link rel="canonical" href="${escape(url)}" />`,
    `<meta name="robots" content="${configured ? 'index,follow' : 'noindex,follow'}" data-indexable="${Boolean(configured)}" />`,
    ...Object.entries({ 'og:type': 'website', 'og:site_name': artistInfo.name, 'og:title': meta.title, 'og:description': meta.description, 'og:url': url, 'og:image': image,
      'og:image:width': size?.width, 'og:image:height': size?.height, 'og:image:alt': meta.title }).filter(([, v]) => v !== undefined).map(([k, v]) => `<meta property="${k}" content="${escape(v)}" />`),
    ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': meta.title, 'twitter:description': meta.description, 'twitter:image': image }).map(([k, v]) => `<meta name="${k}" content="${escape(v)}" />`),
  ].join('\n    ');
  const html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace('</head>', `    ${tags}\n  </head>`);
  const file = route === '/' ? 'dist/index.html' : `dist${route}.html`;
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${escape(new URL(route, origin).href)}</loc></url>`).join('')}</urlset>\n`);
await writeFile('dist/robots.txt', `User-agent: *\n${configured ? 'Allow: /\nDisallow: /api/' : 'Disallow: /'}\nSitemap: ${origin.origin}/sitemap.xml\n`);
console.log(`Generated metadata for ${routes.length} routes (${configured ? origin.origin : 'preview: noindex; set SITE_URL before launch'}).`);
