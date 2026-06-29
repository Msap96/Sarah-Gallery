import React, { createContext, useContext, ReactNode } from 'react';
import { useGalleryData } from '../hooks/useGalleryData';
import { Artwork, Collection, ArtistInfo } from '../types';

interface GalleryContextType {
  artworks: Artwork[];
  collections: Collection[];
  artistInfo: ArtistInfo;
  loading: boolean;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const galleryData = useGalleryData();
  return <GalleryContext.Provider value={galleryData}>{children}</GalleryContext.Provider>;
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
}
