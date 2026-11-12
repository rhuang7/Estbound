'use strict';
// Editorial travel information; no live prices, schedules or booking inventory.
const atlasPhoto = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;
const commonsPhoto = name => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1200`;
const ATLANTIC_CITIES = {
  halifax: {name:'哈利法克斯',en:'Halifax',province:'新斯科舍省 · NS',type:'city',label:'大西洋港城',intro:'海滨木栈道、古堡与龙虾，海洋气息扑面而来。',blurb:'沿着历史港口与海滨木栈道，认识加拿大东海岸的航海故事。这里也是探索 Peggy’s Cove 和南岸的理想基地。',photo:commonsPhoto('Halifax Waterfront in Nova Scotia (April 2024).jpg'),url:'https://novascotia.com/',places:['Halifax Waterfront','Citadel National Historic Site','Maritime Museum','Public Gardens','Point Pleasant Park'],min:'2–4 天',search:'Halifax Nova Scotia Canada',weights:{classic:5,nature:3,culture:5,food:5},days:[
    {tag:'港城经典',interest:'classic',title:'在海港与城堡之间散步',stops:[['上午','Halifax Citadel 城堡','俯瞰港口，探索城市军事史；查询季节开放安排'],['下午','海滨木栈道 Halifax Waterfront','沿港口散步，逛市集与海洋相关展馆'],['傍晚','Historic Properties','在海滨老仓库区寻找海鲜晚餐']]},
    {tag:'博物馆与公园',interest:'culture',title:'发现哈利法克斯的另一面',stops:[['上午','Maritime Museum of the Atlantic','了解泰坦尼克号与大西洋航海历史'],['下午','Halifax Public Gardens','在维多利亚式园林慢慢漫步'],['傍晚','Argyle Street','探索餐厅、演出与街区生活']]},
    {tag:'海岸与美食',interest:'food',title:'大西洋海风与好味道',stops:[['上午','Point Pleasant Park','沿树林和海岸线散步'],['下午','Seaport Farmers’ Market 周边','寻找当地烘焙与时令食品；核对营业日'],['傍晚','Downtown 海鲜餐厅','尝试龙虾卷、扇贝或鱼汤']]}
  ]},
  peggys: {name:'佩姬湾',en:'Peggy’s Cove',province:'新斯科舍省 · NS',type:'nature',label:'标志性灯塔',intro:'花岗岩海岸与白色灯塔，风景干净得像一首诗。',blurb:'Peggy’s Cove 是新斯科舍经典海岸风景，常与哈利法克斯安排为一日游。切记远离浪花冲刷的湿滑黑色岩石。',photo:atlasPhoto('photo-1644549632951-0180528c5466'),url:'https://novascotia.com/',places:['Peggy’s Point Lighthouse','Peggy’s Cove 渔村','花岗岩海岸观景','Swissair Flight 111 Memorial'],min:'半日–1 天',search:'Peggy’s Cove Nova Scotia Canada',weights:{classic:4,nature:5,culture:3,food:2},days:[
    {tag:'灯塔海岸',interest:'nature',title:'灯塔、礁石与海风',stops:[['上午','Peggy’s Point Lighthouse','拍摄标志性灯塔，从安全观景区域欣赏海浪'],['下午','Peggy’s Cove 小渔村','看彩色渔屋与海岸景色，喝杯热饮'],['傍晚','返回哈利法克斯或海岸餐厅','建议白天观景后返回，海边注意风浪']]}
  ]},
  lunenburg: {name:'卢嫩堡',en:'Lunenburg',province:'新斯科舍省 · NS',type:'slow',label:'世界遗产小镇',intro:'彩色木屋沿着山坡铺开，像一本立体的航海故事。',blurb:'联合国教科文组织世界遗产古镇，以彩色建筑、渔业历史和滨水风光闻名；适合与 Mahone Bay 同游。',photo:commonsPhoto('Colourful houses in Lunenburg (20278122556).jpg'),url:'https://novascotia.com/',places:['Old Town Lunenburg','Lunenburg Waterfront','Fisheries Museum of the Atlantic','Mahone Bay 三座教堂'],min:'1–2 天',search:'Lunenburg Nova Scotia Canada',weights:{classic:4,nature:3,culture:5,food:4},days:[
    {tag:'彩色小镇',interest:'culture',title:'漫步彩色的航海古城',stops:[['上午','Old Town Lunenburg','拍摄街道与彩色历史房屋'],['下午','Fisheries Museum of the Atlantic','了解渔业、船舶与沿海生活；核对开放季'],['傍晚','Lunenburg Waterfront','在海滨享用当地海鲜']]},
    {tag:'南岸慢游',interest:'nature',title:'小镇与湾岸的慢旅',stops:[['上午','Mahone Bay','欣赏海湾与标志性的三座教堂'],['下午','Lunenburg 画廊街区','漫逛艺廊、工艺店与咖啡馆'],['傍晚','海港日落','放慢脚步观察海上归航的船只']]}
  ]},
  capebreton: {name:'布雷顿角岛',en:'Cape Breton Island',province:'新斯科舍省 · NS',type:'nature',label:'海岸公路',intro:'Cabot Trail 沿山海蜿蜒，是东海岸最惊艳的风景线之一。',blurb:'这不是哈利法克斯附近的短途景点，建议单独安排至少两天，沿 Cabot Trail 探索山海与沿岸小镇。',photo:commonsPhoto('Cabot Trail, Cape Breton (35213049270).jpg'),url:'https://novascotia.com/',places:['Cabot Trail','Cape Breton Highlands National Park','Skyline Trail','Baddeck','Ingonish Beach'],min:'2–4 天',search:'Baddeck Cape Breton Nova Scotia Canada',weights:{classic:4,nature:5,culture:3,food:3},days:[
    {tag:'山海公路',interest:'nature',title:'踏上 Cabot Trail 风景线',stops:[['上午','Baddeck 小镇','在布拉多尔湖附近开始自驾'],['下午','Cabot Trail 沿途观景','沿海岸停留，控制驾驶时间'],['傍晚','Ingonish 一带','就近入住海岸旅馆']]},
    {tag:'高地徒步',interest:'nature',title:'在海岸高地呼吸',stops:[['上午','Cape Breton Highlands National Park','选择适合天气与体力的步道'],['下午','Skyline Trail','查询步道状态与野生动物安全规则'],['傍晚','Chéticamp','体验阿卡迪亚文化与当地美食']]},
    {tag:'湖畔文化',interest:'culture',title:'湖畔、手作与小镇',stops:[['上午','Alexander Graham Bell National Historic Site','了解发明家在此地的故事；核对开放季'],['下午','Bras d’Or Lake','在湖岸景观道路停靠'],['傍晚','Baddeck','在小镇慢慢用餐休息']]}
  ]},
  charlottetown: {name:'夏洛特敦 · 爱德华王子岛',en:'Charlottetown · PEI',province:'爱德华王子岛省 · PE',type:'city',label:'海岛首府',intro:'红土海岸与温柔海风，加拿大海岛生活的起点。',blurb:'夏洛特敦是探索爱德华王子岛的交通与住宿基地，兼有老街、文化活动、海鲜餐厅与港口步道。',photo:commonsPhoto('Charlottetown, Prince Edward Island, Canada.jpg'),url:'https://www.tourismpei.com/places-to-go/charlottetown',places:['Victoria Row','Province House 周边','Confederation Centre of the Arts','Peake’s Wharf','Victoria Park'],min:'2–3 天',search:'Charlottetown Prince Edward Island Canada',weights:{classic:5,nature:3,culture:4,food:5},days:[
    {tag:'岛屿初见',interest:'classic',title:'在夏洛特敦慢慢认识 PEI',stops:[['上午','Victoria Row 与老城区','欣赏历史街道与特色商店'],['下午','Peake’s Wharf 海滨','感受港口景色和岛屿氛围'],['傍晚','Downtown 餐饮街区','品尝 PEI 贻贝、牡蛎或龙虾']]},
    {tag:'历史与文化',interest:'culture',title:'联邦诞生地的故事',stops:[['上午','Province House 周边','了解加拿大联邦历史，内部开放需核对'],['下午','Confederation Centre of the Arts','查询展览或剧场演出档期'],['傍晚','Victoria Park','海岸公园步行及日落']]},
    {tag:'城市与海鲜',interest:'food',title:'港口、咖啡与海岛味道',stops:[['上午','Charlottetown Farmers’ Market','探索当地产物；提前核对市集日'],['下午','市中心独立商铺','在文艺店和咖啡馆小憩'],['傍晚','港口或老城餐厅','尝试海鲜杂烩汤与 PEI 马铃薯料理']]}
  ]},
  cavendish: {name:'卡文迪许 · 绿山墙',en:'Cavendish · Green Gables',province:'爱德华王子岛省 · PE',type:'nature',label:'红沙与文学',intro:'《绿山墙的安妮》的故事，在红沙滩与绿草地间延续。',blurb:'PEI 北岸必游地区，有 Green Gables Heritage Place、国家公园海滩与小渔村；许多项目具有明显季节性。',photo:commonsPhoto('Cavendish Beach, PEI (8669555160).jpg'),url:'https://www.tourismpei.com/places-to-go/green-gables-shore',places:['Green Gables Heritage Place','Cavendish Beach','PEI National Park','North Rustico','French River'],min:'1–2 天',search:'Cavendish Prince Edward Island Canada',weights:{classic:5,nature:5,culture:5,food:3},days:[
    {tag:'安妮的故事',interest:'culture',title:'走进绿山墙的童话',stops:[['上午','Green Gables Heritage Place','参观《绿山墙的安妮》相关历史遗址，核对季节开放'],['下午','Cavendish Beach','看红色砂岩海岸与沙丘，遵守国家公园规则'],['傍晚','North Rustico','到渔港寻找海鲜晚餐']]},
    {tag:'红土与海岸',interest:'nature',title:'沿海风景，一路红沙',stops:[['上午','PEI National Park','选择开放的海岸步道与观景点'],['下午','French River','拍摄田野与色彩鲜明的渔港'],['傍晚','Stanley Bridge','在临海小镇享受慢时光']]}
  ]},
  moncton: {name:'蒙克顿',en:'Moncton',province:'新不伦瑞克省 · NB',type:'city',label:'芬迪湾门户',intro:'通向芬迪湾潮汐奇景与新不伦瑞克沿岸风光。',blurb:'蒙克顿常作为 Hopewell Rocks、芬迪湾和爱德华王子岛的公路中转基地，市区也有河岸步道与餐厅。',photo:commonsPhoto('View of the Moncton, New Brunswick skyline (cropped).jpg'),url:'https://tourismnewbrunswick.ca/',places:['Magnetic Hill','Tidal Bore Park','Downtown Moncton','Hopewell Rocks（近郊）'],min:'1–2 天',search:'Moncton New Brunswick Canada',weights:{classic:3,nature:4,culture:3,food:3},days:[
    {tag:'潮汐之城',interest:'classic',title:'蒙克顿的河岸故事',stops:[['上午','Tidal Bore Park','潮汐涌浪受潮表影响，先查当天预测'],['下午','Downtown Moncton','走访市中心与咖啡街区'],['傍晚','Main Street','尝试当地海鲜与阿卡迪亚料理']]},
    {tag:'近郊探索',interest:'nature',title:'从蒙克顿走向芬迪湾',stops:[['上午','Hopewell Rocks','需按潮时决定观景方式，避免误入危险区域'],['下午','沿芬迪湾景观公路','选择安全的观景与休息点'],['傍晚','返回蒙克顿','享受轻松晚餐']]}
  ]},
  fundy: {name:'芬迪湾 · 霍普韦尔岩',en:'Bay of Fundy · Hopewell Rocks',province:'新不伦瑞克省 · NB',type:'nature',label:'世界级潮差',intro:'退潮时走进海底，涨潮时看海水重回花盆岩。',blurb:'以 Hopewell Rocks 为核心探索芬迪湾奇特潮汐地貌。步行到海床必须遵守现场潮汐与开放指引。',photo:commonsPhoto('Hopewell Rock.jpg'),url:'https://tourismnewbrunswick.ca/',places:['Hopewell Rocks','Fundy National Park','Alma 渔村','Cape Enrage','Alma 海鲜餐厅'],min:'1–2 天',search:'Hopewell Rocks New Brunswick Canada',weights:{classic:5,nature:5,culture:2,food:3},days:[
    {tag:'潮汐奇景',interest:'nature',title:'走近芬迪湾的潮汐',stops:[['上午','Hopewell Rocks','按官方低潮时间安排，开放窗口随季节变化'],['下午','Cape Enrage 或观景点','驾车欣赏湾岸岩石景观'],['傍晚','Alma 渔村','吃海鲜、散步，避开险峻潮位']]},
    {tag:'国家公园',interest:'nature',title:'从潮间带到森林',stops:[['上午','Fundy National Park','根据步道状况选择轻徒步'],['下午','森林与沿海观景','留出充足观景和停车时间'],['傍晚','Alma','在渔村留宿或返回蒙克顿']]}
  ]},
  saintjohn: {name:'圣约翰 · 新不伦瑞克',en:'Saint John · New Brunswick',province:'新不伦瑞克省 · NB',type:'city',label:'港城与潮汐',intro:'历史港城、室内市集和芬迪湾的独特潮流。',blurb:'请留意这是新不伦瑞克省 Saint John，与纽芬兰的 St. John’s 不同。这里有城市老区、著名市集及 Reversing Falls Rapids。',photo:commonsPhoto('Saint John, New Brunswick skyline.jpg'),url:'https://tourismnewbrunswick.ca/',places:['Saint John City Market','Reversing Falls Rapids','Uptown Saint John','Irving Nature Park'],min:'1–2 天',search:'Saint John New Brunswick Canada',weights:{classic:4,nature:3,culture:4,food:5},days:[
    {tag:'港城慢游',interest:'classic',title:'探索圣约翰的历史街区',stops:[['上午','Saint John City Market','品尝小吃，认识古老的室内市场'],['下午','Reversing Falls Rapids','按潮汐时段观察河流与海潮互动'],['傍晚','Uptown Saint John','在历史街区享用晚餐']]},
    {tag:'海岸公园',interest:'nature',title:'在芬迪湾边散步',stops:[['上午','Irving Nature Park','按照天气选择海滨步道'],['下午','港口与旧城区','探索博物馆或本地艺术店'],['傍晚','Uptown 餐厅','尝试海鲜及本地菜肴']]}
  ]},
  stjohns: {name:'圣约翰斯 · 纽芬兰',en:'St. John’s · Newfoundland',province:'纽芬兰与拉布拉多省 · NL',type:'city',label:'北大西洋尽头',intro:'彩色果冻豆房屋、信号山与大西洋的尽头。',blurb:'这是纽芬兰的 St. John’s，不是新不伦瑞克省的 Saint John。海雾、彩色房子、沿海步道和音乐文化是这里的魅力。',photo:commonsPhoto("Jellybean Row Houses of St. John's, Newfoundland.jpg"),url:'https://www.newfoundlandlabrador.com/destinations/st-johns',places:['Signal Hill','Cape Spear Lighthouse','Quidi Vidi Village','The Rooms','Jellybean Row','George Street'],min:'3–5 天',search:"St. John's Newfoundland Canada",weights:{classic:5,nature:5,culture:5,food:5},days:[
    {tag:'彩色港城',interest:'classic',title:'走进北大西洋最东边的城市',stops:[['上午','Signal Hill 与 Cabot Tower','俯瞰港口与海湾，海风大时注意安全'],['下午','Jellybean Row 彩色街道','沿历史社区步行摄影，尊重居民私宅'],['傍晚','George Street','探索现场音乐与纽芬兰本地料理']]},
    {tag:'灯塔与小渔村',interest:'nature',title:'站在大陆东端看海',stops:[['上午','Cape Spear Lighthouse','参观海角与灯塔，留意强风与雾气'],['下午','Quidi Vidi Village','感受小渔村和艺术工作室'],['傍晚','Quidi Vidi / Downtown','品尝鳕鱼、鱼饼或海鲜杂烩汤']]},
    {tag:'博物馆与出海',interest:'culture',title:'海洋故事与当地文化',stops:[['上午','The Rooms','了解纽芬兰历史、艺术与文化'],['下午','Witless Bay 海洋体验（季节性）','按季节和天气预订海鸟或观鲸船，非全年保证'],['傍晚','Water Street','逛店铺、咖啡馆与当地音乐场所']]},
    {tag:'城市之外',interest:'nature',title:'探索阿瓦隆半岛海岸',stops:[['上午','Petty Harbour','在传统渔港欣赏海湾风景'],['下午','East Coast Trail 可达路段','选择符合体力和天气的步道'],['傍晚','返回圣约翰斯','在市中心品尝热腾腾的海鲜餐']]}
  ]},
  bonavista: {name:'博纳维斯塔 · 特里尼蒂',en:'Bonavista & Trinity',province:'纽芬兰与拉布拉多省 · NL',type:'slow',label:'灯塔与海鸟',intro:'悬崖、古老渔村与野生海鸟，藏着岛屿的另一种辽阔。',blurb:'适合从圣约翰斯自驾延伸的东海岸深度线路，往返路程不短，建议留宿而不是匆忙当日折返。',photo:commonsPhoto('Cape Bonavista Lighthouse.JPG'),url:'https://www.newfoundlandlabrador.com/',places:['Cape Bonavista Lighthouse','Trinity Historic Town','Elliston Puffin Viewing Site','Skerwink Trail','Port Rexton'],min:'2–3 天',search:'Bonavista Newfoundland Canada',weights:{classic:4,nature:5,culture:4,food:3},days:[
    {tag:'渔村与灯塔',interest:'nature',title:'沿着海岸驶向灯塔',stops:[['上午','Trinity 古镇','看彩色传统木屋与海港风情'],['下午','Cape Bonavista Lighthouse','在安全观景区欣赏大西洋海岸'],['傍晚','Bonavista 镇','在海边小镇留宿并品尝海鲜']]},
    {tag:'海鸟与步道',interest:'nature',title:'海风里的野生奇遇',stops:[['上午','Elliston 海鹦观赏点','是否见到海鹦取决于季节及自然条件'],['下午','Skerwink Trail','根据天气与步道状态徒步'],['傍晚','Port Rexton / Trinity','回到渔村休息']]}
  ]}
};
const REGIONS = [
  {id:'on',name:'安大略 ON',cities:['toronto','niagara','kingston','ottawa']},
  {id:'qc',name:'魁北克 QC',cities:['montreal','tremblant','quebec','charlevoix']},
  {id:'ns',name:'新斯科舍 NS',cities:['halifax','peggys','lunenburg','capebreton']},
  {id:'pe',name:'爱德华王子岛 PEI',cities:['charlottetown','cavendish']},
  {id:'nb',name:'新不伦瑞克 NB',cities:['moncton','fundy','saintjohn']},
  {id:'nl',name:'纽芬兰 NL',cities:['stjohns','bonavista']}
];
const GPS = {
  toronto:[43.653,-79.383],niagara:[43.09,-79.084],kingston:[44.231,-76.486],ottawa:[45.421,-75.697],
  montreal:[45.501,-73.567],tremblant:[46.118,-74.597],quebec:[46.813,-71.208],charlevoix:[47.441,-70.506],
  halifax:[44.649,-63.575],peggys:[44.493,-63.918],lunenburg:[44.377,-64.311],capebreton:[46.101,-60.754],
  charlottetown:[46.238,-63.131],cavendish:[46.489,-63.38],moncton:[46.087,-64.779],fundy:[45.82,-64.576],
  saintjohn:[45.274,-66.062],stjohns:[47.561,-52.713],bonavista:[48.653,-53.112]
};
// Practical, area-based suggestions. Hotel and restaurant search links are generated at runtime.
const DESTINATION_GUIDES = {
 toronto:{stay:'Downtown / Union Station 交通最便捷；Yorkville 适合博物馆与购物。',eat:'圣劳伦斯市场的熟食；Kensington Market 的多元小吃；Ossington 的晚餐街区。',local:'TTC 地铁/街车覆盖中心区；Toronto Islands 需乘渡轮。',access:'Pearson/ Billy Bishop 航空抵达；VIA Rail 与 GO Transit 连接区域。'},
 niagara:{stay:'瀑布景观区方便夜景；Niagara-on-the-Lake 更适合度假小镇。',eat:'瀑布区餐饮选择多；Niagara-on-the-Lake 可探索本地农场风味。',local:'瀑布核心区可步行，景区接驳车和跨区公交需查班次。',access:'由多伦多可自驾、GO Transit 或部分 VIA Rail 服务抵达。'},
 kingston:{stay:'Kingston 市中心/滨水区适合步行；Gananoque 适合游船出发。',eat:'Kingston 市中心咖啡馆、酒馆及河鲜料理；游船码头附近餐饮。',local:'金斯顿市区有公交；千岛湖多个码头与景点需额外接驳。',access:'VIA Rail 可达 Kingston；Gananoque 码头与火车站并不等同。'},
 ottawa:{stay:'Centretown 交通便利；ByWard Market 方便餐饮夜生活。',eat:'ByWard Market 市集美食、当地烘焙和国际餐厅。',local:'OC Transpo 轻轨及公交；部分景点可步行。',access:'可通过 VIA Rail 从多伦多、蒙特利尔和魁北克方向到达。'},
 montreal:{stay:'Old Montréal 观光氛围浓；Downtown 交通便利；Plateau 更有社区感。',eat:'Jean-Talon Market、Mile End 贝果、特色烟熏肉和法语区小馆。',local:'STM 地铁与公交适合城区出行；山区/国家公园建议另查接驳。',access:'VIA Rail、Trudeau 国际机场及城际巴士连接主要城市。'},
 tremblant:{stay:'Tremblant 步行村方便缆车与餐饮；湖边酒店适合放松。',eat:'山地咖啡馆、魁北克特色料理、步行村餐馆。',local:'山间景区公共交通有限；观光活动和山路季节性明显。',access:'通常由蒙特利尔自驾最便捷；无车需预订巴士/接驳。'},
 quebec:{stay:'Old Québec Upper Town 适合古城步行；Saint-Roch 兼顾美食和性价比。',eat:'小尚普兰街与 Saint-Jean 街的魁北克家常菜、奶酪与烘焙。',local:'RTC 公交覆盖城市；老城多坡道及台阶。',access:'VIA Rail/Orléans Express 可衔接蒙特利尔；机场也有航班。'},
 charlevoix:{stay:'Baie-Saint-Paul 艺术小镇适合过夜；La Malbaie 适合沿河度假。',eat:'当地奶酪、农场食材、河岸小镇餐馆。',local:'乡村景点分散，自驾更灵活。',access:'可从魁北克城自驾；旅游列车及季节项目须核对。'},
 halifax:{stay:'Downtown Waterfront 适合首访与不自驾；North End 更有独立餐厅与咖啡氛围。',eat:'海滨龙虾卷、扇贝、海鲜杂烩汤；Argyle Street 与 North End 餐厅。',local:'Halifax Transit 公交及港口渡轮；Peggy’s Cove 适合自驾或参加一日团。',access:'Halifax Stanfield 国际机场；VIA Rail Ocean 列车可连接蒙特利尔。'},
 peggys:{stay:'多以哈利法克斯为住宿基地；也可选沿岸小型旅馆。',eat:'渔村海鲜小店、鱼汤和当地咖啡馆，冬季营业可能较少。',local:'景点分散，公共交通非常有限，优先自驾/一日团。',access:'从哈利法克斯驾车大约 45–60 分钟，天气会影响行程。'},
 lunenburg:{stay:'Old Town 内的精品旅馆与民宿；水岸一带方便散步。',eat:'Lunenburg 港边海鲜、海鲜杂烩汤、特色甜品。',local:'古镇步行容易；抵达与南岸串联自驾更方便。',access:'由 Halifax 自驾约 1–1.5 小时；班车需单独核实。'},
 capebreton:{stay:'Baddeck 适合作为基地；Ingonish、Chéticamp 适合分段过夜。',eat:'阿卡迪亚料理、海鲜、当地烘焙与沿路小馆。',local:'Cabot Trail 建议自驾，步道和道路可能受天气影响。',access:'Halifax → Baddeck 自驾常需约 4 小时；完整环线需更多时间。'},
 charlottetown:{stay:'Downtown Charlottetown 最方便无车游客；北岸游玩可考虑 Cavendish。',eat:'PEI 牡蛎、贻贝、龙虾与马铃薯料理；Victoria Row 与港口餐厅。',local:'T3 Transit 服务城区；前往北岸班次可能仅季节性。',access:'Charlottetown 机场；陆路经联邦大桥；另有季节性海峡轮渡。'},
 cavendish:{stay:'Cavendish / North Rustico 海岸旅馆适合夏季；不开车可住 Charlottetown。',eat:'North Rustico 龙虾与海鲜；Cavendish 冰淇淋和海滨小吃。',local:'夏季可能有 Charlottetown ↔ Cavendish 公交服务，其他季节需核对。',access:'从 Charlottetown 自驾约 35–45 分钟，桥梁连接 PEI 与新不伦瑞克。'},
 moncton:{stay:'Downtown Moncton 适合市区饮食；Dieppe 靠近部分交通设施。',eat:'阿卡迪亚风味、海鲜和 Main Street 餐厅。',local:'市区有 Codiac Transpo；前往 Hopewell Rocks 宜租车/团游。',access:'机场、Maritime Bus 与高速公路连接东海岸城市。'},
 fundy:{stay:'Alma 适合贴近国家公园；Moncton 适合当天往返。',eat:'Alma 的龙虾、鱼和海鲜杂烩汤；部分餐厅季节性营业。',local:'潮位决定可否下海床；景点分散，自驾或一日团更合适。',access:'从 Moncton 前往 Hopewell Rocks 自驾通常约 40–50 分钟。'},
 saintjohn:{stay:'Uptown Saint John 便于逛市集和历史街区；海港周边适合城市漫游。',eat:'Saint John City Market 小吃、港口海鲜、Uptown 餐厅。',local:'市内公交覆盖部分区域；海边公园往往需要车辆。',access:'可通过公路/巴士连接 Moncton、Fredericton；无直达 VIA Rail。'},
 stjohns:{stay:'Downtown / Water Street 适合步行、餐饮；Quidi Vidi 靠近渔村景致。',eat:'纽芬兰鳕鱼、鱼饼、海鲜杂烩汤、当地传统烘焙；Water Street 和 George Street。',local:'市中心步行有坡道；Cape Spear、Witless Bay 推荐租车或报团。',access:'St. John’s 国际机场 YYT；从加拿大大陆可搭飞机，轮渡不直接抵达市中心。'},
 bonavista:{stay:'Bonavista 与 Trinity 可选小型旅馆和 B&B；旺季建议预订。',eat:'渔村海鲜、鳕鱼与当地烘焙小店。',local:'分散乡村及海岸步道，基本需要自驾；观鸟依季节和天气。',access:'从 St. John’s 自驾一般约 3.5–4.5 小时；不建议匆忙一日往返。'}
};
const RESOURCE_LINKS = [
 ['VIA Rail 加拿大铁路','https://www.viarail.ca/en/explore-our-destinations/trains/ontario-and-quebec'],
 ['Maritime Bus 海洋省巴士','https://maritimebus.com/'],
 ['Confederation Bridge 联邦大桥','https://www.confederationbridge.com/getting-here/'],
 ['PEI ↔ NS 轮渡','https://www.ferries.ca/ns-pei-ferry/schedule'],
 ['Marine Atlantic 纽芬兰轮渡','https://www.marineatlantic.ca/sailing-information/sailing-routes'],
 ['新斯科舍旅游局','https://novascotia.com/'],
 ['爱德华王子岛旅游局','https://www.tourismpei.com/'],
 ['纽芬兰与拉布拉多旅游局','https://www.newfoundlandlabrador.com/'],
 ['新不伦瑞克旅游局','https://tourismnewbrunswick.ca/']
];
