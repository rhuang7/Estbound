# EASTBOUND V39 · 全站双曲目 BGM

基于 EASTBOUND V38。

## 安装
将补丁内以下文件上传到 GitHub Pages 网站发布根目录，覆盖旧文件并新增音频：
- `player.html`：添加上一首、播放暂停、下一首 3 个按钮。
- `bgm-player.js`：两曲播放列表、顺序循环、切歌状态处理。
- `bgm-player.css`：深蓝色悬浮窗新布局，适配手机端。
- `assets/audio/atlasaudio-travel-travel-music-576658.mp3`：新增音乐文件。

原有 `assets/audio/eastbound-home-bgm.mp3` 必须保留，不要删除或清空 `assets/` 文件夹。

## 行为
- 默认尝试从原版 BGM 01 自动播放；自动播放受浏览器策略限制时点击播放按钮即可。
- 依次播放 01 → 02 → 01，歌曲结束自动切换。
- 右侧悬浮窗支持上一首、播放暂停、下一首；手动暂停后不会因切换页面或点击页面自动恢复。
- 仍使用旧版 `player.html` 外层播放器，通过页面内 iframe 切换内容，因此站内导航时背景音乐元素不会重建。

## 说明
- 音频公开使用前需确保有授权。
