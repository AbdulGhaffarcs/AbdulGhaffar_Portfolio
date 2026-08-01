// Abdul Ghaffar — portfolio interactions
// Kept deliberately small: scroll reveal, active nav state, mobile menu.

(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---- Active nav link on scroll ----
  var sections = document.querySelectorAll('section[id], header[id]');
  var navLinks = document.querySelectorAll('.nav-links a, .nav-panel a[href^="#"]');

  function setActive(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', match);
    });
  }

  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  // ---- Mobile nav ----
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('navPanel');

  function closePanel() {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closePanel);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 880) closePanel();
    });
  }
})();
