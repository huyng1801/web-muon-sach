import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sachService } from '@/services/sachService'

export const useSachStore = defineStore('sach', () => {
  const sachs = ref([])
  const currentSach = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Actions
  async function fetchSachs(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await sachService.getAll(params)
      sachs.value = response.data.data || []
      
      pagination.value = {
        page: parseInt(response.data.currentPage) || 1,
        limit: parseInt(params.limit) || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải danh sách sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSachById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await sachService.getById(id)
      currentSach.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải thông tin sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSach(data) {
    loading.value = true
    error.value = null
    try {
      const response = await sachService.create(data)
      sachs.value.unshift(response.data.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tạo sách mới'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSach(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await sachService.update(id, data)
      const index = sachs.value.findIndex(s => s._id === id)
      if (index !== -1) {
        sachs.value[index] = response.data.data
      }
      if (currentSach.value?._id === id) {
        currentSach.value = response.data.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể cập nhật sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSach(id) {
    loading.value = true
    error.value = null
    try {
      await sachService.delete(id)
      sachs.value = sachs.value.filter(s => s._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể xóa sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchSachs(keyword) {
    loading.value = true
    error.value = null
    try {
      const response = await sachService.search(keyword)
      sachs.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tìm kiếm sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableBooks(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await sachService.getAvailableBooks(params)
      sachs.value = response.data.sachs || response.data
      
      if (response.data.pagination) {
        pagination.value = response.data.pagination
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải danh sách sách có sẵn'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetCurrentSach() {
    currentSach.value = null
  }

  return {
    sachs,
    currentSach,
    loading,
    error,
    pagination,
    fetchSachs,
    fetchSachById,
    createSach,
    updateSach,
    deleteSach,
    searchSachs,
    fetchAvailableBooks,
    clearError,
    resetCurrentSach
  }
})
