import api from './api'

export const theodoimuonsachService = {
  // Tạo yêu cầu mượn sách (Độc giả)
  create(data) {
    return api.post('/theodoimuonsach', data)
  },

  // Lấy danh sách mượn sách (Admin - tất cả, Độc giả - của mình)
  getAll(params) {
    return api.get('/theodoimuonsach', { params })
  },

  // Lấy chi tiết theo dõi mượn sách
  getById(id) {
    return api.get(`/theodoimuonsach/${id}`)
  },

  // Cập nhật trạng thái mượn sách (Admin/Thủ thư)
  update(id, data) {
    return api.put(`/theodoimuonsach/${id}`, data)
  },

  // Xóa bản ghi mượn sách (Admin)
  delete(id) {
    return api.delete(`/theodoimuonsach/${id}`)
  },

  // Duyệt yêu cầu mượn sách (Admin/Thủ thư)
  approve(id, data) {
    return api.put(`/theodoimuonsach/${id}/approve`, data)
  },

  // Từ chối yêu cầu mượn sách (Admin/Thủ thư)
  reject(id, data) {
    return api.put(`/theodoimuonsach/${id}/reject`, data)
  },

  // Trả sách (Admin/Thủ thư)
  returnBook(id, data) {
    return api.put(`/theodoimuonsach/${id}/return`, data)
  },

  // Lấy lịch sử mượn sách của độc giả hiện tại
  getMyHistory(params) {
    return api.get('/theodoimuonsach/my-history', { params })
  },

  // Lấy danh sách sách đang mượn của độc giả hiện tại
  getMyCurrentBorrows() {
    return api.get('/theodoimuonsach/my-current')
  },

  // Lấy danh sách yêu cầu chờ duyệt (Admin/Thủ thư)
  getPendingRequests(params) {
    return api.get('/theodoimuonsach/pending', { params })
  },

  // Lấy danh sách sách quá hạn (Admin/Thủ thư)
  getOverdueBooks(params) {
    return api.get('/theodoimuonsach/overdue', { params })
  },

  // Thống kê mượn sách (Admin)
  getStatistics(params) {
    return api.get('/theodoimuonsach/statistics', { params })
  }
}

export default theodoimuonsachService
