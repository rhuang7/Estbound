'use strict';
// V6 supplemental, editorially curated content. Verify seasonal access and schedules with operators.
const DESTINATION_EXTRA={
 toronto:{season:'春季看城市公园花开；夏季湖畔活动丰富；秋季适合步行看街区。',experience:'把安大略美术馆、皇后西街和 Kensington Market 排成一条有艺术与咖啡的小路线。',transport:'市中心公共交通便捷；开车进市区应核实停车与高峰时段拥堵。'},
 niagara:{season:'瀑布全年可看，游船及部分河谷体验按季节和天气运营。',experience:'除了瀑布，可把 Niagara-on-the-Lake 小镇、酒庄与河道步道分开安排。',transport:'注意瀑布附近停车与景区交通；小镇及酒庄串联更适合自驾或当地团。'},
 kingston:{season:'春秋适合步行老城；千岛湖观光游船通常有明显季节性。',experience:'把历史市政厅、湖岸小径和 Gananoque 的河岛观景组合成一日慢游。',transport:'千岛湖游船码头分布不同，预订时确认出航地点、停车和是否登岛。'},
 ottawa:{season:'春季郁金香、夏季河畔活动、冬季户外体验各有特色，依当年安排。',experience:'白天安排国家博物馆与国会山周边，傍晚去 ByWard Market 品尝当地美食。',transport:'部分国家级博物馆在郊区；提前核对展馆当日开放及公共交通。'},
 montreal:{season:'夏季街头节庆与步行街体验浓厚；冬季较冷，适合博物馆与地下商业街。',experience:'Mile End 贝果、Jean-Talon Market 与皇家山观景适合按街区分开探访。',transport:'老城停车较难；地铁与步行通常适合中心城区，远郊景点另需交通。'},
 tremblant:{season:'秋色和冬季雪季最受关注；滑雪、缆车与户外项目受天气影响。',experience:'预留半天登山或湖岸散步，剩余时间在步行村闲逛。',transport:'从蒙特利尔出发常需要租车、接送或季节性巴士；不要假定每日都直达。'},
 quebec:{season:'夏季老城步行体验好；冬季冰雪节庆热闹但道路易湿滑。',experience:'在小香普兰街与城墙之外，加入 Lévis 渡轮和河岸夜景。',transport:'古城坡道与石板路较多；蒙莫朗西瀑布和圣安妮教堂需额外接驳。'},
 charlevoix:{season:'秋季山区色彩明显；冬季雪况影响自驾与活动安排。',experience:'把 Baie-Saint-Paul 画廊、La Malbaie 河景和国家公园拆成多天，不急于往返。',transport:'区域跨度大，建议自驾；前往 Isle-aux-Coudres 必须核对渡轮班次。'},
 halifax:{season:'夏季海滨和周边海岸活跃；冬春天气变化快，外海风大。',experience:'海滨木栈道、Pier 21 与 Citadel 能帮助理解这座港口城市的故事。',transport:'海滨核心可步行；Peggy’s Cove、卢嫩堡与机场距离较远，按路线安排。'},
 peggys:{season:'晴天可看灯塔与巨岩；雾天、浪高时尤其需注意海岸安全。',experience:'不要只拍灯塔，可以沿海湾安排安全观景点与小渔村手作店。',transport:'需自驾或当地团；不要站在被海浪打湿的黑色岩石上。'},
 lunenburg:{season:'暖季适合海港步行与船舶观景，部分服务在淡季缩减。',experience:'把彩色老城、渔业博物馆与附近 Mahone Bay 放到同一天。',transport:'旧城适合步行；想去 Gaff Point 或 Hirtle’s Beach 则需要另备交通。'},
 capebreton:{season:'秋季观景道路很受欢迎；冬季部分山区道路和景区服务受限。',experience:'Cabot Trail 不必一天赶完，在 Ingonish 或 Chéticamp 多留一晚更从容。',transport:'强烈建议自驾并查天气、路况与园区通知；山路请留出弹性。'},
 charlottetown:{season:'夏季步行街、海港与岛内景区热闹；冬季部分海岸服务减少。',experience:'城市历史漫步搭配 Victoria Row 小店和海港海鲜晚餐。',transport:'岛内公交覆盖有限，若要串联海滩、北岸与渔村建议租车。'},
 cavendish:{season:'海滩与绿山墙相关景点多数以暖季体验为主，出发前确认开放。',experience:'绿山墙文学主题、沙丘海滩和 North Rustico 渔港适合分时安排。',transport:'村镇之间需要驾车；海滩和国家公园注意环保与禁行区域。'},
 moncton:{season:'夏秋便于探访芬迪湾潮汐景观；冬季景区活动与公路状况不同。',experience:'以蒙克顿为据点，错峰体验 Hopewell Rocks 与 Dieppe 当地市集。',transport:'芬迪湾潮汐时间比每天几点出发更重要；必须参考官方潮位表。'},
 fundy:{season:'沿海潮汐、海风、雨雾和季节性步道开放都影响游览。',experience:'在 Hopewell Rocks 查看低潮时的海蚀柱，再规划潮位对比与国家公园步道。',transport:'部分地点位于乡间，建议自驾；切勿凭经验判断潮涨速度。'},
 saintjohn:{season:'暖季适合海港与沿海步道；全年都应留意芬迪湾天气。',experience:'从历史 City Market 走到 Uptown 建筑街区，感受港城与海湾文化。',transport:'Saint John（新不伦瑞克）与 St. John’s（纽芬兰）是两座不同城市；机场代码分别是 YSJ 与 YYT。'},
 stjohns:{season:'暖季适合海岬、海鸟和徒步；冬春风雨雾雪变化明显。',experience:'Jellybean Row、Signal Hill、Quidi Vidi 与 Cape Spear 兼顾城市和海岸。',transport:'纽芬兰是岛屿：跨海需要航班或 Marine Atlantic 轮渡；轮渡不直接到 St. John’s。'},
 bonavista:{season:'适合公路旅行的时间受天气与季节性设施影响，户外观景要防风。',experience:'灯塔、Trinity 历史街区和沿岸小径可组合为两天慢游。',transport:'距离圣约翰斯较远，建议另安排住宿和车辆；部分道路与餐厅季节性开放。'}
};
const MORE_SPOTS={
 toronto:[['多伦多港湾湖岸步道','slow','1–2 小时','从市中心码头沿湖岸散步，兼顾海港景观与城市摄影。','游船与岛屿渡轮须查班次'],['皇后西街 Queen Street West','culture','1–2 小时','设计商店、壁画与咖啡店集中的街区。','店铺独立营业，适合白天走访']],
 niagara:[['Floral Clock 花钟','family','30–45 分钟','尼亚加拉公园大道上的季节性花艺景点。','花卉图案随季节更新'],['Niagara-on-the-Lake 湖岸','slow','1–2 小时','历史小镇湖边散步与宁静观景。','景点分散，建议安排接驳']],
 kingston:[['Waterfront Trail 湖滨路线','nature','1–2 小时','在金斯顿的湖岸历史景观间步行。','部分区段骑行与步行共享'],['Fort Henry 周边观景','culture','1 小时','从河岸观察金斯顿的历史军事防御地形。','内部参观须查看开放公告']],
 ottawa:[['Rideau Canal 沿岸步道','nature','1–2 小时','沿历史运河欣赏城市景观，四季各有变化。','冬季冰道开放受天气影响'],['National Gallery of Canada','culture','2–3 小时','加拿大与国际视觉艺术收藏。','查看展览日历与门票']],
 montreal:[['Plateau Mont-Royal 彩色街区','slow','1–2 小时','街道壁画、外楼梯与小众咖啡店。','适合步行与骑行'],['Marché Bonsecours 外观与老城','culture','1 小时','老蒙特利尔的标志性历史市场建筑与周边街景。','建筑内部功能可能调整']],
 tremblant:[['Sentier des Cimes Laurentides','nature','2–3 小时','树冠步道和高处观景平台的森林体验。','景区距离度假村较远，查门票'],['Lac Tremblant 日落观景','slow','1 小时','在山脚下欣赏湖面与黄昏光线。','湖岸停车和天气需注意']],
 quebec:[['Abraham Plains 亚伯拉罕平原','nature','1–2 小时','老城附近的大型历史绿地与观景空间。','大型活动期间可能限制路线'],['Dufferin Terrace 木栈道','slow','45 分钟','欣赏芳堤娜城堡外观和圣劳伦斯河谷。','冬季需注意结冰']],
 charlevoix:[['Route du Fleuve 河岸公路','nature','半天','沿圣劳伦斯河串联观景与小镇。','沿路停车须在正式位置'],['Baie-Saint-Paul 农产品与美食','food','1–2 小时','在艺术小镇探访奶酪、烘焙与本地食材。','小店可能在淡季缩减营业']],
 halifax:[['Dartmouth Ferry 海港渡轮','slow','1 小时','从海面欣赏 Halifax 天际线与港口。','班次与票价需查官方'],['Hydrostone 社区','culture','1–2 小时','历史街区与独立小店，适合轻松散步。','尊重居民区与私人住宅']],
 peggys:[['Peggy’s Cove Historic Village','culture','1 小时','了解当地小渔村建筑与灯塔周边生活。','村内居民生活区域请勿擅闯'],['Whalesback 海湾远眺','nature','45 分钟','沿海岸公路欣赏海湾地形与开放海景。','风大时勿接近浪边']],
 lunenburg:[['Lunenburg Academy 外观','culture','30–45 分钟','俯瞰古城的著名历史建筑。','仅建议外观拍摄'],['Blue Rocks 渔村风光','slow','1–2 小时','港湾小路与木屋组成的宁静海岸场景。','停车空间有限，请勿阻塞民宅车道']],
 capebreton:[['Skyline Trail 峭壁步道','nature','2–3 小时','Cape Breton Highlands 最具代表性的观海步道之一。','步道可能有特定时段限制'],['Baddeck 海滨村镇','slow','1–2 小时','作为环岛路线的湖边停靠点。','适合补给与短时停留']],
 charlottetown:[['Confederation Centre of the Arts','culture','1–2 小时','历史与演出艺术结合的市中心文化场所。','演出与展览需另查日历'],['Great George Street 历史街区','culture','45 分钟','漫步老建筑与城市历史街道。','适合和海港路线串联']],
 cavendish:[['Green Gables Heritage Place','culture','1–2 小时','探索《绿山墙的安妮》相关文学历史氛围。','季节开放及票务请查 Parks Canada'],['Cavendish 海岸沙丘','nature','1–2 小时','PEI 国家公园典型红砂岩和海岸植被。','遵守生态保护步道范围']],
 moncton:[['Magnetic Hill 地形体验','family','30–45 分钟','蒙克顿附近有趣的视觉坡道现象。','景区设施与开放需核实'],['Riverfront Park 河畔步道','nature','1–1.5 小时','在 Petitcodiac 河边欣赏景色与潮汐变化。','水流和泥滩不可随意进入']],
 fundy:[['Fundy Trail Parkway 观景','nature','半天','海湾悬崖、公路观景台与沿岸小径。','开放季节和路况请核实'],['Alma 渔村海鲜','food','1 小时','在国家公园外的海滨小镇品尝当地风味。','餐饮旺季需排队']],
 saintjohn:[['Reversing Falls 逆流瀑布','nature','45–60 分钟','观察海潮与河流交汇的特殊水文景观。','不同时段水流变化明显'],['Irving Nature Park','nature','1–2 小时','海岸湿地与短途自然步道。','步道根据天气情况选择']],
 stjohns:[['The Rooms 省立文化馆','culture','2 小时','纽芬兰与拉布拉多的艺术、历史与文化展览。','查看展览开放与门票'],['Quidi Vidi Village 小渔村','slow','1–2 小时','彩色渔港、手作与海湾风景。','村道狭窄注意停车']],
 bonavista:[['Cape Bonavista Lighthouse','culture','1 小时','灯塔与北大西洋海岸经典画面。','海风强且天气变化快'],['Trinity 古村步行','slow','1–2 小时','历史建筑与宁静的海滨小村体验。','季节性开放商家需提前核实']]
};
for(const [key,list] of Object.entries(MORE_SPOTS)) EXTRA_SPOTS[key].push(...list);
const MORE_SHOPS={
 toronto:[['Distillery Historic District','手作与设计','工艺、精品和节庆礼物','历史砖砌街区，适合精品购物和摄影。'],['St. Lawrence Market','本地美食','烘焙、奶酪和地方食材','以食品市集和美食体验为主。']],
 niagara:[['Niagara Falls Souvenir District','景区纪念','瀑布主题礼物','游客区商铺集中，注意比较价格。'],['Niagara-on-the-Lake Local Food Shops','地方美食','冰酒和食品礼盒','可在历史街区选择本地特产；饮酒消费需符合当地法规。']],
 kingston:[['Kingston Downtown Market Square','周末市集','烘焙与本地手作','活动受日期与季节影响。'],['Kingston Waterfront Boutiques','河岸精品','明信片与生活设计','可与市中心滨水漫步合并。']],
 ottawa:[['Wellington West','独立店铺','设计与社区小店','街区适合午后散步。'],['The Glebe / Bank Street','街区购物','书店与咖啡','以本地生活风格为主。']],
 montreal:[['Old Montréal Art Shops','本地艺术','版画、画廊和设计作品','结合老城景点游览。'],['Marché Atwater 食品市集','本地食材','奶酪、巧克力与食品','适合购买可带走的地方食品。']],
 tremblant:[['Mont-Tremblant Local Craft Shops','山地工艺','当地设计与手作','多为小店，营业时间可能变化。'],['Saint-Jovite Main Street','小镇休闲','咖啡、食品和生活用品','适合山地休闲行程的补给。']],
 quebec:[['Marché du Vieux-Port 周边','地方风味','枫糖与地方食品','营业及摊位分布请核实。'],['Avenue Cartier Boutiques','生活与艺术','画作、书店和服饰','体验古城之外的生活街区。']],
 charlevoix:[['Charlevoix Flavour Trail','地方食品','奶酪、果酱及农产品','小型生产者可能需要预约。'],['Baie-Saint-Paul Main Street','画廊与手作','本地艺术及独立设计','将购物与画廊参观一并安排。']],
 halifax:[['Spring Garden Road','城市购物','品牌服饰和生活用品','适合雨天或半日城市采购。'],['Dartmouth Downtown','创意小店','独立书店与本地品牌','可用港湾渡轮连接 Halifax。']],
 peggys:[['Indian Harbour Gift Studios','海洋手作','海岸摄影与地方艺术','小店数量有限，适合顺路停留。'],['Peggy’s Cove Art Galleries','地方艺术','灯塔主题画作','请核对画廊季节性营业。']],
 lunenburg:[['Lunenburg Main Street','历史街区','航海工艺与独立设计','建筑观光与购物兼顾。'],['Mahone Bay Artisan Galleries','地方艺术','陶瓷和木工','海湾手作小铺适合慢逛。']],
 capebreton:[['Sydney Waterfront Shops','海港小店','当地手信和食品','适合作为落地和离岛补给点。'],['Baddeck Craft Stores','地方工艺','凯尔特主题工艺与手作','与湖边步行路线相结合。']],
 charlottetown:[['Queen Street Boutiques','品牌与创意','服饰和岛屿礼品','市中心购物主轴之一。'],['Charlottetown Farmers’ Market','本地市集','农产、烘焙与手作','开放日期须提前确认。']],
 cavendish:[['Green Gables Gift Shops','文学主题','安妮主题书籍与纪念品','适合文学主题旅行。'],['Rustico Village Stores','乡村手作','海洋题材、地方艺术','小店多按季节营业。']],
 moncton:[['Champlain Place','大型商场','日常品牌与购物补给','适合天气不佳时。'],['Moncton Downtown Bookshops','城市文化','书籍和本地出版物','支持独立商店。']],
 fundy:[['Fundy National Park Visitor Shop','公园主题','自然教育及礼品','出发前确认是否营业。'],['St. Martins Artisan Shops','海湾手作','陶艺及海洋纪念品','建议将店铺停靠与海岸观光连游。']],
 saintjohn:[['Germain Street Galleries','艺术与设计','本地艺术及手工艺','适合历史街区慢逛。'],['Saint John Waterfront Shops','港口礼物','海事纪念与独立品牌','可与海港步行搭配。']],
 stjohns:[['Avalon Mall','综合购物','本地与国际品牌','交通便利，适合雨天采购。'],['St. John’s Farmers’ Market','地方市集','食品和本地制作','请查市场运营日历。']],
 bonavista:[['Bonavista Artisan Workshops','本地手作','木工和绘画','注意小镇店家季节性开放。'],['Trinity Village Gift Shops','古村纪念','艺术和当地产品','结合古村摄影行程。']]
};
for(const [key,list] of Object.entries(MORE_SHOPS))SHOPPING_GUIDES[key].push(...list);
