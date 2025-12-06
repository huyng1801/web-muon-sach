import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nhanvienService } from '@/services/nhanvienService'
import { docgiaService } from '@/services/docgiaService'
import Cookies from 'js-cookie'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // Cookie options - 7 ngày expire
  const cookieOptions = {
    expires: 7,
    secure: false, // true cho HTTPS production
    sameSite: 'Lax'
  }

  const getStoredUser = () => {
    try {
      const userData = Cookies.get('user')
      return userData && userData !== 'undefined' ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  const token = ref(Cookies.get('token') || null)
  const user = ref(getStoredUser())
  const userRole = ref(Cookies.get('userRole') || null) // 'nhanvien' hoặc 'docgia'
  const refreshInterval = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value)
  const isNhanVien = computed(() => userRole.value === 'nhanvien')
  const isDocGia = computed(() => userRole.value === 'docgia')
  const isAdmin = computed(() => user.value?.Chucvu === 'Admin' || user.value?.ChucVu === 'Admin')
  const isThuThu = computed(() => user.value?.Chucvu === 'Thủ thư' || user.value?.ChucVu === 'Thủ thư')
  const canManageBooks = computed(() => 
    isNhanVien.value && (isAdmin.value || isThuThu.value)
  )

  // Auto refresh user info mỗi 5 phút
  function startAutoRefresh() {
    if (refreshInterval.value) return // Đã chạy rồi
    
    refreshInterval.value = setInterval(async () => {
      if (isAuthenticated.value) {
        try {
          await fetchCurrentUser()
        } catch (error) {
          console.warn('Auto refresh failed:', error)
          // Nếu refresh fail có thể do token expired, logout
          if (error.response?.status === 401) {
            logout()
          }
        }
      }
    }, 5 * 60 * 1000) // 5 phút
  }

  function stopAutoRefresh() {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
  }

  // Fetch current user từ API
  async function fetchCurrentUser() {
    if (!isAuthenticated.value) return null

    try {
      let response
      if (isNhanVien.value) {
        response = await nhanvienService.getProfile()
      } else if (isDocGia.value) {
        response = await docgiaService.getProfile()
      }

      if (response && response.data) {
        // API trả về { success: true, data: {...} }
        const userData = response.data.data || response.data
        updateUser(userData)
        return userData
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  // Actions
  async function loginNhanVien(credentials) {
    try {
      const response = await nhanvienService.login(credentials)
      const { token: authToken, data } = response.data

      token.value = authToken
      user.value = data
      userRole.value = 'nhanvien'

      // Lưu vào cookie
      Cookies.set('token', authToken, cookieOptions)
      Cookies.set('user', JSON.stringify(data), cookieOptions)
      Cookies.set('userRole', 'nhanvien', cookieOptions)

      // Bắt đầu auto refresh
      startAutoRefresh()

      return response.data
    } catch (error) {
      throw error
    }
  }

  async function loginDocGia(credentials) {
    try {
      const response = await docgiaService.login(credentials)
      const { token: authToken, data: docgia } = response.data

      token.value = authToken
      user.value = docgia
      userRole.value = 'docgia'

      // Lưu vào cookie
      Cookies.set('token', authToken, cookieOptions)
      Cookies.set('user', JSON.stringify(docgia), cookieOptions)
      Cookies.set('userRole', 'docgia', cookieOptions)

      // Bắt đầu auto refresh
      startAutoRefresh()

      return response.data
    } catch (error) {
      throw error
    }
  }

  async function registerDocGia(data) {
    try {
      const response = await docgiaService.register(data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  function logout() {
    // Dừng auto refresh
    stopAutoRefresh()
    
    token.value = null
    user.value = null
    userRole.value = null

    // Xóa cookies
    Cookies.remove('token')
    Cookies.remove('user')
    Cookies.remove('userRole')

    router.push('/login')
  }

  async function checkAuth() {
    const storedToken = Cookies.get('token')
    const storedUser = getStoredUser()
    const storedRole = Cookies.get('userRole')

    if (storedToken && storedUser && storedRole) {
      token.value = storedToken
      user.value = { ...storedUser } // Ensure reactive update
      userRole.value = storedRole
      
      // Bắt đầu auto refresh
      startAutoRefresh()
      
      // Fetch user info mới nhất - wait for it
      try {
        const freshUserData = await fetchCurrentUser()
        console.log('Auth restored with fresh data:', { user: user.value, role: userRole.value })
      } catch (error) {
        console.warn('Failed to fetch fresh user data on auth restore:', error)
        // User data từ cookie vẫn có thể dùng được
      }
      
      return true
    }
    return false
  }

  function updateUser(newUserData) {
    user.value = { ...newUserData }
    Cookies.set('user', JSON.stringify(newUserData), cookieOptions)
  }

  async function updateProfile(data) {
    try {
      let response
      if (isNhanVien.value) {
        response = await nhanvienService.updateProfile(data)
      } else {
        response = await docgiaService.updateProfile(data)
      }

      // API trả về { success: true, data: {...} }
      const userData = response.data.data || response.data
      updateUser(userData)
      return userData
    } catch (error) {
      throw error
    }
  }

  async function changePassword(data) {
    try {
      let response
      if (isNhanVien.value) {
        // nhanvienController expects: currentPassword, newPassword, confirmPassword
        response = await nhanvienService.changePassword({
          currentPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.newPassword
        })
      } else {
        // docgiaController expects: oldPassword, newPassword
        response = await docgiaService.changePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        })
      }
      return response.data
    } catch (error) {
      throw error
    }
  }

  return {
    token,
    user,
    userRole,
    isAuthenticated,
    isNhanVien,
    isDocGia,
    isAdmin,
    isThuThu,
    canManageBooks,
    loginNhanVien,
    loginDocGia,
    registerDocGia,
    logout,
    checkAuth,
    updateUser,
    fetchCurrentUser,
    startAutoRefresh,
    stopAutoRefresh,
    updateProfile,
    changePassword
  }
})
