// Stop and Activity CRUD utilities

export interface Stop {
  id: string
  tripId: string
  name: string
  description?: string
  startDate: string
  endDate: string
  activities: Activity[]
}

export interface Activity {
  id: string
  stopId: string
  title: string
  description?: string
  startTime?: string
  endTime?: string
  category?: string
}

// Stop Operations
export const createStop = async (tripId: string, stop: Omit<Stop, 'id' | 'tripId' | 'activities'>) => {
  const response = await fetch(`/api/trips/${tripId}/stops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stop),
  })
  if (!response.ok) throw new Error('Failed to create stop')
  return response.json()
}

export const updateStop = async (stopId: string, updates: Partial<Stop>) => {
  const response = await fetch(`/api/stops/${stopId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error('Failed to update stop')
  return response.json()
}

export const deleteStop = async (stopId: string) => {
  const response = await fetch(`/api/stops/${stopId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete stop')
}

export const reorderStops = async (tripId: string, stops: Stop[]) => {
  const response = await fetch(`/api/trips/${tripId}/stops/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stops: stops.map(s => s.id) }),
  })
  if (!response.ok) throw new Error('Failed to reorder stops')
  return response.json()
}

// Activity Operations
export const createActivity = async (stopId: string, activity: Omit<Activity, 'id' | 'stopId'>) => {
  const response = await fetch(`/api/stops/${stopId}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  })
  if (!response.ok) throw new Error('Failed to create activity')
  return response.json()
}

export const updateActivity = async (activityId: string, updates: Partial<Activity>) => {
  const response = await fetch(`/api/activities/${activityId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error('Failed to update activity')
  return response.json()
}

export const deleteActivity = async (activityId: string) => {
  const response = await fetch(`/api/activities/${activityId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete activity')
}

// Batch operations
export const deleteMultipleStops = async (stopIds: string[]) => {
  return Promise.all(stopIds.map(id => deleteStop(id)))
}

export const deleteMultipleActivities = async (activityIds: string[]) => {
  return Promise.all(activityIds.map(id => deleteActivity(id)))
}
