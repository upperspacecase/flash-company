# Known Issues & Tracking

Living list of known issues, papercuts, and follow-ups for Flash Company.
Check the box when fixed. Add new items under **Open**; move them to **Fixed**
with a date when resolved.

## Open

- [ ] **Ventures step-3 title still says "venture" / "build"** —
  `app/demo/workspace.tsx`, `HOW_STEPS[2]` title "The venture only you can build"
  clashes with the new "idea" / "start" language used everywhere else. Pick a new
  title (e.g. "The idea only you can start").
- [ ] **`--accent` duplicates `--orange`** — both are `#ff5500` in
  `app/globals.css`. The landing (`app/page.tsx`) uses `text-accent`; the
  workspace uses `text-orange`. Same colour, two names. Consolidate to one?
- [ ] **`app/demo/_v1/` uses the old `-sage` classes** — archived/orphaned (nothing
  imports it). Left untouched during the sage→orange rename. Delete the folder, or
  rename its classes if it's being kept.
## Fixed

- [x] **Input phase (mobile): input box was disconnected from its question** — the
  mobile layout now wraps the whole flow (stepper, Flash + questions, input) in one
  orange border, in natural order, with "How it works" below it. (2026-06-11)

- [x] **`resend` module not found** (`lib/email.ts`) — `resend` was declared in
  `package.json` (`^6.12.4`) but not installed in `node_modules`, so `tsc` failed
  to resolve it. Fixed by running `pnpm install`. (2026-06-11)
