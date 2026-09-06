(function () {
  const p = params();
  let sel = LEADS.find(l => l.id === p.get("lead")) || LEADS.find(l => (l.sms || []).length) || LEADS[0];
  let threadCh = "sms";
  let threadN = (sel.mobiles && sel.mobiles[0] && sel.mobiles[0].n) || "";
  let q = "";

  function lastOf(l, n, ch) {
    const msgs = (l.sms || []).filter(m => (m.n || (l.mobiles[0] && l.mobiles[0].n) || "") === n && (m.ch || "sms") === ch);
    return msgs[msgs.length - 1];
  }

  function convos() {
    const qq = q.trim().toLowerCase();
    const rows = [];
    for (const l of LEADS) {
      const seen = new Set();
      (l.sms || []).forEach(m => {
        const n = m.n || (l.mobiles[0] && l.mobiles[0].n) || "";
        const ch = m.ch || "sms";
        const k = l.id + "|" + ch + "|" + n;
        if (seen.has(k)) return;
        seen.add(k);
        const last = lastOf(l, n, ch);
        const hay = [l.company, l.contact, l.dba, n, ch, last && last.txt].join(" ").toLowerCase();
        if (qq && !hay.includes(qq)) return;
        rows.push({ l, n, ch, last });
      });
    }
    return rows;
  }

  function renderList() {
    const rows = convos();
    $("convoList").innerHTML = rows.map(r => {
      const on = r.l.id === sel.id && r.n === threadN && r.ch === threadCh;
      const lab = r.ch === "wa" ? "WhatsApp" : "iMessage";
      return `<button type="button" class="convo ${on ? "on" : ""}" data-id="${esc(r.l.id)}" data-n="${esc(r.n)}" data-ch="${esc(r.ch)}">
        <div class="av" style="background:${hue(r.l.contact)}">${esc(initials(r.l.contact))}</div>
        <div>
          <div class="t">${esc(displayName(r.l.contact))} · ${lab}</div>
          <div class="s">${esc(r.last ? r.last.txt : r.n)}</div>
        </div>
        <div class="when">${esc(r.last ? r.last.t : r.l.lastAgo)}</div>
      </button>`;
    }).join("") || `<div class="empty">No threads.</div>`;
  }

  function threadMsgs() {
    return (sel.sms || []).filter(m => {
      const n = m.n || (sel.mobiles[0] && sel.mobiles[0].n) || "";
      const ch = m.ch || "sms";
      return n === threadN && ch === threadCh;
    });
  }

  function bubbleCls(m) {
    if (m.dir !== "out") return "in";
    return threadCh === "wa" ? "out wa" : "out";
  }

  function renderThread() {
    const l = sel;
    const lab = threadCh === "wa" ? "WhatsApp" : "iMessage";
    $("threadHead").innerHTML = `
      <div>
        <h1>${esc(displayName(l.contact))}</h1>
        <div class="sub">${esc(l.company)} · ${esc(lab)} · ${esc(threadN)}</div>
      </div>
      <a class="btn" href="index.html?lead=${esc(l.id)}">Lead</a>`;
    const msgs = threadMsgs();
    $("thread").innerHTML = msgs.map(m =>
      `<div class="bubble ${bubbleCls(m)}">${esc(m.txt)}<div class="t">${esc(m.t)}</div></div>`
    ).join("") || `<div class="empty">No ${lab} on this number.</div>`;
    $("thread").scrollTop = $("thread").scrollHeight;
  }

  function render() { renderList(); renderThread(); }

  $("convoList").addEventListener("click", e => {
    const b = e.target.closest("[data-id]");
    if (!b) return;
    sel = LEADS.find(l => l.id === b.dataset.id) || sel;
    threadN = b.dataset.n;
    threadCh = b.dataset.ch || "sms";
    history.replaceState(null, "", `messages.html?lead=${sel.id}`);
    render();
  });
  $("msgQ").addEventListener("input", e => { q = e.target.value; renderList(); });
  $("send").addEventListener("click", send);
  $("draft").addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  function send() {
    const t = $("draft").value.trim();
    if (!t) return;
    sel.sms = sel.sms || [];
    sel.sms.push({dir:"out", ch: threadCh || "sms", n: threadN, t:"Just now", txt:t});
    $("draft").value = "";
    render();
    toast("Sent");
  }
  const first = convos()[0];
  if (first) { sel = first.l; threadN = first.n; threadCh = first.ch; }
  render();
})();
