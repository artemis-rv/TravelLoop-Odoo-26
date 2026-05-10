import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { Loader } from '@/components/common/Loader'
import { Button } from '@/components/ui/Button'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import api from '@/services/api'
import toast from 'react-hot-toast'

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
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
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-6xl mb-4">🏜️</p>
        <h2 className="text-2xl font-black mb-4">Trip not found</h2>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    )
  }

  const startDate = selectedTrip.start_date ? new Date(selectedTrip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'
  const endDate = selectedTrip.end_date ? new Date(selectedTrip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="relative h-[450px] rounded-[48px] overflow-hidden shadow-2xl group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-brand-gold text-brand-dark px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              Upcoming Trip
            </span>
            <span className="text-white/60 font-medium">|</span>
            <span className="text-white/80 font-bold">{startDate} — {endDate}</span>
          </div>
          <h1 className="text-7xl font-black mb-6 tracking-tight">{selectedTrip.destination}</h1>
          <div className="flex gap-4">
            <Button size="lg" onClick={() => navigate(`/trip/${id}/itinerary`)}>
              Edit Itinerary
            </Button>
            <Button variant="secondary" size="lg" className="!bg-white/10 !text-white !border-white/20 backdrop-blur-md" onClick={() => navigate(`/trip/${id}/budget`)}>
              Track Budget
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-brand-border rounded-[36px] p-10 shadow-sm">
            <h2 className="text-2xl font-black mb-6">About this adventure</h2>
            <p className="text-brand-muted text-xl leading-relaxed whitespace-pre-wrap">
              {selectedTrip.description || "No description provided for this trip yet. Start planning your activities to make it memorable!"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-brand-light border border-brand-border rounded-[32px] p-8 flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🎒</span>
              <h3 className="font-bold text-brand-muted uppercase text-xs tracking-widest mb-2">Packing Status</h3>
              <p className="text-2xl font-black">12 / 24 Items</p>
              <Link to={`/trip/${id}/checklist`} className="text-brand-gold font-bold mt-4 hover:underline">Manage List →</Link>
            </div>
            <div className="bg-brand-light border border-brand-border rounded-[32px] p-8 flex flex-col items-center text-center">
              <span className="text-4xl mb-4">📝</span>
              <h3 className="font-bold text-brand-muted uppercase text-xs tracking-widest mb-2">Travel Notes</h3>
              <p className="text-2xl font-black">{selectedTrip.notes?.length || 0} Saved</p>
              <Link to={`/trip/${id}/notes`} className="text-brand-gold font-bold mt-4 hover:underline">View Notes →</Link>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <div className="bg-brand-dark text-white rounded-[36px] p-8 shadow-xl">
            <h2 className="text-xl font-black mb-8 text-brand-gold">Trip Summary</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60">Travelers</span>
                <span className="font-bold">{selectedTrip.travelers?.length || 1} People</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60">Estimated Budget</span>
                <span className="font-bold text-brand-gold text-xl">$1,200.00</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60">Expenses Paid</span>
                <span className="font-bold">$450.00</span>
              </div>
              <div className="pt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/40">Budget Utilization</span>
                  <span className="text-brand-gold">38%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gold w-[38%]" />
                </div>
              </div>
            </div>
            <Button className="w-full mt-10" variant="secondary" onClick={() => navigate(`/trip/${id}/budget`)}>
              Detailed Report
            </Button>
          </div>

          <div className="bg-white border border-brand-border rounded-[36px] p-8">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="secondary" className="!justify-start gap-3">
                <span>📂</span> Share with friends
              </Button>
              <Button variant="secondary" className="!justify-start gap-3">
                <span>📄</span> Export to PDF
              </Button>
              <Button variant="secondary" className="!justify-start gap-3 text-red-500 hover:bg-red-50 border-red-100">
                <span>🗑️</span> Cancel Trip
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
