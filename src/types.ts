export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  price: number;
  imageUrl: string;
  additionalImageUrls?: string[];
  collection: string;
  featured?: boolean;
  status: 'available' | 'sold' | 'not-for-sale';
  description?: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
}

export interface ArtistInfo {
  name: string;
  bio: string;
  email: string;
  socials: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  portraitUrl: string;
}
