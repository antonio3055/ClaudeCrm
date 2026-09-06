/* Forge CRM — desk-rail.js (Leads desk only)
   Bank-statement paper rendering, lead filtering/search, and the left rail.
   fitLetterZoom() is defined once, in desk-viewer.js — not here. */

function stmtPaper(l, ai, si, page) {
  const a = accountsOf(l)[ai];
  const s = a.stmts[si];
  const pages = s.pages || 6;
  const p = Math.max(0, Math.min(pages - 1, page|0));
  const brand = bankBrand(a.name).toUpperCase();
  const names = ["ACH CREDIT · SETTLEMENT","CARD SETTLEMENT","WIRE IN","ACH CREDIT · BATCH","COUNTER CREDIT","ACH DEBIT · VENDOR","PAYROLL ACH","RENT DRAFT","UTILITIES","SYSCO FOODS","AMEX SETTLEMENT","DEPOSIT"];
  const rows = Array.from({length: p === 0 ? 14 : 16}, (_, i) => {
    const day = 1 + ((p * 14 + i) % 28);
    const amt = Math.round((s.dep / (pages * 12)) * (0.65 + ((i * 3 + p) % 6) * 0.11));
    const nm = names[(i + p * 3) % names.length];
    const credit = !/debit|payroll|rent|util/i.test(nm);
    return `<tr><td>${esc(monthShort(s.m).slice(0,3))} ${day}</td><td>${nm}</td><td class="end">${credit ? money(amt) : "−" + money(amt).replace("−","")}</td></tr>`;
  }).join("");
  if (p === 0) {
    return `<div class="stamp">MEMBER FDIC · ${p+1}/${pages}</div>
      <div class="bank">${esc(brand)}</div>
      <div class="stmt-sub">Business checking statement</div>
      <h2>${esc(s.m)} 20${/\d{4}/.test(s.m) ? "" : "26"}</h2>
      <table>
        <tr><th>Account holder</th><td>${esc(l.company)}</td></tr>
        <tr><th>Account number</th><td class="end">${esc(a.acct)}</td></tr>
        <tr><th>Beginning balance</th><td class="end">${money(Math.round(s.end * 0.86))}</td></tr>
        <tr><th>Total deposits / credits</th><td class="end">${money(s.dep)}</td></tr>
        <tr><th>Total withdrawals / debits</th><td class="end">−${money(Math.round(s.dep * 0.92))}</td></tr>
        <tr><th>Ending balance</th><td class="end">${money(s.end)}</td></tr>
      </table>
      <h2 style="margin-top:22px;font-size:13px">Account activity</h2>
      <table>
        <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
        ${rows}
      </table>
      <p style="margin-top:18px;font-size:11px;color:#5C564C">Page 1 of ${pages}. Continued on next page. ${esc(brand)} N.A. Member FDIC.</p>`;
  }
  return `<div class="stamp">MEMBER FDIC · ${p+1}/${pages}</div>
    <div class="bank">${esc(brand)}</div>
    <h2>Account activity · ${esc(monthShort(s.m))} · p. ${p+1}</h2>
    <table>
      <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
      ${rows}
    </table>
    <p style="margin-top:18px;font-size:11px;color:#5C564C">${p+1 === pages ? "End of statement." : "Continued."} Account ${esc(a.acct)}.</p>`;
}
function fmtElapsed(s) {
  const m = Math.floor(s / 60), r = s % 60;
  return String(m).padStart(2,"0") + ":" + String(r).padStart(2,"0");
}
function filtered() {
  let list = LEADS.slice();
  if (state.filter === "mine") list = list.filter(l => l.rep === "Cole Brennan");
  if (state.filter === "star") list = list.filter(l => state.fav.has(l.id));
  if (state.filter === "today") list = list.filter(l => state.follow[l.id] === "2026-09-05");
  const q = state.query.trim().toLowerCase();
  if (q) list = list.filter(l => (l.company + l.contact + l.mobiles.map(p=>p.n).join(" ") + l.emails.map(e=>e.n).join(" ")).toLowerCase().includes(q));
  return list;
}
function qactPhone(n, who, sms, wa) {
  return `<div class="qacts">
    <button title="Call" data-act="call" data-n="${esc(n)}" data-who="${esc(who)}">${ico("phone",15)}</button>
    ${sms ? `<button title="SMS" data-act="sms" data-n="${esc(n)}">${ico("sms",15)}</button>` : ""}
    ${wa ? `<button title="WhatsApp" data-act="wa" data-n="${esc(n)}">${ico("wa",15)}</button>` : ""}
  </div>`;
}
function applyWidths() {
  const r = storeGet(LS.rail);
  const d = storeGet(LS.dock);
  if (window.setPaneWidths) window.setPaneWidths(r ? +r : 480, d ? +d : 430);
  else {
    document.documentElement.style.setProperty("--rail-w", (r ? +r : 480) + "px");
    document.documentElement.style.setProperty("--dock-w", (d ? +d : 430) + "px");
  }
}
function sizeApp() {
  if (window.deskView) window.deskView.relayout();
}
function placePad() {
  const pop = $("padPop");
  const bar = $("dialer");
  if (!pop || !bar) return;
  if (!state.keypadOpen) { pop.classList.remove("open"); return; }
  const r = bar.getBoundingClientRect();
  pop.style.left = Math.max(8, r.right - 244) + "px";
  pop.style.top = Math.max(8, r.top - 12 - 214) + "px";
  pop.classList.add("open");
  pop.innerHTML = `<div class="pad">${[["1",""],["2","ABC"],["3","DEF"],["4","GHI"],["5","JKL"],["6","MNO"],["7","PQRS"],["8","TUV"],["9","WXYZ"],["*",""],["0","+"],["#",""]].map(([n,l]) =>
    `<button data-act="dtmf" data-k="${n}">${n}${l?`<small>${l}</small>`:""}</button>`).join("")}</div>`;
}

