/* Use one supplied brand identity across shared headers, footers and portals. */
(()=>{'use strict';
const src=new URL('beamish-brand-logo.png',document.currentScript.src).href;
function apply(){
 document.querySelectorAll('img').forEach(img=>{
  const old=img.getAttribute('src')||'';
  if(!(/(?:^|\/)(?:beamish-logo|logo)\.png(?:[?#]|$)/.test(old)||img.matches('#logoSide,#logoMobile,#sideLogo,.authBrand,.mobileLogo,.logo img,.ref-logo img,.ref-footer .beamish-brand-logo')||img.classList.contains('beamish-brand-logo')))return;
  if(img.src!==src)img.src=src;
  if(!img.classList.contains('beamish-brand-logo'))img.classList.add('beamish-brand-logo');
  if(img.alt!=='Beamish')img.alt='Beamish';
 });
 document.querySelectorAll('.ref-wordmark,.bm22-footer-logo').forEach(el=>{const img=document.createElement('img');img.src=src;img.alt='Beamish';img.className='beamish-brand-logo';el.replaceWith(img)});
}
let pending=false;const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})});
function init(){apply();let icon=document.querySelector('link[rel=icon]');if(!icon){icon=document.createElement('link');icon.rel='icon';document.head.appendChild(icon)}icon.href=src;observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']})}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
