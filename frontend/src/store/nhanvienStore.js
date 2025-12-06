import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nhanvienService } from '@/services/nhanvienService'

export const useNhanVienStore = defineStore('nhanvien', () => {
  const nhanviens = ref([])
  const currentNhanVien = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Actions
  async function fetchNhanViens(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await nhanvienService.getAll(params)
      nhanviens.value = response.data.data || []
      
      pagination.value = {
        page: parseInt(response.data.currentPage) || 1,
        limit: parseInt(params.limit) || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải danh sách nhân viên'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchNhanVienById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await nhanvienService.getById(id)
      currentNhanVien.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải thông tin nhân viên'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createNhanVien(data) {
    loading.value = true
    error.value = null
    try {
      const response = await nhanvienService.create(data)
      nhanviens.value.unshift(response.data.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tạo nhân viên mới'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateNhanVien(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await nhanvienService.update(id, data)
      const index = nhanviens.value.findIndex(nv => nv._id === id)
      if (index !== -1) {
        nhanviens.value[index] = response.data.data
      }
      if (currentNhanVien.value?._id === id) {
        currentNhanVien.value = response.data.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể cập nhật nhân viên'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteNhanVien(id) {
    loading.value = true
    error.value = null
    try {
      await nhanvienService.delete(id)
      nhanviens.value = nhanviens.value.filter(nv => nv._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể xóa nhân viên'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchNhanVien(keyword) {
    loading.value = true
    error.value = null
    try {
      const response = await nhanvienService.search(keyword)
      nhanviens.value = response.data.data || []
      
      pagination.value = {
        page: parseInt(response.data.currentPage) || 1,
        limit: parseInt(response.data.limit) || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tìm kiếm nhân viên'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetCurrentNhanVien() {
    currentNhanVien.value = null
  }

  return {
    nhanviens,
    currentNhanVien,
    loading,
    error,
    pagination,
    fetchNhanViens,
    fetchNhanVienById,
    createNhanVien,
    updateNhanVien,
    deleteNhanVien,
    searchNhanVien,
    clearError,
    resetCurrentNhanVien
  }
})
