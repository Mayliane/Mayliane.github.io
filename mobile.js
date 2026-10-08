/* =====================================================================
   MOBILE.JS — optimisations téléphone (iPhone / Android)  · version 3 (corrigée)

   INSTALLATION : inchangée, une ligne tout en bas de index.html, APRÈS london70.js :
       <script src="mobile.js"></script>

   Corrections de cette version :
   1. Barre du haut : le voile est maintenant opaque jusqu'en bas de la barre
      (avant, les cartes qui montent — ex. « DAVO » rose — passaient visibles
      entre le menu et le bouton May).
   2. Couleur du voile : plus de « transparent » par défaut (ça laissait voir les cartes).
   3. Indication « Glisser · toucher pour ouvrir » : plus de mot orphelin (« ouvrir » seul).
   4. Modèle 3D : détecté même s'il est dans un conteneur ajouté (avant, seuls les
      <model-viewer> ajoutés directement étaient allégés).
   5. Le script ne plante plus si .brand / .nav / .mode-switch sont absents.
   6. Inertie : l'état du geste est remis à zéro si le toucher est annulé (touchcancel).
   ===================================================================== */
(function () {
  "use strict";

  const R = "html:root:root:root:root";   // spécificité élevée : passe devant May et UK 70

  const css = `
/* ---- base ---- */
html,body{max-width:100%;overflow-x:hidden}
.panel,.project-modal,.modal-scroll{overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.card,.nav button,.item button,.themebtn,.mode-switch button{-webkit-touch-callout:none;user-select:none;-webkit-user-select:none}
img{-webkit-touch-callout:none}
button,.c-btn{touch-action:manipulation;-webkit-tap-highlight-color:transparent}

/* ---- hauteur réelle (barre d'adresse mobile) ---- */
.lightbox img{max-height:92dvh}
.panel{height:100dvh}

/* ---- éléments ajoutés par mobile.js : cachés sur ordinateur ---- */
#mTop{display:none}

/* ---- survol collant sur écran tactile ---- */
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
  #mTop{
    display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-between;align-items:center;
    column-gap:8px;row-gap:0;
    position:fixed;z-index:95;left:0;right:0;top:0;
    padding:calc(4px + var(--st,0px)) calc(10px + var(--sr,0px)) 12px calc(10px + var(--sl,0px));
    box-sizing:border-box;pointer-events:none;transform:none;filter:none;
    /* CORRIGÉ : voile opaque jusqu'à 86 % puis fondu — les cartes ne se voient plus à travers le menu */
    background:linear-gradient(var(--dw-bg,Canvas) 86%,transparent)
  }
  #mTop > *{pointer-events:auto}

  #mTop .brand{
    position:static !important;inset:auto !important;transform:none !important;rotate:none !important;translate:none !important;
    writing-mode:horizontal-tb !important;text-orientation:mixed !important;
    flex:0 0 100% !important;width:100% !important;max-width:100% !important;box-sizing:border-box !important;
    margin:0 !important;padding:0 44px !important;height:38px !important;
    display:block !important;line-height:38px !important;text-align:center !important;
    white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;
    font-size:15px !important;letter-spacing:.08em !important;order:1
  }
  #mTop .brand *{writing-mode:horizontal-tb !important;transform:none !important;rotate:none !important}

  ${R} #mTop .nav{
    position:static;inset:auto;order:2;flex:0 1 auto;
    display:flex;flex-direction:row;justify-content:flex-start;align-items:center;gap:0;
    width:auto;height:auto;max-height:none;margin:0;padding:0;overflow:visible;
    background:none;border:0;clip-path:none;visibility:visible;transform:none
  }
  ${R} #mTop .nav button{
    display:inline-flex;align-items:center;justify-content:center;
    width:auto;min-height:44px;margin:0;padding:0 9px;
    font-size:13px;font-weight:700;line-height:1;letter-spacing:.02em;
    text-align:center;box-shadow:none;transform:none;white-space:nowrap
  }
  ${R} #mTop .nav button:first-of-type{padding-left:2px}
  ${R} #mTop .nav button:active{opacity:.55}

  #mTop .mode-switch{
    position:static !important;inset:auto !important;translate:none !important;order:3;
    margin:0 0 0 auto !important;width:max-content !important;max-width:100% !important;
    gap:9px !important;justify-content:flex-end !important;align-items:center !important
  }
  #mTop .mode-switch > button{position:relative !important;inset:auto !important;margin-top:0 !important;margin-bottom:0 !important}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{
    min-height:38px !important;font-size:14px !important;padding:7px 10px 4px !important;
    border-width:2.5px !important;box-shadow:3px 3px 0 #0b0b0b
  }
  #mTop .mode-switch .uk-btn{box-shadow:3px 3px 0 #ff2d8a}
  #mTop .mode-switch .uk-btn[aria-pressed="true"]{box-shadow:3px 3px 0 #0b0b0b}

  ${R} .themebtn{width:44px;height:44px;right:calc(4px + var(--sr,0px));top:calc(1px + var(--st,0px));z-index:96}

  /* ============ ACCUEIL : carrousel ============ */
  .card{width:78vw;max-width:520px}
  .card:active img{opacity:.82;transition:opacity .08s}
  .item button:active .ttl{opacity:.55}
  .item button{-webkit-tap-highlight-color:transparent}

  .hint{transition:opacity .6s ease}
  .hint.hint-off{opacity:0}

  /* ============ le reste de la page ============ */
  .modal-close,.panel .close,.lb-close{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}
  .modal-nav button{min-height:44px}
  .c-btn{min-height:44px;display:inline-flex;align-items:center}
  .c-in{min-height:48px;font-size:16px}
  textarea.c-in{min-height:130px}

  .panel{padding-top:calc(112px + var(--st,0px))}
  .panel .in{padding-top:8px}
  .panel .close{display:none}
  .panel h2{overflow-wrap:anywhere}

  .c-card{margin-left:6px;margin-right:6px;box-shadow:6px 6px 0 var(--hard,#0b0b0b)}
  .c-grid{overflow:visible}
  .c-prev{max-height:260px}
  .c-send-row .c-btn{width:100%;justify-content:center}
  .c-btns .c-btn{flex:1 1 auto;justify-content:center}

  .about-lead{font-size:17px}
  .chips{gap:7px}
  .chip{font-size:13px}
  .tl-x{font-size:15px}
}

@media(max-width:400px){
  #mTop .brand{font-size:14px !important;letter-spacing:.06em !important}
  ${R} .counter b{font-size:72px}
  ${R} .item .ttl{font-size:23px}
  .c-pm{width:96px;right:54px}
  .c-stamp{width:60px}
  .c-air{font-size:11px}
}

@media(max-width:380px){
  #mTop{column-gap:4px;padding-left:calc(8px + var(--sl,0px));padding-right:calc(8px + var(--sr,0px))}
  ${R} #mTop .nav button{font-size:12px;padding:0 6px;letter-spacing:.01em}
  ${R} #mTop .nav button:first-of-type{padding-left:0}
  #mTop .mode-switch{gap:6px !important}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{font-size:13px !important;padding:6px 8px 3px !important}
}
@media(max-width:340px){
  ${R} #mTop .nav button{font-size:11px;padding:0 4px}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{font-size:12px !important;padding:5px 7px 3px !important}
}

@media(max-width:860px) and (max-height:720px){
  ${R} .counter b{font-size:60px}
  ${R} .counter span{margin-top:.7em}
  ${R} .item{top:73%}
  ${R} .item .cat{margin-bottom:6px}
  ${R} .item .ttl{font-size:22px}
  ${R} .item .bar{margin-top:10px;margin-bottom:10px}
  ${R} .item .dsc{font-size:13px;-webkit-line-clamp:2;line-clamp:2}
  ${R} .hint{display:none}
  #mTop .brand{height:32px !important;line-height:32px !important}
  ${R} #mTop .nav button{min-height:40px}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{min-height:34px !important}
  .panel{padding-top:calc(98px + var(--st,0px))}
}
@media(max-width:860px) and (max-height:600px){
  ${R} .item .dsc,${R} .item .bar{display:none}
  ${R} .item{top:78%}
}

@media(max-height:520px) and (orientation:landscape){
  .card{width:min(40vw,calc(56vh * 16 / 9))}
  #mTop{justify-content:center;column-gap:16px;padding-bottom:6px}
  #mTop .brand{flex:0 0 auto !important;width:auto !important;padding:0 !important;height:40px !important;line-height:40px !important;font-size:13px !important}
  ${R} #mTop .nav button{min-height:40px;font-size:13px;padding:0 8px}
  #mTop .mode-switch{margin:0 !important}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{min-height:34px !important}
  .panel{padding-top:calc(56px + var(--st,0px))}
  .panel h2{font-size:40px;margin-bottom:16px}
  .panel .in{padding-top:0}
  .about-stage,.about-stage.is-model{max-width:140px}
  .modal-layout{display:grid;grid-template-columns:minmax(200px,.8fr) minmax(0,1.4fr);gap:4vw}
  .modal-info{position:sticky;top:70px}
  .modal-info .modal-nav{display:flex}
  .modal-nav-end{display:none}
}

/* ============ VERROU DE MISE EN PAGE (barre du haut) ============ */
@media(max-width:860px){
  html:root:root:root:root #mTop{
    display:grid !important;grid-template-columns:minmax(0,1fr) auto !important;
    grid-template-areas:"brand brand" "nav modes" !important;
    align-items:center !important;column-gap:6px !important;row-gap:0 !important;
    padding-left:calc(10px + var(--sl,0px)) !important;padding-right:calc(10px + var(--sr,0px)) !important
  }
  html:root:root:root:root #mTop .brand{grid-area:brand !important;width:100% !important}
  html:root:root:root:root #mTop .nav{
    grid-area:nav !important;min-width:0 !important;margin:0 !important;
    display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;
    justify-content:flex-start !important;align-items:center !important;gap:0 !important;
    position:static !important;width:auto !important;overflow:visible !important
  }
  html:root:root:root:root #mTop .nav button{
    flex:0 0 auto !important;width:auto !important;margin:0 !important;
    display:inline-flex !important;align-items:center !important;justify-content:center !important;
    min-height:44px !important;padding:0 clamp(3px,1.5vw,8px) !important;
    font-size:clamp(10.5px,3vw,13px) !important;line-height:1 !important;
    letter-spacing:0 !important;white-space:nowrap !important;text-align:center !important;
    font-stretch:100% !important
  }
  html:root:root:root:root #mTop .nav button:first-child{padding-left:2px !important}
  html:root:root:root:root #mTop .nav button::before,
  html:root:root:root:root #mTop .nav button::after{content:none !important;display:none !important}
  html:root:root:root:root #mTop .mode-switch{
    grid-area:modes !important;justify-self:end !important;margin:0 !important;
    display:flex !important;flex-wrap:nowrap !important;gap:6px !important;
    width:max-content !important;max-width:none !important
  }
  html:root:root:root:root #mTop .mode-switch > button{
    flex:0 0 auto !important;white-space:nowrap !important;
    font-size:clamp(11px,3.3vw,14px) !important;min-height:38px !important
  }
  /* CORRIGÉ : indication du bas, texte équilibré sur 2 lignes (plus de « ouvrir » seul), alignée à droite */
  html:root:root:root:root .hint{
    font-size:12px !important;max-width:34vw !important;line-height:1.25 !important;
    text-align:right !important;text-wrap:balance !important
  }
}
@media(max-width:340px){
  html:root:root:root:root #mTop{grid-template-columns:minmax(0,1fr) !important;grid-template-areas:"brand" "nav" "modes" !important}
  html:root:root:root:root #mTop .mode-switch{justify-self:center !important;margin-top:2px !important}
  .panel{padding-top:calc(138px + var(--st,0px)) !important}
}
@media(max-height:520px) and (orientation:landscape){
  html:root:root:root:root #mTop{
    grid-template-columns:auto auto auto !important;grid-template-areas:"brand nav modes" !important;
    justify-content:center !important;column-gap:16px !important
  }
  html:root:root:root:root #mTop .brand{width:auto !important;padding:0 !important}
  html:root:root:root:root #mTop .mode-switch{justify-self:start !important}
}

/* ============ BOUTONS DE MODE ============ */
@media(max-width:860px){
  html:root:root:root:root #mTop .mode-switch{position:relative !important;flex-direction:row !important;align-items:center !important}
  html:root:root:root:root #mTop .mode-switch > :not(button){position:absolute !important;pointer-events:none !important;margin:0 !important}
  html:root:root:root:root #mTop .mode-switch .may-btn{order:1 !important}
  html:root:root:root:root #mTop .mode-switch .uk-btn{order:2 !important}
  html:root:root:root:root #mTop .mode-switch > button{
    overflow:visible !important;line-height:1.1 !important;z-index:2 !important;
    display:inline-flex !important;align-items:center !important;justify-content:center !important
  }
}

@media(prefers-reduced-motion:reduce){
  .hint{transition:none !important}
}
`;
  const st = document.createElement("style");
  st.id = "mobile-style";
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------------------------------------------------------------
     BARRE CENTRALE : logo / menu / modes déplacés dans #mTop (mobile),
     remis à leur place d'origine sur grand écran.
     --------------------------------------------------------------- */
  const root = document.documentElement;
  const brand = document.querySelector(".brand");
  const modes = document.querySelector(".mode-switch");
  const nav = document.querySelector(".nav");
  const mTop = document.createElement("div");
  mTop.id = "mTop";
  let saved = [];

  function toMobile() {
    if (mTop.parentNode) return;
    document.body.appendChild(mTop);
    saved = [];
    [brand, nav, modes].forEach(el => {
      if (!el) return;
      saved.push({ el: el, parent: el.parentNode, next: el.nextSibling });
      mTop.appendChild(el);
    });
  }
  function toDesktop() {
    if (!mTop.parentNode) return;
    while (saved.length) {
      const s = saved.pop();
      if (!s.parent) continue;
      if (s.next && s.next.parentNode === s.parent) s.parent.insertBefore(s.el, s.next);
      else s.parent.appendChild(s.el);
    }
    mTop.remove();
  }
  const mq = matchMedia("(max-width:860px)");
  const sync = () => (mq.matches ? toMobile() : toDesktop());
  sync();
  if (mq.addEventListener) mq.addEventListener("change", sync); else mq.addListener(sync);

  /* voile de la barre : vraie couleur du fond, mise à jour au changement de thème.
     CORRIGÉ : si aucune couleur opaque n'est trouvée, on utilise « Canvas » (pas « transparent »). */
  function paintBar() {
    const ok = c => c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c);
    let bg = getComputedStyle(document.body).backgroundColor;
    if (!ok(bg)) bg = getComputedStyle(root).backgroundColor;
    root.style.setProperty("--dw-bg", ok(bg) ? bg : "Canvas");
  }
  paintBar();
  addEventListener("load", () => { paintBar(); setTimeout(paintBar, 500); });
  const repaint = () => { paintBar(); setTimeout(paintBar, 450); };
  new MutationObserver(repaint).observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
  new MutationObserver(repaint).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  /* ---------------------------------------------------------------
     BOUTONS DE MODE : May et UK70 restent DANS la barre,
     même si un thème les déplace ou les repositionne.
     --------------------------------------------------------------- */
  const POS = ["position", "top", "left", "right", "bottom", "inset", "margin", "translate"];
  let modesRaf = 0;
  function fixModes() {
    modesRaf = 0;
    if (!modes || !mq.matches) return;
    const list = [
      document.getElementById("mayModeBtn") || modes.querySelector(".may-btn") || document.querySelector(".may-btn"),
      document.getElementById("ukModeBtn")  || modes.querySelector(".uk-btn")  || document.querySelector(".uk-btn")
    ];
    list.forEach(b => {
      if (!b) return;
      if (b.parentNode !== modes) modes.appendChild(b);
      POS.forEach(p => { if (b.style.getPropertyValue(p)) b.style.removeProperty(p); });
    });
  }
  const fixModesSoon = () => { if (!modesRaf) modesRaf = requestAnimationFrame(fixModes); };
  fixModes();
  if (mq.addEventListener) mq.addEventListener("change", fixModesSoon); else mq.addListener(fixModesSoon);
  const modesObs = new MutationObserver(fixModesSoon);
  modesObs.observe(document.body, { childList: true });
  ["mayModeBtn", "ukModeBtn"].forEach(id => {
    const b = document.getElementById(id);
    if (b) modesObs.observe(b, { attributes: true, attributeFilter: ["style", "class"] });
  });
  addEventListener("load", () => { fixModesSoon(); setTimeout(fixModes, 600); setTimeout(fixModes, 1800); });

  /* un glissement qui démarre sur la barre ne fait pas défiler le carrousel */
  ["touchstart", "touchmove", "touchend"].forEach(t =>
    mTop.addEventListener(t, e => e.stopPropagation(), { passive: true }));

  /* ---------------------------------------------------------------
     ACCUEIL : inertie du carrousel, indication, vibration
     (utilise nudge / ready / overlayOpen définis dans index.html)
     --------------------------------------------------------------- */
  const hint = document.querySelector(".hint");
  let samples = [];

  const canFlick = () => {
    try {
      return innerWidth <= 860 && typeof nudge === "function" && ready === true &&
        !(typeof overlayOpen === "function" && overlayOpen());
    } catch (e) { return false; }
  };

  addEventListener("touchstart", e => {
    samples = e.touches.length === 1 ? [{ y: e.touches[0].clientY, t: e.timeStamp }] : [];
    if (hint && canFlick()) hint.classList.add("hint-off");
  }, { passive: true });

  addEventListener("touchmove", e => {
    if (!samples.length || e.touches.length !== 1) return;
    samples.push({ y: e.touches[0].clientY, t: e.timeStamp });
    if (samples.length > 6) samples.shift();
  }, { passive: true });

  /* CORRIGÉ : un toucher annulé (appel, geste système) ne laisse plus d'état résiduel */
  addEventListener("touchcancel", () => { samples = []; }, { passive: true });

  addEventListener("touchend", e => {
    const s = samples; samples = [];
    if (s.length < 2 || !canFlick()) return;
    const a = s[0], b = s[s.length - 1];
    const dt = b.t - a.t;
    if (dt < 8 || e.timeStamp - b.t > 90) return;
    const v = (a.y - b.y) / dt;
    if (Math.abs(v) < 0.45) return;
    const push = Math.max(-3, Math.min(3, v * 1.15));
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

  /* ---- modèle 3D : plus léger sur téléphone ----
     CORRIGÉ : on cherche aussi les <model-viewer> imbriqués dans un conteneur ajouté. */
  if (innerWidth <= 860) {
    const lighten = n => {
      n.setAttribute("loading", "eager");
      n.setAttribute("shadow-intensity", "0.6");
      n.setAttribute("interaction-prompt", "none");
    };
    document.querySelectorAll("model-viewer").forEach(lighten);
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.tagName === "MODEL-VIEWER") lighten(n);
      else if (n.querySelectorAll) n.querySelectorAll("model-viewer").forEach(lighten);
    }))).observe(document.body, { childList: true, subtree: true });
  }
})();
