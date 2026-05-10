import { useEffect, useCallback } from 'react'
import { initializeSocket, disconnectSocket, emitTripJoin, emitTripLeave } from '@/services/socket'
import { useTripStore } from '@/store/trip.store'

/**
 * Hook to handle real-time features
 * Initializes socket connection and sets up listeners
 */
export const useRealtimeUpdates = (tripId?: string) => {
  const selectedTrip = useTripStore((state) => state.selectedTrip)

  useEffect(() => {
    // Initialize socket on mount
    const socket = initializeSocket()

    // Join trip room if viewing a trip
    const currentTripId = tripId || selectedTrip?.id
    if (currentTripId) {
      emitTripJoin(currentTripId)
    }

    // Cleanup on unmount
    return () => {
      if (currentTripId) {
        emitTripLeave(currentTripId)
      }
      // Don't disconnect here to maintain connection across page changes
      // disconnectSocket()
    }
  }, [tripId, selectedTrip?.id])
}

/**
 * Hook to emit updates to other users
 */
export const useRealtimeEmit = () => {
  const emitTripUpdate = useCallback((tripId: string, data: any) => {
    const { emitTripUpdate: emit } = require('@/services/socket')
    emit(tripId, data)
  }, [])

  const emitExpenseUpdate = useCallback((tripId: string, data: any) => {
    const { emitExpenseUpdate: emit } = require('@/services/socket')
    emit(tripId, data)
  }, [])

  const emitActivityUpdate = useCallback((tripId: string, stopId: string, data: any) => {
    const { emitActivityUpdate: emit } = require('@/services/socket')
    emit(tripId, stopId, data)
  }, [])

  return {
    emitTripUpdate,
    emitExpenseUpdate,
    emitActivityUpdate,
  }
}
