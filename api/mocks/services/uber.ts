import { NextApiRequest, NextApiResponse } from 'next'

interface UberEstimateResponse {
  options: Array<{
    type: string
    display_name: string
    price_estimate: string
    time_estimate: string
    surge_multiplier: number
    capacity: number
    distance: number // in km
    duration: number // in minutes
  }>
  surge_info?: {
    active: boolean
    multiplier: number
    reason: string
  }
}

// Uber ride types available in South Africa
const uberTypes = [
  {
    type: 'UberX',
    display_name: 'UberX',
    base_price: 4.50,
    per_km: 8.50,
    per_minute: 1.20,
    capacity: 4,
    description: 'Affordable rides'
  },
  {
    type: 'UberXL', 
    display_name: 'UberXL',
    base_price: 6.00,
    per_km: 12.00,
    per_minute: 1.80,
    capacity: 6,
    description: 'Larger rides'
  },
  {
    type: 'UberComfort',
    display_name: 'Comfort',
    base_price: 5.50,
    per_km: 11.00,
    per_minute: 1.50,
    capacity: 4,
    description: 'Newer cars with extra legroom'
  },
  {
    type: 'UberBlack',
    display_name: 'Uber Black',
    base_price: 8.00,
    per_km: 18.00,
    per_minute: 2.50,
    capacity: 4,
    description: 'Premium rides'
  }
]

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function calculateDuration(distance: number, timeOfDay: number): number {
  // Base speed in km/h, adjusted for traffic
  let baseSpeed = 30

  // Rush hour adjustments (7-9 AM, 5-7 PM)
  if ((timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19)) {
    baseSpeed = 15 // Heavy traffic
  } else if ((timeOfDay >= 6 && timeOfDay <= 10) || (timeOfDay >= 16 && timeOfDay <= 20)) {
    baseSpeed = 22 // Moderate traffic  
  } else if (timeOfDay >= 22 || timeOfDay <= 5) {
    baseSpeed = 45 // Light traffic
  }

  // Add some randomness
  baseSpeed += (Math.random() - 0.5) * 10

  return Math.max(5, Math.round((distance / baseSpeed) * 60)) // Convert to minutes
}

function calculatePrice(rideType: any, distance: number, duration: number, surgeMultiplier: number): string {
  const basePrice = rideType.base_price
  const distancePrice = distance * rideType.per_km
  const timePrice = duration * rideType.per_minute
  
  const totalPrice = (basePrice + distancePrice + timePrice) * surgeMultiplier
  const minPrice = totalPrice * 0.8
  const maxPrice = totalPrice * 1.2

  return `R${Math.round(minPrice)}-${Math.round(maxPrice)}`
}

function getSurgeMultiplier(timeOfDay: number, dayOfWeek: number): number {
  let surge = 1.0

  // Weekend surge
  if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
    surge = Math.max(surge, 1.2 + Math.random() * 0.3)
  }

  // Rush hour surge
  if ((timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19)) {
    surge = Math.max(surge, 1.3 + Math.random() * 0.5)
  }

  // Late night surge
  if ((timeOfDay >= 22) || (timeOfDay <= 4)) {
    surge = Math.max(surge, 1.1 + Math.random() * 0.4)
  }

  // Random surge events (10% chance)
  if (Math.random() < 0.1) {
    surge = Math.max(surge, 1.5 + Math.random() * 1.0)
  }

  return Math.round(surge * 10) / 10 // Round to 1 decimal place
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { pickup_lat, pickup_lon, dropoff_lat, dropoff_lon } = req.query

  // Validate coordinates
  if (!pickup_lat || !pickup_lon || !dropoff_lat || !dropoff_lon) {
    return res.status(400).json({ 
      error: 'Missing required parameters: pickup_lat, pickup_lon, dropoff_lat, dropoff_lon' 
    })
  }

  const pickupLat = parseFloat(pickup_lat as string)
  const pickupLon = parseFloat(pickup_lon as string)  
  const dropoffLat = parseFloat(dropoff_lat as string)
  const dropoffLon = parseFloat(dropoff_lon as string)

  if ([pickupLat, pickupLon, dropoffLat, dropoffLon].some(coord => isNaN(coord))) {
    return res.status(400).json({ error: 'Invalid coordinates' })
  }

  // Calculate distance and time
  const distance = calculateDistance(pickupLat, pickupLon, dropoffLat, dropoffLon)
  const now = new Date()
  const timeOfDay = now.getHours()
  const dayOfWeek = now.getDay()
  const baseDuration = calculateDuration(distance, timeOfDay)

  // Calculate surge
  const surgeMultiplier = getSurgeMultiplier(timeOfDay, dayOfWeek)

  // Generate estimates for each ride type
  const options = uberTypes.map(rideType => {
    // Add some variation in pickup time
    const pickupTime = Math.max(2, baseDuration * 0.1 + Math.random() * 5)
    const price = calculatePrice(rideType, distance, baseDuration, surgeMultiplier)

    return {
      type: rideType.type,
      display_name: rideType.display_name,
      price_estimate: price,
      time_estimate: `${Math.round(pickupTime)} min`,
      surge_multiplier: surgeMultiplier,
      capacity: rideType.capacity,
      distance: Math.round(distance * 10) / 10,
      duration: baseDuration
    }
  })

  // Sort by price (cheapest first)
  options.sort((a, b) => {
    const aPrice = parseInt(a.price_estimate.split('-')[0].replace('R', ''))
    const bPrice = parseInt(b.price_estimate.split('-')[0].replace('R', ''))
    return aPrice - bPrice
  })

  const response: UberEstimateResponse = {
    options
  }

  // Add surge info if active
  if (surgeMultiplier > 1.0) {
    let reason = 'High demand'
    if ((timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19)) {
      reason = 'Rush hour demand'
    } else if (dayOfWeek === 5 || dayOfWeek === 6) {
      reason = 'Weekend demand'
    } else if ((timeOfDay >= 22) || (timeOfDay <= 4)) {
      reason = 'Late night demand'
    }

    response.surge_info = {
      active: true,
      multiplier: surgeMultiplier,
      reason
    }
  }

  // Simulate API delay
  setTimeout(() => {
    res.status(200).json(response)
  }, 400 + Math.random() * 300)
}