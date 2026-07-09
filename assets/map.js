/* map.js v3.5 — corrected directional bearings for all stubs */
(function () {

// Multi-stub helper: draw multiple direction stubs from same point
function addMultiStub(map, lat, lon, km, bearings) {
  bearings.forEach(function (b) {
    var half = km / 111;
    var rad = b * Math.PI / 180;
    var dx = Math.sin(rad) * half;
    var dy = Math.cos(rad) * half;
    L.polyline([[lat, lon], [lat + dy, lon + dx]], {
      color:'#f58a1f', weight:4, opacity:0.95, lineCap:'round', lineJoin:'round'
    }).addTo(map);
  });
}

var MAP_DATA_DELIVERY_CITIES = [
  // Raipur: NH-30 runs NE-SW through Raipur
  { name: 'Raipur',       state: 'Chhattisgarh',   lat: 21.2514, lon: 81.6296, spoke_km: 90,  bearing: 225 },
  // Rayagada: NH-326 runs roughly N-S
  { name: 'Rayagada',     state: 'Odisha',         lat: 19.1700, lon: 83.4100, spoke_km: 70,  bearing: 180 },
  // Bhubaneswar → toward Brahmapur (south-southwest on NH-16/NH-16 coastal)
  { name: 'Bhubaneswar',  state: 'Odisha',         lat: 20.2961, lon: 85.8245, spoke_km: 80,  bearing: 220 },
  // Bengaluru: NH-44 runs N-S
  { name: 'Bengaluru',    state: 'Karnataka',      lat: 12.9716, lon: 77.5946, spoke_km: 100, bearing: 0   },
  // Anantapur → toward Kurnool (northeast ~45°)
  { name: 'Anantapur',    state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006, spoke_km: 60,  bearing: 45  },
  // Kadapa: SH runs roughly N-S
  { name: 'Kadapa',       state: 'Andhra Pradesh', lat: 14.4673, lon: 78.8242, spoke_km: 50,  bearing: 0   },
  // Sri City: NH-16 runs NE here, but also a road diverting toward Tirupati (west)
  // Two stubs: one north (NH-16 toward Chennai ~0°), one toward Tirupati (west ~270°)
  { name: 'Sri City',     state: 'Andhra Pradesh', lat: 13.4000, lon: 80.0000, spoke_km: 55,  bearing: 0,   extra_bearings: [270] }
];

var MAP_DATA_PROJECT_CITIES = [
  { client:'L&T',                work:'Industrial Utility Pipeline, Krishna',                 state:'Andhra Pradesh', lat:16.5062, lon:80.6480, length_m:5400,  dia_mm:1000, cls:'NP3', year:2019, spoke_km:50, bearing:15 },
  { client:'NCC',                work:'Urban Storm Drainage, Warangal',                       state:'Telangana',      lat:17.9784, lon:79.5941, length_m:6900,  dia_mm:900,  cls:'NP3', year:2017, spoke_km:60, bearing:75 },
  { client:'MEIL',               work:'Irrigation Pressure Main, East Godavari',              state:'Andhra Pradesh', lat:16.9891, lon:82.2475, length_m:9600,  dia_mm:1000, cls:'P2',  year:2018, spoke_km:70, bearing:350 },
  // Kurnool → toward Anantapur (southwest ~220°)
  { client:'APSIDC',             work:'Lift Irrigation Scheme, Kurnool',                      state:'Andhra Pradesh', lat:15.8281, lon:78.0373, length_m:12000, dia_mm:1200, cls:'P3', year:2016, spoke_km:80, bearing:220 },
  // Hyderabad (NTPC) → toward Vijayawada (southeast ~135°)
  { client:'NTPC',               work:'Plant Utility Drainage, Hyderabad',                    state:'Telangana',      lat:17.4399, lon:78.3489, length_m:3600,  dia_mm:700,  cls:'NP3', year:2014, spoke_km:50, bearing:135, extra_bearings:[75, 225] },
  // Hyderabad (Tata) → toward Warangal (east ~75°)
  { client:'Tata Projects',      work:'Infrastructure Drainage Works, Hyderabad region',      state:'Telangana',      lat:17.3800, lon:78.4800, length_m:4200,  dia_mm:800,  cls:'NP3', year:2017, spoke_km:50, bearing:75 },
  // Hyderabad (Shapoorji) → toward Kurnool (southwest ~225°)
  { client:'Shapoorji Pallonji', work:'Building Services Drainage, Hyderabad region',         state:'Telangana',      lat:17.4500, lon:78.3800, length_m:2800,  dia_mm:600,  cls:'NP2', year:2016, spoke_km:50, bearing:225 },
  // Kakinada → toward Vijayawada (southwest ~240°)
  { client:'Dilip Buildcon',     work:'Highway Drainage, East Godavari',                      state:'Andhra Pradesh', lat:16.9517, lon:82.2373, length_m:4700,  dia_mm:900,  cls:'NP3', year:2017, spoke_km:60, bearing:240 },
  // Vizianagaram → toward Rayagada (north ~340°)
  { client:'Madhucon',           work:'Road Cross Drainage, Vizianagaram',                    state:'Andhra Pradesh', lat:18.1100, lon:83.3900, length_m:3900,  dia_mm:700,  cls:'NP3', year:2015, spoke_km:50, bearing:340 },
  { client:'Leighton',           work:'Infrastructure Package, Andhra Pradesh',               state:'Andhra Pradesh', lat:16.3000, lon:80.4500, length_m:5100,  dia_mm:900,  cls:'NP4', year:2013, spoke_km:60, bearing:315 },
  { client:'Punj Lloyd',         work:'Pipeline Works, Krishna',                              state:'Andhra Pradesh', lat:16.4000, lon:80.5000, length_m:4400,  dia_mm:800,  cls:'NP3', year:2012, spoke_km:50, bearing:250 },
  {
    client:'AP R&B / GVMC',
    work:'Madhurawada–Bheemili Coastal Road (~25 km)',
    state:'Andhra Pradesh',
    lat:17.8600, lon:83.3950,
    length_m:25000, dia_mm:'600–900', cls:'NP3', year:'2015–2019',
    spoke_km:25, bearing:45,
    routeFile:'assets/routes/route-2.geojson'
  },
  {
    client:'Visakhapatnam Steel Plant & Port belt',
    work:'Plant utilities and drainage around VSP, Gangavaram and Visakhapatnam city',
    state:'Andhra Pradesh',
    lat:17.70, lon:83.24,
    length_m:null, dia_mm:'600–1200', cls:'NP3/NP4', year:'multiple years',
    spoke_km:40, bearing:60,
    routeFile:'assets/routes/route-3.geojson'
  },
  {
    client:'Old Gajuwaka industrial belt',
    work:'Industrial drainage and pipelines over years in Old Gajuwaka belt',
    state:'Andhra Pradesh',
    lat:17.68, lon:83.03,
    length_m:null, dia_mm:'600–1000', cls:'NP3', year:'multiple years',
    spoke_km:35, bearing:240,
    routeFile:'assets/routes/route-4.geojson'
  },
  // Tuni → toward Kakinada (southeast ~130°)
  {
    client:'NH-5 works near Tuni',
    work:'Road drainage works near Tuni on NH-5 corridor',
    state:'Andhra Pradesh',
    lat:17.3600, lon:82.5500,
    length_m:null, dia_mm:'600–900', cls:'NP3', year:'pre-2010',
    spoke_km:55, bearing:130
  }
];

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
      label: 'Raipur–Visakhapatnam corridor',
      client: 'Expressway / NH works',
      work: 'Pipe supply along Raipur–Visakhapatnam corridor alignment',
      cls: 'NP3/NP4', dia_mm: '600–1200', length_m: null, year: 'ongoing',
      color: '#e07b00',
      routeFile: 'assets/routes/route-5.geojson'
    },
    {
      label: 'NH-5 Ichchapuram–Tuni (~330 km)',
      client: 'NHAI',
      work: 'National Highway NH-5: Cross-drainage culverts & RCC pipe supply, Odisha border (Ichchapuram) to Tuni',
      cls: 'NP3/NP4', dia_mm: '600–1200', length_m: 330000, year: 'pre-2010',
      color: '#e07b00',
      routeFile: 'assets/routes/route-1.geojson',
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
      label: 'Dindi–Digamarru–Losari NH-216 (~80 km)',
      client: 'SIBMOST–TATA JV',
      work: 'Rehabilitation and upgradation of Dindi–Digamarru–Losari section of NH-216',
      cls: 'NP4', dia_mm: '1200', length_m: 80000, year: 2017,
      color: '#e07b00',
      waypoints: [
        [16.5500,81.2500],[16.5750,81.2800],[16.6000,81.3100],[16.6300,81.3400]
      ]
    },
    {
      label: 'Visakhapatnam Steel Plant–Gangavaram Belt (~40 km)',
      client: 'VSP / Gangavaram Port / EPCs',
      work: 'Plant utility, drainage and port works around VSP and Gangavaram port',
      cls: 'NP3/NP4', dia_mm: '600–1200', length_m: 40000, year: '2014–2018',
      color: '#e07b00',
      waypoints: [
        [17.7700,83.2300],[17.7350,83.2450],[17.7000,83.2550],[17.6600,83.2550]
      ]
    },
    {
      label: 'Madhurawada–Bheemili Coastal Road (~25 km)',
      client: 'AP R&B / GVMC',
      work: 'Coastal corridor and urban drainage along Madhurawada–Bheemili road',
      cls: 'NP3', dia_mm: '600–900', length_m: 25000, year: '2015–2019',
      color: '#e07b00',
      routeFile: 'assets/routes/route-2.geojson'
    }
  ],
  delivery_cities: MAP_DATA_DELIVERY_CITIES,
  project_cities: MAP_DATA_PROJECT_CITIES
};

