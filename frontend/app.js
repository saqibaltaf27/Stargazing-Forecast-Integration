let isLoading = false;
let timeoutId = null;

async function fetchData(lat = null, lon = null) {
    if (isLoading) return;
    
    const content = document.getElementById("content");
    const refreshBtn = document.getElementById("refreshBtn");
    
    if (timeoutId) clearTimeout(timeoutId);
    
    isLoading = true;
    content.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>🔭 Fetching real-time celestial data...</p>
            <small style="color: #888; margin-top: 10px; display: block;">Getting location-based forecast</small>
        </div>
    `;
    if (refreshBtn) refreshBtn.disabled = true;

    try {
        if (!lat || !lon) {
            try {
                const position = await Promise.race([
                    getCurrentPosition(),
                    new Promise((_, reject) => 
                        timeoutId = setTimeout(() => reject(new Error("Location timeout")), 5000)
                    )
                ]);
                lat = position.latitude;
                lon = position.longitude;
            } catch (locationError) {
                console.warn("Location error, using default:", locationError);
                lat = 40.7128;
                lon = -74.0060;
            }
        }
        
        if (timeoutId) clearTimeout(timeoutId);
        
        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => controller.abort(), 10000);
        
        const res = await fetch(
            `http://localhost:5000/api/stargazing?lat=${lat}&lon=${lon}`,
            { signal: controller.signal }
        );
        
        clearTimeout(fetchTimeout);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();

        if (!data.success) throw new Error(data.message || "Failed to fetch data");
        
        render(data);
    } catch (error) {
        console.error("Fetch error:", error);
        
        let errorMessage = "Failed to load stargazing data";
        if (error.name === "AbortError") {
            errorMessage = "Request timeout - server might be slow";
        } else if (error.message.includes("Failed to fetch")) {
            errorMessage = "Cannot connect to server. Make sure the backend is running on port 5000";
        } else {
            errorMessage = error.message || "Failed to load stargazing data";
        }
        
        content.innerHTML = `
            <div class="error">
                <p>⚠️ ${errorMessage}</p>
                <p style="font-size: 12px; margin-top: 10px;">💡 Tips: Make sure backend server is running on port 5000</p>
                <button onclick="fetchData()" class="retry-btn">🔄 Retry</button>
            </div>
        `;
    } finally {
        isLoading = false;
        if (refreshBtn) refreshBtn.disabled = false;
        if (timeoutId) clearTimeout(timeoutId);
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
        }
        
        const geoTimeout = setTimeout(() => {
            reject(new Error("Location request timeout"));
        }, 5000);
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(geoTimeout);
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                clearTimeout(geoTimeout);
                let errorMsg = "Location access denied";
                if (error.code === 1) errorMsg = "Location permission denied";
                if (error.code === 2) errorMsg = "Location unavailable";
                if (error.code === 3) errorMsg = "Location timeout";
                reject(new Error(errorMsg));
            },
            { 
                timeout: 5000, 
                maximumAge: 300000,
                enableHighAccuracy: false
            }
        );
    });
}

function getMoonIcon(phase) {
    const phaseLower = phase.toLowerCase();
    if (phaseLower.includes("new")) return "🌑";
    if (phaseLower.includes("full")) return "🌕";
    if (phaseLower.includes("waxing crescent")) return "🌒";
    if (phaseLower.includes("first quarter")) return "🌓";
    if (phaseLower.includes("waxing gibbous")) return "🌔";
    if (phaseLower.includes("waning gibbous")) return "🌖";
    if (phaseLower.includes("last quarter")) return "🌗";
    if (phaseLower.includes("waning crescent")) return "🌘";
    return "🌙";
}

function render(data) {
    const stars = "★".repeat(data.score) + "☆".repeat(5 - data.score);
    
    const getCloudColor = (cloud) => {
        if (cloud > 80) return "#ff6b6b";
        if (cloud > 60) return "#ffa64d";
        if (cloud > 40) return "#ffd966";
        return "#90be6d";
    };
    
    // Show coordinates in display
    const coordsDisplay = data.coordinates ? 
        `<small style="color: #888; display: block; margin-bottom: 10px;">📍 ${data.coordinates.lat.toFixed(2)}°, ${data.coordinates.lon.toFixed(2)}°</small>` : '';
    
    document.getElementById("content").innerHTML = `
        ${coordsDisplay}
        ${data.locationName ? `<div class="location-badge">📍 ${data.locationName}</div>` : ''}
        
        <div class="moon-icon">${getMoonIcon(data.moonPhase)}</div>
        <h2 class="phase-name">${data.moonPhase}</h2>
        
        ${data.visibility ? `<div class="visibility-badge">${data.visibility}</div>` : ''}
        
        <div class="stats">
            <div class="stat">
                <span class="stat-label">🌙 Moon Illumination</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.moonIllumination}%"></div>
                </div>
                <span class="stat-value">${data.moonIllumination}%</span>
            </div>
            
            <div class="stat">
                <span class="stat-label">☁️ Cloud Cover</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.cloudCover}%; background: ${getCloudColor(data.cloudCover)}"></div>
                </div>
                <span class="stat-value">${data.cloudCover}%</span>
            </div>
        </div>
        
        <div class="score-section">
            <div class="stars">${stars}</div>
            <p class="score-text">Stargazing Quality: ${data.score}/5</p>
        </div>
        
        <div class="tips-section">
            <p class="tips-text">💡 ${data.tips}</p>
        </div>
    `;
}

