'use strict';
/* EASTBOUND V10.3 / Venue detail. Shared template, unique URL for every card.
 * Detail map uses a Google Maps iframe. This page no longer depends on Mapbox GL JS.
 * The public Google Maps query is NOT a manually verified street address.
 * Optional official Maps Embed API uses the site owner's separate Google API key.
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
  ['线上定位','通过 Google Maps 嵌入地图搜索，建议在 Google Maps 中确认具体地点'],
  ['出行方式','以实时地图路线、营业信息与目的地公告为准']
 ].map(([k,v])=>`<li><strong>${esc(k)}</strong><span>${esc(v)}</span></li>`).join('');
 el('action-back').href=`index.html#${isDining?'dining':'shopping'}`;
 for(const id of ['action-map','maps-navigation','maps-search'])el(id).href=googleUrl;
 if(isDining&&source&&/^https:\/\//.test(source)){el('action-source').hidden=false;el('action-source').href=source;el('action-source').textContent=sourceLabel+' ↗'}
 el('map-title').textContent=`${name} · ${cityInfo.en} · Canada`;
 // Google Maps iframe for restaurant / shopping details only.
 // Neither the old Mapbox public token nor Mapbox POI Search is required here.
 const mapStatus=el('map-status'),mapAddress=el('map-address');
 const iframe=el('place-map');
 // For dynamic venues without Places IDs, do not claim to have verified coordinates.
 mapAddress.textContent=`搜索关键词：${placeQuery}。地图结果根据名称匹配，并非本站核实的门牌地址；前往前请检查。`;
 const officialKey=String(window.EASTBOUND_GOOGLE_MAPS_EMBED_KEY||'').trim();
 const useOfficial=Boolean(officialKey);
 const googleEmbedSrc=useOfficial
  ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(officialKey)}&q=${encodeURIComponent(placeQuery)}&zoom=15&language=zh-CN`
  : `https://maps.google.com/maps?q=${encodeURIComponent(placeQuery)}&z=15&output=embed`;
 iframe.title=`Google Maps — ${name}，${cityInfo.en}`;
 iframe.src=googleEmbedSrc;
 const helpNote=useOfficial
  ? '使用 Google Maps Embed API 地点视图（已配置网站公开 API Key）。请在 Google Cloud 账户中启用 Maps Embed API，并为部署域名配置 HTTP Referrer 限制。'
  : '正在使用免 Key 的 Google Maps 查询 iframe 预览。此方式并非 Google 官方保证长期支持的动态 Embed API；如地图未显示，请点击下方 Google Maps 查看地点。';
 mapStatus.textContent=helpNote;
 iframe.addEventListener('load',()=>{
  // Cross-origin: iframe load does NOT prove that the Google map is visible.
  mapStatus.textContent=useOfficial
   ? '已发出 Google Maps Embed API 嵌入请求。若显示授权或计费错误，请检查 Google Cloud 项目配置；也可在下方打开 Google Maps。'
   : '已尝试加载 Google Maps 地图。若显示空白、拒绝嵌入或地点不准确，请点击下方「Google Maps 导航」在原站查看。';
 });
 iframe.addEventListener('error',()=>{
  mapStatus.textContent='Google 地图嵌入请求未成功。请使用下方 Google Maps 导航；或为网站配置官方 Maps Embed API Key。';
 });
 const mapCredit=el('map-credit');
 if(mapCredit)mapCredit.textContent=useOfficial
  ? 'Google Maps Embed API · 由 Google 提供底图与位置搜索结果。'
  : 'Google Maps 查询嵌入（免 Key 预览，不保证在所有浏览器中可用）；地图和地点数据由 Google 提供。';
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
