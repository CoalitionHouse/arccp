/* map.js v2 — ARCCP Leaflet map: corridor lines, gradient service radius, delivery cities */
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('leaflet-map');
  if (!el) return;
  var dataPath = el.getAttribute('data-path') || 'data/projects.json';

  fetch(dataPath)
    .then(function (r) { return r.json(); })
    .then(function (d) { initMap(d); })
    .catch(function () { initMap({ factories: [], corridors: [], projects: [], delivery_cities: [] }); });

  function fmtLen(m) {
    return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m';
  }

  function initMap(d) {
    var map = L.map('leaflet-map', { scrollWheelZoom: false }).setView([17.2, 82.0], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors \u00a9 <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd', maxZoom: 18
    }).addTo(map);

    /* ── Gradient service radius: 4 concentric rings per factory, fading out ── */
    var radiusRings = [
      { mult: 0.35, opacity: 0.13 },
      { mult: 0.55, opacity: 0.09 },
      { mult: 0.75, opacity: 0.055 },
      { mult: 1.00, opacity: 0.025 },
      { mult: 1.30, opacity: 0.010 }
    ];
    var baseRadius = (d.supply_radius_km || 350) * 1000;
    (d.factories || []).forEach(function (f) {
      radiusRings.forEach(function (ring) {
        L.circle([f.lat, f.lon], {
          radius: baseRadius * ring.mult,
          color: 'transparent',
          fillColor: '#e07b00',
          fillOpacity: ring.opacity,
          weight: 0,
          interactive: false
        }).addTo(map);
      });
      /* Small subtle factory dot */
      L.circleMarker([f.lat, f.lon], {
        radius: 5, color: '#fff', fillColor: '#1a4f8a',
        fillOpacity: 1, weight: 2
      }).addTo(map)
        .bindPopup('<strong>\uD83C\uDFED ' + f.name + '</strong><br><em>' + f.district + ' District \u2014 Manufacturing Unit</em>');
    });

    /* ── Corridor lines (road-stretch pipe supply) ── */
    (d.corridors || []).forEach(function (c) {
      var latlngs = c.waypoints.map(function (w) { return [w[0], w[1]]; });
      /* Glow layer */
      L.polyline(latlngs, {
        color: c.color || '#1a6ec7', weight: 9, opacity: 0.18, lineCap: 'round', lineJoin: 'round'
      }).addTo(map);
      /* Main line */
      var line = L.polyline(latlngs, {
        color: c.color || '#1a6ec7', weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round'
      }).addTo(map);
      line.bindPopup(
        '<strong>' + c.label + '</strong><br>' +
        '<span style="color:#444">' + c.client + '</span><br>' +
        '<span style="font-size:.88em;color:#666">' + c.work + '</span><br>' +
        '<span style="color:#e07b00;font-weight:600">' + c.cls + ' \u00b7 \u00f8' + c.dia_mm + 'mm \u00b7 ' + fmtLen(c.length_m) + ' supplied \u00b7 ' + c.year + '</span>'
      );
      /* Direction arrows using decorators if available, else midpoint marker */
      var mid = latlngs[Math.floor(latlngs.length / 2)];
      L.circleMarker(mid, {
        radius: 4, color: c.color || '#1a6ec7', fillColor: '#fff', fillOpacity: 1, weight: 2
      }).addTo(map).bindPopup(
        '<strong>' + c.label + '</strong><br><span style="color:#e07b00">' + fmtLen(c.length_m) + ' of pipe supplied</span>'
      );
    });

    /* ── Point projects (circle markers) ── */
    (d.projects || []).forEach(function (p) {
      var r = Math.max(6, Math.min(24, Math.sqrt(p.length_m) * 0.75));
      L.circleMarker([p.lat, p.lon], {
        radius: r, color: '#c06000', fillColor: '#f5a623', fillOpacity: 0.82, weight: 1.5
      }).addTo(map)
        .bindPopup(
          '<strong>' + p.client + '</strong><br>' +
          '<span style="font-size:.88em">' + p.work + '</span><br>' +
          '<span style="color:#e07b00;font-weight:600">' + p.cls + ' \u00b7 \u00f8' + p.dia_mm + 'mm \u00b7 ' + fmtLen(p.length_m) + ' \u00b7 ' + p.year + '</span>'
        );
    });

    /* ── Delivery cities ── */
    var cityIcon = L.divIcon({
      className: '',
      html: '<div style="width:10px;height:10px;background:#0e9a6e;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>',
      iconSize: [10, 10], iconAnchor: [5, 5]
    });
    (d.delivery_cities || []).forEach(function (c) {
      L.marker([c.lat, c.lon], { icon: cityIcon })
        .addTo(map)
        .bindPopup('<strong>\uD83D\uDCE6 ' + c.name + '</strong><br><em>' + c.state + '</em><br><span style="color:#0e9a6e;font-size:.88em">Pipes delivered to this region</span>');
    });

    /* ── Legend ── */
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      var d = L.DomUtil.create('div', '');
      d.style.cssText = 'background:#fff;padding:10px 14px;border-radius:8px;font-size:12px;line-height:1.8;box-shadow:0 2px 8px rgba(0,0,0,.18)';
      d.innerHTML =
        '<div style="font-weight:700;margin-bottom:4px">Map Legend</div>' +
        '<span style="display:inline-block;width:24px;height:4px;background:#1a6ec7;vertical-align:middle;border-radius:2px;margin-right:6px"></span>NH corridor (pipe supply)<br>' +
        '<span style="display:inline-block;width:24px;height:4px;background:#e07b00;vertical-align:middle;border-radius:2px;margin-right:6px"></span>Project stretch<br>' +
        '<span style="display:inline-block;width:12px;height:12px;background:#f5a623;border-radius:50%;vertical-align:middle;margin-right:6px;opacity:.9"></span>Project site (size = qty)<br>' +
        '<span style="display:inline-block;width:10px;height:10px;background:#0e9a6e;border-radius:50%;vertical-align:middle;margin-right:6px"></span>Delivery region<br>' +
        '<span style="display:inline-block;width:10px;height:10px;background:#1a4f8a;border-radius:50%;vertical-align:middle;margin-right:6px"></span>Factory';
      return d;
    };
    legend.addTo(map);

    /* GA4 map interaction event */
    map.on('click', function () {
      if (window.gtag) gtag('event', 'map_click', { event_category: 'map', event_label: 'leaflet_map' });
    });
    map.on('zoomend', function () {
      if (window.gtag) gtag('event', 'map_zoom', { event_category: 'map', event_label: 'zoom_' + map.getZoom() });
    });
  }
});
