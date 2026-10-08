/* =====================================================================
   MOBILE.JS — optimisations téléphone (iPhone / Android)  · version 2

   INSTALLATION : inchangée, une ligne tout en bas de index.html, APRÈS london70.js :
       <script src="mobile.js"></script>

   Sur téléphone (≤ 860 px) :
   - le logo et les boutons May / UK 70 sont dans une barre à eux (flexbox)
   - bouton menu à gauche, bouton thème à droite, menu en tiroir

   NOUVEAU dans cette version :
   1. Les petits écrans (iPhone SE, Android compacts) ne se chevauchent plus :
      compteur, titre et description s'adaptent à la hauteur disponible.
   2. Le carrousel a une vraie inertie : un coup de doigt rapide fait défiler
      plusieurs projets, puis ça se cale sur le plus proche.
   3. Le tiroir ne fait plus défiler le carrousel qui est derrière lui.
   4. Le bouton « retour » d'Android (ou le geste retour d'iOS) ferme le tiroir
      au lieu de quitter le site.
   5. Retour tactile : un appui sur une carte, un titre ou un lien du menu réagit
      visuellement, et une micro-vibration (Android) marque chaque changement de projet.
   6. L'indication « Glisser · toucher pour ouvrir » disparaît dès le premier geste.
   7. Cartes un peu plus grandes, barre du haut plus compacte, zones tactiles ≥ 44 px.
   ===================================================================== */
