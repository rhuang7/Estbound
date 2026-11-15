'use strict';
// EASTBOUND / Mapbox GL JS v3 + Directions API.
// Mapbox provides the basemap and real driving geometry. Ferries and NL mainland crossings
// remain clearly marked as schematic; transit is never misrepresented as a driving route.
const MAPBOX_STORAGE_KEY = 'eastbound.mapbox.public_token';
let mbMap=null,mbLoaded=false,mbMarkers=[],mbFeatures=[],mbSequence=0,mbCustom=null,mbCurrentToken='';
const mbCache=new Map();
let mbRoutingError='';
const mbSafeStorage={
 get(){try{return localStorage.getItem(MAPBOX_STORAGE_KEY)||''}catch(_){return ''}},
 set(token){try{localStorage.setItem(MAPBOX_STORAGE_KEY,token)}catch(_){ /* file/privacy mode */}},
 clear(){try{localStorage.removeItem(MAPBOX_STORAGE_KEY)}catch(_){}}
};
function mapboxPublicToken(){return mbSafeStorage.get()||(window.EASTBOUND_MAPBOX_TOKEN||'').trim()}
function mapboxValidToken(token){return /^pk\.[A-Za-z0-9._-]{15,}$/.test(String(token||'').trim())}
function mbNode(id){return document.getElementById(id)}
function mapStatus(text,kind='neutral'){
 const label=mbNode('mapbox-status');if(!label)return;
 label.textContent=text;label.dataset.kind=kind;
}
function mapFallback(title,detail){
 const fallback=mbNode('map-fallback');if(!fallback)return;
 fallback.hidden=false;
 const t=fallback.querySelector('strong'),d=fallback.querySelector('p');
 if(t)t.textContent=title;if(d)d.textContent=detail;
}
function hideMapFallback(){const f=mbNode('map-fallback');if(f)f.hidden=true}
function initMapboxControls(){
 const input=mbNode('mapbox-token'),save=mbNode('mapbox-save'),reset=mbNode('mapbox-clear');
 if(!input)return;
 if(mapboxValidToken(mapboxPublicToken())){
  mapStatus('Mapbox 令牌已配置 · 可载入在线地图','ready');
  const settings=mbNode('mapbox-settings');if(settings)settings.open=false;
 }else{
  mapStatus('未配置 Mapbox · 仍可查看城市与外部导航','notice');
  const settings=mbNode('mapbox-settings');if(settings)settings.open=true;
 }
 save.addEventListener('click',()=>{
  const token=input.value.trim();
  if(!mapboxValidToken(token)){mapStatus('请输入有效的公开访问令牌（pk. 开头），不可使用 sk. 私密令牌','error');return}
  mbSafeStorage.set(token);input.value='';
  mapStatus('令牌已保存到当前浏览器，正在载入地图…','ready');
  initializeMapbox(true);updateRouteMap();
 });
 reset.addEventListener('click',()=>{
  mbSafeStorage.clear();input.value='';mbCurrentToken='';mbSequence++;
  if(mbMap){mbMap.remove();mbMap=null;mbLoaded=false;mbMarkers=[]}
  mapStatus(window.EASTBOUND_MAPBOX_TOKEN?'已恢复网站预设令牌':'已清除本机令牌','notice');
  updateRouteMap();
 });
}
function initializeMapbox(force=false){
 const token=mapboxPublicToken();
 if(!mapboxValidToken(token)){
  mapFallback('开启 Mapbox 地图','在上方的地图配置中输入自己的 Mapbox 公开访问令牌（pk.），即可加载在线地图和驾车路线。');
  return false;
 }
 if(typeof mapboxgl==='undefined'){
  mapFallback('地图组件尚未加载','检查网络连接是否允许访问 api.mapbox.com；行程与外部地图导航仍可使用。');
  mapStatus('Mapbox JS 未加载，请检查网络或浏览器拦截设置','error');
  return false;
 }
 if(typeof mapboxgl.supported==='function'&&!mapboxgl.supported()){
  mapFallback('当前浏览器不支持交互式地图','请开启浏览器硬件加速，或使用新版 Chrome、Safari、Edge。');
  mapStatus('浏览器不支持 WebGL 地图','error');return false;
 }
 if(mbMap && (force||mbCurrentToken!==token)){
  mbSequence++;mbMap.remove();mbMap=null;mbLoaded=false;mbMarkers=[];
 }
 if(mbMap)return mbLoaded;
 mbCurrentToken=token;
 mapboxgl.accessToken=token;
 hideMapFallback();
 try{
  mbMap=new mapboxgl.Map({container:'trip-map',style:'mapbox://styles/mapbox/light-v11',center:[-66.5,46.5],zoom:4.1,scrollZoom:false,attributionControl:true});
  mbMap.addControl(new mapboxgl.NavigationControl({showCompass:false}),'top-left');
  mbMap.on('load',()=>{
   mbLoaded=true;hideMapFallback();
   mbMap.addSource('eb-routes',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
   mbMap.addLayer({id:'eb-road-casing',type:'line',source:'eb-routes',filter:['==',['get','type'],'road'],paint:{'line-color':'#ffffff','line-width':8,'line-opacity':.92},layout:{'line-cap':'round','line-join':'round'}});
   mbMap.addLayer({id:'eb-road',type:'line',source:'eb-routes',filter:['==',['get','type'],'road'],paint:{'line-color':'#1778D4','line-width':4.5,'line-opacity':.94},layout:{'line-cap':'round','line-join':'round'}});
   mbMap.addLayer({id:'eb-manual',type:'line',source:'eb-routes',filter:['==',['get','type'],'manual'],paint:{'line-color':'#D18B4A','line-width':3,'line-dasharray':[2,2],'line-opacity':.88}});
   mbMap.addLayer({id:'eb-ferry',type:'line',source:'eb-routes',filter:['==',['get','type'],'ferry'],paint:{'line-color':'#4275B6','line-width':2.5,'line-dasharray':[2,3],'line-opacity':.84}});
   mapStatus('Mapbox 在线地图已连接','ready');
   updateRouteMap();
  });
  mbMap.on('error',evt=>{
   const message=String(evt?.error?.message||'Mapbox 资源加载失败');
   if(/401|403|not authorized|forbidden|invalid token/i.test(message)){
    mapStatus('地图拒绝访问（401/403），请检查令牌或域名限制','error');
    mapFallback('Mapbox 访问受限','检查 pk. 令牌、地图读取权限和 Mapbox 控制台中的允许域名设置。');
   }else{mapStatus('地图资源加载异常，请检查网络','error')}
  });
 }catch(error){mbMap=null;mbLoaded=false;mapStatus('无法初始化 Mapbox 地图','error');mapFallback('地图初始化失败',String(error.message||error));}
 return mbLoaded;
}
function ll(pt){return [pt[1],pt[0]]}
function mbGeoLine(points,type){if(points.length>1)mbFeatures.push({type:'Feature',properties:{type},geometry:{type:'LineString',coordinates:points.map(ll)}})}
function mbFlush(){if(mbMap&&mbLoaded&&mbMap.getSource('eb-routes'))mbMap.getSource('eb-routes').setData({type:'FeatureCollection',features:mbFeatures})}
function mbClear(){mbFeatures=[];for(const marker of mbMarkers)marker.remove();mbMarkers=[];mbSequence++;mbRoutingError='';mbFlush()}
function mbMarker(pt,label,number,fill='#20242B'){
 if(!mbMap||!mbLoaded)return;
 const node=document.createElement('div');node.className='eb-pin';node.textContent=String(number||'•');node.style.background=fill;node.setAttribute('aria-label',label);
 const popup=document.createElement('div');popup.className='eb-map-popup';popup.textContent=label;
 const marker=new mapboxgl.Marker({element:node,anchor:'bottom'}).setLngLat(ll(pt)).setPopup(new mapboxgl.Popup({offset:18}).setDOMContent(popup)).addTo(mbMap);
 mbMarkers.push(marker);
}
function mbFit(points){
 if(!mbMap||!mbLoaded||!points.length)return;
 if(points.length===1){mbMap.flyTo({center:ll(points[0]),zoom:8,essential:true});return}
 const bounds=new mapboxgl.LngLatBounds();for(const point of points)bounds.extend(ll(point));
 mbMap.fitBounds(bounds,{padding:{top:54,bottom:54,left:50,right:50},maxZoom:9,duration:550});
}
function clearCustomRoute(){mbCustom=null}
function renderModeButtons(){document.querySelectorAll('[data-mapmode]').forEach(b=>{const on=b.dataset.mapmode===mapCurrentMode;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))})}
function mbLegHtml(keys,mode){
 return keys.map((key,i)=>{
  const crossing=i?needCrossing(keys[i-1],key):'';
  const trans=i&&mode==='transit';
  return `<div class="map-step"><span class="map-step-bullet">${i+1}</span><div><strong>${esc(cityName(key))}</strong>${i?`<small>${crossing?'⚠ '+esc(crossing):trans?'公共交通需要另行核对':`由 ${esc(cityName(keys[i-1]))} 前往`}</small><small class="map-leg-metric" data-leg="${i-1}">${crossing?'跨海段 · 需另订轮渡/航班':trans?'未计算公交行程': '等待路线计算…'}</small>${extLink(legUrl(keys[i-1],key,mode),crossing?'跨海段导航及班次查询 ↗':'分段导航 ↗')}`:'<small>行程起点</small>'}</div></div>`;
 }).join('');
}
function mbSetMetric(index,text){const node=document.querySelector(`.map-leg-metric[data-leg="${index}"]`);if(node)node.textContent=text}
function mbPretty(distance,duration){const km=Math.round(distance/1000),minute=Math.round(duration/60);return `参考道路 ${km.toLocaleString('en-CA')} km · ${minute<60?minute+' 分钟':(Math.round(minute/6)/10)+' 小时'}`}
function mbGroups(keys){
 const groups=[];let current=[{key:keys[0],index:0}];
 for(let i=1;i<keys.length;i++){
  if(needCrossing(keys[i-1],keys[i])){if(current.length>1)groups.push(current);current=[{key:keys[i],index:i}];}
  else current.push({key:keys[i],index:i});
 }
 if(current.length>1)groups.push(current);
 return groups;
}
async function mbFetchRoute(group,token){
 const coords=group.map(({key})=>ll(GPS[key]).join(',')).join(';');
 const cacheKey=token+'|'+coords;
 if(mbCache.has(cacheKey))return mbCache.get(cacheKey);
 const endpoint=`https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?alternatives=false&exclude=ferry&geometries=geojson&overview=full&steps=false&access_token=${encodeURIComponent(token)}`;
 const response=await fetch(endpoint);
 if(!response.ok)throw Error(`Directions HTTP ${response.status}`);
 const data=await response.json();
 if(data.code!=='Ok'||!data.routes?.length)throw Error(data.message||'无法找到可驾车路线');
 const result=data.routes[0];mbCache.set(cacheKey,result);return result;
}
async function mbDrawRoads(keys,mode,seq){
 if(!mbLoaded||mode!=='car'||keys.length<2)return;
 const groups=mbGroups(keys),token=mbCurrentToken;
 let completed=0;
 for(const group of groups){
  try{
   const response=await mbFetchRoute(group,token);
   if(seq!==mbSequence||mbCurrentToken!==token)return;
   mbFeatures.push({type:'Feature',properties:{type:'road'},geometry:response.geometry});
   for(let j=0;j<group.length-1;j++){
    const leg=response.legs?.[j];if(leg)mbSetMetric(group[j].index,mbPretty(leg.distance,leg.duration));
   }
   completed++;mbFlush();
  }catch(error){
   if(seq!==mbSequence)return;
   mbRoutingError=String(error.message||error);
   for(let j=0;j<group.length-1;j++){
    const start=group[j].index;mbSetMetric(start,'路线暂不可用 · 请打开分段导航');
    mbGeoLine([GPS[keys[start]],GPS[keys[start+1]]],'manual');
   }
   mbFlush();
  }
 }
 if(seq!==mbSequence)return;
 if(completed>0){mbNode('map-description').textContent=`蓝色实线为 Mapbox Directions 计算的参考驾车道路（优先排除轮渡）；橙色虚线为跨海或未能计算的路段。已计算 ${completed} 段连续公路路线。`;mapStatus(mbRoutingError?'部分路段计算失败，请核对导航':'Mapbox 路线计算完成','ready')}
 else if(groups.length>0){mapStatus('Directions 未返回可用路线，外部导航仍可使用','error')}
}
function updateRouteMap(){
 if(!mbNode('map-title'))return;
 const connected=initializeMapbox();
 mbClear();renderModeButtons();
 const p=state.plan,mode=p?.travel||'car';let points=[];
 if(mapCurrentMode==='ferries'){
  mbNode('map-title').textContent='加东轮渡线路总览';
  mbNode('map-description').textContent='蓝色虚线为轮渡码头间的示意连接，不代表可驾车路径或实时船班。';
  mbNode('map-route-steps').innerHTML=FERRY_GUIDES.map(f=>`<div class="map-step"><span class="map-step-bullet">≈</span><div><strong>${esc(f.line)}</strong><small>${esc(f.duration)} · ${esc(f.season)}</small>${extLink(f.url,'官方轮渡班次 ↗')}</div></div>`).join('');
  mbNode('map-full-link').href='https://www.google.com/maps/';mbNode('map-full-link').textContent='打开 Google Maps ↗';
  for(const f of FERRY_GUIDES){mbMarker(f.pointA,f.line+' · 起点','↗','#417db4');mbMarker(f.pointB,f.line+' · 终点','↗','#417db4');mbGeoLine([f.pointA,f.pointB],'ferry');points.push(f.pointA,f.pointB)}
  mbNode('map-caution').textContent='轮渡和两端公路分开计算。请核实船班、车辆票、季节运营和提前报到时间。';
 }else if(mapCurrentMode==='all'){
  mbNode('map-title').textContent='十九座城市，更多种可能';
  mbNode('map-description').textContent='点击地图标记查看城市；在独立规划页勾选城市生成你的旅行路线。';
  mbNode('map-route-steps').innerHTML=REGIONS.map(r=>`<div class="map-region-line"><strong>${esc(r.name)}</strong><span>${esc(r.cities.map(cityName).join('、'))}</span></div>`).join('');
  mbNode('map-full-link').href='https://www.google.com/maps/search/?api=1&query=Eastern%20Canada';mbNode('map-full-link').textContent='在 Google Maps 探索加东 ↗';
  Object.keys(CITIES).forEach((key,i)=>{mbMarker(GPS[key],cityName(key),String(i+1));points.push(GPS[key])});
  mbNode('map-caution').textContent='城市位置是区域中心点，而非景点、酒店或轮渡码头的精确坐标。';
 }else{
  const defaultKeys=p?.route||['toronto','ottawa','montreal','quebec'];
  const keys=mbCustom?mbCustom:[...(p&&defaultKeys[0]!==state.start?[state.start]:[]),...defaultKeys];
  const method=mbCustom?mbNode('travel-mode').value:mode;
  mbNode('map-title').textContent=mbCustom?`${cityName(keys[0])} → ${cityName(keys[1])}`:p?`${p.days} 天 · ${p.route.length} 个目的地`:'加东经典路线';
  mbNode('map-description').textContent=method==='car'?'正在准备参考驾车路径。蓝色实线表示真实道路，橙色虚线表示跨海或尚未验证的路段。':'公共交通模式仅显示访问顺序和城市位置，未进行实际公交/火车线路计算。';
  mbNode('map-route-steps').innerHTML=mbLegHtml(keys,method);
  keys.forEach((key,i)=>{mbMarker(GPS[key],cityName(key),String(i+1),i===0?'#1677d2':'#24272b');points.push(GPS[key]);if(i&&(method!=='car'||needCrossing(keys[i-1],key)))mbGeoLine([GPS[keys[i-1]],GPS[key]],'manual')});
  if(keys.length<=8&&!keys.some((key,i)=>i&&needCrossing(keys[i-1],key))){
   mbNode('map-full-link').href=mapsUrl(keys,method);mbNode('map-full-link').textContent='在 Google Maps 查看完整路线 ↗';
  }else{
   mbNode('map-full-link').href=legUrl(keys[0],keys[1]||keys[0],method);mbNode('map-full-link').textContent='从首段开始查看导航 ↗';
  }
  const crosses=keys.some((key,i)=>i&&needCrossing(keys[i-1],key));
  mbNode('map-caution').textContent=crosses?'⚠ 此行程包含纽芬兰大陆跨海段。请另订航班或 Marine Atlantic 轮渡，并核实车辆与码头接驳。':method==='transit'?'公共交通的时刻、换乘、公交覆盖和跨省线路需要通过交通运营方核对。':'路线只供出行计划参考，实际行车时间会受交通、天气、道路封闭和轮渡班次影响。';
  if(connected && method==='car'){
   const seq=mbSequence;
   // Let Mapbox compute connected road geometry; do not ask it to route across the open Atlantic.
   mbDrawRoads(keys,method,seq);
  }
 }
 mbFlush();if(connected)mbFit(points);
}
function showCustomRoute(){
 const a=mbNode('map-from').value,b=mbNode('map-to').value;
 if(a===b){notify('起点和终点不能相同');return}
 mbCustom=[a,b];mapCurrentMode='trip';updateRouteMap();
}
