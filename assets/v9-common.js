/* Beamish v9 shared demo registry. Local browser storage only; not a real database. */
(function(){
const KEY='beamish_admin_v2_shared_20261028';
const PAYKEY='beamish_payment_config_v9';
const BIZKEY='beamish_business_verification_v9';
const ELIGKEY='beamish_role_exceptions_v9';
const defaults=[
 {id:'PL-01',name:'Starter',price:399,cycle:'Monthly',jobs:3,seats:1,talent:30,boost:0,insights:false,ai:false,live:true,revision:1},
 {id:'PL-02',name:'Growth',price:899,cycle:'Monthly',jobs:10,seats:3,talent:150,boost:2,insights:true,ai:true,live:true,revision:2},
 {id:'PL-03',name:'Scale',price:1599,cycle:'Monthly',jobs:30,seats:10,talent:800,boost:8,insights:true,ai:true,live:true,revision:1}
];
const methodsDefaults={monthly:true,annual:true,annualInstallments:true,prepaid:true,annualDiscount:15,prepaidMonths:6,prepaidDiscount:5,installmentMin:'Growth',notes:'Installments are subject to approval and provider availability.'};
function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch(e){return fallback}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){return false}}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function plans(){return read(KEY,{}).plans?.filter(p=>p.live)??defaults}
function allPlans(){return read(KEY,{}).plans??defaults}
function payments(){return {...methodsDefaults,...read(PAYKEY,{})}}
function business(){return read(BIZKEY,null)}
function money(v){return 'RM '+Number(v||0).toLocaleString('en-MY',{maximumFractionDigits:2})}
function priceFor(plan,mode){const p=payments();const base=+plan.price;
 if(mode==='annual')return Math.round(base*12*(1-p.annualDiscount/100));
 if(mode==='installments')return Math.round(base*12/12);
 if(mode==='prepaid')return Math.round(base*p.prepaidMonths*(1-p.prepaidDiscount/100));
 return base;
}
function modes(){const p=payments();return [{id:'monthly',label:'Monthly',desc:'Month-to-month · billed every month',enabled:p.monthly},{id:'annual',label:'Annual / Pay in Full',desc:`12 months prepaid · ${p.annualDiscount}% off`,enabled:p.annual},{id:'installments',label:'Annual / Pay Monthly',desc:'12-month commitment · 12 installments · subject to approval',enabled:p.annualInstallments},{id:'prepaid',label:`${p.prepaidMonths}-Month Prepaid`,desc:`Pay upfront for ${p.prepaidMonths} months · ${p.prepaidDiscount}% off`,enabled:p.prepaid}].filter(m=>m.enabled)}
function planCard(p,mode,callback){const price=priceFor(p,mode), unit=mode==='annual'?'/ year':mode==='prepaid'?`/ ${payments().prepaidMonths} months`:mode==='installments'?'/ month (12 payments)':'/ month';return `<article class="v9-plan ${p.name==='Growth'?'popular':''}"><div class="v9-row"><span class="v9-chip">${esc(p.name)}</span>${p.name==='Growth'?'<span class="v9-chip warn">Popular</span>':''}</div><div class="v9-price">${money(price)} <small>${unit}</small></div><div class="v9-meta">${p.jobs} live job slots · ${p.seats} team seats<br>${p.talent} candidate profile views · ${p.boost} boost credits<br>${p.insights?'✓':'—'} Premium insights · ${p.ai?'✓':'—'} AI hiring tools</div><button class="v9-btn" onclick="${callback}('${esc(p.id)}')">Select ${esc(p.name)} →</button></article>`}
function dialog(title,html,opt={}){close();const wrap=document.createElement('div');wrap.className='v9-overlay';wrap.id='beamishV9Dialog';wrap.innerHTML=`<section class="v9-dialog ${opt.wide?'v9-dialog-wide':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><div><div class="v9-kicker">BEAMISH · DEMO PREVIEW</div><h2>${esc(title)}</h2></div><button class="v9-x" aria-label="Close" onclick="BeamishV9.close()">×</button></header>${html}</section>`;wrap.addEventListener('click',e=>{if(e.target===wrap)close()});document.body.appendChild(wrap)}
function close(){document.getElementById('beamishV9Dialog')?.remove()}
function exceptions(){return read(ELIGKEY,[])}
window.BeamishV9={read,save,esc,plans,allPlans,payments,business,money,priceFor,modes,planCard,dialog,close,exceptions,KEY,PAYKEY,BIZKEY,ELIGKEY};
})();