(function () {
  "use strict";

  const R = "html:root:root:root:root";   // spécificité élevée : passe devant May et UK 70

  const css = `
/* ---- base : pas de défilement horizontal, pas de menu contextuel / sélection parasite ---- */
html,body{max-width:100%;overflow-x:hidden}
.panel,.project-modal,.modal-scroll{overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.card,.nav button,.item button,.themebtn,.mode-switch button{-webkit-touch-callout:none;user-select:none;-webkit-user-select:none}
img{-webkit-touch-callout:none}
button,.c-btn{touch-action:manipulation;-webkit-tap-highlight-color:transparent}

/* ---- hauteur réelle (barre d'adresse mobile) ---- */
.lightbox img{max-height:92dvh}
.panel{height:100dvh}

/* ---- éléments ajoutés par mobile.js : cachés sur ordinateur ---- */
.menu-btn,.menu-backdrop,#mTop{display:none}

/* ---- survol collant : sur écran tactile, un appui ne doit pas laisser l'état « hover » ---- */
@media(hover:none){
  ${R}.uk .card:not(.is-on):hover img{filter:grayscale(1) contrast(1.35) brightness(.96)}
  ${R}.uk .card:not(.is-on):hover::after{opacity:.5}
  .b-link:hover{background:none;color:inherit}
  .c-btn:hover{transform:none;box-shadow:4px 4px 0 #0b0b0b}
  .c-mail:hover{background:none}
  textarea.c-in{resize:none}
}

@media(max-width:860px){

  /* ============ BARRE DU HAUT ============ */

  /* bouton menu à gauche */
  .menu-btn{
    display:block;position:fixed;z-index:60;
    left:calc(4px + var(--sl,0px));top:calc(6px + var(--st,0px));
    width:44px;height:44px;padding:0;color:var(--dw-fg,currentColor);
    transition:opacity .8s ease
  }
  .menu-btn i{position:absolute;left:12px;right:12px;height:2px;background:currentColor;transition:transform .3s ease,top .3s ease}
  .menu-btn i:nth-child(1){top:18px}
  .menu-btn i:nth-child(2){top:25px}
  html.menu-open .menu-btn i:nth-child(1){top:21.5px;transform:rotate(45deg)}
  html.menu-open .menu-btn i:nth-child(2){top:21.5px;transform:rotate(-45deg)}
  body:not(.ui) .menu-btn{opacity:0;pointer-events:none}

  /* bouton thème à droite */
  ${R} .themebtn{width:44px;height:44px;right:calc(4px + var(--sr,0px));top:calc(6px + var(--st,0px))}

  /* barre centrale : logo puis boutons de mode, plus compacte qu'avant */
  #mTop{
    display:flex;flex-direction:column;align-items:center;
    position:fixed;z-index:45;left:0;right:0;top:calc(4px + var(--st,0px));
    padding:0 56px;box-sizing:border-box;pointer-events:none;
    transform:none;filter:none
  }
  #mTop > *{pointer-events:auto}

  #mTop .brand{
    position:static !important;inset:auto !important;transform:none !important;rotate:none !important;translate:none !important;
    writing-mode:horizontal-tb !important;text-orientation:mixed !important;
    margin:0 !important;width:auto !important;max-width:100% !important;height:40px !important;
    display:block !important;line-height:40px !important;text-align:center !important;
    white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;
    font-size:15px !important;letter-spacing:.08em !important
  }
  #mTop .brand *{writing-mode:horizontal-tb !important;transform:none !important;rotate:none !important}

  #mTop .mode-switch{
    position:static !important;inset:auto !important;translate:none !important;
    margin:2px auto 0 !important;width:max-content !important;max-width:100% !important;
    justify-content:center !important;align-items:center !important;text-align:center !important
  }
  #mTop .mode-switch > *{position:relative !important;inset:auto !important;margin-top:0 !important;margin-bottom:0 !important}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{min-height:40px}

  /* ============ ACCUEIL : carrousel ============ */

  /* cartes un peu plus grandes pour mieux voir les visuels */
  .card{width:78vw;max-width:520px}

  /* retour visuel quand on appuie (sans dépendre du survol) */
  .card:active img{opacity:.82;transition:opacity .08s}
  .item button:active .ttl{opacity:.55}
  .item button{-webkit-tap-highlight-color:transparent}

  /* l'indication disparaît après le premier geste */
  .hint{transition:opacity .6s ease}
  .hint.hint-off{opacity:0}

  /* ============ MENU TIROIR ============ */
  .menu-backdrop{
    display:block;position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.32);
    opacity:0;visibility:hidden;transition:opacity .3s ease,visibility 0s linear .3s;
    touch-action:none
  }
  html.menu-open .menu-backdrop{opacity:1;visibility:visible;transition:opacity .3s ease}

  ${R} .nav{
    position:fixed;z-index:55;
    top:calc(54px + var(--st,0px));left:calc(10px + var(--sl,0px));right:calc(10px + var(--sr,0px));bottom:auto;
    width:auto;height:auto;margin:0;padding:0;
    display:flex;flex-direction:column;align-items:stretch;gap:0;
    background:var(--dw-bg,#fff);color:var(--dw-fg,#0b0b0b);
    border:1px solid var(--dw-fg,#0b0b0b);
    max-height:calc(100dvh - 64px - var(--st,0px) - var(--sb,0px));overflow-y:auto;overscroll-behavior:contain;
    counter-reset:nv;
    clip-path:inset(0 0 100% 0);visibility:hidden;
    transition:clip-path .32s cubic-bezier(.2,.8,.2,1),visibility 0s linear .32s
  }
  html.menu-open,html.menu-open body{overflow:hidden}
  ${R}.menu-open .nav{clip-path:inset(0 0 0 0);visibility:visible;transition:clip-path .32s cubic-bezier(.2,.8,.2,1)}

  ${R} .nav button{
    display:flex;align-items:center;justify-content:flex-start;
    width:100%;min-height:60px;margin:0;padding:0 18px;text-align:left;
    font-size:26px;line-height:1.1;color:var(--dw-fg,#0b0b0b);
    counter-increment:nv;
    box-shadow:inset 0 -1px 0 color-mix(in srgb,var(--dw-fg,#0b0b0b) 18%,transparent);
    transform:translateY(-8px);transition:transform .38s cubic-bezier(.2,.8,.2,1),background-color .12s
  }
  ${R}.menu-open .nav button{transform:none}
  ${R}.menu-open .nav button:nth-child(2){transition-delay:.05s}
  ${R}.menu-open .nav button:nth-child(3){transition-delay:.1s}
  ${R}.menu-open .nav button:nth-child(4){transition-delay:.15s}
  ${R} .nav button:active{background-color:color-mix(in srgb,var(--dw-fg,#0b0b0b) 10%,transparent);transition-delay:0s}
  ${R} .nav button:last-child{box-shadow:none}
  ${R} .nav button::before{content:counter(nv,decimal-leading-zero);font-size:12px;letter-spacing:.12em;opacity:.45;min-width:34px}
  ${R} .nav button::after{content:"→";font-size:18px;opacity:.45;margin-left:auto}

  /* ============ le reste de la page ============ */
  .modal-close,.panel .close,.lb-close{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}
  .modal-nav button{min-height:44px}
  .c-btn{min-height:44px;display:inline-flex;align-items:center}
  .c-in{min-height:48px;font-size:16px}          /* 16 px mini : évite le zoom automatique d'iOS */
  textarea.c-in{min-height:130px}

  /* pages À propos / Contact : on laisse la place à la barre + aux boutons de mode */
  .panel{padding-top:calc(98px + var(--st,0px))}
  .panel .in{padding-top:8px}
  .panel .close{top:calc(54px + var(--st,0px));right:calc(10px + var(--sr,0px))}
  .panel h2{overflow-wrap:anywhere}

  /* contact : l'enveloppe ne déborde plus */
  .c-card{margin-left:6px;margin-right:6px;box-shadow:6px 6px 0 var(--hard,#0b0b0b)}
  .c-grid{overflow:visible}
  .c-prev{max-height:260px}
  .c-send-row .c-btn{width:100%;justify-content:center}
  .c-btns .c-btn{flex:1 1 auto;justify-content:center}

  /* à propos : texte confortable, puces plus compactes */
  .about-lead{font-size:17px}
  .chips{gap:7px}
  .chip{font-size:13px}
  .tl-x{font-size:15px}
}

/* petits écrans en largeur (≤ 400 px) */
@media(max-width:400px){
  #mTop .brand{font-size:14px !important;letter-spacing:.06em !important}
  ${R} .nav button{font-size:23px}
  ${R} .counter b{font-size:72px}
  ${R} .item .ttl{font-size:23px}
  .c-pm{width:96px;right:54px}
  .c-stamp{width:60px}
  .c-air{font-size:11px}
}

/* petits écrans en HAUTEUR (iPhone SE, mini, Android compacts) :
   le gros numéro, le titre et la description ne se marchent plus dessus */
@media(max-width:860px) and (max-height:720px){
  ${R} .counter b{font-size:60px}
  ${R} .counter span{margin-top:.7em}
  ${R} .item{top:73%}
  ${R} .item .cat{margin-bottom:6px}
  ${R} .item .ttl{font-size:22px}
  ${R} .item .bar{margin-top:10px;margin-bottom:10px}
  ${R} .item .dsc{font-size:13px;-webkit-line-clamp:2;line-clamp:2}
  ${R} .hint{display:none}
}
/* très petits écrans (≤ 600 px de haut) : on retire la description, le titre suffit */
@media(max-width:860px) and (max-height:600px){
  ${R} .item .dsc,${R} .item .bar{display:none}
  ${R} .item{top:78%}
}

/* téléphone en paysage : le logo reste centré, les modes passent à droite du bouton thème */
@media(max-height:520px) and (orientation:landscape){
  .panel{padding-top:calc(60px + var(--st,0px))}
  .panel h2{font-size:40px;margin-bottom:16px}
  .panel .in{padding-top:0}
  .about-stage,.about-stage.is-model{max-width:140px}
  #mTop .mode-switch{position:fixed !important;top:calc(8px + var(--st,0px)) !important;right:calc(54px + var(--sr,0px)) !important;left:auto !important;margin:0 !important}
  ${R} .nav{top:calc(54px + var(--st,0px))}
  ${R} .nav button{min-height:46px;font-size:21px}
  .modal-layout{display:grid;grid-template-columns:minmax(200px,.8fr) minmax(0,1.4fr);gap:4vw}
  .modal-info{position:sticky;top:70px}
  .modal-info .modal-nav{display:flex}
  .modal-nav-end{display:none}
}

@media(prefers-reduced-motion:reduce){
  .nav,.menu-backdrop,.menu-btn i,.hint{transition:none !important}
}
`;
  const st = document.createElement("style");
  st.id = "mobile-style";
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------------------------------------------------------------
     BARRE CENTRALE : le logo et les boutons de mode sont déplacés dans #mTop (mobile),
     puis remis exactement à leur place d'origine sur grand écran.
     Les boutons gardent leurs écouteurs : May / UK 70 fonctionnent comme avant.
     --------------------------------------------------------------- */
  const root = document.documentElement;
  const brand = document.querySelector(".brand");
  const modes = document.querySelector(".mode-switch");
  const mTop = document.createElement("div");
  mTop.id = "mTop";
  const saved = [];

  function toMobile() {
    if (mTop.parentNode) return;
    document.body.appendChild(mTop);
    [brand, modes].forEach(el => {
      if (!el) return;
      saved.push({ el: el, parent: el.parentNode, next: el.nextSibling });
      mTop.appendChild(el);
    });
  }
  function toDesktop() {
    if (!mTop.parentNode) return;
    while (saved.length) {
      const s = saved.pop();
      if (s.next && s.next.parentNode === s.parent) s.parent.insertBefore(s.el, s.next);
      else s.parent.appendChild(s.el);
    }
    mTop.remove();
  }
  const mq = matchMedia("(max-width:860px)");
  const sync = () => (mq.matches ? toMobile() : toDesktop());
  sync();
  if (mq.addEventListener) mq.addEventListener("change", sync); else mq.addListener(sync);

  /* ---------------------------------------------------------------
     MENU TIROIR (les boutons du menu restent ceux du site : leurs actions ne changent pas)
     --------------------------------------------------------------- */
  const nav = document.querySelector(".nav");

  if (nav) {
    if (!nav.id) nav.id = "mainNav";

    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "menu-btn"; btn.id = "menuBtn";
    btn.setAttribute("aria-label", "Menu");
    btn.setAttribute("aria-controls", nav.id);
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = "<i></i><i></i>";
    document.body.appendChild(btn);

    const back = document.createElement("div");
    back.className = "menu-backdrop";
    document.body.appendChild(back);

    /* le tiroir reprend les couleurs réelles du site (clair / sombre / May / UK 70) */
    function paintColors() {
      const cs = getComputedStyle(document.body);
      let bg = cs.backgroundColor;
      if (!bg || bg === "transparent" || /rgba\(.*,\s*0\)$/.test(bg)) bg = getComputedStyle(root).backgroundColor;
      if (!bg || bg === "transparent" || /rgba\(.*,\s*0\)$/.test(bg)) bg = "#fff";
      root.style.setProperty("--dw-bg", bg);
      root.style.setProperty("--dw-fg", cs.color || "#0b0b0b");
    }

    /* historique : le bouton « retour » du téléphone ferme le tiroir au lieu de quitter le site */
    let menuPushed = false;

    function setOpen(on) {
      if (on === root.classList.contains("menu-open")) return;
      if (on) {
        paintColors();
        try { history.pushState({ menu: true }, "", location.href); menuPushed = true; } catch (e) { menuPushed = false; }
      } else if (menuPushed) {
        menuPushed = false;
        try { history.back(); } catch (e) {}
      }
      root.classList.toggle("menu-open", on);
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Fermer le menu" : "Menu");
      try { if (navigator.vibrate) navigator.vibrate(6); } catch (e) {}     /* Android : micro-vibration */
      if (on) {
        setTimeout(() => { const b = nav.querySelector("button"); if (b) try { b.focus({ preventScroll: true }); } catch (e) {} }, 60);
      } else if (nav.contains(document.activeElement)) {
        try { btn.focus({ preventScroll: true }); } catch (e) {}
      }
    }
    const close = () => setOpen(false);

    addEventListener("popstate", () => {
      if (root.classList.contains("menu-open")) { menuPushed = false; setOpen(false); }
    });

    btn.addEventListener("click", e => { e.stopPropagation(); setOpen(!root.classList.contains("menu-open")); });
    back.addEventListener("click", close);
    nav.addEventListener("click", e => { if (e.target.closest("button,a")) close(); });   /* après l'action du site */
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    document.addEventListener("click", e => {
      if (e.target.closest && e.target.closest(".mode-switch,.themebtn")) close();
    });
    addEventListener("resize", () => { if (innerWidth > 860) close(); });

    /* le tiroir et son fond ne font JAMAIS défiler le carrousel qui est derrière :
       on arrête les événements tactiles avant qu'ils n'atteignent la page */
    let y0 = null;
    nav.addEventListener("touchstart", e => { e.stopPropagation(); y0 = e.touches[0].clientY; }, { passive: true });
    nav.addEventListener("touchmove", e => {
      e.stopPropagation();
      if (y0 !== null && y0 - e.touches[0].clientY > 40) { y0 = null; close(); }   /* glisser vers le haut = fermer */
    }, { passive: true });
    nav.addEventListener("touchend", e => { e.stopPropagation(); y0 = null; }, { passive: true });
    back.addEventListener("touchstart", e => e.stopPropagation(), { passive: true });
    back.addEventListener("touchmove", e => { e.preventDefault(); e.stopPropagation(); }, { passive: false });
    back.addEventListener("touchend", e => e.stopPropagation(), { passive: true });
  }

  /* ---------------------------------------------------------------
     ACCUEIL : inertie du carrousel, indication, vibration
     (utilise nudge / ready / overlayOpen définis dans index.html)
     --------------------------------------------------------------- */
  const hint = document.querySelector(".hint");
  let samples = [];

  const canFlick = () => {
    try {
      return innerWidth <= 860 && typeof nudge === "function" && ready === true &&
        !(typeof overlayOpen === "function" && overlayOpen()) && !root.classList.contains("menu-open");
    } catch (e) { return false; }
  };

  addEventListener("touchstart", e => {
    samples = e.touches.length === 1 ? [{ y: e.touches[0].clientY, t: e.timeStamp }] : [];
    if (hint && canFlick()) hint.classList.add("hint-off");      /* premier geste : l'aide s'efface */
  }, { passive: true });

  addEventListener("touchmove", e => {
    if (!samples.length || e.touches.length !== 1) return;
    samples.push({ y: e.touches[0].clientY, t: e.timeStamp });
    if (samples.length > 6) samples.shift();
  }, { passive: true });

  addEventListener("touchend", e => {
    const s = samples; samples = [];
    if (s.length < 2 || !canFlick()) return;
    const a = s[0], b = s[s.length - 1];
    const dt = b.t - a.t;
    if (dt < 8 || e.timeStamp - b.t > 90) return;                 /* le doigt s'était arrêté avant de lever */
    const v = (a.y - b.y) / dt;                                   /* px / ms, positif = on monte */
    if (Math.abs(v) < 0.45) return;                               /* pas assez rapide : simple glissement */
    const push = Math.max(-3, Math.min(3, v * 1.15));             /* 1 projet ≈ 0,87 px/ms ; max 3 projets */
    try { nudge(push); } catch (err) {}
  }, { passive: true });

  /* micro-vibration à chaque changement de projet (Android ; iOS ignore) */
  const numEl = document.getElementById("num");
  if (numEl && navigator.vibrate) {
    let lastNum = numEl.textContent;
    new MutationObserver(() => {
      const t = numEl.textContent;
      if (t === lastNum) return;
      lastNum = t;
      try { if (ready === true) navigator.vibrate(4); } catch (e) {}
    }).observe(numEl, { childList: true, characterData: true, subtree: true });
  }

  /* ---- clavier mobile : le champ actif reste visible dans la page Contact ---- */
  document.addEventListener("focusin", e => {
    const t = e.target;
    if (!t || !t.classList || !t.classList.contains("c-in")) return;
    setTimeout(() => { try { t.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (err) {} }, 320);
  });

  /* ---- hauteur dynamique pour les éléments plein écran (iOS) ---- */
  const setVh = () => document.documentElement.style.setProperty("--vh", (innerHeight * .01) + "px");
  let vhRaf = 0;
  const setVhSoon = () => { cancelAnimationFrame(vhRaf); vhRaf = requestAnimationFrame(setVh); };
  setVh();
  addEventListener("resize", setVhSoon);
  addEventListener("orientationchange", () => setTimeout(setVh, 250));

  /* ---- modèle 3D : plus léger sur téléphone ---- */
  if (innerWidth <= 860) {
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
      if (n.tagName === "MODEL-VIEWER") {
        n.setAttribute("loading", "eager");
        n.setAttribute("shadow-intensity", "0.6");      // ombre plus simple = moins de GPU
        n.setAttribute("interaction-prompt", "none");
      }
    }))).observe(document.body, { childList: true, subtree: true });
  }
})();
