import { useEffect, useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { EmptyState } from '@/components/common/EmptyState'
import { SkeletonGrid } from '@/components/ui/Skeleton'
import { filterTrips, sortTrips, TripFilter } from '@/utils/filtering'
import api from '@/services/api'
import toast from 'react-hot-toast'

interface CityResult {
  name: string
  country: string
  latitude: number
  longitude: number
}

const REGIONAL_SELECTIONS = [
  { label: 'Bali', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop' },
  { label: 'Tokyo', image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=400&auto=format&fit=crop' },
  { label: 'Paris', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=400&auto=format&fit=crop' },
  { label: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop' },
  { label: 'New York', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=400&auto=format&fit=crop' },
]

export const Dashboard: React.FC = () => {
  const trips = useTripStore((state) => state.trips)
  const setTrips = useTripStore((state) => state.setTrips)
  const isLoading = useTripStore((state) => state.isLoading)
  const setLoading = useTripStore((state) => state.setLoading)
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [citySuggestions, setCitySuggestions] = useState<CityResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [filters, setFilters] = useState<TripFilter>({ status: 'all' })
  const [sortBy, setSortBy] = useState<'date' | 'destination' | 'budget'>('date')
  const [groupBy, setGroupBy] = useState<'none' | 'status' | 'destination'>('none')
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetchTrips()
  }, [])

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
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

  const searchCities = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setCitySuggestions([])
      setShowSuggestions(false)
      return
    }
    setSearchLoading(true)
    try {
      const response = await api.get(`/search/cities?q=${encodeURIComponent(query)}`)
      // Robust parsing: handle both { success, data } and raw array responses
      const results = response.data?.data || (Array.isArray(response.data) ? response.data : [])
      setCitySuggestions(results.slice(0, 6))
      setShowSuggestions(true)
    } catch (err) {
      console.error('City search failed:', err)
      setCitySuggestions([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchCities(val), 500)
  }

  const handleCitySelect = (city: CityResult) => {
    setSearchQuery(city.name)
    setShowSuggestions(false)
    navigate(`/trip/create?place=${encodeURIComponent(city.name)}`)
  }

  const filteredTrips = filterTrips(trips, filters)
  const sortedTrips = sortTrips(filteredTrips, sortBy)

  const TRIP_IMAGES = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
  ]

  const trips_list = sortedTrips.map((trip, index) => ({
    id: trip.id,
    title: trip.destination,
    image: TRIP_IMAGES[index % 3],
  }))

  return (
    <div className="space-y-10 relative">

      {/* Banner Image */}
      <section
        className="rounded-[36px] overflow-hidden min-h-[380px] flex items-end p-12 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.65)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black leading-tight mb-4">Explore The World Beautifully</h1>
          <p className="text-lg text-white/80 mb-6 leading-relaxed">
            Create luxurious travel experiences, manage itineraries, budgets, notes and community trips.
          </p>
        </div>
      </section>

      {/* Search Bar + Controls (GeoDB integrated) */}
      <section className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Search destinations... (powered by GeoDB)"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
            className="w-full border border-brand-border px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all bg-white pr-10"
          />
          {searchLoading && (
            <span className="absolute right-4 top-3.5 text-brand-muted text-sm animate-pulse">⏳</span>
          )}

          {/* City suggestions dropdown */}
          {showSuggestions && citySuggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-brand-border rounded-2xl shadow-xl z-50 overflow-hidden">
              {citySuggestions.map((city, i) => (
                <button
                  key={i}
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-5 py-3 hover:bg-brand-light transition flex items-center justify-between border-b border-brand-border/50 last:border-0"
                >
                  <span className="font-semibold text-brand-text">{city.name}</span>
                  <span className="text-brand-muted text-sm">{city.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as any)}
          className="border border-brand-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-brand-text"
        >
          <option value="none">Group by</option>
          <option value="status">Status</option>
          <option value="destination">Destination</option>
        </select>

        <select
          value={filters.status || 'all'}
          onChange={(e) => setFilters({ status: e.target.value as any })}
          className="border border-brand-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-brand-text"
        >
          <option value="all">Filter</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border border-brand-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-brand-text"
        >
          <option value="date">Sort by...</option>
          <option value="date">Date</option>
          <option value="destination">Destination</option>
          <option value="budget">Budget</option>
        </select>
      </section>

      {/* Top Regional Selections */}
      <section>
        <h2 className="text-2xl font-black mb-5 text-brand-text">Top Regional Selections</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {REGIONAL_SELECTIONS.map((place) => (
            <div
              key={place.label}
              onClick={() => navigate(`/trip/create?place=${encodeURIComponent(place.label)}`)}
              className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden relative cursor-pointer hover:scale-105 transition border border-brand-border"
            >
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${place.image})` }} />
              <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                <span className="text-white text-xs font-bold">{place.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      <section>
        <h2 className="text-2xl font-black mb-5 text-brand-text">Previous Trips</h2>

        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : trips_list.length === 0 ? (
          <div className="bg-white rounded-[30px] border border-brand-border p-8">
            <EmptyState
              icon="✈️"
              title="No trips yet"
              description="Start planning your next adventure"
              action={{ label: 'Plan a trip', onClick: () => navigate('/trip/create') }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trips_list.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-[30px] overflow-hidden border border-brand-border hover:shadow-lg transition"
              >
                <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${trip.image})` }} />
                <div className="p-5">
                  <h3 className="text-xl font-black mb-3">{trip.title}</h3>
                  <div className="flex gap-3">
                    <Link
                      to={`/trip/${trip.id}`}
                      className="flex-1 bg-brand-gold text-center py-2.5 rounded-2xl font-bold hover:scale-105 transition text-sm"
                    >
                      View
                    </Link>
                    <Link
                      to={`/trip/${trip.id}/budget`}
                      className="bg-brand-light px-4 py-2.5 rounded-2xl font-bold hover:bg-brand-border transition text-sm"
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

      {/* Floating "+ Plan a trip" button */}
      <Link
        to="/trip/create"
        className="fixed bottom-8 right-8 bg-brand-gold text-brand-dark px-6 py-4 rounded-full font-black shadow-xl hover:scale-105 transition flex items-center gap-2 z-50"
      >
        <span className="text-xl">+</span> Plan a trip
      </Link>
    </div>
  )
}
