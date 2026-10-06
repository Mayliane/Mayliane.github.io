/* ================================================================
   MAY.JS — UNIVERS MAY
   ================================================================ */
(function () {
  "use strict";

  /* ================================================================
     CONFIGURATION
     ================================================================ */

  var CONFIG = {
    /* May est désactivé au premier chargement */
    active: false,

    /* Dossier contenant les fichiers du mode May */
    folder: "may/",

    /* Couleurs du mode May */
    colors: {
      bg: "#efece4",
      ink: "#0b0b0b",
      red: "#c8102e",
      pink: "#ff3c8e",
      yellow: "#ffd400",
      paper: "#f6f3ec"
    },

    /* Décorations */
    decor: [
      {
        file: "pin.svg",
        className: "d-pin",
        pos: {
          left: "35vw",
          top: "9px"
        },
        w: "210px",
        rot: -3
      },

      {
        file: "star.svg",
        className: "d-star",
        pos: {
          right: "29vw",
          top: "5vh"
        },
        w: "150px",
        rot: 0,
        float: true
      },

      {
        file: "flower.svg",
        className: "d-flower",
        pos: {
          left: "1.5vw",
          bottom: "24vh"
        },
        w: "92px",
        rot: 0,
        float: true,

        mobile: {
          pos: {
            right: "5vw",
            top: "34vh"
          },
          w: "64px"
        }
      },

      {
        file: "lips.svg",
        className: "d-lips",
        pos: {
          right: "1.8vw",
          bottom: "2.5vh"
        },
        w: "120px",
        rot: 6
      }
    ]
  };


  /* ================================================================
     VARIABLES
     ================================================================ */

  var root = document.documentElement;
  var KEY = "may-mode";


  /* ================================================================
     STYLE MAY
     ================================================================ */

  var style = document.createElement("style");

  style.id = "may-style";

  style.textContent = `

/* ================================================================
   UNIVERS MAY
   ================================================================ */

/* ---------- VARIABLES ---------- */

:root:not(.no-may) {
  --bg: var(--may-bg);
  --bg0: rgba(239,236,228,0);
  --ink: var(--may-ink);
  --mute: #6b655c;
  --line: #cfc9bc;

  --sh1: rgba(0,0,0,.2);
  --sh2: rgba(0,0,0,.1);

  --font: "Special Elite","Courier New",monospace;
  --mk: "Permanent Marker","Marker Felt",cursive;

  --red: var(--may-red);
  --pink: var(--may-pink);
  --yellow: var(--may-yellow);
  --paper: var(--may-paper);

  --black: var(--may-ink);
  --hard: var(--may-ink);
}


/* ---------- MODE MAY ACTIF ---------- */

:root.may-active {
  --may-bg: #efece4;
  --may-ink: #0b0b0b;
  --may-red: #c8102e;
  --may-pink: #ff3c8e;
  --may-yellow: #ffd400;
  --may-paper: #f6f3ec;
}


/* ================================================================
   BACKGROUND MAY
   ================================================================ */

/*
   Fond pop.svg est utilisé uniquement lorsque May est actif.
*/

:root:not(.no-may) body {
  background:
    url("Fond pop.svg")
    center center /
    cover
    no-repeat
    fixed;
}


/* ================================================================
   MODE SOMBRE — MAY
   ================================================================ */

:root[data-theme="dark"]:not(.no-may) {
  --bg: #0b0b0b;
  --bg0: rgba(11,11,11,0);
  --ink: #f1eee6;
  --mute: #8c867b;
  --line: #2a2927;

  --sh1: rgba(0,0,0,.6);
  --sh2: rgba(0,0,0,.4);

  --hard: #ff3c8e;
}


/* ================================================================
   INTRO / LOADER
   ================================================================ */

:root:not(.no-may) .loader {
  --ld-font: "Permanent Marker","Marker Felt",cursive;
}

:root:not(.no-may) .loader .ld-line {
  color: #f6f3ec !important;
  text-transform: uppercase;
  letter-spacing: .01em;
  text-shadow: .05em .05em 0 #0b0b0b;
  transform: rotate(-2deg);
}

:root:not(.no-may) .loader .ld-bot .ld-line {
  transform: rotate(1.5deg);
}

:root:not(.no-may) .loader .ld-count {
  color: #f6f3ec;
  font-family: "Special Elite",monospace;
}


/* ================================================================
   TARTAN
   ================================================================ */

:root:not(.no-may) .tartan,
:root:not(.no-may) .loader .ld-half {
  background:
    repeating-linear-gradient(
      90deg,
      rgba(0,0,0,.5) 0 12px,
      transparent 12px 44px,
      rgba(190,255,60,.6) 44px 47px,
      transparent 47px 66px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(0,0,0,.5) 0 12px,
      transparent 12px 44px,
      rgba(190,255,60,.6) 44px 47px,
      transparent 47px 66px
    ),
    #c8102e;
}


/* ================================================================
   NOM / BRAND
   ================================================================ */

:root:not(.no-may) .brand {
  font-family: var(--mk);
  font-weight: 400;
  color: var(--black);
  background: var(--yellow);
  padding: 10px 5px;
  box-shadow: 4px 4px 0 var(--hard);
  letter-spacing: .02em;
}


/* ================================================================
   MENU
   ================================================================ */

:root:not(.no-may) .nav small {
  font-family: var(--font);
  text-transform: uppercase;
  letter-spacing: .12em;
}

:root:not(.no-may) .nav button {
  font-family: var(--mk);
  font-weight: 400;
  letter-spacing: .01em;
  transition: transform .2s;
}

:root:not(.no-may) .nav button:hover {
  transform: rotate(-3deg) translateX(4px);
}

:root:not(.no-may) .nav button[aria-current="true"] {
  background:
    linear-gradient(
      transparent 52%,
      var(--yellow) 52% 92%,
      transparent 92%
    );

  color: var(--black);
  padding: 0 .2em;
  margin-left: -.2em;
}

:root:not(.no-may) .nav button[aria-current="true"]::before {
  content: none;
}


/* ================================================================
   INFOS
   ================================================================ */

:root:not(.no-may) .meta dt {
  font-family: var(--mk);
  font-weight: 400;
  color: var(--red);
  text-transform: uppercase;
}

:root:not(.no-may) .meta dd {
  font-family: var(--font);
  font-weight: 400;
}


/* ================================================================
   CARTES
   ================================================================ */

:root:not(.no-may) .card {
  overflow: visible;
  padding: 8px;
  background: var(--paper);
  border-radius: 0;
  box-shadow: 9px 9px 0 var(--hard);
}

:root:not(.no-may) .card img {
  height: 100%;
  filter: contrast(1.05) saturate(1.1);
}

:root:not(.no-may) .card:hover img {
  transform: none;
}

:root:not(.no-may) .card::before {
  content: "";
  position: absolute;
  z-index: 3;
  top: -15px;
  left: 50%;
  width: 34%;
  height: 28px;
  margin-left: -17%;

  background: rgba(255,212,0,.82);

  transform: rotate(-4deg);

  clip-path:
    polygon(
      0 8%,
      4% 0,
      8% 10%,
      12% 0,
      100% 0,
      96% 25%,
      100% 50%,
      96% 75%,
      100% 100%,
      10% 100%,
      6% 88%,
      0 100%,
      3% 50%
    );
}

:root:not(.no-may) .card:nth-child(even)::before {
  background: rgba(255,60,142,.8);
  transform: rotate(3deg);
}

:root:not(.no-may) .card:nth-child(3n)::before {
  background: rgba(246,243,236,.85);
  transform: rotate(-1deg);
}


/* ================================================================
   COMPTEUR
   ================================================================ */

:root:not(.no-may) .counter b {
  font-family: var(--mk);
  font-weight: 400;
  color: var(--red);
  letter-spacing: -.02em;

  -webkit-text-stroke: 2px var(--black);
  paint-order: stroke fill;

  text-shadow: 7px 7px 0 var(--black);
}

:root[data-theme="dark"]:not(.no-may) .counter b {
  -webkit-text-stroke: 0;
  text-shadow: 7px 7px 0 var(--pink);
}

:root:not(.no-may) .counter span {
  font-family: var(--font);
  font-weight: 400;
}

:root:not(.no-may) .hint {
  font-family: var(--font);
  text-transform: uppercase;
  letter-spacing: .1em;
}


/* ================================================================
   LISTE
   ================================================================ */

:root:not(.no-may) .item .cat {
  display: inline-block;

  background: var(--black);
  color: var(--paper);

  padding: 3px 9px 1px;

  font-family: var(--font);
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: 12px;

  transform: rotate(-2deg);
}

:root[data-theme="dark"]:not(.no-may) .item .cat {
  background: var(--pink);
  color: var(--black);
}

:root:not(.no-may) .item .ttl {
  font-family: var(--mk);
  font-weight: 400;
  letter-spacing: .005em;
}

:root:not(.no-may) .item .bar {
  width: 44px;
  height: 10px;

  background:
    linear-gradient(
      135deg,
      var(--red) 25%,
      transparent 25%
    ) -5px 0/10px 10px,

    linear-gradient(
      225deg,
      var(--red) 25%,
      transparent 25%
    ) -5px 0/10px 10px;
}

:root:not(.no-may) .item .dsc {
  font-family: var(--font);
}


/* ================================================================
   FENÊTRE PROJET
   ================================================================ */

:root:not(.no-may) .modal-bar {
  background:
    linear-gradient(
      var(--bg) 62%,
      var(--bg0)
    );
}

:root:not(.no-may) .modal-number,
:root:not(.no-may) .modal-type {
  font-family: var(--font);
  text-transform: uppercase;
  letter-spacing: .1em;
}

:root:not(.no-may) .modal-close {
  font-family: var(--mk);
  font-weight: 400;
  font-size: 18px;
}

:root:not(.no-may) .modal-title {
  font-family: var(--mk);
  font-weight: 400;
  letter-spacing: -.01em;
  color: var(--red);

  text-shadow: 4px 4px 0 var(--black);
}

:root[data-theme="dark"]:not(.no-may) .modal-title {
  text-shadow: 4px 4px 0 var(--pink);
  color: var(--paper);
}

:root:not(.no-may) .modal-desc,
:root:not(.no-may) .b-text {
  font-family: var(--font);
}

:root:not(.no-may) .modal-details dt {
  font-family: var(--mk);
  color: var(--red);
  font-weight: 400;
}

:root:not(.no-may) .modal-details dd {
  font-family: var(--font);
  font-weight: 400;
}

:root:not(.no-may) .modal-nav button {
  font-family: var(--mk);
}

:root:not(.no-may) .b-heading {
  font-family: var(--mk);
  font-weight: 400;

  display: inline-block;
  align-self: flex-start;

  background: var(--yellow);
  color: var(--black);

  padding: 4px 12px 2px;

  transform: rotate(-1.5deg);
  letter-spacing: 0;
}

:root:not(.no-may) .b-img img,
:root:not(.no-may) .b-gallery img {
  border: 3px solid var(--black);
  box-shadow: 8px 8px 0 var(--red);
}

:root[data-theme="dark"]:not(.no-may) .b-img img,
:root[data-theme="dark"]:not(.no-may) .b-gallery img {
  border-color: var(--paper);
  box-shadow: 8px 8px 0 var(--pink);
}

:root:not(.no-may) .b-img {
  margin-bottom: 6px;
}

:root:not(.no-may) .b-link {
  font-family: var(--mk);
  font-weight: 400;

  border: 3px solid var(--black);
  background: var(--pink);
  color: var(--black);

  box-shadow: 5px 5px 0 var(--black);

  transition:
    transform .15s,
    box-shadow .15s;
}

:root:not(.no-may) .b-link:hover {
  background: var(--pink);
  color: var(--black);

  transform: translate(3px,3px);

  box-shadow: 2px 2px 0 var(--black);
}


/* ================================================================
   PANNEAU À PROPOS / CONTACT
   ================================================================ */

:root:not(.no-may) .panel {
  background:
    url("Fond pop.svg")
    center center /
    cover
    no-repeat
    fixed;
}

:root:not(.no-may) .panel h2 {
  font-size: clamp(38px,7vw,92px);
  line-height: 1.15;
  margin-bottom: 44px;
  font-weight: 400;
}

:root:not(.no-may) .panel p {
  font-family: var(--font);
}

:root:not(.no-may) .panel .close {
  font-family: var(--mk);
  font-weight: 400;
  font-size: 18px;
}

:root:not(.no-may) .panel .legal {
  font-family: var(--font);
}


/* ================================================================
   RANSOM NOTE
   ================================================================ */

:root:not(.no-may) .rn {
  display: inline-block;

  padding: .03em .1em 0;
  margin: 0 .03em .08em;

  line-height: 1.05;

  transform: rotate(var(--rot,0deg));

  box-shadow: 2px 2px 0 rgba(0,0,0,.35);
}

:root:not(.no-may) .rn.r0 {
  background: var(--paper);
  color: var(--black);
  font-family: "Special Elite",monospace;
}

:root:not(.no-may) .rn.r1 {
  background: var(--black);
  color: var(--paper);
  font-family: Gloock,Georgia,serif;
}

:root:not(.no-may) .rn.r2 {
  background: var(--red);
  color: var(--paper);
  font-family: var(--mk);
}

:root:not(.no-may) .rn.r3 {
  background: var(--yellow);
  color: var(--black);
  font-family: Archivo,sans-serif;
  font-weight: 900;
}

:root:not(.no-may) .rn.r4 {
  background: var(--pink);
  color: var(--black);
  font-family: Gloock,Georgia,serif;
}

:root:not(.no-may) .rn.r5 {
  background: #d9d6cd;
  color: var(--black);
  font-family: "Special Elite",monospace;
  font-weight: 700;
}


/* ================================================================
   MARQUEE
   ================================================================ */

.may-marquee {
  display: none;
}

:root:not(.no-may) .may-marquee {
  display: block;

  position: fixed;

  left: 0;
  right: 0;

  bottom: calc(18px + var(--sb));

  overflow: hidden;

  transform: rotate(-1.4deg);

  box-shadow: 0 4px 0 var(--black);

  pointer-events: none;
}

:root:not(.no-may) .may-marquee .tr {
  display: flex;
  width: max-content;

  animation: mayRoll 26s linear infinite;

  font-family: var(--mk);
  font-size: 26px;

  color: var(--paper);

  padding: 10px 0 6px;

  text-shadow: 2px 2px 0 var(--black);

  white-space: nowrap;
}

:root:not(.no-may) .may-marquee .tr span {
  padding: 0 22px;
}

@keyframes mayRoll {
  to {
    transform: translateX(-50%);
  }
}


/* ================================================================
   DÉCORATIONS
   ================================================================ */

.may-deco {
  display: none;
}

:root:not(.no-may) .may-deco {
  display: block;

  position: fixed;

  pointer-events: none;

  z-index: 1;
}

:root:not(.no-may) .may-deco img {
  display: block;

  width: 100%;
  height: auto;

  -webkit-user-drag: none;
  user-select: none;
}

:root:not(.no-may) .may-deco svg {
  display: block;

  width: 100%;
  height: auto;

  overflow: visible;
}

.d-pin {
  left: 35vw;
  top: 9px;
  width: 210px;
  transform: rotate(-3deg);
}

.d-star {
  right: 29vw;
  top: 5vh;
  width: 150px;

  animation: mayFloat 9s ease-in-out infinite;
}

.d-flower {
  left: 1.5vw;
  bottom: 24vh;
  width: 92px;

  animation: mayFloat 7s ease-in-out -2s infinite;
}

.d-lips {
  right: 1.8vw;
  bottom: 2.5vh;
  width: 120px;

  transform: rotate(6deg);
}

@keyframes mayFloat {

  50% {
    transform:
      translateY(-12px)
      rotate(5deg);
  }

}


/* ================================================================
   BOUTON MAY
   ================================================================ */

.may-btn {
  position: fixed;

  z-index: 11;

  right: calc(70px + var(--sr));
  top: calc(14px + var(--st));

  font-family:
    "Permanent Marker",
    "Marker Felt",
    cursive;

  font-size: 21px;
  line-height: 1;

  padding: 8px 16px 5px;

  background: #ff3c8e;
  color: #0b0b0b;

  border: 3px solid #0b0b0b;
  border-radius: 40px;

  box-shadow: 4px 4px 0 #0b0b0b;

  transform: rotate(-6deg);

  transition:
    transform .2s,
    box-shadow .2s,
    background .2s,
    color .2s;
}

.may-btn:hover {
  transform: rotate(3deg) scale(1.08);
}

.may-btn:active {
  transform:
    translate(3px,3px)
    rotate(-6deg);

  box-shadow: 1px 1px 0 #0b0b0b;
}

:root.no-may .may-btn {
  background: transparent;
  color: var(--ink);

  border-color: var(--ink);

  box-shadow: none;

  text-decoration: line-through;
  text-decoration-thickness: 2px;
}

:root[data-theme="dark"]:not(.no-may) .may-btn {
  box-shadow: 4px 4px 0 #f1eee6;
}


/* ================================================================
   MOBILE
   ================================================================ */

@media(max-width:860px) {

  .d-pin,
  .d-star,
  .d-lips {
    display: none !important;
  }

  .d-flower {
    left: auto;
    right: 5vw;
    top: 34vh;
    bottom: auto;
    width: 64px;
  }

  .may-btn {
    right: calc(10px + var(--sr));
    top: calc(52px + var(--st);

    font-size: 17px;

    padding:
      6px 12px 3px;
  }

  :root:not(.no-may) .brand {
    padding: 7px 3px;
    box-shadow: 3px 3px 0 var(--hard);
  }

  :root:not(.no-may) .nav button {
    font-size: 17px;
  }

  :root:not(.no-may) .card {
    padding: 6px;
    box-shadow: 6px 6px 0 var(--hard);
  }

  :root:not(.no-may) .counter b {
    text-shadow: 4px 4px 0 var(--black);
  }

  :root:not(.no-may) .may-marquee .tr {
    font-size: 20px;
  }

}


/* ================================================================
   ACCESSIBILITÉ
   ================================================================ */

@media(prefers-reduced-motion:reduce) {

  .d-star,
  .d-flower {
    animation: none;
  }

  :root:not(.no-may) .may-marquee .tr {
    animation: none;
  }

}

`;

  document.head.appendChild(style);


  /* ================================================================
     APPLICATION DES VARIABLES
     ================================================================ */

  function applyVars() {

    root.style.setProperty(
      "--may-bg",
      CONFIG.colors.bg
    );

    root.style.setProperty(
      "--may-ink",
      CONFIG.colors.ink
    );

    root.style.setProperty(
      "--may-red",
      CONFIG.colors.red
    );

    root.style.setProperty(
      "--may-pink",
      CONFIG.colors.pink
    );

    root.style.setProperty(
      "--may-yellow",
      CONFIG.colors.yellow
    );

    root.style.setProperty(
      "--may-paper",
      CONFIG.colors.paper
    );
  }


  /* ================================================================
     ÉTAT INITIAL
     ================================================================ */

  try {

    var saved = localStorage.getItem(KEY);

    if (saved === "on") {

      root.classList.add("may-active");

    } else if (saved === "off") {

      root.classList.remove("may-active");

    } else {

      root.classList.toggle(
        "may-active",
        !!CONFIG.active
      );
    }

  } catch (e) {

    root.classList.toggle(
      "may-active",
      !!CONFIG.active
    );
  }


  applyVars();


  /* Compatibilité avec l'ancien système */

  root.classList.toggle(
    "no-may",
    !root.classList.contains("may-active")
  );


  /* ================================================================
     BOUTON MAY
     ================================================================ */

  var btn =
    document.getElementById("mayModeBtn") ||
    document.querySelector(".may-btn");


  if (!btn) {

    btn = document.createElement("button");

    btn.className = "may-btn";
    btn.type = "button";
    btn.textContent = "May";

    document.body.appendChild(btn);
  }


  function sync() {

    var on =
      root.classList.contains("may-active");


    btn.setAttribute(
      "aria-pressed",
      on ? "true" : "false"
    );


    btn.setAttribute(
      "aria-label",
      on
        ? "Désactiver le mode May"
        : "Activer le mode May"
    );


    btn.title =
      on
        ? "Mode May : activé"
        : "Mode May : désactivé";
  }


  btn.addEventListener(
    "click",
    function () {

      var on =
        !root.classList.contains("may-active");


      root.classList.toggle(
        "may-active",
        on
      );


      root.classList.toggle(
        "no-may",
        !on
      );


      try {

        localStorage.setItem(
          KEY,
          on ? "on" : "off"
        );

      } catch (e) {}


      sync();
    }
  );


  /* ================================================================
     CALQUE DES DÉCORATIONS
     ================================================================ */

  var layer =
    document.createElement("div");

  layer.className =
    "may-layer";

  layer.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.insertBefore(
    layer,
    document.body.firstChild
  );


  /* ================================================================
     POSITIONNEMENT DES DÉCORATIONS
     ================================================================ */

  function place(el, cfg) {

    var mobile =
      window.matchMedia &&
      window.matchMedia(
        "(max-width:860px)"
      ).matches;


    el.style.left = "auto";
    el.style.right = "auto";
    el.style.top = "auto";
    el.style.bottom = "auto";


    if (mobile && !cfg.mobile) {

      el.style.display = "none";

      return;
    }


    el.style.display = "";


    var pos =
      (
        mobile &&
        cfg.mobile &&
        cfg.mobile.pos
      ) ||
      cfg.pos ||
      {};


    Object.keys(pos).forEach(
      function (key) {

        el.style[key] = pos[key];

      }
    );


    el.style.width =
      (
        mobile &&
        cfg.mobile &&
        cfg.mobile.w
      ) ||
      cfg.w ||
      "100px";


    el.style.setProperty(
      "--may-rot",
      (cfg.rot || 0) + "deg"
    );
  }


  /* ================================================================
     CRÉATION DES DÉCORATIONS
     ================================================================ */

  CONFIG.decor.forEach(
    function (cfg) {

      var el =
        document.createElement("div");


      el.className =
        "may-deco " +
        (cfg.className || "") +
        (cfg.float ? " may-float" : "");


      var img =
        new Image();


      img.alt = "";
      img.draggable = false;
      img.decoding = "async";


      img.src =
        CONFIG.folder +
        cfg.file;


      img.onerror =
        function () {

          el.style.display = "none";
        };


      el.appendChild(img);


      layer.appendChild(el);


      place(el, cfg);


      if (cfg.float) {

        el.style.animationDuration =
          cfg.duration || "8s";
      }

    }
  );


  /* ================================================================
     RESPONSIVE
     ================================================================ */

  var mq =
    window.matchMedia
      ? window.matchMedia(
          "(max-width:860px)"
        )
      : null;


  if (mq) {

    var reflow =
      function () {

        [].forEach.call(
          layer.querySelectorAll(
            ".may-deco"
          ),
          function (el, i) {

            place(
              el,
              CONFIG.decor[i]
            );
          }
        );
      };


    if (mq.addEventListener) {

      mq.addEventListener(
        "change",
        reflow
      );

    } else if (mq.addListener) {

      mq.addListener(reflow);
    }
  }


  /* ================================================================
     TITRES — RANSOM NOTE
     ================================================================ */

  function ransom(el) {

    if (el.dataset.r) {
      return;
    }


    el.dataset.r = "1";


    var text =
      el.textContent;


    el.setAttribute(
      "aria-label",
      text
    );


    el.textContent = "";


    var i = 0;


    for (
      var k = 0;
      k < text.length;
      k++
    ) {

      var ch =
        text.charAt(k);


      if (ch === " ") {

        el.appendChild(
          document.createTextNode(" ")
        );

        continue;
      }


      var span =
        document.createElement("span");


      span.textContent = ch;


      span.className =
        "rn r" +
        ((i * 5 + 1) % 6);


      span.style.setProperty(
        "--rot",
        ((i * 37) % 9 - 4) +
        "deg"
      );


      span.setAttribute(
        "aria-hidden",
        "true"
      );


      el.appendChild(span);


      i++;
    }
  }


  /* ================================================================
     OBSERVATION DU PANNEAU
     ================================================================ */

  var pin =
    document.getElementById(
      "panel-in"
    );


  if (pin) {

    new MutationObserver(
      function () {

        var h =
          pin.querySelector("h2");


        if (h) {
          ransom(h);
        }

      }
    ).observe(
      pin,
      {
        childList: true
      }
    );
  }


  /* ================================================================
     SYNCHRONISATION INITIALE
     ================================================================ */

  sync();

})();
