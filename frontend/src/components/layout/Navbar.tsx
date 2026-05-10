import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { Menu, LogOut } from 'lucide-react'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-brand-light/90 backdrop-blur-xl border-b border-brand-border px-8 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-brand-border rounded-2xl transition"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-brand-text">Travel Planner</h2>
          <p className="text-brand-muted text-sm">Premium travel dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-text">{user?.name || 'User'}</p>
            <p className="text-xs text-brand-muted">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-brand-border rounded-2xl transition text-brand-text"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
