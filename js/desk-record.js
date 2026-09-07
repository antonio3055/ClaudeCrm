/* Forge CRM — desk-record.js (Leads desk only)
   Renders the selected lead's record: contact block, statements, files,
   activity feed, and the communications dock. */

function contactBlock(l) {
  const mobs = l.mobiles || [];
  const lands = l.landlines || [];
  const n = Math.max(mobs.length, lands.length);
  let html = "";
  for (let i = 0; i < n; i++) {
    const m = mobs[i];
    const d = lands[i];
    const left = m ? kv(m.l || "Mobile", esc(m.n), qactPhone(m.n, l.contact, true, true)) : "";
    const right = d ? kv(d.l || "Landline", esc(d.n), qactPhone(d.n, l.contact, false, false)) : "";
    html += pair(left, right);
  }
  const ems = l.emails || [];
  if (ems.length) {
    html += `<div class="email-head">
      <span>Email</span>
      <button type="button" class="mail-all-ico" data-act="email-all" title="Email all">${ico("mail",14)}</button>
    </div>`;
    ems.forEach(a => {
      html += `<div class="email-row">
        <span class="vt">${esc(a.n)}</span>
        <div class="qacts"><button title="Email" data-act="email-one" data-n="${esc(a.n)}">${ico("mail",15)}</button></div>
      </div>`;
    });
  }
  return html || `<div class="muted">No contact on file.</div>`;
}
function statementsBlock(l, opts) {
  const showHead = !opts || opts.head !== false;
  const accts = accountsOf(l).slice(0, 1);
  if (!accts.length) return `<div class="muted">No statements</div>`;
  return accts.map((a, ai) => {
    const months = (a.stmts || []).slice(0, 3);
    const rows = months.map((s, si) => {
      const lab = monthShort(s.m);
      const open = `type="button" class="stmt-cell" data-act="stmt" data-ai="${ai}" data-si="${si}" title="Open ${esc(lab)} statement"`;
      return `<div class="stmt-mo">${esc(lab)}</div>
        <button ${open}>${kv("Dep", money(s.dep))}</button>
        <button ${open}>${kv("Bal", money(s.end))}</button>`;
    }).join("");
    return `<div class="stmt-grid">
      ${showHead ? kv("Bank", esc(a.name)) + kv("Account", esc(a.acct)) : ""}
      ${rows}
    </div>`;
  }).join("");
}
function factsStrip(l) {
  const bits = [ownPct(l) + " owner", entityTag(l.entity), l.pos, l.tib].filter(Boolean);
  if (!bits.length) return "";
  return `<div class="facts-strip">${bits.map(b => `<span>${esc(b)}</span>`).join("")}</div>`;
}
function pdfMark(lab) {
  const t = esc(String(lab || "").slice(0, 3));
  return `<svg class="pdf-ico" viewBox="0 0 36 44" width="36" height="44" aria-hidden="true">
    <path d="M7 2h15l9 9v30a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#F7F6F3" stroke="#1A365D" stroke-width="1.4"/>
    <path d="M22 2v8a1 1 0 0 0 1 1h8" fill="#E8ECF0" stroke="#1A365D" stroke-width="1.4" stroke-linejoin="round"/>
    <rect x="6.5" y="23" width="23" height="12" rx="1.6" fill="#1A365D"/>
    <text x="18" y="31.6" text-anchor="middle" fill="#F7F6F3" font-size="7.2" font-weight="700" font-family="Inter,ui-sans-serif,system-ui,sans-serif" letter-spacing=".08em">${t}</text>
  </svg>`;
}
/* Files split by context: the Application file sits under Application,
   statement + MTD files sit under Bank Statements. Replaces the old single
   combined filesStrip(). */
function filesStripFor(l, want) {
  const monthN = {JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12};
  const items = (l.files || []).map((f, i) => ({ i, lab: fileShort(f) }))
    .filter(x => x.lab)
    .filter(x => want === "app" ? x.lab === "APP" : x.lab !== "APP");
  items.sort((a, b) => {
    const ra = a.lab === "MTD" ? -1 : (monthN[a.lab] != null ? 20 - monthN[a.lab] : 50);
    const rb = b.lab === "MTD" ? -1 : (monthN[b.lab] != null ? 20 - monthN[b.lab] : 50);
    return ra - rb;
  });
  if (!items.length) return "";
  return `<div class="files-row">${items.map(x =>
    `<button type="button" class="file-doc" data-act="file" data-i="${x.i}" title="${esc(x.lab)}">
      ${pdfMark(x.lab)}
    </button>`
  ).join("")}</div>`;
}

