/* =====================================================================
   MOBILE.JS — optimisations téléphone (iPhone / Android)

   INSTALLATION : une ligne dans index.html, tout en bas, APRÈS london70.js :
       <script src="mobile.js"></script>

   Sur téléphone (≤ 860 px) :
   - barre du haut : bouton menu à gauche · logo centré · bouton thème à droite
   - le menu devient un tiroir qui se déroule sous la barre
   - les boutons de mode (May / UK 70) sont centrés sous le logo
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

/* ---- bouton menu + fond du tiroir : cachés sur ordinateur ---- */
.menu-btn,.menu-backdrop{display:none}

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

  /* ============ BARRE DU HAUT : menu · logo · thème ============ */
  .menu-btn{
    display:block;position:fixed;z-index:60;
    left:calc(4px + var(--sl,0px));top:calc(6px + var(--st,0px));
    width:44px;height:44px;padding:0;color:var(--dw-fg,currentColor);
    -webkit-tap-highlight-color:transparent;transition:opacity .8s ease
  }
  .menu-btn i{position:absolute;left:12px;right:12px;height:2px;background:currentColor;transition:transform .3s ease,top .3s ease}
  .menu-btn i:nth-child(1){top:18px}
  .menu-btn i:nth-child(2){top:25px}
  html.menu-open .menu-btn i:nth-child(1){top:21.5px;transform:rotate(45deg)}
  html.menu-open .menu-btn i:nth-child(2){top:21.5px;transform:rotate(-45deg)}
  body:not(.ui) .menu-btn{opacity:0;pointer-events:none}

  /* logo : centré, sur la même ligne que le menu et le bouton thème */
  ${R} .brand{
    position:fixed;top:calc(6px + var(--st,0px));left:0;right:0;bottom:auto;
    margin:0 auto;width:max-content;max-width:calc(100% - 110px);
    height:44px;display:flex;align-items:center;justify-content:center;
    text-align:center;white-space:nowrap
  }
  ${R} .themebtn{width:44px;height:44px;right:calc(4px + var(--sr,0px));top:calc(6px + var(--st,0px))}

  /* boutons de mode : centrés sous le logo */
  ${R} .mode-switch{
    top:calc(54px + var(--st,0px));left:0;right:0;bottom:auto;
    margin-left:auto;margin-right:auto;width:max-content;max-width:calc(100% - 24px)
  }
  ${R} .mode-switch .may-btn,${R} .mode-switch .uk-btn{min-height:40px}

  /* ============ MENU TIROIR ============ */
  .menu-backdrop{
    display:block;position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.32);
    opacity:0;visibility:hidden;transition:opacity .3s ease,visibility 0s linear .3s
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
    transform:translateY(-8px);transition:transform .38s cubic-bezier(.2,.8,.2,1)
  }
  ${R}.menu-open .nav button{transform:none}
  ${R}.menu-open .nav button:nth-child(2){transition-delay:.05s}
  ${R}.menu-open .nav button:nth-child(3){transition-delay:.1s}
  ${R}.menu-open .nav button:nth-child(4){transition-delay:.15s}
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
  .panel{padding-top:calc(106px + var(--st,0px))}
  .panel .in{padding-top:8px}
  .panel .close{top:calc(60px + var(--st,0px));right:calc(10px + var(--sr,0px))}
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

/* petits écrans (≤ 400 px) */
@media(max-width:400px){
  ${R} .brand{font-size:17px}
  ${R} .nav button{font-size:23px}
  ${R} .counter b{font-size:72px}
  ${R} .item .ttl{font-size:23px}
  .c-pm{width:96px;right:54px}
  .c-stamp{width:60px}
  .c-air{font-size:11px}
}

/* téléphone en paysage : une seule ligne en haut, les modes passent à droite du bouton thème */
@media(max-height:520px) and (orientation:landscape){
  .panel{padding-top:calc(60px + var(--st,0px))}
  .panel h2{font-size:40px;margin-bottom:16px}
  .panel .in{padding-top:0}
  .about-stage,.about-stage.is-model{max-width:140px}
  ${R} .mode-switch{top:calc(8px + var(--st,0px));left:auto;right:calc(54px + var(--sr,0px));margin:0}
  ${R} .nav{top:calc(54px + var(--st,0px))}
  ${R} .nav button{min-height:46px;font-size:21px}
  .modal-layout{display:grid;grid-template-columns:minmax(200px,.8fr) minmax(0,1.4fr);gap:4vw}
  .modal-info{position:sticky;top:70px}
  .modal-info .modal-nav{display:flex}
  .modal-nav-end{display:none}
}

@media(prefers-reduced-motion:reduce){
  .nav,.menu-backdrop,.menu-btn i{transition:none !important}
}
`;
  const st = document.createElement("style");
  st.id = "mobile-style";
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------------------------------------------------------------
     MENU TIROIR (les boutons du menu restent ceux du site : leurs actions ne changent pas)
     --------------------------------------------------------------- */
  const root = document.documentElement;
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

    function setOpen(on) {
      if (on === root.classList.contains("menu-open")) return;
      if (on) paintColors();
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

    btn.addEventListener("click", e => { e.stopPropagation(); setOpen(!root.classList.contains("menu-open")); });
    back.addEventListener("click", close);
    nav.addEventListener("click", e => { if (e.target.closest("button,a")) close(); });   /* après l'action du site */
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    document.addEventListener("click", e => {
      if (e.target.closest && e.target.closest(".mode-switch,.themebtn")) close();
    });
    addEventListener("resize", () => { if (innerWidth > 860) close(); });

    /* glisser vers le haut sur le tiroir = le refermer */
    let y0 = null;
    nav.addEventListener("touchstart", e => { y0 = e.touches[0].clientY; }, { passive: true });
    nav.addEventListener("touchmove", e => {
      if (y0 !== null && y0 - e.touches[0].clientY > 40) { y0 = null; close(); }
    }, { passive: true });
    nav.addEventListener("touchend", () => { y0 = null; }, { passive: true });
    /* le fond ne fait pas défiler la page derrière */
    back.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
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
