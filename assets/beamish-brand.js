/* Use one supplied brand identity across shared headers, footers and portals. */
(()=>{'use strict';
const src=new URL('beamish-brand-logo.png',document.currentScript.src).href;
let frame=0,heroPixels=null;
const heroImage=new Image();heroImage.src=new URL('beamish-reference-hero.png',src).href;
heroImage.onload=()=>{const canvas=document.createElement('canvas');canvas.width=heroImage.naturalWidth;canvas.height=heroImage.naturalHeight;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(heroImage,0,0);heroPixels={context,width:canvas.width,height:canvas.height};scheduleContrast()};
const bannerPixels=new Map();
function pixelsFor(hero){if(hero.classList.contains('ref-hero'))return heroPixels;const match=getComputedStyle(hero).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);if(!match)return null;const url=match[1];if(!bannerPixels.has(url)){bannerPixels.set(url,null);const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0);bannerPixels.set(url,{context,width:canvas.width,height:canvas.height});scheduleContrast()};img.src=url}return bannerPixels.get(url)}
function luminance(rgb){return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]}
function surfaceBrightness(element){
 const box=element.getBoundingClientRect(),x=box.left+box.width/2,y=box.top+box.height/2;
 const header=element.closest('.ref-header');
 if(header){
  if(header.classList.contains('is-scrolled'))return backgroundBrightness(header);
  if(header.classList.contains('menu-open')&&element.closest('.ref-nav'))return backgroundBrightness(element);
  const hero=document.querySelector('.ref-hero,.ce-hero'),r=hero?.getBoundingClientRect(),pixels=hero?pixelsFor(hero):null;
  if(r&&y>=r.top&&y<r.bottom&&pixels){
   const style=getComputedStyle(hero),iw=pixels.width,ih=pixels.height;
   const dimensions=style.backgroundSize.split(' ');const scale=style.backgroundSize==='cover'?Math.max(r.width/iw,r.height/ih):dimensions[0]==='auto'&&dimensions[1]?.endsWith('px')?parseFloat(dimensions[1])/ih:r.width/iw;
   const position=style.backgroundPosition.split(' ').map(v=>parseFloat(v)/100),px=Number.isFinite(position[0])?position[0]:.5,py=Number.isFinite(position[1])?position[1]:.5;
   const offsetX=(r.width-iw*scale)*px,offsetY=(r.height-ih*scale)*py;
   if(y-r.top<offsetY||y-r.top>offsetY+ih*scale)return backgroundBrightness(hero);
   let total=0;
   for(const dx of [-.3,0,.3]){const ix=Math.max(0,Math.min(iw-1,Math.floor((x+box.width*dx-r.left-offsetX)/scale))),iy=Math.max(0,Math.min(ih-1,Math.floor((y-r.top-offsetY)/scale)));total+=luminance(pixels.context.getImageData(ix,iy,1,1).data)}
   return total/3;
  }
  const beneath=document.elementsFromPoint(x,y).find(node=>node!==document.documentElement&&node!==document.body&&!header.contains(node));
  if(beneath)return backgroundBrightness(beneath);
 }
 return backgroundBrightness(element);
}
function backgroundBrightness(element){for(let node=element;node;node=node.parentElement){const color=getComputedStyle(node).backgroundColor,values=color.match(/[\d.]+/g)?.map(Number);if(values&&values.length>=3&&(values.length<4||values[3]>.65))return luminance(values)}return 234}
function contrast(){frame=0;const current=(location.hash||'#home');document.querySelectorAll('.ref-nav a').forEach(link=>{if(link.getAttribute('href')===current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');link.classList.toggle('on-dark-surface',surfaceBrightness(link)<150)});document.querySelectorAll('img.beamish-brand-logo').forEach(img=>img.classList.toggle('is-white-logo',surfaceBrightness(img)<135));const header=document.querySelector('.ref-header');if(header){const login=header.querySelector('a[href*="login.html"]');if(login)login.classList.toggle('on-dark-surface',surfaceBrightness(login)<135);const search=header.querySelector('.ref-search-icon'),menu=header.querySelector('.ref-menu'),signup=header.querySelector('.ref-button.navy');for(const el of [search,menu,signup])if(el)el.classList.toggle('on-dark-surface',surfaceBrightness(el)<135)}}
function scheduleContrast(){if(!frame)frame=requestAnimationFrame(contrast)}
function apply(){
 document.querySelectorAll('img').forEach(img=>{
  const old=img.getAttribute('src')||'';
  if(!(/(?:^|\/)(?:beamish-logo|logo)\.png(?:[?#]|$)/.test(old)||img.matches('#logoSide,#logoMobile,#sideLogo,.authBrand,.mobileLogo,.logo img,.ref-logo img,.ref-footer .beamish-brand-logo')||img.classList.contains('beamish-brand-logo')))return;
  if(img.src!==src)img.src=src;
  if(!img.classList.contains('beamish-brand-logo'))img.classList.add('beamish-brand-logo');
  if(img.alt!=='Beamish')img.alt='Beamish';
 });
 document.querySelectorAll('.ref-wordmark,.bm22-footer-logo').forEach(el=>{const img=document.createElement('img');img.src=src;img.alt='Beamish';img.className='beamish-brand-logo';el.replaceWith(img)});scheduleContrast();
}
let pending=false;const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})});
function init(){const defs=document.createElementNS('http://www.w3.org/2000/svg','svg');defs.setAttribute('aria-hidden','true');defs.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';defs.innerHTML='<defs><filter id="beamish-white-logo" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncB type="discrete" tableValues="0 0 1 1"/></feComponentTransfer><feColorMatrix type="matrix" values="1 0 1 0 0  0 1 1 0 0  0 0 1 0 0  0 0 0 1 0"/></filter></defs>';document.body.appendChild(defs);apply();window.addEventListener('scroll',scheduleContrast,{passive:true});window.addEventListener('resize',scheduleContrast,{passive:true});document.addEventListener('click',scheduleContrast);window.addEventListener('hashchange',scheduleContrast);let icon=document.querySelector('link[rel=icon]');if(!icon){icon=document.createElement('link');icon.rel='icon';document.head.appendChild(icon)}icon.href=src;observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']})}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
