import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Navigate } from 'react-router-dom'

export const WelcomePage: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  // If already logged in, skip welcome and go straight to dashboard
  if (isHydrated && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.7)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1920&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl px-6">
        {/* Logo */}
        <h1 className="text-6xl font-black text-brand-gold mb-3 tracking-tight">TravelLoop</h1>
        <p className="text-white/60 text-lg mb-12 tracking-wide uppercase text-sm">Your premium travel companion</p>

        {/* Hero text */}
        <h2 className="text-5xl font-black leading-tight mb-6">
          Explore The World<br />
          <span className="text-brand-gold">Beautifully</span>
        </h2>
        <p className="text-white/75 text-lg mb-12 leading-relaxed">
          Plan luxurious travel experiences, manage itineraries, budgets, notes and join a community of passionate travellers.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/auth/login"
            className="bg-brand-gold text-brand-dark px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-lg shadow-brand-gold/30"
          >
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className="bg-white/10 border border-white/30 backdrop-blur-sm px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition"
          >
            Create Account
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-16">
          {['✈️ Trip Planning', '🗺️ Itineraries', '💰 Budget Tracker', '📝 Notes', '🌍 Community'].map((f) => (
            <span
              key={f}
              className="bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
