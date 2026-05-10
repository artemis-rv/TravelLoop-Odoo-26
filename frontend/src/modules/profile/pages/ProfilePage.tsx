import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { validateField, FieldError, validateFormComplete } from '@/utils/validation'

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
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
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const errors = validateFormComplete(formData, ['email'])
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
      const response = await api.put('/user/profile', {
        name: formData.name,
        email: formData.email,
      })

      const updatedUser = response.data.user
      setUser(updatedUser)
      toast.success('Profile updated successfully! ✨')
      setIsEditing(false)
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update profile'
      setGeneralError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[36px] border border-brand-border p-10">
      <h1 className="text-5xl font-black mb-10">My Profile</h1>

      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-brand-gold flex items-center justify-center text-white text-4xl font-black">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-black">{user?.name}</h2>
          <p className="text-brand-muted">{user?.email}</p>
        </div>
      </div>

      {isEditing ? (
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
          <div className="flex gap-4">
            <Button 
              type="submit" 
              loading={loading}
              disabled={Object.keys(fieldErrors).length > 0 || loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditing(false)
                setFormData({ name: user?.name || '', email: user?.email || '' })
                setFieldErrors({})
                setTouched({})
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
      )}
    </div>
  )
}

      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-brand-gold flex items-center justify-center text-white text-4xl font-black">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-black">{user?.name}</h2>
          <p className="text-brand-muted">{user?.email}</p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="flex gap-4">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
      )}
    </div>
  )
}
