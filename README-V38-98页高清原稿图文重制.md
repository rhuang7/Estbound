# EASTBOUND V38 — 高清 PDF 专题重制

- 基础版本：V37。保留 17 篇游记、24 个独立专题章节及跨页面 BGM。
- 原始资料：用户上传的 98 页网页 PDF `screencapture-mafengwo-cn-i-17047903-html-2026-11-14-03_52_30.pdf`。
- 专题：`maritimes-attractions-guide.html`。
- 所有新提取照片放在：`assets/guides/maritimes-hires/`，沿原稿顺序呈现，保留摄影署名和水印。
- PDF 属于图片 PDF，没有原生文字层。正文使用 OCR 识别后排版为可复制文字，可能存在个别错字、缺失或识别错误的数字、价格和时间。任何费用、营业时间等信息必须以官方最新信息为准。
- 源码中没有嵌入 466MB 的原始 PDF；原始 PDF 由用户持有，网站只包含用于网页展示的独立图像与对应文字。
- 本次不改动餐厅数据、地图数据、游记资料库与 BGM 播放器结构。

## 部署

将 V38 升级补丁的文件解压后复制到 GitHub Pages 发布根目录，覆盖现有同名文件；如需全量独立部署，使用完整 V38 ZIP。请勿只上传 HTML 而漏掉 `assets/guides/maritimes-hires/`。
