# EASTBOUND V42 — 购物卡片官方照片

更新日期：2026-11-15

## 更新内容

- 在首页“购物与伴手礼”卡片中新增已核实的对应地点照片（共 13 处，涵盖全部 5 个明确命名的大型商场／奥特莱斯，以及 8 处市集、工艺馆或商业街区）。
- 新增相片来源标签和可点击的原始官方网站／运营方入口；城市筛选、更多／收起、详情页与地图链接逻辑均保留。
- 照片加载失败时自动隐藏图片区，不显示破损图片。
- 仅选用与卡片名称相符、来自对应经营方／业主／官方目的地旅游组织的图片；对于其余街区、散落商铺等无法确认可靠官方实拍的项目，不以其他商场照片冒充。

## 技术文件

- `shopping_photos.js` — 图片 URL 与官方来源对应表。
- `shopping_photos.css` — 卡片封面、图片来源、移动端响应样式。
- `explorer.js` — 渲染购物卡片时引入对应官方图片与来源。
- `home.html` — 加载新增资源。

## 图片来源及使用注意

目前采用**在线加载官方原始图片**，未在本 ZIP 内重新分发第三方摄影作品，首次查看需联网。商场方、摄影师及市场运营方通常保留著作权；如果要正式商业上线，请事先核对图片使用授权。官方来源及对应图片 URL 在 `shopping_photos.js` 中逐条列出。若官方以后调整文件地址，图片会自动隐藏，需更新对应链接。

已添加图片的购物地点：CF Toronto Eaton Centre、Outlet Collection at Niagara、CF Rideau Centre、Champlain Place、Avalon Mall、Distillery Historic District、ByWard Market、Jean-Talon Market、Marché Atwater 食品市集、Rue du Petit-Champlain、PEI Craft Council Gallery、Dieppe Market、St. John’s Farmers’ Market。
