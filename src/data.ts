import type { ArtistInfo, Artwork, Collection } from './types';

export const collections: Collection[] = [
  {
    id: 'available-works',
    title: 'Available Works',
    description: 'Original paintings currently available for acquisition.',
  },
];

/**
 * Medium strings follow one house style: "<Material> on <support>", with the
 * material capitalised and the support lowercase (e.g. "Acrylic on canvas").
 * Sizes are stored as widthIn / heightIn in inches and formatted for display
 * by formatDimensions() so every work reads the same way.
 */
export const artworks: Artwork[] = [
  {
    id: 'art-01',
    title: 'Un Verano en Nueva York',
    year: 2025,
    medium: 'Acrylic on canvas',
    widthIn: 30,
    heightIn: 24,
    price: 0,
    imageUrl: '/artworks/art-01.jpg',
    featured: true,
    status: 'available',
  },
  {
    id: 'art-03',
    title: 'Heavenly',
    year: 2025,
    medium: 'Acrylic on canvas',
    widthIn: 12,
    heightIn: 18,
    price: 0,
    imageUrl: '/artworks/art-03.jpg',
    additionalImageUrls: ['/artworks/art-02.jpg'],
    featured: true,
    status: 'sold',
  },
  {
    id: 'art-04',
    title: 'Untitled',
    year: 2025,
    medium: 'Acrylic on canvas',
    widthIn: 8,
    heightIn: 10,
    price: 0,
    imageUrl: '/artworks/art-04.jpg',
    featured: true,
    status: 'sold',
  },
  {
    id: 'img-5411',
    title: 'Flor Primera',
    year: 2025,
    // Support material was not recorded for this piece — confirm with Sarah.
    medium: 'Acrylic and spray paint',
    widthIn: 43.5,
    heightIn: 37.5,
    price: 0,
    imageUrl: '/artworks/img-5411.jpg',
    featured: false,
    status: 'sold',
  },
  {
    id: 'img-6996',
    title: 'Pond Lady',
    year: 2025,
    medium: 'Acrylic on wood',
    widthIn: 40,
    heightIn: 40,
    price: 0,
    imageUrl: '/artworks/img-6996.jpg',
    featured: false,
    status: 'available',
  },
  {
    id: 'img-7038',
    // Placeholder title and unknown size — both need real values from Sarah.
    title: 'Selected Work VII',
    year: 2025,
    medium: 'Oil on canvas',
    price: 0,
    imageUrl: '/artworks/img-7038.jpg',
    featured: false,
    status: 'available',
  },
  {
    id: 'img-7645',
    title: 'With Grace, Always',
    year: 2025,
    medium: 'Acrylic on canvas',
    widthIn: 17.3,
    heightIn: 23.6,
    price: 0,
    imageUrl: '/artworks/img-7645.jpg',
    featured: false,
    status: 'not-for-sale',
  },
  {
    id: 'img-8293',
    title: 'Le Cosmos et le Lotus',
    year: 2025,
    medium: 'Acrylic on newspaper board',
    widthIn: 16,
    heightIn: 20,
    price: 0,
    imageUrl: '/artworks/img-8293.jpg',
    featured: false,
    status: 'sold',
  },
  {
    id: 'img-9435',
    title: 'Night Light',
    year: 2025,
    medium: 'Acrylic on canvas',
    widthIn: 16,
    heightIn: 20,
    price: 0,
    imageUrl: '/artworks/img-9435.jpg',
    featured: false,
    status: 'available',
  },
];

export const artistInfo: ArtistInfo = {
  name: 'Sarah Sandia',
  bio: 'Sarah Sandia is a contemporary artist whose work explores color, memory, and the quiet moments of everyday life. Working primarily in acrylics, she captures scenes with warmth and depth.',
  email: 'studio@sarahsandia.art',
  socials: {
    instagram: 'https://instagram.com/artsandiaa',
  },
  portraitUrl: '/artworks/img-9435.jpg',
};
