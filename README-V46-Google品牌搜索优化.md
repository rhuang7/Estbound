# EASTBOUND V46 — Google 品牌搜索优化（GitHub Pages）

## 目标
提高用户通过「EASTBOUND 加拿大东部旅游」找到网站的可能性，但 Google 排名、搜索结果展示和收录速度均不能保证。

## 更新文件
- `index.html`：不再是 505 字节的自动跳转页，而是基于 V45 `home.html` 的完整首页内容；保留原有卡片/城市/购物/餐厅等脚本与样式引用。增加中文关键词标题、描述、canonical、Open Graph、WebSite JSON-LD；将现有首页眉题改为「EASTBOUND 加拿大东部旅游」。
- `home.html`：仅增加指向站点根目录的 canonical，继续保留旧的 iframe + BGM 运行方式。
- `player.html`：保留原有全站连续 BGM 播放器，标记 `noindex` 避免与正式首页争夺收录，设置 canonical 到站点根目录。
- `sitemap.xml`：列出真实内容页面，放在 GitHub 仓库根目录，可通过 `https://rhuang7.github.io/Estbound/sitemap.xml` 访问。

## 音乐兼容性说明
新首页直接呈现完整旅游页面，并提供原有两首音乐的固定播放器；浏览器可能阻止未经用户操作的自动播放。
原有「全站连续播放」模式仍然可通过首页「♫ 连续音乐模式」入口进入，`player.html` 保持原样使用 iframe 持续播放。
**直接在新首页播放音乐后，再跳转到独立页面时可能发生一次音乐重载/短暂停顿。** 如希望全程无缝播放，请先进入连续音乐模式。这是为了改善 SEO 对原有音乐架构作出的折中，并非承诺两种模式下都完全无缝。

## 安装
1. 备份 GitHub `rhuang7/Estbound` 的现有 `index.html`、`home.html`、`player.html`。
2. 把此更新包的 4 个文件上传至 GitHub 仓库 `main` 分支的根目录，选择覆盖同名文件（**不要把整个 zip 当作文件上传**）。
3. 等 GitHub Pages 完成发布后，检查网站根目录、新 `/sitemap.xml`、以及「♫ 连续音乐模式」链接。
4. 到 Google Search Console → 站点地图，提交 `sitemap.xml`。
5. 到「网址检查」，检查 `https://rhuang7.github.io/Estbound/` → 测试实际网址 → 请求编入索引。
6. 未来数天至数周对比 Search Console 搜索查询「EASTBOUND 加拿大东部旅游」的曝光和点击。

## 补充
- 不要把 `robots.txt` 放在 `/Estbound/` 项目目录并当作有效的站点级 robots 文件；该文件只有放在 `rhuang7.github.io` 的根目录才是标准 robots.txt。
- 提交 sitemap 不保证全部网页被索引。次级页面中依然存在客户端音乐 shell 跳转，未来若要优化每篇文章的独立搜索排名，应逐页改为直接显示正文。
- 本包未修改餐厅、购物和景点的现有图片/数据；所有 CSS/JS/音频继续依赖仓库现有文件。
- 此包经 HTML/文件引用静态检查，尚未在用户的 GitHub Pages 上实际部署或对所有交互进行在线测试。
