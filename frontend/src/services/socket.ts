import io, { Socket } from 'socket.io-client'
import { SOCKET_URL, AUTH_STORAGE_KEY } from '@/utils/constants'
import { useTripStore } from '@/store/trip.store'
import { useNotificationStore } from '@/store/notification.store'
import toast from 'react-hot-toast'

let socket: Socket | null = null

export const initializeSocket = (): Socket => {
  if (socket) return socket

  const token = localStorage.getItem(AUTH_STORAGE_KEY)

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id)
    toast.success('Connected to real-time updates')
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
    toast.error('Lost connection to real-time updates')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  // Real-time event listeners
  setupRealtimeListeners()

  return socket
}

const setupRealtimeListeners = (): void => {
  if (!socket) return

  // Trip update listener
  socket.on('trip:updated', (data) => {
    console.log('Trip updated:', data)
    const { updateTrip } = useTripStore.getState()
    updateTrip(data.id, data)
    toast.success(`Trip "${data.title}" updated by ${data.updatedBy}`)
  })

  // Trip deleted listener
  socket.on('trip:deleted', (data) => {
    console.log('Trip deleted:', data)
    const { deleteTrip } = useTripStore.getState()
    deleteTrip(data.id)
    toast.success(`Trip deleted by ${data.deletedBy}`)
  })

  // Expense update listener
  socket.on('expense:added', (data) => {
    console.log('Expense added:', data)
    const { updateTrip } = useTripStore.getState()
    const selectedTrip = useTripStore.getState().selectedTrip
    if (selectedTrip && selectedTrip.id === data.tripId) {
      updateTrip(data.tripId, {
        expenses: [...(selectedTrip.expenses || []), data],
      })
    }
    toast.success(`New expense: ${data.description}`)
  })

  socket.on('expense:updated', (data) => {
    console.log('Expense updated:', data)
    const { updateTrip } = useTripStore.getState()
    const selectedTrip = useTripStore.getState().selectedTrip
    if (selectedTrip && selectedTrip.id === data.tripId) {
      updateTrip(data.tripId, {
        expenses: selectedTrip.expenses?.map((e) => (e.id === data.id ? data : e)),
      })
    }
    toast.success('Expense updated')
  })

  socket.on('expense:deleted', (data) => {
    console.log('Expense deleted:', data)
    const { updateTrip } = useTripStore.getState()
    const selectedTrip = useTripStore.getState().selectedTrip
    if (selectedTrip && selectedTrip.id === data.tripId) {
      updateTrip(data.tripId, {
        expenses: selectedTrip.expenses?.filter((e) => e.id !== data.id),
      })
    }
    toast.success('Expense deleted')
  })

  // Activity update listener
  socket.on('activity:added', (data) => {
    console.log('Activity added:', data)
    toast.success(`New activity: ${data.name}`)
  })

  socket.on('activity:updated', (data) => {
    console.log('Activity updated:', data)
    toast.success('Activity updated')
  })

  socket.on('activity:deleted', (data) => {
    console.log('Activity deleted:', data)
    toast.success('Activity deleted')
  })

  // Notification listener
  socket.on('notification:new', (data) => {
    console.log('New notification:', data)
    const { addNotification } = useNotificationStore.getState()
    addNotification(data)
    toast.success(data.message)
  })

  // Multi-user sync listener
  socket.on('user:joined', (data) => {
    console.log('User joined:', data)
    toast.success(`${data.userName} joined the trip`)
  })

  socket.on('user:left', (data) => {
    console.log('User left:', data)
    toast.info(`${data.userName} left the trip`)
  })

  socket.on('user:typing', (data) => {
    console.log('User typing:', data)
  })
}

export const getSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Event emitters
export const emitTripUpdate = (tripId: string, data: any): void => {
  getSocket()?.emit('trip:update', { tripId, ...data })
}

export const emitTripJoin = (tripId: string): void => {
  getSocket()?.emit('trip:join', { tripId })
}

export const emitTripLeave = (tripId: string): void => {
  getSocket()?.emit('trip:leave', { tripId })
}

export const emitExpenseUpdate = (tripId: string, data: any): void => {
  getSocket()?.emit('expense:update', { tripId, ...data })
}

export const emitActivityUpdate = (tripId: string, stopId: string, data: any): void => {
  getSocket()?.emit('activity:update', { tripId, stopId, ...data })
}

export const emitUserTyping = (tripId: string, field: string): void => {
  getSocket()?.emit('user:typing', { tripId, field })
}

export const emitExpenseUpdate = (tripId: string, data: any): void => {
  getSocket()?.emit('expense:update', { tripId, ...data })
}

// Event listeners
export const onTripUpdated = (callback: (data: any) => void): void => {
  getSocket()?.on('trip:updated', callback)
}

export const onExpenseUpdated = (callback: (data: any) => void): void => {
  getSocket()?.on('expense:updated', callback)
}

export const onNotification = (callback: (data: any) => void): void => {
  getSocket()?.on('notification', callback)
}
