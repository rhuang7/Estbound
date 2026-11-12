# EASTBOUND V9.1 · 四页面版本 / GitHub Pages

在 V8 的基础上新增「旅行 Vlog」独立页面，同时修复「购物与伴手礼」空白/交互失效问题。

## 页面与入口

- `index.html`：主页。位于「走得远一点。生活，慢一点。」下方的 **「找到我的旅行节奏」** 现在链接到 **`vlogs.html`**，不再跳转到智能规划页面。购物、景点、餐厅、游记和轮渡仍在首页。
- `vlogs.html`：新增旅行视频。收录 10 支 YouTube 发布的加东 Vlog，提供分类、封面、官方嵌入播放器、原作者 YouTube 链接、展开与收起。
- `stories.html`：保留 V8 的 9 条经典逐日旅行路线。
- `planner.html`：保留独立行程规划、加拿大出发城市、航班推荐、Mapbox 地图、轮渡提醒。

## 修复的购物模块

原 `index.html` 按顺序加载 `explorer.js` 然后 `reading.js`。`explorer.js` 初始化景点时依赖 `reading.js` 定义的 `spotReadingHTML()`，发生 ReferenceError，导致后续购物和轮渡初始化未执行。

已将主页和规划页的脚本顺序调整为 `app.js` → `gallery.js` → `reading.js` → `explorer.js`（后续加载的 `flights.js` 不变）。这修复了景点、购物、轮渡展示与交互初始化。

已检查：购物城市筛选、6 项默认展示、显示更多、收起、地图链接；景点画廊、轮渡及其他功能保持原样。

## Vlog 来源与版权

Vlog URL 来源于可公开检索到的 YouTube 作者发布页面，标题等基础信息经检索验证。本站不复制下载或重新托管视频，卡片使用 YouTube 原站缩略图 URL；点击播放后才使用 `youtube-nocookie.com` 官方嵌入播放器。因创作者设置、浏览器环境及地区限制，个别视频可能不允许内嵌；每个视频都提供原作者 YouTube 页面链接。

Vlog 简介是本站中文原创导览，不是原作者的全文翻译，也不表示对视频质量的背书。视频内容、音乐、图像版权归视频创作者及其相关权利人。

## GitHub Pages 部署

1. 解压 ZIP，把里面**所有文件**上传 GitHub 仓库根目录：`index.html`、`planner.html`、`stories.html`、`vlogs.html` 必须同级。
2. `Settings → Pages`，从 `main` 分支的 `/(root)` 发布。
3. 部署后访问：`https://用户名.github.io/仓库名/`、`.../vlogs.html`、`.../stories.html`、`.../planner.html`。
4. 本站使用相对链接，可用于 GitHub Pages 子路径。更新后浏览器若缓存了旧 JS，请强制刷新。
5. Mapbox 交互地图仍需要你自己的 `pk.` 公开令牌。在 `mapbox_config.js` 配置并为令牌绑定允许的域名；不要上传私密 `sk.` 令牌。

在线影片、封面、地图及图片需要网络连接；网站不支持实时预订。

## V9.1 · YouTube 错误 153 修复

根据 YouTube 官方文档，错误 153 表示嵌入请求缺少 HTTP Referer 或等效客户端身份标识。单独通过 `file://` 打开 HTML 时无法稳定提供该标识。

- `vlogs.html` 设置 `<meta name="referrer" content="strict-origin-when-cross-origin">`。
- 正式网站下动态创建 `www.youtube.com/embed` 的 iframe，指定 `referrerpolicy="strict-origin-when-cross-origin"` 与 `origin`，并通过 YouTube IFrame Player API 监听 `onError`（包含 153、101、150）。
- 本地 `file://` / 不可信预览上下文直接显示友好的原站观看入口，不再强行嵌入必然可能失败的 iframe。
- 网络错误、播放器加载失败、作者不允许内嵌等情况会显示可操作的回退页面，保留原始视频入口。
- 更新 GitHub Pages 时请上传完整文件并刷新缓存。浏览器插件/系统策略可能继续屏蔽嵌入；不保证所有视频或所有环境一定可以在站内播放。

官方参考：https://developers.google.com/youtube/iframe_api_reference 以及 https://developers.google.com/youtube/terms/required-minimum-functionality
