/* map.js v2.4 — data embedded inline, no fetch dependency */
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
      color: '#1a6ec7',
      waypoints: [
        [18.7950,84.6900],[18.5965,84.1019],[18.3100,83.9200],[18.2200,83.7800],
        [18.0900,83.5500],[17.9800,83.4100],[17.9150,83.3820],[17.8837,83.0924],
        [17.8000,82.9000],[17.7000,82.7500],[17.5600,82.5700],[17.4500,82.3000],
        [17.3616,82.1000],[17.2600,81.9500],[17.1800,81.8000],[17.0900,81.6500],
        [17.0200,81.5500],[16.9800,81.4500],[16.9200,81.3500],[16.8500,81.2200],
        [16.7800,81.0800],[16.7000,80.9500],[16.6300,80.8200],[16.5800,80.7000],
        [16.5200,80.6000],[16.3580,80.1090]
      ]
    },
    {
      label: 'Visakhapatnam Port Area Drainage',
      client: 'Gangavaram Port / RITES-SHELADIA JV',
      work: 'Port drainage & NH utility crossings, Visakhapatnam',
      cls: 'NP3/NP4', dia_mm: '600–800', length_m: 7300, year: 2015,
      color: '#e07b00',
      waypoints: [[17.6900,83.2200],[17.6600,83.2400],[17.6214,83.2520],[17.7041,83.2977]]
    },
    {
      label: 'Srikakulam District Highway Package',
      client: 'Ashoka Buildcon',
      work: 'Road culvert package, Srikakulam',
      cls: 'NP4', dia_mm: '1200', length_m: 5800, year: 2019,
      color: '#e07b00',
      waypoints: [[18.2949,83.8938],[18.3200,83.9500],[18.3600,84.0000]]
    }
  ],
  delivery_cities: [
    { name: 'Raipur',       state: 'Chhattisgarh',   lat: 21.2514, lon: 81.6296 },
    { name: 'Rayagada',     state: 'Odisha',          lat: 19.1700, lon: 83.4100 },
    { name: 'Bhubaneswar',  state: 'Odisha',          lat: 20.2961, lon: 85.8245 },
    { name: 'Bengaluru',    state: 'Karnataka',       lat: 12.9716, lon: 77.5946 },
    { name: 'Anantapur',    state: 'Andhra Pradesh',  lat: 14.6819, lon: 77.6006 },
    { name: 'Kadapa',       state: 'Andhra Pradesh',  lat: 14.4673, lon: 78.8242 },
    { name: 'Sri City',     state: 'Andhra Pradesh',  lat: 13.4000, lon: 80.0000 }
  ],
  projects: [
    { client:'L&T',                  work:'Industrial Utility Pipeline, Krishna',      lat:16.5062, lon:80.6480, length_m:5400,  dia_mm:1000, cls:'NP3',    year:2019 },
    { client:'NCC',                  work:'Urban Storm Drainage, Warangal',            lat:17.9784, lon:79.5941, length_m:6900,  dia_mm:900,  cls:'NP3',    year:2017 },
    { client:'MEIL',                 work:'Irrigation Pressure Main, East Godavari',   lat:16.9891, lon:82.2475, length_m:9600,  dia_mm:1000, cls:'P2',     year:2018 },
    { client:'APSIDC',               work:'Lift Irrigation Scheme, Kurnool',           lat:15.8281, lon:78.0373, length_m:12000, dia_mm:1200, cls:'P3',     year:2016 },
    { client:'NTPC',                 work:'Plant Utility Drainage, Hyderabad',         lat:17.4399, lon:78.3489, length_m:3600,  dia_mm:700,  cls:'NP3',    year:2014 },
    { client:'Tata Projects',        work:'Infrastructure Drainage Works',             lat:17.3800, lon:78.4800, length_m:4200,  dia_mm:800,  cls:'NP3',    year:2017 },
    { client:'Shapoorji Pallonji',   work:'Building Services Drainage',                lat:17.4500, lon:78.3800, length_m:2800,  dia_mm:600,  cls:'NP2',    year:2016 },
    { client:'Dilip Buildcon',       work:'Highway Drainage, East Godavari',           lat:17.3616, lon:82.5449, length_m:4700,  dia_mm:900,  cls:'NP3',    year:2017 },
    { client:'Madhucon',             work:'Road Cross Drainage, Vizianagaram',         lat:18.1100, lon:83.3900, length_m:3900,  dia_mm:700,  cls:'NP3',    year:2015 },
    { client:'Leighton',             work:'Infrastructure Package, AP',                lat:16.3000, lon:80.4500, length_m:5100,  dia_mm:900,  cls:'NP4',    year:2013 },
    { client:'Punj Lloyd',           work:'Pipeline Works, Krishna',                   lat:16.4000, lon:80.5000, length_m:4400,  dia_mm:800,  cls:'NP3',    year:2012 },
    { client:'GR Infraprojects',     work:'NH Culverts, Vizag',                        lat:17.7200, lon:83.3100, length_m:3300,  dia_mm:600,  cls:'NP4',    year:2018 }
  ]
};

