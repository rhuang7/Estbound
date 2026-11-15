'use strict';
const storyEl=id=>document.getElementById(id);
const storyEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activeStoryFilter='all',currentStoryId=null;
function storyPhoto(key){
  const central={toronto:'photo-1632780613344-2ff5659af895',tremblant:'photo-1693155381071-28e1bccbb820',montreal:'photo-1761920274681-18ba06a25d7c',quebec:'photo-1695126016000-0567810ecdaa'};
  if(typeof ATLANTIC_CITIES!=='undefined' && ATLANTIC_CITIES[key]?.photo)return ATLANTIC_CITIES[key].photo;
  return `https://images.unsplash.com/${central[key]||central.tremblant}?auto=format&fit=crop&w=1000&q=80`;
}
function storyFilterMatch(s,f){if(f==='all')return true;if(f==='短途')return s.days<=7;if(f==='中途')return s.days>=8&&s.days<=12;if(f==='长途')return s.days>=13;return s.source===f}
function renderStories(){
  const list=STORY_ROUTES.filter(s=>storyFilterMatch(s,activeStoryFilter));
  storyEl('stories-count').textContent=`已为你准备 ${list.length} 条完整逐日路线 · 点击卡片即可查看全部天数`;
  storyEl('stories-grid').innerHTML=list.map((s,i)=>`<article class="story-card"><div class="story-cover"><img src="${storyEscape(storyPhoto(s.cover))}" alt="${storyEscape(s.title)} — ${storyEscape(s.area)}风光" loading="lazy" onerror="this.style.opacity=0"><div class="story-cover-top"><span class="story-source">${storyEscape(s.source)} · ${storyEscape(s.type)}</span><span class="story-days">${s.days} DAYS</span></div></div><div class="story-content"><div class="story-kicker">${storyEscape(s.area)} / TRIP ${String(i+1).padStart(2,'0')}</div><h3>${storyEscape(s.title)}</h3><p>${storyEscape(s.subtitle)}</p><div class="story-route-points">${s.route.slice(0,5).map((p,j)=>`${j?'<i>›</i>':''}<span>${storyEscape(p)}</span>`).join('')}${s.route.length>5?'<span>…</span>':''}</div><div class="story-card-foot"><a href="${storyEscape(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="阅读${storyEscape(s.title)}原始线路">查看原文 ↗</a><button type="button" class="story-open" data-story="${storyEscape(s.id)}" aria-label="查看${storyEscape(s.title)}${s.days}天完整行程">查看 ${s.days} 天行程 ↗</button></div></div></article>`).join('')||'<p class="story-noresults">暂无符合条件的线路，请切换上方分类。</p>';
}
function openStory(id,updateHash=true){
 const s=STORY_ROUTES.find(item=>item.id===id);if(!s)return;
 currentStoryId=id;
 storyEl('story-dialog-content').innerHTML=`<button class="story-close" type="button" data-close-story aria-label="关闭完整行程">×</button><div class="story-dialog-head"><div class="story-dialog-kicker">${storyEscape(s.source)} / ${storyEscape(s.type)} · ${s.days} DAY ITINERARY</div><h2 id="story-dialog-title">${storyEscape(s.title)}</h2><p>${storyEscape(s.subtitle)}</p><div class="story-dialog-meta"><span>${s.days} 天完整版</span><span>${storyEscape(s.area)}</span><span>${storyEscape(s.author)}</span></div></div><div class="story-daylist"><h3 class="story-dialog-section-title">逐日路线 · DAY BY DAY</h3>${s.schedule.map((d,i)=>`<div class="story-day"><div class="story-day-num">DAY ${String(i+1).padStart(2,'0')}</div><div class="story-day-body"><div class="story-day-location">${storyEscape(d[0])}</div><h3>${storyEscape(d[1])}</h3><p>${storyEscape(d[2])}</p></div></div>`).join('')}</div><div class="story-dialog-extra"><div class="story-fact-row"><div class="story-fact"><strong>推荐季节</strong><p>${storyEscape(s.best)}</p></div><div class="story-fact"><strong>交通与风险提醒</strong><p>${storyEscape(s.transport)}</p></div><div class="story-fact"><strong>主要亮点</strong><p>${storyEscape(s.highlights)}</p></div><div class="story-fact"><strong>建议访问顺序</strong><p>${storyEscape(s.route.join(' → '))}</p></div></div><div class="story-source-panel"><h3>路线出处与改编说明</h3><p>${storyEscape(s.sourceNote)}</p><p>以上为本站重新撰写的行程安排，不代表原作者已经实际完成全部行程；外部页面的全文、照片和讨论请回到原平台查看。景点、路线及轮渡仍需出发前确认。</p><div class="story-dialog-actions"><a class="primary" href="${storyEscape(s.url)}" target="_blank" rel="noopener noreferrer">阅读原始线路 ↗</a><button type="button" id="story-share">复制此路线链接</button><a href="planner.html#planner">我想自己规划 ↗</a></div></div></div>`;
 const dialog=storyEl('story-dialog'); if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
 if(updateHash)history.replaceState(null,'',`#${encodeURIComponent(id)}`);
}
function closeStory(){const dialog=storyEl('story-dialog');if(dialog.open)dialog.close();currentStoryId=null;if(STORY_ROUTES.some(s=>`#${s.id}`===location.hash))history.replaceState(null,'',location.pathname+location.search+'#story-collection')}
function initStories(){
 storyEl('route-total').textContent=STORY_ROUTES.length;
 storyEl('stories-year').textContent=new Date().getFullYear();
 storyEl('stories-filters').addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;activeStoryFilter=button.dataset.filter;storyEl('stories-filters').querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});renderStories()});
 storyEl('stories-grid').addEventListener('click',e=>{const button=e.target.closest('[data-story]');if(button)openStory(button.dataset.story)});
 storyEl('story-dialog').addEventListener('click',e=>{if(e.target===storyEl('story-dialog')||e.target.closest('[data-close-story]'))closeStory();if(e.target.closest('#story-share')){const url=`${location.href.split('#')[0]}#${currentStoryId}`;if(navigator.clipboard?.writeText){navigator.clipboard.writeText(url).then(()=>{e.target.textContent='已复制链接 ✓'},()=>{window.prompt('请复制此链接：',url)})}else window.prompt('请复制此链接：',url)}});
 storyEl('story-dialog').addEventListener('close',()=>{if(currentStoryId){currentStoryId=null;if(STORY_ROUTES.some(s=>`#${s.id}`===location.hash))history.replaceState(null,'',location.pathname+location.search+'#story-collection')}});
 storyEl('stories-menu-toggle').addEventListener('click',()=>{const menu=storyEl('stories-mobile-menu');menu.hidden=!menu.hidden;storyEl('stories-menu-toggle').setAttribute('aria-expanded',String(!menu.hidden))});
 storyEl('stories-mobile-menu').addEventListener('click',e=>{if(e.target.closest('a')){storyEl('stories-mobile-menu').hidden=true;storyEl('stories-menu-toggle').setAttribute('aria-expanded','false')}});
 renderStories(); const id=decodeURIComponent(location.hash.substring(1));if(STORY_ROUTES.some(s=>s.id===id))openStory(id,false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initStories);else initStories();
