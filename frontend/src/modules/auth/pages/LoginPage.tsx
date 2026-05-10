import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import api from '@/services/api'
import toast from 'react-hot-toast'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!formData.email || !formData.password) {
      setGeneralError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/login', formData)
      setAuth(response.data)
      toast.success('Login successful! Welcome back.')
      navigate('/')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Login failed. Please try again.'
      setGeneralError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-[36px] border border-brand-border p-10 shadow-md">

        {/* Photo Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-brand-light border-2 border-brand-border flex items-center justify-center text-4xl text-brand-muted select-none">
            📷
          </div>
        </div>

        <h1 className="text-3xl font-black mb-1 text-center text-brand-gold">TravelLoop</h1>
        <p className="text-center text-brand-muted mb-8 text-sm">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {generalError}
            </div>
          )}

          <Input
            label="Username / Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-brand-muted text-sm">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-brand-gold font-bold hover:underline">
              Register
            </Link>
          </p>
          <Link to="/auth/forgot-password" className="text-brand-gold text-sm hover:underline block">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}
