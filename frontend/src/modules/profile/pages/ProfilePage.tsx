import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import api from '@/services/api'
import toast from 'react-hot-toast'

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.put('/user/profile', {
        name: formData.name,
        email: formData.email,
      })

      const updatedUser = response.data.user
      setUser(updatedUser)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update profile'
      setError(errorMsg)
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
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}
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
