import axios, { AxiosError, AxiosResponse } from 'axios'
import { API_BASE_URL, AUTH_STORAGE_KEY, HTTP_STATUS } from '@/utils/constants'
import { useAuthStore } from '@/store/auth.store'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Clear auth and redirect to login
      useAuthStore.getState().logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
