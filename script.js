// EcoVibe Kenya LPG Tracking System
console.log('EcoVibe Kenya script loading...');

// Real LPG locations in Kenya
const kenyaLPGData = {
  cities: [
    { name: 'Nairobi', lat: -1.2921, lng: 36.8219, population: 4500000 },
    { name: 'Mombasa', lat: -4.0435, lng: 39.6682, population: 1200000 },
    { name: 'Nakuru', lat: -0.3031, lng: 36.0800, population: 570000 },
    { name: 'Eldoret', lat: 0.5143, lng: 35.2697, population: 475000 },
    { name: 'Kisumu', lat: -0.1022, lng: 34.7617, population: 410000 },
    { name: 'Thika', lat: -1.0332, lng: 37.0830, population: 280000 },
    { name: 'Malindi', lat: -3.2175, lng: 40.1169, population: 120000 },
    { name: 'Kitale', lat: 1.0157, lng: 35.0062, population: 110000 },
    { name: 'Garissa', lat: -0.4536, lng: 39.6401, population: 180000 },
    { name: 'Kakamega', lat: 0.2827, lng: 34.7519, population: 190000 }
  ],
  
  distributors: [
    {
      name: 'TotalEnergies Kenya',
      locations: ['Nairobi', 'Mombasa', 'Nakuru', 'Eldoret', 'Kisumu'],
      cylinders: [6, 13, 50],
      contact: '+254-711-039-000'
    },
    {
      name: 'SupaGas (National Oil)',
      locations: ['Nairobi', 'Mombasa', 'Nakuru', 'Thika', 'Malindi'],
      cylinders: [3, 6, 13, 50],
      contact: '+254-711-039-111'
    },
    {
      name: 'Gas Yetu Project',
      locations: ['Nairobi', 'Kajiado', 'Machakos', 'Kiambu'],
      cylinders: [6],
      contact: '+254-711-039-222'
    },
    {
      name: 'BOC Kenya Limited',
      locations: ['Nairobi', 'Mombasa', 'Nakuru'],
      cylinders: [13, 50],
      contact: '+254-711-039-333'
    },
    {
      name: 'Capital Gas Cooperative',
      locations: ['Nairobi', 'Thika', 'Embu'],
      cylinders: [6, 13],
      contact: '+254-711-039-444'
    }
  ]
};

// Generate realistic LPG cylinder data for Kenya
function generateKenyaCylinderData() {
  const statuses = ['IN_SERVICE', 'EMPTY', 'IN_TRANSIT', 'REFILLING'];
  const cylinders = [];
  let cylinderId = 1;

  kenyaLPGData.distributors.forEach(distributor => {
    distributor.locations.forEach(locationName => {
      const city = kenyaLPGData.cities.find(c => c.name === locationName);
      if (!city) return;

      // Generate 3-5 cylinders per distributor per location
      const numCylinders = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numCylinders; i++) {
        const cylinderSize = distributor.cylinders[Math.floor(Math.random() * distributor.cylinders.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const fillLevel = status === 'EMPTY' ? Math.floor(Math.random() * 10) : 
                         status === 'IN_SERVICE' ? Math.floor(Math.random() * 40) + 60 :
                         Math.floor(Math.random() * 100);

        cylinders.push({
          id: `KE${cylinderId.toString().padStart(4, '0')}`,
          tagId: `QR-KE-${cylinderId}`,
          serial: `${distributor.name.replace(/\s/g, '').substring(0, 3).toUpperCase()}-${city.name.substring(0, 3).toUpperCase()}-${cylinderId}`,
          status: status,
          capacityKg: cylinderSize,
          fillLevel: fillLevel,
          location: {
            lat: city.lat + (Math.random() - 0.5) * 0.1, // Add some variation
            lng: city.lng + (Math.random() - 0.5) * 0.1,
            name: city.name,
            county: getCountyFromCity(city.name)
          },
          distributor: distributor.name,
          lastReading: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
          price: calculatePrice(cylinderSize, distributor.name)
        });
        cylinderId++;
      }
    });
  });

  return cylinders;
}

function getCountyFromCity(cityName) {
  const countyMap = {
    'Nairobi': 'Nairobi',
    'Mombasa': 'Mombasa', 
    'Nakuru': 'Nakuru',
    'Eldoret': 'Uasin Gishu',
    'Kisumu': 'Kisumu',
    'Thika': 'Kiambu',
    'Malindi': 'Kilifi',
    'Kitale': 'Trans-Nzoia',
    'Garissa': 'Garissa',
    'Kakamega': 'Kakamega'
  };
  return countyMap[cityName] || cityName;
}

function calculatePrice(size, distributor) {
  const basePrices = { 3: 1200, 6: 2000, 13: 3200, 50: 8500 }; // KSh
  const distributorMultipliers = {
    'TotalEnergies Kenya': 1.1,
    'SupaGas (National Oil)': 1.0,
    'Gas Yetu Project': 0.8, // Subsidized
    'BOC Kenya Limited': 1.05,
    'Capital Gas Cooperative': 0.95
  };
  
  return Math.round(basePrices[size] * (distributorMultipliers[distributor] || 1.0));
}

// Global variables
let currentUser = null;
let currentPage = 'landing';
let kenyaCylinders = [];
let kenyaMap = null;
let kenyaMarkers = [];

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing Kenya LPG system...');
  
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
    initApp();
  }, 900);
});

