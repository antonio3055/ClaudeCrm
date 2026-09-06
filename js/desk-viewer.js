/* Forge CRM — desk-viewer.js (Leads desk only)
   The file/statement lightbox viewer, all modals (compose, devices, history,
   mail-read), and the dialer's call lifecycle.

   NOTE ON HISTORY: this file used to be split across app4.js (original lightbox,
   left/right arrows) and viewer.js (a later redesign, up/down arrows + a
   runtime patch of ico() to add chevU/chevD). Because viewer.js loaded last,
   its versions of fitLetterZoom() and lightboxShell() silently won every time —
   the app4.js versions never ran. That's consolidated here into one canonical
   implementation: the up/down-arrow design, since that's what was actually
   live. chevU/chevD are now regular entries in shared.js's ico() set instead
   of a runtime patch. */

function fitLetterZoom() {
  const vv = window.visualViewport;
  const w = (vv && vv.width) || window.innerWidth || 1200;
  const h = (vv && vv.height) || window.innerHeight || 800;
  const z = Math.min((w - 88) / 816, (h - 96) / 1056);
  return Math.max(0.18, +z.toFixed(3));
}

function bumpZoom(dir) {
  const fit = fitLetterZoom();
  const cur = state.fileZoom || fit;
  const next = cur * (dir > 0 ? 1.14 : 1 / 1.14);
  state.fileZoom = +Math.min(fit * 2.2, Math.max(fit * 0.92, next)).toFixed(3);
}

function lightboxShell(letterHtml, spec) {
  const z = state.fileZoom || fitLetterZoom();
  const pages = spec.pages || 1;
  const page = spec.page || 0;
  return `
    <div class="lb-cluster">
      <div class="lb-page">
        <div class="letter-wrap" style="width:${816 * z}px;height:${1056 * z}px">
          <div class="letter" style="transform:scale(${z})">${letterHtml}</div>
        </div>
      </div>
      <div class="lb-nav">
        <button type="button" class="lb-arrow" data-act="file-prev" title="Previous page">${ico("chevU",18)}</button>
        <button type="button" class="lb-arrow" data-act="file-next" title="Next page">${ico("chevD",18)}</button>
      </div>
      <div class="lb-pg">${page + 1} / ${pages}</div>
      <div class="lb-zoom">
        <button type="button" data-act="file-zoom" data-d="1" title="Zoom in">${ico("plus",16)}</button>
        <button type="button" data-act="file-zoom" data-d="-1" title="Zoom out">${ico("minus",16)}</button>
      </div>
    </div>`;
}

function fileKind(l, i) {
  const lab = fileShort(l.files[i] || {});
  if (lab === "APP") return {kind:"app", pages:1, page:0};
  if (lab === "MTD") return {kind:"mtd", pages:2, page:0};
  const a = accountsOf(l)[0];
  const si = (a.stmts || []).findIndex(s => monthShort(s.m).toUpperCase().slice(0, 3) === lab);
  if (si >= 0) return {kind:"stmt", ai:0, si, pages: a.stmts[si].pages || 6, page:0};
  return {kind:"app", pages:1, page:0};
}

