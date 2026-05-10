export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const AUTH_STORAGE_KEY = 'auth_token'
export const USER_STORAGE_KEY = 'user_data'

export const EXPENSE_CATEGORIES = [
  'Accommodation',
  'Food',
  'Transportation',
  'Activities',
  'Shopping',
  'Other',
]

export const ACTIVITY_CATEGORIES = [
  'Museum',
  'Restaurant',
  'Beach',
  'Mountain',
  'Park',
  'Shopping',
  'Nightlife',
  'Other',
]

export const PACKING_DEFAULTS = [
  'Passport',
  'Visa',
  'Travel Insurance',
  'Flight Tickets',
  'Hotel Reservations',
  'Credit Cards',
  'Phone Charger',
  'Medications',
  'Toiletries',
  'Clothes',
  'Shoes',
  'Camera',
]

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DASHBOARD: '/dashboard',
  CREATE_TRIP: '/trip/create',
  TRIP_DETAILS: '/trip/:id',
  ITINERARY: '/trip/:id/itinerary',
  BUDGET: '/trip/:id/budget',
  CHECKLIST: '/trip/:id/checklist',
  NOTES: '/trip/:id/notes',
  PROFILE: '/profile',
  COMMUNITY: '/community',
  SHARED_TRIP: '/shared/:slug',
  NOT_FOUND: '*',
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
}
