/* map.js v2.5 — orange factories, green deliveries, orange corridor + spokes */
(function () {

var MAP_DATA = {
  supply_radius_km: 350,
  factories: [
    { name: 'Amaravati RCC Pipes — Velvadam', district: 'Krishna', lat: 16.7438, lon: 80.6399 },
    { name: 'Visakha RCC Pipes — Vellanki', district: 'Visakhapatnam', lat: 17.8837, lon: 83.0924 },
    { name: 'Visakha RCC Pipes — Rajula Tallavalasa', district: 'Visakhapatnam', lat: 17.9150, lon: 83.3820 },
    { name: 'Visakha RCC Pipes — Peddabammidi', district: 'Srikakulam', lat: 18.5965, lon: 84.1019 }
  ],
  corridors: [
    {
      label: 'NH-5 Srikakulam–Tuni (~330 km)',
      client: 'NHAI',
      work: 'National Highway NH-5: Cross-drainage culverts & RCC pipe supply, Odisha border (Ichchapuram) to Tuni',
      cls: 'NP3/NP4', dia_mm: '600–1200', length_m: 330000, year: 'pre-2010',
      color: '#e07b00',
      waypoints: [
        [18.7950,84.6900],[18.5965,84.1019],[18.3100,83.9200],[18.2200,83.7800],
        [18.0900,83.5500],[17.9800,83.4100],[17.9150,83.3820],[17.8837,83.0924],
        [17.8000,82.9000],[17.7000,82.7500],[17.5600,82.5700],[17.4500,82.3000],
        [17.3616,82.1000],[17.2600,81.9500],[17.1800,81.8000],[17.0900,81.6500],
        [17.0200,81.5500],[16.9800,81.4500],[16.9200,81.3500],[16.8500,81.2200],
        [16.7800,81.0800],[16.7000,80.9500],[16.6300,80.8200],[16.5800,80.7000],
        [16.5200,80.6000],[16.3580,80.1090]
      ]
    }
  ],
  delivery_cities: [
    { name: 'Raipur',       state: 'Chhattisgarh',   lat: 21.2514, lon: 81.6296, spoke_km: 90 },
    { name: 'Rayagada',     state: 'Odisha',          lat: 19.1700, lon: 83.4100, spoke_km: 70 },
    { name: 'Bhubaneswar',  state: 'Odisha',          lat: 20.2961, lon: 85.8245, spoke_km: 80 },
    { name: 'Bengaluru',    state: 'Karnataka',       lat: 12.9716, lon: 77.5946, spoke_km: 100 },
    { name: 'Anantapur',    state: 'Andhra Pradesh',  lat: 14.6819, lon: 77.6006, spoke_km: 60 },
    { name: 'Kadapa',       state: 'Andhra Pradesh',  lat: 14.4673, lon: 78.8242, spoke_km: 50 },
    { name: 'Sri City',     state: 'Andhra Pradesh',  lat: 13.4000, lon: 80.0000, spoke_km: 70 }
  ]
};

function fmtLen(m) { return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m'; }

function addSpoke(map, lat, lon, km) {
  var dx = km / 111; // approx degrees at this latitude
  var p1 = [lat, lon - dx/2];
  var p2 = [lat, lon + dx/2];
  L.polyline([p1, p2], { color:'#e07b00', weight:3, opacity:0.85, lineCap:'round' }).addTo(map);
}

function initMap() {
  var el = document.getElementById('leaflet-map');
  if (!el) return;
  el.style.height = '480px';

  var map = L.map('leaflet-map', { scrollWheelZoom: false }).setView([17.5, 82.5], 6);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd', maxZoom: 18
  }).addTo(map);

  var baseR = MAP_DATA.supply_radius_km * 1000;
  MAP_DATA.factories.forEach(function (f) {
    var boost = /Velvadam/.test(f.name) ? 1.25 : 1.0;
    [{m:0.45,o:0.08},{m:0.80,o:0.05},{m:1.20,o:0.025}].forEach(function (ring) {
      L.circle([f.lat, f.lon], {
        radius: baseR * ring.m * boost, color:'transparent',
        fillColor:'#e07b00', fillOpacity:ring.o, weight:0, interactive:false
      }).addTo(map);
    });
    L.circleMarker([f.lat, f.lon], {
      radius:6, color:'#c06000', fillColor:'#f5a623', fillOpacity:0.95, weight:2
    }).addTo(map).bindPopup('<b>Factory</b><br>' + f.name + '<br><em>' + f.district + ' District</em>');
  });

  MAP_DATA.corridors.forEach(function (c) {
    var ll = c.waypoints.map(function (w) { return [w[0], w[1]]; });
    L.polyline(ll, { color:'#e07b00', weight:9, opacity:0.18, lineCap:'round', lineJoin:'round' }).addTo(map);
    var line = L.polyline(ll, { color:'#e07b00', weight:4, opacity:0.9, lineCap:'round', lineJoin:'round' }).addTo(map);
    line.bindPopup('<b>' + c.label + '</b><br><span style="color:#444">' + c.client + '</span><br>' +
      '<span style="font-size:.88em;color:#666">' + c.work + '</span><br>' +
      '<span style="color:#e07b00;font-weight:600">' + c.cls + ' · ø' + c.dia_mm + 'mm · ' + fmtLen(c.length_m) + ' · ' + c.year + '</span>');
  });

  MAP_DATA.delivery_cities.forEach(function (c) {
    var icon = L.divIcon({
      className: '',
      html: '<div style="width:11px;height:11px;background:#0e9a6e;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
      iconSize:[11,11], iconAnchor:[5,5]
    });
    L.marker([c.lat, c.lon], { icon:icon }).addTo(map)
      .bindPopup('<b>Delivery region</b><br>' + c.name + ', ' + c.state + '<br><span style="color:#e07b00;font-size:.88em">Approx. ' + c.spoke_km + ' km of pipe supplied</span>');
    addSpoke(map, c.lat, c.lon, c.spoke_km);
  });

  var legend = L.control({ position:'bottomright' });
  legend.onAdd = function () {
    var div = L.DomUtil.create('div');
    div.setAttribute('style','background:rgba(255,255,255,0.97);padding:10px 14px;border-radius:8px;font:12px/2 -apple-system,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.22);min-width:190px;pointer-events:none');
    function dot(bg) { return '<span style="display:inline-block;width:10px;height:10px;background:'+bg+';border-radius:50%;border:2px solid #fff;box-sizing:border-box;vertical-align:middle;margin-right:7px"></span>'; }
    function bar(bg) { return '<span style="display:inline-block;width:22px;height:4px;background:'+bg+';border-radius:2px;vertical-align:middle;margin-right:7px"></span>'; }
    div.innerHTML =
      '<div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#111">Map Legend</div>' +
      bar('#e07b00')+'<span style="color:#111">NH corridor / road stretch</span><br>'+
      dot('#f5a623')+'<span style="color:#111">Factory</span><br>'+
      dot('#0e9a6e')+'<span style="color:#111">Delivery location</span><br>'+
      '<span style="display:inline-block;width:22px;height:3px;background:#e07b00;border-radius:2px;vertical-align:middle;margin-right:7px"></span><span style="color:#111">Pipe length indication (~50–100 km)</span><br>'+
      '<div style="font-size:10px;color:#888;margin-top:2px">Orange halo = indicative ~350km supply radius</div>';
    return div;
  };
  legend.addTo(map);

  setTimeout(function () { map.invalidateSize(); }, 300);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}

})();
