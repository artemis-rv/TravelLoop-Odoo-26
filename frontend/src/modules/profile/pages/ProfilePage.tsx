import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Call API to update profile
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
    }, 1000)
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
