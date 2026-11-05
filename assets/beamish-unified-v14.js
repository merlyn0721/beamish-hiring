/* Beamish v14 — small cross-portal polish, no replacement of existing routers. */
(function(){'use strict';
 const portal=document.currentScript?.dataset?.portal||'public';
 const surface=({'public':'public','candidate':'candidate','employer':'employer','backend':'backend','auth':'auth','backend-hub':'backend-hub'})[portal]||portal;
 function init(){
  document.body.dataset.beamishSurface=surface;
  // All portals share one design language, but public & pre-login pages must never contain private Messages.
  if(['public','auth','backend-hub'].includes(surface))document.querySelector('#bm-chat-root')?.remove();
  const support=document.querySelector('#bs-assist-root .bs-trigger');
  if(support){support.setAttribute('aria-label','Beamish AI Help');support.setAttribute('title','Beamish AI Help');}
  const messages=document.querySelector('.bm-chat-trigger');
  if(messages){messages.setAttribute('aria-label','Open member Messages');messages.setAttribute('title','Messages');}
  // Opening AI Help dismisses the member messenger; opening member Messages dismisses AI Help.
  document.addEventListener('click',function(e){
   const isAi=e.target.closest?.('#bs-assist-root .bs-trigger');
   const isMsg=e.target.closest?.('.bm-chat-trigger');
   if(isAi)document.querySelector('.bm-float')?.classList.remove('bm-visible');
   if(isMsg)document.querySelector('#bs-assist-root .bs-panel')?.classList.remove('bs-open');
  },true);
  // Keep the account menu accessible without adding a second logout in the left sidebar.
  const account=document.querySelector('.topUser,.topRight .user');
  if(account){account.setAttribute('aria-label','Open account menu');account.setAttribute('aria-haspopup','menu');}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();