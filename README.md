# Sarah Sandia Gallery

Personal artist portfolio and gallery for [Sarah Sandia](https://instagram.com/artsandiaa) — a clean, distraction-free site for browsing works, viewing piece details, and sending purchase or inquiry requests.

## Stack

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS 4**
- **React Router 7**
- **Motion** (animations)
- Deployed on **Vercel** (`vercel.json` SPA rewrites)

## Features

- Home with rotating hero and featured works
- Portfolio gallery with availability filtering
- Work detail pages with image gallery, dimensions, and status
- Purchase / inquiry forms (currently open a prefilled `mailto:` to the studio)
- Artist bio and contact links
- External link to a 3D exhibition viewer (Metasteps)

## Project structure

```
src/
  components/   # Layout, Navbar, Footer, ArtworkCard, Modal
  contexts/     # Gallery data provider
  hooks/        # useGalleryData
  lib/          # Artwork image helpers
  pages/        # Home, Gallery, WorkDetail, About
  data.ts       # Artworks, collections, artist info (edit here to update content)
  types.ts      # Shared TypeScript types
```

Artwork images are served from `/artworks/` (public static assets).

## Getting started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server on `0.0.0.0:3000` |
| `npm run dev:local` | Dev server on `localhost:3000` |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

No environment variables are required. See [`.env.example`](.env.example).

## Updating content

Edit [`src/data.ts`](src/data.ts) to change:

- Artworks (title, year, medium, dimensions, price, status, images, featured flag)
- Collections
- Artist bio, email, and social links

Add or replace image files under the public `artworks` folder and point `imageUrl` / `additionalImageUrls` at those paths.

## Deployment

Push to the connected GitHub repo; Vercel builds with `npm run build` and serves the SPA. All routes rewrite to `index.html` so client-side routing works on refresh.
