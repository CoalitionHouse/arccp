/* map.js v3.2 — wire NH-5 and corridors to route-*.geojson filenames */
(function () {

var MAP_DATA_DELIVERY_CITIES = [
  { name: 'Raipur',       state: 'Chhattisgarh',   lat: 21.2514, lon: 81.6296, spoke_km: 90, bearing: 25 },
  { name: 'Rayagada',     state: 'Odisha',         lat: 19.1700, lon: 83.4100, spoke_km: 70, bearing: 320 },
  { name: 'Bhubaneswar',  state: 'Odisha',         lat: 20.2961, lon: 85.8245, spoke_km: 80, bearing: 70 },
  { name: 'Bengaluru',    state: 'Karnataka',      lat: 12.9716, lon: 77.5946, spoke_km: 100, bearing: 340 },
  { name: 'Anantapur',    state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006, spoke_km: 60, bearing: 115 },
  { name: 'Kadapa',       state: 'Andhra Pradesh', lat: 14.4673, lon: 78.8242, spoke_km: 50, bearing: 300 },
  { name: 'Sri City',     state: 'Andhra Pradesh', lat: 13.4000, lon: 80.0000, spoke_km: 70, bearing: 45 }
];

var MAP_DATA_PROJECT_CITIES = [
  { client:'L&T',                work:'Industrial Utility Pipeline, Krishna',                 state:'Andhra Pradesh', lat:16.5062, lon:80.6480, length_m:5400,  dia_mm:1000, cls:'NP3', year:2019, spoke_km:50, bearing:15 },
  { client:'NCC',                work:'Urban Storm Drainage, Warangal',                       state:'Telangana',      lat:17.9784, lon:79.5941, length_m:6900,  dia_mm:900,  cls:'NP3', year:2017, spoke_km:60, bearing:210 },
  { client:'MEIL',               work:'Irrigation Pressure Main, East Godavari',              state:'Andhra Pradesh', lat:16.9891, lon:82.2475, length_m:9600,  dia_mm:1000, cls:'P2',  year:2018, spoke_km:70, bearing:350 },
  { client:'APSIDC',             work:'Lift Irrigation Scheme, Kurnool',                      state:'Andhra Pradesh', lat:15.8281, lon:78.0373, length_m:12000, dia_mm:1200, cls:'P3', year:2016, spoke_km:80, bearing:145 },
  { client:'NTPC',               work:'Plant Utility Drainage, Hyderabad',                    state:'Telangana',      lat:17.4399, lon:78.3489, length_m:3600,  dia_mm:700,  cls:'NP3', year:2014, spoke_km:50, bearing:300 },
  { client:'Tata Projects',      work:'Infrastructure Drainage Works, Hyderabad region',      state:'Telangana',      lat:17.3800, lon:78.4800, length_m:4200,  dia_mm:800,  cls:'NP3', year:2017, spoke_km:50, bearing:30 },
  { client:'Shapoorji Pallonji', work:'Building Services Drainage, Hyderabad region',         state:'Telangana',      lat:17.4500, lon:78.3800, length_m:2800,  dia_mm:600,  cls:'NP2', year:2016, spoke_km:50, bearing:110 },
  { client:'Dilip Buildcon',     work:'Highway Drainage, East Godavari',                      state:'Andhra Pradesh', lat:17.3616, lon:82.5449, length_m:4700,  dia_mm:900,  cls:'NP3', year:2017, spoke_km:60, bearing:290 },
  { client:'Madhucon',           work:'Road Cross Drainage, Vizianagaram',                    state:'Andhra Pradesh', lat:18.1100, lon:83.3900, length_m:3900,  dia_mm:700,  cls:'NP3', year:2015, spoke_km:50, bearing:200 },
  { client:'Leighton',           work:'Infrastructure Package, Andhra Pradesh',               state:'Andhra Pradesh', lat:16.3000, lon:80.4500, length_m:5100,  dia_mm:900,  cls:'NP4', year:2013, spoke_km:60, bearing:315 },
  { client:'Punj Lloyd',         work:'Pipeline Works, Krishna',                              state:'Andhra Pradesh', lat:16.4000, lon:80.5000, length_m:4400,  dia_mm:800,  cls:'NP3', year:2012, spoke_km:50, bearing:250 },
  {
    client:'AP R&B / GVMC',
    work:'Madhurawada–Bheemili Coastal Road (~25 km)',
    state:'Andhra Pradesh',
    lat:17.8600,
    lon:83.3950,
    length_m:25000,
    dia_mm:'600–900',
    cls:'NP3',
    year:'2015–2019',
    spoke_km:25,
    bearing:45,
    routeFile:'assets/routes/route-2.geojson'
  },
  {
    client:'Visakhapatnam Steel Plant & Port belt',
    work:'Plant utilities and drainage around VSP, Gangavaram and Visakhapatnam city',
    state:'Andhra Pradesh',
    lat:17.70,
    lon:83.24,
    length_m:null,
    dia_mm:'600–1200',
    cls:'NP3/NP4',
    year:'multiple years',
    spoke_km:40,
    bearing:60,
    routeFile:'assets/routes/route-3.geojson'
  },
  {
    client:'Old Gajuwaka industrial belt',
    work:'Industrial drainage and pipelines over years in Old Gajuwaka belt',
    state:'Andhra Pradesh',
    lat:17.68,
    lon:83.03,
    length_m:null,
    dia_mm:'600–1000',
    cls:'NP3',
    year:'multiple years',
    spoke_km:35,
    bearing:240,
    routeFile:'assets/routes/route-4.geojson'
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
  var half = (km / 111);
  var rad = (bearingDeg || 0) * Math.PI / 180;
  var dx = Math.cos(rad) * half;
  var dy = Math.sin(rad) * half;
  var pr = rad + Math.PI / 2;
  var px = Math.cos(pr) * half * 0.5;
  var py = Math.sin(pr) * half * 0.5;

  var mid = [lat, lon];
  var p1 = [mid[0] - dy * 0.6 - py, mid[1] - dx * 0.6 - px];
  var p2 = [mid[0] + py,           mid[1] + px];
  var p3 = [mid[0] + dy * 0.6 + py, mid[1] + dx * 0.6 + px];

  L.polyline([p1, p2, p3], {
    color:'#f58a1f', weight:4, opacity:0.95, lineCap:'round', lineJoin:'round'
  }).addTo(map);
}

function loadCorridorGeoJSON(map, corridor) {
  if (!corridor.routeFile) return;
  fetch(corridor.routeFile)
    .then(function (resp) { return resp.json(); })
    .then(function (geo) {
      L.geoJSON(geo, {
        style: function () {
          return { color: corridor.color, weight: 9, opacity: 0.18, lineCap:'round', lineJoin:'round' };
        }
      }).addTo(map);
      var line = L.geoJSON(geo, {
        style: function () {
          return { color: corridor.color, weight: 4, opacity: 0.9, lineCap:'round', lineJoin:'round' };
        }
      }).addTo(map);
      var lenLabel = fmtLen(corridor.length_m);
      var clsDia = corridor.cls + ' · ø' + corridor.dia_mm + 'mm';
      var meta = clsDia + (lenLabel ? ' · ' + lenLabel : '') + ' · ' + corridor.year;
      line.bindPopup('<b>' + corridor.label + '</b><br><span style="color:#444">' + corridor.client + '</span><br>' +
        '<span style="font-size:.88em;color:#666">' + corridor.work + '</span><br>' +
        '<span style="color:#e07b00;font-weight:600">' + meta + '</span>');
    })
    .catch(function (err) {
      console.error('Failed to load corridor route', corridor.routeFile, err);
    });
}

function drawRoadForLocation(map, loc) {
  if (loc.routeFile) {
    fetch(loc.routeFile)
      .then(function (resp) { return resp.json(); })
      .then(function (geo) {
        L.geoJSON(geo, {
          style: function () {
            return { color: '#f58a1f', weight: 4, opacity: 0.9, lineCap:'round', lineJoin:'round' };
          }
        }).addTo(map);
      })
      .catch(function (err) {
        console.error('Failed to load project route', loc.routeFile, err);
      });
    return;
  }

  var km = loc.spoke_km || 60;
  var bearing = loc.bearing || 0;
  if (loc.road_path && loc.road_path.length >= 2) {
    L.polyline(loc.road_path, {
      color:'#ffffff', weight:5, opacity:0.9, lineCap:'round', lineJoin:'round', dashArray:'6,4'
    }).addTo(map);
  } else {
    addRoadSegment(map, loc.lat, loc.lon, km, bearing);
  }
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

  MAP_DATA.factories.forEach(function (f) {
    var boost = /Velvadam/.test(f.name) ? 1.25 : 1.0;
    [{m:0.45,o:0.08},{m:0.80,o:0.05},{m:1.20,o:0.025}].forEach(function (ring) {
      L.circle([f.lat, f.lon], {
        radius: MAP_DATA.supply_radius_km * 1000 * ring.m * boost, color:'transparent',
        fillColor:'#e07b00', fillOpacity:ring.o, weight:0, interactive:false
      }).addTo(map);
    });
    L.circleMarker([f.lat, f.lon], {
      radius:6, color:'#c06000', fillColor:'#f5a623', fillOpacity:0.95, weight:2
    }).addTo(map).bindPopup('<b>Factory</b><br>' + f.name + '<br><em>' + f.district + ' District</em>');
  });

  MAP_DATA.corridors.forEach(function (c) {
    if (c.routeFile) {
      loadCorridorGeoJSON(map, c);
    } else if (c.waypoints && c.waypoints.length) {
      var ll = c.waypoints.map(function (w) { return [w[0], w[1]]; });
      L.polyline(ll, { color:c.color, weight:9, opacity:0.18, lineCap:'round', lineJoin:'round' }).addTo(map);
      var line = L.polyline(ll, { color:c.color, weight:4, opacity:0.9, lineCap:'round', lineJoin:'round' }).addTo(map);
      var lenLabel = fmtLen(c.length_m);
      var clsDia = c.cls + ' · ø' + c.dia_mm + 'mm';
      var meta = clsDia + (lenLabel ? ' · ' + lenLabel : '') + ' · ' + c.year;
      line.bindPopup('<b>' + c.label + '</b><br><span style="color:#444">' + c.client + '</span><br>' +
        '<span style="font-size:.88em;color:#666">' + c.work + '</span><br>' +
        '<span style="color:#e07b00;font-weight:600">' + meta + '</span>');
    }
  });

  MAP_DATA.delivery_cities.forEach(function (c) {
    var icon = L.divIcon({
      className: '',
      html: '<div style="width:11px;height:11px;background:#0e9a6e;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
      iconSize:[11,11], iconAnchor:[5,5]
    });
    L.marker([c.lat, c.lon], { icon:icon }).addTo(map)
      .bindPopup('<b>Project / Delivery region</b><br>' + c.name + ', ' + c.state + '<br><span style="color:#e07b00;font-size:.88em">Approx. ' + c.spoke_km + ' km of pipe supplied</span>');
    drawRoadForLocation(map, c);
  });

  MAP_DATA.project_cities.forEach(function (p) {
    var icon = L.divIcon({
      className: '',
      html: '<div style="width:11px;height:11px;background:#0e9a6e;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
      iconSize:[11,11], iconAnchor:[5,5]
    });
    L.marker([p.lat, p.lon], { icon:icon }).addTo(map)
      .bindPopup('<b>' + p.client + '</b><br><span style="font-size:.88em">' + p.work + '</span><br>' +
        (function () {
          var lenLabel = fmtLen(p.length_m);
          var clsDia = p.cls + ' · ø' + p.dia_mm + 'mm';
          var meta = clsDia + (lenLabel ? ' · ' + lenLabel : '') + ' · ' + p.year;
          return '<span style="color:#e07b00;font-weight:600">' + meta + '</span>';
        })());
    drawRoadForLocation(map, p);
  });

  var legend = L.control({ position:'bottomright' });
  legend.onAdd = function () {
    var div = L.DomUtil.create('div');
    div.setAttribute('style','background:rgba(255,255,255,0.97);padding:10px 14px;border-radius:8px;font:12px/2 -apple-system,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.22);min-width:200px;pointer-events:none');
    function dot(bg) { return '<span style="display:inline-block;width:10px;height:10px;background:'+bg+';border-radius:50%;border:2px solid #fff;box-sizing:border-box;vertical-align:middle;margin-right:7px"></span>'; }
    function bar(bg) { return '<span style="display:inline-block;width:22px;height:4px;background:'+bg+';border-radius:2px;vertical-align:middle;margin-right:7px"></span>'; }
    div.innerHTML =
      '<div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#111">Map Legend</div>' +
      bar('#e07b00')+'<span style="color:#111">NH & project corridors</span><br>'+
      dot('#f5a623')+'<span style="color:#111">Factory</span><br>'+
      dot('#0e9a6e')+'<span style="color:#111">Project / delivery location</span><br>'+
      '<span style="display:inline-block;width:22px;height:5px;background:#ffffff;border-radius:2px;border:1px solid #f58a1f;vertical-align:middle;margin-right:7px"></span><span style="color:#111">Pipe length / city network along road (~25–100 km)</span><br>'+
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
