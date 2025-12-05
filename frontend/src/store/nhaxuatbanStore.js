import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nhaxuatbanService } from '@/services/nhaxuatbanService'

export const useNhaXuatBanStore = defineStore('nhaxuatban', () => {
  const nhaxuatbans = ref([])
  const currentNXB = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Actions
  async function fetchNhaXuatBans(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await nhaxuatbanService.getAll(params)
      nhaxuatbans.value = response.data.data || []
      
      pagination.value = {
        page: parseInt(response.data.currentPage) || 1,
        limit: 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải danh sách nhà xuất bản'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchNXBById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await nhaxuatbanService.getById(id)
      currentNXB.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải thông tin nhà xuất bản'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createNXB(data) {
    loading.value = true
    error.value = null
    try {
      const response = await nhaxuatbanService.create(data)
      nhaxuatbans.value.unshift(response.data.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tạo nhà xuất bản mới'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateNXB(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await nhaxuatbanService.update(id, data)
      const index = nhaxuatbans.value.findIndex(nxb => nxb._id === id)
      if (index !== -1) {
        nhaxuatbans.value[index] = response.data.data
      }
      if (currentNXB.value?._id === id) {
        currentNXB.value = response.data.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể cập nhật nhà xuất bản'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteNXB(id) {
    loading.value = true
    error.value = null
    try {
      await nhaxuatbanService.delete(id)
      nhaxuatbans.value = nhaxuatbans.value.filter(nxb => nxb._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể xóa nhà xuất bản'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchNXB(keyword) {
    loading.value = true
    error.value = null
    try {
      const response = await nhaxuatbanService.search(keyword)
      nhaxuatbans.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tìm kiếm nhà xuất bản'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetCurrentNXB() {
    currentNXB.value = null
  }

  return {
    nhaxuatbans,
    currentNXB,
    loading,
    error,
    pagination,
    fetchNhaXuatBans,
    fetchNXBById,
    createNXB,
    updateNXB,
    deleteNXB,
    searchNXB,
    clearError,
    resetCurrentNXB
  }
})