function renderModal() {
  const ov = $("overlay");
  const m = state.modal;
  if (!m) { ov.className = "overlay"; ov.innerHTML = ""; return; }
  ov.className = "overlay open";
  if (m.type === "compose") {
    const extraOpen = !!(m.ccOpen || m.cc || m.bcc);
    m.ccOpen = extraOpen;
    ov.innerHTML = `<div class="modal wide">
      <div class="row-between"><h2 style="font-size:16px">New message</h2></div>
      <div class="compose-row"><label>To</label><div class="compose-to"><input id="cTo" value="${esc(m.to)}" /><button type="button" class="cc-toggle" data-act="cc-open">${extraOpen ? "Hide" : "Cc Bcc"}</button></div></div>
      <div class="compose-extra ${extraOpen ? "open" : ""}" id="composeExtra">
        <div class="compose-row"><label>Cc</label><input id="cCc" value="${esc(m.cc)}" /></div>
        <div class="compose-row"><label>Bcc</label><input id="cBcc" value="${esc(m.bcc)}" /></div>
      </div>
      <div class="compose-row"><label>Subject</label><input id="cSub" value="${esc(m.subject)}" placeholder="Subject" /></div>
      <div class="tb">
        <button data-act="fmt" data-cmd="bold"><b>B</b></button>
        <button data-act="fmt" data-cmd="italic"><i>I</i></button>
        <button data-act="fmt" data-cmd="underline"><u>U</u></button>
        <select id="cFont" data-act="font">
          <option>IBM Plex Sans</option><option>Georgia</option><option>Times New Roman</option><option>Arial</option>
        </select>
        <select id="cSize" data-act="size">
          <option>13px</option><option selected>14px</option><option>16px</option><option>18px</option>
        </select>
        <input id="cColor" type="color" value="#1A1F26" title="Color" style="width:32px;height:28px;border:1px solid var(--line);border-radius:6px;padding:2px;background:var(--surface)" />
        <select id="cTpl" data-act="tpl">
          <option value="">Template</option>
          <option value="term">Term sheet follow-up</option>
          <option value="stip">Stip request</option>
          <option value="intro">Intro</option>
        </select>
        <button data-act="attach">Attach</button>
        <button data-act="draft">Save draft</button>
      </div>
      <div class="editor" id="cBody" contenteditable="true">${m.body}</div>
      <div class="row-between" style="margin-top:12px">
        <span class="dim" id="cAtt">No attachments</span>
        <button class="btn primary" data-act="send-mail">Send</button>
      </div>
    </div>`;
    $("cColor").addEventListener("input", (e) => document.execCommand("foreColor", false, e.target.value));
    return;
  }
  if (m.type === "file") {
    const l = lead();
    const i = Math.max(0, Math.min(l.files.length - 1, m.i | 0));
    m.i = i;
    const meta = fileKind(l, i);
    const page = Math.max(0, Math.min((meta.pages || 1) - 1, m.page | 0));
    m.page = page;
    let html = paperHtml(l, i);
    if (meta.kind === "stmt") html = stmtPaper(l, meta.ai, meta.si, page);
    ov.className = "overlay open lite";
    ov.innerHTML = lightboxShell(html, {pages: meta.pages, page});
    return;
  }
  if (m.type === "stmt") {
    const l = lead();
    const accts = accountsOf(l);
    const ai = Math.max(0, Math.min(accts.length - 1, m.ai | 0));
    const a = accts[ai];
    const si = Math.max(0, Math.min(a.stmts.length - 1, m.si | 0));
    const s = a.stmts[si];
    const pages = s.pages || 6;
    const page = Math.max(0, Math.min(pages - 1, m.page | 0));
    m.ai = ai; m.si = si; m.page = page;
    ov.className = "overlay open lite";
    ov.innerHTML = lightboxShell(stmtPaper(l, ai, si, page), {pages, page});
    return;
  }
  if (m.type === "history") {
    const l = lead();
    ov.innerHTML = `<div class="modal"><div class="row-between"><h2 style="font-size:16px">History</h2></div>
      <h3 style="margin:16px 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)">Notes</h3>
      ${l.notes.map(n => `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><div class="dim">${esc(n.who)} · ${esc(n.when)}</div><p style="margin-top:6px">${esc(n.txt)}</p></div>`).join("")}
      <h3 style="margin:16px 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)">Activity</h3>
      ${l.activity.map(a => `<div class="ev"><div class="when">${esc(a.when)}</div><div>${esc(a.what)}</div></div>`).join("")}
    </div>`;
    return;
  }
  if (m.type === "devices") {
    ov.innerHTML = `<div class="modal">
      <div class="row-between"><h2 style="font-size:16px">Phones</h2></div>
      <p class="dim" style="margin:8px 0 4px">Green Bluetooth means a phone is on. Tap a row to call as that line.</p>
      <div class="dev-list">${DEVICES.map(d => `
        <div class="dev-item ${d.id===state.dial.device?"on-row":""}">
          <span class="av" style="background:${d.on?"#3A3F46":"#C5CAD0"}">${ico("phone",14)}</span>
          <button data-act="set-device" data-id="${d.id}" style="border:0;background:transparent;text-align:left;padding:0;color:inherit">
            <div class="co">${esc(d.name)}</div>
            <div class="nm">${esc(d.kind)} · ${esc(d.did)}</div>
          </button>
          <button class="toggle ${d.on?"on":""}" data-act="toggle-dev" data-id="${d.id}">${d.on?"On":"Off"}</button>
        </div>`).join("")}</div>
    </div>`;
    return;
  }
  if (m.type === "mail-read") {
    const mail = lead().mails[m.i];
    ov.innerHTML = `<div class="modal"><div class="row-between"><h2 style="font-size:16px">${esc(mail.sub)}</h2></div>
      <div class="dim" style="margin-top:8px">${esc(mail.from)} · ${esc(mail.when)}</div>
      <p style="margin-top:16px;line-height:1.55">${esc(mail.preview)}</p>
      <button class="btn" style="margin-top:16px" data-act="compose">Reply</button>
    </div>`;
  }
}
function startCall(n, who) {
  state.modal = null;
  state.keypadOpen = false;
  state.dial.status = "dialing";
  state.dial.number = n;
  state.dial.contact = who || displayName(lead().contact);
  state.dial.muted = false; state.dial.elapsed = 0; state.dial.dtmf = "";
  renderAll();
  setTimeout(() => {
    if (state.dial.status !== "dialing") return;
    state.dial.status = "connected";
    state.dial.started = Date.now();
    startTick(); renderAll(); toast("Connected · " + device().name);
  }, 1400);
}
function startTick() {
  clearInterval(tick);
  tick = setInterval(() => {
    if (state.dial.status !== "connected") return;
    state.dial.elapsed = Math.floor((Date.now() - state.dial.started) / 1000);
    const t = $("timer");
    if (t) t.textContent = fmtElapsed(state.dial.elapsed);
  }, 1000);
}
