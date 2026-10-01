/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { MotionConfig } from 'motion/react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { WorkDetail } from './pages/WorkDetail';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { GalleryProvider } from './contexts/GalleryContext';
import { RouteMetadata } from './components/RouteMetadata';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    // reducedMotion="user" makes every motion component across the site honour
    // the OS "reduce motion" setting, instead of each animation opting in.
    <MotionConfig reducedMotion="user">
      <GalleryProvider>
        <BrowserRouter>
          <RouteMetadata />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="work/:id" element={<WorkDetail />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GalleryProvider>
    </MotionConfig>
  );
}
