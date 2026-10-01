# Sarah Sandia Gallery

React/TypeScript/Vite artist portfolio with responsive images and a Cloudflare Worker inquiry API. See [CHECKLIST.md](CHECKLIST.md) for current progress and live-launch gates; previous notes are preserved in CHECKLIST.history.md.

## Development and validation

Use Node 24 (engines support Node 24–26), then npm ci.

- npm run dev:local — local Vite UI (the inquiry API requires the Worker).
- npm run check — build responsive images and route metadata, strict TypeScript, API/metadata tests, and catalogue/image verification.
- npm run preview:worker — serve the built website and actual Worker locally on port 8787.
- npx wrangler deploy --dry-run — package without publishing.

CI runs npm ci, npm run check, and Worker dry-run on push/PR. Generated public/artworks and dist are ignored. All original photos, fonts, source components and generation scripts are committed. The first cold image build takes several minutes.

## Inquiries

The available-work page submits one name/email/message form to POST /api/inquiry. The Worker validates the catalogue entry and fields, checks same origin, discards honeypot submissions, applies five requests/minute per IP, and sends via Resend with the visitor as reply-to. Success requires a provider receipt; failures retain form input. No checkout or shipping-address collection is implemented.

Configure RESEND_API_KEY, INQUIRY_FROM and INQUIRY_TO as Cloudflare Worker secrets. INQUIRY_FROM must use a verified sending domain; INQUIRY_TO is a tested, monitored inbox. For local configuration, copy .dev.vars.example to .dev.vars. Never put these values in VITE_* variables or Git. Without configuration the API returns a clear 503; the form also offers the studio email link.

Automated and browser verification uses mocked email; real delivery/replies remain a release gate.

## Hosting and metadata

wrangler.jsonc prepares Cloudflare Workers Static Assets, SPA fallback, clean HTML routes and /api routing. public/_headers carries security/cache headers for static responses. vercel.json is retained for the existing staging deployment; Vercel Hobby has commercial-use restrictions and the new inquiry API targets Cloudflare.

Set SITE_URL to the final HTTPS origin (for example https://example.com) in the build environment. Build generates individual artwork/about/gallery HTML previews, canonical URLs, sitemap.xml and robots.txt. Without SITE_URL, preview builds are noindex and use the recorded staging origin for preview metadata. Do not publish production with that default.

After account access and release gates are resolved: run npm run check, review the Worker dry-run, configure secrets/domain, deploy the reviewed version with Wrangler or Cloudflare's Git integration, and verify routes/headers plus an actual delivered inquiry. Deployments and account setup have not been performed by the local checks.

## Updating artwork

See [docs/PUBLISHING.md](docs/PUBLISHING.md) for adding work, marking it sold, scale-preview verification, and the queued private editor's acceptance scope. Content currently lives in src/data.ts; self-service editing is not implemented yet.
