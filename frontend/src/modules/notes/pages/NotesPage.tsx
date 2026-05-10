import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { Loader } from '@/components/common/Loader'
import { Button } from '@/components/ui/Button'
import api from '@/services/api'
import toast from 'react-hot-toast'
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

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Please write something')
      return
    }

    setSaving(true)
    try {
      const response = await api.post(`/trips/${id}/notes`, {
        content,
      })
      setNotes([response.data, ...notes])
      setContent('')
      toast.success('Note saved!')
    } catch (err: any) {
      console.error('Failed to save note:', err)
      toast.error('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await api.delete(`/notes/${noteId}`)
      setNotes(notes.filter((note) => note.id !== noteId))
      toast.success('Note deleted')
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
      <h1 className="text-5xl font-black mb-10">Travel Notes</h1>

      <form onSubmit={handleSaveNote} className="space-y-4 mb-8">
        <div className="bg-white border border-brand-border rounded-[30px] p-8">
          <textarea
            className="w-full h-72 border border-brand-border rounded-2xl p-5 outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            placeholder="Write memories, plans and notes..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <Button type="submit" loading={saving} size="lg">
          Save Note
        </Button>
      </form>

      {notes.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-black">Previous Notes</h2>
          {notes.map((note) => (
            <div key={note.id} className="bg-white border border-brand-border rounded-[20px] p-6">
              <p className="text-brand-text mb-3">{note.content}</p>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-500 hover:text-red-700 font-semibold text-sm"
              >
                Delete
              </button>
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
