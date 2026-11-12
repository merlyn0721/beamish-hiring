/* One alignment grid and cohesive, viewport-sized content groups. */
(()=>{'use strict';
function group(parent,items,kind){const nodes=items.map(s=>typeof s==='string'?parent.querySelector(':scope>'+s):s).filter(Boolean);if(!nodes.length)return;const wrapper=document.createElement('div');wrapper.className='bm-screen '+kind;nodes[0].before(wrapper);nodes.forEach(n=>wrapper.appendChild(n));return wrapper}
function layout(){const root=document.getElementById('publicContent');if(!root)return;const route=location.hash.slice(1)||'home';if(root.dataset.layoutRoute===route&&root.querySelector('.bm-screen'))return;root.dataset.layoutRoute=route;
const home=root.querySelector('.ref-home');if(home){group(home,['.ref-vibe','.ref-search-area','.ref-trending'],'bm-discover-view');group(home,['.ref-companies','.ref-dual'],'bm-company-view');group(home,['.ref-topics'],'bm-stories-view')}
const career=root.querySelector('.bs-career');if(career){group(career,['.bs-career-hero','.bs-topic-bar','.bs-featured'],'bm-intro-view');group(career,['.bs-latest','.bs-interviews','.bs-career-events'],'bm-editorial-view')}
const employer=root.querySelector('.bs-employers');if(employer){group(employer,['.ce-hero','.bf-steps'],'bm-intro-view');group(employer,['.bs-hiring-tools','.bs-talent','.bs-testimonial','.bs-trusted'],'bm-hiring-view')}
const companies=root.querySelector('.bf-companies');if(companies){group(companies,['.bf-company-hero','.bf-industries','.bf-company-search'],'bm-intro-view');group(companies,['.bf-company-count','.bf-company-grid'],'bm-directory-view')}
const jobs=root.querySelector('.rj-page');if(jobs){group(jobs,['.rj-landing-banner','.bs-job-features','.rj-banner'],'bm-intro-view');group(jobs,['.rj-layout'],'bm-jobs-view')}
const community=root.querySelector('.v17-community-public');if(community){group(community,['.v17-community-hero','.v17-community-metrics','.bs-community-features'],'bm-community-intro');group(community,['.bs-community-feed','.v17-demo-disclaimer'],'bm-community-feed')}
const company=root.querySelector('.be-company-page');if(company){group(company,['.be-company-top','.be-overview'],'bm-company-intro');group(company,['.be-culture','.be-people-jobs'],'bm-company-culture');group(company,['.be-company-stories','.be-related','.be-company-note'],'bm-company-community')}
const why=root.querySelector(':scope>.bf-why'),cta=root.querySelector(':scope>.bf-cta,:scope>.bs-newsletter');if(why){const wrapper=group(root,[why,cta],'bm-values-view');if(employer){const plans=employer.querySelector(':scope>.bf-plans');if(plans)wrapper.prepend(plans)}}
measure();}
function measure(){const footer=document.querySelector('.ref-footer');if(footer)document.documentElement.style.setProperty('--bm-footer-height',footer.getBoundingClientRect().height+'px')}
function init(){const render=window.render;window.render=function(){render.apply(this,arguments);layout()};window.addEventListener('hashchange',()=>queueMicrotask(layout));window.addEventListener('resize',measure,{passive:true});if('ResizeObserver'in window){const footer=document.querySelector('.ref-footer');if(footer)new ResizeObserver(measure).observe(footer)}window.render();}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
