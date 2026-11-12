'use strict';
// Interactive additions for EASTBOUND v3. Map lines on Leaflet are itinerary-order guides, NOT driving geometry.
let spotsVisible=initialCollectionCount(),shoppingVisible=initialCollectionCount(),ferryVisible=initialCollectionCount(),selectedSpotKind='all',mapCurrentMode='trip';
const KIND_NAMES={classic:'经典必游',nature:'自然户外',culture:'历史艺术',food:'美食市集',slow:'小镇慢游',family:'亲子体验'};
const cityName=key=>CITIES[key]?.name||key;
const mapName=key=>CITIES[key]?.search||key;
const extLink=(url,label,cls='')=>`<a ${cls?`class="${cls}"`:''} href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
const mapSpotUrl=(name,city)=>googleSearch(`${name} ${mapName(city)}`);
function allSpotRecords(){return Object.entries(EXTRA_SPOTS).flatMap(([city,records])=>records.map(([name,kind,time,description,note])=>({city,name,kind,time,description,note})));}
function fillCitySelect(select,all=false){
  const current=select.value;
  select.innerHTML=(all?'<option value="all">全部城市及地区</option>':'')+REGIONS.map(r=>`<optgroup label="${esc(r.name)}">${r.cities.map(key=>`<option value="${key}">${esc(cityName(key))} · ${esc(CITIES[key].en)}</option>`).join('')}</optgroup>`).join('');
  if([...select.options].some(o=>o.value===current))select.value=current;
}
function renderSpots(){
 const city=el('spot-city').value;
 const records=allSpotRecords().filter(s=>(city==='all'||s.city===city)&&(selectedSpotKind==='all'||s.kind===selectedSpotKind));
 const shown=records.slice(0,displayLimit(spotsVisible,records.length));
 el('spots-count').textContent=`共 ${records.length} 条景点建议 · 当前显示 ${shown.length} 条 · 时间为参考游览时长`;
 el('spot-grid').innerHTML=shown.length?shown.map((s,i)=>`<article class="spot-card"><div class="spot-top"><span class="spot-number">${String(i+1).padStart(2,'0')} / EXPLORE</span><span class="spot-type">${esc(KIND_NAMES[s.kind]||'城市探索')}</span></div><span class="spot-place">${esc(cityName(s.city))} / ${esc(CITIES[s.city].province)}</span><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p>${galleryHTML(s.name,s.city)}${spotReadingHTML(s.city,s.name,s.description,s.note)}<div class="spot-duration">◷ 建议停留 ${esc(s.time)}</div><div class="spot-note">${esc(s.note)}</div><div class="spot-actions">${extLink(mapSpotUrl(s.name,s.city),'地点地图 ↗')}<a class="add-city-link" href="planner.html?city=${encodeURIComponent(s.city)}#planner" aria-label="将${esc(cityName(s.city))}加入行程">加入行程 ↗</a></div></article>`).join(''):'<p class="empty-list">当前主题没有对应景点，请更换筛选条件。</p>';
 updateCollectionControls('spots',shown.length,records.length,'景点');
 activateGalleries(el('spot-grid'));
}
function renderShopping(){
 const city=el('shop-city').value;
 const shops=(city==='all'?REGIONS.flatMap(r=>r.cities.flatMap(key=>(SHOPPING_GUIDES[key]||[]).map(s=>({city:key,item:s})))):(SHOPPING_GUIDES[city]||[]).map(s=>({city,item:s})));
 const shown=shops.slice(0,displayLimit(shoppingVisible,shops.length));
 el('shopping-grid').innerHTML=shown.map(({city:place,item:[name,category,find,description]},i)=>`<article class="shop-card"><div class="shop-index">${esc(cityName(place))} / ${String(i+1).padStart(2,'0')}</div><span class="shop-category">${esc(category)}</span><h3>${esc(name)}</h3><p>${esc(description)}</p><div class="shop-pick"><strong>推荐留意</strong><span>${esc(find)}</span></div>${extLink(mapSpotUrl(name,place),'地图与周边商店 ↗','shop-map-link')}</article>`).join('');
 updateCollectionControls('shopping',shown.length,shops.length,'购物推荐');
}

function renderFerries(){
 el('ferry-grid').innerHTML=FERRY_GUIDES.slice(0,displayLimit(ferryVisible,FERRY_GUIDES.length)).map((f,i)=>`<article class="ferry-card"><div class="ferry-label">FERRY ROUTE / ${String(i+1).padStart(2,'0')}</div><h3>${esc(f.name)}</h3><p class="ferry-line">${esc(f.line)}</p><div class="ferry-stats"><div><span>参考航程</span><strong>${esc(f.duration)}</strong></div><div><span>航线运营</span><strong>${esc(f.operator)}</strong></div></div><p class="ferry-season">${esc(f.season)}</p><p class="ferry-note">${esc(f.note)}</p><div class="ferry-actions">${extLink(f.url,'官方班次 ↗')}${extLink(f.booking,'费用及预订信息 ↗')}</div></article>`).join('');
 updateCollectionControls('ferries',displayLimit(ferryVisible,FERRY_GUIDES.length),FERRY_GUIDES.length,'轮渡线路');
 el('rental-grid').innerHTML=RENTAL_PORTALS.map((r,i)=>`<article class="rental-card"><span>RENTAL ${String(i+1).padStart(2,'0')}</span><h4>${esc(r.name)}</h4><p class="rental-subtitle">${esc(r.subtitle)}</p><p>${esc(r.info)}</p>${extLink(r.url,'前往官方网站 ↗','rental-link')}</article>`).join('');
}
function legUrl(a,b,mode='car'){
 if(a===b)return googleSearch(mapName(a));
 return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(mapName(a))}&destination=${encodeURIComponent(mapName(b))}&travelmode=${mode==='transit'?'transit':'driving'}`;
}
function needCrossing(a,b){
 const an=['stjohns','bonavista'].includes(a),bn=['stjohns','bonavista'].includes(b);
 return (an!==bn)?'跨海航班 / 轮渡；无法直接按普通自驾计算':'';
}
function initExplorer(){
 if(el('spot-city')){
   fillCitySelect(el('spot-city'),true);el('spot-city').value='all';
   el('spot-city').addEventListener('change',()=>{spotsVisible=initialCollectionCount();renderSpots()});
   el('spot-kind').addEventListener('click',event=>{const b=event.target.closest('[data-kind]');if(!b)return;selectedSpotKind=b.dataset.kind;spotsVisible=initialCollectionCount();el('spot-kind').querySelectorAll('button').forEach(t=>{const active=t===b;t.classList.toggle('selected',active);t.setAttribute('aria-pressed',String(active))});renderSpots()});
   el('spots-more').addEventListener('click',()=>{const list=allSpotRecords().filter(s=>(el('spot-city').value==='all'||s.city===el('spot-city').value)&&(selectedSpotKind==='all'||s.kind===selectedSpotKind));spotsVisible=Math.min(list.length,spotsVisible+initialCollectionCount());renderSpots()});
   el('spots-collapse')?.addEventListener('click',()=>{spotsVisible=initialCollectionCount();renderSpots();returnToSection('attractions')});
   renderSpots();
 }
 if(el('shop-city')){
   fillCitySelect(el('shop-city'),true);el('shop-city').value='all';
   el('shop-city').addEventListener('change',()=>{shoppingVisible=initialCollectionCount();renderShopping()});
   el('shopping-more').addEventListener('click',()=>{const city=el('shop-city').value,total=city==='all'?Object.values(SHOPPING_GUIDES).reduce((s,a)=>s+a.length,0):(SHOPPING_GUIDES[city]||[]).length;shoppingVisible=Math.min(total,shoppingVisible+initialCollectionCount());renderShopping()});
   el('shopping-collapse')?.addEventListener('click',()=>{shoppingVisible=initialCollectionCount();renderShopping();returnToSection('shopping')});
   renderShopping();
 }
 if(el('ferry-grid')){renderFerries();el('ferries-more').addEventListener('click',()=>{ferryVisible=FERRY_GUIDES.length;renderFerries()});el('ferries-collapse')?.addEventListener('click',()=>{ferryVisible=initialCollectionCount();renderFerries();returnToSection('ferries')});}
 if(el('map-from')){
   fillCitySelect(el('map-from'));fillCitySelect(el('map-to'));
   el('map-from').value='toronto';el('map-to').value='quebec';
   document.querySelectorAll('[data-mapmode]').forEach(b=>b.addEventListener('click',()=>{mapCurrentMode=b.dataset.mapmode;clearCustomRoute();updateRouteMap()}));
   el('map-custom').addEventListener('click',showCustomRoute);
   initMapboxControls();
   updateRouteMap();
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initExplorer);else initExplorer();
