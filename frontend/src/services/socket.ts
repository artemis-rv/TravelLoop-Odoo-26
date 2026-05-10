import io, { Socket } from 'socket.io-client'
import { SOCKET_URL, AUTH_STORAGE_KEY } from '@/utils/constants'

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
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
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
