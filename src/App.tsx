/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { WorkDetail } from './pages/WorkDetail';
import { About } from './pages/About';
import { GalleryProvider } from './contexts/GalleryContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <GalleryProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="work/:id" element={<WorkDetail />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GalleryProvider>
  );
}
