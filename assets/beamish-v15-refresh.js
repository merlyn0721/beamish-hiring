(function(){
'use strict';
const path=location.pathname;
function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn);else fn()}
function addNavLabels(){document.querySelectorAll('.navBtn').forEach(btn=>{const label=(btn.textContent||'').trim().replace(/\s+/g,' ');if(label){btn.dataset.label=label;btn.title=label}})}
function safeText(v){return (typeof safe==='function')?safe(v):String(v??'')}

function candidateOverrides(){
  addNavLabels();
  const oldCommunity=window.community;
  const oldProfile=window.profile;

  function lineTags(list){return list.map(x=>`<span class="tag">${safeText(x)}</span>`).join('')}
  function dashJobCard(j){
    const on=S.savedJobs.includes(j.id);
    return `<article class="v15-rec-card"><img src="${pic(j.img)}" alt="${safeText(j.role)}"><div class="v15-rec-body"><span class="chip blue">✦ ${j.match}% Match</span><h3>${safeText(j.role)}</h3><p>${safeText(j.co)} · ${safeText(j.place)}</p><div class="v15-rec-meta">${lineTags([j.mode,j.type,j.pay.split('–')[0].trim()])}</div><div class="v15-rec-actions">${button('View Job',`jobDetail(${j.id})`,'black small')}${button(on?'♥ Saved':'♡ Save',`saveJob(${j.id})`,'small')}</div></div></article>`;
  }

  window.dashboard=function(){
    const first=DATA.apps.find(a=>a.stage==='Interview');
    return `<div class="v15-overview">
      <div class="v15-top-note"><div class="cardTitle">◉ &nbsp; Your next steps today</div><div class="v15-step-grid"><div class="v15-step"><span>◎</span><span><b>${profileCompletion()}% profile complete</b><small>Make your work stand out to employers</small></span></div><div class="v15-step"><span>▦</span><span><b>${first?'Upcoming interview':'Applications to review'}</b><small>${first?'Marketing Executive · 29 Oct at 2 PM':'Track your latest hiring updates'}</small></span></div><div class="v15-step"><span>▣</span><span><b>${DATA.jobs.length} matching jobs to explore</b><small>Based on your selected career direction</small></span></div></div></div>
      <div class="grid cols4 kpiGrid">${kpi(String(DATA.jobs.length),'Job Matches','▣',"goto('Jobs')",true)}${kpi(String(DATA.apps.length),'Applications','▤',"goto('Applications')")}${kpi(String(DATA.apps.filter(a=>a.stage==='Interview').length),'Upcoming Interview','▦',"goto('Applications','Interviews')")}${kpi('82','Sample Profile Views','◉',"goto('Profile')")}</div>
      <div class="v15-dashboard-grid">
        <aside class="card v15-profile-card"><img class="photoavatar" src="${extraImage('avatar')}"><h3>${safeText(S.profile.name)}</h3><div class="tiny">${safeText(S.profile.headline)}<br>⌖ ${safeText(S.profile.location)}</div><div class="progress" style="margin:14px 0 6px"><i style="width:${profileCompletion()}%"></i></div><b class="tiny">${profileCompletion()}% Profile Complete</b><div class="lineSep"></div><div class="smallHeading" style="text-align:left">Skills</div><div style="text-align:left">${chips(S.profile.skills.split(',').map(s=>s.trim()).filter(Boolean))}</div><p class="tiny" style="text-align:left;margin:12px 0 0">● ${safeText(V5.profileExtra.availability)}</p><div class="v15-profile-actions">${button('Edit Profile',"goto('Profile','Profile Studio')",'black')}${button('View Public Profile',"goto('Profile','Public Profile')")}</div></aside>
        <div style="display:grid;gap:14px">
          <section class="card v15-recs"><div class="cardTitle">✧ Picked for You ${button('See All Matches →',"goto('Jobs','Discover Jobs')",'ghost')}</div><div class="v15-recs-grid">${DATA.jobs.slice(0,4).map(dashJobCard).join('')}</div></section>
          <div class="v15-lower-grid">
            <section class="card"><div class="cardTitle">▣ My Applications ${button('View All →',"goto('Applications')",'ghost')}</div>${DATA.apps.slice(0,3).map(a=>appRow(a)).join('')}</section>
            <section class="card"><div class="cardTitle">▦ Upcoming Interview</div>${first?`<b style="font-size:14px">${safeText(first.role)}</b><p class="tiny">${safeText(first.co)} · 29 Oct 2026</p><p class="tiny">2:00–2:45 PM · Google Meet</p><div class="utilityRow" style="margin-top:14px">${button('Application Details',`applicationDetail(${q(first.role)})`,'blue small')}${button('Add to Calendar','downloadCalendar()','small')}</div>`:`<div class="empty">No upcoming interviews.</div>`}</section>
            <section class="card"><div class="cardTitle">Community Pulse ${button('Explore →',"goto('Community','Home')",'ghost')}</div>${S.posts.slice(0,3).map(p=>`<div class="trend"><img src="${V5.postPhotos[p.id]||pic(p.img)}"><div><b>${safeText(p.title)}</b><small>${safeText(p.caption)}</small></div></div>`).join('')}</section>
          </div>
        </div>
      </div>
    </div>`;
  };

  window.updateJobFilters=function(){
    V5.jobSearch=$('jobFilter')?.value||'';
    V5.jobLocation=$('jobPlace')?.value||'All locations';
    V5.jobMode=$('jobMode')?.value||'All';
    V5.jobSalary=$('jobPay')?.value||'Any salary';
    V5.jobDate=$('jobDate')?.value||'Any listing date';
    V5.jobRelocation=$('jobRelocation')?.value||'Any requirement';
    renderContent();
  };

  function jobSummary(j){
    const summaries={1:'Strong fit for content, campaign and social media work. Hybrid KL role with a good match for your current skills.',2:'Hands-on creative role for short-form content, basic filming and editing. Better if you enjoy fast-paced on-site work.',3:'Strategy-focused role with higher salary range. Good for someone who wants planning, brand and analytics exposure.',4:'Remote-friendly brand role with flexible collaboration and campaign execution.'};
    return summaries[j.id]||'A promising role that matches your preferred work style and target direction.';
  }
  function station(j){
    const map={1:'MRT Muzium Negara · MRT Kajang Line',2:'LRT Taman Jaya · LRT Kelana Jaya Line',3:'MRT Bukit Bintang · MRT Kajang Line',4:'Remote friendly · occasional client meetings'};
    return map[j.id]||j.place;
  }
  function jobGridCard(j){
    const on=S.savedJobs.includes(j.id);
    return `<article class="v15-job-card"><div class="cover"><img src="${pic(j.img)}" alt="${safeText(j.role)}"><span class="v15-match">✦ ${j.match}% Match</span></div><div class="v15-job-body"><h3>${safeText(j.role)}</h3><div class="v15-job-sub">${safeText(j.co)} · ${safeText(j.place)}</div><div class="v15-job-rail">${lineTags([j.mode,j.type,'Monthly'])}</div><div class="v15-job-salary">${safeText(j.pay)}</div><div class="tiny">🚉 ${safeText(station(j))}</div><div class="v15-job-foot"><button class="btn small">AI Match</button><div class="v15-job-actions"><button class="btn black small v15-view" onclick="jobDetail(${j.id})">View Job</button><div class="v15-job-hover"><b>AI Summary</b><p>${safeText(jobSummary(j))}</p></div>${button(on?'♥ Saved':'♡ Save',`saveJob(${j.id})`,'small')}</div></div></div></article>`;
  }

  window.jobs=function(){
    const savedOnly=S.sub==='Saved Jobs';
    const clearBtn=button('Clear',"V5.jobSearch='';V5.jobLocation='All locations';V5.jobMode='All';renderContent()",'small');
    let list=DATA.jobs.filter(j=>(!savedOnly||S.savedJobs.includes(j.id))&&(!V5.jobSearch||[j.role,j.co,j.place,j.mode,j.type].join(' ').toLowerCase().includes(V5.jobSearch.toLowerCase()))&&(V5.jobLocation==='All locations'||j.place===V5.jobLocation)&&(V5.jobMode==='All'||j.mode===V5.jobMode));
    if(S.tab==='Best Match')list.sort((a,b)=>b.match-a.match);
    if(S.tab==='Latest')list=[...list].reverse();
    if(S.tab==='Fresh Graduate')list=list.filter(j=>j.id<3);
    return title(savedOnly?'Saved Jobs':'Discover Jobs',savedOnly?'Keep your next opportunities organised.':'Discover roles through a cleaner, more visual job browser.',button(savedOnly?'Discover Jobs':'Saved Jobs',`subTo('${savedOnly?'Discover Jobs':'Saved Jobs'}')`,'blue'))+
      strip(NAV.Jobs,S.sub,'subTo',true)+(savedOnly?'':strip(['For You','Best Match','Latest','Fresh Graduate'],S.tab,'tabTo'))+
      `<div class="v15-jobs-shell"><aside class="card v15-side-filter"><div class="cardTitle">⌘ Filters & Sort</div><div class="field"><label>Search role / company / location</label><input id="jobFilter" value="${safeText(V5.jobSearch)}" placeholder="Type and press Search"></div><div class="field"><label>Location</label><select id="jobPlace">${['All locations','Kuala Lumpur','Petaling Jaya','Subang Jaya'].map(x=>`<option ${x===V5.jobLocation?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Work style</label><select id="jobMode">${['All','Hybrid','On-site','Remote'].map(x=>`<option ${x===V5.jobMode?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Salary period</label><select id="jobPay"><option>Any salary period</option><option>Monthly</option><option>Annual</option><option>Hourly</option></select></div><div class="field"><label>Listing time</label><select id="jobDate"><option>Any listing date</option><option>Today</option><option>This week</option><option>This month</option></select></div><div class="field"><label>Relocation</label><select id="jobRelocation"><option>Any requirement</option><option>Open to relocate</option><option>Local only</option></select></div><div class="utilityRow">${button('Search','updateJobFilters()','blue')}${clearBtn}</div><p class="tiny" style="margin-top:10px">Transport proximity is a discovery aid. Employers should confirm final commute details.</p></aside><section class="v15-jobs-main"><div class="card" style="padding:14px 16px"><div class="v15-jobs-toolbar"><div><b>${savedOnly?'Saved roles':'Roles for you'}</b><div class="tiny">${list.length} jobs shown · cleaner portrait card layout</div></div><div class="chip blue">Hover “View Job” for quick AI summary</div></div></div><div class="v15-job-grid">${list.length?list.map(jobGridCard).join(''):`<div class="card"><div class="empty">No jobs found. Try another combination.</div></div>`}</div></section></div>`;
  };

  window.community=function(){
    if(S.sub!=='Home')return oldCommunity();
    const feed=(S.communityTab==='Following'?S.posts.filter(p=>p.name==='North Studio'||p.name==='Food Haus'||p.name==='Amanda Lim'):S.communityTab==='Trending'?[...S.posts].reverse():S.posts);
    const trendCards=[['#SalaryTalk','Real pay talk, salary benchmarks and negotiation stories.'],['#CareerSwitch','Stories from real transitions and what changed after the jump.'],['#WFH','Remote work habits, routines and honest opinions.']];
    return title('Community','A cleaner social hub for work-life stories, advice and career moments.',button('+ Create Post',"compose('Post')",'blue'))+
      strip(NAV.Community,S.sub,'subTo',true)+
      `<div class="v15-community-shell"><div><div class="card"><div class="communityComposer"><img src="${extraImage('avatar')}"><button class="composerInput" onclick="compose('Post')">What’s happening in your work life?</button></div><div class="composerActions">${['Post','Question','Poll','Anonymous','Career Clip'].map(t=>button(t,`compose('${t}')`,'small')).join('')}</div></div>${strip(['For You','Following','Trending'],S.communityTab,'tabToComm')}<div class="mosaic">${feed.map(postCard).join('')}</div></div><aside class="v15-side-stack"><div class="card v15-side-card"><h3>🔥 Trending Today</h3><div class="v15-trend-list">${trendCards.map(t=>`<div class="v15-trend-item"><b>${t[0]}</b><div class="tiny">${t[1]}</div></div>`).join('')}</div></div><div class="card v15-side-card"><h3>Suggested Spaces</h3><div class="v15-space">${[['Marketing People MY','Advice, campaigns, portfolio talk','MP'],['Career Switch MY','Stories from real transitions','CX'],['First Job Circle','For interns and fresh grads','FG']].map(s=>`<div class="v15-space-item"><div class="v15-badge">${s[2]}</div><div><b style="font-size:12px">${s[0]}</b><div class="tiny">${s[1]}</div></div></div>`).join('')}</div></div><div class="card v15-side-card"><h3>Quick Actions</h3><p class="tiny">Share a post, ask a question, or check what’s trending before your next move.</p><div class="utilityRow">${button('Ask Question',"compose('Question')",'blue')}${button('View Events',"subTo('Events')")}</div></div></aside></div>`;
  };

  window.profile=function(){
    const sub=S.sub;
    const top=title(sub==='Public Profile'?'My Public Profile':sub==='Profile Studio'?'Profile Studio':'Resume / CV',sub==='Profile Studio'?'Edit your professional identity and preview the real layout.':'Your work, story and career documents in one place.')+strip(NAV.Profile,sub,'subTo',true);
    if(sub!=='Public Profile')return oldProfile();
    const portfolio=V5.profileExtra.portfolio.length?V5.profileExtra.portfolio:[pic('office2'),pic('office'),pic('social2')];
    return top+`<div class="v15-profile-shell"><section class="v15-profile-hero"><div class="v15-profile-cover"><img src="${extraImage('cover')||pic('office2')}" alt="Profile cover"></div><div class="v15-profile-main"><div class="v15-profile-identity"><div class="v15-profile-head"><img class="avatar" src="${extraImage('avatar')}" alt="${safeText(S.profile.name)}"><div class="v15-profile-title"><div class="eyebrow">Beamish / Profile</div><h2>${safeText(S.profile.name)}</h2><p>${safeText(S.profile.headline)} · ${safeText(S.profile.location)}</p><div class="v15-pill-row" style="margin-top:12px">${chips(S.profile.skills.split(',').map(s=>s.trim()).filter(Boolean))}</div></div></div><div class="v15-profile-copy">${safeText(S.profile.bio)}</div><div class="v15-pill-row"><span class="chip green">● ${safeText(V5.profileExtra.availability)}</span><span class="chip">${portfolio.length} portfolio highlights</span><span class="chip">Visible to: ${safeText(V5.privacy.visibility)}</span></div></div><aside class="v15-side-tools"><div class="v15-tool-card"><h4>Relocation preference</h4><b>${safeText((V5.workPrefs&&V5.workPrefs.Relocation)||'Not specified')}</b><div class="field" style="margin:10px 0 0"><select onchange="V5.workPrefs.Relocation=this.value;saveV5();renderContent()"><option ${(!V5.workPrefs.Relocation||V5.workPrefs.Relocation==='Not specified')?'selected':''}>Not specified</option><option ${V5.workPrefs.Relocation==='Open to relocate'?'selected':''}>Open to relocate</option><option ${V5.workPrefs.Relocation==='KL / Selangor only'?'selected':''}>KL / Selangor only</option></select></div>${button('Save Preference',"saveV5();toast('Preference saved')",'blue')}</div><div class="v15-tool-card"><h4>Account trust status</h4><b>Not Verified</b><div class="tiny">A verification badge is shown only after identity checks and admin approval.</div></div><div class="utilityRow">${button('Edit Profile',"subTo('Profile Studio')",'blue')}${button('Resume / CV',"subTo('Resume / CV')")}</div></aside></div><div class="v15-profile-portfolio"><h3>Selected Work</h3><div class="v15-gallery-grid">${portfolio.slice(0,3).map(src=>`<img src="${src}" alt="Portfolio work">`).join('')}</div></div></section></div>`;
  };

  if(typeof renderContent==='function')renderContent();
}

function publicOverrides(){
  function enhancePublicHome(){
    const isHome=(location.hash.replace('#','')||'home')==='home';
    document.body.classList.toggle('v15-public-home',isHome);
    if(!isHome)return;
    const wrap=document.querySelector('#publicContent .home-wrap');
    if(!wrap)return;
    if(!wrap.querySelector('.v15-nextstep')){
      const hero=wrap.querySelector('.hm-hero');
      const dock=document.createElement('section');
      dock.className='v15-nextstep';
      dock.innerHTML=`<div class="box"><div><div class="section-kicker">YOUR CAREER · YOUR WAY</div><h3>Ready for<br>your next move?</h3><p>Choose your path first. Find a job, take the quick matcher, or explore the platform when you’re ready.</p></div><div class="actions"><button class="btn btn-blue" onclick="openHeroMatcher()">✦ Find My Job</button><button class="btn" onclick="go('jobs')">⌕ Search Jobs</button><button class="btn" onclick="go('companies')">Explore Beamish ↓</button></div></div>`;
      hero&&hero.insertAdjacentElement('afterend',dock);
    }
    const matchBtn=wrap.querySelector('.hm-cta .btn');
    if(matchBtn)matchBtn.textContent='Find My Job →';
  }
  enhancePublicHome();
  window.addEventListener('hashchange',()=>setTimeout(enhancePublicHome,0));
  if(typeof render==='function'){
    const oldRender=render;
    window.render=function(){oldRender();enhancePublicHome()};
  }
}

ready(function(){
  if(path.includes('/candidate/'))candidateOverrides();
  if(path.includes('/public/'))publicOverrides();
});
})();
