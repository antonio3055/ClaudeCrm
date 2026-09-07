# Forge CRM (v31)

Static desk. Keep the folders together.

| File | Page |
|---|---|
| `index.html` | Leads desk |
| `pipeline.html` | Pipeline board |
| `inbox.html` | Unified inbox |
| `scanner.html` | Bank-statement scanner |
| `underwriting.html` | Deal file |
| `messages.html` | SMS / WhatsApp |

**CSS:** `css/desk.css`, `css/desk-more.css`, `css/pages.css`

**Data:** `js/data.js` … `js/data3.js` — `LEADS` and `DEVICES`

**Used by every page:** `js/shared.js` (formatting/icon/data helpers — the
one place `esc`, `money`, `ico`, `accountsOf`, etc. are defined), `js/view.js`
(pan/zoom stage controller)

**Leads desk only** (`index.html`), loaded in this order after `shared.js`:
`desk-core.js` (state + storage) → `desk-rail.js` (statement paper + lead
list) → `desk-record.js` (contact/statements/activity) → `desk-comms.js`
(threads + dialer) → `desk-viewer.js` (file/statement lightbox + modals) →
`desk-actions.js` (click/keyboard handlers) → `desk-panes.js` (pane resize +
boot — must load last).

**Other 5 pages:** `js/shared.js` → `js/page-shell.js` (standalone Phones
modal + resize — index.html does NOT load this, it has its own) → the page's
own script (`js/pipeline.js`, `js/inbox.js`, `js/scanner.js`,
`js/underwriting.js`, `js/messages.js`).

Leave `.nojekyll` in the repo root so GitHub Pages serves JS/CSS.

Open `index.html`, or from this folder: `python3 -m http.server 8080`

## v31 changes from the prior build
- Full redesign of the Leads middle panel (Application/Bank Statements/
  Financial Summary/Owner & Business/Contact/AI Sales Pitch/Notes/Activity).
  Old 4-quad grid (`.sheet-x`/`.quad`) removed entirely.
- New Application section: Requested + Approved (now reads the real `l.offer`
  field — the header "Approved" figure was previously a fabricated
  `roundRev(avg)+150000` formula, not real data; both now use `l.offer`).
- New Bank Statements section: bank name, full account number, avg monthly
  deposits, ending balance, daily cash flow (new `flow.in`/`flow.out` mock
  fields added per lead), MTD (date + balance only, shown only when a lead
  has MTD data), MCA (lender, computed est. monthly burden, remaining
  balance), most recent 3 months with statement files.
- Fixed `bankBrand()` in shared.js — it silently mislabeled every bank other
  than Wells Fargo/Bank of America as "Chase" (PNC, Mercury, TD, M&T were
  all wrong). Now correct for all 8 banks in the mock dataset; benefits
  every place bankBrand() is used, not just this redesign.
- New Notes section on the main panel (latest note + "View full history") —
  previously notes only existed inside the history modal.
- One visual accent: a quiet gray band with a navy left rail groups
  Application + Bank Statements + Financial Summary as one "financials"
  region. Everything else is plain white with thin dividers. No icons, no
  multi-color zones.
- Removed dead CSS: `.sheet-x`, `.quad` (+ nth-of-type variants, including a
  leftover duplicate block further down the file), `.files-block`/`.files-k`,
  `.below`, `.stmt-kv` (never referenced by any markup), `.money .asked`
  (never referenced), old `.act-block .k` rules replaced by `.sp-head`.
- Verified: 2 clean audit/test passes on the identical final build — CSS
  braces balanced, JS syntax clean, zero duplicate selectors/functions/IDs,
  zero console errors across all 8 leads on every page.
- Rollback: tag `pre-financials-redesign` marks the exact commit before this
  change if a revert is ever needed.

## v30 changes from the prior build
- `factsStrip()` (owner% / entity / position / time-in-business, under the
  company name) is now actually called from `renderDesk()` — it existed
  before but nothing rendered it.
- Added a "View full history" link on the Activity section that opens the
  existing Notes + Activity modal (the modal already existed; nothing opened
  it before).

## v29 changes from the prior build
- `css/desk-more.css`: removed a dead `.kv .v .qacts` rule (an earlier
  `margin-left:2px` copy that a later same-file rule always overrode), a dead
  `.thread-who` rule (merged into the one that was actually winning), and a
  dead `.facts-strip{display:none}` rule left over from before the strip was
  redesigned.
- `css/pages.css`: removed `.kpi .v.warn` — no code ever applies a `warn`
  class to a `.kpi .v`, only `bad`/`ok`.
- Confirmed no cross-file duplicate function names, no duplicate DOM IDs on
  any page, all JS passes `node --check`, and all 6 pages load with zero
  console/runtime errors.
- Found (not yet fixed): `factsStrip()` in `desk-record.js` is defined but
  never called, and no "View full history" link exists anywhere in the JS —
  both were previously reported as wired in; they are not, on this build.

## v28 changes from the prior build
- `app0.js`–`app6.js` and `viewer.js` merged into the named `desk-*.js` files
  above. `viewer.js` had silently overridden two functions from `app1.js`/
  `app4.js` (different zoom math, different lightbox layout) — there is now
  one copy of each.
- File-viewer zoom (buttons and +/− keys) previously used two different,
  inconsistent formulas depending on which one fired first. Both now call the
  same `bumpZoom()`.
- `esc`, `money`, `ico`, `hue`, `initials`, `displayName`, `bankBrand`,
  `bankMark`, `toast`, `accountsOf` were duplicated between `app0.js` and
  `shared.js`. Now defined once in `shared.js`.
- `accountsOf()` now defaults a missing statement's `pages` to 6 everywhere
  (previously only on the 5 non-Leads pages).
- `css/viewer.css` removed — its rules (the current lightbox design) replaced
  a dead, superseded ruleset that was still sitting in `css/desk-more.css`.
- `css/desk.css` and `css/pages.css` un-minified for readability.
- All pages now load the same `v28` asset version (previously `index.html`
  was on `v27` while the other five were on `v23`, though same underlying
  files).
