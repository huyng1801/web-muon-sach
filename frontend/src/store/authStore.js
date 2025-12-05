import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nhanvienService } from '@/services/nhanvienService'
import { docgiaService } from '@/services/docgiaService'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const getStoredUser = () => {
    try {
      const userData = localStorage.getItem('user')
      return userData && userData !== 'undefined' ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  const token = ref(localStorage.getItem('token') || null)
  const user = ref(getStoredUser())
  const userRole = ref(localStorage.getItem('userRole') || null) // 'nhanvien' hoặc 'docgia'

  // Computed
  const isAuthenticated = computed(() => !!token.value)
  const isNhanVien = computed(() => userRole.value === 'nhanvien')
  const isDocGia = computed(() => userRole.value === 'docgia')
  const isAdmin = computed(() => user.value?.ChucVu === 'Admin')
  const isThuThu = computed(() => user.value?.ChucVu === 'Thủ thư')
  const canManageBooks = computed(() => 
    isNhanVien.value && (isAdmin.value || isThuThu.value)
  )

  // Actions
  async function loginNhanVien(credentials) {
    try {
      const response = await nhanvienService.login(credentials)
      const { token: authToken, data } = response.data

      token.value = authToken
      user.value = data
      userRole.value = 'nhanvien'

      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('userRole', 'nhanvien')

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

      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(docgia))
      localStorage.setItem('userRole', 'docgia')

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
    token.value = null
    user.value = null
    userRole.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')

    router.push('/login')
  }

  function checkAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser = getStoredUser()
    const storedRole = localStorage.getItem('userRole')

    if (storedToken && storedUser && storedRole) {
      token.value = storedToken
      user.value = storedUser
      userRole.value = storedRole
    }
  }

  async function updateProfile(data) {
    try {
      let response
      if (isNhanVien.value) {
        response = await nhanvienService.updateProfile(data)
      } else {
        response = await docgiaService.updateProfile(data)
      }

      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))

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
    updateProfile
  }
})
