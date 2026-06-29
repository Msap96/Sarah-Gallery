import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F7F5F2] text-[#2D2926]">
      <Navbar />
      <main className="flex-grow pt-20 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
