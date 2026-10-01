# Sarah Gallery — Project Checklist

Working doc. Update the boxes as things land. Verified against the codebase on 2026-07-31 (commit `fb56512`).

**What this site is:** a static React 19 / Vite 6 / Tailwind 4 SPA on Vercel, 9 artworks hand-edited in `src/data.ts`, all `price: 0` (inquire-only), traffic driven by Instagram. Target architecture is *static portfolio + one reliable inquiry API*, not an e-commerce platform. Everything below is scoped to that.

---

## Corrections to the prior diagnostic report

Read these before working from that report:

- **"Collection filter is effectively broken" — false.** `src/pages/Gallery.tsx:14` special-cases `available-works` and filters on `status === 'available'`, so the UI works correctly. The real (harmless) issue is that `collection: 'selected-works'` on every artwork in `src/data.ts` matches no collection id and is never read. That's dead-field cleanup, not a P0 bug.
- **Right-click blocking is theater.** It stops no one and annoys real visitors. The actual protection is not shipping 2048px masters — cap public images around 1600px and keep the originals offline. Listed under image pipeline, not security.
- **Missed: no 404 route.** `src/App.tsx:30-37` defines no catch-all. Vercel rewrites every path to `index.html`, so any typo'd or stale link (`/portfolio`, an old IG bio link) renders a **completely blank white page** — no navbar, no footer, no way back. This is the most visible defect on the site.
- **Missed: content errors that read as unfinished** — see P0 item 5.
- **Missed: mailto deliverability risk.** Every inquiry path depends on `studio@sarahsandia.art` being a real, monitored mailbox. If it isn't, inquiries are already being silently lost. This gates everything else.

---

## P0 — Do first (cheap, protects the actual goal: don't lose an inquiry, don't look broken from Instagram)

- [ ] **0. ⏸ WAITING ON MARC (2026-07-31)** — mailbox credentials/details coming soon. Verify `studio@sarahsandia.art` receives mail.** 5 minutes, blocks nothing else, invalidates half this list if it fails. Send a test from an outside address. If the mailbox isn't live, this jumps ahead of every other item.
- [x] **1. Stop cycling all 10 hero images.** ✅ 2026-07-31 — `Home.tsx` now cycles only the 3 featured works and preloads just the next frame instead of letting the browser pull all ten. Cut the hero from ~7.1 MB to ~2 MB, and it no longer competes with the featured cards for bandwidth on first paint.
- [x] **2. Lazy loading + `decoding="async"` + intrinsic `width`/`height`.** ✅ 2026-07-31 — applied across `ArtworkCard`, `WorkDetail` (main image, thumbnails, purchase-modal thumb), and `About`. First 3 cards stay eager so above-the-fold work isn't deferred. Dimensions come from `src/lib/imageDimensions.ts` (new) — a hand-maintained map of the ten static assets; **the P1 image pipeline should generate this instead of hand-editing it.**
- [x] **3. 404 route.** ✅ 2026-07-31 — new `src/pages/NotFound.tsx`, wired as `<Route path="*">` inside `Layout` so it keeps the navbar and footer. Also replaced the bare "Work not found." text in `WorkDetail.tsx` with the same component, so a bad artwork id gets a real page too.
- [x] **4. Open Graph / social meta + favicon.** ✅ 2026-07-31 — full OG + Twitter card set in `index.html`, absolute URLs on `https://sarah-gallery.vercel.app`. Added `public/favicon.svg` (serif "S" in the site palette) since there was none. **Preview image is `art-01.jpg`** — the only landscape work, so it crops least at 1.91:1. Two follow-ups:
  - [ ] Swap in a purpose-built 1200×630 card when there's one; then update `og:image:width`/`height`/`alt` to match.
  - [ ] If a custom domain ever replaces the `.vercel.app` host, the URL appears in 3 tags in `index.html` (`og:url`, `og:image`, `twitter:image`) — update all of them or previews break silently.
