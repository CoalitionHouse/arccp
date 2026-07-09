/* map.js v3.5 — complete, corrected directional bearings */
(function () {

var MAP_DATA_DELIVERY_CITIES = [
  { name: 'Raipur',      state: 'Chhattisgarh',   lat: 21.2514, lon: 81.6296, spoke_km: 90,  bearing: 225 },
  { name: 'Rayagada',    state: 'Odisha',          lat: 19.1700, lon: 83.4100, spoke_km: 70,  bearing: 180 },
  { name: 'Bhubaneswar', state: 'Odisha',          lat: 20.2961, lon: 85.8245, spoke_km: 80,  bearing: 220 },
  { name: 'Bengaluru',   state: 'Karnataka',       lat: 12.9716, lon: 77.5946, spoke_km: 100, bearing: 0   },
  { name: 'Anantapur',   state: 'Andhra Pradesh',  lat: 14.6819, lon: 77.6006, spoke_km: 60,  bearing: 45  },
  { name: 'Kadapa',      state: 'Andhra Pradesh',  lat: 14.4673, lon: 78.8242, spoke_km: 50,  bearing: 0   },
  { name: 'Sri City',    state: 'Andhra Pradesh',  lat: 13.4000, lon: 80.0000, spoke_km: 55,  bearing: 0,  extra_bearings: [270] }
];

var MAP_DATA_PROJECT_CITIES = [
  { client:'L&T',                work:'Industrial Utility Pipeline, Krishna',            state:'Andhra Pradesh', lat:16.5062, lon:80.6480, length_m:5400,  dia_mm:1000, cls:'NP3',    year:2019,          spoke_km:50, bearing:15  },
  { client:'NCC',                work:'Urban Storm Drainage, Warangal',                  state:'Telangana',      lat:17.9784, lon:79.5941, length_m:6900,  dia_mm:900,  cls:'NP3',    year:2017,          spoke_km:60, bearing:75  },
  { client:'MEIL',               work:'Irrigation Pressure Main, East Godavari',         state:'Andhra Pradesh', lat:16.9891, lon:82.2475, length_m:9600,  dia_mm:1000, cls:'P2',     year:2018,          spoke_km:70, bearing:350 },
  { client:'APSIDC',             work:'Lift Irrigation Scheme, Kurnool',                 state:'Andhra Pradesh', lat:15.8281, lon:78.0373, length_m:12000, dia_mm:1200, cls:'P3',     year:2016,          spoke_km:80, bearing:220 },
  { client:'NTPC',               work:'Plant Utility Drainage, Hyderabad',               state:'Telangana',      lat:17.4399, lon:78.3489, length_m:3600,  dia_mm:700,  cls:'NP3',    year:2014,          spoke_km:50, bearing:135, extra_bearings:[75,225] },
  { client:'Tata Projects',      work:'Infrastructure Drainage Works, Hyderabad region', state:'Telangana',      lat:17.3800, lon:78.4800, length_m:4200,  dia_mm:800,  cls:'NP3',    year:2017,          spoke_km:50, bearing:75  },
  { client:'Shapoorji Pallonji', work:'Building Services Drainage, Hyderabad region',    state:'Telangana',      lat:17.4500, lon:78.3800, length_m:2800,  dia_mm:600,  cls:'NP2',    year:2016,          spoke_km:50, bearing:225 },
  { client:'Dilip Buildcon',     work:'Highway Drainage, Kakinada area',                 state:'Andhra Pradesh', lat:16.9517, lon:82.2373, length_m:4700,  dia_mm:900,  cls:'NP3',    year:2017,          spoke_km:60, bearing:240 },
  { client:'Madhucon',           work:'Road Cross Drainage, Vizianagaram',               state:'Andhra Pradesh', lat:18.1100, lon:83.3900, length_m:3900,  dia_mm:700,  cls:'NP3',    year:2015,          spoke_km:50, bearing:340 },
  { client:'Leighton',           work:'Infrastructure Package, Andhra Pradesh',          state:'Andhra Pradesh', lat:16.3000, lon:80.4500, length_m:5100,  dia_mm:900,  cls:'NP4',    year:2013,          spoke_km:60, bearing:315 },
  { client:'Punj Lloyd',         work:'Pipeline Works, Krishna',                         state:'Andhra Pradesh', lat:16.4000, lon:80.5000, length_m:4400,  dia_mm:800,  cls:'NP3',    year:2012,          spoke_km:50, bearing:250 },
  { client:'AP R&B / GVMC',      work:'Madhurawada-Bheemili Coastal Road (~25 km)',      state:'Andhra Pradesh', lat:17.8600, lon:83.3950, length_m:25000, dia_mm:'600-900', cls:'NP3', year:'2015-2019', spoke_km:25, bearing:45, routeFile:'assets/routes/route-2.geojson' },
  { client:'Visakhapatnam Steel Plant & Port belt', work:'Plant utilities and drainage around VSP, Gangavaram and Visakhapatnam city', state:'Andhra Pradesh', lat:17.70, lon:83.24, length_m:null, dia_mm:'600-1200', cls:'NP3/NP4', year:'multiple years', spoke_km:40, bearing:60, routeFile:'assets/routes/route-3.geojson' },
  { client:'Old Gajuwaka industrial belt', work:'Industrial drainage and pipelines over years in Old Gajuwaka belt', state:'Andhra Pradesh', lat:17.68, lon:83.03, length_m:null, dia_mm:'600-1000', cls:'NP3', year:'multiple years', spoke_km:35, bearing:240, routeFile:'assets/routes/route-4.geojson' },
  { client:'NH-5 works near Tuni', work:'Road drainage works near Tuni on NH-5 corridor', state:'Andhra Pradesh', lat:17.3600, lon:82.5500, length_m:null, dia_mm:'600-900', cls:'NP3', year:'pre-2010', spoke_km:55, bearing:130 }
];

var MAP_DATA = {
  supply_radius_km: 350,
  factories: [
    { name: 'Amaravati RCC Pipes - Velvadam',           district: 'Krishna',          lat: 16.7438, lon: 80.6399 },
    { name: 'Visakha RCC Pipes - Vellanki',             district: 'Visakhapatnam',    lat: 17.8837, lon: 83.0924 },
    { name: 'Visakha RCC Pipes - Rajula Tallavalasa',   district: 'Visakhapatnam',    lat: 17.9150, lon: 83.3820 },
    { name: 'Visakha RCC Pipes - Peddabammidi',         district: 'Srikakulam',       lat: 18.5965, lon: 84.1019 }
  ],
  corridors: [
    {
      label: 'Raipur-Visakhapatnam corridor',
      client: 'Expressway / NH works',
      work: 'Pipe supply along Raipur-Visakhapatnam corridor alignment',
      cls: 'NP3/NP4', dia_mm: '600-1200', length_m: null, year: 'ongoing',
      color: '#e07b00',
      routeFile: 'assets/routes/route-5.geojson'
    },
    {
      label: 'NH-5 Ichchapuram-Tuni (~330 km)',
      client: 'NHAI',
      work: 'National Highway NH-5: Cross-drainage culverts & RCC pipe supply, Odisha border (Ichchapuram) to Tuni',
      cls: 'NP3/NP4', dia_mm: '600-1200', length_m: 330000, year: 'pre-2010',
      color: '#e07b00',
      routeFile: 'assets/routes/route-7.geojson',
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
      label: 'Amaravati Capital Access Roads (~60 km)',
      client: 'NCC / APCRDA / Feedback Infra',
      work: '4-lane access road from Dondapadu to Undavalli and Amaravati capital approach',
      cls: 'NP4', dia_mm: '1200', length_m: 60000, year: 2017,
      color: '#e07b00',
      routeFile: 'assets/routes/route-6.geojson'
    },
    {
      label: 'Dindi-Digamarru-Losari NH-216 (~80 km)',
      client: 'SIBMOST-TATA JV',
      work: 'Rehabilitation and upgradation of Dindi-Digamarru-Losari section of NH-216',
      cls: 'NP4', dia_mm: '1200', length_m: 80000, year: 2017,
      color: '#e07b00',
      waypoints: [
        [16.5500,81.2500],[16.5750,81.2800],[16.6000,81.3100],[16.6300,81.3400]
      ]
    },
    {
      label: 'Visakhapatnam Steel Plant-Gangavaram Belt (~40 km)',
      client: 'VSP / Gangavaram Port / EPCs',
      work: 'Plant utility, drainage and port works around VSP and Gangavaram port',
      cls: 'NP3/NP4', dia_mm: '600-1200', length_m: 40000, year: '2014-2018',
      color: '#e07b00',
      waypoints: [
        [17.7700,83.2300],[17.7350,83.2450],[17.7000,83.2550],[17.6600,83.2550]
      ]
    },
    {
      label: 'Madhurawada-Bheemili Coastal Road (~25 km)',
      client: 'AP R&B / GVMC',
      work: 'Coastal corridor and urban drainage along Madhurawada-Bheemili road',
      cls: 'NP3', dia_mm: '600-900', length_m: 25000, year: '2015-2019',
      color: '#e07b00',
      routeFile: 'assets/routes/route-2.geojson'
    },
    {
      label: 'Anakapalle-Anandapuram NH Bypass',
      client: 'NHAI / EPC',
      work: 'NH bypass section near Anakapalle-Anandapuram, Visakhapatnam',
      cls: 'NP3/NP4', dia_mm: '600-1200', length_m: null, year: '2012-2016',
      color: '#e07b00',
      routeFile: 'assets/routes/route-4.geojson'
    }
  ]
};

/* ── helpers ── */
function fmtLen(m) {
  if (!m || m <= 0) return '';
  return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m';
}

function addRoadSegment(map, lat, lon, km, bearingDeg) {
  var half = km / 111;
  var rad  = bearingDeg * Math.PI / 180;
  L.polyline([[lat, lon], [lat + Math.cos(rad) * half, lon + Math.sin(rad) * half]], {
    color: '#f58a1f', weight: 4, opacity: 0.95, lineCap: 'round', lineJoin: 'round'
  }).addTo(map);
}

function loadCorridorGeoJSON(map, corridor) {
  if (!corridor.routeFile) return;
  fetch(corridor.routeFile)
    .then(function (r) { return r.json(); })
    .then(function (geo) {
      L.geoJSON(geo, { style: function () {
        return { color: corridor.color, weight: 9, opacity: 0.18, lineCap: 'round', lineJoin: 'round' };
      }}).addTo(map);
      var line = L.geoJSON(geo, { style: function () {
        return { color: corridor.color, weight: 4, opacity: 0.9, lineCap: 'round', lineJoin: 'round' };
      }}).addTo(map);
      var lenLabel = fmtLen(corridor.length_m);
      var meta = corridor.cls + ' / ' + corridor.dia_mm + 'mm' + (lenLabel ? ' / ' + lenLabel : '') + ' / ' + corridor.year;
      line.bindPopup('<b>' + corridor.label + '</b><br><span style="color:#555">' + corridor.client + '</span><br>' + corridor.work + '<br><small>' + meta + '</small>');
    })
    .catch(function () {
      /* routeFile not found — fall back to waypoints if available */
      if (corridor.waypoints && corridor.waypoints.length) {
        var fb = L.polyline(corridor.waypoints, {
          color: corridor.color, weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round'
        }).addTo(map);
        fb.bindPopup('<b>' + corridor.label + '</b><br><small>route file pending</small>');
      }
    });
}

/* ── main init ── */
document.addEventListener('DOMContentLoaded', function () {
  var mapEl = document.getElementById('leaflet-map');
  if (!mapEl) return;

  var map = L.map('leaflet-map', { zoomControl: true, scrollWheelZoom: false }).setView([16.5, 81.5], 7);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  /* supply radius circles */
  MAP_DATA.factories.forEach(function (f) {
    L.circle([f.lat, f.lon], {
      radius: MAP_DATA.supply_radius_km * 1000,
      color: '#e07b00', weight: 1.5, opacity: 0.25, fill: true, fillColor: '#e07b00', fillOpacity: 0.04
    }).addTo(map);
  });

  /* corridors */
  MAP_DATA.corridors.forEach(function (c) {
    if (c.routeFile) {
      loadCorridorGeoJSON(map, c);
    } else if (c.waypoints && c.waypoints.length) {
      var pl = L.polyline(c.waypoints, {
        color: c.color, weight: 9, opacity: 0.18, lineCap: 'round', lineJoin: 'round'
      }).addTo(map);
      L.polyline(c.waypoints, {
        color: c.color, weight: 4, opacity: 0.9, lineCap: 'round', lineJoin: 'round'
      }).addTo(map).bindPopup('<b>' + c.label + '</b><br>' + c.work);
    }
  });

  /* delivery cities */
  var delivIcon = L.divIcon({ className: '', html: '<div style="width:10px;height:10px;border-radius:50%;background:#2a7f3f;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,.3)"></div>', iconSize: [10, 10], iconAnchor: [5, 5] });
  MAP_DATA_DELIVERY_CITIES.forEach(function (d) {
    L.marker([d.lat, d.lon], { icon: delivIcon }).addTo(map)
      .bindPopup('<b>' + d.name + '</b><br>' + d.state + '<br><small>Delivery city</small>');
    addRoadSegment(map, d.lat, d.lon, d.spoke_km, d.bearing);
    if (d.extra_bearings) {
      d.extra_bearings.forEach(function (b) { addRoadSegment(map, d.lat, d.lon, d.spoke_km, b); });
    }
  });

  /* project cities */
  var projIcon = L.divIcon({ className: '', html: '<div style="width:10px;height:10px;border-radius:50%;background:#1a4f8a;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,.3)"></div>', iconSize: [10, 10], iconAnchor: [5, 5] });
  MAP_DATA_PROJECT_CITIES.forEach(function (p) {
    if (!p.routeFile) {
      L.marker([p.lat, p.lon], { icon: projIcon }).addTo(map)
        .bindPopup('<b>' + p.client + '</b><br>' + p.work + '<br><small>' + p.cls + ' / ' + p.dia_mm + 'mm / ' + p.year + '</small>');
      addRoadSegment(map, p.lat, p.lon, p.spoke_km, p.bearing);
      if (p.extra_bearings) {
        p.extra_bearings.forEach(function (b) { addRoadSegment(map, p.lat, p.lon, p.spoke_km, b); });
      }
    }
  });

  /* factory markers */
  var factIcon = L.divIcon({ className: '', html: '<div style="width:14px;height:14px;border-radius:50%;background:#e07b00;border:2.5px solid #fff;box-shadow:0 0 6px rgba(0,0,0,.4)"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
  MAP_DATA.factories.forEach(function (f) {
    L.marker([f.lat, f.lon], { icon: factIcon }).addTo(map)
      .bindPopup('<b>' + f.name + '</b><br>' + f.district + ' district<br><small>Manufacturing facility</small>');
  });

  /* legend */
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    var d = L.DomUtil.create('div', '');
    d.style.cssText = 'background:rgba(255,255,255,.93);padding:10px 14px;border-radius:8px;font:13px/1.6 sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.15)';
    d.innerHTML =
      '<div style="font-weight:700;margin-bottom:6px">Legend</div>' +
      '<div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#e07b00;margin-right:6px;vertical-align:middle"></span>Factory</div>' +
      '<div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#1a4f8a;margin-right:6px;vertical-align:middle"></span>Project site</div>' +
      '<div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#2a7f3f;margin-right:6px;vertical-align:middle"></span>Delivery city</div>' +
      '<div><span style="display:inline-block;width:30px;height:4px;background:#e07b00;margin-right:6px;vertical-align:middle"></span>NH corridor / route</div>' +
      '<div><span style="display:inline-block;width:30px;height:4px;background:#f58a1f;margin-right:6px;vertical-align:middle"></span>Road stub</div>';
    return d;
  };
  legend.addTo(map);
});

})();
