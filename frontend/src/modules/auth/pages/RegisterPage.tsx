import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // TODO: Call API register endpoint
      // const response = await api.post('/auth/register', {
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      // })
      // setAuth(response.data)
      // navigate('/')

      // Mock register for now
      setTimeout(() => {
        setAuth({
          user: { id: '1', name: formData.name, email: formData.email, created_at: new Date().toISOString() },
          token: 'mock_token',
        })
        navigate('/')
      }, 1000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[36px] border border-brand-border p-10">
        <h1 className="text-4xl font-black mb-2 text-center text-brand-gold">TravelLoop</h1>
        <p className="text-center text-brand-muted mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Account
          </Button>
        </form>

        <p className="text-center text-brand-muted mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-brand-gold font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