function initApp() {
  console.log('Initializing EcoVibe Kenya...');
  
  // Generate Kenya cylinder data
  kenyaCylinders = generateKenyaCylinderData();
  console.log(`Generated ${kenyaCylinders.length} LPG cylinders across Kenya`);
  
  // Initialize event listeners
  initEventListeners();
  
  console.log('Kenya LPG system initialized successfully');
}

function initEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.dataset.page;
      navigateToPage(page);
    });
  });

  // Authentication
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Dashboard refresh
  const refreshBtn = document.getElementById('refresh-data');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      refreshDashboard();
    });
  }

  // Filters
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', filterCylinders);
  }

  const distributorFilter = document.getElementById('distributor-filter');
  if (distributorFilter) {
    distributorFilter.addEventListener('change', filterCylinders);
  }

  const searchInput = document.getElementById('search-cylinders');
  if (searchInput) {
    searchInput.addEventListener('input', filterCylinders);
  }

  // QR scan button
  const scanBtn = document.getElementById('scan-qr-btn');
  if (scanBtn) {
    scanBtn.addEventListener('click', openQRModal);
  }

  // QR modal close
  const qrModalClose = document.getElementById('qr-modal-close');
  if (qrModalClose) {
    qrModalClose.addEventListener('click', closeQRModal);
  }

  // Chatbot send
  const sendMsgBtn = document.getElementById('send-message');
  const chatbotInput = document.getElementById('chatbot-input');
  if (sendMsgBtn && chatbotInput) {
    sendMsgBtn.addEventListener('click', sendChatMessage);
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  // Chatbot minimize
  const minimizeBtn = document.getElementById('minimize-chatbot');
  const chatbotContainer = document.getElementById('chatbot-container');
  if (minimizeBtn && chatbotContainer) {
    minimizeBtn.addEventListener('click', () => {
      chatbotContainer.classList.toggle('minimized');
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    // init theme from localStorage
    const saved = localStorage.getItem('gw-theme');
    if (saved === 'dark') document.body.classList.add('dark');
    updateThemeIcon();
  }
}

function navigateToPage(pageId) {
  console.log(`Navigating to ${pageId}`);
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show target page
  const targetPage = document.getElementById(`${pageId}-page`);
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = pageId;
  }

  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`[data-page="${pageId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Show/hide header
  const header = document.getElementById('header');
  if (pageId === 'landing') {
    header.classList.remove('visible');
  } else {
    header.classList.add('visible');
  }

  // Initialize page-specific functionality
  switch(pageId) {
    case 'dashboard':
      initDashboard();
      break;
    case 'cylinders':
      loadCylinders();
      break;
    case 'distributors':
      loadDistributors();
      break;
  }
}

function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  if (!email || !password || !role) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  currentUser = {
    email: email,
    role: role,
    name: email.split('@')[0]
  };

  // Update UI
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('logout-btn').style.display = 'block';

  navigateToPage('dashboard');
  showNotification(`Karibu ${currentUser.name}! Welcome to GreenWells Kenya`, 'success');
}

function handleLogout() {
  currentUser = null;
  document.getElementById('user-name').textContent = 'Guest';
  document.getElementById('logout-btn').style.display = 'none';
  
  // Clear form
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('role').value = '';
  
  navigateToPage('landing');
  showNotification('Kwaheri! Logged out successfully', 'info');
}

function initDashboard() {
  console.log('Initializing Kenya LPG dashboard...');
  
  updateKPIs();
  initKenyaMap();
  updateLiveFeed();
  initDistributionChart();
}

function updateKPIs() {
  const totalCylinders = kenyaCylinders.length;
  const activeDistributors = kenyaLPGData.distributors.length;
  const pendingDeliveries = Math.floor(totalCylinders * 0.15); // Estimate
  const coverageRate = Math.round((kenyaLPGData.cities.length / 47) * 100); // 47 counties

  document.getElementById('total-cylinders').textContent = totalCylinders;
  document.getElementById('active-distributors').textContent = activeDistributors;
  document.getElementById('pending-deliveries').textContent = pendingDeliveries;
  document.getElementById('coverage-rate').textContent = `${coverageRate}%`;
}

function initKenyaMap() {
  const mapContainer = document.getElementById('kenya-lpg-map');
  if (!mapContainer) return;

  // if map already exists, remove markers & reuse map
  if (kenyaMap) {
    // remove existing markers
    kenyaMarkers.forEach(m => {
      try { kenyaMap.removeLayer(m); } catch(e) {}
    });
    kenyaMarkers = [];
  } else {
    // Initialize map centered on Kenya
    kenyaMap = L.map('kenya-lpg-map').setView([-0.0236, 37.9062], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(kenyaMap);
  }

  // Add cylinder markers with Kenya-specific styling
  const statusColors = {
    'IN_SERVICE': '#198754', // Green
    'EMPTY': '#fd7e14',      // Orange  
    'IN_TRANSIT': '#0ea5e9', // Blue
    'REFILLING': '#dc3545'   // Red
  };

  kenyaCylinders.forEach(cylinder => {
    const marker = L.circleMarker([cylinder.location.lat, cylinder.location.lng], {
      color: statusColors[cylinder.status],
      fillColor: statusColors[cylinder.status],
      fillOpacity: 0.8,
      radius: Math.log(cylinder.capacityKg) * 3,
      weight: 2
    }).addTo(kenyaMap);

    marker.bindPopup(`
      <div style="font-family: Arial, sans-serif;">
        <h4 style="margin: 0 0 8px 0; color: #1e7e34;">${cylinder.serial}</h4>
        <p style="margin: 2px 0;"><strong>Distributor:</strong> ${cylinder.distributor}</p>
        <p style="margin: 2px 0;"><strong>Status:</strong> ${cylinder.status.replace('_', ' ')}</p>
        <p style="margin: 2px 0;"><strong>Capacity:</strong> ${cylinder.capacityKg}kg</p>
        <p style="margin: 2px 0;"><strong>Fill Level:</strong> ${cylinder.fillLevel}%</p>
        <p style="margin: 2px 0;"><strong>Location:</strong> ${cylinder.location.name}, ${cylinder.location.county}</p>
        <p style="margin: 2px 0;"><strong>Price:</strong> KSh ${cylinder.price.toLocaleString()}</p>
      </div>
    `);

    kenyaMarkers.push(marker);
  });

  // Add major city markers (distinct icons)
  kenyaLPGData.cities.forEach(city => {
    const cityMarker = L.marker([city.lat, city.lng]).addTo(kenyaMap)
      .bindPopup(`<h4>${city.name}</h4><p>Population: ${city.population.toLocaleString()}</p>`);
    kenyaMarkers.push(cityMarker);
  });
}

function initDistributionChart() {
  const canvas = document.getElementById('distribution-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');
  
  // Count cylinders by distributor
  const distributorCounts = kenyaCylinders.reduce((counts, cylinder) => {
    const distributor = cylinder.distributor.split(' ')[0]; // Shorten names
    counts[distributor] = (counts[distributor] || 0) + 1;
    return counts;
  }, {});

  // destroy existing chart if any (safe guard)
  if (canvas._chartInstance) {
    canvas._chartInstance.destroy();
  }

  canvas._chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(distributorCounts),
      datasets: [{
        data: Object.values(distributorCounts),
        backgroundColor: [
          '#1e7e34', '#28a745', '#fd7e14', '#0ea5e9', '#dc3545'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function loadCylinders() {
  const grid = document.getElementById('cylinders-grid');
  if (!grid) return;

  grid.innerHTML = kenyaCylinders.map(cylinder => createCylinderCard(cylinder)).join('');
}

function createCylinderCard(cylinder) {
  const statusColors = {
    'IN_SERVICE': 'success',
    'EMPTY': 'warning', 
    'IN_TRANSIT': 'info',
    'REFILLING': 'danger'
  };

  return `
    <div class="cylinder-card">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <h3 style="margin: 0; color: var(--text-primary);">${cylinder.serial}</h3>
        <span class="status-badge" style="padding: 0.25rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; background: var(--${statusColors[cylinder.status]}-color); color: white;">
          ${cylinder.status.replace('_', ' ')}
        </span>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-secondary);">Fill Level:</span>
          <span style="font-weight: 500;">${cylinder.fillLevel}%</span>
        </div>
        <div style="background: var(--bg-secondary); border-radius: 10px; height: 8px; overflow: hidden;">
          <div style="width: ${cylinder.fillLevel}%; height: 100%; background: ${cylinder.fillLevel > 20 ? 'var(--success-color)' : 'var(--warning-color)'}; transition: width 0.3s ease;"></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem;">
        <div>
          <span style="color: var(--text-secondary);">Capacity:</span><br>
          <span style="font-weight: 500;">${cylinder.capacityKg}kg</span>
        </div>
        <div>
          <span style="color: var(--text-secondary);">Price:</span><br>
          <span style="font-weight: 500;">KSh ${cylinder.price.toLocaleString()}</span>
        </div>
      </div>

      <div style="margin-bottom: 1rem;">
        <span style="color: var(--text-secondary);">Distributor:</span><br>
        <span style="font-weight: 500;">${cylinder.distributor}</span>
      </div>

      <div style="margin-bottom: 1rem;">
        <span style="color: var(--text-secondary);">Location:</span><br>
        <span style="font-weight: 500;">${cylinder.location.name}, ${cylinder.location.county}</span>
      </div>

      <div style="display: flex; gap: 0.5rem;">
        <button class="btn-primary" style="flex: 1; font-size: 0.9rem;" onclick="viewCylinder('${cylinder.id}')">
          <i class="fas fa-eye"></i> View
        </button>
        <button class="btn-secondary" style="flex: 1; font-size: 0.9rem;" onclick="trackCylinder('${cylinder.id}')">
          <i class="fas fa-map-marker-alt"></i> Track
        </button>
      </div>
    </div>
  `;
}

function loadDistributors() {
  const grid = document.getElementById('distributors-grid');
  if (!grid) return;

  grid.innerHTML = kenyaLPGData.distributors.map(distributor => createDistributorCard(distributor)).join('');
}

function createDistributorCard(distributor) {
  const cylinderCount = kenyaCylinders.filter(c => c.distributor === distributor.name).length;
  
  return `
    <div class="distributor-card">
      <h3 style="margin: 0 0 1rem 0; color: var(--primary-color);">${distributor.name}</h3>
      
      <div style="margin-bottom: 1rem;">
        <span style="color: var(--text-secondary);">Active Cylinders:</span><br>
        <span style="font-weight: 500; font-size: 1.2rem;">${cylinderCount}</span>
      </div>

      <div style="margin-bottom: 1rem;">
        <span style="color: var(--text-secondary);">Cylinder Sizes:</span><br>
        <span style="font-weight: 500;">${distributor.cylinders.join('kg, ')}kg</span>
      </div>

      <div style="margin-bottom: 1rem;">
        <span style="color: var(--text-secondary);">Coverage:</span><br>
        <span style="font-weight: 500;">${distributor.locations.length} locations</span>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <span style="color: var(--text-secondary);">Contact:</span><br>
        <span style="font-weight: 500;">${distributor.contact}</span>
      </div>

      <div style="font-size: 0.9rem; color: var(--text-secondary);">
        <strong>Locations:</strong> ${distributor.locations.join(', ')}
      </div>
    </div>
  `;
}

function filterCylinders() {
  const statusFilter = document.getElementById('status-filter')?.value || '';
  const distributorFilter = document.getElementById('distributor-filter')?.value || '';
  const searchTerm = document.getElementById('search-cylinders')?.value.toLowerCase() || '';

  let filteredCylinders = kenyaCylinders;

  if (statusFilter) {
    filteredCylinders = filteredCylinders.filter(c => c.status === statusFilter);
  }

  if (distributorFilter) {
    filteredCylinders = filteredCylinders.filter(c => c.distributor.includes(distributorFilter));
  }

  if (searchTerm) {
    filteredCylinders = filteredCylinders.filter(c => 
      c.serial.toLowerCase().includes(searchTerm) ||
      c.location.name.toLowerCase().includes(searchTerm) ||
      c.location.county.toLowerCase().includes(searchTerm)
    );
  }

  const grid = document.getElementById('cylinders-grid');
  if (grid) {
    grid.innerHTML = filteredCylinders.map(cylinder => createCylinderCard(cylinder)).join('');
  }
}

function updateLiveFeed() {
  const feedContainer = document.getElementById('events-feed');
  if (!feedContainer) return;

  const events = [
    '🏢 TotalEnergies Nairobi: 15 cylinders refilled',
    '🚛 SupaGas delivery to Mombasa completed',
    '⚠️ Low inventory alert in Eldoret region',
    '📱 Gas Yetu: 8 new registrations in Kiambu',
    '🔄 BOC Kenya: Scheduled maintenance in Nakuru',
    '📍 New distribution point opened in Garissa',
    '💰 Price update: 6kg cylinders now KSh 2,000',
    '🎯 Monthly target: 85% achieved nationwide'
  ];

  feedContainer.innerHTML = events.map(event => `
    <div style="padding: 0.8rem; border-bottom: 1px solid var(--border-color);">
      <div style="font-weight: 500;">${event}</div>
      <div style="font-size: 0.8rem; color: var(--text-secondary);">${new Date().toLocaleTimeString()}</div>
    </div>
  `).join('');
}

function refreshDashboard() {
  showNotification('Refreshing Kenya LPG data...', 'info');
  
  setTimeout(() => {
    updateKPIs();
    updateLiveFeed();
    initDistributionChart();
    showNotification('Dashboard updated successfully', 'success');
  }, 1500);
}

function viewCylinder(cylinderId) {
  const cylinder = kenyaCylinders.find(c => c.id === cylinderId);
  if (cylinder) {
    showNotification(`Viewing ${cylinder.serial} in ${cylinder.location.name}`, 'info');
  }
}

function trackCylinder(cylinderId) {
  const cylinder = kenyaCylinders.find(c => c.id === cylinderId);
  if (cylinder) {
    showNotification(`Tracking ${cylinder.serial} - ${cylinder.distributor}`, 'info');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    color: white;
    font-weight: 500;
    z-index: 3000;
    max-width: 300px;
    animation: slideIn 0.3s ease;
  `;

  const colors = {
    success: '#198754',
    error: '#dc3545', 
    warning: '#fd7e14',
    info: '#0ea5e9'
  };
  
  notification.style.background = colors[type] || colors.info;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add required animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

console.log('EcoVibe Kenya LPG system loaded successfully');

/* ----------------------------
   Additional Integration Code
   - QR / Barcode Scanner (html5-qrcode)
   - Chat assistant frontend (calls /api/chat)
   - QR modal open/close binding
   - Dark / Light theme toggle
   ---------------------------- */

let html5QrcodeScannerInstance = null;
const qrModal = document.getElementById('qr-scanner-modal');
const qrResultEl = document.getElementById('qr-result');

// Open QR modal and start camera scanner
function openQRModal() {
  if (!qrModal) return;
  qrModal.classList.add('active');
  startScanner();
}

function closeQRModal() {
  if (!qrModal) return;
  qrModal.classList.remove('active');
  stopScanner();
}

function startScanner() {
  const qrReaderDiv = document.getElementById('qr-reader');
  if (!qrReaderDiv) return;

  // If already running, skip
  if (html5QrcodeScannerInstance) return;

  // Use Html5Qrcode to scan both QR and barcodes
  // create new Html5Qrcode instance (element id must match)
  html5QrcodeScannerInstance = new Html5Qrcode("qr-reader");

  const config = { fps: 10, qrbox: { width: 250, height: 250 }, formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.UPC_A ] };

  html5QrcodeScannerInstance.start(
    { facingMode: "environment" }, // prefer back camera
    config,
    (decodedText, decodedResult) => {
      // success callback
      console.log("Scan success:", decodedText);
      if (qrResultEl) qrResultEl.textContent = `Scanned: ${decodedText}`;
      // optionally stop scanning after first result
      // stopScanner();
      // You may automatically search/lookup cylinder by tag here
    },
    (errorMessage) => {
      // parse error, do nothing
      // console.warn("QR scan error", errorMessage);
    }
  ).catch(err => {
    console.error("Unable to start scanner", err);
    showNotification('Unable to access camera for QR scanner. Check permissions.', 'error');
  });
}