- [ ] **5. Fix content that reads as unfinished** in `src/data.ts`:
  - [x] `"Untitiled"` typo → `"Untitled"` ✅ 2026-07-31
  - [x] Bio "primarily in oils" → "primarily in acrylics" ✅ 2026-07-31 — matches the actual catalogue (8 of 9 acrylic). **Confirm with Sarah**, it's her bio copy.
  - [x] **Medium + dimension standardisation** ✅ 2026-07-31 — see "Standardisation" section below.
  - [ ] `"Selected Work VII"` placeholder title, and no dimensions at all (was `'TBD'`) — needs real values from Sarah. Currently displays "Dimensions on request" and has no to-scale view.
  - [ ] `portraitUrl` points at an artwork (`img-9435.jpg`), so the About page shows a painting labeled with her name as alt text — needs a real portrait
  - [ ] Footer promises *"Original Pieces Available"* and *"Global Shipping Available"* (`Footer.tsx:11-12`) — only keep claims she can honor

---

## P1 — Do soon (real infrastructure, still light)

- [ ] **6. Replace `mailto:` with `POST /api/inquiry`.** Both flows (`WorkDetail.tsx:33-59`) set `window.location.href = mailto:...`. On mobile this frequently no-ops or drops the long prefilled body, and there's no delivery confirmation for either side. One Vercel serverless function → Resend → studio inbox. No database needed. This is the only genuine backend requirement, and it establishes the `/api` pattern Stripe would later plug into.
  - [ ] Success / error / in-flight states in the modals (currently the modal just closes and hopes)
  - [ ] Honeypot field + basic rate limit
  - [ ] Server-side validation; never trust the client body
  - [ ] `RESEND_API_KEY` in Vercel env (not committed — `.env.example` currently says no vars are needed; update it)
- [x] **7. Security headers in `vercel.json`.** ✅ 2026-07-31 — CSP, HSTS, nosniff, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP, plus cache headers for `/assets` (immutable) and `/artworks`. Verified by serving the real build behind these exact headers in headless Chromium across `/`, `/gallery`, `/work/art-01`, `/about`, and a 404 path — **zero CSP violations**, Google Fonts still load. The CSP allowlists `fonts.googleapis.com` (style-src) and `fonts.gstatic.com` (font-src) because of the `@import` in `index.css:1`; self-hosting those fonts would let both be dropped. `script-src 'self'` with no `unsafe-inline` works because Vite emits no inline scripts — **re-check that if the build config ever changes.** `connect-src 'self'` already permits the future `/api/inquiry` call.
  <details><summary>Superseded original note</summary>

  It currently contains *only* the SPA rewrite. Add `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Strict-Transport-Security`, and a CSP. Note the CSP must allow `fonts.googleapis.com` + `fonts.gstatic.com` — `src/index.css:1` imports Google Fonts at runtime. Self-hosting those two font families would let the CSP be stricter *and* remove a render-blocking third-party request.
  </details>
- [x] **7b. Self-host Inter + Playfair Display** ✅ 2026-07-31 — files in `public/fonts`, `@font-face` in `index.css`, third-party `@import` gone. **CSP tightened**: `style-src` and `font-src` are now `'self'` with no Google hosts. Verified in a browser: 4 woff2 requests, zero to `fonts.googleapis.com`/`gstatic.com`.
  - Shipped only the faces that actually render: **Playfair is used exclusively in italic** across the whole codebase, so the three upright cuts were dropped, along with unused Inter 300. 8 files → 4 (168 KB).
  - ⚠️ `font-bold` (700) is used 22 times but **no 700 cut exists** — the previous Google import didn't request one either, so weight 600 is what it resolves to and appearance is unchanged. Adding a real Inter 700 would make bold text slightly heavier; that's an aesthetic call, not a bug fix.
- [x] **8. Build-time image pipeline** ✅ 2026-07-31. Measured against the real build in a browser: **the gallery page went from 7,214 KB to 341 KB — a 95% reduction**; the homepage from ~2,064 KB to 669 KB. Chromium picks AVIF at 480w for cards and 1600w for the hero.
  - `assets/masters/` holds the full-resolution originals and is **not served**. `scripts/generate-images.mjs` (`npm run images`) emits AVIF + WebP at 480/960/1600 plus one JPEG fallback into `public/artworks/`, never upscaling past a master's real width.
  - Per-width JPEGs were dropped: AVIF+WebP cover the overwhelming majority of browsers and one fallback JPEG handles the rest. Emitting JPEG at every width nearly doubled output for traffic that does not exist.
  - Output is **gitignored** and regenerated by `predev`/`prebuild`. Reruns are cached by mtime — 0.57s versus 2+ minutes cold — so the hooks are effectively free. `public/artworks` was untracked with `git rm --cached`; the staged deletions are index-only, the files are build artefacts.
  - `src/components/ArtImage.tsx` renders `<picture>` with correct `sizes` per context; `variantUrl()` serves SVG `<image>` in RoomView, which can only take one href. `picture { display: contents }` in the CSS keeps `max-height`/flex containment working.
  - The hand-maintained `src/lib/imageDimensions.ts` is gone — intrinsic sizes now come from the generated manifest, as this checklist previously said they should.
  - **2048px masters are no longer publicly served**, which also closes the IP concern noted under Security.
