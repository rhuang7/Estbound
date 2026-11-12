'use strict';
// Original Chinese editorial itinerary summaries inspired by linked published routes.
// No source article or traveler post is reproduced verbatim; links point to originals.
const STORY_ROUTES = [
  {
    id:'toronto-weekend', source:'马蜂窝', type:'旅行者分享', author:'寻常 · 多伦多3日游（2015）',
    url:'https://www.mafengwo.cn/schedule/776641.html', sourceNote:'根据马蜂窝用户「寻常」公开的多伦多三日行程重新分配参观顺序；把瀑布留作整日，避免市区与瀑布赶场。',
    title:'多伦多城市初见', subtitle:'一座大城，一座瀑布，三天刚刚好。', days:3, area:'安大略', themes:['城市','短途'], cover:'toronto',
    route:['多伦多','尼亚加拉瀑布','多伦多'], best:'春末—秋季；瀑布船有季节性', transport:'多伦多市内步行与公交；瀑布可自驾或查询城际交通',
    highlights:'CN 塔 · 多伦多大学 · 尼亚加拉瀑布 · 圣劳伦斯市场',
    schedule:[
      ['多伦多','从湖滨认识城市','抵达后先走 Harbourfront，再去 CN 塔周边看天际线；傍晚在湖畔或市中心吃晚餐。'],
      ['尼亚加拉瀑布','把一整天留给水声','前往瀑布区观景，留意游船运行季节；时间充裕时沿 Niagara Parkway 看河谷或逛湖滨小镇。'],
      ['多伦多','博物馆与街区生活','参观多伦多大学周边与皇家安大略博物馆，下午在圣劳伦斯市场或古酿酒厂区收尾。']
    ]
  },
  {
    id:'fall-ontario-quebec', source:'Tripadvisor', type:'旅行者论坛', author:'Florabelle21 · Eastern Canada itinerary',
    url:'https://www.tripadvisor.ca/ShowTopic-g155019-i55-k15412022-Eastern_Canada_itinerary-Toronto_Ontario.html', sourceNote:'基于 Tripadvisor 用户公开发布的九日秋季自驾草案做中文摘要；原帖为待讨论的计划，并非已验证的实走游记。',
    title:'枫叶季的安省与魁省', subtitle:'从大瀑布到古城，让秋色一路接力。', days:9, area:'安大略 / 魁北克', themes:['秋色','自驾'], cover:'tremblant',
    route:['多伦多','尼亚加拉','爱德华王子县','渥太华','翠湖山庄','魁北克城','蒙特利尔','多伦多'], best:'9 月底—10 月，叶色随天气波动', transport:'建议自驾；跨城驾驶和返程日需预留时间',
    highlights:'Niagara Parkway · Sandbanks · Gatineau Park · Mont-Tremblant',
    schedule:[
      ['多伦多','城市抵达','抵达后先调整节奏，在湖滨或 High Park 轻松散步，住多伦多。'],
      ['尼亚加拉','瀑布与湖畔葡萄园','沿瀑布公园走访观景点，下午可前往 Niagara-on-the-Lake 小镇。'],
      ['爱德华王子县','沙丘与湖岸小镇','向东经安大略湖岸行驶，参观 Sandbanks 附近风景，住 Picton 或 Wellington。'],
      ['渥太华','河谷秋色','驶往首都区，下午根据天气去 Gatineau Park 步道或观景台。'],
      ['翠湖山庄','劳伦琴山脉','开车进入 Laurentians，搭乘季节性缆车或漫步步道观赏山色。'],
      ['魁北克城','圣劳伦斯河谷','沿河谷前往魁北克城，傍晚在老城石板街漫步。'],
      ['魁北克城','古城和瀑布','深度游览芳堤娜城堡周边、小香普兰街，视开放情况前往蒙莫朗西瀑布。'],
      ['蒙特利尔','山景与旧港','返回蒙特利尔，皇家山、旧港和街区咖啡馆是适合秋天的组合。'],
      ['多伦多','途经金斯顿返程','分段驾车回多伦多，在金斯顿休息；如果有航班务必预留拥堵缓冲。']
    ]
  },
  {
    id:'quebec-12', source:'Lonely Planet', type:'编辑策划', author:'Lonely Planet · 12 Days in Quebec',
    url:'https://www.lonelyplanet.com/journeys/itineraries/4eac88f6-9fb0-42d6-ab8c-430fb3bc43eb', sourceNote:'参考 Lonely Planet 的魁北克十二日主题行程，本站按地区串联成原创逐日阅读摘要；不是其付费服务的完整原文。',
    title:'魁北克十二日深度慢旅', subtitle:'城市艺术、山林步道与法语小镇交替出现。', days:12, area:'魁北克', themes:['文化','自然'], cover:'quebec',
    route:['蒙特利尔','劳伦琴山脉','蒙特朗布朗','毛里西','魁北克城','夏洛瓦','东部乡镇','蒙特利尔'], best:'夏季徒步或秋季赏叶；部分乡村活动季节性', transport:'建议自驾，部分山区和乡间无法依赖城市公交',
    highlights:'老蒙特利尔 · 翠湖国家公园 · 毛里西 · 老魁北克 · 夏洛瓦',
    schedule:[
      ['蒙特利尔','旧港与蒙特利尔式早餐','漫步旧港、旧城街巷，在咖啡馆开始法语城市体验。'],
      ['劳伦琴山脉','从城市进入森林','朝 Laurentides 出发，沿途停留山间市集与观景点。'],
      ['蒙特朗布朗','国家公园自然日','在 Mont-Tremblant National Park 选择徒步或湖上活动；依天气和许可调整。'],
      ['毛里西','驶向宁静湖区','前往 Mauricie 地区，以林间短步道、湖泊和小镇停留为主。'],
      ['毛里西','森林里的慢生活','留一天轻徒步、骑行或水疗，不安排赶路。'],
      ['魁北克城','穿过圣劳伦斯河谷','转往魁北克城，下午去旧城城墙与 Dufferin Terrace 散步。'],
      ['魁北克城','老城历史一整天','探索小香普兰街、Place Royale 与城堡周边，适合加入导览。'],
      ['夏洛瓦','河岸与乡村风味','沿圣劳伦斯河北岸驶入 Charlevoix，停留 Baie-Saint-Paul 一带。'],
      ['夏洛瓦','山海之间','依据季节安排观景步道、画廊或河口赏鲸相关活动。'],
      ['东部乡镇','酒庄与手作路线','转往 Eastern Townships，选择一两座乡镇和当地农庄，长车程建议分段。'],
      ['东部乡镇','慢游乡镇与湖区','把时间留给步行街、湖滨、农场店和咖啡馆。'],
      ['蒙特利尔','返程与最后一顿早午餐','回到蒙特利尔，视交通状况安排机场或火车站接驳。']
    ]
  },
  {
    id:'atlantic-14', source:'Lonely Planet', type:'编辑策划', author:'Lonely Planet · 14 Days in Atlantic Canada',
    url:'https://www.lonelyplanet.com/journeys/itineraries/0b40b4bd-2332-4caf-b4e4-150a1dc9a903', sourceNote:'参考其公开的十四日海洋三省路线和沿途城市，本站以原创中文说明整理每日主题；原站部分细节可能需申请旅行咨询。',
    title:'海洋三省十四日大环线', subtitle:'灯塔、潮汐、红土地和卡伯特海岸的长镜头。', days:14, area:'大西洋海岸', themes:['海岸','自驾'], cover:'halifax',
    route:['哈利法克斯','卢嫩堡','沃尔夫维尔','迪格比','圣约翰','圣安德鲁斯','芬迪湾','蒙克顿','夏洛特敦','卡文迪许','布雷顿角岛','哈利法克斯'], best:'6—10 月适合自驾；轮渡须核对班次', transport:'自驾为主；Digby—Saint John 及 PEI—NS 轮渡需独立预订',
    highlights:'Lunenburg · Annapolis Valley · Fundy Trail · PEI 海滩 · Cabot Trail',
    schedule:[
      ['哈利法克斯','海港迎接旅程','在海滨木栈道、城堡区闲逛，准备租车与接下来的沿海路线。'],
      ['卢嫩堡','佩姬湾和世界遗产古镇','经 Peggy’s Cove 灯塔和 Mahone Bay 抵达卢嫩堡，体验彩色木屋海港。'],
      ['沃尔夫维尔','酒庄与芬迪湾边缘','进入 Annapolis Valley，走访 Grand-Pré 和乡间农庄。'],
      ['圣约翰','跨越芬迪湾','前往 Digby 码头，搭乘季节运营的 Bay Ferries 航线抵达 Saint John。'],
      ['圣安德鲁斯','海滨小镇与观鲸','沿海来到 St. Andrews，按季节挑选观鲸或岛屿步行体验。'],
      ['芬迪湾','海岸公园','走 Fundy Trail 或周边步道，重点关注潮汐时段与安全。'],
      ['夏洛特敦','跨越联邦大桥','经 Moncton 一带前往爱德华王子岛，抵达后逛历史街区和港口。'],
      ['夏洛特敦','海岛农场与海鲜','安排农产品、市集、牡蛎或当地马铃薯主题体验。'],
      ['卡文迪许','红沙岸与绿山墙','游 PEI 国家公园和 Green Gables 相关地点。'],
      ['布雷顿角岛','返回新斯科舍','按船期选择 PEI 轮渡或陆路回程，驶往 Cape Breton 周边住宿。'],
      ['布雷顿角岛','Cabot Trail 第一段','沿海岸风景公路慢行，留足观景停车和短途徒步时间。'],
      ['布雷顿角岛','高地国家公园','安排 Cape Breton Highlands 步道，留心野生动物和天气。'],
      ['哈利法克斯','返回港城','回到哈利法克斯，补逛海滨市集或博物馆。'],
      ['哈利法克斯','离开大西洋海岸','留出还车和机场缓冲，不安排跨省大转场。']
    ]
  },
  {
    id:'traveler-maritime-16', source:'Tripadvisor', type:'旅行者论坛', author:'Mark & Nancy M · 16 Day September PEI and NS',
    url:'https://www.tripadvisor.ca/ShowTopic-g155022-i619-k15503193-16_Day_September_PEI_and_NS_trip_itinerary_for_review-Prince_Edward_Island.html', sourceNote:'基于 Tripadvisor 用户 2026 年发布的十六天路线草案重新编排为逐日描述，原帖属于出发前征求意见的计划。',
    title:'海洋省份十六日细游', subtitle:'适合不急着赶路、喜欢轻徒步和海边小镇的人。', days:16, area:'大西洋海岸', themes:['海岸','慢游'], cover:'lunenburg',
    route:['哈利法克斯','佩姬湾','卢嫩堡','沃尔夫维尔','芬迪湾','夏洛特敦','卡文迪许','布雷顿角岛','哈利法克斯'], best:'9 月；部分 PEI 景点可能在淡季缩短营业', transport:'自驾环线；原帖偏好不安排观鲸或搭船活动',
    highlights:'Peggy’s Cove · Grand Pré · Hopewell Rocks · Green Gables · Skyline Trail',
    schedule:[
      ['哈利法克斯','入住港城','抵达后在 Waterfront 散步，熟悉市中心位置。'],
      ['哈利法克斯','城堡与花园','参观 Citadel、海洋博物馆和公共花园，傍晚看海港日落。'],
      ['佩姬湾 / 卢嫩堡','灯塔海岸','经 Peggy’s Cove、Mahone Bay，下午抵达卢嫩堡。'],
      ['卢嫩堡','老城与航海','步行看彩色建筑、港区和渔业展览，在海滨慢慢用餐。'],
      ['沃尔夫维尔','安纳波利斯谷','走访 Grand-Pré、乡间酒庄及迪格比方向海岸，长途留缓冲。'],
      ['芬迪湾','潮汐与步道','前往 Hopewell Rocks 一带，以涨落潮信息安排观景时间。'],
      ['夏洛特敦','联邦大桥上岛','驾车前往 PEI，在夏洛特敦老街区休息。'],
      ['夏洛特敦','首府漫游','步行 Victoria Row、港口与 Victoria Park。'],
      ['卡文迪许','文学与海岸','前往绿山墙相关景点及 Cavendish 海滩。'],
      ['卡文迪许','PEI 北岸','到 North Rustico、French River 或 Greenwich Dunes 看红沙海岸。'],
      ['新斯科舍北岸','离开 PEI','经联邦大桥返回大陆，在 Antigonish 或 Tatamagouche 过夜。'],
      ['切蒂坎普','进入布雷顿角','前往 Chéticamp，下午选择短步道或阿卡迪亚文化体验。'],
      ['布雷顿角高地','高地步道','天气合适时探访 Skyline Trail 等步道，注意黄昏驾驶。'],
      ['巴德克','卡伯特公路东段','经 Ingonish 和沿线观景点，傍晚入住 Baddeck。'],
      ['路易斯堡 / 巴德克','要塞与发明史','按开放时间安排路易斯堡要塞和 Bell 博物馆。'],
      ['哈利法克斯','归还车辆与返程','返回哈利法克斯，预留足够机场、还车时间。']
    ]
  },
  {
    id:'traveler-halifax-montreal-10', source:'Tripadvisor', type:'旅行者讨论', author:'10 days Halifax to Montreal · 社区建议',
    url:'https://www.tripadvisor.com/ShowTopic-g154976-i327-k14810982-10_days_Halifax_to_Montreal_Please_help_with_itinerary-Halifax_Halifax_Regional_Municipalit.html', sourceNote:'参考原帖及旅行者对哈利法克斯—PEI—布雷顿角—蒙特利尔行程的建议；本站整理为十日版本，长距离公路转场较紧凑。',
    title:'哈利法克斯至蒙特利尔', subtitle:'从北大西洋海风一路开向法语都会。', days:10, area:'跨省串游', themes:['自驾','城市'], cover:'capebreton',
    route:['哈利法克斯','佩姬湾','卢嫩堡','布雷顿角岛','PEI','新不伦瑞克','蒙特利尔'], best:'6—9 月；请预留跨省长途驾驶时间', transport:'以自驾为主；建议对比多城市航班，末段可考虑飞行替代长途车程',
    highlights:'Peggy’s Cove · Cabot Trail · PEI 北岸 · 蒙特利尔旧城',
    schedule:[
      ['哈利法克斯','海港与城市历史','逛海滨木栈道、Citadel 与旧街区，租车整备。'],
      ['佩姬湾','灯塔与南岸','赴 Peggy’s Cove 和 Mahone Bay，傍晚在卢嫩堡住下。'],
      ['卢嫩堡','彩色海港','游览老城、渔业文化，并返回主线驶向 Cape Breton 方向。'],
      ['布雷顿角岛','切蒂坎普海岸','前往 Cabot Trail 西侧，选择海岸风景段与短步道。'],
      ['布雷顿角岛','Cabot Trail 环线','把观景时间留给高地国家公园，住 Baddeck 或周边。'],
      ['布雷顿角岛','贝尔博物馆与东海岸','参观 Alexander Graham Bell 相关展览及湖畔小镇。'],
      ['PEI','跨海或公路前往海岛','根据船期选择 Caribou—Wood Islands 渡轮或联邦大桥，住宿夏洛特敦。'],
      ['PEI','红沙滩与绿山墙','看 Cavendish 和北岸渔村，下午回到夏洛特敦。'],
      ['新不伦瑞克','穿越大陆缓冲日','经 Moncton 向魁北克方向转场；不要把跨省长途误排成轻松观光日。'],
      ['蒙特利尔','抵达法语都会','如为自驾，抵达时间可能较晚；建议增加一天更从容，或比较航班。']
    ]
  },
  {
    id:'newfoundland-viking-7', source:'Lonely Planet', type:'编辑策划', author:'Lonely Planet · Canada’s best road trips: Viking Trail',
    url:'https://www.lonelyplanet.com/articles/best-road-trips-scenic-drives-canada', sourceNote:'Lonely Planet 提供 Viking Trail 的路线方向与沿途亮点，七日拆分由 EASTBOUND 独立编写，并非原站公布的七日成套行程。',
    title:'纽芬兰维京海岸七日', subtitle:'从地质奇观一路驶向古老的维京遗址。', days:7, area:'纽芬兰', themes:['自然','自驾'], cover:'bonavista',
    route:['鹿湖 Deer Lake','Gros Morne','Rocky Harbour','Port au Choix','St. Anthony','L’Anse aux Meadows'], best:'夏季；北部服务设施季节性明显', transport:'建议从 Deer Lake 取车，北部自驾路线较长，需提前规划返程',
    highlights:'Gros Morne 国家公园 · Tablelands · Viking Trail · L’Anse aux Meadows',
    schedule:[
      ['鹿湖','抵达西纽芬兰','在 Deer Lake 取车，了解道路与天气状况，向 Gros Morne 方向移动。'],
      ['Gros Morne','地质步道','选择 Tablelands 附近步道，了解特殊岩层地貌。'],
      ['Rocky Harbour','峡湾与海岸','以海滨小镇为基地，按季节参加峡湾游船或轻徒步。'],
      ['Gros Morne 北部','国家公园延伸探索','安排另一条国家公园步道，控制强度；准备前往北部的补给。'],
      ['Port au Choix','海岸与历史遗址','沿 430 号公路北行，参观当地历史与考古相关展区。'],
      ['St. Anthony','北大西洋边缘','抵达北端小镇，观察季节性海鸟、鲸或冰山信息。'],
      ['L’Anse aux Meadows','维京遗址','参观世界遗产考古区，返程需另计较长车程或安排额外住宿。']
    ]
  },
  {
    id:'nova-scotia-8', source:'Lonely Planet', type:'作者游记', author:'Lonely Planet · Halifax to Louisbourg',
    url:'https://www.lonelyplanet.com/articles/nova-scotia-road-trip-itinerary', sourceNote:'受 Lonely Planet 2025 年新斯科舍海岸自驾文章启发；下方八日次序与文字为 EASTBOUND 编排的建议，不是原文逐日复制。',
    title:'新斯科舍海岸八日', subtitle:'从灯塔到旧堡垒，慢慢认识海洋省的故事。', days:8, area:'新斯科舍', themes:['海岸','文化'], cover:'peggys',
    route:['哈利法克斯','佩姬湾','马洪湾','卢嫩堡','沃尔夫维尔','布雷顿角','路易斯堡','哈利法克斯'], best:'5—10 月；历史遗址季节性开放', transport:'自驾方便；海岸环线建议留足缓冲日',
    highlights:'Halifax Waterfront · Peggy’s Cove · Lunenburg · Cabot Trail · Fortress of Louisbourg',
    schedule:[
      ['哈利法克斯','港口城市漫步','体验海滨木栈道、Citadel 和海洋博物馆。'],
      ['佩姬湾','花岗岩海岸','去灯塔观景，注意湿滑礁石；顺路在渔村休息。'],
      ['卢嫩堡','彩色世界遗产古镇','经 Mahone Bay 抵达卢嫩堡，探索港区与历史建筑。'],
      ['沃尔夫维尔','葡萄园和河谷','进入 Annapolis Valley，结合 Grand-Pré 与农庄体验。'],
      ['布雷顿角','海滨公路初见','向 Cape Breton 驶去，下午安排较短的湖滨或海岸停留。'],
      ['布雷顿角','高地观景与徒步','以 Cabot Trail 的观景点、国家公园步道为重点。'],
      ['路易斯堡','北美海岸防御遗址','参观路易斯堡要塞，留出深度导览时间。'],
      ['哈利法克斯','收束海岸公路','返回港城、还车或搭乘返程交通。']
    ]
  },
  {
    id:'mafengwo-eastern-8', source:'马蜂窝', type:'用户线路改编', author:'随行所遇 · 11 日跨加旅行线路（2014）',
    url:'https://www.mafengwo.cn/schedule/430123.html', sourceNote:'原始马蜂窝用户线路还包括温哥华及跨境路段；此处仅借鉴其安省、魁省城市组合，改编为不跨境的八日加东版本。',
    title:'加东经典城市八日', subtitle:'瀑布、首都、旧港与古城，一次尽收眼底。', days:8, area:'安大略 / 魁北克', themes:['经典','城市'], cover:'montreal',
    route:['多伦多','尼亚加拉','金斯顿','渥太华','蒙特利尔','魁北克城'], best:'5—10 月；适合初次探索', transport:'建议自驾；多伦多—渥太华—蒙特利尔—魁北克城可比较铁路',
    highlights:'尼亚加拉瀑布 · 千岛湖 · Parliament Hill · 旧蒙特利尔 · 老魁北克',
    schedule:[
      ['多伦多','都市地标','走访 CN 塔、湖滨和多伦多市中心，夜宿市内。'],
      ['尼亚加拉','大瀑布一日游','完整体验加拿大侧瀑布及滨湖小镇，回多伦多或在瀑布区住宿。'],
      ['金斯顿','沿湖东行','经安大略湖沿岸赴 Kingston / Gananoque，视季节查询千岛湖游船。'],
      ['渥太华','首都地标','探访国会山周边、运河与美术馆区。'],
      ['蒙特利尔','来到法语都会','抵达后在旧港和老城区散步，体验当地餐饮。'],
      ['蒙特利尔','艺术与街区','皇家山、博物馆与市场任选，感受城市不同文化。'],
      ['魁北克城','古城浪漫','前往 Quebec City，下午参观小香普兰街和城堡外景。'],
      ['魁北克城','河景与瀑布','游古城城墙或蒙莫朗西瀑布；建议从魁北克返程或另安排回程交通。']
    ]
  }
];
