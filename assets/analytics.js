/* analytics.js — GA4 deep event tracking for ARCCP
   gtag: G-PL697EYZ5S
   Events: scroll_depth, nav_click, cta_click, call_click,
           region_click, map_interaction, form_start, form_submit,
           section_view
*/
(function () {
  'use strict';

  function gaSend(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  /* ── 1. SCROLL DEPTH — 25 / 50 / 75 / 90 / 100% ── */
  var scrollMilestones = [25, 50, 75, 90, 100];
  var scrollFired = {};
  function onScroll() {
    var scrolled = window.scrollY + window.innerHeight;
    var total = document.documentElement.scrollHeight;
    var pct = Math.round((scrolled / total) * 100);
    scrollMilestones.forEach(function (m) {
      if (pct >= m && !scrollFired[m]) {
        scrollFired[m] = true;
        gaSend('scroll_depth', { depth_percent: m, page_path: window.location.pathname });
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 2. SECTION VIEW — IntersectionObserver on named sections ── */
  var sections = ['products', 'regions', 'map', 'clients', 'quote'];
  var sectionFired = {};
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (entry.isIntersecting && !sectionFired[id]) {
          sectionFired[id] = true;
          gaSend('section_view', { section_id: id });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  /* ── 3. CLICK DELEGATION — data-ga-event / data-ga-label ── */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-ga-event]');
    if (!el) return;
    var eventName = el.getAttribute('data-ga-event');
    var label     = el.getAttribute('data-ga-label') || el.textContent.trim().slice(0, 60);
    var href      = el.getAttribute('href') || '';
    gaSend(eventName, {
      event_label:  label,
      element_text: el.textContent.trim().slice(0, 80),
      link_url:     href
    });
  });

  /* ── 4. REGION CLICKS — individually named ── */
  // Already covered by data-ga-event="region_click" on each pill
  // Extra: fire with full state name as parameter
  document.querySelectorAll('.region-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      gaSend('region_selected', {
        region_name: pill.textContent.trim(),
        region_url:  pill.getAttribute('href')
      });
    });
  });

  /* ── 5. MAP INTERACTIONS ── */
  var mapEl = document.getElementById('leaflet-map');
  if (mapEl) {
    var mapInteracted = false;
    function fireMapEvent(action) {
      gaSend('map_interaction', { map_action: action });
    }
    mapEl.addEventListener('click',     function () { fireMapEvent('click'); });
    mapEl.addEventListener('touchstart', function () { fireMapEvent('touch'); }, { passive: true });
    // Detect zoom via wheel
    mapEl.addEventListener('wheel', function () {
      if (!mapInteracted) { mapInteracted = true; fireMapEvent('zoom'); }
    }, { passive: true });
    // Leaflet marker popup open — fired via custom event from map.js if supported
    mapEl.addEventListener('marker_popup_open', function (e) {
      gaSend('map_marker_click', { marker_label: e.detail && e.detail.label });
    });
  }

  /* ── 6. FORM START (first keystroke in quote form) ── */
  var quoteForm = document.getElementById('quoteForm');
  var formStartFired = false;
  if (quoteForm) {
    quoteForm.addEventListener('input', function () {
      if (!formStartFired) {
        formStartFired = true;
        gaSend('form_start', { form_id: 'quote_form' });
      }
    });
    quoteForm.addEventListener('submit', function (e) {
      gaSend('form_submit', {
        form_id: 'quote_form',
        pipe_class: (quoteForm.pipe_class && quoteForm.pipe_class.value) || 'unknown',
        project_state: (quoteForm.state && quoteForm.state.value) || 'unknown'
      });
    });
  }

  /* ── 7. CALL CLICKS — belt + braces (href=tel: catches all) ── */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      gaSend('call_click', {
        call_number: a.getAttribute('href').replace('tel:', ''),
        source_id:   a.id || a.className.split(' ')[0] || 'unknown'
      });
    });
  });

  /* ── 8. LANGUAGE SWITCH ── */
  document.querySelectorAll('.lang-switch-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      gaSend('language_switch', { language: btn.getAttribute('data-lang') });
    });
  });

})();
