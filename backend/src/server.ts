import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// OpenWeatherMap API (free tier) - replace with your API key
const WEATHER_API_KEY = 'e3ad9af94c0dad94b4a76833133ac1ec';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Search locations by name
app.get('/api/locations/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await axios.get(
      `${WEATHER_BASE_URL}/find?q=${query}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const locations = response.data.list.map((item: any) => ({
      id: item.id,
      name: item.name,
      country: item.sys.country,
      lat: item.coord.lat,
      lon: item.coord.lon
    }));

    res.json(locations);
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
});

// Get AQI data for a location
app.get('/api/aqi/:lat/:lon', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.params;

    const response = await axios.get(
      `${WEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );

    const aqiData = response.data.list[0];
    const europeanAqi = aqiData.main.aqi;
    const components = aqiData.components;

    // Calculate Indian AQI
    const indianAqi = calculateIndianAQI(components);

    const aqiInfo = {
      aqi: indianAqi.aqi,
      category: indianAqi.category,
      prominentPollutant: indianAqi.prominentPollutant,
      europeanAqi: europeanAqi,
      europeanCategory: getEuropeanAQICategory(europeanAqi),
      components: {
        co: components.co,
        no2: components.no2,
        o3: components.o3,
        pm2_5: components.pm2_5,
        pm10: components.pm10,
        so2: components.so2
      },
      subIndices: indianAqi.subIndices,
      timestamp: new Date()
    };

    res.json(aqiInfo);
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    res.status(500).json({ error: 'Failed to fetch AQI data' });
  }
});

// Calculate Indian AQI
function calculateIndianAQI(components: any) {
  const subIndices = {
    pm2_5: calculateSubIndex(components.pm2_5, PM25_BREAKPOINTS),
    pm10: calculateSubIndex(components.pm10, PM10_BREAKPOINTS),
    no2: calculateSubIndex(components.no2, NO2_BREAKPOINTS),
    so2: calculateSubIndex(components.so2, SO2_BREAKPOINTS),
    co: calculateSubIndex(components.co / 1000, CO_BREAKPOINTS), // Convert μg/m³ to mg/m³
    o3: calculateSubIndex(components.o3, O3_BREAKPOINTS)
  };

  // Find maximum sub-index (prominent pollutant)
  let maxAqi = 0;
  let prominentPollutant = '';

  Object.entries(subIndices).forEach(([pollutant, value]) => {
    if (value > maxAqi) {
      maxAqi = value;
      prominentPollutant = pollutant.toUpperCase().replace('_', '.');
    }
  });

  return {
    aqi: Math.round(maxAqi),
    category: getIndianAQICategory(maxAqi),
    prominentPollutant,
    subIndices
  };
}

// Indian AQI Breakpoints (24-hour average)
const PM25_BREAKPOINTS = [
  { low: 0, high: 30, aqiLow: 0, aqiHigh: 50 },
  { low: 31, high: 60, aqiLow: 51, aqiHigh: 100 },
  { low: 61, high: 90, aqiLow: 101, aqiHigh: 200 },
  { low: 91, high: 120, aqiLow: 201, aqiHigh: 300 },
  { low: 121, high: 250, aqiLow: 301, aqiHigh: 400 },
  { low: 251, high: 380, aqiLow: 401, aqiHigh: 500 }
];

const PM10_BREAKPOINTS = [
  { low: 0, high: 50, aqiLow: 0, aqiHigh: 50 },
  { low: 51, high: 100, aqiLow: 51, aqiHigh: 100 },
  { low: 101, high: 250, aqiLow: 101, aqiHigh: 200 },
  { low: 251, high: 350, aqiLow: 201, aqiHigh: 300 },
  { low: 351, high: 430, aqiLow: 301, aqiHigh: 400 },
  { low: 431, high: 510, aqiLow: 401, aqiHigh: 500 }
];

const NO2_BREAKPOINTS = [
  { low: 0, high: 40, aqiLow: 0, aqiHigh: 50 },
  { low: 41, high: 80, aqiLow: 51, aqiHigh: 100 },
  { low: 81, high: 180, aqiLow: 101, aqiHigh: 200 },
  { low: 181, high: 280, aqiLow: 201, aqiHigh: 300 },
  { low: 281, high: 400, aqiLow: 301, aqiHigh: 400 },
  { low: 401, high: 520, aqiLow: 401, aqiHigh: 500 }
];

const SO2_BREAKPOINTS = [
  { low: 0, high: 40, aqiLow: 0, aqiHigh: 50 },
  { low: 41, high: 80, aqiLow: 51, aqiHigh: 100 },
  { low: 81, high: 380, aqiLow: 101, aqiHigh: 200 },
  { low: 381, high: 800, aqiLow: 201, aqiHigh: 300 },
  { low: 801, high: 1600, aqiLow: 301, aqiHigh: 400 },
  { low: 1601, high: 2100, aqiLow: 401, aqiHigh: 500 }
];

const CO_BREAKPOINTS = [
  { low: 0, high: 1.0, aqiLow: 0, aqiHigh: 50 },
  { low: 1.1, high: 2.0, aqiLow: 51, aqiHigh: 100 },
  { low: 2.1, high: 10, aqiLow: 101, aqiHigh: 200 },
  { low: 11, high: 17, aqiLow: 201, aqiHigh: 300 },
  { low: 18, high: 34, aqiLow: 301, aqiHigh: 400 },
  { low: 35, high: 50, aqiLow: 401, aqiHigh: 500 }
];

const O3_BREAKPOINTS = [
  { low: 0, high: 50, aqiLow: 0, aqiHigh: 50 },
  { low: 51, high: 100, aqiLow: 51, aqiHigh: 100 },
  { low: 101, high: 168, aqiLow: 101, aqiHigh: 200 },
  { low: 169, high: 208, aqiLow: 201, aqiHigh: 300 },
  { low: 209, high: 748, aqiLow: 301, aqiHigh: 400 },
  { low: 749, high: 1000, aqiLow: 401, aqiHigh: 500 }
];

function calculateSubIndex(concentration: number, breakpoints: any[]): number {
  if (concentration < 0) return 0;

  for (let bp of breakpoints) {
    if (concentration >= bp.low && concentration <= bp.high) {
      const aqiRange = bp.aqiHigh - bp.aqiLow;
      const concRange = bp.high - bp.low;
      const concDiff = concentration - bp.low;
      return bp.aqiLow + (aqiRange / concRange) * concDiff;
    }
  }

  // If concentration exceeds all breakpoints, return max AQI
  return 500;
}

function getIndianAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

function getEuropeanAQICategory(aqi: number): string {
  const categories = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  return categories[aqi - 1] || 'Unknown';
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
