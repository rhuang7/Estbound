'use strict';
// No third-party reviews are scraped. Only attributed short verified excerpts are reproduced.
// All other review/travelogue prompts open external providers and are never represented as verbatim reviews.
// Travel-story pager uses exactly one complete row per action.
const readingRowSize=()=>window.matchMedia('(max-width:600px)').matches?1:window.matchMedia('(max-width:1100px)').matches?2:3;
let diningVisible=initialCollectionCount(),readingVisible=readingRowSize();
const safeLink=(url,label,css='')=>`<a class="${css}" target="_blank" rel="noopener noreferrer" href="${esc(url)}">${esc(label)} ↗</a>`;
// Restaurant records live in place_data.js (shared with place.html).
// Keep the old guide global as a backwards-compatible fallback only.
const restaurantGuideData=()=>{
 const local=window.EASTBOUND_PLACE_DATA?.restaurants;
 if(local&&Object.keys(local).length)return local;
 return typeof RESTAURANT_GUIDES!=='undefined'?RESTAURANT_GUIDES:{};
};
const restaurantItems=(city)=>{const guides=restaurantGuideData();return city==='all'?REGIONS.flatMap(r=>r.cities.flatMap(key=>(guides[key]||[]).map(entry=>({city:key,entry})))):(guides[city]||[]).map(entry=>({city,entry}));};
// V43: only display imagery positively associated with this exact venue.
// A missing image is shown openly; never silently swap in stock food or a different restaurant.
const restaurantCard=({city,entry:[name,category,description,source]})=>{
 const index=(restaurantGuideData()[city]||[]).findIndex(r=>r[0]===name);
 const isNearby=category.startsWith('周边扩展 · '),place=isNearby?category.slice('周边扩展 · '.length):(CITIES[city]?.search||city);
 const maps=googleSearch(name+' '+place+' Canada');
 const image=window.EASTBOUND_DINING_PHOTOS?.[city+'::'+name];
 const photo=image?`<div class="eat-photo"><img src="${esc(image[0])}" alt="${esc(name)} 实景照片" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.closest('.eat-photo').classList.add('eat-photo-failed')"/><span class="eat-photo-type">店面 / 室内实景</span><a class="eat-photo-source" href="${esc(image[1])}" target="_blank" rel="noopener noreferrer">图片来源 ↗</a><span class="eat-photo-error">图片暂不可载入 · 请查看图片来源</span></div>`:`<div class="eat-photo eat-photo-missing"><span class="eat-photo-icon" aria-hidden="true">⌁</span><span class="eat-photo-label">该店实景照片待核实</span><a href="${esc(maps)}" target="_blank" rel="noopener noreferrer">前往地图查看店面与室内照片 ↗</a></div>`;
 return `<article class="eat-card place-clickable"><a class="place-card-stretch" href="place.html?type=restaurant&city=${encodeURIComponent(city)}&item=${index}" aria-label="查看${esc(CITIES[city]?.name||city)}餐厅${esc(name)}的图片、介绍及地图"></a>${photo}<div class="eat-head"><span>${esc(CITIES[city]?.name||city)}</span><span>LOCAL TABLE / EAT</span></div><h3>${esc(name)}</h3><span class="eat-kind">${esc(category)}</span><p>${esc(description)}</p><div class="eat-links">${safeLink(maps,'地图与店景')}${/^https:\/\/[^ ]+/.test(source)?safeLink(source,'餐厅资料来源'):''}</div><span class="place-detail-label">查看餐厅完整详情 ↗</span></article>`;
};
function renderDining(){
 const city=el('dining-city')?.value||'all',total=restaurantItems(city),shown=total.slice(0,displayLimit(diningVisible,total.length));
 if(!total.length){
   // Display clear load error instead of showing deleted legacy restaurants.
   el('dining-count').textContent='餐厅数据暂时无法加载，请刷新页面后重试。';
   return;
 }
 el('dining-grid').innerHTML=shown.map(restaurantCard).join('');
 el('dining-count').textContent=`${city==='all'?'19 个目的地':CITIES[city].name} · 共 ${total.length} 家新选餐厅 · ${shown.filter(x=>window.EASTBOUND_DINING_PHOTOS?.[x.city+'::'+x.entry[0]]).length} 张已匹配实景图（当前已展示） · 周边地点已标注`;
 updateCollectionControls('dining',shown.length,total.length,'餐厅');
}
const reviewBase=(city,name)=>`${name} ${CITIES[city]?.search||'Eastern Canada'}`;
const tripadvisorSearch=(q)=>'https://www.tripadvisor.ca/Search?q='+encodeURIComponent(q);
const travelBlogSearch=(q)=>'https://www.google.com/search?q='+encodeURIComponent(q+' travel blog review itinerary Canada');
function readingLinks(city,name){const q=reviewBase(city,name);return [
 ['Google Maps · 实际评价',googleSearch(q)],
 ['Tripadvisor · 旅行者评论',tripadvisorSearch(q)],
 ['游记 · 文章搜索',travelBlogSearch(q)]
];}
function spotReadingHTML(city,name,description='',note=''){
 const links=readingLinks(city,name);
 return `<details class="reading-mini"><summary>查看此景点的评论与游记 <span>3 个来源 ↗</span></summary><div class="reading-mini-body"><p class="reading-annotation">${esc(description||'查看真实旅客的实地反馈、照片和到访体验。')}${note?' '+esc(note):''}</p><small>上方为 EASTBOUND 编辑整理，非游客原话。为尊重版权，外部评论请在来源网站阅读。</small><div class="reading-mini-links">${links.map(([label,url])=>safeLink(url,label)).join('')}</div></div></details>`;
}
function cityReadingHTML(city){
 const reports=window.EASTBOUND_REAL_REPORTS||[];
 const region={'toronto':'on','niagara':'on','kingston':'on','ottawa':'on','montreal':'qc','tremblant':'qc','quebec':'qc','charlevoix':'qc'}[city];
 const nearby=reports.filter(r=>r.city===city);
 const more=region?reports.filter(r=>r.region===region&&!nearby.includes(r)):[];
 const entries=nearby.concat(more).slice(0,4);
 if(!entries.length)return '<div class="city-reading"><p>该城市目前没有对应的已导入游记，可浏览其他海洋省旅行记录。</p><a href="travelogues.html">浏览全部游记 ↗</a></div>';
 return '<div class="city-reading"><p class="reading-note">本次导入的旅行文章，点击即可在 EASTBOUND 站内阅读所收集的原文和对应图片。转载授权待核实。</p><div class="city-source-list">'+entries.map(r=>'<a href="journal.html?id='+encodeURIComponent(r.id)+'">'+esc(r.title)+' · '+esc(r.source)+' ↗</a>').join('')+'</div></div>';
}

function renderReading(){window.EASTBOUND_refreshHomeJournals?.();}

function cityRestaurantHTML(city){return `<div class="modal-restaurants">${(restaurantGuideData()[city]||[]).map(entry=>restaurantCard({city,entry})).join('')}</div>`;}
function initReading(){
 const selector=el('dining-city');
 if(!selector)return;
 selector.innerHTML='<option value="all">全部目的地</option>'+REGIONS.map(r=>`<optgroup label="${esc(r.name)}">${r.cities.map(key=>`<option value="${key}">${esc(CITIES[key].name)}</option>`).join('')}</optgroup>`).join('');
 selector.value='all';
 selector.addEventListener('change',()=>{diningVisible=initialCollectionCount();renderDining()});
 renderDining();
 el('dining-more')?.addEventListener('click',()=>{const total=restaurantItems(selector.value).length;diningVisible=Math.min(total,diningVisible+30);renderDining()});
 el('dining-collapse')?.addEventListener('click',()=>{diningVisible=initialCollectionCount();renderDining();returnToSection('dining')});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initReading);else initReading();
// The homepage travel journals use standalone pre-rendered markup and their own enhancer.
