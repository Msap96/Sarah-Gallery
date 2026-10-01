import React from 'react';
import { useGallery } from '../contexts/GalleryContext';

export const Footer: React.FC = () => {
  const { artistInfo, artworks } = useGallery();
  return (
    <footer className="h-20 px-4 sm:px-6 lg:px-8 border-t border-[#E5E1DA] flex items-center justify-between text-[9px] uppercase tracking-widest opacity-40 bg-[#F7F5F2]">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div>&copy; {new Date().getFullYear()} {artistInfo.name} Studio</div>
        <div className="flex gap-8">
          {artworks.some(work => work.status === 'available') && <span className="hidden sm:inline">Original Pieces Available</span>}
        </div>
      </div>
    </footer>
  );
};
