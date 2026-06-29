import { Artwork } from '../types';

export function getArtworkImages(work: Artwork): string[] {
  return [work.imageUrl, ...(work.additionalImageUrls ?? [])];
}
