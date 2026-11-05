/* Beamish v16 / cohesive creative hiring platform · Progressive enhancement. */
(function(){'use strict';
const scope=document.currentScript?.dataset?.portal||'public';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const art=(i,story=false)=>'../assets/v16-'+(story?'story':'art')+'-'+((i%8)+1)+'.svg';
const onReady=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
const e=(s)=>document.querySelector(s);
function button(label,action,primary=false){return `<button type="button" class="${primary?'v16-primary':'v16-secondary'}" onclick="${action}">${label}</button>`}
function navRail(){
 const side=document.querySelector('.side');if(!side)return;
 if(!side.querySelector('.v16-rail-toggle')){
  const toggle=document.createElement('button');toggle.type='button';toggle.className='v16-rail-toggle';toggle.textContent='☰';toggle.title='Expand or collapse navigation';toggle.setAttribute('aria-label','Expand or collapse navigation');toggle.setAttribute('aria-pressed','false');toggle.onclick=()=>{const expanded=document.body.classList.toggle('v16-nav-expanded');toggle.setAttribute('aria-pressed',String(expanded));toggle.title=expanded?'Collapse menu':'Expand menu';};
  side.querySelector('.sideNav')?.before(toggle);
 }
 function labels(){side.querySelectorAll('.navBtn').forEach(btn=>{const label=(btn.querySelector('span')?.textContent||btn.textContent||'').trim();btn.dataset.label=label;btn.title=label;btn.setAttribute('aria-label',label)});}
 labels();let scheduled=false;const obs=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;labels()})});const host=side.querySelector('.sideNav');if(host)obs.observe(host,{childList:true,subtree:false});
}
function publicUI(){
 let quizOpen=false;
 const oldOpen=window.openHeroMatcher,oldClose=window.closeHeroMatcher,oldGo=window.go;
 window.openHeroMatcher=function(){const panel=e('#heroQuickMatcher');if(!panel){oldOpen?.();return}panel.hidden=false;quizOpen=true;document.body.classList.add('v16-quiz-active');document.body.style.overflow='hidden';if(typeof heroStep!=='undefined')heroStep=0;if(typeof heroAnswers!=='undefined')heroAnswers=[];if(typeof drawHeroMatcher==='function')drawHeroMatcher();panel.querySelector('.hm-hero-quiz-top button')?.focus({preventScroll:true})};
 window.closeHeroMatcher=function(){quizOpen=false;document.body.classList.remove('v16-quiz-active');document.body.style.overflow='';const panel=e('#heroQuickMatcher');if(panel)panel.hidden=true;else oldClose?.()};
 window.go=function(route){if(quizOpen)closeHeroMatcher();oldGo(route)};
 function artwork(){const host=document.getElementById('jobList');if(!host)return;const apply=()=>host.querySelectorAll('.v17-job-cover img').forEach((image,i)=>{const next=art(i);if(!image.src.endsWith(next))image.src=next});apply();if(!host.dataset.v16Observed){host.dataset.v16Observed='1';new MutationObserver(apply).observe(host,{childList:true})}}
 function cleanup(){document.querySelectorAll('.v15-nextstep').forEach(el=>el.remove());const isHome=(location.hash.replace('#','')||'home')==='home';document.body.classList.toggle('v15-public-home',isHome);if(!isHome)artwork()}
 const baseRender=window.render;
 if(typeof baseRender==='function')window.render=function(){baseRender();cleanup()};
 cleanup();window.addEventListener('hashchange',()=>queueMicrotask(cleanup));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&quizOpen){event.preventDefault();window.closeHeroMatcher()}});
 // Fix the public navigation from teaser: matcher is one screen, not another stacked duplicate.
 const teaser=e('.v17-public-teaser button');if(teaser)teaser.textContent='Explore what’s on Beamish ↓';
}
function candidateUI(){
 navRail();
 // Search data is illustrative; new rows demonstrate every filter without altering production data.
 const extra=[
  {id:5,role:'Sales Associate',co:'Good Company',place:'Petaling Jaya',mode:'On-site',pay:'RM2,600 – 3,300',match:84,img:'social3',type:'Sales'},
  {id:6,role:'UI/UX Designer',co:'Studio Daily',place:'Kuala Lumpur',mode:'Remote',pay:'RM45 – 70 / hour',match:91,img:'social5',type:'Design'},
  {id:7,role:'HR Assistant',co:'Career Club',place:'Subang Jaya',mode:'Hybrid',pay:'RM36,000 – 45,000 / year',match:79,img:'social2',type:'HR'},
  {id:8,role:'Operations Intern',co:'Beamish Studio',place:'Petaling Jaya',mode:'On-site',pay:'RM1,200 – 1,500',match:88,img:'office',type:'Operations'}
 ];
 for(const j of extra)if(!DATA.jobs.some(x=>x.id===j.id))DATA.jobs.push(j);
 const meta={
  1:{kind:'Full Time',basis:'Monthly',min:3500,max:5000,days:2,station:'MRT Muzium Negara',line:'Kajang Line',relocation:'No'},
  2:{kind:'Contract',basis:'Monthly',min:3000,max:4500,days:7,station:'LRT Taman Jaya',line:'Kelana Jaya Line',relocation:'No'},
  3:{kind:'Full Time',basis:'Monthly',min:4000,max:6000,days:11,station:'MRT Bukit Bintang',line:'Kajang Line',relocation:'Yes'},
  4:{kind:'Full Time',basis:'Monthly',min:4200,max:5500,days:3,station:'Remote / optional office days',line:'',relocation:'No'},
  5:{kind:'Part Time',basis:'Monthly',min:2600,max:3300,days:1,station:'LRT Asia Jaya',line:'Kelana Jaya Line',relocation:'No'},
  6:{kind:'Freelance',basis:'Hourly',min:45,max:70,days:5,station:'Remote',line:'',relocation:'No'},
  7:{kind:'Contract',basis:'Annual',min:36000,max:45000,days:12,station:'LRT SS 15',line:'Kelana Jaya Line',relocation:'Yes'},
  8:{kind:'Internship',basis:'Monthly',min:1200,max:1500,days:1,station:'MRT Phileo Damansara',line:'Kajang Line',relocation:'No'}
 };
 const storageKey='beamish_v16_job_filters';
 let stored={};try{stored=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch(e){}
 const f=Object.assign({search:'',city:'',station:'',work:'',type:'',basis:'',min:'',max:'',age:'',relocation:'',sort:'best'},stored);
 function getVal(k){return document.getElementById('v16f-'+k)?.value??f[k]}
 function option(values,selected,allLabel){return `<option value="">${allLabel}</option>`+values.map(v=>`<option value="${esc(v)}" ${selected===v?'selected':''}>${esc(v)}</option>`).join('')}
 function filterBlock(){
  return `<aside class="card v16-job-filters"><div class="v16-section-head"><div><div class="v16-eyebrow">Personalise discovery</div><h3>Filters & Sort</h3></div><button type="button" class="v16-secondary v16-mobile-filter-toggle" aria-expanded="false" onclick="BeamishV16.toggleFilters(this)">☷ Filters</button></div><div class="v16-filters-inner">
  <div class="v16-filter-field"><label for="v16f-search">Search</label><input id="v16f-search" value="${esc(f.search)}" placeholder="Role, company, keyword"></div>
  <div class="v16-filter-field"><label for="v16f-city">Location / area</label><select id="v16f-city">${option(['Kuala Lumpur','Petaling Jaya','Subang Jaya'],f.city,'All locations')}</select></div>
  <div class="v16-filter-field"><label for="v16f-station">Near public transport</label><input id="v16f-station" value="${esc(f.station)}" placeholder="MRT / LRT / KTM station" list="v16-stations"><datalist id="v16-stations">${[...new Set(Object.values(meta).map(x=>x.station))].map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist></div>
  <div class="v16-filter-field"><label for="v16f-work">Work style</label><select id="v16f-work">${option(['Remote','On-site','Hybrid'],f.work,'Any work style')}</select></div>
  <div class="v16-filter-field"><label for="v16f-type">Job type</label><select id="v16f-type">${option(['Full Time','Part Time','Internship','Freelance','Contract'],f.type,'All job types')}</select></div>
  <div class="v16-filter-field"><label for="v16f-basis">Salary basis</label><select id="v16f-basis">${option(['Monthly','Annual','Hourly'],f.basis,'Any pay basis')}</select></div>
  <div class="v16-filter-field"><label for="v16f-min">Minimum salary (RM)</label><input id="v16f-min" value="${esc(f.min)}" type="number" min="0" placeholder="Min"></div>
  <div class="v16-filter-field"><label for="v16f-max">Maximum salary (RM)</label><input id="v16f-max" value="${esc(f.max)}" type="number" min="0" placeholder="Max"></div>
  <div class="v16-filter-field"><label for="v16f-age">Listing time</label><select id="v16f-age">${option(['24 hours','7 days','30 days'],f.age,'Any listing date')}</select></div>
  <div class="v16-filter-field"><label for="v16f-relocation">Relocation requirement</label><select id="v16f-relocation">${option(['Yes','No'],f.relocation,'Any requirement')}</select></div>
  <div class="v16-filter-field"><label for="v16f-sort">Sort by</label><select id="v16f-sort">${option(['Best match','Latest first','Salary high to low','Job title A–Z'],f.sort==='best'?'Best match':f.sort,'Best match')}</select></div>
  </div><div class="v16-filter-actions">${button('Clear all','BeamishV16.resetJobs()')}${button('Apply','BeamishV16.applyJobs()',true)}</div><p class="v16-filter-tiny">Station proximity and roles are illustrative. Salary figures are compared only within their selected pay basis.</p></aside>`;
 }
 function jobCard(j,index){const m=meta[j.id]||meta[1],saved=S.savedJobs.includes(j.id);
  const summary=`This ${m.kind.toLowerCase()} role is a ${j.match}% illustrative match. ${j.mode} working arrangement in ${j.place}. Pay is ${j.pay} (${m.basis.toLowerCase()}). ${m.station==='Remote'?'Fully remote listing.':`Listed near ${m.station}${m.line?' · '+m.line:''}.`} ${m.relocation==='Yes'?'Relocation may be requested; confirm with the employer.':'No relocation requirement listed.'}`;
  return `<article class="v16-job-card"><div class="art"><img src="${art(index)}" alt="Creative job cover for ${esc(j.co)}"></div><div class="body"><div class="v16-chip">✦ ${esc(j.match)}% illustrative match</div><h3>${esc(j.role)}</h3><div class="co">${esc(j.co)} · ${esc(j.place)}</div><div class="tags"><span class="v16-chip soft">${esc(j.mode)}</span><span class="v16-chip soft">${esc(m.kind)}</span><span class="v16-chip soft">${esc(m.basis)}</span></div><div class="pay">${esc(j.pay)}</div><div class="loc">🚉 ${esc(m.station)}${m.line?' · '+esc(m.line):''}</div><div class="actions"><button class="v16-secondary v16-ai-trigger" data-v16-summary="${j.id}" aria-expanded="false" aria-label="Show AI-style job summary for ${esc(j.role)}">✦ Summary</button>${button('View Job',`jobDetail(${j.id})`,true)}</div><div class="v16-job-summary" role="note"><button type="button" aria-label="Close summary" data-v16-close="${j.id}">×</button><strong>✦ Quick role summary</strong>${esc(summary)}<div style="color:#a7b6dd;margin-top:7px">Demo summary — verify job details with the employer.</div></div></div></article>`
 }
 function eligible(){let q=String(f.search||'').toLowerCase().trim(),city=f.city,station=String(f.station||'').toLowerCase().trim();let list=DATA.jobs.filter(j=>{
  const m=meta[j.id]||meta[1];
  if(S.sub==='Saved Jobs'&&!S.savedJobs.includes(j.id))return false;
  if(q&&![j.role,j.co,j.place,j.type].join(' ').toLowerCase().includes(q))return false;
  if(city&&j.place!==city)return false;
  if(station&&![m.station,m.line].join(' ').toLowerCase().includes(station))return false;
  if(f.work&&j.mode!==f.work)return false;
  if(f.type&&m.kind!==f.type)return false;
  if(f.basis&&m.basis!==f.basis)return false;
  if(f.min!==''&&m.max<Number(f.min))return false;
  if(f.max!==''&&m.min>Number(f.max))return false;
  if(f.age==='24 hours'&&m.days>1)return false;
  if(f.age==='7 days'&&m.days>7)return false;
  if(f.age==='30 days'&&m.days>30)return false;
  if(f.relocation&&m.relocation!==f.relocation)return false;
  if(S.tab==='Fresh Graduate'&&!['Internship','Part Time'].includes(m.kind))return false;
  return true;
 });
  const sort=f.sort==='best'?(S.tab==='Latest'?'Latest first':S.tab==='Best Match'?'Best match':'Best match'):f.sort;
  if(sort==='Latest first')list.sort((a,b)=>meta[a.id].days-meta[b.id].days);
  else if(sort==='Salary high to low')list.sort((a,b)=>meta[b.id].max-meta[a.id].max);
  else if(sort==='Job title A–Z')list.sort((a,b)=>a.role.localeCompare(b.role));
  else list.sort((a,b)=>b.match-a.match);
  return list;
 }
 function paintResults(){const host=e('#v16-job-results');if(!host)return;const list=eligible();const count=e('#v16-job-count');if(count)count.textContent=`${list.length} demo role${list.length!==1?'s':''}`;host.innerHTML=list.map(j=>jobCard(j,DATA.jobs.indexOf(j))).join('')||'<div class="v16-pane" style="padding:25px;grid-column:1/-1"><h3>No matching jobs</h3><p class="v16-muted">Try another station, salary period or work style. You can clear the filters at any time.</p><button class="v16-primary" onclick="BeamishV16.resetJobs()">Clear filters</button></div>'}
 function saveFilters(){try{localStorage.setItem(storageKey,JSON.stringify(f))}catch(e){}}
 function applyJobs(){for(const k of Object.keys(f))f[k]=getVal(k);if(f.sort==='')f.sort='best';saveFilters();paintResults()}
 function resetJobs(){Object.assign(f,{search:'',city:'',station:'',work:'',type:'',basis:'',min:'',max:'',age:'',relocation:'',sort:'best'});saveFilters();if(S.page==='Jobs'){renderContent()}}
 function toggleFilters(btn){const host=btn.closest('.v16-job-filters');let isOpen=host.classList.toggle('v16-filter-open');btn.setAttribute('aria-expanded',String(isOpen));btn.textContent=isOpen?'× Close Filters':'☷ Filters'}
 window.BeamishV16={applyJobs,resetJobs,toggleFilters};
 const oldJobs=window.jobs;
 window.jobs=function(){const saved=S.sub==='Saved Jobs';return title(saved?'Saved Jobs':'Discover Jobs',saved?'Keep the good ones in one place.':'A smarter way to discover your next move — without the clutter.',button(saved?'Discover Jobs':'Saved Jobs',`subTo('${saved?'Discover Jobs':'Saved Jobs'}')`,'blue'))+strip(NAV.Jobs,S.sub,'subTo',true)+(saved?'':strip(['For You','Best Match','Latest','Fresh Graduate'],S.tab,'tabTo'))+
  `<div class="v16-job-layout">${filterBlock()}<section class="v16-job-results"><div class="v16-jobs-toolbar"><div><div class="v16-eyebrow">Find your next move</div><h3>Jobs made for you.</h3></div><span class="v16-chip" id="v16-job-count"></span></div><div id="v16-job-results" class="v16-jobs-grid"></div></section></div>`;
 };
 const prevRenderContent=window.renderContent;
 window.renderContent=function(){prevRenderContent();if(S.page==='Jobs')paintResults()};
 document.addEventListener('click',event=>{let trig=event.target.closest('[data-v16-summary]');if(trig){const card=trig.closest('.v16-job-card');let open=card.classList.toggle('summary-open');trig.setAttribute('aria-expanded',String(open));return}if(event.target.closest('[data-v16-close]')){event.target.closest('.v16-job-card')?.classList.remove('summary-open');return}if(!event.target.closest('.v16-job-card'))document.querySelectorAll('.v16-job-card.summary-open').forEach(x=>x.classList.remove('summary-open'))});
 document.addEventListener('change',event=>{if(event.target.closest('.v16-job-filters'))applyJobs()});
 document.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.closest('.v16-job-filters input')){event.preventDefault();applyJobs()}if(event.key==='Escape')document.querySelectorAll('.v16-job-card.summary-open').forEach(x=>x.classList.remove('summary-open'))});
 // Dashboard: four compact recommendations, consistent navigation to existing detailed actions.
 function recommended(j,i){return `<article class="v16-rec-item"><div class="v16-rec-art"><img src="${art(i)}" alt="Decorative ${esc(j.co)} job artwork"></div><div class="v16-rec-details"><span class="v16-chip">✦ ${j.match}% Match</span><h3>${esc(j.role)}</h3><p class="company">${esc(j.co)} · ${esc(j.place)}</p><span class="salary">${esc(j.pay)}</span><div class="v16-rec-actions">${button('View Job',`jobDetail(${j.id})`,true)}${button('Save',`saveJob(${j.id})`)}</div></div></article>`}
 window.dashboard=function(){const first=DATA.apps.find(x=>x.stage==='Interview');const firstName=S.profile.name.split(' ')[0];const pct=typeof profileCompletion==='function'?profileCompletion():72;
  return `<div class="v16-dashboard"><section class="v16-banner"><div><div style="font-size:10px;font-weight:850;letter-spacing:.14em;margin-bottom:8px">YOUR CAREER, YOUR WAY ✦</div><h1>Hey ${esc(firstName)}, what’s next?</h1><p>Less scrolling. Better opportunities. Your next move starts here.</p></div>${button('Find More Jobs',"goto('Jobs','Discover Jobs')",true)}</section>
  <div class="v16-metrics"><button class="v16-metric active" onclick="goto('Jobs','Discover Jobs')"><span class="symbol">✦</span><span><strong>${DATA.jobs.length}</strong><small>Job matches</small></span></button><button class="v16-metric" onclick="goto('Applications','My Applications')"><span class="symbol">▤</span><span><strong>${DATA.apps.length}</strong><small>Applications</small></span></button><button class="v16-metric" onclick="goto('Applications','Interviews')"><span class="symbol">▦</span><span><strong>${DATA.apps.filter(x=>x.stage==='Interview').length}</strong><small>Interviews</small></span></button><button class="v16-metric" onclick="goto('Profile','Public Profile')"><span class="symbol">◎</span><span><strong>${pct}%</strong><small>Profile complete</small></span></button></div>
  <div class="v16-dashboard-body"><aside class="card v16-dash-user"><img src="${extraImage('avatar')}" alt="${esc(S.profile.name)} profile photo"><h3>${esc(S.profile.name)}</h3><div class="v16-muted">${esc(S.profile.headline)}<br>⌖ ${esc(S.profile.location)}</div><div class="progress" style="margin:14px 0 7px"><i style="width:${pct}%"></i></div><div class="v16-muted"><b>${pct}% profile complete</b></div><div class="lineSep"></div><div class="smallHeading">Your skills</div>${chips(S.profile.skills.split(',').map(x=>x.trim()).filter(Boolean))}<p class="v16-muted" style="margin:12px 0">● ${esc(V5.profileExtra.availability)}</p>${button('Edit Profile',"goto('Profile','Profile Studio')",true)}${button('View Public Profile',"goto('Profile','Public Profile')")}</aside>
  <div class="v16-dash-main"><section class="v16-pane v16-recommend"><div class="v16-section-head"><div><div class="v16-eyebrow">Curated for you</div><h2>Picked for You ✦</h2></div>${button('See all matches',"goto('Jobs','Discover Jobs')")}</div><div class="v16-rec-grid">${DATA.jobs.slice(0,4).map(recommended).join('')}</div></section><div class="v16-dash-lower"><section class="card"><div class="v16-section-head"><h2>My Applications</h2>${button('View all',"goto('Applications','My Applications')")}</div>${DATA.apps.slice(0,3).map(x=>`<div class="v16-small-row"><span class="bubble">${esc(x.co.slice(0,2).toUpperCase())}</span><div style="flex:1"><b>${esc(x.role)}</b><br><small>${esc(x.co)} · ${esc(x.stage)}</small></div><button class="v16-secondary" onclick="applicationDetail('${esc(x.role)}')">View</button></div>`).join('')}</section><section class="card"><div class="v16-section-head"><h2>Upcoming Interview</h2></div>${first?`<h3 style="font-size:15px">${esc(first.role)}</h3><p class="v16-muted">${esc(first.co)} · 29 Oct 2026<br>2:00 PM · Google Meet</p>${button('View Details',`applicationDetail('${esc(first.role)}')`,true)}`:'<p class="v16-muted">No scheduled interviews.</p>'}</section><section class="card"><div class="v16-section-head"><h2>Community Pulse</h2>${button('Open',"goto('Community','Home')")}</div>${S.posts.slice(0,3).map(p=>`<div class="v16-small-row"><span class="bubble">✦</span><div><b>${esc(p.title)}</b><br><small>${esc(p.name)}</small></div></div>`).join('')}</section></div></div></div></div>`;
 };
 // Community: same Facebook-like interactions, 4 editorial posts per row, vertical trends.
 const previousCommunity=window.community;
 function storyCard(p,i){const kind=/Employer/i.test(p.role)?'employer':'candidate';const image=V5.postPhotos[p.id]||art(i,true);const original=!!V5.postPhotos[p.id];const liked=S.likes.includes(p.id),saved=(V5.savedPosts||[]).includes(p.id);
  return `<article class="v16-community-post" tabindex="0" role="button" data-v16-post="${p.id}"><div class="visual"><img src="${original?image:art(i,true)}" alt="${esc(p.title)} visual">${['Video','Reel','Career Clip'].includes(p.type)?'<span class="reel">▶</span>':''}</div><div class="story"><div class="author"><img src="${pic(p.img)}" alt="${esc(p.name)}"><span style="min-width:0"><b>${esc(p.name)}</b><br><small>${esc(p.role)}</small></span></div><h3>${esc(p.title)}</h3><div class="desc">${esc(p.caption)}</div><div class="foot"><button onclick="event.stopPropagation();likePost(${p.id})">${liked?'♥':'♡'} Like</button><button onclick="event.stopPropagation();viewPost(${p.id})">💬</button><button onclick="event.stopPropagation();toggleSavePost(${p.id})">${saved?'✓ Saved':'▯ Save'}</button><button onclick="event.stopPropagation();BeamishMaster.profile('${esc(p.name).replaceAll("'",'')}','${kind}')">Profile ↗</button></div></div></article>`}
 window.community=function(){if(S.sub!=='Home')return previousCommunity();const feed=S.communityTab==='Following'?S.posts.filter(p=>['North Studio','Food Haus',S.profile.name].includes(p.name)):S.communityTab==='Trending'?[...S.posts].reverse():S.posts;
  const tags=[['#SalaryTalk','Money, benefits & pay stories'],['#CareerSwitch','Starting over, getting ahead'],['#FirstJob','Life after graduation'],['#OfficeLife','Funny moments and real talk']];
  return title('Community','Your work-life feed. Real people, useful tips and a little chaos.',button('+ Create Post',"compose('Post')",'blue'))+strip(NAV.Community,S.sub,'subTo',true)+`<div class="v16-community-layout"><div class="v16-community-main"><section class="card v16-compose"><div class="communityComposer"><img src="${extraImage('avatar')}" alt="Your profile"><button class="composerInput" onclick="compose('Post')">What’s happening in your work life?</button></div><div class="v16-composer-actions">${['Post','Question','Poll','Anonymous','Career Clip'].map(t=>button(t,`compose('${t}')`)).join('')}</div></section>${strip(['For You','Following','Trending'],S.communityTab,'tabToComm')}<div class="v16-community-grid">${feed.map(storyCard).join('')}</div></div><aside class="v16-community-rail"><section class="card"><div class="v16-eyebrow">What's hot</div><h3 style="font-size:17px;margin:8px 0">🔥 Trending now</h3>${tags.map(([t,d])=>`<button class="v16-topic" onclick="BeamishV16.trend('${esc(t)}')"><b>${esc(t)}</b><span>${esc(d)}</span></button>`).join('')}</section><section class="card"><div class="v16-eyebrow">Meet your people</div><h3 style="font-size:17px;margin:8px 0">Suggested spaces</h3>${[['Marketing People MY','Campaigns and portfolio talk'],['Career Switch MY','New chapters, real stories'],['First Job Circle','For interns and graduates']].map(([name,desc])=>`<div class="v16-small-row"><span class="bubble">✦</span><div><b>${esc(name)}</b><br><small>${esc(desc)}</small></div></div>`).join('')}${button('Explore Groups',"subTo('Groups')")}</section><section class="card"><h3 style="margin:2px 0 8px">Need advice?</h3><p class="v16-muted">Post a question and hear real perspectives from people who have been there.</p>${button('Ask a Question',"compose('Question')",true)}</section></aside></div>`
 };
 window.BeamishV16.trend=function(tag){S.communityTab='Trending';renderContent();const el=e('.v16-community-grid');el?.scrollIntoView({behavior:'smooth',block:'start'})};
 document.addEventListener('click',evt=>{const card=evt.target.closest('[data-v16-post]');if(card&&!evt.target.closest('button'))viewPost(Number(card.dataset.v16Post))});
 document.addEventListener('keydown',evt=>{if(['Enter',' '].includes(evt.key)&&evt.target.matches('[data-v16-post]')){evt.preventDefault();viewPost(Number(evt.target.dataset.v16Post))}});
 // Profile: compact useful information, unified relocation + trust + portfolio.
 const oldProfile=window.profile;
 window.profile=function(){if(S.sub!=='Public Profile')return oldProfile();let m='Not specified';try{m=JSON.parse(localStorage.getItem('beamish_candidate_relocation_demo')||'"Not specified"')}catch(e){}const skills=S.profile.skills.split(',').map(x=>x.trim()).filter(Boolean);
  return title('My Public Profile','A creative snapshot of your work, skills and what you’re looking for.')+strip(NAV.Profile,S.sub,'subTo',true)+`<div class="v16-profile"><section class="v16-profile-hero"><div class="v16-profile-cover"></div><div class="v16-profile-interior"><div class="v16-profile-identity"><img src="${extraImage('avatar')}" alt="${esc(S.profile.name)}"><div class="v16-eyebrow" style="margin-top:11px">BEAMISH / PROFILE</div><h2>${esc(S.profile.name)}</h2><div class="v16-muted">${esc(S.profile.headline)} · ${esc(S.profile.location)}</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">${skills.map(x=>`<span class="v16-chip">${esc(x)}</span>`).join('')}</div><p class="bio">${esc(S.profile.bio)}</p><div class="v16-muted">● ${esc(V5.profileExtra.availability)} &nbsp; · &nbsp; Visibility: ${esc(V5.privacy.visibility)}</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:18px">${button('Edit in Profile Studio',"subTo('Profile Studio')",true)}${button('Resume / CV',"subTo('Resume / CV')")}</div></div><div class="v16-profile-right"><div class="v16-pane"><div class="v16-eyebrow" style="margin-bottom:10px">WORK PREFERENCES</div><label>Relocation preference<select id="v17-mobility">${['Not specified','No','Within Klang Valley','Open to discuss','Open to relocate'].map(x=>`<option ${m===x?'selected':''}>${x}</option>`).join('')}</select></label><div style="margin-top:10px">${button('Save preference','BeamishV16.saveMobility()',true)}</div><div class="v16-muted" style="margin-top:9px">Only share job-related preferences with permitted employers.</div></div><div class="v16-pane"><div class="v16-eyebrow">ACCOUNT TRUST</div><h3 style="font-size:16px;margin:8px 0 5px">Not Verified</h3><p class="v16-muted" style="margin:0">Verification badges require identity checks and admin approval.</p></div></div></div></section><div class="v16-profile-bottom"><section class="card"><div class="v16-section-head"><h2>About Me</h2></div><p class="v16-muted">${esc(S.profile.bio)}</p><div style="margin-top:12px">${skills.map(x=>`<span class="v16-chip" style="margin:3px">${esc(x)}</span>`).join('')}</div></section><section class="card"><div class="v16-section-head"><h2>Selected Work</h2>${button('Manage Portfolio',"subTo('Profile Studio')")}</div><div class="v16-portfolio">${(V5.profileExtra.portfolio?.length?V5.profileExtra.portfolio.slice(0,3):[art(0),art(2),art(3)]).map((src,i)=>`<div class="shot"><img src="${src}" alt="Portfolio highlight ${i+1}"><span>${['Content & campaigns','Brand storytelling','Creative projects'][i]}</span></div>`).join('')}</div></section></div></div>`
 };
 window.BeamishV16.saveMobility=function(){const val=e('#v17-mobility')?.value||'Not specified';try{localStorage.setItem('beamish_candidate_relocation_demo',JSON.stringify(val));V5.workPrefs.Relocation=val;saveV5();}catch(e){}renderContent();toast('Work preference saved in this browser demo')};
 window.renderContent();
}
function employerUI(){
 navRail();
 // Keep existing employer plans, hiring and people logic; improve Community visual clarity.
 const earlier=window.render;
 if(typeof earlier==='function')window.render=function(){earlier();if(typeof state!=='undefined'&&state.section==='Community')document.querySelectorAll('.post > img,.feed .post img.postmedia').forEach((image,i)=>{image.src=art(i,true);image.alt=image.alt||'Beamish Community story illustration'})};
 if(typeof window.render==='function')window.render();
}
function backendUI(){
 // Admin, Finance and CMS keep complete navigation labels: complex operator workflows need context.
 const body=document.body;body.classList.add('v16-backend-clean');
 // Update the role header without changing data, exports or permissions.
 const main=e('#main');if(main)main.setAttribute('aria-live','polite');
 const sync=()=>{let logged=false;try{logged=typeof role!=='undefined'&&!!role}catch(e){}document.body.classList.toggle('v16-backend-authed',logged)};
 const originalSignIn=window.signIn,originalSignOut=window.signOut;
 if(typeof originalSignIn==='function')window.signIn=function(){originalSignIn();sync()};
 if(typeof originalSignOut==='function')window.signOut=function(){originalSignOut();sync()};
 sync()
}
function init(){window.BeamishV16=window.BeamishV16||{};if(scope==='public')publicUI();else if(scope==='candidate')candidateUI();else if(scope==='employer')employerUI();else if(scope==='backend')backendUI()}
onReady(init);
})();
