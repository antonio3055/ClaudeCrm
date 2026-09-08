/* Forge CRM — desk-comms.js (Leads desk only)
   Message threads, call log, email, and the dialer for the comms dock. */

function bubbleCls(m) {
  if (m.dir !== "out") return "in";
  const ch = state.commsTab === "msg" ? (state.threadCh || m.ch || "sms") : (m.ch || "sms");
  return ch === "wa" ? "out wa" : "out";
}
function commThreads(l) {
  const map = new Map();
  (l.sms || []).forEach(m => {
    const n = m.n || (l.mobiles[0] && l.mobiles[0].n) || "";
    const ch = m.ch || "sms";
    const k = ch + "|" + n;
    const row = map.get(k);
    if (!row) map.set(k, { n, ch, last: m, count: 1 });
    else { row.last = m; row.count++; }
  });
  return [...map.values()];
}
function renderComms(l) {
  const tab = state.commsTab;
  const n = state.threadN || l.mobiles[0].n;
  if (tab === "msg") {
    const msgs = threadMsgs(l);
    const who = displayName(l.contact);
    const chLab = state.threadCh === "wa" ? "WhatsApp" : "iMessage";
    return `
      <div class="num-switch">
        ${l.mobiles.map(p => `<button class="${n===p.n?"on":""}" data-act="thread-n" data-n="${esc(p.n)}">${esc(p.n)}</button>`).join("")}
        <button class="${state.threadCh==="sms"?"on":""}" data-act="thread-ch" data-k="sms">iMessage</button>
        <button class="${state.threadCh==="wa"?"on":""}" data-act="thread-ch" data-k="wa">WhatsApp</button>
      </div>
      <div class="thread-who">${esc(who)} · ${esc(chLab)} · ${esc(n)}</div>
      <div class="thread">${msgs.map(m => `
        <div class="bubble ${bubbleCls(m)}">${esc(m.txt)}<div class="t">${esc(m.t)}</div></div>`).join("") || `<div class="empty">No ${chLab} on this number.</div>`}</div>
      <div class="composer">
        <textarea id="smsBox" placeholder="Message ${esc(n)}…"></textarea>
        <button class="btn primary" data-act="send-sms">${ico("send",14)}</button>
      </div>`;
  }
  if (tab === "all") {
    const threads = commThreads(l);
    return `<div class="convo-list">${threads.map(t => {
      const lab = t.ch === "wa" ? "WhatsApp" : "iMessage";
      return `<button type="button" class="convo-row" data-act="open-thread" data-n="${esc(t.n)}" data-ch="${esc(t.ch)}">
        <span class="pip ${t.ch==="wa"?"wa":"im"}"></span>
        <div class="convo-main">
          <div class="convo-top"><strong>${lab}</strong><span class="dim">${esc(t.last.t)}</span></div>
          <div class="convo-n">${esc(t.n)}</div>
          <div class="convo-prev">${esc(t.last.txt)}</div>
        </div>
      </button>`;
    }).join("") || `<div class="empty">No conversations.</div>`}</div>`;
  }
  if (tab === "mail") {
    return `${l.mails.map((m,i) => `<button class="mail" data-act="open-mail" data-i="${i}"><div class="sub">${esc(m.sub)}</div><div class="dim" style="margin-top:3px">${esc(m.from)} · ${esc(m.when)}</div><div class="pre">${esc(m.preview)}</div></button>`).join("") || `<div class="empty">No email.</div>`}
      <div style="padding:12px 16px"><button class="btn primary" data-act="compose">${ico("mail",14)} Compose</button></div>`;
  }
  if (tab === "calls") {
    return l.calls.map(c => `
      <div class="call-row">
        <div class="row-between"><strong>${c.dir==="in"?"Inbound":"Outbound"} · ${esc(c.who)}</strong><span class="num">${esc(c.dur)}</span></div>
        <div class="dim" style="margin-top:3px">${esc(c.when)} · ${esc(c.dev)} · ${esc(c.n)}</div>
        <p style="margin-top:6px">${esc(c.note)}</p>
        <button class="btn" style="margin-top:8px;height:28px" data-act="call" data-n="${esc(c.n)}" data-who="${esc(c.who)}">${ico("phone",14)} Call back</button>
      </div>`).join("") || `<div class="empty">No calls logged.</div>`;
  }
  return `<div style="padding:8px 16px 16px">
    <div class="cgroup"><h4>Mobile</h4>
    ${l.mobiles.map((p,i) => `<div class="line"><span class="lab">${i+1}</span><span class="val">${esc(p.n)}</span>${qactPhone(p.n, l.contact, true, true)}</div>`).join("")}</div>
    <div class="cgroup"><h4>Email</h4>
    ${l.emails.map(p => `<div class="line"><span class="lab"></span><span class="val">${esc(p.n)}</span><div class="qacts"><button data-act="email-one" data-n="${esc(p.n)}">${ico("mail",15)}</button></div></div>`).join("")}
    <button class="email-all" data-act="email-all">Email All</button></div>
    <div class="cgroup"><h4>Landline</h4>
    ${l.landlines.map((p,i) => `<div class="line"><span class="lab">${i+1}</span><span class="val">${esc(p.n)}</span>${qactPhone(p.n, l.contact, false, false)}</div>`).join("")}</div>
  </div>`;
}

