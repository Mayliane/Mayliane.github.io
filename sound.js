/* =====================================================================
   SOUND.JS — version minimale (synthétisé, aucun fichier audio)

   À mettre tout en bas de index.html ET des pages projet :
       <script src="sound.js"></script>

   3 sons, jamais superposés :
   - clic   : un seul petit clic par élément cliqué (hauteur légèrement variable)
   - swoosh : ouverture et sortie d'un projet (à la place du clic)
   - papier : défilement du carrousel
   Pas de survol.

   Test console : __sfx.click(), __sfx.whoosh(), __sfx.paper()
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- À MODIFIER ---------------- */
  const VOL = 0.6;
  const DEFAULT_ON = false;
  const LABEL_ON = "Son on", LABEL_OFF = "Son off";
  /* -------------------------------------------- */

  const KEY = "sound";
  const $ = id => document.getElementById(id);
  const isHome = !!$("stage");

  let enabled = DEFAULT_ON;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "on") enabled = true; else if (v === "off") enabled = false;
  } catch (e) {}

  /* ---------------- MOTEUR ---------------- */
  let ctx = null, master = null, buf = null;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? VOL : 0;
    master.connect(ctx.destination);
    buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  function ready() {
    if (!enabled || !ensure()) return false;
    if (ctx.state !== "running") { try { ctx.resume(); } catch (e) {} return false; }
    return true;
  }

  /* une seule voix : bruit filtré qui balaie de f0 à f1 */
  function burst(f0, f1, q, dur, attack, v) {
    const t = ctx.currentTime;
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }

  /* ---------------- LES DEUX SONS ---------------- */
  let lastPaper = 0, lastWhoosh = 0;
  const S = {
    click() {
      if (!ready()) return;
      const hz = 1800 + Math.random() * 3200;          // plus ou moins aigu
      burst(hz, hz * 0.8, 3, 0.03, 0.001, 0.16);
    },
    whoosh() {
      const now = performance.now();
      if (now - lastWhoosh < 300) return;      // jamais deux fois d'affilée
      lastWhoosh = now;
      if (!ready()) return;
      burst(500, 3000, 0.6, 0.5, 0.2, 0.14);
    },
    paper() {
      if (!ready()) return;
      lastPaper = performance.now();
      burst(1200, 4200, 0.8, 0.2, 0.04, 0.12);
    }
  };
  window.__sfx = S;

  /* ---------------- BOUTON « SON » (accueil) ---------------- */
  let btn = null;
  if (isHome) {
    const st = document.createElement("style");
    st.textContent = `
.snd{position:fixed;left:50%;bottom:calc(18px + var(--sb,0px));transform:translateX(-50%);z-index:12;display:flex;align-items:center;gap:9px;
  padding:10px 12px;min-height:44px;font-family:var(--font);font-weight:600;font-size:11px;line-height:1;letter-spacing:.12em;text-transform:uppercase;
  color:var(--mute);transition:color .25s,opacity .8s ease}
.snd:hover,.snd[aria-pressed="true"]{color:var(--ink)}
body:not(.ui) .snd{opacity:0;pointer-events:none}
.snd-bars{display:flex;align-items:center;gap:2px;height:12px}
.snd-bars i{display:block;width:2px;height:2px;background:currentColor;transition:height .3s}
.snd[aria-pressed="true"] .snd-bars i{animation:sndEq .9s ease-in-out infinite alternate}
.snd[aria-pressed="true"] .snd-bars i:nth-child(2){animation-delay:-.3s}
.snd[aria-pressed="true"] .snd-bars i:nth-child(3){animation-delay:-.6s}
.snd[aria-pressed="true"] .snd-bars i:nth-child(4){animation-delay:-.15s}
@keyframes sndEq{from{height:2px}to{height:12px}}
@media(prefers-reduced-motion:reduce){.snd[aria-pressed="true"] .snd-bars i{animation:none;height:8px}}
@media(max-width:860px){.snd{bottom:calc(12px + var(--sb,0px))}}`;
    document.head.appendChild(st);
    btn = document.createElement("button");
    btn.className = "snd"; btn.type = "button"; btn.id = "soundBtn";
    btn.setAttribute("aria-label", "Son");
    btn.innerHTML = '<span class="snd-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="snd-t"></span>';
    document.body.appendChild(btn);
  }

  function paint() {
    if (!btn) return;
    btn.setAttribute("aria-pressed", enabled ? "true" : "false");
    btn.querySelector(".snd-t").textContent = enabled ? LABEL_ON : LABEL_OFF;
  }

  function setEnabled(on) {
    if (on && !ensure()) { enabled = false; paint(); return; }
    enabled = on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
    paint();
    if (!ctx) return;
    if (on) {
      Promise.resolve(ctx.resume()).then(() => {
        master.gain.setTargetAtTime(VOL, ctx.currentTime, 0.02);
        S.click();
      });
    } else {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
    }
  }
  if (btn) btn.addEventListener("click", e => { e.stopPropagation(); setEnabled(!enabled); });
  paint();

  const unlock = () => { if (enabled && ensure()) { try { ctx.resume(); } catch (e) {} } };
  ["pointerdown", "keydown", "touchend", "click"].forEach(ev => addEventListener(ev, unlock, { passive: true }));

  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (enabled) ctx.resume();
  });

  /* ---------------- BRANCHEMENTS ---------------- */
  const CLICKABLE = "button,a,[role=button],.c-btn,.card,summary,label";

  document.addEventListener("click", e => {
    const t = e.target;
    if (!t || !t.closest || t.closest("#soundBtn")) return;
    const el = t.closest(CLICKABLE);
    if (!el) return;
    if (performance.now() - lastWhoosh < 400) return;

    /* page projet : fermer / autre projet = swoosh, le reste = clic */
    if (!isHome) {
      const a = el.closest("a[href]");
      const href = a ? (a.getAttribute("href") || "") : "";
      if (a && href && href.charAt(0) !== "#" && !/^(mailto|tel):/.test(href)) { S.whoosh(); return; }
      S.click();
      return;
    }

    /* accueil : carte = défilement (papier) ou ouverture (swoosh) -> on attend de voir */
    if (el.classList.contains("card")) {
      const t0 = performance.now();
      setTimeout(() => { if (lastPaper < t0) S.whoosh(); }, 90);
      return;
    }
    S.click();
  }, true);

  /* si le site ouvre / ferme un projet par une fonction, on la double du swoosh */
  ["go", "leave"].forEach(name => {
    if (typeof window[name] !== "function") return;
    const base = window[name];
    window[name] = function () { S.whoosh(); return base.apply(this, arguments); };
  });

  /* défilement du carrousel : on lit le gros numéro */
  if (isHome) {
    const num = $("num");
    let last = null, lastT = 0;
    if (num && window.MutationObserver) {
      new MutationObserver(() => {
        if (!document.body.classList.contains("ui")) return;
        const i = parseInt(num.textContent, 10);
        if (isNaN(i)) return;
        const prev = last; last = i;
        if (prev === null || i === prev) return;
        const now = performance.now();
        if (now - lastT < 110) return;
        lastT = now;
        S.paper();
      }).observe(num, { childList: true, characterData: true, subtree: true });
    }
  }
})();
