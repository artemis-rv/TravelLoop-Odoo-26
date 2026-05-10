import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import { useTripStore } from '@/store/trip.store'
import api from '@/services/api'
import toast from 'react-hot-toast'

const TRIP_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
]

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  const trips = useTripStore((state) => state.trips)
  const setTrips = useTripStore((state) => state.setTrips)

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/trips')
        setTrips(response.data.trips || [])
      } catch { /* silently fail */ }
    }
    if (trips.length === 0) fetchTrips()
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required')
      return
    }
    setLoading(true)
    try {
      const response = await api.put('/user/profile', { name: formData.name, email: formData.email })
      setUser(response.data.user)
      toast.success('Profile updated! ✨')
      setIsEditing(false)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Split trips into preplanned (upcoming) and previous (past/completed)
  const now = new Date()
  const preplannedTrips = trips.filter((t) => t.start_date && new Date(t.start_date) >= now).slice(0, 3)
  const previousTrips = trips.filter((t) => t.start_date && new Date(t.start_date) < now).slice(0, 3)

  const TripCard = ({ trip, index }: { trip: any; index: number }) => (
    <div className="bg-white rounded-2xl overflow-hidden border border-brand-border hover:shadow-md transition">
      <div
        className="h-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${TRIP_IMAGES[index % 3]})` }}
      />
      <div className="p-3">
        <p className="font-bold text-sm truncate mb-2">{trip.destination || trip.title}</p>
        <Link
          to={`/trip/${trip.id}`}
          className="block w-full text-center bg-brand-gold py-1.5 rounded-xl text-sm font-bold hover:scale-105 transition"
        >
          View
        </Link>
      </div>
    </div>
  )

  const EmptyTripSlots = () => (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-gray-50 rounded-2xl border border-dashed border-brand-border h-48 flex items-end p-3">
          <div className="w-full text-center text-brand-muted text-sm">No trip</div>
        </div>
      ))}
    </>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Profile Header */}
      <div className="bg-white rounded-[36px] border border-brand-border p-8">
        <div className="flex items-start gap-6">

          {/* Profile Image */}
          <div
            className="relative cursor-pointer shrink-0"
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            <div className="w-28 h-28 rounded-full bg-brand-gold border-4 border-brand-border flex items-center justify-center overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-5xl font-black">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            {isEditing && (
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center text-white text-xs font-bold">
                Edit
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          {/* User Details */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex-1 space-y-3">
              <p className="text-xs text-brand-muted mb-1">User Details with appropriate options to edit those information...</p>
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
              <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading} />
              <div className="flex gap-3 pt-1">
                <Button type="submit" loading={loading} size="lg" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  className="bg-brand-light text-brand-text border border-brand-border hover:bg-gray-100"
                  size="lg"
                  onClick={() => { setIsEditing(false); setFormData({ name: user?.name || '', email: user?.email || '' }) }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex-1">
              <p className="text-xs text-brand-muted mb-3">User Details with appropriate options to edit those information...</p>
              <div className="bg-brand-light rounded-2xl p-5 space-y-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-brand-muted text-sm w-16">Name</span>
                  <span className="font-bold">{user?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-brand-muted text-sm w-16">Email</span>
                  <span className="font-bold">{user?.email}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  onClick={() => { logout(); window.location.href = '/welcome' }}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preplanned Trips */}
      <div>
        <h2 className="text-2xl font-black mb-4 text-brand-text">Preplanned Trips</h2>
        <div className="grid grid-cols-3 gap-4">
          {preplannedTrips.length > 0
            ? preplannedTrips.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} />)
            : <EmptyTripSlots />}
        </div>
      </div>

      {/* Previous Trips */}
      <div>
        <h2 className="text-2xl font-black mb-4 text-brand-text">Previous Trips</h2>
        <div className="grid grid-cols-3 gap-4">
          {previousTrips.length > 0
            ? previousTrips.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} />)
            : <EmptyTripSlots />}
        </div>
      </div>

    </div>
  )
}
