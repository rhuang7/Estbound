'use strict';
/* EASTBOUND V6 arrival & return airport advisory. This does not query live flight inventory.
 * Non-overlapping local-airport suggestions + optional Mapbox Geocoding v6 (billable to token owner).
 * Never claim flight availability, nonstop routes, or fares. */
const CANADA_AIRPORTS=[
 ['YVR','Vancouver','BC',49.195,-123.184],['YYJ','Victoria','BC',48.647,-123.426],['YXX','Abbotsford','BC',49.025,-122.361],['YLW','Kelowna','BC',49.958,-119.377],['YKA','Kamloops','BC',50.703,-120.448],['YXS','Prince George','BC',53.889,-122.679],['YXT','Terrace','BC',54.468,-128.576],['YPR','Prince Rupert','BC',54.287,-130.445],['YCD','Nanaimo','BC',49.055,-123.870],['YQQ','Comox','BC',49.711,-124.887],['YBL','Campbell River','BC',49.951,-125.271],['YXC','Cranbrook','BC',49.610,-115.782],['YYD','Smithers','BC',54.824,-127.183],
 ['YYC','Calgary','AB',51.113,-114.020],['YEG','Edmonton','AB',53.310,-113.580],['YMM','Fort McMurray','AB',56.653,-111.221],['YQU','Grande Prairie','AB',55.179,-118.885],['YQL','Lethbridge','AB',49.630,-112.800],['YXE','Saskatoon','SK',52.170,-106.700],['YQR','Regina','SK',50.432,-104.666],['YPA','Prince Albert','SK',53.214,-105.673],
 ['YWG','Winnipeg','MB',49.910,-97.239],['YBR','Brandon','MB',49.909,-99.951],['YTH','Thompson','MB',55.801,-97.865],
 ['YYZ','Toronto Pearson','ON',43.677,-79.625],['YTZ','Toronto Billy Bishop','ON',43.627,-79.396],['YHM','Hamilton','ON',43.174,-79.935],['YKF','Kitchener-Waterloo','ON',43.460,-80.379],['YXU','London','ON',43.033,-81.151],['YOW','Ottawa','ON',45.322,-75.669],['YQG','Windsor','ON',42.276,-82.956],['YQT','Thunder Bay','ON',48.371,-89.323],['YAM','Sault Ste. Marie','ON',46.485,-84.509],['YTS','Timmins','ON',48.569,-81.376],['YYB','North Bay','ON',46.364,-79.422],['YSB','Sudbury','ON',46.626,-80.797],['YQK','Kenora','ON',49.789,-94.363],
 ['YUL','Montréal Trudeau','QC',45.470,-73.740],['YQB','Québec City','QC',46.790,-71.394],['YBG','Saguenay Bagotville','QC',48.330,-70.997],['YGR','Îles de la Madeleine','QC',47.424,-61.778],['YVO','Val-d’Or','QC',48.053,-77.783],['YUY','Rouyn-Noranda','QC',48.206,-78.835],['YBC','Baie-Comeau','QC',49.132,-68.204],['YGP','Gaspé','QC',48.775,-64.479],
 ['YHZ','Halifax','NS',44.881,-63.509],['YQY','Sydney Cape Breton','NS',46.162,-60.047],['YYG','Charlottetown','PE',46.290,-63.121],['YQM','Moncton','NB',46.112,-64.678],['YFC','Fredericton','NB',45.869,-66.538],['YSJ','Saint John NB','NB',45.315,-65.890],['YYT','St. John’s NL','NL',47.619,-52.752],['YQX','Gander','NL',48.937,-54.568],['YDF','Deer Lake','NL',49.211,-57.391],['YYR','Goose Bay','NL',53.319,-60.426],
 ['YZF','Yellowknife','NT',62.463,-114.440],['YEV','Inuvik','NT',68.304,-133.483],['YXY','Whitehorse','YT',60.710,-135.067],['YFB','Iqaluit','NU',63.756,-68.555],['YRT','Rankin Inlet','NU',62.811,-92.115],['YCB','Cambridge Bay','NU',69.108,-105.138]
].map(([code,city,prov,lat,lon])=>({code,city,prov,lat,lon}));
const ARRIVAL_AIRPORTS={
 toronto:['YYZ','YTZ','YHM'],niagara:['YHM','YYZ','YTZ'],kingston:['YOW','YYZ'],ottawa:['YOW','YUL'],montreal:['YUL','YOW'],tremblant:['YUL','YOW'],quebec:['YQB','YUL'],charlevoix:['YQB','YUL'],
 halifax:['YHZ','YQY'],peggys:['YHZ'],lunenburg:['YHZ'],capebreton:['YQY','YHZ'],charlottetown:['YYG','YQM','YHZ'],cavendish:['YYG','YQM'],moncton:['YQM','YFC','YSJ'],fundy:['YQM','YSJ'],saintjohn:['YSJ','YQM','YFC'],stjohns:['YYT','YQX'],bonavista:['YQX','YYT']
};
const knownPlaces=[
 ['Vancouver','YVR','温哥华','burnaby','richmond bc','surrey','new westminster','coquitlam','langley bc','west vancouver','north vancouver','delta bc','chilliwack','hope bc','温哥华','本拿比','列治文','素里','北温'],
 ['Victoria','YYJ','维多利亚','saanich','sidney bc','victoria bc','维多利亚'],['Kelowna','YLW','基洛纳','vernon bc','peachland','west kelowna','基洛纳'],['Nanaimo','YCD','纳奈莫','parksville','qualicum beach','纳奈莫'],['Kamloops','YKA','坎卢普斯','merritt','sun peaks','甘露市'],['Prince George','YXS','乔治王子城','quesnel','prince george bc'],['Abbotsford','YXX','阿伯茨福德','mission bc','chilliwack bc'],
 ['Calgary','YYC','卡尔加里','banff','canmore','airdrie','cochrane ab','okotoks','lake louise','卡尔加里','班夫','坎莫尔','露易丝湖'],['Edmonton','YEG','埃德蒙顿','sherwood park','st albert','leduc','spruce grove','stony plain','fort saskatchewan','埃德蒙顿','爱民顿'],['Fort McMurray','YMM','麦克默里堡'],['Grande Prairie','YQU','大草原城'],['Lethbridge','YQL','莱斯布里奇'],['Saskatoon','YXE','萨斯卡通','萨省萨斯卡通','martensville','warmAn'],['Regina','YQR','里贾纳','雷吉纳','white city sk'],['Prince Albert','YPA','艾伯特王子城'],
 ['Winnipeg','YWG','温尼伯','st boniface','selkirk','steinbach','温尼伯'],['Brandon','YBR','布兰登'],['Thompson','YTH','汤普森'],
 ['Toronto','YYZ','多伦多','mississauga','brampton','oakville','vaughan','markham','richmond hill','scarborough','etobicoke','north york','pickering','ajax','oshawa','whitby','密西沙加','万锦','宾顿','多伦多'],['Hamilton','YHM','汉密尔顿','burlington on','grimsby on','niagara falls','st catharines','niagara on the lake','尼亚加拉瀑布','汉密尔顿'],['Kitchener','YKF','基奇纳','waterloo on','cambridge on','guelph','基奇纳','滑铁卢'],['London','YXU','伦敦安省','stratford on','st thomas on'],['Ottawa','YOW','渥太华','gatineau','kanata','nepean','orleans on','渥太华','加蒂诺'],['Windsor','YQG','温莎','essex on'],['Kingston','YOW','金斯顿','gananoque','brockville','napanee','金斯顿'],['Thunder Bay','YQT','桑德贝'],['Sudbury','YSB','萨德伯里'],['North Bay','YYB','北湾'],['Sault Ste Marie','YAM','苏圣玛丽'],['Timmins','YTS','蒂明斯'],
 ['Montréal','YUL','蒙特利尔','montreal','laval','longueuil','brossard','west island','蒙特利尔','满地可'],['Québec City','YQB','魁北克城','quebec city','lévis','levis','魁北克城'],['Saguenay','YBG','萨格奈','chicoutimi','jonquière'],['Tremblant','YUL','蒙特朗布朗','mont tremblant','saint jovite','laurentides','蒙特朗布朗'],['Charlevoix','YQB','夏洛瓦','baie saint paul','la malbaie','夏洛瓦'],
 ['Halifax','YHZ','哈利法克斯','dartmouth ns','bedford ns','sackville ns','peggys cove','lunenburg','mahone bay','truro ns','哈利法克斯','佩姬湾','卢嫩堡'],['Sydney','YQY','悉尼新斯科舍','cape breton','baddeck','ingonish','cheticamp','布雷顿角'],['Charlottetown','YYG','夏洛特敦','prince edward island','pei','cavendish','north rustico','cornwall pei','stratford pei','夏洛特敦','爱德华王子岛','卡文迪什'],['Moncton','YQM','蒙克顿','dieppe nb','riverview nb','hopewell rocks','fundy national park','蒙克顿','芬迪湾'],['Fredericton','YFC','弗雷德里克顿','oromocto','弗雷德里克顿'],['Saint John','YSJ','圣约翰nb','saint john','saint john nb','圣约翰','圣约翰新不伦瑞克'],['St. John’s','YYT','圣约翰斯','st johns','st. john’s','st. johns','st johns nl','圣约翰斯纽芬兰'],['Gander','YQX','甘德','bonavista','trinity nl','博纳维斯塔'],['Deer Lake','YDF','鹿湖','gros morne','corner brook','格罗斯莫恩'],['Yellowknife','YZF','黄刀镇','黄刀'],['Whitehorse','YXY','白马市','白马'],['Iqaluit','YFB','伊魁特','伊魁特']
];
const cityAliasMap=new Map();
function normalizeCAName(name){return String(name||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’'.·,/\\()\-]+/g,' ').replace(/\s+/g,' ').trim()}
for(const [city,code,...aliases] of knownPlaces){for(const alias of [city,...aliases])cityAliasMap.set(normalizeCAName(alias),code)}
for(const airport of CANADA_AIRPORTS){cityAliasMap.set(normalizeCAName(airport.code),airport.code);if(!cityAliasMap.has(normalizeCAName(airport.city)))cityAliasMap.set(normalizeCAName(airport.city),airport.code)}
const AIRPORT_BY_CODE=Object.fromEntries(CANADA_AIRPORTS.map(a=>[a.code,a]));
let resolvedOrigin=null,resolutionVersion=0,flightTypingTimer=null;
const node=id=>document.getElementById(id);
function shiftISODate(date,days){const value=new Date(date+'T12:00:00Z');if(!Number.isFinite(value.getTime()))return '';value.setUTCDate(value.getUTCDate()+days);return value.toISOString().slice(0,10)}
function formattedFlightDate(date){if(!date)return'请先选择日期';const [year,month,day]=date.split('-');return `${year}年${Number(month)}月${Number(day)}日`}
function dateToShort(date){if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return'';return date.slice(2).replaceAll('-','')}
function flightSearchURL(from,to,date){return `https://www.skyscanner.ca/transport/flights/${encodeURIComponent(String(from||'').toLowerCase())}/${encodeURIComponent(String(to||'').toLowerCase())}/${dateToShort(date)}/?adultsv2=1&cabinclass=economy&rtn=0`}
function googleFlightsSearch(){return 'https://www.google.com/travel/flights?hl=zh-CN&curr=CAD'}
function getAirport(code){return AIRPORT_BY_CODE[code]||{code,city:'自选机场',prov:'CA'}}
function simpleMatchCity(text){let key=normalizeCAName(text);if(cityAliasMap.has(key))return cityAliasMap.get(key);key=key.replace(/\b(canada|british columbia|alberta|saskatchewan|manitoba|ontario|quebec|nova scotia|new brunswick|newfoundland|labrador|prince edward island)\b/g,'').trim();if(cityAliasMap.has(key))return cityAliasMap.get(key);return null}
function distanceAirports(latitude,longitude){const rad=Math.PI/180;return CANADA_AIRPORTS.map(a=>{const dLat=(a.lat-latitude)*rad,dLon=(a.lon-longitude)*rad,v=Math.sin(dLat/2)**2+Math.cos(latitude*rad)*Math.cos(a.lat*rad)*Math.sin(dLon/2)**2;return {...a,km:12742*Math.asin(Math.min(1,Math.sqrt(v)))}}).sort((a,b)=>a.km-b.km)}
function chooseOriginAirport(){const choice=node('origin-airport')?.value||'auto';if(choice==='custom'){const custom=node('airport-code-custom')?.value.trim().toUpperCase()||'';return /^[A-Z]{3}$/.test(custom)?{code:custom,label:'手动填写机场'}:null}if(choice!=='auto')return {code:choice,label:'手动指定机场'};const entered=node('origin-city')?.value||'';const known=simpleMatchCity(entered);if(known)return {code:known,label:'城市匹配的常用机场'};if(resolvedOrigin?.name===normalizeCAName(entered))return {code:resolvedOrigin.airport,label:`地理位置推算候选机场 · 约 ${Math.round(resolvedOrigin.km)} 公里直线距离（不代表有班次）`};return null}
function originStatus(msg,kind='neutral'){const e=node('origin-status');if(e){e.textContent=msg;e.dataset.kind=kind}}
function updateOriginSummary(){const origin=node('origin-city')?.value.trim()||'',from=chooseOriginAirport();const hint=node('airport-hint');if(hint)hint.textContent=from?`候选 ${from.code}`:'需自行选机场';originStatus(from?`${origin} · ${from.code}（${from.label}）。实际可订航班与机场交通请另行核对。`:'未识别可乘机机场。城市输入仍有效；请从列表手动选择机场，或启用 Mapbox 地理编码获取附近机场候选。','warn');renderFlightSuggestions()}
async function locateAnyCanadianCity(){
 const field=node('origin-city'),value=field?.value.trim();if(!value)return;
 const detected=simpleMatchCity(value);if(detected){resolvedOrigin=null;updateOriginSummary();return}
 const token=typeof mapboxPublicToken==='function'?mapboxPublicToken():'';
 if(!token||!/^pk\./.test(token)){resolvedOrigin=null;updateOriginSummary();return}
 const version=++resolutionVersion;originStatus('正在根据 Mapbox 匹配加拿大城镇（仅在输入结束后查询）…');
 try{
  const url=`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(value)}&country=ca&types=place%2Clocality&limit=1&autocomplete=false&access_token=${encodeURIComponent(token)}`;
  const response=await fetch(url);if(!response.ok)throw new Error('Geocoding '+response.status);
  const data=await response.json();if(version!==resolutionVersion||normalizeCAName(value)!==normalizeCAName(field.value))return;
  const coords=data.features?.[0]?.geometry?.coordinates;if(!coords)throw new Error('找不到匹配的加拿大城镇');
  const airport=distanceAirports(coords[1],coords[0])[0];resolvedOrigin={name:normalizeCAName(value),airport:airport.code,km:airport.km};updateOriginSummary();
 }catch(error){if(version!==resolutionVersion)return;resolvedOrigin=null;updateOriginSummary();originStatus('自动地理定位不可用；请手动选择机场。'+String(error.message||''),'warn')}
}
function flightCard({label,from,to,date,title,description,annotation,originFreeText}){
 const depart=from||'自选',arrival=to||'自选';const url=from&&to?flightSearchURL(from,to,date):googleFlightsSearch();
 return `<article class="flight-card"><span class="flight-label">${esc(label)}</span><div class="flight-airports"><b>${esc(depart)}</b><span>✈</span><b>${esc(arrival)}</b></div><h3>${esc(title)}</h3><p>${esc(description)}</p><small>${esc(formattedFlightDate(date))} · ${esc(annotation||'请在预订平台核实班次和价格')}</small>${originFreeText?`<small>出发城市：${esc(originFreeText)}</small>`:''}<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${from&&to?'比较这段行程的航班 ↗':'打开 Google Flights 选择机场 ↗'}</a></article>`
}
function renderFlightSuggestions(){
 const grid=node('flight-grid'),overview=node('flight-overview');if(!grid||!overview)return;
 const plan=typeof state!=='undefined'?state.plan:null;
 if(!plan?.route?.length){overview.innerHTML='<h3>先生成你的旅行路线</h3>';grid.innerHTML='<div class="flight-error">填写加拿大出发城市、出发日期和加东目的地，航班建议将在这里出现。</div>';return}
 const originName=node('origin-city')?.value.trim()||plan.origin,airport=chooseOriginAirport(),start=plan.route[0],end=plan.route.at(-1),date=node('departure-date')?.value||plan.departureDate;
 if(!date||!/^\d{4}-\d{2}-\d{2}$/.test(date)){grid.innerHTML='<div class="flight-error">请先选择旅行出发日期。</div>';return}
 const returnDate=shiftISODate(date,plan.days-1),arrivalCodes=ARRIVAL_AIRPORTS[start]||['YYZ'],returnCodes=ARRIVAL_AIRPORTS[end]||['YYZ'];
 const primary=arrivalCodes[0],alternative=arrivalCodes.find(code=>code!==primary),origCode=airport?.code||null,endingAirport=returnCodes[0];
 const timePreference=({any:'不限时段',morning:'偏好早间航班',afternoon:'偏好下午航班',evening:'偏好晚间航班'})[node('flight-time-pref')?.value||'any'];
 const selectedOrigin=origCode?`${origCode} · ${getAirport(origCode).city}`:`${originName} · 待指定起飞机场`;
 overview.innerHTML=`<div><div class="flight-hero-kicker">DEPARTURE / RECOMMENDED AIRPORTS</div><h3>${esc(originName)} → ${esc(CITIES[start].name)}</h3><p>旅行 ${esc(date)} 开始 · ${plan.days} 天 · 预计 ${esc(returnDate)} 结束 · ${esc(CITIES[end].name)} 为最后一站 · ${esc(timePreference)}</p></div><div class="flight-route-tag">${esc(selectedOrigin)} → ${esc(primary)}</div>`;
 const sameAirport=origCode===primary;
 const cards=[];
 if(sameAirport){cards.push(flightCard({label:'01 / 同一机场地区',from:origCode,to:primary,date,title:'首站附近：不一定需要乘飞机',description:'起飞机场与建议抵达机场相同，可以优先考虑当地交通、租车或火车；如仍要飞往其他机场请使用下方比价平台。',annotation:'请核实首站到实际住宿地的交通',originFreeText:originName}));}
 else cards.push(flightCard({label:'01 / 推荐抵达',from:origCode,to:primary,date,title:`优先查询 ${getAirport(primary).city}（${primary}）`,description:`根据你选择的首站 ${CITIES[start].name} 推荐的常用抵达机场。${origCode?'可查询是否有合理的直飞或转机选项。':'未能定位你的起飞机场，请先手动选定机场或在 Google Flights 查询。'} 机场至市区还需安排交通。`,annotation:airport?.label||'起飞机场需人工确认',originFreeText:originName}));
 if(alternative){cards.push(flightCard({label:'02 / 备选机场',from:origCode,to:alternative,date,title:`比较 ${getAirport(alternative).city}（${alternative}）`,description:`如果第一机场日期或票价不合适，可以比较其他抵达机场。不过 ${alternative} 与 ${CITIES[start].name} 并非同一地点，需额外估算地面接驳时间和费用。`,annotation:'并非保证更便宜或更便利'}));}
 else cards.push(flightCard({label:'02 / 地面接驳',from:origCode,to:primary,date,title:'抵达后怎么前往首站？',description:`大部分加东海滨城镇没有独立的大型定期航班机场，建议查询抵达 ${primary} 后的租车、公共交通或预订接送。`,annotation:'机场与目的地之间可能需长途接驳'}));
 cards.push(flightCard({label:'03 / 返程或开口程',from:endingAirport,to:origCode,date:returnDate,title:`从 ${CITIES[end].name} 附近返程`,description:`如果行程从 ${CITIES[start].name} 开始，在 ${CITIES[end].name} 结束，优先比较「去程飞入 ${primary} + 返程从 ${endingAirport} 飞回」的多城市 / 开口程机票。并检查异地还车费用。`,annotation:'返程日期按旅行末日推算，建议预留航班缓冲'}));
 grid.innerHTML=cards.join('');
}
function initFlightControls(){
 const city=node('origin-city'),airport=node('origin-airport'),date=node('departure-date');if(!city||!airport||!date)return;
 // Populate only explicitly supported airport choices; unknown city names still remain valid input.
 airport.innerHTML='<option value="auto">自动推荐机场</option>'+CANADA_AIRPORTS.map(a=>`<option value="${a.code}">${a.code} · ${a.city} · ${a.prov}</option>`).join('')+'<option value="custom">其他加拿大机场（输入代码）</option>';
 airport.insertAdjacentHTML('afterend','<input id="airport-code-custom" type="text" inputmode="latin" maxlength="3" placeholder="3 字母机场代码，如 YEG" aria-label="手动输入加拿大机场代码" hidden/>');
 const datalist=node('ca-departure-cities');if(datalist)datalist.innerHTML=knownPlaces.map(([city,code])=>`<option value="${esc(city)}">${code}</option>`).join('');
 const d=new Date();d.setDate(d.getDate()+21);const today=new Date(),local=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');const preset=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');date.min=local;if(!date.value)date.value=preset;
 airport.addEventListener('change',()=>{node('airport-code-custom').hidden=airport.value!=='custom';updateOriginSummary()});
 node('airport-code-custom').addEventListener('input',updateOriginSummary);
 city.addEventListener('input',()=>{resolutionVersion++;resolvedOrigin=null;clearTimeout(flightTypingTimer);flightTypingTimer=setTimeout(()=>{updateOriginSummary();locateAnyCanadianCity()},700)});
 city.addEventListener('blur',()=>{clearTimeout(flightTypingTimer);updateOriginSummary();locateAnyCanadianCity()});
 date.addEventListener('change',()=>{if(state.plan)generate();else renderFlightSuggestions()});
 if(node('flight-time-pref'))node('flight-time-pref').addEventListener('change',renderFlightSuggestions);
 if(node('start-city'))node('start-city').addEventListener('change',()=>{if(state.plan)generate()});
 updateOriginSummary();
 // app.js registers DOMContentLoaded before this module and can initially generate before date defaults.
 if(typeof generate==='function'&&(!state.plan||!state.plan.departureDate))generate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initFlightControls);else initFlightControls();
