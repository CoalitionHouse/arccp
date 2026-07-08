/* nav.js — mobile nav & lang dropdown */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '64px';
      nav.style.right = '0';
      nav.style.background = '#fff';
      nav.style.padding = '16px 24px';
      nav.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
      nav.style.borderTop = '1px solid #dde2ec';
      nav.style.zIndex = '800';
    });
  }
  var langToggle = document.getElementById('langToggle');
  var langMenu = document.getElementById('langMenu');
  if (langToggle && langMenu) {
    langToggle.addEventListener('click', function (e) { e.stopPropagation(); langMenu.classList.toggle('open'); });
    document.addEventListener('click', function () { langMenu.classList.remove('open'); });
  }
});
