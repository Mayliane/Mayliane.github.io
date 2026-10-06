/* =====================================================================
   EXTRAS — à charger EN DERNIER dans index.html :
       <script src="extras.js"></script>
   1. Logo fixe (favicon.png) à côté du menu, dans tous les modes
   2. UK70 : plus de scotch sur les images
   3. Contact : logo sur l'enveloppe (timbre) + enveloppe neutre « passe-partout »
   4. May : mode clair bloqué (sombre forcé)
   ===================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const DIR = (typeof IMG_DIR === "string") ? IMG_DIR : "";
  const LOGO = DIR + "favicon.png";
  const NAME = (typeof CONFIG !== "undefined" && CONFIG.name) || "Mayliane Lefebvre";

  /* ---------------------------------------------------------------
     STYLE
     --------------------------------------------------------------- */
  const css = `
/* 1. logo fixe */
.site-logo{position:fixed;z-index:10;display:block;object-fit:contain;pointer-events:none;
  user-select:none;-webkit-user-drag:none}

/* 2. UK70 : pas de scotch + on retire l'ancien logo flottant (doublon) */
:root.uk .card::before{display:none!important;content:none!important}
.uk-deco[src$="favicon.png"]{display:none!important}

/* 4. May : bouton clair/sombre verrouillé */
:root.may-active .themebtn{opacity:.35;pointer-events:none;cursor:not-allowed}

/* 3. enveloppe passe-partout : sobre, lisible dans les 3 modes */
html .c-card{border:1px solid #0b0b0b;border-image:none;outline:1px dashed rgba(11,11,11,.28);outline-offset:-10px;
  padding:48px 28px 30px;box-shadow:0 22px 50px rgba(0,0,0,.28),0 2px 6px rgba(0,0,0,.15)}
html:not(.no-may) .c-card{box-shadow:9px 9px 0 var(--hard,#0b0b0b)}   /* May + UK70 : ombre dure */
html .c-air{color:#555}
html.no-may .c-name{color:#0b0b0b}
html.no-may .c-btn{background:#0b0b0b;color:#f6f3ec;box-shadow:none}
html.no-may .c-btn.alt{background:transparent;color:#0b0b0b}
html .c-stamp{width:84px;padding:6px;background:#fff;outline:2px dashed rgba(11,11,11,.55);outline-offset:-3px}
.c-stamp img{display:block;width:100%;height:auto;object-fit:contain}
@media(max-width:860px){html .c-stamp{width:68px}}

/* UK70 : épingle plus petite (change width / top pour ajuster) */
.uk-deco[src$="epingle.svg"]{width:160px!important;top:-18px!important}

/* UK70 : pins rose en bas à gauche, à côté du numéro (invisible dans les autres modes) */
.pins-rose{display:none;position:fixed;z-index:11;left:5vw;bottom:9vh;width:110px;height:auto;
  transform:rotate(-8deg);pointer-events:none;user-select:none;-webkit-user-drag:none}
:root.uk .pins-rose{display:block}
@media(max-width:860px){.pins-rose{left:150px;bottom:22px;width:56px}}

/* UK70 : panneau en bas à droite (invisible dans les autres modes) */
.panneau-uk{display:none;position:fixed;z-index:11;right:2.5vw;bottom:4vh;width:150px;height:auto;
  pointer-events:none;user-select:none;-webkit-user-drag:none}
:root.uk .panneau-uk{display:block}
@media(max-width:860px){.panneau-uk{right:4vw;bottom:62px;width:60px}}

/* May : stickers en bas à gauche, à côté du numéro (invisible dans les autres modes) */
.stickers-may{display:none;position:fixed;z-index:11;left:4.5vw;bottom:9vh;width:130px;height:auto;
  transform:rotate(-6deg);pointer-events:none;user-select:none;-webkit-user-drag:none}
:root.may-active .stickers-may{display:block}
@media(max-width:860px){.stickers-may{left:150px;bottom:22px;width:64px}}

/* May : nom « Mayliane Lefebvre » de l'intro plus lisible (jaune + contour noir épais).
   Pour changer la couleur : modifie ##6d071a */
html.may-active .loader .ld-line{color:#6d071a!important;-webkit-text-stroke:.05em #0b0b0b;paint-order:stroke fill;
  text-shadow:.06em .06em 0 #0b0b0b}

/* May : intro avec « Transition pop.svg » (l'image est coupée en deux, haut/bas, comme le panneau) */
html.may-active .loader.has-pop .ld-half{background-image:var(--pop-img);background-repeat:no-repeat;
  background-color:#000;background-size:var(--pop-w) var(--pop-h)}
html.may-active .loader.has-pop .ld-top{background-position:var(--pop-x) var(--pop-y)}
html.may-active .loader.has-pop .ld-bot{background-position:var(--pop-x) var(--pop-yb)}
`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------------------------------------------------------
     1. LOGO FIXE À CÔTÉ DU MENU (suit la largeur réelle du menu)
     --------------------------------------------------------------- */
  const logo = new Image();
  logo.className = "site-logo";
  logo.alt = "Logo " + NAME;
  logo.draggable = false;
  logo.src = LOGO;
  logo.onerror = () => { logo.style.display = "none"; };
  document.body.appendChild(logo);

  function placeLogo() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const r = nav.getBoundingClientRect();
    const mobile = innerWidth <= 860;
    let size, left;
    if (mobile) {                                   // téléphone : pas de place à gauche (nom vertical), on garde la droite
      size = 30;
      left = Math.min(r.right + 14, innerWidth - 50 - size);
    } else {                                        // ordinateur : à gauche du menu
      const gap = 28, brandZone = 64;               // brandZone = place prise par le nom vertical
      size = Math.max(0, Math.min(64, r.left - brandZone - gap));
      left = r.left - gap - size;
    }
    logo.style.display = size < 28 ? "none" : "";
    logo.style.width = logo.style.height = size + "px";
    logo.style.left = left + "px";
    logo.style.top = (r.top + (r.height - size) / 2) + "px";   // centré sur la hauteur du menu
  }
  placeLogo();
  addEventListener("resize", placeLogo);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeLogo);
  const navEl = document.querySelector(".nav");
  if (navEl && window.ResizeObserver) new ResizeObserver(placeLogo).observe(navEl);

  /* ---------------------------------------------------------------
     4. MAY : MODE CLAIR BLOQUÉ
     --------------------------------------------------------------- */
  const themeBtn = document.getElementById("themeBtn");

  function enforceMayDark() {
    const may = root.classList.contains("may-active");
    if (may) {
      if (root.getAttribute("data-theme") !== "dark") {
        root.setAttribute("data-theme", "dark");
        try { localStorage.setItem("theme", "dark"); } catch (e) {}
        const tm = document.querySelector('meta[name="theme-color"]');
        if (tm) tm.setAttribute("content", "#121212");
      }
      if (themeBtn) {
        themeBtn.setAttribute("aria-disabled", "true");
        themeBtn.setAttribute("tabindex", "-1");
      }
    } else if (themeBtn && !root.classList.contains("uk")) {
      themeBtn.removeAttribute("aria-disabled");
      themeBtn.removeAttribute("tabindex");
    }
    placeLogo();
  }
  /* bloque aussi le clavier / tout autre déclencheur */
  document.addEventListener("click", e => {
    if (!root.classList.contains("may-active")) return;
    if (e.target.closest && e.target.closest("#themeBtn")) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
  new MutationObserver(enforceMayDark).observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
  enforceMayDark();

  /* ---------------------------------------------------------------
     3. CONTACT : logo en timbre + cachet neutre
     --------------------------------------------------------------- */
  const year = new Date().getFullYear();
  const POST =
    '<svg class="c-pm" viewBox="0 0 150 100" aria-hidden="true">' +
    '<defs><path id="cPmPath2" d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0"/></defs>' +
    '<g fill="none" stroke="#444" stroke-width="2.2"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="24"/>' +
    '<path d="M96,32 q7,-6 14,0 t14,0 t14,0"/><path d="M96,44 q7,-6 14,0 t14,0 t14,0"/>' +
    '<path d="M96,56 q7,-6 14,0 t14,0 t14,0"/><path d="M96,68 q7,-6 14,0 t14,0 t14,0"/></g>' +
    '<text font-family="Special Elite,monospace" font-size="9.5" fill="#444"><textPath href="#cPmPath2" textLength="200" lengthAdjust="spacing">PORTFOLIO ★ COURRIER ★ PORTFOLIO ★</textPath></text>' +
    '<text x="50" y="55" text-anchor="middle" font-family="Special Elite,monospace" font-size="11" fill="#444">' + year + '</text></svg>';

  function tuneEnvelope(card) {
    const stamp = card.querySelector(".c-stamp");
    if (stamp) {
      stamp.textContent = "";
      const im = new Image();
      im.src = LOGO; im.alt = "Logo " + NAME; im.draggable = false;
      im.onerror = () => { im.style.display = "none"; };
      stamp.appendChild(im);
    }
    const pm = card.querySelector(".c-pm");
    if (pm) pm.outerHTML = POST;
  }

  /* ---------------------------------------------------------------
     UK70 : pins rose (affiché seulement en UK70, voir CSS)
     --------------------------------------------------------------- */
  const pins = new Image();
  pins.className = "pins-rose";
  pins.alt = ""; pins.draggable = false;
  pins.src = encodeURI(DIR + "pins rose.svg");
  pins.onerror = () => { pins.style.display = "none"; };
  document.body.appendChild(pins);

  /* ---------------------------------------------------------------
     UK70 : panneau en bas à droite (affiché seulement en UK70, voir CSS)
     --------------------------------------------------------------- */
  const panneau = new Image();
  panneau.className = "panneau-uk";
  panneau.alt = ""; panneau.draggable = false;
  panneau.src = encodeURI(DIR + "panneau.png");
  panneau.onerror = () => { panneau.style.display = "none"; };
  document.body.appendChild(panneau);

  /* ---------------------------------------------------------------
     MAY : stickers (affichés seulement en mode May, voir CSS)
     --------------------------------------------------------------- */
  const stickers = new Image();
  stickers.className = "stickers-may";
  stickers.alt = ""; stickers.draggable = false;
  stickers.src = encodeURI(DIR + "stickers.svg");
  stickers.onerror = () => { stickers.style.display = "none"; };
  document.body.appendChild(stickers);

  /* ---------------------------------------------------------------
     MAY : intro avec « Transition pop.svg » (fichier à côté de index.html)
     --------------------------------------------------------------- */
  const POP = encodeURI(DIR + "Transition pop.svg");
  const loaderEl = document.getElementById("loader");
  if (loaderEl) {
    let nw = 1600, nh = 900;                                // dimensions provisoires, corrigées dès que l'image est lue
    const fit = () => {                                     // « cover » sur tout l'écran, réparti sur les 2 moitiés
      const vw = innerWidth, vh = innerHeight, s = Math.max(vw / nw, vh / nh);
      const w = nw * s, h = nh * s, x = (vw - w) / 2, y = (vh - h) / 2;
      const set = (k, v) => loaderEl.style.setProperty(k, v + "px");
      set("--pop-w", w); set("--pop-h", h); set("--pop-x", x); set("--pop-y", y); set("--pop-yb", y - vh / 2);
    };
    /* appliqué TOUT DE SUITE : le navigateur charge l'image en même temps, plus d'attente avant l'affichage */
    fit();
    addEventListener("resize", fit);
    loaderEl.style.setProperty("--pop-img", 'url("' + POP + '")');
    loaderEl.classList.add("has-pop");

    const pop = new Image();
    pop.onload = () => { if (pop.naturalWidth) { nw = pop.naturalWidth; nh = pop.naturalHeight; fit(); } };
    pop.onerror = () => loaderEl.classList.remove("has-pop");   // fichier absent : l'intro d'origine revient
    pop.src = POP;
  }

  const baseOpen = window.openPanel;
  if (typeof baseOpen === "function") {
    window.openPanel = function (k) {
      const r = baseOpen.apply(this, arguments);
      if (k === "contact") {
        const card = document.querySelector("#panel-in .c-card");
        if (card) tuneEnvelope(card);
      }
      return r;
    };
  } else {
    console.warn("extras.js : openPanel introuvable (charge ce script après contact.js).");
  }
})();
