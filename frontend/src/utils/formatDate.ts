import { format, formatDistanceToNow, parse } from 'date-fns'

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'HH:mm')
}

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const getDayNumber = (date: string | Date): number => {
  return new Date(date).getDate()
}

export const getMonthName = (date: string | Date): string => {
  return format(new Date(date), 'MMMM')
}
