/* =====================================================================
   MOBILE.JS — optimisations téléphone (iPhone / Android)  · version 2

   INSTALLATION : inchangée, une ligne tout en bas de index.html, APRÈS london70.js :
       <script src="mobile.js"></script>

   Sur téléphone (≤ 860 px) :
   - le logo et les boutons May / UK 70 sont dans une barre à eux (flexbox)
   - barre toujours visible : logo, puis Travaux / À propos / Contact, puis May / UK70
   - bouton thème à droite (plus de menu hamburger : tout est accessible d'un seul toucher)

   NOUVEAU dans cette version :
   1. Les petits écrans (iPhone SE, Android compacts) ne se chevauchent plus :
      compteur, titre et description s'adaptent à la hauteur disponible.
   2. Le carrousel a une vraie inertie : un coup de doigt rapide fait défiler
      plusieurs projets, puis ça se cale sur le plus proche.
   3. La barre du haut reste visible même quand À propos / Contact est ouvert.
   4. Un glissement qui démarre sur la barre ne fait pas défiler le carrousel.
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
#mTop{display:none}

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

  /* ============ BARRE DU HAUT : toujours visible ============
     ligne 1 : logo · ligne 2 : Travaux / À propos / Contact · ligne 3 : May / UK70 */
  #mTop{
    display:flex;flex-direction:column;align-items:center;
    position:fixed;z-index:95;left:0;right:0;top:0;
    padding:calc(4px + var(--st,0px)) calc(56px + var(--sr,0px)) 6px calc(56px + var(--sl,0px));
    box-sizing:border-box;pointer-events:none;transform:none;filter:none
  }
  #mTop > *{pointer-events:auto}
  /* quand À propos / Contact est ouvert, la barre reste au-dessus et le texte glisse dessous */
  html:has(.panel.open) #mTop{background:linear-gradient(var(--bg,#fff) 80%,var(--bg0,transparent))}

  #mTop .brand{
    position:static !important;inset:auto !important;transform:none !important;rotate:none !important;translate:none !important;
    writing-mode:horizontal-tb !important;text-orientation:mixed !important;
    margin:0 !important;width:auto !important;max-width:100% !important;height:40px !important;
    display:block !important;line-height:40px !important;text-align:center !important;
    white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;
    font-size:15px !important;letter-spacing:.08em !important;order:1
  }
  #mTop .brand *{writing-mode:horizontal-tb !important;transform:none !important;rotate:none !important}

  /* menu : trois boutons côte à côte, toujours visibles */
  ${R} #mTop .nav{
    position:static;inset:auto;order:2;
    display:flex;flex-direction:row;justify-content:center;align-items:center;gap:2px;
    width:auto;height:auto;max-height:none;margin:0;padding:0;overflow:visible;
    background:none;border:0;clip-path:none;visibility:visible;transform:none
  }
  ${R} #mTop .nav button{
    display:inline-flex;align-items:center;justify-content:center;
    width:auto;min-height:40px;margin:0;padding:0 12px;
    font-size:15px;font-weight:700;line-height:1;letter-spacing:.01em;
    text-align:center;box-shadow:none;transform:none
  }
  ${R} #mTop .nav button:active{opacity:.55}

  /* boutons de mode */
  #mTop .mode-switch{
    position:static !important;inset:auto !important;translate:none !important;order:3;
    margin:2px auto 0 !important;width:max-content !important;max-width:100% !important;
    justify-content:center !important;align-items:center !important;text-align:center !important
  }
  #mTop .mode-switch > *{position:relative !important;inset:auto !important;margin-top:0 !important;margin-bottom:0 !important}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{min-height:40px}

  /* bouton thème à droite, au niveau du logo, toujours au-dessus */
  ${R} .themebtn{width:44px;height:44px;right:calc(4px + var(--sr,0px));top:calc(2px + var(--st,0px));z-index:96}

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

  /* ============ le reste de la page ============ */
  .modal-close,.panel .close,.lb-close{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}
  .modal-nav button{min-height:44px}
  .c-btn{min-height:44px;display:inline-flex;align-items:center}
  .c-in{min-height:48px;font-size:16px}          /* 16 px mini : évite le zoom automatique d'iOS */
  textarea.c-in{min-height:130px}

  /* pages À propos / Contact : on laisse la place à la barre + aux boutons de mode */
  .panel{padding-top:calc(142px + var(--st,0px))}
  .panel .in{padding-top:8px}
  .panel .close{display:none}   /* le bouton « Travaux » de la barre ferme le panneau */
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
  #mTop .brand{height:34px !important;line-height:34px !important}
  ${R} #mTop .nav button{min-height:36px}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{min-height:34px}
  .panel{padding-top:calc(124px + var(--st,0px))}
}
/* très petits écrans (≤ 600 px de haut) : on retire la description, le titre suffit */
@media(max-width:860px) and (max-height:600px){
  ${R} .item .dsc,${R} .item .bar{display:none}
  ${R} .item{top:78%}
}

/* téléphone en paysage : logo, menu et modes sur une seule ligne */
@media(max-height:520px) and (orientation:landscape){
  #mTop{flex-direction:row;flex-wrap:wrap;justify-content:center;align-items:center;column-gap:14px;padding-bottom:0}
  #mTop .brand{height:36px !important;line-height:36px !important;font-size:13px !important}
  ${R} #mTop .nav button{min-height:36px;font-size:14px;padding:0 8px}
  #mTop .mode-switch{margin:0 !important}
  #mTop .mode-switch .may-btn,#mTop .mode-switch .uk-btn{min-height:34px}
  .panel{padding-top:calc(56px + var(--st,0px))}
  .panel h2{font-size:40px;margin-bottom:16px}
  .panel .in{padding-top:0}
  .about-stage,.about-stage.is-model{max-width:140px}
  .modal-layout{display:grid;grid-template-columns:minmax(200px,.8fr) minmax(0,1.4fr);gap:4vw}
  .modal-info{position:sticky;top:70px}
  .modal-info .modal-nav{display:flex}
  .modal-nav-end{display:none}
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
     BARRE CENTRALE : le logo et les boutons de mode sont déplacés dans #mTop (mobile),
     puis remis exactement à leur place d'origine sur grand écran.
     Les boutons gardent leurs écouteurs : May / UK 70 fonctionnent comme avant.
     --------------------------------------------------------------- */
  const root = document.documentElement;
  const brand = document.querySelector(".brand");
  const modes = document.querySelector(".mode-switch");
  const nav = document.querySelector(".nav");
  const mTop = document.createElement("div");
  mTop.id = "mTop";
  const saved = [];

  function toMobile() {
    if (mTop.parentNode) return;
    document.body.appendChild(mTop);
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
      if (s.next && s.next.parentNode === s.parent) s.parent.insertBefore(s.el, s.next);
      else s.parent.appendChild(s.el);
    }
    mTop.remove();
  }
  const mq = matchMedia("(max-width:860px)");
  const sync = () => (mq.matches ? toMobile() : toDesktop());
  sync();
  if (mq.addEventListener) mq.addEventListener("change", sync); else mq.addListener(sync);

  /* un glissement qui démarre sur la barre du haut ne fait pas défiler le carrousel */
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
