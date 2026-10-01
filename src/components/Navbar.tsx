import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import { artistInfo } from '../data';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:opacity-100 ${isActive ? 'opacity-100 underline underline-offset-8 decoration-[#8C7E6D]' : ''}`;

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const controls = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const desktop = window.matchMedia('(min-width: 640px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', closeOnDesktop);
    return () => { document.removeEventListener('keydown', onKeyDown); desktop.removeEventListener('change', closeOnDesktop); };
  }, [menuOpen]);

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
          </nav>

          <button
            ref={toggleRef}
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
              ref={menuRef}
              aria-label="Mobile navigation"
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
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
