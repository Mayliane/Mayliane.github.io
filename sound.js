/* =====================================================================
   SOUND.JS — sound design du portfolio (synthétisé, aucun fichier audio)

   INSTALLATION : tout en bas de index.html, APRÈS transitions-index.js :
       <script src="sound.js"></script>

   Direction sonore : « objet de design » — matières douces (bois, verre, papier),
   notes de mallet pentatoniques, souffles filtrés, grave arrondi. Aucun bip,
   aucune onde carrée/dent de scie. Tout est court, bas en volume, passé dans
   une réverbération sombre + un compresseur, pour un rendu propre et "premium".

   - Son désactivé par défaut, bouton « Son » visible, choix mémorisé
   - 3 palettes qui suivent le mode actif : normal (mallet/verre), May (kalimba brillante), UK70 (sec, mécanique, papier)
   - Se coupe quand l'onglet est caché
   - Pour tester dans la console : __sfx.tick(3), __sfx.whoosh(), __sfx.open() …
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- À MODIFIER ---------------- */
  const VOL = 0.55;         // volume général (0 à 1)
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

  /* réverbération : bruit qui s'assombrit au fil de la queue, léger pré-délai */
  function impulse(sec, decay) {
    const sr = ctx.sampleRate, len = Math.floor(sr * sec), pre = Math.floor(sr * 0.016);
    const buf = ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      let lp = 0;
      for (let i = pre; i < len; i++) {
        const t = (i - pre) / (len - pre);
        const k = 0.62 - 0.52 * t;                       // filtre passe-bas qui se ferme
        lp += ((Math.random() * 2 - 1) - lp) * k;
        d[i] = lp * Math.pow(1 - t, decay) * Math.min(1, (i - pre) / (sr * 0.012));
      }
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
    /* chaîne de sortie : adoucit les aigus, compresse doucement, limite */
    const tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 11000; tone.Q.value = 0.5;
    const warm = ctx.createBiquadFilter(); warm.type = "lowshelf"; warm.frequency.value = 180; warm.gain.value = 1.5;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 18; comp.ratio.value = 2.5;
    comp.attack.value = 0.006; comp.release.value = 0.25;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -4; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08;
    master.connect(tone); tone.connect(warm); warm.connect(comp); comp.connect(lim); lim.connect(ctx.destination);
    /* réverbération (envoi filtré : pas de grave boueux) */
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 220;
    const rv = ctx.createConvolver(); rv.buffer = impulse(1.9, 2.4);
    const wet = ctx.createGain(); wet.gain.value = 0.2;
    hp.connect(rv); rv.connect(wet); wet.connect(master);
    revIn = hp;
    return ctx;
  }

  function ready() {
    if (!enabled || !ensure()) return false;
    if (ctx.state !== "running") { try { ctx.resume(); } catch (e) {} return false; }
    return true;
  }

  /* joue `fn` dès que le contexte audio tourne (arrivée sur une page : le navigateur peut tarder) */
  function whenReady(fn) {
    if (!enabled || !ensure()) return;
    if (ctx.state === "running") { fn(); return; }
    let done = false;
    const go = () => { if (!done && enabled && ctx.state === "running") { done = true; fn(); } };
    try { Promise.resolve(ctx.resume()).then(go); } catch (e) {}
    setTimeout(() => { done = true; }, 1200);   // passé ce délai, le son n'aurait plus de sens
  }

  function out(node, send, pan) {
    let n = node;
    if (pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan)); n.connect(p); n = p; }
    n.connect(master);
    if (send > 0) { const g = ctx.createGain(); g.gain.value = send; n.connect(g); g.connect(revIn); }
  }

  /* partiels (ratio, amplitude, durée relative) — la matière du son */
  const MALLET = [[1, 1, 1], [4, 0.22, 0.28], [9.6, 0.05, 0.1]];                 // marimba / bois doux
  const GLASS  = [[1, 1, 1], [2.76, 0.3, 0.6], [5.4, 0.12, 0.35], [8.93, 0.05, 0.2]]; // verre / carillon
  const SOFT   = [[1, 1, 1], [2, 0.14, 0.55]];                                    // piano électrique très doux
  const TINE   = [[1, 1, 1], [5.4, 0.16, 0.18]];                                 // kalimba

  /* voix : o = { f, to, parts, dur, v, a, at, lp, rev, pan } */
  function voice(o) {
    if (!ready()) return;
    const t = ctx.currentTime + (o.at || 0), dur = o.dur || 0.3, v = o.v || 0.12, a = o.a || 0.006;
    const parts = o.parts || SOFT;
    const sum = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.setValueAtTime(o.lp || 5200, t); lp.frequency.exponentialRampToValueAtTime(Math.max(600, (o.lp || 5200) * 0.35), t + dur);
    sum.gain.value = 1; sum.connect(lp);
    const detune = (Math.random() - 0.5) * 6;                 // ± 3 cents : vivant, pas "machine"
    parts.forEach(p => {
      const f = o.f * p[0]; if (f > 9000) return;
      const osc = ctx.createOscillator(), g = ctx.createGain(), d = Math.max(0.05, dur * p[2]);
      osc.type = "sine"; osc.detune.value = detune;
      osc.frequency.setValueAtTime(f, t);
      if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to * p[0], t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v * p[1], t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
      osc.connect(g); g.connect(sum);
      osc.start(t); osc.stop(t + a + d + 0.05);
    });
    out(lp, o.rev || 0, o.pan);
  }

  /* bruit filtré : o = { f0, f1, q, ft, dur, v, a, at, rev, pan, peak } */
  function noise(o) {
    if (!ready()) return;
    if (!nb) {
      nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = nb.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = ctx.currentTime + (o.at || 0), dur = o.dur || 0.2, v = o.v || 0.1, a = Math.min(o.a || 0.005, dur * 0.6);
    const s = ctx.createBufferSource(); s.buffer = nb; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = o.ft || "bandpass"; f.Q.value = o.q || 0.7;
    f.frequency.setValueAtTime(o.f0, t);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + a);
    if (o.peak) { g.gain.setValueAtTime(v, t + dur * o.peak); }  // enveloppe en cloche : monte jusqu'à `peak`, retombe ensuite
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); out(g, o.rev || 0, o.pan);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }

  /* grave arrondi (impact doux, jamais un "boom") */
  function thud(o) {
    voice({ f: o.f || 110, to: o.to || 52, parts: [[1, 1, 1], [2, 0.08, 0.4]], dur: o.dur || 0.22, v: o.v || 0.25, a: 0.004, lp: o.lp || 420, at: o.at, rev: o.rev || 0.08 });
  }

  /* petit clic tactile (bruit très bref + corps de bois) */
  function tick(o) {
    o = o || {};
    noise({ f0: o.f || 3200, q: 1.4, dur: 0.018, v: o.v || 0.07, a: 0.001, at: o.at, pan: o.pan });
    voice({ f: o.body || 240, to: (o.body || 240) * 0.7, parts: [[1, 1, 1]], dur: 0.05, v: (o.v || 0.07) * 0.9, a: 0.002, lp: 900, at: o.at, pan: o.pan });
  }

  /* ---------------------------------------------------------------
     PALETTES
     --------------------------------------------------------------- */
  const SEMI = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33];   // pentatonique majeure
  const hz = (s, base) => (base || 220) * Math.pow(2, s / 12);            // départ : La3
  const mode = () => root.classList.contains("uk") ? "uk" : root.classList.contains("may-active") ? "may" : "base";
  let lastIdx = -1;
  const vel = () => 0.85 + Math.random() * 0.3;                            // vélocité légèrement variable

  const S = {
    /* changement de projet : une page qui se tourne (le sens suit la direction du carrousel) */
    tick(i) {
      const m = mode(), v = vel(), dir = (typeof i === "number" && lastIdx >= 0) ? (((i - lastIdx + 15) % 15) <= 7 ? 1 : -1) : 1;
      lastIdx = typeof i === "number" ? i : lastIdx;
      const bright = m === "may" ? 1.25 : m === "uk" ? 0.9 : 1, pan = dir * 0.12;
      /* un seul froissé de papier, court et aérien : une page qu'on feuillette */
      noise({ f0: (dir > 0 ? 2800 : 4600) * bright, f1: (dir > 0 ? 5200 : 2400) * bright, q: 0.6, dur: 0.11, a: 0.025, v: 0.04 * v, pan: pan });
      noise({ f0: 7000, ft: "highpass", q: 0.4, dur: 0.07, a: 0.02, v: 0.009 * v, at: 0.015 });
    },
    /* survol d'une carte : presque imperceptible */
    hover() {
      const m = mode();
      if (m === "uk") noise({ f0: 5000, ft: "highpass", dur: 0.02, v: 0.025, a: 0.002 });
      else noise({ f0: 4200, q: 2.5, dur: 0.03, v: 0.022, a: 0.004, pan: (Math.random() - 0.5) * 0.4 });
    },
    /* départ (ouverture d'un projet, sortie) : petit souffle de papier, doux et rapide */
    whoosh() {
      const q = mode() === "uk" ? 1.1 : 0.5;
      noise({ f0: 500, f1: 2600, q, dur: 0.5, a: 0.22, v: 0.06, peak: 0.55, rev: 0.25 });
      noise({ f0: 4000, ft: "highpass", q: 0.4, dur: 0.35, a: 0.2, v: 0.012, at: 0.05 });
    },
    /* arrivée : même souffle, en sens inverse */
    settle() {
      const q = mode() === "uk" ? 1.1 : 0.5;
      noise({ f0: 2600, f1: 450, q, dur: 0.45, a: 0.06, v: 0.055, rev: 0.25 });
      noise({ f0: 4000, ft: "highpass", q: 0.4, dur: 0.3, a: 0.05, v: 0.01, rev: 0.1 });
    },
    /* ouverture / fermeture À propos & Contact : un petit froissé */
    open() {
      noise({ f0: 1200, f1: 4200, q: 0.7, dur: 0.16, a: 0.04, v: 0.05, rev: 0.15 });
      tick({ f: 2800, body: 200, v: 0.04, at: 0.12 });
    },
    close() {
      noise({ f0: 4200, f1: 1200, q: 0.7, dur: 0.14, a: 0.03, v: 0.045, rev: 0.15 });
      tick({ f: 2400, body: 180, v: 0.035, at: 0.1 });
    },
    /* bouton thème : petit clic d'interrupteur */
    theme() { tick({ f: 3200, body: 260, v: 0.07 }); tick({ f: 2400, body: 200, v: 0.04, at: 0.06 }); },
    /* bascule d'univers : deux clics secs */
    mode() { tick({ f: 3000, body: 230, v: 0.07 }); tick({ f: 2200, body: 170, v: 0.06, at: 0.08 }); },
    /* « Poster la lettre » : tampon sur papier, sourd et bref */
    stamp() {
      noise({ f0: 380, ft: "lowpass", q: 0.7, dur: 0.14, a: 0.003, v: 0.2, rev: 0.05 });
      noise({ f0: 1800, f1: 600, q: 0.9, dur: 0.07, a: 0.002, v: 0.06 });
    },
    click() { tick({ f: 3000, body: 250, v: 0.06 }); },
    /* son activé : deux micro-clics */
    on() { tick({ f: 3200, body: 260, v: 0.06 }); tick({ f: 3800, body: 300, v: 0.05, at: 0.07 }); }
  };
  window.__sfx = S;

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
  const isHome = !!$("stage");           // les pages projet n'ont pas de bouton : elles suivent le choix fait sur l'accueil
  let btn = null;
  if (isHome) {
    const st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    btn = document.createElement("button");
    btn.className = "snd"; btn.type = "button"; btn.id = "soundBtn";
    btn.innerHTML = '<span class="snd-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="snd-t"></span>';
    document.body.appendChild(btn);
  }

  function paint() {
    if (!btn) return;
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
  if (btn) btn.addEventListener("click", () => setEnabled(!enabled));
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

  /* ----- PAGES PROJET : entrée et sortie ----- */
  if (!isHome) {
    /* arrivée (depuis l'accueil, un autre projet…) */
    if (!matchMedia("(prefers-reduced-motion:reduce)").matches) whenReady(S.settle);
    /* sortie : fermer, projet suivant/précédent */
    if (typeof window.leave === "function") {
      const baseLeave = window.leave;
      window.leave = function () { S.whoosh(); return baseLeave.apply(this, arguments); };
    }
    return;
  }

  /* ----- ACCUEIL ----- */
  /* retour depuis un projet : le souffle se pose sur le carrousel */
  try { if (document.referrer.indexOf("/projet/") > -1 && !matchMedia("(prefers-reduced-motion:reduce)").matches) whenReady(S.settle); } catch (e) {}

  /* 1. changement de projet : on écoute le gros numéro (limité : pas de mitraillette en défilement rapide) */
  const num = $("num");
  let lastTick = 0;
  if (num && window.MutationObserver) {
    new MutationObserver(() => {
      if (!document.body.classList.contains("ui")) return;
      const now = performance.now();
      if (now - lastTick < 70) return;
      lastTick = now;
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
    if (c && c !== lastCard && now - lastT > 160) { lastCard = c; lastT = now; S.hover(); }
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
