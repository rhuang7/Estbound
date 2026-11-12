'use strict';

// EASTBOUND is a fully client-side rule-based trip planner. No personal information is sent anywhere.
const photo = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const CITIES = {
  toronto: { name:'多伦多', en:'Toronto', province:'安大略省', type:'city', label:'摩登城市', intro:'天际线与多元街区，现代都市里的无限可能。', blurb:'在安大略湖边看日落，漫步热闹的市集与街区，站上城市的天空之巅。', photo:photo('photo-1632780613344-2ff5659af895'), url:'https://www.destinationontario.com/en-ca/cities-towns/toronto', places:['加拿大国家电视塔 CN Tower','圣劳伦斯市场','多伦多群岛','皇家安大略博物馆'], min:'2–4 天', search:'Toronto Ontario Canada', weights:{classic:5,nature:2,culture:5,food:4}, days:[
    {tag:'城市初印象',interest:'classic',title:'从湖滨，走到城市之巅',stops:[['上午','加拿大国家电视塔 CN Tower','俯瞰城市与安大略湖，建议提前预约观景时段'],['下午','海滨长廊 Harbourfront','沿湖轻松散步，在咖啡馆短暂停留'],['傍晚','古酿酒厂区 Distillery District','逛独立商店与砖墙街巷，享用晚餐']]},
    {tag:'艺术与生活',interest:'culture',title:'像当地人一样逛多伦多',stops:[['上午','皇家安大略博物馆 ROM','探索自然历史和艺术展览'],['下午','肯辛顿市场 Kensington Market','体验多元文化、街头小店与美食'],['傍晚','Queen Street West','在创意街区闲逛、找一家喜欢的餐厅']]},
    {tag:'湖畔慢时光',interest:'nature',title:'把一天交给湖风',stops:[['上午','多伦多群岛 Toronto Islands','搭轮渡看湖面，留意季节和船班'],['下午','圣劳伦斯市场 St. Lawrence Market','以小吃和农产品开启美食探索'],['傍晚','海港日落','回到湖畔，拍下天际线的金色时刻']]},
    {tag:'城市美食线',interest:'food',title:'用味蕾认识多伦多',stops:[['上午','圣劳伦斯市场','从当地早餐和咖啡开始'],['下午','唐人街与肯辛顿市场','探索不同文化的街头美味'],['傍晚','小意大利或 Ossington','选择心仪的餐厅，慢慢享用晚餐']]},
    {tag:'城市漫游',interest:'classic',title:'老建筑与新生活',stops:[['上午','卡萨罗马城堡 Casa Loma','探访历史建筑与园林'],['下午','安大略美术馆 AGO','在艺术作品间寻找惊喜'],['傍晚','市中心夜景','漫步城市街道，结束一天的探索']]}
  ]},
  niagara: { name:'尼亚加拉瀑布',en:'Niagara Falls',province:'安大略省',type:'nature',label:'自然奇观',intro:'听瀑布轰鸣，站在大自然的磅礴面前。',blurb:'从马蹄瀑布到尼亚加拉湖滨小镇，让壮阔的自然与静谧的葡萄园形成反差。',photo:photo('photo-1694617711278-03862103e39f'),url:'https://www.destinationontario.com/en-ca/regions/niagara-region',places:['加拿大马蹄瀑布','瀑布景观步道','Niagara-on-the-Lake','尼亚加拉公园大道'],min:'1–2 天',search:'Niagara Falls Ontario Canada',weights:{classic:4,nature:5,culture:2,food:3},days:[
    {tag:'壮观瀑布',interest:'classic',title:'站在瀑布的磅礴面前',stops:[['上午','马蹄瀑布 Horseshoe Falls','沿加拿大侧观景步道欣赏瀑布'],['下午','瀑布区体验','温暖月份可查询游船；寒冷季节改为观景台或室内项目'],['傍晚','瀑布夜景','看夜间灯光，天气允许时在河岸散步']]},
    {tag:'河谷与小镇',interest:'nature',title:'沿着尼亚加拉河慢行',stops:[['上午','Niagara Parkway','沿河谷观光，在合适地点停车欣赏景色'],['下午','Niagara-on-the-Lake 小镇','走访古朴街道、店铺与咖啡馆'],['傍晚','湖畔散步','在安大略湖边放慢脚步']]},
    {tag:'风味探索',interest:'food',title:'瀑布之外的田园滋味',stops:[['上午','尼亚加拉河公园','在宁静环境中感受自然'],['下午','Niagara-on-the-Lake','探索当地餐厅、烘焙坊和特色商店'],['傍晚','河谷夕照','沿河畔小径看夕阳']]}
  ]},
  kingston: {name:'金斯顿 · 千岛湖',en:'Kingston & 1000 Islands',province:'安大略省',type:'slow',label:'河畔小镇',intro:'圣劳伦斯河上的千座小岛，每一座都有故事。',blurb:'以金斯顿为中转，在古老的滨水街区散步；温暖季节从 Gananoque 探索千岛湖。',photo:photo('photo-1730664788559-f1e2fe0fe0ec'),url:'https://www.destinationontario.com/en-ca/travel-resources/best-stops-toronto-ottawa-round-trip-guide',places:['金斯顿滨水区','Fort Henry','Gananoque','千岛湖游船（季节性）'],min:'1–2 天',search:'Kingston Ontario Canada',weights:{classic:3,nature:4,culture:3,food:3},days:[
    {tag:'河岸古城',interest:'classic',title:'走进圣劳伦斯河畔',stops:[['上午','金斯顿市中心','沿历史建筑与湖岸街道漫步'],['下午','Fort Henry 附近','了解城市历史；具体参观以开放安排为准'],['傍晚','金斯顿滨水区','在湖边观景或享受晚餐']]},
    {tag:'群岛探索',interest:'nature',title:'穿过千岛湖的蓝色水域',stops:[['上午','Gananoque 小镇','散步、喝咖啡，欣赏河景'],['下午','千岛湖游船（季节性）','温暖季节查船班；冬季可改为陆上观景'],['傍晚','圣劳伦斯河畔','享受宁静河岸风光']]}
  ]},
  ottawa: {name:'渥太华',en:'Ottawa',province:'安大略省',type:'city',label:'首都人文',intro:'国会山、运河与博物馆，优雅又恰到好处。',blurb:'沿里多运河散步，在国会山感受首都气质，走进加拿大的艺术与历史。',photo:photo('photo-1578973615934-8d9cdb0792b4'),url:'https://ottawatourism.ca/en',places:['国会山 Parliament Hill','里多运河','拜沃德市场','加拿大国家美术馆'],min:'1–3 天',search:'Ottawa Ontario Canada',weights:{classic:4,nature:3,culture:5,food:3},days:[
    {tag:'首都地标',interest:'classic',title:'国会山与运河之日',stops:[['上午','国会山 Parliament Hill','参观外部建筑与周边广场；内部开放需另查'],['下午','里多运河 Rideau Canal','沿水岸步行，感受首都城市景观'],['傍晚','拜沃德市场 ByWard Market','在热闹市集区享用晚餐']]},
    {tag:'博物馆漫游',interest:'culture',title:'发现加拿大的艺术与故事',stops:[['上午','加拿大国家美术馆','欣赏加拿大及国际艺术'],['下午','加拿大历史博物馆','跨河进入 Gatineau，探索本地历史'],['傍晚','渥太华河岸','看夕阳洒在两岸建筑上']]},
    {tag:'自然与生活',interest:'nature',title:'城市边缘的慢时光',stops:[['上午','Gatineau Park 周边','根据季节选择轻徒步或赏叶路线'],['下午','Downtown 咖啡街区','自由探索小店、书店与特色街巷'],['傍晚','里多运河夜景','用轻松散步为一天收尾']]}
  ]},
  montreal: {name:'蒙特利尔',en:'Montréal',province:'魁北克省',type:'city',label:'法式生活',intro:'石板路、咖啡香与创意街区，法式浪漫刚刚好。',blurb:'从老城教堂到皇家山，再到热闹市集，把艺术和日常都装进行李。',photo:photo('photo-1761920274681-18ba06a25d7c'),url:'https://www.mtl.org/en/experience/musts-first-time-visitors',places:['蒙特利尔老城','圣母大教堂','皇家山公园','Jean-Talon 市场'],min:'2–4 天',search:'Montréal Quebec Canada',weights:{classic:5,nature:3,culture:5,food:5},days:[
    {tag:'老城巡礼',interest:'classic',title:'穿过法式老城的石板路',stops:[['上午','蒙特利尔老城 Old Montréal','沿历史街道和广场漫步'],['下午','圣母大教堂 Notre-Dame Basilica','欣赏教堂建筑，入内需查询票务'],['傍晚','老港 Old Port','沿河岸散步，留意季节性活动']]},
    {tag:'山城艺术',interest:'culture',title:'从皇家山，到创意街区',stops:[['上午','皇家山公园 Mount Royal','前往观景点俯瞰城市'],['下午','Plateau Mont-Royal','逛街头艺术、书店与独立商铺'],['傍晚','Mile End','尝试当地咖啡店与特色餐厅']]},
    {tag:'美食生活',interest:'food',title:'吃进一座城市的日常',stops:[['上午','Jean-Talon Market','感受本地食材与市集氛围'],['下午','Little Italy','穿行街巷，品尝特色小吃'],['傍晚','Lachine Canal 周边','散步或在运河附近用餐']]},
    {tag:'公园与文化',interest:'nature',title:'把一天留给自然与展览',stops:[['上午','蒙特利尔植物园','根据花期与季节欣赏园景'],['下午','Biodôme 生态馆','探索不同生态环境的展陈'],['傍晚','奥林匹克公园周边','在街区散步或休息']]},
    {tag:'街区精选',interest:'culture',title:'自由探索蒙特利尔',stops:[['上午','美术馆与市中心','选择感兴趣的展览'],['下午','圣劳伦大道 Saint-Laurent','寻找独立店铺与本地设计'],['傍晚','老城夜色','在灯光里再走一遍石板路']]}
  ]},
  tremblant: {name:'翠湖山庄',en:'Mont-Tremblant',province:'魁北克省',type:'nature',label:'四季山野',intro:'秋日枫叶、冬日雪场，每一季都有新的颜色。',blurb:'在彩色步行村落喝咖啡，走进湖泊与山林，把生活节奏慢下来。',photo:photo('photo-1693155381071-28e1bccbb820'),url:'https://www.bonjourquebec.com/en-ca/where-to-go/regions-of-quebec/laurentians/mont-tremblant',places:['Tremblant 步行村','翠湖湖畔','蒙特朗布朗国家公园','山地观景'],min:'1–3 天',search:'Mont Tremblant Quebec Canada',weights:{classic:3,nature:5,culture:2,food:3},days:[
    {tag:'山间慢生活',interest:'nature',title:'把节奏交给湖与山',stops:[['上午','Tremblant 步行村','漫步色彩缤纷的山间小镇'],['下午','山地观景 / 季节性缆车','根据天气与运营情况决定项目'],['傍晚','翠湖湖畔','安静看湖，享受山间晚餐']]},
    {tag:'森林深呼吸',interest:'nature',title:'在森林里找回松弛感',stops:[['上午','蒙特朗布朗国家公园','选择适合体力和季节的路径'],['下午','湖泊与林地','轻徒步或自然摄影，遵守公园公告'],['傍晚','山间温泉或村落','放松休息，提前确认预订']]},
    {tag:'慢游小镇',interest:'food',title:'山间咖啡与四季风景',stops:[['上午','步行村咖啡馆','用早餐开启慢节奏的一天'],['下午','村落小店与湖景','根据天气灵活调整活动'],['傍晚','山地餐厅','品尝当地食物，享受夜晚']]}
  ]},
  quebec: {name:'魁北克城',en:'Québec City',province:'魁北克省',type:'city',label:'欧洲古城',intro:'石砌老城与尖顶城堡，像走进电影里的街道。',blurb:'从芳堤娜城堡走到小尚普兰街，在古城里用脚步丈量四百年的故事。',photo:photo('photo-1695126016000-0567810ecdaa'),url:'https://www.quebec-cite.com/en/what-to-do-quebec-city/top-things-to-do',places:['芳堤娜城堡','小尚普兰街','都芬林露台','蒙莫朗西瀑布'],min:'2–4 天',search:'Quebec City Quebec Canada',weights:{classic:5,nature:3,culture:5,food:4},days:[
    {tag:'老城童话',interest:'classic',title:'穿越古城的石板街',stops:[['上午','芳堤娜城堡 Château Frontenac','从城堡外观和历史街区开始探索'],['下午','都芬林露台 & 小尚普兰街','俯瞰圣劳伦斯河，漫步古老街巷'],['傍晚','皇家广场 Place Royale','在老城灯光下享用晚餐']]},
    {tag:'瀑布与乡野',interest:'nature',title:'山水与乡村的一日',stops:[['上午','蒙莫朗西瀑布','欣赏近郊瀑布，留意季节运营项目'],['下午','奥尔良岛 Île d’Orléans','自驾探索田园，公交出行建议改为市内活动'],['傍晚','老城夜景','沿河岸和城墙享受夜色']]},
    {tag:'历史与艺术',interest:'culture',title:'走进古城的细节',stops:[['上午','亚伯拉罕平原','步行欣赏城市公园和历史景观'],['下午','魁北克要塞 Citadelle','查询可参加的导览和开放时段'],['傍晚','圣让街 Saint-Jean','寻找当地餐厅与特色店铺']]},
    {tag:'古城生活',interest:'food',title:'在老街寻找法语区的味道',stops:[['上午','老城面包店','以咖啡与烘焙开启一天'],['下午','小尚普兰街区','在特色店与艺术画廊间慢慢逛'],['傍晚','当地魁北克餐厅','选择经典料理，慢慢享受一餐']]},
    {tag:'山水漫游',interest:'nature',title:'城市之外的小冒险',stops:[['上午','Jacques-Cartier 国家公园','根据季节选择安全适合的徒步路线'],['下午','公园河谷景观','以观景和自然体验为主'],['傍晚','返回魁北克城','结束旅程，慢慢吃一顿晚餐']]}
  ]},
  charlevoix: {name:'夏洛瓦',en:'Charlevoix',province:'魁北克省',type:'slow',label:'山海风光',intro:'山与圣劳伦斯河相遇，安静得恰到好处。',blurb:'沿着圣劳伦斯河寻找艺术小镇、山野观景和秋日浓烈的枫叶颜色。',photo:photo('photo-1722004760950-107129360877'),url:'https://www.bonjourquebec.com/en/where-to-go',places:['Baie-Saint-Paul 小镇','圣劳伦斯河沿岸','Route du Fleuve','Grands-Jardins 国家公园'],min:'1–3 天',search:'Baie-Saint-Paul Quebec Canada',weights:{classic:2,nature:5,culture:3,food:4},days:[
    {tag:'河岸小镇',interest:'classic',title:'向河边，走进慢生活',stops:[['上午','Baie-Saint-Paul','探索艺术小镇的街道与画廊'],['下午','圣劳伦斯河沿岸','选择安全观景点欣赏山河'],['傍晚','小镇美食','品尝地方食材与餐饮']]},
    {tag:'山野风景',interest:'nature',title:'追一场山野的风',stops:[['上午','Grands-Jardins 国家公园','按照季节和开放信息选择步道'],['下午','Charlevoix 山地观景','放慢节奏，欣赏森林与地形'],['傍晚','Baie-Saint-Paul','回到小镇休息']]}
  ]}
};

