/* =====================================================================
   MOBILE.JS — optimisations téléphone (iPhone / Android)  · v2

   INSTALLATION : une ligne dans index.html, tout en bas, APRÈS london70.js :
       <script src="mobile.js"></script>

   Sur téléphone (≤ 860 px) :
   - en-tête compact sur UNE ligne : menu | logo | thème
   - les boutons May / UK 70 sont rangés dans le tiroir du menu
   - petits écrans : compteur réduit, description raccourcie
   - l'indice « Glisser » disparaît après le premier geste
   Sur ordinateur, tout est remis exactement à sa place d'origine.
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
.menu-btn,.menu-backdrop,#mTop{display:none}

/* ---- indice de glissement : disparaît après le premier geste ---- */
.hint{transition:opacity .6s ease}
html.hint-off .hint{opacity:0}

/* ---- survol collant : sur écran tactile ---- */
@media(hover:none){
  ${R}.uk .card:not(.is-on):hover img{filter:grayscale(1) contrast(1.35) brightness(.96)}
  ${R}.uk .card:not(.is-on):hover::after{opacity:.5}
  .b-link:hover{background:none;color:inherit}
  .c-btn:hover{transform:none;box-shadow:4px 4px 0 #0b0b0b}
  .c-mail:hover{background:none}
  textarea.c-in{resize:none}
}

@media(max-width:860px){

  /* ============ EN-TÊTE : une seule ligne ============ */
  .menu-btn{
    display:block;position:fixed;z-index:60;
    left:calc(4px + var(--sl,0px));top:calc(4px + var(--st,0px));
    width:44px;height:44px;padding:0;color:var(--dw-fg,currentColor);
    transition:opacity .8s ease
  }
  .menu-btn i{position:absolute;left:12px;right:12px;height:2px;background:currentColor;transition:transform .3s ease,top .3s ease}
  .menu-btn i:nth-child(1){top:18px}
  .menu-btn i:nth-child(2){top:25px}
  html.menu-open .menu-btn i:nth-child(1){top:21.5px;transform:rotate(45deg)}
  html.menu-open .menu-btn i:nth-child(2){top:21.5px;transform:rotate(-45deg)}
  body:not(.ui) .menu-btn{opacity:0;pointer-events:none}

  ${R} .themebtn{width:44px;height:44px;right:calc(4px + var(--sr,0px));top:calc(4px + var(--st,0px))}

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
    margin:0 !important;width:auto !important;max-width:100% !important;height:44px !important;
    display:block !important;line-height:44px !important;text-align:center !important;
    white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;
    font-size:15px !important;letter-spacing:.08em !important
  }
  #mTop .brand *{writing-mode:horizontal-tb !important;transform:none !important;rotate:none !important}

  /* ============ MENU TIROIR ============ */
  .menu-backdrop{
    display:block;position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.32);
    opacity:0;visibility:hidden;transition:opacity .3s ease,visibility 0s linear .3s
  }
  html.menu-open .menu-backdrop{opacity:1;visibility:visible;transition:opacity .3s ease}

  ${R} .nav{
    position:fixed;z-index:55;
    top:calc(52px + var(--st,0px));left:calc(10px + var(--sl,0px));right:calc(10px + var(--sr,0px));bottom:auto;
    width:auto;height:auto;margin:0;padding:0;
    display:flex;flex-direction:column;align-items:stretch;gap:0;
    background:var(--dw-bg,#fff);color:var(--dw-fg,#0b0b0b);
    border:1px solid var(--dw-fg,#0b0b0b);
    max-height:calc(100dvh - 62px - var(--st,0px) - var(--sb,0px));overflow-y:auto;overscroll-behavior:contain;
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
  ${R} .nav button::before{content:counter(nv,decimal-leading-zero);font-size:12px;letter-spacing:.12em;opacity:.45;min-width:34px}
  ${R} .nav button::after{content:"→";font-size:18px;opacity:.45;margin-left:auto}

  /* ---- boutons May / UK70 rangés en bas du tiroir ---- */
  ${R} .nav .nav-modes{
    display:flex;align-items:center;gap:12px;padding:16px 18px 20px;
    border-top:1px solid color-mix(in srgb,var(--dw-fg,#0b0b0b) 18%,transparent)
  }
  ${R} .nav .nav-modes .nav-modes-label{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.5;margin-right:auto}
  ${R} .nav .mode-switch{
    position:static !important;inset:auto !important;display:flex !important;
    margin:0 !important;gap:14px;width:auto !important
  }
  ${R} .nav .mode-switch button{
    width:auto;min-height:44px;margin:0;padding:8px 16px 5px;font-size:17px;
    justify-content:center;counter-increment:none
  }
  ${R} .nav .mode-switch button::before,${R} .nav .mode-switch button::after{content:none}
  ${R} .nav .mode-switch .may-btn{color:#0b0b0b;box-shadow:4px 4px 0 #0b0b0b;transform:rotate(-4deg)}
  ${R} .nav .mode-switch .uk-btn{color:#efece3;box-shadow:4px 4px 0 #ff2d8a;transform:rotate(3deg)}
  ${R} .nav .mode-switch .uk-btn[aria-pressed="true"]{color:#0b0b0b;box-shadow:4px 4px 0 #0b0b0b}

  /* ============ le reste de la page ============ */
  .modal-close,.panel .close,.lb-close{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}
  .modal-nav button{min-height:44px}
  .c-btn{min-height:44px;display:inline-flex;align-items:center}
  .c-in{min-height:48px;font-size:16px}          /* 16 px mini : évite le zoom automatique d'iOS */
  textarea.c-in{min-height:130px}

  /* pages À propos / Contact : marge haute réduite (plus de boutons de mode dans l'en-tête) */
  .panel{padding-top:calc(96px + var(--st,0px))}
  .panel .in{padding-top:0}
  .panel .close{top:calc(54px + var(--st,0px));right:calc(10px + var(--sr,0px))}
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

/* écrans peu hauts (iPhone SE / mini…) : on évite le chevauchement compteur / description */
@media(max-width:860px) and (max-height:700px){
  ${R} .counter b{font-size:58px}
  ${R} .item{top:73%}
  ${R} .item .ttl{font-size:23px}
  ${R} .item .dsc{-webkit-line-clamp:2;line-clamp:2}
  ${R} .item .bar{margin-top:10px;margin-bottom:10px}
}

/* petits écrans (≤ 400 px) */
@media(max-width:400px){
  #mTop .brand{font-size:14px !important;letter-spacing:.06em !important}
  ${R} .nav button{font-size:23px}
  ${R} .item .ttl{font-size:23px}
  .c-pm{width:96px;right:54px}
  .c-stamp{width:60px}
  .c-air{font-size:11px}
}

/* téléphone en paysage */
@media(max-height:520px) and (orientation:landscape){
  .panel{padding-top:calc(60px + var(--st,0px))}
  .panel h2{font-size:40px;margin-bottom:16px}
  .panel .in{padding-top:0}
  .about-stage,.about-stage.is-model{max-width:140px}
  ${R} .nav{top:calc(52px + var(--st,0px))}
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
     En-tête : le logo va dans #mTop, les boutons de mode dans le tiroir (mobile).
     Sur grand écran, tout est remis à sa place d'origine.
     Les boutons gardent leurs écouteurs : May / UK 70 fonctionnent comme avant.
     --------------------------------------------------------------- */
  const root = document.documentElement;
  const brand = document.querySelector(".brand");
  const modes = document.querySelector(".mode-switch");
  const nav = document.querySelector(".nav");
  const mTop = document.createElement("div");
  mTop.id = "mTop";
  const navModes = document.createElement("div");
  navModes.className = "nav-modes";
  const modesLabel = document.createElement("span");
  modesLabel.className = "nav-modes-label";
  modesLabel.textContent = "Univers";
  navModes.appendChild(modesLabel);
  const saved = [];

  function stash(el, dest) {
    if (!el || !dest) return;
    saved.push({ el: el, parent: el.parentNode, next: el.nextSibling });
    dest.appendChild(el);
  }
  function toMobile() {
    if (mTop.parentNode) return;
    document.body.appendChild(mTop);
    stash(brand, mTop);
    if (modes && nav) { stash(modes, navModes); nav.appendChild(navModes); }
    else stash(modes, mTop);
  }
  function toDesktop() {
    if (!mTop.parentNode) return;
    while (saved.length) {
      const s = saved.pop();
      if (s.next && s.next.parentNode === s.parent) s.parent.insertBefore(s.el, s.next);
      else s.parent.appendChild(s.el);
    }
    navModes.remove();
    mTop.remove();
  }
  const mq = matchMedia("(max-width:860px)");
  const sync = () => (mq.matches ? toMobile() : toDesktop());
  sync();
  if (mq.addEventListener) mq.addEventListener("change", sync); else mq.addListener(sync);

  /* ---------------------------------------------------------------
     MENU TIROIR
     --------------------------------------------------------------- */
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
      try { if (navigator.vibrate) navigator.vibrate(6); } catch (e) {}
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
      if (e.target.closest && e.target.closest(".themebtn")) close();
    });
    addEventListener("resize", () => { if (innerWidth > 860) close(); });

    /* glisser vers le haut sur le tiroir = le refermer */
    let y0 = null;
    nav.addEventListener("touchstart", e => { y0 = e.touches[0].clientY; }, { passive: true });
    nav.addEventListener("touchmove", e => {
      if (y0 !== null && y0 - e.touches[0].clientY > 40) { y0 = null; close(); }
    }, { passive: true });
    nav.addEventListener("touchend", () => { y0 = null; }, { passive: true });
    back.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
  }

  /* ---- l'indice « Glisser » disparaît après le premier geste ---- */
  const hideHint = () => {
    root.classList.add("hint-off");
    removeEventListener("touchmove", hideHint, true);
    removeEventListener("wheel", hideHint, true);
  };
  addEventListener("touchmove", hideHint, { capture: true, passive: true });
  addEventListener("wheel", hideHint, { capture: true, passive: true });

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
        n.setAttribute("shadow-intensity", "0.6");
        n.setAttribute("interaction-prompt", "none");
      }
    }))).observe(document.body, { childList: true, subtree: true });
  }
})();
