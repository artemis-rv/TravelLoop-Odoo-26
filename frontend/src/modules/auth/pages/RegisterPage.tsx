import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import api from '@/services/api'
import toast from 'react-hot-toast'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    additionalInfo: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!formData.firstName || !formData.email || !formData.password) {
      setGeneralError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setGeneralError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setGeneralError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/register', {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      })
      setAuth(response.data)
      toast.success('Account created successfully! 🎉')
      navigate('/')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Registration failed. Please try again.'
      setGeneralError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[36px] border border-brand-border p-10 shadow-md">

        {/* Photo Upload */}
        <div className="flex justify-center mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full bg-brand-light border-2 border-dashed border-brand-border flex items-center justify-center cursor-pointer hover:border-brand-gold transition overflow-hidden"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl select-none">📷</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <h1 className="text-3xl font-black mb-1 text-center text-brand-gold">TravelLoop</h1>
        <p className="text-center text-brand-muted mb-8 text-sm">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {generalError}
            </div>
          )}

          {/* Row 1: First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Row 2: Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Row 3: City + Country */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              placeholder="Mumbai"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
            />
            <Input
              label="Country"
              name="country"
              placeholder="India"
              value={formData.country}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Additional Information */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-brand-text">Additional Information</label>
            <textarea
              name="additionalInfo"
              placeholder="Tell us a bit about yourself..."
              value={formData.additionalInfo}
              onChange={handleChange}
              disabled={loading}
              rows={3}
              className="border border-brand-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              helperText={!formData.password ? "8+ chars, upper, lower, number" : undefined}
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register User'}
          </Button>
        </form>

        <p className="text-center text-brand-muted mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-brand-gold font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
