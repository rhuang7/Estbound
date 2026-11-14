/* EASTBOUND V25 — independently hydrated homepage travel journals.
   HTML contains real cards before scripts run; <details> opens without JavaScript. */
(()=>{
 'use strict';
 const setup=()=>{
  const section=document.getElementById('reading');
  const first=document.getElementById('reading-grid');
  const more=document.getElementById('reading-expand');
  const second=document.getElementById('reading-extra-grid');
  const search=document.getElementById('reading-search');
  const city=document.getElementById('reading-city');
  const empty=document.getElementById('reading-no-match');
  if(!section||!first||!second||!more)return;
  // Capture all journals from the HTML itself. No external data scripts needed.
  const originals=[];
  const seen=new Set();
  [...first.querySelectorAll('[data-journal-id]'),...second.querySelectorAll('[data-journal-id]')].forEach(node=>{
   const id=node.dataset.journalId;
   if(!id||seen.has(id))return;
   seen.add(id);originals.push(node.cloneNode(true));
  });
  const rowSize=()=>matchMedia('(max-width: 600px)').matches?1:matchMedia('(max-width: 1100px)').matches?2:3;
  let previousRow=rowSize();
  const render=(reset=false)=>{
   if(reset)more.open=false;
   const key=(search?.value||'').trim().toLocaleLowerCase();
   const chosen=city?.value||'all';
   const matches=originals.filter(node=>{
    const locality=chosen==='all'||node.dataset.city===chosen||node.dataset.region===chosen;
    return locality&&(!key||(node.dataset.search||'').toLocaleLowerCase().includes(key));
   });
   const max=rowSize();
   first.replaceChildren(...matches.slice(0,max).map(node=>node.cloneNode(true)));
   second.replaceChildren(...matches.slice(max).map(node=>node.cloneNode(true)));
   more.hidden=matches.length<=max;
   if(more.hidden)more.open=false;
   if(empty)empty.hidden=matches.length!==0;
   section.classList.add('journals-hydrated');
  };
  search?.addEventListener('input',()=>render(true));
  city?.addEventListener('change',()=>render(true));
  window.addEventListener('resize',()=>{const next=rowSize();if(next!==previousRow){previousRow=next;render(false);}});
  window.addEventListener('eastbound:languagechange',()=>render(false));
  window.EASTBOUND_refreshHomeJournals=()=>render(false);
  render();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);
 else setup();
})();
