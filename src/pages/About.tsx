import React from 'react';
import { useGallery } from '../contexts/GalleryContext';
import { motion } from 'motion/react';
import { Mail, Instagram, Twitter } from 'lucide-react';

export const About: React.FC = () => {
  const { artistInfo } = useGallery();
  return (
    <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 aspect-[3/4] max-w-md mb-8 lg:mb-0 border border-[#E5E1DA] p-2 bg-white"
      >
        <img 
          src={artistInfo.portraitUrl} 
          alt={artistInfo.name} 
          className="w-full h-full object-cover filter grayscale opacity-90"
        />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col justify-center min-h-[75vh] lg:min-h-0"
      >
        <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-[#8C7E6D]">Artist Bio</h3>
        <div className="font-serif text-2xl leading-relaxed italic text-[#5E503F] mb-8">
          <p>{artistInfo.bio}</p>
        </div>
        
        <div className="space-y-6 mt-8 pt-8 border-t border-[#E5E1DA]">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#8C7E6D]">Connect & Inquiries</h2>
          <div className="flex flex-col space-y-4 text-xs tracking-widest uppercase opacity-70">
            <a href={`mailto:${artistInfo.email}`} className="flex items-center hover:opacity-100 transition-colors w-max">
              <span>{artistInfo.email}</span>
            </a>
            {artistInfo.socials.instagram && (
              <a href={artistInfo.socials.instagram} target="_blank" rel="noreferrer" className="flex items-center hover:opacity-100 transition-colors w-max">
                <span>Instagram</span>
              </a>
            )}
            {artistInfo.socials.twitter && (
              <a href={artistInfo.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center hover:opacity-100 transition-colors w-max">
                <span>Twitter</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
