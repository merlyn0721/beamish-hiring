/* Beamish v23: real page navigation, no flyout. Back / Forward use native
   browser history, with route state also recoverable via the URL. */
(function () {
  'use strict';
  const pathname=location.pathname;
  const scope=pathname.includes('/backend/')?'backend':pathname.includes('/candidate/')?'candidate':pathname.includes('/employer/')?'employer':
    document.querySelector('#navlist')?'backend':document.querySelector('#sideNav')?.tagName==='NAV'?'employer':
    document.querySelector('#sideNav')?'candidate':null;
  if(!scope)return;
  document.body.classList.add('bm-v23-nav');
  document.body.dataset.beamishSurface=scope;
  let changing=false,position=0,lastPosition=0,initialized=false;
  const routeBar=document.createElement('section');routeBar.id='bmV23Routebar';routeBar.className='bm-v23-routebar';
  routeBar.setAttribute('aria-label','Page navigation');routeBar.hidden=true;
  function current(){
    try {
      if(scope==='backend')return typeof role!=='undefined'&&role&&typeof ROLES!=='undefined'?{role,category:cat,subpage:sub}:null;
      if(scope==='candidate')return typeof S!=='undefined'?{role:'candidate',category:S.page,subpage:S.sub}:null;
      return typeof state!=='undefined'?{role:'employer',category:state.section,subpage:state.sub}:null;
    }catch(e){return null}
  }
  function menu(r){
    try {
      if(scope==='backend')return ROLES[r.role]?.cats||{};
      return NAV||{};
    }catch(e){return {}}
  }
  function same(a,b){return !!(a&&b&&a.role===b.role&&a.category===b.category&&a.subpage===b.subpage)}
  function getUrl(r){const u=new URL(location.href,'https://beamish.example');u.searchParams.delete('page');u.searchParams.delete('cat');u.searchParams.delete('sub');
    if(scope==='backend'){u.searchParams.set('cat',r.category);u.searchParams.set('sub',r.subpage);}
    else {u.searchParams.set('page',r.category);u.searchParams.set('sub',r.subpage)}
    return u.pathname+u.search+u.hash;
  }
  function initState(){const r=current();if(!r)return;const existing=history.state;
    if(existing?.beamishV23&&existing.route?.role===r.role){position=existing.index||0;lastPosition=Math.max(position,existing.lastIndex||0)}
    else {position=0;lastPosition=0;history.replaceState({beamishV23:true,index:0,lastIndex:0,route:r},'',getUrl(r));}
  }
  function routeTo(r){if(!r)return;changing=true;try{
    if(scope==='backend')baseGo(r.category,r.subpage);
    else if(scope==='candidate')baseGoto(r.category,r.subpage);
    else baseNavigate(r.category,r.subpage);
  }finally{changing=false;renderUi()}}
  let baseGo,baseGoto,baseNavigate;
  function record(action,args){const previous=current(),oldUrl=location.href;action(...args);const next=current();
    if(!changing&&next&&!same(previous,next)){
      // Older employer code uses replaceState. Put the previous route back,
      // then push a new entry so browser Back genuinely restores the page.
      if(previous){history.replaceState({beamishV23:true,index:position,lastIndex:lastPosition,route:previous},'',oldUrl)}
      position++;lastPosition=position;
      history.pushState({beamishV23:true,index:position,lastIndex:position,route:next},'',getUrl(next));
    }
    renderUi();
  }
  function wrapRoutes(){
    if(scope==='backend'){baseGo=window.go;if(typeof baseGo==='function')window.go=function(c,s){record(baseGo,[c,s])}}
    if(scope==='candidate'){baseGoto=window.goto;if(typeof baseGoto==='function')window.goto=function(c,s){record(baseGoto,[c,s])}}
    if(scope==='employer'){baseNavigate=window.navigate;if(typeof baseNavigate==='function')window.navigate=function(c,s){record(baseNavigate,[c,s])}}
    const baseRender=window.render;
    if(typeof baseRender==='function')window.render=function(){const value=baseRender.apply(this,arguments);renderUi();return value};
  }
  function mount(){if(routeBar.isConnected)return;
    const host=scope==='backend'?document.querySelector('#app .shell'):document.querySelector('.shell .main');
    const top=scope==='backend'?host?.querySelector(':scope > .topbar'):host?.querySelector(':scope > .top');
    if(!host||!top)return;
    top.insertAdjacentElement('afterend',routeBar);
  }
  function element(tag,classes,text){let e=document.createElement(tag);if(classes)e.className=classes;if(text!==undefined)e.textContent=text;return e}
  function btn(text,action,css='',active=false){const b=element('button',css,text);b.type='button';b.addEventListener('click',action);if(active)b.classList.add('active');return b}
  function navLabels(){const host=scope==='backend'?document.querySelector('#navlist'):document.querySelector('#sideNav');if(!host)return;
    host.querySelectorAll('.navitem, .navItem').forEach(item=>{
      const b=item.querySelector(':scope > .navbutton, :scope > .navBtn');if(!b)return;
      const label=scope==='backend'?b.querySelector('span')?.textContent:
        scope==='candidate'?[...b.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(''):
        b.querySelector('span:last-child')?.textContent;
      const labelText=label||b.getAttribute('data-v17-label')||b.getAttribute('aria-label')||b.title||b.textContent;
      const name=String(labelText||'').replace(/[›\u25b8]/g,'').trim();if(!name)return;
      b.setAttribute('aria-label',name);b.title=name;item.dataset.bmNavLabel=name;
      b.setAttribute('aria-current',b.classList.contains('active')?'page':'false');
    });
  }
  function hideDuplicateTabs(r,cats){if(scope!=='backend')return;
    const labels=cats[r.category]||[];document.querySelectorAll('#main .subtabs').forEach(bar=>{
      const actual=[...bar.querySelectorAll(':scope > button')].map(x=>x.textContent.trim());
      // Keep CMS/editorial mode tabs that are not the current category routes.
      bar.classList.toggle('bm-v23-original-subtabs',actual.length>0&&actual.length===labels.length&&actual.every((x,i)=>x===labels[i]));
    });
  }
  function renderUi(){if(!initialized)return;mount();const r=current();if(!r){routeBar.hidden=true;return}
    navLabels();routeBar.hidden=false;const cats=menu(r),subs=cats[r.category]||[];
    const controls=element('div','bm-v23-history');
    const back=btn('Back',()=>history.back());back.title='Go to previous page';back.prepend(element('span','bm-v23-history-icon','‹ '));back.disabled=position<=0;controls.appendChild(back);
    const next=btn('Forward',()=>history.forward());next.title='Go forward';next.appendChild(element('span','bm-v23-history-icon',' ›'));next.disabled=position>=lastPosition;controls.appendChild(next);
    const crumbs=element('nav','bm-v23-crumb');crumbs.setAttribute('aria-label','Breadcrumb');
    const rootName=scope==='backend'?r.role==='platform'?'Platform Admin':r.role==='cms'?'CMS':'Finance':scope==='employer'?'Employer':'Candidate';
    const home=btn(rootName,()=>{const first=Object.keys(cats)[0];if(first){if(scope==='backend')window.go(first);else if(scope==='candidate')window.goto(first);else window.navigate(first)}});
    crumbs.appendChild(home);crumbs.appendChild(element('i','', '›'));
    const currentCat=btn(r.category,()=>{if(scope==='backend')window.go(r.category);else if(scope==='candidate')window.goto(r.category);else window.navigate(r.category)});
    crumbs.appendChild(currentCat);crumbs.appendChild(element('i','', '›'));
    const item=element('strong','',r.subpage||r.category);item.title=r.subpage||r.category;crumbs.appendChild(item);
    const pages=element('nav','bm-v23-pages');pages.setAttribute('aria-label',r.category+' sections');
    subs.forEach(s=>{
      const chosen=s===r.subpage;
      const el=btn(s,()=>{if(scope==='backend')window.go(r.category,s);else if(scope==='candidate')window.goto(r.category,s);else window.navigate(r.category,s)},'',chosen);
      if(chosen)el.setAttribute('aria-current','page');pages.appendChild(el);
    });
    // Only backend needs new secondary tabs; Candidate / Employer already have
    // subpages in their content and keep those specific editing/control layouts.
    routeBar.replaceChildren(crumbs);
    // One consistent subpage selection across Candidate, Employer and all backend roles.
    // Browser Back / Forward remain available natively; duplicate on-page buttons are removed.
    if(subs.length>1)routeBar.appendChild(pages);
    hideDuplicateTabs(r,cats);
  }
  function onPop(event){const st=event.state;if(!st?.beamishV23||!st.route)return;
    position=st.index||0;lastPosition=Math.max(lastPosition,st.lastIndex||position);routeTo(st.route);
  }
  function start(){if(initialized)return;initialized=true;mount();wrapRoutes();initState();renderUi();window.addEventListener('popstate',onPop);
    document.addEventListener('keydown',e=>{if(e.altKey&&!e.shiftKey&&e.key==='ArrowLeft'&&position>0){e.preventDefault();history.back()}
      if(e.altKey&&!e.shiftKey&&e.key==='ArrowRight'&&position<lastPosition){e.preventDefault();history.forward()}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
