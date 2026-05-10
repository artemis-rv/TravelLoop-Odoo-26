import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from './ProtectedRoute'
import { Dashboard } from '@/modules/dashboard/pages/Dashboard'
import { CreateTrip } from '@/modules/trip/pages/CreateTrip'
import { TripDetailsPage } from '@/modules/trip/pages/TripDetailsPage'
import { ItineraryPage } from '@/modules/itinerary/pages/ItineraryPage'
import { BudgetPage } from '@/modules/expense/pages/BudgetPage'
import { ChecklistPage } from '@/modules/packing/pages/ChecklistPage'
import { NotesPage } from '@/modules/notes/pages/NotesPage'
import { CommunityPage } from '@/modules/shared/pages/CommunityPage'
import { ProfilePage } from '@/modules/profile/pages/ProfilePage'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/pages/RegisterPage'
import { WelcomePage } from '@/modules/auth/pages/WelcomePage'
import { SearchPage } from '@/modules/shared/pages/SearchPage'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Welcome / Landing page — default entry point */}
      <Route path="/welcome" element={<WelcomePage />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={<ProtectedRoute element={<Layout />} />}
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="trip/create" element={<CreateTrip />} />
        <Route path="trip/:id" element={<TripDetailsPage />} />
        <Route path="trip/:id/itinerary" element={<ItineraryPage />} />
        <Route path="trip/:id/budget" element={<BudgetPage />} />
        <Route path="trip/:id/checklist" element={<ChecklistPage />} />
        <Route path="trip/:id/notes" element={<NotesPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>

      {/* Redirect bare / to /welcome for unauthenticated, handled inside ProtectedRoute */}
      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-black text-brand-gold mb-4">404</h1>
              <p className="text-2xl text-brand-text mb-8">Page not found</p>
              <a
                href="/welcome"
                className="bg-brand-gold text-brand-dark px-8 py-4 rounded-2xl font-bold inline-block hover:scale-105 transition"
              >
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  )
}