Object.assign(CITIES, ATLANTIC_CITIES);

// Reference self-driving time estimates (not traffic-aware). Some itineraries require changing route mode.
const DRIVE = {
  'toronto-niagara':'约 1.5–2 小时','niagara-kingston':'约 4–4.5 小时','toronto-kingston':'约 2.5–3 小时',
  'kingston-ottawa':'约 2 小时','ottawa-montreal':'约 2–2.5 小时','montreal-quebec':'约 2.5–3 小时',
  'montreal-tremblant':'约 1.5–2 小时','ottawa-tremblant':'约 2–2.5 小时',
  'tremblant-quebec':'约 3.5–4.5 小时','quebec-charlevoix':'约 1–1.5 小时（至 Baie-Saint-Paul）',
  'quebec-montreal':'约 2.5–3 小时','charlevoix-quebec':'约 1–1.5 小时',
  'quebec-ottawa':'约 4.5–5.5 小时','ottawa-kingston':'约 2 小时','montreal-ottawa':'约 2–2.5 小时',
  'ottawa-toronto':'约 4.5–5.5 小时','kingston-toronto':'约 2.5–3 小时',
  'tremblant-montreal':'约 1.5–2 小时','tremblant-ottawa':'约 2–2.5 小时',
  'niagara-toronto':'约 1.5–2 小时','toronto-ottawa':'约 4.5–5.5 小时'
};
const order = ['toronto','niagara','kingston','ottawa','montreal','tremblant','quebec','charlevoix'];
const MODE = {classic:'经典必游',nature:'自然风景',culture:'人文艺术',food:'美食慢游'};
const START_ROUTES = {
  toronto: [['toronto'],['toronto','niagara'],['toronto','niagara','kingston','ottawa'],['toronto','niagara','kingston','ottawa','montreal'],['toronto','niagara','kingston','ottawa','montreal','quebec'],['toronto','niagara','kingston','ottawa','montreal','tremblant','quebec'],['toronto','niagara','kingston','ottawa','montreal','tremblant','quebec','charlevoix']],
  montreal:[['montreal'],['montreal','quebec'],['montreal','tremblant','quebec'],['montreal','tremblant','quebec','charlevoix'],['montreal','ottawa','tremblant','quebec','charlevoix'],['montreal','ottawa','tremblant','quebec','charlevoix']],
  ottawa:[['ottawa'],['ottawa','montreal'],['ottawa','montreal','quebec'],['ottawa','tremblant','montreal','quebec','charlevoix'],['ottawa','tremblant','montreal','quebec','charlevoix']],
  quebec:[['quebec'],['quebec','charlevoix'],['quebec','charlevoix','montreal'],['quebec','charlevoix','montreal','tremblant','ottawa'],['quebec','charlevoix','montreal','tremblant','ottawa','kingston','toronto','niagara']]
};
const state = {days:7,start:'toronto',interest:'classic',pace:'relaxed',travel:'car',activeDay:0,plan:null,all:false, selected:new Set()};
const el = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function safePhoto(id,width=900){return photo(id,width)}

