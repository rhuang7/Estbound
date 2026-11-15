/* EASTBOUND V40 — persistent two-track BGM playlist with a collapsible player. */
(function () {
  'use strict';
  const audio = document.getElementById('eb-home-music');
  const panel = document.getElementById('eastbound-bgm');
  const playButton = document.getElementById('eb-bgm-toggle');
  const previousButton = document.getElementById('eb-bgm-prev');
  const nextButton = document.getElementById('eb-bgm-next');
  const trackName = document.getElementById('eb-bgm-name');
  const trackNumber = document.getElementById('eb-bgm-track-number');
  const status = document.getElementById('eb-bgm-status');
  const foldButton = document.getElementById('eb-bgm-fold');
  if (!audio || !panel || !playButton || !previousButton || !nextButton || !trackName || !trackNumber || !status || !foldButton) return;

  const playlist = Object.freeze([
    { title: 'BGM 01 · 原版', src: 'assets/audio/eastbound-home-bgm.mp3' },
    { title: 'BGM 02 · Travel Music', src: 'assets/audio/atlasaudio-travel-travel-music-576658.mp3' }
  ]);
  let index = 0;
  let manuallyPaused = false;
  let loadFailed = false;
  let playRequest = 0;
  audio.loop = false;  // Move to the next song instead of repeating one song.
  audio.volume = 0.55;
  const collapsedStorageKey = 'eastbound-bgm-v40-collapsed';
  let collapsed = false;
  try { collapsed = window.localStorage.getItem(collapsedStorageKey) === '1'; } catch (_) {}

  function updateFold() {
    panel.dataset.collapsed = String(collapsed);
    foldButton.setAttribute('aria-expanded', String(!collapsed));
    foldButton.setAttribute('aria-label', collapsed ? '展开背景音乐播放器' : '收起背景音乐播放器');
    foldButton.title = collapsed ? '展开播放器' : '收起播放器';
  }
  foldButton.addEventListener('click', function () {
    collapsed = !collapsed;
    try { window.localStorage.setItem(collapsedStorageKey, collapsed ? '1' : '0'); } catch (_) {}
    updateFold();
  });
  updateFold();

  function update() {
    const playing = !audio.paused && !audio.ended;
    panel.dataset.playing = String(playing);
    panel.dataset.track = String(index + 1);
    trackName.textContent = playlist[index].title;
    trackNumber.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(playlist.length).padStart(2, '0');
    playButton.setAttribute('aria-pressed', String(playing));
    playButton.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
    playButton.title = playing ? '暂停背景音乐' : '播放背景音乐';
    status.textContent = loadFailed ? '音频加载失败，请切换曲目' : playing ? '正在播放' : manuallyPaused ? '已暂停' : '点击开启音乐';
  }

  function tryPlay() {
    if (manuallyPaused || loadFailed) { update(); return; }
    const request = ++playRequest;
    let result;
    try { result = audio.play(); }
    catch (_) { update(); return; }
    if (result && typeof result.then === 'function') {
      result.then(function () {
        if (request === playRequest) update();
      }).catch(function () {
        if (request === playRequest) update(); // Browser blocked audible autoplay.
      });
    }
    update();
  }

  function changeTrack(offset, fromEnded) {
    const wasPlaying = fromEnded || (!audio.paused && !audio.ended);
    const wasAutoAttempt = !manuallyPaused && !loadFailed;
    index = (index + offset + playlist.length) % playlist.length;
    loadFailed = false;
    ++playRequest;
    audio.pause();
    audio.src = playlist[index].src;
    audio.load();
    if (wasPlaying || (!manuallyPaused && wasAutoAttempt)) {
      // A direct click on Next/Previous also counts as a playback gesture.
      tryPlay();
    } else update();
  }

  playButton.addEventListener('click', function () {
    if (!audio.paused) {
      manuallyPaused = true;
      ++playRequest;
      audio.pause();
    } else {
      manuallyPaused = false;
      loadFailed = false;
      tryPlay();
    }
    update();
  });
  previousButton.addEventListener('click', function () { changeTrack(-1, false); });
  nextButton.addEventListener('click', function () { changeTrack(1, false); });
  audio.addEventListener('ended', function () {
    if (!manuallyPaused) changeTrack(1, true);
  });
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('loadedmetadata', update);
  audio.addEventListener('error', function () { loadFailed = true; update(); });

  // The existing cross-page bridge calls this when a visitor interacts with an iframe.
  // A deliberate pause must remain paused during navigation and subsequent interactions.
  window.EASTBOUND_BGM_UNLOCK = function () {
    if (!manuallyPaused && !loadFailed && audio.paused) tryPlay();
  };
  const unlock = function (event) {
    if (event.target && event.target.closest && event.target.closest('#eastbound-bgm')) return;
    window.EASTBOUND_BGM_UNLOCK();
  };
  document.addEventListener('pointerdown', unlock, { once: true, capture: true });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') unlock(e);
  }, { once: true, capture: true });
  update();
  tryPlay(); // Attempt autoplay; browsers may require user interaction.
})();
