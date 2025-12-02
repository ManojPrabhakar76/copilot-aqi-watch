export interface Location {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface AQIData {
  aqi: number;
  category: string;
  prominentPollutant: string;
  europeanAqi: number;
  europeanCategory: string;
  components: {
    co: number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
    so2: number;
  };
  subIndices: {
    pm2_5: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
  };
  timestamp: Date;
}
