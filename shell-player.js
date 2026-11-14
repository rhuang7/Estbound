/* EASTBOUND V31: one top-level document keeps the music audio element alive. */
(function(){'use strict';
const f=document.getElementById('eb-page'),loading=document.getElementById('eb-loading');
const allowed=new Set(['home.html','index.html','journal.html','travelogues.html','place.html','planner.html','stories.html','vlogs.html','editorials.html']);
function normalize(v){let s=typeof v==='string'?v:'home.html';if(!s||/^(?:\/\/|https?:|data:|javascript:)/i.test(s))return 'home.html';let u;try{u=new URL(s,location.href)}catch(e){return 'home.html'};if(u.origin!==location.origin)return 'home.html';const base=u.pathname.split('/').pop();if(!allowed.has(base))return 'home.html';return (base==='index.html'?'home.html':base)+u.search+u.hash}
const p=new URLSearchParams(location.search);let current=normalize(p.get('view')||'home.html'+location.hash);
f.src=current;
f.addEventListener('load',function(){loading.hidden=true;try{document.title='EASTBOUND | '+f.contentDocument.title.replace(/^EASTBOUND\s*\|\s*/, '')}catch(e){} });
window.addEventListener('message',function(event){if(event.origin!==location.origin||event.source!==f.contentWindow||event.data?.app!=='eastbound-v31'||event.data.type!=='view')return;
 const view=normalize(event.data.view);if(view!==current){current=view;const path='player.html?view='+encodeURIComponent(view);history.replaceState({view},'',path)}});
window.addEventListener('popstate',function(){const route=normalize(new URLSearchParams(location.search).get('view'));if(route!==current){current=route;f.src=route}});
})();