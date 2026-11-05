/* Beamish v24 candidate: shared community with Employer; media composer and story details. */
(function(){'use strict';if(!location.pathname.includes('/candidate/'))return;const B=window.Beamish24;if(!B)return;
function init(){const original=window.renderContent;if(typeof original!=='function')return;
 // Compose opens the same media-friendly editor in Candidate and Employer portals.
 window.compose=function(type='Post'){B.createPost('candidate',type)};
 window.renderContent=function(){const result=original.apply(this,arguments);if(typeof S!=='undefined'&&S.page==='Community'&&S.sub==='Home'){const root=document.getElementById('view');if(root)root.innerHTML=B.socialPage('candidate')}return result};
 // Keep native additional Community sections (Groups, Events, Career Clips, Me) intact.
 renderContent();}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