function renderDialer(l, d) {
  const live = ["connected","dialing"].includes(d.status);
  const who = d.contact || displayName(l.contact);
  const num = d.number || l.mobiles[0].n;
  const st = d.status==="idle" ? "Ready" : d.onHold ? "On hold" : d.status==="dialing" ? "Calling" : "Connected";
  return `
    <div class="who">
      <div class="nm">${esc(who)}</div>
      <div class="sub">${esc(num)} · ${esc(device().name)}</div>
    </div>
    <div class="lcd">
      <div class="st">${st}${live ? " · " + fmtElapsed(d.elapsed) : ""}</div>
      <div id="timer">${esc(d.dtmf || num)}</div>
    </div>
    <div class="dacts">
      ${d.status==="idle" || d.status==="ended" ? `
        <button data-act="toggle-pad" class="${state.keypadOpen?"on":""}" title="Keypad">${ico("grid",14)}</button>
        <button class="callgo" data-act="call" data-n="${esc(num)}" data-who="${esc(who)}">Call</button>` : `
        <button data-act="mute" class="${d.muted?"on":""}" title="Mute">${ico("mic",14)}</button>
        <button data-act="spk" class="${d.speaker?"on":""}" title="Speaker">${ico("spk",14)}</button>
        <button data-act="hold" class="${d.onHold?"on":""}" title="Hold">${ico("hold",14)}</button>
        <button data-act="transfer" title="Transfer">${ico("transfer",14)}</button>
        <button data-act="toggle-pad" class="${state.keypadOpen?"on":""}" title="Keypad">${ico("grid",14)}</button>
        <button class="hang" data-act="hang">Hang up</button>`}
    </div>`;
}

function renderDialerBar() {
  const el = $("dialer");
  if (!el) return;
  el.innerHTML = renderDialer(lead(), state.dial);
  placePad();
}

function renderAll() {
  $("livePill").classList.toggle("show", ["connected","dialing"].includes(state.dial.status));
  paintBt();
  renderRail();
  renderDesk();
  renderDock();
  renderDialerBar();
  renderModal();
}

function openCompose(opts) {
  const l = lead();
  const emails = l.emails.map(e => e.n);
  state.modal = {
    type: "compose",
    to: opts.to || emails[0],
    cc: opts.cc || "",
    bcc: opts.bcc != null ? opts.bcc : (opts.all ? emails.slice(1).join(", ") : ""),
    subject: opts.subject || "",
    body: opts.body || `<div>Hi ${displayName(l.contact).split(" ")[0]},</div><div><br></div><div></div><div><br></div><div>Cole Brennan<br>Forge · Merchant desk<br>(212) 555-0140</div>`
  };
  renderModal();
}
