# EASTBOUND V23 变更说明

## 首页“查看更多城市游记”修复
- 改为实际的 `<a href="travelogues.html#report-search">` 超链接。
- 不依赖 JS 数量计算、事件绑定、动态显示状态；即使脚本失败仍能直接打开全部游记。
- 保留前一版移除的 Browse Real Traveler Reports 按钮为删除状态。

## 游记
- 原有马蜂窝 `24760353` 仍保留。
- 新增 `8330606`（26页PDF，去掉评论和页脚后保留21页原帖内容）。
- 新增 `24590047`（41页PDF，去掉评论和页脚后保留40页原帖内容）。
- 合计3篇，原文截图（不是 OCR 或可复制文本），按原始图文顺序展示，并提供章节目录。
- 所有资源本地保存，GitHub Pages 不需要动态后端。
- 原帖著作权和图片使用授权未核实，发布前需要权利人许可。

## GitHub Pages
把完整ZIP解压并上传到发布目录，保持 `journal_media/` 文件夹路径不变。若只更新关键逻辑，可替换 `index.html`, `reading.js`, `reading-import.css`, `real_reports_data.js`, `licensed_journals_data.js`, `mafengwo_reader.js`, `travelogues.html`, `real_reports.js`, 并上传新增的两组 `journal_media` 图片。
