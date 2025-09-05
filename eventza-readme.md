# 🇿🇦 EventsZA - South African Event Platform

A modern event management platform built specifically for South Africa, inspired by Luma but tailored for local needs including load-shedding resilience, local payment methods, and South African culture.

## 🚀 Project Overview

EventsZA is a comprehensive event platform featuring beautiful event pages, seamless ticketing, real-time updates, and deep integration with South African services and payment methods.

### Tech Stack
- **Frontend**: Next.js 14 (TypeScript) - Two separate apps
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS + Shadcn/ui
- **Payments**: PayFast, Ozow, SnapScan, Zapper
- **Real-time**: Firebase Realtime listeners
- **Mobile**: PWA (Progressive Web App)

## 🧪 Mock APIs Setup

Since you have Firebase keys but need mocks for third-party services, we've created comprehensive mock APIs for development.

### Mock API Structure

```
/api/mocks/
├── payment/
│   ├── payfast.ts
│   ├── ozow.ts
│   ├── snapscan.ts
│   └── zapper.ts
├── services/
│   ├── weather.ts
│   ├── loadshedding.ts
│   ├── traffic.ts
│   ├── uber.ts
│   ├── bolt.ts
│   └── accommodation.ts
└── index.ts
```

### Environment Variables

```env
# .env.local

# Firebase (You have these)
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Mock API Toggle (set to 'true' for development)
NEXT_PUBLIC_USE_MOCK_APIS=true

# When ready for production, add real keys:
# PAYFAST_MERCHANT_ID=
# PAYFAST_MERCHANT_KEY=
# OZOW_API_KEY=
# SNAPSCAN_API_KEY=
# ESKOMSEPUSH_API_KEY=
# GOOGLE_MAPS_API_KEY=
# UBER_CLIENT_ID=
# OPENWEATHER_API_KEY=
```

### Mock API Endpoints

#### Payment Mocks

**PayFast Mock**
```typescript
// POST /api/mocks/payment/payfast/initiate
{
  "merchant_id": "mock_merchant",
  "amount": 15000, // in cents
  "item_name": "Event Ticket",
  "return_url": "https://localhost:3000/payment/success",
  "cancel_url": "https://localhost:3000/payment/cancel"
}

// Response
{
  "payment_id": "MOCK_PAY_123456",
  "payment_url": "https://localhost:3000/mock/payment/payfast",
  "status": "pending"
}
```

**Ozow Mock**
```typescript
// POST /api/mocks/payment/ozow/initiate
{
  "amount": 150.00,
  "bankReference": "EVT-2024-001",
  "isTest": true
}

// Response
{
  "transactionId": "OZOW_MOCK_789",
  "paymentLink": "https://localhost:3000/mock/payment/ozow",
  "status": "PendingPayment"
}
```

#### Service Mocks

**Weather Mock**
```typescript
// GET /api/mocks/services/weather?lat=-33.9249&lon=18.4241
{
  "current": {
    "temp": 22,
    "conditions": "Partly Cloudy",
    "humidity": 65,
    "wind_speed": 15
  },
  "forecast": {
    "event_time": {
      "temp": 24,
      "rain_chance": 10,
      "conditions": "Clear"
    }
  }
}
```

**Load-shedding Mock**
```typescript
// GET /api/mocks/services/loadshedding?area=cape-town-cbd
{
  "events": [
    {
      "start": "2024-01-20T10:00:00",
      "end": "2024-01-20T12:30:00",
      "stage": 2,
      "area": "Cape Town CBD"
    }
  ],
  "current_stage": 0
}
```

**Traffic Mock**
```typescript
// GET /api/mocks/services/traffic?origin=lat,lon&destination=lat,lon
{
  "duration": {
    "value": 1800, // seconds
    "text": "30 mins"
  },
  "distance": {
    "value": 15000, // meters
    "text": "15 km"
  },
  "traffic_level": "moderate",
  "suggested_departure": "17:30"
}
```

**Ride-sharing Mock**
```typescript
// GET /api/mocks/services/uber/estimate?pickup=lat,lon&dropoff=lat,lon
{
  "options": [
    {
      "type": "UberX",
      "price_estimate": "R45-65",
      "time_estimate": "5 mins",
      "surge_multiplier": 1.0
    },
    {
      "type": "Uber Comfort",
      "price_estimate": "R65-85",
      "time_estimate": "8 mins"
    }
  ]
}
```

### Mock Data Generator

```typescript
// utils/mockDataGenerator.ts
export const generateMockEvent = () => ({
  id: `evt_${Date.now()}`,
  title: "Sample Event",
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  venue: {
    name: "Cape Town ICC",
    coordinates: { lat: -33.9249, lon: 18.4241 },
    parking: true,
    loadsheddingBackup: true
  },
  tickets: {
    available: 150,
    sold: 45,
    types: [
      { name: "Early Bird", price: 150, available: true },
      { name: "Regular", price: 200, available: true },
      { name: "VIP", price: 500, available: true }
    ]
  }
});
```

