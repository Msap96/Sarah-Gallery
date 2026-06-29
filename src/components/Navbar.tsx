import React from 'react';
import { NavLink } from 'react-router';
import { artistInfo } from '../data';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#F7F5F2]/90 backdrop-blur-md border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <NavLink to="/" className="text-2xl font-serif italic tracking-tight text-[#2D2926]">
            {artistInfo.name}
          </NavLink>
          <nav className="hidden sm:flex space-x-10 text-xs uppercase tracking-widest font-medium opacity-70">
            <NavLink 
              to="/gallery" 
              className={({ isActive }) => 
                `transition-colors hover:opacity-100 ${isActive ? 'opacity-100 underline underline-offset-8 decoration-[#8C7E6D]' : ''}`
              }>
              Portfolio
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `transition-colors hover:opacity-100 ${isActive ? 'opacity-100 underline underline-offset-8 decoration-[#8C7E6D]' : ''}`
              }>
              Bio
            </NavLink>
            <a 
              href="https://metasteps.com/viewer/028ab4de-7fdb-47a8-a00d-948cb53ad6fd" 
              target="_blank" 
              rel="noreferrer"
              className="transition-colors hover:opacity-100 flex items-center gap-1"
            >
              3D Gallery <span className="text-[8px]">↗</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
