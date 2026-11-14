// Highlight active section in nav
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.topnav a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--sand-dark)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// --- City map (Leaflet) --------------------------------------------------
const gmaps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q + ', Dortmund')}`;

const CATEGORIES = {
  home:  { label: 'Airbnb',              color: '#e8b84a', text: '#241d17', icon: '🏠' },
  food:  { label: 'Bier, eten & kroegen',color: '#8f2a2a', text: '#ffffff', icon: '🍺' },
  event: { label: 'Kerstmarkt & events', color: '#1f4d3a', text: '#ffffff', icon: '🎄' },
  sight: { label: 'Bezienswaardigheden', color: '#4a4a44', text: '#ffffff', icon: '★' },
  nature:{ label: 'Groen & uitwaaien',   color: '#6b8e23', text: '#ffffff', icon: '🌳' },
};

const PLACES = [
  { cat: 'home', lat: 51.5056, lng: 7.4781, name: 'Airbnb — Wenkerstraße 10',
    when: 'vr 14:00 – zo 11:00', note: 'Kaiserstraßenviertel, 15–20 min lopen naar het centrum.',
    link: gmaps('Wenkerstraße 10, 44141') },

  // Sights
  { cat: 'sight', lat: 51.5162, lng: 7.4579, name: 'Deutsches Fußballmuseum',
    when: 'vr 20 nov · 15:00', note: 'WK-bekers, Bundesliga-hal, 3D-cinema. Open tot 18:00.',
    link: 'https://www.fussballmuseum.de/' },
  { cat: 'sight', lat: 51.5150, lng: 7.4548, name: 'Dortmunder U',
    when: 'di–zo', note: 'Museum Ostwall (gratis) in de oude Union-brouwerij.',
    link: 'https://www.dortmunder-u.de/' },
  { cat: 'sight', lat: 51.4925, lng: 7.4519, name: 'Signal Iduna Park & Borusseum',
    when: 'za 21 nov · 11:00', note: 'Stadium Walk door kleedkamers en de Gelbe Wand. Start in de FanWelt (Strobelallee 54).',
    link: 'https://www.bvb.de/de/de/signal-iduna-park/stadiontouren.html' },
  { cat: 'sight', lat: 51.4886, lng: 7.4886, name: 'Phoenix des Lumières',
    when: 'hele weekend', note: 'Matisse + Frida Kahlo, immersief in de oude Hochofen-hal.',
    link: 'https://www.phoenix-lumieres.com/de' },
  { cat: 'sight', lat: 51.5188, lng: 7.3323, name: 'Zeche Zollern (LWL-Museum)',
    when: 'zo 22 nov · 10–18', note: '"Kasteel van de arbeid", Jugendstil-machinehal uit 1904.',
    link: 'https://www.lwl.org/industriemuseum/standorte/zeche-zollern' },
  { cat: 'sight', lat: 51.5241, lng: 7.4557, name: 'Brauerei-Museum',
    when: 'di–zo, gratis', note: 'Geschiedenis van Dortmund als bierhoofdstad, in de oude Hansa-brouwerij (Steigerstraße 16).',
    link: gmaps('Brauerei-Museum Dortmund Steigerstraße 16') },

  // Events
  { cat: 'event', lat: 51.5130, lng: 7.4646, name: 'Weihnachtsstadt — Hansaplatz & Alter Markt',
    when: 'vr & za 11–22 · zo dicht', note: '250+ kramen, de 45 m hoge kerstboom, glühwein uit de Jahresbecher.',
    link: 'https://www.weihnachtsstadt-do.de/' },
  { cat: 'event', lat: 51.4952, lng: 7.4583, name: 'Eissportzentrum Westfalen',
    when: 'vr 20 nov · 20:00', note: 'Eisadler Dortmund – Adendorfer EC. IJshockey, bier, herrie.',
    link: 'https://events.vereinsticket.de/eisadler/eisho-heimspiele/5241652' },
  { cat: 'event', lat: 51.5158, lng: 7.4637, name: 'domicil — Jazztage Dortmund',
    when: 'vr & za · 20:00', note: 'Julie Campiche / Nucleus (vr) · Fallen Crooner (za). Lounge Bar beneden.',
    link: 'https://www.domicil-dortmund.de/app.php/jazztage-dortmund.html' },
  { cat: 'event', lat: 51.5177, lng: 7.4651, name: 'Konzerthaus Dortmund',
    when: 'vr 20 nov · 20:00', note: 'DakhaBrakha — Oekraïens ethno-chaos.',
    link: 'https://www.konzerthaus-dortmund.de/' },
  { cat: 'event', lat: 51.5241, lng: 7.4667, name: 'Pauluskirche',
    when: 'vr 20 nov · 18:00', note: 'Candlelight: Ed Sheeran & Coldplay.',
    link: 'https://feverup.com/de/dortmund/candlelight' },
  { cat: 'event', lat: 51.5248, lng: 7.4490, name: 'Junkyard',
    when: 'za 21 nov', note: 'Soulbound & Hell Boulevard — metal aan de Hafen.',
    link: gmaps('Junkyard Schlägelstraße 57') },

  // Food & drink
  { cat: 'food', lat: 51.5125, lng: 7.4585, name: 'Hövels Hausbrauerei',
    when: 'vr diner', note: 'Oudste huisbrouwerij van Dortmund, Bitterbier en Westfaalse keuken.',
    link: 'https://www.hoevels-hausbrauerei.de/' },
  { cat: 'food', lat: 51.5137, lng: 7.4660, name: 'Wenkers am Markt',
    when: 'vr/za', note: 'Brouwerijkroeg op de Alter Markt, midden in de kerstmarkt.',
    link: 'https://www.wenkers.de/' },
  { cat: 'food', lat: 51.5131, lng: 7.4557, name: 'Bergmann Kiosk',
    when: 'za diner', note: 'Dortmunder craft-brouwerij: Export, Schwarzbier, worst & burgers.',
    link: 'https://www.bergmann-brauerei.de/kiosk' },
  { cat: 'food', lat: 51.4875, lng: 7.4900, name: 'Bergmann Brauerei (Phoenix-West)',
    when: 'optie', note: 'De brouwerij zelf, naast Phoenix des Lumières. Rondleiding + proeverij.',
    link: 'https://www.bergmann-brauerei.de/' },
  { cat: 'food', lat: 51.4942, lng: 7.4530, name: 'Strobels',
    when: 'za 15:30 · Gladbach–BVB', note: 'Dé BVB-fankroeg naast het stadion. Wedstrijd op groot scherm.',
    link: 'https://www.strobels-dortmund.de/' },
  { cat: 'food', lat: 51.5035, lng: 7.4532, name: 'Kreuzviertel',
    when: 'avonden', note: 'Kroegenbuurt: The Londoner, Grüner Salon, Sissikingkong, Olafs, Grammons.',
    link: gmaps('Kreuzviertel') },
  { cat: 'food', lat: 51.5176, lng: 7.4646, name: 'Brückstraßenviertel',
    when: 'za avond', note: 'Klubhaus, Collins, Prisma Lounge — uitgaan in het centrum.',
    link: gmaps('Brückstraße') },
  { cat: 'food', lat: 51.5260, lng: 7.4545, name: 'Subrosa (Hafen)',
    when: 'laat', note: 'Legendarische havenkroeg met ziel, live muziek.',
    link: gmaps('Subrosa Gneisenaustraße 56') },
  { cat: 'food', lat: 51.5094, lng: 7.4720, name: 'Kaiserstraße',
    when: 'ontbijt / 5 min van huis', note: 'Yamas, Brüderlich, Café Schrader, Küchenwirtschaft Bismarck.',
    link: 'https://www.kaiserstrasse-do.de/essen-trinken/' },

  // Nature
  { cat: 'nature', lat: 51.4966, lng: 7.4766, name: 'Westfalenpark & Florianturm',
    when: 'optie', note: '5 min van het huis. 200 m hoge tv-toren met uitzicht over het Ruhrgebiet.',
    link: 'https://www.westfalenpark.de/' },
  { cat: 'nature', lat: 51.4893, lng: 7.5141, name: 'Phoenix-See (Hörde)',
    when: 'zo 22 nov', note: 'Rondje van 3,2 km om het meer, koffie aan de kade.',
    link: 'https://www.phoenixsee.de/' },
];

function pinIcon(cat, label) {
  const c = CATEGORIES[cat];
  return L.divIcon({
    className: '',
    html: `<div class="pin" style="--pin:${c.color};--pin-text:${c.text}"><span>${label}</span></div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });
}