- [ ] **9. Respect real artwork orientations.** `ArtworkCard.tsx:20` forces `aspect-[4/5]` + `object-cover`. `art-01.jpg` is landscape (2048×1366) and gets center-cropped hard; the rest are portrait. Cropping a painting is the one thing a gallery site must not do. Either true masonry or per-artwork aspect ratios (`src/lib/imageDimensions.ts` already has the numbers).
  - ⚠️ **Blocked on source images first.** Several files are uncropped phone photos, not the artwork: `img-6996` is listed as 40"×40" (square) but the file is 1152×2048 (ratio 0.56); `img-5411` is listed as 43.5"×37.5" (≈1.16) but is also 1152×2048. So the file's aspect ratio ≠ the painting's aspect ratio, and honoring the file dimensions would just render the surrounding room faithfully. **Get images cropped to the canvas edges before doing the layout work** — otherwise this item makes the grid worse, not better.
- [ ] **10. Fix the purchase modal's honesty gap.** `WorkDetail.tsx:171-193` collects street address, city, and ZIP — then opens an email client. It's collecting PII for a form that can't transact. Until Stripe exists, either drop the address fields or relabel the flow so it's clearly a request, not a checkout.

---

## P2 — Lower priority polish

- [x] Modal a11y (`Modal.tsx`) ✅ 2026-07-31 — Esc to dismiss, Tab cycles inside the dialog, focus moves to the first field on open and returns to the trigger on close, plus `role="dialog"`, `aria-modal`, and `aria-labelledby`. Also removed a `focus:outline-none` that left keyboard users with no visible position.
- [x] **Reduced motion** ✅ 2026-07-31 — 19 `motion` animations existed across 6 files and only 2 honoured `prefers-reduced-motion`. A single `<MotionConfig reducedMotion="user">` in `App.tsx` now covers all of them, rather than each animation opting in. CSS transitions/animations use `motion-reduce:` variants and a media query.
- [x] **Keyboard focus + skip link** ✅ 2026-07-31 — the site had no `:focus-visible` styling anywhere. Added a global focus ring, a light variant for the dark hero (`.on-dark`), and a "Skip to content" link that appears on focus.
- [x] Remove unused imports ✅ 2026-07-31 — `Footer.tsx`, `About.tsx`, plus an unused `motion` import in `Gallery.tsx` and dead `React` default imports in `App.tsx` / `GalleryContext.tsx`.
- [x] Enable `strict` + `noUnusedLocals` in `tsconfig.json` ✅ 2026-07-31 — also `noUnusedParameters` and `noFallthroughCasesInSwitch`. **This exposed a much bigger problem — see below.**
- [x] **🚨 `@types/react` and `@types/react-dom` were never installed** ✅ fixed 2026-07-31. TypeScript had no JSX type definitions, so `npm run lint` was silently skipping essentially all React code — 246 `TS7026` errors were hiding behind the loose config. A green `npm run lint` before this date meant far less than it appeared. Both are now devDependencies, and the codebase typechecks clean under `strict`.
- [x] Delete `metadata.json` ✅ 2026-07-31 — leftover AI Studio scaffolding, referenced by nothing.
- [x] Clean the dead `collection: 'selected-works'` field ✅ 2026-07-31 — removed from all 9 works; `Artwork.collection` is now optional and documented, so the field is there when real collections exist without carrying a value that matches nothing.
- [ ] Strip the AI Studio comments in `vite.config.ts` about `DISABLE_HMR`.

---

## Art direction — moving toward the James Jean reference

Sarah's stated influence is **jamesjean.com**. Observations below are from actually rendering that site (2026-07-31), not from memory.