window.setLocation = function(lat, lon) {
    const latInput = document.getElementById('customLat');
    const lonInput = document.getElementById('customLon');
    
    if (latInput && lonInput) {
        latInput.value = lat;
        lonInput.value = lon;
    }
    
    fetchData(lat, lon);
};

async function checkServerConnection() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        const res = await fetch('http://localhost:5000/api/stargazing?lat=40.7128&lon=-74.0060', {
            signal: controller.signal,
            method: 'HEAD'
        });
        
        clearTimeout(timeout);
        return res.ok;
    } catch (error) {
        return false;
    }
}

function addLocationSelector() {
    const card = document.querySelector('.card');
    const existingSelector = document.querySelector('.location-selector');
    
    if (!existingSelector) {
        const locationDiv = document.createElement('div');
        locationDiv.className = 'location-selector';
        locationDiv.innerHTML = `
            <details style="margin-bottom: 15px;">
                <summary style="cursor: pointer; color: #ffd966; font-size: 12px;">📍 Custom Location</summary>
                <div style="margin-top: 10px;">
                    <input type="text" id="customLat" placeholder="Latitude (e.g., 40.7128)" style="width: 48%; padding: 8px; margin-right: 4%; border-radius: 8px; border: none;">
                    <input type="text" id="customLon" placeholder="Longitude (e.g., -74.0060)" style="width: 48%; padding: 8px; border-radius: 8px; border: none;">
                    <button onclick="fetchCustomLocation()" style="margin-top: 10px; padding: 8px; background: #ffd966; color: #1a1f2e;">Go to Location</button>
                </div>
            </details>
        `;
        
        const button = card.querySelector('button');
        card.insertBefore(locationDiv, button);
    }
}

window.fetchCustomLocation = function() {
    const lat = parseFloat(document.getElementById('customLat').value);
    const lon = parseFloat(document.getElementById('customLon').value);
    
    if (!isNaN(lat) && !isNaN(lon)) {
        fetchData(lat, lon);
    } else {
        alert('Please enter valid latitude and longitude');
    }
};

function addLocationPresets() {
    const card = document.querySelector('.card');
    const existingPresets = document.querySelector('.location-presets');
    
    if (!existingPresets) {
        const presetsDiv = document.createElement('div');
        presetsDiv.className = 'location-presets';
        presetsDiv.innerHTML = `
            <h3>🌟 Best Stargazing Locations</h3>
            <div class="preset-buttons">
                <button onclick="setLocation(19.8207, -155.4681)" class="preset-btn">
                    🌋 Mauna Kea
                </button>
                <button onclick="setLocation(-23.5000, -68.5000)" class="preset-btn">
                    🏜️ Atacama
                </button>
                <button onclick="setLocation(36.2465, -116.8178)" class="preset-btn">
                    🏜️ Death Valley
                </button>
                <button onclick="setLocation(28.6806, -17.7656)" class="preset-btn">
                    🏝️ La Palma
                </button>
                <button onclick="setLocation(34.1500, 77.5700)" class="preset-btn">
                    🏔️ Ladakh
                </button>
                <button onclick="setLocation(41.6656, -77.8233)" class="preset-btn">
                    🌲 Cherry Springs
                </button>
            </div>
        `;
        
        const h1 = card.querySelector('h1');
        h1.insertAdjacentElement('afterend', presetsDiv);
    }
}

async function initialize() {
    addLocationSelector();
    addLocationPresets();
    
    const isServerReachable = await checkServerConnection();
    
    if (!isServerReachable) {
        document.getElementById("content").innerHTML = `
            <div class="error">
                <p>⚠️ Cannot connect to backend server</p>
                <p style="font-size: 12px; margin-top: 10px;">Make sure the server is running on port 5000:</p>
                <code style="display: block; background: #000; padding: 8px; border-radius: 5px; margin: 10px 0; font-size: 11px;">
                    cd your-project<br>
                    npm start
                </code>
                <button onclick="fetchData()" class="retry-btn">🔄 Retry</button>
            </div>
        `;
        return;
    }
    
    fetchData();
}

// Add new styles to CSS
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .location-badge {
            background: linear-gradient(135deg, #ffd96620, #ffb34720);
            border: 1px solid #ffd96640;
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 12px;
            text-align: center;
            margin: 10px 0;
            display: inline-block;
            width: auto;
        }
        
        .visibility-badge {
            background: #ffd96620;
            border-radius: 20px;
            padding: 8px 12px;
            font-size: 14px;
            text-align: center;
            margin: 10px 0;
            font-weight: bold;
        }
        
        .location-presets {
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .location-presets h3 {
            font-size: 14px;
            color: #ffd966;
            margin-bottom: 12px;
            text-align: center;
        }
        
        .preset-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
        }
        
        .preset-btn {
            background: rgba(255, 215, 0, 0.15);
            border: 1px solid rgba(255, 215, 0, 0.3);
            color: #ffd966;
            padding: 6px 12px;
            font-size: 12px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0;
            width: auto;
            display: inline-block;
        }
        
        .preset-btn:hover {
            background: rgba(255, 215, 0, 0.3);
            transform: translateY(-2px);
        }
        
        .location-selector details summary {
            font-size: 12px;
        }
        
        .location-selector input {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 8px;
        }
        
        .location-selector input:focus {
            outline: none;
            border-color: #ffd966;
        }
    `;
    document.head.appendChild(style);
}

// Run initialization with styles
addStyles();
initialize();