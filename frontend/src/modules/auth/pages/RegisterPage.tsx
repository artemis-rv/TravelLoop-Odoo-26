import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { validateField, FieldError, validateFormComplete, validatePasswordMatch } from '@/utils/validation'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate password match on confirmPassword blur
    if (fieldName === 'confirmPassword' && formData.password) {
      if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }))
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      validateSingleField(name, value)
    }

    // Real-time password match validation
    if (name === 'confirmPassword' && touched['confirmPassword'] && formData.password) {
      if (!validatePasswordMatch(formData.password, value)) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }))
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.confirmPassword
          return newErrors
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    // Validate all fields
    const errors = validateFormComplete(formData, ['name', 'email', 'password', 'confirmPassword'])
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
      const response = await api.post('/auth/register', {
        name: formData.name,
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
      <div className="max-w-md w-full bg-white rounded-[36px] border border-brand-border p-10">
        <h1 className="text-4xl font-black mb-2 text-center text-brand-gold">TravelLoop</h1>
        <p className="text-center text-brand-muted mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {generalError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {generalError}
            </div>
          )}

          <div>
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              required
              error={touched['name'] && fieldErrors['name']}
              disabled={loading}
            />
            {touched['name'] && fieldErrors['name'] && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors['name']}</p>
            )}
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              required
              error={touched['email'] && fieldErrors['email']}
              disabled={loading}
            />
            {touched['email'] && fieldErrors['email'] && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors['email']}</p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              required
              error={touched['password'] && fieldErrors['password']}
              disabled={loading}
              helperText="At least 8 characters with uppercase, lowercase, and numbers"
            />
            {touched['password'] && fieldErrors['password'] && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors['password']}</p>
            )}
          </div>

          <div>
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              required
              error={touched['confirmPassword'] && fieldErrors['confirmPassword']}
              disabled={loading}
            />
            {touched['confirmPassword'] && fieldErrors['confirmPassword'] && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors['confirmPassword']}</p>
            )}
          </div>

          <Button 
            type="submit" 
            loading={loading} 
            className="w-full" 
            size="lg"
            disabled={Object.keys(fieldErrors).length > 0 || loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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
