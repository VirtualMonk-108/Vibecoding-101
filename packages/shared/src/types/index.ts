// User Types
export interface User {
  id: string
  email: string
  displayName: string | null
  photoURL: string | null
  phoneNumber: string | null
  role: 'attendee' | 'organizer' | 'admin'
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  language: 'en' | 'af' | 'zu' | 'xh'
  currency: 'ZAR' | 'USD'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  location: {
    city: string
    province: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
}

// Event Types
export interface Event {
  id: string
  title: string
  description: string
  shortDescription: string
  organizerId: string
  organizer: Organizer
  category: EventCategory
  venue: Venue
  dateTime: {
    start: Date
    end: Date
    timezone: string
  }
  tickets: TicketType[]
  images: string[]
  tags: string[]
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  capacity: number
  attendeeCount: number
  features: EventFeatures
  pricing: EventPricing
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    website?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface EventFeatures {
  loadSheddingBackup: boolean
  weatherProtection: boolean
  parking: boolean
  accessibility: boolean
  ageRestriction?: number
  dresscode?: string
  foodAndDrinks: boolean
}

export interface EventPricing {
  currency: 'ZAR' | 'USD'
  processingFee: number
  platformFee: number
  refundPolicy: 'full' | 'partial' | 'none'
}

export type EventCategory = 
  | 'music'
  | 'business'
  | 'food-drink'
  | 'sports'
  | 'arts-culture'
  | 'technology'
  | 'education'
  | 'community'
  | 'nightlife'
  | 'outdoor'
  | 'wellness'
  | 'other'

// Venue Types
export interface Venue {
  id: string
  name: string
  address: Address
  coordinates: {
    lat: number
    lng: number
  }
  capacity: number
  amenities: VenueAmenities
  images: string[]
  description?: string
}

export interface Address {
  street: string
  city: string
  province: string
  postalCode: string
  country: string
}

export interface VenueAmenities {
  parking: boolean
  publicTransport: boolean
  accessibility: boolean
  wifi: boolean
  airConditioning: boolean
  sound: boolean
  lighting: boolean
  catering: boolean
  bar: boolean
  security: boolean
  loadSheddingBackup: boolean
}

// Organizer Types
export interface Organizer {
  id: string
  name: string
  description: string
  email: string
  phone?: string
  website?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
  logo?: string
  verified: boolean
  rating: number
  eventsCreated: number
  followers: number
  createdAt: Date
}

// Ticket Types
export interface TicketType {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  sold: number
  maxPerOrder: number
  saleStart: Date
  saleEnd: Date
  benefits?: string[]
  transferable: boolean
  refundable: boolean
}

export interface Ticket {
  id: string
  eventId: string
  ticketTypeId: string
  userId: string
  purchaseId: string
  status: 'active' | 'used' | 'cancelled' | 'refunded'
  qrCode: string
  checkedIn: boolean
  checkedInAt?: Date
  transferredTo?: string
  createdAt: Date
}

// Payment Types
export interface Payment {
  id: string
  userId: string
  eventId: string
  amount: number
  currency: 'ZAR' | 'USD'
  method: PaymentMethod
  status: PaymentStatus
  provider: PaymentProvider
  providerTransactionId: string
  tickets: string[]
  fees: {
    processing: number
    platform: number
  }
  refundable: boolean
  createdAt: Date
  updatedAt: Date
}

export type PaymentMethod = 
  | 'card'
  | 'eft'
  | 'instant_eft'
  | 'qr_code'
  | 'wallet'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'

export type PaymentProvider = 
  | 'payfast'
  | 'ozow'
  | 'snapscan'
  | 'zapper'
  | 'stripe'

// South African Specific Types
export interface LoadSheddingStatus {
  stage: number
  area: string
  schedule: LoadSheddingSlot[]
  lastUpdated: Date
}

export interface LoadSheddingSlot {
  start: Date
  end: Date
  stage: number
}

export interface WeatherInfo {
  current: {
    temperature: number
    conditions: string
    humidity: number
    windSpeed: number
  }
  forecast: {
    eventTime: {
      temperature: number
      rainChance: number
      conditions: string
    }
  }
  alerts?: WeatherAlert[]
}

export interface WeatherAlert {
  type: 'warning' | 'watch' | 'advisory'
  description: string
  severity: 'minor' | 'moderate' | 'severe' | 'extreme'
  startTime: Date
  endTime: Date
}

export interface TransportOption {
  type: 'uber' | 'bolt' | 'public' | 'taxi'
  estimatedTime: number
  estimatedCost?: {
    min: number
    max: number
    currency: string
  }
  walkingDistance?: number
  description: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Search and Filter Types
export interface EventSearchFilters {
  query?: string
  location?: {
    city?: string
    radius?: number
    coordinates?: {
      lat: number
      lng: number
    }
  }
  category?: EventCategory
  dateRange?: {
    start: Date
    end: Date
  }
  priceRange?: {
    min: number
    max: number
  }
  features?: {
    loadSheddingBackup?: boolean
    weatherProtection?: boolean
    parking?: boolean
    accessibility?: boolean
  }
  sortBy?: 'date' | 'price' | 'popularity' | 'distance'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchResult<T> {
  items: T[]
  total: number
  facets?: {
    categories: { [key: string]: number }
    locations: { [key: string]: number }
    priceRanges: { [key: string]: number }
  }
}