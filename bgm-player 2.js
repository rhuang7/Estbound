/* EASTBOUND V30 background music: unmuted autoplay attempt; browser-policy fallback. */
(function(){
  'use strict';
  const audio = document.getElementById('eb-home-music');
  const panel = document.getElementById('eastbound-bgm');
  const toggle = document.getElementById('eb-bgm-toggle');
  const status = document.getElementById('eb-bgm-status');
  if(!audio || !panel || !toggle || !status) return;
  let manuallyPaused = false;
  let loadFailed = false;
  const update = () => {
    const playing = !audio.paused && !audio.ended;
    panel.dataset.playing = String(playing);
    toggle.setAttribute('aria-pressed',String(playing));
    toggle.setAttribute('aria-label',playing ? '暂停背景音乐' : '播放背景音乐');
    toggle.title = playing ? '暂停背景音乐' : '播放背景音乐';
    status.textContent = loadFailed ? '音乐加载失败' : playing ? '正在播放 · 循环' : manuallyPaused ? '已暂停' : '点击开启音乐';
  };
  const tryPlay = () => {
    if(manuallyPaused || loadFailed || !audio.paused) { update(); return; }
    let result;
    try { result = audio.play(); }
    catch(e) { update(); return; }
    if(result && typeof result.catch==='function') result.catch(() => update());
  };
  toggle.addEventListener('click', () => {
    if(!audio.paused){ manuallyPaused=true; audio.pause(); update(); }
    else { manuallyPaused=false; tryPlay(); }
  });
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('error', () => {loadFailed=true;update();});
  audio.addEventListener('loadedmetadata', update);
  window.EASTBOUND_BGM_UNLOCK = () => { if (!manuallyPaused && audio.paused) tryPlay(); };
  audio.volume = 0.55;
  update();
  // Most browsers disallow audible autoplay until a gesture. Request autoplay;
  // if denied, the right-side play button remains visible and operational.
  tryPlay();
  // Retry on the first eligible interaction anywhere outside the controller.
  // A manually paused player must never restart from general page interactions.
  const unlock=(event)=>{
    if(event.target && event.target.closest && event.target.closest('#eastbound-bgm')) return;
    if(!manuallyPaused && audio.paused) tryPlay();
  };
  document.addEventListener('pointerdown', unlock, {once:true, capture:true});
  document.addEventListener('keydown', e=>{
    if(e.key === 'Enter' || e.key === ' ') unlock(e);
  },{once:true, capture:true});
})();