function fmtLen(m) {
  if (!m || m <= 0) return '';
  return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m';
}

function addRoadSegment(map, lat, lon, km, bearingDeg) {
  var half = km / 111;
  var rad = bearingDeg * Math.PI / 180;
  var dx = Math.sin(rad) * half;
  var dy = Math.cos(rad) * half;
  L.polyline([[lat, lon], [lat + dy, lon + dx]], {
    color:'#f58a1f', weight:4, opacity:0.95, lineCap:'round', lineJoin:'round'
  }).addTo(map);
}

function loadCorridorGeoJSON(map, corridor) {
  if (!corridor.routeFile) return;
  fetch(corridor.routeFile)
    .then(function (resp) { return resp.json(); })
    .then(function (geo) {
      L.geoJSON(geo, { style: function () { return { color: corridor.color, weight: 9, opacity: 0.18, lineCap:'round', lineJoin:'round' }; } }).addTo(map);
      var line = L.geoJSON(geo, { style: function () { return { color: corridor.color, weight: 4, opacity: 0.9, lineCap:'round', lineJoin:'round' }; } }).addTo(map);
      var lenLabel = fmtLen(corridor.length_m);
      var clsDia = corridor.cls + ' · ø' + corridor.dia_mm + 'mm';
      var meta = clsDia + (lenLabel ? ' · ' + lenLabel : '') + ' · ' + corridor.year;
      line.bindPopup('<b>' + corridor.label + '</b><br><span style="color:#444": 