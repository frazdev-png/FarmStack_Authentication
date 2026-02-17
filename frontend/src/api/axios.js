import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method.toUpperCase()} → ${config.baseURL}${config.url}`)
    console.log('📦 Request data:', config.data)

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ← ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ Axios error:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      response: error.response?.data || 'No response',
    })
    return Promise.reject(error)
  }
)

export default api
