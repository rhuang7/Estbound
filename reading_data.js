'use strict';
// Destination-specific dining. Descriptions are original editorial summaries, not user reviews.
// Sources are destination tourism boards, operator listings or independently verifiable venue pages.
const RESTAURANT_GUIDES={
 toronto:[
  ['El Catrin Destileria','墨西哥料理 · Distillery District','传统蒸馏厂街区的墨西哥料理与露台，适合街区散步后用餐。','https://www.destinationontario.com/en-ca/articles/popular-toronto-restaurants-by-neighbourhood'],
  ['Madrina Bar y Tapas','西班牙小食 · Distillery District','适合分食小盘菜，结合古酿酒厂区艺术与夜景。','https://www.destinationontario.com/en-ca/articles/popular-toronto-restaurants-by-neighbourhood'] ],
 niagara:[
  ['Table Rock House Restaurant','瀑布景观 · Table Rock','瀑布区餐饮选择，主打观景位置；高峰时段建议预留排队时间。','https://www.destinationontario.com/en-ca/travel-resources/discover-ontario-winter-wonders-plan-your-trip-toronto-the-blue-mountains-and'],
  ['AG Inspired Cuisine','地方食材 · Niagara Falls','以尼亚加拉地区食材为特色的精致餐饮选项，适合特别一餐。','https://www.destinationontario.com/en-ca/travel-resources/discover-ontario-winter-wonders-plan-your-trip-toronto-the-blue-mountains-and'] ],
 kingston:[
  ['Chez Piggy','加拿大融合菜 · Downtown','历史建筑中的金斯顿老牌餐厅，适合老城步行路线。','https://www.destinationontario.com/en-ca/articles/where-eat-kingston'],
  ['Pan Chancho Café','烘焙早午餐 · Princess Street','面包、糕点与早餐选择，适合出发探索千岛湖之前。','https://www.destinationontario.com/en-ca/articles/where-eat-kingston'] ],
 ottawa:[
  ['Riviera','现代加拿大料理 · Sparks Street','历史建筑中的精致餐厅，靠近市中心及国会山。','https://ottawatourism.ca/en/ottawa-insider/6-ottawa-restaurants-make-the-list-of-canadas-100-best-restaurants-2024'],
  ['Starling Restaurant','现代休闲料理 · ByWard Market','拜沃德市场附近的餐厅，适合城市步行与晚餐相结合。','https://ottawatourism.ca/en/see-and-do/ottawa-restaurants'] ],
 montreal:[
  ['Mon Lapin','季节料理 · Little Italy','以魁北克当季食材和小盘菜见长，建议留意预订。','https://www.mtl.org/en/experience/montreal-award-winning-restaurants'],
  ['Joe Beef','法式风格 · Griffintown','富有当地辨识度的经典餐厅，适合将晚餐作为行程重点。','https://www.mtl.org/en/experience/montreal-award-winning-restaurants'] ],
 tremblant:[
  ['La Savoie','瑞士山地料理 · 步行村','芝士火锅、烤奶酪和山地料理，适合滑雪或徒步后聚餐。','https://www.tremblant.ca/things-to-do/dining/la-savoie'],
  ['Resto-Bar Le Shack','休闲餐吧 · Place Saint-Bernard','度假村核心广场的休闲餐厅，方便接续山地活动。','https://www.tremblant.ca/quoi-faire/restaurants-bars-cafes/resto-bar-le-shack'] ],
 quebec:[
  ['ARVI','创意料理 · Limoilou','开放式厨房与创意季节菜单，通常需要提前安排座位。','https://www.quebec-cite.com/en/restaurants-quebec-city/best-restaurants-quebec'],
  ['Chez Rioux & Pettigrew','法式融合 · Old Port','老港历史街区的精致料理与早午餐选择。','https://www.quebec-cite.com/en/restaurants-quebec-city/best-restaurants-quebec'] ],
 charlevoix:[
  ['Restaurant Le Saint-Pub','地方风味 · Baie-Saint-Paul','以地区食材与家常料理见长，适合画廊小镇散步后用餐。','https://www.tourisme-charlevoix.com/en/'],
  ['Restaurant Les Labours','地方季节料理 · Baie-Saint-Paul','以 Charlevoix 当季农牧产品为主题的餐厅。','https://www.germainhotels.com/en/le-germain-hotel-and-spa/charlevoix/things-to-do/les-labours-restaurant'] ],
 halifax:[
  ['The Bicycle Thief','意式海鲜 · Waterfront','位于海滨散步路线，主打意式风格和新斯科舍海产。','https://discoverhalifaxns.com/things-to-do/high-end-halifax-a-luxury-guide/'],
  ['Bar Kismet','海鲜小盘 · North End','适合想探索城市北区餐饮的旅客，留意订位。','https://discoverhalifaxns.com/things-to-do/high-end-halifax-a-luxury-guide/'] ],
 peggys:[
  ['Sou’Wester Gift & Restaurant','海鲜 · Peggy’s Cove','灯塔附近的餐饮地点，可搭配海岸观景，营业时间随季节调整。','https://novascotia.com/plan-your-visit/itineraries/savour-nova-scotia/'],
  ['rhubarb restaurant','地方料理 · Indian Harbour（周边）','位于 Peggy’s Cove 海岸公路附近的用餐选择，不在灯塔村中心。','https://novascotia.com/blog/nova-scotia-restaurants-with-a-water-view/'] ],
 lunenburg:[
  ['Salt Shaker Deli','海鲜简餐 · Waterfront','海滨小馆，供应当地特色鱼汤、龙虾卷等，适合轻松午餐。','https://novascotia.com/listing/salt-shaker-deli/'],
  ['The South Shore Fish Shack','海鲜简餐 · Harbour','老城港口区的海鲜选择，参观古镇可顺路安排。','https://novascotia.com/explore-by-region/south-shore/lunenburg/'] ],
 capebreton:[
  ['The Freight Shed on the Wharf','海鲜 · Baddeck','Baddeck 码头的海景餐厅，适合作为 Cabot Trail 前后停靠点。','https://www.cbisland.com/en/alimentation-et-boissons/restaurants-et-haute-gastronomie'],
  ['L’abri Café, Restaurant and Bar','阿卡迪亚风味 · Chéticamp','位于 Cabot Trail 西侧城镇，适合高地国家公园之后用餐。','https://www.cbisland.com/en/alimentation-et-boissons/restaurants-et-haute-gastronomie'] ],
 charlottetown:[
  ['Merchantman','海鲜 · Downtown','海鲜浓汤、牡蛎等 PEI 风味，适合老城步行与晚餐安排。','https://www.tourismpei.com/askanislander/questions/food-suggestions-in-charlottetown'],
  ['Claddagh Oyster House','牡蛎海鲜 · Downtown','PEI 牡蛎与海鲜选择，热门日期建议核实订位。','https://www.tourismpei.com/askanislander/questions/food-suggestions-in-charlottetown'] ],
 cavendish:[
  ['Samuel’s Coffee House','咖啡早午餐 · Avonlea Village','位于卡文迪许附近主题村，适合轻松早餐与休息。','https://www.tourismpei.com/askanislander/questions/would-like-to-know-the-best-restaurants-in-the-cavendish-and-surrounding'],
  ['Blue Mussel Café','海鲜 · North Rustico（周边）','北岸渔港海鲜餐厅，距离卡文迪许需短途驾车。','https://www.tourismpei.com/askanislander/questions/whats-the-best-restaurant-in-north-rustico'] ],
 moncton:[
  ['Tide & Boar Gastropub','地方餐吧 · Downtown','新不伦瑞克地区风味与餐吧料理，可搭配市中心散步。','https://tourismnewbrunswick.ca/search?Keywords=%C3%AEles+de+Fundy+&ord=38909507&page=30'],
  ['Gusto Italian Grill & Bar','意大利料理 · Downtown','蒙克顿市中心意式餐厅；请通过地图核实最新营业状态。','https://www.gustoitaliangrill.ca/'] ],
 fundy:[
  ['The Octopus’ Garden','海湾特色 · Alma','位于芬迪国家公园外的 Alma 小镇，适合潮汐行程之间用餐。','https://tourismnewbrunswick.ca/story/plan-your-rejuvenating-fundy-coast-getaway'],
  ['Tipsy Tails Restaurant','海鲜 · Alma','Alma 海湾沿岸用餐点，建议根据潮汐和开店季节安排行程。','https://tourismnewbrunswick.ca/story/plan-your-rejuvenating-fundy-coast-getaway'] ],
 saintjohn:[
  ['Port City Royal','地方创意料理 · Uptown','新不伦瑞克省 Saint John 老城附近的餐饮选择。','https://tourismnewbrunswick.ca/story/plan-your-rejuvenating-fundy-coast-getaway'],
  ['Italian by Night','意大利料理 · Germain Street','位于 Uptown 的意式餐厅；与纽芬兰 St. John’s 严格区分。','https://www.opentable.com/r/italian-by-night-saint-john'] ],
 stjohns:[
  ['The Merchant Tavern','现代加拿大料理 · Water Street','位于历史街道的餐厅，适合探索纽芬兰地方风味。','https://www.newfoundlandlabrador.com/things-to-do/food-and-dining'],
  ['YellowBelly Brewery & Public House','当地餐吧 · Downtown','历史商贸建筑中的餐吧，可搭配老城区散步。','https://www.newfoundlandlabrador.com/things-to-do/food-and-dining'] ],
 bonavista:[
  ['The Boreal Diner','季节性地方食材 · Bonavista','旧建筑中的现代地区料理，菜单会随季节变化。','https://www.theborealdiner.ca/'],
  ['Bonavista Social Club','柴火披萨 · Bonavista Peninsula','在半岛公路旅行中享受当地食材披萨；核对季节营业。','https://visitnewfoundlandlabrador.ca/bonavista-newfoundland/'] ]
};
// These short, exact English excerpts are individually attributed. Never present editorial quotes as customer reviews.
const CITY_EXCERPTS={
 toronto:{quote:'Toronto is a cosmopolitan city with unique neighbourhoods',by:'Destination Ontario · 目的地指南',url:'https://www.destinationontario.com/en-ca/articles/popular-toronto-restaurants-by-neighbourhood'},
 kingston:{quote:'Pan Chancho is a Kingston institution for fresh-baked bread, pastries and breakfast fare',by:'Destination Ontario · 餐饮指南',url:'https://www.destinationontario.com/en-ca/articles/where-eat-kingston'},
 montreal:{quote:"Montréal is one of North America's premier food cities",by:'Tourisme Montréal · 官方美食特辑',url:'https://www.mtl.org/en/experience/montreal-award-winning-restaurants'},
 quebec:{quote:'Québec City has a food scene that can easily hold its own',by:'Visit Québec City · 官方美食指南',url:'https://www.quebec-cite.com/en/restaurants-quebec-city/best-restaurants-quebec'},
 halifax:{quote:'Relaxed, yet refined Italian-inspired dishes from the land and sea in a bustling atmosphere.',by:'Discover Halifax · 餐厅专题',url:'https://discoverhalifaxns.com/things-to-do/high-end-halifax-a-luxury-guide/'},
 charlottetown:{quote:'Charlottetown is one of my favourite spots to enjoy!',by:'Erin Davis · Tourism PEI 的 Ask an Islander 栏目',url:'https://www.tourismpei.com/askanislander/questions/food-suggestions-in-charlottetown'},
 cavendish:{quote:'Cavendish is well known for being the home of Lucy Maud Montgomery',by:'Charlene Belsher · Tourism PEI 的 Ask an Islander 栏目',url:'https://www.tourismpei.com/askanislander/questions/staying-in-north-rustico-for-five-days-sept-7-13th-what-are-the-best'},
 peggys:{quote:'Enjoy lobster at the Sou’Wester Restaurant',by:'Tourism Nova Scotia · 官方路线游记',url:'https://novascotia.com/plan-your-visit/itineraries/savour-nova-scotia/'},
 stjohns:{quote:'Long known for seafood, wild game, and delicious traditional meals',by:'Newfoundland & Labrador Tourism · 官方美食指南',url:'https://www.newfoundlandlabrador.com/things-to-do/food-and-dining'},
 moncton:{quote:'Great service GREAT FOOD. Worth every penny!!! Highly recommended',by:'Restaurantji · Gusto Italian Grill 公开用户短评',url:'https://www.restaurantji.com/nb/moncton/italian/'},
 bonavista:{quote:'I had oatmeal just the way I used to have it when I was a kid.',by:'Tripadvisor · MIFFLIN’S Tea Room 游客短评',url:'https://www.tripadvisor.ca/Restaurants-g499186-Bonavista_Newfoundland_Newfoundland_and_Labrador.html'},
 fundy:{quote:'Nothing says “rejuvenate” like really treating yourself to an experience',by:'Tourism New Brunswick · 官方海岸游记',url:'https://tourismnewbrunswick.ca/story/plan-your-rejuvenating-fundy-coast-getaway'}
};
const CITY_TRAVELOG_SOURCES={
 toronto:'https://www.destinationontario.com/en-ca/cities-towns/toronto',niagara:'https://www.destinationontario.com/en-ca/regions/niagara-region',kingston:'https://www.destinationontario.com/en-ca/articles/where-eat-kingston',ottawa:'https://ottawatourism.ca/en',montreal:'https://www.mtl.org/en/experience/musts-first-time-visitors',tremblant:'https://blogue.tremblant.ca/culinary-diversity-restaurants-tremblant/',quebec:'https://www.quebec-cite.com/en/what-to-do-quebec-city/top-things-to-do',charlevoix:'https://www.tourisme-charlevoix.com/en/',halifax:'https://discoverhalifaxns.com/things-to-do/high-end-halifax-a-luxury-guide/',peggys:'https://novascotia.com/plan-your-visit/itineraries/savour-nova-scotia/',lunenburg:'https://novascotia.com/explore-by-region/south-shore/lunenburg/',capebreton:'https://www.cbisland.com/en/',charlottetown:'https://www.tourismpei.com/askanislander/questions/food-suggestions-in-charlottetown',cavendish:'https://www.tourismpei.com/askanislander/questions/whats-the-best-restaurant-in-north-rustico',moncton:'https://tourismnewbrunswick.ca/',fundy:'https://tourismnewbrunswick.ca/story/plan-your-rejuvenating-fundy-coast-getaway',saintjohn:'https://tourismnewbrunswick.ca/',stjohns:'https://www.newfoundlandlabrador.com/things-to-do/food-and-dining',bonavista:'https://visitnewfoundlandlabrador.ca/bonavista-newfoundland/'
};
