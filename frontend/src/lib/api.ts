import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)
