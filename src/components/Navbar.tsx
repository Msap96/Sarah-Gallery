import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { artistInfo } from '../data';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:opacity-100 ${isActive ? 'opacity-100 underline underline-offset-8 decoration-[#8C7E6D]' : ''}`;

const METASTEPS_URL = 'https://metasteps.com/viewer/028ab4de-7fdb-47a8-a00d-948cb53ad6fd';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#F7F5F2]/90 backdrop-blur-md border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <NavLink
            to="/"
            className="text-2xl font-serif italic tracking-tight text-[#2D2926]"
            onClick={() => setMenuOpen(false)}
          >
            {artistInfo.name}
          </NavLink>

          <nav className="hidden sm:flex space-x-10 text-xs uppercase tracking-widest font-medium opacity-70">
            <NavLink to="/gallery" className={navLinkClass}>
              Portfolio
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              Bio
            </NavLink>
            <a
              href={METASTEPS_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:opacity-100 flex items-center gap-1"
            >
              3D Gallery <span className="text-[8px]">↗</span>
            </a>
          </nav>

          <button
            type="button"
            className="sm:hidden p-2 -mr-2 text-[#2D2926] hover:opacity-70 transition-opacity"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-20 bg-black/20 backdrop-blur-[2px] sm:hidden"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            />
            <motion.nav
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="sm:hidden absolute top-full left-0 right-0 bg-[#F7F5F2] border-b border-[#E5E1DA] shadow-sm"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 text-xs uppercase tracking-widest font-medium">
                <NavLink
                  to="/gallery"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Portfolio
                </NavLink>
                <NavLink
                  to="/about"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Bio
                </NavLink>
                <a
                  href={METASTEPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:opacity-100 flex items-center gap-1 opacity-70"
                  onClick={() => setMenuOpen(false)}
                >
                  3D Gallery <span className="text-[8px]">↗</span>
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
