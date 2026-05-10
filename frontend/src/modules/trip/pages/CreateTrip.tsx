import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import api from '@/services/api'
import { useTripStore } from '@/store/trip.store'
import toast from 'react-hot-toast'

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate()
  const addTrip = useTripStore((state) => state.addTrip)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    destination: '',
    travelers: '',
    startDate: '',
    endDate: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/trips', {
        title: formData.destination,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
      })

      addTrip(response.data)
      toast.success('Trip created successfully!')
      navigate('/')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create trip'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[36px] border border-brand-border p-10">
      <h1 className="text-5xl font-black mb-10">Create New Trip</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Destination"
            placeholder="Where are you going?"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
            required
          />
          <Input
            label="Number of Travelers"
            type="number"
            placeholder="2"
            value={formData.travelers}
            onChange={(e) =>
              setFormData({ ...formData, travelers: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-text mb-2 block">
            Trip Description
          </label>
          <textarea
            className="border border-brand-border p-4 rounded-2xl w-full h-40 outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            placeholder="Describe your dream trip..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" loading={loading} size="lg">
            Save Trip
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
