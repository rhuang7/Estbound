# EASTBOUND V30 — 首页背景音乐

在 V29 上新增 `assets/audio/eastbound-home-bgm.mp3`，保留用户提供的完整音乐（约 142 秒），在首页自动尝试播放、循环播放。右侧悬浮播放器支持暂停／继续。音乐仅加载于 `index.html`，不影响其他页面。

**浏览器自动播放限制：** Chrome、Safari、Firefox 等通常会阻止未经用户交互的有声自动播放。V30 会在加载时尝试播放；如果被阻止，播放器显示“点击开启音乐”。点击播放器可播放，也会在首次页面交互时再尝试。手动暂停后不会因页面其他点击自行恢复。

补丁包在当前 V29 站点根目录覆盖 `index.html`，并新增 `bgm-player.css`、`bgm-player.js`、`assets/audio/eastbound-home-bgm.mp3`。GitHub Pages 部署后建议强制刷新缓存。

使用音乐前请确认其网站公开播放授权；用户提供文件不等于已核实版权许可。
