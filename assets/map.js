/* map.js v3.6 — location dots only (no stubs), all green; orange routes; big orange factory dots */
(function () {

var MAP_DATA_DELIVERY_CITIES = [
  { name: 'Raipur',      state: 'Chhattisgarh',  lat: 21.2514, lon: 81.6296 },
  { name: 'Rayagada',    state: 'Odisha',         lat: 19.1700, lon: 83.4100 },
  { name: 'Bhubaneswar', state: 'Odisha',         lat: 20.2961, lon: 85.8245 },
  { name: 'Bengaluru',   state: 'Karnataka',      lat: 12.9716, lon: 77.5946 },
  { name: 'Anantapur',   state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006 },
  { name: 'Kadapa',      state: 'Andhra Pradesh', lat: 14.4673, lon: 78.8242 },
  { name: 'Sri City',    state: 'Andhra Pradesh', lat: 13.4000, lon: 80.0000 }
];

var MAP_DATA_PROJECT_CITIES = [
  { client:'L&T',                work:'Industrial Utility Pipeline, Krishna',                             state:'Andhra Pradesh', lat:16.5062, lon:80.6480, length_m:5400,  dia_mm:1000,      cls:'NP3',    year:2019          },
  { client:'NCC',                work:'Urban Storm Drainage, Warangal',                                  state:'Telangana',      lat:17.9784, lon:79.5941, length_m:6900,  dia_mm:900,       cls:'NP3',    year:2017          },
  { client:'MEIL',               work:'Irrigation Pressure Main, East Godavari',                         state:'Andhra Pradesh', lat:16.9891, lon:82.2475, length_m:9600,  dia_mm:1000,      cls:'P2',     year:2018          },
  { client:'APSIDC',             work:'Lift Irrigation Scheme, Kurnool',                                 state:'Andhra Pradesh', lat:15.8281, lon:78.0373, length_m:12000, dia_mm:1200,      cls:'P3',     year:2016          },
  { client:'NTPC',               work:'Plant Utility Drainage, Hyderabad',                               state:'Telangana',      lat:17.4399, lon:78.3489, length_m:3600,  dia_mm:700,       cls:'NP3',    year:2014          },
  { client:'Tata Projects',      work:'Infrastructure Drainage Works, Hyderabad region',                 state:'Telangana',      lat:17.3800, lon:78.4800, length_m:4200,  dia_mm:800,       cls:'NP3',    year:2017          },
  { client:'Shapoorji Pallonji', work:'Building Services Drainage, Hyderabad region',                    state:'Telangana',      lat:17.4500, lon:78.3800, length_m:2800,  dia_mm:600,       cls:'NP2',    year:2016          },
  { client:'Dilip Buildcon',     work:'Highway Drainage, Kakinada area',                                 state:'Andhra Pradesh', lat:16.9517, lon:82.2373, length_m:4700,  dia_mm:900,       cls:'NP3',    year:2017          },
  { client:'Madhucon',           work:'Road Cross Drainage, Vizianagaram',                               state:'Andhra Pradesh', lat:18.1100, lon:83.3900, length_m:3900,  dia_mm:700,       cls:'NP3',    year:2015          },
  { client:'Leighton',           work:'Infrastructure Package, Andhra Pradesh',                          state:'Andhra Pradesh', lat:16.3000, lon:80.4500, length_m:5100,  dia_mm:900,       cls:'NP4',    year:2013          },
  { client:'Punj Lloyd',         work:'Pipeline Works, Krishna',                                         state:'Andhra Pradesh', lat:16.4000, lon:80.5000, length_m:4400,  dia_mm:800,       cls:'NP3',    year:2012          },
  { client:'AP R&B / GVMC',      work:'Madhurawada-Bheemili Coastal Road (~25 km)',                      state:'Andhra Pradesh', lat:17.8600, lon:83.3950, length_m:25000, dia_mm:'600-900', cls:'NP3',    year:'2015-2019'   },
  { client:'Visakhapatnam Steel Plant & Port belt', work:'Plant utilities and drainage, VSP & Gangavaram', state:'Andhra Pradesh', lat:17.70,   lon:83.24,   length_m:null,  dia_mm:'600-1200',cls:'NP3/NP4',year:'multiple years'},
  { client:'Old Gajuwaka industrial belt', work:'Industrial drainage and pipelines, Old Gajuwaka',       state:'Andhra Pradesh', lat:17.68,   lon:83.03,   length_m:null,  dia_mm:'600-1000',cls:'NP3',    year:'multiple years'},
  { client:'NH-5 works near Tuni', work:'Road drainage works near Tuni on NH-5 corridor',               state:'Andhra Pradesh', lat:17.3600, lon:82.5500, length_m:null,  dia_mm:'600-900', cls:'NP3',    year:'pre-2010'    }
];

var MAP_DATA = {
  supply_radius_km: 350,
  factories: [
    { name: 'Amaravati RCC Pipes - Velvadam',         district: 'Krishna',       lat: 16.7438, lon: 80.6399 },
    { name: 'Visakha RCC Pipes - Vellanki',           district: 'Visakhapatnam', lat: 17.8837, lon: 83.0924 },
    { name: 'Visakha RCC Pipes - Rajula Tallavalasa', district: 'Visakhapatnam', lat: 17.9150, lon: 83.3820 },
    { name: 'Visakha RCC Pipes - Peddabammidi',       district: 'Srikakulam',    lat: 18.5965, lon: 84.1019 }
  ],
  corridors: [
    {
      label: 'Raipur-Visakhapatnam Expressway',
      client: 'Expressway / NH works',
      work: 'Pipe supply along Raipur-Visakhapatnam corridor alignment',
      cls: 'NP3/NP4', dia_mm: '600-1200', length_m: null, year: 'ongoing',
      color: '#e07b00',
      routeFile: 'assets/routes/route-5.geojson'
    },
    {
      label: 'NH-5 Ichchapuram-Tuni (~330 km)',
      client: 'NHAI',
      work: 'National Highway NH-5: Cross-drainage culverts & RCC pipe supply, Odisha border to Tuni',
      cls: 'NP3/NP4', dia_mm: '600-1200', length_m: 330000, year: 'pre-2010',
      color: '#e07b00',
      routeFile: 'assets/routes/route-1.geojson'
    },
    {
      label: 'Madhurawada-Bheemili Coastal Road (~25 km)',
      client: 'AP R&B / GVMC',
      work: 'Coastal corridor drainage along Madhurawada-Bheemili road',
      cls: 'NP3', dia_mm: '600-900', length_m: 25000, year: '2015-2019',
      color: '#e07b00',
      routeFile: 'assets/routes/route-2.geojson'
    },
    {
      label: 'Visakhapatnam Steel Plant & Gangavaram Belt',
      client: 'VSP / Gangavaram Port / EPCs',
      work: 'Plant utility, drainage and port works around VSP and Gangavaram port',
      cls: 'NP3/NP4', dia_mm: '600-1200', length_m: 40000, year: '2014-2018',
      color: '#e07b00',
      routeFile: 'assets/routes/route-3.geojson'
    },
    {
      label: 'Anakapalle-Anandapuram NH Bypass',
      client: 'NHAI / EPC',
      work: 'NH bypass section near Anakapalle-Anandapuram, Visakhapatnam',
      cls: 'NP3/NP4', dia_mm: '600-1200', length_m: null, year: '2012-2016',
      color: '#e07b00',
      routeFile: 'assets/routes/route-4.geojson'
    },
    {
      label: 'Amaravati Capital Access Roads (~60 km)',
      client: 'NCC / APCRDA / Feedback Infra',
      work: '4-lane access road from Dondapadu to Undavalli and Amaravati capital approach',
      cls: 'NP4', dia_mm: '1200', length_m: 60000, year: 2017,
      color: '#e07b00',
      routeFile: 'assets/routes/route-6.geojson'
    }
  ]
};

/* helpers */
function fmtLen(m) {
  if (!m || m <= 0) return '';
  return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m';
}

function loadCorridorGeoJSON(map, corridor) {
  fetch(corridor.routeFile)
    .then(function (r) {
      if (!r.ok) throw new Error('not found');
      return r.json();
    })
    .then(function (geo) {
      /* glow layer */
      L.geoJSON(geo, { style: function () {
        return { color: corridor.color, weight: 10, opacity: 0.15, lineCap: 'round', lineJoin: 'round' };
      }}).addTo(map);
      /* main line */
      var lenLabel = fmtLen(corridor.length_m);
      var meta = corridor.cls + ' / ' + corridor.dia_mm + 'mm' + (lenLabel ? ' / ' + lenLabel : '') + ' / ' + corridor.year;
      L.geoJSON(geo, { style: function () {
        return { color: corridor.color, weight: 4, opacity: 0.92, lineCap: 'round', lineJoin: 'round' };
      }}).addTo(map)
        .bindPopup('<b>' + corridor.label + '</b><br><span style="color:#666">' + corridor.client + '</span><br>' + corridor.work + '<br><small style="color:#888">' + meta + '</small>');
    })
    .catch(function () { /* route file not yet uploaded — skip silently */ });
}

/* main */
document.addEventListener('DOMContentLoaded', function () {
  var mapEl = document.getElementById('leaflet-map');
  if (!mapEl) return;

  var map = L.map('leaflet-map', { zoomControl: true, scrollWheelZoom: false }).setView([16.5, 81.5], 7);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(map);

  /* supply radius circles */
  MAP_DATA.factories.forEach(function (f) {
    L.circle([f.lat, f.lon], {
      radius: MAP_DATA.supply_radius_km * 1000,
      color: '#e07b00', weight: 1.5, opacity: 0.2,
      fill: true, fillColor: '#e07b00', fillOpacity: 0.04
    }).addTo(map);
  });

  /* corridors — all have routeFile, load as GeoJSON */
  MAP_DATA.corridors.forEach(function (c) {
    loadCorridorGeoJSON(map, c);
  });

  /* shared green dot style for all location markers */
  function greenDot(size) {
    return L.divIcon({
      className: '',
      html: '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:#2a9d4e;border:2px solid #fff;box-shadow:0 0 5px rgba(0,0,0,.3)"></div>',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }

  /* delivery cities — green dot + popup */
  MAP_DATA_DELIVERY_CITIES.forEach(function (d) {
    L.marker([d.lat, d.lon], { icon: greenDot(10) }).addTo(map)
      .bindPopup('<b>' + d.name + '</b><br>' + d.state + '<br><small style="color:#888">Delivery city</small>');
  });

  /* project cities — green dot + popup */
  MAP_DATA_PROJECT_CITIES.forEach(function (p) {
    var lenLabel = fmtLen(p.length_m);
    var meta = p.cls + ' / ' + p.dia_mm + 'mm' + (lenLabel ? ' / ' + lenLabel : '') + ' / ' + p.year;
    L.marker([p.lat, p.lon], { icon: greenDot(10) }).addTo(map)
      .bindPopup('<b>' + p.client + '</b><br>' + p.work + '<br><small style="color:#888">' + meta + '</small>');
  });

  /* factory markers — large orange dot */
  var factIcon = L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:#e07b00;border:3px solid #fff;box-shadow:0 0 8px rgba(224,123,0,.6)"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  MAP_DATA.factories.forEach(function (f) {
    L.marker([f.lat, f.lon], { icon: factIcon }).addTo(map)
      .bindPopup('<b>' + f.name + '</b><br>' + f.district + ' district<br><small style="color:#888">Manufacturing facility</small>');
  });

  /* legend */
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    var d = L.DomUtil.create('div', '');
    d.style.cssText = 'background:rgba(255,255,255,.95);padding:10px 14px;border-radius:8px;font:13px/1.8 sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.15)';
    d.innerHTML =
      '<div style="font-weight:700;margin-bottom:4px">Legend</div>' +
      '<div><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#e07b00;border:2px solid #fff;margin-right:6px;vertical-align:middle"></span>Factory</div>' +
      '<div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#2a9d4e;border:2px solid #fff;margin-right:8px;vertical-align:middle"></span>Project / delivery city</div>' +
      '<div><span style="display:inline-block;width:28px;height:4px;background:#e07b00;border-radius:2px;margin-right:6px;vertical-align:middle"></span>NH / road corridor</div>';
    return d;
  };
  legend.addTo(map);
});

})();
