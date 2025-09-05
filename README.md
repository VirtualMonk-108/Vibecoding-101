# 🇿🇦 EventsZA - South African Event Platform

A modern event management platform built specifically for South Africa, featuring load-shedding resilience, local payment methods, and deep integration with South African services.

![EventsZA Banner](https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=300&fit=crop&crop=center)

## 🚀 Features

### 🌟 Core Features
- **Event Discovery** - Beautiful event listings with advanced search and filters
- **Ticketing System** - Secure ticket purchasing with QR codes and mobile wallets
- **Real-time Updates** - Live attendee counts, availability, and notifications
- **Mobile-First** - Progressive Web App with offline capabilities

### 🇿🇦 South African Specific Features
- **🔌 Load Shedding Integration** - Events with backup power and schedule awareness
- **💳 Local Payments** - PayFast, Ozow, SnapScan, and EFT support
- **🚗 Transport Integration** - Uber, Bolt estimates and public transport info
- **🌤️ Weather Integration** - Real-time weather updates and event recommendations
- **🗣️ Multi-Language** - Support for English, Afrikaans, Zulu, and Xhosa

## 🏗️ Architecture

```
EventsZA/
├── apps/
│   ├── user-app/          # Main user-facing application (port 3000)
│   └── admin-portal/      # Event organizer dashboard (port 3001)
├── packages/
│   ├── shared/            # Shared UI components and utilities
│   └── firebase/          # Firebase services and hooks
├── api/mocks/             # Mock APIs for development
└── docs/                  # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **Deployment**: Vercel with GitHub integration
- **Payments**: PayFast, Ozow, SnapScan (Mock APIs included)
- **Monorepo**: Turborepo for build optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eventza.git
   cd eventza
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Firebase configuration to .env.local
   ```

4. **Start development servers**
   ```bash
   # Start both applications
   npm run dev

   # Or start individually
   npm run dev:user    # User app (localhost:3000)
   npm run dev:admin   # Admin portal (localhost:3001)
   ```

### 🔧 Development Commands

```bash
# Development
npm run dev              # Start both apps in parallel
npm run dev:user         # Start user app only
npm run dev:admin        # Start admin portal only

# Building
npm run build            # Build all applications
npm run build:user       # Build user app only
npm run build:admin      # Build admin portal only

# Testing
npm run lint             # Lint all code
npm run type-check       # TypeScript type checking
npm run clean            # Clean all build artifacts
```

## 🧪 Mock APIs

For development, we provide comprehensive mock APIs that simulate South African services:

### Payment Services
- **PayFast Mock** - `/api/mocks/payment/payfast`
- **Ozow Mock** - `/api/mocks/payment/ozow`  
- **SnapScan Mock** - `/api/mocks/payment/snapscan`

### South African Services
- **Load Shedding** - `/api/mocks/services/loadshedding`
- **Weather** - `/api/mocks/services/weather`
- **Uber/Bolt** - `/api/mocks/services/uber`
- **Traffic** - `/api/mocks/services/traffic`

### Example Usage

```typescript
// Get load shedding schedule
const response = await fetch('/api/mocks/services/loadshedding?area=cape-town-cbd')
const data = await response.json()

// Current stage and upcoming schedule
console.log('Current Stage:', data.current_stage)
console.log('Next Events:', data.events)
```

## 🔥 Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Authentication, Firestore, and Storage

2. **Configure Authentication**
   - Enable Email/Password and Google providers
   - Add your domain to authorized domains

3. **Add Firebase Config**
   ```javascript
   // .env.local
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

## 🚀 Deployment

EventsZA is designed for easy deployment to Vercel with GitHub integration.

### Quick Deploy to Vercel

1. **Deploy User App**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/eventza&root-directory=apps/user-app)

2. **Deploy Admin Portal**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/eventza&root-directory=apps/admin-portal)

### Manual Deployment

See our comprehensive [Deployment Guide](./DEPLOYMENT.md) for detailed instructions.

## 🎯 Project Structure

```
├── apps/
│   ├── user-app/              # Main user application
│   │   ├── src/app/           # Next.js App Router pages
│   │   ├── src/components/    # User app components
│   │   └── public/            # Static assets
│   │
│   └── admin-portal/          # Admin dashboard
│       ├── src/app/           # Admin pages
│       ├── src/components/    # Admin components
│       └── public/            # Admin assets
│
├── packages/
│   ├── shared/                # Shared components and utilities
│   │   ├── src/components/ui/ # UI components (Shadcn/ui)
│   │   ├── src/lib/           # Utility functions
│   │   └── src/types/         # TypeScript definitions
│   │
│   └── firebase/              # Firebase services
│       ├── src/config.ts      # Firebase configuration
│       └── src/hooks/         # Firebase React hooks
│
├── api/mocks/                 # Mock API endpoints
│   ├── payment/               # Payment provider mocks
│   └── services/              # South African service mocks
│
└── docs/                      # Documentation
```

## 🔐 Authentication

EventsZA supports multiple authentication methods:

```typescript
import { useAuth } from '@eventza/firebase'

function AuthExample() {
  const { user, signIn, signUp, signOut } = useAuth()

  if (user) {
    return <div>Welcome, {user.displayName}!</div>
  }

  return (
    <button onClick={() => signIn('email@example.com', 'password')}>
      Sign In
    </button>
  )
}
```

## 💳 Payment Integration

Mock payment flows for development:

```typescript
// PayFast mock payment
const payment = await fetch('/api/mocks/payment/payfast/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    merchant_id: 'mock_merchant',
    amount: 15000, // R150.00 in cents
    item_name: 'Concert Ticket',
    return_url: '/payment/success',
    cancel_url: '/payment/cancel'
  })
})

const { payment_id, payment_url } = await payment.json()
```

## 🌍 Internationalization

EventsZA supports South African languages:

```typescript
import { useLanguage } from '@eventza/shared'

function LanguageExample() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="af">Afrikaans</option>
        <option value="zu">Zulu</option>
        <option value="xh">Xhosa</option>
      </select>
    </div>
  )
}
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # End-to-end tests

# Test mock APIs
npm run test:mocks
```

## 📱 Progressive Web App

EventsZA includes PWA support for mobile installation:

- Offline event browsing
- Push notifications
- Add to home screen
- Background sync for ticket purchases

## 🔍 SEO & Performance

- Server-side rendering with Next.js
- Optimized images with Next.js Image component
- Lighthouse score of 90+ across all metrics
- Core Web Vitals optimization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Luma](https://lu.ma) for event management
- Built for the South African community
- Thanks to all open source contributors
- Special thanks to Firebase, Vercel, and Next.js teams

## 📞 Support

- **Documentation**: [Full Documentation](./docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/eventza/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/eventza/discussions)

---

<div align="center">

**🇿🇦 Built with ❤️ for South Africa**

*Ready to transform the South African event landscape!*

[Get Started](#quick-start) • [Documentation](./docs/) • [Deploy](./DEPLOYMENT.md) • [Contribute](#contributing)

</div>