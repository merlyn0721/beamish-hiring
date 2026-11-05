/* Beamish v10 shared prototype data contracts. No production accounts or payment processing. */
(function(){
'use strict';
const B=window.BeamishV9;if(!B)return;
const SUBKEY='beamish_employer_subscription_v10',SERVKEY='beamish_products_v10',EVENTKEY='beamish_ops_events_v10',BADGEKEY='beamish_member_badges_v10';
const samples=[
{id:'SRV-01',name:'Featured Employer Spotlight',category:'Employer Branding',description:'Promote your company story in featured discovery areas.',status:'Coming Soon',price:149,billing:'One-time',audience:'Employers'},
{id:'SRV-02',name:'Interview Scheduling Plus',category:'Recruiting',description:'Enhanced interview coordination and hiring workflows.',status:'Coming Soon',price:89,billing:'Monthly',audience:'Employers'},
{id:'SRV-03',name:'Career Event Promotion',category:'Events & Community',description:'Reach career-focused audiences with featured event placements.',status:'Planned',price:199,billing:'Per campaign',audience:'All'}];
const stations=[{name:'MRT Muzium Negara',line:'MRT Kajang Line',city:'Kuala Lumpur'},{name:'LRT Taman Jaya',line:'LRT Kelana Jaya Line',city:'Petaling Jaya'},{name:'MRT Bukit Bintang',line:'MRT Kajang Line',city:'Kuala Lumpur'},{name:'LRT SS15',line:'LRT Kelana Jaya Line',city:'Subang Jaya'},{name:'LRT KLCC',line:'LRT Kelana Jaya Line',city:'Kuala Lumpur'},{name:'MRT Cochrane',line:'MRT Kajang Line',city:'Kuala Lumpur'}];
function subscription(){return B.read(SUBKEY,{planId:'FREE',planName:'Free',mode:'free',status:'Active (Demo)',startedAt:null,usage:{jobs:0,talent:0,boost:0},history:[]})}
function setSubscription(s){B.save(SUBKEY,s);record('Subscription update',{plan:s.planName,mode:s.mode,status:s.status})}
function catalog(){return B.read(SERVKEY,samples)}
function setCatalog(items){B.save(SERVKEY,items);record('Services catalog updated',{count:items.length})}
function record(type,metadata={}){let events=B.read(EVENTKEY,[]);events.unshift({type,time:new Date().toISOString(),metadata});B.save(EVENTKEY,events.slice(0,150))}
function badge(role){if(role==='employer'){let info=B.business();return info?.status==='Verified'?'Verified Employer':info?.status==='Pending Review'?'Verification Pending':'Unverified Employer'}return B.read(BADGEKEY,{candidate:'Not Verified'}).candidate||'Not Verified'}
function verifiedMark(role){let text=badge(role);let kind=/^Verified/.test(text)?'green':/Pending/.test(text)?'warn':'';return `<span class="v9-chip ${kind}" title="Verification status">${/^Verified/.test(text)?'✓ ':''}${B.esc(text)}</span>`}
function activePlan(){let sub=subscription();return sub.planId==='FREE'?{id:'FREE',name:'Free',price:0,jobs:0,seats:1,talent:0,boost:0,insights:false,ai:false,live:true}:B.allPlans().find(p=>p.id===sub.planId)||B.allPlans().find(p=>p.name===sub.planName)||null}
function features(p){return [{name:'Active Job Slots',value:p.jobs??0,unit:'slots'},{name:'Team Seats',value:p.seats??1,unit:'seats'},{name:'Candidate Profile Views',value:p.talent??0,unit:'views'},{name:'Boost Credits',value:p.boost??0,unit:'credits'},{name:'Premium Insights',value:p.insights?'Included':'Not included',unit:''},{name:'AI Hiring Tools',value:p.ai?'Included':'Not included',unit:''}]}
function usageTable(){let p=activePlan()||activePlan();let u=subscription().usage||{};return `<div class="v9-grid">${features(p).map(f=>`<article class="v9-plan"><span class="v9-hint">${B.esc(f.name)}</span><div style="font-size:21px;font-weight:900">${B.esc(f.value)} ${B.esc(f.unit)}</div>${['Active Job Slots','Candidate Profile Views','Boost Credits'].includes(f.name)?`<div class="v9-hint">Used ${f.name==='Active Job Slots'?u.jobs||0:f.name==='Candidate Profile Views'?u.talent||0:u.boost||0} / ${B.esc(f.value)}</div>`:''}</article>`).join('')}</div>`}
function paymentLabel(mode){return {monthly:'Monthly billing',annual:'Annual · paid in full',installments:'Annual agreement · monthly installments (conditional)',prepaid:'Multi-month prepaid',free:'Free forever'}[mode]||mode}
function serviceCard(s,action=''){return `<article class="v9-plan"><div class="v9-row"><span class="v9-chip">${B.esc(s.category)}</span><span class="v9-chip ${s.status==='Available'?'green':'warn'}">${B.esc(s.status)}</span></div><h3>${B.esc(s.name)}</h3><p>${B.esc(s.description)}</p><div class="v9-price" style="font-size:18px">${B.money(s.price)} <small>/${B.esc(s.billing)}</small></div>${action}</article>`}
Object.assign(B,{SUBKEY,SERVKEY,EVENTKEY,BADGEKEY,subscription,setSubscription,catalog,setCatalog,record,badge,verifiedMark,activePlan,features,usageTable,paymentLabel,serviceCard,stations});
})();
