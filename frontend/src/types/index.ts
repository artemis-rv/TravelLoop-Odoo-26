export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Trip {
  id: string
  user_id: string
  title: string
  description?: string
  start_date?: string
  end_date?: string
  is_public: boolean
  created_at: string
  _count?: {
    stops: number
    expenses: number
  }
}

export interface Stop {
  id: string
  trip_id: string
  city_name: string
  country?: string
  latitude?: number
  longitude?: number
  start_date?: string
  end_date?: string
  position?: number
}

export interface Activity {
  id: string
  stop_id: string
  title: string
  category?: string
  location?: string
  cost: number
  duration?: number
  notes?: string
  start_time?: string
}

export interface Expense {
  id: string
  trip_id: string
  activity_id?: string
  amount: number
  category?: string
  created_at: string
  activity?: {
    title: string
  }
}

export interface PackingItem {
  id: string
  trip_id: string
  item_name: string
  is_checked: boolean
}

export interface Note {
  id: string
  trip_id: string
  title?: string
  content: string
  created_at: string
}

export interface SharedTrip {
  id: string
  trip_id: string
  slug: string
  expires_at?: string
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
