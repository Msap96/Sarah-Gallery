# Sarah Gallery — Launch checklist and progress

Updated October 1, 2026. Active scope; CHECKLIST.history.md preserves previous notes.

Current position: four preparation tasks implemented, tested and pushed to GitHub main. GitHub validation passed for website revision 74f9785, and the existing Vercel integration refreshed https://sarah-gallery.vercel.app/. Deployed gallery/artwork navigation, missing-page screen, security headers and preview robots rules were verified. Cloudflare is not logged in. Live email delivery and Sarah's private content editor remain unfinished.

## Working agreement

Implement each task, run its acceptance checks, record evidence, then move to the next task. Local implementation and live activation have separate gates. Keep Sarah's visual direction; leave content decisions open.

## Already verified in the audit

- [x] Strict TypeScript and production build pass.
- [x] Ten original photos regenerate; nine artwork routes, filtering, additional images and local 404 work.
- [x] Local mobile menu, dialog Escape and focus restoration work.
- [x] Recorded staging URL is older; unknown URLs render a blank page there.
- [x] Confirmed mailto/address-flow, direct-link Back, form-label and carousel-control issues.

## 1. Reproducible builds and deployment preparation — LOCAL CHECKS PASSED

Scope: complete source package, patched dependencies, CI, content/image checks, Cloudflare routing and security headers. Local Git preservation; push/deployment is separately gated.

- [x] Update dependencies/lockfile and audit again.
- [x] Add CI and supported Node version.
- [x] Validate artwork metadata and generated images during builds.
- [x] Prepare Cloudflare config, SPA fallback and security headers.
- [x] Verify build and local Worker packaging.
- [x] Preserve complete source in Git.
- [x] Refresh existing Vercel staging and verify navigation/routes/headers.
- [ ] Activate production Cloudflare hosting and inquiry service — needs selected account/domain/email configuration.

## 2. Navigation and accessibility — LOCAL CHECKS PASSED

- [x] Artwork Back always returns to the gallery.
- [x] Carousel touch targets, pause and reduced-motion behavior.
- [x] Mobile menu Escape and focus restoration.
- [x] Browser-check desktop/narrow layouts and keyboard behavior.

## 3. Reliable inquiries — LOCAL CHECKS PASSED

Scope: one inquiry flow, no address/payment collection; server validation, spam protection, provider acceptance, explicit UI states and input retention after failure.

- [x] Replace purchase/mailto forms with one labeled form.
- [x] Same-origin API, validation, honeypot, rate limit, provider timeout/errors.
- [x] Automated valid/invalid/spam/unconfigured/provider-failure tests with mocked provider.
- [x] Browser-test validation, errors, retry, retained input and success.
- [ ] Verify sender domain/secrets/recipient and real delivery/replies — needs account/domain/inbox setup.

## 4. Publishing workflow and launch metadata — LOCAL PREPARATION CHECKS PASSED

- [x] Document/validate adding artwork and photos.
- [x] Use shared artist data consistently.
- [x] Configurable final URL, sitemap, social previews and page titles.
- [x] Define private editor acceptance: upload, image processing, drafts, preview, publish, sold status and backup/restore.
- [x] Show whole photos; restrict scale preview to verified photos/dimensions; remove unconfirmed shipping claim.
- [ ] Implement authenticated editor after ownership/backend decision — awaiting Sarah's answers.

## 5. Sarah approval and public launch — WAITING

- [ ] Confirm artwork details, missing title/size/support, prices and availability.
- [ ] Approve photos/portrait, bio and shipping claims.
- [ ] Confirm inbox/domain/accounts/editors/cost ceiling.
- [ ] Connect the selected Cloudflare account and verified email provider; set final SITE_URL and secrets.
- [ ] Sarah reviews refreshed staging; previous approval refers to the older build.
- [ ] Real delivery/replies, final-domain headers/routes/previews, Instagram on a real phone.
- [ ] Account handover, rollback/backups/renewal contacts; public launch and Instagram link.

## Validation log

- October 1 audit: local build/typecheck, original-image regeneration and artwork routes pass. Inherited functionality, not new remediation.

- October 1 task 1: build, strict TypeScript and build-content verification pass; npm audit reports zero vulnerabilities. CI is configured; its remote run awaits push.
- October 1 task 1: Wrangler dry-run passed (74 static files, SPA fallback and rate-limit binding); no remote deployment performed.
- October 1 task 2: build/typecheck/content checks pass. Browser verifies direct artwork → gallery navigation, pause/play and manual slides, 44×44 controls, narrow-menu Escape and focus restoration. Reduced-motion rotation guard implemented; physical device/OS setting check remains a launch gate.
- October 1 task 3: six inquiry test groups pass (including ten invalid inputs); build/typecheck/content verification pass. Local Cloudflare runtime returns clear 503 with no credentials. Browser mock-provider test verifies failure retention, retry, success and Done/focus return. No real email sent.
- October 1 task 4: full npm run check passes (production build, strict TypeScript, inquiry/metadata tests, nine artwork entries and ten image families). Production-origin/indexability and repeated preview/noindex generation pass. Worker dry-run packages 88 assets. Browser verifies route titles/artwork previews, full-photo cards and hidden unverified scale controls. Private editor acceptance is documented, not implemented.
- October 1 account checks: GitHub repository access includes read/write/admin; no push performed. Wrangler whoami reports no authenticated Cloudflare account. No remote deployment or live inbox verification performed.
- October 1 subsequent push: four implementation commits pushed to main (74f9785). [GitHub validation](https://github.com/Msap96/Sarah-Gallery/actions/runs/36929835844) passed, including cold image generation, build, TypeScript, tests, content verification and Worker dry-run. Existing Vercel automatic deployment succeeded; browser confirms nine works, artwork page, Back to Gallery and missing-page screen. HTTPS responses include expected security headers; robots.txt blocks preview indexing. The Vercel staging deployment does not activate the Cloudflare inquiry API or verify live delivery.
