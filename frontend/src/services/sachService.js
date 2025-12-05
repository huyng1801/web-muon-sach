import api from './api'

export const sachService = {
  // Lấy danh sách sách (public - có phân trang)
  getAll(params) {
    return api.get('/sach', { params })
  },

  // Lấy thông tin sách theo ID
  getById(id) {
    return api.get(`/sach/${id}`)
  },

  // Tạo sách mới (Admin/Thủ thư)
  create(data) {
    return api.post('/sach', data)
  },

  // Cập nhật thông tin sách (Admin/Thủ thư)
  update(id, data) {
    return api.put(`/sach/${id}`, data)
  },

  // Xóa sách (Admin)
  delete(id) {
    return api.delete(`/sach/${id}`)
  },

  // Tìm kiếm sách (public)
  search(keyword) {
    return api.get('/sach/search', { params: { keyword } })
  },

  // Lọc sách theo thể loại
  filterByCategory(category) {
    return api.get('/sach', { params: { TheLoai: category } })
  },

  // Lấy sách có sẵn để mượn
  getAvailableBooks(params) {
    return api.get('/sach/available', { params })
  }
}

export default sachService
