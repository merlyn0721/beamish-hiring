(() => {
  const escape = value => safe(value);
  const argument = value => escape(JSON.stringify(String(value)));
  const action = (label, command, tone = '') => button(label, command, tone);
  const section = (heading, content, className = '') =>
    `<section class="candidate-glass ${className}"><h2>${heading}</h2>${content}</section>`;
  const companyImage = (company, className) => `<img class="${className}" src="${pic(company.img)}" alt="">`;

  function jobTabs(current) {
    const destinations = [
      ['Search Jobs', "goto('Jobs','Discover Jobs')"],
      ['Saved Jobs', "goto('Jobs','Saved Jobs')"],
      ['Career Match', "goto('Career Match','My Match')"],
      ['Job Alerts', 'CandidateFlows.alerts()']
    ];
    return `<nav class="candidate-flow-tabs" aria-label="Job search sections">${destinations.map(([label, command]) =>
      `<button type="button" ${label === current ? 'aria-current="page"' : ''} onclick="${command}">${label}</button>`
    ).join('')}</nav>`;
  }

  function eventPanel() {
    return section('Upcoming Event', '<p>Explore career talks and workshops from the Beamish community.</p>' +
      action('Browse events', "goto('Community','Events')", 'yellow'), 'candidate-event-banner');
  }

  function alertPanel() {
    return section('Job Alert', '<p>Manage notifications for new matches and hiring updates.</p>' + action('Manage job alerts', 'CandidateFlows.alerts()', 'blue'));
  }

  function alerts() {
    goto('Settings', 'Notifications');
  }

  function listingHeader(job) {
    return `<div class="candidate-glass candidate-listing-header"><div><h2>${escape(job.role)}</h2><strong>${escape(job.co)}</strong><p>${escape(job.place)} · ${escape(job.pay)} · ${escape(job.mode)}</p></div>${action(S.savedJobs.includes(job.id) ? 'Remove saved job' : 'Save job', `saveJob(${job.id});jobDetail(${job.id})`)}</div>`;
  }

  function showJob(id) {
    const job = DATA.jobs.find(item => item.id === id);
    if (!job) return;
    S.job = id;
    const description = job.description || job.desc || `Explore this ${job.mode.toLowerCase()} opportunity at ${job.co}. Review the role and confirm the full requirements and benefits with the employer.`;
    const companies = DATA.companies.filter(company => company.name !== job.co).slice(0, 3);
    modal('Job Details', `<div class="candidate-flow-detail">${listingHeader(job)}<div class="candidate-flow-split">
      <div>${section('Job description', `<p>${escape(description)}</p><h3>Role details</h3><p>${escape(job.type)} · ${escape(job.mode)} · ${job.match}% illustrative match</p>${job.station ? `<p>Nearest transit: ${escape(job.station)} · ${escape(job.line)}</p>` : ''}<h3>Application preparation</h3><p>Review your CV and add any relevant experience in your cover letter.</p>${action('Apply now', `CandidateFlows.apply(${job.id})`, 'blue')}`)}</div>
      <aside>${section('Suggested companies', companies.map(company =>
        `<div class="candidate-follow-row"><strong>${escape(company.name)}</strong>${action('View profile', `companyDetail(${argument(company.name)})`)}</div>`
      ).join(''))}${section('Suggested groups', action('Explore groups', "closeModal();goto('Community','Groups')"))}${eventPanel()}</aside>
      </div></div>`);
  }

  function apply(id) {
    const job = DATA.jobs.find(item => item.id === id);
    if (!job) return;
    modal('Apply for Job', `<div class="candidate-flow-detail">${listingHeader(job)}
      <form class="candidate-flow-split candidate-application-form" onsubmit="event.preventDefault();CandidateFlows.submit(${job.id},this)">
        <div>
          ${section('CV', `<label for="candidateCv">Choose a CV</label><select id="candidateCv" name="cv" required onchange="CandidateFlows.review(this.form)"><option value="">Select a CV</option>${V5.resume.name ? `<option selected>${escape(V5.resume.name)}</option>` : ''}</select><p>${action('Manage CV', "closeModal();goto('Profile','Resume / CV')")}</p>`)}
          ${section('Cover letter', '<label for="candidateCover">Cover letter (optional)</label><textarea name="cover" id="candidateCover" maxlength="500" rows="5" oninput="CandidateFlows.review(this.form)"></textarea><output data-cover-count>0 / 500</output>')}
          ${section('Screening questions', '<label for="candidateRelocation">Can you work from the listed location?</label><select name="location" id="candidateRelocation" required><option value="">Choose an answer</option><option>Yes</option><option>Open to relocating</option><option>No</option></select><label for="candidateStart">When can you start?</label><select name="start" id="candidateStart" required><option value="">Choose an answer</option><option>Immediately</option><option>Within two weeks</option><option>Within one month</option><option>To be discussed</option></select>')}
        </div>
        ${section('Review', `<strong>${escape(S.profile.name)}</strong><p>${escape(S.profile.headline)}<br>${escape(V5.account.email)}<br>${escape(S.profile.location)}</p><h3>Application</h3><p data-review-cv>${escape(V5.resume.name || 'No CV selected')}</p><p data-review-cover>No cover letter added</p><button class="v20-button candidate-yellow" type="submit">Submit application</button>`, 'candidate-application-review')}
      </form></div>`);
  }

  function review(form) {
    form.querySelector('[data-review-cv]').textContent = form.elements.cv.value || 'No CV selected';
    const length = form.elements.cover.value.length;
    form.querySelector('[data-cover-count]').textContent = length + ' / 500';
    form.querySelector('[data-review-cover]').textContent = length ? 'Cover letter (' + length + ' characters)' : 'No cover letter added';
  }

  function submit(id, form) {
    const data = Object.fromEntries(new FormData(form));
    applyJob(id, data);
  }

  function companyCards(query = '') {
    const search = query.trim().toLowerCase();
    return DATA.companies.filter(company =>
      (S.sub !== 'Following' || S.following.includes(company.name)) &&
      [company.name, company.sector].join(' ').toLowerCase().includes(search)
    ).map(company => `<article class="candidate-glass candidate-company-card">${companyImage(company, 'candidate-company-cover')}
      <div><h2>${escape(company.name)}</h2><p>${escape(company.sector)}</p><p>${company.jobs} listed openings</p><div class="utilityRow">
      ${action(S.following.includes(company.name) ? 'Following' : 'Follow', `CandidateFlows.follow(${argument(company.name)})`, 'blue')}
      ${action('View profile', `companyDetail(${argument(company.name)})`)}</div></div></article>`
    ).join('') || '<p>No companies found.</p>';
  }

  let companyQuery = '';
  function findCompany(value) {
    companyQuery = value;
    document.getElementById('candidateCompanyResults').innerHTML = companyCards(value);
  }

  function follow(name, reopen = false) {
    followCompany(name);
    if (reopen) showCompany(name);
  }

  function companiesPage() {
    return title('Companies', '') + strip(NAV.Companies, S.sub, 'subTo', true) +
      `<div class="candidate-glass candidate-job-search"><form class="v20-jobs-search" onsubmit="event.preventDefault();CandidateFlows.findCompany(this.elements.keyword.value)">
      <input type="search" name="keyword" aria-label="Search companies" placeholder="Search company name or industry" value="${escape(companyQuery)}" oninput="CandidateFlows.findCompany(this.value)"><button type="submit" class="v20-button">Search</button></form></div>
      <div class="candidate-flow-cards" id="candidateCompanyResults">${companyCards(companyQuery)}</div>`;
  }

  function showCompany(name) {
    const company = DATA.companies.find(item => item.name === name);
    if (!company) return;
    const openJobs = DATA.jobs.filter(job => job.co === name);
    modal('Company Details', `<div class="candidate-flow-detail">
      ${companyImage(company, 'candidate-company-hero')}
      <div class="candidate-glass candidate-listing-header"><div><h2>${escape(company.name)}</h2><p>${escape(company.sector)} · ${company.jobs} listed openings</p></div>${action(S.following.includes(name) ? 'Following' : 'Follow', `CandidateFlows.follow(${argument(name)},true)`, 'blue')}</div>
      <div class="candidate-flow-split"><div>${section('About the company', `<p>${escape(company.name)} is listed in ${escape(company.sector)}. Browse the available demo roles to learn more about the team and opportunities.</p>`)}
      ${section('Workplace', companyImage(company, 'candidate-company-cover') + '<p>Confirm workplace arrangements and benefits in the individual job listing.</p>')}
      ${section('Open jobs in this demo', openJobs.map(job => `<div class="candidate-follow-row"><strong>${escape(job.role)}</strong>${action('View job', `jobDetail(${job.id})`, 'yellow')}</div>`).join('') || '<p>No jobs available to view in this demo.</p>')}</div>
      <aside>${section('Explore companies', action('Discover companies', "closeModal();goto('Companies','Discover Companies')"))}${eventPanel()}</aside></div></div>`);
  }

  function matchPage(original) {
    if (S.sub !== 'My Match') return original();
    const jobs = [...DATA.jobs].sort((a, b) => b.match - a.match).slice(0, 4);
    return title('Career Match', '') + jobTabs('Career Match') +
      `<div class="candidate-flow-cards">
        ${section('Skills match', `<span class="candidate-match-score">${jobs[0]?.match ?? 0}%</span><p>Top illustrative role match</p><p>${escape(S.profile.skills)}</p>`)}
        ${section('Skill development', '<p>Compare job requirements with the skills on your profile.</p>' + action('Explore Career IRL', "goto('Community','Home')"))}
        ${section('Preferences', `<p>${escape(V5.workPrefs['Preferred Location'])} · ${escape(V5.workPrefs['Work Style'])}</p>${action('Edit preferences', "subTo('Match Preferences')")}`)}
        ${section('Match insight', jobs[0] ? `<p>${escape(jobs[0].role)} is your strongest illustrative match.</p>` : '<p>New matches appear when roles are available.</p>', 'candidate-match-insight')}
      </div><h2 class="candidate-flow-subheading">Recommended Jobs for You</h2>
      <div class="candidate-flow-cards">${jobs.map(job => section(escape(job.role), `<p>${escape(job.co)}<br>${escape(job.pay)}<br>${escape(job.place)}</p><p class="candidate-result-match">${job.match}% match</p>${action('Apply now', `CandidateFlows.apply(${job.id})`, 'yellow')}`)).join('')}</div>${eventPanel()}`;
  }

  window.CandidateFlows = { jobTabs, eventPanel, alertPanel, alerts, apply, review, submit, follow, findCompany };
  document.addEventListener('DOMContentLoaded', () => {
    const originalCareer = window.career;
    window.career = () => matchPage(originalCareer);
    window.jobDetail = showJob;
    window.companyDetail = showCompany;
    window.companies = companiesPage;
    if (['Jobs', 'Career Match', 'Companies'].includes(S.page)) renderContent();
  });
})();
