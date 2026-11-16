# EASTBOUND V44 — 购物卡片封面统一修复

更新日期：2026-11-15

## 修复原因

V42 仅为 13 个购物地点配置图片。未配置图片的地点在 `explorer.js` 中直接返回空字符串，造成同一排卡片有的有封面，有的没有封面，卡片视觉不一致。

## 已完成

- 所有购物卡片均保留相同高度的封面区域（桌面 178px、窄屏 195px）。
- 为 `Yorkville / Bloor Street`、`Kensington Market`、`St. Lawrence Market`、`Princess Street Kingston` 补充对应地点的真实商圈/室内照片及可访问来源链接。
- 保留 V42 的 13 个原有照片，现共 17 个地点已配置实景照片。
- 其他地点使用**明确标注“对应地点实景照片待补充”的装饰性封面**，而不是把无关的照片冒充该商场/街区。
- 对远程照片加载失败的情况自动转成同样高度的装饰性封面，不再造成卡片高度和布局跳动。
- 保留现有城市筛选、显示更多、地图和详情链接，保留 V43 餐厅板块（本次不修改）。

## 直接覆盖更新

请在已安装 V42 + V43 的网站根目录覆盖压缩包同名文件：`home.html`、`explorer.js`、`shopping_photos.js`、`shopping_photos.css`。随后清除浏览器缓存或强制刷新。

## 实景图出处

- Yorkville / Bloor Street：Bloor-Yorkville BIA 活动照片 — https://www.bloor-yorkville.com/holiday_magic/holiday_lights.php
- Kensington Market：Public Butter 的街区商户实景摄影（Vintage Depot 店面）— https://publicbutter.com/blogs/the-kensington-market
- St. Lawrence Market：Destination Ontario 官方旅游图 — https://www.destinationontario.com/en-ca/attractions/st-lawrence-market
- Princess Street Kingston：Downtown Kingston BIA 商圈照片 — https://downtownkingston.ca/blogs/discover/thingstodoinjunedowntown

所有图片均为第三方在线地址，非离线图片；正式公开部署仍需确认权利人同意和版权要求。部分站点可能会阻止第三方嵌入或更改图片地址，因此设计了加载失败时的视觉降级。
