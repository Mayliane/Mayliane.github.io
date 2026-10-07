/* =====================================================================
   SOUND.JS — version simple (tout est synthétisé, aucun fichier audio)

   INSTALLATION : tout en bas de index.html ET des pages projet,
   APRÈS transitions-index.js :
       <script src="sound.js"></script>

   3 sons seulement :
   - clic      : petit clic partout, plus ou moins aigu (hauteur aléatoire)
   - swoosh    : entrée / sortie d'un projet
   - page      : une page qui se tourne à chaque changement de projet

   Test dans la console : __sfx.click(), __sfx.whoosh(), __sfx.page(1)
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- À MODIFIER ---------------- */
  const VOL = 0.6;            // volume général (0 à 1)
  const DEFAULT_ON = false;   // le navigateur attend de toute façon un 1er clic
  const LABEL_ON = "Son on", LABEL_OFF = "Son off";
  const PITCH_MIN = 0, PITCH_MAX = 1;   // 0 = clic grave, 1 = clic très aigu
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
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    master.connect(comp); comp.connect(ctx.destination);
    buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  /* true si on peut jouer maintenant ; sinon tente de réveiller le contexte */
  function ready() {
    if (!enabled || !ensure()) return false;
    if (ctx.state !== "running") { try { ctx.resume(); } catch (e) {} return false; }
    return true;
  }

  /* joue fn dès que le contexte tourne (arrivée sur une page) */
  function whenReady(fn) {
    if (!enabled || !ensure()) return;
    if (ctx.state === "running") { fn(); return; }
    try { Promise.resolve(ctx.resume()).then(() => { if (enabled && ctx.state === "running") fn(); }); } catch (e) {}
  }

  /* bruit filtré : sweep de f0 vers f1, attaque a, durée dur */
  function noise(o) {
    const t = ctx.currentTime + (o.at || 0), dur = o.dur, a = Math.min(o.a || 0.002, dur * 0.6);
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = o.type || "bandpass"; f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.f0, t);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.v, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g);
    let end = g;
    if (o.pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = o.pan; g.connect(p); end = p; }
    end.connect(master);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }

  /* petit corps de bois (sinus très court qui chute) */
  function body(f, v, at, dur) {
    const t = ctx.currentTime + (at || 0), d = dur || 0.045;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.6, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + d + 0.03);
  }

  /* ---------------- LES SONS ---------------- */
  let lastWhoosh = 0;

  const S = {
    /* petit clic : p = hauteur 0..1 (aléatoire si omis) */
    click(p, vol) {
      if (!ready()) return;
      if (p == null) p = PITCH_MIN + Math.random() * (PITCH_MAX - PITCH_MIN);
      const v = (vol || 0.08) * (0.85 + Math.random() * 0.3);
      const pan = (Math.random() - 0.5) * 0.3;
      noise({ f0: 1600 + p * 3800, q: 2, dur: 0.02, a: 0.001, v, pan });
      body(160 + p * 320, v * 0.9);
    },

    /* survol : clic minuscule et très aigu */
    hover() { S.click(0.9 + Math.random() * 0.1, 0.025); },

    /* swoosh d'entrée / sortie de projet : dir = 1 (part) ou -1 (arrive) */
    whoosh(dir) {
      if (!ready()) return;
      lastWhoosh = performance.now();
      const up = dir !== -1;
      noise({ f0: up ? 400 : 3000, f1: up ? 3000 : 400, q: 0.6, dur: 0.5, a: up ? 0.25 : 0.06, v: 0.07 });
      noise({ type: "highpass", f0: 4500, q: 0.4, dur: 0.3, a: up ? 0.18 : 0.04, v: 0.012, at: 0.04 });
    },
    settle() { S.whoosh(-1); },

    /* page qui se tourne : dir = 1 (suivant) ou -1 (précédent) */
    page(dir) {
      if (!ready()) return;
      const up = dir !== -1;
      /* le froissement du papier qui glisse */
      noise({ f0: up ? 1100 : 4200, f1: up ? 4200 : 1100, q: 0.8, dur: 0.17, a: 0.035, v: 0.06 });
      /* le petit claquement de la page qui retombe */
      noise({ type: "highpass", f0: 3500, q: 0.5, dur: 0.035, a: 0.002, v: 0.04, at: 0.15 });
      body(up ? 210 : 190, 0.03, 0.15, 0.05);
    },

    on() { S.click(0.5, 0.06); setTimeout(() => S.click(0.8, 0.05), 70); }
  };
  window.__sfx = S;

  /* ---------------- BOUTON « SON » (accueil uniquement) ---------------- */
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
    if (on && !ensure()) { enabled = false; paint(); return; }   // navigateur sans Web Audio
    enabled = on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
    paint();
    if (!ctx) return;
    if (on) {
      Promise.resolve(ctx.resume()).then(() => {
        master.gain.setTargetAtTime(VOL, ctx.currentTime, 0.02);
        S.on();
      });
    } else {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
    }
  }
  if (btn) btn.addEventListener("click", e => { e.stopPropagation(); setEnabled(!enabled); });
  paint();

  /* le navigateur exige un geste : on débloque au premier appui */
  const unlock = () => { if (enabled && ensure()) { try { ctx.resume(); } catch (e) {} } };
  ["pointerdown", "keydown", "touchend", "click"].forEach(ev => addEventListener(ev, unlock, { passive: true }));

  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (enabled) ctx.resume();
  });

  /* ---------------- BRANCHEMENTS ---------------- */
  const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const CLICKABLE = "button,a,[role=button],.c-btn,.nav *,summary,label";

  /* clics partout (sauf juste après un swoosh, ou sur le bouton Son qui a son propre son) */
  document.addEventListener("click", e => {
    const t = e.target;
    if (!t || !t.closest) return;
    if (t.closest("#soundBtn")) return;
    if (performance.now() - lastWhoosh < 400) return;
    if (t.closest(CLICKABLE)) S.click();
  }, true);

  /* wrapper sûr : appelle ton ancienne fonction après le son */
  function wrap(name, before) {
    if (typeof window[name] !== "function") return;
    const base = window[name];
    window[name] = function () { before(); return base.apply(this, arguments); };
  }

  /* ----- PAGES PROJET ----- */
  if (!isHome) {
    if (!reduced) whenReady(S.settle);      // arrivée
    wrap("leave", () => S.whoosh(1));       // fermer / projet suivant / précédent
    return;
  }

  /* ----- ACCUEIL ----- */
  /* retour depuis un projet */
  try { if (document.referrer.indexOf("/projet/") > -1 && !reduced) whenReady(S.settle); } catch (e) {}

  /* ouverture d'un projet */
  wrap("go", () => S.whoosh(1));

  /* défilement : on lit le gros numéro, le sens vient de la comparaison avec le précédent */
  const num = $("num");
  let lastIdx = null, lastT = 0;
  if (num && window.MutationObserver) {
    new MutationObserver(() => {
      if (!document.body.classList.contains("ui")) return;
      const i = parseInt(num.textContent, 10);
      if (isNaN(i)) return;
      const prev = lastIdx; lastIdx = i;
      if (prev === null || i === prev) return;
      const now = performance.now();
      if (now - lastT < 110) return;        // pas de mitraillette en défilement rapide
      lastT = now;
      S.page(i > prev ? 1 : -1);
    }).observe(num, { childList: true, characterData: true, subtree: true });
  }

  /* survol des cartes et boutons (souris uniquement, très discret) */
  let lastEl = null, lastH = 0;
  document.addEventListener("pointerover", e => {
    if (e.pointerType !== "mouse" || !e.target.closest) return;
    const el = e.target.closest(".card,button,a,.c-btn");
    const now = performance.now();
    if (el && el !== lastEl && now - lastH > 120) { lastEl = el; lastH = now; S.hover(); }
    else if (!el) lastEl = null;
  });
})();
