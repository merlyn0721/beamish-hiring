/* Beamish v8 — mobile backend subpage access fallback.
   Some CMS custom panels omitted the normal subtabs. Show them only where missing. */
(function(){'use strict';
  const target=document.getElementById('main');
  if(!target)return;
  let pending=false;
  function ensureTabs(){
    if(innerWidth>740)return;
    if(typeof ROLES==='undefined'||typeof role==='undefined'||!role)return;
    const subs=ROLES[role].cats[cat]||[];
    if(subs.length<=1)return;
    if(target.querySelector('.subtabs'))return;
    const bar=document.createElement('nav');
    bar.className='subtabs beamish-mobile-subtabs';
    bar.setAttribute('aria-label',cat+' pages');
    subs.forEach(x=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.textContent=x;
      if(x===sub){btn.classList.add('active');btn.setAttribute('aria-current','page')}
      btn.addEventListener('click',()=>go(cat,x));
      bar.appendChild(btn);
    });
    const heading=target.querySelector('.page-head');
    if(heading)heading.insertAdjacentElement('afterend',bar);
    else target.insertBefore(bar,target.firstChild);
  }
  const watcher=new MutationObserver(()=>{
    if(pending)return;pending=true;
    queueMicrotask(()=>{pending=false;ensureTabs()});
  });
  watcher.observe(target,{childList:true,subtree:true});
  addEventListener('resize',ensureTabs);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureTabs);
  else ensureTabs();
})();
