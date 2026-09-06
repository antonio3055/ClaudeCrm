(function () {
  const all = allStmts();
  const p = params();
  let sel = all.find(r => r.lead.id === p.get("lead") && (!p.get("acct") || r.acct.acct === p.get("acct")) && (p.get("si") == null || String(r.si) === p.get("si")))
    || all.find(r => r.lead.id === p.get("lead"))
    || all[0];
  let q = "";

  function list() {
    const qq = q.trim().toLowerCase();
    return all.filter(r => {
      if (!qq) return true;
      const hay = [r.acct.name, r.lead.company, r.lead.dba, r.stmt.m, r.acct.acct].join(" ").toLowerCase();
      return hay.includes(qq);
    });
  }

  function renderList() {
    $("fileList").innerHTML = list().map(r => `
      <button type="button" class="file-row ${r.id === sel.id ? "on" : ""}" data-id="${esc(r.id)}">
        <div class="mark" style="background:${hue(r.acct.name)}">${esc(bankMark(r.acct.name))}</div>
        <div>
          <div class="t">${esc(r.lead.dba)}</div>
          <div class="s">${esc(r.acct.name)} · ${esc(r.stmt.m)}</div>
        </div>
        <div class="pg">${r.pages}p</div>
      </button>`).join("");
    $("fileCount").textContent = list().length + " files";
  }

  function renderDesk() {
    const r = sel;
    const l = r.lead;
    const s = r.stmt;
    const wd = Math.round(s.dep * 0.86);
    const net = s.dep - wd;
    const trueRev = Math.round(s.dep * 0.97);
    const mca = (l.mca || []).map(m =>
      `<div class="flag"><span class="k">${esc(m.who)} · ${esc(m.pos)}</span><b>${money(m.daily)}/${esc(m.cad.split(" ")[0].toLowerCase())} · rem ${money(m.rem)}</b></div>`
    ).join("") || `<div class="flag"><span class="k">None on file</span><b>Clear 1st</b></div>`;
    const rec = (l.expenses || []).map(e =>
      `<div class="flag"><span class="k">${esc(e[0])} · ${esc(e[2])}</span><b>${money(e[1])}</b></div>`
    ).join("");
    $("uwBar").innerHTML = `
      <div>
        <h1>${esc(l.company)}</h1>
        <div class="sub">${esc(r.acct.name)} · •••• ${esc(String(r.acct.acct).slice(-4))} · ${esc(s.m)}</div>
      </div>
      <a href="scanner.html">Open in scanner</a>`;
    $("uwBody").innerHTML = `
      <div class="kpi-row">
        <div class="kpi"><div class="k">NSF</div><div class="v ${r.nsf ? "bad" : "ok"}">${r.nsf}</div></div>
        <div class="kpi"><div class="k">Average daily balance</div><div class="v">${money(l.bank.adb)}</div></div>
        <div class="kpi"><div class="k">Est. true revenue</div><div class="v">${money(trueRev)}</div></div>
      </div>
      <div class="kpi-row">
        <div class="kpi"><div class="k">Deposits</div><div class="v">${money(s.dep)}</div></div>
        <div class="kpi"><div class="k">Withdrawals</div><div class="v">${money(wd)}</div></div>
        <div class="kpi"><div class="k">Net</div><div class="v">${money(net)}</div></div>
      </div>
      <div class="two">
        <div class="block">
          <h3>MCA / obligations</h3>
          ${mca}
        </div>
        <div class="block">
          <h3>Activity flags</h3>
          <div class="flag"><span class="k">NSF this month</span><b>${r.nsf}</b></div>
          <div class="flag"><span class="k">Ending vs ADB</span><b>${money(s.end)} / ${money(l.bank.adb)}</b></div>
          <div class="flag"><span class="k">Position</span><b>${esc(l.pos)}</b></div>
          <div class="flag"><span class="k">Ask</span><b>${money(l.ask)}</b></div>
        </div>
      </div>
      <div class="block">
        <h3>Recurring pressure</h3>
        ${rec}
      </div>
      <div class="block">
        <h3>Underwriter note</h3>
        <p class="pitch">${esc(l.analysis)}</p>
      </div>
      <div class="block">
        <h3>Rep pitch</h3>
        <p class="pitch">${esc(l.pitch)}</p>
        <p class="s" style="margin-top:10px;color:var(--muted)">Use of funds · ${esc(l.use)} · <a href="index.html?lead=${esc(l.id)}">Open lead</a></p>
      </div>`;
  }

  function render() { renderList(); renderDesk(); }

  $("fileList").addEventListener("click", e => {
    const b = e.target.closest("[data-id]");
    if (!b) return;
    sel = all.find(r => r.id === b.dataset.id) || sel;
    history.replaceState(null, "", `underwriting.html?lead=${sel.lead.id}&acct=${sel.acct.acct}&si=${sel.si}`);
    render();
  });
  $("fileQ").addEventListener("input", e => { q = e.target.value; renderList(); });
  render();
})();
