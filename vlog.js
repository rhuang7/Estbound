/* EASTBOUND V9.1 · YouTube 官方播放器 + 来源识别 + 错误回退 */
'use strict';
(()=>{
 const byId=id=>document.getElementById(id);
 const escapeHTML=text=>String(text).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const list=EASTBOUND_VLOGS;
 let category='all',limit=6,activeId=null,player=null,embedSeq=0,playerTimeout=null,apiPromise=null;
 const originalUrl=id=>`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
 const makeCard=v=>{const id=encodeURIComponent(v.id),safe=escapeHTML;return `<article class="vlog-card"><button type="button" class="vlog-cover" data-play="${id}" aria-label="播放 ${safe(v.title)}"><img loading="lazy" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${safe(v.title)} · YouTube 原视频封面" onerror="this.style.display='none'"><span class="vlog-cover-tag">${safe(v.category)}</span><span class="vlog-play" aria-hidden="true">▶</span></button><div class="vlog-card-body"><div class="vlog-card-kicker">${safe(v.creator)} · ${safe(v.year)}</div><h3>${safe(v.title)}</h3><p>${safe(v.intro)}</p><div class="vlog-card-place">${safe(v.places)}</div><div class="vlog-card-footer"><a target="_blank" rel="noopener noreferrer" href="${originalUrl(id)}">原作者视频 ↗</a><button type="button" data-play="${id}">在此播放 ↗</button></div></div></article>`};
 const filtered=()=>category==='all'?list:list.filter(v=>v.category===category);
 function render(){const items=filtered(),shown=items.slice(0,limit);byId('vlog-grid').innerHTML=shown.map(makeCard).join('');byId('vlog-count').textContent=`共 ${items.length} 支旅行 Vlog · 当前显示 ${shown.length} 支`;byId('vlog-more').hidden=limit>=items.length;byId('vlog-collapse').hidden=limit<=6;}
 const dialog=byId('vlog-dialog'),slot=byId('vlog-player-slot');
 function releasePlayer(){if(playerTimeout){clearTimeout(playerTimeout);playerTimeout=null;}if(player){try{player.destroy();}catch(e){}player=null;}}
 function close(){embedSeq++;releasePlayer();slot.replaceChildren();activeId=null;if(dialog.open)dialog.close();}
 function showPanel(type,message,id){
   if(!id||id!==activeId)return;
   releasePlayer();slot.replaceChildren();
   const wrap=document.createElement('div');wrap.className='vlog-player-fallback';wrap.setAttribute('role','status');
   const kicker=document.createElement('span');kicker.className='vlog-fallback-eyebrow';kicker.textContent=type;
   const title=document.createElement('h3');title.textContent='继续在 YouTube 观看';
   const body=document.createElement('p');body.textContent=message;
   const actions=document.createElement('div');actions.className='vlog-fallback-actions';
   const a=document.createElement('a');a.className='vlog-fallback-primary';a.href=originalUrl(id);a.target='_blank';a.rel='noopener noreferrer';a.textContent='打开原作者视频 ↗';
   actions.append(a);
   if(/^https?:$/.test(location.protocol)){
     const retry=document.createElement('button');retry.type='button';retry.className='vlog-fallback-secondary';retry.textContent='重新尝试站内播放';retry.addEventListener('click',()=>open(id));actions.append(retry);
   }
   wrap.append(kicker,title,body,actions);slot.append(wrap);
 }
 function ensureYouTubeAPI(){
   if(window.YT&&typeof window.YT.Player==='function')return Promise.resolve(window.YT);
   if(apiPromise)return apiPromise;
   apiPromise=new Promise((resolve,reject)=>{
     const previous=window.onYouTubeIframeAPIReady;
     let settled=false;
     const finish=(err)=>{if(settled)return;settled=true;clearTimeout(timeout);if(err)reject(err);else resolve(window.YT);};
     window.onYouTubeIframeAPIReady=()=>{if(typeof previous==='function'){try{previous();}catch(e){}}finish()};
     const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.referrerPolicy='strict-origin-when-cross-origin';script.async=true;
     script.onerror=()=>finish(new Error('YouTube API blocked'));
     const timeout=setTimeout(()=>finish(new Error('YouTube API timeout')),12000);
     document.head.append(script);
   }).catch(err=>{apiPromise=null;throw err});
   return apiPromise;
 }
 async function open(id){
   const vid=list.find(v=>v.id===id);
   if(!vid||!(/^[\w-]{11}$/.test(id)))return;
   embedSeq++;const seq=embedSeq;
   releasePlayer();activeId=id;
   byId('vlog-playing-credit').textContent=`${vid.creator} / ${vid.year}`;
   byId('vlog-playing-title').textContent=vid.title;
   byId('vlog-watch-original').href=originalUrl(id);
   if(!dialog.open){if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
   // file://、about:blank、sandbox 预览等环境通常无法提供 YouTube 要求的 Referer。
   if(!/^https?:$/.test(location.protocol)||location.origin==='null'){
     showPanel('本地预览模式','当前页面不是通过正式网站地址打开。YouTube 可能无法识别来源并显示错误 153。请直接前往 YouTube，或将网站部署到 GitHub Pages 后使用站内播放器。',id);
     return;
   }
   slot.innerHTML='<div class="vlog-player-loading" role="status">正在连接 YouTube 播放器…<small>如果无法播放，也可以使用下方的原作者视频入口。</small></div>';
   try{
     const YT=await ensureYouTubeAPI();
     if(seq!==embedSeq||!dialog.open||activeId!==id)return;
     slot.replaceChildren();
     const iframe=document.createElement('iframe');iframe.id='vlog-youtube-player';iframe.title=vid.title;
     const params=new URLSearchParams({enablejsapi:'1',origin:location.origin,autoplay:'1',rel:'0',playsinline:'1'});
     iframe.src=`https://www.youtube.com/embed/${encodeURIComponent(id)}?${params.toString()}`;
     iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allow='accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share';iframe.allowFullscreen=true;
     slot.append(iframe);
     playerTimeout=setTimeout(()=>{if(seq===embedSeq&&activeId===id)showPanel('播放器未响应','嵌入播放器没有及时响应。可能是网络、浏览器隐私设置或视频作者的嵌入限制所致。可以在 YouTube 原站观看。',id)},20000);
     player=new YT.Player(iframe,{events:{
       onReady:()=>{if(seq===embedSeq&&playerTimeout){clearTimeout(playerTimeout);playerTimeout=null;}},
       onError:event=>{if(seq!==embedSeq||activeId!==id)return;const code=Number(event.data);const msg=code===153?'YouTube 未收到有效的网站来源标识（错误 153）。请使用 GitHub Pages 的 HTTPS 网址访问，或者前往 YouTube 原站观看。':([101,150].includes(code)?'该视频的作者可能不允许在第三方网站嵌入播放。':'当前视频无法在本站内播放（YouTube 错误 '+code+'）。');showPanel('视频播放受限',msg,id)}
     }});
   }catch(e){if(seq===embedSeq&&activeId===id)showPanel('无法加载播放器','当前网络或浏览器拦截了 YouTube 播放组件。仍可通过原作者的视频页面观看。',id)}
 }
 byId('vlog-grid').addEventListener('click',e=>{const trigger=e.target.closest('[data-play]');if(trigger)open(trigger.dataset.play)});
 byId('vlog-filters').addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(!btn)return;category=btn.dataset.category;limit=6;byId('vlog-filters').querySelectorAll('button').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});render()});
 byId('vlog-more').addEventListener('click',()=>{limit+=6;render()});
 byId('vlog-collapse').addEventListener('click',()=>{limit=6;render();byId('video-library').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})});
 byId('vlog-close').addEventListener('click',close);
 dialog.addEventListener('close',()=>{embedSeq++;releasePlayer();slot.replaceChildren();activeId=null});
 dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 byId('vlog-year').textContent=new Date().getFullYear();byId('vlog-total').textContent=String(list.length);
 const menuBtn=byId('vlog-menu-toggle'),menu=byId('vlog-mobile-menu');menuBtn.addEventListener('click',()=>{const opening=menu.hidden;menu.hidden=!opening;menuBtn.setAttribute('aria-expanded',String(opening))});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;menuBtn.setAttribute('aria-expanded','false')}));
 render();
})();
