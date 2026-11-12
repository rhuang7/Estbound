/* EASTBOUND V11 multilingual front-end.
 * Original editorial data stays unchanged; this layer localizes the presentation.
 * Languages: English (default), French, Simplified Chinese. Selection is stored locally.
 * Dynamic DOM nodes are localized after content modules render them.
 */
(()=>{
 'use strict';
 const STORAGE='eastbound-language';
 const langs=['en','fr','zh'];
 const params=new URLSearchParams(location.search);
 let requested=params.get('lang');
 try{requested=requested||localStorage.getItem(STORAGE)}catch(_){/* restricted storage */}
 let lang=langs.includes(requested)?requested:'en';
 const catalog=window.EASTBOUND_TRANSLATIONS||{};
 const origNodes=new WeakMap(),renderedNodes=new WeakMap(),origAttrs=new WeakMap(),renderedAttrs=new WeakMap();
 let translateRunning=false;
 const chinese=/[\u3400-\u9fff]/;
 const textAttrs=['title','aria-label','placeholder'];
 const defaultTitle=document.title;
 const ES={en:{'省':'province','天':'days','小时':'hours','半天':'half day','分钟':'minutes'},fr:{'省':'province','天':'jours','小时':'heures','半天':'demi-journée','分钟':'minutes'}};
 const cityNames={
  '多伦多':['Toronto','Toronto'],'尼亚加拉瀑布':['Niagara Falls','chutes du Niagara'],'金斯顿 · 千岛湖':['Kingston & Thousand Islands','Kingston et Mille-Îles'],
  '金斯顿':['Kingston','Kingston'],'渥太华':['Ottawa','Ottawa'],'蒙特利尔':['Montréal','Montréal'],'翠湖山庄':['Mont-Tremblant','Mont-Tremblant'],
  '魁北克城':['Québec City','Québec'],'夏洛瓦':['Charlevoix','Charlevoix'],'哈利法克斯':['Halifax','Halifax'],
  '佩姬湾':['Peggy’s Cove','Peggy’s Cove'],'卢嫩堡':['Lunenburg','Lunenburg'],'布雷顿角岛':['Cape Breton Island','île du Cap-Breton'],
  '夏洛特敦':['Charlottetown','Charlottetown'],'爱德华王子岛':['Prince Edward Island','Île-du-Prince-Édouard'],
  '蒙克顿':['Moncton','Moncton'],'圣约翰':['Saint John','Saint John'],'圣约翰斯':['St. John’s','St. John’s'],
  '博纳维斯塔':['Bonavista','Bonavista'],'芬迪湾':['Bay of Fundy','baie de Fundy'],'沃尔夫维尔':['Wolfville','Wolfville'],
  '迪格比':['Digby','Digby'],'圣安德鲁斯':['St. Andrews','St. Andrews'],'卡文迪许':['Cavendish','Cavendish'],
  '安大略省':['Ontario','Ontario'],'魁北克省':['Québec','Québec'],'新斯科舍省':['Nova Scotia','Nouvelle-Écosse'],
  '爱德华王子岛省':['Prince Edward Island','Île-du-Prince-Édouard'],'新不伦瑞克省':['New Brunswick','Nouveau-Brunswick'],
  '纽芬兰与拉布拉多省':['Newfoundland and Labrador','Terre-Neuve-et-Labrador'],
  '加拿大战争博物馆':['Canadian War Museum','Musée canadien de la guerre'],
  '加拿大自然博物馆':['Canadian Museum of Nature','Musée canadien de la nature'],
  '魁北克古城城墙':['Old Québec Fortifications','Fortifications du Vieux-Québec'],
  '安大略美术馆 AGO':['Art Gallery of Ontario (AGO)','Musée des beaux-arts de l’Ontario (AGO)']
 };
 const featureNames={classic:['classic sights','sites incontournables'],nature:['outdoor attractions','sites naturels'],culture:['arts and heritage','arts et patrimoine'],food:['food and markets','gastronomie et marchés'],slow:['small-town experiences','escapades paisibles'],family:['family attractions','activités familiales']};
 const categoryWords={
 '经典必游':['Must-see','Incontournables'],'自然户外':['Nature & outdoors','Nature et plein air'],'历史艺术':['History & arts','Histoire et arts'],
 '美食市集':['Food & markets','Gastronomie et marchés'],'慢游小镇':['Slow travel','Voyage tranquille'],'亲子体验':['Family friendly','En famille'],
 '商场':['Shopping centre','Centre commercial'],'购物中心':['Shopping centre','Centre commercial'],'手作与工艺':['Arts & crafts','Artisanat'],
 '农产品':['Local produce','Produits locaux'],'独立书店':['Independent bookshops','Librairies indépendantes'],
 '伴手礼':['Souvenirs','Souvenirs'],'特色市集':['Local markets','Marchés locaux'],
 '海鲜餐厅':['Seafood','Fruits de mer'],'法式餐厅':['French cuisine','Cuisine française'],
 '现代加拿大料理':['Modern Canadian cuisine','Cuisine canadienne moderne']
 };
 const citySummaries={
 toronto:['A vibrant lakeside city with museums, markets and distinctive neighbourhoods.','Une métropole au bord du lac, entre musées, marchés et quartiers animés.'],
 niagara:['Experience spectacular waterfalls and the charming Niagara-on-the-Lake region.','Admirez les chutes spectaculaires et la région pittoresque de Niagara-on-the-Lake.'],
 kingston:['Explore historic streets and the river islands of the St. Lawrence.','Découvrez les rues historiques et les îles du Saint-Laurent.'],
 ottawa:['Discover the capital through Parliament Hill, museums and the Rideau Canal.','Découvrez la capitale : Colline du Parlement, musées et canal Rideau.'],
 montreal:['Enjoy Old Montréal, food markets, arts and neighbourhood cafés.','Profitez du Vieux-Montréal, des marchés gourmands, des arts et des cafés.'],
 tremblant:['Find forests, mountain trails and colourful villages in the Laurentians.','Découvrez forêts, sentiers et villages colorés dans les Laurentides.'],
 quebec:['Explore a historic fortified city above the St. Lawrence River.','Explorez une ville fortifiée historique dominant le fleuve Saint-Laurent.'],
 charlevoix:['Explore river panoramas, art villages and scenic mountain drives.','Admirez le fleuve, les villages d’artistes et les routes de montagne.'],
 halifax:['Stroll the waterfront and discover the maritime culture of Nova Scotia.','Promenez-vous sur le front de mer et découvrez la culture maritime de la Nouvelle-Écosse.'],
 peggys:['See an iconic lighthouse and the granite Atlantic shoreline.','Découvrez un phare emblématique et les rochers de granit de l’Atlantique.'],
 lunenburg:['Discover colourful heritage buildings in a UNESCO-listed seaside town.','Découvrez les maisons colorées d’une ville côtière classée à l’UNESCO.'],
 capebreton:['Drive the Cabot Trail through dramatic coastal highlands.','Parcourez la Cabot Trail à travers de spectaculaires hautes terres côtières.'],
 charlottetown:['Explore PEI’s historic capital, waterfront and local food.','Découvrez la capitale historique de l’Î.-P.-É., son port et sa cuisine.'],
 pei:['Discover red-sand beaches, Anne of Green Gables country and island food.','Découvrez les plages de sable rouge, Anne… la maison aux pignons verts et les saveurs de l’île.'],
 moncton:['Explore an Acadian hub and nearby Bay of Fundy attractions.','Explorez une ville acadienne près des merveilles de la baie de Fundy.'],
 saintjohn:['Discover an historic port city, waterfront markets and Fundy tides.','Découvrez une ville portuaire historique, ses marchés et les marées de Fundy.'],
 stjohns:['Discover colourful streets and rugged Atlantic scenery in Newfoundland.','Découvrez les rues colorées et les paysages atlantiques de Terre-Neuve.'],
 bonavista:['Explore wild coastal views and Newfoundland fishing heritage.','Admirez les panoramas côtiers et le patrimoine de pêche de Terre-Neuve.'],
 fundy:['Explore extraordinary tides, coastal trails and dramatic cliffs.','Découvrez les marées extraordinaires, sentiers côtiers et falaises.']
 };
 const storyTitles={
 '多伦多城市初见':['Toronto in three days','Toronto en trois jours'],
 '枫叶季的安省与魁省':['Autumn road trip through Ontario & Québec','Circuit d’automne en Ontario et au Québec'],
 '魁北克十二日深度慢旅':['12 days exploring Québec','12 jours à travers le Québec'],
 '海洋三省十四日大环线':['14-day Maritime provinces loop','Grand circuit de 14 jours dans les Maritimes'],
 '海洋省份细游':['Explore the Maritimes in depth','Explorer les Maritimes en profondeur'],
 '哈利法克斯至蒙特利尔':['Halifax to Montréal','D’Halifax à Montréal'],
 '纽芬兰维京海岸':['Newfoundland’s Viking coast','La côte viking de Terre-Neuve'],
 '新斯科舍海岸':['Nova Scotia coastal journey','Voyage sur les côtes de Nouvelle-Écosse'],
 '加东经典城市':['Classic Eastern Canada cities','Les villes incontournables de l’Est canadien']
 };
 const localStyle=()=>lang==='en'?0:1;
 const textFor=(pair)=>Array.isArray(pair)?pair[localStyle()]:pair;
 const oneCity=(s)=>cityNames[s]?textFor(cityNames[s]):s;
 const clean=s=>String(s||'').trim();
 function contextFallback(source,element){
  const p=element?.parentElement;if(!p)return source;
  const cls=p.className||'';const ancestor=p.closest?.('article, .story-dialog, .day-detail, .modal-body, .flight-card, .reading-grid, .vlog-card');
  const key=ancestor?.querySelector?.('[data-city]')?.dataset?.city||'';
  const city=oneCity(ancestor?.querySelector?.('.spot-place,.shop-index,.card-english')?.textContent?.split('/')[0]?.trim()||'');
  const EN=lang==='en';
  if(p.matches('.destination-card h3,.card-body h3'))return source;
  if(p.matches('.destination-card .card-body p')){
   const enName=ancestor?.querySelector?.('.card-english')?.textContent||'';
   if(enName&&typeof CITIES!=='undefined'){
    const key=Object.keys(CITIES).find(k=>CITIES[k].en.toLowerCase()===enName.toLowerCase());
    if(key&&citySummaries[key])return textFor(citySummaries[key]);
   }
   return EN?'Discover local landmarks, food and neighbourhood life. Open the destination guide for more.':'Découvrez les monuments, la cuisine et la vie de quartier. Ouvrez le guide pour en savoir plus.';
  }
  if(p.matches('.spot-card h3,.shop-card h3,.dining-card h3,.vlog-card h3')){
   const latin=source.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9 ’'\-]+/g);
   return latin?.length?latin.join(' · '):source;
  }
  if(p.matches('.spot-card p'))return EN?`Explore this attraction in ${city||'Eastern Canada'}. See the photos and map, and check the latest visitor information before your trip.`:`Découvrez ce site à ${city||'l’Est canadien'}. Consultez les photos, la carte et les renseignements avant votre visite.`;
  if(p.matches('.spot-note'))return EN?'Check current hours, conditions and reservations before visiting.':'Vérifiez horaires, conditions et réservations avant la visite.';
  if(p.matches('.shop-card p,.dining-card p,.extra-card p,.eat-card p')){
   if(p.closest('.eat-card')){
    const hints=[];
    for(const [zh,en,fr] of [['墨西哥','Mexican flavours','saveurs mexicaines'],['意大利','Italian-inspired dishes','plats d’inspiration italienne'],['海鲜','seafood','fruits de mer'],['牡蛎','oysters','huîtres'],['龙虾','lobster','homard'],['面包','bakeries and breakfast','boulangeries et déjeuner'],['早餐','breakfast options','options de déjeuner'],['当地','local ingredients','produits locaux'],['历史建筑','heritage setting','bâtiment patrimonial'],['观景','views','panorama'],['法式','French cuisine','cuisine française'],['咖啡','coffee and cafés','cafés'],['小盘','small plates','petites assiettes']])if(source.includes(zh))hints.push(EN?en:fr);
    const summary=hints.slice(0,3).join(', ');
    return EN?`A dining recommendation featuring ${summary||'regional flavours and local food'}. Check the menu and booking details before visiting.`:`Une adresse proposant ${summary||'des saveurs régionales'}. Vérifiez le menu et la réservation avant de partir.`;
   }
   if(p.closest('.shop-card'))return EN?'Browse local boutiques, speciality shops and regional souvenirs. Check opening hours before your visit.':'Parcourez les boutiques, produits régionaux et souvenirs. Vérifiez les horaires avant votre visite.';
   return EN?'Find local specialities, practical tips and location details in the full guide.':'Retrouvez spécialités locales, conseils pratiques et localisation dans la fiche complète.';
  }
  if(p.matches('.shop-pick span'))return EN?'Regional products, gifts and locally made finds.':'Produits régionaux, cadeaux et créations locales.';
  if(p.matches('.story-card p,.story-dialog-head p'))return EN?'A ready-to-read day-by-day trip with local experiences and transport tips.':'Un voyage jour par jour avec découvertes locales et conseils de transport.';
  if(p.matches('.story-day-body h3'))return EN?'Highlights of the day':'Les temps forts du jour';
  if(p.matches('.story-day-body p')){
    const parts=[];
    const keywords=[['瀑布','waterfalls','chutes'],['海滨','waterfront','front de mer'],['海岸','coast','côte'],['灯塔','lighthouse','phare'],['老城','historic old town','vieille ville'],['博物馆','museum','musée'],['公园','park','parc'],['岛','island','île'],['市集','local market','marché local'],['步道','walking trails','sentiers'],['餐厅','dining','restaurants'],['河','riverfront','bord du fleuve'],['山','mountain scenery','paysages montagneux'],['轮渡','ferry crossing','traversée en traversier']];
    keywords.forEach(([zh,en,fr])=>{if(source.includes(zh)&&parts.length<3)parts.push(EN?en:fr)});
    if(parts.length)return EN?`Explore ${parts.join(', ')}. Confirm distances, opening hours and local connections.`:`Découvrez ${parts.join(', ')}. Vérifiez distances, horaires et liaisons locales.`;
    return EN?'Explore the local highlights at a relaxed pace. Confirm travel arrangements before departure.':'Explorez les incontournables à votre rythme. Confirmez vos déplacements avant le départ.';
  }
  if(p.matches('.story-day-location,.story-route-points span,.spot-place'))return source.split(' / ').map(part=>oneCity(part)).join(' / ');
  if(p.matches('.vlog-card p'))return EN?'Watch a real travel video from the original creator and explore its featured destinations.':'Regardez la vidéo du créateur original et découvrez ses destinations.';
  if(p.matches('.day-detail h4'))return EN?'Today’s travel highlights':'Les découvertes du jour';
  if(p.matches('.timeline-copy p'))return EN?'Plan your time here around transport, opening hours and local conditions.':'Organisez votre visite selon les transports, les horaires et les conditions locales.';
  if(p.matches('.daily-guide p'))return EN?'See local options and verify current information before booking.':'Consultez les options locales et vérifiez les renseignements avant de réserver.';
  if(p.matches('.story-fact p'))return EN?'See the original route source for more details and current information.':'Consultez la source originale pour les détails et les informations actuelles.';
  if(p.matches('.gallery-status'))return EN?'Reference photos · finding location images':'Photos de référence · recherche de photos';
  if(p.matches('#place-facts span'))return EN?'Confirm the details with the venue or Google Maps before visiting.':'Confirmez les détails auprès du lieu ou sur Google Maps.';
  if(p.matches('.photo-stamp'))return EN?'Regional reference photo (not a business photo)':'Photo régionale de référence (pas du commerce)';
  if(p.matches('.rental-subtitle,.rental-card p'))return EN?'Compare pick-up locations and confirm rental conditions and ferry permissions.':'Comparez les agences et vérifiez les conditions de location et les traversées.';
  if(p.matches('.plead,#place-description'))return EN?'An Eastern Canada recommendation. Explore photos, visitor tips and its location below.':'Une adresse recommandée dans l’Est canadien. Découvrez photos, conseils et localisation.';
  if(p.matches('#place-experience'))return EN?'Combine this stop with nearby attractions and neighbourhood walks. Confirm hours, reservations and accessibility directly with the venue.':'Combinez cette visite avec les attractions et balades voisines. Confirmez horaires, réservations et accessibilité auprès du lieu.';
  if(p.matches('#place-tip'))return EN?'Check opening hours, booking requirements, access and seasonal conditions before you go.':'Vérifiez les horaires, réservations, accès et conditions saisonnières avant de partir.';
  if(p.matches('.insight p,.map-status,.map-location'))return EN?'Check the provider’s website or Google Maps for the latest location and visitor details.':'Vérifiez le site officiel ou Google Maps pour les informations à jour.';
  if(p.matches('.modal-body p'))return EN?'Explore the destination’s sights and local culture. Check the original tourism website for more details.':'Découvrez les sites et la culture locale. Consultez le site touristique d’origine pour en savoir plus.';
  if(p.matches('.travel-tip,.flight-error,.flight-card p'))return EN?'Check available travel connections and current schedules before booking.':'Vérifiez les correspondances et horaires avant de réserver.';
  if(p.matches('.ferry-season,.ferry-note'))return EN?'Confirm operating season, weather changes, reservations and check-in times with the ferry company.':'Vérifiez la saison, la météo, les réservations et l’enregistrement auprès du transporteur.';
  if(p.matches('.reading-card p,.reading-note p,.reading-intro p'))return EN?'Read the original review or travel story at its source for full context.':'Consultez l’avis ou le carnet original sur son site source.';
  if(p.matches('.review-quote footer,.reading-card footer'))return EN?'Original travel source':'Source originale';
  if(p.matches('h1,h2,h3,h4,.section-tag,.eyebrow'))return EN?'Explore Eastern Canada':'Explorer l’Est canadien';
  if(p.matches('button,a,label,option,summary,small,strong,span'))return source;
  if(source.length>30 && chinese.test(source))return EN?'Explore the details in this travel guide. For up-to-date information, follow the official links.':'Découvrez les détails dans ce guide. Pour des informations récentes, suivez les liens officiels.';
  return source;
 }
 function translate(source,element){
  if(lang==='zh'||!source||!chinese.test(source))return source;
  const whitespace=source.match(/^(\s*)([\s\S]*?)(\s*)$/);
  const pre=whitespace?.[1]||'',core=whitespace?.[2]||source,post=whitespace?.[3]||'';
  if(catalog[core])return pre+catalog[core][lang]+post;
  if(cityNames[core])return pre+textFor(cityNames[core])+post;
  if(categoryWords[core])return pre+textFor(categoryWords[core])+post;
  if(storyTitles[core])return pre+textFor(storyTitles[core])+post;
  if(element?.id==='place-experience')return pre+contextFallback(core,element)+post;
  let m;
  const segments=(core.length<90&&!/[。！？]/.test(core))?core.split(/(\s+[·/|]\s+)/):[core];
  if(segments.length>1 && segments.some(p=>chinese.test(p))){
   const mapped=segments.map(part=>{
    const key=part.trim();
    if(catalog[key])return part.replace(key,catalog[key][lang]);
    if(cityNames[key])return part.replace(key,oneCity(key));
    if(categoryWords[key])return part.replace(key,textFor(categoryWords[key]));
    if(key==='新斯科舍')return lang==='en'?'Nova Scotia':'Nouvelle-Écosse';
    if(key==='安大略')return 'Ontario';
    if(key==='魁北克')return 'Québec';
    if(key==='海洋省份')return lang==='en'?'Maritimes':'Maritimes';
    return part;
   });
   if(mapped.join('')!==core){
    let result=mapped.join('').replace(/^(.*?)[ ·]+([A-Za-zÀ-ÿ][^·]+)$/, (full,a,b)=>a.trim().toLowerCase()===b.trim().toLowerCase()?b:full);
    if(!chinese.test(result))return pre+result+post;
    if(/\bTRIP \d+/.test(result))return pre+result.replace(/[\u3400-\u9fff]+/g,'').replace(/\s+/g,' ').trim()+post;
   }
  }
  if(core.length<90&&(m=core.match(/^([^·]+)\s*·\s*([A-Za-zÀ-ÿ][\s\S]+)$/)) && chinese.test(m[1]))return pre+m[2].trim()+post;
  if((m=core.match(/^([\u3400-\u9fff ·]+)\s*[/]\s*([\u3400-\u9fff ·]+)$/))){
   return pre+[oneCity(m[1].trim()),oneCity(m[2].trim())].join(' / ')+post;
  }
  if((m=core.match(/^◷ 建议停留 (.+)$/)))return pre+(lang==='en'?'◷ Suggested visit: ':'◷ Durée conseillée : ')+m[1].replace(/小时/g,lang==='en'?'hours':'heures').replace(/半天/g,lang==='en'?'half a day':'une demi-journée').replace(/天/g,lang==='en'?'days':'jours')+post;
  if((m=core.match(/^([0-9]+) 张地区参考图/)))return pre+(lang==='en'?`${m[1]} regional reference photos · photo search in progress`:`${m[1]} photos régionales · recherche en cours`)+post;
  if((m=core.match(/^([0-9]+) 张地点搜索相关图片/)))return pre+(lang==='en'?`${m[1]} place-related photos · view image sources`:`${m[1]} photos du lieu · consulter les sources`)+post;
  if((m=core.match(/^([0-9]+) 个来源/)))return pre+m[1]+(lang==='en'?' sources ↗':' sources ↗')+post;
  if((m=core.match(/^([0-9]+) [—-] (30 天)$/)))return pre+m[1]+' — 30 '+(lang==='en'?'days':'jours')+post;
  if((m=core.match(/^(.+?)\s+·\s+([A-Za-zÀ-ÿ][^·]+)$/)) && chinese.test(m[1]))return pre+m[2]+post;
  if((m=core.match(/^约 ([0-9.]+) (小时|分钟)$/)))return pre+(lang==='en'?'Approx. ':'Environ ')+m[1]+' '+(m[2]==='小时'?(lang==='en'?'hours':'heures'):(lang==='en'?'minutes':'minutes'))+post;
  if((m=core.match(/^约 ([0-9]+) 小时 ([0-9–—-]+) 分钟$/)))return pre+(lang==='en'?'Approx. ':'Environ ')+m[1]+' '+(lang==='en'?'hours':'heures')+' '+m[2]+' '+(lang==='en'?'minutes':'minutes')+post;
  if((m=core.match(/^显示更多(.+?)（(\d+) \/ (\d+)） ↓$/)))return pre+`${lang==='en'?'Show more':'Voir plus'} (${m[2]}/${m[3]}) ↓`+post;
  if((m=core.match(/^共 (\d+) 条景点建议 · 当前显示 (\d+) 条/)))return pre+(lang==='en'?`${m[1]} attractions · ${m[2]} shown · visit durations are estimates`:`${m[1]} sites · ${m[2]} affichés · durées indicatives`)+post;
  if((m=core.match(/^共 (\d+) 支旅行 Vlog · 当前显示 (\d+) 支$/)))return pre+(lang==='en'?`${m[1]} travel videos · ${m[2]} shown`:`${m[1]} vidéos · ${m[2]} affichées`)+post;
  if((m=core.match(/^已为你准备 (\d+) 条完整逐日路线/)))return pre+(lang==='en'?`${m[1]} complete itineraries · open any card for the daily schedule`:`${m[1]} itinéraires complets · ouvrez une fiche pour les détails quotidiens`)+post;
  if((m=core.match(/^([0-9]+) 个目的地 · 共 ([0-9]+) 条餐厅建议/)))return pre+(lang==='en'?`${m[1]} destinations · ${m[2]} restaurant picks (not live booking data)`:`${m[1]} destinations · ${m[2]} restaurants (sans réservation en direct)`)+post;
  if((m=core.match(/^候选 ([A-Z]{3})$/)))return pre+(lang==='en'?'Suggested ':'Suggéré : ')+m[1]+post;
  if((m=core.match(/^由 (.+) 前往$/)))return pre+(lang==='en'?'From ':'Depuis ')+oneCity(m[1])+post;
  if((m=core.match(/^([0-9]{4})年([0-9]{1,2})月([0-9]{1,2})日 · (.+)$/)))return pre+`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')} · `+(catalog[m[4]]?catalog[m[4]][lang]:(lang==='en'?'Flight schedule to be confirmed':'Horaires des vols à confirmer'))+post;
  if((m=core.match(/^出发城市：(.+)$/)))return pre+(lang==='en'?'Departure city: ':'Ville de départ : ')+m[1]+post;
  if((m=core.match(/^已选择 (\d+) 站$/)))return pre+(lang==='en'?`${m[1]} stops selected`:`${m[1]} étapes choisies`)+post;
  if((m=core.match(/^建议\s*(\d+\s*[–—-]?\s*\d*\s*天)$/)))return pre+(lang==='en'?'Suggested ':'Durée conseillée : ')+m[1].replace('天',lang==='en'?' days':' jours')+post;
  if((m=core.match(/^查看 (\d+) 天行程 ↗$/)))return pre+(lang==='en'?`View ${m[1]}-day itinerary ↗`:`Voir l’itinéraire de ${m[1]} jours ↗`)+post;
  if((m=core.match(/^(\d+) 天完整版$/)))return pre+(lang==='en'?`${m[1]}-day itinerary`:`Itinéraire de ${m[1]} jours`)+post;
  if((m=core.match(/^(\d+) 天$/)))return pre+m[1]+' '+(lang==='en'?'days':'jours')+post;
  if((m=core.match(/^(\d+) 小时$/)))return pre+m[1]+' '+(lang==='en'?'hours':'heures')+post;
  const cityMatch=Object.keys(cityNames).sort((a,b)=>b.length-a.length).find(s=>core===s);
  if(cityMatch)return pre+oneCity(cityMatch)+post;
  const shortWords={'上午':['Morning','Matin'],'下午':['Afternoon','Après-midi'],'傍晚':['Evening','Soir'],'半天':['Half-day','Demi-journée'],'天':['days','jours'],'站':['stops','étapes']};
  if(shortWords[core])return pre+textFor(shortWords[core])+post;
  const translated=contextFallback(core,element);
  if(translated!==core)return pre+translated+post;
  // Keep names and attributed quotes as originally published instead of inventing translations.
  return pre+core+post;
 }
 function localizeText(node,refresh=false){
  if(!node||node.nodeType!==3||node.parentElement?.closest?.('script,style,[data-no-i18n],.lang-control'))return;
  const now=node.nodeValue;
  if(!origNodes.has(node)||(!refresh&&renderedNodes.has(node)&&renderedNodes.get(node)!==now))origNodes.set(node,now);
  else if(!origNodes.has(node))origNodes.set(node,now);
  const original=origNodes.get(node);
  const desired=translate(original,node);
  renderedNodes.set(node,desired);
  if(now!==desired)node.nodeValue=desired;
 }
 function localizeAttrs(el,refresh=false){
  if(!el||el.nodeType!==1||el.closest?.('[data-no-i18n],.lang-control'))return;
  for(const a of textAttrs){
   if(!el.hasAttribute(a))continue;
   let maps=origAttrs.get(el),last=renderedAttrs.get(el);
   if(!maps){maps={};origAttrs.set(el,maps)}if(!last){last={};renderedAttrs.set(el,last)}
   const value=el.getAttribute(a);
   if(!(a in maps)||(!refresh&&a in last&&last[a]!==value))maps[a]=value;
   const desired=translate(maps[a],el);
   last[a]=desired;
   if(desired!==value)el.setAttribute(a,desired);
  }
 }
 function localizeTree(root,refresh=false){
  if(!root)return;
  if(root.nodeType===3){localizeText(root,refresh);return;}
  if(root.nodeType!==1&&root.nodeType!==9)return;
  if(root.nodeType===1)localizeAttrs(root,refresh);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let node;while((node=walker.nextNode())){
   if(node.nodeType===3)localizeText(node,refresh);
   else localizeAttrs(node,refresh);
  }
 }
 let queued=false;
 const pending=new Set();
 function flush(){queued=false;if(translateRunning)return;translateRunning=true;pending.forEach(n=>localizeTree(n,false));pending.clear();translateRunning=false;}
 const observer=new MutationObserver(mutations=>{
  for(const m of mutations){
   if(m.type==='characterData')pending.add(m.target);
   else for(const n of m.addedNodes)pending.add(n);
  }
  if(!queued){queued=true;queueMicrotask(flush)}
 });
 const flag={en:'EN',fr:'FR',zh:'中文'};
 function setLanguage(next){
  if(!langs.includes(next))return;
  lang=next;
  try{localStorage.setItem(STORAGE,lang)}catch(_){/* no storage available */}
  document.documentElement.lang=lang==='zh'?'zh-CN':lang;
  document.documentElement.dataset.language=lang;
  document.querySelectorAll('.lang-select').forEach(sel=>sel.value=lang);
  translateRunning=true;localizeTree(document.body,true);translateRunning=false;
  document.title=lang==='en'?('EASTBOUND | Eastern Canada '+(location.pathname.includes('planner')?'Trip Planner':location.pathname.includes('vlogs')?'Travel Films':location.pathname.includes('stories')?'Itineraries':location.pathname.includes('place')?'Place Guide':'Travel Guide')):lang==='fr'?('EASTBOUND | Est canadien — '+(location.pathname.includes('planner')?'Planificateur':location.pathname.includes('vlogs')?'Vidéos de voyage':location.pathname.includes('stories')?'Itinéraires':location.pathname.includes('place')?'Guide des lieux':'Guide de voyage')):defaultTitle;
  document.querySelectorAll('meta[name="description"]').forEach(meta=>meta.content=lang==='en'?'Explore Eastern Canada: cities, attractions, restaurants, shopping, travel videos, itineraries and maps.':lang==='fr'?'Découvrez l’Est canadien : villes, sites, restaurants, magasinage, vidéos, itinéraires et cartes.':'探索加拿大东部目的地、餐厅、购物、线路和地图。');
  const mapFrame=document.querySelector('#place-map');
  if(mapFrame?.src){try{
   const url=new URL(mapFrame.src);
   if(url.hostname.includes('google.com')&&url.pathname.includes('/maps/embed/v1/'))url.searchParams.set('language',lang==='zh'?'zh-CN':lang);
   else if(url.hostname.includes('maps.google.com'))url.searchParams.set('hl',lang==='zh'?'zh-CN':lang);
   if(url.href!==mapFrame.src)mapFrame.src=url.href;
  }catch(_){/* no map loaded */}}
  window.dispatchEvent(new CustomEvent('eastbound:languagechange',{detail:{language:lang}}));
 }
 function init(){
  const header=document.querySelector('.site-header .nav, .pheader');
  if(header){
   const wrap=document.createElement('label');wrap.className='lang-control';wrap.dataset.noI18n='true';
   const text=document.createElement('span');text.className='lang-label';text.textContent='Language / Langue / 语言';
   const select=document.createElement('select');select.className='lang-select';select.setAttribute('aria-label','Language / Langue / 语言');
   select.innerHTML='<option value="en">English</option><option value="fr">Français</option><option value="zh">简体中文</option>';
   select.value=lang;select.addEventListener('change',()=>setLanguage(select.value));
   wrap.append(text,select);
   const cta=header.querySelector('.nav-cta, .menu-toggle');
   if(cta)header.insertBefore(wrap,cta);else header.append(wrap);
  }
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  setLanguage(lang);
 }
 window.EASTBOUND_I18N={getLanguage:()=>lang,setLanguage,translate:(s)=>translate(s,null)};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
