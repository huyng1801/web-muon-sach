const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
  HoTenNV: {
    type: String,
    required: [true, 'Họ tên nhân viên là bắt buộc'],
    trim: true
  },
  Password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
  },
  Chucvu: {
    type: String,
    required: [true, 'Chức vụ là bắt buộc'],
    enum: ['Admin', 'Thủ thư', 'Nhân viên'],
    default: 'Nhân viên'
  },
  DiaChi: {
    type: String,
    trim: true
  },
  SoDienThoai: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'],
    index: true
  },
  NgayThamGia: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
nhanVienSchema.index({ Chucvu: 1 });

module.exports = mongoose.model('NhanVien', nhanVienSchema);
