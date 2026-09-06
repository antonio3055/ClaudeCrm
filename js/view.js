(function deskView() {
  const CW = 1640, CH = 900;
  const view = { s: 1, x: 0, y: 0, fit: 1 };
  const pts = new Map();
  let lastDist = 0, lastMid = null, mode = null, start = null, lastTap = 0, tapX = 0, tapY = 0;

  function vp() {
    const vv = window.visualViewport;
    const w = Math.max(
      (vv && vv.width) || 0,
      window.innerWidth || 0,
      document.documentElement.clientWidth || 0,
      320
    );
    const h = Math.max(
      (vv && vv.height) || 0,
      window.innerHeight || 0,
      document.documentElement.clientHeight || 0,
      480
    );
    return { w, h, ox: (vv && vv.offsetLeft) || 0, oy: (vv && vv.offsetTop) || 0 };
  }
  function fitScale() {
    const { w, h } = vp();
    const s = Math.min((w || CW) / CW, (h || CH) / CH);
    return (isFinite(s) && s > 0.05) ? s : 1;
  }
  function clamp() {
    const { w, h } = vp();
    const sw = CW * view.s, sh = CH * view.s;
    if (sw <= w) view.x = (w - sw) / 2;
    else view.x = Math.min(0, Math.max(w - sw, view.x));
    if (sh <= h) view.y = (h - sh) / 2;
    else view.y = Math.min(0, Math.max(h - sh, view.y));
  }
  function apply() {
    clamp();
    const { ox, oy } = vp();
    const r = document.documentElement;
    r.style.setProperty("--app-scale", String(view.s));
    r.style.setProperty("--app-h", CH + "px");
    r.style.setProperty("--app-x", (ox + view.x) + "px");
    r.style.setProperty("--app-y", (oy + view.y) + "px");
    if (typeof placePad === "function") placePad();
  }
  function fit() {
    view.fit = fitScale();
    view.s = view.fit;
    view.x = 0;
    view.y = 0;
    apply();
  }
  function relayout() {
    const next = fitScale();
    if (Math.abs(view.s - view.fit) < 0.025) {
      view.fit = next;
      view.s = next;
    } else {
      const rel = view.s / (view.fit || next);
      view.fit = next;
      view.s = rel * next;
    }
    apply();
  }
  function zoomAt(cx, cy, next) {
    const min = view.fit * 0.98;
    const max = Math.max(2.8, view.fit * 5);
    next = Math.min(max, Math.max(min, next));
    const k = next / view.s;
    view.x = cx - k * (cx - view.x);
    view.y = cy - k * (cy - view.y);
    view.s = next;
    apply();
  }
  function skipEl(t) {
    return t && t.closest && t.closest("input,textarea,select,[contenteditable],.handle,.overlay.open,.pad-pop.open,.modal,.editor");
  }
  function scrollerEl(t) {
    return t && t.closest && t.closest(".lead-list,.desk-scroll,.dock-body,.thread,.scroll,.pipe,.side,.pane-r,.lb-stage,.viewer-stage");
  }

  function onDown(e) {
    if (skipEl(e.target)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) {
      mode = "maybe";
      start = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, scroller: scrollerEl(e.target), zoomed: view.s > view.fit + 0.02 };
    } else if (pts.size === 2) {
      mode = "pinch";
      const a = [...pts.values()];
      lastDist = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1;
      lastMid = { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 };
    }
  }
  function onMove(e) {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (mode === "pinch" && pts.size >= 2) {
      const a = [...pts.values()];
      const dist = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1;
      const mid = { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 };
      if (lastDist) zoomAt(mid.x, mid.y, view.s * (dist / lastDist));
      view.x += mid.x - lastMid.x;
      view.y += mid.y - lastMid.y;
      lastDist = dist;
      lastMid = mid;
      apply();
      e.preventDefault();
      return;
    }
    if (pts.size !== 1 || !start) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (mode === "maybe") {
      if (Math.hypot(dx, dy) < 8) return;
      const horiz = Math.abs(dx) > Math.abs(dy) * 1.15;
      if (start.scroller && !horiz && !start.zoomed) { mode = "scroll"; return; }
      if (start.scroller && !horiz && start.zoomed && Math.abs(dy) > 10) { mode = "scroll"; return; }
      mode = "pan";
    }
    if (mode !== "pan") return;
    view.x = start.vx + dx;
    view.y = start.vy + dy;
    apply();
    e.preventDefault();
  }
  function onUp(e) {
    const had = pts.has(e.pointerId);
    pts.delete(e.pointerId);
    if (pts.size < 2 && mode === "pinch") mode = null;
    if (pts.size === 0) {
      if (had && mode === "maybe") {
        const now = Date.now();
        if (now - lastTap < 280 && Math.hypot(e.clientX - tapX, e.clientY - tapY) < 36 && !skipEl(e.target) && !e.target.closest("button,a,label")) {
          if (view.s > view.fit * 1.15) fit();
          else zoomAt(e.clientX, e.clientY, view.fit * 2.1);
          lastTap = 0;
        } else {
          lastTap = now; tapX = e.clientX; tapY = e.clientY;
        }
      }
      mode = null;
      start = null;
    }
  }

  function onWheel(e) {
    if (skipEl(e.target)) return;
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, view.s * (e.deltaY > 0 ? 0.92 : 1.09));
      return;
    }
    if (view.s > view.fit + 0.02 && !scrollerEl(e.target)) {
      e.preventDefault();
      view.x -= e.deltaX;
      view.y -= e.deltaY;
      apply();
    }
  }

  function bind() {
    const stage = document.getElementById("stage") || document.body;
    stage.addEventListener("pointerdown", onDown, { passive: true });
    stage.addEventListener("pointermove", onMove, { passive: false });
    stage.addEventListener("pointerup", onUp, { passive: true });
    stage.addEventListener("pointercancel", onUp, { passive: true });
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchmove", (e) => {
      if (mode === "pan" || mode === "pinch") e.preventDefault();
    }, { passive: false });
  }

  window.deskView = { fit, relayout, apply, view };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { bind(); fit(); });
  else { bind(); fit(); }
  window.addEventListener("resize", relayout);
  window.addEventListener("orientationchange", () => setTimeout(relayout, 60));
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", relayout);
    window.visualViewport.addEventListener("scroll", apply);
  }
})();
