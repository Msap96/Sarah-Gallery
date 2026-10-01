import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router';

export const Layout: React.FC = () => {
  return (
    <div className="grain min-h-screen flex flex-col font-sans bg-[#F7F5F2] text-[#2D2926]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#2D2926] focus:text-[#F7F5F2] focus:px-4 focus:py-3 focus:text-[10px] focus:uppercase focus:tracking-widest focus:font-bold"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-grow pt-20 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
