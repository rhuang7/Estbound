'use strict';
// Image gallery: three related photographs per place. Wikimedia Commons is queried on demand;
// each image's source page and license are preserved. Regional photos are clearly labeled fallback.
const SPOT_SEARCH_EN = {
 toronto:['Art Gallery of Ontario Toronto','Casa Loma Toronto','Scarborough Bluffs Toronto','High Park Toronto','Bata Shoe Museum Toronto'],
 niagara:['Journey Behind the Falls Niagara','Niagara Parks Power Station','White Water Walk Niagara Falls','Niagara Glen Nature Reserve','Niagara Butterfly Conservatory'],
 kingston:['Bellevue House Kingston Ontario','Kingston City Hall','Thousand Islands National Park Canada','Gananoque waterfront','Martello towers Kingston Ontario'],
 ottawa:['Canadian War Museum Ottawa','Canadian Museum of Nature Ottawa','Majors Hill Park Ottawa','Dows Lake Ottawa','Diefenbunker museum Ottawa'],
 montreal:['Montreal Museum of Fine Arts','Atwater Market Montreal','Saint Joseph Oratory Montreal','Lachine Canal Montreal','Pointe a Calliere Montreal'],
 tremblant:['Lac Tremblant Quebec','Domaine Saint Bernard Mont Tremblant','Mont Tremblant mountain summit','Vieux Tremblant village','Lac Mercier Mont Tremblant'],
 quebec:['Fortifications of Quebec City','Musee de la civilisation Quebec City','Basilica Sainte Anne de Beaupre','Montmorency Falls Quebec','Quebec Levis ferry'],
 charlevoix:['Le Massif de Charlevoix','Isle aux Coudres Charlevoix','Parc national des Hautes Gorges de la Riviere Malbaie','La Malbaie Quebec','Baie Saint Paul art galleries'],
 halifax:['Halifax Citadel National Historic Site','Canadian Museum of Immigration Pier 21','Maritime Museum of the Atlantic Halifax','Point Pleasant Park Halifax','Halifax Public Gardens'],
 peggys:['Pollys Cove Nova Scotia','Swissair Flight 111 memorial Nova Scotia','Indian Harbour Nova Scotia','Saint Margarets Bay Nova Scotia','Peggys Cove lighthouse village'],
 lunenburg:['Fisheries Museum of the Atlantic Lunenburg','Bluenose II Lunenburg harbour','Mahone Bay three churches','Hirtles Beach Nova Scotia','Gaff Point Trail Nova Scotia'],
 capebreton:['Cape Breton Highlands National Park','Fortress of Louisbourg','Alexander Graham Bell National Historic Site Baddeck','Ingonish Beach Cape Breton','Cheticamp Cape Breton'],
 charlottetown:['Province House Charlottetown PEI','Confederation Centre of the Arts Charlottetown','Victoria Park Charlottetown PEI','Peakes Wharf Charlottetown','Beaconsfield Historic House Charlottetown'],
 cavendish:['Green Gables Heritage Place PEI','Cavendish Beach Prince Edward Island','Greenwich PEI National Park dunes','North Rustico Harbour PEI','Brackley Beach Prince Edward Island'],
 moncton:['Magnetic Hill Moncton','Tidal Bore Park Moncton','Shediac giant lobster statue','Parlee Beach Shediac','Resurgo Place Moncton'],
 fundy:['Fundy National Park New Brunswick','Cape Enrage New Brunswick','Dickson Falls Fundy National Park','Alma New Brunswick village','Hopewell Rocks New Brunswick'],
 saintjohn:['Saint John City Market New Brunswick','New Brunswick Museum Saint John','Kings Square Saint John New Brunswick','Fundy Trail Parkway New Brunswick','Carleton Martello Tower Saint John'],
 stjohns:['Johnson GEO CENTRE St Johns Newfoundland','Bowring Park St Johns Newfoundland','Fort Amherst Newfoundland','Petty Harbour Newfoundland','Witless Bay Ecological Reserve'],
 bonavista:['Elliston puffins Newfoundland','Skerwink Trail Trinity Newfoundland','Port Union Historic District Newfoundland','Cape Bonavista Lighthouse','Dungeon Provincial Park Newfoundland']
};
const HIGHLIGHT_SEARCH_EN = {
 toronto:['CN Tower Toronto','St Lawrence Market Toronto','Toronto Islands','Royal Ontario Museum'],
 niagara:['Horseshoe Falls Niagara','Niagara Falls promenade','Niagara on the Lake Ontario','Niagara Parkway Ontario'],
 kingston:['Kingston Ontario waterfront','Fort Henry Kingston','Gananoque Ontario','Thousand Islands boat tour'],
 ottawa:['Parliament Hill Ottawa','Rideau Canal Ottawa','ByWard Market Ottawa','National Gallery of Canada'],
 montreal:['Old Montreal','Notre Dame Basilica Montreal','Mount Royal Park Montreal','Jean Talon Market Montreal'],
 tremblant:['Mont Tremblant pedestrian village','Lac Tremblant','Mont Tremblant National Park','Mont Tremblant mountain summit'],
 quebec:['Chateau Frontenac Quebec City','Petit Champlain Quebec City','Dufferin Terrace Quebec City','Montmorency Falls Quebec'],
 charlevoix:['Baie Saint Paul Quebec','Saint Lawrence River Charlevoix','Route du Fleuve Charlevoix','Grands Jardins National Park Quebec'],
 halifax:['Halifax waterfront','Peggys Cove Lighthouse','Halifax Citadel','Halifax Public Gardens'],
 peggys:['Peggys Cove lighthouse','Peggys Cove village','Peggys Cove granite shore','St Margarets Bay Nova Scotia'],
 lunenburg:['Lunenburg waterfront','Old town Lunenburg','Bluenose II Lunenburg','Mahone Bay Nova Scotia'],
 capebreton:['Cabot Trail Cape Breton','Cape Breton Highlands National Park','Skyline Trail Cape Breton','Fortress Louisbourg'],
 charlottetown:['Charlottetown waterfront','Victoria Row Charlottetown','Province House PEI','Confederation Centre of the Arts'],
 cavendish:['Cavendish Beach PEI','Green Gables Heritage Place','Prince Edward Island National Park','North Rustico PEI'],
 moncton:['Magnetic Hill Moncton','Tidal Bore Moncton','Shediac New Brunswick','Moncton downtown'],
 fundy:['Hopewell Rocks','Fundy National Park','Cape Enrage New Brunswick','Bay of Fundy New Brunswick'],
 saintjohn:['Saint John waterfront New Brunswick','Saint John City Market','Reversing Falls Saint John','Fundy Trail Parkway'],
 stjohns:['Signal Hill St Johns Newfoundland','Jellybean Row St Johns','Cape Spear Newfoundland','Quidi Vidi St Johns'],
 bonavista:['Cape Bonavista Lighthouse','Bonavista Newfoundland','Skerwink Trail','Elliston puffins Newfoundland']
};
const galleryCache = new Map();
const galleryQueue = [];
let galleryActive = 0;
let galleryObserver;
const GALLERY_LIMIT = 2;
function galleryQuery(city,name){
  const idx=EXTRA_SPOTS[city]?.findIndex(row=>row[0]===name)??-1;
  if(idx>=0&&SPOT_SEARCH_EN[city]?.[idx])return SPOT_SEARCH_EN[city][idx];
  const hi=CITIES[city]?.places?.indexOf(name)??-1;
  if(hi>=0&&HIGHLIGHT_SEARCH_EN[city]?.[hi])return HIGHLIGHT_SEARCH_EN[city][hi];
  return `${name.replace(/[\u3400-\u9fff]/g,'').trim()} ${CITIES[city]?.en||'Canada'}`.trim();
}
function galleryFallback(city){
  const group=REGIONS.find(r=>r.cities.includes(city))?.cities||[city];
  const peerRegions=REGIONS.slice(REGIONS.findIndex(r=>r.cities.includes(city))>=2?2:0,REGIONS.findIndex(r=>r.cities.includes(city))>=2?REGIONS.length:2).flatMap(r=>r.cities);
  const pool=[city,...group.filter(k=>k!==city),...peerRegions.filter(k=>k!==city)];
  return [...new Set(pool)].slice(0,3).map((key,i)=>({src:CITIES[key].photo,source:CITIES[key].url,license:'地区参考图，非该景点实拍',credit:`${CITIES[key].name} · 目的地参考图片`,isFallback:true}));
}
function galleryId(city,name){return `${city}:${name}`;}
function galleryHTML(name,city,compact=false){
  const photos=galleryFallback(city);
  const images=photos.map((p,i)=>`<button type="button" class="gallery-thumb" data-photo-expand="${i}" aria-label="查看${esc(name)}第${i+1}张图片"><img src="${esc(p.src)}" alt="${esc(name)}图片 ${i+1} · 地区参考图" loading="lazy" onerror="galleryImageFailed(this)" onload="galleryImageLoaded(this)"/><span class="gallery-index">0${i+1}</span></button>`).join('');
  return `<div class="attraction-gallery ${compact?'gallery-compact':''}" data-gallery-city="${esc(city)}" data-gallery-name="${esc(name)}"><div class="gallery-images">${images}</div><div class="gallery-caption"><span class="gallery-status">3 张地区参考图 · 正在搜索景点实拍</span><a class="gallery-source" href="https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=${encodeURIComponent(galleryQuery(city,name))}" target="_blank" rel="noopener noreferrer">更多相关图片 ↗</a></div></div>`;
}
function galleryImageFailed(img){
  img.style.opacity='0';img.closest('.gallery-thumb')?.classList.add('image-unavailable');
}
function galleryImageLoaded(img){
  img.style.opacity='1';img.closest('.gallery-thumb')?.classList.remove('image-unavailable');
}
const galleryText = html => {
 const node=document.createElement('div');node.innerHTML=html||'';
 return (node.textContent||'').replace(/\s+/g,' ').trim().slice(0,180);
};
async function searchCommons(city,name){
  const term=galleryQuery(city,name);
  const candidates=[term,`${term.split(' ').slice(0,3).join(' ')} ${CITIES[city]?.en||'Canada'}`];
  const out=[];const seen=new Set();
  for(const q of candidates){
    if(out.length>=3)break;
    const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:`${q} filetype:bitmap`,gsrnamespace:'6',gsrlimit:'15',prop:'imageinfo',iiprop:'url|extmetadata|size',iiurlwidth:'900',iiextmetadatafilter:'Artist|LicenseShortName|LicenseUrl',format:'json',origin:'*'});
    try{
      const response=await fetch('https://commons.wikimedia.org/w/api.php?'+params.toString(),{signal:AbortSignal.timeout?AbortSignal.timeout(10000):undefined});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      const pages=Object.values(data.query?.pages||{}).sort((a,b)=>(a.index||999)-(b.index||999));
      for(const page of pages){
        const info=page.imageinfo?.[0];if(!info?.thumburl||!info.descriptionurl)continue;
        if(!/\.(jpe?g|png|webp)$/i.test(page.title||''))continue;
        if(info.width&&info.height&&Math.min(info.width,info.height)<340)continue;
        if(seen.has(page.title))continue;seen.add(page.title);
        out.push({src:info.thumburl,source:info.descriptionurl,license:galleryText(info.extmetadata?.LicenseShortName?.value)||'请见原始许可',credit:galleryText(info.extmetadata?.Artist?.value)||page.title.replace(/^File:/,''),isFallback:false});
        if(out.length>=3)break;
      }
    }catch(e){/* Offline or Commons unavailable: retain clearly labeled regional images. */}
  }
  return [...out,...galleryFallback(city)].slice(0,3);
}
function galleryPhotos(city,name){
  const id=galleryId(city,name);
  if(!galleryCache.has(id))galleryCache.set(id,searchCommons(city,name));
  return galleryCache.get(id);
}
function galleryUpdate(box,photos){
  const city=box.dataset.galleryCity,name=box.dataset.galleryName;
  const buttons=[...box.querySelectorAll('.gallery-thumb')];
  buttons.forEach((b,i)=>{
    const img=b.querySelector('img'),p=photos[i];if(!p)return;
    img.src=p.src;img.alt=`${name} · 图片 ${i+1}${p.isFallback?'（地区参考图，非景点实拍）':''}`;
    img.onerror=()=>galleryImageFailed(img);
  });
  const n=photos.filter(p=>!p.isFallback).length;
  box.querySelector('.gallery-status').textContent=n===3?'3 张景点相关图片 · 点击放大':`${n} 张景点图片 + ${3-n} 张地区参考图 · 点击放大`;
  box.dataset.ready='yes';
}
function scheduleGallery(box){
  if(box.dataset.scheduled)return;box.dataset.scheduled='yes';
  galleryQueue.push(box);pumpGalleryQueue();
}
function pumpGalleryQueue(){
  while(galleryActive<GALLERY_LIMIT&&galleryQueue.length){
    const box=galleryQueue.shift();galleryActive++;
    galleryPhotos(box.dataset.galleryCity,box.dataset.galleryName)
      .then(photos=>{if(box.isConnected)galleryUpdate(box,photos)})
      .catch(()=>{if(box.isConnected)galleryUpdate(box,galleryFallback(box.dataset.galleryCity))})
      .finally(()=>{galleryActive--;pumpGalleryQueue()});
  }
}
function activateGalleries(root=document){
  const boxes=[...root.querySelectorAll('.attraction-gallery')];
  if('IntersectionObserver' in window){
    galleryObserver??=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){galleryObserver.unobserve(e.target);scheduleGallery(e.target)}}),{rootMargin:'350px'});
    boxes.forEach(box=>galleryObserver.observe(box));
  }else boxes.forEach(scheduleGallery);
}
function openGalleryPhoto(box,index){
  const city=box.dataset.galleryCity,name=box.dataset.galleryName;
  let photos=galleryFallback(city);
  const boxImages=[...box.querySelectorAll('.gallery-thumb img')];
  boxImages.forEach((img,i)=>{if(img.src)photos[i]={...photos[i],src:img.src};});
  let current=index;
  const dialog=document.getElementById('photo-lightbox');if(!dialog)return;
  const paint=()=>{
    const p=photos[current];document.getElementById('lightbox-image').src=p.src;
    document.getElementById('lightbox-image').alt=`${name} · 第 ${current+1} 张`;
    document.getElementById('lightbox-title').textContent=`${name} · ${current+1}/3`;
    document.getElementById('lightbox-credit').textContent=`${p.isFallback?'周边地区参考图（非该景点实拍） · ':''}${p.credit} · ${p.license}`;
    document.getElementById('lightbox-source').href=p.source;
  };
  paint();
  if(!dialog.open)dialog.showModal();
  const previous=document.getElementById('lightbox-prev'),next=document.getElementById('lightbox-next');
  previous.onclick=()=>{current=(current+2)%3;paint()};
  next.onclick=()=>{current=(current+1)%3;paint()};
  dialog.onkeydown=e=>{if(e.key==='ArrowRight')next.click();if(e.key==='ArrowLeft')previous.click()};
  galleryPhotos(city,name).then(found=>{photos=found;if(dialog.open)paint()}).catch(()=>{});
}
function initGallery(){
  document.addEventListener('click',e=>{
    const thumb=e.target.closest('[data-photo-expand]');
    if(!thumb)return;
    const gallery=thumb.closest('.attraction-gallery');if(gallery)openGalleryPhoto(gallery,Number(thumb.dataset.photoExpand));
  });
  const dialog=document.getElementById('photo-lightbox');if(dialog){
    document.getElementById('lightbox-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initGallery);else initGallery();
