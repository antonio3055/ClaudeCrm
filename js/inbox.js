(function () {
  let tab = "all";
  let sel = null;
  let q = "";

  function events() {
    const out = [];
    for (const l of LEADS) {
      (l.sms || []).forEach(m => out.push({kind:"msg", l, when:m.t, title: displayName(l.contact), preview:m.txt, ch:m.ch, dir:m.dir, raw:m}));
      (l.calls || []).forEach(c => out.push({kind:"call", l, when:c.when, title:c.who, preview:`${c.dir === "in" ? "Inbound" : "Outbound"} · ${c.dur} · ${c.dev}`, raw:c}));
      (l.mails || []).forEach(e => out.push({kind:"mail", l, when:e.when, title:e.sub, preview:e.preview, raw:e}));
    }
    const qq = q.trim().toLowerCase();
    return out.filter(e => {
      if (tab === "msg" && e.kind !== "msg") return false;
      if (tab === "calls" && e.kind !== "call") return false;
      if (tab === "mail" && e.kind !== "mail") return false;
      if (!qq) return true;
      return [e.title, e.preview, e.l.company].join(" ").toLowerCase().includes(qq);
    });
  }

  function renderList() {
    const list = events();
    if (!sel || !list.some(e => e === sel)) sel = list[0] || null;
    $("feed").innerHTML = list.map((e, i) => `
      <button type="button" class="feed-row ${sel === e ? "on" : ""}" data-i="${i}">
        <div class="av" style="background:${hue(e.l.contact)}">${esc(initials(e.l.contact))}</div>
        <div>
          <div class="t">${esc(e.title)}</div>
          <div class="s">${esc(e.l.dba)} · ${esc(e.preview)}</div>
        </div>
        <div class="when">${esc(e.when)}</div>
      </button>`).join("") || `<div class="empty">Nothing in this inbox.</div>`;
  }

  function renderDesk() {
    const e = sel;
    if (!e) { $("detail").innerHTML = `<div class="empty">Select a conversation.</div>`; return; }
    const l = e.l;
    let body = "";
    if (e.kind === "msg") {
      body = (l.sms || []).filter(m => (m.ch || "sms") === (e.ch || "sms") && (m.n || "") === (e.raw.n || m.n || "")).map(m => {
        const dir = m.dir === "out" ? "out" : "in";
        const col = dir === "out" ? ((e.ch || m.ch) === "wa" ? "out wa" : "out") : "in";
        return `<div class="bubble ${col}">${esc(m.txt)}<div style="font-size:11px;opacity:.65;margin-top:4px">${esc(m.t)}</div></div>`;
      }).join("");
    } else if (e.kind === "call") {
      const c = e.raw;
      body = `<div class="block"><h3>${esc(c.dir === "in" ? "Inbound call" : "Outbound call")}</h3>
        <div class="flag"><span class="k">With</span><b>${esc(c.who)}</b></div>
        <div class="flag"><span class="k">Number</span><b>${esc(c.n)}</b></div>
        <div class="flag"><span class="k">Device</span><b>${esc(c.dev)}</b></div>
        <div class="flag"><span class="k">Duration</span><b>${esc(c.dur)}</b></div>
        <p class="pitch" style="margin-top:12px">${esc(c.note || "")}</p></div>`;
    } else {
      const m = e.raw;
      body = `<div class="block"><h3>${esc(m.sub)}</h3>
        <div class="flag"><span class="k">From</span><b>${esc(m.from)}</b></div>
        <div class="flag"><span class="k">To</span><b>${esc(m.to)}</b></div>
        <div class="flag"><span class="k">When</span><b>${esc(m.when)}</b></div>
        <p class="pitch" style="margin-top:12px">${esc(m.preview)}</p></div>`;
    }
    $("detail").innerHTML = `
      <div class="thread-head">
        <div>
          <h1>${esc(e.title)}</h1>
          <div class="sub">${esc(l.company)} · ${esc(e.kind === "msg" ? "Messages" : e.kind === "call" ? "Call log" : "Email")}</div>
        </div>
        <a class="btn" href="index.html?lead=${esc(l.id)}">Lead</a>
      </div>
      <div class="thread-wrap">${body}</div>`;
  }

  function render() { renderList(); renderDesk(); }

  $("tabs").addEventListener("click", e => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    tab = b.dataset.tab;
    sel = null;
    [...$("tabs").querySelectorAll("button")].forEach(x => x.classList.toggle("on", x === b));
    render();
  });
  $("feed").addEventListener("click", e => {
    const b = e.target.closest("[data-i]");
    if (!b) return;
    sel = events()[+b.dataset.i];
    render();
  });
  $("inboxQ").addEventListener("input", e => { q = e.target.value; sel = null; render(); });
  render();
})();
