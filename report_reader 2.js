(()=>{'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy={
 zh:{back:'← 返回全部游记',kicker:'原作者游记 / 沉浸式阅读',source:'原始来源',read:'在原站阅读 ↗',text:'原文与图文记录',shots:'原文截图',photo:'原帖照片',photoSource:'图片原出处 ↗',enlarge:'查看原图',rights:'来源资料所标注的转载授权尚未核实；公开发布前应取得必要授权',missing:'原文正文未采集完整，请通过原站链接查看；已采集的图片仍可浏览。',none:'暂无可展示的正文或原始图片',embed:'尝试在此打开原始网页',embedHelp:'第三方网站可能禁止内嵌；如无法显示，请访问原站。',notFound:'没有找到这篇游记',meta:'旅行信息',imageCount:'张原帖图片',original:'原文来自原作者',readTime:'阅读时间约 {n} 分钟'},
 en:{back:'← Back to all journals',kicker:'Original travel journals / illustrated reading',source:'Original source',read:'Read on original website ↗',text:'Original story & photographs',shots:'Original screenshots',photo:'Original photograph',photoSource:'Photo source ↗',enlarge:'View full-size photo',rights:'Imported material has unverified republication rights; obtain authorization before public publication',missing:'Full article text could not be extracted. Use the source link to read it; archived photographs remain available below.',none:'No article text or original photographs available',embed:'Try opening the source page here',embedHelp:'The publisher may block embedded pages. If so, use the original source link.',notFound:'Travel journal not found',meta:'Trip details',imageCount:'original photographs',original:'From the original author',readTime:'About {n} min read'},
 fr:{back:'← Retour aux récits',kicker:'Récit original / lecture illustrée',source:'Source originale',read:'Lire sur le site d’origine ↗',text:'Récit original et photos',shots:'Captures de la page originale',photo:'Photographie originale',photoSource:'Source de la photo ↗',enlarge:'Voir en grand',rights:'Droits de republication non vérifiés ; demander autorisation avant publication',missing:'Le texte complet n’a pas pu être récupéré. Consultez la source ; les photos conservées sont visibles ici.',none:'Aucun texte ou photographie disponible',embed:'Essayer d’ouvrir la source ici',embedHelp:'Le site tiers peut interdire l’intégration.',notFound:'Récit introuvable',meta:'Informations du voyage',imageCount:'photos originales',original:'Texte de l’auteur',readTime:'Environ {n} min de lecture'}
};
function locale(){try{const v=localStorage.getItem('eastbound-language');return ['en','zh','fr'].includes(v)?v:'en'}catch(_){return 'en'}}
function safeUrl(s){try{const u=new URL(s,location.href);return ['http:','https:'].includes(u.protocol)?u.href:''}catch(_){return ''}}
function localPath(s){return typeof s==='string'&&s&&!s.startsWith('//')&&!s.startsWith('/')&&!s.includes('..')&&!s.includes('\\')&&!/^[a-z]+:/i.test(s)?s:''}
const lang=locale(),t=copy[lang],id=new URLSearchParams(location.search).get('id')||'';
const reports=Array.isArray(window.EASTBOUND_REAL_REPORTS)?window.EASTBOUND_REAL_REPORTS:[];
const records=Array.isArray(window.EASTBOUND_LICENSED_JOURNALS)?window.EASTBOUND_LICENSED_JOURNALS:[];
const rec=reports.find(x=>x.id===id),article=records.find(x=>x.id===id);
document.documentElement.lang=lang;
$('report-back').textContent=t.back;
if(!rec){$('report-main').innerHTML=`<h1>${esc(t.notFound)}</h1><p><a href="travelogues.html">${esc(t.back)}</a></p>`;return}
document.title='EASTBOUND | '+rec.title;
const source=safeUrl(article?.sourceUrl||rec.url);
const paragraphs=(Array.isArray(article?.paragraphs)?article.paragraphs:[]).filter(x=>typeof x==='string'&&x.trim());
const images=(Array.isArray(article?.images)?article.images:[]).filter(x=>localPath(x.src)&&x.rightsRef&&x.credit&&!x.displayDuplicate);
const screenshots=(Array.isArray(article?.screenshots)?article.screenshots:[]).filter(x=>localPath(x.src)&&x.credit&&x.rightsRef);
const originalLink=source?`<a class="report-source-btn" href="${esc(source)}" target="_blank" rel="noopener noreferrer">${esc(t.read)}</a>`:'';
const originalLabel=rec.language==='zh'?'zh':'en';
const ctripFacts=paragraphs.length>=8&&['出发时间','行程天数','人均花费','和谁出行'].every((x,i)=>paragraphs[i*2]===x);
const contentStart=ctripFacts?8:0;
function sentenceChunks(p){
 const isCjk=(p.match(/[\u3400-\u9fff]/g)||[]).length>16;
 const max=isCjk?123:350;
 if(p.length<max*1.48)return [p];
 // Sentence boundaries only; never discard or rewrite the author's characters.
 const pieces=p.match(/[^。！？!?；;]+[。！？!?；;]?/g)||[p];
 if(pieces.length<2)return [p];
 const out=[];let cur='';
 for(const piece of pieces){if(cur&&cur.length+piece.length>max){out.push(cur);cur=piece}else cur+=piece}
 if(cur)out.push(cur);
 return out.length?out:[p];
}
function heading(p,i){
 if(p.length>105||/[。！？。.!?]$/.test(p)||/^[-•]/.test(p))return 0;
 if(/^={2}[^=]+={2}$/.test(p)||/^【[^】]+】/.test(p))return 3;
 if(/^(?:Days?\s*\d|Overview$|\d+[-–]Day|How Long|Travelling|Getting Around|Best Time|Mobile Data|Payments and|Visa Requirements|Final Thoughts|When Renting|Why Public|10-Day Eastern)/i.test(p))return 2;
 if(p.length<35&&/[\u4e00-\u9fff]/.test(p)&&!/[，,：:、]/.test(p))return 3;
 if(p.length<65&&p.endsWith('?'))return 3;
 return 0;
}
function photoFigure(im,i){
 const src=localPath(im.src);const url=safeUrl(im.sourceUrl)||source;const caption=(im.caption||'').trim();
 return `<figure class="report-inline-photo"><a href="${esc(src)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t.enlarge)}" title="${esc(t.enlarge)}"><img src="${esc(src)}" alt="${esc(im.alt||caption||rec.title)}" loading="lazy" decoding="async"${im.width&&im.height?` width="${Number(im.width)}" height="${Number(im.height)}"`:''}></a><figcaption>${caption?`<span class="report-photo-description">${esc(caption)}</span>`:`<span>${esc(t.photo)} ${String(i+1).padStart(2,'0')}</span>`}<span class="report-photo-credit">© ${esc(im.credit)}${url?` · <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(t.photoSource)}</a>`:''}</span></figcaption></figure>`;
}
function photoGroup(list){if(!list.length)return '';
 const multi=list.length>1;return `<div class="report-inline-photos${multi?' report-inline-photos-multi':''}" aria-label="${esc(t.original)}">${list.map(x=>photoFigure(x.im,x.n)).join('')}</div>`;
}
// Image placement is stored with each record and follows the original article's paragraph flow.
// A photograph that is only available as a cover is placed by its subject/introductory context.
function storyMarkup(){
 const map=new Map();images.forEach((im,i)=>{const pos=Math.min(Math.max(Number.isInteger(im.afterParagraph)?im.afterParagraph:contentStart,contentStart),Math.max(contentStart,paragraphs.length-1));if(!map.has(pos))map.set(pos,[]);map.get(pos).push({im,n:i})});
 const facts=ctripFacts?`<div class="report-trip-facts" aria-label="${esc(t.meta)}">${[0,2,4,6].map(i=>`<div><span>${esc(paragraphs[i])}</span><strong>${esc(paragraphs[i+1])}</strong></div>`).join('')}</div>`:'';
 let out=facts;
 for(let i=contentStart;i<paragraphs.length;i++){
  const p=paragraphs[i];const h=heading(p,i);const imgs=map.get(i)||[];
  if(h){const txt=p.replace(/^={2}|={2}$/g,'');out+=`<h${h} class="report-article-heading">${esc(txt)}</h${h}>`;out+=photoGroup(imgs);continue}
  if(/^[-•]\s*/.test(p)){out+=`<p class="report-article-list-line">${esc(p.replace(/^[-•]\s*/,''))}</p>`;out+=photoGroup(imgs);continue}
  const chunks=sentenceChunks(p);
  // For image-rich paragraphs, interleave smaller image groups between sentence groups.
  for(let j=0;j<chunks.length;j++){
   out+=`<p>${esc(chunks[j])}</p>`;
   const here=imgs.filter((_,k)=>Math.min(chunks.length-1,Math.floor((k+1)*chunks.length/(imgs.length+1)))===j);
   out+=photoGroup(here);
  }
 }
 if(!paragraphs.length)out+=`<p class="report-unavailable-copy">${esc(article?.articleTextIncomplete?t.missing:t.none)}</p>`;
 if(!paragraphs.length&&images.length)out+=photoGroup(images.map((im,i)=>({im,n:i})));
 return out;
}
const hasText=paragraphs.length>0,hasPhotos=images.length>0,hasShots=screenshots.length>0;
const screenshotFigures=screenshots.map((im,i)=>{const src=localPath(im.src);return `<figure class="report-screenshot"><a href="${esc(src)}" target="_blank" rel="noopener noreferrer"><img src="${esc(src)}" alt="${esc(im.alt||'Screenshot '+(i+1))}" loading="lazy"></a><figcaption><span>${esc(im.caption||t.shots+' '+(i+1))} · © ${esc(im.credit)}</span><a href="${esc(safeUrl(im.sourceUrl)||source)}" target="_blank" rel="noopener noreferrer">${esc(t.source)} ↗</a></figcaption></figure>`}).join('');
const textPanel=(hasText||hasPhotos)?`<div class="report-reading-panel" data-reader-panel="text" role="tabpanel"><article class="report-original-copy" lang="${esc(rec.language||'en')}">${storyMarkup()}</article></div>`:'';
const shotPanel=hasShots?`<div class="report-reading-panel" data-reader-panel="screenshots" role="tabpanel"${hasText||hasPhotos?' hidden':''}><div class="report-screenshot-stack">${screenshotFigures}</div></div>`:'';
const tabs=((hasText||hasPhotos)&&hasShots)?`<div class="report-tabs" role="tablist"><button class="report-tab" data-reader-tab="text" role="tab" aria-selected="true">${esc(t.text)}</button><button class="report-tab" data-reader-tab="screenshots" role="tab" aria-selected="false">${esc(t.shots)} <span class="report-tab-count">${screenshots.length}</span></button></div>`:'';
const words=paragraphs.join('').length,readMinutes=Math.max(1,Math.round(words/(rec.language==='zh'?350:950)));
const count=hasPhotos?`<span>${images.length} ${esc(t.imageCount)}</span>`:'';
const reader=`<section class="report-sheet report-reader-sheet"><div class="report-section-heading"><div><span class="report-eyebrow">EASTBOUND / JOURNAL</span><h2>${esc(t.text)}</h2></div>${originalLink}</div>${tabs}<div class="report-inline-notice">${esc(t.rights)} · ${esc(article?.rightsRef||'')}</div>${textPanel}${shotPanel}</section>`;
const embed=source?`<details class="report-embed"><summary>${esc(t.embed)}</summary><p>${esc(t.embedHelp)}</p><a href="${esc(source)}" target="_blank" rel="noopener noreferrer">${esc(t.read)}</a><div class="report-frame-slot" id="report-frame-slot"></div></details>`:'';
$('report-main').innerHTML=`<div class="report-kicker">${esc(t.kicker)}</div><h1>${esc(article?.title||rec.title)}</h1><p class="report-lede">${esc(rec.source)} · ${esc(rec.date||'')} · ${esc((rec.region||'').toUpperCase())} · ${esc((rec.language||'en').toUpperCase())}</p><div class="report-info"><span>${esc(article?.author||rec.source)}</span>${hasText?`<span>${esc(t.readTime.replace('{n}',String(readMinutes)))}</span>`:''}${count}</div>${reader}<section class="report-sheet report-bottom-sheet"><h2>${esc(t.source)}</h2><p>${esc(t.rights)}</p><div class="report-source-footer">${originalLink}</div>${embed}</section>`;
const details=document.querySelector('.report-embed');
if(details)details.addEventListener('toggle',()=>{if(!details.open)return;const slot=$('report-frame-slot');if(!slot||slot.firstElementChild)return;const f=document.createElement('iframe');f.src=source;f.title=t.embed;f.loading='lazy';f.referrerPolicy='strict-origin-when-cross-origin';f.setAttribute('sandbox','allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation');slot.append(f)});
document.querySelectorAll('[data-reader-tab]').forEach(tab=>tab.addEventListener('click',()=>{const name=tab.dataset.readerTab;document.querySelectorAll('[data-reader-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===tab)));document.querySelectorAll('[data-reader-panel]').forEach(p=>{p.hidden=p.dataset.readerPanel!==name})}));
})();
