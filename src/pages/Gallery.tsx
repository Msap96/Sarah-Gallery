import React, { useState } from 'react';
import { useGallery } from '../contexts/GalleryContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { motion } from 'motion/react';

export const Gallery: React.FC = () => {
  const { artworks, collections } = useGallery();
  const [filter, setFilter] = useState<string>('all');


  const filteredWorks =
    filter === 'all'
      ? artworks
      : filter === 'available-works'
        ? artworks.filter(art => art.status === 'available')
        : artworks.filter(art => art.collection === filter);

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="border-b border-[#E5E1DA] pb-8 mb-16">
        <h1 className="text-4xl md:text-5xl font-serif italic text-[#2D2926] mb-8">Works</h1>
        <div className="flex flex-wrap gap-4 md:gap-10 text-[10px] uppercase tracking-widest font-medium opacity-70">
          <button 
            onClick={() => setFilter('all')}
            className={`hover:opacity-100 transition-opacity ${filter === 'all' ? 'opacity-100 underline underline-offset-8 decoration-[#8C7E6D]' : ''}`}
          >
            All
          </button>
          {collections.map(coll => (
            <button 
              key={coll.id}
              onClick={() => setFilter(coll.id)}
              className={`hover:opacity-100 transition-opacity text-left ${filter === coll.id ? 'opacity-100 underline underline-offset-8 decoration-[#8C7E6D]' : ''}`}
            >
              {coll.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-8 lg:gap-y-16">
        {filteredWorks.map((work, idx) => (
          <ArtworkCard key={`${filter}-${work.id}`} artwork={work} index={idx} />
        ))}
      </div>
      
      {filteredWorks.length === 0 && (
        <div className="text-center text-[#8C7E6D] py-20 font-serif italic">
          {filter === 'available-works'
            ? 'No works are currently available.'
            : 'No works in this collection.'}
        </div>
      )}
    </div>
  );
};
