/* i18n.js — language switcher */
(function () {
  var i18nData = null;
  var currentLang = localStorage.getItem('arccp_lang') || 'en';

  function applyLang(lang, data) {
    var t = data[lang] || data['en'];
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });
    var htmlEl = document.documentElement;
    if (t.html_lang) htmlEl.lang = t.html_lang;
    if (t.font_class) document.body.classList.add(t.font_class);
    else document.body.classList.remove('lang-indic');
    var label = document.getElementById('langLabel');
    if (label && t.lang_name) label.textContent = t.lang_name;
    document.querySelectorAll('.lang-switch-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  function loadAndApply(lang) {
    currentLang = lang;
    localStorage.setItem('arccp_lang', lang);
    var base = document.body.getAttribute('data-i18n-base') || 'data/i18n.json';
    if (i18nData) { applyLang(lang, i18nData); return; }
    fetch(base)
      .then(function (r) { return r.json(); })
      .then(function (data) { i18nData = data; applyLang(lang, data); })
      .catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang-switch-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { loadAndApply(btn.getAttribute('data-lang')); });
    });
    loadAndApply(currentLang);
  });
})();