function fmtLen(m) {
  return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m';
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

  /* Soft gradient halos — 3 factories only */
  var baseR = MAP_DATA.supply_radius_km * 1000;
  MAP_DATA.factories.forEach(function (f) {
    var isHalo = /Velvadam|Vellanki|Peddabammidi/.test(f.name);
    if (isHalo) {
      var boost = /Velvadam/.test(f.name) ? 1.25 : 1.0;
      [{m:0.45,o:0.10},{m:0.80,o:0.055},{m:1.20,o:0.028}].forEach(function (ring) {
        L.circle([f.lat, f.lon], {
          radius: baseR * ring.m * boost, color:'transparent',
          fillColor:'#e07b00', fillOpacity:ring.o, weight:0, interactive:false
        }).addTo(map);
      });
    }
    L.circleMarker([f.lat, f.lon], {
      radius:5, color:'#fff', fillColor:'#1a4f8a', fillOpacity:1, weight:2
    }).addTo(map).bindPopup('<b>&#127981; ' + f.name + '</b><br><em>' + f.district + ' District &mdash; Factory</em>');
  });

  /* Corridor lines */
  MAP_DATA.corridors.forEach(function (c) {
    var ll = c.waypoints.map(function (w) { return [w[0], w[1]]; });
    L.polyline(ll, { color:c.color, weight:10, opacity:0.15, lineCap:'round', lineJoin:'round' }).addTo(map);
    var line = L.polyline(ll, { color:c.color, weight:4, opacity:0.92, lineCap:'round', lineJoin:'round' }).addTo(map);
    line.bindPopup('<b>' + c.label + '</b><br><span style="color:#444">' + c.client + '</span><br>' +
      '<span style="font-size:.88em;color:#666">' + c.work + '</span><br>' +
      '<span style="color:#e07b00;font-weight:600">' + c.cls + ' &middot; &oslash;' + c.dia_mm + 'mm &middot; ' + fmtLen(c.length_m) + ' &middot; ' + c.year + '</span>');
    var mid = ll[Math.floor(ll.length / 2)];
    L.circleMarker(mid, { radius:5, color:c.color, fillColor:'#fff', fillOpacity:1, weight:2 })
      .addTo(map).bindPopup('<b>' + c.label + '</b><br><span style="color:#e07b00">' + fmtLen(c.length_m) + ' supplied</span>');
  });

  /* Project dots — small fixed navy */
  MAP_DATA.projects.forEach(function (p) {
    L.circleMarker([p.lat, p.lon], {
      radius:5, color:'#fff', fillColor:'#1a4f8a', fillOpacity:0.88, weight:1.5
    }).addTo(map).bindPopup('<b>' + p.client + '</b><br><span style="font-size:.88em">' + p.work + '</span><br>' +
      '<span style="color:#e07b00;font-weight:600">' + p.cls + ' &middot; &oslash;' + p.dia_mm + 'mm &middot; ' + fmtLen(p.length_m) + ' &middot; ' + p.year + '</span>');
  });

  /* Delivery cities */
  MAP_DATA.delivery_cities.forEach(function (c) {
    var icon = L.divIcon({
      className: '',
      html: '<div style="width:11px;height:11px;background:#0e9a6e;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
      iconSize:[11,11], iconAnchor:[5,5]
    });
    L.marker([c.lat, c.lon], { icon:icon }).addTo(map)
      .bindPopup('<b>&#128230; ' + c.name + '</b><br><em>' + c.state + '</em><br><span style="color:#0e9a6e;font-size:.88em">Delivery region</span>');
  });

  /* Legend */
  var legend = L.control({ position:'bottomright' });
  legend.onAdd = function () {
    var div = L.DomUtil.create('div');
    div.setAttribute('style','background:rgba(255,255,255,0.97);padding:10px 14px;border-radius:8px;font:12px/2 -apple-system,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.22);min-width:180px;pointer-events:none');
    function dot(bg) { return '<span style="display:inline-block;width:10px;height:10px;background:'+bg+';border-radius:50%;border:2px solid #fff;box-sizing:border-box;vertical-align:middle;margin-right:7px"></span>'; }
    function bar(bg) { return '<span style="display:inline-block;width:22px;height:4px;background:'+bg+';border-radius:2px;vertical-align:middle;margin-right:7px"></span>'; }
    div.innerHTML =
      '<div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#111">Map Legend</div>' +
      bar('#1a6ec7')+'<span style="color:#111">NH corridor (pipe supply)</span><br>'+
      bar('#e07b00')+'<span style="color:#111">Project stretch</span><br>'+
      dot('#1a4f8a')+'<span style="color:#111">Supply location / Factory</span><br>'+
      dot('#0e9a6e')+'<span style="color:#111">Delivery region</span><br>'+
      '<div style="font-size:10px;color:#888;margin-top:2px">Orange halo = ~350km supply radius</div>';
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
