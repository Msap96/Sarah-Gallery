import { artworks, collections, artistInfo } from '../data';

export function useGalleryData() {
  return {
    artworks,
    collections,
    artistInfo,
    loading: false,
  };
}