**What that site does:**
- **Homepage is one painting, full-bleed, at full strength.** No hero text block, no button pair, no wash. Wordmark top-left and a 5-item nav top-right float directly on the image; a tiny `WORK / 2025` caption sits bottom-left. The image *is* the page.
- **Work index is pure white**, with works in a row sharing a common top and bottom edge — **height-normalised, never cropped**, so each piece keeps its true proportion and widths vary naturally.
- **Enormous vertical air** — roughly 400 px of nothing between nav and the first row.
- **Captions carry four facts and stop**: title in letterspaced uppercase, then `Acrylic on Canvas, 80 × 60", 2025.` No price. No availability badge. No "inquire".
- **Commerce is quarantined** behind separate `Store` and `Contact` links. The work pages never sell.
- **Typography is letterspaced uppercase sans throughout.** No serif, no italic.
- Work is organised by year (1999–2026) and by named series (Prada I–III, Rift I–II, Psychic Temple).

**Ranked gap list for this site:**

- [x] **1. The hero wash.** ✅ 2026-07-31 — was a painting at `opacity-20` behind a button, i.e. artwork as wallpaper. Now full-bleed at full strength, viewport height, with a bottom scrim, a title/medium/size/year caption, and the whole image clickable into the gallery. Slide indicators bottom-right.
- [ ] **2. The forced `aspect-[4/5]` crop in the grid** — the largest remaining departure. Same as P1 item 9, and blocked on the same thing: source photos cropped to the canvas.
- [ ] **3. Commerce vocabulary on every tile.** `Inquire` + `Available`/`Sold` on each card frames the catalogue as inventory before the viewer has looked at anything. Consider moving price and status to the detail page only.
- [ ] **4. Vertical air.** The grid is comparatively dense; the reference lets works float.
- [ ] **5. Typographic identity — needs Sarah's decision.** Playfair Display italic reads boutique/luxury; the reference is uniformly letterspaced uppercase sans and reads contemporary-art-press. A real fork, not a bug.
- [ ] **6. Background — needs Sarah's decision.** Warm beige `#F7F5F2` vs the reference's museum white.
- [ ] **7. Year/series organisation.** Not yet earned at 9 works, all 2025, but `Artwork.collection` is already in place for when it is.

⚠️ **The honest constraint: photography, not CSS.** The reference's images are flat, evenly lit, and cropped to the canvas edge. Several of Sarah's are phone snapshots that include the wall and floor — visible right now as grey strips at the edges of the new full-bleed hero. Full-bleed heroes and no-crop grids both expose this immediately. **A proper flat shoot — square-on, even light, cropped to the canvas — is the single highest-leverage thing available, and it gates gaps 2 and 4.** No styling fixes it.

## Visual effects — what was added, and what was deliberately refused

