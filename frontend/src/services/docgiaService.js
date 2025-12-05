import api from './api'

export const docgiaService = {
  // Đăng ký độc giả mới (public)
  register(data) {
    return api.post('/docgia/register', data)
  },

  // Đăng nhập độc giả (public)
  login(credentials) {
    return api.post('/docgia/login', credentials)
  },

  // Lấy danh sách độc giả (Admin)
  getAll(params) {
    return api.get('/docgia', { params })
  },

  // Lấy thông tin độc giả theo ID
  getById(id) {
    return api.get(`/docgia/${id}`)
  },

  // Cập nhật thông tin độc giả
  update(id, data) {
    return api.put(`/docgia/${id}`, data)
  },

  // Xóa độc giả (Admin)
  delete(id) {
    return api.delete(`/docgia/${id}`)
  },

  // Lấy thông tin độc giả hiện tại (từ token)
  getProfile() {
    return api.get('/docgia/profile')
  },

  // Cập nhật profile của độc giả hiện tại
  updateProfile(data) {
    return api.put('/docgia/profile', data)
  },

  // Tìm kiếm độc giả
  search(keyword) {
    return api.get('/docgia/search', { params: { keyword } })
  }
}

export default docgiaService