function stopScanner() {
  if (!html5QrcodeScannerInstance) return;
  html5QrcodeScannerInstance.stop().then(() => {
    html5QrcodeScannerInstance.clear();
    html5QrcodeScannerInstance = null;
    // clear qr-reader div content
    const qrReaderDiv = document.getElementById('qr-reader');
    if (qrReaderDiv) qrReaderDiv.innerHTML = '';
  }).catch(err => {
    console.warn("Error stopping scanner:", err);
  });
}

/* Chat assistant frontend logic (calls /api/chat) */
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const sendMessageBtn = document.getElementById('send-message');

async function sendChatMessage() {
  const text = chatbotInput.value && chatbotInput.value.trim();
  if (!text) return;
  appendChatMessage(text, 'user');
  chatbotInput.value = '';
  // show loading bot message
  const loadingId = appendChatMessage('...', 'bot', true);

  try {
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await resp.json();
    const reply = data.reply || 'No response from AI.';
    updateChatMessage(loadingId, reply);
  } catch (err) {
    console.error('Chat error:', err);
    updateChatMessage(loadingId, 'Error connecting to AI backend.');
  }
}

function appendChatMessage(text, who = 'bot', isLoading = false) {
  if (!chatbotMessages) return null;
  const div = document.createElement('div');
  div.classList.add('message');
  div.classList.add(who === 'user' ? 'user-message' : 'bot-message');
  div.textContent = text;
  if (isLoading) div.dataset.loading = 'true';
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return div; // return element so it can be updated
}

