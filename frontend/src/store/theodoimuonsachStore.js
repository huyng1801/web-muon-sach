import { defineStore } from 'pinia'
import { ref } from 'vue'
import { theodoimuonsachService } from '@/services/theodoimuonsachService'

export const useTheoDoiMuonSachStore = defineStore('theodoimuonsach', () => {
  const muonsachs = ref([])
  const currentMuonSach = ref(null)
  const pendingRequests = ref([])
  const overdueBooks = ref([])
  const myBorrows = ref([])
  const statistics = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Actions
  async function fetchMuonSachs(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.getAll(params)
      muonsachs.value = response.data.muonsachs || response.data
      
      if (response.data.pagination) {
        pagination.value = response.data.pagination
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải danh sách mượn sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMuonSachById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.getById(id)
      currentMuonSach.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải thông tin mượn sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createMuonSach(data) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.create(data)
      muonsachs.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tạo yêu cầu mượn sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateMuonSach(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.update(id, data)
      const index = muonsachs.value.findIndex(ms => ms._id === id)
      if (index !== -1) {
        muonsachs.value[index] = response.data
      }
      if (currentMuonSach.value?._id === id) {
        currentMuonSach.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể cập nhật mượn sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveMuonSach(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.approve(id, data)
      const index = muonsachs.value.findIndex(ms => ms._id === id)
      if (index !== -1) {
        muonsachs.value[index] = response.data
      }
      // Remove from pending requests
      pendingRequests.value = pendingRequests.value.filter(ms => ms._id !== id)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể duyệt yêu cầu mượn sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rejectMuonSach(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.reject(id, data)
      const index = muonsachs.value.findIndex(ms => ms._id === id)
      if (index !== -1) {
        muonsachs.value[index] = response.data
      }
      // Remove from pending requests
      pendingRequests.value = pendingRequests.value.filter(ms => ms._id !== id)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể từ chối yêu cầu mượn sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function returnBook(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.returnBook(id, data)
      const index = muonsachs.value.findIndex(ms => ms._id === id)
      if (index !== -1) {
        muonsachs.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể trả sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMyHistory(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.getMyHistory(params)
      myBorrows.value = response.data.muonsachs || response.data
      
      if (response.data.pagination) {
        pagination.value = response.data.pagination
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải lịch sử mượn sách'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMyCurrentBorrows() {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.getMyCurrentBorrows()
      myBorrows.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải sách đang mượn'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPendingRequests(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.getPendingRequests(params)
      pendingRequests.value = response.data.muonsachs || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải yêu cầu chờ duyệt'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchOverdueBooks(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.getOverdueBooks(params)
      overdueBooks.value = response.data.muonsachs || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải sách quá hạn'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStatistics(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await theodoimuonsachService.getStatistics(params)
      statistics.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Không thể tải thống kê'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetCurrentMuonSach() {
    currentMuonSach.value = null
  }

  return {
    muonsachs,
    currentMuonSach,
    pendingRequests,
    overdueBooks,
    myBorrows,
    statistics,
    loading,
    error,
    pagination,
    fetchMuonSachs,
    fetchMuonSachById,
    createMuonSach,
    updateMuonSach,
    approveMuonSach,
    rejectMuonSach,
    returnBook,
    fetchMyHistory,
    fetchMyCurrentBorrows,
    fetchPendingRequests,
    fetchOverdueBooks,
    fetchStatistics,
    clearError,
    resetCurrentMuonSach
  }
})
