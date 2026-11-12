# EASTBOUND V10 · 餐厅 / 购物独立详情页面

以 EASTBOUND V9.1 为基础，原有四个页面全部保留：`index.html`（首页）、`planner.html`（行程规划）、`stories.html`（经典路线）、`vlogs.html`（旅行视频）。

## 本次更新

- 首页 **38 张精选餐厅卡片**与 **82 张购物与伴手礼卡片**全部可点击。点击卡片任何非外链区域，打开对应地点的独立详情网址。
- 所有内容使用一个可复用的 `place.html` 模板，每张卡片拥有**不同的链接与内容**：例如 `place.html?type=restaurant&city=halifax&item=0` 和 `place.html?type=shopping&city=toronto&item=0`。这样可以在 GitHub Pages 上稳定部署，无需后台服务器，也不需要复制 120 份 HTML 文件。
- 详情页提供三图区域、介绍、特色、旅行提示、相关来源、更多同城地点、地图和导航链接，支持电脑及手机。
- 照片优先通过 Wikimedia Commons 公共 API 检索对应名称，显示图片作者与许可并链接原始文件。无足够搜索结果时，补充**明确标注**的城市／周边参考图片；不把参考图片称为餐厅／店铺实拍。外部图片和地图需网络连接。
- 地理定位使用你此前选择的 **Mapbox GL JS + Mapbox Search Box POI 搜索 API**。有 `pk.` 公开令牌时尝试精确定位商家或街区，按搜索结果放置地图标记。找不到匹配点时不伪造坐标；页面同时保留 Google Maps 官方搜索／导航入口。部分购物推荐是街区／市集而非单个门牌，地址应在出行前确认。
- Mapbox 公开令牌优先读取浏览器 `eastbound.mapbox.public_token`，其次读取 `mapbox_config.js` 中的 `window.EASTBOUND_MAPBOX_TOKEN`。也可在详情页直接输入保存公开令牌。**不要**使用 `sk.` 私密令牌。详情页面的地理搜索请求会计入 Mapbox Search Box API 额度，地图加载也计入地图用量。

## GitHub Pages 部署

1. 下载完整 ZIP 后解压。
2. 将**全部**网站文件上传到现有 GitHub 仓库的**根目录**，覆盖旧文件。注意本次必须包含：`place.html`、`places.css`、`place.js`、`place_data.js`、`place-cards.css`。
3. 原有 `index.html`、`planner.html`、`stories.html`、`vlogs.html` 保持同级；无需修改 GitHub Pages 原来的 `main` → `/(root)` 发布配置。
4. 如果之前配置过 `mapbox_config.js`，先备份并恢复自己的公开 `pk.` 令牌，然后在 Mapbox 控制台为新站点设置恰当的域名限制。
5. 部署完成后测试示例：
   - `https://用户名.github.io/仓库名/place.html?type=restaurant&city=halifax&item=0`
   - `https://用户名.github.io/仓库名/place.html?type=shopping&city=toronto&item=0`

## 内容来源、可靠性与测试边界

- 38 条餐厅、82 条购物建议由既有 V9.1 内容迁移，未虚构评分、价格、实时营业、可预约性或门牌号。
- 图片来源以每张图片下方点击进入的版权原页为准。Wikimedia 搜索相关度可能不够精准，网站明确标识城市/地区参考图；面向公众营业前建议逐项人工审核图片与商户信息。
- 地点搜索属于运行时调用；若没有 Mapbox Token 或网络不可用，无法证明商户的精确坐标，页面不会以城市坐标冒充具体商家位置。
- 无需接入 Google 登录。原有的 Vlog、经典旅行路线、航班与地图规划保持不变。
