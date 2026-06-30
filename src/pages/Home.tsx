import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useGallery } from '../contexts/GalleryContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { motion, AnimatePresence } from 'motion/react';

export const Home: React.FC = () => {
  const { artworks } = useGallery();
  const featuredWorks = artworks.filter(art => art.featured).slice(0, 3);
  const heroImages = artworks.map(work => work.imageUrl);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const heroImage = heroImages[heroIndex] ?? artworks[0]?.imageUrl;

  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-[#E5E1DA] overflow-hidden">
        <AnimatePresence mode="wait">
          {heroImage && (
            <motion.div
              key={heroImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img
                src={heroImage}
                alt=""
                className="w-full h-full object-cover opacity-20 mix-blend-multiply"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <NavLink 
              to="/gallery" 
              className="inline-block px-8 py-4 bg-[#2D2926] text-[#F7F5F2] text-[10px] tracking-widest font-bold uppercase hover:bg-[#5E503F] transition-colors w-full sm:w-auto"
            >
              Enter the Gallery
            </NavLink>
            <a 
              href="https://metasteps.com/viewer/028ab4de-7fdb-47a8-a00d-948cb53ad6fd" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block px-8 py-4 border border-[#2D2926] text-[#2D2926] text-[10px] tracking-widest font-bold uppercase hover:bg-[#2D2926] hover:text-[#F7F5F2] transition-colors w-full sm:w-auto"
            >
              View 3D Exhibition ↗
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-16 border-b border-[#E5E1DA] pb-4">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#8C7E6D]">Featured Works</h2>
          <NavLink to="/gallery" className="text-[10px] uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity hidden sm:block">
            View All &rarr;
          </NavLink>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {featuredWorks.map((work, idx) => (
            <ArtworkCard key={work.id} artwork={work} index={idx} compact />
          ))}
        </div>
        
        <div className="mt-12 text-center sm:hidden">
          <NavLink to="/gallery" className="inline-block w-full py-3 border border-[#2D2926] text-[#2D2926] text-[10px] tracking-widest uppercase font-bold hover:bg-[#2D2926] hover:text-[#F7F5F2] transition-colors">
            View All Works
          </NavLink>
        </div>
      </section>
    </div>
  );
};