## 📋 TODO List

### Phase 1: Foundation Setup ✅
- [ ] Initialize monorepo structure
  - [ ] `/apps/admin-portal` - Event organizer dashboard
  - [ ] `/apps/user-app` - Attendee-facing application
  - [ ] `/packages/shared` - Shared components and utilities
- [ ] Setup Firebase project
  - [ ] Enable Authentication (Email, Phone, Google)
  - [ ] Initialize Firestore database
  - [ ] Setup Firebase Storage
  - [ ] Configure Cloud Functions
- [ ] Configure Vercel deployments
  - [ ] Connect GitHub repositories
  - [ ] Setup environment variables
  - [ ] Configure preview deployments
- [ ] **Setup Mock API infrastructure**
  - [ ] Create mock API routes
  - [ ] Implement mock data generators
  - [ ] Add development/production toggle

### Phase 2: Core Database Schema 📊
- [ ] Design Firestore collections:
  ```
  /users (profiles, preferences, payment methods)
  /events (details, tickets, venue, schedule)
  /tickets (purchases, attendees, check-ins)
  /venues (locations, amenities, parking)
  /transactions (payments, refunds, payouts)
  /chats (event discussions, networking)
  /organizers (host profiles, verification)
  ```
- [ ] Setup security rules
- [ ] Create data models/types (TypeScript)
- [ ] Implement offline-first architecture

### Phase 3: User Authentication 🔐
- [ ] Email/password authentication
- [ ] Phone number auth (important for SA)
- [ ] Social logins (Google, Facebook)
- [ ] Profile creation and management
- [ ] Role-based access (organizer vs attendee)

### Phase 4: Admin Portal Features 👨‍💼
- [ ] Dashboard with real-time analytics
  - [ ] Live ticket sales
  - [ ] Revenue tracking
  - [ ] Attendee demographics
- [ ] Event creation wizard
  - [ ] Multiple ticket types
  - [ ] Early bird pricing
  - [ ] Group discounts
- [ ] Attendee management
  - [ ] Check-in system
  - [ ] Export attendee lists
  - [ ] Bulk messaging
- [ ] Financial management
  - [ ] Payout requests
  - [ ] Tax invoice generation
  - [ ] Revenue reports

### Phase 5: User App Core Features 🎉
- [ ] Event discovery
  - [ ] Location-based search
  - [ ] Category filters
  - [ ] Trending events
  - [ ] Personalized recommendations
- [ ] Event pages
  - [ ] Beautiful themes
  - [ ] Photo galleries
  - [ ] Real-time attendee count
  - [ ] Social sharing
- [ ] Ticket purchasing
  - [ ] Secure checkout
  - [ ] QR code generation
  - [ ] Apple/Google Wallet integration
- [ ] User profiles
  - [ ] Event history
  - [ ] Saved events
  - [ ] Following organizers

### Phase 6: South African Payment Integration 💳
- [ ] **Mock payment flows first**
  - [ ] PayFast mock implementation
  - [ ] Ozow mock implementation
  - [ ] SnapScan/Zapper mock QR codes
- [ ] Production payment integration
  - [ ] PayFast integration
    - [ ] Instant EFT
    - [ ] Credit/debit cards
    - [ ] Recurring payments
  - [ ] Ozow integration
    - [ ] Real-time bank transfers
  - [ ] SnapScan/Zapper integration
    - [ ] QR code payments
    - [ ] In-person payment support
- [ ] Multi-currency support (ZAR, USD, BWP, NAD)
- [ ] Payment splitting for group bookings

### Phase 7: Real-time Features ⚡
- [ ] Live event updates
  - [ ] Attendee counter
  - [ ] Ticket availability
  - [ ] Price changes
- [ ] Real-time notifications
  - [ ] Event reminders
  - [ ] Changes/cancellations
  - [ ] Flash sales
- [ ] Live chat during events
- [ ] Real-time check-in tracking

### Phase 8: Location & Transportation 🚗
- [ ] **Mock services implementation**
  - [ ] Mock traffic data
  - [ ] Mock uber/bolt estimates
  - [ ] Mock accommodation results
- [ ] Production integrations
  - [ ] Traffic integration
    - [ ] Google Maps/Waze
    - [ ] Travel time estimates
    - [ ] Parking availability
  - [ ] Ride-sharing integration
    - [ ] Uber API
    - [ ] Bolt integration
    - [ ] Fare estimates
    - [ ] Group ride coordination
  - [ ] Public transport
    - [ ] Gautrain schedules
    - [ ] MyCiTi routes
  - [ ] Accommodation partnerships
    - [ ] Nearby hotels/Airbnb
    - [ ] Event accommodation deals

