// File upload utilities for trip documents

export interface UploadedFile {
  id: string
  tripId: string
  name: string
  type: string
  size: number
  uploadedAt: string
  url: string
}

// Validate file
export const validateFile = (file: File, maxSize = 10 * 1024 * 1024): { valid: boolean; error?: string } => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Allowed: PDF, Images (JPG, PNG), Word, TXT' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` }
  }

  return { valid: true }
}

// Upload file
export const uploadTripDocument = async (tripId: string, file: File): Promise<UploadedFile> => {
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`/api/trips/${tripId}/documents`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Upload failed')
  }

  return response.json()
}

// Delete file
export const deleteTripDocument = async (tripId: string, fileId: string) => {
  const response = await fetch(`/api/trips/${tripId}/documents/${fileId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete document')
  }
}

// List documents
export const getTripDocuments = async (tripId: string): Promise<UploadedFile[]> => {
  try {
    const response = await fetch(`/api/trips/${tripId}/documents`)
    if (!response.ok) return []
    const data = await response.json()
    return data.documents || []
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    return []
  }
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Get file icon
export const getFileIcon = (type: string): string => {
  if (type.includes('pdf')) return '📄'
  if (type.includes('image')) return '🖼️'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('text')) return '📃'
  return '📎'
}
