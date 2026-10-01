export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: string;
  /**
   * Artwork size in inches. Width and height are stored separately rather than
   * as a display string so they can drive the to-scale room view and be
   * formatted consistently everywhere.
   */
  widthIn?: number;
  heightIn?: number;
  /** Fallback display text, used only when widthIn/heightIn are unknown. */
  dimensions?: string;
  price: number;
  imageUrl: string;
  additionalImageUrls?: string[];
  /**
   * Optional grouping id, matching a Collection.id. Unset today: the Works
   * filter selects "Available Works" by status, not by collection. Set this
   * only when real grouped bodies of work exist.
   */
  collection?: string;
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
