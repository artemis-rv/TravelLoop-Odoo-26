import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    destination: '',
    travelers: '',
    startDate: '',
    endDate: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Call API to create trip
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[36px] border border-brand-border p-10">
      <h1 className="text-5xl font-black mb-10">Create New Trip</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
