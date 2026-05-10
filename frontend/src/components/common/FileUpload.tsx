import { useState } from 'react'
import { uploadTripDocument, deleteTripDocument, getTripDocuments, formatFileSize, getFileIcon, UploadedFile } from '@/utils/fileUpload'
import toast from 'react-hot-toast'

interface FileUploadProps {
  tripId: string
  onUploadSuccess?: (file: UploadedFile) => void
}

export function FileUpload({ tripId, onUploadSuccess }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load files on mount
  useState(() => {
    loadFiles()
  }, [tripId])

  const loadFiles = async () => {
    setLoading(true)
    try {
      const docs = await getTripDocuments(tripId)
      setFiles(docs)
    } catch (error) {
      console.error('Failed to load files:', error)
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadedFile = await uploadTripDocument(tripId, file)
      setFiles([...files, uploadedFile])
      onUploadSuccess?.(uploadedFile)
      toast.success('Document uploaded successfully')
      e.target.value = '' // Reset input
    } catch (error: any) {
      console.error('Upload failed:', error)
      toast.error(error.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!window.confirm('Delete this document?')) return

    try {
      await deleteTripDocument(tripId, fileId)
      setFiles(files.filter((f) => f.id !== fileId))
      toast.success('Document deleted')
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete document')
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading documents...</div>
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-6">
      <h3 className="text-lg font-semibold mb-4">Trip Documents</h3>

      {/* Upload Area */}
      <label className="block mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
          <input
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
          />
          {uploading ? (
            <div className="text-gray-600">Uploading...</div>
          ) : (
            <>
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm text-gray-600">
                Click to upload trip documents (PDF, Images, Word, TXT)
              </p>
              <p className="text-xs text-gray-500 mt-1">Max 10MB per file</p>
            </>
          )}
        </div>
      </label>

      {/* Files List */}
      {files.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No documents yet</p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 flex-1 hover:text-blue-600">
                <span className="text-xl">{getFileIcon(file.type)}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </a>
              <button
                onClick={() => handleDelete(file.id)}
                className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 hover:bg-red-50 rounded transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
