/* =====================================================================
   SOUND.JS — sound design du portfolio (synthétisé, aucun fichier audio)

   INSTALLATION : tout en bas de index.html, APRÈS transitions-index.js :
       <script src="sound.js"></script>

   Principes :
   - Son désactivé par défaut, bouton « Son » visible, choix mémorisé
   - Sons courts (< 0,7 s), volume bas, compresseur + petite réverbération
   - Gamme pentatonique : chaque projet a sa note, les sons restent harmonieux
   - 3 palettes qui suivent le mode actif : normal (doux), May (pop), UK70 (sec, photocopie)
   - Se coupe quand l'onglet est caché
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- À MODIFIER ---------------- */
  const VOL = 0.5;          // volume général (0 à 1)
  const DEFAULT_ON = false; // true = actif d'office (le navigateur attend quand même un 1er clic)
  const LABEL_ON = "Son on", LABEL_OFF = "Son off";
  /* -------------------------------------------- */

  const KEY = "sound";
  const root = document.documentElement;
  const $ = id => document.getElementById(id);

  let enabled = DEFAULT_ON;
  try { const v = localStorage.getItem(KEY); if (v === "on") enabled = true; else if (v === "off") enabled = false; } catch (e) {}

  /* ---------------------------------------------------------------
     MOTEUR AUDIO
     --------------------------------------------------------------- */
  let ctx = null, master = null, revIn = null, nb = null;

  function impulse(sec, decay) {
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? VOL : 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 24; comp.ratio.value = 3;
    comp.attack.value = 0.003; comp.release.value = 0.2;
    master.connect(comp); comp.connect(ctx.destination);
    const rv = ctx.createConvolver();
    rv.buffer = impulse(1.4, 2.6);
    const wet = ctx.createGain(); wet.gain.value = 0.22;
    rv.connect(wet); wet.connect(master);
    revIn = rv;
    return ctx;
  }

  function ready() {
    if (!enabled || !ensure()) return false;
    if (ctx.state !== "running") { try { ctx.resume(); } catch (e) {} return false; }
    return true;
  }

  function out(node, send) {
    node.connect(master);
    if (send > 0) { const g = ctx.createGain(); g.gain.value = send; node.connect(g); g.connect(revIn); }
  }

  /* note : o = { f, to, type, dur, v, a, at, lp, rev } */
  function tone(o) {
    if (!ready()) return;
    const t = ctx.currentTime + (o.at || 0), dur = o.dur || 0.2, v = o.v || 0.15, a = o.a || 0.004;
    const osc = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(o.f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    f.type = "lowpass"; f.frequency.value = o.lp || 6000;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(f); f.connect(g); out(g, o.rev || 0);
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  /* bruit filtré : o = { f0, f1, q, ft, dur, v, a, at, rev } */
  function noise(o) {
    if (!ready()) return;
    if (!nb) {
      nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = nb.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = ctx.currentTime + (o.at || 0), dur = o.dur || 0.2, v = o.v || 0.1, a = o.a || 0.01;
    const s = ctx.createBufferSource(); s.buffer = nb; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = o.ft || "bandpass"; f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.f0, t);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); out(g, o.rev || 0);
    s.start(t); s.stop(t + dur + 0.05);
  }

  /* ---------------------------------------------------------------
     PALETTES
     --------------------------------------------------------------- */
  const SEMI = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33];
  const hz = (s, base) => (base || 261.63) * Math.pow(2, s / 12);
  const mode = () => root.classList.contains("uk") ? "uk" : root.classList.contains("may-active") ? "may" : "base";
  const jitter = () => 1 + (Math.random() - 0.5) * 0.012;   // micro-variation : évite l'effet « machine »

  const S = {
    /* changement de projet : une note par projet */
    tick(i) {
      const m = mode(), n = SEMI[i % SEMI.length];
      if (m === "uk") {
        noise({ f0: 1800, f1: 900, q: 2, dur: 0.05, v: 0.18 });
        tone({ f: hz(n, 130) * jitter(), type: "sawtooth", dur: 0.09, v: 0.07, lp: 900 });
      } else if (m === "may") {
        const f = hz(n) * 2 * jitter();
        tone({ f, to: f * 1.2, type: "triangle", dur: 0.14, v: 0.13, lp: 4000, rev: 0.15 });
        noise({ f0: 3000, ft: "highpass", dur: 0.02, v: 0.04 });
      } else {
        const f = hz(n) * 2 * jitter();
        tone({ f, dur: 0.24, v: 0.11, rev: 0.4 });
        tone({ f: f * 2, dur: 0.1, v: 0.025, rev: 0.4 });
      }
    },
    /* survol d'une carte (très discret) */
    hover() {
      const m = mode();
      if (m === "uk") noise({ f0: 4500, ft: "highpass", dur: 0.03, v: 0.04 });
      else if (m === "may") tone({ f: 1400, to: 1900, type: "triangle", dur: 0.06, v: 0.03 });
      else tone({ f: 1800, dur: 0.05, v: 0.022 });
    },
    /* ouverture d'un projet : balayage + souffle grave */
    whoosh() {
      const m = mode();
      noise({ f0: 300, f1: 4500, q: m === "uk" ? 2 : 0.8, dur: 0.7, a: 0.25, v: 0.2, rev: 0.3 });
      tone({ f: 80, to: 170, dur: 0.7, a: 0.3, v: 0.14 });
    },
    /* ouverture / fermeture À propos & Contact */
    open() {
      const m = mode();
      if (m === "uk") { noise({ f0: 900, f1: 300, q: 2, dur: 0.12, v: 0.2 }); tone({ f: 110, to: 60, dur: 0.18, v: 0.22 }); }
      else if (m === "may") { tone({ f: 392, to: 784, type: "triangle", dur: 0.2, v: 0.13, rev: 0.25 }); tone({ f: 988, dur: 0.14, at: 0.1, type: "triangle", v: 0.08, rev: 0.25 }); }
      else { tone({ f: 392, dur: 0.5, v: 0.09, rev: 0.5 }); tone({ f: 587, dur: 0.5, at: 0.06, v: 0.07, rev: 0.5 }); }
    },
    close() {
      const m = mode();
      if (m === "uk") { noise({ f0: 700, f1: 250, q: 2, dur: 0.1, v: 0.16 }); tone({ f: 90, to: 50, dur: 0.14, v: 0.18 }); }
      else if (m === "may") tone({ f: 784, to: 392, type: "triangle", dur: 0.18, v: 0.12, rev: 0.2 });
      else { tone({ f: 587, dur: 0.35, v: 0.07, rev: 0.5 }); tone({ f: 392, dur: 0.4, at: 0.05, v: 0.07, rev: 0.5 }); }
    },
    /* bouton thème clair / sombre */
    theme() {
      const dark = root.getAttribute("data-theme") === "dark";
      tone({ f: dark ? 330 : 494, to: dark ? 247 : 659, dur: 0.18, v: 0.1, rev: 0.3 });
    },
    /* bascule d'univers (May / UK70 / normal) */
    mode() {
      const m = mode();
      if (m === "may") [523, 659, 784].forEach((f, i) => tone({ f, type: "square", dur: 0.1, at: i * 0.06, v: 0.05, lp: 3000, rev: 0.2 }));
      else if (m === "uk") { noise({ f0: 2500, f1: 500, q: 1.5, dur: 0.25, v: 0.25 }); tone({ f: 100, to: 55, type: "sawtooth", dur: 0.25, v: 0.12, lp: 700 }); }
      else { tone({ f: 523, dur: 0.3, v: 0.08, rev: 0.4 }); tone({ f: 392, dur: 0.4, at: 0.08, v: 0.08, rev: 0.4 }); }
    },
    /* « Poster la lettre » : tampon */
    stamp() {
      tone({ f: 150, to: 45, dur: 0.28, v: 0.38 });
      noise({ f0: 3500, ft: "highpass", dur: 0.06, v: 0.1 });
    },
    click() { tone({ f: 900, to: 600, type: "triangle", dur: 0.06, v: 0.06 }); },
    /* son activé : petit carillon */
    on() { [523, 659, 784].forEach((f, i) => tone({ f, dur: 0.35, at: i * 0.08, v: 0.08, rev: 0.5 })); }
  };

  /* ---------------------------------------------------------------
     BOUTON « SON »
     --------------------------------------------------------------- */
  const css = `
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
@media(max-width:860px){.snd{bottom:calc(12px + var(--sb,0px))}}
`;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  const btn = document.createElement("button");
  btn.className = "snd"; btn.type = "button"; btn.id = "soundBtn";
  btn.innerHTML = '<span class="snd-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="snd-t"></span>';
  document.body.appendChild(btn);

  function paint() {
    btn.setAttribute("aria-pressed", enabled ? "true" : "false");
    btn.setAttribute("aria-label", enabled ? "Couper le son" : "Activer le son");
    btn.querySelector(".snd-t").textContent = enabled ? LABEL_ON : LABEL_OFF;
  }
  function setEnabled(on) {
    enabled = on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
    paint();
    if (on) {
      ensure();
      Promise.resolve(ctx.resume()).then(() => {
        master.gain.setTargetAtTime(VOL, ctx.currentTime, 0.02);
        S.on();
      });
    } else if (ctx) {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
    }
  }
  btn.addEventListener("click", () => setEnabled(!enabled));
  paint();

  /* le navigateur exige un geste de l'utilisateur : on débloque au premier appui */
  const unlock = () => { if (enabled && ensure()) { try { ctx.resume(); } catch (e) {} } };
  ["pointerdown", "keydown", "touchend"].forEach(ev => addEventListener(ev, unlock, { passive: true }));

  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (enabled) ctx.resume();
  });

  /* ---------------------------------------------------------------
     BRANCHEMENTS SUR LE SITE
     --------------------------------------------------------------- */
  /* 1. changement de projet : on écoute le gros numéro */
  const num = $("num");
  if (num && window.MutationObserver) {
    new MutationObserver(() => {
      if (!document.body.classList.contains("ui")) return;
      const i = parseInt(num.textContent, 10) - 1;
      if (i >= 0) S.tick(i);
    }).observe(num, { childList: true, characterData: true, subtree: true });
  }

  /* 2. survol des cartes (souris uniquement, limité) */
  const stage = $("stage");
  let lastCard = null, lastT = 0;
  if (stage) stage.addEventListener("pointerover", e => {
    if (e.pointerType !== "mouse") return;
    const c = e.target.closest && e.target.closest(".card");
    const now = performance.now();
    if (c && c !== lastCard && now - lastT > 140) { lastCard = c; lastT = now; S.hover(); }
    else if (!c) lastCard = null;
  });

  /* 3. ouverture d'un projet (transition) */
  if (typeof window.go === "function") {
    const baseGo = window.go;
    window.go = function () { S.whoosh(); return baseGo.apply(this, arguments); };
  }

  /* 4. À propos / Contact */
  if (typeof window.openPanel === "function") {
    const baseOpen = window.openPanel;
    window.openPanel = function () { S.open(); return baseOpen.apply(this, arguments); };
  }

  /* 5. clics : fermeture, thème, univers, lettre */
  document.addEventListener("click", e => {
    const t = e.target.closest && e.target;
    if (!t || !t.closest) return;
    const panelOpen = $("panel") && $("panel").classList.contains("open");
    if (t.closest("#close") || (panelOpen && t.closest('.nav button[data-go="work"]'))) { S.close(); return; }
    if (t.closest("#themeBtn")) {
      if (root.classList.contains("uk") || root.classList.contains("may-active")) return;   // bouton verrouillé
      setTimeout(S.theme, 0); return;
    }
    if (t.closest("#mayModeBtn") || t.closest("#ukModeBtn")) { setTimeout(S.mode, 30); return; }
    if (t.closest(".c-send-row .c-btn")) { S.stamp(); return; }
    if (t.closest(".c-btn")) S.click();
  }, true);
})();
