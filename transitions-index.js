/* transitions accueil <-> projet : la couverture grandit jusqu'au plein écran (aller) et rétrécit jusqu'à sa carte (retour) */
(function(){
  if(typeof go!=="function"||typeof cards==="undefined")return;
  var EASE="cubic-bezier(.76,0,.24,1)",T=".7s";
  function mk(src,r){
    var f=document.createElement("div");
    f.style.cssText="position:fixed;z-index:420;overflow:hidden;pointer-events:none;background:#000;"
      +"transition:left "+T+" "+EASE+",top "+T+" "+EASE+",width "+T+" "+EASE+",height "+T+" "+EASE+",opacity .35s ease;"
      +"left:"+r.left+"px;top:"+r.top+"px;width:"+r.width+"px;height:"+r.height+"px";
    var im=new Image();im.alt="";im.src=src;
    im.style.cssText="width:100%;height:100%;object-fit:cover;display:block";
    f.appendChild(im);document.body.appendChild(f);return f;
  }
  function full(f){f.style.left="0px";f.style.top="0px";f.style.width=innerWidth+"px";f.style.height=innerHeight+"px"}
  function rectOf(i){
    var c=cards[i];if(!c)return null;
    var r=c.getBoundingClientRect();
    return(r.width>20&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth)?r:null;
  }

  /* aller : la carte grandit, puis la page projet prend le relais */
  window.go=function(url,i){
    if(REDUCED){location.href=url;return}
    try{sessionStorage.setItem("lastSlug",SLUGS[i]);sessionStorage.setItem("flyIn","1")}catch(e){}
    var r=rectOf(i)||{left:innerWidth*.3,top:innerHeight*.2,width:innerWidth*.4,height:innerHeight*.6};
    var f=mk(coverOf(i),r);
    void f.offsetWidth;
    requestAnimationFrame(function(){full(f)});
    setTimeout(function(){location.href=url},780);
  };

  /* retour : l'image plein écran rétrécit jusqu'à la carte du projet quitté */
  var out=false;
  try{out=sessionStorage.getItem("flyOut")==="1";sessionStorage.removeItem("flyOut")}catch(e){}
  if(out&&!REDUCED){
    var k=-1;try{k=SLUGS.indexOf(sessionStorage.getItem("lastSlug"))}catch(e){}
    if(k>=0){
      wipe.style.display="none";   /* on remplace le rideau par l'image */
      var f=mk(coverOf(k),{left:0,top:0,width:innerWidth,height:innerHeight});
      f.style.transition="none";full(f);void f.offsetWidth;
      f.style.transition="left "+T+" "+EASE+",top "+T+" "+EASE+",width "+T+" "+EASE+",height "+T+" "+EASE+",opacity .35s ease";
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        var r=rectOf(k);
        if(r){f.style.left=r.left+"px";f.style.top=r.top+"px";f.style.width=r.width+"px";f.style.height=r.height+"px";
          setTimeout(function(){f.style.opacity="0"},650)}
        else f.style.opacity="0";
        setTimeout(function(){f.remove();wipe.style.display=""},1100);
      })});
    }
  }
  addEventListener("pageshow",function(e){
    if(e.persisted)document.querySelectorAll("body>div[style*='z-index:420']").forEach(function(n){n.remove()});
  });
})();
