import React from 'react';
import { NavLink } from 'react-router';
import { Artwork } from '../types';
import { ArtImage } from './ArtImage';
import { Reveal } from './Reveal';

interface Props {
  artwork: Artwork;
  index: number;
  compact?: boolean;
}

export const ArtworkCard: React.FC<Props> = ({ artwork, index, compact = false }) => {
  return (
    /*
      Reveal on scroll rather than on mount. The old mount animation played its
      `index * 0.1` delay immediately, so lower rows had already finished by the
      time you scrolled to them — the effect only ever showed on the first row.
      Reveal ties it to the viewport and, unlike whileInView, cannot leave a
      card invisible if the observer never fires.
    */
    <Reveal delay={(index % 3) * 0.08} className="group flex flex-col">
      <NavLink to={`/work/${artwork.id}`} className="block overflow-hidden bg-[#EAE7E1] border border-[#E5E1DA] mb-4 h-full aspect-[4/5] relative">
        <ArtImage
          src={artwork.imageUrl}
          alt={artwork.title}
          fit="contain"
          priority={index < 3}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-contain w-full h-full"
        />
      </NavLink>
      <div className="flex flex-col flex-grow justify-between mt-2">
        <div>
          <h3 className="font-serif text-lg mb-1 italic group-hover:opacity-70 transition-opacity">
            <NavLink to={`/work/${artwork.id}`}>{artwork.title}</NavLink>
          </h3>
          {!compact && (
            <p className="text-[10px] uppercase tracking-widest text-[#8C7E6D] mb-2">{artwork.medium}, {artwork.year}</p>
          )}
        </div>
        {!compact && (
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold mt-2">
            {artwork.price > 0 ? (
              <span>${artwork.price.toLocaleString()}</span>
            ) : (
              <span className="text-[#8C7E6D]">Inquire</span>
            )}
            {artwork.status === 'sold' ? (
              <span className="opacity-40 italic">Sold</span>
            ) : artwork.status === 'not-for-sale' ? (
              <span className="opacity-40 italic">Not for sale</span>
            ) : (
              <span className="text-[#5E503F]">Available</span>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
};
