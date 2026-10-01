import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { useGallery } from '../contexts/GalleryContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { ArtImage } from '../components/ArtImage';
import { formatDimensions } from '../lib/dimensions';
import { artistInfo } from '../data';

export const Home: React.FC = () => {
  const { artworks } = useGallery();
  const featuredWorks = useMemo(
    () => artworks.filter(art => art.featured).slice(0, 3),
    [artworks]
  );
  // Only the featured works cycle in the hero, so the page never pulls the
  // whole catalogue at full resolution just to fill the first screen.
  const heroWorks = featuredWorks.length > 0 ? featuredWorks : artworks.slice(0, 1);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroWorks.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroWorks.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [heroWorks.length]);

  const heroWork = heroWorks[heroIndex] ?? heroWorks[0];

  return (
    <div className="flex-grow flex flex-col">
      {/*
        Hero: the work is shown full strength, edge to edge. It used to sit at
        20% opacity behind a button, which made the painting into wallpaper.
        The only overlay is a bottom scrim, so the caption stays legible without
        washing out the image.
      */}
      <section className="on-dark relative h-[calc(100vh-5rem)] min-h-[420px] bg-[#2D2926] overflow-hidden">
        {/*
          Every frame is a permanent layer, crossfaded with a CSS opacity
          transition. Mount/unmount crossfades (AnimatePresence) proved fragile
          here: if an animation stalls, exiting layers never unmount, they stack
          up, and the frame on top stops matching the caption. Fixed layers
          cannot drift out of sync, and the resting state is a class, not the
          end point of an animation.
        */}
        {heroWorks.map((work, idx) => (
          <div
            key={work.id}
            aria-hidden={idx !== heroIndex}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out motion-reduce:transition-none ${
              idx === heroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ArtImage
              src={work.imageUrl}
              alt={idx === heroIndex ? `${work.title} by ${artistInfo.name}` : ''}
              priority={idx === 0}
              sizes="100vw"
              className={`w-full h-full object-cover ${idx === heroIndex ? 'hero-drift' : ''}`}
            />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

        <NavLink
          to="/gallery"
          aria-label="Enter the gallery"
          className="absolute inset-0 z-10 flex flex-col justify-end px-8 pb-14 sm:px-12 sm:pb-16 group"
        >
          {/*
            The `key` replays the CSS entrance animation on each change. The
            animation has no fill-mode, so the element's resting state is simply
            visible: if it never runs, the caption still reads. Never gate
            essential text on an animation completing.
          */}
          {heroWork && (
            <div key={heroWork.id} className="max-w-xl hero-caption">
              <h2 className="font-serif italic text-3xl sm:text-4xl text-white mb-2 drop-shadow-sm">
                {heroWork.title}
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-white/70">
                {heroWork.medium}, {formatDimensions(heroWork)}, {heroWork.year}
              </p>
            </div>
          )}

          <span className="mt-10 inline-flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-white w-max">
            Enter the Gallery
            <span className="w-10 h-px bg-white/60 transition-all duration-500 group-hover:w-16" />
          </span>
        </NavLink>

        {heroWorks.length > 1 && (
          <div className="absolute bottom-14 right-8 sm:bottom-16 sm:right-12 z-20 flex gap-2">
            {heroWorks.map((work, idx) => (
              <button
                key={work.id}
                type="button"
                onClick={() => setHeroIndex(idx)}
                aria-label={`Show ${work.title}`}
                aria-current={idx === heroIndex}
                className={`h-px transition-all duration-500 ${
                  idx === heroIndex ? 'w-10 bg-white' : 'w-5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
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
