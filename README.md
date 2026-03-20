# 🌟 Stargazing Forecast Application

A beautiful, real-time stargazing quality forecast application that provides users with detailed information about current celestial conditions, including moon phase, cloud cover, and a personalized stargazing score.


## ✨ Features

- **Real-time Data**: Fetches live weather data and calculates moon phases based on your location
- **Location-based Forecast**: Get personalized stargazing quality scores for any location worldwide
- **Stargazing Score**: Intelligent scoring system (1-5 stars) based on:
  - Cloud cover percentage
  - Moon illumination
  - Geographic location characteristics
- **Beautiful UI**: Responsive design with animated starfield, moon phases, and smooth transitions
- **Preset Locations**: Quick access to world-famous stargazing spots
- **Custom Location Support**: Enter any coordinates to check stargazing conditions
- **Detailed Tips**: Get helpful recommendations based on current conditions

## 🚀 Live Demo

The application consists of two parts:
- **Backend API**: Node.js/Express server running on port 5000
- **Frontend**: Static HTML/CSS/JS client
- **Vercel**: https://stargazing-forecast-integration.vercel.app/

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 
- **npm** 
- A modern web browser (Chrome, Firefox, Safari, Edge)
- **Git** (for cloning the repository)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/saqibaltaf27/Stargazing-Forecast-Integration.git
cd stargazing-forecast
```

### 2. Install Dependencies
npm install

This will install the following dependencies:
    express - Web server framework
    cors - Cross-origin resource sharing
    axios - HTTP client for API requests
    dotenv - Environment variable management

### 3. Set Up Environment Variables
Create a .env file in the root directory:
touch .env

- Open the .env file and add the following configuration:
```TXT
# Server Configuration
PORT=5000

# Default Location (New York City)
DEFAULT_LAT=40.7128
DEFAULT_LON=-74.0060

# Astronomy API Credentials 
ASTRO_API_KEY=your_api_key_here
ASTRO_API_SECRET=your_api_secret_here
```
## AstronomyAPI

If you want enhanced accuracy, you can add AstronomyAPI.com:

1. Create an account at AstronomyAPI.com
2. Create an application (name, url).
3. Enter demo url like (http://stargazing.example.com)
3. Get your credentials from the dashboard:
    - API Key (Application ID)
    - API Secret
4. Add to .env file:
    - ASTRO_API_KEY=your_actual_api_key
    - ASTRO_API_SECRET=your_actual_api_secret

## Running The Application
1. Backend:
node server/server.js

It will run backend server.
You will see:
✨ Stargazing Server running on http://localhost:5000
Test with: http://localhost:5000/api/stargazing?lat=40.7128&lon=-74.0060


2. Frontend:
Right click on index.html in frontend directory and click open with live server.
it will open the UI in Default browser.

---

## API Endpoint

GET /api/stargazing
Fetches stargazing forecast for a location.
Sample Request:
```bash
curl "http://localhost:5000/api/stargazing?lat=40.7128&lon=-74.0060"
```

Response:
```JSON
{
  "success": true,
  "moonPhase": "Waxing Gibbous",
  "moonIllumination": 72,
  "cloudCover": 45,
  "temperature": 18.5,
  "locationName": "Temperate Northern Coastal Region",
  "visibility": "Good 🌟🌟🌟🌟",
  "score": 4,
  "coordinates": {
    "lat": 40.7128,
    "lon": -74.0060
  },
  "tips": "🌤️ Some clouds present at Temperate Northern Coastal Region - good conditions for stargazing with occasional obstructions."
}
```

---

## Testing Different Locations
Using the Frontend UI:
1. Click on preset location buttons (Mauna Kea, Atacama, etc.)
2. Enter custom coordinates in the "Custom Location" section
4. Allow geolocation for automatic location detection

Famous Stargazing Locations to Test:
Location	            Latitude	Longitude	Expected Score
Mauna Kea, Hawaii	    19.8207	    -155.4681	 5 stars
Atacama Desert, Chile	-23.5000	-68.5000	 5 stars
Death Valley, USA	     36.2465	-116.8178	 4-5 stars
La Palma, Spain	         28.6806	-17.7656	 4-5 stars
Ladakh, India	         34.1500	 77.5700	 4 stars
Cherry Springs, USA	     41.6656	 -77.8233	 4 stars
London, UK	             51.5074	 -0.1278	 1-2 stars
Seattle, USA	         47.6062	 -122.3321	 2-3 stars

---

## Stargazing Score Logic
The score (1-5 stars) is calculated using:

Base Score based on Cloud Cover:

- Cloud > 80%: 1 star
- Cloud > 60%: 2 stars
- Cloud > 40%: 3 stars
- Cloud > 20%: 4 stars
- Cloud ≤ 20%: 5 stars

Penalties for Moon Brightness:
- Illumination > 70%: -1 star
-Illumination > 90%: -1 star (additional)
-Minimum Score: 1 star

---

## Location-Based Cloud Estimation
The application uses intelligent location-based algorithms:

Desert regions: 10-25% cloud cover

Coastal areas: 50-70% cloud cover

High altitude: 15-30% cloud cover

Equatorial regions: 50-80% cloud cover

Famous stargazing spots: Prioritized for clear conditions

Seasonal adjustments: Based on hemisphere and time of year

---

## Deployment
1. Github (https://github.com/saqibaltaf27/Stargazing-Forecast-Integration.git)
2. Vercel (https://stargazing-forecast-integration.vercel.app/)