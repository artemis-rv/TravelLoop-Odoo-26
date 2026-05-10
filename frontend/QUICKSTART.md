# 🚀 TravelLoop Frontend - Quick Start Guide

Get the frontend up and running in 5 minutes!

## Prerequisites
- Node.js 16+ (recommended 18+)
- npm or yarn

## 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
cd frontend
npm install
```

### Step 2: Setup Environment (1 min)
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 3: Start Dev Server (2 min)
```bash
npm run dev
```

Visit: **http://localhost:5173**

---

## 🎯 What You Get

✅ **10 Complete Pages**
- Dashboard with hero section
- Login & Registration
- Create Trip form
- Trip details, itinerary, budget
- Packing checklist
- Notes editor
- Community feed
- User profile

✅ **Ready-to-Use Components**
- Button, Input, Modal
- Sidebar, Navbar, Layout
- Loader, EmptyState

✅ **State Management**
- Zustand stores for auth, trips, UI

✅ **API Ready**
- Axios client with interceptors
- Socket.io client configured

✅ **Protected Routes**
- Auth flow with JWT tokens
- Automatic logout on 401

---

## 🔓 Test Credentials (Mock)

After clicking "Create Account" or "Sign In":
- Any email works (no validation yet)
- Any password works (no validation yet)
- This uses mock data - connect to real API next

---

## 📁 Project Structure

```
frontend/src/
├── components/     Reusable UI components
├── modules/        Feature pages (auth, dashboard, trip, etc.)
├── services/       API and Socket.io
├── store/          Zustand state management
├── routes/         Route definitions
├── types/          TypeScript interfaces
└── utils/          Helpers and constants
```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type check
```

---

## 🔌 Next Steps - API Integration

The frontend is ready for backend integration! To connect the backend:

### 1. Make sure backend is running
```bash
cd backend
npm run dev
# Should be running on http://localhost:5000
```

### 2. Connect API endpoints

**Example: Login endpoint**

In `src/modules/auth/pages/LoginPage.tsx`, replace the mock login with:
```typescript
import api from '@/services/api'

const handleSubmit = async (e: React.FormEvent) => {
  try {
    const response = await api.post('/auth/login', formData)
    setAuth(response.data)
    navigate('/')
  } catch (err) {
    setError(err.response?.data?.error)
  }
}
```

See `SETUP.md` for complete integration checklist.

---

## 🎨 Customization

### Change Color Theme
Edit `tailwind.config.js`:
```javascript
colors: {
  brand: {
    gold: '#YOUR_COLOR',    // Change primary color
    dark: '#YOUR_COLOR',    // Change dark background
    light: '#YOUR_COLOR',   // Change light background
  }
}
```

### Add New Page
1. Create file: `src/modules/yourmodule/pages/YourPage.tsx`
2. Add route in `src/routes/AppRoutes.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Add New Component
1. Create file: `src/components/common/YourComponent.tsx`
2. Export from component and use anywhere

---

## 🐛 Common Issues

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

### Module not found errors
```bash
npm install
npm run type-check
```

### Tailwind not styling
```bash
npm run build
npm run preview
```

---

## 📚 Documentation

- **README.md** - Full project documentation
- **SETUP.md** - Complete setup guide + API integration
- **RESTRUCTURING_SUMMARY.md** - What was created
- **MANIFEST.md** - Complete file listing

---

## 🆘 Need Help?

1. Check if backend API is running on port 5000
2. Verify `.env` has correct API URLs
3. Check browser console for errors
4. Run `npm run type-check` for TypeScript errors
5. Review `SETUP.md` for integration guide

---

## ✨ Key Features

✅ React 18 + TypeScript  
✅ Vite for fast development  
✅ Tailwind CSS styling  
✅ Zustand state management  
✅ React Router v6  
✅ Axios HTTP client  
✅ Socket.io real-time ready  
✅ Protected routes  
✅ Responsive design  
✅ Production-ready  

---

## 🎉 You're All Set!

The frontend is now running! Next:

1. ✅ Frontend running at http://localhost:5173
2. ▶️ Start backend at http://localhost:5000
3. ▶️ Connect API endpoints
4. ▶️ Test end-to-end flow
5. ▶️ Deploy to production

Happy coding! 🚀
