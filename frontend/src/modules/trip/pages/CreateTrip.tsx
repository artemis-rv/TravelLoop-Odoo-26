import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import api from '@/services/api'
import { useTripStore } from '@/store/trip.store'
import toast from 'react-hot-toast'
import { validateField, FieldError, validateFormComplete, validateDateRange } from '@/utils/validation'

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate()
  const addTrip = useTripStore((state) => state.addTrip)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    destination: '',
    travelers: '',
    startDate: '',
    endDate: '',
    description: '',
  })

  const validateSingleField = (fieldName: string, value: string) => {
    const error = validateField(fieldName, value)
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: error.message }))
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))
    validateSingleField(fieldName, formData[fieldName as keyof typeof formData])

    // Validate date range
    if (fieldName === 'endDate' && formData.startDate && formData.endDate) {
      if (!validateDateRange(formData.startDate, formData.endDate)) {
        setFieldErrors((prev) => ({
          ...prev,
          endDate: 'End date must be after start date',
        }))
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.endDate
          return newErrors
        })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      validateSingleField(name, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    // Validate all fields
    const errors = validateFormComplete(formData, [
      'destination',
      'startDate',
      'endDate',
      'description',
    ])
    if (errors.length > 0) {
      const errorMap: Record<string, string> = {}
      errors.forEach((error: FieldError) => {
        errorMap[error.field] = error.message
      })
      setFieldErrors(errorMap)
      toast.error('Please fix the errors below')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/trips', {
        title: formData.destination,
        description: formData.description,
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
    <div className="max-w-4xl mx-auto bg-white rounded-[36px] border border-brand-border p-10">
      <h1 className="text-5xl font-black mb-2">Create New Trip</h1>
      <p className="text-brand-muted mb-8">Plan your next adventure with TravelLoop</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {generalError && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {generalError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Input
              label="Destination"
              name="destination"
              placeholder="Where are you going?"
              value={formData.destination}
              onChange={handleChange}
              onBlur={() => handleBlur('destination')}
              required
              error={touched['destination'] && fieldErrors['destination']}
              disabled={loading}
            />
          </div>

          <div>
            <Input
              label="Number of Travelers"
              type="number"
              name="travelers"
              placeholder="2"
              value={formData.travelers}
              onChange={handleChange}
              onBlur={() => handleBlur('travelers')}
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              onBlur={() => handleBlur('startDate')}
              required
              error={touched['startDate'] && fieldErrors['startDate']}
              disabled={loading}
            />
          </div>

          <div>
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              onBlur={() => handleBlur('endDate')}
              required
              error={touched['endDate'] && fieldErrors['endDate']}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-text block mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Tell us about your trip..."
            value={formData.description}
            onChange={handleChange}
            onBlur={() => handleBlur('description')}
            disabled={loading}
            className={`w-full border border-brand-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all resize-none h-24 ${
              fieldErrors['description'] ? 'border-red-500 focus:ring-red-500' : ''
            }`}
          />
          <p className="text-xs text-brand-muted mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            loading={loading} 
            className="flex-1" 
            size="lg"
            disabled={Object.keys(fieldErrors).length > 0 || loading}
          >
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
  )
}

