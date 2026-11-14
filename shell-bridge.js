/* EASTBOUND V31 bridge: navigation stays in the iframe, audio stays in the parent. */
(function(){'use strict';
 const inside=window.parent!==window;
 if(!inside)return;
 function notify(){try{window.parent.postMessage({app:'eastbound-v31',type:'view',view:location.pathname.split('/').pop()+location.search+location.hash},location.origin)}catch(e){}}
 addEventListener('pageshow',notify);addEventListener('hashchange',notify);
 addEventListener('popstate',notify);
 document.addEventListener('pointerdown',function(){try{window.parent.EASTBOUND_BGM_UNLOCK?.()}catch(e){}}, {capture:true});
 document.addEventListener('click',function(e){
  const a=e.target.closest?.('a[href]');if(!a||e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||a.hasAttribute('download')||a.target==='_blank')return;
  try{const u=new URL(a.href);if(u.origin!==location.origin)return;
   if(u.pathname.split('/').pop()==='index.html') {e.preventDefault();location.href='home.html'+u.search+u.hash;}
  }catch(ex){}
 },{capture:true});
})();