function updateChatMessage(el, newText) {
  if (!el) return;
  el.textContent = newText;
  delete el.dataset.loading;
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/* Theme toggle */
function toggleTheme() {
  document.body.classList.toggle('dark');
  const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('gw-theme', mode);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (document.body.classList.contains('dark')) {
    icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
  }
}

/* Clean up when leaving page or unloading */
window.addEventListener('beforeunload', () => {
  stopScanner();
});
document.getElementById('ai-send').addEventListener('click', async () => {
  const input = document.getElementById('ai-input');
  const message = input.value.trim();
  if (!message) return;

  // Show user message
  const messagesDiv = document.getElementById('ai-messages');
  const userMsgDiv = document.createElement('div');
  userMsgDiv.textContent = `You: ${message}`;
  messagesDiv.appendChild(userMsgDiv);

  input.value = '';

  try {
    const response = await fetch('http://localhost:3000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();

    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.textContent = `AI: ${data.response}`;
    messagesDiv.appendChild(aiMsgDiv);

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    const errDiv = document.createElement('div');
    errDiv.textContent = 'Error connecting to AI backend.';
    messagesDiv.appendChild(errDiv);
  }
});

console.log('Additional EcoVibe Kenya integrations loaded');
// EcoVibe Kenya LPG Tracking System 
