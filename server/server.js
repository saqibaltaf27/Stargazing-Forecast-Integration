require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { getAstronomyData } = require("./services/astronomyService");
const { calculateScore } = require("./utils/stargazingScore");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/stargazing", async (req, res) => {
    try{
        const lat = parseFloat(req.query.lat) || parseFloat(process.env.DEFAULT_LAT);
        const lon = parseFloat(req.query.lon) || parseFloat(process.env.DEFAULT_LON);

        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({
                success: false,
                message: "Valid latitude and longitude are required"
            });
        }

        console.log(`Fetching data for coordinates: ${lat}, ${lon}`);

        const data = await getAstronomyData(lat, lon);

        const score = calculateScore(
            data.cloudCover,
            data.moonIllumination
        );

        res.json({
            success: true,
            moonPhase: data.moonPhase,
            moonIllumination: data.moonIllumination,
            cloudCover: data.cloudCover,
            temperature: data.temperature,
            locationName: data.locationName,
            visibility: data.visibility,
            score,
            coordinates: { lat, lon },
            tips: getStargazingTips(data.cloudCover, data.moonIllumination, score, data.locationName)
        });
    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch astronomy data. Please try again."
        });
    }
});

function getStargazingTips(cloudCover, illumination, score, locationName) {
    if (cloudCover > 80) return `☁️ Heavy cloud cover at ${locationName} - stargazing conditions are poor. Best to wait for clearer skies.`;
    if (cloudCover > 60) return `⛅ Partly cloudy at ${locationName} - you might catch glimpses of brighter stars and planets.`;
    if (cloudCover > 40) return `🌤️ Some clouds present at ${locationName} - good conditions for stargazing with occasional obstructions.`;
    if (cloudCover > 20) return `✨ Mostly clear at ${locationName} - excellent conditions for stargazing!`;
    
    if (illumination > 90) return `🌕 Full moon bright at ${locationName} - best for moon viewing, less ideal for faint stars.`;
    if (illumination > 70) return `🌖 Bright moon at ${locationName} - great for moon observation, stars may be dimmer.`;
    if (illumination < 10) return `🌑 New moon at ${locationName} - perfect dark sky conditions for deep sky objects!`;
    
    return `🌟 ${score === 5 ? 'Perfect' : 'Good'} conditions at ${locationName} - great time for stargazing!`;
}

app.listen(PORT, () => {
    console.log(`✨ Stargazing Server running on http://localhost:${PORT}`);
});