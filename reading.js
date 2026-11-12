'use strict';
// No third-party reviews are scraped. Only attributed short verified excerpts are reproduced.
// All other review/travelogue prompts open external providers and are never represented as verbatim reviews.
let diningVisible=initialCollectionCount(),readingVisible=initialCollectionCount();
const safeLink=(url,label,css='')=>`<a class="${css}" target="_blank" rel="noopener noreferrer" href="${esc(url)}">${esc(label)} ↗</a>`;
const restaurantItems=(city)=>city==='all'?REGIONS.flatMap(r=>r.cities.flatMap(key=>(RESTAURANT_GUIDES[key]||[]).map(entry=>({city:key,entry})))):(RESTAURANT_GUIDES[city]||[]).map(entry=>({city,entry}));
const restaurantCard=({city,entry:[name,category,description,source]})=>`<article class="eat-card"><div class="eat-head"><span>${esc(CITIES[city]?.name||city)}</span><span>LOCAL TABLE / EAT</span></div><h3>${esc(name)}</h3><span class="eat-kind">${esc(category)}</span><p>${esc(description)}</p><div class="eat-links">${safeLink(googleSearch(name+' '+CITIES[city].search),'地图／实际评价')}${safeLink(source,'推荐依据')}</div></article>`;
function renderDining(){
 const city=el('dining-city')?.value||'all',total=restaurantItems(city),shown=total.slice(0,displayLimit(diningVisible,total.length));
 el('dining-grid').innerHTML=shown.map(restaurantCard).join('');
 el('dining-count').textContent=`${city==='all'?'19 个目的地':CITIES[city].name} · 共 ${total.length} 条餐厅建议（非实时营业或预订）`;
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
 const c=CITIES[city],excerpt=CITY_EXCERPTS[city],source=CITY_TRAVELOG_SOURCES[city]||c.url;
 return `<div class="city-reading"><p class="reading-note">本站只转载经核对的短摘录。以下链接可查看第三方评价与原始游记；其内容由对应网站提供。</p>${excerpt?`<blockquote class="review-quote" lang="en">“${esc(excerpt.quote)}”<footer>${esc(excerpt.by)} · ${safeLink(excerpt.url,'原文')}</footer></blockquote>`:''}<div class="city-source-list">${safeLink(source,'旅游攻略／编辑游记')}${readingLinks(city,c.en).map(([label,url])=>safeLink(url,label)).join('')}</div></div>`;
}
function renderReading(){
 const city=el('reading-city').value,keys=city==='all'?REGIONS.flatMap(r=>r.cities):[city],shown=keys.slice(0,displayLimit(readingVisible,keys.length));
 el('reading-grid').innerHTML=shown.map(key=>`<article class="reading-card"><div class="reading-head"><span>READ / ${esc(CITIES[key].en)}</span><strong>${esc(CITIES[key].name)}</strong></div><p>${esc(CITIES[key].blurb)}</p>${cityReadingHTML(key)}</article>`).join('');
 updateCollectionControls('reading',shown.length,keys.length,'城市游记');
}
function cityRestaurantHTML(city){return `<div class="modal-restaurants">${(RESTAURANT_GUIDES[city]||[]).map(entry=>restaurantCard({city,entry})).join('')}</div>`;}
function initReading(){
 for(const [id,fn] of [['dining-city',renderDining],['reading-city',renderReading]]){
   const selector=el(id);if(!selector)continue;
   selector.innerHTML='<option value="all">全部目的地</option>'+REGIONS.map(r=>`<optgroup label="${esc(r.name)}">${r.cities.map(key=>`<option value="${key}">${esc(CITIES[key].name)}</option>`).join('')}</optgroup>`).join('');
   selector.value='all';selector.addEventListener('change',()=>{if(id==='dining-city')diningVisible=initialCollectionCount();else readingVisible=initialCollectionCount();fn()});fn();
 }
 el('dining-more')?.addEventListener('click',()=>{const total=restaurantItems(el('dining-city').value).length;diningVisible=Math.min(total,diningVisible+initialCollectionCount());renderDining()});
 el('reading-more')?.addEventListener('click',()=>{const total=el('reading-city').value==='all'?Object.keys(CITIES).length:1;readingVisible=Math.min(total,readingVisible+initialCollectionCount());renderReading()});
 el('dining-collapse')?.addEventListener('click',()=>{diningVisible=initialCollectionCount();renderDining();returnToSection('dining')});
 el('reading-collapse')?.addEventListener('click',()=>{readingVisible=initialCollectionCount();renderReading();returnToSection('reading')});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initReading);else initReading();
