import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { Loader } from '@/components/common/Loader'
import { Button } from '@/components/ui/Button'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { validateRequired, validateMaxLength } from '@/utils/validation'
import { Note } from '@/types'

export const NotesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const selectedTrip = useTripStore((state) => state.selectedTrip)
  const setSelectedTrip = useTripStore((state) => state.setSelectedTrip)
  const isLoading = useTripStore((state) => state.isLoading)
  const setLoading = useTripStore((state) => state.setLoading)
  const [notes, setNotes] = useState<Note[]>([])
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [contentError, setContentError] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (id) {
      if (!selectedTrip) {
        fetchTrip(id)
      } else {
        loadNotes(id)
      }
    }
  }, [id, selectedTrip])

  const fetchTrip = async (tripId: string) => {
    setLoading(true)
    try {
      const response = await api.get(`/trips/${tripId}`)
      setSelectedTrip(response.data.trip)
      setNotes(response.data.trip.notes || [])
    } catch (err: any) {
      console.error('Failed to fetch trip:', err)
      toast.error('Failed to load trip')
    } finally {
      setLoading(false)
    }
  }

  const loadNotes = async (tripId: string) => {
    try {
      const response = await api.get(`/trips/${tripId}/notes`)
      setNotes(response.data.notes || [])
    } catch (err: any) {
      console.error('Failed to fetch notes:', err)
    }
  }

  const validateNote = (noteContent: string): boolean => {
    if (!validateRequired(noteContent)) {
      setContentError('Please write something')
      return false
    }
    if (!validateMaxLength(noteContent, 5000)) {
      setContentError('Note must be less than 5000 characters')
      return false
    }
    setContentError('')
    return true
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    if (touched) {
      validateNote(newContent)
    }
  }

  const handleContentBlur = () => {
    setTouched(true)
    validateNote(content)
  }

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateNote(content)) {
      toast.error('Please fix the errors below')
      return
    }

    setSaving(true)
    try {
      const response = await api.post(`/trips/${id}/notes`, {
        content: content.trim(),
      })
      setNotes([response.data, ...notes])
      setContent('')
      setContentError('')
      setTouched(false)
      toast.success('Note saved successfully! 📝')
    } catch (err: any) {
      console.error('Failed to save note:', err)
      const errorMsg = err.response?.data?.error || 'Failed to save note'
      toast.error(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await api.delete(`/notes/${noteId}`)
      setNotes(notes.filter((note) => note.id !== noteId))
      toast.success('Note deleted 🗑️')
    } catch (err: any) {
      console.error('Failed to delete note:', err)
      toast.error('Failed to delete note')
    }
  }

  if (isLoading) {
    return <Loader fullScreen />
  }

  return (
    <div>
      <h1 className="text-5xl font-black mb-2">Travel Notes</h1>
      <p className="text-brand-muted mb-8">Capture your travel memories and important details</p>

      <form onSubmit={handleSaveNote} className="space-y-4 mb-8">
        <div className="bg-white border border-brand-border rounded-[30px] p-8">
          <label className="block text-sm font-semibold text-brand-text mb-2">
            Add New Note
          </label>
          <textarea
            className={`w-full h-72 border border-brand-border rounded-2xl p-5 outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all resize-none ${
              contentError && touched ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            placeholder="Write memories, plans and notes..."
            value={content}
            onChange={handleContentChange}
            onBlur={handleContentBlur}
            disabled={saving}
          />
          <div className="flex justify-between items-end mt-3">
            <div>
              {contentError && touched && (
                <p className="text-red-500 text-sm">{contentError}</p>
              )}
            </div>
            <p className="text-xs text-brand-muted">{content.length}/5000 characters</p>
          </div>
        </div>
        <Button 
          type="submit" 
          loading={saving} 
          size="lg"
          disabled={contentError.length > 0 || saving || !content.trim()}
        >
          {saving ? 'Saving...' : 'Save Note'}
        </Button>
      </form>

      {notes.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-black">Previous Notes ({notes.length})</h2>
          {notes.map((note) => (
            <div key={note.id} className="bg-white border border-brand-border rounded-[20px] p-6 hover:shadow-md transition">
              <p className="text-brand-text mb-3 whitespace-pre-wrap">{note.content}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-brand-muted">
                  {new Date(note.createdAt || '').toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/community"
        className="bg-brand-gold px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Open Community
      </Link>
    </div>
  )
}
