/* Beamish v8 navigation reliability layer.
   Adds dedicated expand buttons while keeping the existing page routing.
   Works after any sidebar re-render, including all three backend roles. */
(function(){'use strict';
  const categorySelector='.side .navItem, .sidebar .navitem';
  function navItems(){return document.querySelectorAll(categorySelector)}
  function closeMenus(except){
    navItems().forEach(item=>{
      if(item!==except){item.classList.remove('nav-open');
        const b=item.querySelector(':scope > .beamish-nav-expander');
        if(b)b.setAttribute('aria-expanded','false');
      }
    });
  }
  function enhance(){
    navItems().forEach(item=>{
      const menu=item.querySelector(':scope > .flyout');
      const main=item.querySelector(':scope > .navBtn, :scope > .navbutton');
      if(!main||!menu)return;
      const subButtons=menu.querySelectorAll('button');
      if(!subButtons.length)return;
      if(item.querySelector(':scope > .beamish-nav-expander'))return;
      const category=(main.innerText||main.textContent||'Section').replace(/[›▸▼]/g,'').trim();
      const toggle=document.createElement('button');
      toggle.className='beamish-nav-expander';
      toggle.type='button';
      toggle.setAttribute('aria-label','Show '+category+' subpages');
      toggle.setAttribute('aria-haspopup','true');
      toggle.setAttribute('aria-expanded','false');
      toggle.title='Browse '+category+' subpages';
      toggle.textContent='›';
      toggle.addEventListener('click',function(e){
        e.stopPropagation();
        const isOpen=!item.classList.contains('nav-open');
        closeMenus(item);
        item.classList.toggle('nav-open',isOpen);
        toggle.setAttribute('aria-expanded',String(isOpen));
        if(isOpen){const first=menu.querySelector('button');if(first)first.focus({preventScroll:true})}
      });
      item.appendChild(toggle);
      menu.setAttribute('aria-label',category+' subpages');
      for(const btn of subButtons){
        btn.addEventListener('click',()=>closeMenus());
      }
    });
  }
  // MutationObserver handles re-created sidebar DOM on every route change.
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{queued=false;enhance()});
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest(categorySelector))closeMenus();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      closeMenus();
      if(document.activeElement&&document.activeElement.closest(categorySelector))document.activeElement.blur();
    }
  });
  document.addEventListener('DOMContentLoaded',()=>{
    enhance();
    for(const sel of ['#sideNav','#navlist']){
      const host=document.querySelector(sel);
      if(host)observer.observe(host,{childList:true,subtree:true});
    }
  });
  if(document.readyState!=='loading'){
    enhance();
    for(const sel of ['#sideNav','#navlist']){
      const host=document.querySelector(sel);
      if(host)observer.observe(host,{childList:true,subtree:true});
    }
  }
})();
