/* =====================================================================
   MODE « LONDRES 70 » — photocopie, collage, pochette de fanzine

   INSTALLATION (index.html, juste avant </body>, APRÈS contact.js) :
       <script src="london70.js"></script>
   + mets le dossier  uk/  (les SVG) à côté de index.html.

   Un bouton « UK 70 » apparaît à côté du bouton « May » :
     - clic sur « UK 70 » -> le mode Londres s'active (clic encore = retour au mode May)
     - clic sur « May »    -> retour au mode May (ou tout éteindre si tu es déjà en May)

   TES PROPRES IMAGES : remplace les fichiers du dossier uk/ (même nom),
   ou modifie / ajoute des lignes dans la liste DECOR ci-dessous.
   Format conseillé : SVG (mais PNG / WebP marchent aussi).
   ===================================================================== */
(function () {
  "use strict";

  /* =================================================================
     À MODIFIER — LES DÉCORS
       file    : nom du fichier dans le dossier uk/
       pos     : où il se place (left / right / top / bottom, en vw, vh ou px)
       w       : largeur
       rot     : rotation en degrés
       float   : true = il flotte doucement
       mobile  : (facultatif) { pos:{…}, w:"…" } = version téléphone. Sans « mobile », il est caché sur téléphone.
     Pour en ajouter : copie une ligne, change le nom du fichier.
     ================================================================= */
  const FOLDER = "";
  const BG = "f1616a3c-1.svg";   // fond UK (dans le dossier uk/). "" = fond papier d'origine
  const DECOR = [
    { file: "safety-pin.svg", pos: { left: "35vw",  top: "8px"     }, w: "270px", rot: -4 },
    { file: "burst.svg",      pos: { right: "29vw", top: "5vh"     }, w: "145px", rot: 0,  float: true },
    { file: "scissors.svg",   pos: { left: "1.5vw", bottom: "21vh" }, w: "120px", rot: 18 },
    { file: "flower.svg",     pos: { right: "1.5vw", bottom: "4vh" }, w: "100px", rot: 8,  float: true,
      mobile: { pos: { right: "5vw", top: "36vh" }, w: "62px" } },
    { file: "label.svg",      pos: { left: "39vw",  bottom: "2.5vh" }, w: "300px", rot: -3 }
  ];
  /* ================================================================= */

  const KEY = "uk-mode";
  const root = document.documentElement;
  const DIR = (typeof IMG_DIR === "string") ? IMG_DIR : "";
  const isUrl = s => /^(https?:)?\/\//i.test(s) || /^(data|blob):/i.test(s);
  const src = f => isUrl(f) ? f : DIR + FOLDER + f;
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  };

  /* ---------------------------------------------------------------
     STYLE
     --------------------------------------------------------------- */
  const P  = "html:root.uk:not(.no-may)";                       // mode Londres actif
  const PD = 'html:root.uk[data-theme="dark"]:not(.no-may)';    // …en thème sombre
  const SPECK = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' seed='6' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  9 0 0 0 -5.6'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
  const TARTAN = "repeating-linear-gradient(90deg,rgba(0,0,0,.55) 0 9px,transparent 9px 26px,rgba(190,255,60,.5) 26px 28px,transparent 28px 40px)," +
                 "repeating-linear-gradient(0deg,rgba(0,0,0,.55) 0 9px,transparent 9px 26px,rgba(190,255,60,.5) 26px 28px,transparent 28px 40px),#b3121f";

  const BGL = BG ? `url("${src(BG)}") center/cover no-repeat fixed,` : "";

  const css = `
/* ---- variables : noir / papier photocopié / UN rose / un peu de tartan ---- */
${P}{
  --bg:#e6e2d8;--bg0:rgba(230,226,216,0);--ink:#0b0b0b;--mute:#6f6a5f;--line:#c9c3b3;
  --red:#d4152f;--pink:#ff2d8a;--yellow:#d9d4c6;--paper:#efece3;--black:#0b0b0b;--hard:#0b0b0b;
  --sh1:rgba(0,0,0,.25);--sh2:rgba(0,0,0,.12);
  --stn:"Stardos Stencil","Special Elite","Courier New",serif;
}
${PD}{
  --bg:#0c0c0c;--bg0:rgba(12,12,12,0);--ink:#efece3;--mute:#8f8a7e;--line:#2a2927;
  --yellow:#cfc9b8;--hard:#ff2d8a;--sh1:rgba(0,0,0,.7);--sh2:rgba(0,0,0,.45);
}

/* ---- fond : papier trame + poussière de photocopieuse ---- */
${P} body{background:${BGL}radial-gradient(circle,rgba(0,0,0,.14) 1px,transparent 1.5px) 0 0/6px 6px,var(--bg)}
${PD} body{background:${BGL}radial-gradient(circle,rgba(255,255,255,.09) 1px,transparent 1.5px) 0 0/6px 6px,var(--bg)}
${P} body::after{background-image:${SPECK};background-size:240px 240px;opacity:.34;mix-blend-mode:multiply;filter:none}
${PD} body::after{opacity:.24;mix-blend-mode:screen;filter:invert(1)}

/* ---- intro ---- */
${P} .loader .ld-half{background:radial-gradient(circle,rgba(255,255,255,.16) 1.1px,transparent 1.6px) 0 0/7px 7px,#0b0b0b}
${P} .loader{--ld-font:var(--stn)}
${P} .loader .ld-line{color:#efece3 !important;text-shadow:.05em .04em 0 #ff2d8a;transform:rotate(-1.5deg);font-weight:700}
${P} .loader .ld-bot .ld-line{transform:rotate(1deg)}
${P} .loader .ld-count{color:#efece3}

/* ---- nom vertical : étiquette Dymo ---- */
${P} .brand{font-family:var(--stn);font-weight:700;letter-spacing:.05em;background:var(--ink);color:var(--bg);padding:10px 5px;box-shadow:4px 4px 0 #ff2d8a}

/* ---- menu ---- */
${P} .nav small{font-family:var(--font)}
${P} .nav button{font-family:var(--stn);font-weight:700;letter-spacing:.02em;transition:transform .2s}
${P} .nav button:hover{transform:rotate(-2deg) translateX(4px)}
${P} .nav button[aria-current=true]{background:#ff2d8a;color:#0b0b0b;padding:0 .22em;margin-left:-.22em}

/* ---- infos à gauche ---- */
${P} .meta dt{font-family:var(--stn);font-weight:700;color:var(--pink);text-transform:uppercase}
${P} .meta dd{font-family:var(--font);font-weight:400}

/* ---- cartes : photos photocopiées, la carte active reprend ses couleurs ---- */
${P} .card{overflow:visible;padding:7px;background:var(--paper);border-radius:0;box-shadow:7px 7px 0 var(--hard)}
${P} .card img{height:100%;filter:grayscale(1) contrast(1.35) brightness(.96);transition:filter .5s ease}
${P} .card:hover img,${P} .card.is-on img{filter:none}
${P} .card::after{background:radial-gradient(circle,rgba(0,0,0,.6) .9px,transparent 1.35px) 0 0/4px 4px;mix-blend-mode:multiply;opacity:.5;transition:opacity .5s ease}
${P} .card:hover::after,${P} .card.is-on::after{opacity:0}
${P} .card::before{background:${TARTAN};opacity:.92;transform:rotate(-3deg);top:-14px;height:26px}
${P} .card:nth-child(even)::before{background:${TARTAN};transform:rotate(2.5deg)}
${P} .card:nth-child(3n)::before{background:${TARTAN};transform:rotate(-1deg)}

/* ---- numéro géant : impression décalée ---- */
${P} .counter b{font-family:var(--stn);font-weight:700;color:var(--ink);letter-spacing:-.02em;-webkit-text-stroke:0;text-shadow:7px 6px 0 #ff2d8a}
${PD} .counter b{-webkit-text-stroke:0;text-shadow:7px 6px 0 #ff2d8a}
${P} .counter span,${P} .hint{font-family:var(--font)}

/* ---- liste de droite ---- */
${P} .item .cat{display:inline-block;background:var(--ink);color:var(--bg);padding:3px 10px 1px;font-family:var(--font);text-transform:uppercase;
  letter-spacing:.22em;font-size:11px;transform:rotate(-1.5deg);box-shadow:inset 0 0 0 1px rgba(128,128,128,.55)}
${PD} .item .cat{background:var(--ink);color:var(--bg)}
${P} .item .ttl{font-family:var(--stn);font-weight:700;letter-spacing:.01em}
${P} .item .bar{width:46px;height:10px;background:
  linear-gradient(135deg,#ff2d8a 25%,transparent 25%) -5px 0/10px 10px,
  linear-gradient(225deg,#ff2d8a 25%,transparent 25%) -5px 0/10px 10px}
${P} .item .dsc{font-family:var(--font)}

/* ---- fenêtre projet ---- */
${P} .modal-number,${P} .modal-type{font-family:var(--font);text-transform:uppercase;letter-spacing:.18em}
${P} .modal-close,${P} .modal-nav button{font-family:var(--stn);font-weight:700}
${P} .modal-title{font-family:var(--stn);font-weight:700;color:var(--ink);text-shadow:4px 4px 0 #ff2d8a;letter-spacing:-.01em}
${PD} .modal-title{color:var(--ink);text-shadow:4px 4px 0 #ff2d8a}
${P} .modal-details dt{font-family:var(--stn);font-weight:700;color:var(--pink)}
${P} .b-heading,${P} .ab-h,${P} .c-h{font-family:var(--stn);font-weight:700;text-transform:uppercase;background:var(--yellow);color:#0b0b0b;letter-spacing:.02em;
  transform:rotate(-1deg);box-shadow:3px 3px 0 #ff2d8a}
${P} .b-img img,${P} .b-gallery img{border:3px solid var(--ink);box-shadow:8px 8px 0 #ff2d8a;filter:contrast(1.08)}
${PD} .b-img img,${PD} .b-gallery img{border-color:var(--ink);box-shadow:8px 8px 0 #ff2d8a}
${P} .b-link{font-family:var(--stn);font-weight:700;background:var(--ink);color:var(--bg);border:3px solid var(--ink);box-shadow:5px 5px 0 #ff2d8a}
${P} .b-link:hover{background:var(--ink);color:var(--bg);transform:translate(3px,3px);box-shadow:2px 2px 0 #ff2d8a}

/* ---- panneaux À propos / Contact ---- */
${P} .panel{background:${BGL}radial-gradient(circle,rgba(0,0,0,.14) 1px,transparent 1.5px) 0 0/6px 6px,var(--bg)}
${PD} .panel{background:${BGL}radial-gradient(circle,rgba(255,255,255,.09) 1px,transparent 1.5px) 0 0/6px 6px,var(--bg)}
${P} .panel .close{font-family:var(--stn);font-weight:700}
${P} .tl-p,${P} .sk-n,${P} .about-hint{font-family:var(--stn);font-weight:700;color:var(--pink)}
${P} .tl-t{font-family:var(--stn);font-weight:700}
${P} .chip{box-shadow:3px 3px 0 #ff2d8a}
${P} .c-btn{font-family:var(--stn);font-weight:700}
${P} .c-btn.alt,${P} .c-stamp{background:#d9d4c6}
${P} .c-name{font-family:var(--stn);font-weight:700}

/* ---- décors (tes SVG) ---- */
.uk-layer{display:none}
${P} .may-deco{display:none !important}
${P} .uk-layer{display:block;position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.uk-deco{position:absolute;display:block;height:auto;transform:rotate(var(--rot,0deg));-webkit-user-drag:none;user-select:none}
.uk-deco.fl{animation:ukFloat 8s ease-in-out infinite}
.uk-deco.fl:nth-of-type(odd){animation-duration:10s;animation-delay:-3s}
@keyframes ukFloat{50%{transform:translateY(-12px) rotate(calc(var(--rot,0deg) + 5deg))}}

/* ---- bouton « UK 70 » ---- */
.uk-btn{position:fixed;z-index:11;right:calc(160px + var(--sr));top:calc(14px + var(--st));
  font-family:"Permanent Marker","Marker Felt",cursive;font-size:19px;line-height:1;padding:8px 14px 5px;
  background:#0b0b0b;color:#efece3;border:3px solid #0b0b0b;border-radius:0;box-shadow:4px 4px 0 #ff2d8a;transform:rotate(3deg);
  transition:transform .2s,box-shadow .2s,background .2s,color .2s}
:root[data-theme="dark"] .uk-btn{border-color:#efece3}
.uk-btn:hover{transform:rotate(-3deg) scale(1.08)}
.uk-btn:active{transform:translate(3px,3px) rotate(3deg);box-shadow:1px 1px 0 #ff2d8a}
${P} .uk-btn{background:#ff2d8a;color:#0b0b0b;border-color:#0b0b0b;box-shadow:4px 4px 0 #0b0b0b}
${PD} .uk-btn{border-color:#efece3;box-shadow:4px 4px 0 #efece3}
:root.no-may .uk-btn{opacity:.85}

@media(max-width:860px){
  .uk-btn{right:calc(88px + var(--sr));top:calc(52px + var(--st));font-size:16px;padding:6px 10px 3px}
  ${P} .brand{padding:7px 3px;box-shadow:3px 3px 0 #ff2d8a}
  ${P} .nav button{font-size:17px}
  ${P} .card{padding:5px;box-shadow:5px 5px 0 var(--hard)}
  ${P} .counter b{text-shadow:4px 4px 0 #ff2d8a}
}
@media(prefers-reduced-motion:reduce){.uk-deco.fl{animation:none}}
`;
  const style = document.createElement("style");
  style.id = "uk-style";
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------------------------------------------------------
     POLICE (chargée seulement quand le mode est utilisé)
     --------------------------------------------------------------- */
  let fontDone = false;
  function loadFont() {
    if (fontDone) return; fontDone = true;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Stardos+Stencil:wght@400;700&display=swap";
    document.head.appendChild(l);
  }

  /* ---------------------------------------------------------------
     DÉCORS
     --------------------------------------------------------------- */
  let layer = null, items = [];
  const mq = window.matchMedia ? matchMedia("(max-width:860px)") : { matches: false };
  function place(it) {
    const { el, cfg } = it;
    const m = mq.matches;
    el.style.left = el.style.right = el.style.top = el.style.bottom = "auto";
    if (m && !cfg.mobile) { el.style.display = "none"; return; }
    el.style.display = "";
    const pos = (m && cfg.mobile.pos) || cfg.pos || {};
    Object.keys(pos).forEach(k => { el.style[k] = pos[k]; });
    el.style.width = (m && cfg.mobile.w) || cfg.w || "120px";
  }
  function ensureDecor() {
    if (layer) return;
    layer = document.createElement("div");
    layer.className = "uk-layer";
    layer.setAttribute("aria-hidden", "true");
    DECOR.forEach(cfg => {
      const img = new Image();
      img.className = "uk-deco" + (cfg.float ? " fl" : "");
      img.alt = ""; img.draggable = false; img.decoding = "async";
      img.src = src(cfg.file);
      img.style.setProperty("--rot", (cfg.rot || 0) + "deg");
      img.onerror = () => { img.style.display = "none"; };       // fichier absent : on ignore
      layer.appendChild(img);
      items.push({ el: img, cfg });
    });
    document.body.insertBefore(layer, document.body.firstChild);
    items.forEach(place);
    if (mq.addEventListener) mq.addEventListener("change", () => items.forEach(place));
    else if (mq.addListener) mq.addListener(() => items.forEach(place));
  }

  /* ---------------------------------------------------------------
     CARTE ACTIVE : elle reprend ses couleurs (les autres restent photocopiées)
     --------------------------------------------------------------- */
  let obs = null;
  function markActive() {
    const n = document.getElementById("num");
    const stage = document.getElementById("stage");
    if (!n || !stage) return;
    const idx = parseInt(n.textContent, 10) - 1;
    [].forEach.call(stage.querySelectorAll(".card"), (c, i) => c.classList.toggle("is-on", i === idx));
  }
  function watchActive() {
    markActive();
    if (obs) return;
    const n = document.getElementById("num");
    if (!n || !window.MutationObserver) return;
    obs = new MutationObserver(markActive);
    obs.observe(n, { childList: true, characterData: true, subtree: true });
  }

  /* ---------------------------------------------------------------
     BOUTON + ÉTAT
     --------------------------------------------------------------- */
  const btn = document.createElement("button");
  btn.className = "uk-btn";
  btn.type = "button";
  btn.textContent = "UK 70";

  function sync() {
    const on = root.classList.contains("uk") && !root.classList.contains("no-may");
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "Quitter le mode Londres 70" : "Activer le mode Londres 70");
    btn.title = on ? "Mode Londres 70 : activé" : "Mode Londres 70 : désactivé";
  }
  function setUK(on) {
    root.classList.toggle("uk", on);
    store.set(on ? "on" : "off");
    if (on) {
      if (root.classList.contains("no-may")) {                    // le mode Londres s'appuie sur le mode May : on le rallume
        root.classList.remove("no-may");
        try { localStorage.setItem("may-mode", "on"); } catch (e) {}
      }
      loadFont(); ensureDecor(); watchActive();
    }
    sync();
  }

  btn.addEventListener("click", () => setUK(!root.classList.contains("uk")));

  /* « May » pendant le mode Londres = retour au mode May (pas tout éteindre) */
  document.addEventListener("click", e => {
    const m = e.target.closest && e.target.closest(".may-btn");
    if (m && root.classList.contains("uk") && !root.classList.contains("no-may")) {
      e.stopImmediatePropagation();
      e.preventDefault();
      setUK(false);
    }
  }, true);

  document.body.appendChild(btn);

  if (store.get() === "on") { root.classList.add("uk"); loadFont(); ensureDecor(); watchActive(); }
  sync();
})();
