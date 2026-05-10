import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { EmptyState } from '@/components/common/EmptyState'
import { TripFilterPanel } from '@/components/common/TripFilterPanel'
import { SkeletonGrid } from '@/components/ui/Skeleton'
import { filterTrips, sortTrips, TripFilter } from '@/utils/filtering'
import { exportTripsToCSV } from '@/utils/export'
import api from '@/services/api'
import toast from 'react-hot-toast'

export const Dashboard: React.FC = () => {
  const trips = useTripStore((state) => state.trips)
  const setTrips = useTripStore((state) => state.setTrips)
  const isLoading = useTripStore((state) => state.isLoading)
  const setLoading = useTripStore((state) => state.setLoading)
  
  const navigate = useNavigate()
  
  const [filters, setFilters] = useState<TripFilter>({ status: 'all' })
  const [sortBy, setSortBy] = useState<'date' | 'destination' | 'budget'>('date')
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    setLoading(true)
    try {
      const response = await api.get('/trips')
      setTrips(response.data.trips || [])
    } catch (err: any) {
      console.error('Failed to fetch trips:', err)
      toast.error('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: TripFilter) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({ status: 'all' })
  }

  const filteredTrips = filterTrips(trips, filters)
  const sortedTrips = sortTrips(filteredTrips, sortBy)

  // Map trips to display with default images
  const trips_list = sortedTrips.map((trip, index) => ({
    id: trip.id,
    title: trip.destination,
    image: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
    ][index % 3],
  }))

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section
        className="rounded-[36px] overflow-hidden min-h-[450px] flex items-end p-12 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black leading-tight mb-6">Explore The World Beautifully</h1>

          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Create luxurious travel experiences, manage itineraries, budgets, notes and community trips.
          </p>

          <div className="flex gap-4">
            <Link
              to="/trip/create"
              className="bg-brand-gold text-brand-dark px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              Create Trip
            </Link>

            <Link
              to="/community"
              className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          ['Trips Planned', trips.length.toString()],
          ['Countries', '12'],
          ['Saved Budget', '$8.4K'],
          ['Flights', '4'],
        ].map((item) => (
          <div
            key={item[0]}
            className="bg-white border border-brand-border rounded-[30px] p-8"
          >
            <p className="text-brand-muted mb-4">{item[0]}</p>
            <h2 className="text-5xl font-black">{item[1]}</h2>
          </div>
        ))}
      </section>

      {/* Trips Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black">Upcoming Trips</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>🔍</span> Filter
            </button>
            <button
              onClick={() => exportTripsToCSV(sortedTrips)}
              disabled={sortedTrips.length === 0}
              className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>📥</span> Export CSV
            </button>
            <Link
              to="/trip/create"
              className="bg-brand-gold px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
            >
              Create Trip
            </Link>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mb-6">
            <TripFilterPanel onFilterChange={handleFilterChange} onReset={handleResetFilters} />
          </div>
        )}

        {/* Sort Dropdown */}
        {sortedTrips.length > 0 && (
          <div className="mb-6 flex items-center gap-3">
            <label className="font-semibold text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="destination">Destination</option>
              <option value="budget">Budget</option>
            </select>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : sortedTrips.length === 0 ? (
          <div className="bg-white rounded-[30px] border border-brand-border p-8">
            <EmptyState
              icon="✈️"
              title={trips.length === 0 ? "No trips yet" : "No trips match your filters"}
              description={trips.length === 0 ? "Start planning your next adventure" : "Try adjusting your filters"}
              action={{
                label: 'Create Trip',
                onClick: () => navigate('/trip/create'),
              }}
            />
          </div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trips_list.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-[30px] overflow-hidden border border-brand-border hover:shadow-lg transition"
              >
                <div
                  className="h-72 bg-cover bg-center"
                  style={{ backgroundImage: `url(${trip.image})` }}
                />

                <div className="p-6">
                  <h3 className="text-3xl font-black mb-4">{trip.title}</h3>

                  <div className="flex gap-3">
                    <Link
                      to={`/trip/${trip.id}`}
                      className="flex-1 bg-brand-gold text-center py-3 rounded-2xl font-bold hover:scale-105 transition"
                    >
                      View
                    </Link>

                    <Link
                      to={`/trip/${trip.id}/budget`}
                      className="bg-brand-light px-5 py-3 rounded-2xl font-bold hover:bg-brand-border transition"
                    >
                      Budget
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