Added 2026-07-31, after reviewing current technique ([grainy blur](https://www.kittl.com/blogs/grainy-blur-effect-stl/), [scroll animation patterns](https://veebilehed24.ee/en/blog/css-scroll-animations-html-css-javascript-examples/), [2026 aesthetics](https://www.liquidweb.com/blog/website-aesthetics/)). Filter applied throughout: **an effect must flatter the painting, never compete with it — and must never be able to hide it.**

- [x] **Blur-up placeholders.** A 20px WebP per work, inlined in the manifest (3.3 KB for all ten) and painted as the image's own `background-image`. Loading now reads as a soft colour impression resolving into the work, instead of empty grey boxes. Doubles as a perf win, so it reinforces item 8 rather than competing with it. Uses no extra DOM and is not gated on an `onLoad` handler.
- [x] **Scroll reveal** (`src/components/Reveal.tsx`) — replaces a mount-time animation that was effectively broken: every card ran its `index * 0.1` delay immediately, so lower rows had finished before you ever scrolled to them.
- [x] **Film grain** — one inlined SVG turbulence tile, fixed over the viewport at 3.5% opacity, `pointer-events: none`. Gives flat colour fields some tooth. CSS-only, so it cannot fail.
- [x] **Slow hero drift** — 20s scale from 1 to 1.06 on the active frame. Scale only, no translation, so the crop never shifts. CSS-only.

⚠️ **The trap, hit twice — worth remembering.** Both `AnimatePresence mode="wait"` (hero) and motion's `whileInView` (grid) fail *invisible*. The `whileInView` version left **all nine cards pinned at `opacity: 0`** — a blank catalogue — verified by dumping the DOM. `Reveal` inverts it: the default state is visible, the hidden state is applied by script in a layout effect only once an `IntersectionObserver` is known to exist, plus a 2.5s failsafe timer. If script never runs, the work is simply there. **Never gate artwork or essential text on an animation completing.**

**Refused, with reasons:**
- **Custom cursors** — meaningless on the phones most of this traffic arrives from, and they break the pointer affordances people rely on.
- **Glassmorphism / heavy blur panels** — competes directly with the paintings for colour and depth. The reference site has none.
- **Scroll-jacking and heavy parallax** — breaks scrollbar expectations and triggers motion sickness; a gallery should be scannable, not a ride.
- **Horizontal-scroll galleries** — a recurring showcase pattern, but it hides work behind an unfamiliar gesture and is poor for keyboard and screen readers.
- **Marquee / ticker type** — reads as fashion-brand filler and cheapens a small catalogue.

**Note on the reference material:** Dribbble shots are static thumbnails, not working sites. They optimise for a single JPEG in a feed, which is why they lean on effects that collapse under real photography and real content. Treat them as colour and layout inspiration, not as interaction specs.

## Standardisation rules for artwork entries

Established 2026-07-31. Follow these when adding a work to `src/data.ts` so every entry reads identically.

**Medium** — `"<Material> on <support>"`, material capitalised, support lowercase. Singular material ("Acrylic", not "Acrylics"). Before/after:

| Was | Now |
|---|---|
| `Acrylics on canvas` ×4, `Acrylic on canvas` | `Acrylic on canvas` |
| `Acrylics on Wood` | `Acrylic on wood` |
| `Oil on Canvas` | `Oil on canvas` |
| `Acrylics, newspaper board` | `Acrylic on newspaper board` |
| `Spray Paint, Acrylics` | `Acrylic and spray paint` ⚠️ support unknown |

**Size** — stored as numeric `widthIn` / `heightIn`, never as a display string. `formatDimensions()` in `src/lib/dimensions.ts` is the single place that renders them, always **width × height**, trailing zeros trimmed (`30" × 24"`, `17.3" × 23.6"`). Works with no known size omit both fields and display "Dimensions on request".

⚠️ **The width/height assignment needs Sarah's confirmation.** The old strings were ambiguous — art is often quoted height × width, but this data was inconsistent: `8" x 10"` and `16" x 20"` read as W×H against their photos, while `20" x 16"` and `23.6" x 17.3"` read as H×W. I resolved each by matching the photo's orientation, which keeps the site self-consistent (the to-scale view never contradicts the photo beside it). Three are inferred rather than known:

- `img-7645` "With Grace, Always" — written `23.6" x 17.3"`, stored as 17.3 w × 23.6 h (**swapped**)
- `img-8293` "Le Cosmos et le Lotus" — written `20" x 16"`, stored as 16 w × 20 h (**swapped**)
- `img-5411` "Flor Primera" — written `43.5" x 37.5"`, kept as-written; its photo is uncropped so orientation is no guide

A wrong guess here shows a work in the wrong orientation in the to-scale view, which is very visible. Worth a five-minute check with her.

## To-scale room view

`src/components/RoomView.tsx`, toggled by "Artwork / View to Scale" on the detail page. Only appears for works with known dimensions.

Drawn as an SVG whose **viewBox is measured in inches**, so the scale can't drift — every element is at true relative size regardless of display size. Reference constants: 9 ft wall, 5 ft 6 in figure, hung at the gallery-standard 57 in centre. Verified by rendering in headless Chromium: an 8"×10" reads convincingly small against the figure, a 43.5"×37.5" reads substantial.

- [ ] Optional polish: the dimension labels are fixed at 5 in tall, so they look slightly oversized next to the smallest works. Scaling them with room width would even it out.

## Later — only when the business actually needs it

Not scoped now; recorded so it isn't re-litigated each time.

- [ ] Stripe Checkout via `/api/checkout` — Buy when `price > 0`, Inquire when `price === 0`. Gate on Sarah setting real fixed prices.
- [ ] Custom invoices, deposits, split payments
- [ ] Lightweight CMS — only when editing `data.ts` by hand becomes painful (9 works is nowhere near that)
- [ ] Deep-zoom viewer; watermarked public vs. master assets; VIP private links
- [ ] Provenance / edition / frame fields; exhibitions scheduler
- [ ] Shipping, VAT, KYC — only if volume or regulation forces it

## Explicitly not doing

- **SSR / crawler SEO.** Traffic is social-driven. OG tags (P0 #4) cover the actual discovery path; server rendering does not earn its complexity here.
- **A database.** Nine records in a typed static file is the right storage layer at this size.
- **Right-click blocking / watermarking.** See corrections above — image sizing is the real mitigation.
