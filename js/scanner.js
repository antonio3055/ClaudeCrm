(function () {
  const MONTHS = ["All", "August", "July", "June", "May", "April"];
  let filter = "All";
  let q = "";

  function rows() {
    const qq = q.trim().toLowerCase();
    return allStmts().filter(r => {
      if (filter !== "All" && !String(r.stmt.m).startsWith(filter)) return false;
      if (!qq) return true;
      const hay = [r.acct.name, r.acct.acct, r.lead.company, r.lead.dba, r.stmt.m].join(" ").toLowerCase();
      return hay.includes(qq);
    });
  }

  function render() {
    const list = rows();
    const all = allStmts();
    const accts = new Set(all.map(r => r.acct.acct)).size;
    $("scanMeta").innerHTML = `<b>${list.length}</b> statements · <b>${accts}</b> accounts`;
    $("chips").innerHTML = MONTHS.map(m =>
      `<button type="button" data-m="${m}" class="${m === filter ? "on" : ""}">${m}</button>`
    ).join("");
    $("grid").innerHTML = list.map(r => {
      const nsfCls = r.nsf ? "bad" : "";
      return `<a class="scan-card" href="underwriting.html?lead=${esc(r.lead.id)}&acct=${esc(r.acct.acct)}&si=${r.si}">
        <div class="top">
          <div class="mark" style="background:${hue(r.acct.name)}">${esc(bankMark(r.acct.name))}</div>
          <div class="who">
            <div class="bank">${esc(r.acct.name)}</div>
            <div class="acct">•••• ${esc(String(r.acct.acct).slice(-4))} · ${esc(r.lead.dba)}</div>
          </div>
          <div class="pg">${r.pages} pages</div>
        </div>
        <div class="mo">${esc(r.stmt.m)}</div>
        <div class="figs">
          <div class="fig"><div class="k">Deposits</div><div class="v">${money(r.stmt.dep)}</div></div>
          <div class="fig"><div class="k">Ending</div><div class="v">${money(r.stmt.end)}</div></div>
        </div>
        <div class="nsf ${nsfCls}">NSF ${r.nsf}</div>
      </a>`;
    }).join("") || `<div class="empty">No statements in this filter.</div>`;
  }

  $("chips").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    filter = b.dataset.m;
    render();
  });
  $("scanQ").addEventListener("input", e => { q = e.target.value; render(); });
  $("newScan").addEventListener("click", () => toast("Drop PDFs on a live file — ingest is mock in this desk."));
  render();
})();
