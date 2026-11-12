'use strict';
/* EASTBOUND V10 / Venue detail. Shared page template, unique URL for every card.
 * Location is a Mapbox Search Box live POI result, NEVER a guessed venue coordinate.
 * An unverified result stays unpinned with a Google Maps lookup fallback.
 */
(() => {
 const db=window.EASTBOUND_PLACE_DATA,params=new URLSearchParams(location.search);
 const type=params.get('type'),city=params.get('city'),idx=Number(params.get('item'));
 const isDining=type==='restaurant',isShop=type==='shopping';
 const records=db?.[isDining?'restaurants':'shopping']?.[city];
 const valid=(isDining||isShop)&&db?.cities?.[city]&&Number.isInteger(idx)&&idx>=0&&idx<(records?.length||0);
 const el=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const href=(t,c,i)=>`place.html?type=${encodeURIComponent(t)}&city=${encodeURIComponent(c)}&item=${i}`;
 if(!valid){document.title='未找到地点 · EASTBOUND';el('page-main').innerHTML='<div class="pwrap notfound"><div><div class="peye">EASTBOUND · 404</div><h1>暂时找不到这一站。</h1><p>这个链接可能已经改变，返回探索页面查看完整推荐。</p><a class="pbtn pbtn-primary" href="index.html">返回探索首页 ↗</a></div></div>';return;}
 const cityInfo=db.cities[city],row=records[idx];
 const [name,category,third,descriptionOrSource]=row;
 const summary=isDining?row[2]:row[3],source=isDining?row[3]:'',find=isDining?'':row[2];
 const displayCity=cityInfo.name,placeQuery=`${name} ${cityInfo.search}`;
 const googleUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeQuery)}`;
 const sourceLabel=isDining?'查看推荐依据':'查看当地相关资讯';
 const section=isDining?'精选餐厅':'购物与伴手礼';
 document.title=`${name} · ${displayCity} ${section}｜EASTBOUND`;
 el('crumb-section').href=`index.html#${isDining?'dining':'shopping'}`;el('crumb-section').textContent=section;
 el('crumb-name').textContent=name;
 el('place-overline').textContent=`EASTBOUND / ${isDining?'LOCAL DINING':'LOCAL FINDS'} · ${cityInfo.en}`;
 el('place-title').textContent=name;
 el('place-lead').textContent=summary;
 el('place-chips').innerHTML=[section,displayCity,category].map(t=>`<span class="pchip">${esc(t)}</span>`).join('');
 el('place-subtitle').textContent=isDining?'一顿好饭，是认识城市的开始。':'从一份手信，记住这座城市。';
 el('place-description').textContent=summary;
 el('place-experience').textContent=isDining
  ?`在${displayCity}的旅行中，可以把「${name}」与附近的景点、街区散步一起安排。这里的推荐重点是「${category}」。出发前建议通过餐厅官方页面核对菜单、营业日、订位和无障碍信息；本站不会将未核实的营业情况或顾客评分当作实时数据。`
  :`这里适合寻找「${find}」。${name}可能是商场、市集、街道、店铺集合或风景区域，并非每条推荐都代表一个拥有固定门牌号的独立商户。建议为购物预留足够步行时间，按当日商户营业情况灵活调整。`;
 el('place-tip-head').textContent=isDining?'用餐前建议确认':'购物前建议确认';
 el('place-tip').textContent=isDining
  ?`建议查看餐厅菜单及订位政策，留意当地节假日、着装与可能的服务费。${cityInfo.en} 的热门餐厅有时需要预约。`
  :`推荐留意：${find}。如果这里是街区或市集，请先确认商家分布、活动日与交通方式；部分景区店铺有季节性营业安排。`;
 el('place-facts').innerHTML=[
  ['地点类型',isDining?'餐厅 · '+category:'购物 · '+category],
  ['所属地区',displayCity+' · '+cityInfo.province],
  [isDining?'推荐体验':'值得寻找',isDining?summary:find],
  ['线上定位','通过 Mapbox 搜索该地点，或进入 Google Maps 核对地址'],
  ['出行方式','以实时地图路线、营业信息与目的地公告为准']
 ].map(([k,v])=>`<li><strong>${esc(k)}</strong><span>${esc(v)}</span></li>`).join('');
 el('action-back').href=`index.html#${isDining?'dining':'shopping'}`;
 for(const id of ['action-map','maps-navigation','maps-search'])el(id).href=googleUrl;
 if(isDining&&source&&/^https:\/\//.test(source)){el('action-source').hidden=false;el('action-source').href=source;el('action-source').textContent=sourceLabel+' ↗'}
 el('map-title').textContent=`${name} · ${cityInfo.en} · Canada`;
 const coords=db.gps[city],lat=coords[0],lng=coords[1];
 const posterCaption=el('poster-caption');posterCaption.textContent=`${displayCity}地区示意中心 · 非「${name}」的精确地址`;
 const poster=el('map-poster');
 const mapStatus=el('map-status'),mapAddress=el('map-address');
 mapAddress.textContent=`位置查询：${placeQuery}。如无法确认精确点位，请通过 Google Maps 核对。`;
 const tokenKey='eastbound.mapbox.public_token';
 function mapboxToken(){try{return(localStorage.getItem(tokenKey)||window.EASTBOUND_MAPBOX_TOKEN||'').trim()}catch(_){return(window.EASTBOUND_MAPBOX_TOKEN||'').trim()}}
 function tokenOk(t){return /^pk\.[\w.-]{15,}$/.test(t||'')}
 const mapFrame=el('place-map');
 function status(text){mapStatus.textContent=text}
 function insertKeySetup(){
  const details=document.createElement('details');details.className='map-key-setup';
  details.innerHTML=`<summary>配置 Mapbox 地图访问令牌</summary><p style="font-size:12px;color:#67717d;line-height:1.7">使用你自己的 pk. 公开令牌（与行程规划页共用），保存到此浏览器。令牌会用于地图和实时地点搜索，并可能计入 Mapbox 使用量。</p><div style="display:flex;gap:6px;flex-wrap:wrap"><input aria-label="Mapbox Public Token" placeholder="pk. 开头的 Mapbox 公开令牌" type="password" style="flex:1;min-width:140px;border:1px solid #dce0e5;border-radius:9px;padding:12px" id="place-map-key"><button class="pbtn" type="button" id="place-map-key-save">保存并加载</button></div>`;
  mapStatus.insertAdjacentElement('afterend',details);
  el('place-map-key-save').addEventListener('click',()=>{const t=el('place-map-key').value.trim();if(!tokenOk(t)){status('令牌无效：只可使用以 pk. 开头的公开访问令牌');return}try{localStorage.setItem(tokenKey,t)}catch(_){};details.open=false;loadMap(t)});
 }
 insertKeySetup();
 let mapInstance=null;
 async function fetchPlace(token){
  const url=new URL('https://api.mapbox.com/search/searchbox/v1/forward');
  // POI search, including street/neighborhood matches for shopping districts.
  url.searchParams.set('q',placeQuery.slice(0,250));url.searchParams.set('access_token',token);
  url.searchParams.set('country','CA');url.searchParams.set('limit','5');url.searchParams.set('language','en');
  url.searchParams.set('proximity',`${lng},${lat}`);
  const r=await fetch(url.toString());if(!r.ok)throw new Error('Search Box '+r.status);
  const data=await r.json();return(data.features||[]);
 }
 function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
 function distanceKm(a,b){const R=6371,rad=x=>x*Math.PI/180;const dlat=rad(b[1]-a[1]),dlng=rad(b[0]-a[0]);const z=Math.sin(dlat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dlng/2)**2;return R*2*Math.asin(Math.sqrt(z))}
 function chooseMatched(features){
  const simplified=norm(name).split(' ').filter(w=>w.length>2&&!['restaurant','shops','boutiques','and','the','cafe','market','stores','local'].includes(w));
  const essential=simplified.slice(0,2);
  for(const f of features){
   const pt=f.geometry?.coordinates;
   if(!Array.isArray(pt)||!pt.every(Number.isFinite))continue;
   const km=distanceKm([lng,lat],pt);if(km>130)continue;
   const n=norm(f.properties?.name||f.properties?.name_preferred||'');
   const good=essential.length ? essential.some(w=>n.includes(w)) : n.includes(norm(name));
   if(good)return f;
  }
  return null;
 }
 async function loadMap(token){
  if(!tokenOk(token)){status('未配置 Mapbox：下面是城市位置示意，非店铺精确位置。可直接点击「Google Maps 导航」查看地点。');return}
  if(!window.mapboxgl||!(window.mapboxgl.supported?.()??true)){status('Mapbox 地图库无法加载或浏览器不支持 WebGL，请用 Google Maps 核对位置。');return}
  status('正在使用 Mapbox Search Box 查找精确地点…');
  try{
   const matches=await fetchPlace(token);
   const chosen=chooseMatched(matches);
   if(!chosen){status('未能验证该店铺或街区的精确坐标，未放置可能错误的标记。请使用 Google Maps 查询。');return}
   const point=chosen.geometry.coordinates;
   if(mapInstance){mapInstance.remove();mapInstance=null}
   window.mapboxgl.accessToken=token;
   mapInstance=new window.mapboxgl.Map({container:mapFrame,style:'mapbox://styles/mapbox/light-v11',center:point,zoom:14.4,scrollZoom:false,attributionControl:true});
   mapInstance.addControl(new window.mapboxgl.NavigationControl({showCompass:false}),'top-right');
   mapInstance.on('load',()=>{
    poster.style.display='none';
    new window.mapboxgl.Marker({color:'#1a7bd1',scale:1.2}).setLngLat(point).setPopup(new window.mapboxgl.Popup({offset:24}).setText(chosen.properties?.name||name)).addTo(mapInstance);
    status('已在地图上标记 Mapbox 匹配地点；建议出行前再核对地址。');
   });
   mapInstance.on('error',()=>{status('Mapbox 地图加载出现问题，请使用外部导航核实位置。')});
   mapAddress.textContent=`Mapbox 搜索结果：${chosen.properties?.full_address||chosen.properties?.place_formatted||chosen.properties?.name||name}。这不是本站人工核实的门牌地址。`;
  }catch(e){status(`地图服务暂时无法查询（${String(e.message).slice(0,70)}），可通过 Google Maps 导航。`)}
 }
 loadMap(mapboxToken());
 // Photo area: venue-name matches first; locale shots are clearly labeled fallback.
 const group=Object.entries(db.cities).filter(([k,c])=>k!==city&&c.province===cityInfo.province).map(([k,c])=>c);
 const refs=[cityInfo,...group,...Object.values(db.cities).filter(c=>c!==cityInfo&&!group.includes(c))];
 const defaultPhotos=refs.slice(0,3).map(c=>({src:c.photo,url:c.photo,label:c.name+' · 地区参考图（非店铺实拍）',fallback:true}));
 function drawPhotos(photos){
  el('photo-grid').innerHTML=photos.slice(0,3).map((p,i)=>`<a class="photo-cell" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="查看第 ${i+1} 张图片来源"><img src="${esc(p.src)}" alt="${esc(p.label)}" loading="${i?'lazy':'eager'}" onerror="this.style.opacity='.15'"/><span class="photo-num">0${i+1} / 03</span><span class="photo-stamp">${esc(p.label)}</span></a>`).join('');
  const real=photos.filter(p=>!p.fallback).length;
  el('photo-note').textContent=real?`${real} 张地点搜索相关图片 · ${3-real} 张地区参考图 · 点击查看来源`:'3 张城市／周边参考图（非店铺实拍） · 点击查看图片来源';
 }
 drawPhotos(defaultPhotos);
 const extractText=s=>{const node=document.createElement('div');node.innerHTML=s||'';return(node.textContent||'').trim().slice(0,120)};
 async function commons(term){
  const searchUrl=new URL('https://commons.wikimedia.org/w/api.php');
  const args={action:'query',generator:'search',gsrsearch:`${term} filetype:bitmap`,gsrnamespace:'6',gsrlimit:'12',prop:'imageinfo',iiprop:'url|extmetadata|size',iiurlwidth:'1050',iiextmetadatafilter:'Artist|LicenseShortName',format:'json',origin:'*'};
  Object.entries(args).forEach(([k,v])=>searchUrl.searchParams.set(k,v));
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8500);
  try{
   const r=await fetch(searchUrl,{signal:controller.signal});if(!r.ok)throw new Error('Image API '+r.status);
   const d=await r.json();return Object.values(d.query?.pages||{}).sort((a,b)=>(a.index??999)-(b.index??999)).filter(p=>p.imageinfo?.[0]?.thumburl&&/\.(jpe?g|png|webp)$/i.test(p.title||'')).map(p=>({src:p.imageinfo[0].thumburl,url:p.imageinfo[0].descriptionurl,label:`${extractText(p.imageinfo[0].extmetadata?.Artist?.value)||p.title.replace(/^File:/,'')} · ${extractText(p.imageinfo[0].extmetadata?.LicenseShortName?.value)||'许可见原始文件'}`,fallback:false}));
  }catch(_){return []}finally{clearTimeout(timeout)}
 }
 (async()=>{
  const venue=await commons(`${name} ${cityInfo.en}`);
  // When venue photography is scarce, look for photos of the *same city*, not another city.
  const cityPictures=venue.length<3?await commons(`${cityInfo.en} Canada`):[];
  const used=new Set(venue.map(p=>p.url));
  const local=cityPictures.filter(p=>{if(used.has(p.url))return false;used.add(p.url);return true})
    .map(p=>({...p,fallback:true,label:`${cityInfo.name} · 城市参考图（非该店铺实拍） · ${p.label}`}));
  const photos=[...venue.slice(0,3),...local,...defaultPhotos].slice(0,3);
  drawPhotos(photos);
 })();
 const related=[];
 for(const t of [type,isDining?'shopping':'restaurant']){
  (db[t==='restaurant'?'restaurants':'shopping'][city]||[]).forEach((r,i)=>{if(t===type&&i===idx)return;related.push({type:t,row:r,index:i});});
 }
 el('nearby-grid').innerHTML=related.slice(0,3).map(p=>`<a class="extra-card" href="${href(p.type,city,p.index)}"><span class="extra-mini">${p.type==='restaurant'?'LOCAL TABLE':'LOCAL FINDS'} / ${esc(displayCity)}</span><h3>${esc(p.row[0])}</h3><p>${esc(p.type==='restaurant'?p.row[2]:p.row[3])}</p><span>查看独立详情 ↗</span></a>`).join('');
})();
