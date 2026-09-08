/* Forge CRM — desk-panes.js (Leads desk only)
   Rail/dock resize-handle dragging, plus the final boot sequence.
   Must be the LAST desk script loaded — it calls renderAll() and friends. */

(function resize() {
  const CANVAS = 1640, HANDLES = 10, MID_MIN = 550;
  const RAIL_MIN = 260, RAIL_MAX = 560;
  const DOCK_MIN = 300, DOCK_MAX = 600;
  function readW(prop, fallback) {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue(prop), 10) || fallback;
  }
  function clampSides(rail, dock, prefer) {
    rail = Math.min(RAIL_MAX, Math.max(RAIL_MIN, rail));
    dock = Math.min(DOCK_MAX, Math.max(DOCK_MIN, dock));
    const budget = CANVAS - HANDLES - MID_MIN;
    if (rail + dock > budget) {
      if (prefer === "rail") rail = Math.min(rail, Math.max(RAIL_MIN, budget - dock));
      else if (prefer === "dock") dock = Math.min(dock, Math.max(DOCK_MIN, budget - rail));
      else {
        dock = Math.min(dock, Math.max(DOCK_MIN, budget - rail));
        if (rail + dock > budget) rail = Math.min(rail, Math.max(RAIL_MIN, budget - dock));
      }
    }
    return { rail, dock };
  }
  window.setPaneWidths = function setPaneWidths(rail, dock, prefer) {
    const s = clampSides(rail, dock, prefer);
    document.documentElement.style.setProperty("--rail-w", s.rail + "px");
    document.documentElement.style.setProperty("--dock-w", s.dock + "px");
    return s;
  };
  let side = null, startX = 0, startW = 0, startRail = 0, startDock = 0;
  document.addEventListener("mousedown", (e) => {
    const h = e.target.closest(".handle");
    if (!h) return;
    side = h.dataset.side;
    startX = e.clientX;
    startRail = readW("--rail-w", 460);
    startDock = readW("--dock-w", 560);
    startW = side === "rail" ? startRail : startDock;
    h.classList.add("drag");
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!side) return;
    const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--app-scale")) || 1;
    const dx = (e.clientX - startX) / scale;
    if (side === "rail") {
      window.setPaneWidths(startW + dx, startDock, "rail");
    } else {
      window.setPaneWidths(startRail, startW - dx, "dock");
    }
    placePad();
  });
  document.addEventListener("mouseup", () => {
    if (!side) return;
    document.querySelectorAll(".handle").forEach(h => h.classList.remove("drag"));
    storeSet(LS.rail, readW("--rail-w", 460));
    storeSet(LS.dock, readW("--dock-w", 560));
    side = null;
  });
  document.addEventListener("dblclick", (e) => {
    const h = e.target.closest(".handle");
    if (!h) return;
    if (h.dataset.side === "rail") window.setPaneWidths(460, readW("--dock-w", 560), "rail");
    else window.setPaneWidths(readW("--rail-w", 460), 560, "dock");
    storeSet(LS.rail, readW("--rail-w", 460));
    storeSet(LS.dock, readW("--dock-w", 560));
    placePad();
  });
})();

sizeApp();
applyWidths();
try { renderAll(); }
catch (err) {
  const r = document.getElementById("rail");
  if (r) r.innerHTML = `<div class="empty" style="padding:24px">Couldn’t start the desk.<br><br>${esc(err && err.message)}</div>`;
}
