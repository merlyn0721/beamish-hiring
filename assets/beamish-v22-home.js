/* Beamish v22: restore the original multi-section landing page from the supplied blueprint.
   All existing auth, portal and job-discovery routes are retained. */
(()=>{'use strict';
 if(document.currentScript?.dataset?.portal!=='public')return;
 let restored=false;
 function configure(){
  if(restored)return;
  restored=true;
  // Earlier update layers replaced the full landing page with a teaser plus a hidden wrapper.
  // The original homepage function (home) still contains every approved section.
  if(typeof pages==='object'&&typeof home==='function'){
    pages.home=()=>{
      let html=home().replace('Find My Match →','Find My Job →');
      // This hero image already contains its doodle, polaroid and yellow sticker.
      // Remove duplicate HTML overlays introduced in later versions.
      html=html.replace(/<div class="hm-doodle">[\s\S]*?<\/div>/,'')
               .replace(/<div class="hm-pola">[\s\S]*?<\/div>/,'')
               .replace(/<div class="hm-sticky">[\s\S]*?<\/div>/,'');
      // Use available higher-resolution site photos rather than legacy tiny thumbnails.
      for(const [from,to] of Object.entries({
        'company1.jpg':'signup-employer.jpg',
        'company2.jpg':'signup-community.jpg',
        'company3.jpg':'v17-community-people.jpg',
        'office2.jpg':'signup-candidate.jpg',
        'social1.jpg':'v21-job-person-1.jpg',
        'social2.jpg':'v21-job-person-2.jpg',
        'social3.jpg':'v17-community-people.jpg'
      })) html=html.replaceAll('src="../assets/'+from+'"','src="../assets/'+to+'"');
      return html;
    };
  }
  // The interactive matcher is part of the homepage, not a modal or another route.
  window.openHeroMatcher=function(){
    if(location.hash&&location.hash!=='#home'){
      if(typeof go==='function')go('home');
      requestAnimationFrame(()=>requestAnimationFrame(showMatcher));
    } else showMatcher();
  };
  window.closeHeroMatcher=function(){
    const p=document.getElementById('heroQuickMatcher');
    if(p){p.hidden=true;}
    document.body.classList.remove('v16-quiz-active');
    document.body.style.removeProperty('overflow');
    document.getElementById('vibe')?.scrollIntoView({behavior:'smooth',block:'start'});
  };
  function showMatcher(){
    const panel=document.getElementById('heroQuickMatcher');if(!panel)return;
    panel.hidden=false;
    document.body.classList.remove('v16-quiz-active');
    document.body.style.removeProperty('overflow');
    if(typeof heroStep!=='undefined')heroStep=0;
    if(typeof heroAnswers!=='undefined')heroAnswers=[];
    if(typeof drawHeroMatcher==='function')drawHeroMatcher();
    requestAnimationFrame(()=>panel.scrollIntoView({behavior:'smooth',block:'start'}));
  }
  // Restore the complete homepage on initial load while retaining newest public Jobs page.
  // Hash navigation is handled by the existing public router.
  if((location.hash||'#home')==='#home'&&typeof render==='function')render();
  // Footer / logo actions should return to the restored homepage.
  document.querySelectorAll('.site-header .logo, .footer .logo').forEach(el=>{
    if(el.closest('a'))return;
    el.style.cursor='pointer';el.setAttribute('tabindex','0');el.setAttribute('role','link');el.setAttribute('aria-label','Beamish homepage');
    el.addEventListener('click',()=>go('home'));
    el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go('home')}});
  });
  // Public home search preserves both the search term and selected location.
  document.addEventListener('submit',ev=>{
    if(ev.target?.id!=='heroSearch')return;
    ev.preventDefault();ev.stopImmediatePropagation();
    const q=document.getElementById('heroKeyword')?.value||'';
    const loc=document.getElementById('homeLoc')?.value||'All Locations';
    if(typeof go==='function')go('jobs');
    requestAnimationFrame(()=>{
      const keyword=document.getElementById('v21Query');
      const place=document.getElementById('v21Location');
      if(keyword)keyword.value=q;
      if(place&&loc!=='All Locations')place.value=loc;
      window.Beamish21?.update?.();
    });
  },true);
  // Restore the richer multi-column footer from the source design.
  const footer=document.querySelector('.footer');
  if(footer){
    footer.innerHTML=`<div class="bm22-footer-inner"><div class="bm22-footer-brand"><div class="bm22-footer-logo" aria-label="Beamish">bea<span>mish</span><i>✦</i></div><p>Same people. Brighter futures.</p><small>Made for real careers and real people.</small></div><div><b>For Job Seekers</b><a href="#jobs">Find Jobs</a><a href="#companies">Companies</a><a href="#irl">Career IRL</a><a href="#community">Community</a></div><div><b>For Employers</b><a href="#employers">Post a Job</a><a href="../auth/signup.html?role=employer">Employer Sign Up</a><a href="../auth/login.html">Employer Login</a></div><div><b>About Beamish</b><a href="#home">Our Story</a><a href="#community">Community</a><a href="../portal-hub/index.html">Portal Hub</a><a href="#" onclick="event.preventDefault();window.BeamishAssist?.open?.()">Help & Support</a></div><div><b>Follow Us</b><p>Real people. Real opportunities.</p><div class="bm22-socials"><span>◎</span><span>in</span><span>▶</span></div></div></div><div class="bm22-footer-bottom"><span>© 2026 Beamish. All rights reserved.</span><div><a href="../auth/signup.html">Join Beamish</a><a href="../auth/login.html">Log In</a></div></div>`;
  }
  // Better navigation for visitors who choose a work vibe and press Start Match.
  document.addEventListener('keydown',ev=>{
    if(ev.key==='Escape'&&document.getElementById('heroQuickMatcher')&&!document.getElementById('heroQuickMatcher').hidden)window.closeHeroMatcher();
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',configure);else configure();
})();
