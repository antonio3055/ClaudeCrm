/* Forge CRM — desk-core.js (Leads desk only)
   App state, local storage, and small record-derived helpers.
   Shared formatting helpers (esc, money, ico, toast, hue, initials, displayName,
   bankBrand, bankMark, accountsOf) live in shared.js — this file does not
   redefine them. */

function roundRev(n) {
  const x = Number(n) || 0;
  return Math.ceil(x / 50000) * 50000;
}
function ownPct(l) {
  return (l && l.own != null ? l.own : 100) + "%";
}
function monthShort(s) {
  return String(s || "").replace(/\s+20\d{2}/, "");
}
function fileShort(f) {
  const n = String(f && f.n || "").toLowerCase();
  if (/application|^app$/.test(n)) return "APP";
  if (/mtd|month-to-date/.test(n)) return "MTD";
  const m = n.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/);
  if (m) return m[0].toUpperCase();
  return String(f.n || "").slice(0, 3).toUpperCase();
}
const LS = { rail: "forge.railW16", dock: "forge.dockW16" };
function storeGet(k) {
  try { return localStorage.getItem(k); } catch (e) { return null; }
}
function storeSet(k, v) {
  try { localStorage.setItem(k, v); } catch (e) {}
}
const _bootLead = new URLSearchParams(location.search).get("lead");
const state = {
  selected: (_bootLead && LEADS.some(l => l.id === _bootLead)) ? _bootLead : "ns",
  filter: "all",
  query: "",
  railSearchOpen: false,
  commsTab: "all",
  threadN: "",
  threadCh: "sms",
  fileZoom: 1.2,
  keypadOpen: false,
  actOpen: false,
  fav: new Set(LEADS.filter(l => l.fav).map(l => l.id)),
  follow: Object.fromEntries(LEADS.filter(l => l.follow).map(l => [l.id, l.follow])),
  modal: null,
  drafts: {},
  dial: { status:"idle", device:"poly", number:"", contact:"", elapsed:0, started:0, muted:false, speaker:false, dtmf:"" }
};
let tick = null;
const num = (s) => s;
const lead = () => LEADS.find(l => l.id === state.selected) || LEADS[0];
const device = () => DEVICES.find(d => d.id === state.dial.device) || DEVICES[0];
function entityTag(s) {
  const t = String(s || "");
  if (/S-?Corp/i.test(t)) return "S-Corp";
  if (/\bPC\b/.test(t)) return "PC";
  if (/\bLLC\b/i.test(t)) return "LLC";
  if (/\bInc\b/i.test(t)) return "Inc";
  if (/Corp/i.test(t)) return "Corp";
  return "";
}
function phoneConnected() {
  return DEVICES.some(d => d.on && (d.id === "poly" || d.id === "mobile" || d.id === "web"));
}
function paintBt() {
  const btn = $("btBtn");
  if (!btn) return;
  const on = phoneConnected();
  btn.classList.toggle("on", on);
  btn.classList.toggle("off", !on);
}
function kv(k, v, extra) {
  if (v == null || v === "") return "";
  return `<div class="kv"><div class="k">${esc(k)}</div><div class="v"><span class="vt">${v}</span>${extra || ""}</div></div>`;
}
function pair(a, b) {
  if (!a && !b) return "";
  if (!b) return `<div class="pair one">${a}</div>`;
  if (!a) return `<div class="pair one">${b}</div>`;
  return `<div class="pair">${a}${b}</div>`;
}

function paperHtml(l, i) {
  const f = l.files[i];
  const kind = (f.n || "").toLowerCase();
  const acct = "•••• " + String(l.bank.acct).slice(-4);
  if (kind.includes("application")) {
    return `<div class="stamp">SCANNED · APPLICATION</div>
      <div class="bank">FORGE MERCHANT DESK</div>
      <h2>Merchant Cash Advance Application</h2>
      <table>
        <tr><th>Legal name</th><td>${esc(l.company)}</td></tr>
        <tr><th>DBA</th><td>${esc(l.dba)}</td></tr>
        <tr><th>Owner</th><td>${esc(displayName(l.contact))} · ${esc(l.title)}</td></tr>
        <tr><th>Ownership</th><td>${esc(ownPct(l))}</td></tr>
        <tr><th>Address</th><td>${esc(l.address)}</td></tr>
        <tr><th>EIN</th><td>${esc(l.ein)}</td></tr>
        <tr><th>Requested</th><td class="end">${money(l.ask)}</td></tr>
        <tr><th>Use of funds</th><td>${esc(l.use)}</td></tr>
        <tr><th>Avg monthly deposits</th><td class="end">${money(l.avg)}</td></tr>
        <tr><th>Bank</th><td>${esc(bankBrand(l.bank.name))} · ${esc(l.bank.acct)}</td></tr>
      </table>
      <p style="margin-top:28px;font-size:12px;color:#5C564C">Signed electronically · ${esc(displayName(l.contact))} · ${esc(l.started)}</p>`;
  }
  const stmt = kind.includes("july") ? l.stmts[1] : kind.includes("mtd") ? null : l.stmts[0];
  if (kind.includes("mtd")) {
    return `<div class="stamp">SCANNED · MTD</div>
      <div class="bank">${esc(bankBrand(l.bank.name).toUpperCase())}</div>
      <h2>Month-to-date activity · ${esc(l.mtd.m)}</h2>
      <table>
        <tr><th>Account</th><td>${esc(l.bank.acct)}</td></tr>
        <tr><th>MTD deposits</th><td class="end">${money(l.mtd.dep)}</td></tr>
        <tr><th>Current balance</th><td class="end">${money(l.mtd.bal)}</td></tr>
        <tr><th>Daily cash flow</th><td class="end">${money(Math.round(l.avg/30))}</td></tr>
      </table>
      <p style="margin-top:22px;font-size:12px;color:#5C564C">Activity through today. Not a final statement.</p>`;
  }
  const s = stmt || l.stmts[0];
  return `<div class="stamp">SCANNED · STATEMENT</div>
    <div class="bank">${esc(bankBrand(l.bank.name).toUpperCase())}</div>
    <h2>Business checking · ${esc(s.m)}</h2>
    <table>
      <tr><th>Account holder</th><td>${esc(l.company)}</td></tr>
      <tr><th>Account number</th><td>${esc(l.bank.acct)}</td></tr>
      <tr><th>Total deposits</th><td class="end">${money(s.dep)}</td></tr>
      <tr><th>Ending balance</th><td class="end">${money(s.end)}</td></tr>
    </table>
    <p style="margin-top:22px;font-size:12px;line-height:1.55;color:#5C564C">This is a true copy of the ${esc(s.m)} statement on file. Deposits and ending balance as reported by ${esc(bankBrand(l.bank.name))}.</p>`;
}
