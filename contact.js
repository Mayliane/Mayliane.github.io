/* =====================================================================
   CONTACT — enveloppe « par avion » + lettre découpée façon ransom note

   INSTALLATION : une ligne dans index.html, juste avant </body>,
   APRÈS apropos.js :
       <script src="contact.js"></script>

   Le visiteur écrit son message : il s'affiche en lettres découpées
   (chaque lettre dans une police / couleur différente). Un clic sur
   « Poster la lettre » ouvre sa messagerie avec le message déjà écrit,
   adressé à ton mail. Aucun serveur, aucun compte : 100 % gratuit.

   Le mail est lu dans CONFIG.email (index.html). Textes à modifier : bloc TXT.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- À MODIFIER ---------------- */
  const TXT = {
    lead: "Une idée, un projet, une collab ? Écris ta lettre : elle sera découpée sur mesure.",
    airmail: "Par avion · Air mail",
    to: "À l’attention de",
    composeTitle: "Écris ta lettre",
    namePh: "Ton prénom (ou ta marque)",
    msgPh: "Ton message…",
    empty: "Ta lettre apparaît ici, découpée lettre par lettre…",
    send: "Poster la lettre ✉",
    mail: "Écrire un mail",
    copy: "Copier l’adresse",
    copied: "Copié ✓",
    needMsg: "Écris au moins un mot !",
    sent: "Lettre postée ✉ Ta messagerie s’est ouverte. Rien ne s’affiche ? Copie l’adresse et écris-moi directement.",
    subject: "Message depuis ton portfolio",
    hello: "Bonjour Mayliane,"
  };
  const MAX = 400;
  /* -------------------------------------------- */

  const EMAIL = (typeof CONFIG !== "undefined" && CONFIG.email) || "lefebvremayliane@gmail.com";
  const NAME = (typeof CONFIG !== "undefined" && CONFIG.name) || "Mayliane Lefebvre";
  const $ = id => document.getElementById(id);

  /* ---------------------------------------------------------------
     STYLE
     --------------------------------------------------------------- */
  const css = `
.panel.is-contact .in{max-width:1180px;margin-left:16vw;margin-right:4vw;padding-bottom:150px}
.panel.is-contact .legal{margin-top:60px}
.c-lead{font-size:clamp(17px,1.6vw,22px);line-height:1.4;max-width:34em;margin-bottom:40px}
.c-grid{display:grid;grid-template-columns:minmax(260px,.9fr) minmax(0,1.25fr);gap:5vw;align-items:start}

/* ---- l'enveloppe ---- */
.c-card{position:relative;background:#f6f3ec;color:#0b0b0b;padding:46px 26px 28px;transform:rotate(-1.6deg);
  border:11px solid transparent;
  border-image:repeating-linear-gradient(135deg,#c8102e 0 15px,#f6f3ec 15px 30px,#1d3a8a 30px 45px,#f6f3ec 45px 60px) 11;
  box-shadow:9px 9px 0 var(--hard,#0b0b0b);animation:cIn .6s cubic-bezier(.2,.8,.2,1) both}
.c-air{max-width:44%;line-height:1.6;font-family:"Special Elite","Courier New",monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#1d3a8a}
.c-to{margin-top:26px;font-family:"Special Elite","Courier New",monospace;font-size:13px;color:#6b655c}
.c-name{font-family:"Permanent Marker","Marker Felt",cursive;font-size:clamp(30px,3vw,42px);line-height:1.05;margin-top:2px;color:#c8102e}
.c-mail{display:block;margin-top:14px;font-family:"Special Elite","Courier New",monospace;font-size:clamp(15px,1.5vw,19px);
  color:#0b0b0b;text-decoration:none;border-bottom:2px solid #0b0b0b;padding-bottom:2px;word-break:break-all;width:max-content;max-width:100%}
.c-mail:hover{background:#ffd400}
.c-btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.c-stamp{position:absolute;top:14px;right:16px;width:86px;padding:7px;background:#ffd400;transform:rotate(5deg);
  outline:2px dashed #0b0b0b;outline-offset:-3px}
.c-stamp svg{display:block;width:100%;height:auto}
.c-pm{position:absolute;top:8px;right:76px;width:150px;height:auto;transform:rotate(-9deg);opacity:.82;pointer-events:none}

.c-btn{display:inline-block;font-family:"Permanent Marker","Marker Felt",cursive;font-size:17px;line-height:1;color:#0b0b0b;text-decoration:none;
  padding:11px 18px 8px;background:#ff3c8e;border:3px solid #0b0b0b;box-shadow:4px 4px 0 #0b0b0b;cursor:pointer;
  transition:transform .15s,box-shadow .15s}
.c-btn:hover{transform:translate(3px,3px);box-shadow:1px 1px 0 #0b0b0b}
.c-btn.alt{background:#ffd400}

/* ---- la lettre à découper ---- */
.c-h{display:inline-block;margin:0 0 20px;padding:4px 14px 2px;background:#ffd400;color:#0b0b0b;transform:rotate(-1.5deg);
  font-family:"Permanent Marker","Marker Felt",cursive;font-weight:400;font-size:clamp(20px,2vw,26px);letter-spacing:0;text-transform:none}
.c-in{display:block;width:100%;margin-bottom:14px;padding:12px 14px;background:#f6f3ec;color:#0b0b0b;border:3px solid #0b0b0b;border-radius:0;
  font-family:"Special Elite","Courier New",monospace;font-size:16px;line-height:1.4;box-shadow:5px 5px 0 var(--hard,#0b0b0b);
  resize:vertical;-webkit-appearance:none;appearance:none;touch-action:manipulation}
.c-in::placeholder{color:#8a8478}
.c-in:focus{outline:3px solid #ff3c8e;outline-offset:2px}
textarea.c-in{min-height:120px}
.c-count{display:block;margin:-6px 4px 0 0;text-align:right;font-family:"Special Elite","Courier New",monospace;font-size:12px;color:var(--mute,#8d8d8b)}

.c-prev{position:relative;min-height:150px;max-height:340px;overflow:auto;margin-top:18px;padding:18px 16px 14px;
  background:#c9b48a;background-image:radial-gradient(circle,rgba(0,0,0,.09) 1px,transparent 1.4px);background-size:6px 6px;
  border:2px dashed #0b0b0b;font-size:21px;line-height:1.95;color:#0b0b0b;overflow-wrap:anywhere}
.c-prev::before{content:"";position:absolute;top:-13px;left:50%;width:110px;height:24px;margin-left:-55px;background:rgba(255,60,142,.8);transform:rotate(-3deg)}
.c-empty{display:block;font-family:"Special Elite","Courier New",monospace;font-size:14px;line-height:1.5;color:rgba(11,11,11,.55)}
.cw{display:inline-block;white-space:nowrap}
.cl{display:inline-block;padding:.02em .1em 0;margin:0 .02em .12em;line-height:1.12;box-shadow:1px 2px 0 rgba(0,0,0,.4);
  transform:translateY(var(--y,0)) rotate(var(--r,0deg))}
.cl0{background:#f6f3ec;color:#0b0b0b;font-family:"Special Elite","Courier New",monospace}
.cl1{background:#0b0b0b;color:#f6f3ec;font-family:Gloock,Georgia,serif}
.cl2{background:#c8102e;color:#f6f3ec;font-family:"Permanent Marker","Marker Felt",cursive}
.cl3{background:#ffd400;color:#0b0b0b;font-family:Archivo,Arial,sans-serif;font-weight:900}
.cl4{background:#ff3c8e;color:#0b0b0b;font-family:Gloock,Georgia,serif}
.cl5{background:#d9d6cd;color:#0b0b0b;font-family:"Special Elite","Courier New",monospace;font-weight:700}

.c-send-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:22px}
.c-ok{flex:1 1 220px;margin:0;font-family:"Special Elite","Courier New",monospace;font-size:14px;line-height:1.45;color:var(--mute,#8d8d8b);
  opacity:0;transform:translateY(6px);transition:opacity .4s,transform .4s}
.c-ok.show{opacity:1;transform:none}
.c-warn{color:#ff3c8e}

.c-compose.sent .c-prev{animation:cFly .75s cubic-bezier(.5,0,.8,.4) forwards}
.c-compose.shake{animation:cShake .4s}
@keyframes cIn{from{opacity:0;transform:rotate(-6deg) translateY(24px) scale(.96)}to{opacity:1;transform:rotate(-1.6deg)}}
@keyframes cFly{to{transform:translateY(-46px) rotate(-6deg) scale(.9);opacity:.25}}
@keyframes cShake{20%{transform:translateX(-7px)}45%{transform:translateX(6px)}70%{transform:translateX(-4px)}100%{transform:none}}

@media(max-width:860px){
  .panel.is-contact .in{margin:0;padding-top:50px;padding-bottom:120px}
  .c-grid{display:block}
  .c-card{margin-bottom:38px;padding:44px 18px 22px}
  .c-pm{width:120px;right:62px}
  .c-stamp{width:70px}
  .c-prev{font-size:18px;line-height:1.9}
}
@media(prefers-reduced-motion:reduce){
  .c-card,.c-compose.sent .c-prev,.c-compose.shake{animation:none}
  .c-ok{transition:none}
}
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

  /* découpe le texte en lettres de magazine */
  function cut(text, box) {
    box.textContent = "";
    if (!text.trim()) { box.appendChild(el("span", "c-empty", TXT.empty)); return; }
    let i = 0;
    text.split("\n").forEach((line, li) => {
      if (li) box.appendChild(document.createElement("br"));
      line.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { box.appendChild(document.createTextNode(" ")); return; }
        const w = el("span", "cw");
        for (const ch of tok) {
          const s = el("span", "cl cl" + ((i * 5 + 2) % 6), ch);
          s.style.setProperty("--r", (((i * 53) % 11) - 5) + "deg");
          s.style.setProperty("--y", (((i * 17) % 5) - 2) + "px");
          s.style.fontSize = (1 + ((i * 29) % 4) * .09).toFixed(2) + "em";
          w.appendChild(s);
          i++;
        }
        box.appendChild(w);
      });
    });
  }

  function mailto(name, msg) {
    const subject = TXT.subject + (name ? " – " + name : "");
    const body = TXT.hello + "\n\n" + msg.trim() + "\n\n" + (name ? "— " + name : "");
    return "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function copy(text, btn) {
    const label = btn.textContent;
    const done = () => { btn.textContent = TXT.copied; setTimeout(() => { btn.textContent = label; }, 1600); };
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta); ta.select();
      try { if (document.execCommand("copy")) done(); } catch (e) {}
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  /* dessins (SVG maison) */
  const SVG_EYE =
    '<svg viewBox="0 0 120 84" aria-hidden="true">' +
    '<path d="M6,40 Q30,4 60,22 Q90,4 114,40 Q60,54 6,40Z" fill="#c8102e" stroke="#0b0b0b" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M8,42 Q60,56 112,42 Q98,80 60,80 Q22,80 8,42Z" fill="#c8102e" stroke="#0b0b0b" stroke-width="3" stroke-linejoin="round"/>' +
    '<ellipse cx="60" cy="45" rx="24" ry="11" fill="#fff" stroke="#0b0b0b" stroke-width="2.5"/>' +
    '<circle cx="60" cy="45" r="10" fill="#3b7fc4" stroke="#0b0b0b" stroke-width="2"/><circle cx="60" cy="45" r="4.5" fill="#0b0b0b"/>' +
    '<circle cx="56" cy="41" r="2" fill="#fff"/></svg>';

  const year = new Date().getFullYear();
  const SVG_POST =
    '<svg class="c-pm" viewBox="0 0 150 100" aria-hidden="true">' +
    '<defs><path id="cPmPath" d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0"/></defs>' +
    '<g fill="none" stroke="#1d3a8a" stroke-width="2.2"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="24"/>' +
    '<path d="M96,32 q7,-6 14,0 t14,0 t14,0"/><path d="M96,44 q7,-6 14,0 t14,0 t14,0"/>' +
    '<path d="M96,56 q7,-6 14,0 t14,0 t14,0"/><path d="M96,68 q7,-6 14,0 t14,0 t14,0"/></g>' +
    '<text font-family="Special Elite,monospace" font-size="9.5" fill="#1d3a8a"><textPath href="#cPmPath" textLength="200" lengthAdjust="spacing">MAY ★ POST ★ MAY ★ POST ★ MAY ★</textPath></text>' +
    '<text x="50" y="50" text-anchor="middle" font-family="Permanent Marker,cursive" font-size="12" fill="#1d3a8a">MAY</text>' +
    '<text x="50" y="62" text-anchor="middle" font-family="Special Elite,monospace" font-size="9" fill="#1d3a8a">' + year + '</text></svg>';

  /* ---------------------------------------------------------------
     CONTENU
     --------------------------------------------------------------- */
  function buildContact(pin) {
    const h2 = pin.querySelector("h2");
    const legal = pin.querySelector(".legal");
    [...pin.children].forEach(c => { if (c !== h2 && c !== legal) c.remove(); });

    const lead = el("p", "c-lead", TXT.lead);
    const grid = el("div", "c-grid");

    /* --- enveloppe --- */
    const card = el("div", "c-card");
    const stamp = el("div", "c-stamp"); stamp.innerHTML = SVG_EYE;
    card.appendChild(stamp);
    card.insertAdjacentHTML("beforeend", SVG_POST);
    card.appendChild(el("div", "c-air", TXT.airmail));
    card.appendChild(el("div", "c-to", TXT.to));
    card.appendChild(el("div", "c-name", NAME));
    const mailLink = el("a", "c-mail", EMAIL);
    mailLink.href = "mailto:" + EMAIL;
    card.appendChild(mailLink);
    const btns = el("div", "c-btns");
    const b1 = el("a", "c-btn", TXT.mail); b1.href = "mailto:" + EMAIL;
    const b2 = el("button", "c-btn alt", TXT.copy); b2.type = "button";
    b2.addEventListener("click", () => copy(EMAIL, b2));
    btns.append(b1, b2);
    card.appendChild(btns);

    /* --- lettre à découper --- */
    const compose = el("div", "c-compose");
    compose.appendChild(el("h3", "c-h", TXT.composeTitle));

    const name = el("input", "c-in");
    name.type = "text"; name.placeholder = TXT.namePh; name.maxLength = 60;
    name.autocomplete = "given-name"; name.setAttribute("aria-label", TXT.namePh);
    const msg = el("textarea", "c-in");
    msg.placeholder = TXT.msgPh; msg.maxLength = MAX; msg.rows = 4; msg.setAttribute("aria-label", TXT.msgPh);
    const count = el("span", "c-count", "0 / " + MAX);

    const prev = el("div", "c-prev");
    prev.setAttribute("aria-hidden", "true");
    cut("", prev);

    const row = el("div", "c-send-row");
    const send = el("a", "c-btn", TXT.send);
    send.href = mailto("", "");
    const ok = el("p", "c-ok");
    ok.setAttribute("aria-live", "polite");
    row.append(send, ok);

    compose.append(name, msg, count, prev, row);
    grid.append(card, compose);

    if (legal) { pin.insertBefore(lead, legal); pin.insertBefore(grid, legal); }
    else { pin.append(lead, grid); }

    /* --- interactions --- */
    const refresh = () => {
      cut(msg.value, prev);
      count.textContent = msg.value.length + " / " + MAX;
      send.href = mailto(name.value.trim(), msg.value);
      compose.classList.remove("sent");
      ok.classList.remove("show", "c-warn");
      ok.textContent = "";
    };
    msg.addEventListener("input", refresh);
    name.addEventListener("input", refresh);

    send.addEventListener("click", e => {
      if (!msg.value.trim()) {
        e.preventDefault();
        compose.classList.remove("shake"); void compose.offsetWidth; compose.classList.add("shake");
        ok.textContent = TXT.needMsg; ok.classList.add("show", "c-warn");
        msg.focus();
        return;
      }
      send.href = mailto(name.value.trim(), msg.value);      // le clic ouvre la messagerie
      compose.classList.add("sent");
      ok.classList.remove("c-warn");
      ok.textContent = TXT.sent;
      setTimeout(() => ok.classList.add("show"), 450);
    });
  }

  /* ---------------------------------------------------------------
     BRANCHEMENT sur le menu existant (à charger après apropos.js)
     --------------------------------------------------------------- */
  const baseOpen = window.openPanel;
  if (typeof baseOpen !== "function") { console.warn("contact.js : openPanel introuvable (le script doit être chargé après le script principal)."); return; }

  window.openPanel = function (k) {
    const r = baseOpen.apply(this, arguments);
    const panel = $("panel");
    if (k === "contact") {
      panel.classList.add("is-contact");
      buildContact($("panel-in"));
      panel.scrollTop = 0;
    } else {
      panel.classList.remove("is-contact");
    }
    return r;
  };
})();
