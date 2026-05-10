import { create } from 'zustand'
import { Trip } from '@/types'

interface TripStore {
  trips: Trip[]
  selectedTrip: Trip | null
  isLoading: boolean
  error: string | null
  setTrips: (trips: Trip[]) => void
  addTrip: (trip: Trip) => void
  updateTrip: (id: string, trip: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  setSelectedTrip: (trip: Trip | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  selectedTrip: null,
  isLoading: false,
  error: null,

  setTrips: (trips) => set({ trips }),

  addTrip: (trip) =>
    set((state) => ({
      trips: [trip, ...state.trips],
    })),

  updateTrip: (id, updates) =>
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      selectedTrip:
        state.selectedTrip?.id === id ? { ...state.selectedTrip, ...updates } : state.selectedTrip,
    })),

  deleteTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== id),
      selectedTrip: state.selectedTrip?.id === id ? null : state.selectedTrip,
    })),

  setSelectedTrip: (trip) => set({ selectedTrip: trip }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      trips: [],
      selectedTrip: null,
      isLoading: false,
      error: null,
    }),
}))
