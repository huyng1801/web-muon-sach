const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
  HoLot: {
    type: String,
    required: [true, 'Họ lót là bắt buộc'],
    trim: true
  },
  Ten: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true
  },
  Email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ'],
    index: true
  },
  Password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
  },
  NgaySinh: {
    type: Date
  },
  Phai: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác']
  },
  DiaChi: {
    type: String,
    required: [true, 'Địa chỉ là bắt buộc']
  },
  DienThoai: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    unique: true,
    match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'],
    index: true
  },
  TrangThai: {
    type: String,
    enum: ['Hoạt động', 'Khóa'],
    default: 'Hoạt động'
  },
  NgayDangKy: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field để ghép họ lót + tên
docGiaSchema.virtual('HoTen').get(function() {
  return `${this.HoLot} ${this.Ten}`.trim();
});

// Index để tìm kiếm nhanh
docGiaSchema.index({ TrangThai: 1 });

module.exports = mongoose.model('DocGia', docGiaSchema);
