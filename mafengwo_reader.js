(()=>{'use strict';
const reports=Array.isArray(window.EASTBOUND_REAL_REPORTS)?window.EASTBOUND_REAL_REPORTS:[];
const archive=Array.isArray(window.EASTBOUND_LICENSED_JOURNALS)?window.EASTBOUND_LICENSED_JOURNALS:[];
const params=new URLSearchParams(location.search);const id=params.get('id')||reports[0]?.id;
const r=reports.find(x=>x.id===id),d=archive.find(x=>x.id===id),main=document.getElementById('report-main');
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
if(!r||!d){main.innerHTML='<div class="mf-error"><h1>未找到该篇游记</h1><p>此游记链接可能已更新。</p><a href="travelogues.html">返回全部游记 ↗</a></div>';return;}
const shots=Array.isArray(d.screenshots)?d.screenshots:[];
const chapters=(d.chapters&&d.chapters.length?d.chapters:[{p:shots[0]?.page||1,name:'原文图文',detail:'按原帖顺序阅读'}]).slice().sort((a,b)=>a.p-b.p);
const cover=d.images?.[0]?.src||shots[0]?.src||'';
document.title='EASTBOUND | '+r.title;
let article='';
for(let i=0;i<chapters.length;i++){
 const c=chapters[i],next=chapters[i+1]?.p??Infinity;
 const current=shots.filter(x=>x.page>=c.p&&x.page<next);
 article+=`<section class="mf-chapter" id="chapter-${c.p}"><div class="mf-chapter-heading"><span>CHAPTER ${String(i+1).padStart(2,'0')}</span><h2>${esc(c.name)}</h2><p>${esc(c.detail)}</p></div><div class="mf-story-strip">${current.map((im,j)=>`<figure class="mf-page"><a href="${esc(im.src)}" target="_blank" rel="noopener noreferrer" aria-label="放大查看原帖截图 第${im.page}页"><img src="${esc(im.src)}" loading="${i===0&&j===0?'eager':'lazy'}" decoding="async" alt="${esc(im.alt||'原帖图文截图')}"></a></figure>`).join('')}</div></section>`;
}
const region=r.region==='ns'?'新斯科舍省':r.region==='maritimes'?'加拿大海洋三省':r.region;
main.innerHTML=`<div class="mf-hero"><div class="mf-kicker">EASTBOUND · REAL TRAVEL STORIES / 原帖记录</div><h1>${esc(r.title)}</h1><p class="mf-deck">${esc(r.summary||'阅读真实旅行者的原文照片记录。')}</p><div class="mf-tags"><span>${esc(region)}</span><span>来源：${esc(r.source)}</span><span>${shots.length} 组原文截图</span><span>中文</span></div><div class="mf-cover"><img src="${esc(cover)}" alt="${esc(r.title)}封面"></div></div><div class="mf-layout"><aside class="mf-sidebar"><div class="mf-sidebar-inner"><small>CONTENTS / 本文目录</small>${chapters.map((c,i)=>`<a href="#chapter-${c.p}"><b>${String(i+1).padStart(2,'0')}</b>${esc(c.name)}</a>`).join('')}<a class="mf-top" href="#report-main">↑ 返回文章开头</a></div></aside><div class="mf-body"><div class="mf-note"><b>原文阅读说明</b>　这篇游记来自你提供的马蜂窝网页截图 PDF。已保留原文文字与照片的原有先后顺序，并去除大部分侧栏和评论区。点击图片可查看较高清的单页。由于 PDF 没有文字层，原文采用连续截图呈现；未加载成功的图片无法恢复。</div>${article}<div class="mf-end"><h2>继续沿着海岸探索。</h2><p>文字与照片来自马蜂窝原帖及用户上传的页面截图，版权与转载授权尚待核实。建议公开发布前取得作者许可。</p><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">在马蜂窝查看原帖 ↗</a><a href="travelogues.html#report-search">浏览全部游记</a></div></div></div>`;
})();