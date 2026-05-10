import { useState, useEffect } from 'react'
import { createShareLink, getShareLinks, deleteShareLink, copyShareLink, SharedTrip } from '@/utils/sharedTrips'
import toast from 'react-hot-toast'

interface TripSharingProps {
  tripId: string
  tripName: string
  onClose?: () => void
}

export function TripSharing({ tripId, tripName, onClose }: TripSharingProps) {
  const [shareLinks, setShareLinks] = useState<SharedTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [accessLevel, setAccessLevel] = useState<'view' | 'comment' | 'edit'>('view')
  const [expiresIn, setExpiresIn] = useState(7) // days
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadShareLinks()
  }, [tripId])

  const loadShareLinks = async () => {
    setLoading(true)
    try {
      const links = await getShareLinks(tripId)
      setShareLinks(links)
    } catch (error) {
      console.error('Failed to load share links:', error)
      toast.error('Failed to load share links')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLink = async () => {
    setCreating(true)
    try {
      const newLink = await createShareLink(tripId, accessLevel, expiresIn)
      setShareLinks([...shareLinks, newLink])
      toast.success('Share link created!')
      setExpiresIn(7)
    } catch (error) {
      console.error('Failed to create link:', error)
      toast.error('Failed to create share link')
    } finally {
      setCreating(false)
    }
  }

  const handleCopyLink = async (slug: string) => {
    try {
      await copyShareLink(slug)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast.error('Failed to copy link')
    }
  }

  const handleDeleteLink = async (shareId: string) => {
    if (!window.confirm('Delete this share link?')) return

    try {
      await deleteShareLink(tripId, shareId)
      setShareLinks(shareLinks.filter((l) => l.id !== shareId))
      toast.success('Link deleted')
    } catch (error) {
      console.error('Failed to delete link:', error)
      toast.error('Failed to delete link')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Share "{tripName}"</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Create New Link */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-300">
            <h3 className="font-semibold mb-4">Create New Share Link</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Access Level</label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as 'view' | 'comment' | 'edit')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="view">👁️ View Only</option>
                  <option value="comment">💬 View & Comment</option>
                  <option value="edit">✏️ Can Edit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Expires In</label>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={365}>Never</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateLink}
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : '+ Create Share Link'}
            </button>
          </div>

          {/* Existing Links */}
          <div>
            <h3 className="font-semibold mb-4">Active Share Links ({shareLinks.length})</h3>

            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading...</p>
            ) : shareLinks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No share links yet. Create one above!</p>
            ) : (
              <div className="space-y-3">
                {shareLinks.map((link) => (
                  <div key={link.id} className="border border-gray-300 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {link.accessLevel === 'view' && '👁️ View Only'}
                            {link.accessLevel === 'comment' && '💬 View & Comment'}
                            {link.accessLevel === 'edit' && '✏️ Can Edit'}
                          </span>
                          <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                            {link.accessCount} views
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Created {new Date(link.createdAt).toLocaleDateString()}
                          {link.expiresAt && ` • Expires ${new Date(link.expiresAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded text-sm">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/shared/${link.slug}`}
                        className="flex-1 bg-white px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                      <button
                        onClick={() => handleCopyLink(link.slug)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-semibold transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Permissions Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Permission Levels:</p>
            <ul className="space-y-1 text-gray-600">
              <li>
                <strong>👁️ View Only:</strong> Can see all trip details, but cannot make changes
              </li>
              <li>
                <strong>💬 View & Comment:</strong> Can view and add notes/comments
              </li>
              <li>
                <strong>✏️ Can Edit:</strong> Full editing permissions (shared editing mode)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
