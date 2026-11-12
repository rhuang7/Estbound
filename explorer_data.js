'use strict';
// Editor-curated attraction recommendations. Duration is an approximate on-site allowance, not an opening-hours claim.
// [name, kind, time, description, travelTip]
const EXTRA_SPOTS = {
  toronto:[
    ['安大略美术馆 AGO','culture','2–3 小时','加拿大和国际艺术收藏，适合雨天与艺术爱好者。','建议查看特别展览与门票预约'],
    ['卡萨罗马 Casa Loma','culture','2 小时','城市山坡上的哥特复兴式城堡与历史室内展陈。','节庆活动可能影响参观范围'],
    ['士嘉堡断崖 Scarborough Bluffs','nature','1–2 小时','安大略湖畔的壮观峭壁与自然观景空间。','仅走正式开放步道，勿靠近悬崖边缘'],
    ['High Park 高地公园','nature','1–2 小时','步道、池塘与绿地，春季赏樱广受欢迎。','花期随天气变化'],
    ['Bata 鞋履博物馆','culture','1–2 小时','用鞋履设计探索不同地区的历史与日常文化。','可与 ROM 安排在同一天']
  ],
  niagara:[
    ['Journey Behind the Falls','classic','1–2 小时','从近距离体验瀑布水雾与巨大的水流声。','冬季与季节性平台可能受限'],
    ['Niagara Parks Power Station','culture','1.5–2 小时','历史水力发电站与河谷工程故事。','隧道及特展开放以官方为准'],
    ['White Water Walk','nature','1 小时','在尼亚加拉河急流旁的河谷木栈道漫步。','活动可能季节性运营'],
    ['Niagara Glen 自然保护区','nature','2–3 小时','沿峡谷林地与岩石地形徒步。','湿滑岩面及台阶需谨慎'],
    ['Butterfly Conservatory 蝴蝶馆','family','1–1.5 小时','热带温室中的蝴蝶与植被。','适合亲子及天气不佳时']
  ],
  kingston:[
    ['Bellevue House 国家历史遗址','culture','1–1.5 小时','认识加拿大早期政治人物与十九世纪生活。','按 Parks Canada 季节公告开放'],
    ['Kingston City Hall 市政厅','culture','45 分钟','经典石砌建筑及市中心历史步行路线。','内部导览需核对'],
    ['Thousand Islands National Park','nature','半天','岛屿、河岸风景及短途自然探索。','岛屿登陆需合适船只和开放安排'],
    ['Gananoque Waterfront','slow','1–2 小时','河畔小镇、码头与悠闲的午餐时光。','游船码头分布不同，提前确认'],
    ['Martello Towers','culture','1 小时','金斯顿滨水的历史防御建筑。','部分仅适合外观参观']
  ],
  ottawa:[
    ['加拿大战争博物馆','culture','2–3 小时','了解加拿大军事历史及其社会影响。','常设与特别展内容可能调整'],
    ['加拿大自然博物馆','family','2 小时','自然历史、化石与生物多样性展览。','适合亲子和雨天'],
    ['Major’s Hill Park','nature','1 小时','从河岸绿地欣赏老城区与城市天际线。','适合与 ByWard Market 串联'],
    ['Dow’s Lake','nature','1–2 小时','春季郁金香季和夏季湖畔慢游地点。','季节体验依花期及天气变化'],
    ['Diefenbunker 冷战博物馆','culture','2–3 小时','特别的地下冷战历史遗址，位于城市西郊。','需要额外交通时间']
  ],
  montreal:[
    ['蒙特利尔美术馆 MMFA','culture','2–3 小时','从经典作品到当代展览的多样艺术体验。','留意特展票务'],
    ['Atwater Market','food','1–2 小时','运河附近的本地农产品与食品市场。','部分摊位季节性'],
    ['Saint Joseph’s Oratory','culture','1–2 小时','坐落在皇家山的宏伟宗教建筑与观景地。','内部礼仪空间请保持安静'],
    ['Lachine Canal','nature','1–2 小时','适合散步、骑车与河岸休闲的线性绿地。','冬季骑行和季节租赁需核查'],
    ['Pointe-à-Callière 考古历史博物馆','culture','2 小时','通过考古展示蒙特利尔城市起源。','可与老城一起规划']
  ],
  tremblant:[
    ['Tremblant Lake 湖景步道','nature','1–2 小时','在山湖之间散步，欣赏不同季节的林地色彩。','湖岸步道状况随天气变化'],
    ['Domaine Saint-Bernard','nature','2–3 小时','森林保护地和不同难度的自然路线。','部分活动需购票或登记'],
    ['Tremblant 山顶观景','nature','半天','天气良好时欣赏劳伦琴山区层叠景观。','缆车运营及能见度需核实'],
    ['Vieux-Tremblant 老村','slow','1–2 小时','比度假步行村更安静的社区氛围。','适合安排午餐和咖啡'],
    ['Lac Mercier','nature','1 小时','湖边散步或短暂的摄影停留。','切勿在未确认的冰面活动']
  ],
  quebec:[
    ['魁北克古城城墙','culture','1–2 小时','沿城墙与城门认识北美法语历史古城。','冬季步道可能结冰'],
    ['文明博物馆 Musée de la civilisation','culture','2–3 小时','展现魁北克社会、历史与文化的博物馆。','适合雨天及家庭'],
    ['圣安妮大教堂 Sainte-Anne-de-Beaupré','culture','1–1.5 小时','位于魁北克城东北的著名宗教建筑。','需要安排城外交通'],
    ['Parc de la Chute-Montmorency','nature','1.5–2 小时','不同观景角度欣赏蒙莫朗西瀑布。','缆车和步道可能季节性调整'],
    ['Québec–Lévis Ferry 观景','slow','1 小时','乘渡轮从圣劳伦斯河上回望古城轮廓。','查阅 STQ 官方当天船班']
  ],
  charlevoix:[
    ['Le Massif de Charlevoix','nature','半天','冬季滑雪与其他季节的山河眺望。','项目和缆车按季节开放'],
    ['Isle-aux-Coudres','slow','半天至一天','岛屿乡村道路、河景与传统村庄。','需安排前往岛上的轮渡及开车时间'],
    ['Parc national des Hautes-Gorges','nature','半天至一天','壮阔河谷、步道与高地观景。','季节开放与接驳需查询 Sépaq'],
    ['La Malbaie 河畔','slow','1–2 小时','沿圣劳伦斯河欣赏宁静的河岸度假风景。','适合沿线留宿'],
    ['Baie-Saint-Paul 艺术画廊街','culture','1–2 小时','小镇画廊、设计与地方艺术氛围。','部分画廊有独立营业时间']
  ],
  halifax:[
    ['Halifax Citadel 国家历史遗址','culture','2 小时','俯瞰市区的星形要塞与历史展示。','季节演示活动须核实'],
    ['Canadian Museum of Immigration at Pier 21','culture','2 小时','通过移民故事认识加拿大多元社会。','适合与海滨市场串联'],
    ['Maritime Museum of the Atlantic','culture','1.5–2 小时','海事历史、航运与大西洋故事。','部分展陈会轮换'],
    ['Point Pleasant Park','nature','1–2 小时','沿海林地和海港入口的散步路线。','大风天气注意海岸安全'],
    ['Halifax Public Gardens','nature','1 小时','精致的维多利亚时代城市花园。','季节性开放时间会调整']
  ],
  peggys:[
    ['Polly’s Cove 徒步观景','nature','1–2 小时','从相对开阔的海岸地形远眺灯塔海湾。','没有完整设施，请评估天气与路况'],
    ['Swissair Flight 111 Memorial','culture','30 分钟','安静的海岸纪念地点。','保持尊重与安静'],
    ['Indian Harbour','slow','1 小时','沿渔港看彩色船屋和岩石海岸。','部分港区为私人工作区域'],
    ['St. Margaret’s Bay 海景公路','nature','1–2 小时','适合将多个小海湾串联的沿海景观。','靠合法观景停车区停车'],
    ['Peggy’s Cove 游客中心','family','30–45 分钟','了解海岸社区与安全步行区域。','请勿踩踏浪打湿的黑色岩石']
  ],
  lunenburg:[
    ['Fisheries Museum of the Atlantic','culture','1.5–2 小时','认识大西洋渔业与海洋社区生活。','展馆营业时间需核对'],
    ['Bluenose II 停靠码头','culture','30–60 分钟','有机会看到具有代表性的帆船。','船舶不保证每日在港'],
    ['Mahone Bay 三教堂','slow','1–2 小时','海湾边经典村镇风景与创意小铺。','适合与卢嫩堡连游'],
    ['Hirtle’s Beach','nature','1–2 小时','开阔沙滩和海风，适合自然摄影。','潮汐与天气会影响海滩体验'],
    ['Gaff Point Trail','nature','2–3 小时','相邻海滩起步的海岬步道。','注意潮位、湿滑及步道状况']
  ],
  capebreton:[
    ['Cape Breton Highlands 国家公园','nature','半天至一天','山地、海岸与典型大西洋自然景观。','路段及步道易受天气影响'],
    ['Fortress of Louisbourg','culture','3–4 小时','大规模重建的十八世纪法式堡垒历史遗址。','导览和演出可能季节性'],
    ['Alexander Graham Bell Museum','culture','1.5–2 小时','在 Baddeck 探索发明与通信历史。','建议查询开放时间'],
    ['Ingonish Beach','nature','1–2 小时','山海交汇的海滩和户外散步地点。','海水温度及浪况需注意'],
    ['Chéticamp 阿卡迪亚文化社区','slow','2 小时','艺术、音乐和阿卡迪亚文化的小镇体验。','餐厅与演出季节性明显']
  ],
  charlottetown:[
    ['Province House 外观及周边','culture','45 分钟','见证加拿大联邦历史的重要地点。','建筑施工和内部开放情况需查询'],
    ['Confederation Centre of the Arts','culture','1–2 小时','当地展览及艺术演出空间。','演出需单独订票'],
    ['Victoria Park 海滨步道','nature','1 小时','沿河湾与海岸散步的休闲公园。','适合日落前后'],
    ['Peake’s Wharf','food','1–2 小时','海滨商铺、美食和港口风景。','部分商铺夏季营业'],
    ['Beaconsfield Historic House','culture','1 小时','了解岛上历史宅邸与生活方式。','以官方开放公告为准']
  ],
  cavendish:[
    ['Green Gables Heritage Place','culture','2 小时','走进《绿山墙的安妮》相关文学景观。','季节性开放请看 Parks Canada'],
    ['Cavendish Beach','nature','1–2 小时','PEI 典型沙丘与海岸沙滩。','遵守沙丘保护规定'],
    ['Greenwich PEI National Park','nature','半天','特色沙丘、浮桥和海岸自然步道。','距 Cavendish 较远，需要独立驾车时间'],
    ['North Rustico Harbour','slow','1–2 小时','小渔港、彩色建筑和海鲜餐厅。','码头有作业车辆，注意安全'],
    ['Brackley Beach','nature','1–2 小时','延伸的沙滩与海岸观景空间。','受风浪及季节影响']
  ],
  moncton:[
    ['Magnetic Hill','family','45 分钟','蒙克顿知名的视觉错觉体验区。','沿现场交通标识安全体验'],
    ['Tidal Bore Park','nature','45 分钟','观看佩蒂科迪亚克河潮涌的地点。','准确潮涌时间应查询当地预测'],
    ['Shediac 巨型龙虾雕塑','family','1 小时','拍照并探索海边龙虾文化的小镇地标。','可与海滨餐饮搭配'],
    ['Parlee Beach','nature','1–2 小时','适合夏季海滨休闲的沙滩。','按季节及水质公告决定下水'],
    ['Resurgo Place','culture','1.5 小时','当地历史、科学与城市故事展馆。','部分互动项目需要预约']
  ],
  fundy:[
    ['Fundy National Park','nature','半天至一天','瀑布、森林及受潮汐影响的海岸步道。','步道和营地可能季节性关闭'],
    ['Cape Enrage','nature','2 小时','海岸灯塔、崖壁和辽阔芬迪湾视野。','请遵守崖边及设施安全规则'],
    ['Dickson Falls Trail','nature','1–2 小时','国家公园内的林地与瀑布栈道。','雨后可能湿滑'],
    ['Alma Village','food','1–2 小时','海湾小镇和特色海鲜餐饮。','营业时间随季节变化'],
    ['Hopewell Rocks 海床体验','nature','2 小时','低潮时有机会下到海床看岩柱。','必须确认潮汐和海床开放时间']
  ],
  saintjohn:[
    ['Saint John City Market','food','1 小时','历史悠久的室内市集与当地食品。','市场各商户营业时间不同'],
    ['New Brunswick Museum','culture','1.5–2 小时','认识新不伦瑞克的自然和文化历史。','核实展馆具体地址及开放状态'],
    ['King’s Square','culture','45 分钟','城市历史公园和经典建筑周边。','适合与市集步行串联'],
    ['Fundy Trail Parkway','nature','半天','沿芬迪湾欣赏层叠海岸景观。','季节开放，需自驾'],
    ['Carleton Martello Tower','culture','45 分钟','海港一侧的历史防御遗址。','部分区域可能维护或关闭']
  ],
  stjohns:[
    ['Johnson GEO CENTRE','culture','1.5–2 小时','地质、地球科学与当地自然史展示。','适合与 Signal Hill 搭配'],
    ['Bowring Park','nature','1–2 小时','宁静公园、河流及城市绿地。','从市中心需额外交通'],
    ['Fort Amherst 海港观景','nature','45 分钟','从港口另一侧欣赏 Signal Hill 和灯塔。','沿狭窄道路小心行驶'],
    ['Petty Harbour 渔村','slow','1–2 小时','传统渔业社区和彩色海湾建筑。','尊重私人码头和作业区域'],
    ['Witless Bay Ecological Reserve','nature','半天','季节性海鸟与观鲸体验的知名海域。','需通过合规运营商并视天气出航']
  ],
  bonavista:[
    ['Elliston 海鹦观赏区','nature','1–2 小时','在适当季节有机会近距离观察海鹦。','保持安全距离，不保证见到野生动物'],
    ['Skerwink Trail','nature','2–3 小时','海岸岩柱与壮阔步道景观。','强风雾天不要靠近崖边'],
    ['Port Union Historic District','culture','1 小时','了解纽芬兰工会与渔业城镇的历史。','部分建筑为社区空间'],
    ['Bonavista Lighthouse','culture','1–1.5 小时','海岬灯塔与传统海岸风光。','部分室内参观季节开放'],
    ['Dungeon Provincial Park','nature','45 分钟','奇特海蚀地形与崖岸风景。','保持在安全观景区域']
  ]
};
// [place, category, recommendedFind, intro] - navigational suggestions; not live inventory or endorsements.
const SHOPPING_GUIDES = {
 toronto:[['CF Toronto Eaton Centre','百货与品牌','时装与美妆','市中心大型购物中心，交通便利。'],['Yorkville / Bloor Street','精品奢侈','精品和设计师品牌','适合精致购物与咖啡漫游。'],['Kensington Market','创意小店','复古服饰与独立商铺','多元文化街区，适合慢逛。']],
 niagara:[['Niagara-on-the-Lake Queen Street','小镇手信','糖果、地方工艺品','老街适合边散步边寻访小店。'],['Outlet Collection at Niagara','折扣购物','运动服饰与品牌','如有自驾时间可考虑。']],
 kingston:[['Princess Street Kingston','独立商店','书店与生活杂货','金斯顿市中心步行购物街。'],['Gananoque Downtown','小镇精品','工艺品与地方礼品','可与千岛湖岸观光搭配。']],
 ottawa:[['ByWard Market','市集与美食','加拿大地方伴手礼','小吃与小店集中区域。'],['CF Rideau Centre','百货与品牌','服装、护肤品','位于市中心，适合天气不佳时。']],
 montreal:[['Sainte-Catherine Street','百货与品牌','时装与百货','市中心购物主轴，交通便利。'],['Mile End Boutiques','设计师小店','服饰、独立品牌','适合体验当地创意设计。'],['Jean-Talon Market','地方风味','枫糖、农产与点心','带走魁北克的美食记忆。']],
 tremblant:[['Tremblant Pedestrian Village','户外休闲','户外服饰、纪念品','山间步行村内集中购物区。'],['Vieux-Tremblant Shops','地方精品','生活杂货与手工艺','购物密度不高，但适合慢逛。']],
 quebec:[['Rue du Petit-Champlain','手工艺与精品','工艺品、法语区小礼物','历史街巷里的本地创意商铺。'],['Rue Saint-Jean','独立商店','书店、服饰和食品','可将购物与餐饮连在一起。'],['Quartier du Petit Champlain','本地设计','魁北克本地品牌','步行便利，可探索不同小店。']],
 charlevoix:[['Baie-Saint-Paul Galleries','艺术作品','本地绘画与工艺品','艺术小镇非常适合逛画廊。'],['La Malbaie Boutiques','地方风味','奶酪、手作与农产','可结合圣劳伦斯河岸自驾。']],
 halifax:[['Halifax Seaport Farmers’ Market','本地市集','海盐、烘焙及手工艺','周末市集，出发前检查营业时间。'],['Halifax Waterfront','海滨商铺','海洋主题手信','港口边的商店和咖啡点。'],['North End Halifax','独立设计','本地品牌、唱片与书籍','文化气息浓，值得花半天慢逛。']],
 peggys:[['Peggy’s Cove Village Shops','渔村纪念','灯塔主题工艺品','小型店铺部分季节营业。'],['St. Margaret’s Bay Artisans','本地手作','绘画与海岸摄影','沿湾岸探访地方创作者。']],
 lunenburg:[['Lunenburg Waterfront Shops','工艺小店','航海主题手信','港口街区的当地商铺。'],['Mahone Bay Main Street','家居与手作','陶艺、织物与生活用品','适合摄影、购物和咖啡。']],
 capebreton:[['Chéticamp Artisan Shops','阿卡迪亚手作','传统钩毯、纺织','具有地域文化的工艺体验。'],['Baddeck Village Shops','小镇生活','书店与当地纪念品','适合作为 Cabot Trail 旅程的补给站。']],
 charlottetown:[['Victoria Row','岛屿手作','本地珠宝、针织与礼品','鹅卵石街道集中独立商铺。'],['Peake’s Wharf Shops','港口购物','海洋主题纪念品','夏季购物与吃海鲜两不误。'],['PEI Craft Council Gallery','地方艺术','艺术家陶艺与手工艺','支持岛上工艺创作者。']],
 cavendish:[['Cavendish Village','乡村手信','《绿山墙的安妮》主题','旅游商店常有季节性。'],['North Rustico Artisan Shops','渔村手作','摄影、陶艺与海洋工艺','适合海边午餐之后逛逛。']],
 moncton:[['Downtown Moncton Main Street','社区商店','特色咖啡和地方商品','沿主街探索本地小店。'],['Dieppe Market','本地市集','阿卡迪亚食品和农产','出发前核实开市时间。']],
 fundy:[['Alma Village Shops','海滨手信','当地海盐和小型工艺','国家公园附近的补给小镇。'],['Hopewell Cape Gift Shops','自然主题','地质与海湾纪念品','景区商店可能季节性营业。']],
 saintjohn:[['Saint John City Market','本地市集','海鲜、食品与工艺品','历史建筑内集中地方商户。'],['Uptown Saint John','独立商店','本地设计与古董','历史街区适合步行购物。']],
 stjohns:[['Water Street','地方品牌','本地手作、书籍','彩色港城的主要历史购物街。'],['Duckworth Street','精品小店','艺术、工艺及户外用品','可与咖啡和餐饮安排在一起。'],['Quidi Vidi Artisan Studios','艺术手作','陶艺、摄影与纺织','开放安排可能季节性。']],
 bonavista:[['Bonavista Town Shops','渔村礼物','当地手工艺与海洋纪念','乡村商店营业受季节影响。'],['Trinity Art Studios','艺术与生活','画作与纺织品','以古镇漫游为主，购物为辅。']]
};
const RENTAL_PORTALS = [
 {name:'Hertz',url:'https://www.hertz.ca/rentacar/reservation/',subtitle:'加拿大官网预订',info:'可查看机场及城市网点，核对异地还车、驾驶员年龄与额外费用。'},
 {name:'Enterprise',url:'https://www.enterprise.ca/en/car-rental.html',subtitle:'加拿大官网预订',info:'适合比较机场和市区取车点，注意不同门店的取还车时间。'},
 {name:'租租车 Zuzuche',url:'https://www.zuzuche.com/',subtitle:'中文租车比价平台',info:'支持中文界面比较不同供应商；下单前核对保险及跨省／轮渡条款。'}
];
const FERRY_GUIDES = [
 {id:'pei',name:'新斯科舍 ↔ 爱德华王子岛',line:'Caribou, NS ↔ Wood Islands, PEI',duration:'约 75 分钟',season:'具体开航日与班次见官方时刻表',operator:'Northumberland Ferries',url:'https://www.ferries.ca/ns-pei-ferry/schedule',booking:'https://www.ferries.ca/ns-pei-ferry',pointA:[45.75,-62.66],pointB:[45.95,-62.75],note:'可载车辆及步行旅客；车辆提前办理检票，建议预订。PEI 另可经联邦大桥进出。'},
 {id:'fundy',name:'芬迪湾：新不伦瑞克 ↔ 新斯科舍',line:'Saint John, NB ↔ Digby, NS',duration:'约 2 小时 15–30 分钟',season:'全年服务，时刻随日期调整',operator:'Bay Ferries · MV Fundy Rose',url:'https://www.ferries.ca/nb-ns-ferry/schedule',booking:'https://www.ferries.ca/nb-ns-ferry',pointA:[45.27,-66.06],pointB:[44.62,-65.76],note:'可携车跨越芬迪湾；抵达 Digby 后继续到 Halifax 仍需公路交通。'},
 {id:'nlwest',name:'纽芬兰西岸：全年航线',line:'North Sydney, NS ↔ Port aux Basques, NL',duration:'约 7 小时',season:'全年运营，天气可能导致延误',operator:'Marine Atlantic',url:'https://www.marineatlantic.ca/sailing-information/sailing-routes',booking:'https://www.marineatlantic.ca/sailing-information/schedule',pointA:[46.21,-60.24],pointB:[47.57,-59.15],note:'Port aux Basques 位于纽芬兰西南端，距离圣约翰斯非常远；不可按短途转场规划。'},
 {id:'nleast',name:'纽芬兰东岸：季节性航线',line:'North Sydney, NS ↔ Argentia, NL',duration:'约 16.5 小时',season:'通常夏季至初秋，具体日期以当年公布为准',operator:'Marine Atlantic',url:'https://www.marineatlantic.ca/sailing-information/sailing-routes',booking:'https://www.marineatlantic.ca/sailing-information/schedule',pointA:[46.21,-60.24],pointB:[47.31,-53.99],note:'Argentia 比 Port aux Basques 更接近 St. John’s；仍需安排到市区的公路接驳和住宿缓冲。'},
 {id:'levis',name:'魁北克城城市观景渡轮',line:'Québec City ↔ Lévis',duration:'约 12 分钟',season:'通常全年，班次以 STQ 公告为准',operator:'Société des traversiers du Québec',url:'https://www.traversiers.com/en/our-ferries/quebec-city-levis-ferry/',booking:'https://www.traversiers.com/en/',pointA:[46.813,-71.202],pointB:[46.806,-71.174],note:'适合步行观光与眺望老城轮廓，并不是通往纽芬兰的交通。'},
 {id:'coudres',name:'夏洛瓦：河心岛渡轮',line:'Saint-Joseph-de-la-Rive ↔ Isle-aux-Coudres, QC',duration:'约 15 分钟',season:'查询 STQ 当日班次；无需提前订位',operator:'Société des traversiers du Québec',url:'https://www.traversiers.com/en/our-ferries/lisle-aux-coudres-saint-joseph-de-la-rive-ferry/schedule/',booking:'https://www.traversiers.com/en/our-ferries/lisle-aux-coudres-saint-joseph-de-la-rive-ferry/fares',pointA:[47.45,-70.38],pointB:[47.39,-70.38],note:'从夏洛瓦前往 Isle-aux-Coudres；这条线路无需预订，允许带车。留意码头车流与季节安排。'},
 {id:'tadoussac',name:'塔杜萨克：圣劳伦斯河渡轮',line:'Baie-Sainte-Catherine ↔ Tadoussac, QC',duration:'约 10 分钟',season:'以 STQ 当日班次和公告为准',operator:'Société des traversiers du Québec',url:'https://www.traversiers.com/en/our-ferries/tadoussac-baie-sainte-catherine-ferry/schedule/',booking:'https://www.traversiers.com/en/our-ferries/tadoussac-baie-sainte-catherine-ferry/fares/',pointA:[48.10,-69.73],pointB:[48.14,-69.72],note:'用于前往 Tadoussac 观鲸区的跨河交通，航程短，但排队及跨区驾车另计。'},
 {id:'islands',name:'多伦多群岛观光渡轮',line:'Jack Layton Terminal ↔ Toronto Islands',duration:'约 15 分钟（视航线）',season:'全年有服务，冬季航线缩减',operator:'City of Toronto',url:'https://www.toronto.ca/explore-enjoy/toronto-island-ferries/ferry-routes-schedules/',booking:'https://www.toronto.ca/explore-enjoy/toronto-island-ferries/',pointA:[43.64,-79.376],pointB:[43.62,-79.37],note:'冬季主要前往 Ward’s Island；不应假定全年都有 Centre Island 班次。'}
];
