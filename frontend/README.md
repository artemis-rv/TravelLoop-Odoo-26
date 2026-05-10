# TravelLoop Frontend

A modern, luxury-focused travel planner frontend built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (recommended 18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── assets/              # Images, fonts, static files
├── components/
│   ├── ui/             # Reusable UI components (Button, Input, Modal, etc.)
│   ├── layout/         # Layout components (Sidebar, Navbar, Layout)
│   └── common/         # Common components (Loader, EmptyState)
├── modules/            # Feature modules
│   ├── auth/           # Authentication pages (Login, Register)
│   ├── dashboard/      # Dashboard pages
│   ├── trip/           # Trip management pages
│   ├── itinerary/      # Itinerary pages
│   ├── expense/        # Budget/Expense pages
│   ├── packing/        # Packing list pages
│   ├── notes/          # Notes pages
│   ├── profile/        # User profile pages
│   ├── search/         # Search pages
│   └── shared/         # Community/Shared trip pages
├── services/           # API and Socket.io services
├── store/              # Zustand stores (auth, trip, ui)
├── hooks/              # Custom React hooks
├── routes/             # Route definitions and guards
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

## 📦 Technologies

- **React 18** - UI framework
- **React Router DOM 6** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization
- **Date-fns** - Date utilities
- **Lucide React** - Icon library

## 🎨 Design System

### Color Palette
- **Primary (Gold)**: `#D4A017`
- **Dark**: `#1A1209`
- **Light**: `#FAF6EE`
- **Text**: `#1A1209`
- **Muted**: `#7B6A58`
- **Border**: `#E8DEC8`

### Component Variants
- Buttons: primary, secondary, outline
- Input: with labels, error states, helper text
- Modal: multiple sizes (sm, md, lg, xl)

## 🔐 Authentication

- Login/Register flow
- JWT token storage in localStorage
- Automatic token injection in API requests
- Protected routes with `ProtectedRoute` component
- Auto logout on token expiration (401 errors)

## 🔌 API Integration

API client is configured in `src/services/api.ts` with:
- Automatic token injection
- Base URL configuration from `.env`
- Error handling and 401 redirect
- Request/response interceptors

### Example API call:
```typescript
import api from '@/services/api'

const trips = await api.get('/trips')
const newTrip = await api.post('/trips', tripData)
```

## 🔄 State Management

Using Zustand for lightweight state management:

```typescript
import { useAuthStore } from '@/store/auth.store'

const { user, token, logout } = useAuthStore()
```

### Available Stores:
- `auth.store.ts` - Authentication state
- `trip.store.ts` - Trip data and operations
- `ui.store.ts` - UI state (sidebar, notifications, etc.)

## 🎯 Routing

Routes are defined in `src/routes/AppRoutes.tsx`. Protected routes use the `ProtectedRoute` component.

### Public Routes:
- `/auth/login` - Login page
- `/auth/register` - Register page

### Protected Routes:
- `/` - Dashboard
- `/trip/create` - Create trip
- `/trip/:id` - Trip details
- `/trip/:id/itinerary` - Itinerary
- `/trip/:id/budget` - Budget
- `/trip/:id/checklist` - Packing checklist
- `/trip/:id/notes` - Notes
- `/community` - Community trips

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

### Environment variables for production:
```
VITE_API_URL=https://api.example.com
VITE_SOCKET_URL=https://socket.example.com
```

## 📝 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📄 License

ISC
