# Content publishing and editor scope

The current launch version stores content in src/data.ts. A private editor is queued pending Sarah's choice of editors, account owner, backend, and cost ceiling. The editor is not implemented or activated yet.

## Interim adding-work workflow

1. Add an original JPEG/PNG to assets/masters using a unique lowercase hyphenated filename. Originals stay out of the deployed website.
2. Photograph square-on and crop to canvas edges before adding it. Correct rotation before saving the original.
3. Add an artwork entry in src/data.ts with unique permanent id, title, year, medium, imageUrl `/artworks/<filename>.jpg`, availability, price (0 means price on request), optional sizes in inches, and optional additional image paths. Keep ids stable when titles change so existing links work.
4. Run npm run check. Images regenerate automatically; checks reject missing photos, duplicate ids, bad sizes/status and broken metadata. Missing dimensions are allowed and display "Dimensions on request".
5. Preview the full photo, mobile layout, availability and inquiry. Cards now show the whole photo inside their existing frames. Enable scalePreviewReady only after photo edges and dimensions have been verified; checks require matching image/physical proportions.
6. Commit the originals and metadata, then use the reviewed deployment workflow. Responsive images and dist are build outputs and stay ignored. A future editor should automate these steps.

To mark a piece sold, change status to sold and run the same checks. The work remains in the portfolio; inquiries for unavailable works are rejected by the API. Replace an image using a new filename when possible to avoid stale browser caches.

## Private editor acceptance scope

- Sarah and/or Marc can sign in; only approved editors can write. Visitors cannot create accounts with publishing rights.
- Upload original photo(s), normalize rotation, crop/preview canvas edges, and generate responsive public variants. Keep originals private.
- Enter/validate artwork data, save draft, preview, then explicitly publish. Drafts are not publicly discoverable.
- Edit availability, prices, homepage selections, ordering, bio and contact details.
- Keep permanent artwork links; archive rather than destroy by default.
- Report publishing errors and provide rollback to the last successful publication.
- Keep a last-published public catalogue available when the editor/database is unavailable.
- Export metadata plus originals for backup; test restore. Account owners receive actionable failure/renewal alerts.

Supabase is a candidate, not an activated service. If chosen, include admin-only database/storage policies, auth configuration and exports; account for free-project inactivity pausing. Database outages must not remove the public gallery or block inquiries. No service-role key may be shipped in the browser.

## Release gates

Sarah's artwork/copy/photography approval, editor ownership and backend choice, account access, final domain, verified sender/inbox, real inquiry delivery/replies, and Instagram phone testing are recorded in CHECKLIST.md. Local mock-email success does not verify inbox delivery.
