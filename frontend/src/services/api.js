import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Thêm token từ cookie vào header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Xử lý lỗi chung
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
      if (error.response.status === 401) {
        Cookies.remove('token')
        Cookies.remove('user')
        Cookies.remove('userRole')
        router.push('/login')
      }
      
      // Xử lý lỗi 403 - Không có quyền truy cập
      if (error.response.status === 403) {
        router.push('/401')
      }
    }
    return Promise.reject(error)
  }
)

export default api
