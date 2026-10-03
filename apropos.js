/* =====================================================================
   À PROPOS — Mayliane en 3D + formation, compétences, expériences

   INSTALLATION : une seule ligne dans index.html, juste avant </body> :
       <script src="apropos.js"></script>

   Ce fichier remplace le contenu de l'onglet « À propos » sans toucher au reste du site.
   Tout ce qui est à modifier est dans le bloc  ABOUT  ci-dessous.
   ===================================================================== */
(function () {
  "use strict";

  /* =================================================================
     À MODIFIER
     ================================================================= */
  const ABOUT = {

    /* ---- LE 3D (3 possibilités, de la plus simple à la plus réaliste) ----

       1) Rien                      -> une carte « ta photo ici » qui tourne en 3D (pour tester)
       2) photo: "mayliane.png"     -> TA PHOTO DÉTOURÉE (fond transparent, PNG) qui tourne en 3D
                                       comme un sticker épais, avec un contour blanc
       3) model: "mayliane.glb"     -> un VRAI modèle 3D (scan / avatar exporté en .glb)
                                       qui tourne et que l'on peut faire pivoter avec le doigt / la souris
       Si model est rempli, il passe avant photo. Si le .glb ne se charge pas, la photo prend le relais. */
    photo: "",          // ex. "mayliane.png"  (PNG sans fond, plutôt en pied ou en buste, format portrait)
    photoBack: "",      // optionnel : photo du dos ou d'une autre pose ; vide = la même photo des deux côtés
    model: "mayliane.glb",   // ton modèle 3D (laisse "" pour revenir à la photo / à la carte de démonstration)
    poster: "",         // optionnel (avec model) : image affichée pendant le chargement du modèle
    hint: "Glisse pour la faire tourner",

    /* ---- PRÉSENTATION (un texte par paragraphe) ---- */
    intro: [
      "✎ Écris ici ta présentation : qui tu es, ce que tu aimes faire, ce que tu recherches.",
      "✎ Un deuxième paragraphe si tu veux : ta façon de travailler, ce qui te motive."
    ],

    /* ---- FORMATION ---- */
    formation: [
      { period: "20XX – 20XX", title: "✎ Intitulé de ta formation", place: "Établissement, ville", text: "" },
      { period: "20XX – 20XX", title: "✎ Formation précédente", place: "Établissement, ville", text: "" }
    ],

    /* ---- COMPÉTENCES (par groupe) ---- */
    skills: [
      { group: "Communication",
        items: ["Identité visuelle & branding", "Stratégie de communication", "Études de cibles & personas",
                "Création de contenu", "Spot publicitaire", "Lancement de produit"] },
      { group: "Événementiel",
        items: ["Organisation d’événements", "Wedding planning", "Gestion de devis & prestataires"] },
      { group: "Outils",
        items: ["Canva", "✎ ajoute tes outils"] },
      { group: "Savoir-être",
        items: ["Travail en équipe", "Créativité", "✎ ajoute tes qualités"] }
    ],

    /* ---- EXPÉRIENCES (stages, jobs, projets, associations…) ---- */
    experiences: [
      { period: "20XX", title: "✎ Intitulé du poste ou du stage", place: "Entreprise, ville",
        text: "✎ Ce que tu as fait, en une ou deux phrases." },
      { period: "20XX", title: "✎ Autre expérience", place: "Structure, ville", text: "" }
    ]
  };
  /* =================================================================
     FIN DE LA ZONE À MODIFIER
     ================================================================= */

  if (window.APROPOS) Object.assign(ABOUT, window.APROPOS);   // (facultatif) réglages depuis index.html

  const REDUCED = !!(window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches);
  const DIR = (typeof IMG_DIR === "string") ? IMG_DIR : "";
  const asset = s => /^(https?:)?\/\//i.test(s) || /^(data|blob):/i.test(s) ? s : DIR + s;
  const $ = id => document.getElementById(id);
  const MV_URLS = [
    "https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js",
    "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
  ];

  /* ---------------------------------------------------------------
     STYLE (injecté une seule fois)
     --------------------------------------------------------------- */
  const css = `
.panel.is-about .in{max-width:1280px;margin-left:16vw;margin-right:4vw;padding-bottom:150px}
.about{display:grid;grid-template-columns:minmax(240px,.8fr) minmax(0,1.5fr);gap:6vw;align-items:start}
.about-3d{position:sticky;top:calc(26px + var(--st,0px))}
.about-stage{position:relative;width:100%;max-width:380px;aspect-ratio:3/4;perspective:1100px;touch-action:pan-y;cursor:grab;
  user-select:none;-webkit-user-select:none}
.about-stage:active{cursor:grabbing}
.about-stage.is-model{aspect-ratio:2/3.1;max-width:340px}
.about-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;
  color:var(--mute);font-size:13px;letter-spacing:.08em;text-transform:uppercase;pointer-events:none}
.about-stage model-viewer{width:100%;height:100%;background:transparent;--poster-color:transparent;outline:none}
.about-hint{margin-top:12px;color:var(--mute);font-size:13px}

.stand{position:absolute;inset:4% 10% 9%;transform-style:preserve-3d}
.stand-rot{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}
.stand-l{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;-webkit-user-drag:none}
.stand-l.front,.stand-l.back{backface-visibility:hidden;-webkit-backface-visibility:hidden;
  filter:drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff)}
.stand-l.side{filter:brightness(.12)}
.stand-shadow{position:absolute;left:16%;right:16%;bottom:1%;height:6%;border-radius:50%;
  background:radial-gradient(closest-side,rgba(0,0,0,.5),transparent);filter:blur(3px);pointer-events:none}
.ph-card{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  background:#f6f3ec;color:#0b0b0b;border:3px solid #0b0b0b;border-radius:8px;text-align:center;padding:10%}
.ph-card b{font-family:"Permanent Marker","Marker Felt",cursive;font-weight:400;font-size:clamp(54px,9vw,96px);line-height:1;color:#c8102e}
.ph-card span{font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.ph-card.yel{background:#ffd400}.ph-card.yel b{color:#0b0b0b}
.ph-side{width:100%;height:100%;background:#161616;border-radius:8px}

.about-lead{font-size:clamp(18px,1.7vw,24px);line-height:1.4;max-width:34em;margin-bottom:14px}
.ab-sec{margin-top:46px}
.about-lead+.ab-sec{margin-top:40px}
.ab-h{display:flex;align-items:center;gap:14px;margin-bottom:20px;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.ab-h::after{content:"";flex:1;height:1px;background:var(--line)}
.tl{list-style:none;position:relative;margin:0;padding:0 0 0 26px;border-left:2px solid var(--line)}
.tl li{position:relative;padding:0 0 26px}
.tl li:last-child{padding-bottom:0}
.tl li::before{content:"";position:absolute;left:-33px;top:.3em;width:12px;height:12px;border-radius:50%;background:var(--ink);border:2px solid var(--bg)}
.tl-p{display:block;color:var(--mute);font-size:13px;letter-spacing:.05em;margin-bottom:4px}
.tl-t{display:block;font-size:19px;font-weight:700;line-height:1.2}
.tl-w{display:block;color:var(--mute);margin-top:3px}
.tl-x{margin-top:8px;line-height:1.5;max-width:52ch;font-size:16px}
.sk-g+.sk-g{margin-top:22px}
.sk-n{display:block;color:var(--mute);font-size:13px;margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:9px}
.chip{padding:7px 14px 6px;border:1px solid var(--ink);border-radius:999px;font-size:14px;line-height:1.2}

/* ---- univers May ---- */
:root:not(.no-may) .ab-h{display:inline-block;margin-bottom:22px;padding:4px 14px 2px;background:var(--yellow);color:var(--black);
  font-family:var(--mk);font-weight:400;font-size:clamp(20px,2vw,26px);letter-spacing:0;transform:rotate(-1.5deg)}
:root:not(.no-may) .ab-h::after{content:none}
:root:not(.no-may) .about-lead{font-size:clamp(17px,1.6vw,22px)}
:root:not(.no-may) .tl{border-left:3px dashed var(--ink)}
:root:not(.no-may) .tl li::before{left:-35px;width:14px;height:14px;border-radius:0;background:var(--red);border:2px solid var(--black);transform:rotate(45deg)}
:root[data-theme="dark"]:not(.no-may) .tl li::before{background:var(--pink)}
:root:not(.no-may) .tl-p{font-family:var(--mk);color:var(--red);font-size:16px;letter-spacing:.02em}
:root[data-theme="dark"]:not(.no-may) .tl-p{color:var(--pink)}
:root:not(.no-may) .tl-t{font-family:var(--mk);font-weight:400;font-size:21px}
:root:not(.no-may) .chip{background:var(--paper);color:var(--black);border:2px solid var(--black);border-radius:0;
  box-shadow:3px 3px 0 var(--red);transform:rotate(var(--r,0deg))}
:root[data-theme="dark"]:not(.no-may) .chip{box-shadow:3px 3px 0 var(--pink)}
:root:not(.no-may) .chip:nth-child(3n+1){--r:-1.6deg}
:root:not(.no-may) .chip:nth-child(3n+2){--r:1.2deg}
:root:not(.no-may) .chip:nth-child(3n){--r:-.4deg}
:root:not(.no-may) .sk-n{font-family:var(--mk);color:var(--red);font-size:16px}
:root[data-theme="dark"]:not(.no-may) .sk-n{color:var(--pink)}
:root:not(.no-may) .about-hint{font-family:var(--mk);color:var(--red);font-size:16px;transform:rotate(-2deg);display:inline-block}
:root[data-theme="dark"]:not(.no-may) .about-hint{color:var(--pink)}

@media(max-width:860px){
  .panel.is-about .in{margin:0;padding-top:50px;padding-bottom:120px}
  .about{display:block}
  .about-3d{position:static;margin-bottom:30px}
  .about-stage{max-width:250px;margin:0 auto}
  .about-hint{display:block;text-align:center}
  .tl-t{font-size:18px}
}
@media(max-width:860px){.about-stage.is-model{max-width:230px}}
@media(max-width:860px) and (max-height:640px){.about-stage,.about-stage.is-model{max-width:170px}}
`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------------------------------------------------------
     OUTILS
     --------------------------------------------------------------- */
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  let tok = 0, mvPromise = null;

  /* ---------------------------------------------------------------
     3D : vrai modèle .glb (model-viewer de Google)
     --------------------------------------------------------------- */
  function loadMV() {
    if (window.customElements && customElements.get("model-viewer")) return Promise.resolve();
    if (mvPromise) return mvPromise;
    mvPromise = new Promise((resolve, reject) => {
      let i = 0;
      const next = () => {
        if (i >= MV_URLS.length) { mvPromise = null; reject(new Error("model-viewer")); return; }
        const s = document.createElement("script");
        s.type = "module"; s.src = MV_URLS[i++];
        s.onload = () => resolve();
        s.onerror = () => { s.remove(); next(); };
        document.head.appendChild(s);
      };
      next();
    });
    return mvPromise;
  }

  function mountModel(stage, token) {
    const mv = document.createElement("model-viewer");
    const set = (k, v) => mv.setAttribute(k, v);
    set("src", asset(ABOUT.model));
    set("alt", "Modèle 3D de " + (typeof CONFIG !== "undefined" ? CONFIG.name : "Mayliane"));
    set("auto-rotate", "");
    set("rotation-per-second", "28deg");
    set("auto-rotate-delay", "800");
    set("camera-controls", "");
    set("disable-zoom", "");
    set("disable-pan", "");
    set("interaction-prompt", "none");
    set("touch-action", "pan-y");
    set("shadow-intensity", "1");
    set("shadow-softness", "1");
    set("exposure", "1.05");
    set("camera-orbit", "0deg 82deg auto");
    set("min-camera-orbit", "auto 60deg auto");          // on ne la regarde pas d'en dessous / de trop haut
    set("max-camera-orbit", "auto 100deg auto");
    set("environment-image", "neutral");
    if (ABOUT.poster) set("poster", asset(ABOUT.poster));
    if (REDUCED) mv.removeAttribute("auto-rotate");
    stage.classList.add("is-model");
    const loading = el("div", "about-loading", "Chargement du modèle 3D…");
    mv.addEventListener("load", () => loading.remove());
    mv.addEventListener("error", () => {
      if (token !== tok) return;
      stage.innerHTML = "";
      stage.classList.remove("is-model");
      mountStand(stage, token);              // le .glb n'a pas pu se charger : on bascule sur la photo
    });
    stage.appendChild(mv);
    stage.appendChild(loading);
  }

  /* ---------------------------------------------------------------
     3D : « sticker » épais fait avec la photo détourée
     (empilement de calques + rotation continue + glisser pour tourner)
     --------------------------------------------------------------- */
  function layer(kind, which) {
    // kind : "front" | "back" | "side"
    let node;
    if (ABOUT.photo) {
      node = new Image();
      node.alt = ""; node.draggable = false; node.decoding = "async";
      node.src = asset(which === "back" && ABOUT.photoBack ? ABOUT.photoBack : ABOUT.photo);
    } else {
      node = el("div");
      if (kind === "side") node.appendChild(el("div", "ph-side"));
      else {
        const c = el("div", "ph-card" + (which === "back" ? " yel" : ""));
        c.appendChild(el("b", null, which === "back" ? "May ★" : "ML"));
        c.appendChild(el("span", null, which === "back" ? "keep it weird" : "ta photo ici"));
        node.appendChild(c);
      }
    }
    node.classList.add("stand-l", kind);
    return node;
  }

  function mountStand(stage, token) {
    const stand = el("div", "stand"), rot = el("div", "stand-rot");
    const w = stage.clientWidth || 300;
    const depth = Math.round(Math.max(14, w * .055));
    const N = 9;
    for (let i = 0; i < N; i++) {
      const z = (i / (N - 1) - .5) * depth;
      let l;
      if (i === N - 1) { l = layer("front"); l.style.transform = "translateZ(" + z.toFixed(1) + "px)"; }
      else if (i === 0) { l = layer("back", "back"); l.style.transform = "translateZ(" + z.toFixed(1) + "px) rotateY(180deg)"; }
      else { l = layer("side"); l.style.transform = "translateZ(" + z.toFixed(1) + "px)"; }
      rot.appendChild(l);
    }
    stand.appendChild(rot);
    stage.appendChild(el("div", "stand-shadow"));
    stage.appendChild(stand);

    let ang = -24, v = 0, drag = null, last = performance.now();
    const auto = REDUCED ? 0 : .03;                       // degrés par ms (≈ 12 s par tour)
    const panel = $("panel");

    function frame(now) {
      if (token !== tok || !stage.isConnected || !panel.classList.contains("open")) return;   // arrêt quand on quitte la page
      const dt = Math.min(40, now - last); last = now;
      if (!drag) { v += (auto - v) * Math.min(1, dt * .004); ang += v * dt; }
      rot.style.transform = "rotateX(-3deg) rotateY(" + ang.toFixed(2) + "deg)";
      requestAnimationFrame(frame);
    }
    stage.addEventListener("pointerdown", e => {
      drag = { x: e.clientX, a: ang, lx: e.clientX, lt: performance.now() };
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    });
    stage.addEventListener("pointermove", e => {
      if (!drag) return;
      const now = performance.now();
      ang = drag.a + (e.clientX - drag.x) * .6;
      v = ((e.clientX - drag.lx) * .6) / Math.max(1, now - drag.lt);
      drag.lx = e.clientX; drag.lt = now;
    });
    const end = () => { drag = null; };
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
    stage.addEventListener("lostpointercapture", end);
    requestAnimationFrame(frame);
  }

  function mount3D(stage) {
    const token = ++tok;
    if (ABOUT.model) {
      loadMV().then(() => { if (token === tok && stage.isConnected) mountModel(stage, token); })
              .catch(() => { if (token === tok && stage.isConnected) mountStand(stage, token); });
      return;
    }
    mountStand(stage, token);
  }

  /* ---------------------------------------------------------------
     CONTENU
     --------------------------------------------------------------- */
  function timeline(items) {
    const ul = el("ul", "tl");
    items.forEach(it => {
      const li = el("li");
      if (it.period) li.appendChild(el("span", "tl-p", it.period));
      if (it.title) li.appendChild(el("span", "tl-t", it.title));
      if (it.place) li.appendChild(el("span", "tl-w", it.place));
      if (it.text) li.appendChild(el("p", "tl-x", it.text));
      ul.appendChild(li);
    });
    return ul;
  }
  function section(body, title) {
    const s = el("section", "ab-sec");
    s.appendChild(el("h3", "ab-h", title));
    body.appendChild(s);
    return s;
  }

  function buildAbout(pin) {
    pin.innerHTML = "";
    pin.appendChild(el("h2", null, "À propos"));

    const grid = el("div", "about");
    const left = el("div", "about-3d");
    const stage = el("div", "about-stage");
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", "Mayliane en 3D");
    left.appendChild(stage);
    if (ABOUT.hint) left.appendChild(el("p", "about-hint", ABOUT.hint));

    const body = el("div", "about-body");
    const intro = (ABOUT.intro && ABOUT.intro.length) ? ABOUT.intro : [(typeof CONFIG !== "undefined" && CONFIG.about) || ""];
    intro.filter(Boolean).forEach(t => body.appendChild(el("p", "about-lead", t)));

    if (ABOUT.formation && ABOUT.formation.length) section(body, "Formation").appendChild(timeline(ABOUT.formation));

    if (ABOUT.skills && ABOUT.skills.length) {
      const s = section(body, "Compétences");
      ABOUT.skills.forEach(g => {
        const box = el("div", "sk-g");
        if (g.group) box.appendChild(el("span", "sk-n", g.group));
        const chips = el("div", "chips");
        (g.items || []).forEach(t => chips.appendChild(el("span", "chip", t)));
        box.appendChild(chips);
        s.appendChild(box);
      });
    }

    if (ABOUT.experiences && ABOUT.experiences.length) section(body, "Expériences").appendChild(timeline(ABOUT.experiences));

    grid.append(left, body);
    pin.appendChild(grid);
    mount3D(stage);
  }

  /* ---------------------------------------------------------------
     BRANCHEMENT sur le menu existant
     --------------------------------------------------------------- */
  const baseOpen = window.openPanel;
  if (typeof baseOpen !== "function") { console.warn("apropos.js : openPanel introuvable (le script doit être chargé après le script principal)."); return; }

  window.openPanel = function (k) {
    const r = baseOpen.apply(this, arguments);
    const panel = $("panel");
    if (k === "about") {
      panel.classList.add("is-about");
      buildAbout($("panel-in"));
      panel.scrollTop = 0;
    } else {
      panel.classList.remove("is-about");
      tok++;                                              // coupe l'animation 3D
    }
    return r;
  };
})();
