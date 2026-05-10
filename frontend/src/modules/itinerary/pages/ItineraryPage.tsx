import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import api from '@/services/api'
import toast from 'react-hot-toast'

export const ItineraryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const selectedTrip = useTripStore((state) => state.selectedTrip)
  const setSelectedTrip = useTripStore((state) => state.setSelectedTrip)
  const isLoading = useTripStore((state) => state.isLoading)
  const setLoading = useTripStore((state) => state.setLoading)

  useEffect(() => {
    if (id && !selectedTrip) {
      fetchTrip(id)
    }
  }, [id, selectedTrip])

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

  if (!selectedTrip || !selectedTrip.stops || selectedTrip.stops.length === 0) {
    return (
      <div>
        <h1 className="text-5xl font-black mb-10">Travel Itinerary</h1>
        <EmptyState
          icon="📅"
          title="No stops yet"
          description="Add stops to your trip to build your itinerary"
        />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-5xl font-black mb-10">Travel Itinerary</h1>

      <div className="space-y-6">
        {selectedTrip.stops.map((stop, index) => (
          <div
            key={stop.id}
            className="bg-white border border-brand-border rounded-[28px] p-8"
          >
            <div className="text-brand-gold font-black mb-3 text-lg">
              DAY {index + 1} - {stop.city}
            </div>
            <div className="space-y-3">
              {stop.activities && stop.activities.length > 0 ? (
                stop.activities.map((activity) => (
                  <div key={activity.id} className="text-lg font-semibold text-brand-text">
                    • {activity.title}
                  </div>
                ))
              ) : (
                <div className="text-brand-muted">No activities planned</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
