import type { ArtistInfo, Artwork } from '../types';
import { formatDimensions } from './dimensions.ts';

export function pageMetadata(pathname: string, artworks: Artwork[], artist: ArtistInfo) {
  const path = pathname.replace(/\/$/, '') || '/';
  const work = path.startsWith('/work/') ? artworks.find(a => `/work/${a.id}` === path) : undefined;
  const title = work ? `${work.title} — ${artist.name}`
    : path === '/gallery' ? `Works — ${artist.name}`
    : path === '/about' ? `About — ${artist.name}`
    : path === '/' ? `${artist.name} — Contemporary Paintings` : `Page not found — ${artist.name}`;
  const description = work ? `${work.title} by ${artist.name}. ${work.medium}, ${formatDimensions(work)}, ${work.year}.`
    : path === '/about' ? artist.bio
    : `Original paintings by ${artist.name}. Browse available works, view details, and inquire about acquisition.`;
  return { title, description, path, image: work?.imageUrl ?? artworks.find(a => a.featured)?.imageUrl ?? artist.portraitUrl, known: Boolean(work || ['/', '/gallery', '/about'].includes(path)) };
}
