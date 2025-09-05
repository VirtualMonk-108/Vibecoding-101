import { NextApiRequest, NextApiResponse } from 'next'

interface WeatherRequest {
  lat: number
  lon: number
  eventTime?: string // ISO date string
}

interface WeatherResponse {
  current: {
    temp: number
    conditions: string
    humidity: number
    wind_speed: number
    uv_index: number
  }
  forecast?: {
    event_time?: {
      temp: number
      rain_chance: number
      conditions: string
      wind_speed: number
    }
  }
  alerts?: Array<{
    type: 'warning' | 'watch' | 'advisory'
    description: string
    severity: 'minor' | 'moderate' | 'severe' | 'extreme'
    start_time: string
    end_time: string
  }>
}

// Mock South African cities with realistic weather
const saWeatherData = {
  'cape-town': {
    current: { temp: 22, conditions: 'Partly Cloudy', humidity: 65, wind_speed: 15, uv_index: 7 },
    variations: { temp: [-5, 8], humidity: [-15, 15], wind_speed: [-5, 10] }
  },
  'johannesburg': {
    current: { temp: 18, conditions: 'Sunny', humidity: 45, wind_speed: 8, uv_index: 9 },
    variations: { temp: [-8, 12], humidity: [-20, 20], wind_speed: [-3, 8] }
  },
  'durban': {
    current: { temp: 26, conditions: 'Humid', humidity: 80, wind_speed: 12, uv_index: 8 },
    variations: { temp: [-4, 6], humidity: [-10, 10], wind_speed: [-5, 8] }
  },
  'pretoria': {
    current: { temp: 19, conditions: 'Clear', humidity: 40, wind_speed: 6, uv_index: 9 },
    variations: { temp: [-7, 11], humidity: [-15, 25], wind_speed: [-2, 10] }
  },
  'port-elizabeth': {
    current: { temp: 21, conditions: 'Windy', humidity: 70, wind_speed: 20, uv_index: 6 },
    variations: { temp: [-6, 9], humidity: [-15, 15], wind_speed: [-8, 12] }
  }
}

const weatherConditions = [
  'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Rain', 'Thunderstorms',
  'Clear', 'Overcast', 'Scattered Showers', 'Windy', 'Humid'
]

function getLocationKey(lat: number, lon: number): string {
  // Cape Town area
  if (lat >= -34.5 && lat <= -33.5 && lon >= 18 && lon <= 19) return 'cape-town'
  // Johannesburg area  
  if (lat >= -26.5 && lat <= -25.5 && lon >= 27.5 && lon <= 28.5) return 'johannesburg'
  // Durban area
  if (lat >= -30.5 && lat <= -29.5 && lon >= 30.5 && lon <= 31.5) return 'durban'
  // Pretoria area
  if (lat >= -26 && lat <= -25 && lon >= 28 && lon <= 29) return 'pretoria'
  // Port Elizabeth area
  if (lat >= -34 && lat <= -33 && lon >= 25 && lon <= 26) return 'port-elizabeth'
  
  // Default to Cape Town for other locations
  return 'cape-town'
}

function generateWeatherData(baseData: any, eventTime?: string): WeatherResponse {
  const { current, variations } = baseData
  
  // Add some randomness to current conditions
  const currentWeather = {
    temp: Math.round(current.temp + (Math.random() - 0.5) * variations.temp[1]),
    conditions: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
    humidity: Math.max(20, Math.min(100, current.humidity + (Math.random() - 0.5) * variations.humidity[1])),
    wind_speed: Math.max(0, current.wind_speed + (Math.random() - 0.5) * variations.wind_speed[1]),
    uv_index: current.uv_index
  }

  const response: WeatherResponse = {
    current: currentWeather
  }

  // If event time is provided, generate forecast
  if (eventTime) {
    const eventDate = new Date(eventTime)
    const now = new Date()
    const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    // Predict weather for event time
    const tempVariation = Math.sin(hoursUntilEvent / 24) * 5 // Daily temperature cycle
    const rainChance = Math.max(0, Math.min(100, 20 + Math.random() * 60))

    response.forecast = {
      event_time: {
        temp: Math.round(currentWeather.temp + tempVariation + (Math.random() - 0.5) * 4),
        rain_chance: Math.round(rainChance),
        conditions: rainChance > 70 ? 'Rain' : rainChance > 40 ? 'Cloudy' : 'Partly Cloudy',
        wind_speed: Math.max(0, currentWeather.wind_speed + (Math.random() - 0.5) * 5)
      }
    }
  }

  // Sometimes add weather alerts (10% chance)
  if (Math.random() < 0.1) {
    response.alerts = [{
      type: 'warning',
      description: 'Strong wind warning in effect',
      severity: 'moderate',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
    }]
  }

  return response
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { lat, lon, eventTime } = req.query

  // Validate coordinates
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' })
  }

  const latitude = parseFloat(lat as string)
  const longitude = parseFloat(lon as string)

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid coordinates' })
  }

  // Get base weather data for the location
  const locationKey = getLocationKey(latitude, longitude)
  const baseData = saWeatherData[locationKey]

  // Generate realistic weather data
  const weatherData = generateWeatherData(baseData, eventTime as string)

  // Add some delay to simulate API call
  setTimeout(() => {
    res.status(200).json(weatherData)
  }, 300 + Math.random() * 200)
}