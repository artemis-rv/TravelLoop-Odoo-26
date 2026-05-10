// Shared trip links and public access utilities

export interface SharedTrip {
  id: string
  tripId: string
  slug: string
  accessLevel: 'view' | 'comment' | 'edit'
  createdAt: string
  expiresAt?: string
  accessCount: number
}

// Generate share link
export const createShareLink = async (
  tripId: string,
  accessLevel: 'view' | 'comment' | 'edit' = 'view',
  expiresIn?: number
): Promise<SharedTrip> => {
  const response = await fetch(`/api/trips/${tripId}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessLevel, expiresIn }),
  })

  if (!response.ok) throw new Error('Failed to create share link')
  return response.json()
}

// Get share links for trip
export const getShareLinks = async (tripId: string): Promise<SharedTrip[]> => {
  try {
    const response = await fetch(`/api/trips/${tripId}/shares`)
    if (!response.ok) return []
    const data = await response.json()
    return data.shares || []
  } catch (error) {
    console.error('Failed to fetch share links:', error)
    return []
  }
}

// Delete share link
export const deleteShareLink = async (tripId: string, shareId: string) => {
  const response = await fetch(`/api/trips/${tripId}/shares/${shareId}`, {
    method: 'DELETE',
  })

  if (!response.ok) throw new Error('Failed to delete share link')
}

// Get public trip
export const getPublicTrip = async (slug: string) => {
  try {
    const response = await fetch(`/api/shared/${slug}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.trip
  } catch (error) {
    console.error('Failed to fetch public trip:', error)
    return null
  }
}

// Copy share link to clipboard
export const copyShareLink = async (slug: string, label = 'Share Link'): Promise<boolean> => {
  const url = `${window.location.origin}/shared/${slug}`
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch (error) {
    console.error('Failed to copy link:', error)
    return false
  }
}

// Generate unique slug
export const generateSlug = (tripName: string): string => {
  return (
    tripName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.random().toString(36).substring(2, 8)
  )
}

// Check if link is expired
export const isLinkExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

// Format access level
export const formatAccessLevel = (level: string): string => {
  const levels: Record<string, string> = {
    view: '👁️ View only',
    comment: '💬 Can comment',
    edit: '✏️ Can edit',
  }
  return levels[level] || level
}