/* ---------------------------------------------------------------------
   Financials zone: Application, Bank Statements, Financial Summary.
   Grouped in one quiet gray band with a navy rail so the three read as
   one region, separate from identity (Owner & Business / Contact) and
   engagement (AI pitch / Notes / Activity) below it. */
function applicationBlock(l) {
  return `<div class="fz-section">
    <h3>Application</h3>
    <div class="fin-row">
      <div class="fin-item">${kv("Requested", money(l.ask))}</div>
      <div class="fin-item">${kv("Approved", money(l.offer))}</div>
    </div>
    ${filesStripFor(l, "app")}
  </div>`;
}
function mcaBlock(l) {
  const items = l.mca || [];
  if (!items.length) return `<div class="no-mca">No active MCA positions detected.</div>`;
  return items.map(m => {
    const dailyCad = /daily/i.test(m.cad || "");
    const weeklyCad = /weekly/i.test(m.cad || "");
    const burden = Math.round(m.daily * (dailyCad ? 21 : weeklyCad ? 4.33 : 30));
    return `<div class="mca-item">
      <div class="mca-top"><span>${esc(m.who)}</span><span class="mca-burden">${money(burden)}/mo</span></div>
      <div class="mca-bottom"><span>${money(m.daily)} · ${esc(m.cad)} · ${esc(m.pos)}</span><span>${money(m.rem)} remaining</span></div>
    </div>`;
  }).join("");
}
function bankStatementsBlock(l) {
  const a0 = accountsOf(l)[0] || {name:"—", acct:"—"};
  const endBal = l.bank.bal;
  const flow = l.flow;
  const mtdHtml = l.mtd ? `
    <div class="fin-sub">
      <div class="fin-sub-k">MTD</div>
      <div class="fin-row">
        <div class="fin-item">${kv("As of", esc(l.mtd.m))}</div>
        <div class="fin-item">${kv("Balance", money(l.mtd.bal))}</div>
      </div>
    </div>` : "";
  return `<div class="fz-section">
    <h3>Bank statements</h3>
    <div class="fin-row">
      <div class="fin-item">${kv("Bank", esc(a0.name))}</div>
      <div class="fin-item">${kv("Account", esc(a0.acct))}</div>
      <div class="fin-item">${kv("Avg monthly deposits", money(l.avg))}</div>
      <div class="fin-item">${kv("Ending balance", money(endBal))}</div>
      ${flow ? `<div class="fin-item">${kv("Daily cash flow", money(flow.in) + " in · " + money(flow.out) + " out")}</div>` : ""}
    </div>
    ${mtdHtml}
    <div class="fin-sub">
      <div class="fin-sub-k">MCA</div>
      ${mcaBlock(l)}
    </div>
    <div class="fin-sub">
      <div class="fin-sub-k">Most recent 3 months</div>
      ${statementsBlock(l, {head:false})}
      ${filesStripFor(l, "stmt")}
    </div>
  </div>`;
}
function financialSummaryBlock(l) {
  if (!l.analysis) return "";
  return `<div class="fz-section">
    <h3>Financial summary</h3>
    <p class="fin-summary">${esc(l.analysis)}</p>
  </div>`;
}
function ownerBusinessBlock(l) {
  const home = l.appAddress && l.appAddress !== l.address ? l.appAddress : l.address;
  return `<div class="section-plain">
    <h3>Owner &amp; business</h3>
    <div class="kv-grid">
      ${kv("Name", esc(displayName(l.contact)))}
      ${kv("Title", esc(l.title))}
      ${kv("SSN", esc(l.ssn))}
      ${kv("DOB", esc(l.dob))}
      ${kv("EIN", esc(l.ein))}
      ${kv("Industry", esc(l.industry))}
      ${kv("Time in business", esc(l.tib))}
      ${kv("Ownership", esc(ownPct(l)))}
    </div>
    <div class="kv-grid addr">
      ${kv("Home", esc(home))}
      ${kv("Office", esc(l.address))}
    </div>
  </div>`;
}
function pitchBlock(l) {
  if (!l.pitch) return "";
  return `<div class="pitch-block">
    <div class="k">AI sales pitch</div>
    <p class="pitch">${esc(l.pitch)}</p>
  </div>`;
}
function notesBlock(l) {
  const items = l.notes || [];
  const shown = items.slice(0, 2);
  return `<div class="section-plain">
    <div class="sp-head"><h3>Notes</h3><button type="button" class="act-more" data-act="history">View full history</button></div>
    ${shown.length ? shown.map(n => `<div class="note-row"><span class="note-meta">${esc(n.who)} · ${esc(n.when)}</span><p class="note-txt">${esc(n.txt)}</p></div>`).join("") : `<div class="muted">No notes yet.</div>`}
  </div>`;
}
function actKind(what) {
  const w = String(what || "").toLowerCase();
  if (/call/.test(w)) return {ico:"phone", verb:"Call"};
  if (/email|mail/.test(w)) return {ico:"mail", verb:"Email"};
  if (/whatsapp|\bwa\b/.test(w)) return {ico:"wa", verb:"Chat"};
  if (/sms|text/.test(w)) return {ico:"sms", verb:"SMS"};
  return {ico:"doc", verb:"Note"};
}
function actShort(what) {
  let s = String(what || "");
  s = s.replace(/^(SMS|Email|Call|WhatsApp|Mail)(\s+sent)?[^·]*·\s*/i, "");
  s = s.replace(/^to\s+[^·]+·\s*/i, "");
  const parts = s.split("·").map(x => x.trim()).filter(Boolean);
  if (parts.length > 2) s = parts.slice(0, 2).join(" · ");
  if (s.length > 48) s = s.slice(0, 46) + "…";
  return s;
}
function activityBlock(l) {
  const items = l.activity || [];
  const shown = state.actOpen ? items : items.slice(0, 2);
  const more = items.length - 2;
  return `<div class="section-plain">
      <div class="sp-head"><h3>Activity</h3><button type="button" class="act-more" data-act="history">View full history</button></div>
      ${shown.map(a => {
        const k = actKind(a.what);
        return `<div class="act-row">
          <span class="act-ico">${ico(k.ico, 14)}</span>
          <span class="act-verb">${k.verb}</span>
          <span class="act-txt">${esc(actShort(a.what))}</span>
          <span class="act-when">${esc(a.when)}</span>
        </div>`;
      }).join("")}
      ${more > 0 ? `<button type="button" class="act-more" data-act="act-toggle">${state.actOpen ? "▴ close" : "▾ " + more}</button>` : ""}
  </div>`;
}
function renderDesk() {
  const l = lead();
  const site = l.website ? `<a class="web" href="https://${esc(l.website)}" target="_blank" rel="noopener">${esc(l.website)}</a>` : "";
  $("desk").innerHTML = `
    <div class="desk-scroll">
      <div class="rec-head">
        <div class="rec-main">
          <div class="rec-title"><h1>${esc(l.company)}</h1></div>
          ${site}
        </div>
        <div class="money"><span class="k">Approved</span><span class="v">${money(l.offer)}</span></div>
      </div>
      ${factsStrip(l)}
      <div class="fin-zone">
        ${applicationBlock(l)}
        ${bankStatementsBlock(l)}
        ${financialSummaryBlock(l)}
      </div>
      ${ownerBusinessBlock(l)}
      <div class="section-plain">
        <h3>Contact</h3>
        ${contactBlock(l)}
      </div>
      <div class="section-plain">
        ${pitchBlock(l)}
      </div>
      ${notesBlock(l)}
      ${activityBlock(l)}
    </div>`;
}

function renderDock() {
  const l = lead();
  const unread = l.sms.filter(m => m.dir === "in").length ? 1 : 0;
  if (!state.threadN) state.threadN = l.mobiles[0].n;
  $("dock").innerHTML = `
    <div class="dock-head"><h2>Communications</h2><span class="dim" style="margin-left:auto">${esc(displayName(l.contact))}</span></div>
    <div class="dock-tabs">
      ${[["all","All"],["msg","Messages"],["calls","Call log"],["people","Contacts"],["mail","Email"]].map(([k,lab]) =>
        `<button class="${state.commsTab===k?"on":""}" data-act="comms-tab" data-k="${k}">${lab}${k==="msg" && unread ? ` <span class="unread">${unread}</span>` : ""}</button>`).join("")}
    </div>
    <div class="dock-body" id="commsBody">${renderComms(l)}</div>
    <div class="dialer" id="dialer">${renderDialer(l, state.dial)}</div>`;
  placePad();
}

function threadMsgs(l) {
  const n = state.threadN || l.mobiles[0].n;
  const ch = state.threadCh || "sms";
  return l.sms.filter(m => (m.n || l.mobiles[0].n) === n && (m.ch || "sms") === ch);
}
