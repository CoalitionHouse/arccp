/* nav.js — mobile nav overlay & lang dropdown */
document.addEventListener('DOMContentLoaded', function () {

  /* ── HAMBURGER / MOBILE NAV ── */
  var toggle   = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('navMobile');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close menu when any link inside it is clicked */
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    /* Close menu on outside tap */
    document.addEventListener('click', function (e) {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !toggle.contains(e.target)) {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── LANG DROPDOWN ── */
  var langToggle = document.getElementById('langToggle');
  var langMenu   = document.getElementById('langMenu');
  if (langToggle && langMenu) {
    langToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      langMenu.classList.toggle('open');
    });
    document.addEventListener('click', function () {
      langMenu.classList.remove('open');
    });
  }

});
