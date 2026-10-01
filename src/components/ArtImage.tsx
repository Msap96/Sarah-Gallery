import React from 'react';
import { generatedImages } from '../lib/generatedImages';

interface Props {
  /** Canonical path, e.g. /artworks/art-01.jpg — the same value stored in data.ts. */
  src: string;
  alt: string;
  /**
   * How wide the image renders at each breakpoint, so the browser can pick a
   * variant. Getting this wrong is the usual reason srcset stops helping.
   */
  sizes: string;
  className?: string;
  /** Above-the-fold images should load eagerly at high priority. */
  priority?: boolean;
  /**
   * Must match the object-fit used in `className`, so the blur placeholder
   * lines up with where the real image will actually paint.
   */
  fit?: 'cover' | 'contain';
}

function buildSrcSet(src: string, widths: number[], ext: 'avif' | 'webp') {
  const base = src.replace(/\.jpg$/, '');
  return widths.map(w => `${base}-${w}.${ext} ${w}w`).join(', ');
}

/**
 * Resolves a single variant URL, for contexts that cannot use <picture> —
 * notably SVG <image>, which takes one href. Falls back to the canonical path
 * when the image is not in the manifest.
 */
export function variantUrl(src: string, minWidth: number, ext: 'avif' | 'webp' = 'webp') {
  const meta = generatedImages[src];
  if (!meta) return src;
  const width = meta.widths.find(w => w >= minWidth) ?? meta.widths[meta.widths.length - 1];
  return `${src.replace(/\.jpg$/, '')}-${width}.${ext}`;
}

/**
 * Renders an artwork as <picture> with AVIF and WebP variants, falling back to
 * the single generated JPEG. Intrinsic width/height always come from the
 * manifest so space is reserved before the image loads.
 *
 * If a path is missing from the manifest the component still renders a plain
 * <img> at the canonical path rather than nothing.
 */
export const ArtImage: React.FC<Props> = ({
  src,
  alt,
  sizes,
  className,
  priority = false,
  fit = 'cover',
}) => {
  const meta = generatedImages[src];

  const img = (
    <img
      src={src}
      alt={alt}
      width={meta?.width}
      height={meta?.height}
      sizes={meta ? sizes : undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
      /*
        The placeholder is the image's own background, not a sibling element:
        no extra DOM, no layout risk, and nothing to unwind once the real file
        paints over it. Deliberately not gated on an onLoad handler — a missed
        load event would otherwise leave the artwork invisible.
      */
      style={
        meta
          ? {
              backgroundImage: `url("${meta.blur}")`,
              backgroundSize: fit,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    />
  );

  if (!meta) return img;

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet(src, meta.widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(src, meta.widths, 'webp')} sizes={sizes} />
      {img}
    </picture>
  );
};
