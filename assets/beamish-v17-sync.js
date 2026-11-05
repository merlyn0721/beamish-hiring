/* Beamish v17: reference-led public community preview and synchronized portal shells.
   This enhances the supplied v16 project without replacing existing workflows. */
(()=>{'use strict';
const scope=document.currentScript?.dataset?.portal||'public';
const $=sel=>document.querySelector(sel);
const clean=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const afterReady=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
const communityStories=[
 {tag:'Career Switch',name:'Jasmine Tan',time:'2h ago',heading:'From Marketing to Product: Here’s what I learned',body:'Three things that helped me transition into product work.',image:'../assets/v16-story-2.svg',likes:124,comments:28},
 {tag:'Career Tips',name:'Marcus Lim',time:'1d ago',heading:'Five interview questions I actually got',body:'Useful questions to prepare for your next interview.',image:'../assets/v16-story-3.svg',likes:96,comments:17},
 {tag:'Work Life',name:'Nur Aisyah',time:'2d ago',heading:'A day in the life at a startup',body:'Real experiences, real growth and a lot of learning.',image:'../assets/v16-story-5.svg',likes:210,comments:34}
];
function communityHtml(){
 const pills=[['🔥','#CareerSwitch','12.4K conversations'],['💻','#WorkLife','8.9K conversations'],['🌱','#StartupLife','15.8K conversations'],['💡','#InterviewTips','21.7K conversations']];
 return `<section class="v17-community-public" aria-label="Beamish Community preview">
  <div class="v17-community-hero"><div class="v17-community-eyebrow">REAL PEOPLE. REAL CAREERS.</div><h1>Join Beamish’s<br><span>Community</span> for What’s Next</h1>
  <p>A place to discover real stories, connect with like-minded people,<br class="v17-wide-only"> and grow your career journey together.</p>
  <div class="v17-floating-topics" aria-label="Popular community topics">${pills.map((p,i)=>`<button class="v17-trend-pill v17-pill-${i+1}" type="button" onclick="BeamishV17.preview('${p[1]}')"><span aria-hidden="true">${p[0]}</span><span><b>${p[1]}</b><small>${p[2]}</small></span><span class="v17-pill-go">↗</span></button>`).join('')}</div>
  <div class="v17-photo-stage"><div class="v17-photo-wrap"><img src="../assets/v17-community-people.jpg" alt="Young professionals sharing ideas and laughing together"></div></div>
  <div class="v17-community-hero-foot"><div class="v17-young-talents"><strong>Trusted by young talents</strong><div class="v17-avatars">${['social1.jpg','social2.jpg','avatar.jpg','social5.jpg'].map((img,i)=>`<img src="../assets/${img}" alt="Community member ${i+1}">`).join('')}<span>+</span></div></div><div class="v17-real-growth"><span aria-hidden="true">✦</span><b>Real conversations.<br>Real growth.</b></div></div></div>
  <div class="v17-community-metrics" aria-label="Illustrative community statistics">${[['♧','25,000+','Community members'],['▤','1,200+','Career stories'],['♧','350+','Live discussions'],['▣','900+','Jobs discovered']].map(m=>`<div class="v17-community-stat"><span class="v17-stat-symbol">${m[0]}</span><div><strong>${m[1]}</strong><small>${m[2]}</small></div></div>`).join('')}</div>
  <div class="v17-community-stories-head"><div><h2>Real stories from our community</h2><p>Career journeys, useful tips and honest conversations.</p></div><button type="button" onclick="BeamishV17.gate()">View all posts <span aria-hidden="true">↗</span></button></div>
  <div class="v17-community-preview-grid">${communityStories.map((p,i)=>`<article class="v17-guest-story"><div class="v17-guest-author"><span class="v17-guest-avatar">${p.name.split(' ').map(x=>x[0]).join('')}</span><div><b>${p.name}</b><small>${p.time}</small></div><button title="Read limited preview" aria-label="Preview ${clean(p.heading)}" type="button" onclick="BeamishV17.preview('${clean(p.tag)}')">···</button></div><span class="v17-story-tag ${i===1?'yellow':''}">${p.tag}</span><button type="button" class="v17-story-open" onclick="BeamishV17.preview('${clean(p.tag)}')"><img src="${p.image}" alt="${clean(p.heading)} editorial illustration"><h3>${p.heading}</h3><p>${p.body}</p></button><div class="v17-story-social"><button type="button" onclick="BeamishV17.gate()">♡ ${p.likes}</button><button type="button" onclick="BeamishV17.gate()">♧ ${p.comments}</button><button class="v17-story-save" type="button" onclick="BeamishV17.gate()" aria-label="Save this post">▯</button></div></article>`).join('')}
  <aside class="v17-public-join"><span class="v17-join-spark">✳</span><div><h3>Join the<br>Beamish Community</h3><p>Meet like-minded people, get inspired, and discover what’s next together.</p><a href="../auth/signup.html?role=candidate" class="v17-join-btn">Join Community <span>↗</span></a><div class="v17-join-bottom"><span>✦ Real conversations</span><span>✦ Better opportunities</span></div></div></aside></div>
  <p class="v17-demo-disclaimer">Community counts and posts shown here are illustrative design previews. Sign in to see full member interactions.</p>
 </section>`;
}
function guestDialog(tag){const safe=clean(tag);document.getElementById('v17-guest-dialog')?.remove();const dialog=document.createElement('div');dialog.id='v17-guest-dialog';dialog.className='v17-guest-dialog-layer';dialog.innerHTML=`<div class="v17-guest-dialog" role="dialog" aria-modal="true" aria-label="Public Community preview" tabindex="-1"><button class="v17-guest-x" onclick="BeamishV17.close()" aria-label="Close dialog">✕</button><span class="v17-community-eyebrow">COMMUNITY PREVIEW</span><h2>${safe} is trending on Beamish</h2><p>Here’s a small preview of the conversations happening in our community. Full posts, reactions, member profiles and private conversations are available inside the Candidate or Employer portal.</p><div class="v17-guest-dialog-actions"><a href="../auth/signup.html?role=candidate" class="v17-join-btn">Join Community ↗</a><a href="../auth/login.html" class="v17-guest-login">Already a member? Log In</a></div></div>`;dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.remove()});document.body.appendChild(dialog);dialog.querySelector('[role=dialog]').focus()}
function guestGate(){guestDialog('Full posts and community features')}
function installPublic(){
 // Use existing router; replace only the public Community screen.
 if(typeof pages!=='undefined'){pages.community=communityHtml;}
 // No duplicate Career Match navigation: hero matcher remains accessible via Find My Job.
 document.querySelectorAll('#publicNav [data-page="match"],.footer .footlinks a[href="#match"]').forEach(el=>el.remove());
 const removeMessages=()=>document.querySelector('#bm-chat-root')?.remove();removeMessages();
 if((location.hash||'')==='#community'&&typeof render==='function')render();
 // Hero geometry is handled by the consolidated v18 stylesheet.
 document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('v17-guest-dialog')?.remove()});
}
function navIcons(){
 const side=$('.side,.sidebar');if(!side)return;
 // Keep the existing real buttons and their nested flyout actions, but hide labels visually.
 function labelAll(){
  side.querySelectorAll('.navItem > .navBtn,.navitem > .navbutton').forEach(b=>{
   const label=b.querySelector('span:last-child')?.textContent?.trim()||b.textContent.trim();
   if(!label)return;b.dataset.v17Label=label;b.setAttribute('aria-label',label);b.title=label;
  });
 }
 labelAll();const area=side.querySelector('.sideNav,.navlist');if(area){let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;labelAll()})}).observe(area,{childList:true,subtree:true})}
 document.body.classList.add('v17-icon-rail');
}
function messageTop(){
 const row=scope==='backend'?$('.topbar .topright'):$('.top .topRight');if(!row)return;
 if(row.querySelector('.v17-inbox-top'))return;
 const btn=document.createElement('button');btn.className='v17-inbox-top';btn.type='button';btn.title='Messages';btn.setAttribute('aria-label','Open Messages');btn.innerHTML='<svg aria-hidden="true" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 5h16v12H7l-3 3V5Z"/><path d="M8 10h8m-8 4h5"/></svg><span class="v17-msg-indicator"></span>';
 btn.addEventListener('click',()=>{if(window.BeamishChat&&typeof BeamishChat.open==='function'){BeamishChat.open();return}if(scope==='candidate'&&typeof goto==='function')goto('Messages','Inbox');if(scope==='employer'&&typeof navigate==='function')navigate('Messages','Inbox');if(scope==='backend'&&typeof go==='function')go('Messages','Inbox')});
 const bell=row.querySelector('button[aria-label="Notifications"],button[title="Notifications"],.iconbtn,.iconBtn,.topIcon'); if(bell)bell.insertAdjacentElement('beforebegin',btn);else row.prepend(btn);
}
function backendAccount(){if(scope!=='backend')return;const top=$('#topAvatar');if(!top)return;
 top.style.cursor='pointer';top.tabIndex=0;top.setAttribute('role','button');top.setAttribute('aria-label','Account menu');
 const toggle=()=>{if(!document.body.classList.contains('v16-backend-authed'))return;let menu=$('#v17-account-dropdown');if(menu){menu.remove();return}menu=document.createElement('div');menu.id='v17-account-dropdown';menu.className='v17-account-dropdown';menu.innerHTML='<strong>Beamish Back Office</strong><small>Staff demo account</small><button type="button" onclick="BeamishV17.backendProfile()">Account & Settings</button><button type="button" class="danger" onclick="BeamishV17.logout()">↪ Sign Out</button>';document.body.appendChild(menu)};
 top.addEventListener('click',toggle);top.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
 document.addEventListener('click',e=>{if(!e.target.closest('#v17-account-dropdown,#topAvatar'))document.getElementById('v17-account-dropdown')?.remove()});
}
function backendProfile(){document.getElementById('v17-account-dropdown')?.remove();if(typeof go==='function'&&typeof ROLES!=='undefined'&&typeof role!=='undefined'){
 const groups=Object.keys(ROLES[role]?.cats||{});go(groups.includes('System')?'System':groups.includes('Settings')?'Settings':groups[0]);}}
function logout(){document.getElementById('v17-account-dropdown')?.remove();if(typeof signOut==='function')signOut()}
function backendAfterLogin(){if(scope!=='backend')return;
 const check=()=>{const logged=document.body.classList.contains('v16-backend-authed');document.querySelector('.v17-inbox-top')?.toggleAttribute('hidden',!logged);document.getElementById('v17-account-dropdown')?.remove()};
 const app=$('#app');if(app)new MutationObserver(check).observe(app,{attributes:true,attributeFilter:['class']});check();
}
function addTopButton(){if(scope==='public')return;navIcons();messageTop();if(scope==='backend'){backendAccount();backendAfterLogin()}}
function init(){if(scope==='public')installPublic();else addTopButton()}
window.BeamishV17={preview:guestDialog,gate:guestGate,close:()=>document.getElementById('v17-guest-dialog')?.remove(),backendProfile,logout};afterReady(init);
})();
