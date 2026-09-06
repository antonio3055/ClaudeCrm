/* Forge CRM — page-shell.js
   Used ONLY by the 5 secondary pages (pipeline, inbox, scanner, underwriting, messages).
   index.html does NOT load this file — it has its own full "Phones" modal and
   resize handling built into the desk engine (desk-viewer.js / desk-panes.js).
   Loading both on the same page would register two conflicting click handlers
   for the same buttons, so keep this split. */

(function bootPhones() {
  function connected() {
    return DEVICES.some(d => d.on && (d.id === "poly" || d.id === "mobile" || d.id === "web"));
  }
  function paint() {
    const b = $("btBtn");
    if (!b) return;
    b.classList.toggle("on", connected());
    b.classList.toggle("off", !connected());
  }
  function close() {
    const ov = $("overlay");
    if (!ov) return;
    ov.className = "overlay";
    ov.innerHTML = "";
  }
  function open() {
    const ov = $("overlay");
    if (!ov) return;
    ov.className = "overlay open";
    ov.innerHTML = `<div class="modal">
      <div class="row-between"><h2 style="font-size:16px">Phones</h2><button class="icon-btn" data-act="close" type="button">${ico("x")}</button></div>
      <p class="dim" style="margin:8px 0 4px">Green Bluetooth means a phone is on.</p>
      <div class="dev-list">${DEVICES.map(d => `
        <div class="dev-item">
          <span class="av" style="background:${d.on?"#3A3F46":"#C5CAD0"}">${ico("phone",14)}</span>
          <span>
            <div class="co">${esc(d.name)}</div>
            <div class="nm">${esc(d.kind)} · ${esc(d.did)}</div>
          </span>
          <button class="toggle ${d.on?"on":""}" data-act="toggle-dev" data-id="${d.id}" type="button">${d.on?"On":"Off"}</button>
        </div>`).join("")}</div>
    </div>`;
  }
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "overlay") { close(); return; }
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const act = b.dataset.act;
    if (act === "devices") { open(); e.preventDefault(); return; }
    if (act === "close") { close(); return; }
    if (act === "toggle-dev") {
      const d = DEVICES.find(x => x.id === b.dataset.id);
      if (!d) return;
      d.on = !d.on;
      paint();
      open();
      toast(d.name + (d.on ? " on" : " off"));
    }
  });
  paint();
})();

(function sizeApp() {
  function apply() {
    if (window.deskView) window.deskView.relayout();
  }
  apply();
  window.addEventListener("resize", apply);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", apply);
})();
