/* map.js v2.1 3 ARCCP Leaflet map: lean project dots, corridor lines, softer halos */
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

    /* 3 Gradient service radius: soft halos on 3 factories only (Velvadam, Vellanki, Peddabammidi) 3 */
    var baseRadius = (d.supply_radius_km || 350) * 1000;
    (d.factories || []).forEach(function (f) {
      var isHaloFactory = /Velvadam|Vellanki|Peddabammidi/.test(f.name);
      if (isHaloFactory) {
        var boost = /Velvadam/.test(f.name) ? 1.25 : 1.0; // Vijayawada area 25% larger
        var r1 = baseRadius * 0.5 * boost;
        var r2 = baseRadius * 0.9 * boost;
        var r3 = baseRadius * 1.3 * boost;
        L.circle([f.lat, f.lon], {
          radius: r3, color: 'transparent', fillColor: '#e07b00', fillOpacity: 0.03, weight: 0, interactive: false
        }).addTo(map);
        L.circle([f.lat, f.lon], {
          radius: r2, color: 'transparent', fillColor: '#e07b00', fillOpacity: 0.05, weight: 0, interactive: false
        }).addTo(map);
        L.circle([f.lat, f.lon], {
          radius: r1, color: 'transparent', fillColor: '#e07b00', fillOpacity: 0.09, weight: 0, interactive: false
        }).addTo(map);
      }
      L.circleMarker([f.lat, f.lon], {
        radius: 5, color: '#fff', fillColor: '#1a4f8a', fillOpacity: 1, weight: 2
      }).addTo(map)
        .bindPopup('<strong>\uD83C\uDFED ' + f.name + '</strong><br><em>' + f.district + ' District 3 Manufacturing Unit</em>');
    });

    /* 3 Corridor lines (road-stretch pipe supply) 3 */
    (d.corridors || []).forEach(function (c) {
      var latlngs = c.waypoints.map(function (w) { return [w[0], w[1]]; });
      L.polyline(latlngs, {
        color: c.color || '#1a6ec7', weight: 9, opacity: 0.18, lineCap: 'round', lineJoin: 'round'
      }).addTo(map);
      var line = L.polyline(latlngs, {
        color: c.color || '#1a6ec7', weight: 4, opacity: 0.9, lineCap: 'round', lineJoin: 'round'
      }).addTo(map);
      line.bindPopup(
        '<strong>' + c.label + '</strong><br>' +
        '<span style="color:#444">' + c.client + '</span><br>' +
        '<span style="font-size:.88em;color:#666">' + c.work + '</span><br>' +
        '<span style="color:#e07b00;font-weight:600">' + c.cls + ' 3 8' + c.dia_mm + 'mm 3 ' + fmtLen(c.length_m) + ' supplied 3 ' + c.year + '</span>'
      );
    });

    /* 3 Point projects 3 render as small dots so they don3t dominate 3 */
    (d.projects || []).forEach(function (p) {
      L.circleMarker([p.lat, p.lon], {
        radius: 5, color: '#1a4f8a', fillColor: '#1a4f8a', fillOpacity: 0.9, weight: 0.5
      }).addTo(map)
        .bindPopup(
          '<strong>' + p.client + '</strong><br>' +
          '<span style="font-size:.88em">' + p.work + '</span><br>' +
          '<span style="color:#e07b00;font-weight:600">' + p.cls + ' 3 8' + p.dia_mm + 'mm 3 ' + fmtLen(p.length_m) + ' 3 ' + p.year + '</span>'
        );
    });

    /* 3 Delivery cities 3 */
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

    /* 3 Legend 3 */
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      var d = L.DomUtil.create('div', '');
      d.style.cssText = 'background:#fff;padding:10px 14px;border-radius:8px;font-size:12px;line-height:1.8;box-shadow:0 2px 8px rgba(0,0,0,.18)';
      d.innerHTML =
        '<div style="font-weight:700;margin-bottom:4px">Map Legend</div>' +
        '<span style="display:inline-block;width:24px;height:4px;background:#1a6ec7;vertical-align:middle;border-radius:2px;margin-right:6px"></span>NH corridor (pipe supply)<br>' +
        '<span style="display:inline-block;width:24px;height:4px;background:#e07b00;vertical-align:middle;border-radius:2px;margin-right:6px"></span>Project stretch<br>' +
        '<span style="display:inline-block;width:10px;height:10px;background:#1a4f8a;border-radius:50%;vertical-align:middle;margin-right:6px"></span>Project / supply locus<br>' +
        '<span style="display:inline-block;width:10px;height:10px;background:#0e9a6e;border-radius:50%;vertical-align:middle;margin-right:6px"></span>Delivery region<br>' +
        '<span style="display:inline-block;width:10px;height:10px;background:#1a4f8a;border-radius:50%;border:2px solid #fff;vertical-align:middle;margin-right:6px"></span>Factory';
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
