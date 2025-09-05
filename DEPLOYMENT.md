# EventsZA Deployment Guide

This guide covers deploying the EventsZA monorepo to Vercel with GitHub integration.

## 🏗️ Architecture Overview

EventsZA is built as a monorepo with two separate Next.js applications:

- **User App** (`/apps/user-app`) - Main event discovery platform (port 3000)
- **Admin Portal** (`/apps/admin-portal`) - Event organizer dashboard (port 3001)
- **Shared Packages** (`/packages/*`) - Common components and utilities
- **Mock APIs** (`/api/mocks/*`) - Development mock services

## 📋 Prerequisites

1. **GitHub Account** - For code repository and deployment integration
2. **Vercel Account** - For hosting (free tier available)
3. **Firebase Project** - For backend services
4. **Domain Names** (optional) - For custom domains

## 🚀 Deployment Steps

### Step 1: GitHub Repository Setup

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial EventsZA setup 🇿🇦"
   git branch -M main
   git remote add origin https://github.com/yourusername/eventza.git
   git push -u origin main
   ```

2. **Repository Structure**
   ```
   eventza/
   ├── apps/
   │   ├── user-app/          # Main user application
   │   └── admin-portal/      # Admin dashboard
   ├── packages/
   │   ├── shared/            # Shared components
   │   └── firebase/          # Firebase utilities
   ├── api/mocks/             # Mock APIs for development
   └── README.md
   ```

### Step 2: Vercel Project Setup

#### Deploy User App (Main Application)

1. **Import Project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Choose "Other" framework preset

2. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `apps/user-app`
   - **Build Command**: `cd ../.. && npm run build:user`
   - **Output Directory**: `apps/user-app/.next`
   - **Install Command**: `npm install`

3. **Environment Variables**
   Add the following environment variables in Vercel dashboard:

   ```env
   # Firebase (Required)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

   # App Configuration
   NEXT_PUBLIC_USE_MOCK_APIS=true
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_ENABLE_PWA=true
   NEXT_PUBLIC_ENABLE_ANALYTICS=false
   ```

#### Deploy Admin Portal (Separate Project)

1. **Create Second Vercel Project**
   - Import the same GitHub repository
   - Name it `eventza-admin`

2. **Configure Admin Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `apps/admin-portal`
   - **Build Command**: `cd ../.. && npm run build:admin`
   - **Output Directory**: `apps/admin-portal/.next`
   - **Install Command**: `npm install`

3. **Admin Environment Variables**
   Same as user app, but update:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-admin-domain.vercel.app
   ```

### Step 3: Custom Domains (Optional)

1. **Add Custom Domains**
   - User App: `eventza.co.za` or `your-domain.com`
   - Admin Portal: `admin.eventza.co.za` or `admin.your-domain.com`

2. **Configure DNS**
   - Add CNAME records pointing to Vercel
   - Vercel will automatically handle SSL certificates

### Step 4: Firebase Setup

1. **Create Firebase Project**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize project (optional, for functions)
   firebase init
   ```

2. **Configure Firebase Authentication**
   - Enable Email/Password authentication
   - Enable Google authentication
   - Configure authorized domains (add your Vercel URLs)

3. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Events are public for reading, restricted for writing
       match /events/{eventId} {
         allow read: if true;
         allow write: if request.auth != null && 
           (resource.data.organizerId == request.auth.uid || 
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
       }
       
       // Tickets can only be managed by owners
       match /tickets/{ticketId} {
         allow read, write: if request.auth != null && 
           (resource.data.userId == request.auth.uid ||
            get(/databases/$(database)/documents/events/$(resource.data.eventId)).data.organizerId == request.auth.uid);
       }
     }
   }
   ```

## 🔧 Advanced Configuration

### Monorepo Deployment Strategy

The project uses a monorepo structure but deploys as separate applications for better performance and scaling:

1. **User App** - Handles all public-facing features
2. **Admin Portal** - Separate deployment for organizer dashboard
3. **Shared Dependencies** - Automatically built and included

### Build Optimization