### Phase 9: South African Specific Features 🇿🇦
- [ ] Load-shedding integration
  - [ ] **Mock load-shedding schedule**
  - [ ] EskomSePush API (production)
  - [ ] Schedule awareness
  - [ ] Backup power indicators
- [ ] Weather integration
  - [ ] **Mock weather service**
  - [ ] SA Weather Service API (production)
  - [ ] Event weather alerts
  - [ ] Indoor backup options
- [ ] Multi-language support
  - [ ] English
  - [ ] Afrikaans
  - [ ] Zulu
  - [ ] Xhosa
- [ ] Local event categories
  - [ ] Braais
  - [ ] Sports viewing
  - [ ] Markets
  - [ ] Cultural festivals

### Phase 10: Advanced Features 🚀
- [ ] Mobile apps (Flutter)
  - [ ] iOS app
  - [ ] Android app
  - [ ] Offline functionality
- [ ] Analytics platform
  - [ ] Event insights
  - [ ] Attendee behavior
  - [ ] Revenue optimization
- [ ] Marketing tools
  - [ ] Email campaigns
  - [ ] SMS marketing
  - [ ] WhatsApp integration
- [ ] API for third-party integration

### Phase 11: Safety & Trust Features 🛡️
- [ ] Verified organizers program
- [ ] Secure messaging system
- [ ] Safety ratings for venues
- [ ] Buddy system for events
- [ ] Emergency contact features
- [ ] Fraud detection

### Phase 12: Launch Preparation 🎯
- [ ] Beta testing program
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Security audit
- [ ] POPIA compliance
- [ ] Terms of service/Privacy policy
- [ ] Customer support system
- [ ] Documentation

## 🎯 MVP Features Priority

1. **User registration/login**
2. **Basic event creation**
3. **Event discovery page**
4. **Ticket purchasing (PayFast - Mock first)**
5. **QR code check-in**
6. **Basic admin dashboard**
7. **Mobile-responsive design**

## 🧪 Testing Strategy

### Mock API Testing
```typescript
// __tests__/mocks/payment.test.ts
describe('PayFast Mock API', () => {
  it('should initiate payment', async () => {
    const response = await fetch('/api/mocks/payment/payfast/initiate', {
      method: 'POST',
      body: JSON.stringify({
        amount: 15000,
        item_name: 'Test Ticket'
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.payment_id).toMatch(/^MOCK_PAY_/);
  });
});
```

### Integration Testing
- Test mock APIs return expected data formats
- Verify fallback behavior when services unavailable
- Test offline functionality
- Validate real-time sync

## 💻 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account (you have this)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/eventza
cd eventza

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your Firebase keys to .env.local

# Run mock API server
npm run mock-server

# Run development servers
npm run dev
```

### Project Structure
```
eventza/
├── apps/
│   ├── admin-portal/
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   └── user-app/
│       ├── pages/
│       ├── components/
│       └── hooks/
├── packages/
│   ├── shared/
│   │   ├── components/
│   │   ├── types/
│   │   └── utils/
│   └── firebase/
│       ├── config.ts
│       └── hooks.ts
├── api/
│   └── mocks/
│       ├── payment/
│       └── services/
└── scripts/
    └── generate-mock-data.ts
```

### Available Scripts

```bash
# Development
npm run dev              # Start both apps
npm run dev:admin        # Start admin portal only
npm run dev:user         # Start user app only
npm run mock-server      # Start mock API server

# Building
npm run build           # Build all apps
npm run build:admin     # Build admin portal
npm run build:user      # Build user app

# Testing
npm run test            # Run all tests
npm run test:mocks      # Test mock APIs
npm run test:e2e        # End-to-end tests

# Utilities
npm run generate:mock   # Generate mock data
npm run lint           # Lint code
npm run format         # Format code
```

## 📱 Offline-First Considerations

- Cache critical event data
- Queue ticket purchases
- Store check-ins locally
- Sync when connection restored
- Progressive Web App features

## 💡 Key Differentiators

- **Load-shedding resilient**
- **Local payment methods**
- **SA culture focused**
- **Integrated transportation**
- **Weather-aware**
- **Multi-language support**
- **Real-time everything**

## 🔒 Security Considerations

- All payment processing through secure mocks in development
- Firebase security rules for data access
- HTTPS only in production
- Input validation on all forms
- Rate limiting on APIs
- POPIA compliance built-in

## 🚀 Deployment

### Vercel Deployment
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Environment Variables (Vercel)
- Add all variables from `.env.local`
- Set `NEXT_PUBLIC_USE_MOCK_APIS=false` for production
- Add production API keys when ready

## 📊 Monitoring & Analytics

- Firebase Analytics for user behavior
- Vercel Analytics for performance
- Custom dashboards for business metrics
- Error tracking with Sentry

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Luma
- Built for the South African community
- Thanks to all contributors

---

Ready to build the future of South African event management! 🎉🇿🇦