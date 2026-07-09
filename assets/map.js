/* map.js v2.3 — ARCCP Leaflet map */
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('leaflet-map');
  if (!el) return;

  /* Force minimum height so Leaflet has a real container to render into */
  if (!el.style.height || el.offsetHeight < 100) {
    el.style.height = '480px';
  }

  var dataPath = el.getAttribute('data-path') || 'data/projects.json';
  fetch(dataPath)
    .then(function (r) { return r.json(); })
    .then(function (d) { initMap(d); })
    .catch(function () { initMap({ factories: [], corridors: [], projects: [], delivery_cities: [] }); });

  function fmtLen(m) {
    return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m';
  }

  function initMap(d) {
    var map = L.map('leaflet-map', { scrollWheelZoom: false });
    /* Force invalidate before setView so tiles load correctly */
    map.invalidateSize();
    map.setView([17.5, 82.5], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd', maxZoom: 18
    }).addTo(map);

    /* ── Soft gradient halos: Velvadam, Vellanki, Peddabammidi only ── */
    var baseRadius = (d.supply_radius_km || 350) * 1000;
    (d.factories || []).forEach(function (f) {
      var isHalo = /Velvadam|Vellanki|Peddabammidi/.test(f.name);
      if (isHalo) {
        var boost = /Velvadam/.test(f.name) ? 1.25 : 1.0;
        [{m:0.45,o:0.10},{m:0.80,o:0.055},{m:1.20,o:0.028}].forEach(function (ring) {
          L.circle([f.lat, f.lon], {
            radius: baseRadius * ring.m * boost,
            color: 'transparent', fillColor: '#e07b00',
            fillOpacity: ring.o, weight: 0, interactive: false
          }).addTo(map);
        });
      }
      L.circleMarker([f.lat, f.lon], {
        radius: 5, color: '#fff', fillColor: '#1a4f8a', fillOpacity: 1, weight: 2
      }).addTo(map).bindPopup('<b>&#127981; ' + f.name + '</b><br><em>' + f.district + ' District &mdash; Factory</em>');
    });

    /* ── Corridor lines ── */
    (d.corridors || []).forEach(function (c) {
      var ll = c.waypoints.map(function (w) { return [w[0], w[1]]; });
      L.polyline(ll, { color: c.color || '#1a6ec7', weight: 10, opacity: 0.15, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      var line = L.polyline(ll, { color: c.color || '#1a6ec7', weight: 4, opacity: 0.92, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      line.bindPopup(
        '<b>' + c.label + '</b><br>' +
        '<span style="color:#444">' + c.client + '</span><br>' +
        '<span style="font-size:.88em;color:#666">' + c.work + '</span><br>' +
        '<span style="color:#e07b00;font-weight:600">' + c.cls + ' &middot; &oslash;' + c.dia_mm + 'mm &middot; ' + fmtLen(c.length_m) + ' &middot; ' + c.year + '</span>'
      );
      var mid = ll[Math.floor(ll.length / 2)];
      L.circleMarker(mid, { radius: 5, color: c.color || '#1a6ec7', fillColor: '#fff', fillOpacity: 1, weight: 2 })
        .addTo(map).bindPopup('<b>' + c.label + '</b><br><span style="color:#e07b00">' + fmtLen(c.length_m) + ' supplied</span>');
    });

    /* ── Point projects: small navy dots ── */
    (d.projects || []).forEach(function (p) {
      L.circleMarker([p.lat, p.lon], {
        radius: 5, color: '#fff', fillColor: '#1a4f8a', fillOpacity: 0.88, weight: 1.5
      }).addTo(map).bindPopup(
        '<b>' + p.client + '</b><br>' +
        '<span style="font-size:.88em">' + p.work + '</span><br>' +
        '<span style="color:#e07b00;font-weight:600">' + p.cls + ' &middot; &oslash;' + p.dia_mm + 'mm &middot; ' + fmtLen(p.length_m) + ' &middot; ' + p.year + '</span>'
      );
    });

    /* ── Delivery cities ── */
    (d.delivery_cities || []).forEach(function (c) {
      var icon = L.divIcon({
        className: '',
        html: '<div style="width:11px;height:11px;background:#0e9a6e;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
        iconSize: [11, 11], iconAnchor: [5, 5]
      });
      L.marker([c.lat, c.lon], { icon: icon }).addTo(map)
        .bindPopup('<b>&#128230; ' + c.name + '</b><br><em>' + c.state + '</em><br><span style="color:#0e9a6e;font-size:.88em">Delivery region</span>');
    });

    /* ── Legend ── */
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      var div = L.DomUtil.create('div');
      div.setAttribute('style',
        'background:rgba(255,255,255,0.97);' +
        'padding:10px 14px;' +
        'border-radius:8px;' +
        'font-family:-apple-system,sans-serif;' +
        'font-size:12px;' +
        'line-height:2;' +
        'box-shadow:0 2px 10px rgba(0,0,0,.22);' +
        'min-width:180px;' +
        'pointer-events:none;' +
        'z-index:1000'
      );
      function dot(bg, border) {
        var b = border ? 'border:2px solid ' + border + ';' : '';
        return '<span style="display:inline-block;width:10px;height:10px;background:' + bg + ';border-radius:50%;' + b + 'vertical-align:middle;margin-right:7px;box-sizing:border-box"></span>';
      }
      function line(bg) {
        return '<span style="display:inline-block;width:22px;height:4px;background:' + bg + ';border-radius:2px;vertical-align:middle;margin-right:7px"></span>';
      }
      div.innerHTML =
        '<div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#111">Map Legend</div>' +
        line('#1a6ec7') + '<span style="color:#111">NH corridor (pipe supply)</span><br>' +
        line('#e07b00') + '<span style="color:#111">Project stretch</span><br>' +
        dot('#1a4f8a', '#fff') + '<span style="color:#111">Supply location / Factory</span><br>' +
        dot('#0e9a6e', '#fff') + '<span style="color:#111">Delivery region</span><br>' +
        '<div style="font-size:10px;color:#888;margin-top:3px">Orange halo = ~350km supply radius</div>';
      return div;
    };
    legend.addTo(map);

    /* Force another invalidateSize after legend is added */
    setTimeout(function () { map.invalidateSize(); }, 200);

    map.on('click', function () { if (window.gtag) gtag('event', 'map_click', { event_category: 'map' }); });
    map.on('zoomend', function () { if (window.gtag) gtag('event', 'map_zoom', { event_category: 'map', event_label: 'z' + map.getZoom() }); });
  }
});
