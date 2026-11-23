(() => {
  const escape = value => safe(value);
  const action = (label, command) => `<button type="button" class="candidate-dashboard-link" onclick="${command}">${label} →</button>`;
  const panel = (name, content, extra = '', link = '') => `<section class="candidate-glass ${extra}"><div class="candidate-panel-heading"><h2>${name}</h2>${link}</div>${content}</section>`;
  const image = (key, className = '') => `<img class="${className}" src="${pic(key)}" alt="">`;

  function jobTile(job, featured = false) {
    const company = escape(job.co);
    const initials = escape(job.co.split(/\s+/).slice(0, 2).map(word => word[0]).join(''));
    return `<article class="candidate-compact-job"><div class="candidate-job-identity"><span class="candidate-company-mark" aria-hidden="true">${initials}</span><div><strong>${escape(job.role)}</strong><small>${company}</small></div></div><span>${escape(job.place)}</span><span>${escape(job.pay)}</span>${action(featured ? 'View details' : 'View job', `jobDetail(${job.id})`)}</article>`;
  }

  function dashboard() {
    const info = S.profile;
    const name = info.name?.trim().split(/\s+/)[0] || 'there';
    const completion = profileCompletion();
    const jobs = [...DATA.jobs].sort((a, b) => b.match - a.match);
    const featured = jobs[0];
    const interviews = DATA.apps.filter(app => app.stage === 'Interview');
    const interview = interviews[0];
    const following = DATA.companies.filter(company => S.following.includes(company.name));
    const posts = S.posts.slice(0, 2);
    const portrait = V5.profileExtra.avatar || pic('avatar');
    const metrics = [
      [jobs.length, 'Matches', "goto('Jobs','Discover Jobs')"],
      [DATA.apps.length, 'Applications', "goto('Applications','My Applications')"],
      [interviews.length, 'Interviews', "goto('Applications','Interviews')"],
      [82, 'Sample profile views', "goto('Profile','Public Profile')"]
    ];

    const profile = `<aside class="candidate-glass candidate-profile-panel">
      <div class="candidate-portrait"><img src="${escape(portrait)}" alt=""><div><strong>${escape(info.name)}</strong><span>${escape(info.headline)}</span></div></div>
      <div class="candidate-profile-details">
        <p>⌖ ${escape(info.location)}</p>
        <div class="candidate-panel-heading"><strong>Profile completion</strong><strong>${completion}%</strong></div>
        <progress value="${completion}" max="100" aria-label="Profile completion"></progress>
        <h2>Skills</h2>
        <div class="candidate-skills">${String(info.skills || '').split(',').filter(skill => skill.trim()).map(skill => `<span>${escape(skill.trim())}</span>`).join('')}</div>
        <h2>Availability</h2><p>${escape(V5.profileExtra.availability || 'Open to opportunities')}</p>
        <div class="candidate-profile-actions">${button('Edit Profile', "goto('Profile','Profile Studio')", 'blue')}${button('View Public Profile', "goto('Profile','Public Profile')")}</div>
      </div>
    </aside>`;

    const live = panel('Live View', `<div class="candidate-live-grid">
      <div class="candidate-live-graph" aria-hidden="true"></div>
      <div><b>82</b><span>Sample profile views</span></div><div><b>${following.length}</b><span>Followed companies</span></div><div><b>${S.savedJobs.length}</b><span>Saved jobs</span></div>
    </div>`, 'candidate-live');
    const attention = panel('Your next steps', `<div class="candidate-next-steps">
      ${interview ? action('Review your interview', "goto('Applications','Interviews')") : action('Review applications', "goto('Applications','My Applications')")}
      ${action('Complete your profile', "goto('Profile','Profile Studio')")}
      ${action(`Explore ${jobs.length} job matches`, "goto('Jobs','Discover Jobs')")}
    </div>`, 'candidate-attention');

    return `<div class="candidate-dashboard">
      <header class="candidate-welcome"><div><h1>Welcome Back, <em>${escape(name)}!</em></h1><p>Discover opportunities, grow your profile and get hired.</p></div>
      <div class="candidate-metrics">${metrics.map(([value, label, command]) => `<button type="button" onclick="${command}"><b>${value}</b><span>${label}</span></button>`).join('')}</div></header>
      <div class="candidate-dashboard-grid">
        ${profile}
        <div class="candidate-dashboard-center">
          ${live}
          <div class="candidate-dashboard-trio">
            ${panel('Picked for You', featured ? image(featured.img, 'candidate-feature-art') + jobTile(featured, true) : '<p>No jobs available.</p>', 'candidate-featured', action('View all', "goto('Jobs','Discover Jobs')"))}
            ${panel('My Applications', DATA.apps.slice(0, 3).map(app => `<article class="candidate-application"><strong>${escape(app.role)}</strong><small>${escape(app.co)}</small>${appStageHtml(app)}</article>`).join('') || '<p>No applications yet.</p>', '', action('View all', "goto('Applications','My Applications')"))}
            ${panel('Your Career Match', jobs.slice(0, 3).map(job => `<div class="candidate-match"><div><strong>${escape(job.role)}</strong><b>${job.match}%</b></div><progress value="${job.match}" max="100" aria-label="${escape(job.role)} match"></progress></div>`).join(''), '', action('View all', "goto('Career Match','My Match')"))}
          </div>
          ${panel('Recommended Jobs for You', `<div class="candidate-recommended">${jobs.slice(0, 4).map(job => jobTile(job)).join('')}</div>`, 'candidate-recommended-panel', action('View all', "goto('Jobs','Discover Jobs')"))}
          ${panel('Community', `<div class="candidate-community-preview">${posts.map(post => `<article>${image(post.img)}<div><strong>${escape(post.title)}</strong><small>${escape(post.name)}</small>${action('Read story', `viewPost(${post.id})`)}</div></article>`).join('')}</div>`, 'candidate-community-panel', action('View all', "goto('Community','Home')"))}
        </div>
        <div class="candidate-dashboard-right">
          ${attention}
          ${panel('Upcoming Interview', interview ? `<p class="candidate-interview-role"><strong>${escape(interview.co)}</strong><br>${escape(interview.role)}</p><p>29 Oct 2026 · 2:00 pm<br>Google Meet</p><div class="utilityRow">${button('View details', `applicationDetail(${q(interview.role)})`, 'small')}${button('Add to calendar', 'downloadCalendar()', 'small')}</div>` : '<p>No demo interview is scheduled.</p>', 'candidate-interview')}
          ${panel('Companies Watchlist', following.map(company => `<div class="candidate-watch"><strong>${escape(company.name)}</strong><span>${company.jobs} jobs</span></div>`).join('') || '<p>Follow companies to see them here.</p>', 'candidate-watchlist', action('View all', "goto('Companies','Following')"))}
          ${panel('Upcoming Events', `<div class="candidate-event-body">${image('office2', 'candidate-event-art')}<p><strong>Marketing Career Talk</strong><br>Webinar · Online</p><time datetime="2026-11-07"><b>7</b>Nov</time></div>`, 'candidate-event-panel', action('View events', "goto('Community','Events')"))}
        </div>
      </div>
      <footer class="candidate-dashboard-footer"><span>© 2026 Beamish. All rights reserved.</span><span>Made for Malaysia’s next generation</span></footer>
    </div>`;
  }

  function init() {
    window.dashboard = dashboard;
    if (S.page === 'Home') renderContent();
  }

  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