function renderRail() {
  const list = filtered();
  const qEl = $("railQ");
  const keep = qEl && document.activeElement === qEl ? qEl.selectionStart : null;
  const qVal = state.query || "";
  $("rail").innerHTML = `
    <div class="rail-head">
      <h2>Leads <span class="dim">${list.length}</span></h2>
      <div class="rail-search">
        <button type="button" class="icon-btn" data-act="rail-search" title="Search leads" aria-label="Search leads">${ico("search",16)}</button>
      </div>
      ${state.railSearchOpen ? `<div class="rail-drop" id="railDrop"><input id="railQ" type="search" placeholder="Search leads…" value="${esc(qVal)}" autocomplete="off" /></div>` : ""}
    </div>
    <div class="filters">
      ${[["all","All"],["mine","Mine"],["star","Starred"],["today","Due today"]].map(([k,l]) =>
        `<button class="chip ${state.filter===k?"on":""}" data-act="filter" data-k="${k}">${l}</button>`).join("")}
    </div>
    <div class="lead-list pane">
      ${list.map((l,i) => `
        <button class="lead-row ${l.id===state.selected?"on":""}" data-act="select" data-id="${l.id}">
          <span class="idx">${i+1}</span>
          <span class="av" style="background:${hue(l.company)}">${esc(initials(l.contact))}</span>
          <span>
            <div class="co">${esc(l.company)}</div>
            <div class="nm">${esc(displayName(l.contact))}</div>
          </span>
          <span class="right">
            <span class="amt">${money(roundRev(l.avg))}</span>
            <span class="ago">${esc(l.lastAgo)}</span>
          </span>
        </button>`).join("") || `<div class="empty">No leads match.</div>`}
    </div>`;
  const nq = $("railQ");
  if (nq && (keep != null || state.railSearchOpen)) {
    if (keep != null) { nq.focus(); nq.setSelectionRange(keep, keep); }
  }
  const top = $("q");
  if (top && top !== document.activeElement) top.value = qVal;
}
