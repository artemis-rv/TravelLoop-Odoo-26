import { NavLink } from 'react-router-dom'
import { useUIStore } from '@/store/ui.store'

export const Sidebar: React.FC = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  const items = [
    ['Dashboard', '/'],
    ['Create Trip', '/trip/create'],
    ['Profile', '/profile'],
    ['Community', '/community'],
  ]

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-72' : 'w-20'
      } min-h-screen bg-brand-dark border-r border-brand-darkAlt p-6 hidden lg:flex flex-col transition-all duration-300`}
    >
      <h1 className="text-3xl font-black mb-10 text-brand-gold tracking-tight truncate">
        {sidebarOpen && 'TravelLoop'}
      </h1>

      <div className="space-y-3 flex-1">
        {items.map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block px-5 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/30'
                  : 'bg-brand-darkAlt text-brand-light hover:bg-[#332316]'
              } ${!sidebarOpen && 'px-3 text-center'}`
            }
          >
            {sidebarOpen ? label : label.charAt(0)}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
