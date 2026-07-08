/* map.js — Leaflet interactive project map for ARCCP */
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('leaflet-map');
  if (!el) return;
  var dataPath = el.getAttribute('data-path') || 'data/projects.json';

  fetch(dataPath)
    .then(function (r) { return r.json(); })
    .then(function (d) { initMap(d); })
    .catch(function () { initMap({ factories: [], projects: [], supply_radius_km: 300 }); });

  function initMap(d) {
    var map = L.map('leaflet-map').setView([17.5, 82.5], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    var factoryIcon = L.divIcon({
      className: '',
      html: '<div style="width:16px;height:16px;background:#1a4f8a;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>',
      iconSize: [16, 16], iconAnchor: [8, 8]
    });

    (d.factories || []).forEach(function (f) {
      L.circle([f.lat, f.lon], {
        radius: (d.supply_radius_km || 300) * 1000,
        color: '#1a4f8a', fillColor: '#1a4f8a', fillOpacity: .05, weight: 1, dashArray: '6,4'
      }).addTo(map);
      L.marker([f.lat, f.lon], { icon: factoryIcon })
        .addTo(map)
        .bindPopup('<strong>' + f.name + '</strong><br>' + f.district + ' District');
    });

    (d.projects || []).forEach(function (p) {
      var r = Math.max(6, Math.min(28, Math.sqrt(p.length_m) * 0.9));
      L.circleMarker([p.lat, p.lon], {
        radius: r, color: '#e07b00', fillColor: '#f5a623', fillOpacity: .75, weight: 2
      }).addTo(map)
        .bindPopup(
          '<strong>' + p.client + '</strong><br>' +
          p.work + '<br>' +
          '<span style="color:#5a6175;font-size:.85em">' + p.cls + ' · ' + p.dia_mm + 'mm · ' +
          (p.length_m >= 1000 ? (p.length_m / 1000).toFixed(2) + ' km' : p.length_m + ' m') +
          ' · ' + p.year + '</span>'
        );
    });
  }
});
