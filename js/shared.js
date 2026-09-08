/* Forge CRM — shared.js
   Core helpers used by EVERY page (Leads, Pipeline, Inbox, Scanner, Underwriting, Messages).
   This is the single authoritative copy of each function below — do not redefine
   any of these in a page-specific or desk-*.js file. */

const $ = (id) => document.getElementById(id);

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&"+"amp;","<":"&"+"lt;",">":"&"+"gt;",'"':"&"+"quot;","'":"&#39;"}[c]));

const money = (n) => n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US");

const params = () => new URLSearchParams(location.search);

function bankBrand(name) {
  const n = String(name || "").toLowerCase();
  if (n.includes("wells")) return "Wells Fargo";
  if (n.includes("america") || n.includes("bofa") || /\bboa\b/.test(n)) return "Bank of America";
  return "Chase";
}

function bankMark(name) {
  const n = String(name).toLowerCase();
  if (n.includes("chase")) return "CH";
  if (n.includes("td")) return "TD";
  if (n.includes("wells")) return "WF";
  if (n.includes("pnc")) return "PNC";
  if (n.includes("america")) return "BA";
  if (n.includes("mercury")) return "ME";
  if (n.includes("m&t")) return "MT";
  return initials(name);
}

function displayName(n) { return String(n).replace(/^Dr\.\s+/i, ""); }

function hue(str) {
  const pal = {ns:"#2B6E72",hl:"#9A5628",bd:"#8A7020",ro:"#4E6230",lu:"#2E6A48",mw:"#7A3E50",kp:"#3A5480",ap:"#8A3A32"};
  const rest = ["#5C5348","#2B6E72","#9A5628","#8A7020","#4E6230","#2E6A48","#7A3E50","#3A5480","#8A3A32"];
  const s = String(str || "");
  if (typeof LEADS !== "undefined") {
    const l = LEADS.find(x => x.id===s || x.company===s || x.contact===s || displayName(x.contact)===s);
    if (l && pal[l.id]) return pal[l.id];
  }
  let h = 0; for (const c of s) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return rest[h % rest.length];
}

function initials(n) {
  return displayName(n).split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

/* Full icon set. chevU/chevD (up/down chevrons) are used by the file-viewer's
   page-turn controls in desk-viewer.js. */
function ico(name, s=16) {
  const p = {
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.2-1.2a2 2 0 0 1 2.1-.4c.8.2 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"/>',
    mail: '<path d="M4 4h16v16H4z"/><path d="m4 4 8 9 8-9"/>',
    sms: '<path d="M4 4h16v12H7l-3 4V4z"/>',
    wa: '<path d="M12 3a8 8 0 0 0-6.9 12.1L4 21l6-1.1A8 8 0 1 0 12 3z"/><path d="M9.2 9.6c.2-.5.3-.5.6-.5h.5c.2 0 .3.1.4.4l.6 1.5c.1.2 0 .4-.1.5l-.4.4c-.1.1-.1.3 0 .4.3.5.8 1 1.3 1.3.2.1.3.1.4 0l.4-.4c.2-.2.4-.2.5-.1l1.5.6c.2.1.4.2.4.4v.5c0 .2 0 .4-.5.6A6 6 0 0 1 9.2 9.6z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    spk: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    send: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    chevL: '<path d="M15 6l-6 6 6 6"/>',
    chevR: '<path d="M9 6l6 6-6 6"/>',
    chevU: '<path d="M6 15l6-6 6 6"/>',
    chevD: '<path d="M6 9l6 6 6-6"/>',
    minus: '<path d="M5 12h14"/>',
    doc: '<path d="M7 3h8l5 5v13H7z"/><path d="M15 3v5h5"/>',
    mailAll: '<path d="M2 8h13v9H2z"/><path d="m2 8 6.5 5L15 8"/><path d="M9 5h13v9" opacity=".45"/><path d="m9 5 6.5 5L22 5" opacity=".45"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>',
    hold: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    transfer: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>'
  };
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${p[name]||""}</svg>`;
}

function toast(msg) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

/* Statement pages default to 6 when not explicitly set on the data record —
   applied consistently everywhere accountsOf() is used. */
function accountsOf(l) {
  const raw = l.accounts || [{name: l.bank.name, acct: l.bank.acct, stmts: (l.stmts || []).map(s => ({...s, pages: s.pages || 6}))}];
  return raw.slice(0, 1).map(a => ({...a, name: bankBrand(a.name), stmts: (a.stmts || []).map(s => ({...s, pages: s.pages || 6}))}));
}

function monthKey(label) {
  return String(label || "").split(" ")[0];
}

function nsfFor(l, monthLabel) {
  const idx = {September:0,October:1,November:2,December:3,January:4,February:5,March:6,April:7,May:8,June:9,July:10,August:11}[monthKey(monthLabel)];
  if (idx == null) return 0;
  return (l.nsf && l.nsf[idx]) || 0;
}

function stageOf(l) {
  const blob = [l.analysis, l.pitch, (l.activity||[]).map(a => a.what).join(" "), (l.notes||[]).map(n => n.txt).join(" ")].join(" ");
  if (/funded/i.test(blob) && /already funded|performing|wire landed|first ach/i.test(blob)) return "funded";
  if (/approv/i.test(blob)) return "approved";
  if (l.offer) return "terms";
  if ((l.calls || []).length) return "review";
  return "new";
}

const STAGES = [
  {id:"new", lab:"New"},
  {id:"review", lab:"Review"},
  {id:"terms", lab:"Term sheet"},
  {id:"approved", lab:"Approved"},
  {id:"funded", lab:"Funded"}
];

function allStmts() {
  const rows = [];
  for (const l of LEADS) {
    accountsOf(l).forEach((a, ai) => {
      (a.stmts || []).forEach((s, si) => {
        rows.push({
          id: `${l.id}-${a.acct}-${si}`,
          lead: l, acct: a, stmt: s, ai, si,
          nsf: nsfFor(l, s.m),
          pages: s.pages || 6
        });
      });
    });
  }
  return rows;
}

function lastSms(l) {
  const list = l.sms || [];
  return list[list.length - 1] || null;
}

function unreadOf(l) {
  const last = lastSms(l);
  return last && last.dir === "in" ? 1 : 0;
}
