import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import api from '@/services/api'
import { useTripStore } from '@/store/trip.store'
import toast from 'react-hot-toast'

interface ActivitySuggestion {
  name: string
  kinds: string
  image?: string
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop',
]

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const addTrip = useTripStore((state) => state.addTrip)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [formData, setFormData] = useState({
    place: searchParams.get('place') || '',
    startDate: '',
    endDate: '',
  })

  // Fetch suggestions when place changes
  useEffect(() => {
    const place = searchParams.get('place')
    if (place) {
      setFormData((prev) => ({ ...prev, place }))
      fetchSuggestions(place)
    }
  }, [])

  const fetchSuggestions = async (city: string) => {
    if (!city.trim()) return
    setLoadingSuggestions(true)
    try {
      const response = await api.get(`/search/activities?city=${encodeURIComponent(city)}`)
      const data = response.data?.data || (Array.isArray(response.data) ? response.data : [])
      setSuggestions((data as any[]).slice(0, 6))
    } catch {
      // Silently fail — suggestions are optional
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceBlur = () => {
    if (formData.place.trim()) {
      fetchSuggestions(formData.place)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!formData.place || !formData.startDate || !formData.endDate) {
      setGeneralError('Please fill in all required fields')
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setGeneralError('End date must be after start date')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/trips', {
        title: formData.place,
        destination: formData.place,
        start_date: formData.startDate,
        end_date: formData.endDate,
      })

      addTrip(response.data)
      toast.success('Trip created successfully! ✈️')
      navigate('/')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create trip'
      setGeneralError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Plan Form */}
      <div className="bg-white rounded-[36px] border border-brand-border p-10">
        <h1 className="text-3xl font-black mb-6 text-brand-text">Plan a new trip</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {generalError}
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="w-32 text-sm font-semibold text-brand-text shrink-0">Select a Place:</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              onBlur={handlePlaceBlur}
              placeholder="e.g. Goa, Paris, Tokyo"
              required
              disabled={loading}
              className="flex-1 border border-brand-border px-4 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="w-32 text-sm font-semibold text-brand-text shrink-0">Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={loading}
              className="flex-1 border border-brand-border px-4 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="w-32 text-sm font-semibold text-brand-text shrink-0">End Date:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              disabled={loading}
              className="flex-1 border border-brand-border px-4 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} size="lg" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Trip'}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/')}
              disabled={loading}
              className="flex-1 bg-brand-light text-brand-text border border-brand-border hover:bg-gray-100"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Suggestions Section */}
      <div className="bg-white rounded-[36px] border border-brand-border p-8">
        <h2 className="text-lg font-bold text-brand-text mb-5 border-b border-brand-border pb-3">
          Suggestion for Places to Visit / Activities to perform
        </h2>

        {loadingSuggestions ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl overflow-hidden relative border border-brand-border hover:scale-105 transition cursor-pointer"
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${PLACEHOLDER_IMAGES[i % 6]})` }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                  <span className="text-white text-xs font-bold leading-tight line-clamp-2">{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {PLACEHOLDER_IMAGES.map((img, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl overflow-hidden border border-brand-border bg-gray-50"
                style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            ))}
          </div>
        )}

        {!formData.place && (
          <p className="text-center text-brand-muted text-sm mt-4">
            Enter a place above to see activity suggestions
          </p>
        )}
      </div>
    </div>
  )
}
