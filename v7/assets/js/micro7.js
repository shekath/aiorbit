/* AI Orbit · Version 7 — extra micro-interactions on top of the V4 motion layer (fx.js):
   scroll progress bar, hero copy parallax, pointer spotlight on cards. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const bar = document.createElement("div"); bar.className = "progress7"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar);
  const wide = matchMedia("(min-width: 901px)"); // hero parallax only where the hero has room; on phones it would push the strip out of the clipped hero
  const hero = document.querySelector(".h7"), copy = hero?.querySelector(".copy");
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (copy && (reduce || !wide.matches)) { copy.style.transform = copy.style.opacity = ""; }
    else if (copy && y < innerHeight * 1.3) { const h = hero.offsetHeight || innerHeight;
      copy.style.transform = `translate3d(0, ${y * .22}px, 0)`; copy.style.opacity = String(Math.max(0, 1 - y / h * 1.1)); }
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (!fine || reduce || innerWidth <= 900) return;
  // spotlight that follows the pointer on cards (only on elements that already position their children)
  $$(".scard, .work .item, .fact, .kn4 .rows a, .office, .p-card, .cap, .path").forEach((el) => {
    if (getComputedStyle(el).position === "static") return;
    const g = document.createElement("span"); g.className = "glow7"; g.setAttribute("aria-hidden", "true"); el.appendChild(g);
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`); });
  });
})();
