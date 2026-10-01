import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGallery } from '../contexts/GalleryContext';
import { pageMetadata } from '../lib/pageMetadata';
import { generatedImages } from '../lib/generatedImages';

export function RouteMetadata() {
  const { pathname } = useLocation();
  const { artworks, artistInfo } = useGallery();
  useEffect(() => {
    const metadata = pageMetadata(pathname, artworks, artistInfo);
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const origin = canonical ? new URL(canonical.href).origin : window.location.origin;
    const size = generatedImages[metadata.image];
    const values = { 'og:title': metadata.title, 'og:description': metadata.description, 'og:url': origin + metadata.path, 'og:image': origin + metadata.image,
      'og:image:alt': metadata.title, 'og:image:width': String(size?.width ?? ''), 'og:image:height': String(size?.height ?? '') };
    for (const [property, content] of Object.entries(values)) document.querySelector(`meta[property="${property}"]`)?.setAttribute('content', content);
    canonical?.setAttribute('href', origin + metadata.path);
    for (const [name, content] of Object.entries({ 'twitter:title': metadata.title, 'twitter:description': metadata.description, 'twitter:image': origin + metadata.image })) {
      document.querySelector(`meta[name="${name}"]`)?.setAttribute('content', content);
    }
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    robots?.setAttribute('content', metadata.known && robots.dataset.indexable === 'true' ? 'index,follow' : 'noindex,follow');
  }, [pathname, artworks, artistInfo]);
  return null;
}
