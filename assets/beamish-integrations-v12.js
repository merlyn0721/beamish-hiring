/* Beamish V12 profile presentation polish. Front-end mock data only. */
(()=>{
'use strict';
const B=window.BeamishV9;
if(!B)return;
const esc=B.esc;
const data={
 'EM-104':{summary:'A creative agency building digital experiences, content and brand moments.',highlights:['Design-driven culture','Flexible collaboration','Creative & marketing'],media:['office.jpg','company2.jpg','company3.jpg']},
 'EM-102':{summary:'A technology team creating tools and opportunities for ambitious builders.',highlights:['Product engineering','Learning culture','Technology'],media:['company1.jpg','office2.jpg','company3.jpg']},
 'EM-101':{summary:'A local lifestyle and food business focused on people and community.',highlights:['Retail experience','Customer-first','Food & beverage'],media:['office2.jpg','company3.jpg','company2.jpg']},
 'EM-098':{summary:'A growing retail company looking for talented front-line and operations teams.',highlights:['Retail','Operations','Teamwork'],media:['company3.jpg','company1.jpg','office.jpg']},
 'EM-090':{summary:'An independent creative studio with an emerging design portfolio.',highlights:['Studio life','Brand design','Creative work'],media:['office.jpg','company2.jpg','company1.jpg']},
 'EM-083':{summary:'A Malaysia-based employer building a supportive workplace.',highlights:['New opportunities','Growing team','Local careers'],media:['office2.jpg','company1.jpg','company2.jpg']}
};
function image(name,style='') {return `<img src="../assets/${esc(name)}" ${style} loading="lazy" alt="Company work and culture">`}
function companyCard(c){
 const x=data[c.id]||data['EM-083'];
 const status=c.verify==='Verified'?'<span class="bm-pill" style="background:#d9faef;color:#00674c">✓ Verified Employer</span>':`<span class="bm-pill">${esc(c.verify)}</span>`;
 const cover=x.media[0];
 return `<div class="bm-profile-cover" style="background:linear-gradient(110deg,#0f22f255,#e5df0040),url('../assets/${esc(cover)}') center/cover"></div>
 <div class="bm-profile-overlay"><div class="bm-profile-identity"><div class="bm-avatar employer" style="width:70px;height:70px;min-width:70px;font-size:22px;border-radius:18px">${esc(c.name.slice(0,2).toUpperCase())}</div><div><div class="bm-person-meta">EMPLOYER PROFILE · ${esc(c.id)}</div><h3>${esc(c.name)} ${status}</h3><p style="margin:0">${esc(c.industry)}</p></div></div><p>${esc(x.summary)}</p>
 <div class="bm-profile-grid"><div><strong>Plan</strong>${esc(c.plan)} · ${esc(c.sub)}</div><div><strong>Billing</strong>${esc(c.billing)}</div><div><strong>Current Job Posts</strong>${esc(c.jobs)}</div></div>
 <div class="bm-profile-tags">${x.highlights.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
 <h3 style="font-size:15px;margin:18px 0 10px">Company Culture & Portfolio</h3><div class="bm-gallery">${x.media.map(m=>image(m)).join('')}</div>
 <div class="bm-popup-actions"><button onclick="BeamishV9.close()">Close</button><button class="blue" onclick="BeamishV9.close();go('People','Employers')">Back to Employer List</button></div></div>`;
}
function install(){
 // Keep subscriptions and verification as two independent attributes in every employer card.
 if(typeof role!=='undefined'&&typeof ROLES!=='undefined'&&window.BeamishOps){
  window.BeamishOps.employerDetail=function(id){let row=BeamishOps.rows().find(x=>x.id===id);if(row)B.dialog('Employer Profile · '+row.name,companyCard(row),{wide:true})};
 }
 // Profile popups should close using Escape, without navigating away.
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){
  const modal=document.getElementById('bm-pop-backdrop');if(modal){modal.remove();e.stopPropagation()}
 }});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();