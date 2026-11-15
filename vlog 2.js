/* EASTBOUND V16 | YouTube + Bilibili, original-source-first player */
'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const list=[...EASTBOUND_VLOGS,...EASTBOUND_BILIBILI];
 const columns=()=>window.matchMedia('(max-width:700px)').matches?1:window.matchMedia('(max-width:1100px)').matches?2:3;
 const initialCount=items=>items.length>=2*columns()?2*columns():items.length>=columns()?columns():items.length;
 const lang=()=>window.EASTBOUND_I18N?.getLanguage?.()||document.documentElement.lang?.slice(0,2)||'en';
 const labels={
 en:{total:'videos',shown:'showing',original:'Watch on original platform ↗',play:'Watch here ↗',local:'Open on Bilibili ↗',loading:'Connecting to player…',unavailable:'This player may be restricted by the platform or your browser. You can always visit the original video.',retry:'Try embedded player',hint:'Video unavailable? Open the original post.',more:'Show more films ↓',collapse:'Show less ↑',all:'All',trips:'travel films',bili:'Watch on Bilibili'},
 fr:{total:'vidéos',shown:'affichées',original:'Voir sur la plateforme ↗',play:'Regarder ici ↗',local:'Ouvrir sur Bilibili ↗',loading:'Connexion au lecteur…',unavailable:'La lecture intégrée peut être limitée par la plateforme ou le navigateur. Ouvrez la vidéo originale.',retry:'Essayer le lecteur intégré',hint:'Vidéo indisponible ? Voir l’original.',more:'Afficher plus de vidéos ↓',collapse:'Réduire ↑',all:'Tout',trips:'vidéos de voyage',bili:'Voir sur Bilibili'},
 zh:{total:'支旅行视频',shown:'当前显示',original:'在原平台观看 ↗',play:'在此播放 ↗',local:'打开 Bilibili ↗',loading:'正在连接播放器…',unavailable:'当前浏览器或平台可能限制站内播放，请使用原作者视频链接观看。',retry:'尝试站内播放',hint:'如无法播放，可前往原作者页面。',more:'显示更多影片 ↓',collapse:'收起影片 ↑',all:'全部',trips:'旅行 Vlog',bili:'到 Bilibili 观看'}
 };
 const t=()=>labels[lang()]||labels.en;
 const unique=(v)=>v.provider+'-'+v.id;
 const original=v=>v.url||(v.provider==='bilibili'?`https://www.bilibili.com/video/${v.id}/`:`https://www.youtube.com/watch?v=${v.id}`);
 const tones={'环线':['#304e62','#88a9aa'],'魁北克':['#36456d','#af8a9f'],'安大略':['#234f63','#79b9b6'],'海洋省份':['#163f5a','#54a0ad']};
 let provider='all',category='all',limit=6,active=null,player=null,ytApi=null,call=0,timeout=null;
 const dialog=$('vlog-dialog'),slot=$('vlog-player-slot');
 function choice(v){const l=lang();return v[l]&&l!=='zh'?v[l]:v.intro}
 function card(v,i){const source=v.provider==='bilibili';const [a,b]=tones[v.category]||tones['环线'];
   const img=source?`<div class="vlog-bili-art" style="--art-a:${a};--art-b:${b}"><span class="vlog-bili-corner">BILIBILI · ${esc(v.year)}</span><b>${esc(v.places.split('·')[0].trim())}</b></div>`:`<img loading="lazy" src="https://i.ytimg.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg" alt="${esc(v.title)} · YouTube" onerror="this.hidden=true">`;
   return `<article class="vlog-card" data-no-i18n="true"><button type="button" class="vlog-cover ${source?'is-bili':''}" data-play="${esc(unique(v))}" aria-label="${esc(v.title)}">${img}<span class="vlog-cover-tag">${esc(v.category)}</span><span class="vlog-play" aria-hidden="true">▶</span></button><div class="vlog-card-body"><div class="vlog-card-kicker"><span class="vlog-source-pill ${source?'is-bili':''}">${source?'Bilibili':'YouTube'}</span> ${esc(v.creator)} · ${esc(v.year)}</div><h3>${esc(v.title)}</h3><p>${esc(choice(v))}</p><div class="vlog-card-place">${esc(v.places)}</div><div class="vlog-card-footer"><a href="${esc(original(v))}" target="_blank" rel="noopener noreferrer">${esc(t().original)}</a><button type="button" data-play="${esc(unique(v))}">${esc(t().play)}</button></div></div></article>`;
 }
 function filtered(){return list.filter(v=>(provider==='all'||v.provider===provider)&&(category==='all'||v.category===category))}
 function render(){const items=filtered(),shown=items.slice(0,limit);$('vlog-grid').innerHTML=shown.map(card).join('');const l=t();$('vlog-count').textContent=lang()==='zh'?`共 ${items.length} 支旅行 Vlog · 当前显示 ${shown.length} 支`:`${items.length} ${l.total} · ${l.shown} ${shown.length}`;
 $('vlog-more').hidden=limit>=items.length;$('vlog-collapse').hidden=limit<=initialCount(items);$('vlog-more').textContent=l.more;$('vlog-collapse').textContent=l.collapse;
 $('vlog-total').textContent=String(list.length);
 }
 function clear(){if(timeout){clearTimeout(timeout);timeout=null;}if(player){try{player.destroy()}catch(_){}player=null;}slot.replaceChildren()}
 function close(){call++;clear();active=null;if(dialog.open)dialog.close()}
 function fallback(v,reason,allowRetry=true){if(!v||!active||unique(v)!==unique(active))return;clear();const block=document.createElement('div');block.className='vlog-player-fallback';block.dataset.noI18n='true';
  const actions=`<div class="vlog-fallback-actions"><a class="vlog-fallback-primary" href="${esc(original(v))}" target="_blank" rel="noopener noreferrer">${esc(t().original)}</a>${allowRetry&&/^https?:$/.test(location.protocol)?`<button class="vlog-fallback-secondary" type="button" id="retry-embed">${esc(t().retry)}</button>`:''}</div>`;
  block.innerHTML=`<span class="vlog-fallback-eyebrow">${esc(v.provider==='bilibili'?'BILIBILI':'YOUTUBE')}</span><h3>${esc(v.title)}</h3><p>${esc(reason||t().unavailable)}</p>${actions}`;slot.append(block);block.querySelector('#retry-embed')?.addEventListener('click',()=>open(unique(v),true));}
 function ensureYT(){if(window.YT?.Player)return Promise.resolve(window.YT);if(ytApi)return ytApi;ytApi=new Promise((resolve,reject)=>{let done=false;const previous=window.onYouTubeIframeAPIReady;const finish=e=>{if(done)return;done=true;clearTimeout(timer);e?reject(e):resolve(window.YT)};window.onYouTubeIframeAPIReady=()=>{try{previous?.()}catch(_){}finish()};const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;script.referrerPolicy='strict-origin-when-cross-origin';script.onerror=()=>finish(new Error('YT blocked'));const timer=setTimeout(()=>finish(new Error('YT timeout')),12000);document.head.append(script)}).catch(e=>{ytApi=null;throw e});return ytApi}
 async function open(key,force=false){const v=list.find(item=>unique(item)===key);if(!v)return;call++;const n=call;active=v;clear();$('vlog-playing-credit').textContent=`${v.provider==='bilibili'?'Bilibili':'YouTube'} · ${v.creator}`;$('vlog-playing-title').textContent=v.title;$('vlog-watch-original').href=original(v);$('vlog-watch-original').textContent=t().original;
 if(!dialog.open){if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','')}
 if(!/^https?:$/.test(location.protocol)||location.origin==='null')return fallback(v,lang()==='zh'?'本地 HTML 预览不能保证第三方嵌入播放器可用。请通过原站观看；部署到 GitHub Pages 后可再尝试站内播放。':t().unavailable,false);
 slot.innerHTML=`<div class="vlog-player-loading" role="status">${esc(t().loading)}<small>${esc(t().hint)}</small></div>`;
 if(v.provider==='bilibili'){
  const iframe=document.createElement('iframe');iframe.title=v.title;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.loading='eager';iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.allowFullscreen=true;
  iframe.src=`https://player.bilibili.com/player.html?bvid=${encodeURIComponent(v.id)}&page=1&high_quality=1&danmaku=0&autoplay=0`;
  slot.replaceChildren(iframe);
  // Cross-origin playback failures are not reliably observable; the visible original link is always offered.
  return;
 }
 try{const YT=await ensureYT();if(call!==n||!dialog.open)return;slot.replaceChildren();const iframe=document.createElement('iframe');iframe.id='v16-yt-player';iframe.title=v.title;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allow='autoplay;encrypted-media;picture-in-picture;web-share';iframe.allowFullscreen=true;iframe.src=`https://www.youtube.com/embed/${v.id}?enablejsapi=1&origin=${encodeURIComponent(location.origin)}&autoplay=1&playsinline=1`;slot.append(iframe);
 timeout=setTimeout(()=>{if(call===n)fallback(v,t().unavailable)},20000);
 player=new YT.Player(iframe,{events:{onReady:()=>{if(call===n&&timeout){clearTimeout(timeout);timeout=null}},onError:e=>{if(call===n)fallback(v,t().unavailable)}}})}
 catch(e){if(call===n)fallback(v,t().unavailable)}
 }
 $('vlog-grid').addEventListener('click',e=>{const b=e.target.closest('[data-play]');if(b)open(b.dataset.play)});
 $('vlog-platforms').addEventListener('click',e=>{const b=e.target.closest('[data-provider]');if(!b)return;provider=b.dataset.provider;limit=initialCount(filtered());document.querySelectorAll('#vlog-platforms [data-provider]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()});
 $('vlog-filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;limit=initialCount(filtered());document.querySelectorAll('#vlog-filters [data-category]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render()});
 $('vlog-more').addEventListener('click',()=>{limit+=2*columns();render()});$('vlog-collapse').addEventListener('click',()=>{limit=initialCount(filtered());render();$('video-library').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})});
 $('vlog-close').addEventListener('click',close);dialog.addEventListener('close',()=>{call++;clear();active=null});dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 $('vlog-year').textContent=new Date().getFullYear();
 const toggle=$('vlog-menu-toggle'),menu=$('vlog-mobile-menu');toggle.addEventListener('click',()=>{const isOpening=menu.hidden;menu.hidden=!isOpening;toggle.setAttribute('aria-expanded',String(isOpening))});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false')}));
 window.addEventListener('resize',()=>{if(limit<=6){limit=initialCount(filtered());render()}});
 window.addEventListener('eastbound:languagechange',()=>{render();if(active){$('vlog-watch-original').textContent=t().original}});
 render();
})();
