(function () {
  function card(l) {
    const amt = l.offer || l.ask;
    return `<a class="deal" href="index.html?lead=${esc(l.id)}">
      <div class="co">${esc(l.company)}</div>
      <div class="who">${esc(displayName(l.contact))} · ${esc(l.city)}</div>
      <div class="amt">${money(amt)} <span style="color:var(--dim);font-weight:500;font-size:12px">${esc(l.pos)}</span></div>
      <div class="ago">${esc(l.lastAgo)} · ${esc(l.rep)}</div>
    </a>`;
  }
  const grouped = Object.fromEntries(STAGES.map(s => [s.id, []]));
  LEADS.forEach(l => grouped[stageOf(l)].push(l));
  $("pipe").innerHTML = STAGES.map(s => `
    <section class="col">
      <h2>${esc(s.lab)} <span>${grouped[s.id].length}</span></h2>
      ${grouped[s.id].map(card).join("") || `<div class="empty">None</div>`}
    </section>`).join("");
})();
