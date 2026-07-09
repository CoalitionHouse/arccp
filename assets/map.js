/* map.js v2.2 — ARCCP Leaflet map: fixed default view, visible legend, lean dots */
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
    /* Default view: centred on AP/Vizag corridor, zoom 6 shows the full supply region */
    var map = L.map('leaflet-map', { scrollWheelZoom: false }).setView([17.5, 82.5], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd', maxZoom: 18
    }).addTo(map);

    /* ── Soft gradient halos: 3 factories only ── */
    var baseRadius = (d.supply_radius_km || 350) * 1000;
    (d.factories || []).forEach(function (f) {
      var isHalo = /Velvadam|Vellanki|Peddabammidi/.test(f.name);
      if (isHalo) {
        var boost = /Velvadam/.test(f.name) ? 1.25 : 1.0;
        /* 3 overlapping fills — inner dense, outer feathered */
        [{ m: 0.5, o: 0.09 }, { m: 0.9, o: 0.05 }, { m: 1.3, o: 0.025 }].forEach(function (ring) {
          L.circle([f.lat, f.lon], {
            radius: baseRadius * ring.m * boost,
            color: 'transparent', fillColor: '#e07b00',
            fillOpacity: ring.o, weight: 0, interactive: false
          }).addTo(map);
        });
      }
      /* Small factory dot */
      L.circleMarker([f.lat, f.lon], {
        radius: 5, color: '#fff', fillColor: '#1a4f8a', fillOpacity: 1, weight: 2
      }).addTo(map).bindPopup('<strong>&#127981; ' + f.name + '</strong><br><em>' + f.district + ' District &mdash; Manufacturing Unit</em>');
    });

    /* ── Corridor lines ── */
    (d.corridors || []).forEach(function (c) {
      var ll = c.waypoints.map(function (w) { return [w[0], w[1]]; });
      /* glow */
      L.polyline(ll, { color: c.color || '#1a6ec7', weight: 10, opacity: 0.15, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      /* main */
      var line = L.polyline(ll, { color: c.color || '#1a6ec7', weight: 4, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      line.bindPopup(
        '<strong>' + c.label + '</strong><br>' +
        '<span style="color:#444">' + c.client + '</span><br>' +
        '<span style="font-size:.88em;color:#666">' + c.work + '</span><br>' +
        '<span style="color:#e07b00;font-weight:600">' + c.cls + ' &middot; &oslash;' + c.dia_mm + 'mm &middot; ' + fmtLen(c.length_m) + ' supplied &middot; ' + c.year + '</span>'
      );
      /* midpoint click anchor */
      var mid = ll[Math.floor(ll.length / 2)];
      L.circleMarker(mid, { radius: 4, color: c.color || '#1a6ec7', fillColor: '#fff', fillOpacity: 1, weight: 2 })
        .addTo(map)
        .bindPopup('<strong>' + c.label + '</strong><br><span style="color:#e07b00">' + fmtLen(c.length_m) + ' of pipe supplied</span>');
    });

    /* ── Point projects — small fixed navy dots ── */
    (d.projects || []).forEach(function (p) {
      L.circleMarker([p.lat, p.lon], {
        radius: 5, color: '#fff', fillColor: '#1a4f8a', fillOpacity: 0.85, weight: 1
      }).addTo(map).bindPopup(
        '<strong>' + p.client + '</strong><br>' +
        '<span style="font-size:.88em">' + p.work + '</span><br>' +
        '<span style="color:#e07b00;font-weight:600">' + p.cls + ' &middot; &oslash;' + p.dia_mm + 'mm &middot; ' + fmtLen(p.length_m) + ' &middot; ' + p.year + '</span>'
      );
    });

    /* ── Delivery cities ── */
    (d.delivery_cities || []).forEach(function (c) {
      var icon = L.divIcon({
        className: '',
        html: '<div style="width:11px;height:11px;background:#0e9a6e;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>',
        iconSize: [11, 11], iconAnchor: [5, 5]
      });
      L.marker([c.lat, c.lon], { icon: icon }).addTo(map)
        .bindPopup('<strong>&#128230; ' + c.name + '</strong><br><em>' + c.state + '</em><br><span style="color:#0e9a6e;font-size:.88em">Pipes delivered to this region</span>');
    });

    /* ── Legend (bottom-right, fully visible) ── */
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      var div = L.DomUtil.create('div');
      div.style.cssText = [
        'background:rgba(255,255,255,0.97)',
        'padding:10px 14px',
        'border-radius:8px',
        'font:13px/1.9 -apple-system,sans-serif',
        'box-shadow:0 2px 10px rgba(0,0,0,.22)',
        'min-width:195px',
        'pointer-events:none'
      ].join(';');
      function swatch(bg, w, h, br) {
        w = w || 10; h = h || 10; br = br !== undefined ? br : '50%';
        return '<span style="display:inline-block;width:' + w + 'px;height:' + h + 'px;background:' + bg + ';border-radius:' + br + ';vertical-align:middle;margin-right:7px"></span>';
      }
      div.innerHTML =
        '<div style="font-weight:700;font-size:13px;margin-bottom:5px;color:#222">Map Legend</div>' +
        swatch('#1a6ec7', 24, 4, '2px') + '<span style="color:#222">NH corridor (pipe supply)</span><br>' +
        swatch('#e07b00', 24, 4, '2px') + '<span style="color:#222">Project stretch</span><br>' +
        swatch('#1a4f8a', 10, 10, '50%') + '<span style="color:#222">Supply location</span><br>' +
        swatch('#0e9a6e', 10, 10, '50%') + '<span style="color:#222">Delivery region</span><br>' +
        '<span style="display:inline-block;width:10px;height:10px;background:#1a4f8a;border-radius:50%;border:2px solid #fff;box-sizing:border-box;vertical-align:middle;margin-right:7px"></span><span style="color:#222">Factory</span>';
      return div;
    };
    legend.addTo(map);

    /* GA4 */
    map.on('click', function () { if (window.gtag) gtag('event', 'map_click', { event_category: 'map' }); });
    map.on('zoomend', function () { if (window.gtag) gtag('event', 'map_zoom', { event_category: 'map', event_label: 'z' + map.getZoom() }); });
  }
});