// A separate collapse control stays available immediately after the first expansion.
// The [hidden] CSS rule ensures it is truly hidden when no expansion is active.
function initialCollectionCount(){
  if(window.matchMedia('(max-width:600px)').matches)return 2;
  if(window.matchMedia('(max-width:1100px)').matches)return 4;
  return 6;
}
// Never leave an incomplete second row on initial render, even after filtering.
function initialDisplayCount(total){
  const base=initialCollectionCount(),columns=base/2;
  return total>=base?base:total>=columns?columns:total;
}
function displayLimit(requested,total){
  return requested===initialCollectionCount()?initialDisplayCount(total):Math.min(requested,total);
}
function updateCollectionControls(prefix,visible,total,label){
  const more=el(prefix+'-more'),collapse=el(prefix+'-collapse');
  if(more){
    more.hidden=visible>=total;
    more.textContent=`显示更多${label}（${Math.min(visible,total)} / ${total}） ↓`;
    more.setAttribute('aria-expanded',String(visible>initialDisplayCount(total)));
  }
  if(collapse){
    collapse.hidden=visible<=initialDisplayCount(total);
    collapse.setAttribute('aria-expanded',String(visible>initialDisplayCount(total)));
  }
}
function returnToSection(id){
  const section=el(id);if(!section)return;
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
}
let destinationVisible=initialCollectionCount(),activeDestinationFilter='all';
function renderDestinations(filter='all') {
  const list=Object.entries(CITIES).filter(([key,c])=>filter==='all'||c.type===filter||(filter==='atlantic'&&REGIONS.slice(2).some(r=>r.cities.includes(key))));
  el('destination-grid').innerHTML=list.slice(0,displayLimit(destinationVisible,list.length)).map(([key,c],idx)=>`<article class="destination-card" style="animation-delay:${idx*25}ms"><div class="card-image-wrap"><img class="card-image" src="${c.photo}" alt="${esc(c.name)}旅行风光" loading="lazy" onerror="this.style.opacity=0" /><span class="card-index">${String(idx+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}</span><span class="card-category">${esc(c.label)}</span></div><div class="card-body"><span class="card-english">${esc(c.en)}</span><h3>${esc(c.name)}</h3><p>${esc(c.intro)}</p><div class="card-foot"><span>建议 ${esc(c.min)}</span><button type="button" data-detail="${key}" aria-label="查看${esc(c.name)}亮点">探索亮点 <span aria-hidden="true">↗</span></button></div></div></article>`).join('');
  updateCollectionControls('destinations',displayLimit(destinationVisible,list.length),list.length,'目的地');
}
function googleSearch(query){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
function detailDestination(key){
  const c=CITIES[key],guide=DESTINATION_GUIDES[key];if(!c)return;
  const attractionRows=c.places.map(name=>`<article class="modal-highlight"><div class="highlight-head"><h4>${esc(name)}</h4><a class="highlight-map" href="${googleSearch(name+' '+c.search)}" target="_blank" rel="noopener noreferrer">地图 ↗</a></div>${galleryHTML(name,key,true)}${spotReadingHTML(key,name)}</article>`).join('');
  const extras=EXTRA_SPOTS[key]||[];
  const extraRows=extras.map(([name,kind,time,description,tip])=>`<article class="modal-spot"><div class="modal-spot-top"><span>${esc(({nature:'自然户外',culture:'文化艺术',food:'美食市集',slow:'小镇慢游',family:'亲子体验',classic:'经典必游'})[kind]||kind)}</span><span>${esc(time)}</span></div><h4>${esc(name)}</h4><p>${esc(description)}</p>${galleryHTML(name,key,true)}${spotReadingHTML(key,name,description,tip)}<div class="modal-spot-foot"><small>${esc(tip)}</small><a href="${googleSearch(name+' '+c.search)}" target="_blank" rel="noopener noreferrer">地点导航 ↗</a></div></article>`).join('');
  const shops=(SHOPPING_GUIDES[key]||[]).map(([name,category,find,description])=>`<div class="modal-shop"><div><strong>${esc(name)}</strong><p>${esc(category)} · ${esc(find)}。${esc(description)}</p></div><a href="${googleSearch(name+' '+c.search)}" target="_blank" rel="noopener noreferrer">地图 ↗</a></div>`).join('');
  const highlights=c.days.map((d,i)=>`<details class="guide-play" ${i===0?'open':''}><summary>${esc(d.tag)} · ${esc(d.title)} <span>展开 / 收起</span></summary><div>${d.stops.map(s=>`<p><b>${esc(s[0])} · ${esc(s[1])}</b><br>${esc(s[2])}</p>`).join('')}</div></details>`).join('');
  el('modal-content').innerHTML=`<img class="modal-hero" src="${c.photo}" onerror="this.style.opacity=0" alt="${esc(c.name)}旅行风光"><div class="modal-body"><div class="eyebrow">DISCOVER / ${esc(c.en.toUpperCase())}</div><h2 id="modal-title">${esc(c.name)}</h2><p>${esc(c.blurb)}</p>${typeof DESTINATION_EXTRA!=='undefined'&&DESTINATION_EXTRA[key]?`<div class="destination-extra"><div><span>WHAT TO KNOW</span><strong>旅行季节</strong><p>${esc(DESTINATION_EXTRA[key].season)}</p></div><div><span>LOCAL TIP</span><strong>深度体验</strong><p>${esc(DESTINATION_EXTRA[key].experience)}</p></div><div><span>BEFORE YOU GO</span><strong>预订与交通</strong><p>${esc(DESTINATION_EXTRA[key].transport)}</p></div></div>`:''}<div class="guide-section"><h3>精选景点 <span>${c.places.length} 个旅行亮点 · 每处至少 3 张图片</span></h3><div class="attraction-links">${attractionRows}</div></div><div class="guide-section"><h3>新增深度景点 <span>${extras.length} 个精选地点 · 3 图画廊与游览提示</span></h3><div class="modal-extra-grid">${extraRows}</div></div><div class="guide-section"><h3>本地餐厅推荐 <span>精选真实地点 · 非实时预订</span></h3>${cityRestaurantHTML(key)}</div><div class="guide-section"><h3>城市评价与游记阅读 <span>短原文摘录 + 外部来源</span></h3>${cityReadingHTML(key)}</div><div class="guide-section"><h3>购物街与特色伴手礼</h3><div class="modal-shopping-list">${shops}</div></div><div class="guide-section"><h3>推荐玩法 <span>包含景点介绍与时间安排</span></h3>${highlights}</div><div class="guide-section"><h3>出行贴士</h3><div class="guide-info-grid"><div><strong>⌂ 住哪里</strong><p>${esc(guide.stay)}</p></div><div><strong>◒ 吃什么</strong><p>${esc(guide.eat)}</p></div><div><strong>↗ 如何到达</strong><p>${esc(guide.access)}</p></div><div><strong>↗ 当地交通</strong><p>${esc(guide.local)}</p></div></div></div><div class="modal-actions"><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">官方目的地参考 ↗</a><a href="${googleSearch('hotels near '+c.search)}" target="_blank" rel="noopener noreferrer">搜索当地酒店 ↗</a><button type="button" class="btn btn-dark" id="modal-plan" style="border:0">加入我的行程 ↗</button></div></div>`;
  const dialog=el('destination-modal');if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
  activateGalleries(el('modal-content'));
  el('modal-plan').onclick=()=>{window.location.href=`planner.html?city=${encodeURIComponent(key)}#planner`;};
}
function closeModal(){const d=el('destination-modal');if(d.open && d.close)d.close();else d.removeAttribute('open')}
function renderCityPicker(){
  el('city-picker').innerHTML=REGIONS.map(r=>`<fieldset class="city-region"><legend>${esc(r.name)}</legend><div class="city-options">${r.cities.map(key=>`<label class="city-option ${state.selected.has(key)?'checked':''}"><input type="checkbox" data-city="${key}" ${state.selected.has(key)?'checked':''}><span>${esc(CITIES[key].name)}</span></label>`).join('')}</div></fieldset>`).join('');
  el('selected-count').textContent=state.selected.size?`已选择 ${state.selected.size} 站`:'智能推荐模式';
}
function setPreset(key){
  const preset={central:['toronto','niagara','kingston','ottawa','montreal','quebec'],atlantic:['halifax','peggys','lunenburg','moncton','charlottetown','cavendish','fundy'],newfoundland:['stjohns','bonavista'],clear:[]};
  state.selected=new Set(preset[key]||[]);renderCityPicker();el('planner-error').hidden=true;generate();
}
// Distance is used only for heuristic ordering, never as a promised road mileage or travel time.
function geoKm(a,b){const p=GPS[a],q=GPS[b];if(!p||!q)return 9999;const r=Math.PI/180,x=(q[0]-p[0])*r,y=(q[1]-p[1])*r;const h=Math.sin(x/2)**2+Math.cos(p[0]*r)*Math.cos(q[0]*r)*Math.sin(y/2)**2;return 12742*Math.asin(Math.min(1,Math.sqrt(h)))}
function isNL(k){return k==='stjohns'||k==='bonavista'}
function travelCost(a,b){if(a===b)return 0;return geoKm(a,b)+(isNL(a)!==isNL(b)?950:0)}
function orderedSelected(start,selected){
 const remaining=[...selected],route=[];let previous=start;
 if(remaining.includes(start)){route.push(start);remaining.splice(remaining.indexOf(start),1)}
 while(remaining.length){remaining.sort((a,b)=>travelCost(previous,a)-travelCost(previous,b));const next=remaining.shift();route.push(next);previous=next}
 // Locally improve a near-neighbour route while keeping the chosen start fixed if selected.
 const dist=r=>r.reduce((sum,v,i)=>sum+travelCost(i?r[i-1]:start,v),0);
 for(let pass=0;pass<3;pass++)for(let i=route[0]===start?1:0;i<route.length-1;i++)for(let j=i+1;j<route.length;j++){
   const changed=[...route.slice(0,i),...route.slice(i,j+1).reverse(),...route.slice(j+1)];
   if(dist(changed)+.1<dist(route))route.splice(0,route.length,...changed);
 }
 return route;
}
function chooseRoute(days,start,pace,travel){
 if(state.selected.size)return orderedSelected(start,state.selected);
 if(START_ROUTES[start]){
   const compact=pace==='full';let thresholds;
   if(start==='toronto')thresholds=compact?[1,3,5,7,9,13,17]:[1,4,7,10,13,17,20];
   else if(start==='montreal')thresholds=compact?[1,3,5,7,11,16]:[1,4,7,10,15,19];
   else if(start==='ottawa')thresholds=compact?[1,3,5,9,15]:[1,4,7,12,19];
   else thresholds=compact?[1,3,5,9,15]:[1,4,7,12,19];
   let route=START_ROUTES[start][0];for(let i=0;i<thresholds.length;i++)if(days>=thresholds[i])route=START_ROUTES[start][Math.min(i,START_ROUTES[start].length-1)];
   route=[...route];if(travel==='transit'){route=route.filter(c=>!['tremblant','charlevoix'].includes(c));}
   return [...new Set(route)].slice(0,days);
 }
 const near={halifax:['halifax','peggys','lunenburg','moncton','charlottetown','cavendish','fundy','saintjohn','capebreton'],charlottetown:['charlottetown','cavendish','moncton','fundy','halifax','peggys','lunenburg'],moncton:['moncton','fundy','charlottetown','cavendish','saintjohn','halifax','peggys'],saintjohn:['saintjohn','fundy','moncton','charlottetown','halifax'],stjohns:['stjohns','bonavista']};
 const pool=near[start]||[start,...Object.keys(CITIES).filter(x=>x!==start).sort((a,b)=>travelCost(start,a)-travelCost(start,b))];
 const accessible=travel==='transit'?pool.filter(c=>!['peggys','lunenburg','capebreton','cavendish','fundy','bonavista'].includes(c)||c===start):pool;
 const maxStops=Math.max(1,Math.min(accessible.length,Math.floor((days+(pace==='full'?1:0))/2.5)+1,days));
 return accessible.slice(0,maxStops);
}
function transferAdvice(from,to,travel){
 if(!from||from===to)return {note:'',long:false,mode:'local'};
 const name=`${CITIES[from].name} → ${CITIES[to].name}`,km=geoKm(from,to);
 if(isNL(from)!==isNL(to))return {mode:'flight',long:true,note:`跨海转场：${name}。推荐考虑航空衔接（航班和转机情况另查）。如坚持带车自驾，须前往新斯科舍 North Sydney 乘 Marine Atlantic 轮渡：至 Port aux Basques 约 7 小时，再长途驾车；至 Argentia 约 16.5 小时且通常为季节性航线。轮渡不直接到圣约翰斯，跨海及道路运输需要另外预留交通日。`};
 if(travel==='transit'){
   if(['peggys','lunenburg','capebreton','fundy','cavendish','bonavista','charlevoix','tremblant'].includes(to))return {mode:'transfer',long:km>120,note:`${name}：该目的地公共交通有限，可能需要租车、当地团或预订接送；不要假设有直达火车/公交。`};
   return {mode:'railbus',long:km>350,note:`${name}：可查询 VIA Rail（主要为安省/魁省及 Montréal–Halifax）、Maritime Bus（海洋省份）或航班。直达班次并非保证，请按实际日期核对。`};
 }
 const key=`${from}-${to}`,time=DRIVE[key]||DRIVE[`${to}-${from}`];
 const bridge=([from,to].some(k=>['charlottetown','cavendish'].includes(k))&&[from,to].some(k=>!['charlottetown','cavendish'].includes(k)))?'进入或离开 PEI 可考虑联邦大桥，跨海轮渡须查当天运营。':'';
 return {mode:'car',long:km>330,note:`自驾转场：${name}。${time?'参考车程 '+time+'；':'实际车程请以导航及天气路况为准；'}${bridge}${km>450?' 距离较长，建议减少当天游览或额外增加交通日。':''}`};
}
function allocateDays(days,route,interest){
  const counts=route.map(()=>1);
  let extra=days-route.length;
  // major destinations receive more time; first stop receives arrival buffer.
  while(extra>0){
    let best=-Infinity,index=0;
    for(let i=0;i<route.length;i++){
      const city=CITIES[route[i]];
      const capacity=city.days.length;
      const score= (city.weights[interest]||3)*1.7 - counts[i]*2.2 + (i===0?1.4:0) + (['toronto','montreal','quebec'].includes(route[i])?1.7:0) - (counts[i]>=capacity?20:0);
      if(score>best){best=score;index=i;}
    }
    counts[index]++;extra--;
  }
  return counts;
}
function preferredTemplates(city,interest){
  const templates=city.days;
  const first=templates[0];
  const tail=templates.slice(1).sort((a,b)=>(b.interest===interest?1:0)-(a.interest===interest?1:0));
  return [first,...tail];
}
// Add newly curated attractions to longer stays instead of endlessly repeating the original templates.
function expandedDayTemplate(cityKey,index,interest){
 const spots=EXTRA_SPOTS[cityKey]||[];
 if(!spots.length)return null;
 const category=interest==='classic'?'culture':interest;
 const ranked=[...spots].sort((a,b)=>Number(b[1]===category)-Number(a[1]===category));
 const offset=(index*2)%ranked.length;
 const pick=[ranked[offset],ranked[(offset+1)%ranked.length]];
 return {tag:'深度景点 / 更多发现',interest,title:'走进不一样的'+CITIES[cityKey].name,stops:[
  ['上午',pick[0][0],pick[0][3]+' · 建议 '+pick[0][2]+'。'+pick[0][4]],
  ['下午',pick[1][0],pick[1][3]+' · 建议 '+pick[1][2]+'。'+pick[1][4]],
  ['傍晚','当地餐饮与自由购物','返回住宿街区，按体力和商铺营业时间安排晚餐与购物；跨区景点可能需要额外交通']
 ]};
}
function getTripDays(route,counts,interest,travel,start){
 const result=[];
 route.forEach((cityKey,routeIndex)=>{
   const c=CITIES[cityKey],guide=DESTINATION_GUIDES[cityKey],arr=preferredTemplates(c,interest);
   for(let i=0;i<counts[routeIndex];i++){
     const source=i<arr.length?arr[i]:expandedDayTemplate(cityKey,i-arr.length,interest)||arr[i%arr.length],prev=i===0?(routeIndex?route[routeIndex-1]:start):null;
     const transferring=Boolean(prev&&prev!==cityKey),transfer=transferring?transferAdvice(prev,cityKey,travel):{note:'',long:false};
     let stops=source.stops.map(x=>[...x]);
     if(transferring){
       if(transfer.long){stops=[['上午 / 下午',`前往${c.name}`,'跨城交通预计占据主要时段；以实时航班、铁路、轮渡或导航为准'],['傍晚','办理入住与轻松用餐','抵达后以休息为主，不安排需预订的远郊景点']];}
       else{stops=[['上午',`前往${c.name}`,'提前安排转场与接驳，尽量不在上午预约景点'],['下午',stops[0][1],stops[0][2]],['傍晚',stops[stops.length-1][1],stops[stops.length-1][2]]];}
     }
     if(travel==='transit')stops=stops.map(s=>{
       const difficult=['奥尔良岛','Jacques-Cartier','Gatineau Park','蒙特朗布朗国家公园','Grands-Jardins','Cape Spear','Witless Bay','Cabot Trail','Skyline Trail','North Rustico','PEI National Park','French River'];
       if(difficult.some(t=>s[1].includes(t)))return [s[0],s[1],s[2]+' · 无车需核实接驳或参加当地团，无法接驳时改为市区游览'];
       return s;
     });
     result.push({id:result.length+1,cityKey,city:c.name,title:transferring&&transfer.long?'跨城抵达 · 留出交通缓冲':source.title,tag:source.tag,stops,note:transfer.note,hotel:guide.stay,dining:guide.eat,local:guide.local,access:guide.access});
   }
 });return result;
}
function generateData(){
  const n=Number(el('days-number').value),err=el('planner-error');err.hidden=true;
  if(!Number.isInteger(n)||n<1||n>30){err.textContent='请输入 1 至 30 之间的整数天数。';err.hidden=false;return null;}
  if(state.selected.size>n){err.textContent=`已勾选 ${state.selected.size} 个目的地，但只有 ${n} 天。请增加旅行天数或减少城市，确保每站至少 1 天。`;err.hidden=false;return null;}
  state.days=n;el('days-range').value=n;updateQuickDays();
  state.start=el('start-city').value;state.travel=el('travel-mode').value;
  const route=chooseRoute(n,state.start,state.pace,state.travel),alloc=allocateDays(n,route,state.interest),tripDays=getTripDays(route,alloc,state.interest,state.travel,state.start);
  const warnings=[];
  if(route.some(isNL)&&route.some(c=>!isNL(c)))warnings.push('纽芬兰与加拿大大陆之间需要航班或跨海轮渡。普通自驾模式无法直接开车跨海；若使用轮渡，通常需要额外的整日交通时间。');
  if(route.some(c=>['capebreton','bonavista'].includes(c))&&n<7)warnings.push('布雷顿角与博纳维斯塔距离主要城市较远，建议增加天数或减少其他城市。');
  if(state.travel==='transit'&&route.some(c=>['peggys','lunenburg','capebreton','cavendish','fundy','bonavista','charlevoix','tremblant'].includes(c)))warnings.push('已按你的选择保留郊区目的地，但部分景点缺少可靠的常规公共交通，请确认包车/接送/旅游团。');
  if(route.length>=Math.ceil(n/1.8))warnings.push('这条线路换城较频繁。若喜欢舒适旅行，可以增加天数或减少目的地。');
  const dateInput=el('departure-date');const originInput=el('origin-city');
  if(dateInput&&(!dateInput.value||!/^\d{4}-\d{2}-\d{2}$/.test(dateInput.value))){err.textContent='请选择有效的旅行出发日期。';err.hidden=false;return null;}
  if(originInput&&!originInput.value.trim()){err.textContent='请填写加拿大出发城市。';err.hidden=false;return null;}
  return {route,alloc,tripDays,days:n,interest:state.interest,pace:state.pace,travel:state.travel,warnings,manual:state.selected.size>0,origin:originInput?originInput.value.trim():'',departureDate:dateInput?dateInput.value:''};
}
function mapsUrl(route,travel){
  const ordered=route[0]===state.start?route:[state.start,...route];
  const pts=ordered.map(key=>CITIES[key].search);
  if(pts.length===1)return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pts[0])}`;
  const origin=encodeURIComponent(pts[0]),destination=encodeURIComponent(pts[pts.length-1]);
  const middle=pts.slice(1,-1).join('|');
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${middle?'&waypoints='+encodeURIComponent(middle):''}&travelmode=${travel==='car'?'driving':'transit'}`;
}
function detailHTML(day){
 const c=CITIES[day.cityKey],q=c.search;
 const dateText=state.plan?.departureDate&&typeof shiftISODate==='function'?` · ${shiftISODate(state.plan.departureDate,day.id-1)}`:'';
 return `<div class="day-detail" data-day="${day.id}"><div class="day-detail-top"><div><span>DAY ${String(day.id).padStart(2,'0')}${esc(dateText)} / ${esc(c.en.toUpperCase())}</span><h4>${esc(day.title)}</h4></div><span class="day-city-tag">${esc(day.tag)}</span></div>${day.note?`<div class="travel-tip">↗ ${esc(day.note)}</div>`:''}<div class="timeline">${day.stops.map(s=>`<div class="timeline-item"><div class="timeline-time">${esc(s[0])}</div><div class="timeline-track"></div><div class="timeline-copy"><strong>${esc(s[1])}</strong><p>${esc(s[2])}</p><a href="${googleSearch(s[1]+' '+q)}" target="_blank" rel="noopener noreferrer">查地点与导航 ↗</a></div></div>`).join('')}</div><div class="daily-guide"><div><strong>⌂ 住宿区域</strong><p>${esc(day.hotel)}</p><a href="${googleSearch('hotels near '+q)}" target="_blank" rel="noopener noreferrer">查看附近住宿 ↗</a></div><div><strong>◒ 美食建议</strong><p>${esc(day.dining)}</p><a href="${googleSearch('restaurants in '+q)}" target="_blank" rel="noopener noreferrer">查找餐厅 ↗</a></div><div><strong>↗ 当地交通</strong><p>${esc(day.local)}</p></div><div><strong>♧ 购物灵感</strong><p>${esc((SHOPPING_GUIDES[day.cityKey]||[]).map(x=>x[0]+'（'+x[2]+'）').slice(0,2).join('；'))}</p><a href="index.html#shopping">查看购物指南 ↗</a></div></div><div class="day-bottom"><span>所有交通和开放信息仅供规划参考</span><a href="${googleSearch(q)}" target="_blank" rel="noopener noreferrer">查看当地地图 ↗</a></div></div>`;
}
function renderPlan(){
 const p=state.plan;if(!p)return;
 const count=p.route.length,first=CITIES[p.route[0]].name,end=CITIES[p.route[count-1]].name;
 const title=count===1?`在${first}，慢慢走 ${p.days} 天。`:(p.route[0]===state.start?`${first}出发，遇见${end}。`:`从${CITIES[state.start].name}出发，遇见${end}。`);
 const summary=`${p.departureDate?p.departureDate+' 出发 · ':''}${p.days} 天 · ${count} 个目的地 · ${MODE[p.interest]} · ${p.pace==='relaxed'?'舒适节奏':'充实探索'}`;
 const routeMarkup=p.route.map((c,i)=>`${i?'<span class="route-arrow">→</span>':''}<span class="route-pill">${esc(CITIES[c].name)}</span>`).join('');
 el('planner-output').innerHTML=`<div class="result-kicker">${p.manual?'YOUR SELECTED DESTINATIONS':'YOUR PERSONALIZED JOURNEY'}</div><h3 class="result-headline">${esc(title)}</h3><p class="result-subhead">${p.manual?'已优先保留所有你勾选的目的地，按距离优化顺序；具体跨城接驳仍需确认。':'为你按出发地和天数推荐连贯线路。'}<br>为你规划 ${esc(summary)}。</p><div class="route-pills" aria-label="旅行城市顺序">${routeMarkup}</div>${p.warnings.length?`<div class="plan-warnings"><strong>行程可行性提醒</strong>${p.warnings.map(s=>`<p>⚠ ${esc(s)}</p>`).join('')}</div>`:''}<div class="overview-row"><div><strong>${p.days} <small>天</small></strong><span>旅行总时长</span></div><div><strong>${count} <small>站</small></strong><span>目的地</span></div><div><strong>${p.travel==='car'?'自驾 / 租车':'公共交通'}</strong><span>主要交通</span></div></div><div class="itinerary-head"><h4>每日旅行提案</h4><span>点击天数查看安排</span></div><div class="day-nav" id="day-nav" role="group" aria-label="选择查看哪一天">${p.tripDays.map((d,i)=>`<button type="button" class="day-button ${i===state.activeDay?'active':''}" aria-pressed="${i===state.activeDay}" data-day="${i}"><span>DAY</span><strong>${i+1}</strong></button>`).join('')}</div><div id="active-day-detail">${detailHTML(p.tripDays[state.activeDay])}</div><div class="result-actions"><button class="primary-action" id="download-trip" type="button">↓ 下载行程与旅行贴士</button><a href="${mapsUrl(p.route,p.travel)}" target="_blank" rel="noopener noreferrer">↗ 查看路线（分段核实跨海交通）</a><button id="toggle-all" type="button">${state.all?'收起全部天数':'查看全部天数'}</button></div><div id="all-days-print" ${state.all?'':'hidden'}>${state.all?p.tripDays.map(d=>detailHTML(d)).join(''):''}</div><div class="result-notice">✧ 路线为浏览器本地规则算法生成，并非实时 AI、导航、机票、酒店或餐馆预订服务。跨省、跨海与远郊请以实际交通和运营情况调整。</div>`;
 bindPlanActions();
}
function bindPlanActions(){
  el('day-nav').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    state.activeDay=Number(b.dataset.day);
    el('day-nav').querySelectorAll('button').forEach(btn=>{const active=Number(btn.dataset.day)===state.activeDay;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))});
    el('active-day-detail').innerHTML=detailHTML(state.plan.tripDays[state.activeDay]);
  }));
  el('download-trip').addEventListener('click',downloadPlan);
  el('toggle-all').addEventListener('click',()=>{
    state.all=!state.all;
    const region=el('all-days-print');region.hidden=!state.all;region.innerHTML=state.all?state.plan.tripDays.map(d=>detailHTML(d)).join(''):'';
    el('toggle-all').textContent=state.all?'收起全部天数':'查看全部天数';
  });
}
function downloadPlan(){
  if(!state.plan)return;
  const p=state.plan;
  const lines=['EASTBOUND · 加东智能旅行行程',`${p.days} 天 | ${MODE[p.interest]} | ${p.travel==='car'?'自驾':'公共交通'}`,'',`加拿大出发地：${p.origin||'未填写'}` , `计划出发日：${p.departureDate||'未设置'}`,'',`行经：${p.route.map(x=>CITIES[x].name).join(' → ')}`,''];
  p.warnings.forEach(w=>lines.push('特别提醒：'+w));p.tripDays.forEach(d=>{lines.push(`DAY ${d.id} / ${d.city} / ${d.title}`);if(d.note)lines.push(`  转场：${d.note}`);d.stops.forEach(s=>lines.push(`  ${s[0]}：${s[1]} — ${s[2]}`));lines.push(`  住宿区域：${d.hotel}`,`  饮食建议：${d.dining}`,`  当地交通：${d.local}`,`  如何到达：${d.access}`,`  购物推荐：${(SHOPPING_GUIDES[d.cityKey]||[]).map(x=>x[0]).join('、')}`,'');});
  lines.push('提示：路线和车程仅供参考；请以官方旅游、天气、实时交通与运营公告为准。','EASTBOUND · east-canada-travel');
  const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`EASTBOUND-加东${p.days}天行程.txt`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);notify('已生成可保存的完整行程');
}
function generate(){const result=generateData();if(!result)return;if(typeof clearCustomRoute==='function')clearCustomRoute();state.plan=result;state.activeDay=0;state.all=false;renderPlan();if(typeof renderFlightSuggestions==='function')renderFlightSuggestions();if(typeof updateRouteMap==='function')updateRouteMap()}
function updateQuickDays(){document.querySelectorAll('[data-days]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.days)===Number(el('days-number').value)))}
let toastTimeout;
function notify(s){const toast=el('toast');toast.textContent=s;toast.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove('show'),3000)}
function setup(){
  if(el('destination-grid'))renderDestinations();
  if(el('destinations-more'))el('destinations-more').addEventListener('click',()=>{const list=Object.entries(CITIES).filter(([key,c])=>activeDestinationFilter==='all'||c.type===activeDestinationFilter||(activeDestinationFilter==='atlantic'&&REGIONS.slice(2).some(r=>r.cities.includes(key))));destinationVisible=list.length;renderDestinations(activeDestinationFilter)});
  el('destinations-collapse')?.addEventListener('click',()=>{destinationVisible=initialCollectionCount();renderDestinations(activeDestinationFilter);returnToSection('destinations')});
  if(el('city-picker'))renderCityPicker();
  if(el('resource-links'))el('resource-links').innerHTML=RESOURCE_LINKS.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('');
  if(el('city-picker'))el('city-picker').addEventListener('change',e=>{const input=e.target.closest('input[data-city]');if(!input)return;input.checked?state.selected.add(input.dataset.city):state.selected.delete(input.dataset.city);renderCityPicker();el('planner-error').hidden=true;});
  document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>setPreset(b.dataset.preset)));
  if(el('year'))el('year').textContent=new Date().getFullYear();
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{activeDestinationFilter=b.dataset.filter;destinationVisible=initialCollectionCount();document.querySelectorAll('[data-filter]').forEach(other=>{other.classList.toggle('active',other===b);other.setAttribute('aria-pressed',String(other===b))});renderDestinations(b.dataset.filter)}));
  if(el('destination-grid'))el('destination-grid').addEventListener('click',e=>{const button=e.target.closest('[data-detail]');if(button)detailDestination(button.dataset.detail)});
  if(el('modal-close'))el('modal-close').addEventListener('click',closeModal);
  if(el('destination-modal'))el('destination-modal').addEventListener('click',e=>{if(e.target===el('destination-modal'))closeModal()});
  const range=el('days-range'),number=el('days-number');
  if(range&&number){
    const params=new URLSearchParams(window.location.search);
    const selected=params.getAll('city').filter(c=>CITIES[c]);
    if(selected.length){state.selected=new Set(selected);renderCityPicker();}
    const requestedDays=Number(params.get('days'));
    if(requestedDays>=1&&requestedDays<=30){number.value=requestedDays;range.value=requestedDays;state.days=requestedDays;}
    range.addEventListener('input',()=>{number.value=range.value;updateQuickDays()});
    number.addEventListener('input',()=>{const n=Number(number.value);if(Number.isFinite(n)&&n>=1&&n<=30)range.value=n;updateQuickDays()});
    document.querySelectorAll('[data-days]').forEach(b=>b.addEventListener('click',()=>{number.value=b.dataset.days;range.value=b.dataset.days;updateQuickDays();generate()}));
    function choice(id,key){el(id).querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state[key]=b.dataset.value;el(id).querySelectorAll('button').forEach(other=>{const active=other===b;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active))})}))}
    choice('interest-choices','interest');choice('pace-choices','pace');
    el('generate').addEventListener('click',()=>{generate();if(state.plan&&window.innerWidth<861)el('planner-output').scrollIntoView({behavior:'smooth',block:'start'})});
    updateQuickDays();generate();
  }
  if(el('menu-toggle'))el('menu-toggle').addEventListener('click',()=>{const menu=el('mobile-menu');const expand=menu.hidden;menu.hidden=!expand;el('menu-toggle').setAttribute('aria-expanded',String(expand))});
  if(el('mobile-menu'))el('mobile-menu').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{el('mobile-menu').hidden=true;el('menu-toggle').setAttribute('aria-expanded','false')}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();

// Rebalance unexpanded grids whenever the number of columns changes.
(() => {
  let oldBase=initialCollectionCount();
  window.addEventListener('resize',()=>{
    const nextBase=initialCollectionCount(); if(oldBase===nextBase)return;
    const was=oldBase;oldBase=nextBase;
    if(destinationVisible===was)destinationVisible=nextBase;
    if(typeof spotsVisible!=='undefined' && spotsVisible===was)spotsVisible=nextBase;
    if(typeof shoppingVisible!=='undefined' && shoppingVisible===was)shoppingVisible=nextBase;
    if(typeof ferryVisible!=='undefined' && ferryVisible===was)ferryVisible=nextBase;
    if(typeof diningVisible!=='undefined' && diningVisible===was)diningVisible=nextBase;
    if(typeof readingVisible!=='undefined' && readingVisible===was)readingVisible=nextBase;
    if(el('destination-grid'))renderDestinations(activeDestinationFilter);
    if(el('spot-grid'))renderSpots(); if(el('shopping-grid'))renderShopping();
    if(el('ferry-grid'))renderFerries(); if(el('dining-grid'))renderDining();
    if(el('reading-grid'))renderReading();
  });
})();
