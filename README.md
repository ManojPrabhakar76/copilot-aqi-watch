# AQI Monitor Project

A full-stack Air Quality Index monitoring application built with Angular, Express.js, TypeScript, and Bootstrap.

## Features

- 🔍 Search locations by city name
- 📍 Select from multiple location results
- 📊 View AQI index with color-coded categories
- 🧪 Display pollutant components (PM2.5, PM10, O₃, NO₂, SO₂, CO)
- 📱 Responsive Bootstrap design
- ⚡ Real-time data from OpenWeatherMap API

## Project Structure

```
coiplot-aqi-watch/
├── backend/               # Express.js API server
│   ├── src/
│   │   └── server.ts     # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── app.component.ts
│   │   │   └── app.module.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. Update the API key in `backend/src/server.ts`:
   ```typescript
   const WEATHER_API_KEY = 'your_actual_api_key_here';
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:4200`

## API Endpoints

### Backend API

- `GET /api/locations/search?query={city}` - Search for locations
- `GET /api/aqi/:lat/:lon` - Get AQI data for specific coordinates

## Technologies Used

### Backend
- **Express.js** - Web server framework
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing

### Frontend
- **Angular 17** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5** - UI framework
- **RxJS** - Reactive programming

### API
- **OpenWeatherMap API** - Air pollution and geocoding data

## AQI Scale

The app uses the following AQI categories:

1. **Good** (1) - Green 😊
2. **Fair** (2) - Yellow 🙂
3. **Moderate** (3) - Orange 😐
4. **Poor** (4) - Red 😷
5. **Very Poor** (5) - Purple 🤢

## Development

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

The production files will be in `frontend/dist/aqi-monitor/`

## License

MIT License
