import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { Loader } from '@/components/common/Loader'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import api from '@/services/api'
import toast from 'react-hot-toast'

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const selectedTrip = useTripStore((state) => state.selectedTrip)
  const setSelectedTrip = useTripStore((state) => state.setSelectedTrip)
  const isLoading = useTripStore((state) => state.isLoading)
  const setLoading = useTripStore((state) => state.setLoading)

  // Initialize real-time updates for this trip
  useRealtimeUpdates(id)

  useEffect(() => {
    if (id) {
      fetchTrip(id)
    }
  }, [id])

  const fetchTrip = async (tripId: string) => {
    setLoading(true)
    try {
      const response = await api.get(`/trips/${tripId}`)
      setSelectedTrip(response.data.trip)
    } catch (err: any) {
      console.error('Failed to fetch trip:', err)
      toast.error('Failed to load trip')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <Loader fullScreen />
  }

  if (!selectedTrip) {
    return <div className="text-center py-10 text-brand-muted">Trip not found</div>
  }

  return (
    <div className="bg-white border border-brand-border rounded-[36px] overflow-hidden">
      <div
        className="h-[420px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600&auto=format&fit=crop')",
        }}
      />

      <div className="p-10">
        <h1 className="text-6xl font-black mb-6">{selectedTrip.destination}</h1>

        <p className="text-brand-muted text-lg mb-8 max-w-3xl">
          {selectedTrip.description}
        </p>

        <div className="flex gap-4">
          <Link
            to={`/trip/${selectedTrip.id}/itinerary`}
            className="bg-brand-gold px-8 py-4 rounded-2xl font-black hover:scale-105 transition"
          >
            View Itinerary
          </Link>

          <Link
            to={`/trip/${selectedTrip.id}/budget`}
            className="bg-brand-light px-8 py-4 rounded-2xl font-black hover:bg-brand-border transition"
          >
            View Budget
          </Link>
        </div>
      </div>
    </div>
  )
}
