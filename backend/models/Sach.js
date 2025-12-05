const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema({
  TenSach: {
    type: String,
    required: [true, 'Tên sách là bắt buộc'],
    trim: true
  },
  ISBN: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true
  },
  DonGia: {
    type: Number,
    required: [true, 'Đơn giá là bắt buộc'],
    min: [0, 'Đơn giá phải lớn hơn hoặc bằng 0']
  },
  SoQuyen: {
    type: Number,
    required: [true, 'Số quyển là bắt buộc'],
    min: [0, 'Số quyển phải lớn hơn hoặc bằng 0'],
    default: 0
  },
  NamXuatBan: {
    type: Number,
    min: [1900, 'Năm xuất bản không hợp lệ'],
    max: [new Date().getFullYear() + 1, 'Năm xuất bản không hợp lệ']
  },
  MaNXB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NhaXuatBan',
    required: [true, 'Nhà xuất bản là bắt buộc']
  },
  NguonGoc_TacGia: {
    type: String,
    trim: true
  },
  NgayThem: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
sachSchema.index({ TenSach: 'text', NguonGoc_TacGia: 'text' });
sachSchema.index({ MaNXB: 1 });
sachSchema.index({ SoQuyen: 1 });

module.exports = mongoose.model('Sach', sachSchema);
