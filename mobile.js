/* =====================================================================
   MOBILE.JS — optimisations téléphone (iPhone / Android)

   INSTALLATION : une ligne dans index.html, tout en bas, APRÈS london70.js :
       <script src="mobile.js"></script>
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

/* ---- hauteur réelle (barre d'adresse mobile) ---- */
.lightbox img{max-height:92dvh}
.panel{height:100dvh}

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
  /* zones tactiles d'au moins 44 px */
  ${R} .nav button{min-height:44px;display:inline-flex;align-items:center;padding:0;margin-right:14px}
  ${R} .themebtn{width:44px;height:44px;right:calc(4px + var(--sr));top:calc(6px + var(--st))}
  ${R} .mode-switch{top:calc(54px + var(--st))}
  ${R} .mode-switch .may-btn,${R} .mode-switch .uk-btn{min-height:40px}
  .modal-close,.panel .close,.lb-close{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}
  .modal-nav button{min-height:44px}
  .c-btn{min-height:44px;display:inline-flex;align-items:center}
  .c-in{min-height:48px;font-size:16px}          /* 16 px mini : évite le zoom automatique d'iOS */
  textarea.c-in{min-height:130px}

  /* pages À propos / Contact : on laisse la place au menu fixe en haut */
  .panel{padding-top:calc(66px + var(--st))}
  .panel .in{padding-top:8px}
  .panel .close{top:calc(60px + var(--st));right:calc(10px + var(--sr))}
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

/* petits écrans (≤ 400 px) : menu plus serré pour ne pas toucher le bouton thème */
@media(max-width:400px){
  ${R} .brand{font-size:17px}
  ${R} .nav{left:calc(40px + var(--sl))}
  ${R} .nav button{font-size:13px;margin-right:10px}
  ${R} .counter b{font-size:72px}
  ${R} .item .ttl{font-size:23px}
  .c-pm{width:96px;right:54px}
  .c-stamp{width:60px}
  .c-air{font-size:11px}
}

/* téléphone en paysage */
@media(max-height:520px) and (orientation:landscape){
  .panel h2{font-size:40px;margin-bottom:16px}
  .panel .in{padding-top:0}
  .about-stage,.about-stage.is-model{max-width:140px}
  ${R} .mode-switch{top:calc(8px + var(--st));right:calc(54px + var(--sr))}
  .modal-layout{display:grid;grid-template-columns:minmax(200px,.8fr) minmax(0,1.4fr);gap:4vw}
  .modal-info{position:sticky;top:70px}
  .modal-info .modal-nav{display:flex}
  .modal-nav-end{display:none}
}
`;
  const st = document.createElement("style");
  st.id = "mobile-style";
  st.textContent = css;
  document.head.appendChild(st);

  /* ---- clavier mobile : le champ actif reste visible dans la page Contact ---- */
  document.addEventListener("focusin", e => {
    const t = e.target;
    if (!t || !t.classList || !t.classList.contains("c-in")) return;
    setTimeout(() => { try { t.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (err) {} }, 320);
  });

  /* ---- hauteur dynamique pour les éléments plein écran (iOS) ---- */
  const setVh = () => document.documentElement.style.setProperty("--vh", (innerHeight * .01) + "px");
  setVh();
  addEventListener("resize", setVh);
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