```json
// Root package.json scripts
{
  "build:user": "turbo run build --filter=user-app",
  "build:admin": "turbo run build --filter=admin-portal", 
  "dev": "turbo run dev --parallel",
  "dev:user": "turbo run dev --filter=user-app",
  "dev:admin": "turbo run dev --filter=admin-portal"
}
```

### Environment-Specific Configuration

```bash
# Development
NEXT_PUBLIC_USE_MOCK_APIS=true
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Staging
NEXT_PUBLIC_USE_MOCK_APIS=true
NEXT_PUBLIC_APP_URL=https://staging.eventza.vercel.app

# Production
NEXT_PUBLIC_USE_MOCK_APIS=false
NEXT_PUBLIC_APP_URL=https://eventza.co.za
```

## 🧪 Testing Deployment

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase project setup complete
- [ ] Build succeeds locally
- [ ] Mock APIs working
- [ ] Authentication flow tested
- [ ] Mobile responsiveness verified

### Local Testing

```bash
# Install dependencies
npm install

# Test user app
npm run dev:user
# Visit http://localhost:3000

# Test admin portal  
npm run dev:admin
# Visit http://localhost:3001

# Test production builds
npm run build
npm run start
```

### Deployment Testing

1. **User App Testing**
   - Event discovery functionality
   - Search and filters
   - Mock payment flows
   - Authentication
   - Mobile experience

2. **Admin Portal Testing**
   - Dashboard analytics
   - Event creation
   - User management
   - Reports and exports

## 🔍 Monitoring & Analytics

### Vercel Analytics
- Automatically enabled for performance monitoring
- View real user metrics in Vercel dashboard

### Error Monitoring
```javascript
// Optional: Add Sentry for error tracking
// npm install @sentry/nextjs
```

### Custom Analytics
```javascript
// Optional: Add Google Analytics
// NEXT_PUBLIC_GA_TRACKING_ID in environment variables
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Vercel cache
   npx vercel --prod --force

   # Check build logs in Vercel dashboard
   # Verify all environment variables are set
   ```

2. **Firebase Connection Issues**
   - Verify all Firebase environment variables
   - Check Firebase project permissions
   - Ensure authorized domains include Vercel URLs

3. **Package Dependencies**
   ```bash
   # Clear all node_modules and reinstall
   npm run clean
   npm install

   # Update dependencies
   npm update
   ```

4. **Monorepo Path Issues**
   - Ensure build commands use correct relative paths
   - Verify workspace configuration in package.json
   - Check Turbo configuration

### Performance Optimization

1. **Image Optimization**
   ```javascript
   // next.config.js
   images: {
     domains: ['firebasestorage.googleapis.com', 'images.unsplash.com'],
     formats: ['image/webp', 'image/avif'],
   }
   ```

2. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   npm install --save-dev @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

## 🔄 Continuous Deployment

### Automatic Deployments
- Vercel automatically deploys on push to `main` branch
- Preview deployments created for all pull requests
- Both apps deploy independently

### Manual Deployments
```bash
# Deploy user app
vercel --cwd apps/user-app

# Deploy admin portal
vercel --cwd apps/admin-portal
```

### Production Deployment Workflow

1. **Development** → Push to feature branch
2. **Pull Request** → Preview deployment created automatically  
3. **Code Review** → Team reviews changes
4. **Merge to Main** → Automatic production deployment
5. **Post-Deploy** → Monitoring and testing

## 🌍 South African Considerations

### Local Payment Integration
When ready for production, replace mock APIs with real integrations:

- **PayFast**: South African payment gateway
- **Ozow**: Instant EFT payments  
- **SnapScan/Zapper**: QR code payments

### Compliance
- **POPIA**: Ensure data protection compliance
- **Tax**: Configure for South African tax requirements
- **Languages**: Multi-language support (EN, AF, ZU, XH)

---

## 📞 Support

If you encounter issues during deployment:

1. Check Vercel build logs
2. Verify environment variables
3. Test Firebase connectivity
4. Review GitHub Actions (if configured)

For platform-specific issues, consult:
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

**🇿🇦 Built for South Africa with load-shedding resilience and local payment methods!**