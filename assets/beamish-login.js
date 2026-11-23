(() => {
  const candidateDescription = 'Discover new opportunities, grow your career, and connect with a community that supports you.';
  const candidateBenefits = [...document.querySelectorAll('#roleBenefits li')].map(item => [
    item.querySelector('strong').textContent,
    item.querySelector('small').textContent
  ]);
  const employerBenefits = [
    ['Find the right talent', 'Reach candidates ready for their next opportunity.'],
    ['Build your employer brand', 'Show candidates what makes your team unique.'],
    ['Manage your hiring', 'Keep track of your jobs and applicants.']
  ];
  const message = document.getElementById('loginError');
  const password = document.getElementById('loginPassword');
  const passwordToggle = document.querySelector('.password-toggle');

  function renderRole(accountType) {
    selectRole(accountType);
    const isEmployer = accountType === 'employer';
    const accountName = ROLES[accountType].name;
    document.getElementById('roleEyebrow').textContent = accountName + ' sign in';
    document.getElementById('roleDescription').textContent = 'Access your Beamish ' + accountType + ' account.';
    document.getElementById('heroDescription').textContent = isEmployer
      ? 'Find the right talent, share your company story, and manage your hiring on Beamish.'
      : candidateDescription;
    const benefits = isEmployer ? employerBenefits : candidateBenefits;
    document.querySelectorAll('#roleBenefits li').forEach((item, index) => {
      item.querySelector('strong').textContent = benefits[index][0];
      item.querySelector('small').textContent = benefits[index][1];
    });
    const signup = document.getElementById('roleSignup');
    signup.href = 'signup.html?role=' + accountType;
    signup.textContent = (isEmployer ? 'Create an ' : 'Create a ') + accountName + ' Account';
    message.textContent = '';
  }

  document.querySelectorAll('.roleTile').forEach(button => {
    button.addEventListener('click', () => renderRole(button.dataset.role));
  });
  passwordToggle.addEventListener('click', () => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    passwordToggle.setAttribute('aria-pressed', String(visible));
  });
  document.querySelector('.forgot-password').addEventListener('click', showForgot);
  document.querySelector('.google-sign-in').addEventListener('click', () => {
    message.textContent = 'Google sign-in requires a connected authentication service.';
  });
  document.getElementById('loginForm').addEventListener('submit', submitLogin);
  renderRole(role);
})();
