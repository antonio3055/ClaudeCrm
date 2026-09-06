# Forge CRM (v28)

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
