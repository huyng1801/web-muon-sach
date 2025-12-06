import api from './api'

export const nhaxuatbanService = {
  // Lấy danh sách nhà xuất bản (public)
  getAll(params) {
    return api.get('/nhaxuatban', { params })
  },

  // Lấy thông tin nhà xuất bản theo ID
  getById(id) {
    return api.get(`/nhaxuatban/${id}`)
  },

  // Tạo nhà xuất bản mới (Admin/Thủ thư)
  create(data) {
    return api.post('/nhaxuatban', data)
  },

  // Cập nhật thông tin nhà xuất bản (Admin/Thủ thư)
  update(id, data) {
    return api.put(`/nhaxuatban/${id}`, data)
  },

  // Xóa nhà xuất bản (Admin)
  delete(id) {
    return api.delete(`/nhaxuatban/${id}`)
  },

  // Tìm kiếm nhà xuất bản
  search(keyword, params = {}) {
    return api.get('/nhaxuatban', { params: { search: keyword, ...params } })
  },

  // Lấy danh sách sách của nhà xuất bản
  getBooks(id) {
    return api.get(`/nhaxuatban/${id}/books`)
  }
}

export default nhaxuatbanService
