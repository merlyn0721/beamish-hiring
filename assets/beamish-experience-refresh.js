(() => {
  const skip = document.querySelector('.bm-skip');

  if (skip) {
    skip.addEventListener('click', event => {
      const target = document.getElementById(skip.hash.slice(1));
      if (!target) return;

      // Public and portal routes use the URL fragment as application state.
      event.preventDefault();
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start' });
    });
  }

  if (!document.body.classList.contains('bm-public')) return;

  function updateCurrentPage() {
    const current = location.hash || '#home';
    document.querySelectorAll('.ref-nav a').forEach(link => {
      if (link.hash === current) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  updateCurrentPage();
  window.addEventListener('hashchange', updateCurrentPage);
})();
