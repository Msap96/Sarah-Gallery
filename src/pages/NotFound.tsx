import React from 'react';
import { NavLink } from 'react-router';
import { motion } from 'motion/react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8C7E6D] mb-6">
          Page not found
        </p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-[#2D2926] mb-8">
          This page isn't here
        </h1>
        <p className="font-serif text-lg italic text-[#5E503F] mb-12 max-w-md mx-auto">
          The page you're looking for may have moved, or the link may be out of date.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <NavLink
            to="/gallery"
            className="inline-block px-8 py-4 bg-[#2D2926] text-[#F7F5F2] text-[10px] tracking-widest font-bold uppercase hover:bg-[#5E503F] transition-colors w-full sm:w-auto"
          >
            View the Works
          </NavLink>
          <NavLink
            to="/"
            className="inline-block px-8 py-4 border border-[#2D2926] text-[#2D2926] text-[10px] tracking-widest font-bold uppercase hover:bg-[#2D2926] hover:text-[#F7F5F2] transition-colors w-full sm:w-auto"
          >
            Return Home
          </NavLink>
        </div>
      </motion.div>
    </div>
  );
};
