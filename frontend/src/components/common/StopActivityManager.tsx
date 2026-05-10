import { useState } from 'react'
import {
  createStop,
  updateStop,
  deleteStop,
  reorderStops,
  createActivity,
  updateActivity,
  deleteActivity,
  Stop,
  Activity,
} from '@/utils/stopActivityCrud'
import toast from 'react-hot-toast'

interface StopManagerProps {
  tripId: string
  stops: Stop[]
  onStopsChange?: (stops: Stop[]) => void
}

export function StopActivityManager({ tripId, stops: initialStops, onStopsChange }: StopManagerProps) {
  const [stops, setStops] = useState<Stop[]>(initialStops)
  const [expandedStop, setExpandedStop] = useState<string | null>(null)
  const [editingStop, setEditingStop] = useState<Stop | null>(null)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [newActivityTitle, setNewActivityTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateStop = async () => {
    const name = prompt('Stop name (e.g., Paris, Rome):')
    if (!name) return

    setLoading(true)
    try {
      const newStop = await createStop(tripId, {
        name,
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      })
      const updated = [...stops, newStop]
      setStops(updated)
      onStopsChange?.(updated)
      toast.success('Stop created!')
    } catch (error) {
      console.error('Failed to create stop:', error)
      toast.error('Failed to create stop')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStop = async () => {
    if (!editingStop) return

    setLoading(true)
    try {
      await updateStop(editingStop.id, editingStop)
      const updated = stops.map((s) => (s.id === editingStop.id ? editingStop : s))
      setStops(updated)
      onStopsChange?.(updated)
      setEditingStop(null)
      toast.success('Stop updated!')
    } catch (error) {
      console.error('Failed to update stop:', error)
      toast.error('Failed to update stop')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStop = async (stopId: string) => {
    if (!window.confirm('Delete this stop?')) return

    setLoading(true)
    try {
      await deleteStop(stopId)
      const updated = stops.filter((s) => s.id !== stopId)
      setStops(updated)
      onStopsChange?.(updated)
      setExpandedStop(null)
      toast.success('Stop deleted!')
    } catch (error) {
      console.error('Failed to delete stop:', error)
      toast.error('Failed to delete stop')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateActivity = async (stopId: string) => {
    if (!newActivityTitle.trim()) return

    setLoading(true)
    try {
      const newActivity = await createActivity(stopId, {
        title: newActivityTitle,
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        category: 'sightseeing',
      })

      const updated = stops.map((s) => {
        if (s.id === stopId) {
          return {
            ...s,
            activities: [...(s.activities || []), newActivity],
          }
        }
        return s
      })

      setStops(updated)
      onStopsChange?.(updated)
      setNewActivityTitle('')
      toast.success('Activity added!')
    } catch (error) {
      console.error('Failed to create activity:', error)
      toast.error('Failed to create activity')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteActivity = async (activityId: string, stopId: string) => {
    if (!window.confirm('Delete this activity?')) return

    setLoading(true)
    try {
      await deleteActivity(activityId)

      const updated = stops.map((s) => {
        if (s.id === stopId) {
          return {
            ...s,
            activities: s.activities?.filter((a) => a.id !== activityId) || [],
          }
        }
        return s
      })

      setStops(updated)
      onStopsChange?.(updated)
      toast.success('Activity deleted!')
    } catch (error) {
      console.error('Failed to delete activity:', error)
      toast.error('Failed to delete activity')
    } finally {
      setLoading(false)
    }
  }

  const handleReorderStops = async (newOrder: string[]) => {
    setLoading(true)
    try {
      await reorderStops(tripId, newOrder)
      const reordered = newOrder.map((id) => stops.find((s) => s.id === id)!).filter(Boolean)
      setStops(reordered)
      onStopsChange?.(reordered)
      toast.success('Stops reordered!')
    } catch (error) {
      console.error('Failed to reorder stops:', error)
      toast.error('Failed to reorder stops')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Trip Itinerary</h3>
        <button
          onClick={handleCreateStop}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-50"
        >
          + Add Stop
        </button>
      </div>

      {stops.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No stops yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stops.map((stop, index) => (
            <div key={stop.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              {/* Stop Header */}
              <button
                onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <span className="text-lg font-bold text-gray-600 w-6">{index + 1}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{stop.name}</h4>
                    <p className="text-sm text-gray-500">{stop.activities?.length || 0} activities</p>
                  </div>
                </div>
                <span className="text-gray-400">{expandedStop === stop.id ? '▼' : '▶'}</span>
              </button>

              {/* Stop Details */}
              {expandedStop === stop.id && (
                <div className="border-t border-gray-300 p-4 bg-gray-50 space-y-4">
                  {editingStop?.id === stop.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={editingStop.name}
                          onChange={(e) => setEditingStop({ ...editingStop, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea
                          value={editingStop.description || ''}
                          onChange={(e) => setEditingStop({ ...editingStop, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={editingStop.startDate}
                            onChange={(e) => setEditingStop({ ...editingStop, startDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            value={editingStop.endDate}
                            onChange={(e) => setEditingStop({ ...editingStop, endDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleUpdateStop}
                          disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold transition disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingStop(null)}
                          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Description:</p>
                        <p className="text-gray-900">{stop.description || 'No description'}</p>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {stop.startDate} to {stop.endDate}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingStop(stop)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-semibold text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          disabled={loading}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold text-sm transition disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Activities */}
                  <div className="border-t pt-4 mt-4">
                    <h5 className="font-semibold mb-3">Activities</h5>
                    {stop.activities?.length === 0 ? (
                      <p className="text-sm text-gray-500 mb-3">No activities yet</p>
                    ) : (
                      <div className="space-y-2 mb-3">
                        {stop.activities?.map((activity) => (
                          <div key={activity.id} className="bg-white p-2 rounded border border-gray-300 flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-500">
                                {activity.startTime} - {activity.endTime}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteActivity(activity.id, stop.id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-700 text-sm font-medium transition disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newActivityTitle}
                        onChange={(e) => setNewActivityTitle(e.target.value)}
                        placeholder="Activity name..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleCreateActivity(stop.id)}
                        disabled={!newActivityTitle.trim() || loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold text-sm transition disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
