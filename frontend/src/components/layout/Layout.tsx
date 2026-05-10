import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-brand-light text-brand-text">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
