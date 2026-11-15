# EASTBOUND V25 — 首页游记空白与展开按钮稳定修复

- 修复原 `reading.js` 初始化过程引用不存在的 `RESTAURANT_GUIDES`，导致脚本提前终止的问题。
- 游记首页卡片直接预渲染在 `index.html`，**不依赖 JavaScript 也会默认展示整行**（桌面 3、平板 2、手机 1）。
- `查看更多城市游记` 采用浏览器原生 `<details><summary>`，点击后在本页展开剩余卡片，再点击即可收起；脚本故障时仍可操作。
- `home_journals.js` 为可选渐进增强，提供独立的搜索、筛选与窗口宽度响应，不依赖餐厅、地图和其它模块。
- 移除搜索栏旁冗余英文跳转链接，不改变 6 篇游记详情或原图内容。
- 为避免浏览器继续加载旧版本首页脚本，请替换 `index.html`, `reading.js`, `reading-import.css` 并上传新增的 `home_journals.js`；GitHub Pages 发布后用强制刷新检查。

所有原始游记文本及截图转载权限仍为 `not_verified`，发布前请核实作者许可。
