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
function initTripMap() {
  const el = document.getElementById('trip-map');
  if (!el || typeof L === 'undefined') return;

  const home = {
    lat: 51.5056, lng: 7.4781,
    name: 'Airbnb — Wenkerstraße 10',
    note: 'Check-in vr 20 nov 14:00 · check-out zo 22 nov 11:00. Kaiserstraßenviertel, 15–20 min lopen naar het centrum.'
  };

  const spots = [
    { n: 1, lat: 51.5162, lng: 7.4579, name: 'Hauptbahnhof & Deutsches Fußballmuseum',
      dates: 'vr 20 nov · 15:00', note: 'WK-bekers, Bundesliga-hal, 3D-cinema. Open tot 18:00.' },
    { n: 2, lat: 51.5130, lng: 7.4646, name: 'Weihnachtsstadt — Hansaplatz & Alter Markt',
      dates: 'vr & za 11–22 uur · zo dicht', note: '250+ kramen, de 45 m hoge kerstboom, glühwein uit de Jahresbecher. Hövels en Wenkers om de hoek.' },
    { n: 3, lat: 51.5150, lng: 7.4548, name: 'Dortmunder U',
      dates: 'di–zo', note: 'Museum Ostwall (gratis), kunst en het icoon van de oude Union-brouwerij.' },
    { n: 4, lat: 51.4925, lng: 7.4519, name: 'Signal Iduna Park & Borusseum',
      dates: 'za 21 nov · 11:00', note: 'Stadium Walk door kleedkamers en de Gelbe Wand. Strobels ernaast voor Gladbach–BVB om 15:30.' },
    { n: 5, lat: 51.4952, lng: 7.4583, name: 'Eissportzentrum Westfalen',
      dates: 'vr 20 nov · 20:00', note: 'Eisadler Dortmund – Adendorfer EC. Ijshockey, bier, herrie.' },
    { n: 6, lat: 51.5158, lng: 7.4637, name: 'domicil — Jazztage Dortmund',
      dates: 'vr 20 & za 21 nov · 20:00', note: 'Julie Campiche / Nucleus (vr) · Fallen Crooner (za). Lounge Bar beneden.' },
    { n: 7, lat: 51.5035, lng: 7.4532, name: 'Kreuzviertel',
      dates: 'avonden', note: 'Kroegenbuurt: The Londoner, Grüner Salon, Sissikingkong, Olafs, Grammons.' },
    { n: 8, lat: 51.4966, lng: 7.4766, name: 'Westfalenpark & Florianturm',
      dates: 'optie', note: '5 min van het huis. 200 m hoge tv-toren met uitzicht over het Ruhrgebiet.' },
    { n: 9, lat: 51.4886, lng: 7.4886, name: 'Phoenix des Lumières',
      dates: 'hele weekend', note: 'Matisse + Frida Kahlo, immersief in de oude Hochofen-hal. Bergmann Brauerei ernaast.' },
    { n: 10, lat: 51.4893, lng: 7.5141, name: 'Phoenix-See (Hörde)',
      dates: 'zo 22 nov', note: 'Rondje van 3,2 km om het meer, koffie aan de kade.' },
    { n: 11, lat: 51.5188, lng: 7.3323, name: 'Zeche Zollern (LWL-Museum)',
      dates: 'zo 22 nov · 10–18', note: '"Kasteel van de arbeid", Jugendstil-machinehal uit 1904. Op de route naar huis.' },
  ];

  const map = L.map('trip-map', { scrollWheelZoom: false, zoomControl: true });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  const homeIcon = L.divIcon({
    className: '',
    html: '<div class="trip-marker start" title="Airbnb">🏠</div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
  L.marker([home.lat, home.lng], { icon: homeIcon, zIndexOffset: 1000 })
    .addTo(map)
    .bindPopup(`<strong>${home.name}</strong><div class="popup-dates">Wenkerstraße 10, 44141 Dortmund</div>${home.note}`);

  spots.forEach(s => {
    const icon = L.divIcon({
      className: '',
      html: `<div class="trip-marker">${s.n}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
    L.marker([s.lat, s.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${s.name}</strong><div class="popup-dates">${s.dates}</div>${s.note}`);
  });

  // Zeche Zollern ligt ver weg — centreer op de stad en laat Zollern buiten de startview.
  const central = [home, ...spots.filter(s => s.n !== 11)].map(p => [p.lat, p.lng]);
  map.fitBounds(L.latLngBounds(central), { padding: [40, 40] });

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