function buildLegend(groups) {
  const el = document.getElementById('map-legend');
  if (!el) return;
  el.innerHTML = '';
  Object.entries(CATEGORIES).forEach(([cat, c]) => {
    const items = groups[cat];
    if (!items || !items.length) return;
    const box = document.createElement('div');
    box.className = 'legend-group';
    box.innerHTML = `<h4><span class="legend-dot" style="background:${c.color};color:${c.text}">${c.icon}</span>${c.label}</h4>`;
    const ul = document.createElement('ul');
    items.forEach(({ place, marker, label }) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="legend-num" style="background:${c.color};color:${c.text}">${label}</span><a href="#kaart">${place.name}</a>`;
      li.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        marker._map && marker._map.flyTo(marker.getLatLng(), 15, { duration: 0.8 });
        marker.openPopup();
      });
      ul.appendChild(li);
    });
    box.appendChild(ul);
    el.appendChild(box);
  });
}

function initTripMap() {
  const el = document.getElementById('trip-map');
  if (!el || typeof L === 'undefined') return;

  const map = L.map('trip-map', { scrollWheelZoom: false, zoomControl: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  const layers = {};
  const groups = {};
  let n = 0;

  PLACES.forEach(place => {
    const c = CATEGORIES[place.cat];
    const label = place.cat === 'home' ? c.icon : String(++n);
    if (!layers[place.cat]) { layers[place.cat] = L.layerGroup().addTo(map); groups[place.cat] = []; }

    const marker = L.marker([place.lat, place.lng], {
      icon: pinIcon(place.cat, label),
      zIndexOffset: place.cat === 'home' ? 1000 : 0,
      title: place.name,
    });
    const isMaps = place.link.includes('google.com/maps');
    marker.bindPopup(
      `<div class="popup-cat" style="background:${c.color};color:${c.text}">${c.icon} ${c.label}</div>` +
      `<strong>${place.name}</strong>` +
      `<div class="popup-dates">${place.when}</div>` +
      `<p>${place.note}</p>` +
      `<div class="popup-links">` +
        (isMaps ? '' : `<a href="${place.link}" target="_blank" rel="noopener">🔗 Website</a>`) +
        `<a href="${isMaps ? place.link : gmaps(place.name)}" target="_blank" rel="noopener">📍 Google Maps</a>` +
      `</div>`
    );
    marker.addTo(layers[place.cat]);
    groups[place.cat].push({ place, marker, label });
  });

  // Looproute huis → Alter Markt (indicatief)
  L.polyline([[51.5056, 7.4781], [51.5090, 7.4720], [51.5120, 7.4680], [51.5137, 7.4660]], {
    color: '#241d17', weight: 6, opacity: 0.2, lineCap: 'round',
  }).addTo(map);
  L.polyline([[51.5056, 7.4781], [51.5090, 7.4720], [51.5120, 7.4680], [51.5137, 7.4660]], {
    color: '#e8b84a', weight: 4, opacity: 1, dashArray: '1 9', lineCap: 'round',
  }).addTo(map).bindTooltip('≈ 18 min lopen naar de Alter Markt', { sticky: true });

  const overlays = {};
  Object.entries(CATEGORIES).forEach(([cat, c]) => {
    if (layers[cat]) overlays[`<span class="layer-chip" style="background:${c.color};color:${c.text}">${c.icon}</span> ${c.label}`] = layers[cat];
  });
  L.control.layers(null, overlays, { collapsed: false, position: 'topright' }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);

  // Startview: stad zonder Zeche Zollern (ligt ver westelijk)
  const central = PLACES.filter(p => p.lng > 7.40).map(p => [p.lat, p.lng]);
  map.fitBounds(L.latLngBounds(central), { padding: [30, 30] });

  buildLegend(groups);

  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());
}

function loadLeafletThenInit() {
  if (typeof L !== 'undefined') { initTripMap(); return; }
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  s.onload = initTripMap;
  document.head.appendChild(s);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadLeafletThenInit);
} else {
  loadLeafletThenInit();
}
