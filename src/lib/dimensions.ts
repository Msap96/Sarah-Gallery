import { Artwork } from '../types';

/** An artwork with a known physical size, so it can be shown to scale. */
export type ScaledArtwork = Artwork & { widthIn: number; heightIn: number };

export function hasKnownScale(work: Artwork): work is ScaledArtwork {
  return typeof work.widthIn === 'number' && typeof work.heightIn === 'number';
}

/** Trims trailing zeros so 17.3 stays 17.3 but 30.0 reads as 30. */
function formatInches(value: number): string {
  return `${Number(value.toFixed(2))}"`;
}

/**
 * Single source of truth for how a size is written across the site.
 * Always width x height, so works are directly comparable to each other.
 */
export function formatDimensions(work: Artwork): string {
  if (hasKnownScale(work)) {
    return `${formatInches(work.widthIn)} × ${formatInches(work.heightIn)}`;
  }
  return work.dimensions ?? 'Dimensions on request';
}
