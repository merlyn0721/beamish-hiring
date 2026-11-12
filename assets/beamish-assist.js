/* Beamish Assist v1 — client-only guided support, optional connected agent endpoint. */
(function(){
  'use strict';
  if(document.querySelector('#bs-assist-root')) return;
  const script=document.currentScript;
  const siteRoot=new URL('../',script.src);
  const to=(p)=>new URL(p,siteRoot).href;
  const robotStyle=new URLSearchParams(location.search).get('robot')==='b'?'b':'a';
  const robot=to('assets/beamish-robot-'+robotStyle+'.webp');
  const pathname=location.pathname.toLowerCase();
  const currentArea=pathname.includes('/candidate/')?'candidate':pathname.includes('/employer/')?'employer':pathname.includes('/backend/')?'admin':pathname.includes('/auth/')?'account':'public';
  const labels={public:'Public Website',candidate:'Candidate Portal',employer:'Employer Portal',account:'Login & Sign Up',admin:'Backend Portal'};
  const linkMap={jobs:currentArea==='employer'?to('employer/index.html'):to('public/index.html#jobs'),
    application:to('candidate/index.html'),
    candidate:to('candidate/index.html'),
    employer:to('employer/index.html'),
    company:currentArea==='employer'?to('employer/index.html'):to('public/index.html#companies'),
    match:to('public/index.html#match'),
    community:to('public/index.html#community'),
    career:to('public/index.html#irl'),
    signup:to('auth/index.html?mode=signup'),
    login:to('auth/index.html?mode=login'),
    backend:to('backend/index.html'),
    home:to('public/index.html')};
  const kb=[
   {match:/log\s?in|sign\s?in|password|reset|access|cant (enter|login)|登入|密码|忘记/,label:'Login and accounts',answer:'Use Log In to select Candidate or Employer. For a forgotten password, the production site will need a secure email reset flow; this demo does not send reset emails.',links:[['Open login','login'],['Create account','signup']]},
   {match:/sign\s?up|register|account|create.*profile|注册|报名|开.*账号/,label:'Registration',answer:'Choose Job Seeker, Employer or Community Only on the Sign Up page. Community Only uses the candidate-side community experience without requiring a job application.',links:[['Sign up','signup']]},
   {match:/match|vibe|career path|适合|职业匹配/,label:'Career Match',answer:'Try the interactive 3-step Work Vibe matcher to explore possible role families. It is illustrative guidance; your candidate preferences can further personalise job discovery.',links:[['Explore Career Match','match'],['Candidate Portal','candidate']]},
   {match:/apply|application|interview|shortlist|offer|withdraw|简历投递|申请|面试/,label:'Applications and interviews',answer:'In Candidate Portal → Applications → My Applications, open an application to see status and timeline. Upcoming interviews are in Applications → Interviews. Job details and CV submission are demo actions.',links:[['Candidate Applications','application']]},
   {match:/resume|cv|portfolio|profile|skills|cover|个人资料|履历|作品集/,label:'Profile and CV',answer:'Candidate Portal → Profile → Profile Studio lets you change your avatar, cover, skills, bio and portfolio, with desktop/mobile previews. Your CV is a separate page under Profile.',links:[['Open Candidate Profile','candidate']]},
   {match:/job|salary|work|location|role|vacan|找工|招聘|薪水|工作/,label:'Find jobs',answer:'Use Find Jobs to search by role or company and discover openings. Save jobs and explore matches within the Candidate Portal; job and salary data are illustrative.',links:[['Explore Jobs','jobs'],['Open Candidate Portal','candidate']]},
   {match:/post.*job|create.*job|hire|hiring|pipeline|applicant|talent|雇主|招聘者|发布职位/,label:'Employer hiring',answer:'Employer Portal → Hiring combines All Jobs, AI-assisted Create Job, Pipeline, Interviews and Offers. Discover Talent and Shortlist live under Talent. AI salary estimates in this prototype are sample values.',links:[['Employer Portal','employer']]},
   {match:/invoice|bill|plan|payment|refund|subscription|收费|付款|订阅|账单/,label:'Plans and billing',answer:'Employer Portal → Workspace → Plan & Billing contains subscriptions, payments and invoices. Platform Admin owns plan features, Finance owns prices, and CMS controls the public plan-page copy.',links:[['Employer Workspace','employer'],['Backend Hub','backend']]},
   {match:/community|post|group|event|reel|clip|hashtag|trending|话题|社区|视频/,label:'Community',answer:'Community has Home, Groups, Events, Career Clips and Me. You can share posts, polls and images in the candidate/employer prototypes. CMS manages official posts and hashtags; Platform Admin reviews moderation.',links:[['Public Community','community'],['Employer Portal','employer']]},
   {match:/fake|scam|fraud|abuse|report|harass|spam|举报|诈骗|投诉/,label:'Report a problem',answer:'Do not share passwords or payment details. For suspected scam jobs, harassment or account compromise, request a live support review so the issue can be investigated. This demo cannot actually submit a report until support is connected.',links:[]},
   {match:/admin|cms|finance|trend|page builder|后台|管理/,label:'Backend roles',answer:'The Backend Hub has separate Platform Admin, Finance Admin and CMS Admin entrances. Platform oversees accounts/plans/moderation; Finance handles billing; CMS manages website content, Community marketing and trends.',links:[['Backend Hub','backend']]}
  ];
  const byArea={public:['Find jobs','Career Match','Sign up','Report a problem'],candidate:['Applications','Profile & CV','Career Match','Report a problem'],employer:['Create job','Talent shortlist','Plan & Billing','Report a problem'],account:['Sign up','Login help','Candidate Portal','Report a problem'],admin:['Admin roles','Plan management','Trending hashtags','Report a problem']};
  const root=document.createElement('div');root.id='bs-assist-root';
  root.innerHTML=`<section class="bs-panel" id="bs-panel" role="dialog" aria-label="Beamish Assist" aria-hidden="true"><div class="bs-header"><span class="bs-logo"><img src="${robot}" alt=""></span><div><strong>Beamish Assist <span style="color:#e5df00">✦</span></strong><small>Guided support · ${labels[currentArea]}</small></div><button class="bs-close" type="button" aria-label="Close chat" id="bs-close">×</button></div><div class="bs-log" id="bs-log" aria-live="polite"></div><div class="bs-footer"><form class="bs-form" id="bs-form"><input id="bs-input" placeholder="Ask about Beamish..." aria-label="Ask Beamish Support" maxlength="500" required><button class="bs-send" type="submit">Send</button></form><div class="bs-bottom"><small>Demo assistant · no live AI connected</small><button type="button" class="bs-agent" id="bs-agent">Talk to a live agent ↗</button></div></div></section><button type="button" class="bs-trigger" id="bs-trigger" aria-label="Open Beamish AI support" aria-controls="bs-panel" aria-expanded="false"><img class="bs-robot" src="${robot}" alt="Beamish robot"><span class="bs-sr-only">Ask Beamish</span></button>`;
  document.body.appendChild(root);
  root.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.querySelector('.bs-open')){e.preventDefault();close()}});
  const panel=root.querySelector('#bs-panel'), log=root.querySelector('#bs-log'), trigger=root.querySelector('#bs-trigger'), input=root.querySelector('#bs-input');
  const el=(tag,cls,txt)=>{const node=document.createElement(tag);node.className=cls;if(txt!==undefined)node.textContent=txt;return node};
  function putMsg(text,user=false){const e=el('div','bs-msg'+(user?' bs-from-user':''),text);log.appendChild(e);log.scrollTop=log.scrollHeight;return e}
  function open(){panel.classList.add('bs-open');panel.setAttribute('aria-hidden','false');trigger.setAttribute('aria-expanded','true');if(!log.children.length)welcome();input.focus()}
  function close(){panel.classList.remove('bs-open');panel.setAttribute('aria-hidden','true');trigger.setAttribute('aria-expanded','false');trigger.focus()}
  function quick(options){const wrap=el('div','bs-quick');options.forEach(t=>{const b=el('button','',t);b.type='button';b.addEventListener('click',()=>ask(t));wrap.appendChild(b)});log.appendChild(wrap);log.scrollTop=log.scrollHeight}
  function welcome(){putMsg('Hi! 👋 I’m Beamish Assist. I can guide you through jobs, applications, profiles, Community, hiring and account issues. How can I help?');quick(byArea[currentArea])}
  function answer(q){const item=kb.find(k=>k.match.test(q));if(!item)return {answer:'I can help with job search, applications, account access, Career Match, employer hiring, profile edits and Community. Could you describe what happened or choose a suggested topic? For unresolved issues, use “Talk to a live agent”.',links:[]};return item}
  async function ask(msg){msg=(msg||'').trim();if(!msg)return;putMsg(msg,true);
    const aiEndpoint=(window.BEAMISH_SUPPORT_CONFIG&&window.BEAMISH_SUPPORT_CONFIG.aiEndpoint)||'';
    if(aiEndpoint){try{const response=await fetch(aiEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,portal:currentArea})});if(!response.ok)throw Error('AI endpoint unavailable');const data=await response.json();if(typeof data.reply==='string'&&data.reply.trim()){putMsg(data.reply);return}}catch(err){putMsg('The connected AI service is unavailable. Here is what I can guide you through locally:')}}
    const data=answer(msg.toLowerCase());const e=putMsg(data.answer);if(data.links&&data.links.length){const related=el('div','bs-related');data.links.forEach(([title,key])=>{let a=el('a','',title);a.href=linkMap[key]||linkMap.home;related.appendChild(a)});e.appendChild(related)}if(/scam|fraud|harass|refund|live agent|human|real person|人工|真人/.test(msg.toLowerCase())){const b=el('button','bs-agent','Request human help →');b.addEventListener('click',handoff);e.appendChild(b)}}
  function handoff(){const wrap=el('div','bs-handoff');const intro=el('b','', 'Live-agent escalation');const p=el('div','', 'For real handoff, the site must connect a support provider. In this prototype, you can prepare and download a support request; it is not sent to a human yet.');wrap.append(intro,p);const form=el('form','');form.innerHTML='<label>Your name<input name="name" required maxlength="80" placeholder="Full name"></label><label>Reply email<input type="email" name="email" required placeholder="you@example.com"></label><label>Describe your issue<textarea rows="3" name="message" required minlength="8" placeholder="What went wrong? What have you tried?"></textarea></label><button type="submit">Prepare support request →</button><span class="bs-note">Never include passwords, payment details or sensitive IDs.</span>';
    form.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(form);const ticket={portal:currentArea,name:String(f.get('name')),email:String(f.get('email')),issue:String(f.get('message')),created_at:new Date().toISOString(),status:'draft_not_sent'};const endpoint=(window.BEAMISH_SUPPORT_CONFIG&&window.BEAMISH_SUPPORT_CONFIG.endpoint)||'';
      if(endpoint){try{let response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(ticket)});if(!response.ok)throw Error('Server did not accept request');const data=await response.json();putMsg('Your request has been received by the connected support service. Reference: '+String(data.reference||'available from support'));wrap.remove();return}catch(err){putMsg('The live support connection could not be reached. You can download a draft instead.')}}
      try{localStorage.setItem('beamish_last_support_draft',JSON.stringify(ticket))}catch(e){};
      const blob=new Blob([JSON.stringify(ticket,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=el('a','','Download support request (JSON)');a.href=url;a.download='Beamish_Support_Request_DRAFT.json';a.style.cssText='color:#0f22f2;display:block;margin-top:8px;font-weight:900;text-decoration:underline';wrap.appendChild(a);putMsg('Your support request is prepared but NOT sent. Download it or connect a customer-support endpoint to enable real live-agent escalation.');form.querySelector('button').disabled=true;
    });wrap.appendChild(form);log.appendChild(wrap);log.scrollTop=log.scrollHeight}
  trigger.addEventListener('click',()=>panel.classList.contains('bs-open')?close():open());root.querySelector('#bs-close').addEventListener('click',close);root.querySelector('#bs-agent').addEventListener('click',handoff);root.querySelector('#bs-form').addEventListener('submit',e=>{e.preventDefault();ask(input.value);input.value=''});
  window.BeamishAssist={open,ask,requestAgent:handoff};
})();
