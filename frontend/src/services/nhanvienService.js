import api from './api'

export const nhanvienService = {
  // Đăng nhập nhân viên
  login(credentials) {
    return api.post('/nhanvien/login', credentials)
  },

  // Lấy danh sách nhân viên (Admin)
  getAll(params) {
    return api.get('/nhanvien', { params })
  },

  // Lấy thông tin nhân viên theo ID (Admin)
  getById(id) {
    return api.get(`/nhanvien/${id}`)
  },

  // Tạo nhân viên mới (Admin)
  create(data) {
    return api.post('/nhanvien', data)
  },

  // Cập nhật thông tin nhân viên (Admin)
  update(id, data) {
    return api.put(`/nhanvien/${id}`, data)
  },

  // Xóa nhân viên (Admin)
  delete(id) {
    return api.delete(`/nhanvien/${id}`)
  },

  // Lấy profile nhân viên hiện tại
  getProfile() {
    return api.get('/nhanvien/profile')
  },

  // Cập nhật profile nhân viên hiện tại
  updateProfile(data) {
    return api.put('/nhanvien/profile', data)
  },

  // Đổi mật khẩu
  changePassword(data) {
    return api.put('/nhanvien/change-password', data)
  },

  // Tìm kiếm nhân viên (Admin)
  search(keyword) {
    return api.get('/nhanvien/search', { params: { keyword } })
  }
}

export default nhanvienService
