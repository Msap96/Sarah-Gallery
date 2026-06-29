import React from 'react';
import { NavLink } from 'react-router';
import { Artwork } from '../types';
import { motion } from 'motion/react';

interface Props {
  artwork: Artwork;
  index: number;
}

export const ArtworkCard: React.FC<Props> = ({ artwork, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="group flex flex-col"
    >
      <NavLink to={`/work/${artwork.id}`} className="block overflow-hidden bg-[#EAE7E1] border border-[#E5E1DA] mb-4 h-full aspect-[4/5] relative">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </NavLink>
      <div className="flex flex-col flex-grow justify-between mt-2">
        <div>
          <h3 className="font-serif text-lg mb-1 italic group-hover:opacity-70 transition-opacity">
            <NavLink to={`/work/${artwork.id}`}>{artwork.title}</NavLink>
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-[#8C7E6D] mb-2">{artwork.medium}, {artwork.year}</p>
        </div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold mt-2">
          {artwork.price > 0 ? (
            <span>${artwork.price.toLocaleString()}</span>
          ) : (
            <span className="text-[#8C7E6D]">Inquire</span>
          )}
          {artwork.status === 'sold' ? (
            <span className="opacity-40 italic">Sold</span>
          ) : (
            <span className="text-[#5E503F]">Available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
