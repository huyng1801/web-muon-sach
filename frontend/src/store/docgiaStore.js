import { defineStore } from 'pinia'
import { ref } from 'vue'
import { docgiaService } from '@/services/docgiaService'

export const useDocGiaStore = defineStore('docgia', () => {
  const docgias = ref([])
  const currentDocGia = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Actions
  async function fetchDocGias(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await docgiaService.getAll(params)
      docgias.value = response.data.data || []
      
      pagination.value = {
        page: parseInt(response.data.currentPage) || 1,
        limit: parseInt(params.limit) || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải danh sách độc giả'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDocGiaById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await docgiaService.getById(id)
      currentDocGia.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải thông tin độc giả'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createDocGia(data) {
    loading.value = true
    error.value = null
    try {
      const response = await docgiaService.register(data)
      docgias.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tạo độc giả mới'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateDocGia(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await docgiaService.update(id, data)
      const index = docgias.value.findIndex(dg => dg._id === id)
      if (index !== -1) {
        docgias.value[index] = response.data
      }
      if (currentDocGia.value?._id === id) {
        currentDocGia.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể cập nhật độc giả'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDocGia(id) {
    loading.value = true
    error.value = null
    try {
      await docgiaService.delete(id)
      docgias.value = docgias.value.filter(dg => dg._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể xóa độc giả'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchDocGias(keyword) {
    loading.value = true
    error.value = null
    try {
      const response = await docgiaService.search(keyword)
      docgias.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tìm kiếm độc giả'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetCurrentDocGia() {
    currentDocGia.value = null
  }

  return {
    docgias,
    currentDocGia,
    loading,
    error,
    pagination,
    fetchDocGias,
    fetchDocGiaById,
    createDocGia,
    updateDocGia,
    deleteDocGia,
    searchDocGias,
    clearError,
    resetCurrentDocGia
  }
})
